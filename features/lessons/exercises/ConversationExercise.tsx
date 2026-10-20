"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { RichText } from "@/components/ui/RichText";
import { MicIcon, RecordingBars } from "@/components/ui/icons";
import { judgeTurn, turnsLeft } from "@/features/learning/engine/conversation";
import { RecognitionError, speechRecognizer } from "@/lib/services/speech-recognition";
import { audioPlayer } from "@/lib/services/tts";
import { useAppStore } from "@/lib/store/app-store";
import { cx, plural } from "@/lib/utils";
import type { CharacterId, ConversationExercise as ConversationEx } from "@/types";
import { CHARACTERS, characterSrc, voiceOf } from "../mission/characters";
import { sceneBackground } from "../SceneIllustration";
import { withName } from "../scenes";
import type { ExerciseViewProps } from "./types";

/**
 * CONVERSATION: the heart of a mission. A character talks to the learner,
 * the learner answers out loud in their own words (or types). Answers are
 * judged on meaning (features/learning/engine/conversation), the character
 * reacts, and the talk moves on. Help comes in steps: a sentence starter
 * after a first miss, a full example to repeat after a second.
 */

type Line = { who: CharacterId | "you"; text: string };
type Mic = "idle" | "listening" | "off";

const subscribeNever = () => () => {};

export function ConversationExercise({ exercise, onMistake, onSolved, onContinue, continueLabel }: ExerciseViewProps<ConversationEx>) {
  const learnerName = useAppStore((s) => s.user?.name);
  const noteSpeakingAttempt = useAppStore((s) => s.noteSpeakingAttempt);
  const fill = useCallback((text: string) => withName(text, learnerName), [learnerName]);
  const micSupported = useSyncExternalStore(subscribeNever, () => speechRecognizer.isSupported(), () => true);

  const [turnId, setTurnId] = useState(exercise.start);
  const [log, setLog] = useState<Line[]>([]);
  const [misses, setMisses] = useState(0);
  const [heard, setHeard] = useState<string | null>(null);
  const [reaction, setReaction] = useState<{ said?: string; hint: string } | null>(null);
  const [mic, setMic] = useState<Mic>("idle");
  const [typing, setTyping] = useState(false);
  const [typed, setTyped] = useState("");
  const [showMeaning, setShowMeaning] = useState(false);
  const [helpAsked, setHelpAsked] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const counted = useRef(new Set<string>());
  const logEnd = useRef<HTMLDivElement>(null);

  const turn = exercise.turns[turnId];
  const person = CHARACTERS[turn.who];
  const left = turnsLeft(exercise.turns, turnId);
  const canTalk = micSupported && mic !== "off";

  const say = useCallback((who: CharacterId, text: string) => audioPlayer.play(voiceOf(who, text)).catch(() => {}), []);

  // The character speaks whenever a new turn starts.
  useEffect(() => {
    if (done) return;
    const id = setTimeout(() => void say(turn.who, fill(turn.line)), 300);
    return () => clearTimeout(id);
  }, [turnId, done, turn, fill, say]);

  useEffect(() => () => {
    speechRecognizer.abort();
    audioPlayer.stop();
  }, []);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [log.length, reaction]);

  function missed(reply: { said?: string; hint: string }) {
    setReaction(reply);
    setMisses((n) => n + 1);
    if (!counted.current.has(turnId)) {
      counted.current.add(turnId);
      onMistake([turn.conceptId]);
    }
    if (reply.said) void say(turn.who, fill(reply.said));
  }

  async function respond(answers: string[]) {
    const outcome = judgeTurn(turn, answers.map(fill));
    setHeard(outcome.heard || null);
    if (outcome.kind === "unclear") {
      missed({ hint: outcome.heard ? "Hmm, tego nie rozumiem. Spróbuj jeszcze raz — podpowiedź masz niżej." : "Nic nie słyszę. Spróbuj jeszcze raz." });
      return;
    }
    if (outcome.kind === "miss") {
      missed({ said: outcome.reply, hint: outcome.hint });
      return;
    }
    const { answer } = outcome;
    setBusy(true);
    const lines: Line[] = [
      { who: turn.who, text: fill(turn.line) },
      { who: "you", text: outcome.heard },
    ];
    if (answer.reply) lines.push({ who: answer.replyBy ?? turn.who, text: fill(answer.reply) });
    setLog((l) => [...l, ...lines]);
    setReaction(null);
    if (answer.reply) await say(answer.replyBy ?? turn.who, fill(answer.reply));
    setBusy(false);
    setHeard(null);
    setMisses(0);
    setHelpAsked(false);
    setShowMeaning(false);
    setTyped("");
    if (answer.next) {
      setTurnId(answer.next);
    } else {
      setDone(true);
      onSolved();
      setLog((l) => [...l, { who: turn.who, text: fill(exercise.ending) }]);
      void say(turn.who, fill(exercise.ending));
    }
  }

  async function listen() {
    if (mic === "listening") {
      speechRecognizer.abort();
      setMic("idle");
      return;
    }
    audioPlayer.stop();
    setMic("listening");
    setHeard(null);
    noteSpeakingAttempt();
    try {
      const result = await speechRecognizer.listen({ lang: "en-GB", timeoutMs: 8000 });
      setMic("idle");
      await respond(result.alternatives.length ? result.alternatives : [result.transcript]);
    } catch (error) {
      const code = error instanceof RecognitionError ? error.code : "unknown";
      if (code === "not-allowed" || code === "unsupported") {
        setMic("off");
        setTyping(true);
      } else {
        setMic("idle");
        if (code === "no-speech") setReaction({ hint: "Nic nie słyszę. Naciśnij mikrofon i mów wyraźnie, blisko telefonu lub komputera." });
      }
    }
  }

  function skip() {
    // After three tries the learner may hear the example and move on; the mistake is already noted.
    void respond([turn.model]);
  }

  const showFrame = misses >= 1 || helpAsked;
  const showModel = misses >= 2;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-[oklch(0.45_0.10_65)]">Rozmowa · {exercise.title}</span>
        <h2 className="m-0 font-display text-[clamp(22px,2.8vw,32px)] font-extrabold leading-tight tracking-[-0.02em]">
          <RichText text={exercise.goal} />
        </h2>
      </div>

      <div className="overflow-hidden rounded-[32px] shadow-[inset_0_0_0_1.5px_var(--color-line-soft)]" style={{ background: sceneBackground(exercise.setting) }}>
        {/* What has been said so far */}
        {log.length > 0 && (
          <ol className="m-0 flex max-h-[220px] list-none flex-col gap-2 overflow-y-auto p-4 pb-0" aria-label="Rozmowa do tej pory">
            {log.map((line, i) => (
              <li key={i} className={cx("flex", line.who === "you" ? "justify-end" : "justify-start")}>
                <span className={cx("max-w-[80%] rounded-[16px] px-3.5 py-2 text-[15px]", line.who === "you" ? "rounded-br-[4px] bg-ink text-on-ink" : "rounded-bl-[4px] bg-card/90")}>
                  {line.who !== "you" && <b className="mr-1.5 font-mono text-[11px] font-normal text-muted">{CHARACTERS[line.who].name}</b>}
                  {line.text}
                </span>
              </li>
            ))}
            <div ref={logEnd} />
          </ol>
        )}

        {/* The character and what they say now */}
        <div className="grid grid-cols-[96px_minmax(0,1fr)] items-end gap-3 p-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5 sm:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={characterSrc(done ? person.pose : turn.pose)} alt={person.name} className="h-auto w-full object-contain object-bottom drop-shadow-[0_6px_10px_oklch(0.23_0.025_265/0.18)]" />
          <div className="flex flex-col gap-2 pb-2">
            <span className="font-mono text-[11px] text-muted">
              {person.name} · {person.role}
            </span>
            <div className="relative rounded-[22px] rounded-bl-[6px] bg-card px-4 py-3 shadow-[0_6px_16px_oklch(0.23_0.025_265/0.12)]">
              <p className="m-0 font-display text-[clamp(20px,2.4vw,26px)] font-bold leading-snug">{fill(done ? exercise.ending : turn.line)}</p>
              {!done && showMeaning && <p className="m-0 mt-1 text-sm text-muted">{fill(turn.pl)}</p>}
            </div>
            {!done && (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => void say(turn.who, fill(turn.line))} className="k-tap rounded-full bg-card/85 px-3 py-1.5 text-xs font-semibold">
                  ▶ jeszcze raz
                </button>
                <button type="button" onClick={() => setShowMeaning((v) => !v)} aria-pressed={showMeaning} className="k-tap rounded-full bg-card/85 px-3 py-1.5 text-xs font-semibold">
                  {showMeaning ? "ukryj tłumaczenie" : "co to znaczy?"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!done ? (
        <section className="flex flex-col gap-3" aria-live="polite">
          {reaction && (
            <div className="flex flex-col gap-1 rounded-2xl bg-amber-soft px-4 py-3 text-[15px] leading-snug">
              {reaction.said && (
                <b className="font-display text-[17px]">
                  {person.name}: „{fill(reaction.said)}”
                </b>
              )}
              <span>
                <RichText text={reaction.hint} />
              </span>
            </div>
          )}
          {heard && (
            <p className="m-0 text-sm text-muted">
              Słyszę: <b className="text-ink">„{heard}”</b>
            </p>
          )}
          {showFrame && !showModel && (
            <p className="m-0 rounded-2xl bg-sky-soft px-4 py-3 text-[15px]">
              Spróbuj tak: <b className="font-display text-lg">{fill(turn.frame)}</b>
            </p>
          )}
          {showModel && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-sky-soft px-4 py-3 text-[15px]">
              <span>Powiedz za mną:</span>
              <b className="font-display text-lg">{fill(turn.model)}</b>
              <button type="button" onClick={() => void audioPlayer.play({ text: fill(turn.model), lang: "en-GB", rate: 0.8 }).catch(() => {})} className="k-tap rounded-full bg-card px-3 py-1 text-xs font-semibold">
                ▶ posłuchaj
              </button>
            </div>
          )}

          {canTalk && !typing ? (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => void listen()}
                disabled={busy}
                aria-label={mic === "listening" ? "Słucham… naciśnij, żeby przerwać" : "Naciśnij i powiedz odpowiedź po angielsku"}
                className={cx(
                  "grid size-[96px] place-items-center rounded-full shadow-[0_6px_0_var(--color-coral-deep)] transition-transform active:translate-y-1",
                  mic === "listening" ? "bg-coral-deep" : "bg-coral",
                )}
              >
                {mic === "listening" ? <RecordingBars color="oklch(0.99 0.004 85)" count={7} height={40} width={5} /> : <MicIcon size={44} />}
              </button>
              <span className="text-sm font-semibold">{mic === "listening" ? "Słucham…" : "Naciśnij i odpowiedz na głos"}</span>
              <button type="button" onClick={() => setTyping(true)} className="k-tap rounded text-sm text-muted underline underline-offset-4">
                wolę napisać
              </button>
            </div>
          ) : (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (typed.trim()) void respond([typed]);
              }}
            >
              <label className="sr-only" htmlFor={`${exercise.id}-answer`}>
                Twoja odpowiedź po angielsku
              </label>
              <input
                id={`${exercise.id}-answer`}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                autoCapitalize="sentences"
                placeholder="Napisz po angielsku…"
                className="min-w-0 flex-1 rounded-2xl bg-card px-4 py-3.5 font-display text-lg shadow-[inset_0_0_0_2px_var(--color-line)] outline-none focus:shadow-[inset_0_0_0_2.5px_var(--color-ink)]"
              />
              <button type="submit" disabled={busy || !typed.trim()} className="rounded-2xl bg-ink px-5 font-bold text-on-ink disabled:opacity-40">
                Wyślij
              </button>
            </form>
          )}
          {typing && canTalk && (
            <button type="button" onClick={() => setTyping(false)} className="k-tap self-center rounded text-sm text-muted underline underline-offset-4">
              wolę powiedzieć
            </button>
          )}
          {!micSupported && <p className="m-0 text-center text-xs text-muted">Ta przeglądarka nie rozpoznaje mowy. Najpierw powiedz odpowiedź na głos, a potem ją napisz.</p>}

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            {!showFrame ? (
              <button type="button" onClick={() => setHelpAsked(true)} className="k-tap rounded px-1 font-semibold text-muted">
                Pomóż mi zacząć
              </button>
            ) : (
              <span />
            )}
            {misses >= 3 && (
              <button type="button" onClick={skip} className="k-tap rounded px-1 font-semibold text-muted">
                Idź dalej →
              </button>
            )}
            <span className="font-mono text-xs text-muted">{left > 1 ? `jeszcze ${left} ${plural(left, "odpowiedź", "odpowiedzi", "odpowiedzi")}` : "ostatnia odpowiedź"}</span>
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-3 rounded-[24px] bg-moss-soft p-5">
          <p className="m-0 font-display text-xl font-extrabold">✓ Udało się porozumieć po angielsku!</p>
          <p className="m-0 text-[15px] text-moss-ink">Mówisz i ktoś Cię rozumie. Na tym polega nauka języka.</p>
          <button
            type="button"
            onClick={onContinue}
            className="self-start rounded-[18px] bg-moss px-6 py-3.5 font-display text-lg font-extrabold shadow-[0_5px_0_var(--color-moss-deep)] active:translate-y-1"
          >
            {continueLabel ?? "Dalej →"}
          </button>
        </section>
      )}
    </div>
  );
}
