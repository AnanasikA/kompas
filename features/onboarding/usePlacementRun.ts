"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PLACEMENT_TESTS } from "@/data/placement";
import { useAppStore } from "@/lib/store/app-store";
import type { AgeGroup } from "@/types";
import { stepPath } from "./flow";

/**
 * Drives the placement test for any age mode: current question, selection,
 * moving on, and finishing onboarding after the last question.
 */
export function usePlacementRun(age: AgeGroup) {
  const router = useRouter();
  const test = PLACEMENT_TESTS[age];
  const run = useAppStore((s) => s.onboarding.placement);
  const startPlacement = useAppStore((s) => s.startPlacement);
  const answerPlacement = useAppStore((s) => s.answerPlacement);
  const finishOnboarding = useAppStore((s) => s.finishOnboarding);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    if (!run) startPlacement();
  }, [run, startPlacement]);

  const index = Math.min(run?.index ?? 0, test.questions.length - 1);
  const question = test.questions[index];

  function submit(optionIndex: number | null) {
    answerPlacement(optionIndex);
    setPicked(null);
    if (index >= test.questions.length - 1) {
      finishOnboarding({ skipTest: false });
      router.push(stepPath("result"));
    }
  }

  return {
    test,
    question,
    index,
    total: test.questions.length,
    answers: run?.answers ?? [],
    picked,
    pick: setPicked,
    next: () => picked != null && submit(picked),
    skip: () => submit(null),
  };
}
