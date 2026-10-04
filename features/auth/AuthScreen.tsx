"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/lib/store/app-store";
import { cx } from "@/lib/utils";
import { DEMO_PASSWORD, type DemoAccount } from "@/data/demo/accounts";
import { demoAccounts } from "./demo";
import type { AuthFailure } from "./service";
import { validateCredentials, type CredentialErrors } from "./validation";

const FAILURE: Record<AuthFailure, string> = {
  EMAIL_TAKEN: "Konto z tym adresem już istnieje. Przejdź do zakładki „Zaloguj się”.",
  UNKNOWN_ACCOUNT: "Nie znaleźliśmy takiego konta na tym urządzeniu. Załóż konto, żeby zacząć.",
  WRONG_PASSWORD: "Hasło się nie zgadza. Spróbuj jeszcze raz.",
};

/** The little shape that stands for each age mode across the product. */
const DEMO_MARK: Record<DemoAccount["ageGroup"], string> = {
  CHILD: "rounded-full bg-amber",
  TEEN: "rotate-45 bg-night shadow-[0_0_0_2px_var(--color-lime)]",
  ADULT: "rounded-[2px] border-[1.5px] border-azure",
};

/**
 * Sign up / log in.
 * Accounts live on this device for now (see lib/persistence and
 * features/auth/service). Real authentication arrives with the backend,
 * behind the same store actions.
 */
export function AuthScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"signup" | "login">(params.get("mode") === "login" ? "login" : "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<CredentialErrors & { form?: string }>({});
  const signUp = useAppStore((s) => s.signUp);
  const signIn = useAppStore((s) => s.signIn);
  const [busy, setBusy] = useState(false);
  const demos = demoAccounts();

  const isSignup = mode === "signup";

  async function enter(action: "signup" | "login", credentials: { email: string; password: string }) {
    if (busy) return;
    setBusy(true);
    const result = action === "signup" ? await signUp(credentials.email, credentials.password) : await signIn(credentials.email, credentials.password);
    if (result.ok) {
      router.push(result.onboardingCompleted ? "/home" : "/onboarding");
      return;
    }
    setBusy(false);
    setErrors({ form: FAILURE[result.reason] });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const found = validateCredentials({ email, password, consent }, mode);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    void enter(mode, { email, password });
  }

  const field = "rounded-xl border-[1.5px] border-line-strong bg-card px-4 py-3.5 text-base font-normal";

  return (
    <div className="grid grid-cols-1 min-h-dvh bg-paper text-ink lg:grid-cols-2">
      <div className="relative flex min-h-[300px] flex-col gap-6 overflow-hidden bg-ink p-[clamp(28px,4vw,56px)] text-[oklch(0.97_0.008_85)] lg:min-h-[420px]">
        <Link href="/" aria-label="Kompas — strona główna" className="self-start rounded-lg">
          <Logo variant="dark" />
        </Link>
        <div className="mt-auto hidden flex-col gap-2.5 sm:flex" aria-hidden>
          <span className="self-start rounded-[16px_16px_16px_4px] bg-amber px-3.5 py-[9px] text-[15px] font-semibold text-ink">I&apos;d like a coffee, please.</span>
          <span className="ml-10 self-start rounded-lg bg-grape px-3.5 py-[9px] text-[15px] font-semibold text-night">Which gate is it now?</span>
          <span className="ml-20 self-start rounded-full px-3.5 py-[9px] font-serif text-lg shadow-[inset_0_0_0_1px_oklch(0.55_0.03_265)]">Could we move the meeting?</span>
        </div>
        <p className="m-0 mt-auto max-w-[12ch] font-display text-[clamp(38px,4.5vw,62px)] font-extrabold leading-[0.98] tracking-[-0.035em] sm:mt-0">
          Twój angielski. Twój sposób nauki.
        </p>
        <p className="m-0 max-w-[38ch] text-base leading-normal text-[oklch(0.85_0.012_265)]">
          Załóż konto, a dopasujemy poziom, tempo i sposób nauki do Ciebie.
        </p>
      </div>

      <main className="mx-auto flex w-full max-w-[560px] flex-col justify-center gap-[22px] p-[clamp(28px,5vw,72px)]">
        <div role="tablist" aria-label="Konto" className="flex gap-1 rounded-[14px] bg-sand p-1">
          {(["signup", "login"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setErrors({});
              }}
              className={cx("flex-1 rounded-[10px] p-[11px] text-center text-[15px] font-semibold", mode === m && "bg-card")}
            >
              {m === "signup" ? "Załóż konto" : "Zaloguj się"}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 font-display text-[32px] font-extrabold tracking-[-0.02em]">{isSignup ? "Załóż konto Kompas" : "Witaj z powrotem"}</h1>
          <p className="m-0 text-[15px] text-muted">{isSignup ? "Za darmo. Pierwsza lekcja za 2 minuty." : "Twoja podróż czeka tam, gdzie ją zostawiłeś."}</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {["Google", "Apple"].map((provider) => (
            <button
              key={provider}
              type="button"
              disabled
              title="Logowanie przez konta zewnętrzne pojawi się razem z backendem"
              className="flex flex-col items-center rounded-xl p-2.5 text-[15px] font-semibold leading-tight text-faint shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]"
            >
              {provider}
              <span className="font-mono text-[10px] font-normal">wkrótce</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[13px] text-faint">
          <div className="h-px flex-1 bg-line" />
          lub e-mail
          <div className="h-px flex-1 bg-line" />
        </div>

        {/* method="post": if scripts have not loaded yet, a native submit must never put the password in the URL. */}
        <form onSubmit={submit} method="post" noValidate className="flex flex-col gap-[22px]">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            E-mail
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="anna.nowak@poczta.pl"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
              }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={field}
            />
            {errors.email && <span id="email-error" role="alert" className="text-[13px] font-normal text-coral-ink">{errors.email}</span>}
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Hasło
            <input
              type="password"
              name="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
              }}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={field}
            />
            {errors.password && <span id="password-error" role="alert" className="text-[13px] font-normal text-coral-ink">{errors.password}</span>}
          </label>

          {isSignup && (
            <div className="flex flex-col gap-1.5">
              <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-normal text-body">
                <input type="checkbox" checked={consent} onChange={(e) => {
                    setConsent(e.target.checked);
                    setErrors((prev) => ({ ...prev, consent: undefined }));
                  }} className="peer sr-only" aria-describedby={errors.consent ? "consent-error" : undefined} />
                <span
                  aria-hidden
                  className={cx(
                    "grid size-5 shrink-0 place-items-center rounded-md text-xs peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
                    consent ? "bg-ink text-on-ink" : "shadow-[inset_0_0_0_2px_var(--color-line-strong)]",
                  )}
                >
                  {consent ? "✓" : ""}
                </span>
                Akceptuję regulamin. Jeśli zakładam konto dla dziecka, jestem jego rodzicem lub opiekunem.
              </label>
              {errors.consent && <span id="consent-error" role="alert" className="text-[13px] text-coral-ink">{errors.consent}</span>}
            </div>
          )}

          {errors.form && <p role="alert" className="m-0 rounded-xl bg-coral-soft px-4 py-3 text-sm text-coral-ink">{errors.form}</p>}

          <button
            type="submit"
            disabled={busy}
            className="rounded-2xl bg-ink p-[17px] text-center font-display text-[19px] font-extrabold text-on-ink shadow-[0_5px_0_var(--color-ink-deep)] transition-transform active:translate-y-1 active:shadow-[0_1px_0_var(--color-ink-deep)]"
          >
            {isSignup ? "Utwórz konto" : "Zaloguj się"}
          </button>
        </form>

        <p className="m-0 text-center text-[13px] text-faint">
          {isSignup
            ? "Konto dziecka bez e-maila — profil dziecka zakłada rodzic w następnym kroku."
            : "Na tym etapie konta są zapisane na tym urządzeniu."}
        </p>

        {demos.length > 0 && (
          <section aria-labelledby="demo-title" className="flex flex-col gap-3 rounded-[20px] bg-sand p-[18px]">
            <div className="flex flex-col gap-1">
              <h2 id="demo-title" className="m-0 font-mono text-xs font-normal tracking-[0.08em] text-muted">
                KONTA TESTOWE
              </h2>
              <p className="m-0 text-[13px] leading-normal text-body">
                Gotowe konta do sprawdzenia każdego trybu. Jedno kliknięcie loguje; hasło do wszystkich: <b className="font-mono font-medium">{DEMO_PASSWORD}</b>
              </p>
            </div>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {demos.map((demo) => (
                <li key={demo.id}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void enter("login", { email: demo.email, password: DEMO_PASSWORD })}
                    className="flex w-full items-center gap-3 rounded-xl bg-card px-3.5 py-3 text-left shadow-[inset_0_0_0_1.5px_var(--color-line)] hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)]"
                  >
                    <span aria-hidden className={cx("size-3 shrink-0", DEMO_MARK[demo.ageGroup])} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[15px] font-semibold">
                        {demo.label} {demo.range} · {demo.name}
                      </span>
                      <span className="truncate font-mono text-xs text-muted">{demo.email}</span>
                    </span>
                    <span className="font-mono text-xs text-muted">{demo.level}</span>
                    <span aria-hidden className="text-lg">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
