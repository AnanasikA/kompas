"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { lessonStepCount } from "@/features/learning/engine/xp";
import { useAge } from "@/features/theme/AgeScope";
import { useSkin } from "@/features/theme/useSkin";
import { useAppStore } from "@/lib/store/app-store";
import { cx } from "@/lib/utils";
import { ExerciseRenderer } from "./exercises/ExerciseRenderer";
import { QuitDialog } from "./QuitDialog";
import { useLessonContext } from "./useLessonContext";

const TICK_SECONDS = 5;
const MAX_GAP_SECONDS = 30;

/**
 * LESSON ENGINE (UI side)
 * Renders any lesson from data: header with real progress, the current
 * exercise, saving after every step. Presentation follows the age mode.
 */
export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const age = useAge();
  const skin = useSkin();
  const { lesson, unit, lessonState, progress } = useLessonContext(lessonId);
  const beginLesson = useAppStore((s) => s.beginLesson);
  const lessonMistake = useAppStore((s) => s.lessonMistake);
  const lessonSolve = useAppStore((s) => s.lessonSolve);
  const lessonAdvance = useAppStore((s) => s.lessonAdvance);
  const lessonTick = useAppStore((s) => s.lessonTick);
  const finishLesson = useAppStore((s) => s.finishLesson);
  const [quitOpen, setQuitOpen] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const locked = !lesson || !lessonState || lessonState.status === "LOCKED";

  // Start or resume.
  useEffect(() => {
    if (!locked) beginLesson(lessonId);
  }, [locked, lessonId, beginLesson]);

  const total = lesson?.exercises.length ?? 0;
  const index = progress?.currentIndex ?? 0;
  // A completed record with nothing in progress is an old run: `beginLesson` restarts it (replay).
  const finished = !!progress && !!lesson && !progress.lessonCompleted && index >= total;

  // Active learning time: measured from real timestamps, saved every few seconds
  // and once more when the lesson ends. Long gaps (tab in the background) are capped.
  const lastTick = useRef(0);
  const flushTime = useCallback(() => {
    const now = Date.now();
    const elapsed = lastTick.current ? Math.round((now - lastTick.current) / 1000) : 0;
    if (elapsed <= 0) return;
    lastTick.current = now;
    if (document.visibilityState === "visible") lessonTick(lessonId, Math.min(elapsed, MAX_GAP_SECONDS));
  }, [lessonId, lessonTick]);

  useEffect(() => {
    if (locked || finished) return;
    lastTick.current = Date.now();
    const id = setInterval(flushTime, TICK_SECONDS * 1000);
    return () => clearInterval(id);
  }, [locked, finished, flushTime]);

  // After the last exercise: save the result and show the summary.
  useEffect(() => {
    if (!finished) return;
    flushTime();
    finishLesson(lessonId);
    router.replace(`/lesson/${lessonId}/summary`);
  }, [finished, lessonId, finishLesson, flushTime, router]);

  // Move focus to the new task so keyboard and screen-reader users land on it.
  useEffect(() => {
    stage.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [index]);

  if (locked) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div className="flex max-w-md flex-col items-center gap-4">
          <h1 className="k-heading m-0 text-4xl">{age === "CHILD" ? "Ta lekcja jest jeszcze zamknięta" : "This lesson is locked"}</h1>
          <Link href="/journey" className={skin.primary}>
            {age === "CHILD" ? "← Wróć na mapę" : "← Back"}
          </Link>
        </div>
      </div>
    );
  }

  const exercise = lesson.exercises[index];
  if (!progress || !exercise) return <div className="min-h-dvh" aria-busy="true" />;

  const steps = lessonStepCount(lesson);
  const exitHref = age === "CHILD" && unit ? `/journey/${unit.id}` : "/journey";
  const segments = Array.from({ length: steps }, (_, i) => (i < index ? "done" : i === index ? "current" : "todo"));
  const isLast = index === total - 1;

  return (
    <div className="relative flex min-h-dvh flex-col">
      <header
        className={cx(
          "sticky top-0 z-[5] grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-[clamp(16px,3vw,40px)] py-4 sm:gap-5",
          age === "CHILD" && "bg-paper",
          age === "TEEN" && "border-b border-[oklch(0.26_0.025_275)] bg-night",
          age === "ADULT" && "gap-6 border-b border-canvas-line-soft bg-canvas py-[18px]",
        )}
      >
        {age === "ADULT" ? (
          <span className="truncate font-serif text-[22px]">{lesson.title}</span>
        ) : (
          <button
            type="button"
            onClick={() => setQuitOpen(true)}
            aria-label={age === "CHILD" ? "Przerwij lekcję" : "Pause the mission"}
            className={cx(
              "grid place-items-center font-bold",
              age === "CHILD" ? "size-11 rounded-[14px] text-xl shadow-[inset_0_0_0_2px_var(--color-line)] hover:bg-sand" : "size-10 rounded-lg text-base shadow-[inset_0_0_0_1px_var(--color-night-line)]",
            )}
          >
            <X aria-hidden size={20} strokeWidth={2.5} />
          </button>
        )}

        <div className={cx("flex w-full flex-col gap-2 justify-self-center", age === "ADULT" ? "max-w-[420px]" : "max-w-[640px]")}>
          {age !== "ADULT" && (
            <div className={cx("flex justify-between", age === "CHILD" ? "text-[13px] font-bold" : "font-mono text-[11px] tracking-[0.08em]")}>
              <span className={cx("truncate", age === "TEEN" && "text-grape")}>
                {age === "CHILD" ? `Lesson ${lesson.order} · ${unit?.title}` : `MISSION ${String(lesson.order).padStart(2, "0")} / ${unit?.title}`}
              </span>
              <span className={age === "CHILD" ? "font-mono font-medium" : undefined}>
                {index + 1}/{steps}
              </span>
            </div>
          )}
          <div
            className={cx("grid", age === "CHILD" ? "gap-[5px]" : age === "TEEN" ? "gap-1" : "gap-1.5")}
            style={{ gridTemplateColumns: `repeat(${steps}, 1fr)` }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={steps}
            aria-valuenow={index}
            aria-label={age === "CHILD" ? `Postęp lekcji: krok ${index + 1} z ${steps}` : `Lesson progress: step ${index + 1} of ${steps}`}
          >
            {segments.map((s, i) => (
              <div
                key={i}
                className={cx(
                  age === "CHILD" && "h-2.5 rounded-[5px]",
                  age === "TEEN" && "h-1",
                  age === "ADULT" && "h-0.5",
                  s === "done" && { CHILD: "bg-moss", TEEN: "bg-lime", ADULT: "bg-ink" }[age],
                  s === "current" && { CHILD: "bg-amber", TEEN: "bg-grape", ADULT: "bg-ink" }[age],
                  s === "todo" && { CHILD: "bg-idle", TEEN: "bg-night-line-soft", ADULT: "bg-canvas-line-strong" }[age],
                )}
              />
            ))}
          </div>
        </div>

        {age === "ADULT" ? (
          <button type="button" onClick={() => setQuitOpen(true)} className="k-tap rounded text-sm text-muted">
            Zapisz i wyjdź
          </button>
        ) : (
          <div
            aria-live="polite"
            className={cx(
              "whitespace-nowrap font-mono",
              age === "CHILD" ? "rounded-full bg-ink px-3.5 py-[9px] text-sm font-medium text-amber" : "rounded px-3 py-2 text-[13px] text-lime shadow-[inset_0_0_0_1px_var(--color-lime)]",
            )}
          >
            XP +{progress.xpEarned}
          </div>
        )}
      </header>

      <main className={cx("flex flex-1 flex-col items-center px-[clamp(16px,3vw,40px)] pb-10", age === "ADULT" ? "pt-[clamp(32px,6vw,72px)]" : "pt-[clamp(16px,3vw,36px)]")}>
        <div ref={stage} tabIndex={-1} className={cx("flex w-full flex-col outline-none", age === "CHILD" ? "max-w-[900px]" : age === "TEEN" ? "max-w-[980px]" : "max-w-[1000px]")}>
          <ExerciseRenderer
            key={`${exercise.id}:${progress.startedAt}`}
            exercise={exercise}
            showXp
            continueLabel={isLast ? skin.t.finish : undefined}
            onMistake={(conceptIds) => lessonMistake(lessonId, conceptIds)}
            onSolved={(opts) => lessonSolve(lessonId, opts)}
            onContinue={() => lessonAdvance(lessonId)}
          />
        </div>
      </main>

      <QuitDialog open={quitOpen} step={index + 1} onStay={() => setQuitOpen(false)} onLeave={() => router.push(exitHref)} />
    </div>
  );
}
