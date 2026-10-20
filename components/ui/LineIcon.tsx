import type { SVGProps } from "react";
import {
  Airplane,
  Backpack,
  Balloon,
  Bathtub,
  Bed,
  Bicycle,
  Boat,
  Books,
  Bread,
  Buildings,
  Cake,
  CastleTurret,
  Cat,
  Chair,
  Coffee,
  Compass,
  CookingPot,
  Couch,
  Desk,
  Dog,
  Door,
  Dress,
  Drop,
  FilmSlate,
  Fish,
  Flag,
  Flask,
  Flower,
  GameController,
  Gift,
  HandWaving,
  Hoodie,
  House,
  Lamp,
  Lighthouse,
  MagnifyingGlass,
  Mountains,
  Package,
  Palette,
  Pants,
  PersonSimpleRun,
  PersonSimpleSwim,
  PintGlass,
  Planet,
  Plant,
  PuzzlePiece,
  Rabbit,
  Robot,
  Rocket,
  Rug,
  Sailboat,
  BaseballCap,
  Signpost,
  Sneaker,
  SoccerBall,
  Sock,
  Stairs,
  Storefront,
  Suitcase,
  Sun,
  TShirt,
  Table,
  Tent,
  Train,
  TreasureChest,
  Tree,
  TreePalm,
  Watch,
  Ladder,
  Bird,
  Car,
  Baby,
  ShoppingBag,
  Horse,
  Alarm,
  Image as ImageIcon,
  Headphones,
  Question,
  PencilSimpleLine,
  Cards,
  Microphone,
  ChatsCircle,
  BookOpenText,
  Footprints,
  Stamp,
  IdentificationCard,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

/**
 * LINE ICONS: one coloured line style for every picture in the app
 * (exercise pictures, map props, postcards).
 *
 * Most come from Phosphor Icons, duotone weight (MIT licence, free for
 * commercial use, https://phosphoricons.com). Pictures Phosphor does not have
 * (family members, faces, times of day, a teddy bear…) are drawn below in the
 * same grid and stroke, so the two sets cannot be told apart.
 */

const COLOR = {
  red: "oklch(0.62 0.17 28)",
  orange: "oklch(0.70 0.16 55)",
  amber: "oklch(0.74 0.15 80)",
  green: "oklch(0.62 0.14 150)",
  blue: "oklch(0.60 0.14 250)",
  sky: "oklch(0.68 0.11 230)",
  violet: "oklch(0.58 0.15 300)",
  pink: "oklch(0.66 0.14 350)",
  brown: "oklch(0.55 0.09 55)",
  grey: "oklch(0.55 0.02 265)",
  ink: "oklch(0.30 0.02 265)",
};

/* ---------- drawn in the Phosphor style: 256 grid, 16px round strokes, 20% fill ---------- */

type Custom = (props: SVGProps<SVGSVGElement>) => React.ReactElement;

function draw(body: React.ReactNode): Custom {
  return function Drawn(props) {
    return (
      <svg viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" {...props}>
        {body}
      </svg>
    );
  };
}

const SOFT = { fill: "currentColor", fillOpacity: 0.2, stroke: "none" } as const;
const DOT = { fill: "currentColor", stroke: "none" } as const;

/** A person: head and shoulders, smaller for children. Hair and extras on top. */
function person(child: boolean, extra: React.ReactNode, under?: React.ReactNode) {
  const s = child ? 0.84 : 1;
  return draw(
    <g transform={`translate(${128 - 128 * s} ${256 - 248 * s}) scale(${s})`}>
      {under}
      <circle cx="128" cy="100" r="56" {...SOFT} />
      <circle cx="128" cy="100" r="56" />
      <circle cx="108" cy="104" r="9" {...DOT} />
      <circle cx="148" cy="104" r="9" {...DOT} />
      <path d="M112 128c10 8 22 8 32 0" />
      <path d="M40 232c18-38 50-60 88-60s70 22 88 60" />
      {extra}
    </g>,
  );
}

const glasses = <path d="M88 104a14 14 0 1 0 28 0a14 14 0 1 0-28 0M140 104a14 14 0 1 0 28 0a14 14 0 1 0-28 0M116 104h24" strokeWidth={8} />;

const Mum = person(false, <path d="M72 96c0-34 24-52 56-52s56 18 56 52c-18-2-40-14-48-30c-10 18-40 30-64 30z" {...SOFT} />, <path d="M74 104c-6 40-4 70-14 92M182 104c6 40 4 70 14 92" />);
const Dad = person(false, <path d="M74 84c6-26 28-40 54-40s48 14 54 40c-34-10-74-10-108 0z" fill="currentColor" stroke="none" />);
const Sister = person(true, <><circle cx="60" cy="86" r="18" /><circle cx="196" cy="86" r="18" /><path d="M74 84c6-26 28-40 54-40s48 14 54 40c-34-10-74-10-108 0z" {...SOFT} /></>);
const Brother = person(true, <path d="M74 80c6-24 28-36 54-36s48 12 54 36zM182 80h34" />);
const Teacher = person(false, <><path d="M72 96c0-34 24-52 56-52s56 18 56 52c-18-2-40-14-48-30c-10 18-40 30-64 30z" {...SOFT} /><circle cx="128" cy="36" r="16" />{glasses}</>);
const Coach = person(false, <><path d="M74 80c6-24 28-36 54-36s48 12 54 36zM182 80h34" /><path d="M128 172v24" /><circle cx="128" cy="204" r="10" /></>);
const Grandma = person(false, <><circle cx="128" cy="36" r="18" />{glasses}</>);
const Grandpa = person(false, <>{glasses}<path d="M76 72c-4 10-4 20 0 28M180 72c4 10 4 20 0 28" /></>);

function face(eyes: React.ReactNode, mouth: React.ReactNode, extra?: React.ReactNode) {
  return draw(
    <>
      <circle cx="128" cy="136" r="96" {...SOFT} />
      <circle cx="128" cy="136" r="96" />
      {eyes}
      {mouth}
      {extra}
    </>,
  );
}
const dotEyes = (
  <>
    <circle cx="92" cy="116" r="12" {...DOT} />
    <circle cx="164" cy="116" r="12" {...DOT} />
  </>
);
const Happy = face(dotEyes, <path d="M80 160c12 26 30 36 48 36s36-10 48-36" />);
const Sad = face(dotEyes, <path d="M84 188c12-20 28-28 44-28s32 8 44 28" />, <path d="M172 140c-6 10-6 18 0 22" strokeWidth={10} />);
const Tired = face(<path d="M76 120c10 8 22 8 32 0M148 120c10 8 22 8 32 0" />, <path d="M108 180h40" />, <path d="M186 24h32l-32 32h32" strokeWidth={12} />);
const Hungry = face(dotEyes, <ellipse cx="128" cy="178" rx="26" ry="20" />, <path d="M196 196v-56M212 140v20a16 16 0 0 1-32 0v-20" strokeWidth={10} />);

const horizon = <path d="M24 192h208" />;
const Morning = draw(
  <>
    <path d="M64 192a64 64 0 0 1 128 0z" {...SOFT} />
    <path d="M64 192a64 64 0 0 1 128 0" />
    {horizon}
    <path d="M128 56V24M104 40l24-24l24 24M48 136l-16-10M208 136l16-10" />
  </>,
);
const Evening = draw(
  <>
    <path d="M80 192a48 48 0 0 1 96 0z" {...SOFT} />
    <path d="M80 192a48 48 0 0 1 96 0" />
    {horizon}
    <path d="M128 64v40M104 88l24 24l24-24" />
    <path d="M200 48l6 14l14 6l-14 6l-6 14l-6-14l-14-6l14-6z" strokeWidth={8} />
  </>,
);
const Night = draw(
  <>
    <path d="M168 168A80 80 0 0 1 104 40a88 88 0 1 0 104 104a80 80 0 0 1-40 24z" {...SOFT} />
    <path d="M168 168A80 80 0 0 1 104 40a88 88 0 1 0 104 104a80 80 0 0 1-40 24z" />
    <path d="M168 32h40l-40 40h40" strokeWidth={12} />
  </>,
);

const Teddy = draw(
  <>
    <circle cx="80" cy="56" r="22" />
    <circle cx="176" cy="56" r="22" />
    <ellipse cx="128" cy="184" rx="68" ry="56" {...SOFT} />
    <ellipse cx="128" cy="184" rx="68" ry="56" />
    <circle cx="128" cy="96" r="52" {...SOFT} />
    <circle cx="128" cy="96" r="52" />
    <circle cx="108" cy="88" r="8" {...DOT} />
    <circle cx="148" cy="88" r="8" {...DOT} />
    <ellipse cx="128" cy="116" rx="18" ry="12" />
  </>,
);
const Kite = draw(
  <>
    <path d="M128 16l72 72l-72 96l-72-96z" {...SOFT} />
    <path d="M128 16l72 72l-72 96l-72-96zM128 16v168M56 88h144" />
    <path d="M128 184c-20 16 20 24 0 40s20 20 8 24" />
  </>,
);
const Candle = draw(
  <>
    <rect x="96" y="104" width="64" height="128" rx="8" {...SOFT} />
    <rect x="96" y="104" width="64" height="128" rx="8" />
    <path d="M128 104V84M128 24c22 22 22 40 0 52c-22-12-22-30 0-52z" />
  </>,
);
const Jump = draw(
  <>
    <circle cx="128" cy="44" r="24" {...SOFT} />
    <circle cx="128" cy="44" r="24" />
    <path d="M128 72v76M128 96L84 60M128 96l44-36M128 148l-36 28l12 24M128 148l36 28l-12 24" />
    <path d="M72 240h24M116 240h24M160 240h24" />
  </>,
);
const Dance = draw(
  <>
    <circle cx="108" cy="52" r="24" {...SOFT} />
    <circle cx="108" cy="52" r="24" />
    <path d="M112 80l-8 80M110 104L68 72M110 104l44 12M104 160l-36 72M104 160l44 36l-4 36" />
    <path d="M188 104V40l36-8v56M188 104a14 14 0 1 1-14-14a14 14 0 0 1 14 14zM224 88a14 14 0 1 1-14-14a14 14 0 0 1 14 14" strokeWidth={10} />
  </>,
);

/** Where is the ball? A box (solid, so the ball can hide in it) and a ball. */
const BALL = "oklch(0.62 0.17 28)";
function ball(cx: number, cy: number) {
  return (
    <g stroke={BALL}>
      <circle cx={cx} cy={cy} r="30" fill="white" />
      <circle cx={cx} cy={cy} r="30" fill={BALL} fillOpacity={0.2} stroke="none" />
      <path d={`M${cx - 30} ${cy}h60M${cx} ${cy - 30}c-14 20-14 40 0 60`} strokeWidth={10} />
    </g>
  );
}
const box = (x: number) => (
  <>
    <rect x={x} y="128" width="112" height="96" rx="6" fill="white" />
    <rect x={x} y="128" width="112" height="96" rx="6" fill="currentColor" fillOpacity={0.2} stroke="none" />
    <rect x={x} y="128" width="112" height="96" rx="6" />
    <path d={`M${x} 160h112`} strokeWidth={10} />
  </>
);
const ground = <path d="M24 232h208" />;
const WhereIn = draw(<>{ball(128, 120)}{box(72)}<path d="M72 128l-24-28M184 128l24-28" />{ground}</>);
const WhereOn = draw(<>{box(72)}{ball(128, 96)}{ground}</>);
const WhereUnder = draw(<><path d="M48 112h160M64 112v120M192 112v120" />{ball(128, 200)}{ground}</>);
const WhereNextTo = draw(<>{box(32)}{ball(196, 200)}{ground}</>);

/* ---------- the catalogue ---------- */

type Entry = readonly [Icon | Custom, string];

const ICONS = {
  // people
  mum: [Mum, COLOR.pink],
  teacher: [Teacher, COLOR.blue],
  coach: [Coach, COLOR.red],
  dad: [Dad, COLOR.blue],
  sister: [Sister, COLOR.violet],
  brother: [Brother, COLOR.green],
  baby: [Baby, COLOR.orange],
  grandma: [Grandma, COLOR.violet],
  grandpa: [Grandpa, COLOR.brown],
  // faces
  happy: [Happy, COLOR.amber],
  sad: [Sad, COLOR.blue],
  tired: [Tired, COLOR.violet],
  hungry: [Hungry, COLOR.orange],
  // times of day
  morning: [Morning, COLOR.amber],
  afternoon: [Sun, COLOR.amber],
  evening: [Evening, COLOR.orange],
  night: [Night, COLOR.blue],
  // food and party
  coffee: [Coffee, COLOR.brown],
  juice: [PintGlass, COLOR.orange],
  sandwich: [Bread, COLOR.amber],
  water: [Drop, COLOR.sky],
  cake: [Cake, COLOR.pink],
  present: [Gift, COLOR.violet],
  balloon: [Balloon, COLOR.red],
  candle: [Candle, COLOR.sky],
  // house
  house: [House, COLOR.red],
  kitchen: [CookingPot, COLOR.red],
  bathroom: [Bathtub, COLOR.sky],
  bedroom: [Bed, COLOR.violet],
  "living-room": [Couch, COLOR.green],
  bed: [Bed, COLOR.blue],
  table: [Table, COLOR.brown],
  chair: [Chair, COLOR.brown],
  lamp: [Lamp, COLOR.amber],
  desk: [Desk, COLOR.brown],
  rug: [Rug, COLOR.pink],
  door: [Door, COLOR.brown],
  stairs: [Stairs, COLOR.grey],
  books: [Books, COLOR.green],
  // toys
  ball: [SoccerBall, COLOR.ink],
  doll: [Sister, COLOR.pink],
  teddy: [Teddy, COLOR.brown],
  car: [Car, COLOR.red],
  train: [Train, COLOR.blue],
  kite: [Kite, COLOR.amber],
  robot: [Robot, COLOR.grey],
  puzzle: [PuzzlePiece, COLOR.green],
  game: [GameController, COLOR.violet],
  bike: [Bicycle, COLOR.red],
  watch: [Watch, COLOR.blue],
  // animals
  dog: [Dog, COLOR.brown],
  cat: [Cat, COLOR.grey],
  fish: [Fish, COLOR.orange],
  bird: [Bird, COLOR.amber],
  rabbit: [Rabbit, COLOR.pink],
  horse: [Horse, COLOR.brown],
  // actions
  jump: [Jump, COLOR.violet],
  swim: [PersonSimpleSwim, COLOR.sky],
  climb: [Ladder, COLOR.brown],
  dance: [Dance, COLOR.pink],
  run: [PersonSimpleRun, COLOR.violet],
  fly: [Bird, COLOR.sky],
  // clothes
  tshirt: [TShirt, COLOR.green],
  shoes: [Sneaker, COLOR.red],
  hat: [BaseballCap, COLOR.blue],
  dress: [Dress, COLOR.pink],
  jacket: [Hoodie, COLOR.violet],
  socks: [Sock, COLOR.amber],
  trousers: [Pants, COLOR.brown],
  // where
  "where-in": [WhereIn, COLOR.brown],
  "where-on": [WhereOn, COLOR.brown],
  "where-under": [WhereUnder, COLOR.brown],
  "where-next-to": [WhereNextTo, COLOR.brown],
  // map props
  palm: [TreePalm, COLOR.green],
  tree: [Tree, COLOR.green],
  bush: [Plant, COLOR.green],
  flower: [Flower, COLOR.pink],
  rocks: [Mountains, COLOR.grey],
  wave: [HandWaving, COLOR.amber],
  signpost: [Signpost, COLOR.brown],
  flag: [Flag, COLOR.red],
  school: [Backpack, COLOR.red],
  skyscraper: [Buildings, COLOR.violet],
  cafe: [Storefront, COLOR.red],
  clock: [Alarm, COLOR.blue],
  tent: [Tent, COLOR.amber],
  mountain: [Mountains, COLOR.grey],
  plane: [Airplane, COLOR.sky],
  suitcase: [Suitcase, COLOR.red],
  shop: [ShoppingBag, COLOR.violet],
  gift: [Gift, COLOR.sky],
  bigben: [CastleTurret, COLOR.brown],
  flask: [Flask, COLOR.green],
  clapper: [FilmSlate, COLOR.ink],
  rocket: [Rocket, COLOR.red],
  planet: [Planet, COLOR.violet],
  magnifier: [MagnifyingGlass, COLOR.brown],
  palette: [Palette, COLOR.amber],
  chest: [TreasureChest, COLOR.brown],
  lighthouse: [Lighthouse, COLOR.red],
  box: [Package, COLOR.brown],
  // kinds of exercises
  "task-matching": [PuzzlePiece, COLOR.green],
  "task-pictures": [ImageIcon, COLOR.green],
  "task-listening": [Headphones, COLOR.sky],
  "task-quiz": [Question, COLOR.amber],
  "task-gap": [PencilSimpleLine, COLOR.amber],
  "task-sentence": [Cards, COLOR.violet],
  "task-speaking": [Microphone, COLOR.red],
  "task-scene": [ChatsCircle, COLOR.orange],
  "task-story": [BookOpenText, COLOR.sky],
  "task-real": [Footprints, COLOR.green],
  stamp: [Stamp, COLOR.red],
  passport: [IdentificationCard, COLOR.blue],
  // sea
  ship: [Sailboat, COLOR.brown],
  boat: [Boat, COLOR.brown],
  compass: [Compass, COLOR.ink],
} satisfies Record<string, Entry>;

export type LineIconName = keyof typeof ICONS;

export function isLineIcon(name: string): name is LineIconName {
  return name in ICONS;
}

/** A line icon in its own colour (or `color`), `size` pixels square. Extra SVG props (x, y…) pass through. */
export function LineIcon({ name, size = 64, color, ...rest }: { name: LineIconName; size?: number; color?: string } & Omit<SVGProps<SVGSVGElement>, "color">) {
  const [Drawing, own] = ICONS[name] as Entry;
  const tint = color ?? own;
  const props = { width: size, height: size, "aria-hidden": true, ...rest, style: { color: tint, ...rest.style } } as Record<string, unknown>;
  // Phosphor icons (forwardRef objects) take the colour and weight as props; the drawn ones are functions, already duotone.
  if (typeof Drawing === "object") {
    const Phosphor = Drawing as Icon;
    return <Phosphor {...props} color={tint} weight="duotone" />;
  }
  const Drawn = Drawing as Custom;
  return <Drawn {...props} />;
}
