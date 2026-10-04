"use client";

import Link from "next/link";
import { useState } from "react";
import { getGrammarTopic } from "@/data/cefr/program";
import { getTopic } from "@/data/topics";
import { LevelProgram, LevelTabs } from "@/features/progress/LevelProgram";
import { useLearner } from "@/features/progress/useLearner";
import type { LessonState, UnitState } from "@/features/progress/units";
import { cx } from "@/lib/utils";
import { isPlayable, lessonWords, type CEFRLevel } from "@/types";

function arcProgress(u: UnitState): string {
  if (u.skipped) return "SKIPPED ✓";
  if (u.status === "LOCKED") return "LOCKED";
  if (u.comingSoon) return `SOON · ${u.totalLessons}`;
  return `${u.completedLessons}/${u.totalLessons}`;
}

function missionStatus(l: LessonState, open: boolean): { label: string; tone: "done" | "active" | "off" } {
  if (!isPlayable(l.lesson)) return { label: "SOON", tone: "off" };
  if (l.status === "COMPLETED") return { label: "CLEARED", tone: "done" };
  if (open && (l.status === "AVAILABLE" || l.status === "IN_PROGRESS")) return { label: l.status === "IN_PROGRESS" ? "IN PROGRESS" : "ACTIVE", tone: "active" };
  return { label: "LOCKED", tone: "off" };
}

export function TeenJourney() {
  const { units, levels, currentLevel, current, rank } = useLearner();
  const [levelId, setLevelId] = useState<CEFRLevel>(currentLevel.level);
  const [selectedId, setSelectedId] = useState(current?.unit.id ?? units[0].unit.id);
  const level = levels.find((l) => l.level === levelId) ?? currentLevel;
  const following = levels[levels.indexOf(level) + 1];
  const arc = level.units.find((u) => u.unit.id === selectedId) ?? level.units[0] ?? units[0];
  const cleared = units.filter((u) => u.status === "COMPLETED").length;
  const totalMissions = units.reduce((sum, u) => sum + u.totalLessons, 0);
  const missionsDone = units.reduce((sum, u) => sum + u.completedLessons, 0);
  const open = arc.status !== "LOCKED";
  const grammar = arc.unit.grammar.map((id) => getGrammarTopic(id)?.label).filter(Boolean);

  function openLevel(id: CEFRLevel) {
    setLevelId(id);
    const target = levels.find((l) => l.level === id);
    setSelectedId(target?.units.find((u) => u.unit.id === current?.unit.id)?.unit.id ?? target?.units[0]?.unit.id ?? selectedId);
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-grape">CAMPAIGN · {rank}</p>
          <h1 className="m-0 font-display text-[clamp(34px,4vw,52px)] font-extrabold leading-[0.95] tracking-[-0.035em]">Choose your arc.</h1>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          <span className="rounded-md border border-night-line px-3 py-2">
            {cleared} / {units.length} arcs cleared
          </span>
          <span className="rounded-md border border-night-line px-3 py-2">
            {missionsDone} / {totalMissions} missions
          </span>
        </div>
      </div>

      <LevelTabs levels={levels} selected={level.level} onSelect={openLevel} />
      <LevelProgram level={level} />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2" role="tabpanel" aria-label={`${level.level} arcs`}>
        {level.units.map((u) => {
          const on = u.unit.id === arc.unit.id;
          return (
            <button
              key={u.unit.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelectedId(u.unit.id)}
              className={cx(
                "flex flex-col gap-2.5 rounded-lg p-3.5 text-left hover:bg-[oklch(0.25_0.03_275)]",
                on ? "bg-night-raised shadow-[inset_0_0_0_2px_var(--color-lime)]" : "bg-night-surface shadow-[inset_0_0_0_1px_var(--color-night-line)]",
                u.status === "LOCKED" ? "text-[oklch(0.62_0.02_275)]" : "text-[oklch(0.96_0.01_275)]",
              )}
            >
              <span className="flex justify-between gap-2 font-mono text-[10px] opacity-80">
                <span>ARC {String(u.unit.order).padStart(2, "0")}</span>
                <span>{arcProgress(u)}</span>
              </span>
              <span className="font-display text-base font-extrabold leading-[1.1] tracking-[0.02em]">{u.unit.title}</span>
              <span className="block h-[3px] bg-[oklch(0.30_0.025_275)]">
                <span className={cx("block h-full", u.status === "COMPLETED" ? "bg-lime" : "bg-grape")} style={{ width: `${u.percent}%` }} />
              </span>
            </button>
          );
        })}
      </div>

      <section className="flex flex-col gap-5 rounded-xl border border-[oklch(0.30_0.03_275)] bg-[oklch(0.20_0.025_275)] p-[clamp(20px,3vw,30px)]" aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs tracking-[0.1em] text-lime">
              {arc.unit.level} · {arc.unit.title}
            </span>
            <h2 className="m-0 font-display text-[clamp(24px,2.6vw,32px)] font-extrabold tracking-[-0.02em]">{arc.unit.subtitle ?? arc.unit.title}</h2>
            {arc.unit.canDo && <p className="m-0 text-sm text-[oklch(0.75_0.02_275)]">{arc.unit.canDo}</p>}
          </div>
          <dl className="m-0 flex flex-col items-start gap-1 font-mono text-xs text-night-muted sm:items-end">
            <div className="flex gap-2">
              <dt>MISSIONS</dt>
              <dd className="m-0 text-night-text">{arc.skipped ? "skipped by calibration" : `${arc.completedLessons} / ${arc.totalLessons}`}</dd>
            </div>
            <div className="flex gap-2">
              <dt>WORDS</dt>
              <dd className="m-0 text-night-text">
                {arc.words.learned} / {arc.words.target}
              </dd>
            </div>
          </dl>
        </div>
        {grammar.length > 0 && (
          <p className="m-0 -mt-2 text-[13px] leading-normal text-night-muted">
            <span className="font-mono text-[11px] tracking-[0.1em] text-grape-text">GRAMMAR · </span>
            {grammar.join(" · ")}
          </p>
        )}
        {arc.unit.topic && getTopic(arc.unit.topic) && (
          <Link href={`/practice/topic/${arc.unit.topic}`} className="k-tap -mt-2 self-start font-mono text-[11px] tracking-[0.1em] text-lime">
            ENDLESS ROUNDS · {getTopic(arc.unit.topic)?.title.en.toUpperCase()} →
          </Link>
        )}

        {!open && (
          <p className="m-0 rounded-lg border border-dashed border-[oklch(0.40_0.03_275)] p-[30px] text-center text-[15px] text-night-muted">
            Locked · odblokujesz po ukończeniu arcu {arc.blockedBy?.title}.
          </p>
        )}
        {open && arc.lessons.length === 0 && (
          <p className="m-0 rounded-lg border border-dashed border-[oklch(0.40_0.03_275)] p-[30px] text-center text-[15px] text-night-muted">Missions for this arc are in preparation.</p>
        )}
        {open && arc.lessons.length > 0 && (
          <div className="overflow-x-auto px-0.5 pb-2.5 pt-1.5">
            <ol className="relative m-0 flex min-w-max list-none items-stretch gap-3 p-0">
              <li aria-hidden className="absolute inset-x-0 top-1/2 h-0.5" style={{ background: "repeating-linear-gradient(90deg,oklch(0.40 0.03 275) 0 6px,transparent 6px 12px)" }} />
              {arc.lessons.map((l, i) => {
                const status = missionStatus(l, open);
                const final = i === arc.lessons.length - 1;
                const body = (
                  <>
                    <span className="flex justify-between font-mono text-[10px]">
                      <span className="text-night-muted">{final ? "FINAL" : `M${String(i + 1).padStart(2, "0")}`}</span>
                      <span className={cx(status.tone === "done" && "text-lime", status.tone === "active" && "text-grape", status.tone === "off" && "text-[oklch(0.55_0.02_275)]")}>{status.label}</span>
                    </span>
                    <span className="min-h-10 font-display text-lg font-extrabold leading-[1.1]">{l.lesson.title}</span>
                    {lessonWords(l.lesson) > 0 && <span className="font-mono text-[10px] text-night-muted">+{lessonWords(l.lesson)} words</span>}
                    {final && status.tone === "off" && <span className="size-[22px] rotate-45 border-2 border-grape" aria-hidden />}
                    {status.tone === "active" && <span className="font-mono text-[11px] text-lime">PLAY →</span>}
                    {status.tone === "done" && <span className="font-mono text-[11px] text-night-muted">REPLAY →</span>}
                  </>
                );
                const cls = cx(
                  "relative flex w-[170px] flex-col gap-2.5 rounded-lg p-4 text-left",
                  status.tone === "active" ? "bg-night-raised shadow-[inset_0_0_0_2px_var(--color-lime),0_0_24px_oklch(0.88_0.17_125/0.18)]" : "bg-night-surface shadow-[inset_0_0_0_1px_var(--color-night-line)]",
                  status.tone === "off" && "opacity-55",
                );
                return (
                  <li key={l.lesson.id}>
                    {status.tone !== "off" ? (
                      <Link href={`/lesson/${l.lesson.id}`} className={cls}>
                        {body}
                      </Link>
                    ) : (
                      <div className={cls}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-[oklch(0.40_0.03_275)] p-[clamp(16px,2.5vw,24px)]">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-lime">{following ? `NEXT LEVEL · ${following.level} ${following.title.toUpperCase()}` : "END OF CAMPAIGN"}</span>
          <p className="m-0 text-sm text-night-body">
            {level.status === "COMPLETED" || level.status === "PASSED_BY_TEST"
              ? `${level.level} cleared.`
              : `Odblokujesz po całym programie ${level.level}: ${level.words.target} słów, ${level.grammar.length} zagadnień gramatycznych, ${level.missions.total} misji.`}
          </p>
          <p className="m-0 font-mono text-[11px] text-night-muted">
            NOW · {level.words.learned}/{level.words.target} words · {level.grammarDone}/{level.grammar.length} grammar · {level.missions.done}/{level.missions.total} missions
          </p>
        </div>
        {following && (
          <button type="button" onClick={() => openLevel(following.level)} className="rounded-md px-4 py-3 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--color-night-line)] hover:bg-night-raised">
            Preview {following.level} →
          </button>
        )}
      </div>

    </div>
  );
}
