"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { audioPlayer } from "@/lib/services/tts";
import { useAppStore } from "@/lib/store/app-store";
import { cx } from "@/lib/utils";
import type { StoryExercise as StoryEx, StoryPanel } from "@/types";
import { CHARACTERS, characterSrc, voiceOf } from "../mission/characters";
import { SceneBackdrop } from "../SceneIllustration";
import { withName } from "../scenes";
import type { ExerciseViewProps } from "./types";

/**
 * STORY: watch and listen. A few pictures where the new phrases are used for
 * real. Lines are read aloud one after another (each can be played again);
 * the Polish meaning sits under every line. Nothing to answer here.
 */

/** Full figures stand on the ground; the dog is smaller. */
function castHeight(pose: string): string {
  if (pose.startsWith("mia")) return "46%";
  return "88%";
}

function PanelPicture({ panel }: { panel: StoryPanel }) {
  const n = panel.cast.length;
  return (
    <div className="relative h-[clamp(220px,46vw,340px)] overflow-hidden rounded-[28px]" aria-hidden>
      <SceneBackdrop setting={panel.setting} />
      <div className={cx("absolute inset-x-[4%] bottom-0 flex h-full items-end gap-[2%]", n === 1 ? "justify-end pr-[6%]" : "justify-end")}>
        {panel.cast.map((pose, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={`${pose}-${i}`} src={characterSrc(pose)} alt="" className="w-auto max-w-[44%] object-contain object-bottom drop-shadow-[0_6px_10px_oklch(0.23_0.025_265/0.18)]" style={{ height: castHeight(pose) }} />
        ))}
      </div>
    </div>
  );
}

export function StoryExercise({ exercise, onSolved, onContinue, continueLabel }: ExerciseViewProps<StoryEx>) {
  const learnerName = useAppStore((s) => s.user?.name);
  const [at, setAt] = useState(0);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const run = useRef(0);
  const panel = exercise.panels[at];
  const last = at === exercise.panels.length - 1;

  const playFrom = useCallback(
    async (start: number, only = false) => {
      const mine = ++run.current;
      const lines = exercise.panels[at].lines;
      for (let i = start; i < (only ? start + 1 : lines.length); i++) {
        if (run.current !== mine) return;
        setSpeaking(i);
        try {
          await audioPlayer.play(voiceOf(lines[i].who, withName(lines[i].en, useAppStore.getState().user?.name)));
        } catch {
          // no speech in this browser: the text is on screen anyway
        }
        await new Promise((r) => setTimeout(r, 250));
      }
      if (run.current === mine) setSpeaking(null);
    },
    [exercise.panels, at],
  );

  // Every new picture is read aloud from the start.
  useEffect(() => {
    const id = setTimeout(() => void playFrom(0), 350);
    return () => {
      clearTimeout(id);
      run.current += 1;
      audioPlayer.stop();
    };
  }, [playFrom]);

  const next = () => {
    if (!last) {
      setAt(at + 1);
      return;
    }
    onSolved();
    onContinue();
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-[oklch(0.45_0.10_65)]">Historia · zobacz i posłuchaj</span>
          <h2 className="m-0 font-display text-[clamp(24px,3vw,34px)] font-extrabold leading-none tracking-[-0.03em]">{exercise.title}</h2>
        </div>
        <span className="font-mono text-xs text-muted" aria-label={`Obrazek ${at + 1} z ${exercise.panels.length}`}>
          {at + 1} / {exercise.panels.length}
        </span>
      </div>

      <PanelPicture panel={panel} />

      {panel.caption && <p className="m-0 rounded-2xl bg-sand px-4 py-3 text-[15px] italic leading-snug text-body">{withName(panel.caption, learnerName)}</p>}

      <ol className="m-0 flex list-none flex-col gap-2.5 p-0" aria-live="polite">
        {panel.lines.map((line, i) => {
          const person = CHARACTERS[line.who];
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => void playFrom(i, true)}
                className={cx(
                  "flex w-full items-start gap-3 rounded-[20px] bg-card px-4 py-3 text-left shadow-[0_3px_0_var(--color-line),inset_0_0_0_1.5px_var(--color-line-soft)] transition-transform",
                  speaking === i && "scale-[1.01] shadow-[0_3px_0_var(--color-amber-deep),inset_0_0_0_2.5px_var(--color-amber)]",
                )}
                aria-label={`${person.name}: ${withName(line.en, learnerName)} — ${withName(line.pl, learnerName)} Posłuchaj.`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={characterSrc(person.pose)} alt="" className="size-11 shrink-0 rounded-full object-cover object-top" style={{ background: person.tint }} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-mono text-[11px] text-muted">{person.name}</span>
                  <span className="font-display text-[19px] font-bold leading-snug">{withName(line.en, learnerName)}</span>
                  <span className="text-sm text-muted">{withName(line.pl, learnerName)}</span>
                </span>
                <span aria-hidden className={cx("mt-1 grid size-8 shrink-0 place-items-center rounded-full text-xs", speaking === i ? "bg-amber" : "bg-sky-soft")}>
                  ▶
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setAt(Math.max(0, at - 1))} disabled={at === 0} className="k-tap rounded-xl px-3 py-2 text-sm font-semibold text-muted disabled:opacity-0">
          ← Wstecz
        </button>
        <button
          type="button"
          onClick={next}
          className="rounded-[20px] bg-amber px-7 py-4 font-display text-lg font-extrabold shadow-[0_5px_0_var(--color-amber-deep)] transition-transform active:translate-y-1 active:shadow-[0_1px_0_var(--color-amber-deep)]"
        >
          {last ? (continueLabel ?? "Teraz Ty! →") : "Dalej →"}
        </button>
      </div>
    </div>
  );
}
