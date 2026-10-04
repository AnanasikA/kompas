"use client";

import { PlayGlyph } from "@/components/ui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getConcept } from "@/data/curriculum";
import { missedConcepts } from "@/features/learning/engine/session";
import { nextReviewLabel } from "@/features/practice/review";
import { useAge } from "@/features/theme/AgeScope";
import { audioPlayer } from "@/lib/services/tts";
import { useAppStore } from "@/lib/store/app-store";
import { cx, formatDuration, plural } from "@/lib/utils";
import { isPlayable } from "@/types";
import { useLessonContext } from "./useLessonContext";

function say(text: string) {
  audioPlayer.play({ text, lang: "en-GB", rate: 0.88 }).catch(() => {});
}

/** After the last exercise: what was earned, what was learnt, what goes to review. */
export function LessonSummary({ lessonId }: { lessonId: string }) {
  const age = useAge();
  const router = useRouter();
  const clearReward = useAppStore((s) => s.clearReward);
  const pendingReward = useAppStore((s) => s.pendingReward);
  const { lesson, unit, progress, course, reviews, now, week, following, followingPlayable, level } = useLessonContext(lessonId);

  if (!lesson || !progress || !progress.completedAt) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="k-heading m-0 text-3xl">{age === "CHILD" ? "Ta lekcja nie jest jeszcze ukończona" : "This lesson isn't finished yet"}</h1>
          <Link href={`/lesson/${lessonId}`} className="underline underline-offset-4">
            {age === "CHILD" ? "Przejdź do lekcji →" : "Open the lesson →"}
          </Link>
        </div>
      </div>
    );
  }

  const hasReward = pendingReward?.lessonId === lessonId;
  const missed = missedConcepts(progress)
    .map((id) => ({ concept: getConcept(course, id), item: reviews.find((r) => r.conceptId === id) }))
    .filter((m) => m.concept);
  const activeDays = week.filter((d) => d.active).length;
  const accuracy = progress.accuracy ?? 0;
  const time = formatDuration(progress.secondsSpent);
  const skippedCount = progress.exerciseResults.filter((r) => r.skipped).length;
  const nextTitle = following?.title;
  const nextIsPlanned = following ? !isPlayable(following) : true;

  const leave = (href: string) => {
    if (!hasReward) clearReward();
    router.push(href);
  };

  if (age === "TEEN") {
    return (
      <div className="flex min-h-dvh flex-col gap-[26px] p-[clamp(24px,4vw,56px)]">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-2.5">
          <p className="m-0 font-mono text-xs tracking-[0.14em] text-lime">
            MISSION {String(lesson.order).padStart(2, "0")} CLEARED · {unit?.title}
          </p>
          <h1 className="m-0 font-display text-[clamp(38px,5vw,66px)] font-extrabold leading-[0.92] tracking-[-0.04em]">{lesson.outcome}</h1>
        </div>
        <dl className="mx-auto grid w-full max-w-[1100px] grid-cols-2 gap-px overflow-hidden rounded-[10px] bg-[oklch(0.30_0.025_275)] md:grid-cols-4">
          {[
            [`+${progress.xpEarned}`, "XP", "text-lime"],
            [`${accuracy}%`, "accuracy · first try", ""],
            [time, "time", ""],
            [`${missed.length}`, "added to practice", "text-grape"],
          ].map(([value, label, color]) => (
            <div key={label} className="flex flex-col-reverse gap-1 bg-night-surface p-5">
              <dt className="text-xs text-night-muted">{label}</dt>
              <dd className={cx("m-0 font-mono text-[32px]", color)}>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mx-auto grid grid-cols-1 w-full max-w-[1100px] gap-4 md:grid-cols-2">
          <section className="flex flex-col gap-2.5 rounded-xl bg-night-surface p-[22px]">
            <h2 className="m-0 font-display text-[19px] font-extrabold">New phrases · {lesson.vocabulary.length}</h2>
            {lesson.vocabulary.map((v) => (
              <div key={v.term} className="flex items-baseline justify-between gap-3 text-[15px]">
                <button type="button" onClick={() => say(v.term)} className="k-tap rounded text-left hover:text-lime" aria-label={`Play: ${v.term}`}>
                  <PlayGlyph className="mr-2 text-[11px] text-night-muted" />
                  {v.term}
                </button>
                <span className="text-right text-[13px] text-night-muted">{v.translation}</span>
              </div>
            ))}
          </section>
          <section className="flex flex-col gap-2.5 rounded-xl bg-night-surface p-[22px] shadow-[inset_0_0_0_1px_var(--color-grape)]">
            <h2 className="m-0 font-display text-[19px] font-extrabold">Added to practice</h2>
            {missed.length === 0 && <p className="m-0 text-sm text-[oklch(0.85_0.015_275)]">Nothing. Clean run — zero mistakes.</p>}
            {missed.map(({ concept, item }) => (
              <div key={concept!.id} className="flex flex-col gap-1">
                <span className="text-sm text-[oklch(0.85_0.015_275)]">{concept!.label}</span>
                <span className="font-mono text-[11px] text-grape">
                  {item ? `${item.mistakes}× · NEXT REVIEW: ${nextReviewLabel(item, now, "en").toUpperCase()}` : ""}
                </span>
              </div>
            ))}
            {skippedCount > 0 && <p className="m-0 text-xs text-night-muted">{skippedCount} skipped task(s) gave no XP.</p>}
          </section>
        </div>
        <div className="mx-auto flex w-full max-w-[1100px] flex-wrap justify-end gap-2.5">
          {missed.length > 0 && (
            <button type="button" onClick={() => leave("/practice")} className="rounded-md px-6 py-[15px] font-semibold shadow-[inset_0_0_0_1px_oklch(0.40_0.03_275)]">
              Practice weak spots
            </button>
          )}
          <button type="button" onClick={() => (hasReward ? router.push(`/lesson/${lessonId}/reward`) : leave("/home"))} className="rounded-md bg-lime px-10 py-[17px] text-[17px] font-bold text-night hover:bg-lime-hover">
            {hasReward ? "Claim rewards →" : "Back to Home →"}
          </button>
        </div>
      </div>
    );
  }

  if (age === "ADULT") {
    return (
      <div className="min-h-dvh px-[clamp(20px,4vw,56px)] py-[clamp(28px,5vw,72px)]">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-10">
          <div className="flex flex-col gap-3.5">
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-azure">LESSON COMPLETE · {lesson.title}</p>
            <h1 className="m-0 max-w-[16ch] font-serif text-[clamp(46px,6vw,80px)] font-normal leading-[0.98]">{lesson.outcome}</h1>
          </div>
          <dl className="m-0 grid grid-cols-2 border-b border-t border-b-canvas-line border-t-ink md:grid-cols-4">
            {[
              [time, "minuty"],
              [`${lesson.vocabulary.length}`, "nowych zwrotów"],
              [`${missed.length}`, plural(missed.length, "rzecz do powtórki", "rzeczy do powtórki", "rzeczy do powtórki")],
              [`${accuracy}%`, `trafność · +${progress.xpEarned} XP`],
            ].map(([value, label], i) => (
              <div key={label} className="flex flex-col-reverse gap-1 py-5 pr-4">
                <dt className="text-[13px] text-muted">{label}</dt>
                <dd className={cx("m-0 font-serif text-[44px]", i === 3 && "text-azure")}>{value}</dd>
              </div>
            ))}
          </dl>
          {hasReward && (
            <p className="m-0 border-l-2 border-azure bg-azure-soft px-5 py-4 text-[15px]">
              Level {pendingReward.toLevel} — {level.into} / {level.needed} XP do następnego.
            </p>
          )}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <section className="flex flex-col border-t border-ink">
              <h2 className="m-0 py-3.5 font-mono text-[11px] font-normal tracking-[0.12em] text-muted">NEW PHRASES</h2>
              {lesson.vocabulary.map((v) => (
                <div key={v.term} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-canvas-line-soft py-3">
                  <span className="flex flex-col">
                    <span className="font-serif text-xl">{v.term}</span>
                    <span className="text-[13px] text-muted">{v.translation}</span>
                  </span>
                  <button type="button" onClick={() => say(v.term)} aria-label={`Listen: ${v.term}`} className="grid size-[34px] place-items-center rounded-full text-[10px] shadow-[inset_0_0_0_1px_oklch(0.80_0.01_90)]">
                    <PlayGlyph className="" />
                  </button>
                </div>
              ))}
            </section>
            <section className="flex flex-col border-t border-ink">
              <h2 className="m-0 py-3.5 font-mono text-[11px] font-normal tracking-[0.12em] text-ochre">ADDED TO REVIEW</h2>
              {missed.length === 0 && <p className="m-0 border-t border-canvas-line-soft py-3.5 text-[15px] text-muted">Nic — wszystko za pierwszym razem.</p>}
              {missed.map(({ concept, item }) => (
                <div key={concept!.id} className="flex flex-col gap-1 border-t border-canvas-line-soft py-3.5">
                  <span className="text-[17px] font-semibold">{concept!.label}</span>
                  <span className="text-sm text-muted">
                    {concept!.translation}
                    {item ? ` · powtórka: ${nextReviewLabel(item, now)}` : ""}
                  </span>
                </div>
              ))}
              <div className="flex flex-col gap-2 border-t border-canvas-line-soft pt-5">
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted">NEXT LESSON</span>
                <span className="font-serif text-3xl">{nextTitle ?? "—"}</span>
                {nextIsPlanned && nextTitle && <span className="text-sm text-muted">W przygotowaniu.</span>}
              </div>
            </section>
          </div>
          <div className="flex flex-wrap items-end justify-end gap-3">
            {missed.length > 0 && (
              <button type="button" onClick={() => leave("/practice")} className="rounded-md px-[22px] py-[15px] text-[15px] shadow-[inset_0_0_0_1px_var(--color-canvas-line-strong)]">
                Review now
              </button>
            )}
            <button type="button" onClick={() => leave("/home")} className="flex gap-[30px] rounded-md bg-ink px-[22px] py-[15px] text-[15px] text-canvas hover:bg-ink-hover">
              <span>Back to today</span>
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-[1200px] flex-col gap-8 bg-paper p-[clamp(24px,4vw,56px)]">
      <div className="flex flex-col gap-3.5">
        <p className="m-0 font-mono text-xs uppercase tracking-[0.1em] text-[oklch(0.40_0.10_145)]">LEKCJA UKOŃCZONA · {lesson.title}</p>
        <h1 className="m-0 max-w-[18ch] font-display text-[clamp(38px,5vw,64px)] font-extrabold leading-[0.95] tracking-[-0.04em]">{lesson.outcome}</h1>
      </div>
      <dl className="m-0 grid grid-cols-2 overflow-hidden rounded-[28px] bg-ink text-[oklch(0.97_0.008_85)] md:grid-cols-4">
        {[
          [`+${progress.xpEarned}`, "XP zdobyte", "text-amber"],
          [`${accuracy}%`, "trafnych za pierwszym razem", ""],
          [time, "minut nauki", ""],
          [`${activeDays}`, `${plural(activeDays, "dzień", "dni", "dni")} nauki w tym tygodniu`, "text-moss"],
        ].map(([value, label, color]) => (
          <div key={label} className="flex flex-col-reverse gap-1 border-b border-r border-[oklch(0.34_0.03_265)] p-[22px] md:border-b-0">
            <dt className="text-sm text-on-ink-muted">{label}</dt>
            <dd className={cx("m-0 font-display text-[44px] font-extrabold leading-none", color)}>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="m-0 font-display text-2xl font-extrabold">Nowe słowa i zwroty</h2>
            <span className="font-mono text-xs text-muted">z tej lekcji</span>
          </div>
          <ul className="m-0 list-none p-0">
            {lesson.vocabulary.map((v) => (
              <li key={v.term} className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-x-3.5 border-t border-line-soft py-2.5 sm:grid-cols-[40px_minmax(0,1fr)_auto]">
                <button type="button" onClick={() => say(v.term)} aria-label={`Posłuchaj: ${v.term}`} className="grid size-[38px] place-items-center rounded-xl bg-sky-soft text-xs">
                  <PlayGlyph className="" />
                </button>
                <span className="font-display text-[19px] font-extrabold">{v.term}</span>
                <span className="col-start-2 text-sm text-muted sm:col-start-3 sm:text-right">{v.translation}</span>
              </li>
            ))}
          </ul>
        </section>
        <div className="flex flex-col gap-3.5">
          <section className="flex flex-col gap-3.5 rounded-[28px] bg-amber-soft p-[22px]">
            <h2 className="m-0 font-display text-[22px] font-extrabold">Do powtórki</h2>
            {missed.length === 0 && <p className="m-0 rounded-[14px] bg-[oklch(0.97_0.03_85)] px-3.5 py-3 text-[15px]">Nic! Wszystko za pierwszym razem. ✓</p>}
            {missed.map(({ concept, item }) => (
              <div key={concept!.id} className="flex flex-col gap-1 rounded-[14px] bg-[oklch(0.97_0.03_85)] px-3.5 py-3">
                <div className="flex justify-between gap-2.5">
                  <b className="text-base">{concept!.label}</b>
                  <span className="shrink-0 font-mono text-[11px]">{item ? nextReviewLabel(item, now) : ""}</span>
                </div>
                <span className="text-[13px] text-[oklch(0.40_0.06_60)]">
                  {item ? `${item.mistakes} ${plural(item.mistakes, "pomyłka", "pomyłki", "pomyłek")} · czeka w Treningu` : concept!.translation}
                </span>
              </div>
            ))}
            {skippedCount > 0 && (
              <p className="m-0 text-[13px] text-amber-body">
                Pominięte zadania: {skippedCount}. Za pominięte nie ma XP — możesz powtórzyć lekcję, kiedy zechcesz.
              </p>
            )}
          </section>
          {nextTitle && (
            <div className="flex items-center gap-3.5 rounded-[20px] px-[18px] py-4 shadow-[inset_0_0_0_1.5px_var(--color-line)]">
              <div className="grid size-[46px] shrink-0 place-items-center rounded-full border-[3px] border-dashed border-[oklch(0.75_0.02_85)] font-display font-extrabold" aria-hidden>
                {following?.order}
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] text-muted">{followingPlayable?.id === following?.id ? "NASTĘPNA LEKCJA" : "NASTĘPNA LEKCJA · W PRZYGOTOWANIU"}</span>
                <span className="text-base font-bold">{nextTitle}</span>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => (hasReward ? router.push(`/lesson/${lessonId}/reward`) : leave("/home"))}
            className="rounded-[20px] bg-amber p-5 text-center font-display text-[21px] font-extrabold shadow-[0_6px_0_var(--color-amber-deep)] transition-transform active:translate-y-[5px] active:shadow-[0_1px_0_var(--color-amber-deep)]"
          >
            {hasReward ? "Odbierz nagrodę →" : "Wróć do bazy →"}
          </button>
          {missed.length > 0 && (
            <button type="button" onClick={() => leave("/practice")} className="self-center rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-sand">
              Przejdź do Treningu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
