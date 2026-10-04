import type { AgeGroup, CEFRLevel } from "@/types";

/**
 * XP → level. Level n needs n × 100 XP to reach n + 1
 * (100, 200, 300 …), so the first lesson is enough for the first level-up.
 */
export function xpToNext(level: number): number {
  return level * 100;
}

export interface LevelInfo {
  level: number;
  /** XP collected inside the current level. */
  into: number;
  /** XP needed to finish the current level. */
  needed: number;
  percent: number;
}

export function levelInfo(xp: number): LevelInfo {
  let level = 1;
  let rest = Math.max(0, xp);
  while (rest >= xpToNext(level)) {
    rest -= xpToNext(level);
    level += 1;
  }
  const needed = xpToNext(level);
  return { level, into: rest, needed, percent: Math.round((rest / needed) * 100) };
}

const RANKS: Record<AgeGroup, Partial<Record<CEFRLevel, string>>> = {
  CHILD: { "Pre-A1": "Pre-A1 Explorer", A1: "A1 Explorer", A2: "A2 Explorer", B1: "B1 Explorer", B2: "B2 Explorer" },
  TEEN: { "Pre-A1": "A1 Rookie", A1: "A1 Rookie", A2: "A2 Voyager", B1: "B1 Explorer", B2: "B2 Navigator" },
  ADULT: { "Pre-A1": "A1 · Beginner", A1: "A1 · Beginner", A2: "A2 · Elementary", B1: "B1 · Intermediate", B2: "B2 · Upper-intermediate" },
};

/** Age-appropriate name for a CEFR level ("A1 Explorer", "A2 Voyager", "A2 · Elementary"). */
export function rankTitle(ageGroup: AgeGroup, level: CEFRLevel): string {
  return RANKS[ageGroup][level] ?? level;
}
