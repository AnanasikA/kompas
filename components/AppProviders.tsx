"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store/app-store";

/** Loads the saved learner state once, on the client. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const hydrate = useAppStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  return <>{children}</>;
}
