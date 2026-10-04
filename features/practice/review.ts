import type { Concept, Lesson, ReviewItem } from "@/types";
import { addDays, uid } from "@/lib/utils";

/**
 * REVIEW (MVP)
 * Every wrong answer creates or updates a ReviewItem. Scheduling is a small
 * four-state model: new → learning → mastered, with `weak` for repeated
 * mistakes. All timing decisions live in a `ReviewScheduler`, so a real
 * spaced-repetition algorithm can replace `simpleScheduler` later.
 */

export interface ReviewScheduler {
  /** A mistake happened on this concept (in a lesson or in practice). */
  onMistake(existing: ReviewItem | undefined, concept: Concept, lesson: Pick<Lesson, "id" | "title">, now: Date): ReviewItem;
  /** The learner answered a practice check for this item. */
  onReview(item: ReviewItem, correct: boolean, now: Date): ReviewItem;
}

const MASTERED_AFTER = 2;

export const simpleScheduler: ReviewScheduler = {
  onMistake(existing, concept, lesson, now) {
    if (!existing) {
      return {
        id: uid("rev"),
        conceptId: concept.id,
        concept: concept.label,
        skill: concept.skill,
        sourceLesson: lesson.id,
        sourceLessonTitle: lesson.title,
        mistakes: 1,
        streak: 0,
        status: "new",
        createdAt: now.toISOString(),
        lastReviewed: null,
        nextReview: now.toISOString(),
      };
    }
    return {
      ...existing,
      concept: concept.label,
      mistakes: existing.mistakes + 1,
      streak: 0,
      status: "weak",
      nextReview: now.toISOString(),
    };
  },

  onReview(item, correct, now) {
    if (!correct) {
      return { ...item, mistakes: item.mistakes + 1, streak: 0, status: "weak", lastReviewed: now.toISOString(), nextReview: now.toISOString() };
    }
    const streak = item.streak + 1;
    const mastered = streak >= MASTERED_AFTER;
    return {
      ...item,
      streak,
      status: mastered ? "mastered" : "learning",
      lastReviewed: now.toISOString(),
      nextReview: addDays(now, mastered ? 7 : 1).toISOString(),
    };
  },
};

export function recordMistakes(
  reviews: ReviewItem[],
  concepts: Concept[],
  lesson: Pick<Lesson, "id" | "title">,
  now: Date,
  scheduler: ReviewScheduler = simpleScheduler,
): ReviewItem[] {
  let next = reviews;
  for (const concept of concepts) {
    const existing = next.find((r) => r.conceptId === concept.id);
    const updated = scheduler.onMistake(existing, concept, lesson, now);
    next = existing ? next.map((r) => (r.id === existing.id ? updated : r)) : [...next, updated];
  }
  return next;
}

export function isDue(item: ReviewItem, now: Date): boolean {
  return new Date(item.nextReview).getTime() <= now.getTime();
}

/** Due items, hardest first. */
export function dueItems(reviews: ReviewItem[], now: Date): ReviewItem[] {
  const weight: Record<ReviewItem["status"], number> = { weak: 0, new: 1, learning: 2, mastered: 3 };
  return reviews
    .filter((r) => isDue(r, now))
    .sort((a, b) => weight[a.status] - weight[b.status] || b.mistakes - a.mistakes);
}

export function countByStatus(reviews: ReviewItem[]): Record<ReviewItem["status"], number> {
  const counts = { new: 0, learning: 0, weak: 0, mastered: 0 };
  for (const r of reviews) counts[r.status] += 1;
  return counts;
}

/** Human label for when an item comes back. */
export function nextReviewLabel(item: ReviewItem, now: Date, lang: "pl" | "en" = "pl"): string {
  const days = Math.ceil((new Date(item.nextReview).getTime() - now.getTime()) / 86_400_000);
  if (days <= 0) return lang === "pl" ? "dziś" : "today";
  if (days === 1) return lang === "pl" ? "jutro" : "tomorrow";
  return lang === "pl" ? `za ${days} dni` : `in ${days}d`;
}
