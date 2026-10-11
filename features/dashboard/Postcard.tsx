import { PropAt, themeOf } from "@/features/journey/MapArt";
import { cx } from "@/lib/utils";

/**
 * A postcard from a world: a small picture of the island with the things
 * the world is about, a stamp with the world's number and, once the world
 * is finished, a postmark across the stamp. A world still in progress is a
 * pale sketch with its progress written on it; one still ahead is a blank.
 */

export type PostcardState = "collected" | "progress" | "ahead";

export function Postcard({
  unitId,
  title,
  order,
  level,
  tint,
  state,
  percent,
  tilt,
}: {
  unitId: string;
  title: string;
  order: number;
  level: string;
  tint: string;
  state: PostcardState;
  percent: number;
  tilt: string;
}) {
  const [main, second, third] = themeOf(unitId);
  const collected = state === "collected";
  const id = `pc-${unitId.replace(/\W/g, "-")}`;
  return (
    <figure
      className={cx(
        "relative m-0 flex w-[188px] shrink-0 flex-col overflow-hidden rounded-[10px] bg-card p-1.5 transition-transform hover:rotate-0",
        tilt,
        collected ? "shadow-[0_8px_18px_oklch(0.23_0.025_265/0.18)]" : "shadow-[0_3px_8px_oklch(0.23_0.025_265/0.10)]",
      )}
    >
      <svg viewBox="0 0 176 104" className="block h-auto w-full rounded-[6px]" aria-hidden style={state === "ahead" ? { filter: "grayscale(1)", opacity: 0.35 } : state === "progress" ? { filter: "saturate(0.35)", opacity: 0.85 } : undefined}>
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect width="176" height="104" rx="6" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-clip)`}>
          <rect width="176" height="104" fill="oklch(0.88 0.06 225)" />
          <circle cx="30" cy="24" r="11" fill="oklch(0.88 0.14 90)" />
          <path d="M120 18c4 -6 12 -6 16 0c6 -2 12 2 10 8h-30c-2 -4 0 -8 4 -8z" fill="oklch(0.98 0.01 85)" />
          <path d="M-4 70 Q30 52 70 60 T176 56 V104 H-4 Z" fill="oklch(0.90 0.055 85)" stroke="oklch(0.50 0.06 60)" strokeWidth="1.5" />
          <path d="M-4 76 Q34 60 72 66 T176 62 V104 H-4 Z" fill={tint} />
          <PropAt id={second} x={34} y={90} size={40} />
          <PropAt id={main} x={92} y={94} size={58} />
          <PropAt id={third ?? "tree"} x={146} y={88} size={36} />
        </g>
      </svg>

      {/* Stamp, top right, with a postmark once the world is collected. */}
      <div aria-hidden className="absolute right-3 top-3 grid h-[38px] w-[32px] place-items-center rounded-[3px] bg-card p-[3px] shadow-[0_1px_2px_oklch(0.23_0.025_265/0.25)]">
        <div className={cx("grid h-full w-full place-items-center rounded-[2px] border border-dashed", collected ? "border-ink/40 bg-amber-soft" : "border-ink/25 bg-sand")}>
          <span className="font-display text-[13px] font-extrabold leading-none">{order}</span>
        </div>
        {collected && (
          <svg viewBox="0 0 60 40" className="absolute -left-6 top-2 h-[30px] w-[46px]">
            <circle cx="18" cy="20" r="14" fill="none" stroke="oklch(0.45 0.10 30 / 0.75)" strokeWidth="2" />
            <text x="18" y="23" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="oklch(0.45 0.10 30 / 0.85)">
              {level}
            </text>
            <path d="M34 12q6 -4 12 0t12 0M34 20q6 -4 12 0t12 0M34 28q6 -4 12 0t12 0" fill="none" stroke="oklch(0.45 0.10 30 / 0.75)" strokeWidth="1.6" />
          </svg>
        )}
      </div>

      <figcaption className="flex items-end justify-between gap-2 px-1.5 pb-1 pt-2">
        <span className="flex min-w-0 flex-col">
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted">{collected ? "Pozdrowienia z" : state === "progress" ? "W drodze do" : "Przed Tobą"}</span>
          <span className="truncate font-display text-[17px] font-extrabold leading-tight">{title}</span>
        </span>
        {state === "progress" && <span className="shrink-0 rounded-full bg-amber px-2 py-0.5 font-mono text-[10px]">{percent}%</span>}
        {collected && (
          <span className="shrink-0 font-display text-[13px] font-extrabold text-moss-ink" aria-hidden>
            ✓
          </span>
        )}
      </figcaption>
      <span className="sr-only">{collected ? " — zdobyta" : state === "progress" ? ` — w trakcie, ${percent}%` : " — jeszcze przed Tobą"}</span>
    </figure>
  );
}
