import type { AgeGroup } from "@/types";

/**
 * Class recipes for the pieces every age mode has, but styles differently.
 * Shared exercise components pick a recipe with `useSkin()`; the learning
 * logic underneath is identical for all three modes.
 */

const press = "transition-transform active:translate-y-1 disabled:translate-y-0";

export interface Skin {
  /** Small mono label above a task. */
  eyebrow: string;
  /** Task headline. */
  title: string;
  /** Supporting text under the headline. */
  lead: string;
  /** Main forward action (Continue / Dalej). */
  primary: string;
  /** "Check" when something is selected. */
  check: string;
  /** "Check" with nothing selected. */
  checkIdle: string;
  /** Try again after a mistake. */
  retry: string;
  /** Low-emphasis action (skip, replay). */
  ghost: string;
  /** Outlined secondary action. */
  secondary: string;
  /** Feedback panels. */
  okPanel: string;
  okTitle: string;
  okText: string;
  warnPanel: string;
  warnTitle: string;
  warnText: string;
  /** XP chip. */
  xp: string;
  /** Neutral card surface. */
  card: string;
  /** Labels used by shared components. */
  t: {
    check: string;
    next: string;
    retry: string;
    replay: string;
    skipListening: string;
    skipSpeaking: string;
    finish: string;
  };
}

const child: Skin = {
  eyebrow: "font-mono text-xs tracking-[0.1em]",
  title: "m-0 font-display font-extrabold text-[clamp(28px,3.4vw,40px)] leading-none tracking-[-0.03em]",
  lead: "text-base text-muted",
  primary: `rounded-2xl bg-moss-deep px-9 py-4 font-display text-lg font-extrabold text-card shadow-[0_5px_0_var(--color-moss-deeper)] active:shadow-[0_1px_0_var(--color-moss-deeper)] ${press}`,
  check: `rounded-[18px] bg-moss-deep px-12 py-[18px] font-display text-xl font-extrabold text-card shadow-[0_5px_0_var(--color-moss-deeper)] active:shadow-[0_1px_0_var(--color-moss-deeper)] ${press}`,
  checkIdle: "rounded-[18px] bg-idle px-12 py-[18px] font-display text-xl font-extrabold text-[oklch(0.55_0.015_265)]",
  retry: `rounded-2xl bg-amber-deep px-7 py-4 font-display text-lg font-extrabold text-card shadow-[0_5px_0_var(--color-amber-deeper)] active:shadow-[0_1px_0_var(--color-amber-deeper)] ${press}`,
  ghost: "rounded-[10px] px-3 py-2.5 text-sm font-semibold text-muted hover:bg-sand",
  secondary: "rounded-2xl px-[22px] py-3.5 text-[15px] font-bold shadow-[inset_0_0_0_2px_var(--color-line)] hover:bg-sand",
  okPanel: "rounded-3xl bg-moss-soft",
  okTitle: "font-display text-2xl font-extrabold text-moss-ink",
  okText: "text-[15px] leading-normal text-[oklch(0.30_0.06_145)]",
  warnPanel: "rounded-3xl bg-amber-soft",
  warnTitle: "font-display text-2xl font-extrabold text-amber-ink",
  warnText: "text-[15px] leading-normal text-amber-body",
  xp: "inline-block animate-kpop rounded-full bg-ink px-3 py-1.5 font-mono text-[15px] font-medium text-amber",
  card: "rounded-[28px] bg-card shadow-[0_4px_0_var(--color-line),inset_0_0_0_1.5px_var(--color-line-soft)]",
  t: {
    check: "CHECK →",
    next: "Dalej →",
    retry: "Spróbuj ponownie",
    replay: "Posłuchaj jeszcze raz",
    skipListening: "Nie mogę teraz słuchać",
    skipSpeaking: "Nie mogę teraz mówić",
    finish: "Zakończ lekcję →",
  },
};

const teen: Skin = {
  eyebrow: "font-mono text-xs tracking-[0.12em] text-lime",
  title: "m-0 font-display font-extrabold text-[clamp(28px,3.4vw,42px)] leading-none tracking-[-0.03em]",
  lead: "text-sm text-night-muted",
  primary: "rounded-md bg-lime px-[30px] py-[15px] text-base font-bold text-night hover:bg-lime-hover",
  check: "rounded-md bg-lime px-10 py-4 text-base font-bold text-night hover:bg-lime-hover",
  checkIdle: "rounded-md bg-lime px-10 py-4 text-base font-bold text-night opacity-35",
  retry: "rounded-md bg-grape px-[22px] py-[13px] text-[15px] font-bold text-night",
  ghost: "rounded-md px-3 py-2.5 text-sm text-night-muted hover:bg-night-surface",
  secondary: "rounded-md px-[18px] py-3 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--color-night-line)] hover:bg-night-surface",
  okPanel: "rounded-[10px] bg-lime/12 shadow-[inset_0_0_0_1.5px_var(--color-lime)]",
  okTitle: "font-display text-2xl font-extrabold text-lime",
  okText: "text-sm leading-normal text-[oklch(0.85_0.015_275)]",
  warnPanel: "rounded-[10px] bg-grape/12 shadow-[inset_0_0_0_1.5px_var(--color-grape)]",
  warnTitle: "font-display text-2xl font-extrabold text-grape-text",
  warnText: "text-sm leading-normal text-[oklch(0.85_0.015_275)]",
  xp: "inline-block animate-kpop rounded bg-lime px-2.5 py-1 font-mono text-[13px] text-night",
  card: "rounded-xl bg-night-surface",
  t: {
    check: "Check →",
    next: "Continue →",
    retry: "Try again",
    replay: "Replay",
    skipListening: "Can't listen right now",
    skipSpeaking: "Can't speak right now",
    finish: "Debrief →",
  },
};

const adult: Skin = {
  eyebrow: "font-mono text-[11px] tracking-[0.12em] text-muted",
  title: "m-0 font-serif font-normal text-[clamp(32px,4vw,46px)] leading-[1.15]",
  lead: "text-[15px] text-muted",
  primary: "rounded-md bg-ink px-[22px] py-[13px] text-[15px] text-canvas hover:bg-ink-hover",
  check: "rounded-md bg-ink px-7 py-[15px] text-[15px] text-canvas hover:bg-ink-hover",
  checkIdle: "rounded-md bg-ink px-7 py-[15px] text-[15px] text-canvas opacity-35",
  retry: "rounded-md bg-ink px-[18px] py-3 text-sm text-canvas hover:bg-ink-hover",
  ghost: "px-1 py-2 text-sm text-muted underline underline-offset-4",
  secondary: "rounded-md px-4 py-3 text-sm shadow-[inset_0_0_0_1px_var(--color-canvas-line-strong)] hover:bg-canvas-card",
  okPanel: "border-l-2 border-azure bg-azure-soft",
  okTitle: "font-semibold",
  okText: "text-sm text-azure-ink",
  warnPanel: "border-l-2 border-ochre bg-ochre-soft",
  warnTitle: "font-semibold",
  warnText: "text-sm text-[oklch(0.38_0.06_60)]",
  xp: "font-mono text-xs text-azure",
  card: "rounded-lg bg-canvas-card shadow-[inset_0_0_0_1px_var(--color-canvas-line)]",
  t: {
    check: "Check",
    next: "Continue →",
    retry: "Try again",
    replay: "Replay",
    skipListening: "I can't listen right now",
    skipSpeaking: "I can't speak right now",
    finish: "Finish lesson →",
  },
};

export const SKINS: Record<AgeGroup, Skin> = { CHILD: child, TEEN: teen, ADULT: adult };
