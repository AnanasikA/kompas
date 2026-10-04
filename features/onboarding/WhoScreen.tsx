"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/app-store";
import type { AgeGroup } from "@/types";
import { cx } from "@/lib/utils";
import { firstStep } from "./flow";

/** Step 1 for everyone: who is learning, and (for "me") how old. */
export function WhoScreen() {
  const router = useRouter();
  const who = useAppStore((s) => s.onboarding.who);
  const updateDraft = useAppStore((s) => s.updateDraft);

  function choose(age: AgeGroup, whoIs: "me" | "child") {
    updateDraft({ who: whoIs, ageGroup: age, placement: null });
    router.push(firstStep(age));
  }

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <div className="flex items-center justify-between gap-4 px-[clamp(20px,4vw,48px)] py-[18px]">
        <Link href="/auth" className="rounded-xl px-3.5 py-2.5 text-[15px] font-semibold hover:bg-sand">
          ← Wstecz
        </Link>
      </div>
      <main className="flex flex-1 flex-col items-center px-[clamp(20px,4vw,48px)] pb-16 pt-[clamp(20px,4vw,48px)]">
        <div className="flex w-full max-w-[980px] flex-col gap-8">
          <div className="flex flex-col gap-2.5">
            <p className="m-0 font-mono text-xs tracking-[0.08em] text-muted">KONTO · KROK 1</p>
            <h1 className="m-0 font-display text-[clamp(34px,4.5vw,56px)] font-extrabold leading-none tracking-[-0.03em]">Kto będzie się uczyć?</h1>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              type="button"
              aria-pressed={who === "me"}
              onClick={() => updateDraft({ who: "me" })}
              className={cx(
                "flex min-h-[180px] flex-col gap-3 rounded-2xl bg-card p-7 text-left hover:bg-[oklch(0.99_0.006_85)] md:min-h-[220px]",
                who === "me" ? "shadow-[inset_0_0_0_2px_var(--color-ink)]" : "shadow-[inset_0_0_0_1px_var(--color-line)]",
              )}
            >
              <span className="font-mono text-xs text-muted">A</span>
              <span className="mt-auto font-display text-[clamp(32px,3.5vw,44px)] font-extrabold tracking-[-0.03em]">Dla mnie</span>
              <span className="text-base leading-normal text-body">Mam 13 lat lub więcej.</span>
            </button>
            <button
              type="button"
              onClick={() => choose("CHILD", "child")}
              className="flex min-h-[180px] flex-col gap-3 rounded-2xl bg-card p-7 text-left shadow-[inset_0_0_0_1px_var(--color-line)] hover:shadow-[inset_0_0_0_2px_var(--color-ink)] md:min-h-[220px]"
            >
              <span className="font-mono text-xs text-muted">B</span>
              <span className="mt-auto font-display text-[clamp(32px,3.5vw,44px)] font-extrabold tracking-[-0.03em]">Dla mojego dziecka</span>
              <span className="text-base leading-normal text-body">Zakładam konto rodzica i profil dziecka 8–12.</span>
            </button>
          </div>
          {who === "me" && (
            <div className="flex animate-kfade flex-col gap-3.5 border-t border-line pt-6">
              <h2 className="m-0 font-display text-[26px] font-extrabold">Ile masz lat?</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => choose("TEEN", "me")}
                  className="flex items-center justify-between rounded-xl bg-[oklch(0.19_0.02_275)] px-6 py-[22px] text-night-text hover:shadow-[inset_0_0_0_2px_var(--color-lime)]"
                >
                  <span className="font-display text-3xl font-extrabold">13–17</span>
                  <span className="font-mono text-[13px] text-lime" aria-hidden>→</span>
                </button>
                <button
                  type="button"
                  onClick={() => choose("ADULT", "me")}
                  className="flex items-center justify-between rounded-xl bg-[oklch(0.995_0.003_90)] px-6 py-[22px] shadow-[inset_0_0_0_1px_var(--color-canvas-line-strong)] hover:shadow-[inset_0_0_0_2px_var(--color-ink)]"
                >
                  <span className="font-serif text-4xl">18+</span>
                  <span className="font-mono text-[13px]" aria-hidden>→</span>
                </button>
              </div>
              <p className="m-0 text-[13px] text-muted">Na tej podstawie dobierzemy wygląd, ton i przykłady.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
