import Link from "next/link";
import { ArrowRight, BedDouble, Check, Coffee, Mic, Plane, Play } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { LevelPath } from "@/components/landing/LevelPath";
import { PlaneTrail } from "@/components/landing/PlaneTrail";
import { Logo } from "@/components/ui/Logo";
import { CEFR_PROGRAM } from "@/data/cefr/program";
import { CEFR_LEVELS } from "@/types";

const SITUATIONS = [
  { icon: Coffee, place: "W kawiarni", line: "I’d like a hot chocolate, please." },
  { icon: Plane, place: "Na lotnisku", line: "Excuse me, which gate is it now?" },
  { icon: BedDouble, place: "W hotelu", line: "I’d like to check in." },
];

const SKILLS = ["Słuchanie", "słownictwo", "budowanie zdań", "mówienie", "dialog"];

const STEPS = [
  { n: "01", title: "Poznajesz", text: "Nowe słowa i zwroty pojawiają się w konkretnej sytuacji." },
  { n: "02", title: "Ćwiczysz", text: "Słuchasz, układasz zdania i odpowiadasz." },
  { n: "03", title: "Mówisz", text: "Używasz poznanego języka w dialogu." },
  { n: "04", title: "Wracasz do błędów", text: "Kompas zapamiętuje trudniejsze elementy i dodaje je do kolejnych powtórek." },
];

/** The colour of each age mode stays a small detail here: a dot, never a whole background. */
const MODES = [
  { id: "dla-dzieci", age: "8–12", title: "Dla dzieci", mark: "rounded-full bg-amber", text: "Mapa światów, krótkie misje i nauka przez odkrywanie." },
  { id: "dla-nastolatkow", age: "13–17", title: "Dla nastolatków", mark: "rotate-45 bg-night shadow-[0_0_0_2px_var(--color-lime)]", text: "Wyzwania, cele i angielski w sytuacjach bliskich codziennemu życiu." },
  { id: "dla-doroslych", age: "18+", title: "Dla dorosłych", mark: "rounded-[2px] border-[1.5px] border-azure", text: "Praktyczna nauka do rozmów, podróży i pracy." },
];

/** Bar heights of the little sound wave in the lesson preview. */
const WAVE = [8, 14, 20, 12, 22, 16, 9, 18, 24, 14, 10, 19, 13, 7, 15, 11, 6];

const SECTION = "px-[clamp(20px,4vw,56px)] py-[clamp(48px,6vw,88px)]";
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
      <div className="flex items-start gap-2.5 rounded-xl bg-moss-soft px-3.5 py-3 text-sm leading-snug text-moss-ink">
        <Check size={16} strokeWidth={2.6} className="mt-0.5 shrink-0" />
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
      <header className="flex flex-wrap items-center justify-between gap-4 px-[clamp(20px,4vw,56px)] py-5">
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
        <section className="relative isolate grid grid-cols-1 items-center gap-x-12 gap-y-10 overflow-hidden px-[clamp(20px,4vw,56px)] pb-[clamp(48px,6vw,80px)] pt-[clamp(24px,5vw,64px)] lg:grid-cols-2">
          {/* Background: the world map outline (public/landing/world-map.png). The text and the lesson sit on top of it. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- a decorative background picture */}
          <img
            src="/landing/world-map.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute bottom-8 left-1/2 -z-10 hidden w-[min(100%,1480px)] max-w-none -translate-x-1/2 opacity-[0.17] sm:block lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2"
          />
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

          <div className="relative mx-auto w-full max-w-[640px] sm:h-[580px]">
            <PlaneTrail className="absolute left-0 top-0 hidden w-[300px] text-ink sm:block" />
            <DialoguePreview className="w-full sm:absolute sm:bottom-0 sm:right-0 sm:w-[384px]" />
          </div>
        </section>

        <section className={`flex flex-col gap-9 border-t border-line ${SECTION}`}>
          <div className="flex flex-col gap-4">
            <h2 className={H2}>Nie uczysz się słówek bez kontekstu.</h2>
            <p className={LEAD}>Wchodzisz w konkretną sytuację i uczysz się języka, którego potrzebujesz, żeby sobie w niej poradzić.</p>
          </div>
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-3">
            {SITUATIONS.map(({ icon: Icon, place, line }) => (
              <li key={place} className="flex flex-col gap-5 rounded-[22px] bg-card p-[clamp(20px,2.2vw,28px)] shadow-[inset_0_0_0_1.5px_var(--color-line-soft)]">
                <span className="flex items-center gap-2.5 text-[15px] font-semibold">
                  <Icon aria-hidden size={22} strokeWidth={1.8} />
                  {place}
                </span>
                <span lang="en" className="font-display text-[clamp(20px,2vw,25px)] font-bold leading-[1.2] tracking-[-0.015em]">
                  “{line}”
                </span>
              </li>
            ))}
          </ul>
          <ol className="m-0 flex list-none flex-wrap items-center gap-x-1 gap-y-2 p-0 font-mono text-xs tracking-[0.04em] text-muted">
            {SKILLS.map((skill, i) => (
              <li key={skill} className="flex items-center">
                {i > 0 && <ArrowRight aria-hidden size={13} strokeWidth={2} className="mx-2 text-faint" />}
                {skill}
              </li>
            ))}
          </ol>
        </section>

        <section id="jak-to-dziala" className={`grid scroll-mt-4 grid-cols-1 items-center gap-x-[clamp(32px,6vw,96px)] gap-y-10 bg-sand lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] ${SECTION}`}>
          <ExercisePreview className="mx-auto w-full max-w-[440px]" />
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="m-0 font-mono text-xs tracking-[0.1em] text-muted">JAK DZIAŁA KOMPAS</p>
              <h2 className={H2}>Od pierwszej lekcji do prawdziwej rozmowy.</h2>
            </div>
            <ol className="m-0 flex list-none flex-col p-0">
              {STEPS.map((step) => (
                <li key={step.n} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 border-t border-line-strong py-4">
                  <span className="pt-[3px] font-mono text-xs text-muted">{step.n}</span>
                  <div className="flex flex-col gap-1">
                    <h3 className="m-0 text-[19px] font-semibold">{step.title}</h3>
                    <p className="m-0 text-[15px] leading-[1.55] text-body">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

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

        <section id="tryby" className={`flex scroll-mt-4 flex-col gap-8 border-t border-line ${SECTION}`}>
          <div className="flex flex-col gap-4">
            <h2 className={H2}>Jedna droga. Różne sposoby nauki.</h2>
            <p className={LEAD}>Wszystkie trzy korzystają z tego samego programu CEFR, ale interfejs i sposób nauki dostosowują się do wieku.</p>
          </div>
          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-3">
            {MODES.map((mode) => (
              <article key={mode.id} id={mode.id} className="flex scroll-mt-6 flex-col items-start gap-2 border-t border-line-strong py-5">
                <p className="m-0 flex items-center gap-2.5 font-mono text-xs tracking-[0.08em] text-muted">
                  <span aria-hidden className={`size-2.5 shrink-0 ${mode.mark}`} />
                  {mode.age}
                </p>
                <h3 className="m-0 font-display text-[clamp(22px,2.2vw,26px)] font-extrabold leading-[1.1] tracking-[-0.02em]">{mode.title}</h3>
                <p className="m-0 text-[15px] leading-[1.55] text-body">{mode.text}</p>
                <Link href="/auth?mode=login" className="mt-1 rounded-md py-1 text-[15px] font-semibold underline-offset-4 hover:underline">
                  Zobacz jak
                  <span className="sr-only"> wygląda nauka {mode.title.toLowerCase()}</span>
                  <Arrow />
                </Link>
              </article>
            ))}
          </div>

          <div id="dla-rodzicow" className="mt-2 flex scroll-mt-6 flex-wrap items-center justify-between gap-x-10 gap-y-5 rounded-[24px] bg-sand p-[clamp(22px,3vw,36px)]">
            <div className="flex flex-col gap-2.5">
              <p className="m-0 font-mono text-xs tracking-[0.1em] text-muted">DLA RODZICÓW</p>
              <h2 className="m-0 font-display text-[clamp(24px,2.6vw,32px)] font-extrabold leading-[1.05] tracking-[-0.025em]">Wiesz, czego dziecko się uczy.</h2>
              <p className="m-0 max-w-[58ch] text-pretty text-[15px] leading-[1.55] text-body">
                Postępy, ukończone lekcje, czas nauki i materiał do powtórzenia — bez zaglądania dziecku przez ramię.
              </p>
            </div>
            <Link href="/parent" className="rounded-xl px-5 py-3.5 text-[15px] font-semibold shadow-[inset_0_0_0_1.5px_var(--color-ink)] hover:bg-card">
              Zobacz panel rodzica
              <Arrow />
            </Link>
          </div>
        </section>

        <section className="flex flex-col items-center gap-6 border-t border-line px-[clamp(20px,4vw,56px)] py-[clamp(72px,10vw,136px)] text-center">
          <h2 className="m-0 text-balance font-display text-[clamp(34px,5vw,64px)] font-extrabold leading-none tracking-[-0.035em]">Nie wiesz, od czego zacząć?</h2>
          <p className="m-0 max-w-[44ch] text-pretty text-[clamp(17px,1.5vw,20px)] leading-[1.55] text-body">Sprawdź swój poziom i dobierz odpowiednią ścieżkę nauki.</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link href="/auth?mode=signup" className="rounded-[14px] bg-ink px-7 py-[18px] text-[17px] font-semibold text-on-ink hover:bg-ink-hover">
              Sprawdź swój poziom
              <Arrow />
            </Link>
            <Link href="/auth?mode=signup" className="rounded-md py-2 text-[17px] font-semibold underline underline-offset-4 hover:no-underline">
              Zacznij naukę
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
