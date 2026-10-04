import type { AgeGroup } from "@/types";

/** Steps after "Who is learning?", per presentation layer (as in the prototype). */
export const ONBOARDING_FLOWS: Record<AgeGroup, string[]> = {
  CHILD: ["profile", "interests", "level", "placement", "result"],
  TEEN: ["profile", "goals", "placement", "result"],
  ADULT: ["goals", "focus", "placement", "result"],
};

export function stepPath(step: string): string {
  return `/onboarding/${step}`;
}

export function firstStep(age: AgeGroup): string {
  return stepPath(ONBOARDING_FLOWS[age][0]);
}

export function nextStep(age: AgeGroup, step: string): string {
  const flow = ONBOARDING_FLOWS[age];
  return stepPath(flow[Math.min(flow.indexOf(step) + 1, flow.length - 1)]);
}

export function previousStep(age: AgeGroup, step: string): string {
  const flow = ONBOARDING_FLOWS[age];
  const index = flow.indexOf(step);
  return index <= 0 ? "/onboarding" : stepPath(flow[index - 1]);
}

export function nameFromEmail(email: string): string {
  const first = email.split("@")[0].split(/[._\-+0-9]/)[0] || "Learner";
  return first.charAt(0).toUpperCase() + first.slice(1);
}
