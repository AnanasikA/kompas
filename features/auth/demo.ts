import type { AppState } from "@/types";
import { getCourse } from "@/data/curriculum";
import { DEMO_ACCOUNTS, DEMO_ACCOUNTS_ENABLED, type DemoAccount } from "@/data/demo/accounts";
import { STATE_VERSION } from "@/lib/persistence";
import { targetFor, unitsSkippedByPlacement } from "@/features/onboarding/placement";

export function demoAccounts(): DemoAccount[] {
  return DEMO_ACCOUNTS_ENABLED ? DEMO_ACCOUNTS : [];
}

export function findDemoByEmail(email: string): DemoAccount | undefined {
  return demoAccounts().find((d) => d.email === email);
}

export function findDemoById(id: string): DemoAccount | undefined {
  return demoAccounts().find((d) => d.id === id);
}

/**
 * A test account as it looks the first time it is opened: onboarding done,
 * level set, no progress yet. From here on it behaves like any other account.
 */
export function buildDemoState(demo: DemoAccount, now: Date): AppState {
  const createdAt = now.toISOString();
  const isChild = demo.ageGroup === "CHILD";
  return {
    version: STATE_VERSION,
    // For a child the account belongs to the parent, exactly as after a real sign-up.
    account: { id: demo.id, email: demo.email, role: isChild ? "PARENT" : "LEARNER", createdAt },
    user: {
      id: `${demo.id}-learner`,
      name: demo.name,
      email: isChild ? null : demo.email,
      ageGroup: demo.ageGroup,
      role: "LEARNER",
      age: demo.age,
      currentCEFR: demo.level,
      targetCEFR: targetFor(demo.level),
      xp: 0,
      level: 1,
      streak: 0,
      dailyGoal: demo.dailyGoal,
      learningGoal: demo.goals,
      focusSkills: demo.focus,
      avatarColor: 1,
      createdAt,
    },
    onboarding: {
      who: isChild ? "child" : "me",
      ageGroup: demo.ageGroup,
      name: demo.name,
      age: demo.age,
      goals: demo.goals,
      focus: demo.focus,
      selfLevel: null,
      dailyGoal: demo.dailyGoal,
      placement: null,
    },
    onboardingCompleted: true,
    placement: { score: 0, total: 0, level: demo.level, answers: [], selfAssessed: true, completedAt: createdAt },
    lessons: {},
    skippedUnitIds: unitsSkippedByPlacement(getCourse(demo.ageGroup), demo.level),
    reviews: [],
    activity: {},
    practice: null,
    wordStats: {},
    round: null,
    pendingReward: null,
  };
}
