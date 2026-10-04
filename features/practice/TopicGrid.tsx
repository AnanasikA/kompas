"use client";

import Link from "next/link";
import { TOPICS } from "@/data/topics";
import { useLearner } from "@/features/progress/useLearner";
import { useAge } from "@/features/theme/AgeScope";
import { useAppStore } from "@/lib/store/app-store";
import { cx } from "@/lib/utils";
import { isTopicOpen, topicProgress, topicStartLevel } from "./rounds";

const COPY = {
  CHILD: {
    eyebrow: "TRENING BEZ KOŃCA",
    title: "Wybierz temat i graj",
    lead: "Każda runda to 8 zadań ze słów na Twoim poziomie. Rund nigdy nie zabraknie: wracają słowa, które sprawiły kłopot, i dochodzą nowe.",
    mastered: "opanowane",
    play: "Graj rundę →",
    from: (level: string) => `od poziomu ${level}`,
  },
  TEEN: {
    eyebrow: "ENDLESS ROUNDS",
    title: "Pick a topic. Play a round.",
    lead: "8 zadań na rundę, słowa z Twojego poziomu. Rundy się nie kończą: wraca to, co poszło źle, i dochodzą nowe słowa.",
    mastered: "mastered",
    play: "PLAY →",
    from: (level: string) => `from ${level}`,
  },
  ADULT: {
    eyebrow: "TOPIC PRACTICE",
    title: "Practise by topic",
    lead: "Rundy po 8 zadań ze słów na Twoim poziomie. Bez końca: wracają słowa, z którymi był kłopot, i dochodzą nowe.",
    mastered: "mastered",
    play: "Start round",
    from: (level: string) => `from ${level}`,
  },
};

/** Topics for endless rounds, with how much of each the learner has mastered. */
export function TopicGrid() {
  const age = useAge();
  const { user } = useLearner();
  const stats = useAppStore((s) => s.wordStats);
  const t = COPY[age];

  return (
    <section aria-labelledby="topics-title" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className={cx("font-mono text-[11px] tracking-[0.1em]", age === "CHILD" ? "text-moss-deeper" : age === "TEEN" ? "text-lime" : "text-muted")}>{t.eyebrow}</span>
        <h2 id="topics-title" className={cx("k-heading m-0 leading-none", age === "ADULT" ? "text-[34px]" : "text-[clamp(24px,3vw,32px)]")}>
          {t.title}
        </h2>
        <p className="m-0 max-w-[68ch] text-[15px] leading-normal text-[var(--k-muted)]">{t.lead}</p>
      </div>
      <ul className={cx("m-0 grid list-none grid-cols-1 p-0 sm:grid-cols-2", age === "ADULT" ? "gap-x-10 border-t border-ink lg:grid-cols-2" : "gap-3 lg:grid-cols-3 xl:grid-cols-4")}>
        {TOPICS.map((topic) => {
          const open = isTopicOpen(topic, user.currentCEFR);
          const level = open ? user.currentCEFR : topicStartLevel(topic);
          const progress = topicProgress(topic, level, stats);
          const percent = progress.total ? Math.round((progress.mastered / progress.total) * 100) : 0;
          const title = age === "CHILD" ? topic.title.pl : topic.title.en;
          return (
            <li key={topic.id}>
              <Link
                href={`/practice/topic/${topic.id}`}
                className={cx(
                  "flex h-full flex-col gap-3",
                  age === "CHILD" && "rounded-[24px] bg-card p-[18px] shadow-[0_4px_0_var(--color-line),inset_0_0_0_1.5px_var(--color-line-soft)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5",
                  age === "TEEN" && "rounded-lg bg-night-surface p-4 shadow-[inset_0_0_0_1px_var(--color-night-line)] hover:shadow-[inset_0_0_0_2px_var(--color-lime)]",
                  age === "ADULT" && "border-b border-canvas-line-soft py-4 hover:bg-canvas-card",
                )}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className={cx("leading-tight", age === "ADULT" ? "font-serif text-[23px]" : "font-display text-[19px] font-extrabold")}>{title}</span>
                  <span className="shrink-0 font-mono text-[11px] text-[var(--k-muted)]">{open ? level : t.from(level)}</span>
                </span>
                <span className="mt-auto flex flex-col gap-1.5">
                  <span className={cx("block", age === "CHILD" ? "h-2 rounded bg-track" : age === "TEEN" ? "h-[3px] bg-night-line-soft" : "h-0.5 bg-canvas-line")} role="img" aria-label={`${percent}%`}>
                    <span className={cx("block h-full", age === "CHILD" ? "rounded bg-moss" : age === "TEEN" ? "bg-lime" : "bg-azure")} style={{ width: `${percent}%` }} />
                  </span>
                  <span className="flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="text-[var(--k-muted)]">
                      {progress.mastered} / {progress.total} {t.mastered}
                    </span>
                    <span className={cx("font-semibold", age === "TEEN" && "font-mono text-[11px] text-lime", age === "ADULT" && "text-azure")}>{t.play}</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
