import { OnboardingStep } from "@/features/onboarding/OnboardingStep";

export default async function OnboardingStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  return <OnboardingStep step={step} />;
}
