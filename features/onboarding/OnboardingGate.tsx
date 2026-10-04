"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store/app-store";

/**
 * Keeps onboarding routes consistent with the saved state:
 * no account → sign up; onboarding finished → the result screen (which leads home).
 * Finishing the placement test flips `completed`, so this is also what moves the
 * learner from the last question to their result.
 */
export function OnboardingGate({ step, children }: { step: string | null; children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAppStore((s) => s.hydrated);
  const account = useAppStore((s) => s.account);
  const completed = useAppStore((s) => s.onboardingCompleted);
  const ageGroup = useAppStore((s) => s.onboarding.ageGroup);

  const target = !hydrated
    ? null
    : !account
      ? "/auth?mode=signup"
      : completed && step !== "result"
        ? "/onboarding/result"
        : step !== null && !ageGroup
          ? "/onboarding"
          : null;

  useEffect(() => {
    if (target) router.replace(target);
  }, [target, router]);

  if (!hydrated || target) return <div className="min-h-dvh bg-paper" aria-busy="true" />;
  return <>{children}</>;
}
