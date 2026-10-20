import { LineIcon, type LineIconName } from "@/components/ui/LineIcon";
import type { SceneSetting } from "@/types";

/**
 * Child-mode scene picture, in the same coloured line style as the rest of
 * the app: the place (park, classroom, home…) drawn with a few line icons,
 * and the character of the scene, big, in front of it.
 */

/** Who is who: the line drawing and colour of each scene character. */
const CHARACTERS: Record<string, readonly [LineIconName, string]> = {
  leo: ["brother", "oklch(0.62 0.14 150)"],
  mia: ["sister", "oklch(0.58 0.15 300)"],
  "ms bell": ["teacher", "oklch(0.60 0.14 250)"],
  grandma: ["grandma", "oklch(0.58 0.15 300)"],
  robo: ["robot", "oklch(0.55 0.02 265)"],
  ben: ["dad", "oklch(0.70 0.16 55)"],
  "coach tom": ["coach", "oklch(0.62 0.17 28)"],
  mum: ["mum", "oklch(0.66 0.14 350)"],
  "ms green": ["mum", "oklch(0.62 0.14 150)"],
};

export function characterLook(name: string): readonly [LineIconName, string] {
  return CHARACTERS[name.toLowerCase()] ?? ["dad", "oklch(0.60 0.14 250)"];
}

const SKY: Record<SceneSetting, { back: string; ground: string; line: string }> = {
  park: { back: "oklch(0.93 0.04 225)", ground: "oklch(0.88 0.08 145)", line: "oklch(0.62 0.14 150)" },
  classroom: { back: "oklch(0.95 0.035 90)", ground: "oklch(0.88 0.05 65)", line: "oklch(0.55 0.09 55)" },
  home: { back: "oklch(0.95 0.03 40)", ground: "oklch(0.88 0.05 60)", line: "oklch(0.55 0.09 55)" },
  party: { back: "oklch(0.95 0.035 320)", ground: "oklch(0.89 0.05 300)", line: "oklch(0.58 0.15 300)" },
  shop: { back: "oklch(0.95 0.035 165)", ground: "oklch(0.88 0.05 70)", line: "oklch(0.55 0.09 55)" },
  cafe: { back: "oklch(0.95 0.035 70)", ground: "oklch(0.86 0.06 60)", line: "oklch(0.55 0.09 55)" },
};

export function sceneBackground(setting: SceneSetting): string {
  return SKY[setting].back;
}

const INK = "oklch(0.30 0.02 265)";

/** Things standing in each place: [icon, x, y (bottom), size] on a 400×300 picture. Left half; the character stands on the right. */
const PROPS: Record<SceneSetting, readonly (readonly [LineIconName, number, number, number])[]> = {
  park: [
    ["tree", 46, 232, 96],
    ["tree", 150, 222, 64],
    ["bush", 110, 244, 46],
    ["flower", 200, 248, 36],
  ],
  classroom: [
    ["books", 54, 232, 54],
    ["clock", 200, 96, 46],
    ["school", 130, 248, 52],
  ],
  home: [
    ["lamp", 40, 232, 72],
    ["living-room", 130, 244, 96],
  ],
  party: [
    ["balloon", 40, 140, 58],
    ["balloon", 84, 120, 46],
    ["cake", 70, 244, 70],
    ["present", 150, 248, 50],
  ],
  shop: [
    ["shop", 44, 120, 44],
    ["ball", 94, 120, 40],
    ["teddy", 144, 120, 44],
    ["car", 46, 200, 44],
    ["kite", 100, 200, 44],
    ["gift", 150, 200, 40],
  ],
  cafe: [
    ["coffee", 52, 238, 56],
    ["cake", 120, 238, 56],
    ["cafe", 190, 110, 52],
  ],
};

export function SceneBackdrop({ setting, flip }: { setting: SceneSetting; flip?: boolean }) {
  const { back, ground, line } = SKY[setting];
  const outdoors = setting === "park";
  return (
    // The whole scene fits (meet), anchored to the bottom; sky and ground run on past the edges.
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet" overflow="visible" className="absolute inset-0 h-full w-full" aria-hidden>
      <rect x="-2000" y="-2000" width="4400" height="2300" fill={back} />
      {outdoors ? (
        <>
          <circle cx="330" cy="54" r="22" fill="oklch(0.86 0.13 90)" fillOpacity={0.45} stroke="oklch(0.74 0.15 80)" strokeWidth={3} />
          <path d="M60 60c6-12 22-14 30-4c10-4 20 2 18 12H56c-4-4-2-8 4-8z" fill="white" stroke="oklch(0.68 0.11 230)" strokeWidth={3} strokeLinejoin="round" />
          <path d="M210 40c6-10 18-12 26-4c8-4 18 2 16 10h-46c-4-4 0-6 4-6z" fill="white" stroke="oklch(0.68 0.11 230)" strokeWidth={3} strokeLinejoin="round" />
          <path d="M-2000 236 H0 Q100 214 200 226 T400 220 H2400 V2300 H-2000 Z" fill={ground} stroke={line} strokeWidth={3} />
        </>
      ) : (
        <>
          {setting === "home" && (
            <g stroke={line} strokeWidth={3} fill="oklch(0.92 0.05 225)">
              <rect x="190" y="40" width="80" height="90" rx="4" />
              <path d="M230 40v90M190 85h80" fill="none" />
            </g>
          )}
          {setting === "classroom" && <path d="M20 150h170" stroke={line} strokeWidth={3} strokeLinecap="round" />}
          {setting === "shop" && (
            <g stroke={line} strokeWidth={4} strokeLinecap="round">
              <path d="M16 124h168M16 204h168" />
            </g>
          )}
          {setting === "party" && (
            <path d="M-20 30 Q200 70 420 30" fill="none" stroke={INK} strokeWidth={2} />
          )}
          {setting === "party" &&
            [40, 90, 140, 190, 240, 290, 340].map((x, i) => (
              <path key={x} d={`M${x - 14} ${38 + Math.sin(x / 63) * 8} l14 22 l14 -22z`} fill={["oklch(0.62 0.17 28)", "oklch(0.74 0.15 80)", "oklch(0.60 0.14 250)", "oklch(0.62 0.14 150)"][i % 4]} fillOpacity={0.6} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
            ))}
          <rect x="-2000" y="236" width="4400" height="2000" fill={ground} />
          <path d="M-2000 236h4400" stroke={line} strokeWidth={3} />
        </>
      )}
      {PROPS[setting].map(([name, x, y, size], i) => (
        <LineIcon key={i} name={name} size={size} x={(flip ? 400 - x : x) - size / 2} y={y - size} />
      ))}
    </svg>
  );
}

/**
 * The scene picture. `children` are overlays (the mission number, a board,
 * the first line) placed by the caller.
 */
export function SceneIllustration({
  setting,
  character,
  className,
  figureClassName = "right-[4%] h-[62%]",
  flip,
  children,
}: {
  setting: SceneSetting;
  character?: string;
  className?: string;
  /** Where the character stands (position and height classes). */
  figureClassName?: string;
  /** Things of the place on the right instead of the left (when the character stands on the left). */
  flip?: boolean;
  children?: React.ReactNode;
}) {
  const look = character ? characterLook(character) : undefined;
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", background: SKY[setting].back }}>
      <SceneBackdrop setting={setting} flip={flip} />
      {look && (
        // Big portrait of the character, standing at the bottom edge on the right.
        <div aria-hidden className={`absolute bottom-0 flex max-h-[300px] items-end ${figureClassName}`}>
          <LineIcon name={look[0]} color={look[1]} size={300} style={{ height: "100%", width: "auto", transform: "translateY(8%)" }} />
        </div>
      )}
      {children}
    </div>
  );
}
