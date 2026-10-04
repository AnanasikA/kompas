import type { AgeGroup, CEFRLevel } from "@/types";

/**
 * TEST ACCOUNTS
 *
 * Three permanent accounts, one per age mode, so the whole product can be
 * checked without going through sign-up and onboarding each time. They exist
 * on every device, cannot be overwritten by a new sign-up, and keep their own
 * progress like any other account.
 *
 * Before the public launch: set DEMO_ACCOUNTS_ENABLED to false (or delete this
 * file's entries). Nothing else depends on them.
 */
export const DEMO_ACCOUNTS_ENABLED = true;
export const DEMO_PASSWORD = "kompas123";

export interface DemoAccount {
  id: string;
  email: string;
  ageGroup: AgeGroup;
  /** Shown on the login screen. */
  label: string;
  range: string;
  name: string;
  age: number | null;
  level: CEFRLevel;
  dailyGoal: number;
  goals: string[];
  focus: string[];
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "demo-child",
    email: "dziecko@kompas.test",
    ageGroup: "CHILD",
    label: "Dziecko",
    range: "8–12",
    name: "Zosia",
    age: 10,
    level: "A1",
    dailyGoal: 10,
    goals: ["animals", "games"],
    focus: [],
  },
  {
    id: "demo-teen",
    email: "nastolatek@kompas.test",
    ageGroup: "TEEN",
    label: "Nastolatek",
    range: "13–17",
    name: "Kuba",
    age: 15,
    level: "A2",
    dailyGoal: 10,
    goals: ["travel", "games"],
    focus: ["Speaking"],
  },
  {
    id: "demo-adult",
    email: "dorosly@kompas.test",
    ageGroup: "ADULT",
    label: "Dorosły",
    range: "18+",
    name: "Anna",
    age: null,
    level: "A2",
    dailyGoal: 15,
    goals: ["Travel", "Work"],
    focus: ["Speaking", "Listening"],
  },
];
