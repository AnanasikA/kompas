/**
 * MAP ART for the child map: a treasure-map look.
 *
 * Every world is an island with an uneven coast (sand, a dark shore line and
 * shallow water around it). The missions lie on a winding trail, and small
 * props on the island tell what the world is about. Shapes are generated
 * from the world id, so an island always looks the same.
 */

export type Point = { x: number; y: number };

/* ---------- randomness that is the same on every visit ---------- */

function hash(text: string): number {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function seeded(seed: string) {
  let a = hash(seed);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- smooth lines ---------- */

/** A smooth curve through the points (Catmull-Rom as cubic Béziers). */
function smooth(points: Point[], closed: boolean): string {
  const n = points.length;
  const at = (i: number) => (closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return closed ? `${d} Z` : d;
}

export function polyline(points: Point[]): string {
  return points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

/* ---------- the island ---------- */

/**
 * Coast of an island filling a w×h box, `inset` pixels in from the edge:
 * a rounded rectangle whose edge is pushed in and out into bays and capes.
 */
export function coast(seed: string, w: number, h: number, inset: number): string {
  const rand = seeded(seed);
  const phase = [rand() * 6.28, rand() * 6.28, rand() * 6.28];
  const r = Math.min(56, w / 4, h / 4);
  const x0 = inset + 14;
  const y0 = inset + 14;
  const x1 = w - inset - 14;
  const y1 = h - inset - 14;
  const sw = x1 - x0 - 2 * r;
  const sh = y1 - y0 - 2 * r;
  const arc = (Math.PI / 2) * r;
  const total = 2 * sw + 2 * sh + 4 * arc;
  // Point and outward direction at distance d along the edge, clockwise from the top-left.
  const at = (d: number): [number, number, number, number] => {
    const parts: [number, (k: number) => [number, number, number, number]][] = [
      [sw, (k) => [x0 + r + k, y0, 0, -1]],
      [arc, (k) => corner(x1 - r, y0 + r, -Math.PI / 2 + k / r)],
      [sh, (k) => [x1, y0 + r + k, 1, 0]],
      [arc, (k) => corner(x1 - r, y1 - r, k / r)],
      [sw, (k) => [x1 - r - k, y1, 0, 1]],
      [arc, (k) => corner(x0 + r, y1 - r, Math.PI / 2 + k / r)],
      [sh, (k) => [x0, y1 - r - k, -1, 0]],
      [arc, (k) => corner(x0 + r, y0 + r, Math.PI + k / r)],
    ];
    for (const [length, point] of parts) {
      if (d <= length) return point(d);
      d -= length;
    }
    return [x0 + r, y0, 0, -1];
  };
  function corner(cx: number, cy: number, angle: number): [number, number, number, number] {
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle), Math.cos(angle), Math.sin(angle)];
  }
  const count = Math.max(24, Math.round(total / 46));
  const points = Array.from({ length: count }, (_, i) => {
    const d = (i / count) * total;
    const t = (d / total) * Math.PI * 2;
    const [x, y, nx, ny] = at(d);
    const bump = 6 * Math.sin(3 * t + phase[0]) + 5 * Math.sin(7 * t + phase[1]) + 3 * Math.sin(13 * t + phase[2]);
    return { x: x + nx * bump, y: y + ny * bump };
  });
  return smooth(points, true);
}

/* ---------- the trail ---------- */

/**
 * A winding trail and the missions on it. Like on a treasure map, the trail
 * goes round the island: it starts at the top left, runs clockwise along the
 * coast and curls inwards, wobbling as it goes. The stones lie on it at equal
 * walking distance; the middle of the loop is left free for the props.
 */
export function trail(seed: string, count: number, width: number) {
  const rand = seeded(`${seed}.trail`);
  const phase = [rand() * 6.28, rand() * 6.28, rand() * 6.28];
  const narrow = width < 480;
  const margin = narrow ? 40 : 70;
  const spacing = narrow ? 80 : 112;
  const top = 74; // room for the avatar pin above the first stone
  const rx = Math.max(60, width / 2 - margin);
  const need = Math.max(1, count - 1) * spacing;
  const start = -0.66 * Math.PI;
  const span = 1.72 * Math.PI;
  const steps = 480;

  for (let ry = 80; ; ry += 8) {
    const cy = top + ry * 1.1;
    const samples: Point[] = [];
    const walked: number[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = start + span * t;
      const curl = 1 - 0.3 * t;
      const wobble = 1 + (narrow ? 0.06 : 0.11) * Math.sin(3 * angle + phase[0]) + 0.05 * Math.sin(7 * angle + phase[1]) + 0.025 * Math.sin(17 * angle + phase[2]);
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      // |cos|^0.8 fills the corners a little, so the loop follows the coast.
      const p = { x: width / 2 + rx * curl * wobble * Math.sign(c) * Math.abs(c) ** 0.8, y: cy + ry * curl * wobble * Math.sign(s) * Math.abs(s) ** 0.8 };
      walked.push(i ? walked[i - 1] + Math.hypot(p.x - samples[i - 1].x, p.y - samples[i - 1].y) : 0);
      samples.push(p);
    }
    if (walked[steps] < need && ry < 2000) continue;
    // Next stone where it is a full step away from the last one in a straight line.
    const at = [0];
    for (let i = 1; i <= steps && at.length < count; i++) {
      const last = samples[at[at.length - 1]];
      if (Math.hypot(samples[i].x - last.x, samples[i].y - last.y) >= spacing) at.push(i);
    }
    const stones = at.map((i) => samples[i]);
    const close = at.length < count || stones.some((p, i) => stones.some((q, j) => j > i + 1 && Math.hypot(p.x - q.x, p.y - q.y) < spacing * 0.9));
    if (close && ry < 2000) continue;
    const end = Math.min(steps, (at[at.length - 1] ?? 0) + 6);
    const kept = samples.slice(0, end + 1);
    return { samples: kept, stones, at, height: Math.max(...kept.map((p) => p.y)) + 60 };
  }
}

/** Free spots for props: away from the trail, the stones and each other. */
export function propSpots(seed: string, wanted: number, width: number, height: number, samples: Point[], stones: Point[]): Point[] {
  const rand = seeded(`${seed}.props`);
  const spots: Point[] = [];
  for (let tries = 0; tries < 400 && spots.length < wanted; tries++) {
    const p = { x: 50 + rand() * (width - 100), y: 70 + rand() * (height - 110) };
    if (samples.some((s) => Math.hypot(s.x - p.x, s.y - p.y) < 44)) continue;
    if (stones.some((s) => Math.hypot(s.x - p.x, s.y - p.y) < 74 || Math.hypot(s.x - p.x, s.y - 50 - p.y) < 60)) continue;
    if (spots.some((s) => Math.hypot(s.x - p.x, s.y - p.y) < 90)) continue;
    spots.push(p);
  }
  return spots.sort((a, b) => a.y - b.y);
}

/* ---------- props ---------- */

const INK = "var(--color-ink)";
const LINE = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const C = {
  leaf: "oklch(0.62 0.13 145)",
  leafDark: "oklch(0.52 0.12 150)",
  trunk: "oklch(0.55 0.08 55)",
  wood: "oklch(0.72 0.09 65)",
  red: "oklch(0.70 0.15 30)",
  amber: "oklch(0.82 0.14 80)",
  sky: "oklch(0.76 0.10 230)",
  violet: "oklch(0.74 0.11 305)",
  stone: "oklch(0.80 0.02 80)",
  white: "oklch(0.98 0.01 85)",
  dark: "oklch(0.40 0.03 265)",
};

/** Every prop is drawn in a 64×64 box, standing on its bottom edge. */
const PROPS = {
  palm: (
    <>
      <path d="M33 60 C31 46 31 36 35 24" fill="none" {...LINE} stroke={C.trunk} strokeWidth={5} />
      <path d="M35 24 C26 16 14 18 8 26 C18 22 26 24 35 24 Z M35 24 C42 14 54 14 58 22 C50 20 42 22 35 24 Z M35 24 C30 12 34 6 40 4 C38 12 37 18 35 24 Z M35 24 C46 24 54 30 56 38 C48 32 42 28 35 24 Z" fill={C.leaf} {...LINE} />
    </>
  ),
  tree: (
    <>
      <rect x="29" y="40" width="7" height="20" rx="2" fill={C.trunk} {...LINE} />
      <circle cx="32" cy="28" r="17" fill={C.leaf} {...LINE} />
      <circle cx="25" cy="24" r="4" fill={C.leafDark} />
      <circle cx="38" cy="32" r="3" fill={C.leafDark} />
    </>
  ),
  bush: (
    <>
      <path d="M8 58 C6 46 16 40 22 44 C24 34 38 34 40 42 C48 38 58 46 56 58 Z" fill={C.leaf} {...LINE} />
      <circle cx="24" cy="50" r="2.5" fill={C.red} />
      <circle cx="42" cy="48" r="2.5" fill={C.red} />
    </>
  ),
  rocks: (
    <>
      <path d="M6 58 L12 44 L24 40 L32 50 L32 58 Z" fill={C.stone} {...LINE} />
      <path d="M28 58 L34 36 L48 32 L58 46 L58 58 Z" fill={C.stone} {...LINE} />
    </>
  ),
  treehouse: (
    <>
      <rect x="29" y="34" width="7" height="26" fill={C.trunk} {...LINE} />
      <circle cx="32" cy="18" r="15" fill={C.leaf} {...LINE} />
      <rect x="18" y="26" width="28" height="14" rx="2" fill={C.wood} {...LINE} />
      <path d="M15 27 L32 18 L49 27 Z" fill={C.red} {...LINE} />
      <rect x="28" y="30" width="7" height="10" fill={C.dark} />
      <path d="M44 40 L50 60 M50 44 L46 44 M51 50 L47 50 M53 56 L48 56" fill="none" {...LINE} stroke={C.trunk} />
    </>
  ),
  signpost: (
    <>
      <rect x="29" y="16" width="6" height="44" fill={C.trunk} {...LINE} />
      <path d="M12 16 H46 L52 22 L46 28 H12 Z" fill={C.wood} {...LINE} />
      <path d="M52 34 H20 L14 40 L20 46 H52 Z" fill={C.amber} {...LINE} />
      <path d="M18 22 H40 M24 40 H46" {...LINE} strokeWidth={1.6} />
    </>
  ),
  flag: (
    <>
      <path d="M18 60 V8" {...LINE} strokeWidth={3} />
      <path d="M18 10 C30 4 38 16 52 10 V30 C38 36 30 24 18 30 Z" fill={C.red} {...LINE} />
      <path d="M10 60 H28" {...LINE} strokeWidth={3} />
    </>
  ),
  house: (
    <>
      <rect x="14" y="30" width="36" height="28" fill={C.white} {...LINE} />
      <path d="M8 32 L32 12 L56 32 Z" fill={C.red} {...LINE} />
      <rect x="27" y="42" width="10" height="16" fill={C.wood} {...LINE} />
      <rect x="18" y="36" width="7" height="7" fill={C.sky} {...LINE} strokeWidth={1.6} />
      <rect x="40" y="36" width="7" height="7" fill={C.sky} {...LINE} strokeWidth={1.6} />
    </>
  ),
  school: (
    <>
      <rect x="8" y="30" width="48" height="28" fill={C.amber} {...LINE} />
      <path d="M4 32 L32 16 L60 32 Z" fill={C.red} {...LINE} />
      <rect x="26" y="8" width="12" height="10" fill={C.white} {...LINE} />
      <circle cx="32" cy="13" r="2" fill={INK} />
      <rect x="27" y="44" width="10" height="14" fill={C.wood} {...LINE} />
      <path d="M13 38 H21 M43 38 H51" {...LINE} stroke={C.sky} strokeWidth={5} />
    </>
  ),
  skyscraper: (
    <>
      <rect x="10" y="22" width="18" height="38" fill={C.sky} {...LINE} />
      <rect x="30" y="6" width="22" height="54" fill={C.violet} {...LINE} />
      <path d="M35 14 V54 M41 14 V54 M47 14 V54" {...LINE} strokeWidth={1.4} stroke={C.white} />
      <path d="M14 30 H24 M14 38 H24 M14 46 H24" {...LINE} strokeWidth={1.6} stroke={C.white} />
    </>
  ),
  cafe: (
    <>
      <rect x="12" y="30" width="40" height="28" fill={C.white} {...LINE} />
      <path d="M8 22 H56 V32 C52 36 48 36 44 32 C40 36 36 36 32 32 C28 36 24 36 20 32 C16 36 12 36 8 32 Z" fill={C.red} {...LINE} />
      <path d="M20 22 V32 M32 22 V32 M44 22 V32" {...LINE} strokeWidth={1.6} />
      <path d="M22 44 H34 V50 C34 54 22 54 22 50 Z M34 46 C38 46 38 50 34 50" fill={C.amber} {...LINE} strokeWidth={1.8} />
    </>
  ),
  cake: (
    <>
      <rect x="12" y="34" width="40" height="24" rx="3" fill={C.amber} {...LINE} />
      <path d="M12 40 C18 46 24 36 32 42 C40 48 46 36 52 40" fill="none" {...LINE} stroke={C.white} strokeWidth={4} />
      <rect x="29" y="20" width="6" height="14" fill={C.violet} {...LINE} strokeWidth={1.8} />
      <path d="M32 10 C36 14 35 18 32 19 C29 18 28 14 32 10 Z" fill={C.red} />
    </>
  ),
  clock: (
    <>
      <circle cx="32" cy="34" r="22" fill={C.white} {...LINE} />
      <path d="M32 34 V20 M32 34 L42 40" {...LINE} strokeWidth={3} />
      <path d="M14 14 L20 20 M50 14 L44 20 M24 56 L20 60 M40 56 L44 60" {...LINE} />
    </>
  ),
  ball: (
    <>
      <circle cx="32" cy="40" r="18" fill={C.white} {...LINE} />
      <path d="M32 31 L40 37 L37 46 H27 L24 37 Z" fill={INK} />
      <path d="M32 22 V31 M40 37 L49 34 M37 46 L42 55 M27 46 L22 55 M24 37 L15 34" {...LINE} strokeWidth={1.8} />
    </>
  ),
  kite: (
    <>
      <path d="M32 4 L50 22 L32 44 L14 22 Z" fill={C.violet} {...LINE} />
      <path d="M32 4 V44 M14 22 H50" {...LINE} strokeWidth={1.6} />
      <path d="M32 44 C26 50 38 54 30 60" fill="none" {...LINE} strokeWidth={1.8} />
      <path d="M28 50 L24 48 L26 53 Z M34 56 L38 54 L37 59 Z" fill={C.amber} />
    </>
  ),
  tent: (
    <>
      <path d="M6 58 L32 12 L58 58 Z" fill={C.amber} {...LINE} />
      <path d="M32 12 L24 58 H40 Z" fill={C.dark} {...LINE} />
      <path d="M32 12 L28 4 M32 12 L36 4" {...LINE} />
    </>
  ),
  mountain: (
    <>
      <path d="M2 58 L24 16 L36 36 L44 26 L62 58 Z" fill={C.stone} {...LINE} />
      <path d="M24 16 L17 30 L22 28 L26 32 L30 26 Z" fill={C.white} {...LINE} strokeWidth={1.6} />
    </>
  ),
  plane: (
    <>
      <path d="M6 34 C6 30 10 28 16 28 H50 C56 28 60 31 60 34 C60 37 56 40 50 40 H16 C10 40 6 38 6 34 Z" fill={C.white} {...LINE} />
      <path d="M28 28 L20 12 H28 L40 28 Z M28 40 L22 54 H30 L40 40 Z M10 30 L6 20 H12 L18 28" fill={C.sky} {...LINE} />
      <path d="M44 32 H52" {...LINE} stroke={C.sky} strokeWidth={4} />
    </>
  ),
  suitcase: (
    <>
      <rect x="10" y="22" width="44" height="34" rx="5" fill={C.red} {...LINE} />
      <path d="M24 22 V16 H40 V22" fill="none" {...LINE} />
      <path d="M22 22 V56 M42 22 V56" {...LINE} strokeWidth={1.8} />
      <circle cx="18" cy="58" r="2.5" fill={INK} />
      <circle cx="46" cy="58" r="2.5" fill={INK} />
    </>
  ),
  shop: (
    <>
      <path d="M14 22 H50 L54 58 H10 Z" fill={C.violet} {...LINE} />
      <path d="M24 30 V20 C24 10 40 10 40 20 V30" fill="none" {...LINE} strokeWidth={3} />
      <path d="M20 42 H44" {...LINE} stroke={C.white} strokeWidth={3} />
    </>
  ),
  balloon: (
    <>
      <path d="M32 6 C46 6 50 20 46 30 C42 40 36 44 32 44 C28 44 22 40 18 30 C14 20 18 6 32 6 Z" fill={C.red} {...LINE} />
      <path d="M30 44 H34 L33 48 H31 Z" fill={INK} />
      <path d="M32 48 C28 54 36 56 32 62" fill="none" {...LINE} strokeWidth={1.6} />
      <path d="M24 16 C24 12 28 10 30 10" fill="none" stroke={C.white} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  gift: (
    <>
      <rect x="12" y="28" width="40" height="30" fill={C.sky} {...LINE} />
      <rect x="8" y="20" width="48" height="10" fill={C.sky} {...LINE} />
      <path d="M32 20 V58" {...LINE} stroke={C.red} strokeWidth={5} />
      <path d="M32 20 C24 8 14 14 22 20 M32 20 C40 8 50 14 42 20" fill="none" {...LINE} />
    </>
  ),
  books: (
    <>
      <rect x="10" y="44" width="44" height="12" rx="2" fill={C.red} {...LINE} />
      <rect x="14" y="32" width="38" height="12" rx="2" fill={C.sky} {...LINE} />
      <rect x="8" y="20" width="40" height="12" rx="2" fill={C.amber} {...LINE} />
      <path d="M14 26 H40 M20 38 H46 M16 50 H48" {...LINE} strokeWidth={1.2} stroke={C.white} />
    </>
  ),
  bigben: (
    <>
      <rect x="22" y="22" width="20" height="38" fill={C.wood} {...LINE} />
      <path d="M20 22 L32 4 L44 22 Z" fill={C.dark} {...LINE} />
      <circle cx="32" cy="30" r="6" fill={C.white} {...LINE} strokeWidth={1.8} />
      <path d="M32 30 V27 M32 30 H35" {...LINE} strokeWidth={1.4} />
      <path d="M27 42 V54 M32 42 V54 M37 42 V54" {...LINE} strokeWidth={1.6} />
    </>
  ),
  flask: (
    <>
      <path d="M26 8 H38 M28 8 V26 L12 54 C10 58 12 60 16 60 H48 C52 60 54 58 52 54 L36 26 V8" fill={C.white} {...LINE} />
      <path d="M18 46 H46 L52 56 C52 58 50 60 48 60 H16 C14 60 12 58 13 56 Z" fill={C.leaf} opacity={0.7} />
      <circle cx="28" cy="40" r="2.5" fill={C.leaf} />
      <circle cx="36" cy="34" r="2" fill={C.leaf} />
    </>
  ),
  clapper: (
    <>
      <rect x="10" y="26" width="44" height="30" rx="2" fill={C.dark} {...LINE} />
      <path d="M8 16 L52 8 L54 18 L10 26 Z" fill={C.white} {...LINE} />
      <path d="M16 15 L20 24 M28 13 L32 22 M40 11 L44 20" {...LINE} strokeWidth={3} />
    </>
  ),
  rocket: (
    <>
      <path d="M32 4 C44 14 44 34 40 46 H24 C20 34 20 14 32 4 Z" fill={C.white} {...LINE} />
      <circle cx="32" cy="24" r="5" fill={C.sky} {...LINE} strokeWidth={1.8} />
      <path d="M24 36 L14 50 L24 46 Z M40 36 L50 50 L40 46 Z" fill={C.red} {...LINE} />
      <path d="M27 48 C28 56 32 60 32 60 C32 60 36 56 37 48 Z" fill={C.amber} />
    </>
  ),
  planet: (
    <>
      <circle cx="32" cy="32" r="16" fill={C.violet} {...LINE} />
      <ellipse cx="32" cy="34" rx="28" ry="8" fill="none" {...LINE} stroke={C.amber} strokeWidth={4} transform="rotate(-15 32 34)" />
      <circle cx="26" cy="26" r="3" fill={C.white} opacity={0.6} />
    </>
  ),
  magnifier: (
    <>
      <circle cx="26" cy="26" r="16" fill={C.white} {...LINE} strokeWidth={4} />
      <path d="M38 38 L56 56" {...LINE} stroke={C.trunk} strokeWidth={8} />
      <path d="M18 20 C20 16 24 14 28 14" fill="none" stroke={C.sky} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  palette: (
    <>
      <path d="M32 8 C50 8 60 20 58 32 C56 40 48 38 44 42 C40 46 46 54 38 58 C22 62 6 50 6 34 C6 18 18 8 32 8 Z" fill={C.wood} {...LINE} />
      <circle cx="20" cy="26" r="4" fill={C.red} />
      <circle cx="32" cy="18" r="4" fill={C.amber} />
      <circle cx="45" cy="22" r="4" fill={C.sky} />
      <circle cx="20" cy="42" r="4" fill={C.leaf} />
    </>
  ),
  chest: (
    <>
      <rect x="8" y="30" width="48" height="26" rx="3" fill={C.trunk} {...LINE} />
      <path d="M8 30 C8 16 56 16 56 30 Z" fill={C.wood} {...LINE} />
      <path d="M8 34 H56" {...LINE} stroke={C.amber} strokeWidth={4} />
      <rect x="28" y="30" width="8" height="10" rx="1" fill={C.amber} {...LINE} strokeWidth={1.8} />
      <path d="M14 22 L18 14 M48 22 L46 12" {...LINE} stroke={C.amber} />
    </>
  ),
  lighthouse: (
    <>
      <path d="M22 60 L26 18 H38 L42 60 Z" fill={C.white} {...LINE} />
      <path d="M24 36 H40 L41 46 H23 Z" fill={C.red} />
      <rect x="24" y="8" width="16" height="10" fill={C.amber} {...LINE} />
      <path d="M22 8 L32 2 L42 8 Z" fill={C.red} {...LINE} />
      <path d="M22 60 L26 18 H38 L42 60 Z" fill="none" {...LINE} />
    </>
  ),
} satisfies Record<string, React.ReactNode>;

export type PropId = keyof typeof PROPS;

/** What stands on each island: things that belong to the world's topic. */
const THEMES: Record<string, PropId[]> = {
  "hello-world": ["treehouse", "signpost", "palm", "flag"],
  home: ["house", "tree", "kite", "bush", "gift", "balloon"],
  school: ["school", "books", "tree"],
  city: ["skyscraper", "signpost", "house"],
  "food-town": ["cafe", "cake", "tree"],
  "my-day": ["clock", "house", "bush"],
  "sports-park": ["ball", "kite", "tree"],
  "adventure-park": ["tent", "mountain", "kite"],
  travel: ["plane", "suitcase", "palm"],
  "shopping-street": ["shop", "gift", "house"],
  "nature-camp": ["tent", "tree", "mountain"],
  "party-time": ["balloon", "gift", "cake"],
  "hobby-club": ["palette", "books", "kite"],
  london: ["bigben", "flag", "tree"],
  "new-york": ["skyscraper", "plane", "bush"],
  "science-lab": ["flask", "magnifier", "rocks"],
  "movie-studio": ["clapper", "skyscraper", "palm"],
  "dream-jobs": ["suitcase", "rocket", "books"],
  "green-planet": ["tree", "palm", "mountain"],
  "mystery-island": ["chest", "palm", "magnifier"],
  sydney: ["lighthouse", "palm", "rocks"],
  newsroom: ["books", "magnifier", "skyscraper"],
  "time-machine": ["clock", "chest", "rocks"],
  "space-station": ["rocket", "planet", "mountain"],
  "debate-club": ["flag", "books", "tree"],
  "what-if-lab": ["flask", "planet", "rocks"],
  "detective-agency": ["magnifier", "chest", "house"],
  "art-gallery": ["palette", "house", "tree"],
  "tech-hub": ["rocket", "flask", "skyscraper"],
  "wish-mountain": ["mountain", "balloon", "tree"],
  "world-explorer": ["plane", "lighthouse", "chest", "palm"],
};

/** Props for a world, by the last part of its id (child.hello-world → hello-world). */
export function themeOf(unitId: string): PropId[] {
  return THEMES[unitId.split(".").pop() ?? ""] ?? ["tree", "palm", "rocks"];
}

/** The world's own props first, then plants and rocks to fill the rest of the island. */
export function islandProps(unitId: string, wanted: number): PropId[] {
  const own = themeOf(unitId).slice(1);
  const fill = (["tree", "bush", "rocks", "palm"] as PropId[]).filter((f) => !own.includes(f));
  return Array.from({ length: wanted }, (_, i) => (i < own.length ? own[i] : fill[(i - own.length) % fill.length]));
}

export function Prop({ id, size = 58, className, style }: { id: PropId; size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" width={size} height={size} className={className} style={style}>
      <ellipse cx="32" cy="60" rx="24" ry="3.5" fill="oklch(0.23 0.025 265 / 0.12)" />
      {PROPS[id]}
    </svg>
  );
}

/** The same prop placed inside a larger SVG drawing, standing at (x, y). */
export function PropAt({ id, x, y, size }: { id: PropId; x: number; y: number; size: number }) {
  return (
    <svg x={x - size / 2} y={y - size} width={size} height={size} viewBox="0 0 64 64" overflow="visible">
      <ellipse cx="32" cy="60" rx="24" ry="3.5" fill="oklch(0.23 0.025 265 / 0.12)" />
      {PROPS[id]}
    </svg>
  );
}

/* ---------- the sea ---------- */

export function Waves({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 60 16" width={60} height={16} className={className} style={style}>
      <path d="M2 10 C8 2 14 2 20 10 C26 2 32 2 38 10 C44 2 50 2 58 10" fill="none" stroke="oklch(0.97 0.02 225 / 0.85)" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  );
}

export function Ship({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" width={56} height={56} className={className} style={style}>
      <path d="M8 40 H56 L48 54 H16 Z" fill={C.trunk} {...LINE} />
      <path d="M32 40 V8" {...LINE} strokeWidth={3} />
      <path d="M32 10 C44 14 46 28 34 36 Z" fill={C.white} {...LINE} />
      <path d="M30 14 C20 18 18 30 30 36 Z" fill={C.white} {...LINE} />
      <path d="M32 8 L42 4 L32 2 Z" fill={C.red} />
      <path d="M4 58 C10 54 16 54 22 58 C28 54 34 54 40 58 C46 54 52 54 60 58" fill="none" stroke="oklch(0.97 0.02 225 / 0.85)" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  );
}

export function Compass({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 80 80" width={72} height={72} className={className} style={style}>
      <circle cx="40" cy="42" r="28" fill="oklch(0.97 0.02 85 / 0.7)" stroke={INK} strokeWidth={2} />
      <circle cx="40" cy="42" r="22" fill="none" stroke={INK} strokeWidth={1} strokeDasharray="2 4" />
      <path d="M40 13 L46 40 L40 72 L34 40 Z" fill={INK} />
      <path d="M8 40 L40 34 L72 40 L40 46 Z" fill="oklch(0.55 0.03 265)" />
      <path d="M40 13 L46 40 L34 40 Z" fill={C.red} />
      <text x="40" y="9.5" textAnchor="middle" fontSize="9" fontWeight="800" fill={INK} fontFamily="var(--font-display)">
        N
      </text>
    </svg>
  );
}
