"use client";

import { useAppStore } from "@/lib/store/app-store";
import { AdultOnboarding } from "./AdultOnboarding";
import { ChildOnboarding } from "./ChildOnboarding";
import { OnboardingGate } from "./OnboardingGate";
import { TeenOnboarding } from "./TeenOnboarding";

/** One route, three presentation layers: the age group picks the screens. */
export function OnboardingStep({ step }: { step: string }) {
  const ageGroup = useAppStore((s) => s.onboarding.ageGroup);
  return (
    <OnboardingGate step={step}>
      {ageGroup === "TEEN" ? <TeenOnboarding step={step} /> : ageGroup === "ADULT" ? <AdultOnboarding step={step} /> : <ChildOnboarding step={step} />}
    </OnboardingGate>
  );
}
