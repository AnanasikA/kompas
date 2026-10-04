"use client";

import { useState } from "react";
import { Illustration } from "@/components/ui/Illustration";
import { PlayTriangle, SpeakerIcon } from "@/components/ui/icons";
import { evaluateChoice } from "@/features/learning/engine/evaluate";
import { xpForExercise } from "@/features/learning/engine/xp";
import { useAge } from "@/features/theme/AgeScope";
import { SELECT_OFF, SELECT_ON } from "@/features/theme/avatar";
import { useSkin } from "@/features/theme/useSkin";
import { cx } from "@/lib/utils";
import type { AgeGroup, ChoiceOption, FillGapExercise, ImageChoiceExercise, ListeningExercise, MultipleChoiceExercise } from "@/types";
import { useAudioClip, type AudioClip } from "../useAudioClip";
import { Feedback } from "./Feedback";
import type { ExerciseViewProps } from "./types";

type ChoiceEx = MultipleChoiceExercise | ImageChoiceExercise | ListeningExercise | FillGapExercise;
type Phase = "answering" | "correct" | "almost" | "revealed";
type OptionState = "idle" | "selected" | "good" | "bad";

const REVIEW_NOTE: Record<AgeGroup, string> = {
  CHILD: "Dodaliśmy to do powtórek w Treningu.",
  TEEN: "ADDED TO PRACTICE",
  ADULT: "Dodano do powtórek.",
};

function optionState(option: ChoiceOption, correctId: string, picked: string | null, phase: Phase): OptionState {
  if (phase === "answering") return picked === option.id ? "selected" : "idle";
  if (option.id === correctId) return "good";
  if (option.id === picked) return "bad";
  return "idle";
}

function StateMark({ state }: { state: OptionState }) {
  if (state === "good") return <span className="sr-only"> — poprawna odpowiedź</span>;
  if (state === "bad") return <span className="sr-only"> — Twoja odpowiedź</span>;
  return null;
}

/* ---------- option renderers per age mode ---------- */

function ChildOptions({ options, states, onPick, disabled, images, revealLabels, pills }: OptionListProps & { images: boolean; revealLabels: boolean; pills: boolean }) {
  const tone = (s: OptionState) =>
    s === "good"
      ? "bg-moss-soft shadow-[0_5px_0_var(--color-moss-deep),inset_0_0_0_3px_var(--color-moss-deep)]"
      : s === "bad"
        ? "bg-amber-soft shadow-[0_5px_0_var(--color-amber-deep),inset_0_0_0_3px_var(--color-amber-deep)]"
        : s === "selected"
          ? `bg-[oklch(0.96_0.04_80)] ${SELECT_ON}`
          : `bg-card ${SELECT_OFF}`;

  if (images) {
    return (
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {options.map((o, i) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={states[i] === "selected" || states[i] === "bad"}
            aria-label={revealLabels ? o.text : `Obrazek ${i + 1}`}
            disabled={disabled}
            onClick={() => onPick(o.id)}
            className={cx("relative flex flex-col gap-2.5 rounded-3xl p-3.5 transition-colors", tone(states[i]))}
          >
            <span className="block h-[120px] overflow-hidden rounded-2xl bg-[oklch(0.96_0.015_85)] sm:h-40">{o.image && <Illustration id={o.image} />}</span>
            {revealLabels && <span className="text-center font-display text-[17px] font-extrabold">{o.text}</span>}
            {states[i] === "good" && (
              <span aria-hidden className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-moss-deep text-sm font-extrabold text-card">
                ✓
              </span>
            )}
            <StateMark state={states[i]} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cx(pills ? "flex flex-wrap justify-center gap-3" : "grid grid-cols-1 gap-2.5 sm:grid-cols-2")}>
      {options.map((o, i) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={states[i] === "selected" || states[i] === "bad"}
          disabled={disabled}
          onClick={() => onPick(o.id)}
          className={cx(
            "flex items-center gap-3 rounded-2xl text-left font-semibold transition-colors",
            pills ? "px-6 py-4 font-display text-xl font-extrabold" : "px-[18px] py-4 text-[17px]",
            tone(states[i]),
          )}
        >
          {!pills && (
            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-sand font-mono text-xs" aria-hidden>
              {states[i] === "good" ? "✓" : "ABCD"[i]}
            </span>
          )}
          {pills && states[i] === "good" && <span aria-hidden>✓</span>}
          {o.text}
          <StateMark state={states[i]} />
        </button>
      ))}
    </div>
  );
}

interface OptionListProps {
  options: ChoiceOption[];
  states: OptionState[];
  onPick(id: string): void;
  disabled: boolean;
}

function TeenOptions({ options, states, onPick, disabled }: OptionListProps) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {options.map((o, i) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={states[i] === "selected" || states[i] === "bad"}
          disabled={disabled}
          onClick={() => onPick(o.id)}
          className={cx(
            "flex items-center gap-3 rounded-lg p-[18px] text-left text-base font-semibold",
            states[i] === "good" && "bg-lime/15 shadow-[inset_0_0_0_2px_var(--color-lime)]",
            states[i] === "bad" && "bg-grape/16 shadow-[inset_0_0_0_2px_var(--color-grape)]",
            states[i] === "selected" && "bg-night-raised shadow-[inset_0_0_0_2px_var(--color-lime)]",
            states[i] === "idle" && "bg-night-surface shadow-[inset_0_0_0_1px_var(--color-night-line)]",
          )}
        >
          <span className="grid size-[22px] shrink-0 place-items-center rounded-[3px] bg-night-chip font-mono text-[11px]" aria-hidden>
            {states[i] === "good" ? "✓" : states[i] === "bad" ? "✕" : "ABCD"[i]}
          </span>
          {o.text}
          <StateMark state={states[i]} />
        </button>
      ))}
    </div>
  );
}

function AdultOptions({ options, states, onPick, disabled, pills }: OptionListProps & { pills: boolean }) {
  if (pills) {
    return (
      <div className="flex flex-wrap gap-2.5">
        {options.map((o, i) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={states[i] === "selected" || states[i] === "bad"}
            disabled={disabled}
            onClick={() => onPick(o.id)}
            className={cx(
              "rounded-full px-[22px] py-3.5 text-[17px]",
              states[i] === "good" && "border-[1.5px] border-azure bg-azure-soft",
              states[i] === "bad" && "border-[1.5px] border-ochre bg-ochre-soft",
              states[i] === "selected" && "border-[1.5px] border-ink bg-[oklch(0.995_0.003_90)]",
              states[i] === "idle" && "border border-canvas-line-strong bg-[oklch(0.995_0.003_90)]",
            )}
          >
            {states[i] === "good" && <span aria-hidden>✓ </span>}
            {states[i] === "bad" && <span aria-hidden>✕ </span>}
            {o.text}
            <StateMark state={states[i]} />
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {options.map((o, i) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={states[i] === "selected" || states[i] === "bad"}
          disabled={disabled}
          onClick={() => onPick(o.id)}
          className={cx(
            "flex items-center gap-4 rounded-md bg-[oklch(0.995_0.003_90)] px-[18px] py-4 text-left text-[17px]",
            states[i] === "good" && "border-[1.5px] border-azure",
            states[i] === "bad" && "border-[1.5px] border-ochre",
            states[i] === "selected" && "border-[1.5px] border-ink",
            states[i] === "idle" && "border border-canvas-line-strong",
          )}
        >
          <span className="grid size-4 shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1.5px_oklch(0.60_0.02_265)]" aria-hidden>
            <span className={cx("size-2 rounded-full", states[i] === "good" && "bg-azure", states[i] === "bad" && "bg-ochre", states[i] === "selected" && "bg-ink")} />
          </span>
          {o.text}
          {states[i] === "good" && <span className="ml-auto font-mono text-xs text-azure">correct</span>}
          <StateMark state={states[i]} />
        </button>
      ))}
    </div>
  );
}

/* ---------- listening header per age mode ---------- */

function playLabel(clip: AudioClip, age: AgeGroup): string {
  if (!clip.supported) return age === "CHILD" ? "Ta przeglądarka nie odtworzy nagrania — możesz pominąć to zadanie." : "Audio is not available in this browser — you can skip this task.";
  if (clip.status === "playing") return age === "CHILD" ? "Odtwarzam…" : "Playing…";
  if (clip.playsLeft !== null) return age === "CHILD" ? `Zostało odtworzeń: ${clip.playsLeft}` : `Plays left: ${clip.playsLeft}`;
  if (clip.plays === 0) return age === "CHILD" ? "Dotknij głośnika, żeby posłuchać. Możesz kilka razy." : "Tap play to listen. Replay as often as you like.";
  return age === "CHILD" ? "Dotknij, żeby posłuchać jeszcze raz." : "Tap to replay.";
}

function ListeningHeader({ exercise, clip, revealed }: { exercise: ListeningExercise; clip: AudioClip; revealed: boolean }) {
  const age = useAge();
  const skin = useSkin();
  const playing = clip.status === "playing";
  const aria = playing ? "Stop" : clip.plays > 0 ? "Replay" : "Play";
  const onClick = playing ? clip.stop : clip.play;

  if (age === "CHILD") {
    return (
      <div className="flex flex-col gap-3.5">
        <span className={cx(skin.eyebrow, "text-[oklch(0.45_0.10_235)]")}>{exercise.eyebrow}</span>
        <div className="flex flex-wrap items-center gap-[18px]">
          <button
            type="button"
            onClick={onClick}
            disabled={!playing && !clip.canPlay}
            aria-label={aria === "Stop" ? "Zatrzymaj nagranie" : aria === "Replay" ? "Posłuchaj jeszcze raz" : "Odtwórz nagranie"}
            className={cx(
              "relative grid size-[84px] place-items-center rounded-[28px] bg-sky-deep shadow-[0_6px_0_var(--color-sky-deeper)] transition-transform active:translate-y-[5px] active:shadow-[0_1px_0_var(--color-sky-deeper)] disabled:opacity-50",
            )}
          >
            {playing && <span className="pointer-events-none absolute inset-0 animate-kpulse rounded-[28px] bg-sky-deep" aria-hidden />}
            <span className="relative">
              <SpeakerIcon />
            </span>
          </button>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-violet text-[13px] font-extrabold" aria-hidden>
                {exercise.speaker.name.charAt(0)}
              </span>
              <span className="text-[15px] font-semibold">{exercise.speaker.caption}</span>
            </div>
            {revealed ? (
              <p className="m-0 font-display text-xl font-semibold">“{exercise.audio.text}”</p>
            ) : (
              <p className="m-0 text-sm text-muted" aria-live="polite">
                {playLabel(clip, age)}
              </p>
            )}
          </div>
        </div>
        <h2 className={cx(skin.title, "mt-1.5")}>{exercise.question}</h2>
      </div>
    );
  }

  if (age === "TEEN") {
    return (
      <div className="flex flex-col gap-5">
        <span className={skin.eyebrow}>{exercise.eyebrow}</span>
        <div className="flex flex-wrap items-center gap-[18px] rounded-[10px] bg-night-deep p-[18px]">
          <button type="button" onClick={onClick} disabled={!playing && !clip.canPlay} aria-label={aria} className="grid size-[60px] shrink-0 place-items-center rounded-full bg-lime active:scale-95 disabled:opacity-40">
            {playing ? <span className="size-4 rounded-[3px] bg-night" aria-hidden /> : <PlayTriangle size={18} color="oklch(0.17 0.02 275)" />}
          </button>
          <div className="flex min-w-[200px] flex-1 flex-col gap-2">
            <span className="font-mono text-[11px] text-night-muted">
              {exercise.speaker.name} · {exercise.speaker.caption}
            </span>
            <div className="flex h-7 items-center gap-[3px]" aria-hidden>
              {[30, 70, 50, 90, 40, 65, 80, 35, 75, 55, 90, 45, 60, 30, 70, 50].map((h, i) => (
                <span key={i} className={cx("w-[3px]", playing ? "k-bar bg-lime" : i < 6 && clip.plays > 0 ? "bg-lime" : "bg-[oklch(0.40_0.03_275)]")} style={{ height: `${h}%`, animationDuration: `${0.5 + (i % 5) * 0.12}s`, animationDelay: `${i * 0.04}s` }} />
              ))}
            </div>
            {revealed ? (
              <p className="m-0 text-[15px] leading-normal">“{exercise.audio.text}”</p>
            ) : (
              <p className="m-0 text-[13px] text-night-muted" aria-live="polite">
                {playLabel(clip, age)}
              </p>
            )}
          </div>
        </div>
        <h2 className="m-0 font-display text-[26px] font-extrabold">{exercise.question}</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <span className={skin.eyebrow}>{exercise.eyebrow}</span>
      <div className="flex items-center gap-[18px] border-y border-canvas-line py-[18px]">
        <button type="button" onClick={onClick} disabled={!playing && !clip.canPlay} aria-label={aria} className="grid size-14 shrink-0 place-items-center rounded-full bg-ink disabled:opacity-40">
          {playing ? <span className="size-3.5 rounded-[2px] bg-canvas" aria-hidden /> : <PlayTriangle size={15} color="oklch(0.97 0.006 90)" />}
        </button>
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="text-[15px]">{exercise.speaker.name}</span>
          <span className="text-[13px] text-muted" aria-live="polite">
            {revealed ? `“${exercise.audio.text}”` : playLabel(clip, age)}
          </span>
        </div>
        <span className="font-mono text-[11px] text-faint">{exercise.speaker.caption}</span>
      </div>
      <h2 className="m-0 font-serif text-[clamp(32px,4vw,44px)] font-normal leading-[1.15]">{exercise.question}</h2>
    </div>
  );
}

/* ---------- headers for the other choice types ---------- */

function Sentence({ sentence, filled }: { sentence: string; filled: string | null }) {
  const [before, after] = sentence.split("___");
  return (
    <>
      {before}
      <span
        className={cx(
          "mx-1 inline-block min-w-[3ch] border-b-[3px] px-2 text-center align-baseline",
          filled ? "border-current" : "border-dashed border-current opacity-60",
        )}
      >
        {filled ?? "   "}
        {!filled && <span className="sr-only">luka</span>}
      </span>
      {after}
    </>
  );
}

function PromptHeader({ exercise, filled }: { exercise: Exclude<ChoiceEx, ListeningExercise>; filled: string | null }) {
  const age = useAge();
  const skin = useSkin();
  const targetClip = useAudioClip(exercise.type === "IMAGE_CHOICE" ? { text: exercise.target, lang: "en-GB", rate: 0.85 } : null);

  if (exercise.type === "FILL_GAP") {
    if (age === "ADULT") {
      return (
        <div className="flex flex-col gap-7">
          <span className={skin.eyebrow}>{exercise.eyebrow}</span>
          {exercise.prompt !== exercise.eyebrow && exercise.prompt.toUpperCase() !== exercise.eyebrow && <p className="m-0 text-sm text-muted">{exercise.prompt}</p>}
          <h2 className="m-0 font-serif text-[clamp(32px,4vw,46px)] font-normal leading-[1.2]">
            <Sentence sentence={exercise.sentence} filled={filled} />
          </h2>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-3.5">
        <span className={cx(skin.eyebrow, age === "CHILD" && "text-[oklch(0.45_0.10_65)]")}>{exercise.eyebrow}</span>
        <h2 className={skin.title}>{exercise.prompt}</h2>
        <p
          className={cx(
            "m-0",
            age === "CHILD"
              ? "rounded-[22px] bg-sand px-6 py-7 text-center font-display text-[clamp(24px,3.4vw,36px)] font-extrabold leading-tight"
              : "rounded-xl bg-night-surface px-6 py-8 text-center font-display text-[clamp(24px,3.4vw,36px)] font-extrabold",
          )}
        >
          <Sentence sentence={exercise.sentence} filled={filled} />
        </p>
        {exercise.translation && <p className={cx("m-0 text-center", skin.lead)}>{exercise.translation}</p>}
      </div>
    );
  }

  if (exercise.type === "IMAGE_CHOICE") {
    return (
      <div className="flex flex-col gap-3.5">
        <span className={cx(skin.eyebrow, age === "CHILD" && "text-[oklch(0.40_0.10_145)]")}>{exercise.eyebrow}</span>
        <h2 className={skin.title}>{exercise.prompt}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-[18px_18px_18px_4px] bg-card px-[18px] py-3.5 font-display text-[clamp(24px,3vw,32px)] font-extrabold shadow-[inset_0_0_0_1.5px_var(--color-line-soft)]">
            “{exercise.target}”
          </span>
          {targetClip.supported && (
            <button type="button" onClick={targetClip.play} className="rounded-full bg-sky-soft px-3.5 py-2.5 font-mono text-xs">
              ▶ posłuchaj
            </button>
          )}
        </div>
      </div>
    );
  }

  // MULTIPLE_CHOICE
  if (age === "TEEN") {
    return (
      <div className="flex flex-col gap-[22px]">
        <span className={skin.eyebrow}>{exercise.eyebrow ?? "QUICK CHECK"}</span>
        <div className="flex flex-col gap-2 rounded-xl bg-night-surface px-5 py-[clamp(28px,5vw,56px)] text-center">
          {exercise.context && <span className="font-mono text-[11px] text-night-muted">{exercise.context}</span>}
          <h2 className="m-0 font-display text-[clamp(32px,5vw,64px)] font-extrabold leading-none tracking-[-0.04em]">{exercise.prompt}</h2>
        </div>
      </div>
    );
  }
  if (age === "ADULT") {
    return (
      <div className="flex flex-col gap-6">
        <span className={skin.eyebrow}>{exercise.eyebrow ?? "REVIEW"}</span>
        {exercise.context && <p className="m-0 border-l-2 border-ink bg-canvas-card px-5 py-4 text-[17px] leading-[1.55]">{exercise.context}</p>}
        <h2 className={skin.title}>{exercise.prompt}</h2>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3.5">
      <span className={cx(skin.eyebrow, "text-[oklch(0.45_0.10_65)]")}>{exercise.eyebrow ?? "POWTÓRKA"}</span>
      <h2 className={skin.title}>{exercise.prompt}</h2>
      {exercise.context && <p className="m-0 rounded-2xl bg-[oklch(0.96_0.02_305)] px-[22px] py-[18px] font-serif text-2xl leading-[1.4]">{exercise.context}</p>}
    </div>
  );
}

/* ---------- the exercise ---------- */

/**
 * One component for every "pick one option" exercise:
 * MULTIPLE_CHOICE, IMAGE_CHOICE, LISTENING and FILL_GAP.
 */
export function ChoiceExercise({ exercise, onMistake, onSolved, onContinue, showXp, continueLabel }: ExerciseViewProps<ChoiceEx>) {
  const age = useAge();
  const skin = useSkin();
  const [picked, setPicked] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("answering");
  const [hint, setHint] = useState<string | undefined>();
  const [mistakes, setMistakes] = useState(0);
  const listening = exercise.type === "LISTENING" ? exercise : null;
  const clip = useAudioClip(listening?.audio, { maxPlays: listening?.maxPlays });

  // Adult gap-fills answer on tap and move on (as in the prototype); everything else is select → check.
  const instant = age === "ADULT" && exercise.type === "FILL_GAP";
  const options = exercise.options as ChoiceOption[];
  const states = options.map((o) => optionState(o, exercise.correctOptionId, picked, phase));
  const locked = phase !== "answering";
  const pickedText = options.find((o) => o.id === picked)?.text ?? null;
  const correctText = options.find((o) => o.id === exercise.correctOptionId)?.text ?? null;
  const hasImages = options.some((o) => o.image);

  function evaluate(optionId: string) {
    const result = evaluateChoice(exercise, optionId);
    if (result.correct) {
      setPhase("correct");
      onSolved();
      return;
    }
    setMistakes((m) => m + 1);
    setHint(result.hint);
    onMistake([result.conceptId]);
    if (instant) {
      setPhase("revealed");
      onSolved();
    } else {
      setPhase("almost");
    }
  }

  function pick(id: string) {
    if (locked) return;
    setPicked(id);
    if (instant) evaluate(id);
  }

  function retry() {
    setPicked(null);
    setHint(undefined);
    setPhase("answering");
  }

  const xp = showXp ? xpForExercise(exercise, { mistakes, skipped: false }) : null;
  const next = (
    <button type="button" onClick={onContinue} className={cx(skin.primary, "text-center")} autoFocus>
      {continueLabel ?? skin.t.next}
    </button>
  );
  const sheet = age === "CHILD";

  return (
    <div className={cx("flex flex-col", age === "ADULT" ? "max-w-[720px] gap-7" : "gap-6", sheet && locked && "pb-[230px] sm:pb-[190px]")}>
      {listening ? <ListeningHeader exercise={listening} clip={clip} revealed={locked} /> : <PromptHeader exercise={exercise as Exclude<ChoiceEx, ListeningExercise>} filled={exercise.type === "FILL_GAP" ? (phase === "answering" ? pickedText : correctText) : null} />}

      <div role="radiogroup" aria-label={listening ? listening.question : "Odpowiedzi"}>
        {age === "CHILD" && (
          <ChildOptions options={options} states={states} onPick={pick} disabled={locked} images={hasImages} revealLabels={locked} pills={exercise.type === "FILL_GAP"} />
        )}
        {age === "TEEN" && <TeenOptions options={options} states={states} onPick={pick} disabled={locked} />}
        {age === "ADULT" && <AdultOptions options={options} states={states} onPick={pick} disabled={locked} pills={exercise.type === "FILL_GAP"} />}
      </div>

      {phase === "answering" && !instant && (
        <div className={cx("flex flex-wrap items-center gap-3 pt-2", listening ? "justify-between" : "justify-end", age === "ADULT" && "justify-start")}>
          {listening && age !== "ADULT" && (
            <button
              type="button"
              onClick={() => {
                onSolved({ skipped: true });
                onContinue();
              }}
              className={skin.ghost}
            >
              {skin.t.skipListening}
            </button>
          )}
          <button type="button" onClick={() => picked && evaluate(picked)} disabled={!picked} className={picked ? skin.check : skin.checkIdle}>
            {skin.t.check}
          </button>
          {listening && age === "ADULT" && (
            <button
              type="button"
              onClick={() => {
                onSolved({ skipped: true });
                onContinue();
              }}
              className={skin.ghost}
            >
              {skin.t.skipListening}
            </button>
          )}
        </div>
      )}

      {phase === "correct" && <Feedback kind="correct" sheet={sheet} title={exercise.feedback.correct.title} note={exercise.feedback.correct.note} xp={xp} actions={next} />}

      {phase === "almost" && (
        <Feedback
          kind="almost"
          sheet={sheet}
          title={exercise.feedback.incorrect.title}
          note={hint ?? exercise.feedback.incorrect.note}
          footnote={showXp ? REVIEW_NOTE[age] : undefined}
          actions={
            <>
              {listening && clip.canPlay && (
                <button type="button" onClick={clip.play} className={cx(skin.secondary, "text-center", age === "CHILD" && "text-amber-ink shadow-[inset_0_0_0_2px_oklch(0.80_0.10_75)]")}>
                  {skin.t.replay}
                </button>
              )}
              <button type="button" onClick={retry} className={cx(skin.retry, "text-center")} autoFocus>
                {skin.t.retry}
              </button>
            </>
          }
        />
      )}

      {phase === "revealed" && (
        <Feedback kind="almost" title={exercise.feedback.incorrect.title} note={hint ?? exercise.feedback.incorrect.note} actions={next} />
      )}
    </div>
  );
}
