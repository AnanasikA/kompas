import type { Course, Lesson, LessonProgress, Unit, UnitLesson } from "@/types";
import { isPlayable, lessonWords } from "@/types";
import { isInProgress } from "@/features/learning/engine/session";

export type UnitStatus = "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";
export type LessonStatus = "PLANNED" | "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";

export interface LessonState {
  lesson: UnitLesson;
  status: LessonStatus;
  progress?: LessonProgress;
}

export interface UnitState {
  unit: Unit;
  status: UnitStatus;
  /** The unit is in the syllabus but has no published lessons yet. */
  comingSoon: boolean;
  /** Every published lesson is done; the rest of the unit is not written yet. */
  awaitingContent: boolean;
  /** Completed because the placement test put the learner above this unit. */
  skipped: boolean;
  /** Every step of the unit, written or planned. */
  totalLessons: number;
  publishedLessons: number;
  completedLessons: number;
  /** 0–100 of the whole unit; a half-done lesson counts in proportion. */
  percent: number;
  words: { learned: number; target: number };
  lessons: LessonState[];
  /** Unit that has to be finished first, when locked. */
  blockedBy?: Unit;
}

type ProgressMap = Record<string, LessonProgress>;

function lessonStates(unit: Unit, progress: ProgressMap, unitOpen: boolean): LessonState[] {
  let previousPlayableDone = true;
  return unit.lessons.map((lesson) => {
    if (!isPlayable(lesson)) return { lesson, status: "PLANNED" as const };
    const p = progress[lesson.id];
    const done = !!p && (p.lessonCompleted || p.completions > 0);
    let status: LessonStatus;
    if (done && !isInProgress(p)) status = "COMPLETED";
    else if (!unitOpen || !previousPlayableDone) status = "LOCKED";
    else if (isInProgress(p)) status = "IN_PROGRESS";
    else status = done ? "COMPLETED" : "AVAILABLE";
    previousPlayableDone = previousPlayableDone && done;
    return { lesson, status, progress: p };
  });
}

const isDone = (p: LessonProgress | undefined): p is LessonProgress => !!p && (p.lessonCompleted || p.completions > 0);

/** Share of the whole unit that is done, counting planned lessons as not done. */
function unitPercent(unit: Unit, progress: ProgressMap): number {
  if (unit.lessons.length === 0) return 0;
  const done = unit.lessons.reduce((sum, l) => {
    if (!isPlayable(l)) return sum;
    const p = progress[l.id];
    if (!p) return sum;
    if (isDone(p) && !isInProgress(p)) return sum + 1;
    return sum + Math.min(p.exerciseResults.length, l.exercises.length) / Math.max(1, l.exercises.length);
  }, 0);
  return Math.round((done / unit.lessons.length) * 100);
}

/**
 * Journey state for every unit of a course.
 *
 * A unit is COMPLETED only when every one of its steps is done, planned ones
 * included, or when the placement test put the learner above it. Finishing
 * the lessons that happen to be written does not finish the unit.
 *
 * Unlock rule: a unit opens when every earlier unit has no playable lesson
 * left to do. Units that are still waiting for content never block the path.
 */
export function unitStates(course: Course, progress: ProgressMap, skippedUnitIds: string[]): UnitState[] {
  let blocker: Unit | undefined;
  return course.units.map((unit) => {
    const playable = unit.lessons.filter(isPlayable);
    const skipped = skippedUnitIds.includes(unit.id);
    const completed = unit.lessons.filter((l) => isDone(progress[l.id]));
    const completedPlayable = playable.filter((l) => isDone(progress[l.id])).length;
    const comingSoon = playable.length === 0;
    const playableLeft = completedPlayable < playable.length;
    const allDone = unit.lessons.length > 0 && completed.length === unit.lessons.length;
    const started = playable.some((l) => !!progress[l.id]);
    const open = !blocker;
    const target = unit.words;

    let status: UnitStatus;
    if (skipped || allDone) status = "COMPLETED";
    else if (!open) status = "LOCKED";
    else if (started) status = "IN_PROGRESS";
    else status = "AVAILABLE";

    const state: UnitState = {
      unit,
      status,
      comingSoon: comingSoon && !skipped,
      awaitingContent: !skipped && !allDone && !comingSoon && !playableLeft,
      skipped,
      totalLessons: unit.lessons.length,
      publishedLessons: playable.length,
      completedLessons: skipped ? unit.lessons.length : completed.length,
      percent: skipped ? 100 : unitPercent(unit, progress),
      words: { learned: skipped ? target : completed.reduce((sum, l) => sum + lessonWords(l), 0), target },
      lessons: lessonStates(unit, progress, open && !skipped),
      blockedBy: status === "LOCKED" ? blocker : undefined,
    };

    if (!blocker && !skipped && playableLeft) blocker = unit;
    return state;
  });
}

/** Lesson the "Continue" button should open: unfinished first, then the next available one. */
export function nextLesson(states: UnitState[]): { unit: UnitState; lesson: LessonState & { lesson: Lesson } } | null {
  type Playable = LessonState & { lesson: Lesson };
  const all = states.flatMap((unit) =>
    unit.lessons.filter((l): l is Playable => isPlayable(l.lesson)).map((lesson) => ({ unit, lesson })),
  );
  return all.find((x) => x.lesson.status === "IN_PROGRESS") ?? all.find((x) => x.lesson.status === "AVAILABLE") ?? null;
}

/** Most recently completed lesson. */
export function lastCompleted(course: Course, progress: ProgressMap): { lesson: Lesson; progress: LessonProgress } | null {
  let best: { lesson: Lesson; progress: LessonProgress } | null = null;
  for (const unit of course.units) {
    for (const lesson of unit.lessons) {
      if (!isPlayable(lesson)) continue;
      const p = progress[lesson.id];
      if (!p?.completedAt) continue;
      if (!best || (best.progress.completedAt as string) < p.completedAt) best = { lesson, progress: p };
    }
  }
  return best;
}

/**
 * The unit the learner is in: the one with a lesson to play now, otherwise
 * the furthest one they have worked in, otherwise the first one after the
 * units the placement test covered.
 */
export function currentUnit(states: UnitState[]): UnitState | undefined {
  const playableNow = (s: UnitState) => s.lessons.some((l) => l.status === "IN_PROGRESS" || l.status === "AVAILABLE");
  return (
    states.find((s) => s.status !== "LOCKED" && !s.skipped && playableNow(s)) ??
    [...states].reverse().find((s) => !s.skipped && s.completedLessons > 0) ??
    states.find((s) => !s.skipped) ??
    states[states.length - 1]
  );
}
