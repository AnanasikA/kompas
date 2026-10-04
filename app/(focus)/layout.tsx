import { LearnerGate } from "@/features/auth/LearnerGate";

/** Full-screen flows without navigation: lessons, practice sessions, parent panel. */
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return <LearnerGate>{children}</LearnerGate>;
}
