import type { AgeGroup, Concept, Course, Lesson, Unit } from "@/types";
import { isPlayable } from "@/types";
import { adultCourse } from "./adult";
import { childCourse } from "./child";
import { teenCourse } from "./teen";

/**
 * Content registry. The application only reads curriculum through these
 * functions, so the source can later become a CMS or database call.
 */
export const COURSES: Record<AgeGroup, Course> = {
  CHILD: childCourse,
  TEEN: teenCourse,
  ADULT: adultCourse,
};

export function getCourse(ageGroup: AgeGroup): Course {
  return COURSES[ageGroup];
}

export function getUnit(course: Course, unitId: string): Unit | undefined {
  return course.units.find((u) => u.id === unitId);
}

export function getLesson(course: Course, lessonId: string): Lesson | undefined {
  for (const unit of course.units) {
    for (const lesson of unit.lessons) {
      if (lesson.id === lessonId && isPlayable(lesson)) return lesson;
    }
  }
  return undefined;
}

export function getConcept(course: Course, conceptId: string): Concept | undefined {
  return course.concepts[conceptId];
}

export function playableLessons(unit: Unit): Lesson[] {
  return unit.lessons.filter(isPlayable);
}
