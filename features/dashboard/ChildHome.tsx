"use client";

import Link from "next/link";
import { dailyMissions } from "@/features/gamification/activity";
import { lessonMaxXp } from "@/features/learning/engine/xp";
import { useLearner } from "@/features/progress/useLearner";
import { AVATAR_COLORS, initialOf } from "@/features/theme/avatar";
import { cx, formatDuration, plural } from "@/lib/utils";
import { isPlayable } from "@/types";

const POSTCARD_COLORS = ["var(--color-moss)", "var(--color-sky)", "var(--color-violet)", "var(--color-coral)", "var(--color-amber)"];
const POSTCARD_TILT = ["-rotate-[4deg]", "rotate-3", "-rotate-2", "rotate-2"];

export function ChildHome() {
  const data = useLearner();
  const { user, level, rank, streak, goal, next, current, currentLevel, due, last, week, units, activity, now, course } = data;
  const unit = next?.unit ?? current;
  const lesson = next?.lesson;
  const inProgress = lesson?.status === "IN_PROGRESS";
  const continueHref = lesson ? `/lesson/${lesson.lesson.id}${inProgress ? "/play" : ""}` : "/journey";
  const missions = dailyMissions(activity, now, { unitTitle: unit?.unit.title ?? null, reviewsDue: due.length });
  const missionsDone = missions.filter((m) => m.complete).length;
  const weak = due.filter((r) => r.status === "weak").length;
  const levelTitle = unit ? course.levels.find((l) => l.level === unit.unit.level)?.title : undefined;
  const completedUnits = units.filter((u) => u.status === "COMPLETED");

  // Scene path: the three lessons before the current one, the current one, the two after it.
  const lessonList = unit?.lessons ?? [];
  const at = lesson ? lessonList.findIndex((l) => l.lesson.id === lesson.lesson.id) : -1;
  const before = at > 0 ? lessonList.slice(Math.max(0, at - 3), at) : [];

  return (
    <div className="flex max-w-[1280px] flex-col gap-[26px] p-[clamp(20px,3vw,40px)]">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex flex-col gap-3">
          <h1 className="m-0 font-display text-[clamp(36px,4vw,52px)] font-extrabold leading-none tracking-[-0.035em]">Cześć, {user.name}!</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ink px-3 py-[7px] font-mono text-[13px] font-medium text-amber">Level {level.level}</span>
            <span className="rounded-full px-3 py-1.5 font-mono text-[13px] font-medium shadow-[inset_0_0_0_1.5px_var(--color-ink)]">{rank}</span>
            <Link href="/journey" className="k-tap rounded-full bg-amber-soft px-3 py-[7px] font-mono text-[13px] font-medium hover:bg-amber-mid">
              {currentLevel.level}: {currentLevel.words.learned} / {currentLevel.words.target} słów →
            </Link>
            <span className="flex items-center gap-2 rounded-full bg-coral-soft px-3 py-[7px] font-mono text-[13px] font-medium">
              <span className="size-3 -rotate-45 rounded-[50%_50%_50%_0] bg-[oklch(0.62_0.17_35)]" aria-hidden />
              {streak > 0 ? `${streak} ${plural(streak, "dzień", "dni", "dni")} nauki` : "zacznij serię dziś"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3.5 rounded-full bg-card py-2.5 pl-2.5 pr-[18px] shadow-[0_4px_0_var(--color-line)]">
          <div
            className="grid size-14 place-items-center rounded-full"
            style={{ background: `conic-gradient(var(--color-moss) 0 ${goal.percent}%, oklch(0.92 0.01 85) ${goal.percent}% 100%)` }}
            role="img"
            aria-label={`Cel dnia: ${goal.minutesDone} z ${goal.goalMinutes} minut`}
          >
            <div className="grid size-[42px] place-items-center rounded-full bg-card font-mono text-xs font-medium">
              {goal.minutesDone}/{goal.goalMinutes}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold">Cel dnia</span>
            <span className="text-[13px] text-muted">{goal.reached ? "osiągnięty! ✓" : `jeszcze ${goal.minutesLeft} ${plural(goal.minutesLeft, "minuta", "minuty", "minut")}`}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 overflow-hidden rounded-[40px_40px_40px_12px] shadow-[0_8px_0_var(--color-amber-deep)] lg:grid-cols-2">
        <div className="flex flex-col gap-4 bg-amber p-[clamp(24px,3vw,36px)]">
          {unit ? (
            <>
              <div className="flex items-center gap-2.5">
                <span className="rounded-md bg-ink px-2.5 py-[5px] font-mono text-xs tracking-[0.08em] text-amber">WORLD {unit.unit.order}</span>
                <span className="font-mono text-xs uppercase">
                  {unit.unit.level}
                  {levelTitle && levelTitle !== unit.unit.level ? ` · ${levelTitle}` : ""}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="m-0 font-display text-[clamp(40px,4.5vw,60px)] font-extrabold leading-[0.95] tracking-[-0.035em]">{unit.unit.title}</h2>
                {unit.unit.subtitle && <p className="m-0 font-display text-xl font-semibold opacity-80">{unit.unit.subtitle}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.max(unit.lessons.length, 1)}, 1fr)` }} aria-hidden>
                  {unit.lessons.map((l) => (
                    <div
                      key={l.lesson.id}
                      className={cx("h-2.5 rounded-[5px]", l.status === "COMPLETED" ? "bg-ink" : l.lesson.id === lesson?.lesson.id ? "bg-card" : "bg-ink/18")}
                    />
                  ))}
                </div>
                <p className="m-0 font-mono text-xs">
                  {unit.completedLessons} / {unit.totalLessons} {plural(unit.totalLessons, "misja", "misje", "misji")} · {unit.words.learned} / {unit.words.target} słów
                </p>
              </div>
              {lesson ? (
                <div className="flex flex-col gap-1 rounded-[18px] bg-amber-mid px-4 py-3.5">
                  <span className="font-mono text-[11px] tracking-[0.06em]">
                    MISJA {lesson.lesson.order} Z {unit.totalLessons} · {inProgress ? "W TRAKCIE" : "NASTĘPNA"}
                  </span>
                  <span className="font-display text-2xl font-extrabold tracking-[-0.01em]">{lesson.lesson.title}</span>
                  <span className="text-sm">
                    {inProgress && lesson.progress
                      ? `zadanie ${Math.min(lesson.progress.currentIndex + 1, lesson.lesson.exercises.length)} z ${lesson.lesson.exercises.length} · zdobyte ${lesson.progress.xpEarned} XP`
                      : `${lesson.lesson.estimatedMinutes} min · ${lesson.lesson.exercises.length} zadań · +${lessonMaxXp(lesson.lesson)} XP`}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-1 rounded-[18px] bg-amber-mid px-4 py-3.5">
                  <span className="font-mono text-[11px] tracking-[0.06em]">CIĄG DALSZY WKRÓTCE</span>
                  <span className="text-sm">Następne misje tego świata są w przygotowaniu. Możesz powtórzyć ukończone albo potrenować.</span>
                </div>
              )}
            </>
          ) : (
            <p className="m-0 text-base">Twoja mapa czeka.</p>
          )}
          <Link
            href={continueHref}
            className="rounded-[20px] bg-ink px-3 py-5 text-center font-display text-[clamp(16px,5vw,22px)] font-extrabold tracking-[0.02em] text-on-ink shadow-[0_6px_0_var(--color-ink-deep)] transition-transform hover:bg-ink-soft active:translate-y-[5px] active:shadow-[0_1px_0_var(--color-ink-deep)]"
          >
            {lesson ? "CONTINUE ADVENTURE →" : "OTWÓRZ MAPĘ →"}
          </Link>
        </div>

        <Link href="/journey" aria-label="Otwórz mapę" className="relative hidden min-h-[400px] overflow-hidden bg-[oklch(0.86_0.06_225)] sm:block">
          <span aria-hidden>
            <span className="absolute -bottom-20 -left-10 h-[300px] w-[115%] rounded-[50%_50%_0_0] bg-[oklch(0.91_0.08_85)]" />
            <span className="absolute -right-[60px] -top-[60px] size-[200px] rounded-full bg-[oklch(0.90_0.05_225)]" />
            <span className="absolute bottom-[200px] left-[12%] h-[70px] w-[54px] rounded-t-md bg-coral" />
            <span className="absolute bottom-[270px] left-[12%] h-[30px] w-[54px] bg-coral-deep" style={{ clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
            <span className="absolute bottom-[200px] h-[100px] w-[70px] rounded-t-lg bg-violet" style={{ left: "calc(12% + 62px)" }} />
            <span className="absolute bottom-[250px] size-[18px] rounded bg-[oklch(0.97_0.02_85)]" style={{ left: "calc(12% + 74px)" }} />
            <span className="absolute bottom-[250px] size-[18px] rounded bg-[oklch(0.97_0.02_85)]" style={{ left: "calc(12% + 100px)" }} />
            <span className="absolute bottom-[200px] right-[16%] h-[84px] w-[90px] rounded-t-lg bg-sky" />
            <span
              className="absolute bottom-[282px] h-[22px] w-[106px] rounded-md"
              style={{ right: "calc(16% - 8px)", background: "repeating-linear-gradient(90deg,oklch(0.97 0.02 85) 0 14px,oklch(0.62 0.17 35) 14px 28px)" }}
            />
            <span className="absolute bottom-[200px] h-10 w-7 rounded-t-[14px] bg-ink" style={{ right: "calc(16% + 30px)" }} />
            <span className="absolute bottom-[210px] right-[6%] size-[30px] rounded-full bg-[oklch(0.62_0.15_145)]" />
            <span className="absolute bottom-[196px] h-[18px] w-1.5 bg-[oklch(0.45_0.06_60)]" style={{ right: "calc(6% + 12px)" }} />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 400" preserveAspectRatio="none">
              <polyline points="30,370 110,330 190,350 270,300 350,330 420,290" fill="none" stroke="var(--color-ink)" strokeWidth="4" strokeDasharray="2 11" strokeLinecap="round" />
            </svg>
            {[
              ["6%", "20px"],
              ["22%", "58px"],
              ["38%", "38px"],
            ].map(([left, bottom], i) => {
              const item = before[before.length - 3 + i];
              const done = item?.status === "COMPLETED";
              return (
                <span
                  key={left}
                  className={cx(
                    "absolute grid size-[34px] place-items-center rounded-full text-sm font-extrabold",
                    done ? "bg-moss shadow-[0_4px_0_var(--color-moss-deep)]" : "border-[3px] border-dashed border-ink/40",
                  )}
                  style={{ left, bottom }}
                >
                  {done ? "✓" : ""}
                </span>
              );
            })}
            <span className="absolute bottom-[84px] left-[52%] size-[66px] rounded-full">
              <span className="pointer-events-none absolute inset-0 animate-kpulse rounded-full bg-amber" />
              <span className="absolute inset-0 grid place-items-center rounded-full bg-amber font-display text-2xl font-extrabold shadow-[0_6px_0_var(--color-amber-deep)]">
                {lesson && isPlayable(lesson.lesson) ? lesson.lesson.order : "★"}
              </span>
            </span>
            <span className="absolute bottom-[166px] flex flex-col items-center" style={{ left: "calc(52% + 12px)" }}>
              <span className="grid size-[42px] place-items-center rounded-full font-display font-extrabold shadow-[0_0_0_3px_var(--color-card)]" style={{ background: AVATAR_COLORS[user.avatarColor] }}>
                {initialOf(user.name)}
              </span>
              <span style={{ width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "9px solid oklch(0.995 0.004 85)" }} />
            </span>
            <span className="absolute bottom-[58px] left-[70%] size-[34px] rounded-full border-[3px] border-dashed border-ink/40" />
            <span className="absolute bottom-24 left-[84%] size-[30px] rotate-45 border-[3px] border-dashed border-ink/40" />
          </span>
          <span className="absolute right-[18px] top-[18px] rounded-full bg-card px-3 py-[7px] font-mono text-xs">Otwórz mapę →</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-[18px] md:grid-cols-2 xl:grid-cols-3">
        <section className="flex flex-col gap-3.5 rounded-[28px_28px_28px_8px] bg-card p-[22px] shadow-[0_4px_0_var(--color-line),inset_0_0_0_1.5px_var(--color-line-soft)]">
          <div className="flex items-baseline justify-between">
            <h2 className="m-0 font-display text-[22px] font-extrabold">Misje dnia</h2>
            <span className="font-mono text-xs text-muted">
              {missionsDone} / {missions.length}
            </span>
          </div>
          {missions.map((m) => (
            <div key={m.id} className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3">
              <span
                className={cx("grid size-[26px] place-items-center rounded-full text-[13px] font-extrabold text-card", m.complete ? "bg-moss-deep" : "shadow-[inset_0_0_0_2px_oklch(0.80_0.02_85)]")}
                aria-hidden
              >
                {m.complete ? "✓" : ""}
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-[15px] font-semibold">
                  {m.title}
                  {m.complete && <span className="sr-only"> — ukończona</span>}
                </span>
                <span className="h-1.5 rounded-[3px] bg-track">
                  <span className={cx("block h-full rounded-[3px]", m.complete ? "bg-moss" : "bg-amber")} style={{ width: `${Math.round((m.done / m.target) * 100)}%` }} />
                </span>
              </span>
              <span className="font-mono text-xs">
                {m.done}/{m.target}
              </span>
            </div>
          ))}
          <p className="m-0 mt-auto border-t border-dashed border-line pt-2.5 text-[13px] text-muted">Misje odnawiają się każdego dnia.</p>
        </section>

        <section className="relative flex flex-col gap-3.5 overflow-hidden rounded-[28px] bg-coral-soft p-[22px]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-display text-[56px] font-extrabold leading-[0.9] text-[oklch(0.48_0.15_35)]">{due.length}</span>
              <h2 className="m-0 text-base font-bold">{plural(due.length, "rzecz do powtórki", "rzeczy do powtórki", "rzeczy do powtórki")}</h2>
            </div>
            {weak > 0 && (
              <span className="rounded-md bg-card px-2 py-1 font-mono text-[11px]">
                {weak} {plural(weak, "TRUDNA", "TRUDNE", "TRUDNYCH")}
              </span>
            )}
          </div>
          <div className="relative h-24" aria-hidden={due.length === 0}>
            <div className="absolute left-7 right-2 top-0 h-[66px] rotate-[4deg] rounded-2xl bg-[oklch(0.88_0.07_35)]" />
            <div className="absolute left-3.5 right-5 top-2 h-[66px] -rotate-2 rounded-2xl bg-[oklch(0.92_0.05_35)]" />
            <div className="absolute left-0 right-8 top-5 flex h-[70px] items-center justify-between gap-3 rounded-2xl bg-card px-[18px] shadow-[0_4px_0_oklch(0.85_0.05_35)]">
              {due[0] ? (
                <>
                  <span className="truncate font-display text-[22px] font-extrabold">{due[0].concept}</span>
                  <span className="shrink-0 font-mono text-[11px] text-[oklch(0.48_0.15_35)]">{due[0].mistakes}× pomyłka</span>
                </>
              ) : (
                <span className="text-[15px] font-semibold text-muted">Nic nie czeka. Błędy z lekcji trafią tutaj.</span>
              )}
            </div>
          </div>
          <Link
            href="/practice"
            className="mt-auto rounded-2xl bg-card p-3.5 text-center font-display text-[17px] font-extrabold shadow-[0_4px_0_oklch(0.80_0.08_35)] transition-transform active:translate-y-[3px] active:shadow-[0_1px_0_oklch(0.80_0.08_35)]"
          >
            {due.length > 0 ? `Powtórz · ok. ${Math.max(1, Math.round(due.length / 2))} min` : "Otwórz trening"}
          </Link>
        </section>

        <section className="flex flex-col gap-3.5 rounded-[8px_28px_28px_28px] bg-ink p-[22px] text-[oklch(0.97_0.008_85)] md:col-span-2 xl:col-span-1">
          <p className="m-0 font-mono text-[11px] tracking-[0.08em] text-amber">OSTATNIA LEKCJA</p>
          {last ? (
            <>
              <div className="flex items-center gap-4">
                <div className="grid size-[92px] shrink-0 -rotate-[4deg] place-items-center rounded-[20px] bg-amber font-display text-[28px] font-extrabold text-ink" aria-hidden>
                  {last.progress.accuracy}%
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="m-0 font-display text-[21px] font-extrabold">{last.lesson.title}</h2>
                  <p className="m-0 text-[13px] leading-[1.45] text-on-ink-muted">
                    {last.progress.accuracy}% trafnych · +{last.progress.xpEarned} XP · {formatDuration(last.progress.secondsSpent)} min
                  </p>
                </div>
              </div>
              <Link href={`/lesson/${last.lesson.id}`} className="mt-auto rounded-2xl p-3.5 text-center text-[15px] font-bold shadow-[inset_0_0_0_2px_oklch(0.40_0.03_265)] hover:bg-ink-soft">
                Powtórz lekcję
              </Link>
            </>
          ) : (
            <>
              <h2 className="m-0 font-display text-[21px] font-extrabold">Jeszcze przed Tobą</h2>
              <p className="m-0 text-[13px] leading-[1.45] text-on-ink-muted">Po pierwszej lekcji zobaczysz tu swój wynik: trafność, XP i czas.</p>
              <Link href={continueHref} className="mt-auto rounded-2xl p-3.5 text-center text-[15px] font-bold shadow-[inset_0_0_0_2px_oklch(0.40_0.03_265)] hover:bg-ink-soft">
                Zacznij pierwszą lekcję
              </Link>
            </>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-[28px] bg-sand p-[22px]">
          <div className="flex items-baseline justify-between">
            <h2 className="m-0 font-display text-[22px] font-extrabold">Moje pocztówki</h2>
            <Link href="/journey" className="k-tap rounded text-sm font-semibold">
              Kolekcja · {completedUnits.length}/{units.length} →
            </Link>
          </div>
          <ul className="m-0 flex list-none gap-3 overflow-x-auto px-0.5 pb-2.5 pt-1.5">
            {[...completedUnits, ...(unit && unit.status !== "COMPLETED" ? [unit] : [])].slice(0, 6).map((u, i) => {
              const done = u.status === "COMPLETED";
              return (
                <li
                  key={u.unit.id}
                  className={cx(
                    "relative flex h-[140px] w-[110px] shrink-0 flex-col justify-between rounded-xl p-2.5",
                    POSTCARD_TILT[i % POSTCARD_TILT.length],
                    done ? "shadow-[0_6px_14px_oklch(0.23_0.025_265/0.15)]" : "border-[3px] border-dashed border-[oklch(0.75_0.06_75)] bg-[oklch(0.96_0.03_85)]",
                  )}
                  style={done ? { background: POSTCARD_COLORS[i % POSTCARD_COLORS.length] } : undefined}
                >
                  {done ? <span className="h-[30px] w-[26px] self-end rounded-[3px] border-2 border-dashed border-ink/50" aria-hidden /> : <span className="font-mono text-[11px]">{u.percent}%</span>}
                  <span className={cx("font-display text-[15px] font-extrabold leading-[1.05]", !done && "text-[oklch(0.48_0.11_65)]")}>
                    {u.unit.title}
                    <span className="sr-only">{done ? " — zdobyta" : " — w trakcie"}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="flex flex-col gap-4 rounded-[28px] bg-card p-[22px] shadow-[inset_0_0_0_1.5px_var(--color-line-soft)]">
          <div className="flex items-baseline justify-between">
            <h2 className="m-0 font-display text-[22px] font-extrabold">Twój tydzień</h2>
            <span className="font-mono text-xs text-muted">
              {week.filter((d) => d.active).length} z 7 dni
            </span>
          </div>
          <ul className="m-0 grid list-none grid-cols-7 gap-2 p-0">
            {week.map((d) => (
              <li key={d.date} className="flex flex-col items-center gap-1.5">
                <span
                  className={cx(
                    "grid aspect-square w-full max-w-11 place-items-center rounded-full text-xs font-extrabold",
                    d.active ? "bg-amber" : d.isToday ? "border-2 border-dashed border-ink" : "bg-[oklch(0.92_0.01_85)]",
                  )}
                >
                  {d.active ? "✓" : ""}
                </span>
                <span className="font-mono text-[11px]">
                  {d.label}
                  <span className="sr-only">{d.active ? " — nauka" : d.isToday ? " — dziś" : " — bez nauki"}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-1.5 border-t border-dashed border-line pt-3">
            <div className="flex justify-between text-sm font-semibold">
              <span>
                Level {level.level} → {level.level + 1}
              </span>
              <span className="font-mono font-normal">
                {level.into} / {level.needed} XP
              </span>
            </div>
            <div className="h-3 rounded-md bg-track">
              <div className="h-full rounded-md bg-amber" style={{ width: `${level.percent}%` }} />
            </div>
            <p className="m-0 text-[13px] text-muted">
              Jeszcze {level.needed - level.into} XP i odblokujesz Level {level.level + 1}.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
