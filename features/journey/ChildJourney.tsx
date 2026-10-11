"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
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
import { Compass, Prop, Ship, Waves, coast, islandProps, islandTint, polyline, propSpots, themeOf, trail } from "./MapArt";
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

/**
 * Walk to the next mission, played once after a finished lesson
 * (the summary opens the map as /journey?done=<lessonId>):
 *   finished – the finished stone turns green with a burst of sparks
 *   walk     – the trail is drawn to the next stone and the avatar walks there
 *   arrived  – the next stone opens with a bubble saying which mission is next
 */
type Arrival = { unitId: string; from: number; to?: number; phase: "finished" | "walk" | "arrived" };
const WALK_STARTS = 750;
const WALK_MS = 1000;
const BUBBLE_MS = 3200;
type StoneKind = "done" | "current" | "open" | "locked" | "planned";

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

/** Wide screens (Tailwind xl) have a right column next to the map. */
const WIDE = "(min-width: 1280px)";
function useWide() {
  return useSyncExternalStore(
    (change) => {
      const query = window.matchMedia(WIDE);
      query.addEventListener("change", change);
      return () => query.removeEventListener("change", change);
    },
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}

/** Size of an element, kept up to date. The island and its stones are laid out from it. */
function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setSize({ width: el.clientWidth, height: el.clientHeight });
    const observer = new ResizeObserver(([entry]) => setSize({ width: Math.round(entry.contentRect.width), height: Math.round(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height) }));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, size] as const;
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
  arrival,
}: {
  state: UnitState;
  index: number;
  tint: string;
  isCurrent: boolean;
  nextId: string | undefined;
  selection: Selection;
  onSelect: (s: Selection) => void;
  avatar: { color: string; initial: string };
  arrival?: Arrival;
}) {
  const [pathRef, { width }] = useSize<HTMLDivElement>();
  const [islandRef, island] = useSize<HTMLElement>();
  const { unit } = state;
  const { samples, stones: points, at, height } = trail(unit.id, state.lessons.length, width || 320);
  const theme = themeOf(unit.id);
  const spots = width ? propSpots(unit.id, width < 480 ? 3 : 6, width, height, samples, points) : [];
  const props = islandProps(unit.id, spots.length);
  const propSize = width < 480 ? 56 : 68;
  const worldSelected = selection.unitId === unit.id && !selection.lessonId;
  // The dark part of the trail joins the stones the learner has actually walked.
  const walked = state.lessons.map((l) => state.skipped || l.status === "COMPLETED" || l.lesson.id === nextId);
  const from = walked.indexOf(true);
  const walking = arrival && arrival.to !== undefined && arrival.phase !== "arrived" ? arrival : undefined;
  // While the avatar walks, the dark trail ends at the finished stone; the new piece is drawn on top.
  const reached = walking ? walking.from : walked.lastIndexOf(true);
  const line = (from: number, to: number) => polyline(samples.slice(at[from], at[to] + 1));
  const pinTop = (i: number, size: number) => points[i].y - size / 2 - 56;

  return (
    <section
      ref={islandRef}
      aria-labelledby={`${unit.id}-title`}
      className={cx("relative flex flex-col gap-1 px-[clamp(34px,4vw,52px)] pb-9 pt-10", index % 2 === 1 ? "lg:ml-10" : "lg:mr-10")}
    >
      {island.width > 0 && (
        // The island: shallow water, a sandy shore with a dark coast line, and the land.
        <svg aria-hidden className="pointer-events-none absolute inset-0" width={island.width} height={island.height}>
          <path d={coast(unit.id, island.width, island.height, -6)} fill="oklch(0.92 0.035 215)" />
          <path d={coast(unit.id, island.width, island.height, 2)} fill="oklch(0.90 0.055 85)" stroke="oklch(0.50 0.06 60)" strokeWidth={2.5} />
          <path d={coast(`${unit.id}.land`, island.width, island.height, 13)} fill={tint} />
        </svg>
      )}
      <div className="relative flex items-end justify-between gap-4">
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
        <Prop id={theme[0]} size={84} className="mr-5 hidden shrink-0 self-center sm:block" />
      </div>

      <div ref={pathRef} className="relative" style={{ height: width ? height : 160 }}>
        {width > 0 && (
          <>
            <svg aria-hidden className="pointer-events-none absolute inset-0" width={width} height={height}>
              <path d={line(0, points.length - 1)} fill="none" stroke="oklch(0.23 0.025 265 / 0.3)" strokeWidth="4" strokeDasharray="9 9" strokeLinecap="round" strokeLinejoin="round" />
              {reached > from && <path d={line(from, reached)} fill="none" stroke="var(--color-ink)" strokeWidth="5" strokeDasharray="9 9" strokeLinecap="round" strokeLinejoin="round" />}
              {walking && walking.phase === "walk" && (
                <>
                  <mask id={`${unit.id}-walk`} maskUnits="userSpaceOnUse">
                    <path d={line(walking.from, walking.to!)} fill="none" stroke="white" strokeWidth="14" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" className="animate-kdraw" />
                  </mask>
                  <path d={line(walking.from, walking.to!)} mask={`url(#${unit.id}-walk)`} fill="none" stroke="var(--color-ink)" strokeWidth="5" strokeDasharray="9 9" strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}
            </svg>
            {spots.map((p, k) => (
              <Prop key={k} id={props[k]} size={propSize} className="pointer-events-none absolute" style={{ left: p.x - propSize / 2, top: p.y - propSize + 6 }} />
            ))}
            {walking && (
              // The avatar on its way: it starts on the finished stone and walks to the next one.
              <div
                aria-hidden
                className={cx("pointer-events-none absolute z-[3] flex flex-col items-center", walking.phase === "finished" && "-translate-x-1/2")}
                style={
                  walking.phase === "walk"
                    ? {
                        // Walks along the trail itself, feet on the path.
                        left: 0,
                        top: 0,
                        offsetPath: `path("${polyline(samples.slice(at[walking.from], at[walking.to!] + 1).map((p) => ({ x: p.x, y: p.y - 30 })))}")`,
                        offsetAnchor: "50% 100%",
                        offsetRotate: "0deg",
                        animation: `kwalk ${WALK_MS}ms cubic-bezier(0.45,0,0.3,1) both`,
                      }
                    : { left: points[walking.from].x, top: pinTop(walking.from, 52) }
                }
              >
                <div className={cx("flex flex-col items-center", walking.phase === "walk" && "animate-khop")}>
                  <div className="grid size-11 place-items-center rounded-full font-display font-extrabold shadow-[0_0_0_3px_var(--color-card),0_6px_12px_oklch(0.23_0.025_265/0.25)]" style={{ background: avatar.color }}>
                    {avatar.initial}
                  </div>
                  <div style={{ width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "9px solid var(--color-card)" }} />
                </div>
              </div>
            )}
            <ol className="m-0 list-none p-0">
              {state.lessons.map((l, i) => {
                const realKind = state.skipped ? "done" : stoneKind(l, nextId);
                // Until the avatar gets there, the next stone still looks closed.
                const kind: StoneKind = walking && i === walking.to ? "locked" : realKind;
                const justFinished = arrival?.from === i && arrival.phase === "finished";
                const justOpened = arrival?.to === i && arrival.phase === "arrived";
                const type = missionKind(l.lesson);
                const size = kind === "current" ? 66 : type === "CHECKPOINT" ? 60 : 52;
                const selected = selection.lessonId === l.lesson.id;
                const { x, y } = points[i];
                const label = `Misja ${l.lesson.order}: ${l.lesson.title}, ${STONE_LABEL[realKind]}`;
                return (
                  <li key={l.lesson.id}>
                    {justOpened && (
                      <p
                        role="status"
                        className="pointer-events-none absolute z-[4] m-0 -translate-x-1/2 animate-kpop whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 font-display text-sm font-extrabold text-on-ink shadow-[0_6px_14px_oklch(0.23_0.025_265/0.25)]"
                        style={{ left: Math.min(Math.max(x, 84), width - 84), top: y - size / 2 - 96 }}
                      >
                        {missionKind(l.lesson) === "LESSON" ? `Misja ${l.lesson.order} czeka!` : missionKind(l.lesson) === "REVIEW" ? "Czas na powtórkę!" : "Czas na wyzwanie!"}
                      </p>
                    )}
                    {justFinished && (
                      <div aria-hidden className="pointer-events-none absolute z-[2]" style={{ left: x, top: y }}>
                        {Array.from({ length: 10 }, (_, k) => (
                          <span
                            key={k}
                            className="absolute -left-1.5 -top-1.5 size-3 animate-kspark rounded-full"
                            style={{ "--a": `${k * 36}deg`, background: k % 2 ? "var(--color-amber)" : "var(--color-moss)", animationDelay: "120ms" } as React.CSSProperties}
                          />
                        ))}
                      </div>
                    )}
                    {kind === "current" && !(arrival && arrival.to !== undefined && arrival.phase !== "arrived") && (
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
                      className={cx("absolute z-[1]", type === "CHECKPOINT" ? "rounded-[18px]" : "rounded-full", (justFinished || justOpened) && "animate-kpop")}
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

/** Open water between two islands: the route goes on by sea, past a ship or some waves. */
function SeaCrossing({ index }: { index: number }) {
  const right = index % 2 === 0;
  return (
    <div aria-hidden className="relative h-[76px]">
      <svg className="absolute left-1/2 top-0 -translate-x-1/2" width="60" height="76" viewBox="0 0 60 76">
        <path d={right ? "M30 0 C54 22 6 52 30 76" : "M30 0 C6 22 54 52 30 76"} fill="none" stroke="oklch(0.40 0.06 230)" strokeWidth={3.5} strokeDasharray="8 8" strokeLinecap="round" />
      </svg>
      <Ship className="absolute top-2" style={right ? { right: "14%" } : { left: "14%" }} />
      <Waves className="absolute top-6" style={right ? { left: "18%" } : { right: "18%" }} />
    </div>
  );
}

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
  const wide = useWide();
  const router = useRouter();
  const done = useSearchParams().get("done");
  // The map renders on the client only (behind LearnerGate), so the motion setting can be read right away.
  const [arrival, setArrival] = useState<Arrival | undefined>(() => {
    const unit = done ? currentLevel.units.find((u) => u.lessons.some((l) => l.lesson.id === done)) : undefined;
    const from = unit ? unit.lessons.findIndex((l) => l.lesson.id === done) : -1;
    if (!unit || from < 0 || unit.lessons[from].status !== "COMPLETED" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const to = unit.lessons[from + 1]?.lesson.id === nextId ? from + 1 : undefined;
    return { unitId: unit.unit.id, from, to, phase: "finished" };
  });
  const walkPlays = useRef(arrival !== undefined);

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

  // Coming from a finished lesson: play the walk to the next mission once.
  useEffect(() => {
    if (done) router.replace("/journey", { scroll: false });
    if (!arrival) return;
    const { from, to, unitId } = arrival;
    const order = units.find((u) => u.unit.id === unitId)?.lessons[from].lesson.order;
    const timers = [
      window.setTimeout(() => {
        const unitBox = frame.current?.querySelector(`[aria-labelledby="${unitId}-title"]`);
        unitBox?.querySelector<HTMLElement>(`[aria-label^="Misja ${order}:"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 60),
      ...(to === undefined
        ? [window.setTimeout(() => setArrival(undefined), 1400)]
        : [
            window.setTimeout(() => setArrival((a) => a && { ...a, phase: "walk" }), WALK_STARTS),
            window.setTimeout(() => setArrival((a) => a && { ...a, phase: "arrived" }), WALK_STARTS + WALK_MS + 50),
            window.setTimeout(() => setArrival(undefined), WALK_STARTS + WALK_MS + BUBBLE_MS),
          ]),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
    // Played once, on arrival only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On arrival, bring the learner's stone into view if it is below the fold.
  useEffect(() => {
    if (walkPlays.current) return;
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
      {/* On wide screens the programme moves to the right column, above the mission card. */}
      {!wide && <LevelProgram level={level} />}

      <div ref={frame} className="grid scroll-mt-4 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div
          role="tabpanel"
          aria-label={`Mapa poziomu ${level.level}`}
          className="relative flex flex-col rounded-[36px] bg-[oklch(0.86_0.06_225)] p-[clamp(12px,2vw,26px)] shadow-[0_8px_0_oklch(0.75_0.06_225)]"
          style={{ backgroundImage: "radial-gradient(oklch(0.80 0.06 225) 1.2px,transparent 1.4px)", backgroundSize: "22px 22px" }}
        >
          <Compass className="pointer-events-none absolute -right-2 -top-4 z-[1] hidden sm:block" />
          {level.units.map((state, i) => (
            <div key={state.unit.id} className="flex flex-col">
              {i > 0 && <SeaCrossing index={i} />}
              <Island
                state={state}
                index={i}
                tint={islandTint(levelIndex, i)}
                isCurrent={state.unit.id === current?.unit.id}
                nextId={nextId}
                selection={selection}
                onSelect={setSelection}
                avatar={avatar}
                arrival={arrival?.unitId === state.unit.id && level.level === currentLevel.level ? arrival : undefined}
              />
            </div>
          ))}
          <SeaCrossing index={level.units.length} />
          <Gate level={level} following={levels[levelIndex + 1]} onOpen={openLevel} />
        </div>

        <aside aria-live="polite" className="sticky bottom-[96px] z-10 flex flex-col gap-4 lg:bottom-4 xl:top-5 xl:bottom-auto">
          {wide && <LevelProgram level={level} compact />}
          {selectedUnit && selectedLesson ? <MissionPanel state={selectedUnit} lesson={selectedLesson} nextId={nextId} /> : selectedUnit ? <WorldPanel state={selectedUnit} isCurrent={selectedUnit.unit.id === current?.unit.id} /> : null}
        </aside>
      </div>
    </div>
  );
}
