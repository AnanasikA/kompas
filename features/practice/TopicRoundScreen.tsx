"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { getTopic } from "@/data/topics";
import { ExerciseRenderer } from "@/features/lessons/exercises/ExerciseRenderer";
import { useAge } from "@/features/theme/AgeScope";
import { useSkin } from "@/features/theme/useSkin";
import { useAppStore } from "@/lib/store/app-store";
import { cx } from "@/lib/utils";
import { topicProgress } from "./rounds";

const COPY = {
  CHILD: { back: "← Trening", missing: "Nie ma takiego tematu.", done: "Runda skończona!", words: "słów dobrze", mastered: "nowe opanowane", topic: "opanowane w tym temacie", again: "wróci w następnej rundzie", ok: "dobrze", next: "Następna runda →", exit: "Wróć do Treningu", last: "Zakończ rundę →", round: "Runda" },
  TEEN: { back: "← Practice", missing: "No such topic.", done: "Round cleared.", words: "words right", mastered: "newly mastered", topic: "mastered in this topic", again: "back next round", ok: "correct", next: "Next round →", exit: "Back to Practice", last: "Finish →", round: "Round" },
  ADULT: { back: "← Review", missing: "No such topic.", done: "Round complete.", words: "words right", mastered: "newly mastered", topic: "mastered in this topic", again: "returns next round", ok: "correct", next: "Next round", exit: "Back to review", last: "Finish →", round: "Round" },
};

/**
 * One round of topic practice, then straight into the next one if the learner
 * wants: rounds are generated, so there is always another.
 */
export function TopicRoundScreen({ topicId }: { topicId: string }) {
  const age = useAge();
  const skin = useSkin();
  const router = useRouter();
  const t = COPY[age];
  const topic = getTopic(topicId);
  const round = useAppStore((s) => s.round);
  const stats = useAppStore((s) => s.wordStats);
  const startRound = useAppStore((s) => s.startRound);
  const answerRound = useAppStore((s) => s.answerRound);
  const nextRound = useAppStore((s) => s.nextRound);
  const endRound = useAppStore((s) => s.endRound);
  const missed = useRef<Set<string>>(new Set());
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !topic) return;
    started.current = true;
    // A round left unfinished on this topic is resumed; anything else starts fresh.
    if (useAppStore.getState().round?.topicId !== topicId) startRound(topicId);
  }, [topic, topicId, startRound]);

  const leave = () => {
    endRound();
    router.push("/practice");
  };

  if (!topic || !round || round.topicId !== topicId) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          {!topic && <h1 className="k-heading m-0 text-3xl">{t.missing}</h1>}
          <Link href="/practice" className={topic ? skin.ghost : skin.primary}>
            {t.back}
          </Link>
        </div>
      </div>
    );
  }

  const title = age === "CHILD" ? topic.title.pl : topic.title.en;
  const total = round.steps.length;

  if (round.summary) {
    const { summary } = round;
    const missedIds = new Set(round.results.flatMap((r) => r.missed));
    const words = [...new Set(round.steps.flatMap((s) => s.wordIds))].map((id) => topic.words.find((w) => w.id === id)).filter((w) => !!w);
    const progress = topicProgress(topic, round.level, stats);
    return (
      <div className="grid min-h-dvh place-items-center p-[clamp(20px,4vw,56px)]">
        <div className={cx("flex w-full max-w-[680px] flex-col gap-6", age === "CHILD" && "rounded-[32px] bg-card p-[clamp(24px,4vw,40px)] shadow-[0_6px_0_var(--color-line),inset_0_0_0_1.5px_var(--color-line-soft)]", age === "TEEN" && "rounded-xl bg-night-surface p-8 shadow-[inset_0_0_0_1px_var(--color-lime)]", age === "ADULT" && "border-t border-ink pt-8")}>
          <div className="flex flex-col gap-2">
            <p className={skin.eyebrow}>
              {title.toUpperCase()} · {round.level}
            </p>
            <h1 className="k-heading m-0 text-[clamp(34px,5vw,56px)] leading-none">{t.done}</h1>
          </div>
          <dl className="m-0 grid grid-cols-3 gap-4">
            {(
              [
                [`${summary.correctWords} / ${summary.totalWords}`, t.words],
                [`+${summary.xp} XP`, "XP"],
                [`${progress.mastered} / ${progress.total}`, t.topic],
              ] as const
            ).map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse gap-1">
                <dt className="text-[13px] leading-snug text-[var(--k-muted)]">{label}</dt>
                <dd className={cx("m-0 text-[clamp(22px,3vw,30px)] leading-none", age === "ADULT" ? "font-serif" : age === "TEEN" ? "font-mono" : "font-display font-extrabold")}>{value}</dd>
              </div>
            ))}
          </dl>
          <ul className="m-0 flex list-none flex-col p-0">
            {words.map((w) => {
              const ok = !missedIds.has(w.id);
              return (
                <li key={w.id} className="flex items-baseline justify-between gap-3 border-t border-[var(--k-line)] py-2.5">
                  <span>
                    <span aria-hidden>{ok ? "✓ " : "↻ "}</span>
                    <span lang="en" className="font-semibold">
                      {w.term}
                    </span>
                    <span className="text-[var(--k-muted)]"> — {w.translation}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-[var(--k-muted)]">{ok ? t.ok : t.again}</span>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" autoFocus onClick={() => startRound(topicId)} className={skin.primary}>
              {t.next}
            </button>
            <button type="button" onClick={leave} className={skin.ghost}>
              {t.exit}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const step = round.steps[round.index];

  return (
    <div className="flex min-h-dvh flex-col">
      <header className={cx("sticky top-0 z-[5] grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-[clamp(16px,3vw,40px)] py-4", age === "CHILD" && "bg-paper", age === "TEEN" && "border-b border-[oklch(0.26_0.025_275)] bg-night", age === "ADULT" && "border-b border-canvas-line-soft bg-canvas")}>
        <button type="button" onClick={leave} className={skin.ghost}>
          {t.back}
        </button>
        <div
          className="mx-auto grid w-full max-w-[520px] gap-1.5"
          style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={round.index}
          aria-label={`${t.round}: ${round.index + 1} / ${total}`}
        >
          {round.steps.map((s, i) => (
            <div
              key={s.exercise.id}
              className={cx(
                age === "CHILD" ? "h-2.5 rounded-[5px]" : age === "TEEN" ? "h-1" : "h-0.5",
                i < round.index ? { CHILD: "bg-moss", TEEN: "bg-lime", ADULT: "bg-ink" }[age] : i === round.index ? { CHILD: "bg-amber", TEEN: "bg-grape", ADULT: "bg-azure" }[age] : { CHILD: "bg-idle", TEEN: "bg-night-line-soft", ADULT: "bg-canvas-line-strong" }[age],
              )}
            />
          ))}
        </div>
        <span className="font-mono text-[13px]">
          {round.index + 1}/{total}
        </span>
      </header>
      <main className="flex flex-1 flex-col items-center px-[clamp(16px,3vw,40px)] pb-10 pt-[clamp(16px,3vw,36px)]">
        <div className="flex w-full max-w-[900px] flex-col gap-4">
          <p className={cx("m-0 text-sm", age === "TEEN" ? "text-night-muted" : "text-muted")}>
            {title} · {round.level}
          </p>
          <ExerciseRenderer
            key={step.exercise.id}
            exercise={step.exercise}
            showXp
            continueLabel={round.index === total - 1 ? t.last : undefined}
            onMistake={(ids) => ids.forEach((id) => missed.current.add(id))}
            onSolved={() => answerRound(missed.current.size === 0, [...missed.current])}
            onContinue={() => {
              missed.current = new Set();
              nextRound();
            }}
          />
        </div>
      </main>
    </div>
  );
}
