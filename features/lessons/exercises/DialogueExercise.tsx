"use client";

import { PlayGlyph } from "@/components/ui/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScriptedResponder, createDialogueState, longestPath, type DialogueState } from "@/features/learning/dialogue/engine";
import { xpForExercise } from "@/features/learning/engine/xp";
import { useAge } from "@/features/theme/AgeScope";
import { useSkin } from "@/features/theme/useSkin";
import { audioPlayer } from "@/lib/services/tts";
import { cx } from "@/lib/utils";
import type { DialogueExercise as DialogueEx, DialogueOption } from "@/types";
import type { ExerciseViewProps } from "./types";

const VOICE = { lang: "en-GB", rate: 0.9 };

function speak(text: string) {
  audioPlayer.play({ text, ...VOICE }).catch(() => {
    // No voice available: the line is on screen, so the scene still works.
  });
}

/** Café illustration from the prototype (barista behind the counter, menu board). */
function CafeScene({ exercise }: { exercise: DialogueEx }) {
  const { character } = exercise.script;
  const board = exercise.scene.board;
  return (
    <div className="relative min-h-[220px] md:min-h-0">
      {board && (
        <div className="absolute left-[12%] top-[8%] flex w-[62%] flex-col gap-1 rounded-[10px] bg-[oklch(0.28_0.03_160)] px-3.5 py-3 font-mono text-[11px] text-[oklch(0.95_0.02_100)]">
          <div className="font-display text-[15px] font-extrabold text-[oklch(0.85_0.12_85)]">{board.title}</div>
          {board.rows.map((row) => (
            <div key={row[0]} className="flex justify-between">
              <span>{row[0]}</span>
              <span>{row[1]}</span>
            </div>
          ))}
        </div>
      )}
      <div aria-hidden className="hidden md:block">
        <div className="absolute bottom-[26%] left-1/2 h-[170px] w-[150px] -translate-x-1/2 rounded-t-[75px] bg-sky" />
        <div className="absolute left-1/2 h-[100px] w-[110px] -translate-x-1/2 rounded-b-[20px] bg-[oklch(0.97_0.01_85)]" style={{ bottom: "calc(26% + 70px)" }} />
        <div className="absolute left-1/2 size-[92px] -translate-x-1/2 rounded-full bg-[oklch(0.78_0.07_55)]" style={{ bottom: "calc(26% + 150px)" }} />
        <div className="absolute left-1/2 h-[34px] w-[100px] -translate-x-1/2 rounded-[50px_50px_8px_8px] bg-[oklch(0.30_0.04_50)]" style={{ bottom: "calc(26% + 218px)" }} />
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-card px-3 py-1.5 font-mono text-xs md:bottom-[calc(26%-50px)]">
        {character.name} · {character.role}
      </div>
    </div>
  );
}

/**
 * Interactive scene. The conversation is driven by a DialogueResponder
 * (scripted branches today); this component only renders turns and options.
 */
export function DialogueExercise({ exercise, onMistake, onSolved, onContinue, showXp, continueLabel }: ExerciseViewProps<DialogueEx>) {
  const age = useAge();
  const skin = useSkin();
  const responder = useMemo(() => new ScriptedResponder(exercise.script), [exercise.script]);
  const [state, setState] = useState<DialogueState>(() => createDialogueState(exercise.script));
  const [hint, setHint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const remaining = useMemo(() => longestPath(exercise.script, state.nodeId), [exercise.script, state.nodeId]);
  const logRef = useRef<HTMLDivElement>(null);
  const { character } = exercise.script;
  const options = responder.options(state);
  const lastLine = state.turns[state.turns.length - 1]?.text ?? "";

  useEffect(() => {
    speak(exercise.script.nodes[exercise.script.startNodeId].line);
    return () => audioPlayer.stop();
  }, [exercise.script]);

  // Keep the newest line in view inside the conversation panel (the page itself stays put).
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [state.turns.length]);

  async function choose(option: DialogueOption) {
    if (busy || state.ended) return;
    setBusy(true);
    const reply = await responder.respond(state, option);
    setBusy(false);
    setState(reply.state);
    if (reply.kind === "hint") {
      setHint(reply.hint);
      onMistake([reply.conceptId ?? exercise.conceptId]);
      return;
    }
    setHint(null);
    speak(reply.characterLine);
    if (reply.state.ended) onSolved();
  }

  const xp = showXp ? xpForExercise(exercise, { mistakes: state.mistakes, skipped: false }) : null;
  // Steps done + steps left on the longest remaining route.
  const stepsTotal = Math.max(1, state.steps + remaining);
  const dots = Array.from({ length: stepsTotal }, (_, i) => (i < state.steps ? "done" : i === state.steps && !state.ended ? "current" : "todo"));

  const bubbles = (
    <div ref={logRef} className="flex max-h-[52dvh] min-h-0 flex-1 flex-col overflow-y-auto" role="log" aria-live="polite" aria-label="Rozmowa" tabIndex={0}>
      <div className="mt-auto flex flex-col gap-2.5 py-1">
      {state.turns.map((turn, i) =>
        turn.speaker === "character" ? (
          <div key={i} className={cx("flex max-w-[85%] animate-kfade items-end gap-2 self-start", age === "ADULT" && "flex-col items-start gap-1")}>
            {age === "CHILD" && (
              <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-sky text-[13px] font-extrabold" aria-hidden>
                {character.initial}
              </span>
            )}
            {age === "ADULT" && <span className="font-mono text-[10px] tracking-[0.1em] text-faint">{character.name.toUpperCase()}</span>}
            <span
              className={cx(
                age === "CHILD" && "rounded-[18px_18px_18px_4px] bg-card px-4 py-3 font-display text-lg font-semibold shadow-[0_2px_0_var(--color-line)]",
                age === "TEEN" && "rounded-[12px_12px_12px_2px] bg-[oklch(0.28_0.03_275)] px-4 py-3 text-base",
                age === "ADULT" && "font-serif text-2xl leading-[1.3]",
              )}
            >
              <span className="sr-only">{character.name}: </span>
              {turn.text}
            </span>
          </div>
        ) : (
          <div key={i} className={cx("flex max-w-[85%] animate-kfade flex-col items-end gap-1 self-end")}>
            {age === "ADULT" && <span className="font-mono text-[10px] tracking-[0.1em] text-faint">YOU</span>}
            <span
              className={cx(
                age === "CHILD" && "rounded-[18px_18px_4px_18px] bg-ink px-4 py-3 font-display text-lg font-semibold text-on-ink",
                age === "TEEN" && "rounded-[12px_12px_2px_12px] bg-grape px-4 py-3 text-base font-semibold text-night",
                age === "ADULT" && "rounded-[12px_12px_2px_12px] bg-ink px-4 py-3 text-base leading-[1.45] text-canvas",
              )}
            >
              <span className="sr-only">Ty: </span>
              {turn.text}
            </span>
          </div>
        ),
      )}
      </div>
    </div>
  );

  const replay = (
    <button
      type="button"
      onClick={() => speak(lastLine)}
      className={cx(
        "self-start font-mono text-[11px]",
        age === "CHILD" && "rounded-full bg-sky-soft px-3 py-[7px]",
        age === "TEEN" && "rounded px-2.5 py-1.5 shadow-[inset_0_0_0_1px_var(--color-night-line)]",
        age === "ADULT" && "k-tap text-muted",
      )}
    >
      <PlayGlyph />
      {age === "CHILD" ? `posłuchaj ${character.name === "Sam" ? "Sama" : character.name}` : "REPLAY"}
    </button>
  );

  const hintBox = hint && (
    <p
      role="alert"
      className={cx(
        "m-0 animate-kfade text-sm leading-normal",
        age === "CHILD" && "rounded-[14px] bg-amber-soft px-3.5 py-3 text-amber-body",
        age === "TEEN" && "rounded-md bg-amber/12 px-3.5 py-2.5 text-[oklch(0.90_0.08_80)] shadow-[inset_0_0_0_1px_var(--color-amber)]",
        age === "ADULT" && "border-l-2 border-azure bg-azure-soft px-4 py-3",
      )}
    >
      <b>{age === "CHILD" ? "Prawie! " : age === "TEEN" ? "Not quite. " : "Not quite. "}</b>
      {hint}
    </p>
  );

  const choices = !state.ended && (
    <div className={cx("flex flex-col gap-2 pt-2.5", age === "CHILD" && "border-t border-dashed border-[oklch(0.80_0.03_70)]", age === "TEEN" && "border-t border-[oklch(0.30_0.025_275)] pt-3", age === "ADULT" && "border-t border-canvas-line-soft pt-4")}>
      <span className={cx("font-mono text-[11px]", age === "CHILD" ? "text-[oklch(0.40_0.03_60)]" : age === "TEEN" ? "text-night-muted" : "tracking-[0.1em] text-muted")}>
        {age === "CHILD" ? "TWOJA ODPOWIEDŹ" : age === "TEEN" ? "YOUR MOVE" : "YOUR REPLY"}
      </span>
      {options.map((o) => (
        <button
          key={o.text}
          type="button"
          disabled={busy}
          onClick={() => choose(o)}
          className={cx(
            "text-left",
            age === "CHILD" &&
              "rounded-2xl bg-card px-[18px] py-3.5 text-base font-semibold shadow-[0_4px_0_var(--color-line-strong),inset_0_0_0_2px_var(--color-line-strong)] transition-transform hover:shadow-[0_4px_0_var(--color-amber-deep),inset_0_0_0_2px_var(--color-amber)] active:translate-y-[3px]",
            age === "TEEN" && "rounded-lg bg-[oklch(0.24_0.025_275)] px-4 py-[13px] text-[15px] font-semibold shadow-[inset_0_0_0_1px_oklch(0.36_0.03_275)] hover:shadow-[inset_0_0_0_1.5px_var(--color-lime)]",
            age === "ADULT" && "rounded-md border border-canvas-line-strong bg-[oklch(0.995_0.003_90)] px-[18px] py-3.5 text-base hover:border-ink",
          )}
        >
          {o.text}
        </button>
      ))}
    </div>
  );

  const done = state.ended && (
    <div
      role="status"
      className={cx(
        "flex animate-kfade flex-col gap-2.5",
        age === "CHILD" && "rounded-[20px] bg-moss-soft p-4",
        age === "TEEN" && "rounded-lg bg-lime/12 p-4 shadow-[inset_0_0_0_1.5px_var(--color-lime)]",
        age === "ADULT" && "border-t border-canvas-line-soft pt-4",
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <p className={cx("m-0", age === "CHILD" && "font-display text-[22px] font-extrabold text-moss-ink", age === "TEEN" && "font-display text-[22px] font-extrabold text-lime", age === "ADULT" && "text-base font-semibold")}>
          ✓ {exercise.feedback.correct.title}
        </p>
        {xp ? <span className={skin.xp}>+{xp} XP</span> : null}
      </div>
      <button type="button" onClick={onContinue} className={cx(skin.primary, "text-center", age !== "CHILD" && "self-start")} autoFocus>
        {continueLabel ?? skin.t.finish}
      </button>
    </div>
  );

  const progress = (
    <div className="flex gap-[5px]" role="img" aria-label={`Krok ${Math.min(state.steps + 1, stepsTotal)} z ${stepsTotal}`}>
      {dots.map((d, i) => (
        <div
          key={i}
          className={cx(
            age === "CHILD" && "h-2 w-7 rounded",
            age === "TEEN" && "h-1 w-6",
            age === "ADULT" && "h-0.5 flex-1",
            d === "done" && { CHILD: "bg-moss", TEEN: "bg-lime", ADULT: "bg-ink" }[age],
            d === "current" && { CHILD: "bg-amber", TEEN: "bg-grape", ADULT: "bg-azure" }[age],
            d === "todo" && { CHILD: "bg-idle", TEEN: "bg-night-line-soft", ADULT: "bg-canvas-line" }[age],
          )}
        />
      ))}
    </div>
  );

  if (age === "CHILD") {
    return (
      <div className="flex flex-col gap-[18px]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <span className={cx(skin.eyebrow, "text-[oklch(0.45_0.10_65)]")}>{exercise.eyebrow}</span>
            <h2 className="m-0 font-display text-[clamp(26px,3vw,36px)] font-extrabold leading-none tracking-[-0.03em]">{exercise.prompt}</h2>
          </div>
          {progress}
        </div>
        <div className="relative grid grid-cols-1 overflow-hidden rounded-[36px] bg-[oklch(0.88_0.05_60)] md:min-h-[520px] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="absolute inset-x-0 bottom-0 hidden h-[26%] bg-[oklch(0.55_0.08_55)] md:block" aria-hidden />
          <div className="absolute inset-x-0 bottom-[26%] hidden h-[18px] bg-[oklch(0.45_0.07_50)] md:block" aria-hidden />
          <CafeScene exercise={exercise} />
          <div className="relative flex min-h-[380px] flex-col gap-3 bg-card/72 p-[22px] backdrop-blur-[6px]">
            {bubbles}
            {replay}
            {hintBox}
            {choices}
            {done}
          </div>
        </div>
      </div>
    );
  }

  if (age === "TEEN") {
    return (
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        <div
          className="flex flex-col gap-4 rounded-xl p-[22px]"
          style={{ background: "repeating-linear-gradient(135deg,oklch(0.21 0.03 280),oklch(0.21 0.03 280) 10px,oklch(0.225 0.032 280) 10px,oklch(0.225 0.032 280) 20px)" }}
        >
          <span className="font-mono text-[11px] tracking-[0.12em] text-grape">{exercise.eyebrow}</span>
          <h2 className="m-0 font-display text-[26px] font-extrabold leading-[1.05]">{exercise.prompt}</h2>
          {exercise.scene.board && (
            <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1.5 rounded-md bg-night-deep p-3 font-mono text-xs">
              {exercise.scene.board.rows.flatMap((row) => row.map((cell, i) => <span key={`${row[0]}-${i}`} className={cx(i === 2 && (cell.includes("DELAYED") ? "text-amber" : "text-lime"))}>{cell}</span>))}
            </div>
          )}
          <div className="mt-auto flex flex-col gap-2">
            {exercise.scene.description && <p className="m-0 text-sm">◆ {exercise.scene.description}</p>}
            {progress}
            <span className="pt-1.5 font-mono text-[11px] text-night-muted">TURNS: {state.steps}</span>
          </div>
        </div>
        <div className="flex min-h-[520px] flex-col gap-3 rounded-xl bg-night-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-lg bg-[oklch(0.40_0.06_225)] font-mono text-xs" aria-hidden>
                {character.initial}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">{character.name}</span>
                <span className="font-mono text-[10px] text-night-muted">{character.role}</span>
              </div>
            </div>
            {replay}
          </div>
          {bubbles}
          {hintBox}
          {choices}
          {done}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-[clamp(24px,4vw,48px)] lg:grid-cols-3">
      <div className="flex flex-col gap-[18px]">
        <span className="font-mono text-[11px] tracking-[0.12em] text-azure">{exercise.eyebrow}</span>
        <h2 className="m-0 font-serif text-[38px] font-normal leading-none">{exercise.prompt}</h2>
        {exercise.scene.description && <p className="m-0 text-[15px] leading-[1.55] text-[oklch(0.35_0.02_265)]">{exercise.scene.description}</p>}
        {progress}
        <span className="font-mono text-[11px] text-faint">Wybierasz odpowiedź · rozmowa idzie dalej zależnie od niej</span>
      </div>
      <div className="flex min-h-[540px] flex-col gap-3.5 rounded-[10px] bg-canvas-card p-6 shadow-[inset_0_0_0_1px_var(--color-canvas-line)] lg:col-span-2">
        {bubbles}
        {hintBox}
        {!state.ended && replay}
        {choices}
        {done}
      </div>
    </div>
  );
}
