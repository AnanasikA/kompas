"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { PlayTriangle } from "@/components/ui/icons";
import { getCourse } from "@/data/curriculum";
import { CHILD_AGES, CHILD_INTERESTS, CHILD_MINUTES, CHILD_SELF_LEVELS } from "@/data/onboarding";
import { rankTitle } from "@/features/gamification/levels";
import { useAudioClip } from "@/features/lessons/useAudioClip";
import { nextLesson, unitStates } from "@/features/progress/units";
import { AVATAR_COLORS, SELECT_OFF, SELECT_ON, initialOf } from "@/features/theme/avatar";
import { useAppStore } from "@/lib/store/app-store";
import { cx } from "@/lib/utils";
import type { Skill } from "@/types";
import { ONBOARDING_FLOWS, nextStep, previousStep, stepPath } from "./flow";
import { usePlacementRun } from "./usePlacementRun";

const AMBER_BTN =
  "rounded-2xl bg-amber font-display text-[19px] font-extrabold shadow-[0_5px_0_var(--color-amber-deep)] transition-transform active:translate-y-1 active:shadow-[0_1px_0_var(--color-amber-deep)]";
const INK_BTN =
  "rounded-2xl bg-ink font-display text-[19px] font-extrabold text-on-ink shadow-[0_5px_0_var(--color-ink-deep)] transition-transform active:translate-y-1 active:shadow-[0_1px_0_var(--color-ink-deep)]";
const H1 = "m-0 font-display font-extrabold leading-none tracking-[-0.03em]";
const WEEKS_TO_NEXT: Record<number, number> = { 5: 18, 10: 10, 15: 7, 20: 5 };

function Frame({ step, children }: { step: string; children: React.ReactNode }) {
  const flow = ONBOARDING_FLOWS.CHILD;
  const index = flow.indexOf(step);
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <div className="flex items-center justify-between gap-4 px-[clamp(20px,4vw,48px)] py-[18px]">
        {step === "result" ? (
          <span className="px-3.5 py-2.5" />
        ) : (
          <Link href={previousStep("CHILD", step)} className="rounded-xl px-3.5 py-2.5 text-[15px] font-semibold hover:bg-sand">
            ← Wstecz
          </Link>
        )}
        <div className="flex items-center gap-1.5" role="img" aria-label={`Krok ${index + 1} z ${flow.length}`}>
          {flow.map((s, i) => (
            <div key={s} className={cx("h-2 rounded", i === index ? "w-[34px]" : "w-2", i <= index ? "bg-ink" : "bg-line")} />
          ))}
        </div>
        <div className="min-w-[90px] text-right font-mono text-xs text-muted">
          krok {index + 1} z {flow.length}
        </div>
      </div>
      <main className="flex flex-1 flex-col items-center px-[clamp(20px,4vw,48px)] pb-16 pt-[clamp(20px,4vw,48px)]">
        <div className="flex w-full max-w-[980px] flex-col gap-8">{children}</div>
      </main>
    </div>
  );
}

function Profile() {
  const router = useRouter();
  const draft = useAppStore((s) => s.onboarding);
  const updateDraft = useAppStore((s) => s.updateDraft);
  const ready = draft.name.trim().length > 0 && draft.age != null;

  return (
    <form
      className="flex flex-col items-center gap-[30px] text-center"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) router.push(nextStep("CHILD", "profile"));
      }}
    >
      <p className="m-0 rounded-full bg-sand px-4 py-2.5 text-sm">Rodzicu, teraz oddaj urządzenie dziecku — dalej mówimy już do niego</p>
      <div className="flex flex-col items-center gap-2.5">
        <div
          aria-hidden
          className="grid size-24 place-items-center rounded-full font-display text-[40px] font-extrabold shadow-[0_0_0_5px_var(--color-paper),0_0_0_8px_var(--color-ink)]"
          style={{ background: AVATAR_COLORS[1] }}
        >
          {initialOf(draft.name)}
        </div>
        <h1 className={cx(H1, "mt-3 text-[clamp(34px,4.5vw,56px)]")}>
          <label htmlFor="child-name">Cześć! Jak masz na imię?</label>
        </h1>
      </div>
      <input
        id="child-name"
        value={draft.name}
        onChange={(e) => updateDraft({ name: e.target.value })}
        maxLength={20}
        autoComplete="given-name"
        placeholder="Twoje imię"
        className="w-full max-w-[320px] rounded-[18px] bg-card px-7 py-3.5 text-center font-display text-[28px] font-extrabold shadow-[0_4px_0_var(--color-line),inset_0_0_0_2px_var(--color-line-strong)] placeholder:font-semibold placeholder:text-faint"
      />
      <fieldset className="m-0 flex flex-col items-center gap-4 border-0 p-0">
        <legend className="mb-4 font-display text-[26px] font-extrabold">Ile masz lat?</legend>
        <div className="flex flex-wrap justify-center gap-3">
          {CHILD_AGES.map((age) => {
            const on = draft.age === age;
            return (
              <button
                key={age}
                type="button"
                aria-pressed={on}
                onClick={() => updateDraft({ age })}
                className={cx("grid size-[72px] place-items-center rounded-full font-display text-[28px] font-extrabold", on ? `bg-amber ${SELECT_ON}` : `bg-card ${SELECT_OFF}`)}
              >
                {age}
              </button>
            );
          })}
        </div>
      </fieldset>
      <button type="submit" disabled={!ready} className={cx(AMBER_BTN, "px-12 py-[18px] disabled:opacity-40")}>
        Dalej
      </button>
      {!ready && <p className="m-0 -mt-4 text-[13px] text-muted">Wpisz imię i wybierz wiek.</p>}
    </form>
  );
}

function Interests() {
  const router = useRouter();
  const goals = useAppStore((s) => s.onboarding.goals);
  const updateDraft = useAppStore((s) => s.updateDraft);
  const toggle = (id: string) => updateDraft({ goals: goals.includes(id) ? goals.filter((g) => g !== id) : [...goals, id] });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2.5 text-center">
        <p className="m-0 font-mono text-xs tracking-[0.08em] text-coral-ink">WYBIERZ, CO LUBISZ · MOŻE BYĆ KILKA</p>
        <h1 className={cx(H1, "text-[clamp(34px,4.5vw,56px)]")}>Co najbardziej lubisz?</h1>
      </div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {CHILD_INTERESTS.map((g) => {
          const on = goals.includes(g.id);
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(g.id)}
              className={cx("grid grid-cols-[64px_minmax(0,1fr)_26px] items-center gap-3.5 rounded-[22px] bg-card p-[18px] text-left", on ? SELECT_ON : SELECT_OFF)}
            >
              <span className="grid size-16 place-items-center rounded-[18px]" style={{ background: g.color }} aria-hidden>
                <span className={cx("size-[22px] bg-ink", g.rotate && "rotate-45")} style={{ borderRadius: g.shape }} />
              </span>
              <span className="flex flex-col gap-[3px]">
                <span className="font-display text-xl font-extrabold">{g.label}</span>
                <span className="text-[13px] leading-[1.4] text-body">{g.desc}</span>
              </span>
              <span
                aria-hidden
                className={cx("grid size-[26px] place-items-center rounded-lg text-sm font-bold text-on-ink", on ? "bg-ink" : "shadow-[inset_0_0_0_2px_var(--color-line)]")}
              >
                {on ? "✓" : ""}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-center">
        <button type="button" onClick={() => router.push(nextStep("CHILD", "interests"))} className={cx(INK_BTN, "px-12 py-[18px]")}>
          Dalej · wybrano {goals.length}
        </button>
      </div>
    </div>
  );
}

function Level() {
  const router = useRouter();
  const draft = useAppStore((s) => s.onboarding);
  const updateDraft = useAppStore((s) => s.updateDraft);
  const startPlacement = useAppStore((s) => s.startPlacement);
  const finishOnboarding = useAppStore((s) => s.finishOnboarding);
  const unsure = draft.selfLevel === 4;
  const canSkip = draft.selfLevel != null && !unsure;

  return (
    <div className="grid grid-cols-1 items-start gap-9 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <p className="m-0 font-mono text-xs tracking-[0.08em] text-coral-ink">GDZIE JESTEŚ TERAZ?</p>
        <h1 className={cx(H1, "text-[clamp(32px,3.8vw,48px)]")}>Ile angielskiego już znasz?</h1>
        <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Ile angielskiego już znasz?">
          {CHILD_SELF_LEVELS.map((o, i) => {
            const on = draft.selfLevel === i;
            return (
              <button
                key={o.label}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => updateDraft({ selfLevel: i })}
                className={cx("grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3.5 rounded-[18px] px-[18px] py-3.5 text-left", on ? `bg-amber-soft ${SELECT_ON}` : `bg-card ${SELECT_OFF}`)}
              >
                <span className="flex h-7 items-end gap-[3px]" aria-hidden>
                  {[0, 1, 2, 3].map((b) => (
                    <span key={b} className={cx("w-[7px] rounded-[2px]", i < 4 && b <= i ? "bg-ink" : "bg-line")} style={{ height: 8 + b * 6 }} />
                  ))}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold">{o.label}</span>
                  <span className="font-serif text-base italic text-muted">{o.example}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-[32px] bg-ink p-7 text-[oklch(0.97_0.008_85)]">
        <p className="m-0 font-mono text-xs tracking-[0.08em] text-amber">TWÓJ RYTM</p>
        <h2 className="m-0 font-display text-3xl font-extrabold leading-[1.05] tracking-[-0.02em]">Ile czasu dziennie?</h2>
        <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Ile czasu dziennie?">
          {CHILD_MINUTES.map((m) => {
            const on = draft.dailyGoal === m.minutes;
            return (
              <button
                key={m.minutes}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => updateDraft({ dailyGoal: m.minutes })}
                className={cx("flex flex-col gap-1 rounded-[18px] p-4 text-left", on ? "bg-amber text-ink" : "bg-[oklch(0.30_0.03_265)] text-[oklch(0.95_0.01_265)]")}
              >
                <span className="font-display text-[34px] font-extrabold leading-none">
                  {m.minutes}
                  <span className="text-[15px]"> min</span>
                </span>
                <span className="text-[13px] opacity-85">
                  {on ? "✓ " : ""}
                  {m.desc}
                </span>
              </button>
            );
          })}
        </div>
        <p className="m-0 border-t border-ink-line pt-1 text-sm leading-normal text-on-ink-muted">
          {draft.dailyGoal} min dziennie → kolejny poziom za ok. {WEEKS_TO_NEXT[draft.dailyGoal] ?? 10} tygodni. Dzień przerwy niczego nie przekreśla.
        </p>
        <button
          type="button"
          onClick={() => {
            startPlacement();
            router.push(nextStep("CHILD", "level"));
          }}
          className={cx(AMBER_BTN, "p-[17px] text-center text-ink")}
        >
          {unsure ? "Sprawdź mój poziom →" : "Krótki test (4 min) →"}
        </button>
        {canSkip && (
          <button
            type="button"
            onClick={() => {
              finishOnboarding({ skipTest: true });
              router.push(stepPath("result"));
            }}
            className="rounded-lg py-1 text-center text-sm text-on-ink-muted underline underline-offset-4"
          >
            Pomiń test — zacznę od mojej oceny
          </button>
        )}
      </div>
    </div>
  );
}

function Placement() {
  const run = usePlacementRun("CHILD");
  const q = run.question;
  const clip = useAudioClip(q.audio);
  const hasPick = run.picked != null;

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="m-0 font-mono text-xs tracking-[0.08em] text-coral-ink">MISJA ZWIADOWCZA · {q.label}</p>
          <h1 className={cx(H1, "text-[clamp(28px,3.5vw,42px)]")}>{q.prompt}</h1>
        </div>
        <p className="m-0 font-mono text-[13px] text-muted" aria-live="polite">
          Pytanie {run.index + 1} z {run.total}
        </p>
      </div>
      <div className="flex flex-col gap-5 rounded-[28px] bg-card p-[clamp(20px,3vw,32px)] shadow-[0_2px_0_var(--color-line),inset_0_0_0_1.5px_var(--color-line-soft)]">
        {q.audio && (
          <div className="flex flex-col gap-2">
            <button type="button" onClick={clip.play} disabled={!clip.supported} className="flex items-center gap-4 self-start rounded-full bg-sky-soft py-3 pl-3 pr-5 hover:bg-[oklch(0.90_0.06_225)] disabled:opacity-50">
              <span className="grid size-[52px] place-items-center rounded-full bg-sky-deep shadow-[0_4px_0_var(--color-sky-deeper)]">
                <PlayTriangle size={16} color="oklch(0.99 0.004 85)" />
              </span>
              <span className="text-base font-semibold text-sky-ink">
                {clip.status === "playing" ? "Odtwarzam…" : clip.plays > 0 ? "Odtwórz jeszcze raz" : "Odtwórz nagranie"}
              </span>
            </button>
            {!clip.supported && (
              <p className="m-0 text-sm text-coral-ink">Ta przeglądarka nie odtworzy nagrania. Wybierz „Nie wiem — dalej”, to pytanie nie obniży wyniku.</p>
            )}
          </div>
        )}
        {q.context && <p className="m-0 rounded-2xl bg-[oklch(0.96_0.02_305)] px-[22px] py-[18px] font-serif text-2xl leading-[1.4]">{q.context}</p>}
        <p className="m-0 font-display text-[clamp(22px,2.4vw,28px)] font-semibold leading-tight">{q.question}</p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label={q.question}>
          {q.options.map((text, i) => {
            const on = run.picked === i;
            return (
              <button
                key={text}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => run.pick(i)}
                className={cx("flex items-center gap-3 rounded-2xl px-[18px] py-4 text-left text-[17px] font-semibold", on ? `bg-amber-soft ${SELECT_ON}` : `bg-card ${SELECT_OFF}`)}
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-sand font-mono text-xs" aria-hidden>
                  {"ABCD"[i]}
                </span>
                {text}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={run.skip} className="rounded-xl px-4 py-3 text-[15px] font-semibold text-body hover:bg-sand">
          Nie wiem — dalej
        </button>
        <p className="m-0 max-w-[40ch] text-[13px] text-muted">Pięć krótkich pytań. Nie ma złych odpowiedzi — sprawdzamy, od czego zacząć.</p>
        <button
          type="button"
          onClick={run.next}
          disabled={!hasPick}
          className={cx("rounded-2xl px-9 py-4 font-display text-lg font-extrabold", hasPick ? "bg-ink text-on-ink shadow-[0_5px_0_var(--color-ink-deep)]" : "bg-idle text-[oklch(0.55_0.015_265)]")}
        >
          Dalej
        </button>
      </div>
    </div>
  );
}

const SKILLS: { skill: Skill; name: string; color: string }[] = [
  { skill: "READING", name: "Reading", color: "var(--color-violet)" },
  { skill: "VOCABULARY", name: "Vocabulary", color: "var(--color-moss)" },
  { skill: "LISTENING", name: "Listening", color: "var(--color-sky)" },
  { skill: "GRAMMAR", name: "Grammar", color: "var(--color-amber)" },
  { skill: "SPEAKING", name: "Speaking", color: "var(--color-coral)" },
];

function Result() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const placement = useAppStore((s) => s.placement);
  const skipped = useAppStore((s) => s.skippedUnitIds);
  const lessons = useAppStore((s) => s.lessons);
  const course = getCourse("CHILD");
  const states = useMemo(() => unitStates(course, lessons, skipped), [course, lessons, skipped]);

  if (!user || !placement) return null;
  const skippedUnits = states.filter((s) => s.skipped).map((s) => s.unit);
  const next = nextLesson(states);
  const after = next ? states.find((s) => s.unit.order > next.unit.unit.order) : undefined;

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
      <div className="relative flex flex-col gap-[18px] overflow-hidden rounded-[36px_36px_36px_10px] bg-amber p-[clamp(24px,3.5vw,40px)]">
        <div className="absolute -right-[50px] -top-[50px] size-[220px] rounded-full bg-[oklch(0.85_0.12_80)]" aria-hidden />
        <p className="relative m-0 font-mono text-xs uppercase tracking-[0.08em]">
          Świetny start, {user.name}!{placement.selfAssessed ? " · na podstawie Twojej oceny" : ` · ${placement.score}/${placement.total}`}
        </p>
        <div className="relative flex items-center gap-6">
          <div className="m-5 grid size-[104px] shrink-0 rotate-45 place-items-center rounded-[22px] bg-ink shadow-[0_8px_0_var(--color-ink-deep)]" aria-hidden>
            <span className="-rotate-45 font-display text-[clamp(26px,3vw,40px)] font-extrabold text-amber">{user.currentCEFR}</span>
          </div>
          <h1 className="m-0 font-display text-[clamp(28px,3vw,38px)] font-extrabold leading-[1.02] tracking-[-0.02em]">
            Twój poziom: {rankTitle("CHILD", user.currentCEFR)}
          </h1>
        </div>
        <p className="relative m-0 text-base leading-[1.55]">
          {skippedUnits.length > 0 ? `Pomijasz ${skippedUnits.map((u) => u.title).join(" i ")} — to już umiesz. ` : "Zaczynamy od podstaw, krok po kroku. "}
          {next && (
            <>
              Twoja następna przygoda: <b>{next.unit.unit.title}</b>.
            </>
          )}
        </p>
        {skippedUnits.length > 0 && (
          <div className="relative flex flex-col gap-2 border-t-[1.5px] border-ink/20 pt-3">
            <p className="m-0 text-[15px] font-bold">You can already:</p>
            {skippedUnits.map((u) => (
              <p key={u.id} className="m-0 text-[15px]">
                ✓ {u.canDo}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5 rounded-[28px] bg-card p-[clamp(24px,3vw,32px)] shadow-[inset_0_0_0_1.5px_var(--color-line-soft)]">
        <h2 className="m-0 font-display text-2xl font-extrabold">Twoje umiejętności na starcie</h2>
        {SKILLS.map((s) => {
          const answer = placement.answers.find((a) => a.skill === s.skill);
          const label = !answer ? "sprawdzimy w 1. lekcji" : answer.correct ? "trafione ✓" : answer.correct === false ? "do poćwiczenia" : "pominięte";
          return (
            <div key={s.skill} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm font-semibold">
                <span>{s.name}</span>
                <span className="font-mono font-normal">{label}</span>
              </div>
              <div className="h-3 rounded-md bg-track">
                <div className="h-full rounded-md" style={{ width: answer?.correct ? "100%" : answer ? "12%" : "0%", background: s.color }} />
              </div>
            </div>
          );
        })}
        <div className="flex flex-col gap-1.5 rounded-2xl bg-sand p-4">
          <p className="m-0 font-mono text-[11px] text-muted">TWÓJ PLAN · {user.dailyGoal} MIN DZIENNIE</p>
          <p className="m-0 text-[15px] font-semibold leading-[1.45]">
            {[next?.unit.unit.title, after?.unit.title, user.targetCEFR].filter(Boolean).join(" → ")}
          </p>
        </div>
        <button type="button" onClick={() => router.push("/home")} className={cx(INK_BTN, "mt-auto p-[18px] text-center")}>
          START ADVENTURE →
        </button>
      </div>
    </div>
  );
}

const STEPS: Record<string, () => React.ReactNode> = {
  profile: Profile,
  interests: Interests,
  level: Level,
  placement: Placement,
  result: Result,
};

export function ChildOnboarding({ step }: { step: string }) {
  const Step = STEPS[step] ?? Profile;
  return (
    <Frame step={STEPS[step] ? step : "profile"}>
      <Step />
    </Frame>
  );
}
