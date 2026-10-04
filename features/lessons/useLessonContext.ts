"use client";

import { getLesson, getUnit } from "@/data/curriculum";
import { useLearner } from "@/features/progress/useLearner";
import { isPlayable } from "@/types";

/** Lesson + its unit + the learner's state for it. */
export function useLessonContext(lessonId: string) {
  const learner = useLearner();
  const lesson = getLesson(learner.course, lessonId);
  const unit = lesson ? getUnit(learner.course, lesson.unitId) : undefined;
  const unitState = learner.units.find((u) => u.unit.id === lesson?.unitId);
  const lessonState = unitState?.lessons.find((l) => l.lesson.id === lessonId);
  const index = unit?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const following = index >= 0 ? unit?.lessons[index + 1] : undefined;
  const followingPlayable = unit?.lessons.slice(index + 1).find(isPlayable);
  return {
    ...learner,
    lesson,
    unit,
    unitState,
    lessonState,
    progress: learner.lessons[lessonId],
    /** Next lesson in the syllabus (may still be in preparation). */
    following,
    /** Next lesson that can actually be played. */
    followingPlayable,
  };
}
