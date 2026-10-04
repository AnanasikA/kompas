"use client";

import { useAge } from "@/features/theme/AgeScope";
import { AdultShell } from "./AdultShell";
import { ChildShell } from "./ChildShell";
import { TeenShell } from "./TeenShell";

export function AppShell({ children }: { children: React.ReactNode }) {
  const age = useAge();
  if (age === "TEEN") return <TeenShell>{children}</TeenShell>;
  if (age === "ADULT") return <AdultShell>{children}</AdultShell>;
  return <ChildShell>{children}</ChildShell>;
}

/** Picks the screen for the learner's age group. Same route, three presentation layers. */
export function ByAge({ child, teen, adult }: { child: React.ReactNode; teen: React.ReactNode; adult: React.ReactNode }) {
  const age = useAge();
  return <>{age === "TEEN" ? teen : age === "ADULT" ? adult : child}</>;
}
