import type { Colour, Count, IllustrationId } from "@/types";
import { LineIcon, isLineIcon } from "./LineIcon";

/**
 * Picture cards for vocabulary. Things are coloured line icons
 * (components/ui/LineIcon); colours are paint blobs and numbers are dots,
 * because there the colour or the count is the answer.
 * Content only refers to the ids.
 */
export function Illustration({ id }: { id: IllustrationId }) {
  if (id.startsWith("colour-") || id.startsWith("count-")) {
    return (
      <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden>
        {id.startsWith("colour-") ? <PaintBlob colour={id.slice(7) as Colour} /> : <Dots n={Number(id.slice(6)) as Count} />}
      </svg>
    );
  }
  // face-happy → happy, time-night → night, home-dog → dog, cake → cake
  const name = id.replace(/^(face|time|home)-/, "");
  if (!isLineIcon(name)) return null;
  return (
    <div className="grid h-full w-full place-items-center" aria-hidden>
      <LineIcon name={name} size={96} style={{ width: "72%", height: "72%" }} />
    </div>
  );
}

/* ---------- colours and numbers ---------- */

export const COLOUR_FILL: Record<Colour, string> = {
  red: "oklch(0.62 0.21 27)",
  blue: "oklch(0.58 0.17 252)",
  green: "oklch(0.66 0.17 145)",
  yellow: "oklch(0.89 0.17 98)",
  orange: "oklch(0.74 0.18 55)",
  pink: "oklch(0.82 0.10 355)",
  purple: "oklch(0.55 0.18 305)",
  black: "oklch(0.24 0.01 265)",
  white: "oklch(0.995 0.002 90)",
  brown: "oklch(0.50 0.09 55)",
};

function PaintBlob({ colour }: { colour: Colour }) {
  return (
    <g>
      <path
        d="M100 20c34 0 62 20 62 54 0 22-10 33-4 46 5 11-8 22-22 20-15-2-21 6-40 6-34 0-66-18-66-52 0-24 12-34 8-48-5-17 26-26 62-26z"
        fill={COLOUR_FILL[colour]}
        stroke={colour === "white" ? "oklch(0.80 0.02 85)" : "none"}
        strokeWidth="3"
      />
      <ellipse cx="78" cy="52" rx="16" ry="9" fill="oklch(1 0 0 / 0.35)" transform="rotate(-20 78 52)" />
    </g>
  );
}

function Dots({ n }: { n: Count }) {
  const rows = n <= 5 ? [n] : [5, n - 5];
  return (
    <g>
      {rows.flatMap((count, r) =>
        Array.from({ length: count }, (_, i) => {
          const x = 100 + (i - (count - 1) / 2) * 32;
          const y = rows.length === 1 ? 80 : 60 + r * 40;
          const colour = i % 2 ? "oklch(0.60 0.14 250)" : "oklch(0.70 0.16 55)";
          return (
            <g key={`${r}-${i}`}>
              <circle cx={x} cy={y} r="12" fill={colour} fillOpacity={0.2} />
              <circle cx={x} cy={y} r="12" fill="none" stroke={colour} strokeWidth="4" />
            </g>
          );
        }),
      )}
    </g>
  );
}
