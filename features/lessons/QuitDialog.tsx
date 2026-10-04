"use client";

import { useEffect, useRef } from "react";
import { useAge } from "@/features/theme/AgeScope";
import { cx } from "@/lib/utils";

/** "Take a break?" — native <dialog>, so focus is trapped and Esc closes it. */
export function QuitDialog({ open, step, onStay, onLeave }: { open: boolean; step: number; onStay(): void; onLeave(): void }) {
  const age = useAge();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const copy =
    age === "CHILD"
      ? { title: "Zrobić przerwę?", text: `Zapiszemy Twój postęp. Lekcja będzie czekać na Ciebie na mapie — dokończysz od zadania ${step}.`, stay: "Gram dalej", leave: "Wyjdź i zapisz" }
      : age === "TEEN"
        ? { title: "Pause the mission?", text: `Progress is saved. You'll pick up from task ${step}.`, stay: "Keep playing", leave: "Save & exit" }
        : { title: "Zapisać i wyjść?", text: `Postęp jest zapisany. Wrócisz do zadania ${step}.`, stay: "Continue lesson", leave: "Zapisz i wyjdź" };

  return (
    <dialog
      ref={ref}
      onClose={onStay}
      aria-labelledby="quit-title"
      className={cx(
        "m-auto w-[calc(100%-40px)] max-w-[420px] p-7 text-center backdrop:bg-ink/50",
        age === "CHILD" && "rounded-[32px] bg-card text-ink",
        age === "TEEN" && "rounded-xl bg-night-surface text-night-text shadow-[inset_0_0_0_1px_var(--color-night-line)]",
        age === "ADULT" && "rounded-[10px] bg-canvas-card text-ink",
      )}
    >
      <div className="flex flex-col gap-3.5">
        <h2 id="quit-title" className={cx("m-0", age === "ADULT" ? "font-serif text-3xl font-normal" : "font-display text-[26px] font-extrabold")}>
          {copy.title}
        </h2>
        <p className={cx("m-0 text-[15px] leading-normal", age === "TEEN" ? "text-night-muted" : "text-body")}>{copy.text}</p>
        <button
          type="button"
          autoFocus
          onClick={onStay}
          className={cx(
            age === "CHILD" && "rounded-2xl bg-moss p-4 font-display text-lg font-extrabold shadow-[0_5px_0_var(--color-moss-deep)]",
            age === "TEEN" && "rounded-md bg-lime p-3.5 font-bold text-night",
            age === "ADULT" && "rounded-md bg-ink p-3.5 text-canvas",
          )}
        >
          {copy.stay}
        </button>
        <button type="button" onClick={onLeave} className={cx("rounded-[14px] p-3 text-[15px] font-semibold", age === "TEEN" ? "text-night-muted" : "text-muted")}>
          {copy.leave}
        </button>
      </div>
    </dialog>
  );
}
