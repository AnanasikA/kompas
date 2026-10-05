"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { FEEDBACK } from "@/data/site";
import { useAppStore } from "@/lib/store/app-store";

type Status = "idle" | "sending" | "sent" | "failed" | "copied";

const MODE_LABEL: Record<string, string> = { CHILD: "dziecko", TEEN: "nastolatek", ADULT: "dorosły" };

/**
 * "Uwagi" tab for testers, on every screen. One button: the note is posted to
 * the form-to-e-mail service set in data/site.ts and lands in the author's
 * inbox with the screen it was written on. If sending fails, the tester can
 * copy the text so it is not lost.
 */
export function FeedbackTab() {
  const pathname = usePathname();
  const mode = useAppStore((s) => s.user?.ageGroup);
  const dialog = useRef<HTMLDialogElement>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  if (!FEEDBACK.enabled) return null;

  const device = () => `${window.innerWidth}×${window.innerHeight} · ${navigator.userAgent}`;

  function open() {
    if (status !== "sending") setStatus("idle");
    dialog.current?.showModal();
  }

  async function send() {
    if (!FEEDBACK.email) return setStatus("failed");
    setStatus("sending");
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 15000);
    try {
      const response = await fetch(`${FEEDBACK.endpoint}${FEEDBACK.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        signal: abort.signal,
        body: JSON.stringify({
          _subject: `Kompas — uwaga (${pathname})`,
          _template: "table",
          _captcha: "false",
          Uwaga: note.trim(),
          Ekran: pathname,
          Tryb: mode ? (MODE_LABEL[mode] ?? mode) : "bez konta",
          Urządzenie: device(),
        }),
      });
      const result = (await response.json().catch(() => null)) as { success?: string | boolean } | null;
      if (!response.ok || String(result?.success) !== "true") throw new Error("not delivered");
      setNote("");
      setStatus("sent");
    } catch {
      setStatus("failed");
    } finally {
      clearTimeout(timer);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`Kompas — uwaga\n\n${note.trim()}\n\n[ekran: ${pathname} · ${device()}]`);
      setStatus("copied");
    } catch {
      // The text stays in the field; the tester can still select and copy it by hand.
    }
  }

  const sending = status === "sending";
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
        className="m-auto w-[min(520px,calc(100vw-32px))] rounded-[24px] bg-card p-0 text-ink shadow-[0_24px_60px_oklch(0.2_0.01_265/0.3)] backdrop:bg-ink/50"
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
                if (!sending) setStatus("idle");
              }}
              rows={4}
              autoFocus
              disabled={sending}
              className="resize-y rounded-xl border-[1.5px] border-line-strong bg-paper px-3.5 py-3 text-base font-normal disabled:opacity-60"
            />
          </label>
          <p className="m-0 font-mono text-[11px] leading-normal text-faint">Do uwagi dołączymy: ekran ({pathname}), tryb i rodzaj urządzenia.</p>
          <p role="status" className="m-0 min-h-5 text-sm font-semibold text-moss-deeper">
            {sending && <span className="text-muted">Wysyłam…</span>}
            {status === "sent" && "Dziękujemy! Uwaga wysłana."}
            {status === "copied" && "Skopiowano. Wklej ją w wiadomości do autorki aplikacji."}
            {status === "failed" && <span className="text-coral-ink">Nie udało się wysłać. Spróbuj jeszcze raz albo skopiuj uwagę.</span>}
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <button type="button" disabled={empty || sending} onClick={() => void send()} className={`${action} bg-ink text-on-ink disabled:opacity-40`}>
              Wyślij uwagę
            </button>
            {status === "failed" && !empty && (
              <button type="button" onClick={() => void copy()} className={`${action} shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]`}>
                Skopiuj uwagę
              </button>
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
