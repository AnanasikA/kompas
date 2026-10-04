"use client";

import Link from "next/link";
import { totals } from "@/features/gamification/activity";
import { nextReviewLabel } from "@/features/practice/review";
import { useLearner } from "@/features/progress/useLearner";
import { cx, formatDuration } from "@/lib/utils";
import { isPlayable } from "@/types";

/**
 * Parent view of a child profile: what was learnt, how well, and what to
 * repeat. Reads the same saved state as the child's screens.
 */
export function ParentPanel() {
  const { user, course, lessons, week, activity, reviews, rank, now, current, currentLevel } = useLearner();
  const done = course.units.flatMap((u) => u.lessons.filter(isPlayable).map((lesson) => ({ lesson, unit: u, progress: lessons[lesson.id] }))).filter((x) => x.progress?.best);
  const minutesWeek = week.reduce((s, d) => s + d.minutes, 0);
  const activeDays = week.filter((d) => d.active).length;
  const all = totals(activity);
  const avg = done.length ? Math.round(done.reduce((s, d) => s + (d.progress.best?.accuracy ?? 0), 0) / done.length) : null;
  const max = Math.max(user.dailyGoal, ...week.map((d) => d.minutes));
  const toReview = reviews.filter((r) => r.status !== "mastered");

  return (
    <div data-age="ADULT" className="min-h-dvh bg-canvas text-ink">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-line-soft px-[clamp(20px,4vw,56px)] py-5">
        <div className="flex flex-col">
          <span className="font-mono text-[11px] tracking-[0.12em] text-violet-deep">PANEL RODZICA</span>
          <span className="font-display text-xl font-extrabold">Kompas</span>
        </div>
        <Link href="/home" className="rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[inset_0_0_0_1.5px_var(--color-canvas-line-strong)] hover:bg-canvas-card">
          ← Wróć do aplikacji dziecka
        </Link>
      </header>
      <main className="mx-auto flex max-w-[1100px] flex-col gap-7 px-[clamp(20px,4vw,56px)] py-[clamp(24px,4vw,48px)]">
        <div className="flex flex-col gap-2">
          <h1 className="m-0 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-none tracking-[-0.03em]">Postęp: {user.name}</h1>
          <p className="m-0 text-[15px] text-muted">
            {rank} · cel {user.dailyGoal} min dziennie{current ? ` · teraz: ${current.unit.title} (${current.completedLessons} z ${current.totalLessons} misji)` : ""}
            {` · poziom ${currentLevel.level}: ${currentLevel.words.learned} z ${currentLevel.words.target} słów`}
          </p>
        </div>

        <dl className="m-0 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [`${minutesWeek} min`, "nauki w tym tygodniu"],
            [`${activeDays}`, "dni aktywne w tym tygodniu"],
            [`${done.length}`, "ukończone lekcje"],
            [avg == null ? "—" : `${avg}%`, "średnia trafność"],
          ].map(([value, label]) => (
            <div key={label} className="flex flex-col-reverse gap-1 rounded-[18px] bg-canvas-card p-[18px] shadow-[inset_0_0_0_1px_var(--color-canvas-line)]">
              <dt className="text-[13px] text-muted">{label}</dt>
              <dd className="m-0 font-display text-4xl font-extrabold text-violet-deep">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="flex flex-col gap-4 rounded-[24px] bg-canvas-card p-[22px] shadow-[inset_0_0_0_1px_var(--color-canvas-line)]">
            <div className="flex items-baseline justify-between">
              <h2 className="m-0 font-display text-[22px] font-extrabold">Ten tydzień</h2>
              <span className="text-[13px] text-muted">razem: {Math.round(all.seconds / 60)} min · {all.days} dni</span>
            </div>
            <div className="flex h-[140px] items-end gap-2.5" role="img" aria-label={`Minuty nauki w tygodniu: ${week.map((d) => `${d.label} ${d.minutes}`).join(", ")}`}>
              {week.map((d) => (
                <div key={d.date} className="flex h-full flex-1 flex-col justify-end gap-1.5">
                  <span className="text-center font-mono text-[11px] text-muted">{d.minutes || "—"}</span>
                  <div className={cx("rounded-t-md", d.minutes > 0 ? "bg-violet-deep" : "bg-[oklch(0.90_0.01_85)]")} style={{ height: `${Math.max(4, (d.minutes / max) * 100)}%` }} />
                  <span className={cx("text-center font-mono text-[11px]", d.isToday && "font-medium text-violet-deep")}>{d.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-[24px] bg-canvas-card p-[22px] shadow-[inset_0_0_0_1px_var(--color-canvas-line)]">
            <h2 className="m-0 font-display text-[22px] font-extrabold">Co warto powtórzyć</h2>
            {toReview.length === 0 ? (
              <p className="m-0 text-[15px] text-muted">Na razie nic. Tu pojawią się słowa i zwroty, przy których dziecko się pomyliło.</p>
            ) : (
              <ul className="m-0 flex list-none flex-col p-0">
                {toReview.map((r) => (
                  <li key={r.id} className="flex items-baseline justify-between gap-3 border-t border-canvas-line-soft py-3">
                    <span className="flex flex-col">
                      <b>{r.concept}</b>
                      <span className="text-[13px] text-muted">
                        {r.sourceLessonTitle} · {r.mistakes}× pomyłka
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-muted">{nextReviewLabel(r, now)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="flex flex-col gap-3 rounded-[24px] bg-canvas-card p-[22px] shadow-[inset_0_0_0_1px_var(--color-canvas-line)]">
          <h2 className="m-0 font-display text-[22px] font-extrabold">Ukończone lekcje</h2>
          {done.length === 0 ? (
            <p className="m-0 text-[15px] text-muted">Jeszcze żadnej.</p>
          ) : (
            <ul className="m-0 flex list-none flex-col p-0">
              {done.map(({ lesson, unit, progress }) => (
                <li key={lesson.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-t border-canvas-line-soft py-3">
                  <span className="flex flex-col">
                    <b>{lesson.title}</b>
                    <span className="text-[13px] text-muted">
                      {unit.title} · {lesson.outcome}
                    </span>
                  </span>
                  <span className="text-right font-mono text-xs">
                    {progress.best?.accuracy}% · {formatDuration(progress.secondsSpent)} min
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
