"use client";

import Link from "next/link";
import { RichText } from "@/components/ui/RichText";
import { getConcept } from "@/data/curriculum";
import { useLearner } from "@/features/progress/useLearner";
import { useAge } from "@/features/theme/AgeScope";
import { cx, plural } from "@/lib/utils";
import type { AgeGroup, ReviewItem, ReviewStatus } from "@/types";
import { countByStatus, isDue, nextReviewLabel } from "./review";
import { TopicGrid } from "./TopicGrid";

const STATUS: Record<AgeGroup, Record<ReviewStatus, string>> = {
  CHILD: { new: "NOWE", learning: "UCZĘ SIĘ", weak: "TRUDNE", mastered: "OPANOWANE" },
  TEEN: { new: "NEW", learning: "LEARNING", weak: "HARD", mastered: "MASTERED" },
  ADULT: { new: "New", learning: "Learning", weak: "Needs practice", mastered: "Mastered" },
};

const CHILD_STATUS_TONE: Record<ReviewStatus, string> = {
  new: "bg-sky-soft text-[oklch(0.38_0.08_225)]",
  learning: "bg-amber-soft text-[oklch(0.42_0.10_65)]",
  weak: "bg-[oklch(0.94_0.04_35)] text-[oklch(0.45_0.12_35)]",
  mastered: "bg-moss-soft text-[oklch(0.35_0.10_145)]",
};

function sortForList(reviews: ReviewItem[]): ReviewItem[] {
  const weight: Record<ReviewStatus, number> = { weak: 0, new: 1, learning: 2, mastered: 3 };
  return [...reviews].sort((a, b) => weight[a.status] - weight[b.status] || b.mistakes - a.mistakes);
}

/** Practice hub: what is due, what is hard, and everything collected from mistakes. */
export function PracticeHome() {
  const age = useAge();
  const { reviews, due, course, now, next } = useLearner();
  const counts = countByStatus(reviews);
  const list = sortForList(reviews);
  const hardest = list.find((r) => r.status === "weak") ?? due[0];
  const hardestConcept = hardest ? getConcept(course, hardest.conceptId) : undefined;
  const minutes = Math.max(1, Math.round(due.length / 2));
  const lessonHref = next ? `/lesson/${next.lesson.lesson.id}` : "/journey";

  if (age === "TEEN") {
    return (
      <div className="flex flex-col gap-[22px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="m-0 font-mono text-[11px] tracking-[0.12em] text-grape">PRACTICE · {due.length} DUE</p>
            <h1 className="m-0 font-display text-[clamp(34px,4vw,52px)] font-extrabold leading-[0.95] tracking-[-0.035em]">Train your weak spots.</h1>
          </div>
          <p className="m-0 max-w-[40ch] text-[13px] text-night-muted">Każdy błąd z misji trafia tutaj. Dwie poprawne odpowiedzi z rzędu = mastered.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {due.length > 0 ? (
            <Link href="/practice/session" className="flex min-h-[170px] flex-col gap-2.5 rounded-xl bg-lime p-[22px] text-night">
              <span className="font-mono text-[11px] tracking-[0.1em]">QUICK PRACTICE</span>
              <span className="font-display text-[26px] font-extrabold leading-none">
                {due.length} due · {minutes} min
              </span>
              <span className="mt-auto text-[13px]">Najtrudniejsze najpierw →</span>
            </Link>
          ) : (
            <div className="flex min-h-[170px] flex-col gap-2.5 rounded-xl bg-night-surface p-[22px] shadow-[inset_0_0_0_1px_var(--color-night-line)]">
              <span className="font-mono text-[11px] tracking-[0.1em] text-lime">QUEUE CLEAR</span>
              <span className="font-display text-[26px] font-extrabold leading-none">Nothing due.</span>
              <Link href={lessonHref} className="k-tap mt-auto self-start text-[13px] text-lime">
                Play a mission →
              </Link>
            </div>
          )}
          <div className="flex flex-col gap-3.5 rounded-xl bg-night-surface p-[22px]">
            <h2 className="m-0 font-display text-xl font-extrabold">Memory queue</h2>
            <div className="grid h-[120px] grid-cols-4 items-end gap-2">
              {(["weak", "new", "learning", "mastered"] as const).map((s) => {
                const max = Math.max(1, ...Object.values(counts));
                return (
                  <div key={s} className="flex h-full flex-col justify-end gap-1.5">
                    <div className={cx("rounded-[2px]", s === "weak" ? "bg-grape" : s === "mastered" ? "bg-lime" : s === "new" ? "bg-amber" : "bg-[oklch(0.40_0.04_275)]")} style={{ height: `${Math.max(4, (counts[s] / max) * 100)}%` }} />
                    <span className="font-mono text-[10px] text-night-muted">
                      {STATUS.TEEN[s]} {counts[s]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <TopicGrid />
        <section className="flex flex-col gap-1 rounded-xl bg-night-surface p-[22px]">
          <h2 className="m-0 pb-2.5 font-display text-xl font-extrabold">Weak skills</h2>
          {list.length === 0 && <p className="m-0 border-t border-[oklch(0.30_0.025_275)] py-4 text-sm text-night-muted">Nothing here yet. Mistakes from missions show up in this list.</p>}
          {list.map((r) => (
            <div key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-[oklch(0.30_0.025_275)] py-3 sm:grid-cols-[minmax(0,1fr)_110px_90px]">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="font-semibold">{r.concept}</span>
                <span className="text-xs text-night-muted">
                  {r.sourceLessonTitle} · {r.mistakes}× mistake
                </span>
              </div>
              <span className={cx("font-mono text-[11px]", r.status === "weak" ? "text-grape" : r.status === "mastered" ? "text-lime" : "text-night-text")}>{STATUS.TEEN[r.status]}</span>
              <span className={cx("hidden text-right font-mono text-[11px] sm:block", isDue(r, now) ? "text-grape" : "text-night-muted")}>{nextReviewLabel(r, now, "en")}</span>
            </div>
          ))}
        </section>
      </div>
    );
  }

  if (age === "ADULT") {
    return (
      <div className="flex flex-col gap-9">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[11px] tracking-[0.12em] text-muted">REVIEW</span>
            <h1 className="m-0 font-serif text-[clamp(44px,5.5vw,68px)] font-normal leading-[0.98]">
              {due.length} {due.length === 1 ? "card" : "cards"} due today
            </h1>
            <p className="m-0 text-[15px] text-muted">{due.length > 0 ? `ok. ${minutes} min · wracasz do tego, co sprawiło trudność w lekcjach` : "Nic nie czeka. Błędy z lekcji trafiają tutaj automatycznie."}</p>
          </div>
          {due.length > 0 ? (
            <Link href="/practice/session" className="flex justify-between gap-10 rounded-md bg-ink px-[22px] py-[17px] text-base font-medium text-canvas hover:bg-ink-hover">
              <span>Start review</span>
              <span aria-hidden>→</span>
            </Link>
          ) : (
            <Link href={lessonHref} className="flex justify-between gap-10 rounded-md px-[22px] py-[17px] text-base shadow-[inset_0_0_0_1px_var(--color-ink)]">
              <span>Go to lesson</span>
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
        <TopicGrid />
        <div className="grid grid-cols-1 gap-[clamp(24px,4vw,48px)] md:grid-cols-2">
          {(
            [
              ["NEEDS PRACTICE", list.filter((r) => r.status === "weak" || r.status === "new"), "text-ochre"],
              ["LEARNING & MASTERED", list.filter((r) => r.status === "learning" || r.status === "mastered"), "text-muted"],
            ] as const
          ).map(([title, items, tone]) => (
            <section key={title} className="flex flex-col border-t border-ink">
              <h2 className={cx("m-0 py-3.5 font-mono text-[11px] font-normal tracking-[0.12em]", tone)}>{title}</h2>
              {items.length === 0 && <p className="m-0 border-t border-canvas-line-soft py-3.5 text-sm text-muted">—</p>}
              {items.map((r) => (
                <div key={r.id} className="flex flex-col gap-1 border-t border-canvas-line-soft py-3.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[17px] font-semibold">{r.concept}</span>
                    <span className={cx("shrink-0 font-mono text-[11px]", isDue(r, now) ? "text-azure" : "text-faint")}>{nextReviewLabel(r, now)}</span>
                  </div>
                  <span className="text-sm text-muted">
                    {STATUS.ADULT[r.status]} · {r.mistakes}× · {r.sourceLessonTitle}
                  </span>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[1240px] flex-col gap-[22px] p-[clamp(20px,3vw,40px)]">
      <div className="grid grid-cols-1 overflow-hidden rounded-[36px_36px_36px_10px] bg-coral-soft lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-[clamp(24px,3vw,36px)]">
          <span className="font-mono text-xs tracking-[0.08em] text-[oklch(0.48_0.15_35)]">DO POWTÓRKI · DZIŚ</span>
          <h1 className="m-0 font-display text-[clamp(34px,4vw,52px)] font-extrabold leading-[0.98] tracking-[-0.035em]">
            {due.length > 0
              ? `${due.length} ${plural(due.length, "rzecz jest gotowa", "rzeczy są gotowe", "rzeczy jest gotowych")} do powtórki`
              : reviews.length > 0
                ? "Wszystko powtórzone na dziś"
                : "Tu trafią Twoje powtórki"}
          </h1>
          <p className="m-0 text-base leading-normal text-[oklch(0.35_0.06_35)]">
            {due.length > 0
              ? "To słowa i zwroty, przy których zdarzyła się pomyłka w lekcji. Powtórz je teraz, żeby zostały w pamięci."
              : reviews.length > 0
                ? "Kolejne powtórki pojawią się, kiedy przyjdzie na nie czas."
                : "Gdy pomylisz się w lekcji, to słowo albo zwrot pojawi się tutaj — i wrócimy do niego razem."}
          </p>
          {due.length > 0 ? (
            <Link
              href="/practice/session"
              className="self-start rounded-[18px] bg-ink px-[clamp(18px,6vw,32px)] py-[18px] font-display text-[clamp(17px,5vw,20px)] font-extrabold text-on-ink shadow-[0_6px_0_var(--color-ink-deep)] transition-transform active:translate-y-[5px] active:shadow-[0_1px_0_var(--color-ink-deep)]"
            >
              Start powtórki · {minutes} min
            </Link>
          ) : (
            <Link href={lessonHref} className="self-start rounded-[18px] bg-card px-[clamp(18px,6vw,32px)] py-[18px] font-display text-[clamp(17px,5vw,20px)] font-extrabold shadow-[0_6px_0_oklch(0.80_0.08_35)]">
              Przejdź do lekcji →
            </Link>
          )}
        </div>
        <dl className="m-0 grid grid-cols-3 items-end gap-2 bg-[oklch(0.91_0.06_35)] p-[clamp(16px,3vw,36px)] sm:gap-3">
          {(
            [
              [counts.mastered, "opanowane", "bg-moss"],
              [due.length, "do powtórki", "bg-amber"],
              [counts.weak, "trudne", "bg-coral"],
            ] as const
          ).map(([value, label, color]) => {
            const max = Math.max(1, counts.mastered, due.length, counts.weak);
            return (
              <div key={label} className="flex flex-col-reverse gap-2">
                <dt className="text-xs font-bold leading-tight sm:text-sm">{label}</dt>
                <dd className={cx("m-0 flex items-end rounded-[16px_16px_4px_4px] p-3 font-display text-[40px] font-extrabold leading-none", color)} style={{ height: 56 + (value / max) * 94 }}>
                  {value}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      <TopicGrid />

      <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-2">
        {hardest && hardestConcept && (
          <section className="flex flex-col gap-3.5 rounded-[28px] bg-card p-6 shadow-[0_4px_0_var(--color-line),inset_0_0_0_1.5px_var(--color-line-soft)]">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-[5px] bg-[oklch(0.94_0.04_35)] px-2 py-1 font-mono text-[11px] text-[oklch(0.45_0.12_35)]">
                {hardest.status === "weak" ? "TRUDNE" : "DO POWTÓRKI"} · {hardest.mistakes}× POMYŁKA
              </span>
              <span className="font-mono text-[11px] text-muted">{hardest.sourceLessonTitle}</span>
            </div>
            <h2 className="m-0 font-display text-[28px] font-extrabold">{hardestConcept.label}</h2>
            <p className="m-0 text-[15px] leading-normal text-body">
              <RichText text={hardestConcept.explanation} />
            </p>
            {hardestConcept.example && <p className="m-0 font-serif text-xl leading-[1.4]">“{hardestConcept.example}”</p>}
          </section>
        )}
        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="m-0 font-display text-[22px] font-extrabold">Wszystkie powtórki</h2>
            <span className="font-mono text-xs text-muted">{reviews.length}</span>
          </div>
          {list.length === 0 ? (
            <p className="m-0 rounded-[22px] bg-sand p-5 text-[15px] text-body">Jeszcze pusto. Zrób lekcję — jeśli coś pójdzie nie tak, zapiszemy to tutaj.</p>
          ) : (
            <ul className="m-0 flex list-none flex-col rounded-[28px] bg-card p-2.5 shadow-[inset_0_0_0_1.5px_var(--color-line-soft)]">
              {list.map((r) => (
                <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3.5 rounded-[18px] px-3.5 py-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-display text-[19px] font-extrabold">{r.concept}</span>
                    <span className="text-[13px] text-muted">
                      {r.sourceLessonTitle} · {r.mistakes} {plural(r.mistakes, "pomyłka", "pomyłki", "pomyłek")} · powtórka: {nextReviewLabel(r, now)}
                    </span>
                  </div>
                  <span className={cx("whitespace-nowrap rounded-[5px] px-2 py-1 font-mono text-[10px]", CHILD_STATUS_TONE[r.status])}>{STATUS.CHILD[r.status]}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
