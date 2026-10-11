import type { DialogueExercise, Lesson, SceneSetting } from "@/types";

/**
 * Colours of the child-mode scene art for each place a scene can happen.
 * One person is drawn in every scene; `body` is the colour of their clothes.
 */
export const SCENE_COLOURS: Record<SceneSetting, { wall: string; floor: string; edge: string; body: string }> = {
  cafe: { wall: "oklch(0.88 0.05 60)", floor: "oklch(0.55 0.08 55)", edge: "oklch(0.45 0.07 50)", body: "var(--color-sky)" },
  park: { wall: "oklch(0.90 0.06 225)", floor: "oklch(0.70 0.14 140)", edge: "oklch(0.60 0.13 140)", body: "var(--color-amber)" },
  classroom: { wall: "oklch(0.93 0.04 95)", floor: "oklch(0.64 0.07 60)", edge: "oklch(0.54 0.06 55)", body: "var(--color-violet)" },
  home: { wall: "oklch(0.91 0.05 30)", floor: "oklch(0.66 0.07 50)", edge: "oklch(0.56 0.06 50)", body: "var(--color-moss)" },
  party: { wall: "oklch(0.91 0.06 320)", floor: "oklch(0.66 0.09 300)", edge: "oklch(0.56 0.09 300)", body: "var(--color-coral)" },
  shop: { wall: "oklch(0.92 0.05 160)", floor: "oklch(0.62 0.06 70)", edge: "oklch(0.52 0.05 70)", body: "var(--color-sky)" },
};

export function lessonScene(lesson: Lesson): DialogueExercise | undefined {
  return lesson.exercises.find((e): e is DialogueExercise => e.type === "DIALOGUE");
}

export function sceneColours(scene: DialogueExercise | undefined) {
  return SCENE_COLOURS[scene?.scene.setting ?? "cafe"];
}

/** Scenes may address the learner by name: `{name}` in a line or a reply. */
export function withName(text: string, name: string | null | undefined): string {
  return text.replaceAll("{name}", name?.trim() || "Ola");
}
