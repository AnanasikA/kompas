/** Avatar background colours (prototype palette). `User.avatarColor` indexes this list. */
export const AVATAR_COLORS = [
  "oklch(0.74 0.15 225)",
  "oklch(0.74 0.15 305)",
  "oklch(0.74 0.15 145)",
  "oklch(0.74 0.15 35)",
  "oklch(0.80 0.15 75)",
];

export function initialOf(name: string): string {
  return (name.trim().charAt(0) || "K").toUpperCase();
}

/** Chunky "selected / not selected" shadow used by child-mode option tiles. */
export const SELECT_ON = "shadow-[0_5px_0_var(--color-amber-deep),inset_0_0_0_3px_var(--color-amber-deep)]";
export const SELECT_OFF = "shadow-[0_4px_0_var(--color-line),inset_0_0_0_2px_var(--color-line)]";
