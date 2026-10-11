import type { DialogueExercise, Lesson } from "@/types";

export function lessonScene(lesson: Lesson): DialogueExercise | undefined {
  return lesson.exercises.find((e): e is DialogueExercise => e.type === "DIALOGUE");
}

/** Scenes may address the learner by name: `{name}` in a line or a reply. */
export function withName(text: string, name: string | null | undefined): string {
  return text.replaceAll("{name}", name?.trim() || "Ola");
}
