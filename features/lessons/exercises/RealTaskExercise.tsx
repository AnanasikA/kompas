"use client";

import { RichText } from "@/components/ui/RichText";
import { LineIcon, isLineIcon } from "@/components/ui/LineIcon";
import { audioPlayer } from "@/lib/services/tts";
import { useAppStore } from "@/lib/store/app-store";
import { cx } from "@/lib/utils";
import type { RealTaskExercise as RealTaskEx } from "@/types";
import type { ExerciseViewProps } from "./types";

/**
 * REAL-LIFE MISSION: the last step of a mission happens away from the screen.
 * The child ticks the steps and says when it is done; a parent confirms it in
 * the parent panel, and the stamp lands in the explorer passport.
 */
export function RealTaskExercise({ exercise, onSolved, onContinue, lessonId = "" }: ExerciseViewProps<RealTaskEx>) {
  const record = useAppStore((s) => s.realTasks?.[exercise.id]);
  const tick = useAppStore((s) => s.tickRealTask);
  const finish = useAppStore((s) => s.finishRealTask);
  const ticked = record?.ticked ?? [];
  const allTicked = exercise.steps.every((_, i) => ticked.includes(i));

  const leave = (doneNow: boolean) => {
    if (doneNow) finish(exercise.id, lessonId);
    onSolved();
    onContinue();
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-moss-ink">Misja w realu · poza ekranem</span>
        <h2 className="m-0 font-display text-[clamp(26px,3vw,36px)] font-extrabold leading-tight tracking-[-0.03em]">{exercise.title}</h2>
        <p className="m-0 text-[17px] leading-normal text-body">
          <RichText text={exercise.intro} />
        </p>
      </div>

      <section className="flex flex-col gap-2 rounded-[24px] bg-sky-soft p-4">
        <h3 className="m-0 font-mono text-[11px] uppercase tracking-[0.1em]">Zwroty do użycia</h3>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {exercise.phrases.map((p) => (
            <li key={p.en}>
              <button
                type="button"
                onClick={() => void audioPlayer.play({ text: p.en, lang: "en-GB", rate: 0.85 }).catch(() => {})}
                className="flex flex-col items-start rounded-2xl bg-card px-3.5 py-2 text-left shadow-[0_2px_0_var(--color-line)]"
              >
                <span className="font-display text-[17px] font-bold">▶ {p.en}</span>
                <span className="text-xs text-muted">{p.pl}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="m-0 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">Twoje zadanie</h3>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {exercise.steps.map((step, i) => {
            const on = ticked.includes(i);
            return (
              <li key={i}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => tick(exercise.id, lessonId, i)}
                  className={cx(
                    "flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left text-[16px] leading-snug",
                    on ? "bg-moss-soft" : "bg-card shadow-[inset_0_0_0_1.5px_var(--color-line)]",
                  )}
                >
                  <span aria-hidden className={cx("mt-0.5 grid size-6 shrink-0 place-items-center rounded-md text-sm font-bold", on ? "bg-moss" : "shadow-[inset_0_0_0_2px_var(--color-line)]")}>
                    {on ? "✓" : ""}
                  </span>
                  <span>
                    <RichText text={step} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex items-center gap-4 rounded-[24px] bg-sand p-4">
        <span className="grid size-[72px] shrink-0 rotate-[-8deg] place-items-center rounded-full border-[3px] border-dashed border-[oklch(0.55_0.12_30)] bg-card">
          <LineIcon name={isLineIcon(exercise.stamp.icon) ? exercise.stamp.icon : "stamp"} size={36} />
        </span>
        <p className="m-0 text-[15px] leading-snug">
          Za tę misję dostaniesz pieczątkę <b>„{exercise.stamp.label}”</b> do paszportu odkrywcy. Kiedy skończysz, powiedz rodzicowi — potwierdzi to w panelu rodzica, a pieczątka pojawi się w Twoim paszporcie.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => leave(true)}
          disabled={!allTicked}
          className="rounded-[20px] bg-moss px-6 py-4 font-display text-lg font-extrabold shadow-[0_5px_0_var(--color-moss-deep)] active:translate-y-1 disabled:opacity-45"
        >
          Zrobione! ✓
        </button>
        <button type="button" onClick={() => leave(false)} className="rounded-[20px] bg-card px-6 py-4 font-display text-lg font-extrabold shadow-[inset_0_0_0_2px_var(--color-line)]">
          {record?.doneAt ? "Dalej →" : "Zrobię to później →"}
        </button>
      </div>
      {!allTicked && <p className="m-0 text-sm text-muted">Zaznacz wszystkie kroki, kiedy je zrobisz. Możesz też wrócić tu później — misja poczeka.</p>}
    </div>
  );
}
