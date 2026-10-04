"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { FEEDBACK } from "@/data/site";
import { useAppStore } from "@/lib/store/app-store";

type Sent = "shared" | "copied" | "failed" | null;

/**
 * "Uwagi" tab for testers, on every screen. There is no server behind it yet:
 * the note is handed to the phone's share sheet (or copied), together with
 * where it was written, so the author knows which screen it is about.
 */
export function FeedbackTab() {
  const pathname = usePathname();
  const mode = useAppStore((s) => s.user?.ageGroup);
  const dialog = useRef<HTMLDialogElement>(null);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<Sent>(null);

  if (!FEEDBACK.enabled) return null;

  const context = () =>
    [`ekran: ${pathname}`, mode ? `tryb: ${mode}` : null, typeof window !== "undefined" ? `okno: ${window.innerWidth}×${window.innerHeight}` : null, typeof navigator !== "undefined" ? navigator.userAgent : null]
      .filter(Boolean)
      .join(" · ");
  const message = () => `Kompas — uwaga\n\n${note.trim()}\n\n[${context()}]`;

  function open() {
    setSent(null);
    dialog.current?.showModal();
  }

  async function send() {
    const text = message();
    try {
      if (navigator.share) {
        await navigator.share({ title: "Kompas — uwaga", text });
        setSent("shared");
      } else {
        await navigator.clipboard.writeText(text);
        setSent("copied");
      }
      setNote("");
    } catch (error) {
      // Closing the share sheet without sending is not a failure.
      if ((error as DOMException)?.name !== "AbortError") setSent("failed");
    }
  }

  const empty = note.trim().length === 0;
  const action = "rounded-xl px-5 py-3 text-[15px] font-semibold";

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        // Vertical text: Tailwind's px/py follow the text direction, so px is the vertical padding here.
        // On phones the strip is as narrow as the page margin, so it never covers content; the
        // invisible ::before makes it easy to hit anyway.
        className="fixed right-0 top-[108px] z-30 rounded-l-md bg-ink px-2.5 py-[3px] font-mono text-[9px] leading-none tracking-[0.08em] before:absolute before:inset-y-0 before:-left-3 before:right-0 before:content-[''] sm:rounded-l-lg sm:px-3 sm:py-1.5 sm:text-[11px] text-on-ink opacity-80 [writing-mode:vertical-rl] hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-amber print:hidden"
      >
        UWAGI
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="feedback-title"
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto w-[min(520px,calc(100vw-32px))] rounded-[24px] bg-card p-0 text-ink shadow-[0_24px_60px_oklch(0.23_0.025_265/0.3)] backdrop:bg-ink/50"
      >
        <div className="flex flex-col gap-4 p-[clamp(20px,4vw,28px)]">
          <div className="flex flex-col gap-1.5">
            <h2 id="feedback-title" className="m-0 font-display text-2xl font-extrabold tracking-[-0.02em]">
              Zgłoś uwagę
            </h2>
            <p className="m-0 text-sm leading-normal text-muted">Coś nie działa, jest niejasne albo można to zrobić lepiej? Napisz w jednym–dwóch zdaniach.</p>
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Twoja uwaga
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setSent(null);
              }}
              rows={4}
              autoFocus
              className="resize-y rounded-xl border-[1.5px] border-line-strong bg-paper px-3.5 py-3 text-base font-normal"
            />
          </label>
          <p className="m-0 font-mono text-[11px] leading-normal text-faint">Do uwagi dołączymy: ekran ({pathname}), tryb i rodzaj urządzenia.</p>
          <p role="status" className="m-0 min-h-5 text-sm font-semibold text-moss-deeper">
            {sent === "shared" && "Dziękujemy! Uwaga wysłana."}
            {sent === "copied" && "Skopiowano. Wklej ją w wiadomości do autorki aplikacji."}
            {sent === "failed" && <span className="text-coral-ink">Nie udało się. Skopiuj tekst ręcznie i wyślij go autorce.</span>}
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <button type="button" disabled={empty} onClick={() => void send()} className={`${action} bg-ink text-on-ink disabled:opacity-40`}>
              Wyślij uwagę
            </button>
            {FEEDBACK.email && !empty && (
              <a href={`mailto:${FEEDBACK.email}?subject=${encodeURIComponent("Kompas — uwaga")}&body=${encodeURIComponent(message())}`} className={`${action} shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]`}>
                E-mailem
              </a>
            )}
            <button type="button" onClick={() => dialog.current?.close()} className={`${action} text-muted hover:bg-sand`}>
              Zamknij
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
