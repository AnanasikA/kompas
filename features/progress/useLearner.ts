"use client";

import { useMemo, useState } from "react";
import { getCourse } from "@/data/curriculum";
import { computeStreak, dailyGoal, weekActivity } from "@/features/gamification/activity";
import { levelInfo, rankTitle } from "@/features/gamification/levels";
import { dueItems } from "@/features/practice/review";
import { useAppStore } from "@/lib/store/app-store";
import type { User } from "@/types";
import { unitsSkippedByPlacement } from "@/features/onboarding/placement";
import { levelStates } from "./cefr";
import { currentUnit, lastCompleted, nextLesson, unitStates } from "./units";

/**
 * Everything a dashboard needs, derived from the saved state.
 * Only use inside <LearnerGate>, where a user is guaranteed.
 */
export function useLearner() {
  const user = useAppStore((s) => s.user) as User;
  const lessons = useAppStore((s) => s.lessons);
  const placedLevel = useAppStore((s) => s.placement?.level);
  const savedSkipped = useAppStore((s) => s.skippedUnitIds);
  const reviews = useAppStore((s) => s.reviews);
  const activity = useAppStore((s) => s.activity);
  // One clock reading per mount keeps rendering pure and the screen consistent.
  const [now] = useState(() => new Date());

  return useMemo(() => {
    const course = getCourse(user.ageGroup);
    // Derived from the placement level, so it stays right when units are added to the course.
    const skipped = placedLevel ? unitsSkippedByPlacement(course, placedLevel) : savedSkipped;
    const units = unitStates(course, lessons, skipped);
    const levels = levelStates(course, units);
    const current = currentUnit(units);
    return {
      user,
      now,
      course,
      units,
      levels,
      /** The CEFR level the learner is working through. */
      currentLevel: levels.find((l) => l.level === current?.unit.level) ?? levels.find((l) => l.status === "CURRENT") ?? levels[0],
      next: nextLesson(units),
      current,
      last: lastCompleted(course, lessons),
      due: dueItems(reviews, now),
      reviews,
      lessons,
      activity,
      level: levelInfo(user.xp),
      rank: rankTitle(user.ageGroup, user.currentCEFR),
      streak: computeStreak(activity, now),
      goal: dailyGoal(activity, now, user.dailyGoal),
      week: weekActivity(activity, now, user.ageGroup === "CHILD" ? "pl" : "en"),
    };
  }, [user, lessons, placedLevel, savedSkipped, reviews, activity, now]);
}

export type LearnerData = ReturnType<typeof useLearner>;
