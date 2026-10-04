export type AgeGroup = "CHILD" | "TEEN" | "ADULT";
export type Role = "LEARNER" | "PARENT";

/** CEFR levels covered by the curriculum, in order. */
export const CEFR_LEVELS = ["Pre-A1", "A1", "A2", "B1", "B2"] as const;
export type CEFRLevel = (typeof CEFR_LEVELS)[number];

export type Skill = "VOCABULARY" | "LISTENING" | "READING" | "GRAMMAR" | "SPEAKING";

/** The person who signed up. For a child profile this is the parent/guardian. */
export interface Account {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

/** The learner. One system, three presentation layers selected by `ageGroup`. */
export interface User {
  id: string;
  name: string;
  /** Children have no e-mail of their own; the parent account holds it. */
  email: string | null;
  ageGroup: AgeGroup;
  role: Role;
  age: number | null;
  currentCEFR: CEFRLevel;
  targetCEFR: CEFRLevel;
  xp: number;
  level: number;
  streak: number;
  /** Minutes per day. */
  dailyGoal: number;
  /** Goal / interest ids chosen in onboarding (see data/onboarding). */
  learningGoal: string[];
  /** Skills the learner said feel hardest / most important (teen, adult). */
  focusSkills: string[];
  avatarColor: number;
  createdAt: string;
}
