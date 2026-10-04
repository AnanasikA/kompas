import type { Exercise } from "@/types";

/**
 * Contract between the lesson engine and an exercise view.
 * The view owns the interaction; the engine owns results, XP and review.
 */
export interface ExerciseViewProps<E extends Exercise = Exercise> {
  exercise: E;
  /** A wrong attempt. `conceptIds` go to review. */
  onMistake(conceptIds: string[]): void;
  /** The exercise is finished (solved, self-reported or skipped). Call once. */
  onSolved(opts?: { skipped?: boolean; selfReported?: boolean }): void;
  /** Move to the next step. */
  onContinue(): void;
  /** Show XP in feedback (lessons yes, practice no). */
  showXp: boolean;
  /** Label for the continue button on the last step. */
  continueLabel?: string;
}
