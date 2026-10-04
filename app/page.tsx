import Link from "next/link";
import { ArrowRight, BedDouble, Briefcase, Check, Coffee, Map as MapIcon, Mic, Plane, Play, Target } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { LevelPath } from "@/components/landing/LevelPath";
import { Logo } from "@/components/ui/Logo";
import { CEFR_PROGRAM } from "@/data/cefr/program";
import { CEFR_LEVELS } from "@/types";

const SITUATIONS = [
  { icon: Coffee, place: "W kawiarni", line: "I’d like a hot chocolate, please.", pl: "Poproszę gorącą czekoladę." },
  { icon: Plane, place: "Na lotnisku", line: "Excuse me, which gate is it now?", pl: "Przepraszam, która to teraz bramka?" },
  { icon: BedDouble, place: "W hotelu", line: "I’d like to check in.", pl: "Poproszę o zameldowanie." },
];

const SKILLS = ["Słuchanie", "Słownictwo", "Budowanie zdań", "Mówienie", "Dialog"];

const STEPS = [
  { n: "01", title: "Poznajesz", text: "Nowe słowa i zwroty pojawiają się w konkretnej sytuacji." },
  { n: "02", title: "Ćwiczysz", text: "Słuchasz, układasz zdania i odpowiadasz." },
  { n: "03", title: "Mówisz", text: "Używasz poznanego języka w dialogu." },
  { n: "04", title: "Wracasz do błędów", text: "Kompas zapamiętuje trudniejsze elementy i dodaje je do kolejnych powtórek." },
];

/** Each age mode keeps its colour only as a small mark next to the age. */
const MODES = [
  { id: "dla-dzieci", icon: MapIcon, age: "8–12 lat", title: "Dla dzieci", mark: "rounded-full bg-amber", text: "Mapa światów, krótkie misje i nauka przez odkrywanie." },
  { id: "dla-nastolatkow", icon: Target, age: "13–17 lat", title: "Dla nastolatków", mark: "rotate-45 bg-night shadow-[0_0_0_2px_var(--color-lime)]", text: "Wyzwania, cele i angielski w sytuacjach bliskich codziennemu życiu." },
  { id: "dla-doroslych", icon: Briefcase, age: "18+", title: "Dla dorosłych", mark: "rounded-[2px] border-[1.5px] border-azure", text: "Praktyczna nauka do rozmów, podróży i pracy." },
];

const PARENT_STATS = [
  ["42 min", "nauki"],
  ["4 dni", "aktywne"],
  ["31", "nowych słów"],
];

/** Bar heights of the little sound wave in the lesson preview. */
const WAVE = [8, 14, 20, 12, 22, 16, 9, 18, 24, 14, 10, 19, 13, 7, 15, 11, 6];

const GUTTER = "px-[clamp(20px,4vw,56px)]";
const SECTION = `${GUTTER} py-[clamp(48px,6vw,88px)]`;
const H2 = "m-0 text-balance font-display text-[clamp(28px,3.5vw,44px)] font-extrabold leading-[1.02] tracking-[-0.03em]";
const LEAD = "m-0 max-w-[60ch] text-pretty text-[clamp(16px,1.4vw,18px)] leading-[1.55] text-body";

const Arrow = ({ size = "1em" }: { size?: string | number }) => <ArrowRight aria-hidden size={size} strokeWidth={2.4} className="ml-1.5 inline-block align-[-0.14em]" />;

/** A piece of the app, framed like a small browser window. */
function AppWindow({ address, label, className = "", children }: { address: string; label: string; className?: string; children: React.ReactNode }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`overflow-hidden rounded-[16px] bg-card shadow-[0_24px_60px_oklch(0.23_0.025_265/0.14),0_0_0_1px_oklch(0.23_0.025_265/0.1)] ${className}`}
    >
      <div aria-hidden className="flex items-center gap-2.5 bg-sand px-3 py-2">
        <span className="flex shrink-0 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-full bg-line-strong" />
          ))}
        </span>
        <span className="min-w-0 flex-1 truncate rounded-full bg-card px-2.5 py-[3px] font-mono text-[10px] text-muted">{address}</span>
      </div>
      <div aria-hidden className="flex flex-col gap-3.5 p-[18px]">
        {children}
      </div>
    </div>
  );
}

const WindowHead = ({ left, right }: { left: string; right: string }) => (
  <div className="flex items-center justify-between gap-3 font-mono text-[11px] tracking-[0.08em] text-muted">
    <span>{left}</span>
    <span className="rounded-full px-2.5 py-1 text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)]">{right}</span>
  </div>
);

/** One line of the barista, with the "listen" control the lesson shows. */
function BaristaLine({ children, audio = false }: { children: React.ReactNode; audio?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sand font-display text-sm font-bold">S</span>
      <div className="flex flex-col gap-2 rounded-[4px_16px_16px_16px] bg-sand px-3.5 py-3">
        {audio && (
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-on-ink">
              <Play size={12} strokeWidth={0} fill="currentColor" className="translate-x-px" />
            </span>
            <span className="flex h-6 items-center gap-[3px]">
              {WAVE.map((height, i) => (
                <span key={i} style={{ height }} className={`w-[3px] rounded-full ${i < 6 ? "bg-ink" : "bg-line-strong"}`} />
              ))}
            </span>
            <span className="font-mono text-[11px] text-muted">0:02</span>
          </div>
        )}
        <span className="text-[16px] font-semibold leading-snug">{children}</span>
      </div>
    </div>
  );
}

/** A real moment from the café lesson (data/curriculum/child/a1/food.ts): the dialogue. */
function DialoguePreview({ className }: { className?: string }) {
  return (
    <AppWindow
      address="kompas / lekcja / w kawiarni"
      label="Fragment lekcji na poziomie A1: rozmowa w kawiarni. Barista pyta „Hi! What would you like?”, uczeń odpowiada „I’d like a hot chocolate, please.”"
      className={className}
    >
      <WindowHead left="W KAWIARNI" right="A1 · Speaking" />
      <BaristaLine audio>Hi! What would you like?</BaristaLine>
      <div className="flex flex-col items-end gap-1.5">
        <span className="flex items-center gap-2 rounded-[16px_16px_4px_16px] bg-ink px-3.5 py-3 text-[16px] font-semibold leading-snug text-on-ink">
          <Mic size={15} strokeWidth={2.2} className="shrink-0 text-amber" />
          I’d like a hot chocolate, please.
        </span>
        <span className="flex items-center gap-1 text-[13px] font-medium text-moss-deeper">
          <Check size={14} strokeWidth={2.6} />
          Dobra odpowiedź
        </span>
      </div>
      <BaristaLine>Sure! Small or large?</BaristaLine>
      <div className="flex items-center gap-3 border-t border-line pt-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber">
          <Mic size={18} strokeWidth={2.2} />
        </span>
        <span className="text-sm text-body">Twoja kolej — odpowiedz na głos</span>
      </div>
    </AppWindow>
  );
}

/** The same lesson a step earlier: building the sentence from tiles. */
function ExercisePreview({ className }: { className?: string }) {
  const tile = "rounded-[10px] px-3 py-2 text-[15px] font-semibold";
  return (
    <AppWindow
      address="kompas / lekcja / ordering at a café"
      label="Fragment lekcji „Ordering at a café”: układanie zdania „I’d like a hot chocolate, please.” z gotowych elementów."
      className={className}
    >
      <WindowHead left="UŁÓŻ ZDANIE" right="A1 · Ćwiczenie 4 z 9" />
      <div className="h-1.5 overflow-hidden rounded-full bg-track">
        <div className="h-full w-[44%] rounded-full bg-ink" />
      </div>
      <p className="m-0 text-[17px] font-semibold leading-snug">Poproszę gorącą czekoladę.</p>
      <div className="flex min-h-[52px] flex-wrap gap-2 border-b-2 border-line pb-3">
        {["I’d like", "a", "hot chocolate,", "please."].map((word) => (
          <span key={word} className={`${tile} bg-ink text-on-ink`}>
            {word}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {["I like", "give me", "tea"].map((word) => (
          <span key={word} className={`${tile} text-muted shadow-[inset_0_0_0_1.5px_var(--color-line)]`}>
            {word}
          </span>
        ))}
      </div>
      <div className="flex items-start gap-2.5 rounded-xl bg-sand px-3.5 py-3 text-sm leading-snug text-body">
        <Check size={16} strokeWidth={2.6} className="mt-0.5 shrink-0 text-moss-deeper" />
        <span>
          <b className="font-semibold">Dobrze!</b> „I’d like… please” to grzeczne zamówienie. „I like” znaczy tylko „lubię”.
        </span>
      </div>
    </AppWindow>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <a href="#main" className="sr-only-focusable absolute left-4 top-4 z-50 rounded-xl bg-ink px-4 py-2 text-on-ink">
        Przejdź do treści
      </a>
      <div className="mx-auto max-w-[1400px]">
        <header className={`flex flex-wrap items-center justify-between gap-4 py-5 ${GUTTER}`}>
          <Logo />
          <nav aria-label="Główna" className="hidden gap-7 text-[15px] font-medium md:flex">
            <a href="#jak-to-dziala" className="hover:underline">Jak to działa</a>
            <a href="#poziomy" className="hover:underline">Poziomy CEFR</a>
            <a href="#dla-rodzicow" className="hover:underline">Dla rodziców</a>
          </nav>
          <div className="flex gap-2.5">
            <Link href="/auth?mode=login" className="rounded-xl px-[18px] py-[11px] text-[15px] font-semibold hover:bg-sand">
              Zaloguj
            </Link>
            <Link href="/auth?mode=signup" className="rounded-xl bg-ink px-[18px] py-[11px] text-[15px] font-semibold text-on-ink hover:bg-ink-hover">
              Zacznij za darmo
            </Link>
          </div>
        </header>

        <main id="main">
          <section className={`grid grid-cols-1 items-center gap-x-10 gap-y-12 pb-[clamp(48px,6vw,88px)] pt-[clamp(24px,4vw,56px)] lg:grid-cols-2 ${GUTTER}`}>
            <div className="flex flex-col gap-[26px]">
              <p className="m-0 font-mono text-xs tracking-[0.1em] text-muted">KOMPAS / ENGLISH LEARNING</p>
              <h1 className="m-0 text-balance font-display text-[clamp(42px,5.4vw,76px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                Angielski, którego naprawdę użyjesz.
              </h1>
              <p className="m-0 max-w-[40ch] text-pretty text-[clamp(17px,1.5vw,20px)] leading-[1.55] text-body">
                Ucz się przez rozmowy i sytuacje, które spotykasz na co dzień. Od pierwszych słów do poziomu B2.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth?mode=signup" className="rounded-[14px] bg-ink px-7 py-[18px] text-[17px] font-semibold text-on-ink hover:bg-ink-hover">
                  Zacznij naukę
                  <Arrow />
                </Link>
                <Link href="/auth?mode=signup" className="rounded-[14px] px-6 py-[18px] text-[17px] font-semibold shadow-[inset_0_0_0_1.5px_oklch(0.80_0.02_85)] hover:bg-sand">
                  Sprawdź swój poziom
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[600px] sm:h-[560px]">
              {/* The route: a dotted line from the start, past the lesson, on to B2. */}
              <svg aria-hidden className="absolute inset-0 hidden h-full w-full sm:block" viewBox="0 0 600 560" preserveAspectRatio="none">
                <path
                  d="M 60 62 C 10 170, 40 330, 130 430 S 330 562, 548 522"
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="0.1 13"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <span aria-hidden className="absolute left-[10%] top-[11%] hidden size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink shadow-[0_0_0_4px_var(--color-paper)] sm:grid">
                <span className="size-2.5 rotate-45 bg-amber" />
              </span>
              <span aria-hidden className="absolute left-[14.5%] top-[2%] hidden whitespace-nowrap font-mono text-[11px] tracking-[0.1em] text-muted sm:block">START · PRE-A1</span>
              <span aria-hidden className="absolute left-[91.3%] top-[93.2%] hidden size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-paper sm:block" />
              <span aria-hidden className="absolute right-[5%] top-[84.5%] hidden whitespace-nowrap font-mono text-[11px] tracking-[0.1em] text-muted sm:block">CEL · B2</span>
              <DialoguePreview className="relative w-full sm:absolute sm:right-0 sm:top-[7%] sm:w-[max(340px,66%)]" />
            </div>
          </section>

          <section className={`flex flex-col gap-9 ${SECTION}`}>
            <div className="flex flex-col gap-4">
              <h2 className={H2}>Nie uczysz się słówek bez kontekstu.</h2>
              <p className={LEAD}>Wchodzisz w konkretną sytuację i uczysz się języka, którego potrzebujesz, żeby sobie w niej poradzić.</p>
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
              {SITUATIONS.map(({ icon: Icon, place, line, pl }) => (
                <li key={place} className="flex flex-col gap-5 rounded-[26px] bg-card p-[clamp(20px,2.2vw,28px)] shadow-[inset_0_0_0_1.5px_var(--color-line-soft),0_10px_30px_oklch(0.23_0.025_265/0.05)]">
                  <span className="flex items-center gap-3 text-[15px] font-semibold">
                    <span className="grid size-11 place-items-center rounded-full bg-sand">
                      <Icon aria-hidden size={21} strokeWidth={1.9} />
                    </span>
                    {place}
                  </span>
                  <span className="flex flex-col gap-2">
                    <span lang="en" className="self-start rounded-[18px_18px_18px_4px] bg-sand px-4 py-3 font-display text-[clamp(18px,1.7vw,21px)] font-bold leading-[1.25] tracking-[-0.015em]">
                      {line}
                    </span>
                    <span className="pl-1 text-sm text-body">{pl}</span>
                  </span>
                </li>
              ))}
            </ul>
            <ol className="m-0 flex list-none flex-wrap items-center gap-y-2 p-0 text-sm font-medium">
              {SKILLS.map((skill, i) => (
                <li key={skill} className="flex items-center">
                  {i > 0 && <ArrowRight aria-hidden size={15} strokeWidth={2} className="mx-2 text-faint" />}
                  <span className="rounded-full bg-sand px-3.5 py-1.5">{skill}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className={GUTTER}>
            <section
              id="jak-to-dziala"
              className="grid scroll-mt-4 grid-cols-1 items-center gap-x-[clamp(32px,5vw,80px)] gap-y-10 rounded-[32px] bg-sand p-[clamp(24px,5vw,72px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
            >
              <div className="relative mx-auto w-full max-w-[440px]">
                <ExercisePreview className="relative" />
              </div>
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-3">
                  <p className="m-0 font-mono text-xs tracking-[0.1em] text-muted">JAK DZIAŁA KOMPAS</p>
                  <h2 className={H2}>Od pierwszej lekcji do prawdziwej rozmowy.</h2>
                </div>
                <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
                  {STEPS.map((step) => (
                    <li key={step.n} className="flex items-start gap-4 rounded-[18px] bg-card px-4 py-3.5">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand font-display text-[15px] font-extrabold">{step.n}</span>
                      <div className="flex flex-col gap-0.5">
                        <h3 className="m-0 text-[18px] font-semibold">{step.title}</h3>
                        <p className="m-0 text-[15px] leading-[1.5] text-body">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </div>

          <section id="poziomy" className={`flex scroll-mt-4 flex-col gap-9 ${SECTION}`}>
            <div className="flex flex-col gap-4">
              <h2 className={H2}>Wiesz, gdzie jesteś i dokąd zmierzasz.</h2>
              <p className={LEAD}>Program od Pre-A1 do B2 oparty na poziomach CEFR. Każdy etap ma określone umiejętności, słownictwo i gramatykę.</p>
            </div>
            <LevelPath
              levels={CEFR_LEVELS.map((level) => ({
                level,
                words: CEFR_PROGRAM[level].words,
                grammar: CEFR_PROGRAM[level].grammar.length,
                canDo: CEFR_PROGRAM[level].canDo,
              }))}
            />
          </section>

          <section id="tryby" className={`flex scroll-mt-4 flex-col gap-8 pb-[clamp(48px,6vw,88px)] ${GUTTER}`}>
            <div className="flex flex-col gap-4">
              <h2 className={H2}>Jedna droga. Różne sposoby nauki.</h2>
              <p className={LEAD}>Wszystkie trzy korzystają z tego samego programu CEFR, ale interfejs i sposób nauki dostosowują się do wieku.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {MODES.map(({ id, icon: Icon, age, title, mark, text }) => (
                <article key={id} id={id} className={`flex scroll-mt-6 flex-col items-start gap-3 rounded-[26px] bg-card p-[clamp(20px,2.2vw,28px)] shadow-[inset_0_0_0_1.5px_var(--color-line-soft),0_10px_30px_oklch(0.23_0.025_265/0.05)]`}>
                  <div className="flex w-full items-center justify-between">
                    <span className="flex items-center gap-2.5 rounded-full bg-sand px-3 py-1.5 font-mono text-xs">
                      <span aria-hidden className={`size-2.5 shrink-0 ${mark}`} />
                      {age}
                    </span>
                    <Icon aria-hidden size={26} strokeWidth={1.7} className="text-muted" />
                  </div>
                  <h3 className="m-0 mt-2 font-display text-[clamp(23px,2.3vw,28px)] font-extrabold leading-[1.1] tracking-[-0.02em]">{title}</h3>
                  <p className="m-0 text-[15px] leading-[1.55] text-body">{text}</p>
                  <Link href="/auth?mode=login" className="mt-auto rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[inset_0_0_0_1.5px_var(--color-line-strong)] hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)]">
                    Zobacz jak
                    <span className="sr-only"> wygląda nauka {title.toLowerCase()}</span>
                    <Arrow />
                  </Link>
                </article>
              ))}
            </div>

            <div id="dla-rodzicow" className="flex scroll-mt-6 flex-wrap items-center justify-between gap-x-10 gap-y-6 rounded-[26px] bg-sand p-[clamp(22px,3vw,36px)]">
              <div className="flex flex-col gap-2.5">
                <p className="m-0 font-mono text-xs tracking-[0.1em] text-muted">DLA RODZICÓW</p>
                <h2 className="m-0 font-display text-[clamp(24px,2.6vw,32px)] font-extrabold leading-[1.05] tracking-[-0.025em]">Wiesz, czego dziecko się uczy.</h2>
                <p className="m-0 max-w-[52ch] text-pretty text-[15px] leading-[1.55] text-body">
                  Postępy, ukończone lekcje, czas nauki i materiał do powtórzenia — bez zaglądania dziecku przez ramię.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 lg:items-end">
                <ul aria-label="Przykładowy tydzień w panelu rodzica" className="m-0 flex list-none flex-wrap gap-2.5 p-0">
                  {PARENT_STATS.map(([value, label]) => (
                    <li key={label} className="flex items-baseline gap-1.5 rounded-2xl bg-card px-4 py-2.5">
                      <b className="font-display text-[22px] font-extrabold leading-none">{value}</b>
                      <span className="text-[13px] text-muted">{label}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/parent" className="rounded-xl px-5 py-3 text-[15px] font-semibold shadow-[inset_0_0_0_1.5px_var(--color-ink)] hover:bg-card">
                  Zobacz panel rodzica
                  <Arrow />
                </Link>
              </div>
            </div>
          </section>

          <div className={`pb-[clamp(48px,6vw,80px)] ${GUTTER}`}>
            <section className="flex flex-wrap items-center justify-between gap-x-10 gap-y-7 rounded-[32px] bg-ink p-[clamp(28px,5vw,64px)] text-on-ink">
              <div className="flex flex-col gap-3">
                <h2 className="m-0 text-balance font-display text-[clamp(30px,4vw,52px)] font-extrabold leading-none tracking-[-0.035em]">Nie wiesz, od czego zacząć?</h2>
                <p className="m-0 max-w-[44ch] text-pretty text-[clamp(16px,1.4vw,19px)] leading-[1.55] text-on-ink-muted">Sprawdź swój poziom i dobierz odpowiednią ścieżkę nauki.</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href="/auth?mode=signup" className="rounded-[14px] bg-amber px-7 py-[18px] text-[17px] font-semibold text-ink hover:bg-amber-mid">
                  Sprawdź swój poziom
                  <Arrow />
                </Link>
                <Link href="/auth?mode=signup" className="rounded-md py-2 text-[17px] font-semibold underline underline-offset-4 hover:no-underline">
                  Zacznij naukę
                </Link>
              </div>
            </section>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
