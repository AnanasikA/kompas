"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { evaluateMatch } from "@/features/learning/engine/evaluate";
import { xpForExercise } from "@/features/learning/engine/xp";
import { useAge } from "@/features/theme/AgeScope";
import { SELECT_OFF, SELECT_ON } from "@/features/theme/avatar";
import { useSkin } from "@/features/theme/useSkin";
import { cx } from "@/lib/utils";
import type { MatchingExercise as MatchingEx } from "@/types";
import { Feedback } from "./Feedback";
import type { ExerciseViewProps } from "./types";

/** Stable shuffle from the ids, so server and client agree and replays look the same. */
function shuffled<T extends { id: string }>(items: T[]): T[] {
  const weight = (id: string) => [...id].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 9973, 7);
  return [...items].sort((a, b) => weight(a.id) - weight(b.id));
}

export function MatchingExercise({ exercise, onMistake, onSolved, onContinue, showXp }: ExerciseViewProps<MatchingEx>) {
  const age = useAge();
  const skin = useSkin();
  const [left, setLeft] = useState<string | null>(null);
  const [right, setRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<[string, string] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rightColumn = useMemo(() => shuffled(exercise.pairs), [exercise.pairs]);
  const done = matched.length === exercise.pairs.length;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function attempt(l: string | null, r: string | null) {
    setLeft(l);
    setRight(r);
    if (l == null || r == null) return;
    const result = evaluateMatch(exercise, l, r);
    setLeft(null);
    setRight(null);
    if (result.correct) {
      const next = [...matched, l];
      setMatched(next);
      if (next.length === exercise.pairs.length) onSolved();
      return;
    }
    setMistakes((m) => m + 1);
    onMistake(result.conceptIds);
    setWrong([l, r]);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setWrong(null), 900);
  }

  const tile = (id: string, side: "L" | "R") => {
    const isMatched = matched.includes(id);
    const isSelected = side === "L" ? left === id : right === id;
    const isWrong = !!wrong && (side === "L" ? wrong[0] === id : wrong[1] === id);
    if (age === "CHILD") {
      return cx(
        "rounded-[18px] p-5 text-center transition-colors",
        side === "L" ? "font-display text-[clamp(18px,2vw,22px)] font-extrabold" : "text-[clamp(16px,1.8vw,19px)] font-semibold",
        isMatched && "bg-moss-soft text-[oklch(0.40_0.10_145)] shadow-[inset_0_0_0_2px_var(--color-moss)]",
        isWrong && "bg-coral-soft shadow-[0_4px_0_var(--color-coral),inset_0_0_0_2px_var(--color-coral)]",
        !isMatched && !isWrong && (isSelected ? `bg-amber-soft ${SELECT_ON}` : `bg-card ${SELECT_OFF}`),
      );
    }
    if (age === "TEEN") {
      return cx(
        "rounded-lg p-[18px] text-center text-[17px] font-semibold",
        isMatched && "bg-lime/15 text-lime shadow-[inset_0_0_0_2px_var(--color-lime)]",
        isWrong && "bg-grape/16 shadow-[inset_0_0_0_2px_var(--color-grape)]",
        !isMatched && !isWrong && (isSelected ? "bg-night-raised shadow-[inset_0_0_0_2px_var(--color-lime)]" : "bg-night-surface shadow-[inset_0_0_0_1px_var(--color-night-line)]"),
      );
    }
    return cx(
      "rounded-md bg-[oklch(0.995_0.003_90)] px-[18px] py-4 text-left text-[17px]",
      isMatched && "border-[1.5px] border-azure bg-azure-soft",
      isWrong && "border-[1.5px] border-ochre bg-ochre-soft",
      !isMatched && !isWrong && (isSelected ? "border-[1.5px] border-ink" : "border border-canvas-line-strong"),
    );
  };

  const label = (text: string, id: string, side: "L" | "R") => {
    const isMatched = matched.includes(id);
    const isWrong = !!wrong && (side === "L" ? wrong[0] === id : wrong[1] === id);
    return (
      <>
        {isMatched && <span aria-hidden>✓ </span>}
        {isWrong && <span aria-hidden>✕ </span>}
        {text}
        {isMatched && <span className="sr-only"> — dopasowane</span>}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className={cx(skin.eyebrow, age === "CHILD" && "text-[oklch(0.40_0.10_145)]")}>{exercise.eyebrow}</span>
          <h2 className={skin.title}>{exercise.prompt}</h2>
        </div>
        <span className={cx("font-mono text-sm", age === "CHILD" ? "rounded-full bg-moss-soft px-3.5 py-2" : "text-[13px]")} aria-live="polite">
          {matched.length}/{exercise.pairs.length} par
        </span>
      </div>

      {/* One grid, pairs of cells per row, so both columns keep the same row height. */}
      <div className="grid grid-cols-2 gap-x-[clamp(12px,3vw,40px)] gap-y-3" role="group" aria-label="Słowa po angielsku i ich znaczenia">
        {exercise.pairs.map((p, row) => {
          const r = rightColumn[row];
          return (
            <Fragment key={p.id}>
              <button type="button" disabled={matched.includes(p.id)} aria-pressed={left === p.id} onClick={() => attempt(p.id, right)} className={tile(p.id, "L")}>
                {label(p.left, p.id, "L")}
              </button>
              <button type="button" disabled={matched.includes(r.id)} aria-pressed={right === r.id} onClick={() => attempt(left, r.id)} className={tile(r.id, "R")}>
                {label(r.right, r.id, "R")}
              </button>
            </Fragment>
          );
        })}
      </div>

      {!done && (
        <p className={cx("m-0 text-center", age === "CHILD" ? "text-[15px] text-muted" : skin.lead)} aria-live="polite">
          {wrong ? `${exercise.feedback.incorrect.title} ${exercise.feedback.incorrect.note ?? ""}` : "Dotknij słowa po angielsku, potem jego znaczenia."}
        </p>
      )}

      {done && (
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
    </div>
  );
}
