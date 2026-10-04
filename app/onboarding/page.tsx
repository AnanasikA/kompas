import type { Metadata } from "next";
import { OnboardingGate } from "@/features/onboarding/OnboardingGate";
import { WhoScreen } from "@/features/onboarding/WhoScreen";

export const metadata: Metadata = { title: "Kto będzie się uczyć? — Kompas" };

export default function OnboardingStartPage() {
  return (
    <OnboardingGate step={null}>
      <WhoScreen />
    </OnboardingGate>
  );
}
