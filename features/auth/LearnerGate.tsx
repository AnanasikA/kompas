"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AgeScope } from "@/features/theme/AgeScope";
import { useAppStore } from "@/lib/store/app-store";

/**
 * Guards the learning area: waits for the saved state, sends visitors without
 * a profile to the right place, and opens the age-specific presentation layer.
 */
export function LearnerGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAppStore((s) => s.hydrated);
  const account = useAppStore((s) => s.account);
  const user = useAppStore((s) => s.user);

  const target = !hydrated ? null : !account ? "/" : !user ? "/onboarding" : null;

  useEffect(() => {
    if (target) router.replace(target);
  }, [target, router]);

  if (!hydrated || !user) return <div className="min-h-dvh bg-paper" aria-busy="true" />;
  return <AgeScope age={user.ageGroup}>{children}</AgeScope>;
}
