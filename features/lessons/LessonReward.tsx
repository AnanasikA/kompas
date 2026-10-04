"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAge } from "@/features/theme/AgeScope";
import { useAppStore } from "@/lib/store/app-store";
import { cx } from "@/lib/utils";
import { useLessonContext } from "./useLessonContext";

/** Level-up screen. Shown only when the lesson really raised the level. */
export function LessonReward({ lessonId }: { lessonId: string }) {
  const age = useAge();
  const router = useRouter();
  const reward = useAppStore((s) => s.pendingReward);
  const clearReward = useAppStore((s) => s.clearReward);
  const { level, rank, units, unitState, lesson, due } = useLessonContext(lessonId);
  const valid = reward?.lessonId === lessonId;

  useEffect(() => {
    if (!valid) router.replace("/home");
  }, [valid, router]);

  if (!valid || !reward) return <div className="min-h-dvh" aria-busy="true" />;

  const unitDone = unitState?.status === "COMPLETED";
  const unlockedUnit = unitDone ? units.find((u) => u.unit.order > (unitState?.unit.order ?? 0) && u.status !== "LOCKED") : undefined;
  const go = (href: string) => {
    clearReward();
    router.push(href);
  };

  const facts: { tone: "moss" | "violet" | "amber"; mark: string; text: string }[] = [
    { tone: "moss", mark: "✓", text: age === "CHILD" ? `Lekcja ukończona: ${lesson?.title}` : `Mission cleared: ${lesson?.title}` },
    ...(unitDone ? [{ tone: "violet" as const, mark: "★", text: age === "CHILD" ? `Świat ukończony: ${unitState?.unit.title}` : `Arc cleared: ${unitState?.unit.title}` }] : []),
    ...(unlockedUnit
      ? [{ tone: "amber" as const, mark: "→", text: age === "CHILD" ? `Odblokowany świat: ${unlockedUnit.unit.title}${unlockedUnit.comingSoon ? " (lekcje w przygotowaniu)" : ""}` : `Unlocked: ${unlockedUnit.unit.title}${unlockedUnit.comingSoon ? " (coming soon)" : ""}` }]
      : []),
  ];

  if (age === "TEEN") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-[26px] px-6 py-12 text-center" style={{ background: "radial-gradient(circle at 50% 35%,oklch(0.26 0.05 290),oklch(0.15 0.02 275) 65%)" }}>
        <div className="animate-kpop">
          <div className="grid size-[120px] rotate-45 place-items-center rounded-xl border-[3px] border-lime bg-[oklch(0.20_0.03_275)] shadow-[0_0_60px_oklch(0.88_0.17_125/0.35)]">
            <span className="-rotate-45 font-mono text-[40px] font-medium text-lime">{reward.toLevel}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="m-0 font-mono text-[13px] tracking-[0.16em] text-lime">LEVEL UP</p>
          <h1 className="m-0 font-display text-[clamp(44px,6vw,76px)] font-extrabold leading-[0.95] tracking-[-0.04em]">
            LVL {reward.toLevel} · {rank.split(" ").slice(1).join(" ")}
          </h1>
          <p className="m-0 text-[15px] text-night-body">
            {level.into} / {level.needed} XP · next: LVL {level.level + 1}
          </p>
        </div>
        <ul className="m-0 grid grid-cols-1 w-full max-w-[760px] list-none gap-3 p-0 text-left sm:grid-cols-2">
          {facts.map((f) => (
            <li key={f.text} className="flex flex-col gap-1.5 rounded-[10px] bg-night-surface p-[18px]">
              <span className={cx("font-mono text-[10px]", f.tone === "moss" ? "text-lime" : f.tone === "violet" ? "text-grape" : "text-amber")}>{f.mark}</span>
              <span className="font-bold">{f.text}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap justify-center gap-2.5">
          {due.length > 0 && (
            <button type="button" onClick={() => go("/practice")} className="rounded-md px-6 py-[15px] font-semibold shadow-[inset_0_0_0_1px_oklch(0.40_0.03_275)]">
              Practice weak skills
            </button>
          )}
          <button type="button" onClick={() => go("/home")} autoFocus className="rounded-md bg-lime px-[30px] py-[15px] font-bold text-night hover:bg-lime-hover">
            Back to Home →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="k-on-dark flex min-h-dvh flex-col items-center justify-center gap-7 px-6 py-12 text-center text-[oklch(0.97_0.008_85)]"
      style={{ background: "radial-gradient(circle at 50% 30%,oklch(0.32 0.04 265),oklch(0.20 0.025 265) 60%)" }}
    >
      <div className="relative grid size-[150px] place-items-center">
        <div className="absolute inset-0 rounded-full" aria-hidden>
          <span className="pointer-events-none absolute inset-0 animate-kpulse rounded-full bg-amber/60" />
        </div>
        <div className="animate-[kpop_0.6s_cubic-bezier(0.3,1.6,0.5,1)_both]">
          <div className="grid size-[110px] rotate-45 place-items-center rounded-3xl bg-amber shadow-[0_10px_0_var(--color-amber-deep)]">
            <span className="-rotate-45 font-display text-[56px] font-extrabold text-ink">{reward.toLevel}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="m-0 font-mono text-[13px] tracking-[0.14em] text-amber">LEVEL UP</p>
        <h1 className="m-0 font-display text-[clamp(44px,6vw,76px)] font-extrabold leading-[0.95] tracking-[-0.04em]">Level {reward.toLevel} odblokowany!</h1>
        <p className="m-0 text-[17px] text-[oklch(0.85_0.012_265)]">
          {rank} · {level.into} / {level.needed} XP do Level {level.level + 1}
        </p>
      </div>
      <div className="flex w-full max-w-[520px] flex-col gap-3 rounded-[28px] bg-ink-raised p-[22px] text-left">
        <span className="font-mono text-[11px] text-amber">CO SIĘ WYDARZYŁO</span>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {facts.map((f) => (
            <li key={f.text} className="flex items-center gap-2.5 text-[15px]">
              <span
                aria-hidden
                className={cx(
                  "grid size-7 shrink-0 place-items-center text-[13px] font-extrabold text-ink",
                  f.tone === "moss" && "rounded-full bg-moss",
                  f.tone === "violet" && "rounded-lg bg-violet",
                  f.tone === "amber" && "rounded-lg bg-amber",
                )}
              >
                {f.mark}
              </span>
              {f.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {due.length > 0 && (
          <button type="button" onClick={() => go("/practice")} className="rounded-[18px] px-[26px] py-[18px] text-base font-bold shadow-[inset_0_0_0_2px_oklch(0.42_0.03_265)] hover:bg-[oklch(0.30_0.03_265)]">
            Powtórz to, co trudne
          </button>
        )}
        <button
          type="button"
          autoFocus
          onClick={() => go("/home")}
          className="rounded-[18px] bg-amber px-[34px] py-[18px] font-display text-[19px] font-extrabold text-ink shadow-[0_6px_0_var(--color-amber-deep)] transition-transform active:translate-y-[5px] active:shadow-[0_1px_0_var(--color-amber-deep)]"
        >
          Wróć do bazy →
        </button>
      </div>
    </div>
  );
}
