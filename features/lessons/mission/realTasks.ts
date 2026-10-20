import type { Course, Lesson, RealTaskExercise, RealTaskRecord, Unit } from "@/types";
import { isPlayable } from "@/types";

export interface RealTaskEntry {
  task: RealTaskExercise;
  lesson: Lesson;
  unit: Unit;
  record?: RealTaskRecord;
  state: "ahead" | "open" | "waiting" | "stamped";
}

/** Every real-life mission of a course, in path order, with where the child is with it. */
export function realTasksOf(course: Course, records: Record<string, RealTaskRecord> | undefined): RealTaskEntry[] {
  return course.units.flatMap((unit) =>
    unit.lessons.filter(isPlayable).flatMap((lesson) =>
      lesson.exercises
        .filter((e): e is RealTaskExercise => e.type === "REAL_TASK")
        .map((task) => {
          const record = records?.[task.id];
          const state = record?.confirmedAt ? "stamped" : record?.doneAt ? "waiting" : record ? "open" : "ahead";
          return { task, lesson, unit, record, state } as RealTaskEntry;
        }),
    ),
  );
}
