"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { getConcept } from "@/data/curriculum";
import { ExerciseRenderer } from "@/features/lessons/exercises/ExerciseRenderer";
import { useLearner } from "@/features/progress/useLearner";
import { useAge } from "@/features/theme/AgeScope";
import { useSkin } from "@/features/theme/useSkin";
import { useAppStore } from "@/lib/store/app-store";
import { cx, plural } from "@/lib/utils";

/**
 * Review session: one quick check per due item, run by the same exercise
 * components as lessons. Results feed the review scheduler.
 */
export function PracticeSession() {
  const age = useAge();
  const skin = useSkin();
  const router = useRouter();
  const { course, reviews } = useLearner();
  const practice = useAppStore((s) => s.practice);
  const startPractice = useAppStore((s) => s.startPractice);
  const answerPractice = useAppStore((s) => s.answerPractice);
  const nextPractice = useAppStore((s) => s.nextPractice);
  const endPractice = useAppStore((s) => s.endPractice);
  const missed = useRef(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!useAppStore.getState().practice) startPractice();
  }, [startPractice]);

  const leave = () => {
    endPractice();
    router.push("/practice");
  };

  const t =
    age === "CHILD"
      ? { title: "Powtórka", empty: "Nie ma teraz nic do powtórki.", back: "← Trening", doneTitle: "Powtórka skończona!", right: "dobrze", again: "wraca do powtórek", exit: "Wróć do Treningu" }
      : age === "TEEN"
        ? { title: "QUICK PRACTICE", empty: "Nothing due right now.", back: "← Practice", doneTitle: "Session cleared.", right: "correct", again: "back in the queue", exit: "Back to Practice" }
        : { title: "Review", empty: "Nothing is due right now.", back: "← Review", doneTitle: "Review complete.", right: "correct", again: "returns to review", exit: "Back to review" };

  if (!practice) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="k-heading m-0 text-3xl">{t.empty}</h1>
          <Link href="/practice" className={skin.primary}>
            {t.back}
          </Link>
        </div>
      </div>
    );
  }

  const total = practice.itemIds.length;
  const finished = practice.index >= total;
  const itemId = practice.itemIds[practice.index];
  const item = reviews.find((r) => r.id === itemId);
  const concept = item ? getConcept(course, item.conceptId) : undefined;

  if (finished) {
    const correct = practice.results.filter((r) => r.correct).length;
    return (
      <div className="grid min-h-dvh place-items-center p-[clamp(20px,4vw,56px)]">
        <div className={cx("flex w-full max-w-[640px] flex-col gap-6", age === "CHILD" && "rounded-[32px] bg-card p-[clamp(24px,4vw,40px)] shadow-[0_6px_0_var(--color-line),inset_0_0_0_1.5px_var(--color-line-soft)]", age === "TEEN" && "rounded-xl bg-night-surface p-8 shadow-[inset_0_0_0_1px_var(--color-lime)]", age === "ADULT" && "border-t border-ink pt-8")}>
          <div className="flex flex-col gap-2">
            <p className={skin.eyebrow}>{t.title.toUpperCase()}</p>
            <h1 className="k-heading m-0 text-[clamp(34px,5vw,56px)] leading-none">{t.doneTitle}</h1>
            <p className={cx("m-0 text-lg", age === "TEEN" ? "text-night-body" : "text-body")}>
              {correct} / {total} {t.right}
            </p>
          </div>
          <ul className="m-0 flex list-none flex-col p-0">
            {practice.results.map((r) => {
              const review = reviews.find((x) => x.id === r.itemId);
              return (
                <li key={r.itemId} className="flex items-baseline justify-between gap-3 border-t border-[var(--k-line)] py-3">
                  <span className="font-semibold">
                    <span aria-hidden>{r.correct ? "✓ " : "↻ "}</span>
                    {review?.concept}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-[var(--k-muted)]">{r.correct ? t.right : t.again}</span>
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={leave} className={cx(skin.primary, "self-start")} autoFocus>
            {t.exit}
          </button>
        </div>
      </div>
    );
  }

  if (!item || !concept) {
    // Content for this item is gone (curriculum changed): move on.
    return (
      <div className="grid min-h-dvh place-items-center p-6">
        <button type="button" onClick={nextPractice} className={skin.primary}>
          {skin.t.next}
        </button>
      </div>
    );
  }

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
          aria-valuenow={practice.index}
          aria-label={`${t.title}: ${practice.index + 1} / ${total}`}
        >
          {practice.itemIds.map((id, i) => (
            <div
              key={id}
              className={cx(
                age === "CHILD" ? "h-2.5 rounded-[5px]" : age === "TEEN" ? "h-1" : "h-0.5",
                i < practice.index ? { CHILD: "bg-moss", TEEN: "bg-lime", ADULT: "bg-ink" }[age] : i === practice.index ? { CHILD: "bg-amber", TEEN: "bg-grape", ADULT: "bg-azure" }[age] : { CHILD: "bg-idle", TEEN: "bg-night-line-soft", ADULT: "bg-canvas-line-strong" }[age],
              )}
            />
          ))}
        </div>
        <span className="font-mono text-[13px]">
          {practice.index + 1}/{total}
        </span>
      </header>
      <main className="flex flex-1 flex-col items-center px-[clamp(16px,3vw,40px)] pb-10 pt-[clamp(16px,3vw,36px)]">
        <div className="flex w-full max-w-[900px] flex-col gap-4">
          <p className={cx("m-0 text-sm", age === "TEEN" ? "text-night-muted" : "text-muted")}>
            {age === "CHILD" ? `Z lekcji „${item.sourceLessonTitle}” · ${item.mistakes} ${plural(item.mistakes, "pomyłka", "pomyłki", "pomyłek")}` : `${item.sourceLessonTitle} · ${item.mistakes}×`}
          </p>
          <ExerciseRenderer
            key={item.id}
            exercise={concept.practice}
            showXp={false}
            continueLabel={practice.index === total - 1 ? (age === "CHILD" ? "Zakończ powtórkę →" : "Finish →") : undefined}
            onMistake={() => {
              missed.current = true;
            }}
            onSolved={() => answerPractice(item.id, !missed.current)}
            onContinue={() => {
              missed.current = false;
              nextPractice();
            }}
          />
        </div>
      </main>
    </div>
  );
}
