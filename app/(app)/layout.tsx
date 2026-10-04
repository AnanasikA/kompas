import { LearnerGate } from "@/features/auth/LearnerGate";
import { AppShell } from "@/features/theme/shells/AppShell";

/** Screens with navigation: home, journey, practice, progress, settings. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LearnerGate>
      <AppShell>{children}</AppShell>
    </LearnerGate>
  );
}
