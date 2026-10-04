import type { AppState, OnboardingDraft } from "@/types";
import { STATE_VERSION } from "@/lib/persistence";

export const emptyDraft: OnboardingDraft = {
  who: null,
  ageGroup: null,
  name: "",
  age: null,
  goals: [],
  focus: [],
  selfLevel: null,
  dailyGoal: 10,
  placement: null,
};

export const initialState: AppState = {
  version: STATE_VERSION,
  account: null,
  user: null,
  onboarding: emptyDraft,
  onboardingCompleted: false,
  placement: null,
  lessons: {},
  skippedUnitIds: [],
  reviews: [],
  activity: {},
  practice: null,
  wordStats: {},
  round: null,
  pendingReward: null,
};
