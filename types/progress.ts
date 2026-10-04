import type { Exercise, ExerciseType } from "./curriculum";
import type { Account, CEFRLevel, Skill, User } from "./user";

export interface ExerciseResult {
  exerciseId: string;
  type: ExerciseType;
  /** Wrong attempts before the exercise was solved. */
  mistakes: number;
  correctFirstTry: boolean;
  skipped: boolean;
  /** For speaking: the learner confirmed it themselves, nothing was checked. */
  selfReported: boolean;
  xpEarned: number;
  conceptsMissed: string[];
  completedAt: string;
}

export interface LessonProgress {
  lessonId: string;
  unitId: string;
  /** Index of the exercise the learner is on. `exercises.length` = summary. */
  currentIndex: number;
  /** Mistakes made on the current, not yet solved exercise. */
  pendingMistakes: number;
  pendingConcepts: string[];
  exerciseResults: ExerciseResult[];
  xpEarned: number;
  /** Share of exercises solved on the first try, 0–100. Set on completion. */
  accuracy: number | null;
  lessonCompleted: boolean;
  startedAt: string;
  completedAt: string | null;
  /** Active seconds spent in the lesson. */
  secondsSpent: number;
  /** How many times the lesson has been finished (replays). */
  completions: number;
  /** Best result so far, kept across replays. */
  best: { accuracy: number; xpEarned: number } | null;
}

export type ReviewStatus = "new" | "learning" | "weak" | "mastered";

export interface ReviewItem {
  id: string;
  conceptId: string;
  /** Denormalised label so Practice still reads well if content changes. */
  concept: string;
  skill: Skill;
  sourceLesson: string;
  sourceLessonTitle: string;
  mistakes: number;
  /** Correct answers in a row during Practice. */
  streak: number;
  status: ReviewStatus;
  createdAt: string;
  lastReviewed: string | null;
  nextReview: string;
}

export interface DailyActivity {
  /** Local date, YYYY-MM-DD. */
  date: string;
  seconds: number;
  xp: number;
  lessonsCompleted: number;
  speakingAttempts: number;
  reviewsDone: number;
}

export interface PlacementResult {
  score: number;
  total: number;
  level: CEFRLevel;
  /** Per-question outcome, in order. */
  answers: { questionId: string; skill: Skill; correct: boolean | null }[];
  /** True when the learner skipped the test and used self-assessment. */
  selfAssessed: boolean;
  completedAt: string;
}

export interface OnboardingDraft {
  who: "me" | "child" | null;
  ageGroup: User["ageGroup"] | null;
  name: string;
  age: number | null;
  goals: string[];
  focus: string[];
  selfLevel: number | null;
  dailyGoal: number;
  /** Placement test in progress. */
  placement: { index: number; answers: PlacementResult["answers"] } | null;
}

export interface PracticeSession {
  itemIds: string[];
  index: number;
  results: { itemId: string; correct: boolean }[];
  startedAt: string;
}

/** How well the learner knows one word of the topic bank. */
export interface WordStat {
  seen: number;
  correct: number;
  /** Correct rounds in a row. Two in a row = mastered. */
  streak: number;
  last: string;
}

/** One generated practice round on a topic. Rounds never run out. */
export interface TopicRound {
  topicId: string;
  level: CEFRLevel;
  steps: { exercise: Exercise; wordIds: string[] }[];
  index: number;
  /** One entry per finished step. */
  results: { correct: boolean; missed: string[] }[];
  startedAt: string;
  /** Set when the last step is done. */
  summary: { xp: number; correctWords: number; totalWords: number; newlyMastered: number } | null;
}

/** Everything that is persisted. One document per learner. */
export interface AppState {
  version: number;
  account: Account | null;
  user: User | null;
  onboarding: OnboardingDraft;
  onboardingCompleted: boolean;
  placement: PlacementResult | null;
  lessons: Record<string, LessonProgress>;
  /** Units the placement test let the learner skip. */
  skippedUnitIds: string[];
  reviews: ReviewItem[];
  activity: Record<string, DailyActivity>;
  practice: PracticeSession | null;
  /** Word knowledge from topic rounds, by word id (data/topics). */
  wordStats: Record<string, WordStat>;
  round: TopicRound | null;
  /** Lesson to show the level-up screen for, set when a lesson raised the level. */
  pendingReward: { lessonId: string; fromLevel: number; toLevel: number } | null;
}
