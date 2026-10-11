import type { HomeThing } from "@/types";

/**
 * Picture cards for the Home world: family, rooms, furniture, toys, pets,
 * actions, clothes and where things are. Drawn on the 200×160 card of
 * Illustration, in the same flat style with a dark outline.
 */

const INK = "oklch(0.25 0.01 265)";
const LINE = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const SKIN = "oklch(0.86 0.06 60)";
const FLOOR = <path d="M24 140h152" {...LINE} />;
const C = {
  red: "oklch(0.66 0.18 28)",
  blue: "oklch(0.66 0.14 245)",
  green: "oklch(0.70 0.15 145)",
  yellow: "oklch(0.86 0.15 90)",
  purple: "oklch(0.64 0.15 305)",
  pink: "oklch(0.80 0.10 0)",
  brown: "oklch(0.55 0.09 55)",
  wood: "oklch(0.72 0.09 65)",
  grey: "oklch(0.78 0.01 265)",
  white: "oklch(0.98 0.01 85)",
  hair: "oklch(0.42 0.07 50)",
  dark: "oklch(0.30 0.02 265)",
  water: "oklch(0.80 0.09 230)",
};

/* ---------- people ---------- */

type PersonLook = { x?: number; size?: number; hair: "long" | "short" | "bun" | "bald" | "pigtails" | "baby"; hairColour?: string; top: string; skirt?: boolean; glasses?: boolean };

function Person({ x = 100, size = 1, hair, hairColour = C.hair, top, skirt, glasses }: PersonLook) {
  const s = size;
  const head = { cx: x, cy: 140 - 112 * s, r: 18 * s };
  return (
    <g>
      {/* legs */}
      <path d={`M${x - 9 * s} ${140 - 44 * s}v${42 * s}M${x + 9 * s} ${140 - 44 * s}v${42 * s}`} {...LINE} strokeWidth={6 * s} stroke={C.dark} />
      {/* body */}
      {skirt ? (
        <path d={`M${x - 16 * s} ${140 - 88 * s}h${32 * s}l${10 * s} ${46 * s}h${-52 * s}z`} fill={top} {...LINE} />
      ) : (
        <rect x={x - 17 * s} y={140 - 88 * s} width={34 * s} height={46 * s} rx={8 * s} fill={top} {...LINE} />
      )}
      {/* arms */}
      <path d={`M${x - 17 * s} ${140 - 80 * s}l${-12 * s} ${30 * s}M${x + 17 * s} ${140 - 80 * s}l${12 * s} ${30 * s}`} {...LINE} strokeWidth={5 * s} stroke={SKIN} />
      {hair === "long" && <path d={`M${x - 21 * s} ${head.cy + 22 * s}V${head.cy - 4 * s}a${21 * s} ${21 * s} 0 0 1 ${42 * s} 0V${head.cy + 22 * s}z`} fill={hairColour} {...LINE} />}
      <circle {...head} fill={SKIN} {...LINE} />
      {hair === "short" && <path d={`M${x - 18 * s} ${head.cy - 2 * s}a${18 * s} ${18 * s} 0 0 1 ${36 * s} 0q${-18 * s} ${-8 * s} ${-36 * s} 0z`} fill={hairColour} {...LINE} />}
      {hair === "long" && <path d={`M${x - 18 * s} ${head.cy - 4 * s}a${18 * s} ${18 * s} 0 0 1 ${36 * s} 0q${-18 * s} ${-10 * s} ${-36 * s} 0z`} fill={hairColour} {...LINE} />}
      {hair === "bun" && (
        <>
          <circle cx={x} cy={head.cy - 22 * s} r={9 * s} fill={hairColour} {...LINE} />
          <path d={`M${x - 18 * s} ${head.cy - 2 * s}a${18 * s} ${18 * s} 0 0 1 ${36 * s} 0q${-18 * s} ${-8 * s} ${-36 * s} 0z`} fill={hairColour} {...LINE} />
        </>
      )}
      {hair === "pigtails" && (
        <>
          <circle cx={x - 22 * s} cy={head.cy} r={7 * s} fill={hairColour} {...LINE} />
          <circle cx={x + 22 * s} cy={head.cy} r={7 * s} fill={hairColour} {...LINE} />
          <path d={`M${x - 18 * s} ${head.cy - 2 * s}a${18 * s} ${18 * s} 0 0 1 ${36 * s} 0q${-18 * s} ${-8 * s} ${-36 * s} 0z`} fill={hairColour} {...LINE} />
        </>
      )}
      {hair === "bald" && <path d={`M${x - 18 * s} ${head.cy + 2 * s}q${-4 * s} ${-8 * s} ${2 * s} ${-12 * s}M${x + 18 * s} ${head.cy + 2 * s}q${4 * s} ${-8 * s} ${-2 * s} ${-12 * s}`} fill="none" {...LINE} stroke={hairColour} strokeWidth={5 * s} />}
      {/* face */}
      <circle cx={x - 6 * s} cy={head.cy + 2 * s} r={2 * s} fill={INK} />
      <circle cx={x + 6 * s} cy={head.cy + 2 * s} r={2 * s} fill={INK} />
      <path d={`M${x - 5 * s} ${head.cy + 9 * s}q${5 * s} ${4 * s} ${10 * s} 0`} fill="none" {...LINE} strokeWidth={2} />
      {glasses && <path d={`M${x - 13 * s} ${head.cy + 2 * s}a${5 * s} ${5 * s} 0 1 0 ${10 * s} 0a${5 * s} ${5 * s} 0 1 0 ${-10 * s} 0M${x + 3 * s} ${head.cy + 2 * s}a${5 * s} ${5 * s} 0 1 0 ${10 * s} 0a${5 * s} ${5 * s} 0 1 0 ${-10 * s} 0M${x - 3 * s} ${head.cy + 2 * s}h${6 * s}`} fill="none" {...LINE} strokeWidth={2} />}
    </g>
  );
}

function Baby() {
  return (
    <g>
      <path d="M58 140h84" {...LINE} />
      <rect x="62" y="96" width="76" height="36" rx="18" fill={C.white} {...LINE} />
      <path d="M62 112a38 30 0 0 1 76 0" fill={C.blue} {...LINE} />
      <circle cx="100" cy="76" r="22" fill={SKIN} {...LINE} />
      <path d="M100 54q6 -6 2 -10" fill="none" {...LINE} />
      <circle cx="93" cy="76" r="2.4" fill={INK} />
      <circle cx="107" cy="76" r="2.4" fill={INK} />
      <circle cx="100" cy="86" r="4" fill={C.pink} {...LINE} strokeWidth={2} />
      <path d="M68 132l-6 8M132 132l6 8" {...LINE} />
    </g>
  );
}

/* ---------- rooms ---------- */

function Room({ wall, children }: { wall: string; children: React.ReactNode }) {
  return (
    <g>
      <rect x="20" y="16" width="160" height="124" rx="8" fill={wall} {...LINE} />
      <path d="M20 110h160" {...LINE} strokeWidth={2} />
      {children}
    </g>
  );
}

/* ---------- small things ---------- */

function Ball({ x = 100, y = 108, r = 30 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={C.red} {...LINE} />
      <path d={`M${x - r} ${y}q${r} ${-r * 0.6} ${2 * r} 0M${x} ${y - r}q${-r * 0.5} ${r} 0 ${2 * r}`} fill="none" stroke={C.white} strokeWidth={5} />
    </g>
  );
}

function Box({ open = true }) {
  return (
    <g>
      <path d="M60 80h80v58H60z" fill={C.wood} {...LINE} />
      {open && <path d="M60 80l-14 -16M140 80l14 -16" {...LINE} />}
      <path d="M60 96h80" {...LINE} strokeWidth={2} />
    </g>
  );
}

function Stick({ pose }: { pose: "jump" | "swim" | "climb" | "dance" | "run" | "fly" }) {
  if (pose === "swim")
    return (
      <g>
        <rect x="18" y="80" width="164" height="60" rx="10" fill={C.water} {...LINE} />
        <circle cx="96" cy="78" r="15" fill={SKIN} {...LINE} />
        <path d="M110 84q20 -30 40 -8M80 92q-14 -22 -36 -12" fill="none" {...LINE} strokeWidth={6} stroke={SKIN} />
        <path d="M30 104q12 -8 24 0t24 0t24 0t24 0t24 0t24 0" fill="none" stroke={C.white} strokeWidth={4} strokeLinecap="round" />
        <circle cx="91" cy="77" r="2" fill={INK} />
        <circle cx="101" cy="77" r="2" fill={INK} />
      </g>
    );
  if (pose === "climb")
    return (
      <g>
        <path d="M56 20v120M104 20v120M56 44h48M56 72h48M56 100h48M56 128h48" {...LINE} stroke={C.brown} strokeWidth={6} />
        <circle cx="134" cy="48" r="14" fill={SKIN} {...LINE} />
        <path d="M134 62v36M134 70l-30 -24M134 78l-30 20M134 98l-30 30M134 98l8 34" fill="none" {...LINE} strokeWidth={6} stroke={C.blue} />
      </g>
    );
  if (pose === "fly")
    return (
      <g>
        <circle cx="160" cy="34" r="14" fill={C.yellow} {...LINE} />
        <path d="M40 98q30 -40 60 -6q30 -34 60 6q-30 -16 -60 8q-30 -24 -60 -8z" fill={C.blue} {...LINE} />
        <circle cx="100" cy="94" r="10" fill={C.blue} {...LINE} />
        <path d="M108 94l10 4l-10 4" fill={C.yellow} {...LINE} strokeWidth={2} />
      </g>
    );
  const at = pose === "jump" ? { y: 0, legs: "M100 96l-16 18M100 96l16 18", arms: "M100 66l-22 -20M100 66l22 -20" } : pose === "run" ? { y: 10, legs: "M100 104l-22 30M100 104l14 14l-6 18", arms: "M100 74l-22 12M100 74l20 -14" } : { y: 10, legs: "M100 104l-14 34M100 104l18 30", arms: "M100 74l-24 -22M100 74l26 8" };
  return (
    <g>
      {FLOOR}
      {pose === "jump" && <path d="M76 132h48" stroke={C.grey} strokeWidth={4} strokeLinecap="round" strokeDasharray="6 6" />}
      {pose === "dance" && <path d="M146 36v26a7 7 0 1 1 -4 -6V36l16 -4v22a7 7 0 1 1 -4 -6V30" fill="none" {...LINE} />}
      <g transform={`translate(0 ${at.y})`}>
        <circle cx="100" cy="44" r="16" fill={SKIN} {...LINE} />
        <path d={`M100 60v36${pose === "jump" ? "" : "v8"}`} {...LINE} strokeWidth={7} stroke={C.purple} />
        <path d={at.arms} fill="none" {...LINE} strokeWidth={6} stroke={SKIN} />
        <path d={at.legs} fill="none" {...LINE} strokeWidth={6} stroke={C.dark} />
      </g>
    </g>
  );
}

const DRAWINGS: Record<HomeThing, () => React.ReactNode> = {
  /* family */
  mum: () => (
    <>
      {FLOOR}
      <Person hair="long" top={C.red} skirt />
    </>
  ),
  dad: () => (
    <>
      {FLOOR}
      <Person hair="short" top={C.blue} />
    </>
  ),
  sister: () => (
    <>
      {FLOOR}
      <Person hair="pigtails" top={C.pink} skirt size={0.78} />
    </>
  ),
  brother: () => (
    <>
      {FLOOR}
      <Person hair="short" top={C.green} size={0.78} hairColour={C.brown} />
    </>
  ),
  baby: () => <Baby />,
  grandma: () => (
    <>
      {FLOOR}
      <Person hair="bun" hairColour={C.grey} top={C.purple} skirt glasses />
    </>
  ),
  grandpa: () => (
    <>
      {FLOOR}
      <Person hair="bald" hairColour={C.grey} top={C.brown} glasses />
    </>
  ),
  /* rooms */
  kitchen: () => (
    <Room wall="oklch(0.94 0.04 90)">
      <rect x="40" y="70" width="60" height="70" fill={C.white} {...LINE} />
      <circle cx="56" cy="62" r="0" />
      <path d="M40 84h60" {...LINE} strokeWidth={2} />
      <circle cx="56" cy="77" r="4" fill={C.dark} />
      <circle cx="84" cy="77" r="4" fill={C.dark} />
      <rect x="50" y="94" width="40" height="30" rx="3" fill={C.grey} {...LINE} strokeWidth={2} />
      <path d="M118 62h36v14a18 10 0 0 1 -36 0z" fill={C.red} {...LINE} />
      <path d="M136 52v10" {...LINE} />
    </Room>
  ),
  bathroom: () => (
    <Room wall="oklch(0.92 0.04 220)">
      <path d="M34 92h132v16a24 24 0 0 1 -24 24H58a24 24 0 0 1 -24 -24z" fill={C.white} {...LINE} />
      <path d="M150 92V48h-16" fill="none" {...LINE} />
      <circle cx="70" cy="80" r="9" fill={C.white} {...LINE} strokeWidth={2} />
      <circle cx="88" cy="72" r="6" fill={C.white} {...LINE} strokeWidth={2} />
      <path d="M50 132l-4 8M150 132l4 8" {...LINE} />
    </Room>
  ),
  bedroom: () => (
    <Room wall="oklch(0.92 0.04 300)">
      <rect x="36" y="90" width="128" height="30" rx="4" fill={C.blue} {...LINE} />
      <rect x="40" y="76" width="34" height="18" rx="8" fill={C.white} {...LINE} />
      <path d="M36 70v70M164 100v40" {...LINE} strokeWidth={5} stroke={C.brown} />
      <circle cx="148" cy="44" r="12" fill={C.yellow} {...LINE} strokeWidth={2} />
      <path d="M152 36a12 12 0 1 0 6 14a10 10 0 0 1 -6 -14z" fill={C.white} stroke="none" />
    </Room>
  ),
  "living-room": () => (
    <Room wall="oklch(0.93 0.05 60)">
      <rect x="34" y="78" width="96" height="44" rx="10" fill={C.green} {...LINE} />
      <rect x="44" y="92" width="76" height="22" rx="6" fill="oklch(0.78 0.13 145)" {...LINE} strokeWidth={2} />
      <path d="M42 122v12M122 122v12" {...LINE} />
      <rect x="140" y="58" width="28" height="22" rx="3" fill={C.dark} {...LINE} />
      <path d="M154 80v40M144 120h20" {...LINE} />
      <rect x="54" y="32" width="40" height="30" fill={C.yellow} {...LINE} strokeWidth={2} />
    </Room>
  ),
  /* furniture */
  bed: () => (
    <>
      {FLOOR}
      <rect x="30" y="86" width="140" height="36" rx="6" fill={C.blue} {...LINE} />
      <rect x="36" y="70" width="40" height="22" rx="10" fill={C.white} {...LINE} />
      <path d="M30 56v84M170 96v44" {...LINE} strokeWidth={7} stroke={C.brown} />
    </>
  ),
  table: () => (
    <>
      {FLOOR}
      <rect x="30" y="72" width="140" height="14" rx="4" fill={C.wood} {...LINE} />
      <path d="M44 86v54M156 86v54" {...LINE} strokeWidth={7} stroke={C.brown} />
      <path d="M86 72v-14h28v14" fill={C.white} {...LINE} strokeWidth={2} />
    </>
  ),
  chair: () => (
    <>
      {FLOOR}
      <path d="M70 30v110M130 96v44M70 96h60" {...LINE} strokeWidth={7} stroke={C.brown} />
      <rect x="64" y="88" width="72" height="12" rx="4" fill={C.wood} {...LINE} />
      <rect x="64" y="30" width="14" height="60" rx="4" fill={C.wood} {...LINE} />
    </>
  ),
  lamp: () => (
    <>
      {FLOOR}
      <path d="M100 66v66M80 140h40v-8H80z" fill={C.dark} {...LINE} />
      <path d="M72 66l12 -44h32l12 44z" fill={C.yellow} {...LINE} />
      <path d="M60 80l-12 8M140 80l12 8M100 76v10" stroke={C.yellow} strokeWidth={4} strokeLinecap="round" />
    </>
  ),
  /* toys */
  ball: () => (
    <>
      {FLOOR}
      <Ball />
    </>
  ),
  doll: () => (
    <>
      {FLOOR}
      <Person hair="pigtails" hairColour={C.yellow} top={C.purple} skirt size={0.72} />
    </>
  ),
  teddy: () => (
    <g>
      {FLOOR}
      <circle cx="78" cy="38" r="12" fill={C.brown} {...LINE} />
      <circle cx="122" cy="38" r="12" fill={C.brown} {...LINE} />
      <ellipse cx="100" cy="108" rx="34" ry="32" fill={C.brown} {...LINE} />
      <circle cx="100" cy="58" r="28" fill={C.brown} {...LINE} />
      <ellipse cx="100" cy="68" rx="12" ry="9" fill={C.wood} {...LINE} strokeWidth={2} />
      <circle cx="90" cy="52" r="3" fill={INK} />
      <circle cx="110" cy="52" r="3" fill={INK} />
      <circle cx="100" cy="64" r="3.5" fill={INK} />
      <ellipse cx="100" cy="112" rx="16" ry="14" fill={C.wood} />
    </g>
  ),
  car: () => (
    <>
      {FLOOR}
      <path d="M36 118v-22l20 -4l18 -24h48l20 24l22 6v20z" fill={C.red} {...LINE} />
      <path d="M80 74h18v20H64zM104 74h16l14 20h-30z" fill={C.water} {...LINE} strokeWidth={2} />
      <circle cx="66" cy="120" r="14" fill={C.dark} {...LINE} />
      <circle cx="136" cy="120" r="14" fill={C.dark} {...LINE} />
    </>
  ),
  train: () => (
    <>
      {FLOOR}
      <rect x="30" y="66" width="64" height="54" rx="4" fill={C.blue} {...LINE} />
      <rect x="40" y="76" width="22" height="18" fill={C.water} {...LINE} strokeWidth={2} />
      <rect x="94" y="86" width="72" height="34" rx="4" fill={C.green} {...LINE} />
      <path d="M140 86v-22h16v22" fill={C.dark} {...LINE} />
      <circle cx="50" cy="126" r="11" fill={C.dark} {...LINE} />
      <circle cx="80" cy="126" r="11" fill={C.dark} {...LINE} />
      <circle cx="116" cy="126" r="11" fill={C.dark} {...LINE} />
      <circle cx="148" cy="126" r="11" fill={C.dark} {...LINE} />
    </>
  ),
  kite: () => (
    <>
      <path d="M100 14l40 40l-40 50l-40 -50z" fill={C.yellow} {...LINE} />
      <path d="M100 14v90M60 54h80" {...LINE} strokeWidth={2} />
      <path d="M100 104q-16 12 0 22t0 22" fill="none" {...LINE} strokeWidth={2} />
      <path d="M92 118l-10 -4l4 10zM108 136l10 -4l-4 10z" fill={C.red} {...LINE} strokeWidth={2} />
    </>
  ),
  /* pets */
  dog: () => (
    <g>
      {FLOOR}
      <rect x="54" y="78" width="80" height="40" rx="18" fill={C.wood} {...LINE} />
      <path d="M64 114v26M84 114v26M108 114v26M126 114v26" {...LINE} strokeWidth={8} stroke={C.wood} />
      <path d="M134 86q18 -10 18 -26" fill="none" {...LINE} strokeWidth={6} stroke={C.wood} />
      <circle cx="54" cy="66" r="24" fill={C.wood} {...LINE} />
      <path d="M38 52q-14 4 -8 30q10 -4 12 -16z" fill={C.brown} {...LINE} />
      <circle cx="58" cy="62" r="3" fill={INK} />
      <ellipse cx="38" cy="72" rx="6" ry="5" fill={INK} />
    </g>
  ),
  cat: () => (
    <g>
      {FLOOR}
      <ellipse cx="100" cy="112" rx="34" ry="28" fill={C.grey} {...LINE} />
      <path d="M132 120q30 0 26 -36" fill="none" {...LINE} strokeWidth={7} stroke={C.grey} />
      <path d="M76 52l4 -24l14 16zM124 52l-4 -24l-14 16z" fill={C.grey} {...LINE} />
      <circle cx="100" cy="66" r="26" fill={C.grey} {...LINE} />
      <circle cx="90" cy="62" r="3.4" fill={INK} />
      <circle cx="110" cy="62" r="3.4" fill={INK} />
      <path d="M96 72h8l-4 5z" fill={C.pink} />
      <path d="M78 72h-14M78 78l-12 4M122 72h14M122 78l12 4" {...LINE} strokeWidth={2} />
    </g>
  ),
  fish: () => (
    <g>
      <rect x="30" y="34" width="140" height="104" rx="18" fill={C.water} {...LINE} />
      <path d="M66 86q30 -34 66 0q-36 34 -66 0z" fill="oklch(0.78 0.15 65)" {...LINE} />
      <path d="M132 86l20 -16v32z" fill="oklch(0.78 0.15 65)" {...LINE} />
      <circle cx="80" cy="82" r="3.5" fill={INK} />
      <circle cx="58" cy="60" r="4" fill="none" stroke={C.white} strokeWidth={2} />
      <circle cx="50" cy="48" r="3" fill="none" stroke={C.white} strokeWidth={2} />
    </g>
  ),
  bird: () => (
    <g>
      <path d="M50 120h110" {...LINE} stroke={C.brown} strokeWidth={6} />
      <ellipse cx="100" cy="90" rx="32" ry="26" fill={C.yellow} {...LINE} />
      <circle cx="122" cy="62" r="18" fill={C.yellow} {...LINE} />
      <path d="M138 60l16 4l-16 6z" fill="oklch(0.74 0.16 50)" {...LINE} strokeWidth={2} />
      <circle cx="126" cy="58" r="3" fill={INK} />
      <path d="M80 84q16 16 34 6" fill="none" {...LINE} />
      <path d="M70 96l-26 10l24 4" fill={C.yellow} {...LINE} />
      <path d="M96 116v6M110 116v6" {...LINE} />
    </g>
  ),
  rabbit: () => (
    <g>
      {FLOOR}
      <ellipse cx="88" cy="40" rx="9" ry="26" fill={C.white} {...LINE} />
      <ellipse cx="112" cy="40" rx="9" ry="26" fill={C.white} {...LINE} />
      <ellipse cx="100" cy="114" rx="34" ry="26" fill={C.white} {...LINE} />
      <circle cx="100" cy="76" r="24" fill={C.white} {...LINE} />
      <circle cx="91" cy="72" r="3" fill={INK} />
      <circle cx="109" cy="72" r="3" fill={INK} />
      <path d="M96 82h8l-4 4z" fill={C.pink} />
      <circle cx="134" cy="120" r="8" fill={C.white} {...LINE} />
    </g>
  ),
  /* actions */
  jump: () => <Stick pose="jump" />,
  swim: () => <Stick pose="swim" />,
  climb: () => <Stick pose="climb" />,
  dance: () => <Stick pose="dance" />,
  run: () => <Stick pose="run" />,
  fly: () => <Stick pose="fly" />,
  /* clothes */
  tshirt: () => <path d="M70 28l-40 22l14 26l16 -8v74h80v-74l16 8l14 -26l-40 -22q-30 16 -60 0z" fill={C.green} {...LINE} />,
  shoes: () => (
    <>
      {FLOOR}
      <path d="M26 132v-26q0 -10 10 -10h18q4 16 22 18l12 4q8 4 8 14z" fill={C.red} {...LINE} />
      <path d="M104 132v-26q0 -10 10 -10h18q4 16 22 18l12 4q8 4 8 14z" fill={C.red} {...LINE} />
      <path d="M26 126h70M104 126h70" stroke={C.white} strokeWidth={4} />
    </>
  ),
  hat: () => (
    <>
      <path d="M36 112q64 -20 128 0q-64 22 -128 0z" fill={C.blue} {...LINE} />
      <path d="M62 106v-40q38 -26 76 0v40" fill={C.blue} {...LINE} />
      <path d="M62 92q38 -12 76 0" fill="none" {...LINE} stroke={C.yellow} strokeWidth={8} />
    </>
  ),
  dress: () => <path d="M80 24h40l-4 30l38 84H46l38 -84z" fill={C.pink} {...LINE} />,
  jacket: () => (
    <>
      <path d="M70 26l-38 22l6 88h34V60M130 26l38 22l-6 88h-34V60" fill={C.purple} {...LINE} />
      <path d="M70 26q30 18 60 0l-2 110H72z" fill={C.purple} {...LINE} />
      <path d="M100 40v96" {...LINE} strokeWidth={2} />
      <circle cx="92" cy="64" r="3" fill={INK} />
      <circle cx="92" cy="88" r="3" fill={INK} />
    </>
  ),
  socks: () => (
    <>
      <path d="M50 24h30v74q0 8 8 12l14 6a12 12 0 0 1 -6 22H62q-12 0 -12 -12z" fill={C.yellow} {...LINE} />
      <path d="M116 24h30v74q0 8 8 12l14 6a12 12 0 0 1 -6 22h-34q-12 0 -12 -12z" fill={C.yellow} {...LINE} />
      <path d="M50 38h30M116 38h30" stroke={C.red} strokeWidth={6} />
    </>
  ),
  /* where is the ball? */
  "where-in": () => (
    <>
      {FLOOR}
      <Ball y={84} r={22} />
      <Box />
    </>
  ),
  "where-on": () => (
    <>
      {FLOOR}
      <Box open={false} />
      <Ball y={58} r={22} />
    </>
  ),
  "where-under": () => (
    <>
      {FLOOR}
      <rect x="40" y="62" width="120" height="12" rx="4" fill={C.wood} {...LINE} />
      <path d="M50 74v66M150 74v66" {...LINE} strokeWidth={7} stroke={C.brown} />
      <Ball y={118} r={20} />
    </>
  ),
  "where-next-to": () => (
    <>
      {FLOOR}
      <g transform="translate(-30 0)">
        <Box open={false} />
      </g>
      <Ball x={150} y={118} r={22} />
    </>
  ),
};

export function HomeDrawing({ thing }: { thing: HomeThing }) {
  return <>{DRAWINGS[thing]()}</>;
}
