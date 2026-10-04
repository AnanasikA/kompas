"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Logo } from "@/components/ui/Logo";
import { PlayTriangle } from "@/components/ui/icons";
import { getCourse } from "@/data/curriculum";
import { TEEN_AGES, TEEN_GOALS, TEEN_HARDEST, TEEN_MINUTES } from "@/data/onboarding";
import { rankTitle } from "@/features/gamification/levels";
import { useAudioClip } from "@/features/lessons/useAudioClip";
import { nextLesson, unitStates } from "@/features/progress/units";
import { useAppStore } from "@/lib/store/app-store";
import { cx } from "@/lib/utils";
import type { Skill } from "@/types";
import { ONBOARDING_FLOWS, nextStep, previousStep } from "./flow";
import { usePlacementRun } from "./usePlacementRun";

const LIME_BTN = "rounded-md bg-lime px-[34px] py-[15px] text-base font-bold text-night hover:bg-lime-hover disabled:opacity-35";
const EYEBROW = "m-0 font-mono text-[11px] tracking-[0.14em] text-lime";
const ON = "bg-lime/12 shadow-[inset_0_0_0_2px_var(--color-lime)]";
const OFF = "bg-night-surface shadow-[inset_0_0_0_1px_var(--color-night-line)]";

function Frame({ step, children }: { step: string; children: React.ReactNode }) {
  const flow = ONBOARDING_FLOWS.TEEN;
  const index = flow.indexOf(step);
  return (
    <div data-age="TEEN" className="flex min-h-dvh flex-col bg-night text-night-text">
      <div className="flex items-center justify-between gap-4 border-b border-[oklch(0.26_0.025_275)] px-[clamp(20px,4vw,48px)] py-[18px]">
        {step === "result" ? <span /> : (
          <Link href={previousStep("TEEN", step)} className="rounded-md px-1 py-1 text-sm text-night-muted">
            ← Back
          </Link>
        )}
        <div className="flex gap-1" role="img" aria-label={`Step ${index + 1} of ${flow.length}`}>
          {flow.map((s, i) => (
            <div key={s} className={cx("h-1 w-10", i <= index ? "bg-lime" : "bg-night-line-soft")} />
          ))}
        </div>
        <Logo variant="teen" />
      </div>
      <main className="flex flex-1 flex-col items-center px-[clamp(20px,4vw,48px)] py-[clamp(24px,4vw,56px)]">
        <div className="flex w-full max-w-[980px] flex-col gap-7">{children}</div>
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
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
      <div className="flex flex-col gap-3.5">
        <p className={EYEBROW}>PLAYER SETUP · 1/4</p>
        <h1 className="m-0 font-display text-[clamp(40px,5vw,64px)] font-extrabold leading-[0.92] tracking-[-0.04em]">Hey. Let&apos;s set you up.</h1>
        <p className="m-0 max-w-[40ch] text-base leading-[1.55] text-[oklch(0.78_0.02_275)]">
          Zero formularzy. Trzy szybkie pytania i krótka kalibracja poziomu — potem od razu pierwsza misja.
        </p>
      </div>
      <form
        className="flex flex-col gap-[22px] rounded-xl bg-night-surface p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (ready) router.push(nextStep("TEEN", "profile"));
        }}
      >
        <label className="flex flex-col gap-2 font-mono text-[11px] text-night-muted">
          YOUR HANDLE
          <input
            value={draft.name}
            onChange={(e) => updateDraft({ name: e.target.value })}
            maxLength={20}
            autoComplete="nickname"
            placeholder="maja.k"
            className="rounded-md bg-transparent px-4 py-3.5 font-sans text-lg font-semibold text-night-text shadow-[inset_0_0_0_1px_var(--color-lime)] placeholder:text-[oklch(0.55_0.02_275)]"
          />
        </label>
        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="mb-2 font-mono text-[11px] text-night-muted">AGE</legend>
          <div className="flex flex-wrap gap-1.5">
            {TEEN_AGES.map((age) => {
              const on = draft.age === age;
              return (
                <button
                  key={age}
                  type="button"
                  aria-pressed={on}
                  onClick={() => updateDraft({ age })}
                  className={cx("grid h-11 w-[52px] place-items-center rounded-md font-mono text-[15px]", on ? "bg-lime text-night" : "shadow-[inset_0_0_0_1px_var(--color-night-line)]")}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="mb-2 font-mono text-[11px] text-night-muted">DAILY TIME</legend>
          <div className="flex self-start overflow-hidden rounded-md shadow-[inset_0_0_0_1px_var(--color-night-line)]">
            {TEEN_MINUTES.map((m) => {
              const on = draft.dailyGoal === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={on}
                  onClick={() => updateDraft({ dailyGoal: m })}
                  className={cx("px-4 py-[11px] text-sm font-semibold", on && "bg-grape text-night")}
                >
                  {m} min
                </button>
              );
            })}
          </div>
        </fieldset>
        <button type="submit" disabled={!ready} className={cx(LIME_BTN, "self-start")}>
          Next →
        </button>
        {!ready && <p className="m-0 -mt-3 text-[13px] text-night-muted">Wpisz nick i wybierz wiek.</p>}
      </form>
    </div>
  );
}

function Goals() {
  const router = useRouter();
  const draft = useAppStore((s) => s.onboarding);
  const updateDraft = useAppStore((s) => s.updateDraft);
  const startPlacement = useAppStore((s) => s.startPlacement);
  const toggle = (key: "goals" | "focus", value: string) =>
    updateDraft({ [key]: draft[key].includes(value) ? draft[key].filter((v) => v !== value) : [...draft[key], value] });

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="flex flex-col gap-2.5">
        <p className={EYEBROW}>PLAYER SETUP · 2/4</p>
        <h1 className="m-0 font-display text-[clamp(34px,4.5vw,54px)] font-extrabold leading-[0.95] tracking-[-0.035em]">Why do you want better English?</h1>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {TEEN_GOALS.map((g) => {
          const on = draft.goals.includes(g.id);
          return (
            <button key={g.id} type="button" aria-pressed={on} onClick={() => toggle("goals", g.id)} className={cx("grid grid-cols-[20px_minmax(0,1fr)] items-start gap-3.5 rounded-lg p-[18px] text-left", on ? ON : OFF)}>
              <span className={cx("text-sm", on ? "text-lime" : "text-[oklch(0.55_0.02_275)]")} aria-hidden>
                {on ? "■" : "□"}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-display text-lg font-extrabold tracking-[0.02em]">{g.label}</span>
                <span className="text-[13px] text-night-muted">{g.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="m-0 font-display text-[26px] font-extrabold">What feels hardest?</h2>
        <div className="flex flex-wrap gap-2">
          {TEEN_HARDEST.map((skill) => {
            const on = draft.focus.includes(skill);
            return (
              <button key={skill} type="button" aria-pressed={on} onClick={() => toggle("focus", skill)} className={cx("flex items-center gap-2.5 rounded-md px-[18px] py-3 text-[15px] font-semibold", on ? ON : OFF)}>
                <span className={cx("text-xs", on ? "text-lime" : "text-[oklch(0.55_0.02_275)]")} aria-hidden>
                  {on ? "■" : "□"}
                </span>
                {skill}
              </button>
            );
          })}
        </div>
        <p className="m-0 text-[13px] text-night-muted">Te umiejętności zapisujemy w Twoim profilu jako priorytet.</p>
      </div>
      <button
        type="button"
        onClick={() => {
          startPlacement();
          router.push(nextStep("TEEN", "goals"));
        }}
        className={cx(LIME_BTN, "self-start")}
      >
        Calibrate my level →
      </button>
    </div>
  );
}

function Placement() {
  const run = usePlacementRun("TEEN");
  const q = run.question;
  const clip = useAudioClip(q.audio);

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={EYEBROW} aria-live="polite">
          CALIBRATING YOUR LEVEL · ROUND {run.index + 1}/{run.total}
        </p>
        <p className="m-0 font-mono text-[11px] text-night-muted">~3 MIN · NO PRESSURE</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {run.test.questions.map((item, i) => (
          <span key={item.id} className={cx("flex items-center gap-2 rounded bg-night-surface px-2.5 py-1.5 font-mono text-[11px]", i <= run.index ? "text-night-text" : "text-[oklch(0.55_0.02_275)]")}>
            <span className={cx("size-2", i < run.index ? "bg-lime" : i === run.index ? "bg-grape" : "bg-night-chip")} aria-hidden />
            {item.label}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-[18px] rounded-xl bg-night-surface p-[clamp(20px,3vw,32px)]">
        <span className="font-mono text-[11px] text-grape">{q.label}</span>
        {q.audio && (
          <button type="button" onClick={clip.play} disabled={!clip.supported} className="flex items-center gap-3.5 self-start rounded-full bg-night-deep py-2.5 pl-2.5 pr-[18px] disabled:opacity-50">
            <span className="grid size-10 place-items-center rounded-full bg-lime">
              <PlayTriangle size={12} color="oklch(0.17 0.02 275)" />
            </span>
            <span className="text-sm font-semibold">{!clip.supported ? "Audio unavailable in this browser — skip" : clip.status === "playing" ? "Playing…" : clip.plays ? "Play again" : "Voice message"}</span>
          </button>
        )}
        {q.context && <p className="m-0 rounded-lg border-l-[3px] border-grape bg-night-raised px-4 py-3.5 text-base leading-normal">{q.context}</p>}
        <p className="m-0 font-display text-[clamp(24px,2.8vw,32px)] font-extrabold leading-[1.15]">{q.question}</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label={q.question}>
          {q.options.map((text, i) => {
            const on = run.picked === i;
            return (
              <button
                key={text}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => run.pick(i)}
                className={cx("flex items-center gap-3 rounded-lg p-4 text-left text-[15px] font-semibold", on ? "bg-night-raised shadow-[inset_0_0_0_2px_var(--color-lime)]" : OFF)}
              >
                <span className="grid size-[22px] shrink-0 place-items-center rounded-[3px] bg-night-chip font-mono text-[11px]" aria-hidden>
                  {"ABCD"[i]}
                </span>
                {text}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={run.skip} className="rounded-md px-1 py-2 text-sm text-night-muted">
          Not sure — skip
        </button>
        <button type="button" onClick={run.next} disabled={run.picked == null} className={LIME_BTN}>
          Next →
        </button>
      </div>
    </div>
  );
}

const SKILL_NAMES: Record<Skill, string> = { LISTENING: "Listening", SPEAKING: "Real life", GRAMMAR: "Grammar", VOCABULARY: "Vocabulary", READING: "Reading" };

function Result() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const placement = useAppStore((s) => s.placement);
  const skipped = useAppStore((s) => s.skippedUnitIds);
  const lessons = useAppStore((s) => s.lessons);
  const course = getCourse("TEEN");
  const states = useMemo(() => unitStates(course, lessons, skipped), [course, lessons, skipped]);
  if (!user || !placement) return null;
  const next = nextLesson(states);
  const strong = placement.answers.filter((a) => a.correct === true);
  const weak = placement.answers.filter((a) => a.correct !== true);

  return (
    <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
      <div className="flex flex-col gap-[18px] rounded-xl bg-night-surface p-[clamp(24px,3vw,36px)] shadow-[inset_0_0_0_1px_oklch(0.88_0.17_125/0.5)]">
        <p className={EYEBROW}>CALIBRATION COMPLETE</p>
        <h1 className="m-0 font-display text-[clamp(56px,7vw,96px)] font-extrabold leading-[0.88] tracking-[-0.05em]">
          You&apos;re <span className="text-lime">{user.currentCEFR}.</span>
        </h1>
        <div className="grid grid-cols-2 gap-[18px]">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] text-night-muted">GOT IT RIGHT</span>
            {strong.length === 0 && <span className="text-[15px] text-night-muted">—</span>}
            {strong.map((a) => (
              <span key={a.questionId} className="flex justify-between text-[15px]">
                {SKILL_NAMES[a.skill]}
                <b className="font-mono text-lime">✓</b>
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] text-night-muted">NEEDS WORK</span>
            {weak.length === 0 && <span className="text-[15px] text-night-muted">—</span>}
            {weak.map((a) => (
              <span key={a.questionId} className="flex justify-between text-[15px]">
                {SKILL_NAMES[a.skill]}
                <b className="font-mono text-grape">{a.correct === null ? "skip" : "✕"}</b>
              </span>
            ))}
          </div>
        </div>
        <p className="m-0 text-sm text-[oklch(0.78_0.02_275)]">
          Rank: {rankTitle("TEEN", user.currentCEFR)} · LVL 1 · {placement.score}/{placement.total} w kalibracji
        </p>
      </div>
      <div
        className="flex flex-col overflow-hidden rounded-xl"
        style={{ background: "repeating-linear-gradient(135deg,oklch(0.22 0.03 280),oklch(0.22 0.03 280) 10px,oklch(0.235 0.032 280) 10px,oklch(0.235 0.032 280) 20px)" }}
      >
        <div className="flex flex-1 flex-col gap-3 p-[clamp(24px,3vw,32px)]">
          <p className="m-0 font-mono text-[11px] tracking-[0.14em] text-grape">YOUR FIRST MISSION</p>
          <p className="m-0 font-display text-[clamp(30px,3.5vw,44px)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
            {next ? `${next.unit.unit.title} — ${next.lesson.lesson.title}` : "Coming soon"}
          </p>
          <p className="m-0 text-sm text-night-body">{next ? next.unit.unit.canDo : "Misje dla Twojego poziomu są w przygotowaniu."}</p>
          <div className="mt-auto flex flex-wrap gap-2.5 pt-4">
            {next && (
              <button type="button" onClick={() => router.push(`/lesson/${next.lesson.lesson.id}`)} className="rounded-md bg-lime px-[30px] py-[15px] text-base font-bold text-night hover:bg-lime-hover">
                START MISSION →
              </button>
            )}
            <button type="button" onClick={() => router.push("/home")} className="rounded-md px-5 py-[15px] text-[15px] font-semibold shadow-[inset_0_0_0_1px_oklch(0.40_0.03_275)]">
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const STEPS: Record<string, () => React.ReactNode> = { profile: Profile, goals: Goals, placement: Placement, result: Result };

export function TeenOnboarding({ step }: { step: string }) {
  const Step = STEPS[step] ?? Profile;
  return (
    <Frame step={STEPS[step] ? step : "profile"}>
      <Step />
    </Frame>
  );
}
