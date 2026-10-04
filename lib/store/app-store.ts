"use client";

import { create } from "zustand";
import type { AgeGroup, AppState, Concept, Lesson, OnboardingDraft, PlacementResult, User } from "@/types";
import { getConcept, getCourse, getLesson } from "@/data/curriculum";
import { PLACEMENT_TESTS } from "@/data/placement";
import { appStateRepository, authRepository } from "@/lib/persistence";
import { uid } from "@/lib/utils";
import {
  addSeconds,
  advance,
  closeExercise,
  completeLesson,
  isCurrentSolved,
  isInProgress,
  registerMistake,
  resume,
  startLesson,
} from "@/features/learning/engine/session";
import { bumpActivity, computeStreak } from "@/features/gamification/activity";
import { levelInfo } from "@/features/gamification/levels";
import { scorePlacement, selfAssessedPlacement, targetFor, unitsSkippedByPlacement } from "@/features/onboarding/placement";
import { dueItems, recordMistakes, simpleScheduler } from "@/features/practice/review";
import { buildRound, finishRound, isTopicOpen } from "@/features/practice/rounds";
import { getTopic } from "@/data/topics";
import { cefrIndex } from "@/lib/utils";
import { CEFR_LEVELS } from "@/types";
import { earnedLevel, levelStates } from "@/features/progress/cefr";
import { unitStates } from "@/features/progress/units";
import { nextCefr } from "@/lib/utils";
import { nameFromEmail } from "@/features/onboarding/flow";
import * as authService from "@/features/auth/service";
import type { AuthFailure } from "@/features/auth/service";
import { emptyDraft, initialState } from "./initial";

/**
 * APPLICATION STORE
 *
 * Thin orchestration layer: every action calls pure functions from /features
 * and the result is written through `appStateRepository`. Components never
 * touch storage directly.
 */

interface Actions {
  hydrate(): Promise<void>;

  /* auth */
  signUp(email: string, password: string): Promise<AuthOutcome>;
  signIn(email: string, password: string): Promise<AuthOutcome>;
  /** Ends the session. The account and its progress stay saved. */
  signOut(): Promise<void>;

  /* onboarding */
  updateDraft(patch: Partial<OnboardingDraft>): void;
  startPlacement(): void;
  answerPlacement(optionIndex: number | null): void;
  finishOnboarding(opts: { skipTest: boolean }): void;

  /* lessons */
  beginLesson(lessonId: string, opts?: { restart?: boolean }): void;
  lessonMistake(lessonId: string, conceptIds: string[]): void;
  lessonSolve(lessonId: string, opts?: { skipped?: boolean; selfReported?: boolean }): void;
  lessonAdvance(lessonId: string): void;
  lessonTick(lessonId: string, seconds: number): void;
  finishLesson(lessonId: string): void;
  noteSpeakingAttempt(): void;
  clearReward(): void;

  /* practice */
  startPractice(): void;
  answerPractice(itemId: string, correct: boolean): void;
  nextPractice(): void;
  endPractice(): void;

  /* endless topic rounds */
  startRound(topicId: string): void;
  answerRound(correct: boolean, missedWordIds: string[]): void;
  nextRound(): void;
  endRound(): void;

  /* settings */
  setDailyGoal(minutes: number): void;
  resetProgress(): void;
}

export type AuthOutcome = { ok: true; onboardingCompleted: boolean } | { ok: false; reason: AuthFailure };

export type AppStore = AppState & { hydrated: boolean } & Actions;

const authDeps = { auth: authRepository, states: appStateRepository };

/**
 * A saved document as the app expects it today: fields added after it was
 * written get their defaults, and the streak is recounted after days away.
 */
function refreshed(saved: AppState, now: Date): AppState {
  const state = { ...initialState, ...saved };
  return state.user ? { ...state, user: { ...state.user, streak: computeStreak(state.activity, now) } } : state;
}

function withUserXp(user: User, xp: number, activity: AppState["activity"], now: Date): User {
  const total = user.xp + xp;
  return { ...user, xp: total, level: levelInfo(total).level, streak: computeStreak(activity, now) };
}

/**
 * Moves the learner to the next CEFR level once every unit of the current one
 * is finished. Finishing single lessons never changes the level.
 */
function withCefr(user: User, state: AppState, lessons: AppState["lessons"]): User {
  const course = getCourse(user.ageGroup);
  const skipped = state.placement ? unitsSkippedByPlacement(course, state.placement.level) : state.skippedUnitIds;
  const level = earnedLevel(levelStates(course, unitStates(course, lessons, skipped)), user.currentCEFR);
  return level === user.currentCEFR ? user : { ...user, currentCEFR: level, targetCEFR: nextCefr(level) };
}

function conceptsFor(ageGroup: AgeGroup, ids: string[]): Concept[] {
  const course = getCourse(ageGroup);
  return ids.map((id) => getConcept(course, id)).filter((c): c is Concept => !!c);
}

function lessonFor(state: AppState, lessonId: string): Lesson | undefined {
  return state.user ? getLesson(getCourse(state.user.ageGroup), lessonId) : undefined;
}

function snapshot(store: AppStore): AppState {
  return {
    version: store.version,
    account: store.account,
    user: store.user,
    onboarding: store.onboarding,
    onboardingCompleted: store.onboardingCompleted,
    placement: store.placement,
    lessons: store.lessons,
    skippedUnitIds: store.skippedUnitIds,
    reviews: store.reviews,
    activity: store.activity,
    practice: store.practice,
    wordStats: store.wordStats,
    round: store.round,
    pendingReward: store.pendingReward,
  };
}

export const useAppStore = create<AppStore>()((set, get) => ({
  ...initialState,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const now = new Date();
    const saved = await authService.restoreSession(authDeps, now);
    set(saved ? { ...refreshed(saved, now), hydrated: true } : { hydrated: true });
  },

  async signUp(email, password) {
    const result = await authService.signUp(authDeps, email, password, new Date());
    if (!result.ok) return result;
    set({ ...result.state });
    return { ok: true, onboardingCompleted: false };
  },

  async signIn(email, password) {
    const now = new Date();
    const result = await authService.signIn(authDeps, email, password, now);
    if (!result.ok) return result;
    set({ ...refreshed(result.state, now) });
    return { ok: true, onboardingCompleted: result.state.onboardingCompleted };
  },

  async signOut() {
    await authService.signOut(authDeps);
    set({ ...initialState });
  },

  updateDraft(patch) {
    set((s) => ({ onboarding: { ...s.onboarding, ...patch } }));
  },

  startPlacement() {
    set((s) => ({ onboarding: { ...s.onboarding, placement: { index: 0, answers: [] } } }));
  },

  answerPlacement(optionIndex) {
    const { onboarding } = get();
    if (!onboarding.ageGroup || !onboarding.placement) return;
    const test = PLACEMENT_TESTS[onboarding.ageGroup];
    const question = test.questions[onboarding.placement.index];
    if (!question) return;
    const answer = {
      questionId: question.id,
      skill: question.skill,
      correct: optionIndex == null ? null : optionIndex === question.answer,
    };
    set({
      onboarding: {
        ...onboarding,
        placement: { index: onboarding.placement.index + 1, answers: [...onboarding.placement.answers, answer] },
      },
    });
  },

  finishOnboarding({ skipTest }) {
    const { onboarding, account } = get();
    if (!onboarding.ageGroup || !account) return;
    const now = new Date();
    const test = PLACEMENT_TESTS[onboarding.ageGroup];
    const placement: PlacementResult =
      skipTest || !onboarding.placement
        ? selfAssessedPlacement(test, onboarding.selfLevel, now)
        : scorePlacement(test, onboarding.placement.answers, now);
    const course = getCourse(onboarding.ageGroup);
    const isChild = onboarding.ageGroup === "CHILD";
    const user: User = {
      id: uid("usr"),
      name: onboarding.name.trim() || (isChild ? "Odkrywca" : nameFromEmail(account.email)),
      email: isChild ? null : account.email,
      ageGroup: onboarding.ageGroup,
      role: "LEARNER",
      age: onboarding.age,
      currentCEFR: placement.level,
      targetCEFR: targetFor(placement.level),
      xp: 0,
      level: 1,
      streak: 0,
      dailyGoal: onboarding.dailyGoal,
      learningGoal: onboarding.goals,
      focusSkills: onboarding.focus,
      avatarColor: 1,
      createdAt: now.toISOString(),
    };
    set({
      // A parent signs up, the child learns: the account becomes a PARENT account.
      account: { ...account, role: isChild ? "PARENT" : "LEARNER" },
      user,
      placement,
      skippedUnitIds: unitsSkippedByPlacement(course, placement.level),
      onboarding: { ...onboarding, placement: null },
      onboardingCompleted: true,
    });
  },

  beginLesson(lessonId, opts = {}) {
    const state = get();
    const lesson = lessonFor(state, lessonId);
    if (!lesson) return;
    const existing = state.lessons[lessonId];
    const now = new Date();
    let progress = existing;
    if (!existing || opts.restart || (existing.lessonCompleted && !isInProgress(existing))) {
      progress = startLesson(lesson, existing, now);
    } else {
      progress = resume(existing, lesson);
    }
    set({ lessons: { ...state.lessons, [lessonId]: progress } });
  },

  lessonMistake(lessonId, conceptIds) {
    const state = get();
    const lesson = lessonFor(state, lessonId);
    const progress = state.lessons[lessonId];
    if (!lesson || !progress || !state.user) return;
    const now = new Date();
    set({
      lessons: { ...state.lessons, [lessonId]: registerMistake(progress, conceptIds) },
      reviews: recordMistakes(state.reviews, conceptsFor(state.user.ageGroup, conceptIds), lesson, now),
    });
  },

  lessonSolve(lessonId, opts = {}) {
    const state = get();
    const lesson = lessonFor(state, lessonId);
    const progress = state.lessons[lessonId];
    if (!lesson || !progress || !state.user || isCurrentSolved(progress, lesson)) return;
    const now = new Date();
    const next = closeExercise(progress, lesson, now, opts);
    const gained = next.xpEarned - progress.xpEarned;
    // First run awards XP as you go; replays only pay out an improved total at the end.
    const live = progress.completions === 0 ? gained : 0;
    const activity = bumpActivity(state.activity, now, { xp: live });
    set({
      lessons: { ...state.lessons, [lessonId]: next },
      activity,
      user: withUserXp(state.user, live, activity, now),
    });
  },

  lessonAdvance(lessonId) {
    const state = get();
    const lesson = lessonFor(state, lessonId);
    const progress = state.lessons[lessonId];
    if (!lesson || !progress) return;
    set({ lessons: { ...state.lessons, [lessonId]: advance(progress, lesson) } });
  },

  lessonTick(lessonId, seconds) {
    const state = get();
    const progress = state.lessons[lessonId];
    if (!progress || !state.user || progress.lessonCompleted) return;
    const now = new Date();
    const activity = bumpActivity(state.activity, now, { seconds });
    set({
      lessons: { ...state.lessons, [lessonId]: addSeconds(progress, seconds) },
      activity,
      user: { ...state.user, streak: computeStreak(activity, now) },
    });
  },

  finishLesson(lessonId) {
    const state = get();
    const lesson = lessonFor(state, lessonId);
    const progress = state.lessons[lessonId];
    if (!lesson || !progress || !state.user || progress.lessonCompleted) return;
    const now = new Date();
    const firstRun = progress.completions === 0;
    const completion = completeLesson(progress, lesson, now);
    const awarded = firstRun ? lesson.completionBonus : completion.xpAwarded;
    const activity = bumpActivity(state.activity, now, { xp: awarded, lessonsCompleted: 1 });
    const lessons = { ...state.lessons, [lessonId]: completion.progress };
    const user = withCefr(withUserXp(state.user, awarded, activity, now), state, lessons);
    const levelBefore = levelInfo(user.xp - (firstRun ? completion.progress.xpEarned : awarded)).level;
    set({
      lessons,
      activity,
      user,
      pendingReward: user.level > levelBefore ? { lessonId, fromLevel: levelBefore, toLevel: user.level } : null,
    });
  },

  noteSpeakingAttempt() {
    const state = get();
    set({ activity: bumpActivity(state.activity, new Date(), { speakingAttempts: 1 }) });
  },

  clearReward() {
    set({ pendingReward: null });
  },

  startPractice() {
    const state = get();
    const due = dueItems(state.reviews, new Date());
    if (due.length === 0) return;
    set({
      practice: { itemIds: due.slice(0, 8).map((r) => r.id), index: 0, results: [], startedAt: new Date().toISOString() },
    });
  },

  answerPractice(itemId, correct) {
    const state = get();
    if (!state.practice || !state.user) return;
    if (state.practice.results.some((r) => r.itemId === itemId)) return;
    const now = new Date();
    const activity = bumpActivity(state.activity, now, { reviewsDone: 1 });
    set({
      reviews: state.reviews.map((r) => (r.id === itemId ? simpleScheduler.onReview(r, correct, now) : r)),
      practice: { ...state.practice, results: [...state.practice.results, { itemId, correct }] },
      activity,
      user: { ...state.user, streak: computeStreak(activity, now) },
    });
  },

  nextPractice() {
    const state = get();
    if (!state.practice) return;
    set({ practice: { ...state.practice, index: state.practice.index + 1 } });
  },

  endPractice() {
    set({ practice: null });
  },

  startRound(topicId) {
    const state = get();
    const topic = getTopic(topicId);
    if (!topic || !state.user) return;
    // Rounds follow the learner's level; a topic that starts higher opens at its first level.
    const level = CEFR_LEVELS.find((l) => cefrIndex(l) >= cefrIndex(state.user!.currentCEFR) && isTopicOpen(topic, l));
    if (!level) return;
    const steps = buildRound(topic, level, state.wordStats, {
      seed: Date.now() % 2147483647,
      language: state.user.ageGroup === "CHILD" ? "pl" : "en",
      audio: typeof window !== "undefined" && "speechSynthesis" in window,
    });
    if (steps.length === 0) return;
    set({ round: { topicId, level, steps, index: 0, results: [], startedAt: new Date().toISOString(), summary: null } });
  },

  answerRound(correct, missedWordIds) {
    const round = get().round;
    if (!round || round.summary || round.results.length > round.index) return;
    set({ round: { ...round, results: [...round.results, { correct, missed: missedWordIds }] } });
  },

  nextRound() {
    const state = get();
    const round = state.round;
    if (!round || round.summary || !state.user) return;
    const index = round.index + 1;
    if (index < round.steps.length) {
      set({ round: { ...round, index } });
      return;
    }
    const now = new Date();
    const { stats, summary } = finishRound(round, state.wordStats, now);
    // Time in a round counts towards the daily goal, within reason.
    const seconds = Math.min(300, Math.max(0, Math.round((now.getTime() - new Date(round.startedAt).getTime()) / 1000)));
    const activity = bumpActivity(state.activity, now, { xp: summary.xp, seconds });
    set({
      round: { ...round, index, summary },
      wordStats: stats,
      activity,
      user: withUserXp(state.user, summary.xp, activity, now),
    });
  },

  endRound() {
    set({ round: null });
  },

  setDailyGoal(minutes) {
    const user = get().user;
    if (user) set({ user: { ...user, dailyGoal: minutes } });
  },

  resetProgress() {
    const state = get();
    if (!state.user) return;
    set({
      lessons: {},
      reviews: [],
      activity: {},
      practice: null,
      wordStats: {},
      round: null,
      pendingReward: null,
      user: { ...state.user, xp: 0, level: 1, streak: 0 },
    });
  },
}));

// Persist every change of the signed-in account. Signed out, there is nothing to save,
// so signing out can never overwrite an account's progress.
if (typeof window !== "undefined") {
  useAppStore.subscribe((state) => {
    if (state.hydrated && state.account) void appStateRepository.save(state.account.id, snapshot(state));
  });
}

export { emptyDraft };
