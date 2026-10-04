import type { Exercise, Lesson } from "@/types";

/** Full XP for a clean solve, half after a mistake, none when skipped. */
export function xpForExercise(exercise: Exercise, outcome: { mistakes: number; skipped: boolean }): number {
  if (outcome.skipped) return 0;
  return outcome.mistakes === 0 ? exercise.xp : Math.round(exercise.xp / 2);
}

/** Maximum XP a lesson can give (shown on lesson cards). */
export function lessonMaxXp(lesson: Lesson): number {
  return lesson.exercises.reduce((sum, e) => sum + e.xp, 0) + lesson.completionBonus;
}

/** Steps shown in the progress bar: every exercise plus the summary. */
export function lessonStepCount(lesson: Lesson): number {
  return lesson.exercises.length + 1;
}
