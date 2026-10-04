"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAge } from "@/features/theme/AgeScope";
import { useAppStore } from "@/lib/store/app-store";
import { cx } from "@/lib/utils";
import type { AgeGroup } from "@/types";
import { useLearner } from "./useLearner";

const MODE: Record<AgeGroup, string> = { CHILD: "Odkrywca 8–12", TEEN: "Gracz 13–17", ADULT: "Navigator 18+" };
const GOALS = [5, 10, 15, 20];

export function SettingsScreen() {
  const age = useAge();
  const router = useRouter();
  const { user } = useLearner();
  const account = useAppStore((s) => s.account);
  const setDailyGoal = useAppStore((s) => s.setDailyGoal);
  const resetProgress = useAppStore((s) => s.resetProgress);
  const signOut = useAppStore((s) => s.signOut);
  const [confirm, setConfirm] = useState<"reset" | "signout" | null>(null);

  const row = "flex flex-wrap items-center justify-between gap-4 border-b border-[var(--k-line)] py-[18px] last:border-b-0";
  const seg = cx("flex gap-1 p-1", age === "CHILD" ? "rounded-xl bg-sand" : age === "TEEN" ? "rounded-md shadow-[inset_0_0_0_1px_var(--color-night-line)]" : "rounded-md shadow-[inset_0_0_0_1px_var(--color-canvas-line-strong)]");
  const segOn = { CHILD: "bg-ink text-on-ink", TEEN: "bg-grape text-night", ADULT: "bg-ink text-canvas" }[age];
  const danger = cx("px-4 py-2.5 text-sm font-semibold", age === "CHILD" ? "rounded-xl shadow-[inset_0_0_0_2px_var(--color-line)] hover:bg-sand" : "rounded-md shadow-[inset_0_0_0_1px_var(--k-line)]");

  return (
    <div className={cx("flex max-w-[880px] flex-col gap-5", age === "CHILD" && "p-[clamp(20px,3vw,40px)]")}>
      <h1 className="k-heading m-0 text-[clamp(32px,4vw,44px)] leading-none">Ustawienia</h1>

      <section className="flex flex-col rounded-[var(--k-radius)] bg-[var(--k-surface)] px-[22px] py-2 shadow-[inset_0_0_0_1px_var(--k-line)]">
        <div className={row}>
          <div className="flex flex-col gap-[3px]">
            <span className="text-base font-bold" id="goal-label">
              Cel dzienny
            </span>
            <span className="text-[13px] text-[var(--k-muted)]">Ile minut chcesz się uczyć</span>
          </div>
          <div className={seg} role="radiogroup" aria-labelledby="goal-label">
            {GOALS.map((m) => (
              <button key={m} type="button" role="radio" aria-checked={user.dailyGoal === m} onClick={() => setDailyGoal(m)} className={cx("rounded-[9px] px-3 py-2 text-[13px] font-bold", user.dailyGoal === m && segOn)}>
                {m} min
              </button>
            ))}
          </div>
        </div>
        <div className={row}>
          <div className="flex flex-col gap-[3px]">
            <span className="text-base font-bold">Tryb wyglądu</span>
            <span className="text-[13px] text-[var(--k-muted)]">Dobrany do wieku podanego przy zakładaniu profilu</span>
          </div>
          <span className={cx("px-3 py-2 font-mono text-xs", age === "CHILD" ? "rounded-full bg-amber-soft" : "rounded-md shadow-[inset_0_0_0_1px_var(--k-line)]")}>{MODE[user.ageGroup]}</span>
        </div>
        <div className={row}>
          <div className="flex flex-col gap-[3px]">
            <span className="text-base font-bold">Poziom</span>
            <span className="text-[13px] text-[var(--k-muted)]">Ustalony w teście poziomującym</span>
          </div>
          <span className="font-mono text-sm">
            {user.currentCEFR} → {user.targetCEFR}
          </span>
        </div>
        <div className={row}>
          <div className="flex flex-col gap-[3px]">
            <span className="text-base font-bold">Konto</span>
            <span className="text-[13px] text-[var(--k-muted)]">
              {account?.email} · {account?.role === "PARENT" ? "konto rodzica" : "konto ucznia"} · dane zapisane na tym urządzeniu
            </span>
          </div>
          <button type="button" onClick={() => setConfirm("signout")} className={danger}>
            Wyloguj
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-[var(--k-radius)] bg-[var(--k-surface-2)] p-[22px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-[3px]">
            <span className="text-[17px] font-extrabold">Zacznij od nowa</span>
            <span className="text-[13px] opacity-80">Usuwa XP, ukończone lekcje i powtórki. Profil i poziom zostają.</span>
          </div>
          <button type="button" onClick={() => setConfirm("reset")} className={danger}>
            Wyzeruj postęp
          </button>
        </div>
      </section>

      {confirm && (
        <div role="alertdialog" aria-labelledby="confirm-title" className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--k-radius)] bg-[var(--k-surface)] p-[22px] shadow-[inset_0_0_0_2px_var(--k-text)]">
          <p id="confirm-title" className="m-0 text-[15px] font-semibold">
            {confirm === "reset" ? "Na pewno wyzerować cały postęp? Tego nie da się cofnąć." : "Wylogować? Postęp zostaje zapisany na tym koncie — wrócisz do niego po zalogowaniu."}
          </p>
          <div className="flex gap-2">
            <button type="button" autoFocus onClick={() => setConfirm(null)} className={danger}>
              Anuluj
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm === "reset") {
                  resetProgress();
                  setConfirm(null);
                } else {
                  void signOut().then(() => router.push("/"));
                }
              }}
              className={cx("px-4 py-2.5 text-sm font-bold", age === "CHILD" ? "rounded-xl bg-ink text-on-ink" : age === "TEEN" ? "rounded-md bg-grape text-night" : "rounded-md bg-ink text-canvas")}
            >
              {confirm === "reset" ? "Tak, wyzeruj" : "Tak, wyloguj"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
