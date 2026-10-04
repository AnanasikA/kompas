import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const STEPS = [
  { n: "01", color: "text-moss", title: "Krótki start", text: "4 pytania i opcjonalna misja zwiadowcza. Bez formularzy." },
  { n: "02", color: "text-sky", title: "Twoja ścieżka", text: "Plan od Twojego poziomu do celu — świat po świecie." },
  { n: "03", color: "text-amber", title: "Język w akcji", text: "Słuchasz, mówisz, rozmawiasz z postaciami w scenkach." },
  { n: "04", color: "text-coral", title: "Mądre powtórki", text: "Kompas pamięta Twoje błędy i wraca do nich we właściwym momencie." },
];

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
          <a href="#tryby" className="hover:underline">Poziomy CEFR</a>
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
            <p className="m-0 font-mono text-xs tracking-[0.1em] text-muted">JEDNA PLATFORMA · 8–12 · 13–17 · 18+ · PROGRAM CEFR</p>
            <h1 className="m-0 text-balance font-display text-[clamp(46px,6vw,84px)] font-extrabold leading-[0.95] tracking-[-0.04em]">
              Angielski, który dzieje się naprawdę.
            </h1>
            <p className="m-0 max-w-[46ch] text-pretty text-[clamp(17px,1.5vw,20px)] leading-[1.55] text-body">
              Uczysz się w prawdziwych sytuacjach — w kawiarni, na lotnisku, w pracy. Kompas rozpoznaje Twój wiek, poziom i cel, a potem
              dopasowuje sposób nauki do Ciebie.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth?mode=signup" className="rounded-[14px] bg-ink px-7 py-[18px] text-[17px] font-semibold text-on-ink hover:bg-ink-hover">
                Zacznij naukę →
              </Link>
              <Link href="/auth?mode=signup" className="rounded-[14px] px-6 py-[18px] text-[17px] font-semibold shadow-[inset_0_0_0_1.5px_oklch(0.80_0.02_85)] hover:bg-sand">
                Sprawdź swój poziom
              </Link>
            </div>
            <ul className="m-0 flex list-none flex-wrap gap-[22px] p-0 text-sm text-body">
              <li>✓ Pre-A1 → B2</li>
              <li>✓ Mówienie od pierwszej lekcji</li>
              <li>✓ Bez reklam</li>
            </ul>
          </div>

          <div className="relative min-h-[440px] sm:min-h-[520px]" aria-hidden>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 520" preserveAspectRatio="none">
              <polyline points="80,440 260,300 470,110" fill="none" stroke="oklch(0.23 0.025 265)" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
            </svg>
            <div className="absolute bottom-0 left-0 flex w-[min(330px,62%)] flex-col gap-3 rounded-[28px_28px_28px_8px] bg-amber p-5 shadow-[0_18px_40px_oklch(0.23_0.025_265/0.14)]">
              <div className="flex justify-between font-mono text-[11px] tracking-[0.08em]">
                <span>01 · CAFÉ</span>
                <span className="rounded-full bg-ink px-2 py-0.5 text-amber">8–12</span>
              </div>
              <div className="self-start rounded-[18px_18px_18px_4px] bg-card px-4 py-3 font-display text-[19px] font-semibold">“I&apos;d like a hot chocolate, please.”</div>
              <div className="text-[13px]">Learn through exploration</div>
            </div>
            <div className="absolute left-[24%] top-[30%] flex w-[min(330px,62%)] flex-col gap-3 rounded-lg border border-lime/60 bg-[oklch(0.19_0.02_275)] p-5 text-night-text shadow-[0_18px_40px_oklch(0.23_0.025_265/0.2)]">
              <div className="flex justify-between font-mono text-[11px] tracking-[0.08em]">
                <span className="text-lime">02 · AIRPORT</span>
                <span className="rounded-[3px] px-2 py-0.5 text-lime shadow-[inset_0_0_0_1px_var(--color-lime)]">13–17</span>
              </div>
              <div className="self-end rounded-[10px_10px_2px_10px] bg-grape px-4 py-3 text-[17px] font-semibold text-night">“Excuse me, which gate is it now?”</div>
              <div className="text-[13px] text-[oklch(0.78_0.02_275)]">Learn through challenges</div>
            </div>
            <div className="absolute right-0 top-0 flex w-[min(330px,62%)] flex-col gap-3 rounded-xl bg-[oklch(0.995_0.003_90)] p-5 shadow-[inset_0_0_0_1px_oklch(0.88_0.01_90),0_18px_40px_oklch(0.23_0.025_265/0.10)]">
              <div className="flex justify-between font-mono text-[11px] tracking-[0.08em] text-muted">
                <span>03 · WORK</span>
                <span className="rounded-full px-2 py-0.5 text-azure shadow-[inset_0_0_0_1px_var(--color-azure)]">18+</span>
              </div>
              <div className="font-serif text-[26px] leading-[1.2]">“Could we move the meeting to Friday?”</div>
              <div className="text-[13px] text-muted">Learn through real life</div>
            </div>
          </div>
        </section>

        <section id="tryby" className="grid grid-cols-1 border-t border-line px-[clamp(20px,4vw,56px)] pb-16 pt-10 md:grid-cols-3">
          <div className="flex flex-col gap-2.5 border-line py-6 md:border-r md:pr-7">
            <div className="flex items-center gap-2.5">
              <span className="size-3 rounded-full bg-amber" aria-hidden />
              <span className="font-mono text-xs">8–12</span>
            </div>
            <h2 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.02em]">Learn through exploration</h2>
            <p className="m-0 text-[15px] leading-[1.55] text-body">Mapa światów, misje i własny pokój. Rodzic widzi postęp w swoim panelu.</p>
          </div>
          <div className="flex flex-col gap-2.5 border-line py-6 md:border-r md:px-7">
            <div className="flex items-center gap-2.5">
              <span className="size-3 rotate-45 bg-[oklch(0.19_0.02_275)] shadow-[0_0_0_2px_var(--color-lime)]" aria-hidden />
              <span className="font-mono text-xs">13–17</span>
            </div>
            <h2 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.02em]">Learn through challenges</h2>
            <p className="m-0 text-[15px] leading-[1.55] text-body">Kampanie misji, statystyki i wyzwania tygodnia — w sytuacjach z Twojego życia.</p>
          </div>
          <div className="flex flex-col gap-2.5 py-6 md:pl-7">
            <div className="flex items-center gap-2.5">
              <span className="size-3 rounded-[2px] border-[1.5px] border-azure" aria-hidden />
              <span className="font-mono text-xs">18+</span>
            </div>
            <h2 className="m-0 font-serif text-[32px] font-normal leading-none">Learn through real life</h2>
            <p className="m-0 text-[15px] leading-[1.55] text-body">Konkretny cel CEFR, rozmowy w scenkach i mierzalny postęp umiejętności.</p>
          </div>
        </section>

        <section id="jak-to-dziala" className="grid grid-cols-1 gap-7 px-[clamp(20px,4vw,56px)] py-20 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col gap-3">
              <div className={`font-display text-5xl font-extrabold ${s.color}`}>{s.n}</div>
              <h3 className="m-0 text-[19px] font-semibold">{s.title}</h3>
              <p className="m-0 text-[15px] leading-[1.55] text-body">{s.text}</p>
            </div>
          ))}
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
              <li>✓ Zero reklam i płatności w aplikacji dziecka</li>
              <li>✓ Ukończone lekcje, trafność i czas nauki w jednym miejscu</li>
              <li>✓ Lista tego, co warto powtórzyć</li>
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-2.5" aria-hidden>
            {[
              ["42", "min nauki w tym tygodniu", ""],
              ["4", "dni aktywne", ""],
              ["31", "nowych słów", "text-amber"],
            ].map(([n, label, color]) => (
              <div key={label} className="flex flex-col gap-1 rounded-[18px] border border-[oklch(0.38_0.03_265)] p-[18px]">
                <div className={`font-display text-4xl font-extrabold ${color}`}>{n}</div>
                <div className="text-[13px] text-[oklch(0.80_0.015_265)]">{label}</div>
              </div>
            ))}
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
