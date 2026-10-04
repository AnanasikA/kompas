"use client";

import { useAge } from "@/features/theme/AgeScope";
import { cx } from "@/lib/utils";
import type { AgeGroup } from "@/types";
import type { GrammarStatus, LevelState, LevelStatus } from "./cefr";

/**
 * What a CEFR level asks for and how far the learner is: words, grammar,
 * missions, and the full list of topics and "I can…" skills behind them.
 * Same data in every age mode; only the dress changes.
 */

const COPY = {
  pl: {
    eyebrow: "PROGRAM POZIOMU",
    words: "Słowa",
    grammar: "Gramatyka",
    open: (level: string) => `Co trzeba umieć, żeby zaliczyć ${level}`,
    grammarTitle: "Gramatyka",
    canDoTitle: "Po tym poziomie",
    taughtIn: "gdzie",
    gate: "Poziom zalicza komplet: wszystkie słowa, cała gramatyka i wszystkie misje. Sprawdzian poziomu dojdzie razem z lekcjami.",
    status: { PASSED_BY_TEST: "zaliczony testem", COMPLETED: "ukończony", CURRENT: "w trakcie", AHEAD: "przed Tobą" } satisfies Record<LevelStatus, string>,
    grammarStatus: { DONE: "opanowane", IN_PROGRESS: "w trakcie", TODO: "przed Tobą" } satisfies Record<GrammarStatus, string>,
  },
  en: {
    eyebrow: "LEVEL PROGRAM",
    words: "Words",
    grammar: "Grammar",
    open: (level: string) => `What it takes to clear ${level}`,
    grammarTitle: "Grammar",
    canDoTitle: "After this level",
    taughtIn: "in",
    gate: "A level is cleared by the full set: every word, every grammar topic, every mission. The level test arrives with the lessons.",
    status: { PASSED_BY_TEST: "passed in placement", COMPLETED: "cleared", CURRENT: "in progress", AHEAD: "ahead" } satisfies Record<LevelStatus, string>,
    grammarStatus: { DONE: "done", IN_PROGRESS: "in progress", TODO: "to do" } satisfies Record<GrammarStatus, string>,
  },
};

const MISSIONS: Record<AgeGroup, string> = { CHILD: "Misje", TEEN: "Missions", ADULT: "Lessons" };
const MARK: Record<GrammarStatus, string> = { DONE: "✓", IN_PROGRESS: "…", TODO: "" };

export function levelCopy(age: AgeGroup) {
  return age === "CHILD" ? COPY.pl : COPY.en;
}

function Meter({ label, value, target }: { label: string; value: number; target: number }) {
  const age = useAge();
  const percent = target ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--k-muted)]">{label}</dt>
      <dd className="m-0 flex flex-col gap-2">
        <span className={cx("leading-none", age === "ADULT" ? "font-serif text-[30px]" : age === "TEEN" ? "font-mono text-[22px]" : "font-display text-[28px] font-extrabold")}>
          {value}
          <span className="text-[0.6em] font-normal text-[var(--k-muted)]"> / {target}</span>
        </span>
        <span className={cx("block", age === "CHILD" ? "h-2.5 rounded-[5px] bg-track" : age === "TEEN" ? "h-1 bg-night-line-soft" : "h-0.5 bg-canvas-line")} role="img" aria-label={`${percent}%`}>
          <span
            className={cx("block h-full", age === "CHILD" ? "rounded-[5px] bg-amber" : age === "TEEN" ? "bg-lime" : "bg-azure")}
            // A sliver for the first words, so "8 of 400" does not look like nothing happened.
            style={{ width: value > 0 ? `max(${percent}%, 6px)` : 0 }}
          />
        </span>
      </dd>
    </div>
  );
}

export function LevelProgram({ level, className }: { level: LevelState; className?: string }) {
  const age = useAge();
  const t = levelCopy(age);
  const chip = cx(
    "px-2.5 py-1 font-mono text-[11px]",
    age === "CHILD" && "rounded-full",
    age !== "CHILD" && "rounded-md",
    level.status === "CURRENT"
      ? age === "CHILD"
        ? "bg-amber"
        : age === "TEEN"
          ? "bg-lime text-night"
          : "bg-ink text-canvas"
      : "shadow-[inset_0_0_0_1px_var(--k-line)] text-[var(--k-muted)]",
  );

  return (
    <section className={cx("flex flex-col gap-5 rounded-[var(--k-radius)] bg-[var(--k-surface)] p-[clamp(18px,2.5vw,26px)] shadow-[inset_0_0_0_1px_var(--k-line)]", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-[0.1em] text-[var(--k-muted)]">{t.eyebrow}</span>
          <h2 className="k-heading m-0 text-[clamp(22px,2.4vw,28px)] leading-none">
            {level.level} · {level.title}
          </h2>
        </div>
        <span className={chip}>
          {t.status[level.status]}
          {level.status === "CURRENT" ? ` · ${level.percent}%` : ""}
        </span>
      </div>

      <dl className="m-0 grid grid-cols-3 gap-[clamp(12px,2vw,28px)]">
        <Meter label={t.words} value={level.words.learned} target={level.words.target} />
        <Meter label={t.grammar} value={level.grammarDone} target={level.grammar.length} />
        <Meter label={MISSIONS[age]} value={level.missions.done} target={level.missions.total} />
      </dl>

      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg py-1 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
          {t.open(level.level)}
          <span aria-hidden className="font-mono text-lg leading-none transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-[var(--k-line)] pt-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-3">
            <h3 className="m-0 font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-[var(--k-muted)]">
              {t.grammarTitle} · {level.grammar.length}
            </h3>
            <ul className="m-0 flex list-none flex-col p-0">
              {level.grammar.map(({ topic, status, units }) => (
                <li key={topic.id} className="grid grid-cols-[22px_minmax(0,1fr)] gap-x-2.5 border-b border-[var(--k-line)] py-2.5 last:border-b-0">
                  <span
                    aria-hidden
                    className={cx(
                      "mt-0.5 grid size-[18px] place-items-center rounded-full text-[11px] font-bold",
                      status === "DONE" && (age === "CHILD" ? "bg-moss" : age === "TEEN" ? "bg-lime text-night" : "bg-azure text-canvas"),
                      status === "IN_PROGRESS" && (age === "CHILD" ? "bg-amber" : age === "TEEN" ? "bg-grape text-night" : "bg-ochre-soft text-ochre-ink"),
                      status === "TODO" && "shadow-[inset_0_0_0_1.5px_var(--k-line)]",
                    )}
                  >
                    {MARK[status]}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[15px] font-semibold leading-snug">
                      {topic.label}
                      <span className="sr-only"> — {t.grammarStatus[status]}</span>
                    </span>
                    <span lang="en" className="text-[13px] italic text-[var(--k-muted)]">
                      {topic.example}
                    </span>
                    {units.length > 0 && (
                      <span className="font-mono text-[11px] text-[var(--k-muted)]">
                        {t.taughtIn}: {units.map((u) => u.title).join(" · ")}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="m-0 font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-[var(--k-muted)]">{t.canDoTitle}</h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[15px] leading-snug">
              {level.canDo.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span aria-hidden className="text-[var(--k-muted)]">
                    →
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <p className="m-0 mt-1 text-[13px] leading-normal text-[var(--k-muted)]">{t.gate}</p>
          </div>
        </div>
      </details>
    </section>
  );
}

/** One tab per CEFR level of the course, with where the learner stands in each. */
export function LevelTabs({ levels, selected, onSelect }: { levels: LevelState[]; selected: string; onSelect: (level: LevelState["level"]) => void }) {
  const age = useAge();
  const t = levelCopy(age);
  return (
    <div role="tablist" aria-label={t.eyebrow} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {levels.map((level) => {
        const on = level.level === selected;
        const done = level.status === "COMPLETED" || level.status === "PASSED_BY_TEST";
        return (
          <button
            key={level.level}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onSelect(level.level)}
            className={cx(
              // `relative` keeps the screen-reader text inside the scrolling row instead of widening the page.
              "relative flex min-w-[112px] shrink-0 flex-col gap-1 px-4 py-3 text-left",
              age === "CHILD" && "rounded-2xl",
              age === "CHILD" && (on ? "bg-ink text-on-ink shadow-[0_4px_0_var(--color-ink-deep)]" : "bg-card shadow-[0_4px_0_var(--color-line)]"),
              age === "TEEN" && "rounded-lg",
              age === "TEEN" && (on ? "bg-night-raised shadow-[inset_0_0_0_2px_var(--color-lime)]" : "bg-night-surface shadow-[inset_0_0_0_1px_var(--color-night-line)]"),
              age === "ADULT" && "rounded-md",
              age === "ADULT" && (on ? "bg-ink text-canvas" : "shadow-[inset_0_0_0_1px_var(--color-canvas-line-strong)]"),
            )}
          >
            <span className="flex items-baseline justify-between gap-3">
              <span className={cx("text-xl leading-none", age === "ADULT" ? "font-serif" : "font-display font-extrabold")}>{level.level}</span>
              <span className={cx("font-mono text-[11px]", on ? "opacity-90" : "text-[var(--k-muted)]")}>
                {done ? "✓" : level.status === "CURRENT" ? `${level.percent}%` : ""}
                <span className="sr-only"> {t.status[level.status]}</span>
              </span>
            </span>
            <span className={cx("whitespace-nowrap text-xs", on ? "opacity-80" : "text-[var(--k-muted)]")}>{level.title}</span>
          </button>
        );
      })}
    </div>
  );
}
