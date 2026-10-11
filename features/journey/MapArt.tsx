import { LineIcon, type LineIconName } from "@/components/ui/LineIcon";

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

/** Props are line icons (components/ui/LineIcon), standing on the island. */
export type PropId = LineIconName;

/** What stands on each island: things that belong to the world's topic. */
const THEMES: Record<string, PropId[]> = {
  "hello-world": ["wave", "signpost", "palm", "flag"],
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

/** Island colours of the prototype map, reused in order across a level. */
const TINTS = ["oklch(0.90 0.08 145)", "oklch(0.92 0.08 85)", "oklch(0.90 0.05 305)", "oklch(0.91 0.05 35)", "oklch(0.94 0.06 95)"];
export function islandTint(levelIndex: number, indexInLevel: number): string {
  return TINTS[(levelIndex + indexInLevel) % TINTS.length];
}

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
  return <LineIcon name={id} size={size} className={className} style={style} />;
}

/** The same prop placed inside a larger SVG drawing, standing at (x, y). */
export function PropAt({ id, x, y, size }: { id: PropId; x: number; y: number; size: number }) {
  return <LineIcon name={id} size={size} x={x - size / 2} y={y - size} />;
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
  return <LineIcon name="ship" size={52} className={className} style={style} />;
}

export function Compass({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <LineIcon name="compass" size={64} className={className} style={{ background: "oklch(0.97 0.02 85 / 0.8)", borderRadius: "50%", ...style }} />;
}
