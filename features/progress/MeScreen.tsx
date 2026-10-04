"use client";

import Link from "next/link";
import { totals } from "@/features/gamification/activity";
import { countByStatus } from "@/features/practice/review";
import { useAge } from "@/features/theme/AgeScope";
import { cx, formatDuration } from "@/lib/utils";
import { isPlayable } from "@/types";
import { LevelProgram } from "./LevelProgram";
import { useLearner } from "./useLearner";

const CARD = "flex flex-col gap-4 rounded-[var(--k-radius)] bg-[var(--k-surface)] p-[clamp(20px,3vw,28px)] shadow-[inset_0_0_0_1px_var(--k-line)]";
const LABEL = "font-mono text-[11px] tracking-[0.1em] text-[var(--k-muted)]";

/** Saved progress: level, XP, finished lessons, time, review state. */
export function MeScreen() {
  const age = useAge();
  const { user, level, rank, course, lessons, activity, reviews, streak, units, currentLevel } = useLearner();
  const pl = age !== "TEEN";
  const done = course.units.flatMap((u) => u.lessons.filter(isPlayable).map((lesson) => ({ lesson, unit: u, progress: lessons[lesson.id] }))).filter((x) => x.progress?.best);
  const sum = totals(activity);
  const counts = countByStatus(reviews);
  const avg = done.length ? Math.round(done.reduce((s, d) => s + (d.progress.best?.accuracy ?? 0), 0) / done.length) : null;
  const unitsDone = units.filter((u) => u.status === "COMPLETED" && !u.skipped).length;

  const stats: [string, string][] = [
    [`${user.xp}`, "XP"],
    [`${done.length}`, pl ? "ukończone lekcje" : "missions cleared"],
    [avg == null ? "—" : `${avg}%`, pl ? "średnia trafność" : "avg accuracy"],
    [`${Math.round(sum.seconds / 60)}`, pl ? "minut nauki" : "minutes"],
    [`${sum.days}`, pl ? "dni z nauką" : "active days"],
    [`${streak}`, pl ? "dni z rzędu" : "day streak"],
  ];

  return (
    <div className={cx("flex flex-col gap-[22px]", age === "CHILD" && "max-w-[1240px] p-[clamp(20px,3vw,40px)]")}>
      <div className="flex flex-col gap-2">
        <p className={cx("m-0", LABEL)}>{pl ? "TWÓJ ANGIELSKI · CEFR" : "STATS"}</p>
        <h1 className="k-heading m-0 text-[clamp(34px,4.5vw,56px)] leading-none">{pl ? "Twój postęp" : "Your performance."}</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section
          className={cx(
            "flex flex-col gap-5 p-[clamp(24px,3vw,36px)]",
            age === "CHILD" && "rounded-[36px_36px_36px_10px] bg-amber",
            age === "TEEN" && "rounded-xl bg-night-surface shadow-[inset_0_0_0_1px_oklch(0.88_0.17_125/0.5)]",
            age === "ADULT" && "border-t border-ink px-0",
          )}
        >
          <div className="flex items-center gap-6">
            <div
              aria-hidden
              className={cx(
                "m-3 grid size-[96px] shrink-0 rotate-45 place-items-center",
                age === "CHILD" && "rounded-[22px] bg-ink shadow-[0_8px_0_var(--color-ink-deep)]",
                age === "TEEN" && "rounded-[14px] border-2 border-lime shadow-[0_0_40px_oklch(0.88_0.17_125/0.2)]",
                age === "ADULT" && "rounded-lg border border-ink",
              )}
            >
              <span className={cx("-rotate-45 text-[32px]", age === "CHILD" && "font-display font-extrabold text-amber", age === "TEEN" && "font-display font-extrabold text-lime", age === "ADULT" && "font-serif")}>{user.currentCEFR}</span>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <h2 className="k-heading m-0 text-[clamp(24px,3vw,34px)] leading-[1.05]">{rank}</h2>
              <p className="m-0 text-sm">
                Level {level.level} · {level.into} / {level.needed} XP
              </p>
              <div className={cx("h-3", age === "CHILD" ? "rounded-md bg-amber-mid" : age === "TEEN" ? "bg-night-line-soft" : "h-0.5 bg-canvas-line")} role="img" aria-label={`${level.percent}%`}>
                <div className={cx("h-full", age === "CHILD" ? "rounded-md bg-ink" : age === "TEEN" ? "bg-lime" : "bg-azure")} style={{ width: `${level.percent}%` }} />
              </div>
            </div>
          </div>
          <p className="m-0 text-[15px]">
            {pl ? "Cel" : "Target"}: <b>{user.targetCEFR}</b> · {user.dailyGoal} min {pl ? "dziennie" : "a day"}
            {unitsDone > 0 && ` · ${unitsDone} ${pl ? "ukończone światy/moduły" : "arcs cleared"}`}
          </p>
        </section>

        <section className={CARD}>
          <h2 className="k-heading m-0 text-2xl">{pl ? "W liczbach" : "Numbers"}</h2>
          <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
            {stats.map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse gap-1">
                <dt className="text-[13px] text-[var(--k-muted)]">{label}</dt>
                <dd className={cx("m-0 text-[32px] leading-none", age === "ADULT" ? "font-serif" : age === "TEEN" ? "font-mono" : "font-display font-extrabold")}>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <LevelProgram level={currentLevel} />

      <section className={CARD}>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="k-heading m-0 text-2xl">{pl ? "Ukończone lekcje" : "Cleared missions"}</h2>
          <span className={LABEL}>{done.length}</span>
        </div>
        {done.length === 0 ? (
          <p className="m-0 text-[15px] text-[var(--k-muted)]">{pl ? "Jeszcze żadnej. Po pierwszej lekcji zobaczysz tu jej wynik." : "None yet. Your first cleared mission shows up here."}</p>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0">
            {done.map(({ lesson, unit, progress }) => (
              <li key={lesson.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-[var(--k-line)] py-3.5">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <Link href={`/lesson/${lesson.id}`} className="rounded font-semibold underline-offset-4 hover:underline">
                    {lesson.title}
                  </Link>
                  <span className="text-[13px] text-[var(--k-muted)]">
                    {unit.title} · {lesson.level} · {progress.completedAt ? new Date(progress.completedAt).toLocaleDateString(pl ? "pl-PL" : "en-GB") : ""}
                    {progress.completions > 1 ? ` · ×${progress.completions}` : ""}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5 font-mono text-xs">
                  <span>
                    {progress.best?.accuracy}% · {progress.best?.xpEarned} XP
                  </span>
                  <span className="text-[var(--k-muted)]">{formatDuration(progress.secondsSpent)} min</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={CARD}>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="k-heading m-0 text-2xl">{pl ? "Powtórki" : "Practice queue"}</h2>
          <Link href="/practice" className="k-tap rounded text-sm font-semibold underline-offset-4 hover:underline">
            {pl ? "Otwórz →" : "Open →"}
          </Link>
        </div>
        <dl className="m-0 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(
            [
              [counts.new, pl ? "nowe" : "new"],
              [counts.learning, pl ? "w nauce" : "learning"],
              [counts.weak, pl ? "trudne" : "hard"],
              [counts.mastered, pl ? "opanowane" : "mastered"],
            ] as const
          ).map(([value, label]) => (
            <div key={label} className="flex flex-col-reverse gap-1">
              <dt className="text-[13px] text-[var(--k-muted)]">{label}</dt>
              <dd className={cx("m-0 text-[28px] leading-none", age === "ADULT" ? "font-serif" : age === "TEEN" ? "font-mono" : "font-display font-extrabold")}>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
