"use client";

import Link from "next/link";
import { dailyMissions } from "@/features/gamification/activity";
import { lessonMaxXp } from "@/features/learning/engine/xp";
import { useLearner } from "@/features/progress/useLearner";
import { AVATAR_COLORS, initialOf } from "@/features/theme/avatar";
import { cx, formatDuration, plural } from "@/lib/utils";
import { isPlayable, missionKind } from "@/types";
import { coast, islandTint, PropAt, themeOf } from "@/features/journey/MapArt";
import { Postcard } from "./Postcard";

const POSTCARD_TILT = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1", "rotate-2"];

export function ChildHome() {
  const data = useLearner();
  const { user, level, rank, streak, goal, next, current, currentLevel, levels, due, last, week, units, activity, now, course } = data;
  const unit = next?.unit ?? current;
  const lesson = next?.lesson;
  const inProgress = lesson?.status === "IN_PROGRESS";
  const continueHref = lesson ? `/lesson/${lesson.lesson.id}${inProgress ? "/play" : ""}` : "/journey";
  const missions = dailyMissions(activity, now, { unitTitle: unit?.unit.title ?? null, reviewsDue: due.length });
  const missionsDone = missions.filter((m) => m.complete).length;
  const weak = due.filter((r) => r.status === "weak").length;
  const levelTitle = unit ? course.levels.find((l) => l.level === unit.unit.level)?.title : undefined;
  const completedUnits = units.filter((u) => u.status === "COMPLETED");
  // Postcards: every world collected so far, the one in progress and the next one ahead.
  const placed = levels.flatMap((l, levelIndex) => l.units.map((state, indexInLevel) => ({ state, levelIndex, indexInLevel })));
  const currentAt = placed.findIndex((p) => p.state.unit.id === unit?.unit.id);
  const postcards = placed.filter((p, i) => p.state.status === "COMPLETED" || (currentAt >= 0 && i >= currentAt && i <= currentAt + 1)).slice(-6);

  // Scene path: the three lessons before the current one, the current one, the two after it.
  const lessonList = unit?.lessons ?? [];
  const at = lesson ? lessonList.findIndex((l) => l.lesson.id === lesson.lesson.id) : -1;
  const before = at > 0 ? lessonList.slice(Math.max(0, at - 3), at) : [];
  const after = at >= 0 ? lessonList.slice(at + 1, at + 3) : [];
  // Six places on the preview trail: three behind, the learner's mission, two ahead.
  const slots: (Slot | undefined)[] = [
    ...Array.from({ length: 3 - before.length }, () => undefined),
    ...before.map((l) => ({ label: String(l.lesson.order), state: l.status === "COMPLETED" ? ("done" as const) : ("ahead" as const) })),
    lesson ? { label: isPlayable(lesson.lesson) ? String(lesson.lesson.order) : "★", state: "current" as const } : undefined,
    ...after.map((l) => ({ label: missionKind(l.lesson) === "CHECKPOINT" ? "★" : missionKind(l.lesson) === "REVIEW" ? "↻" : String(l.lesson.order), state: "ahead" as const })),
  ];

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
            {lesson ? "GRAJ DALEJ →" : "OTWÓRZ MAPĘ →"}
          </Link>
        </div>

        <Link href="/journey" aria-label="Otwórz mapę" className="relative hidden min-h-[400px] overflow-hidden bg-[oklch(0.86_0.06_225)] sm:block">
          <IslandPreview unitId={unit?.unit.id ?? "child"} slots={slots} avatar={{ color: AVATAR_COLORS[user.avatarColor], initial: initialOf(user.name) }} />
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
          <ul className="m-0 flex list-none gap-4 overflow-x-auto px-1 pb-3 pt-2">
            {postcards.map(({ state: u, levelIndex, indexInLevel }, i) => {
              const state = u.status === "COMPLETED" ? "collected" : u.unit.id === unit?.unit.id ? "progress" : "ahead";
              return (
                <li key={u.unit.id}>
                  <Postcard
                    unitId={u.unit.id}
                    title={u.unit.title}
                    order={u.unit.order}
                    level={u.unit.level}
                    tint={islandTint(levelIndex, indexInLevel)}
                    state={state}
                    percent={u.percent}
                    tilt={POSTCARD_TILT[i % POSTCARD_TILT.length]}
                  />
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

type Slot = { label: string; state: "done" | "current" | "ahead" };

/** Where the six stones of the preview lie, on a 600×400 drawing. */
const SLOT_AT = [
  { x: 70, y: 336 },
  { x: 150, y: 290 },
  { x: 228, y: 330 },
  { x: 312, y: 268 },
  { x: 404, y: 316 },
  { x: 488, y: 272 },
];
const TRAIL = "M-10,360 C30,350 46,340 70,336 S124,292 150,290 S204,334 228,330 S284,270 312,268 S378,320 404,316 S464,274 488,272 S560,250 620,240";

/** The learner's island in the treasure-map style of the map: their world's things and the next few missions. */
function IslandPreview({ unitId, slots, avatar }: { unitId: string; slots: (Slot | undefined)[]; avatar: { color: string; initial: string } }) {
  const [first, second, third] = themeOf(unitId);
  const current = slots.findIndex((s) => s?.state === "current");
  const firstWalked = slots.findIndex((s) => s);
  const pin = SLOT_AT[current >= 0 ? current : 3];
  return (
    <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 600 400" preserveAspectRatio="xMidYMax slice">
      <defs>
        <pattern id="home-sea" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="11" cy="11" r="1.3" fill="oklch(0.80 0.06 225)" />
        </pattern>
        <clipPath id="home-walked">
          <rect x={SLOT_AT[Math.max(0, firstWalked)].x} y="0" width={Math.max(0, pin.x - SLOT_AT[Math.max(0, firstWalked)].x)} height="400" />
        </clipPath>
      </defs>
      <rect width="600" height="400" fill="url(#home-sea)" />
      <g transform="translate(-40 92)">
        <path d={coast(unitId, 680, 380, -6)} fill="oklch(0.92 0.035 215)" />
        <path d={coast(unitId, 680, 380, 2)} fill="oklch(0.90 0.055 85)" stroke="oklch(0.50 0.06 60)" strokeWidth={2.5} />
        <path d={coast(`${unitId}.land`, 680, 380, 13)} fill="oklch(0.88 0.08 145)" />
      </g>
      {[
        [40, 40],
        [250, 64],
        [130, 100],
      ].map(([x, y]) => (
        <path key={x} d={`M${x} ${y} c6 -8 12 -8 18 0 c6 -8 12 -8 18 0`} fill="none" stroke="oklch(0.97 0.02 225 / 0.9)" strokeWidth={2.4} strokeLinecap="round" />
      ))}
      <PropAt id="ship" x={362} y={92} size={60} />
      <PropAt id={first} x={96} y={214} size={84} />
      <PropAt id={second} x={500} y={200} size={72} />
      <PropAt id={third ?? "tree"} x={250} y={204} size={58} />
      <path d={TRAIL} fill="none" stroke="oklch(0.23 0.025 265 / 0.3)" strokeWidth={4} strokeDasharray="9 9" strokeLinecap="round" />
      {firstWalked >= 0 && firstWalked < current && <path d={TRAIL} clipPath="url(#home-walked)" fill="none" stroke="var(--color-ink)" strokeWidth={5} strokeDasharray="9 9" strokeLinecap="round" />}
      {slots.map((slot, i) => {
        if (!slot) return null;
        const { x, y } = SLOT_AT[i];
        if (slot.state === "current") {
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={33} fill="var(--color-amber)" className="animate-kpulse" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              <circle cx={x} cy={y + 6} r={33} fill="var(--color-amber-deep)" />
              <circle cx={x} cy={y} r={33} fill="var(--color-amber)" />
              <text x={x} y={y + 9} textAnchor="middle" fontSize="26" fontWeight="800" fontFamily="var(--font-display)" fill="var(--color-ink)">
                {slot.label}
              </text>
            </g>
          );
        }
        if (slot.state === "done") {
          return (
            <g key={i}>
              <circle cx={x} cy={y + 4} r={22} fill="var(--color-moss-deep)" />
              <circle cx={x} cy={y} r={22} fill="var(--color-moss)" />
              <path d={`M${x - 8} ${y} l6 6 l11 -12`} fill="none" stroke="var(--color-ink)" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        }
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={21} fill="oklch(0.97 0.01 85)" stroke="oklch(0.62 0.02 85)" strokeWidth={3} strokeDasharray="5 4" />
            <text x={x} y={y + 6} textAnchor="middle" fontSize="16" fontWeight="800" fontFamily="var(--font-display)" fill="oklch(0.50 0.02 265)">
              {slot.label}
            </text>
          </g>
        );
      })}
      <g transform={`translate(${pin.x} ${pin.y - 92})`}>
        <circle r={22} fill={avatar.color} stroke="var(--color-card)" strokeWidth={3} />
        <text y={7} textAnchor="middle" fontSize="18" fontWeight="800" fontFamily="var(--font-display)" fill="var(--color-ink)">
          {avatar.initial}
        </text>
        <path d="M-7 24 L7 24 L0 33 Z" fill="var(--color-card)" />
      </g>
    </svg>
  );
}
