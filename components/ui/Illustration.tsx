import type { Colour, Count, Feeling, HomeThing, IllustrationId, TimeOfDay } from "@/types";
import { HomeDrawing } from "./HomeDrawings";

/**
 * Picture cards for vocabulary. The café items are drawn in CSS as in the
 * prototype, the rest as small SVG drawings. Replace with real artwork by
 * swapping this component; content only refers to the ids.
 */
export function Illustration({ id }: { id: IllustrationId }) {
  const drawing = svgDrawing(id);
  if (drawing) {
    return (
      <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden>
        {drawing}
      </svg>
    );
  }
  return (
    <div className="relative h-full w-full overflow-hidden" aria-hidden>
      {id === "juice" && (
        <>
          <div
            className="absolute left-1/2 top-1/2 h-[92px] w-[60px] -translate-x-1/2 -translate-y-[44%] rounded-[6px_6px_16px_16px]"
            style={{ background: "linear-gradient(oklch(0.92 0.06 70) 0 14%,oklch(0.76 0.17 60) 14%)", boxShadow: "inset 0 0 0 3px oklch(0.97 0.01 85 / 0.6)" }}
          />
          <div className="absolute top-5 h-[60px] w-1.5 rotate-[14deg] rounded-[3px]" style={{ left: "calc(50% + 4px)", background: "oklch(0.62 0.17 35)" }} />
          <div className="absolute top-9 size-[34px] rounded-full" style={{ left: "calc(50% - 46px)", background: "oklch(0.80 0.16 70)", boxShadow: "inset 0 0 0 4px oklch(0.70 0.16 60)" }} />
        </>
      )}
      {id === "coffee" && (
        <>
          <div className="absolute bottom-[30px] left-1/2 h-4 w-[110px] -translate-x-1/2 rounded-full" style={{ background: "oklch(0.97 0.01 85)", boxShadow: "0 2px 0 oklch(0.85 0.02 85)" }} />
          <div className="absolute bottom-10 left-1/2 h-14 w-[70px] -translate-x-[56%] rounded-[4px_4px_30px_30px]" style={{ background: "oklch(0.99 0.004 85)", boxShadow: "inset 0 10px 0 oklch(0.42 0.07 50)" }} />
          <div className="absolute bottom-[58px] h-6 w-[22px] rounded-full" style={{ left: "calc(50% + 26px)", border: "6px solid oklch(0.99 0.004 85)" }} />
          <div className="absolute top-[22px] h-[26px] w-1.5 rounded-[3px]" style={{ left: "calc(50% - 16px)", background: "oklch(0.85 0.02 85)" }} />
          <div className="absolute top-4 h-[30px] w-1.5 rounded-[3px]" style={{ left: "calc(50% - 2px)", background: "oklch(0.85 0.02 85)" }} />
        </>
      )}
      {id === "sandwich" &&
        [
          ["120px", "80px", "-40%", "oklch(0.82 0.10 75)"],
          ["116px", "70px", "-30%", "oklch(0.70 0.17 140)"],
          ["112px", "62px", "-22%", "oklch(0.86 0.12 90)"],
          ["108px", "54px", "-14%", "oklch(0.90 0.06 80)"],
        ].map(([w, h, y, bg]) => (
          <div
            key={w}
            className="absolute left-1/2 top-1/2"
            style={{ width: w, height: h, background: bg, transform: `translate(-50%, ${y})`, clipPath: "polygon(0 100%,100% 100%,50% 0)" }}
          />
        ))}
      {id === "water" && (
        <>
          <div className="absolute left-1/2 top-[22px] h-3.5 w-5 -translate-x-1/2 rounded-[3px]" style={{ background: "oklch(0.52 0.12 235)" }} />
          <div className="absolute left-1/2 top-[34px] h-3 w-7 -translate-x-1/2" style={{ background: "oklch(0.88 0.04 225)" }} />
          <div className="absolute left-1/2 top-11 h-24 w-[50px] -translate-x-1/2 rounded-[16px_16px_10px_10px]" style={{ background: "oklch(0.88 0.06 225)", boxShadow: "inset -8px 0 0 oklch(0.84 0.07 225)" }} />
          <div className="absolute left-1/2 top-20 h-6 w-[50px] -translate-x-1/2" style={{ background: "oklch(0.74 0.15 225)" }} />
        </>
      )}
    </div>
  );
}

/* ---------- SVG drawings ---------- */

const INK = "oklch(0.25 0.01 265)";

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
          return <circle key={`${r}-${i}`} cx={x} cy={y} r="13" fill={i % 2 ? "oklch(0.74 0.15 225)" : "oklch(0.80 0.15 75)"} stroke={INK} strokeWidth="2.5" />;
        }),
      )}
    </g>
  );
}

function Face({ feeling }: { feeling: Feeling }) {
  const eyes =
    feeling === "tired" ? (
      <g stroke={INK} strokeWidth="4" strokeLinecap="round">
        <path d="M74 72q8 6 16 0" fill="none" />
        <path d="M110 72q8 6 16 0" fill="none" />
      </g>
    ) : (
      <g fill={INK}>
        <circle cx="82" cy="68" r="6" />
        <circle cx="118" cy="68" r="6" />
      </g>
    );
  const mouth = {
    happy: <path d="M76 92q24 26 48 0" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />,
    sad: <path d="M78 108q22-20 44 0" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />,
    tired: <path d="M88 102h24" stroke={INK} strokeWidth="5" strokeLinecap="round" />,
    hungry: (
      <g>
        <ellipse cx="100" cy="100" rx="16" ry="13" fill={INK} />
        <ellipse cx="100" cy="106" rx="9" ry="6" fill="oklch(0.70 0.15 15)" />
      </g>
    ),
  }[feeling];
  return (
    <g>
      <circle cx="100" cy="82" r="58" fill="oklch(0.88 0.14 92)" stroke={INK} strokeWidth="3" />
      {eyes}
      {mouth}
      {feeling === "sad" && <path d="M121 78q5 10 0 14q-5-4 0-14z" fill="oklch(0.70 0.12 230)" />}
      {feeling === "tired" && (
        <text x="150" y="40" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="22" fill="oklch(0.55 0.10 260)">
          Zz
        </text>
      )}
      {feeling === "hungry" && (
        <g stroke={INK} strokeWidth="4" strokeLinecap="round">
          <path d="M168 50v56" />
          <path d="M160 50v18M176 50v18M160 68h16" fill="none" />
        </g>
      )}
    </g>
  );
}

function TimeScene({ time }: { time: TimeOfDay }) {
  const sky = { morning: "oklch(0.92 0.06 220)", afternoon: "oklch(0.86 0.09 230)", evening: "oklch(0.80 0.12 45)", night: "oklch(0.30 0.06 270)" }[time];
  return (
    <g>
      <rect x="14" y="12" width="172" height="136" rx="20" fill={sky} />
      {time === "night" ? (
        <g>
          <path d="M118 36a30 30 0 1 0 22 52a26 26 0 1 1-22-52z" fill="oklch(0.93 0.08 95)" />
          {[
            [48, 40],
            [70, 70],
            [40, 92],
            [160, 52],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="oklch(0.95 0.05 95)" />
          ))}
        </g>
      ) : (
        <g>
          {time !== "evening" &&
            Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * Math.PI * 2;
              const cy = time === "morning" ? 104 : 56;
              return (
                <line
                  key={i}
                  x1={100 + Math.cos(a) * 30}
                  y1={cy + Math.sin(a) * 30}
                  x2={100 + Math.cos(a) * 42}
                  y2={cy + Math.sin(a) * 42}
                  stroke="oklch(0.80 0.16 80)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              );
            })}
          <circle cx="100" cy={time === "morning" ? 104 : time === "afternoon" ? 56 : 112} r="22" fill={time === "evening" ? "oklch(0.70 0.18 40)" : "oklch(0.86 0.17 90)"} />
        </g>
      )}
      <path d="M14 120q40-20 86-4t86-6v26a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z" fill={time === "night" ? "oklch(0.36 0.07 150)" : "oklch(0.70 0.15 140)"} />
    </g>
  );
}

function BirthdayThing({ id }: { id: "cake" | "present" | "balloon" | "candle" }) {
  if (id === "cake")
    return (
      <g stroke={INK} strokeWidth="3">
        <rect x="46" y="84" width="108" height="50" rx="8" fill="oklch(0.80 0.10 0)" />
        <path d="M46 98q14 12 27 0t27 0t27 0t27 0" fill="none" stroke="oklch(0.98 0.01 90)" strokeWidth="7" />
        <rect x="76" y="56" width="10" height="28" rx="3" fill="oklch(0.85 0.10 230)" />
        <rect x="114" y="56" width="10" height="28" rx="3" fill="oklch(0.85 0.12 140)" />
        <path d="M81 40q6 8 0 14q-6-6 0-14zM119 40q6 8 0 14q-6-6 0-14z" fill="oklch(0.80 0.17 70)" />
        <path d="M36 136h128" strokeLinecap="round" />
      </g>
    );
  if (id === "present")
    return (
      <g stroke={INK} strokeWidth="3">
        <rect x="54" y="66" width="92" height="70" rx="6" fill="oklch(0.62 0.17 300)" />
        <rect x="48" y="52" width="104" height="22" rx="5" fill="oklch(0.66 0.17 300)" />
        <rect x="93" y="52" width="14" height="84" fill="oklch(0.86 0.15 90)" />
        <path d="M100 52c-26-30-44-6-22 0zM100 52c26-30 44-6 22 0z" fill="oklch(0.86 0.15 90)" />
      </g>
    );
  if (id === "balloon")
    return (
      <g stroke={INK} strokeWidth="3">
        <ellipse cx="100" cy="64" rx="38" ry="46" fill="oklch(0.64 0.20 25)" />
        <path d="M94 110h12l-6 8z" fill="oklch(0.64 0.20 25)" />
        <path d="M100 118q-12 14 0 24t0 14" fill="none" />
        <ellipse cx="86" cy="46" rx="8" ry="12" fill="oklch(1 0 0 / 0.4)" stroke="none" />
      </g>
    );
  return (
    <g stroke={INK} strokeWidth="3">
      <rect x="86" y="64" width="28" height="72" rx="5" fill="oklch(0.86 0.10 230)" />
      <path d="M86 84l28-10M86 104l28-10M86 124l28-10" stroke="oklch(1 0 0 / 0.7)" strokeWidth="5" />
      <path d="M100 64v-10" />
      <path d="M100 22q14 16 0 30q-14-14 0-30z" fill="oklch(0.80 0.17 70)" />
      <path d="M70 136h60" strokeLinecap="round" />
    </g>
  );
}

function svgDrawing(id: IllustrationId): React.ReactNode | null {
  if (id.startsWith("colour-")) return <PaintBlob colour={id.slice(7) as Colour} />;
  if (id.startsWith("count-")) return <Dots n={Number(id.slice(6)) as Count} />;
  if (id.startsWith("face-")) return <Face feeling={id.slice(5) as Feeling} />;
  if (id.startsWith("time-")) return <TimeScene time={id.slice(5) as TimeOfDay} />;
  if (id.startsWith("home-")) return <HomeDrawing thing={id.slice(5) as HomeThing} />;
  if (id === "cake" || id === "present" || id === "balloon" || id === "candle") return <BirthdayThing id={id} />;
  return null;
}
