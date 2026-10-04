"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export type PathLevel = { level: string; words: number; grammar: number; canDo: string[] };

/**
 * The CEFR programme as a road: five stops on one line, from START to CEL.
 * Choosing a stop opens what that level takes and what you can do after it.
 */
export function LevelPath({ levels }: { levels: PathLevel[] }) {
  const [selected, setSelected] = useState(0);
  const current = levels[selected];
  const last = levels.length - 1;
  const half = 100 / (levels.length * 2); // centre of the first column, in %

  return (
    <div className="flex flex-col gap-7">
      <div className="relative">
        <div aria-hidden className="absolute top-[13px] h-0.5 bg-line-strong" style={{ left: `${half}%`, right: `${half}%` }} />
        <div
          aria-hidden
          className="absolute top-[13px] h-0.5 bg-ink transition-[width] duration-300"
          style={{ left: `${half}%`, width: `${(selected / last) * (100 - 2 * half)}%` }}
        />
        <ol className="relative m-0 grid list-none p-0" style={{ gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))` }}>
          {levels.map((item, i) => {
            const active = i === selected;
            return (
              <li key={item.level} className="flex justify-center">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(i)}
                  className="group flex flex-col items-center gap-2.5 rounded-xl px-1 pb-1.5 sm:px-3"
                >
                  <span
                    className={`grid size-7 place-items-center rounded-full border-2 transition-colors ${
                      active ? "border-ink bg-ink" : i < selected ? "border-ink bg-paper" : "border-line-strong bg-paper group-hover:border-ink"
                    }`}
                  >
                    <span className={`size-2 rotate-45 ${active ? "bg-amber" : i < selected ? "bg-ink" : "bg-transparent"}`} />
                  </span>
                  <span className={`font-display text-[clamp(15px,2.2vw,22px)] font-extrabold leading-none tracking-[-0.02em] ${active ? "text-ink" : "text-muted group-hover:text-ink"}`}>
                    {item.level}
                  </span>
                  <span className="h-3 font-mono text-[10px] tracking-[0.12em] text-faint">{i === 0 ? "START" : i === last ? "CEL" : ""}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div aria-live="polite" className="grid grid-cols-1 gap-x-10 gap-y-5 rounded-[22px] bg-card p-[clamp(20px,2.6vw,30px)] shadow-[inset_0_0_0_1.5px_var(--color-line-soft)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className="flex flex-col gap-3">
          <h3 className="m-0 font-display text-[clamp(30px,3.4vw,42px)] font-extrabold leading-none tracking-[-0.03em]">
            <span className="sr-only">Poziom </span>
            {current.level}
          </h3>
          <p className="m-0 font-mono text-xs leading-[1.7] text-muted">
            {current.words} nowych słów
            <br />
            {current.grammar} zagadnień gramatycznych
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="m-0 font-mono text-[11px] tracking-[0.1em] text-faint">PO TYM POZIOMIE</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-snug text-body">
            {current.canDo.slice(0, 4).map((line) => (
              <li key={line} className="flex gap-2.5">
                <Check aria-hidden size={16} strokeWidth={2.6} className="mt-[3px] shrink-0 text-ink" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
