import type { ExerciseResult, Lesson, LessonProgress } from "@/types";
import { xpForExercise } from "./xp";

/**
 * LESSON SESSION
 * Pure transitions over `LessonProgress`. The store persists the result of
 * every transition, so a refresh resumes exactly where the learner stopped.
 */

export function startLesson(lesson: Lesson, previous: LessonProgress | undefined, now: Date): LessonProgress {
  return {
    lessonId: lesson.id,
    unitId: lesson.unitId,
    currentIndex: 0,
    pendingMistakes: 0,
    pendingConcepts: [],
    exerciseResults: [],
    xpEarned: 0,
    accuracy: null,
    lessonCompleted: false,
    startedAt: now.toISOString(),
    completedAt: null,
    secondsSpent: 0,
    completions: previous?.completions ?? 0,
    best: previous?.best ?? null,
  };
}

export function isInProgress(progress: LessonProgress | undefined): boolean {
  if (!progress) return false;
  return !progress.lessonCompleted && (progress.currentIndex > 0 || progress.exerciseResults.length > 0 || progress.pendingMistakes > 0);
}

export function currentExercise(progress: LessonProgress, lesson: Lesson) {
  return lesson.exercises[progress.currentIndex];
}

export function isCurrentSolved(progress: LessonProgress, lesson: Lesson): boolean {
  const exercise = currentExercise(progress, lesson);
  return !!exercise && progress.exerciseResults.some((r) => r.exerciseId === exercise.id);
}

/**
 * After a refresh the solved-but-not-continued exercise has lost its on-screen
 * state, so we move on to the next one instead of asking it again.
 */
export function resume(progress: LessonProgress, lesson: Lesson): LessonProgress {
  return isCurrentSolved(progress, lesson) ? advance(progress, lesson) : progress;
}

export function registerMistake(progress: LessonProgress, conceptIds: string[]): LessonProgress {
  return {
    ...progress,
    pendingMistakes: progress.pendingMistakes + 1,
    pendingConcepts: [...new Set([...progress.pendingConcepts, ...conceptIds])],
  };
}

interface CloseOptions {
  skipped?: boolean;
  selfReported?: boolean;
}

/** Records the result of the current exercise. Does not move to the next one. */
export function closeExercise(progress: LessonProgress, lesson: Lesson, now: Date, opts: CloseOptions = {}): LessonProgress {
  const exercise = currentExercise(progress, lesson);
  if (!exercise || isCurrentSolved(progress, lesson)) return progress;
  const skipped = !!opts.skipped;
  const result: ExerciseResult = {
    exerciseId: exercise.id,
    type: exercise.type,
    mistakes: progress.pendingMistakes,
    correctFirstTry: !skipped && progress.pendingMistakes === 0,
    skipped,
    selfReported: !!opts.selfReported,
    xpEarned: xpForExercise(exercise, { mistakes: progress.pendingMistakes, skipped }),
    conceptsMissed: progress.pendingConcepts,
    completedAt: now.toISOString(),
  };
  return {
    ...progress,
    exerciseResults: [...progress.exerciseResults, result],
    xpEarned: progress.xpEarned + result.xpEarned,
    pendingMistakes: 0,
    pendingConcepts: [],
  };
}

export function advance(progress: LessonProgress, lesson: Lesson): LessonProgress {
  return { ...progress, currentIndex: Math.min(progress.currentIndex + 1, lesson.exercises.length), pendingMistakes: 0, pendingConcepts: [] };
}

export function addSeconds(progress: LessonProgress, seconds: number): LessonProgress {
  return { ...progress, secondsSpent: progress.secondsSpent + seconds };
}

export function isReadyToFinish(progress: LessonProgress, lesson: Lesson): boolean {
  return progress.currentIndex >= lesson.exercises.length && !progress.lessonCompleted;
}

/** Share of non-skipped exercises solved on the first try, 0–100. */
export function computeAccuracy(results: ExerciseResult[]): number {
  const counted = results.filter((r) => !r.skipped);
  if (counted.length === 0) return 0;
  return Math.round((counted.filter((r) => r.correctFirstTry).length / counted.length) * 100);
}

export interface LessonCompletion {
  progress: LessonProgress;
  /** XP to add to the learner: full on first completion, only the improvement on replays. */
  xpAwarded: number;
}

export function completeLesson(progress: LessonProgress, lesson: Lesson, now: Date): LessonCompletion {
  if (progress.lessonCompleted) return { progress, xpAwarded: 0 };
  const xpEarned = progress.xpEarned + lesson.completionBonus;
  const accuracy = computeAccuracy(progress.exerciseResults);
  const previousBest = progress.best?.xpEarned ?? 0;
  const xpAwarded = Math.max(0, xpEarned - previousBest);
  return {
    xpAwarded,
    progress: {
      ...progress,
      xpEarned,
      accuracy,
      lessonCompleted: true,
      completedAt: now.toISOString(),
      completions: progress.completions + 1,
      best: {
        accuracy: Math.max(accuracy, progress.best?.accuracy ?? 0),
        xpEarned: Math.max(xpEarned, previousBest),
      },
    },
  };
}

/** Concepts missed anywhere in the lesson, most recent last, without duplicates. */
export function missedConcepts(progress: LessonProgress): string[] {
  return [...new Set(progress.exerciseResults.flatMap((r) => r.conceptsMissed))];
}
