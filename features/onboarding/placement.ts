import type { CEFRLevel, Course, PlacementResult } from "@/types";
import { isPlayable } from "@/types";
import type { PlacementTest } from "@/data/placement";
import { cefrIndex, nextCefr } from "@/lib/utils";

export function scorePlacement(test: PlacementTest, answers: PlacementResult["answers"], now: Date): PlacementResult {
  const score = answers.filter((a) => a.correct === true).length;
  return {
    score,
    total: test.questions.length,
    level: test.bands[Math.min(score, test.bands.length - 1)],
    answers,
    selfAssessed: false,
    completedAt: now.toISOString(),
  };
}

export function selfAssessedPlacement(test: PlacementTest, selfLevel: number | null, now: Date): PlacementResult {
  const index = selfLevel == null ? 0 : Math.min(selfLevel, test.selfAssessment.length - 1);
  return {
    score: 0,
    total: test.questions.length,
    level: test.selfAssessment[index],
    answers: [],
    selfAssessed: true,
    completedAt: now.toISOString(),
  };
}

/** Estimate shown while the test is running (adult mode). */
export function runningEstimate(test: PlacementTest, answers: PlacementResult["answers"]): CEFRLevel {
  const score = answers.filter((a) => a.correct === true).length;
  return test.bands[Math.min(score, test.bands.length - 1)];
}

/**
 * Units below the learner's level are skipped: the placement test covered them.
 *
 * While the curriculum is still being written, a level may have no published
 * lessons at all. In that case the learner starts at the most advanced unit
 * that does have lessons, instead of landing on an empty path.
 */
export function unitsSkippedByPlacement(course: Course, level: CEFRLevel): string[] {
  const hasLessons = (unit: Course["units"][number]) => unit.lessons.some(isPlayable);
  const below = course.units.filter((u) => cefrIndex(u.level) < cefrIndex(level));
  const publishedAtLevel = course.units.some((u) => cefrIndex(u.level) >= cefrIndex(level) && hasLessons(u));
  if (publishedAtLevel) return below.map((u) => u.id);
  const lastWithLessons = [...course.units].reverse().find(hasLessons);
  return below.filter((u) => !lastWithLessons || u.order < lastWithLessons.order).map((u) => u.id);
}

export function targetFor(level: CEFRLevel): CEFRLevel {
  return nextCefr(level);
}
