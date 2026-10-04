import type { DailyActivity } from "@/types";
import { addDays, dayKey } from "@/lib/utils";

type ActivityMap = Record<string, DailyActivity>;

export function emptyDay(date: string): DailyActivity {
  return { date, seconds: 0, xp: 0, lessonsCompleted: 0, speakingAttempts: 0, reviewsDone: 0 };
}

export function bumpActivity(activity: ActivityMap, now: Date, patch: Partial<Omit<DailyActivity, "date">>): ActivityMap {
  const key = dayKey(now);
  const day = activity[key] ?? emptyDay(key);
  return {
    ...activity,
    [key]: {
      ...day,
      seconds: day.seconds + (patch.seconds ?? 0),
      xp: day.xp + (patch.xp ?? 0),
      lessonsCompleted: day.lessonsCompleted + (patch.lessonsCompleted ?? 0),
      speakingAttempts: day.speakingAttempts + (patch.speakingAttempts ?? 0),
      reviewsDone: day.reviewsDone + (patch.reviewsDone ?? 0),
    },
  };
}

function isActive(day: DailyActivity | undefined): boolean {
  return !!day && (day.seconds > 0 || day.xp > 0 || day.reviewsDone > 0);
}

/** Consecutive active days ending today (or yesterday, if today has not started yet). */
export function computeStreak(activity: ActivityMap, now: Date): number {
  let cursor = isActive(activity[dayKey(now)]) ? now : addDays(now, -1);
  let streak = 0;
  while (isActive(activity[dayKey(cursor)])) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export interface WeekDay {
  date: string;
  /** Short weekday label. */
  label: string;
  active: boolean;
  isToday: boolean;
  minutes: number;
  xp: number;
}

const PL_DAYS = ["N", "P", "W", "Ś", "C", "P", "S"];
const EN_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

/** Monday-to-Sunday week containing `now`. */
export function weekActivity(activity: ActivityMap, now: Date, lang: "pl" | "en" = "pl"): WeekDay[] {
  const mondayOffset = (now.getDay() + 6) % 7;
  const monday = addDays(now, -mondayOffset);
  const today = dayKey(now);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    const key = dayKey(date);
    const day = activity[key];
    return {
      date: key,
      label: (lang === "pl" ? PL_DAYS : EN_DAYS)[date.getDay()],
      active: isActive(day),
      isToday: key === today,
      minutes: Math.round((day?.seconds ?? 0) / 60),
      xp: day?.xp ?? 0,
    };
  });
}

export interface DailyGoalState {
  goalMinutes: number;
  minutesDone: number;
  minutesLeft: number;
  percent: number;
  reached: boolean;
}

export function dailyGoal(activity: ActivityMap, now: Date, goalMinutes: number): DailyGoalState {
  const seconds = activity[dayKey(now)]?.seconds ?? 0;
  const minutesDone = Math.floor(seconds / 60);
  const percent = Math.min(100, Math.round((seconds / (goalMinutes * 60)) * 100));
  return {
    goalMinutes,
    minutesDone,
    minutesLeft: Math.max(0, Math.ceil((goalMinutes * 60 - seconds) / 60)),
    percent,
    reached: percent >= 100,
  };
}

const XP_MISSION = 50;

export interface DailyMission {
  id: string;
  title: string;
  done: number;
  target: number;
  complete: boolean;
}

/** Three small goals for today, computed from real activity. */
export function dailyMissions(activity: ActivityMap, now: Date, opts: { unitTitle: string | null; reviewsDue: number }): DailyMission[] {
  const day = activity[dayKey(now)] ?? emptyDay(dayKey(now));
  const reviewPool = opts.reviewsDue + day.reviewsDone;
  const reviewTarget = Math.min(4, reviewPool);
  const third =
    reviewPool > 0
      ? {
          id: "review",
          title: `Powtórz ${reviewTarget} ${reviewTarget === 1 ? "rzecz" : "rzeczy"} w Treningu`,
          done: Math.min(day.reviewsDone, reviewTarget),
          target: reviewTarget,
        }
      : // Nothing to review yet: a goal the learner can actually reach today.
        { id: "xp", title: `Zdobądź ${XP_MISSION} XP`, done: Math.min(day.xp, XP_MISSION), target: XP_MISSION };
  const missions = [
    {
      id: "lesson",
      title: opts.unitTitle ? `Ukończ lekcję w ${opts.unitTitle}` : "Ukończ lekcję",
      done: Math.min(day.lessonsCompleted, 1),
      target: 1,
    },
    { id: "speak", title: "Powiedz zdanie na głos", done: Math.min(day.speakingAttempts, 1), target: 1 },
    third,
  ];
  return missions.map((m) => ({ ...m, complete: m.done >= m.target }));
}

export function totals(activity: ActivityMap): { seconds: number; days: number } {
  const days = Object.values(activity).filter(isActive);
  return { seconds: days.reduce((s, d) => s + d.seconds, 0), days: days.length };
}
