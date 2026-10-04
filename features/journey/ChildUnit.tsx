"use client";

import Link from "next/link";
import { Check, RotateCw, Star } from "lucide-react";
import { getTopic } from "@/data/topics";
import { lessonMaxXp } from "@/features/learning/engine/xp";
import type { LessonState } from "@/features/progress/units";
import { useLearner } from "@/features/progress/useLearner";
import { cx, plural } from "@/lib/utils";
import { isPlayable, lessonWords, missionKind } from "@/types";

function lessonMeta(l: LessonState): string {
  if (!isPlayable(l.lesson)) return lessonWords(l.lesson) > 0 ? `${lessonWords(l.lesson)} słów · w przygotowaniu` : "w przygotowaniu";
  if (l.status === "COMPLETED") return `✓ ukończone · ${l.progress?.best?.accuracy ?? l.progress?.accuracy ?? 0}%`;
  if (l.status === "IN_PROGRESS") return `w trakcie · zadanie ${(l.progress?.currentIndex ?? 0) + 1}/${l.lesson.exercises.length}`;
  if (l.status === "AVAILABLE") return `następna misja · ${l.lesson.estimatedMinutes} min`;
  return "zablokowane";
}

export function ChildUnit({ unitId }: { unitId: string }) {
  const { units, lessons } = useLearner();
  const state = units.find((u) => u.unit.id === unitId);

  if (!state) {
    return (
      <div className="flex flex-col items-start gap-4 p-[clamp(20px,3vw,40px)]">
        <h1 className="m-0 font-display text-4xl font-extrabold">Nie ma takiego świata</h1>
        <Link href="/journey" className="rounded-xl bg-ink px-5 py-3 font-bold text-on-ink">
          ← Wróć do mapy
        </Link>
      </div>
    );
  }

  const { unit } = state;
  const open = state.status !== "LOCKED";
  const playable = state.lessons.filter((l) => isPlayable(l.lesson));
  const nextUp = open ? playable.find((l) => l.status === "IN_PROGRESS") ?? playable.find((l) => l.status === "AVAILABLE") : undefined;
  const nextLessonData = nextUp && isPlayable(nextUp.lesson) ? nextUp.lesson : undefined;
  const totalMinutes = playable.reduce((sum, l) => sum + (isPlayable(l.lesson) ? l.lesson.estimatedMinutes : 0), 0);
  const xpEarned = playable.reduce((sum, l) => sum + (lessons[l.lesson.id]?.best?.xpEarned ?? 0), 0);
  const xpMax = playable.reduce((sum, l) => sum + (isPlayable(l.lesson) ? lessonMaxXp(l.lesson) : 0), 0);
  const count = state.lessons.length;

  return (
    <div className="flex flex-col">
      <div className="relative min-h-[280px] overflow-hidden bg-amber px-[clamp(20px,3vw,40px)] pb-16 pt-[clamp(20px,3vw,36px)]">
        <div aria-hidden className="hidden sm:block">
          <div className="absolute -bottom-[30px] -right-10 h-40 w-[520px] rounded-[50%_50%_0_0] bg-amber-mid" />
          <div className="absolute bottom-10 right-[300px] h-[110px] w-[70px] rounded-t-lg bg-coral" />
          <div className="absolute bottom-[150px] right-[300px] h-[34px] w-[70px] bg-coral-deep" style={{ clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
          <div className="absolute bottom-10 right-[190px] h-[90px] w-[100px] rounded-t-lg bg-sky" />
          <div className="absolute bottom-[126px] right-[182px] h-6 w-[116px] rounded-md" style={{ background: "repeating-linear-gradient(90deg,oklch(0.97 0.02 85) 0 14px,oklch(0.62 0.17 35) 14px 28px)" }} />
          <div className="absolute bottom-10 right-[226px] h-[46px] w-7 rounded-t-[14px] bg-ink" />
          <div className="absolute bottom-10 right-[60px] h-[140px] w-[110px] rounded-t-lg bg-violet" />
          <div className="absolute bottom-[120px] right-[78px] size-6 rounded-[5px] bg-[oklch(0.97_0.02_85)]" />
          <div className="absolute bottom-[120px] right-[120px] size-6 rounded-[5px] bg-[oklch(0.97_0.02_85)]" />
        </div>
        <div className="relative z-[2] -mx-[22px] -mt-[18px] flex max-w-[520px] flex-col gap-3 rounded-[28px] bg-amber/88 px-[22px] pb-[22px] pt-[18px] backdrop-blur-[4px]">
          <Link href="/journey" className="self-start rounded-[10px] bg-amber-mid px-3 py-2 text-sm font-bold">
            ← Mapa
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="rounded-md bg-ink px-2.5 py-[5px] font-mono text-xs tracking-[0.08em] text-amber">WORLD {unit.order}</span>
            <span className="font-mono text-xs">
              {unit.level} · {state.completedLessons} z {state.totalLessons} {plural(state.totalLessons, "misji", "misji", "misji")} · {state.words.learned} / {state.words.target} słów
            </span>
          </div>
          <h1 className="m-0 font-display text-[clamp(48px,6vw,80px)] font-extrabold leading-[0.9] tracking-[-0.04em]">{unit.title}</h1>
          <p className="m-0 text-[17px] leading-normal">{unit.description ?? unit.canDo}</p>
        </div>
      </div>

      <div className="relative -mt-9 grid grid-cols-1 items-start gap-5 px-[clamp(20px,3vw,40px)] pb-10 xl:grid-cols-3">
        <section className="flex flex-col gap-[18px] rounded-[32px] bg-card p-[clamp(20px,2.5vw,30px)] shadow-[0_6px_0_var(--color-line),inset_0_0_0_1.5px_var(--color-line-soft)] xl:col-span-2">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="m-0 font-display text-[22px] font-extrabold">Trasa przez {unit.title}</h2>
            {totalMinutes > 0 && <span className="font-mono text-xs text-muted">~{totalMinutes} min razem</span>}
          </div>

          {count === 0 ? (
            <p className="m-0 rounded-2xl bg-sand p-5 text-[15px] text-body">Lekcje w tym świecie są w przygotowaniu. Wróć na mapę i wybierz dostępny świat.</p>
          ) : (
            <ol className="relative m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-5 md:gap-x-2 md:gap-y-[34px]">
              {/* Turns of the trail: each joins the end of one row with the start of the next. */}
              {Array.from({ length: Math.ceil(count / 5) - 1 }, (_, r) => (
                <li
                  key={`turn-${r}`}
                  aria-hidden
                  className="pointer-events-none mt-9 -mb-[70px] hidden w-0 justify-self-center border-l-4 border-dotted border-[oklch(0.80_0.02_85)] md:block md:[grid-column:var(--col)] md:[grid-row:var(--row)]"
                  style={{ "--col": r % 2 === 0 ? 5 : 1, "--row": r + 1 } as React.CSSProperties}
                />
              ))}
              {state.lessons.map((l, i) => {
                const playableLesson = isPlayable(l.lesson);
                const reachable = open && playableLesson && l.status !== "LOCKED";
                const isCurrent = open && (l.status === "AVAILABLE" || l.status === "IN_PROGRESS");
                const done = l.status === "COMPLETED";
                // Snake layout on desktop: odd rows left→right, even rows right→left.
                const row = Math.floor(i / 5) + 1;
                const col = row % 2 === 1 ? (i % 5) + 1 : 5 - (i % 5);
                const kind = missionKind(l.lesson);
                const node = (
                  <>
                    <span className="relative z-[1] block size-[56px] shrink-0 md:size-[72px]">
                      {isCurrent && <span className="pointer-events-none absolute inset-0 animate-kpulse rounded-full bg-amber" aria-hidden />}
                      <span
                        aria-hidden
                        className={cx(
                          "absolute inset-0 grid place-items-center rounded-full font-display text-2xl font-extrabold",
                          isCurrent && "bg-amber shadow-[0_6px_0_var(--color-amber-deep)]",
                          done && "bg-moss shadow-[0_5px_0_var(--color-moss-deep)]",
                          !isCurrent && !done && "border-[3px] border-dashed border-[oklch(0.75_0.02_85)] bg-[oklch(0.97_0.01_85)] text-faint shadow-[0_3px_0_oklch(0.82_0.02_85)]",
                        )}
                      >
                        {done ? <Check size={26} strokeWidth={3} /> : kind === "CHECKPOINT" ? <Star size={26} strokeWidth={2.4} /> : kind === "REVIEW" ? <RotateCw size={24} strokeWidth={2.4} /> : l.lesson.order}
                      </span>
                    </span>
                    <span className="relative flex flex-col gap-1 bg-card md:items-center md:px-1">
                      <span className="text-sm font-bold leading-tight">{l.lesson.title}</span>
                      <span className="font-mono text-[10px] text-muted">{lessonMeta(l)}</span>
                    </span>
                  </>
                );
                const cls = "relative flex items-center gap-3 rounded-2xl text-left md:flex-col md:gap-2 md:text-center";
                return (
                  <li
                    key={l.lesson.id}
                    className={cx(
                      "relative md:[grid-column:var(--col)] md:[grid-row:var(--row)]",
                      // Dotted trail to the neighbour on the left.
                      col > 1 && "md:before:absolute md:before:right-1/2 md:before:top-9 md:before:w-[calc(100%+8px)] md:before:border-t-4 md:before:border-dotted md:before:border-[oklch(0.80_0.02_85)] md:before:content-['']",
                    )}
                    style={{ "--col": col, "--row": row } as React.CSSProperties}
                  >
                    {reachable ? (
                      <Link href={`/lesson/${l.lesson.id}`} className={cls}>
                        {node}
                      </Link>
                    ) : (
                      <div className={cx(cls, "opacity-80")}>{node}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          {nextLessonData && (
            <Link
              href={`/lesson/${nextLessonData.id}${nextUp?.status === "IN_PROGRESS" ? "/play" : ""}`}
              className="flex items-center justify-between rounded-[18px] bg-amber px-5 py-4 shadow-[0_5px_0_var(--color-amber-deep)] transition-transform active:translate-y-1 active:shadow-[0_1px_0_var(--color-amber-deep)]"
            >
              <span className="flex flex-col">
                <span className="font-mono text-[11px]">
                  LEKCJA {nextLessonData.order} · {nextUp?.status === "IN_PROGRESS" ? "W TRAKCIE" : "NASTĘPNA"}
                </span>
                <span className="font-display text-[21px] font-extrabold">{nextLessonData.title}</span>
              </span>
              <span className="font-display text-lg font-extrabold">{nextUp?.status === "IN_PROGRESS" ? "Dalej →" : "Start →"}</span>
            </Link>
          )}
          {!open && <p className="m-0 rounded-2xl bg-sand p-4 text-[15px] font-semibold">Ten świat odblokujesz po ukończeniu: {state.blockedBy?.title}.</p>}
        </section>

        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-3 rounded-[26px] bg-ink p-[22px] text-[oklch(0.97_0.008_85)]">
            <p className="m-0 font-mono text-[11px] tracking-[0.08em] text-amber">TWÓJ POSTĘP W TYM ŚWIECIE</p>
            <div className="flex items-end gap-3">
              <span className="font-display text-5xl font-extrabold leading-none">{state.percent}%</span>
              <span className="pb-1 text-[13px] text-on-ink-muted">
                {xpEarned} / {xpMax} XP
              </span>
            </div>
            <div className="h-2.5 rounded-[5px] bg-ink-line">
              <div className="h-full rounded-[5px] bg-amber" style={{ width: `${state.percent}%` }} />
            </div>
          </section>
          {unit.topic && getTopic(unit.topic) && (
            <Link href={`/practice/topic/${unit.topic}`} className="flex flex-col gap-1 rounded-[26px] bg-moss-soft p-[22px] shadow-[0_4px_0_oklch(0.80_0.08_145)]">
              <span className="font-mono text-[11px] tracking-[0.08em] text-moss-ink">TRENING BEZ KOŃCA</span>
              <span className="font-display text-[19px] font-extrabold">{getTopic(unit.topic)?.title.pl}</span>
              <span className="text-sm text-moss-ink">Rundy po 8 zadań ze słów z tego tematu →</span>
            </Link>
          )}
          {unit.objectives && (
            <section className="flex flex-col gap-2.5 rounded-[26px] bg-sand p-[22px]">
              <h2 className="m-0 font-display text-[19px] font-extrabold">Tu nauczysz się</h2>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {unit.objectives.map((o) => (
                  <li key={o} className="flex gap-2 text-sm">
                    <span aria-hidden>○</span>
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
