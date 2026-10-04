"use client";

import Link from "next/link";
import { useState } from "react";
import { getGrammarTopic } from "@/data/cefr/program";
import { getTopic } from "@/data/topics";
import { LevelProgram, LevelTabs } from "@/features/progress/LevelProgram";
import { useLearner } from "@/features/progress/useLearner";
import type { UnitState } from "@/features/progress/units";
import { cx } from "@/lib/utils";
import { isPlayable, lessonWords, type CEFRLevel } from "@/types";

const LABEL = "font-mono text-[11px] tracking-[0.12em] text-muted";

function mark(u: UnitState): string {
  if (u.status === "COMPLETED") return "✓";
  if (u.status === "LOCKED") return "";
  if (u.comingSoon) return "Soon";
  if (u.status === "IN_PROGRESS") return `${u.completedLessons}/${u.totalLessons}`;
  return "Now";
}

export function AdultJourney() {
  const { units, levels, currentLevel, user, current, course } = useLearner();
  const [levelId, setLevelId] = useState<CEFRLevel>(currentLevel.level);
  const [selectedId, setSelectedId] = useState(current?.unit.id ?? units[0].unit.id);
  const level = levels.find((l) => l.level === levelId) ?? currentLevel;
  const following = levels[levels.indexOf(level) + 1];
  const selected = level.units.find((u) => u.unit.id === selectedId) ?? level.units[0] ?? units[0];
  const totalLessons = units.reduce((sum, u) => sum + u.totalLessons, 0);
  const open = selected.status !== "LOCKED";
  const nextUp = open ? selected.lessons.find((l) => isPlayable(l.lesson) && (l.status === "IN_PROGRESS" || l.status === "AVAILABLE")) : undefined;
  const firstPlayable = selected.lessons.find((l) => isPlayable(l.lesson));
  const grammar = selected.unit.grammar.map((id) => getGrammarTopic(id)?.label).filter(Boolean);

  function openLevel(id: CEFRLevel) {
    setLevelId(id);
    const target = levels.find((l) => l.level === id);
    setSelectedId(target?.units.find((u) => u.unit.id === current?.unit.id)?.unit.id ?? target?.units[0]?.unit.id ?? selectedId);
  }

  return (
    <div className="flex flex-col gap-[clamp(24px,3vw,36px)]">
      <div className="flex flex-col gap-3.5">
        <span className={LABEL}>LEARNING PATH</span>
        <h1 className="m-0 font-serif text-[clamp(48px,6vw,80px)] font-normal leading-[0.95]">
          {user.currentCEFR} → {user.targetCEFR}
        </h1>
        <div className="flex flex-col gap-1">
          <span className="text-xl font-semibold">{course.title}</span>
          <span className="text-sm text-muted">
            {levels.length} levels · {units.length} modules · {totalLessons} lessons · {user.dailyGoal} min/day
          </span>
        </div>
      </div>

      <LevelTabs levels={levels} selected={level.level} onSelect={openLevel} />
      <LevelProgram level={level} />

      <div className="grid grid-cols-1 items-start gap-[clamp(28px,5vw,64px)] lg:grid-cols-2">
      <div className="flex flex-col gap-5" role="tabpanel" aria-label={`${level.level} modules`}>
        <div className="flex flex-col border-t border-ink">
          {level.units.map((u) => {
            const on = u.unit.id === selected.unit.id;
            const dim = u.status === "LOCKED" || u.comingSoon;
            return (
              <button
                key={u.unit.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSelectedId(u.unit.id)}
                className={cx(
                  "-mx-3.5 grid grid-cols-[36px_minmax(0,1fr)_56px] items-center gap-4 rounded-lg border-b border-canvas-line-soft px-3.5 py-4 text-left hover:bg-[oklch(0.985_0.004_90)]",
                  on && "bg-[oklch(0.995_0.003_90)] shadow-[inset_0_0_0_1px_var(--color-canvas-line-strong),0_8px_24px_oklch(0.23_0.025_265/0.06)]",
                )}
              >
                <span className="font-mono text-xs text-faint">{String(u.unit.order).padStart(2, "0")}</span>
                <span className="flex min-w-0 flex-col gap-[3px]">
                  <span className={cx("font-serif text-[23px] leading-[1.1]", dim && "text-muted")}>{u.unit.title}</span>
                  <span className="text-[13px] text-muted">{u.unit.canDo}</span>
                </span>
                <span className={cx("text-right font-mono text-xs", u.status === "COMPLETED" ? "text-azure" : dim ? "text-faint" : "text-ink")}>
                  {mark(u)}
                  <span className="sr-only">{u.status === "COMPLETED" ? " completed" : u.status === "LOCKED" ? "locked" : ""}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="m-0 text-sm leading-normal text-muted">
          {following ? `Next: ${following.level} ${following.title}. ` : ""}
          {level.status === "COMPLETED" || level.status === "PASSED_BY_TEST"
            ? `${level.level} is complete.`
            : `${level.level} is complete after all ${level.units.length} modules: ${level.words.target} words, ${level.grammar.length} grammar points, ${level.missions.total} lessons.`}{" "}
          {following && (
            <button type="button" onClick={() => openLevel(following.level)} className="k-tap rounded font-medium text-azure underline underline-offset-4">
              Preview {following.level}
            </button>
          )}
        </p>
      </div>

      <aside className="flex flex-col gap-[18px] rounded-[10px] bg-canvas-card p-7 shadow-[inset_0_0_0_1px_var(--color-canvas-line)] lg:sticky lg:top-6" aria-live="polite">
        <span className={LABEL}>
          MODULE {String(selected.unit.order).padStart(2, "0")} · {selected.unit.level}
        </span>
        <h2 className="m-0 font-serif text-[38px] font-normal leading-none">{selected.unit.title}</h2>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-[0.1em] text-azure">YOU&apos;LL BE ABLE TO</span>
          <span className="text-base leading-normal">{selected.unit.description ?? selected.unit.canDo}</span>
        </div>
        <div className="h-0.5 bg-canvas-line-soft" role="img" aria-label={`${selected.percent}% complete`}>
          <div className="h-full bg-azure" style={{ width: `${selected.percent}%` }} />
        </div>
        <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-sm">
          <dt className="font-mono text-[11px] leading-5 tracking-[0.1em] text-muted">LESSONS</dt>
          <dd className="m-0">
            {selected.completedLessons} / {selected.totalLessons}
          </dd>
          <dt className="font-mono text-[11px] leading-5 tracking-[0.1em] text-muted">WORDS</dt>
          <dd className="m-0">
            {selected.words.learned} / {selected.words.target}
          </dd>
          {grammar.length > 0 && (
            <>
              <dt className="font-mono text-[11px] leading-5 tracking-[0.1em] text-muted">GRAMMAR</dt>
              <dd className="m-0">{grammar.join("; ")}</dd>
            </>
          )}
        </dl>
        {selected.lessons.length > 0 ? (
          <ol className="m-0 flex list-none flex-col p-0">
            {selected.lessons.map((l, i) => (
              <li key={l.lesson.id} className="grid grid-cols-[28px_minmax(0,1fr)_auto] gap-2.5 border-t border-[oklch(0.92_0.008_90)] py-2.5 text-[15px]">
                <span className="font-mono text-[11px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className={cx(!isPlayable(l.lesson) && "text-muted")}>{l.lesson.title}</span>
                <span className="font-mono text-[11px] text-azure">
                  {l.status === "COMPLETED" || selected.skipped ? "✓" : l.status === "IN_PROGRESS" ? "…" : l.status === "AVAILABLE" && open ? "→" : l.status === "PLANNED" ? (lessonWords(l.lesson) ? `${lessonWords(l.lesson)} words · soon` : "soon") : ""}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="m-0 text-sm text-muted">Lekcje tego modułu są w przygotowaniu.</p>
        )}
        {selected.unit.topic && getTopic(selected.unit.topic) && (
          <Link href={`/practice/topic/${selected.unit.topic}`} className="k-tap self-start rounded text-sm font-medium text-azure underline underline-offset-4">
            Practise this topic without limit: {getTopic(selected.unit.topic)?.title.en}
          </Link>
        )}
        {selected.skipped ? (
          <p className="m-0 text-sm text-muted">Zaliczony na podstawie testu poziomującego.</p>
        ) : !open ? (
          <p className="m-0 rounded-md px-[18px] py-[15px] text-[15px] shadow-[inset_0_0_0_1px_var(--color-ink)]">Unlocks after module {String(selected.blockedBy?.order ?? 0).padStart(2, "0")}</p>
        ) : nextUp ? (
          <Link href={`/lesson/${nextUp.lesson.id}`} className="flex justify-between rounded-md bg-ink px-[18px] py-[15px] text-[15px] font-medium text-canvas hover:bg-ink-hover">
            <span>{nextUp.status === "IN_PROGRESS" ? `Resume: ${nextUp.lesson.title}` : `Open: ${nextUp.lesson.title}`}</span>
            <span aria-hidden>→</span>
          </Link>
        ) : firstPlayable ? (
          <Link href={`/lesson/${firstPlayable.lesson.id}`} className="flex justify-between rounded-md px-[18px] py-[15px] text-[15px] font-medium shadow-[inset_0_0_0_1px_var(--color-ink)]">
            <span>Review module</span>
            <span aria-hidden>→</span>
          </Link>
        ) : null}
      </aside>
      </div>
    </div>
  );
}
