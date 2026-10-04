"use client";

import { createContext, useContext } from "react";
import type { AgeGroup } from "@/types";
import { cx } from "@/lib/utils";

const AgeContext = createContext<AgeGroup>("CHILD");

/** The learner's age group for everything rendered inside an <AgeScope>. */
export function useAge(): AgeGroup {
  return useContext(AgeContext);
}

/**
 * Presentation-layer boundary. Sets `data-age`, which switches the semantic
 * CSS tokens and enables the `child:` / `teen:` / `adult:` Tailwind variants.
 */
export function AgeScope({ age, children, className }: { age: AgeGroup; children: React.ReactNode; className?: string }) {
  return (
    <AgeContext.Provider value={age}>
      <div data-age={age} className={cx("min-h-dvh", className)}>
        {children}
      </div>
    </AgeContext.Provider>
  );
}
