"use client";

import Link from "next/link";
import { lessonMaxXp } from "@/features/learning/engine/xp";
import { lessonSkills, skillCode } from "@/features/lessons/labels";
import { useLearner } from "@/features/progress/useLearner";
import { initialOf } from "@/features/theme/avatar";
import { cx } from "@/lib/utils";

const CARD = "flex flex-col gap-4 rounded-xl bg-night-surface p-[22px]";

export function TeenHome() {
  const { user, level, rank, streak, next, currentLevel, due, week, lessons, goal } = useLearner();
  const lesson = next?.lesson;
  const inProgress = lesson?.status === "IN_PROGRESS";
  const completed = Object.values(lessons).filter((l) => l.best);
  const accuracy = completed.length ? Math.round(completed.reduce((s, l) => s + (l.best?.accuracy ?? 0), 0) / completed.length) : null;
  const minutes = week.reduce((s, d) => s + d.minutes, 0);
  const maxXp = Math.max(1, ...week.map((d) => d.xp));
  const dialogue = lesson?.lesson.exercises.find((e) => e.type === "DIALOGUE");
  const firstNode = dialogue?.type === "DIALOGUE" ? dialogue.script.nodes[dialogue.script.startNodeId] : undefined;

  return (
    <>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-[18px] sm:grid-cols-[auto_minmax(0,1fr)_auto]">
        <div className="grid size-16 place-items-center rounded-[14px] bg-grape font-display text-[28px] font-extrabold text-night shadow-[0_0_0_2px_var(--color-night),0_0_0_4px_var(--color-lime)]" aria-hidden>
          {initialOf(user.name)}
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.02em]">{user.name}</h1>
            <span className="font-mono text-xs uppercase text-lime">
              LVL {level.level} · {rank}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 max-w-[420px] flex-1 overflow-hidden rounded-[2px] bg-night-line-soft" role="img" aria-label={`${level.into} of ${level.needed} XP`}>
              <div className="h-full bg-lime" style={{ width: `${level.percent}%` }} />
            </div>
            <span className="font-mono text-xs text-[oklch(0.75_0.02_275)]">
              {level.into} / {level.needed} XP
            </span>
          </div>
        </div>
        <div className="col-span-2 flex gap-2 sm:col-span-1">
          <div className="flex flex-col rounded-lg border border-night-line px-3.5 py-2.5">
            <span className="font-mono text-xl font-medium">{streak}</span>
            <span className="text-[11px] text-night-muted">dni z rzędu</span>
          </div>
          <div className="flex flex-col rounded-lg border border-night-line px-3.5 py-2.5">
            <span className="font-mono text-xl font-medium text-lime">{accuracy == null ? "—" : `${accuracy}%`}</span>
            <span className="text-[11px] text-night-muted">accuracy</span>
          </div>
          <Link href="/journey" className="flex flex-col rounded-lg border border-night-line px-3.5 py-2.5 hover:bg-night-surface">
            <span className="font-mono text-xl font-medium">
              {currentLevel.words.learned}
              <span className="text-xs text-night-muted"> / {currentLevel.words.target}</span>
            </span>
            <span className="text-[11px] text-night-muted">{currentLevel.level} words</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="grid grid-cols-1 overflow-hidden rounded-xl border border-lime/50 md:grid-cols-2 lg:col-span-2">
          <div className="flex flex-col gap-3.5 bg-night-surface p-[26px]">
            {lesson && next ? (
              <>
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.1em] text-grape">
                  {inProgress ? "IN PROGRESS" : "NEXT MISSION"} · {next.unit.unit.level} / {next.unit.unit.title}
                </p>
                <h2 className="m-0 font-display text-[clamp(28px,3vw,38px)] font-extrabold leading-[1.02] tracking-[-0.025em]">{lesson.lesson.title}</h2>
                <p className="m-0 text-sm leading-normal text-[oklch(0.78_0.02_275)]">{next.unit.unit.description ?? lesson.lesson.canDo}</p>
                <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                  <span className="rounded bg-night-line-soft px-[9px] py-[5px]">{lesson.lesson.estimatedMinutes} MIN</span>
                  <span className="rounded bg-night-line-soft px-[9px] py-[5px] text-lime">+{lessonMaxXp(lesson.lesson)} XP</span>
                  <span className="rounded bg-night-line-soft px-[9px] py-[5px]">{lessonSkills(lesson.lesson).map(skillCode).join(" · ")}</span>
                  {inProgress && lesson.progress && (
                    <span className="rounded bg-night-line-soft px-[9px] py-[5px] text-grape">
                      TASK {lesson.progress.currentIndex + 1}/{lesson.lesson.exercises.length}
                    </span>
                  )}
                </div>
                <Link href={`/lesson/${lesson.lesson.id}${inProgress ? "/play" : ""}`} className="self-start rounded-md bg-lime px-[26px] py-3.5 text-base font-bold text-night hover:bg-lime-hover">
                  Continue →
                </Link>
              </>
            ) : (
              <>
                <p className="m-0 font-mono text-[11px] tracking-[0.1em] text-grape">ALL CLEARED</p>
                <h2 className="m-0 font-display text-[clamp(28px,3vw,38px)] font-extrabold leading-[1.02]">More missions are on the way.</h2>
                <Link href="/journey" className="self-start rounded-md bg-lime px-[26px] py-3.5 text-base font-bold text-night">
                  Open campaign →
                </Link>
              </>
            )}
          </div>
          <div
            className="relative hidden min-h-60 items-end p-[18px] md:flex"
            aria-hidden
            style={{ background: "repeating-linear-gradient(135deg,oklch(0.24 0.03 280),oklch(0.24 0.03 280) 10px,oklch(0.26 0.035 280) 10px,oklch(0.26 0.035 280) 20px)" }}
          >
            {firstNode && (
              <div className="flex w-full flex-col gap-2">
                <div className="self-start rounded-[12px_12px_12px_2px] bg-[oklch(0.30_0.03_275)] px-3.5 py-2.5 text-sm">{firstNode.line}</div>
                <div className="self-end rounded-[12px_12px_2px_12px] bg-grape px-3.5 py-2.5 text-sm font-semibold text-night">{firstNode.options[0]?.text}</div>
              </div>
            )}
          </div>
        </section>

        <section className={CARD}>
          <div className="flex items-baseline justify-between">
            <h2 className="m-0 font-display text-xl font-extrabold">Today</h2>
            <span className="font-mono text-[11px] text-night-muted">goal {goal.goalMinutes} min</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm">
              <span>Daily goal</span>
              <span className="font-mono text-lime">
                {goal.minutesDone}/{goal.goalMinutes}
                {goal.reached ? " ✓" : ""}
              </span>
            </div>
            <div className="h-1.5 rounded-[2px] bg-night-line-soft">
              <div className="h-full bg-lime" style={{ width: `${goal.percent}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm">
              <span>Practice queue</span>
              <span className={cx("font-mono", due.length ? "text-grape" : "text-lime")}>{due.length ? `${due.length} due` : "clear ✓"}</span>
            </div>
            <p className="m-0 text-xs text-night-muted">{due.length ? due.slice(0, 3).map((r) => r.concept).join(" · ") : "Mistakes from missions land here."}</p>
          </div>
          <Link href="/practice" className="mt-auto flex justify-between rounded-md px-3.5 py-3 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--color-night-line)]">
            <span>Open practice</span>
            <span aria-hidden>→</span>
          </Link>
        </section>

        <section className={CARD}>
          <h2 className="m-0 font-display text-xl font-extrabold">Stats · this week</h2>
          <dl className="m-0 grid grid-cols-3 gap-2.5">
            {[
              [accuracy == null ? "—" : `${accuracy}%`, "accuracy"],
              [`${completed.length}`, "missions"],
              [`${minutes}`, "min"],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="text-[11px] text-night-muted">{label}</dt>
                <dd className="m-0 font-mono text-2xl">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex h-20 items-end gap-1.5" role="img" aria-label={`XP per day: ${week.map((d) => `${d.label} ${d.xp}`).join(", ")}`}>
            {week.map((d) => (
              <div key={d.date} className="flex h-full flex-1 flex-col justify-end gap-1.5">
                <div
                  className={cx("rounded-[2px]", d.xp > 0 ? (d.isToday ? "bg-lime" : "bg-[oklch(0.35_0.04_275)]") : "border border-dashed border-[oklch(0.50_0.03_275)]")}
                  style={{ height: `${d.xp > 0 ? Math.max(12, (d.xp / maxXp) * 100) : 8}%` }}
                />
                <span className={cx("text-center font-mono text-[10px]", d.isToday ? "text-lime" : "text-night-muted")}>{d.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
