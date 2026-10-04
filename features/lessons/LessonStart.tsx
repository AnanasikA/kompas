"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { lessonMaxXp } from "@/features/learning/engine/xp";
import { useAge } from "@/features/theme/AgeScope";
import { useAppStore } from "@/lib/store/app-store";
import { cx, plural } from "@/lib/utils";
import type { Lesson, Skill } from "@/types";
import { exerciseName, lessonSkills, lessonTypes, skillCode, skillName } from "./labels";
import { useLessonContext } from "./useLessonContext";

const CHIP_COLORS = ["bg-amber-soft", "bg-sky-soft", "bg-violet-soft", "bg-moss-soft"];
const SKILL_TILE: Record<Skill, string> = {
  VOCABULARY: "rounded-[14px] bg-moss-soft",
  LISTENING: "rounded-full bg-sky-soft",
  GRAMMAR: "rounded-md bg-amber-soft",
  SPEAKING: "rounded-[50%_50%_50%_8px] bg-coral-soft",
  READING: "rounded-[14px] bg-violet-soft",
};

function CafeArt({ lesson }: { lesson: Lesson }) {
  const dialogue = lesson.exercises.find((e) => e.type === "DIALOGUE");
  const board = dialogue?.type === "DIALOGUE" ? dialogue.scene.board : undefined;
  const firstLine = dialogue?.type === "DIALOGUE" ? dialogue.script.nodes[dialogue.script.startNodeId].line : null;
  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-[40px_40px_12px_40px] bg-[oklch(0.88_0.05_60)] lg:min-h-[440px]" aria-hidden>
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[oklch(0.55_0.08_55)]" />
      <div className="absolute inset-x-0 bottom-[38%] h-[22px] bg-[oklch(0.45_0.07_50)]" />
      {board && (
        <div className="absolute left-[6%] top-[10%] flex w-[52%] flex-col gap-1.5 rounded-xl bg-[oklch(0.28_0.03_160)] p-3 font-mono text-[11px] text-[oklch(0.95_0.02_100)] sm:left-[8%] sm:top-[12%] sm:w-[44%] sm:p-4 sm:text-xs">
          <div className="font-display text-lg font-extrabold text-[oklch(0.85_0.12_85)]">{board.title}</div>
          {board.rows.map((row) => (
            <div key={row[0]} className="flex justify-between gap-2">
              <span>{row[0]}</span>
              <span>{row[1]}</span>
            </div>
          ))}
        </div>
      )}
      <div className="absolute bottom-[38%] right-[14%] h-[150px] w-[130px] rounded-t-[65px] bg-sky" />
      <div className="absolute size-20 rounded-full bg-[oklch(0.78_0.07_55)]" style={{ right: "calc(14% + 25px)", bottom: "calc(38% + 130px)" }} />
      <div className="absolute h-[30px] w-[90px] rounded-[45px_45px_6px_6px] bg-[oklch(0.30_0.04_50)]" style={{ right: "calc(14% + 20px)", bottom: "calc(38% + 190px)" }} />
      {firstLine && (
        <div
          className="absolute hidden rounded-[18px_18px_4px_18px] bg-card px-4 py-3 font-display text-[17px] font-semibold shadow-[0_8px_20px_oklch(0.23_0.025_265/0.15)] sm:block"
          style={{ right: "calc(14% + 145px)", bottom: "calc(38% + 160px)" }}
        >
          {firstLine}
        </div>
      )}
      <div className="absolute left-[12%] hidden h-[50px] w-11 rounded-b-[18px] bg-[oklch(0.97_0.01_85)] lg:block" style={{ bottom: "calc(38% + 22px)" }} />
      <div className="absolute hidden h-[34px] w-[60px] rounded-[30px_30px_4px_4px] bg-[oklch(0.80_0.10_75)] lg:block" style={{ left: "calc(12% + 52px)", bottom: "calc(38% + 22px)" }} />
    </div>
  );
}

/** Lesson intro: what you will learn, how long it takes, and one button to start. */
export function LessonStart({ lessonId }: { lessonId: string }) {
  const age = useAge();
  const router = useRouter();
  const beginLesson = useAppStore((s) => s.beginLesson);
  const { lesson, unit, lessonState, progress, due } = useLessonContext(lessonId);

  if (!lesson || !unit) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="k-heading m-0 text-4xl">{age === "CHILD" ? "Nie ma takiej lekcji" : "Lesson not found"}</h1>
          <Link href="/journey" className="underline underline-offset-4">
            {age === "CHILD" ? "← Wróć na mapę" : "← Back"}
          </Link>
        </div>
      </div>
    );
  }

  const status = lessonState?.status ?? "LOCKED";
  const locked = status === "LOCKED";
  const resuming = status === "IN_PROGRESS";
  const done = status === "COMPLETED";
  const tasks = lesson.exercises.length;
  const maxXp = lessonMaxXp(lesson);
  const play = `/lesson/${lesson.id}/play`;
  const restart = () => {
    beginLesson(lesson.id, { restart: true });
    router.push(play);
  };
  const best = progress?.best;

  if (age === "TEEN") {
    return (
      <div className="flex min-h-dvh flex-col gap-6 p-[clamp(20px,3vw,40px)]">
        <Link href="/journey" className="k-tap self-start rounded text-[13px] text-night-muted">
          ← {unit.title} arc
        </Link>
        <div className="mx-auto grid grid-cols-1 w-full max-w-[1200px] flex-1 items-center gap-7 lg:grid-cols-2">
          <div className="flex flex-col gap-[18px]">
            <p className="m-0 font-mono text-xs tracking-[0.14em] text-lime">
              MISSION {String(lesson.order).padStart(2, "0")} / {unit.title}
            </p>
            <h1 className="m-0 font-display text-[clamp(38px,5vw,64px)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em]">{lesson.title}</h1>
            <p className="m-0 max-w-[46ch] text-base leading-[1.55] text-night-body">{unit.description ?? lesson.canDo}</p>
            {unit.objectives && (
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] text-night-muted">OBJECTIVES</span>
                {unit.objectives.map((o) => (
                  <div key={o} className={cx("flex gap-2.5 text-sm", o.startsWith("Side quest") && "text-grape")}>
                    <span className={cx("mt-0.5 size-4 shrink-0 border-[1.5px]", o.startsWith("Side quest") ? "border-dashed border-grape" : "border-lime")} aria-hidden />
                    {o}
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {lesson.keyPhrases.map((p) => (
                <span key={p} className="rounded px-3 py-2 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--color-grape)]">
                  {p}
                </span>
              ))}
            </div>
            {locked ? (
              <p className="m-0 rounded-lg border border-dashed border-night-line p-4 text-sm text-night-muted">Locked · finish the previous mission first.</p>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <Link href={play} className="rounded-md bg-lime px-10 py-[17px] text-[17px] font-bold text-night hover:bg-lime-hover">
                  {resuming ? "Resume →" : done ? "Replay →" : "Start mission →"}
                </Link>
                {resuming && (
                  <button type="button" onClick={restart} className="rounded-md px-4 py-3 text-sm text-night-muted shadow-[inset_0_0_0_1px_var(--color-night-line)]">
                    Restart
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col rounded-xl bg-night-surface p-[22px]">
            <div className="flex justify-between pb-2.5 font-mono text-[11px] text-night-muted">
              <span>
                {tasks} TASKS · {lesson.estimatedMinutes} MIN
              </span>
              <span className="text-lime">+{maxXp} XP</span>
            </div>
            <ol className="m-0 list-none p-0">
              {lesson.exercises.map((e, i) => (
                <li key={e.id} className="grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 border-t border-[oklch(0.30_0.025_275)] py-3">
                  <span className={cx("font-mono text-[11px]", e.type === "DIALOGUE" ? "text-grape" : "text-night-muted")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={e.type === "DIALOGUE" ? "font-bold" : "font-semibold"}>{exerciseName("TEEN", e)}</span>
                  <span className={cx("font-mono text-[11px]", e.type === "DIALOGUE" && "text-grape")}>{skillCode(e.skill)}</span>
                </li>
              ))}
            </ol>
            {best && (
              <p className="m-0 border-t border-[oklch(0.30_0.025_275)] pt-3 font-mono text-[11px] text-night-muted">
                BEST · {best.accuracy}% · {best.xpEarned} XP
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (age === "ADULT") {
    return (
      <div className="flex min-h-dvh flex-col p-[clamp(24px,4vw,56px)]">
        <Link href="/journey" className="k-tap self-start rounded text-sm text-muted">
          ← {unit.title}
        </Link>
        <div className="mx-auto grid grid-cols-1 w-full max-w-[1120px] flex-1 items-center gap-[clamp(32px,6vw,80px)] py-8 lg:grid-cols-2">
          <div className="flex flex-col gap-[22px]">
            <p className="m-0 font-mono text-xs tracking-[0.12em] text-muted">
              {lesson.level} · LESSON {String(lesson.order).padStart(2, "0")}
            </p>
            <h1 className="m-0 font-serif text-[clamp(40px,7vw,84px)] font-normal leading-[0.95]">{lesson.title}</h1>
            <div className="flex max-w-[44ch] flex-col gap-1.5">
              <span className="font-mono text-[11px] tracking-[0.12em] text-azure">GOAL</span>
              <p className="m-0 text-[19px] leading-normal">{lesson.canDo}</p>
            </div>
            <div className="flex flex-wrap gap-7 text-[15px]">
              <span>
                <b>{lesson.estimatedMinutes} min</b>
              </span>
              <span className="text-muted">{lessonSkills(lesson).map(skillName).join(" · ")}</span>
            </div>
            {locked ? (
              <p className="m-0 border-l-2 border-ochre bg-ochre-soft px-4 py-3 text-sm">Ta lekcja otworzy się po ukończeniu poprzedniej.</p>
            ) : (
              <div className="flex flex-wrap items-center gap-4">
                <Link href={play} className="flex justify-between gap-12 rounded-md bg-ink px-6 py-[18px] text-[15px] font-semibold tracking-[0.06em] text-canvas hover:bg-ink-hover">
                  <span>{resuming ? "CONTINUE LESSON" : done ? "REPEAT LESSON" : "START LESSON"}</span>
                  <span aria-hidden>→</span>
                </Link>
                {resuming && (
                  <button type="button" onClick={restart} className="text-sm text-muted underline underline-offset-4">
                    Zacznij od nowa
                  </button>
                )}
              </div>
            )}
            {best && <p className="m-0 text-sm text-muted">Najlepszy wynik: {best.accuracy}% · {best.xpEarned} XP</p>}
          </div>
          <ol className="m-0 flex list-none flex-col border-t border-ink p-0">
            {lesson.exercises.map((e, i) => (
              <li key={e.id} className="grid grid-cols-[30px_minmax(0,1fr)_auto] gap-3.5 border-b border-canvas-line-soft py-4 text-[15px]">
                <span className={cx("font-mono text-[11px]", e.type === "DIALOGUE" ? "text-azure" : "text-faint")}>{String(i + 1).padStart(2, "0")}</span>
                <span className={e.type === "DIALOGUE" ? "font-semibold" : undefined}>
                  {exerciseName("ADULT", e)}
                  {e.type === "DIALOGUE" ? `: ${e.scene.title}` : ""}
                </span>
                <span className={cx("font-mono text-[11px]", e.type === "DIALOGUE" ? "text-azure" : "text-faint")}>{skillName(e.skill)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  const dueWords = due.slice(0, 3).map((r) => r.concept);
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <div className="flex items-center justify-between px-[clamp(20px,3vw,40px)] py-[18px]">
        <Link href={`/journey/${unit.id}`} className="k-tap rounded-xl px-3.5 py-2.5 text-[15px] font-bold hover:bg-sand">
          ← {unit.title}
        </Link>
        <div className="font-mono text-xs uppercase text-muted">
          LESSON {lesson.order} · {unit.title}
        </div>
      </div>
      <div className="mx-auto grid grid-cols-1 w-full max-w-[1280px] flex-1 items-stretch gap-6 px-[clamp(20px,3vw,40px)] pb-10 lg:grid-cols-2">
        <CafeArt lesson={lesson} />
        <div className="flex flex-col justify-center gap-[22px]">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-ink px-2.5 py-1.5 font-mono text-xs text-amber">LESSON {lesson.order}</span>
              <span className="rounded-md bg-sand px-2.5 py-1.5 font-mono text-xs">
                {tasks + 1} {plural(tasks + 1, "krok", "kroki", "kroków")} · ~{lesson.estimatedMinutes} min
              </span>
              <span className="rounded-md bg-sand px-2.5 py-1.5 font-mono text-xs">+{maxXp} XP</span>
            </div>
            <h1 className="m-0 font-display text-[clamp(40px,4.5vw,60px)] font-extrabold leading-[0.95] tracking-[-0.04em]">{lesson.title}</h1>
            <p className="m-0 text-lg leading-normal text-[oklch(0.35_0.02_265)]">{lesson.canDo}</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[11px] tracking-[0.08em] text-muted">NOWE ZWROTY</span>
            <div className="flex flex-wrap gap-2">
              {lesson.keyPhrases.map((p, i) => (
                <span key={p} className={cx("rounded-full px-3.5 py-[9px] font-display text-[17px] font-semibold", CHIP_COLORS[i % CHIP_COLORS.length])}>
                  {p}
                </span>
              ))}
            </div>
          </div>
          <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-3 p-0">
            {lessonTypes(lesson).map((e) => (
              <li key={e.id} className="flex w-[64px] flex-col items-center gap-1.5 text-center">
                {e.type === "DIALOGUE" ? (
                  <span className="m-[3px] size-[38px] rotate-45 rounded-lg bg-amber" aria-hidden />
                ) : (
                  <span className={cx("grid size-11 place-items-center font-mono text-[11px]", SKILL_TILE[e.skill])} aria-hidden>
                    {skillCode(e.skill)}
                  </span>
                )}
                <span className="text-xs">{exerciseName("CHILD", e)}</span>
              </li>
            ))}
          </ul>
          {dueWords.length > 0 && (
            <p className="m-0 rounded-[14px] bg-sand px-3.5 py-3 text-sm text-muted">
              W Treningu czekają powtórki: <b>{dueWords.join(", ")}</b>.
            </p>
          )}
          {best && (
            <p className="m-0 font-mono text-xs text-muted">
              NAJLEPSZY WYNIK · {best.accuracy}% · {best.xpEarned} XP
            </p>
          )}
          {locked ? (
            <p className="m-0 rounded-[20px] bg-idle p-5 text-center font-display text-lg font-extrabold text-[oklch(0.50_0.015_265)]">Najpierw ukończ poprzednią lekcję</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              <Link
                href={play}
                className="rounded-[20px] bg-moss p-5 text-center font-display text-[22px] font-extrabold shadow-[0_6px_0_var(--color-moss-deep)] transition-transform active:translate-y-[5px] active:shadow-[0_1px_0_var(--color-moss-deep)]"
              >
                {resuming ? `KONTYNUUJ · ZADANIE ${(progress?.currentIndex ?? 0) + 1} →` : done ? "POWTÓRZ LEKCJĘ →" : "START LESSON →"}
              </Link>
              {resuming && (
                <button type="button" onClick={restart} className="self-center rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-sand">
                  Zacznij od nowa
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
