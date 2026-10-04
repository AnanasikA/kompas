"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { RichText } from "@/components/ui/RichText";
import { MicIcon, RecordingBars } from "@/components/ui/icons";
import { evaluateSpeech, type SpeechEvaluation } from "@/features/learning/engine/evaluate";
import { xpForExercise } from "@/features/learning/engine/xp";
import { useAge } from "@/features/theme/AgeScope";
import { useSkin } from "@/features/theme/useSkin";
import { RecognitionError, speechRecognizer, type RecognitionErrorCode } from "@/lib/services/speech-recognition";
import { useAppStore } from "@/lib/store/app-store";
import { cx } from "@/lib/utils";
import type { AgeGroup, SpeakingExercise as SpeakingEx } from "@/types";
import { useAudioClip } from "../useAudioClip";
import type { ExerciseViewProps } from "./types";

type Phase = "idle" | "listening" | "result" | "confirmed";

const subscribeNever = () => () => {};

const COPY: Record<AgeGroup, Record<string, string>> = {
  CHILD: {
    model: "▶ wzór",
    tap: "Naciśnij i mów",
    listening: "Słucham…",
    stop: "Zatrzymaj",
    heard: "Usłyszeliśmy",
    words: "Rozpoznane słowa",
    disclaimer: "Sprawdzamy, które słowa udało się rozpoznać. To jeszcze nie jest ocena wymowy.",
    again: "Nagraj ponownie",
    unsupported: "Ta przeglądarka nie rozpoznaje mowy. Posłuchaj wzoru, powiedz zdanie na głos i potwierdź.",
    denied: "Nie mamy dostępu do mikrofonu. Zezwól na mikrofon w przeglądarce albo powiedz zdanie na głos i potwierdź.",
    silence: "Nic nie usłyszeliśmy. Spróbuj jeszcze raz, trochę głośniej.",
    failed: "Rozpoznawanie mowy nie zadziałało. Spróbuj ponownie albo potwierdź samodzielnie.",
    selfReport: "Powiedziałem / powiedziałam na głos",
    confirmed: "Zapisane! Tym razem nie sprawdzaliśmy nagrania.",
  },
  TEEN: {
    model: "▶ MODEL",
    tap: "TAP TO RECORD",
    listening: "LISTENING…",
    stop: "Stop",
    heard: "WE HEARD",
    words: "WORDS RECOGNISED",
    disclaimer: "Sprawdzamy rozpoznane słowa. To nie jest ocena wymowy.",
    again: "Record again",
    unsupported: "Ta przeglądarka nie rozpoznaje mowy. Odsłuchaj wzór, powiedz zdanie na głos i potwierdź.",
    denied: "Brak dostępu do mikrofonu. Zezwól na mikrofon w przeglądarce albo potwierdź samodzielnie.",
    silence: "Nic nie usłyszeliśmy. Spróbuj jeszcze raz.",
    failed: "Rozpoznawanie mowy nie zadziałało. Spróbuj ponownie albo potwierdź samodzielnie.",
    selfReport: "I said it out loud",
    confirmed: "Saved. This one wasn't checked.",
  },
  ADULT: {
    model: "▶ LISTEN",
    tap: "Naciśnij i mów",
    listening: "Słucham…",
    stop: "Stop",
    heard: "YOU SAID",
    words: "Words recognised",
    disclaimer: "Porównujemy rozpoznane słowa ze wzorem. To nie jest ocena wymowy.",
    again: "Try again",
    unsupported: "Ta przeglądarka nie rozpoznaje mowy. Odsłuchaj wzór, powiedz zdanie na głos i potwierdź.",
    denied: "Brak dostępu do mikrofonu. Zezwól na mikrofon w przeglądarce albo potwierdź samodzielnie.",
    silence: "Nic nie usłyszeliśmy. Spróbuj jeszcze raz.",
    failed: "Rozpoznawanie mowy nie zadziałało. Spróbuj ponownie albo potwierdź samodzielnie.",
    selfReport: "I said it out loud",
    confirmed: "Saved. This one wasn't checked.",
  },
};

/**
 * Say a sentence out loud.
 * With speech recognition: transcript → word-by-word comparison → feedback.
 * Without it (or without a microphone): listen to the model and confirm yourself.
 * A failed recognition is not counted as a learner mistake — the recogniser may be at fault.
 */
export function SpeakingExercise({ exercise, onSolved, onContinue, showXp }: ExerciseViewProps<SpeakingEx>) {
  const age = useAge();
  const skin = useSkin();
  const t = COPY[age];
  const noteSpeakingAttempt = useAppStore((s) => s.noteSpeakingAttempt);
  const supported = useSyncExternalStore(subscribeNever, () => speechRecognizer.isSupported(), () => true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<SpeechEvaluation | null>(null);
  const [error, setError] = useState<RecognitionErrorCode | null>(null);
  const [solved, setSolved] = useState(false);
  const model = useAudioClip({ text: exercise.target, lang: "en-GB", rate: 0.88 });
  const tipClip = useAudioClip(exercise.tip?.audio);

  useEffect(() => () => speechRecognizer.abort(), []);

  async function record() {
    setError(null);
    setPhase("listening");
    model.stop();
    try {
      const heard = await speechRecognizer.listen({ lang: "en-GB" });
      noteSpeakingAttempt();
      const evaluation = evaluateSpeech(exercise, heard.alternatives);
      setResult(evaluation);
      setPhase("result");
      if (evaluation.correct && !solved) {
        setSolved(true);
        onSolved();
      }
    } catch (e) {
      const code = e instanceof RecognitionError ? e.code : "unknown";
      setPhase("idle");
      if (code !== "aborted") setError(code);
    }
  }

  function selfReport() {
    noteSpeakingAttempt();
    setSolved(true);
    setPhase("confirmed");
    onSolved({ selfReported: true });
  }

  function skip() {
    onSolved({ skipped: true });
    onContinue();
  }

  const canRecognise = supported && error !== "not-allowed" && error !== "unsupported";
  const message = !supported ? t.unsupported : error === "not-allowed" ? t.denied : error === "no-speech" ? t.silence : error ? t.failed : null;
  const heardCount = result?.words.filter((w) => w.heard).length ?? 0;
  const xp = showXp && solved ? xpForExercise(exercise, { mistakes: 0, skipped: false }) : null;

  const micButton = {
    CHILD: "grid size-32 place-items-center rounded-full bg-coral shadow-[0_8px_0_var(--color-coral-deep),0_0_0_14px_var(--color-coral-soft)] transition-transform active:translate-y-1.5 active:shadow-[0_2px_0_var(--color-coral-deep),0_0_0_14px_var(--color-coral-soft)]",
    TEEN: "grid size-28 place-items-center rounded-full bg-grape shadow-[0_0_0_10px_oklch(0.72_0.15_295/0.15),0_0_40px_oklch(0.72_0.15_295/0.35)]",
    ADULT: "grid size-[72px] place-items-center rounded-full bg-ink",
  }[age];

  return (
    <div className={cx("flex flex-col", age === "CHILD" ? "items-center gap-[26px] text-center" : "gap-[22px]", age === "ADULT" && "max-w-[760px]")}>
      <span className={cx(skin.eyebrow, age === "CHILD" && "text-[oklch(0.50_0.15_35)]")}>{exercise.eyebrow}</span>
      <div className={cx("flex flex-wrap items-center gap-3.5", age === "CHILD" && "justify-center")}>
        <h2 className={cx(age === "ADULT" ? "m-0 font-serif text-[clamp(32px,4vw,46px)] font-normal leading-[1.15]" : "m-0 font-display text-[clamp(28px,4vw,48px)] font-extrabold leading-[1.05] tracking-[-0.03em]")}>
          “{exercise.target}”
        </h2>
        <button
          type="button"
          onClick={model.play}
          disabled={!model.supported}
          className={cx(
            "shrink-0 font-mono disabled:opacity-40",
            age === "CHILD" && "rounded-full bg-sky-soft px-3.5 py-2.5 text-xs",
            age === "TEEN" && "rounded px-3 py-2 text-[11px] shadow-[inset_0_0_0_1px_var(--color-night-line)]",
            age === "ADULT" && "rounded-full px-3 py-2 text-[11px] shadow-[inset_0_0_0_1px_oklch(0.70_0.05_225)]",
          )}
        >
          {model.status === "playing" ? "…" : t.model}
        </button>
      </div>
      {exercise.translation && (
        <p className={cx("m-0", age === "CHILD" ? "text-base text-muted" : skin.lead)}>
          <RichText text={exercise.translation} />
        </p>
      )}

      {message && phase !== "confirmed" && (
        <p role="alert" className={cx("m-0 max-w-[52ch] text-[15px] leading-normal", age === "CHILD" && "rounded-2xl bg-amber-soft px-4 py-3 text-amber-body", age === "TEEN" && "rounded-md bg-amber/12 px-3.5 py-2.5 text-[oklch(0.90_0.08_80)] shadow-[inset_0_0_0_1px_var(--color-amber)]", age === "ADULT" && "border-l-2 border-ochre bg-ochre-soft px-4 py-3")}>
          {message}
        </p>
      )}

      {phase === "idle" && canRecognise && (
        <div className={cx("flex items-center gap-3.5 p-5", age === "ADULT" ? "border-t border-canvas-line px-0 py-6" : "flex-col")}>
          <button type="button" onClick={record} aria-label={t.tap} className={micButton}>
            {age === "CHILD" ? <MicIcon /> : <span className={cx("rounded-xl", age === "TEEN" ? "h-[38px] w-6 bg-night" : "h-[26px] w-4 bg-canvas")} aria-hidden />}
          </button>
          <span className={age === "TEEN" ? "font-mono text-xs text-night-muted" : age === "CHILD" ? "text-[17px] font-bold" : "text-[15px]"}>{t.tap}</span>
        </div>
      )}

      {phase === "listening" && (
        <div className={cx("flex min-h-[200px] items-center justify-center gap-4 p-5", age === "ADULT" ? "min-h-0 justify-start border-t border-canvas-line px-0 py-6" : "flex-col")} role="status">
          <RecordingBars color={age === "CHILD" ? "var(--color-coral)" : age === "TEEN" ? "var(--color-grape)" : "var(--color-azure)"} height={age === "ADULT" ? 36 : 56} width={age === "CHILD" ? 6 : 3} count={age === "CHILD" ? 14 : 18} />
          <span className={cx(age === "CHILD" && "text-[17px] font-bold text-[oklch(0.50_0.15_35)]", age === "TEEN" && "font-mono text-xs text-grape", age === "ADULT" && "text-[15px] text-azure")}>{t.listening}</span>
          <button
            type="button"
            onClick={() => {
              speechRecognizer.abort();
              setPhase("idle");
            }}
            className={skin.ghost}
          >
            {t.stop}
          </button>
        </div>
      )}

      {phase === "idle" && !canRecognise && (
        <button type="button" onClick={selfReport} className={cx(skin.primary, "text-center")}>
          {t.selfReport}
        </button>
      )}
      {phase === "idle" && canRecognise && error && (
        <button type="button" onClick={selfReport} className={cx(skin.secondary, "text-center")}>
          {t.selfReport}
        </button>
      )}

      {phase === "confirmed" && (
        <div role="status" className={cx("flex w-full animate-kfade flex-wrap items-center justify-between gap-4 text-left", age === "CHILD" ? "rounded-3xl bg-moss-soft px-6 py-5" : cx(skin.okPanel, "px-5 py-[18px]"))}>
          <p className={cx("m-0", age === "CHILD" ? "font-display text-xl font-extrabold text-moss-ink" : skin.okText)}>✓ {t.confirmed}</p>
          <button type="button" onClick={onContinue} className={skin.primary} autoFocus>
            {skin.t.next}
          </button>
        </div>
      )}

      {phase === "result" && result && (
        <div
          role="status"
          className={cx(
            "flex w-full animate-kfade flex-col gap-4 text-left",
            age === "CHILD" && "rounded-[28px] bg-card p-[22px] shadow-[0_4px_0_var(--color-line),inset_0_0_0_1.5px_var(--color-line-soft)]",
            age === "TEEN" && "rounded-xl bg-night-surface p-[22px]",
            age === "ADULT" && "border-t border-canvas-line pt-[22px]",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={cx("m-0", age === "ADULT" ? "font-serif text-[28px]" : "font-display text-[26px] font-extrabold")}>
              {result.correct ? exercise.feedback.correct.title : exercise.feedback.incorrect.title}
            </p>
            {result.correct && xp ? <span className={cx(skin.xp, age === "CHILD" && "animate-none")}>+{xp} XP</span> : null}
          </div>
          <div className="flex flex-col gap-2">
            <span className={cx("font-mono text-[11px]", age === "TEEN" ? "text-night-muted" : "text-muted")}>
              {t.words}: {heardCount}/{result.words.length}
            </span>
            <div className="flex flex-wrap gap-2">
              {result.words.map((w, i) => (
                <span
                  key={`${w.word}-${i}`}
                  className={cx(
                    age === "CHILD" && "rounded-xl px-3.5 py-2 font-display text-[22px] font-extrabold",
                    age === "TEEN" && "rounded-md px-3 py-1.5 text-lg font-bold",
                    age === "ADULT" && "rounded-full px-3.5 py-1.5 font-serif text-xl",
                    w.heard
                      ? { CHILD: "bg-moss-soft text-[oklch(0.35_0.10_145)]", TEEN: "bg-lime/15 text-lime", ADULT: "bg-azure-soft text-azure" }[age]
                      : { CHILD: "bg-amber-soft text-[oklch(0.42_0.10_65)]", TEEN: "bg-grape/16 text-grape-text", ADULT: "bg-ochre-soft text-ochre-ink" }[age],
                  )}
                >
                  <span aria-hidden>{w.heard ? "✓ " : "? "}</span>
                  {w.word}
                  <span className="sr-only">{w.heard ? " — rozpoznane" : " — nierozpoznane"}</span>
                </span>
              ))}
            </div>
            {result.transcript && (
              <p className={cx("m-0 text-sm", age === "TEEN" ? "text-night-muted" : "text-muted")}>
                {t.heard}: „{result.transcript}”
              </p>
            )}
            {!result.correct && exercise.feedback.incorrect.note && <p className={cx("m-0 text-[15px]", age === "TEEN" && "text-night-body")}>{exercise.feedback.incorrect.note}</p>}
          </div>
          {exercise.tip && (
            <div
              className={cx(
                "flex flex-wrap items-center gap-3.5",
                age === "CHILD" && "rounded-2xl bg-amber-soft px-4 py-3.5 text-amber-body",
                age === "TEEN" && "rounded-md bg-night-raised px-3.5 py-3",
                age === "ADULT" && "border-l-2 border-azure bg-azure-soft px-[18px] py-4",
              )}
            >
              <p className="m-0 min-w-[220px] flex-1 text-[15px] leading-normal">
                <RichText text={exercise.tip.text} />
              </p>
              {exercise.tip.audio && tipClip.supported && (
                <button type="button" onClick={tipClip.play} className={cx("rounded-full px-3.5 py-2.5 font-mono text-xs", age === "CHILD" ? "bg-card" : "shadow-[inset_0_0_0_1px_currentColor]")}>
                  ▶ {exercise.tip.audio.text.length > 24 ? "listen" : exercise.tip.audio.text}
                </button>
              )}
            </div>
          )}
          <p className={cx("m-0 text-xs", age === "TEEN" ? "text-night-muted" : "text-faint")}>{t.disclaimer}</p>
          <div className="flex flex-wrap justify-between gap-3">
            <button type="button" onClick={record} className={skin.secondary}>
              {t.again}
            </button>
            {result.correct ? (
              <button type="button" onClick={onContinue} className={skin.primary} autoFocus>
                {skin.t.next}
              </button>
            ) : (
              <button type="button" onClick={selfReport} className={skin.secondary}>
                {t.selfReport}
              </button>
            )}
          </div>
        </div>
      )}

      {!solved && phase !== "listening" && (
        <button type="button" onClick={skip} className={skin.ghost}>
          {skin.t.skipSpeaking}
        </button>
      )}
    </div>
  );
}
