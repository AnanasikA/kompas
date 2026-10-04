"use client";

import Link from "next/link";
import { lessonSkills, skillName } from "@/features/lessons/labels";
import { useLearner } from "@/features/progress/useLearner";
import { cx } from "@/lib/utils";
import { isPlayable } from "@/types";

const LABEL = "font-mono text-[11px] tracking-[0.12em] text-muted";

function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function AdultHome() {
  const { user, next, current, currentLevel, due, last, week, goal, now, level } = useLearner();
  const lesson = next?.lesson;
  const inProgress = lesson?.status === "IN_PROGRESS";
  const unit = next?.unit ?? current;
  const minutesWeek = week.reduce((s, d) => s + d.minutes, 0);
  const maxMinutes = Math.max(user.dailyGoal, ...week.map((d) => d.minutes));
  const upcoming = unit?.unit.lessons.find((l) => l.order > (lesson?.lesson.order ?? 0));

  return (
    <div className="grid grid-cols-1 gap-[clamp(28px,5vw,72px)] lg:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-[18px]">
          <h1 className="m-0 font-serif text-[clamp(46px,5.5vw,72px)] font-normal leading-[0.98] tracking-[-0.01em]">
            {greeting(now.getHours())}, {user.name}.
          </h1>
          <div className="flex max-w-[440px] flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-sm">
                {user.currentCEFR} → {user.targetCEFR}
              </span>
              <Link href="/journey" className="k-tap rounded text-sm text-muted underline-offset-4 hover:underline">
                {currentLevel.level}: {currentLevel.words.learned} / {currentLevel.words.target} words · {currentLevel.missions.done} / {currentLevel.missions.total} lessons
              </Link>
            </div>
            <div className="relative h-0.5 bg-canvas-line" role="img" aria-label={`${currentLevel.level} progress ${currentLevel.percent}%`}>
              <div className="absolute -top-px left-0 h-1 bg-azure" style={{ width: `${currentLevel.percent}%` }} />
            </div>
            <p className="m-0 text-[13px] text-faint">
              Level {level.level} · {level.into} / {level.needed} XP
            </p>
          </div>
        </div>

        <section className="flex flex-col gap-5 border-t border-ink pt-[22px]">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>{inProgress ? "CONTINUE" : "TODAY"}</span>
              <h2 className="m-0 text-[19px] font-semibold">{lesson ? lesson.lesson.title : "All published lessons are complete"}</h2>
              {lesson && (
                <span className="text-sm text-muted">
                  {unit?.unit.title} · lekcja {lesson.lesson.order} z {unit?.totalLessons} · {lessonSkills(lesson.lesson).map(skillName).join(" + ")}
                  {inProgress && lesson.progress ? ` · krok ${lesson.progress.currentIndex + 1}/${lesson.lesson.exercises.length}` : ""}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-[64px] leading-[0.9]">{goal.reached ? "✓" : goal.minutesLeft}</span>
              <span className="text-[15px] text-muted">{goal.reached ? "daily goal reached" : "min remaining today"}</span>
            </div>
          </div>
          <Link
            href={lesson ? `/lesson/${lesson.lesson.id}${inProgress ? "/play" : ""}` : "/journey"}
            className="flex items-center justify-between rounded-md bg-ink px-[22px] py-[18px] text-base font-medium text-canvas hover:bg-ink-hover"
          >
            <span>{lesson ? (inProgress ? "Continue lesson" : "Start lesson") : "Open learning path"}</span>
            <span aria-hidden>→</span>
          </Link>
          <div className="flex flex-wrap gap-6 text-sm text-muted">
            <Link href="/practice" className="rounded underline-offset-4 hover:underline">
              {due.length} {due.length === 1 ? "karta" : "kart"} do powtórki
            </Link>
            {last && (
              <span>
                Ostatnio: „{last.lesson.title}” · {last.progress.accuracy}%
              </span>
            )}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-9">
        <section className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className={LABEL}>MINUTES / DAY</span>
            <span className="text-[13px] text-muted">
              {minutesWeek} min · cel {user.dailyGoal * 7}
            </span>
          </div>
          <div className="relative flex h-[70px] items-end gap-2.5" role="img" aria-label={`Minutes per day: ${week.map((d) => `${d.label} ${d.minutes}`).join(", ")}`}>
            <div className="absolute inset-x-0 border-t border-dashed border-[oklch(0.75_0.02_265)]" style={{ bottom: `${(user.dailyGoal / maxMinutes) * 100}%` }} />
            {week.map((d) => (
              <div key={d.date} className={cx("flex-1", d.minutes > 0 ? (d.isToday ? "bg-azure" : "bg-ink") : "bg-canvas-line-strong")} style={{ height: `${d.minutes > 0 ? Math.max(8, (d.minutes / maxMinutes) * 100) : 4}%` }} />
            ))}
          </div>
          <div className="flex gap-2.5 font-mono text-[10px] text-faint" aria-hidden>
            {week.map((d) => (
              <span key={d.date} className={cx("flex-1", d.isToday && "text-azure")}>
                {d.label}
              </span>
            ))}
          </div>
        </section>

        {upcoming && (
          <section className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-[18px] rounded-lg border border-canvas-line bg-canvas-card p-[18px]">
            <div
              className="grid h-[120px] place-items-center rounded text-center font-mono text-[10px] text-faint"
              aria-hidden
              style={{ background: "repeating-linear-gradient(135deg,oklch(0.93 0.01 225),oklch(0.93 0.01 225) 6px,oklch(0.96 0.008 225) 6px,oklch(0.96 0.008 225) 12px)" }}
            >
              {String(upcoming.order).padStart(2, "0")}
            </div>
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>NEXT REAL-WORLD SKILL</span>
              <span className="font-serif text-[28px] leading-[1.05]">“{upcoming.title}”</span>
              <span className="text-[13px] text-muted">
                {unit?.unit.title}
                {isPlayable(upcoming) ? "" : " · w przygotowaniu"}
              </span>
            </div>
          </section>
        )}

        {due.length > 0 && (
          <section className="flex flex-col border-t border-ink">
            <span className={cx(LABEL, "py-3.5 text-ochre")}>NEEDS PRACTICE</span>
            {due.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-baseline justify-between gap-3 border-t border-canvas-line-soft py-3">
                <span className="text-[17px] font-semibold">{r.concept}</span>
                <span className="font-mono text-[11px] text-muted">{r.mistakes}×</span>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
