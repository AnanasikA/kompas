import Link from "next/link";
import { ArrowRight, Briefcase, Check, Map as MapIcon, Target } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CEFR_PROGRAM } from "@/data/cefr/program";
import { CEFR_LEVELS } from "@/types";

const STEPS = [
  { n: "01", color: "text-moss", title: "Sprawdź swój poziom", text: "Krótki start pomaga dobrać odpowiedni poziom i ścieżkę nauki." },
  { n: "02", color: "text-sky", title: "Ucz się krok po kroku", text: "Realizuj lekcje i misje zgodne z programem CEFR od Pre-A1 do B2." },
  { n: "03", color: "text-amber", title: "Używaj angielskiego", text: "Słuchaj, układaj zdania, mów i ćwicz rozmowy w codziennych sytuacjach." },
  { n: "04", color: "text-coral", title: "Powtarzaj to, co sprawia trudność", text: "Kompas zapamiętuje błędy i wraca do nich w kolejnych treningach." },
];

/** A scene from the app, framed like a small browser window. */
function BrowserWindow({ address, dark = false, className = "", children }: { address: string; dark?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`w-[88%] overflow-hidden rounded-[14px] shadow-[0_18px_40px_oklch(0.23_0.025_265/0.16),0_0_0_1px_oklch(0.23_0.025_265/0.12)] sm:absolute sm:w-[min(350px,64%)] ${className}`}
    >
      <div className={`flex items-center gap-2.5 px-3 py-2 ${dark ? "bg-night-raised" : "bg-sand"}`}>
        <span className="flex shrink-0 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`size-2 rounded-full ${dark ? "bg-night-line" : "bg-line-strong"}`} />
          ))}
        </span>
        <span className={`min-w-0 flex-1 truncate rounded-full px-2.5 py-[3px] font-mono text-[10px] ${dark ? "bg-night text-night-muted" : "bg-card text-muted"}`}>{address}</span>
      </div>
      {children}
    </div>
  );
}

const Arrow = ({ size = "1em" }: { size?: string | number }) => <ArrowRight aria-hidden size={size} strokeWidth={2.4} className="ml-1.5 inline-block align-[-0.14em]" />;
const Tick = () => <Check aria-hidden size="1.05em" strokeWidth={2.6} className="mr-1.5 inline-block shrink-0 align-[-0.16em]" />;

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
          <a href="#dla-rodzicow" className="hover:underline">Dla rodziców</a>
          <a href="#poziomy" className="hover:underline">Poziomy CEFR</a>
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
        <section className="grid grid-cols-1 items-center gap-12 px-[clamp(20px,4vw,56px)] pb-[72px] pt-[clamp(24px,5vw,64px)] lg:grid-cols-2">
          <div className="flex flex-col gap-[26px]">
            <p className="m-0 font-mono text-xs tracking-[0.1em] text-muted">NAUKA ANGIELSKIEGO ONLINE · DZIECI · NASTOLATKI · DOROŚLI</p>
            <h1 className="m-0 text-balance font-display text-[clamp(46px,6vw,84px)] font-extrabold leading-[0.95] tracking-[-0.04em]">
              Angielski, który dzieje się naprawdę.
            </h1>
            <p className="m-0 max-w-[46ch] text-pretty text-[clamp(17px,1.5vw,20px)] leading-[1.55] text-body">
              Ucz się angielskiego online w praktycznych sytuacjach — w kawiarni, na lotnisku, w hotelu i w pracy. Interaktywne lekcje,
              mówienie i powtórki dopasowane do wieku oraz poziomu CEFR od Pre-A1 do B2.
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
            <ul className="m-0 flex list-none flex-wrap gap-[22px] p-0 text-sm text-body">
              <li>
                <Tick />
                Pre-A1 <ArrowRight aria-hidden size="1em" strokeWidth={2.2} className="inline-block align-[-0.14em]" /> B2
                <span className="sr-only"> (od Pre-A1 do B2)</span>
              </li>
              <li>
                <Tick />
                Mówienie od pierwszej lekcji
              </li>
              <li>
                <Tick />
                Bez reklam
              </li>
            </ul>
          </div>

          <div className="relative hidden flex-col gap-3 sm:block sm:min-h-[580px]" aria-hidden>
            {/* The route: from the start, past the three scenes, on towards B2. Drawn in the free space beside the windows. */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 520" preserveAspectRatio="none">
              <g fill="none" stroke="oklch(0.23 0.025 265)" strokeWidth="4" strokeLinecap="round" strokeDasharray="0.1 13">
                <path d="M 44 58 C 30 150, 50 240, 112 306" vectorEffect="non-scaling-stroke" />
                <path d="M 404 452 C 480 500, 566 476, 566 380 S 560 262, 576 206" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>
            <span className="absolute left-[7.3%] top-[11.2%] grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink shadow-[0_0_0_4px_var(--color-paper)]">
              <span className="size-2.5 rotate-45 bg-amber" />
            </span>
            <span className="absolute left-[12%] top-[8.8%] hidden whitespace-nowrap font-mono xl:block text-[11px] tracking-[0.1em] text-muted">START · PRE-A1</span>
            <span className="absolute left-[94.3%] top-[73%] size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-paper" />
            <span className="absolute bottom-[1%] right-0 whitespace-nowrap font-mono text-[11px] tracking-[0.1em] text-muted">A1 · A2 · B1 · B2</span>

            <BrowserWindow address="kompas / dzieci / kawiarnia" className="sm:bottom-0 sm:left-0">
              <div className="flex flex-col gap-3 bg-amber p-4">
                <div className="flex justify-between font-mono text-[11px] tracking-[0.08em]">
                  <span>01 · CAFÉ</span>
                  <span className="rounded-full bg-ink px-2 py-0.5 text-amber">8–12</span>
                </div>
                <div className="self-start rounded-[18px_18px_18px_4px] bg-card px-4 py-3 font-display text-[19px] font-semibold">“I&apos;d like a hot chocolate, please.”</div>
                <div className="text-[13px]">Angielski dla dzieci</div>
              </div>
            </BrowserWindow>
            <BrowserWindow dark address="kompas / nastolatki / lotnisko" className="sm:left-[24%] sm:top-[35%]">
              <div className="flex flex-col gap-3 bg-[oklch(0.19_0.02_275)] p-4 text-night-text">
                <div className="flex justify-between font-mono text-[11px] tracking-[0.08em]">
                  <span className="text-lime">02 · AIRPORT</span>
                  <span className="rounded-[3px] px-2 py-0.5 text-lime shadow-[inset_0_0_0_1px_var(--color-lime)]">13–17</span>
                </div>
                <div className="self-end rounded-[10px_10px_2px_10px] bg-grape px-4 py-3 text-[17px] font-semibold text-night">“Excuse me, which gate is it now?”</div>
                <div className="text-[13px] text-[oklch(0.78_0.02_275)]">Angielski dla nastolatków</div>
              </div>
            </BrowserWindow>
            <BrowserWindow address="kompas / dorośli / praca" className="sm:right-0 sm:top-0">
              <div className="flex flex-col gap-3 bg-[oklch(0.995_0.003_90)] p-4">
                <div className="flex justify-between font-mono text-[11px] tracking-[0.08em] text-muted">
                  <span>03 · WORK</span>
                  <span className="rounded-full px-2 py-0.5 text-azure shadow-[inset_0_0_0_1px_var(--color-azure)]">18+</span>
                </div>
                <div className="font-serif text-[25px] leading-[1.15]">“Could we move the meeting to Friday?”</div>
                <div className="text-[13px] text-muted">Angielski dla dorosłych</div>
              </div>
            </BrowserWindow>
          </div>
        </section>

        <section id="tryby" className="grid grid-cols-1 gap-4 border-t border-line px-[clamp(20px,4vw,56px)] pb-6 pt-10 md:grid-cols-3">
          <article className="flex flex-col gap-3 rounded-[28px_28px_28px_8px] bg-amber p-[clamp(22px,2.5vw,30px)]">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-xs text-amber">8–12 LAT</span>
              <MapIcon aria-hidden size={28} strokeWidth={1.8} />
            </div>
            <h2 className="m-0 font-display text-[clamp(26px,2.6vw,32px)] font-extrabold leading-[1.05] tracking-[-0.02em]">Angielski dla dzieci</h2>
            <p className="m-0 text-[15px] leading-[1.55]">Nauka przez mapę światów, krótkie misje, dialogi i ćwiczenia dopasowane do wieku.</p>
            <Link href="/auth?mode=signup" className="mt-auto self-start rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-on-ink hover:bg-ink-hover">
              Zacznij
              <Arrow />
            </Link>
          </article>
          <article className="k-on-dark flex flex-col gap-3 rounded-xl border border-lime/60 bg-night p-[clamp(22px,2.5vw,30px)] text-night-text">
            <div className="flex items-center justify-between">
              <span className="rounded-[3px] px-2.5 py-1 font-mono text-xs text-lime shadow-[inset_0_0_0_1px_var(--color-lime)]">13–17 LAT</span>
              <Target aria-hidden size={28} strokeWidth={1.8} className="text-lime" />
            </div>
            <h2 className="m-0 font-display text-[clamp(26px,2.6vw,32px)] font-extrabold leading-[1.05] tracking-[-0.02em]">Angielski dla nastolatków</h2>
            <p className="m-0 text-[15px] leading-[1.55] text-night-body">Misje, wyzwania i praktyczne sytuacje, które rozwijają słownictwo, słuchanie i mówienie.</p>
            <Link href="/auth?mode=signup" className="mt-auto self-start rounded-md bg-lime px-4 py-2.5 text-sm font-bold text-night hover:bg-lime-hover">
              Zacznij
              <Arrow />
            </Link>
          </article>
          <article className="flex flex-col gap-3 rounded-lg bg-canvas-card p-[clamp(22px,2.5vw,30px)] shadow-[inset_0_0_0_1px_var(--color-canvas-line-strong)]">
            <div className="flex items-center justify-between">
              <span className="rounded-full px-2.5 py-1 font-mono text-xs text-azure shadow-[inset_0_0_0_1px_var(--color-azure)]">18+</span>
              <Briefcase aria-hidden size={28} strokeWidth={1.8} className="text-azure" />
            </div>
            <h2 className="m-0 font-serif text-[clamp(27px,2.7vw,34px)] leading-[1.05]">Angielski dla dorosłych</h2>
            <p className="m-0 text-[15px] leading-[1.55] text-body">Praktyczny angielski do podróży, pracy i codziennych rozmów — krok po kroku według CEFR.</p>
            <Link href="/auth?mode=signup" className="mt-auto self-start rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-canvas hover:bg-ink-hover">
              Zacznij
              <Arrow />
            </Link>
          </article>
        </section>

        <section id="jak-to-dziala" className="grid grid-cols-1 gap-7 px-[clamp(20px,4vw,56px)] py-[clamp(48px,6vw,80px)] sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col gap-3">
              <div className={`font-display text-5xl font-extrabold ${s.color}`}>{s.n}</div>
              <h3 className="m-0 text-[19px] font-semibold">{s.title}</h3>
              <p className="m-0 text-[15px] leading-[1.55] text-body">{s.text}</p>
            </div>
          ))}
        </section>

        <section id="poziomy" className="flex flex-col gap-6 px-[clamp(20px,4vw,56px)] pb-[clamp(48px,6vw,80px)]">
          <div className="flex flex-col gap-2">
            <p className="m-0 font-mono text-xs tracking-[0.1em] text-muted">PROGRAM CEFR</p>
            <h2 className="m-0 font-display text-[clamp(28px,3.5vw,44px)] font-extrabold leading-[1.02] tracking-[-0.03em]">Poziomy od Pre-A1 do B2</h2>
          </div>
          <ol className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-5">
            {CEFR_LEVELS.map((level, i) => {
              const program = CEFR_PROGRAM[level];
              return (
                <li key={level} className={`flex flex-col gap-2 rounded-[22px] bg-card p-[18px] shadow-[inset_0_0_0_1.5px_var(--color-line-soft)] ${i === CEFR_LEVELS.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}>
                  <span className="font-display text-[28px] font-extrabold leading-none tracking-[-0.02em]">{level}</span>
                  <span className="font-mono text-[11px] leading-[1.6] text-muted">
                    {program.words} słów
                    <br />
                    {program.grammar.length} zagadnień gramatycznych
                  </span>
                  <span className="text-sm leading-snug text-body">{program.canDo[0]}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <section
          id="dla-rodzicow"
          className="mx-[clamp(20px,4vw,56px)] mb-14 grid grid-cols-1 items-center gap-9 rounded-[32px] bg-ink p-[clamp(28px,4vw,52px)] text-[oklch(0.97_0.008_85)] lg:grid-cols-2"
        >
          <div className="flex flex-col gap-4">
            <p className="m-0 font-mono text-xs tracking-[0.08em] text-amber">DLA RODZICÓW</p>
            <h2 className="m-0 font-display text-[clamp(28px,3.5vw,44px)] font-extrabold leading-[1.02] tracking-[-0.03em]">
              Widzisz, czego dziecko się nauczyło — nie tylko ile grało.
            </h2>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[15px] text-[oklch(0.85_0.012_265)]">
              <li>
                <Tick />
                Postępy dziecka i czas nauki w jednym miejscu
              </li>
              <li>
                <Tick />
                Ukończone lekcje, wyniki i poznane słownictwo
              </li>
              <li>
                <Tick />
                Widzisz, co warto jeszcze powtórzyć
              </li>
              <li>
                <Tick />
                Bez reklam w aplikacji dziecka
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-2.5" aria-hidden>
            {[
              ["42", "min w tym tygodniu", ""],
              ["4", "dni aktywne", ""],
              ["31", "nowych słów", "text-amber"],
            ].map(([n, label, color]) => (
              <div key={label} className="flex flex-col gap-1 rounded-[18px] border border-[oklch(0.38_0.03_265)] p-[clamp(12px,2.5vw,18px)]">
                <div className={`font-display text-[clamp(28px,6vw,36px)] font-extrabold leading-none ${color}`}>{n}</div>
                <div className="text-xs leading-snug text-[oklch(0.80_0.015_265)] sm:text-[13px]">{label}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="mx-[clamp(20px,4vw,56px)] mb-14 flex flex-wrap items-center justify-between gap-5 rounded-[32px] bg-amber p-[clamp(24px,4vw,44px)]">
          <h2 className="m-0 max-w-[18ch] font-display text-[clamp(28px,3.5vw,44px)] font-extrabold leading-[1.02] tracking-[-0.03em]">Angielski, który dzieje się naprawdę.</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth?mode=signup" className="rounded-[14px] bg-ink px-7 py-[18px] text-[17px] font-semibold text-on-ink hover:bg-ink-hover">
              Zacznij naukę
              <Arrow />
            </Link>
            <Link href="/auth?mode=signup" className="rounded-[14px] px-6 py-[18px] text-[17px] font-semibold shadow-[inset_0_0_0_1.5px_var(--color-ink)] hover:bg-amber-mid">
              Sprawdź swój poziom
            </Link>
          </div>
        </section>
      </main>

      <footer className="flex flex-wrap justify-between gap-3 px-[clamp(20px,4vw,56px)] pb-10 pt-6 text-[13px] text-muted">
        <span>© 2026 Kompas</span>
        <span>Prywatność · Regulamin · Bezpieczeństwo dzieci</span>
      </footer>
    </div>
  );
}
