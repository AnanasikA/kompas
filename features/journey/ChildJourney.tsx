"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, RotateCw, Star } from "lucide-react";
import { LockIcon } from "@/components/ui/icons";
import { getGrammarTopic } from "@/data/cefr/program";
import { getTopic } from "@/data/topics";
import { lessonMaxXp } from "@/features/learning/engine/xp";
import type { LevelState } from "@/features/progress/cefr";
import { LevelProgram, LevelTabs } from "@/features/progress/LevelProgram";
import { useLearner } from "@/features/progress/useLearner";
import type { LessonState, UnitState } from "@/features/progress/units";
import { AVATAR_COLORS, initialOf } from "@/features/theme/avatar";
import { cx, plural } from "@/lib/utils";
import { isPlayable, lessonWords, missionKind, type CEFRLevel } from "@/types";

/**
 * THE MAP
 *
 * One CEFR level at a time. Every world of the level is an island, every
 * mission a numbered stone on the path across it; a dotted line leads from
 * island to island and ends at the gate to the next level. Nothing here is
 * decoration: stones, counters and locks are read from the learner's state.
 */

type Selection = { unitId: string; lessonId?: string };
type StoneKind = "done" | "current" | "open" | "locked" | "planned";

/** Island colours of the prototype map, reused in order. */
const TINTS = ["oklch(0.90 0.08 145)", "oklch(0.92 0.08 85)", "oklch(0.90 0.05 305)", "oklch(0.91 0.05 35)", "oklch(0.94 0.06 95)"];
const RADII = ["46px 64px 52px 70px", "64px 48px 68px 50px", "52px 70px 46px 62px"];

function stoneKind(l: LessonState, nextId: string | undefined): StoneKind {
  if (l.status === "COMPLETED") return "done";
  if (l.status === "PLANNED") return "planned";
  if (l.status === "LOCKED") return "locked";
  return l.lesson.id === nextId ? "current" : "open";
}

function worldBadge(state: UnitState, isCurrent: boolean): string {
  if (state.skipped) return "ZALICZONY TESTEM";
  if (state.status === "COMPLETED") return "UKOŃCZONY";
  if (state.status === "LOCKED") return "ZABLOKOWANY";
  if (state.comingSoon) return "W PRZYGOTOWANIU";
  if (state.awaitingContent) return "CIĄG DALSZY WKRÓTCE";
  return isCurrent ? "TU JESTEŚ" : "OTWARTY";
}

const words = (n: number) => `${n} ${plural(n, "słowo", "słowa", "słów")}`;
const missions = (n: number) => `${n} ${plural(n, "misja", "misje", "misji")}`;

/** Width of an element, kept up to date. The stones are laid out from it. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Snake layout: left to right, then back, as many stones per row as fit. */
function layoutStones(count: number, width: number) {
  const cell = width < 480 ? 64 : 88;
  const cols = Math.max(3, Math.min(count, Math.floor(width / cell)));
  const colWidth = width / cols;
  const rowHeight = 128; // tall enough for the avatar pin to stand between two rows
  const top = 62; // room for the avatar pin above the first row
  const points = Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / cols);
    const col = row % 2 === 0 ? i % cols : cols - 1 - (i % cols);
    const wave = cols >= 6 ? Math.sin(i * 1.15) * 13 : 0;
    return { x: (col + 0.5) * colWidth, y: top + row * rowHeight + 30 + wave };
  });
  return { points, height: top + Math.ceil(count / cols) * rowHeight };
}

function Scenery({ variant }: { variant: number }) {
  return (
    <div aria-hidden className="relative hidden h-[70px] w-[132px] shrink-0 md:block">
      {variant === 0 && (
        <>
          <div className="absolute bottom-0 left-2 size-[26px] rounded-full bg-[oklch(0.62_0.15_145)]" />
          <div className="absolute bottom-0 left-[26px] size-[38px] rounded-full bg-[oklch(0.55_0.14_145)]" />
          <div className="absolute bottom-0 left-[70px] size-[22px] rounded-full bg-[oklch(0.62_0.15_145)]" />
          <div className="absolute bottom-0 left-[96px] size-[30px] rounded-full bg-[oklch(0.55_0.14_145)]" />
        </>
      )}
      {variant === 1 && (
        <>
          <div className="absolute bottom-0 left-2 h-11 w-10 rounded-t-[5px] bg-coral" />
          <div className="absolute bottom-11 left-2 h-[22px] w-10 bg-coral-deep" style={{ clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
          <div className="absolute bottom-0 left-[58px] h-9 w-[46px] rounded-t-[5px] bg-sky" />
          <div className="absolute bottom-9 left-[54px] h-3 w-[54px] rounded" style={{ background: "repeating-linear-gradient(90deg,oklch(0.97 0.02 85) 0 8px,oklch(0.62 0.17 35) 8px 16px)" }} />
        </>
      )}
      {variant === 2 && (
        <>
          <div className="absolute bottom-0 left-4 h-[60px] w-[22px] rounded-t-[3px] bg-[oklch(0.60_0.05_200)]" />
          <div className="absolute bottom-0 left-[42px] h-10 w-[18px] rounded-t-[3px] bg-[oklch(0.65_0.05_200)]" />
          <div className="absolute bottom-0 left-[66px] h-[50px] w-5 rounded-t-[3px] bg-[oklch(0.55_0.10_35)]" />
          <div className="absolute bottom-[50px] left-[62px] h-[18px] w-7 bg-[oklch(0.45_0.10_35)]" style={{ clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
          <div className="absolute bottom-0 left-[94px] size-[30px] rounded-full border-[5px] border-[oklch(0.55_0.14_305)] border-b-transparent" />
        </>
      )}
    </div>
  );
}

function Island({
  state,
  index,
  tint,
  isCurrent,
  nextId,
  selection,
  onSelect,
  avatar,
}: {
  state: UnitState;
  index: number;
  tint: string;
  isCurrent: boolean;
  nextId: string | undefined;
  selection: Selection;
  onSelect: (s: Selection) => void;
  avatar: { color: string; initial: string };
}) {
  const [pathRef, width] = useWidth<HTMLDivElement>();
  const { unit } = state;
  const { points, height } = layoutStones(state.lessons.length, width);
  const worldSelected = selection.unitId === unit.id && !selection.lessonId;
  // The dark part of the trail joins the stones the learner has actually walked.
  const walked = state.lessons.map((l) => state.skipped || l.status === "COMPLETED" || l.lesson.id === nextId);
  const from = walked.indexOf(true);
  const reached = walked.lastIndexOf(true);
  const line = (from: number, to: number) => points.slice(from, to + 1).map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <section
      aria-labelledby={`${unit.id}-title`}
      className={cx("relative flex flex-col gap-1 px-[clamp(16px,2.5vw,30px)] pb-5 pt-[clamp(18px,2.5vw,26px)]", index % 2 === 1 ? "lg:ml-10" : "lg:mr-10")}
      style={{ background: tint, borderRadius: RADII[index % RADII.length] }}
    >
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-ink px-2.5 py-[5px] font-mono text-[11px] tracking-[0.08em] text-amber">WORLD {unit.order}</span>
            <span className={cx("rounded-[5px] px-2 py-[3px] font-mono text-[10px]", isCurrent ? "bg-amber" : "bg-card/80")}>{worldBadge(state, isCurrent)}</span>
          </div>
          <h2 id={`${unit.id}-title`} className="m-0 font-display text-[clamp(26px,3vw,34px)] font-extrabold leading-none tracking-[-0.02em]">
            {unit.title}
          </h2>
          <p className="m-0 text-sm leading-snug text-ink/80">{unit.canDo}</p>
          <button
            type="button"
            aria-pressed={worldSelected}
            onClick={() => onSelect({ unitId: unit.id })}
            className={cx(
              "k-tap mt-0.5 self-start rounded-full px-3 py-1.5 font-mono text-[11px]",
              worldSelected ? "bg-ink text-on-ink" : "bg-card/85 shadow-[inset_0_0_0_1.5px_oklch(0.23_0.025_265/0.18)] hover:bg-card",
            )}
          >
            {state.words.learned} / {words(state.words.target)} · {state.completedLessons} / {missions(state.totalLessons)}
          </button>
        </div>
        <Scenery variant={index % 3} />
      </div>

      <div ref={pathRef} className="relative" style={{ height: width ? height : 160 }}>
        {width > 0 && (
          <>
            <svg aria-hidden className="pointer-events-none absolute inset-0" width={width} height={height}>
              <polyline points={line(0, points.length - 1)} fill="none" stroke="oklch(0.23 0.025 265 / 0.28)" strokeWidth="5" strokeDasharray="2 13" strokeLinecap="round" strokeLinejoin="round" />
              {reached > from && <polyline points={line(from, reached)} fill="none" stroke="var(--color-ink)" strokeWidth="6" strokeDasharray="2 13" strokeLinecap="round" strokeLinejoin="round" />}
            </svg>
            <ol className="m-0 list-none p-0">
              {state.lessons.map((l, i) => {
                const kind = state.skipped ? "done" : stoneKind(l, nextId);
                const type = missionKind(l.lesson);
                const size = kind === "current" ? 66 : type === "CHECKPOINT" ? 60 : 52;
                const selected = selection.lessonId === l.lesson.id;
                const { x, y } = points[i];
                const label = `Misja ${l.lesson.order}: ${l.lesson.title}, ${STONE_LABEL[kind]}`;
                return (
                  <li key={l.lesson.id}>
                    {kind === "current" && (
                      <div className="pointer-events-none absolute z-[2] flex -translate-x-1/2 flex-col items-center" style={{ left: x, top: y - size / 2 - 56 }} aria-hidden>
                        <div className="grid size-11 place-items-center rounded-full font-display font-extrabold shadow-[0_0_0_3px_var(--color-card),0_6px_12px_oklch(0.23_0.025_265/0.25)]" style={{ background: avatar.color }}>
                          {avatar.initial}
                        </div>
                        <div style={{ width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "9px solid var(--color-card)" }} />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelect({ unitId: unit.id, lessonId: l.lesson.id })}
                      aria-pressed={selected}
                      aria-label={label}
                      title={l.lesson.title}
                      data-current-stone={kind === "current" || undefined}
                      className={cx("absolute z-[1]", type === "CHECKPOINT" ? "rounded-[18px]" : "rounded-full")}
                      style={{ left: x - size / 2, top: y - size / 2, width: size, height: size }}
                    >
                      {kind === "current" && <span className="pointer-events-none absolute inset-0 animate-kpulse rounded-full bg-amber" />}
                      <span
                        className={cx(
                          "absolute inset-0 grid place-items-center font-display font-extrabold",
                          type === "CHECKPOINT" ? "rounded-[18px]" : "rounded-full",
                          kind === "current" && "bg-amber text-[26px]",
                          kind === "open" && "bg-amber-mid text-xl",
                          kind === "done" && "bg-moss text-xl",
                          kind === "locked" && "border-[3px] border-dashed border-[oklch(0.62_0.02_85)] bg-[oklch(0.97_0.01_85)] text-lg",
                          kind === "planned" && "border-[3px] border-dashed border-[oklch(0.70_0.02_85)] bg-[oklch(0.97_0.01_85)]/85 text-lg text-[oklch(0.50_0.02_265)]",
                        )}
                        style={{
                          boxShadow: [
                            kind === "current" ? "0 7px 0 var(--color-amber-deep)" : kind === "open" ? "0 5px 0 var(--color-amber-deep)" : kind === "done" ? "0 5px 0 var(--color-moss-deep)" : "0 4px 0 oklch(0.23 0.025 265 / 0.14)",
                            selected ? "0 0 0 4px var(--color-ink)" : "",
                          ]
                            .filter(Boolean)
                            .join(", "),
                        }}
                      >
                        {kind === "done" ? <Check aria-hidden size={24} strokeWidth={3} /> : kind === "locked" ? <LockIcon /> : type === "CHECKPOINT" ? <Star aria-hidden size={24} strokeWidth={2.4} /> : type === "REVIEW" ? <RotateCw aria-hidden size={22} strokeWidth={2.4} /> : l.lesson.order}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>
    </section>
  );
}

const STONE_LABEL: Record<StoneKind, string> = {
  done: "ukończona",
  current: "tu jesteś",
  open: "otwarta",
  locked: "zablokowana",
  planned: "w przygotowaniu",
};

const PANEL = "flex flex-col gap-2.5 rounded-3xl bg-card p-4 xl:gap-3 xl:p-5 shadow-[0_14px_40px_oklch(0.23_0.025_265/0.18),inset_0_0_0_1.5px_var(--color-line-soft)]";
const CTA = "rounded-2xl p-3.5 text-center font-display text-[17px] font-extrabold";

function MissionPanel({ state, lesson, nextId }: { state: UnitState; lesson: LessonState; nextId: string | undefined }) {
  const kind = state.skipped ? "done" : stoneKind(lesson, nextId);
  const type = missionKind(lesson.lesson);
  const count = lessonWords(lesson.lesson);
  const written = isPlayable(lesson.lesson) ? lesson.lesson : undefined;
  const typeLabel = type === "CHECKPOINT" ? "WYZWANIE" : type === "REVIEW" ? "POWTÓRKA" : `MISJA ${lesson.lesson.order}`;
  const about = written
    ? written.canDo
    : type === "REVIEW"
      ? "Powtórka wszystkich słów i zwrotów z tego świata."
      : type === "CHECKPOINT"
        ? "Wyzwanie na koniec świata: sprawdzasz wszystko, czego się tu nauczyłeś."
        : `W tej misji nauczysz się ${count} nowych słów.`;

  return (
    <div className={PANEL}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] tracking-[0.06em] text-muted">
          {typeLabel} · {state.unit.title}
        </span>
        <span className="rounded-[5px] bg-sand px-2 py-[3px] font-mono text-[10px] uppercase">{STONE_LABEL[kind]}</span>
      </div>
      <h2 className="m-0 font-display text-[clamp(19px,2.4vw,24px)] font-extrabold leading-[1.05] tracking-[-0.02em]">{lesson.lesson.title}</h2>
      {/* Below xl the panel floats over the map, so it stays short. */}
      <p className="m-0 hidden text-sm leading-[1.45] text-body xl:block">{about}</p>
      <p className="m-0 font-mono text-[11px] text-muted">
        {[count > 0 && words(count), written && `${written.estimatedMinutes} min`, written && `+${lessonMaxXp(written)} XP`].filter(Boolean).join(" · ")}
      </p>
      {written && (kind === "current" || kind === "open") && (
        <Link href={`/lesson/${written.id}`} className={cx(CTA, "bg-amber shadow-[0_5px_0_var(--color-amber-deep)] transition-transform active:translate-y-1 active:shadow-[0_1px_0_var(--color-amber-deep)]")}>
          {lesson.status === "IN_PROGRESS" ? "Graj dalej →" : "Start →"}
        </Link>
      )}
      {written && kind === "done" && (
        <Link href={`/lesson/${written.id}`} className={cx(CTA, "bg-moss shadow-[0_5px_0_var(--color-moss-deep)]")}>
          Zagraj jeszcze raz
        </Link>
      )}
      {kind === "done" && !written && <p className={cx(CTA, "m-0 bg-moss-soft text-moss-ink")}>To już umiesz ✓</p>}
      {kind === "locked" && <p className={cx(CTA, "m-0 bg-idle text-[oklch(0.45_0.015_265)]")}>Najpierw ukończ poprzednią misję</p>}
      {kind === "planned" && <p className={cx(CTA, "m-0 bg-idle text-[oklch(0.45_0.015_265)]")}>Misja w przygotowaniu</p>}
    </div>
  );
}

function WorldPanel({ state, isCurrent }: { state: UnitState; isCurrent: boolean }) {
  const { unit } = state;
  const grammar = unit.grammar.map((id) => getGrammarTopic(id)?.label).filter(Boolean);
  const topic = unit.topic ? getTopic(unit.topic) : undefined;
  return (
    <div className={PANEL}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] tracking-[0.06em] text-muted">
          WORLD {unit.order} · {unit.level}
        </span>
        <span className="rounded-[5px] bg-sand px-2 py-[3px] font-mono text-[10px]">{worldBadge(state, isCurrent)}</span>
      </div>
      <h2 className="m-0 font-display text-[clamp(22px,2.6vw,28px)] font-extrabold leading-none tracking-[-0.02em]">{unit.title}</h2>
      <p className="m-0 hidden text-sm leading-[1.45] text-body xl:block">{unit.description ?? unit.canDo}</p>
      <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-sm">
        <dt className="font-mono text-[11px] leading-5 text-muted">SŁOWA</dt>
        <dd className="m-0 font-semibold">
          {state.words.learned} / {state.words.target}
        </dd>
        <dt className="font-mono text-[11px] leading-5 text-muted">MISJE</dt>
        <dd className="m-0 font-semibold">
          {state.completedLessons} / {state.totalLessons}
        </dd>
        {grammar.length > 0 && (
          <>
            <dt className="font-mono text-[11px] leading-5 text-muted">GRAMATYKA</dt>
            <dd className="m-0">{grammar.join("; ")}</dd>
          </>
        )}
      </dl>
      {state.status === "LOCKED" ? (
        <p className={cx(CTA, "m-0 bg-idle text-[oklch(0.45_0.015_265)]")}>Odblokujesz po: {state.blockedBy?.title ?? "poprzednim świecie"}</p>
      ) : state.skipped ? (
        <p className={cx(CTA, "m-0 bg-moss-soft text-moss-ink")}>To już umiesz ✓</p>
      ) : (
        <Link href={`/journey/${unit.id}`} className={cx(CTA, isCurrent ? "bg-amber shadow-[0_5px_0_var(--color-amber-deep)]" : "bg-sand shadow-[0_5px_0_var(--color-line)]")}>
          Wejdź do {unit.title}
        </Link>
      )}
      {topic && (
        <Link href={`/practice/topic/${topic.id}`} className="k-tap self-center rounded text-sm font-semibold underline-offset-4 hover:underline">
          Trening bez końca: {topic.title.pl} →
        </Link>
      )}
    </div>
  );
}

function Gate({ level, following, onOpen }: { level: LevelState; following: LevelState | undefined; onOpen: (level: CEFRLevel) => void }) {
  const open = level.status === "COMPLETED" || level.status === "PASSED_BY_TEST";
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-[28px] bg-ink p-[clamp(16px,2.5vw,24px)] text-on-ink">
      <div aria-hidden className={cx("grid size-[72px] shrink-0 rotate-45 place-items-center rounded-[18px]", open ? "bg-moss" : "border-[3px] border-dashed border-on-ink-muted")}>
        <span className={cx("-rotate-45 font-display text-xl font-extrabold", open ? "text-ink" : "text-on-ink")}>{following ? following.level : "★"}</span>
      </div>
      <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
        <span className="font-mono text-[11px] tracking-[0.08em] text-amber">{following ? `BRAMA DO POZIOMU ${following.level}` : "META PODRÓŻY"}</span>
        <p className="m-0 text-[15px] leading-snug">
          {open
            ? `Poziom ${level.level} zaliczony.`
            : `Otworzy się po całym programie ${level.level}: ${words(level.words.target)}, ${level.grammar.length} zagadnień gramatycznych i ${missions(level.missions.total)}.`}
        </p>
        <p className="m-0 font-mono text-[11px] text-on-ink-muted">
          TERAZ: {level.words.learned} / {level.words.target} słów · {level.grammarDone} / {level.grammar.length} gramatyka · {level.missions.done} / {level.missions.total} misji
        </p>
      </div>
      {following && (
        <button type="button" onClick={() => onOpen(following.level)} className="k-on-dark rounded-2xl px-4 py-3 text-sm font-bold shadow-[inset_0_0_0_2px_var(--color-ink-line)] hover:bg-ink-hover">
          Zobacz, co jest dalej: {following.level} →
        </button>
      )}
    </div>
  );
}

export function ChildJourney() {
  const { units, levels, currentLevel, user, current, next, course } = useLearner();
  const nextId = next?.lesson.lesson.id;
  const home: Selection = next ? { unitId: next.unit.unit.id, lessonId: nextId } : { unitId: current?.unit.id ?? units[0].unit.id };
  const [levelId, setLevelId] = useState<CEFRLevel>(currentLevel.level);
  const [selection, setSelection] = useState<Selection>(home);
  const frame = useRef<HTMLDivElement>(null);

  const level = levels.find((l) => l.level === levelId) ?? currentLevel;
  const levelIndex = levels.indexOf(level);
  const selectedUnit = level.units.find((u) => u.unit.id === selection.unitId) ?? level.units[0];
  const selectedLesson = selection.lessonId ? selectedUnit?.lessons.find((l) => l.lesson.id === selection.lessonId) : undefined;
  const totalMissions = units.reduce((sum, u) => sum + u.totalLessons, 0);
  const avatar = { color: AVATAR_COLORS[user.avatarColor], initial: initialOf(user.name) };

  function openLevel(id: CEFRLevel) {
    const target = levels.find((l) => l.level === id);
    setLevelId(id);
    setSelection(id === currentLevel.level ? home : { unitId: target?.units[0]?.unit.id ?? home.unitId });
    frame.current?.scrollIntoView({ block: "start" });
  }

  // On arrival, bring the learner's stone into view if it is below the fold.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stone = frame.current?.querySelector<HTMLElement>("[data-current-stone]");
      if (!stone) return;
      const box = stone.getBoundingClientRect();
      if (box.bottom > window.innerHeight - 120 || box.top < 80) stone.scrollIntoView({ block: "center" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-5 p-[clamp(16px,3vw,36px)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="m-0 font-mono text-xs tracking-[0.08em] text-coral-ink">
            TWOJA PODRÓŻ · {units.length} ŚWIATÓW · {totalMissions} MISJI
          </p>
          <h1 className="m-0 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-none tracking-[-0.035em]">{course.title}</h1>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0 text-[13px] font-semibold">
          <li className="flex items-center gap-2 rounded-full bg-card px-3 py-2">
            <span className="grid size-3.5 place-items-center rounded-full bg-moss text-[9px]" aria-hidden>
              ✓
            </span>
            ukończone
          </li>
          <li className="flex items-center gap-2 rounded-full bg-card px-3 py-2">
            <span className="size-3.5 rounded-full bg-amber" aria-hidden />
            tu jesteś
          </li>
          <li className="flex items-center gap-2 rounded-full bg-card px-3 py-2">
            <span className="size-3 rounded-full border-2 border-dashed border-[oklch(0.60_0.02_85)]" aria-hidden />
            w przygotowaniu
          </li>
        </ul>
      </div>

      <LevelTabs levels={levels} selected={level.level} onSelect={openLevel} />
      <LevelProgram level={level} />

      <div ref={frame} className="grid scroll-mt-4 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div
          role="tabpanel"
          aria-label={`Mapa poziomu ${level.level}`}
          className="flex flex-col rounded-[36px] bg-[oklch(0.86_0.06_225)] p-[clamp(12px,2vw,26px)] shadow-[0_8px_0_oklch(0.75_0.06_225)]"
          style={{ backgroundImage: "radial-gradient(oklch(0.80 0.06 225) 1.2px,transparent 1.4px)", backgroundSize: "22px 22px" }}
        >
          {level.units.map((state, i) => (
            <div key={state.unit.id} className="flex flex-col">
              {i > 0 && <div aria-hidden className="mx-auto h-10 w-0 border-l-[5px] border-dotted border-[oklch(0.45_0.05_225)]" />}
              <Island
                state={state}
                index={i}
                tint={TINTS[(levelIndex + i) % TINTS.length]}
                isCurrent={state.unit.id === current?.unit.id}
                nextId={nextId}
                selection={selection}
                onSelect={setSelection}
                avatar={avatar}
              />
            </div>
          ))}
          <div aria-hidden className="mx-auto h-10 w-0 border-l-[5px] border-dotted border-[oklch(0.45_0.05_225)]" />
          <Gate level={level} following={levels[levelIndex + 1]} onOpen={openLevel} />
        </div>

        <aside aria-live="polite" className="sticky bottom-[96px] z-10 lg:bottom-4 xl:top-5 xl:bottom-auto">
          {selectedUnit && selectedLesson ? <MissionPanel state={selectedUnit} lesson={selectedLesson} nextId={nextId} /> : selectedUnit ? <WorldPanel state={selectedUnit} isCurrent={selectedUnit.unit.id === current?.unit.id} /> : null}
        </aside>
      </div>
    </div>
  );
}
