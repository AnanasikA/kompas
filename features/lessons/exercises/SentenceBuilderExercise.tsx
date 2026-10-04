"use client";

import { UndoGlyph } from "@/components/ui/icons";
import { useState } from "react";
import { evaluateSentence } from "@/features/learning/engine/evaluate";
import { xpForExercise } from "@/features/learning/engine/xp";
import { useAge } from "@/features/theme/AgeScope";
import { useSkin } from "@/features/theme/useSkin";
import { cx } from "@/lib/utils";
import type { SentenceBuilderExercise as SentenceEx } from "@/types";
import { Feedback } from "./Feedback";
import type { ExerciseViewProps } from "./types";

type Phase = "building" | "correct" | "almost";

/** Tap words in order to build a sentence. Tap a placed word to take it back. */
export function SentenceBuilderExercise({ exercise, onMistake, onSolved, onContinue, showXp }: ExerciseViewProps<SentenceEx>) {
  const age = useAge();
  const skin = useSkin();
  // Indices into `exercise.tokens`, so repeated words stay distinct.
  const [placed, setPlaced] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("building");
  const [hint, setHint] = useState<string | undefined>();
  const [mistakes, setMistakes] = useState(0);
  const building = phase === "building";

  function check() {
    if (placed.length === 0) return;
    const result = evaluateSentence(exercise, placed.map((i) => exercise.tokens[i]));
    if (result.correct) {
      setPhase("correct");
      onSolved();
    } else {
      setMistakes((m) => m + 1);
      setHint(result.hint);
      setPhase("almost");
      onMistake([result.conceptId]);
    }
  }

  const reset = () => {
    setPlaced([]);
    setHint(undefined);
    setPhase("building");
  };

  const answerToken = {
    CHILD: "animate-kfade rounded-[14px] bg-ink px-[18px] py-3 font-display text-xl font-extrabold text-on-ink shadow-[0_4px_0_var(--color-ink-deep)]",
    TEEN: "animate-kfade rounded-md bg-lime px-4 py-3 text-lg font-bold text-night",
    ADULT: "animate-kfade rounded-md bg-ink px-4 py-2.5 text-[17px] text-canvas",
  }[age];
  const bankToken = (used: boolean) =>
    ({
      CHILD: cx(
        "rounded-[14px] px-5 py-3.5 font-display text-xl font-extrabold transition-transform active:translate-y-[3px]",
        used ? "bg-[oklch(0.92_0.01_85)] text-transparent" : "bg-card shadow-[0_4px_0_var(--color-line-strong),inset_0_0_0_2px_var(--color-line-strong)]",
      ),
      TEEN: cx("rounded-md bg-[oklch(0.24_0.025_275)] px-4 py-3 text-lg font-bold shadow-[inset_0_0_0_1px_oklch(0.36_0.03_275)]", used && "opacity-20"),
      ADULT: cx("rounded-md border border-canvas-line-strong bg-[oklch(0.995_0.003_90)] px-4 py-2.5 text-[17px]", used && "opacity-25"),
    })[age];

  return (
    <div className={cx("flex flex-col", age === "CHILD" ? "gap-[26px]" : "gap-[22px]")}>
      <div className="flex flex-col gap-2.5">
        <span className={cx(skin.eyebrow, age === "CHILD" && "text-[oklch(0.45_0.10_65)]")}>{exercise.eyebrow}</span>
        <h2 className={skin.title}>{exercise.prompt}</h2>
        {exercise.source && (
          <div
            className={cx(
              "flex items-center gap-3 self-start",
              age === "CHILD" && "rounded-[18px_18px_18px_4px] bg-card px-[18px] py-3.5 shadow-[inset_0_0_0_1.5px_var(--color-line-soft)]",
              age === "TEEN" && "rounded-lg border-l-[3px] border-grape bg-night-raised px-4 py-3",
              age === "ADULT" && "border-l-2 border-ink bg-canvas-card px-5 py-3",
            )}
          >
            <span className="font-mono text-[11px] opacity-70">{exercise.source.label}</span>
            <span className="text-[19px] font-semibold">{exercise.source.text}</span>
          </div>
        )}
      </div>

      <div
        aria-label="Twoje zdanie"
        role="group"
        className={cx(
          "flex flex-wrap content-center gap-2.5",
          age === "CHILD" && "min-h-24 rounded-[22px] bg-sand p-4",
          age === "TEEN" && "min-h-[84px] rounded-lg bg-night-deep p-3.5 shadow-[inset_0_0_0_1px_oklch(0.30_0.025_275)]",
          age === "ADULT" && "min-h-[76px] border-y border-canvas-line py-4",
        )}
      >
        {placed.length === 0 && (
          <span className={cx("p-3", age === "TEEN" ? "font-mono text-[13px] text-[oklch(0.55_0.02_275)]" : "text-[15px] text-faint")}>
            {age === "TEEN" ? "_ _ _ _ _ _ ?" : "Dotykaj słów poniżej w odpowiedniej kolejności…"}
          </span>
        )}
        {placed.map((tokenIndex, position) => (
          <button
            key={`${tokenIndex}-${position}`}
            type="button"
            disabled={!building}
            aria-label={`${exercise.tokens[tokenIndex]} — usuń ze zdania`}
            onClick={() => setPlaced((p) => p.filter((_, i) => i !== position))}
            className={answerToken}
          >
            {exercise.tokens[tokenIndex]}
          </button>
        ))}
      </div>

      <div className={cx("flex flex-wrap gap-3", age === "CHILD" && "justify-center")} role="group" aria-label="Słowa do wyboru">
        {exercise.tokens.map((token, i) => {
          const used = placed.includes(i);
          return (
            <button key={`${token}-${i}`} type="button" disabled={used || !building} aria-hidden={used} onClick={() => setPlaced((p) => [...p, i])} className={bankToken(used)}>
              {token}
            </button>
          );
        })}
      </div>

      {building && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1">
            <button type="button" onClick={() => setPlaced((p) => p.slice(0, -1))} disabled={placed.length === 0} className={cx(skin.ghost, "disabled:opacity-40")}>
              <UndoGlyph />
              {age === "CHILD" ? "Cofnij" : "Undo"}
            </button>
            <button type="button" onClick={reset} disabled={placed.length === 0} className={cx(skin.ghost, "disabled:opacity-40")}>
              {age === "CHILD" ? "Wyczyść" : "Reset"}
            </button>
          </div>
          <button type="button" onClick={check} disabled={placed.length === 0} className={placed.length ? skin.check : skin.checkIdle}>
            {skin.t.check}
          </button>
        </div>
      )}

      {phase === "correct" && (
        <Feedback
          kind="correct"
          title={exercise.feedback.correct.title}
          note={exercise.feedback.correct.note}
          xp={showXp ? xpForExercise(exercise, { mistakes, skipped: false }) : null}
          actions={
            <button type="button" onClick={onContinue} className={cx(skin.primary, "text-center")} autoFocus>
              {skin.t.next}
            </button>
          }
        />
      )}
      {phase === "almost" && (
        <Feedback
          kind="almost"
          title={exercise.feedback.incorrect.title}
          note={hint ?? exercise.feedback.incorrect.note}
          actions={
            <button type="button" onClick={reset} className={cx(skin.retry, "text-center")} autoFocus>
              {skin.t.retry}
            </button>
          }
        />
      )}
    </div>
  );
}
