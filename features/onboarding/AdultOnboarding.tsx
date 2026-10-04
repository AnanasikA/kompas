"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Logo } from "@/components/ui/Logo";
import { PlayTriangle } from "@/components/ui/icons";
import { getCourse } from "@/data/curriculum";
import { ADULT_GOALS, ADULT_IMPROVE, ADULT_MINUTES } from "@/data/onboarding";
import { rankTitle } from "@/features/gamification/levels";
import { useAudioClip } from "@/features/lessons/useAudioClip";
import { nextLesson, unitStates } from "@/features/progress/units";
import { useAppStore } from "@/lib/store/app-store";
import { cx } from "@/lib/utils";
import type { Skill } from "@/types";
import { ONBOARDING_FLOWS, nextStep, previousStep } from "./flow";
import { runningEstimate } from "./placement";
import { usePlacementRun } from "./usePlacementRun";

const EYEBROW = "m-0 font-mono text-[11px] tracking-[0.12em] text-muted";
const CTA = "flex gap-10 self-start rounded-md bg-ink px-[22px] py-4 text-[15px] text-canvas hover:bg-ink-hover disabled:opacity-35";

function Frame({ step, children }: { step: string; children: React.ReactNode }) {
  const flow = ONBOARDING_FLOWS.ADULT;
  const index = flow.indexOf(step);
  return (
    <div data-age="ADULT" className="flex min-h-dvh flex-col bg-canvas text-ink">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 border-b border-canvas-line-soft px-[clamp(20px,4vw,56px)] py-5">
        <Logo variant="adult" />
        <div className="grid w-full max-w-[360px] grid-cols-4 gap-1.5 justify-self-center" role="img" aria-label={`Step ${index + 1} of ${flow.length}`}>
          {flow.map((s, i) => (
            <div key={s} className={cx("h-0.5", i <= index ? "bg-ink" : "bg-canvas-line-strong")} />
          ))}
        </div>
        {step === "result" ? <span /> : (
          <Link href={previousStep("ADULT", step)} className="rounded px-1 text-sm text-muted">
            ← Back
          </Link>
        )}
      </div>
      <main className="flex flex-1 flex-col items-center px-[clamp(20px,4vw,56px)] py-[clamp(32px,6vw,72px)]">
        <div className="flex w-full max-w-[960px] flex-col gap-8">{children}</div>
      </main>
    </div>
  );
}

function Pill({ on, onClick, children, size = "lg" }: { on: boolean; onClick(): void; children: React.ReactNode; size?: "lg" | "md" }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cx(
        "rounded-full border",
        size === "lg" ? "px-[22px] py-4 text-[17px]" : "px-5 py-3.5 text-base",
        on ? "border-ink bg-ink text-canvas" : "border-canvas-line-strong bg-[oklch(0.995_0.003_90)]",
      )}
    >
      {on && <span aria-hidden>✓ </span>}
      {children}
    </button>
  );
}

function Goals() {
  const router = useRouter();
  const goals = useAppStore((s) => s.onboarding.goals);
  const updateDraft = useAppStore((s) => s.updateDraft);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className={EYEBROW}>YOUR PLAN · 1 OF 4</p>
        <h1 className="m-0 font-serif text-[clamp(44px,5.5vw,72px)] font-normal leading-[0.98]">What do you want English for?</h1>
        <p className="m-0 text-base text-muted">Wybierz wszystko, co pasuje. Zapiszemy to w Twoim planie.</p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {ADULT_GOALS.map((g) => (
          <Pill key={g} on={goals.includes(g)} onClick={() => updateDraft({ goals: goals.includes(g) ? goals.filter((x) => x !== g) : [...goals, g] })}>
            {g}
          </Pill>
        ))}
      </div>
      <button type="button" onClick={() => router.push(nextStep("ADULT", "goals"))} className={CTA}>
        <span>Continue</span>
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}

function Focus() {
  const router = useRouter();
  const draft = useAppStore((s) => s.onboarding);
  const updateDraft = useAppStore((s) => s.updateDraft);
  const startPlacement = useAppStore((s) => s.startPlacement);
  return (
    <div className="flex flex-col gap-9">
      <div className="flex flex-col gap-[18px]">
        <p className={EYEBROW}>YOUR PLAN · 2 OF 4</p>
        <h1 className="m-0 font-serif text-[clamp(40px,5vw,62px)] font-normal leading-[0.98]">What would you most like to improve?</h1>
        <div className="flex flex-wrap gap-2.5">
          {ADULT_IMPROVE.map((g) => (
            <Pill key={g} size="md" on={draft.focus.includes(g)} onClick={() => updateDraft({ focus: draft.focus.includes(g) ? draft.focus.filter((x) => x !== g) : [...draft.focus, g] })}>
              {g}
            </Pill>
          ))}
        </div>
      </div>
      <fieldset className="m-0 flex flex-col gap-3.5 border-0 border-t border-solid border-canvas-line p-0 pt-7">
        <legend className="float-left mb-3.5 w-full font-serif text-[34px]">How much time works for you?</legend>
        <div className="flex self-start overflow-hidden rounded-md shadow-[inset_0_0_0_1px_var(--color-canvas-line-strong)]">
          {ADULT_MINUTES.map((m) => {
            const on = draft.dailyGoal === m.minutes;
            return (
              <button key={m.minutes} type="button" aria-pressed={on} onClick={() => updateDraft({ dailyGoal: m.minutes })} className={cx("px-[22px] py-3.5 text-[15px]", on && "bg-ink text-canvas")}>
                {m.label}
              </button>
            );
          })}
        </div>
        <p className="m-0 text-sm text-azure">Cel dzienny: {draft.dailyGoal} min. Zmienisz go w ustawieniach w każdej chwili.</p>
      </fieldset>
      <button
        type="button"
        onClick={() => {
          startPlacement();
          router.push(nextStep("ADULT", "focus"));
        }}
        className={CTA}
      >
        <span>Find my level</span>
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}

function Placement() {
  const run = usePlacementRun("ADULT");
  const q = run.question;
  const clip = useAudioClip(q.audio);
  return (
    <div className="grid grid-cols-1 items-start gap-[clamp(24px,5vw,56px)] md:grid-cols-[minmax(0,1fr)_minmax(0,240px)]">
      <div className="flex flex-col gap-[26px]">
        <p className="m-0 font-mono text-[11px] tracking-[0.12em] text-azure" aria-live="polite">
          {q.label.toUpperCase()} · {q.level} · {run.index + 1} OF {run.total}
        </p>
        {q.audio && (
          <div className="flex items-center gap-4 border-y border-canvas-line py-4">
            <button type="button" onClick={clip.play} disabled={!clip.supported} aria-label="Play the message" className="grid size-[52px] place-items-center rounded-full bg-ink disabled:opacity-40">
              <PlayTriangle size={14} color="oklch(0.97 0.006 90)" />
            </button>
            <span className="text-[15px]">{!clip.supported ? "Audio is not available in this browser — choose “I don't know”." : clip.status === "playing" ? "Playing…" : "Phone message"}</span>
          </div>
        )}
        {q.context && <p className="m-0 border-l-2 border-ink bg-canvas-card px-5 py-4 text-[17px] leading-[1.55]">{q.context}</p>}
        <p className="m-0 font-serif text-[clamp(30px,3.6vw,42px)] leading-[1.15]">{q.question}</p>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label={q.question}>
          {q.options.map((text, i) => {
            const on = run.picked === i;
            return (
              <button
                key={text}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => run.pick(i)}
                className={cx("flex items-center gap-4 rounded-md bg-[oklch(0.995_0.003_90)] px-[18px] py-4 text-left text-base", on ? "border-[1.5px] border-ink" : "border border-canvas-line-strong")}
              >
                <span className="grid size-4 shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1.5px_oklch(0.60_0.02_265)]" aria-hidden>
                  <span className={cx("size-2 rounded-full", on && "bg-ink")} />
                </span>
                {text}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between">
          <button type="button" onClick={run.skip} className="text-sm text-muted underline underline-offset-4">
            I don&apos;t know
          </button>
          <button type="button" onClick={run.next} disabled={run.picked == null} className="flex gap-9 rounded-md bg-ink px-[22px] py-[15px] text-[15px] text-canvas disabled:opacity-35">
            <span>Continue</span>
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
      <aside className="flex flex-col gap-4 rounded-lg bg-canvas-card p-[22px] shadow-[inset_0_0_0_1px_var(--color-canvas-line)] md:sticky md:top-6">
        <p className="m-0 font-serif text-[26px] leading-[1.05]">Finding your level…</p>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {run.test.questions.map((item, i) => (
            <li key={item.id} className={cx("flex items-center gap-2.5 text-sm", i > run.index && "text-faint")}>
              <span className={cx("size-2 rounded-full", i < run.index ? "bg-ink" : i === run.index ? "bg-azure" : "bg-canvas-line")} aria-hidden />
              {item.label}
              {i < run.index && <span className="sr-only"> — done</span>}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-1 border-t border-[oklch(0.92_0.008_90)] pt-3">
          <span className="font-mono text-[10px] tracking-[0.1em] text-muted">CURRENT ESTIMATE</span>
          <span className="font-serif text-[34px]">{run.answers.length ? runningEstimate(run.test, run.answers) : "—"}</span>
        </div>
        <p className="m-0 text-xs leading-normal text-faint">Pięć pytań, ok. 3 minuty. Szacunek aktualizuje się po każdej odpowiedzi.</p>
      </aside>
    </div>
  );
}

const SKILL_ROWS: { skill: Skill; name: string }[] = [
  { skill: "LISTENING", name: "Listening" },
  { skill: "VOCABULARY", name: "Vocabulary" },
  { skill: "GRAMMAR", name: "Grammar" },
  { skill: "READING", name: "Reading" },
  { skill: "SPEAKING", name: "Speaking" },
];

function Result() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const placement = useAppStore((s) => s.placement);
  const skipped = useAppStore((s) => s.skippedUnitIds);
  const lessons = useAppStore((s) => s.lessons);
  const course = getCourse("ADULT");
  const states = useMemo(() => unitStates(course, lessons, skipped), [course, lessons, skipped]);
  if (!user || !placement) return null;
  const next = nextLesson(states);
  const [code, name] = rankTitle("ADULT", user.currentCEFR).split(" · ");
  const skippedTitles = states.filter((s) => s.skipped).map((s) => String(s.unit.order).padStart(2, "0"));

  return (
    <div className="grid grid-cols-1 items-start gap-[clamp(32px,5vw,64px)] lg:grid-cols-2">
      <div className="flex flex-col gap-[18px]">
        <p className={EYEBROW}>YOUR CURRENT LEVEL</p>
        <h1 className="m-0 font-serif text-[clamp(56px,7vw,96px)] font-normal leading-[0.9]">
          {code} <span className="text-[oklch(0.55_0.02_265)]">· {name}</span>
        </h1>
        <p className="m-0 text-[19px] leading-normal">
          You&apos;re on your way to {user.targetCEFR}. {placement.score}/{placement.total} in the level check.
        </p>
        <div className="flex flex-col gap-3.5 border-t border-ink pt-[18px]">
          {SKILL_ROWS.map((row) => {
            const answer = placement.answers.find((a) => a.skill === row.skill);
            const ok = answer?.correct === true;
            return (
              <div key={row.skill} className="grid grid-cols-[110px_minmax(0,1fr)_auto] items-center gap-3.5">
                <span>{row.name}</span>
                <div className="h-0.5 bg-canvas-line">
                  <div className={cx("h-full", ok ? "bg-ink" : "bg-azure")} style={{ width: ok ? "100%" : answer ? "15%" : "0%" }} />
                </div>
                <span className={cx("text-right font-mono text-[13px]", !ok && "text-azure")}>{ok ? "correct" : answer ? "to practise" : "—"}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-5 rounded-[10px] bg-canvas-card p-7 shadow-[inset_0_0_0_1px_var(--color-canvas-line)]">
        <p className="m-0 font-mono text-[11px] tracking-[0.12em] text-azure">RECOMMENDED STARTING POINT</p>
        <p className="m-0 font-serif text-4xl leading-[1.02]">{next ? next.unit.unit.title : "Your plan"}</p>
        <p className="m-0 text-[15px] leading-[1.55] text-body">
          {next ? `Zaczynasz od lekcji „${next.lesson.lesson.title}”. ` : "Lekcje dla Twojego poziomu są w przygotowaniu. "}
          {skippedTitles.length > 0 && `Moduły ${skippedTitles.join(", ")} zaliczyliśmy na podstawie testu. `}
          Plan: {user.dailyGoal} min dziennie.
        </p>
        <button type="button" onClick={() => router.push("/home")} className="flex justify-between rounded-md bg-ink px-[22px] py-[17px] text-[15px] font-semibold tracking-[0.06em] text-canvas hover:bg-ink-hover">
          <span>START MY PLAN</span>
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

const STEPS: Record<string, () => React.ReactNode> = { goals: Goals, focus: Focus, placement: Placement, result: Result };

export function AdultOnboarding({ step }: { step: string }) {
  const Step = STEPS[step] ?? Goals;
  return (
    <Frame step={STEPS[step] ? step : "goals"}>
      <Step />
    </Frame>
  );
}
