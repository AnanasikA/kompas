"use client";

import { RichText } from "@/components/ui/RichText";
import { useAge } from "@/features/theme/AgeScope";
import { useSkin } from "@/features/theme/useSkin";
import { cx } from "@/lib/utils";

interface FeedbackProps {
  kind: "correct" | "almost";
  title: string;
  note?: string;
  /** Extra line under the note (e.g. "added to review"). */
  footnote?: string;
  xp?: number | null;
  /** Buttons, rendered on the right (or below on phones). */
  actions: React.ReactNode;
  /** Child mode: slide up from the bottom of the screen instead of sitting inline. */
  sheet?: boolean;
}

function XpChip({ xp }: { xp: number }) {
  const skin = useSkin();
  return <span className={skin.xp}>+{xp} XP</span>;
}

/**
 * Result of an attempt, in the visual language of the learner's age mode.
 * Always says in words what happened; colour and icon only reinforce it.
 */
export function Feedback({ kind, title, note, footnote, xp, actions, sheet }: FeedbackProps) {
  const age = useAge();
  const skin = useSkin();
  const ok = kind === "correct";

  if (age === "CHILD") {
    const body = (
      <div className="mx-auto grid grid-cols-1 max-w-[900px] items-center gap-x-6 gap-y-[18px] sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-3.5">
            <span
              aria-hidden
              className={cx("grid size-11 shrink-0 place-items-center rounded-full font-display text-[22px] font-extrabold text-card", ok ? "bg-moss-deep" : "bg-amber-deep")}
            >
              {ok ? "✓" : "?"}
            </span>
            <p className={cx("m-0 font-display text-[clamp(22px,2.6vw,28px)] font-extrabold", ok ? "text-moss-ink" : "text-amber-ink")}>{title}</p>
            {ok && xp ? <XpChip xp={xp} /> : null}
          </div>
          {note && (
            <p className={cx("m-0 rounded-[14px] px-4 py-3 text-base leading-normal", ok ? "bg-[oklch(0.97_0.03_145)] text-[oklch(0.28_0.06_145)]" : "bg-[oklch(0.97_0.03_85)] text-amber-body")}>
              <RichText text={note} />
            </p>
          )}
          {footnote && <p className={cx("m-0 font-mono text-xs", ok ? "text-moss-ink" : "text-[oklch(0.45_0.08_60)]")}>{footnote}</p>}
        </div>
        <div className="flex flex-col gap-2.5">{actions}</div>
      </div>
    );
    return sheet ? (
      <div
        role="status"
        aria-live="polite"
        className={cx("fixed inset-x-0 bottom-0 z-10 animate-kslide rounded-t-[32px] px-[clamp(20px,3vw,40px)] pb-7 pt-6", ok ? "bg-moss-soft" : "bg-amber-soft")}
      >
        {body}
      </div>
    ) : (
      <div role="status" aria-live="polite" className={cx("animate-kfade px-6 py-5", ok ? skin.okPanel : skin.warnPanel)}>
        {body}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cx(
        "grid grid-cols-1 animate-kfade items-center gap-[18px] sm:grid-cols-[minmax(0,1fr)_auto]",
        age === "TEEN" ? "px-6 py-5" : "px-5 py-[18px]",
        ok ? skin.okPanel : skin.warnPanel,
      )}
    >
      <div className="flex max-w-[60ch] flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-3">
          <p className={cx("m-0", ok ? skin.okTitle : skin.warnTitle)}>
            <span aria-hidden>{ok ? "✓ " : "✕ "}</span>
            {title}
          </p>
          {ok && xp ? <XpChip xp={xp} /> : null}
        </div>
        {note && (
          <p className={cx("m-0", ok ? skin.okText : skin.warnText)}>
            <RichText text={note} />
          </p>
        )}
        {footnote && <p className="m-0 font-mono text-[11px] opacity-80">{footnote}</p>}
      </div>
      <div className={cx("flex gap-2", age === "TEEN" ? "flex-col" : "flex-wrap")}>{actions}</div>
    </div>
  );
}
