import { CEFR_LEVELS, type CEFRLevel, type Course, type Unit } from "@/types";
import { CEFR_PROGRAM, type GrammarTopic } from "@/data/cefr/program";
import { cefrIndex } from "@/lib/utils";
import type { UnitState } from "./units";

/**
 * CEFR LEVEL PROGRESS
 *
 * A level is a fixed amount of language: a number of words, a list of grammar
 * topics, a set of "I can…" skills (data/cefr/program.ts). A learner finishes
 * a level only when every unit of that level is finished, which means all of
 * its words and grammar. One completed lesson moves the counters, never the
 * level.
 */

export interface LevelRequirements {
  level: CEFRLevel;
  words: number;
  grammar: GrammarTopic[];
  canDo: string[];
}

/**
 * What a course level has to teach. A course that starts above Pre-A1
 * (teen, adult) folds the earlier program levels into its first level.
 */
export function levelRequirements(course: Course, level: CEFRLevel): LevelRequirements {
  const courseLevels = course.levels.map((l) => l.level);
  const position = courseLevels.indexOf(level);
  const from = position <= 0 ? 0 : cefrIndex(courseLevels[position - 1]) + 1;
  const covered = CEFR_LEVELS.slice(from, cefrIndex(level) + 1).map((l) => CEFR_PROGRAM[l]);
  return {
    level,
    words: covered.reduce((sum, p) => sum + p.words, 0),
    grammar: covered.flatMap((p) => p.grammar),
    canDo: CEFR_PROGRAM[level].canDo,
  };
}

export type LevelStatus = "PASSED_BY_TEST" | "COMPLETED" | "CURRENT" | "AHEAD";
export type GrammarStatus = "DONE" | "IN_PROGRESS" | "TODO";

export interface GrammarState {
  topic: GrammarTopic;
  status: GrammarStatus;
  /** Units of this level that teach the topic. */
  units: Unit[];
}

export interface LevelState {
  level: CEFRLevel;
  title: string;
  status: LevelStatus;
  units: UnitState[];
  words: { learned: number; target: number };
  grammar: GrammarState[];
  grammarDone: number;
  missions: { done: number; total: number; published: number };
  /** 0–100, counted in missions. */
  percent: number;
  canDo: string[];
}

export function levelStates(course: Course, units: UnitState[]): LevelState[] {
  let currentFound = false;
  return course.levels.map(({ level, title }) => {
    const own = units.filter((u) => u.unit.level === level);
    const requirements = levelRequirements(course, level);
    const complete = own.length > 0 && own.every((u) => u.status === "COMPLETED");
    const passedByTest = own.length > 0 && own.every((u) => u.skipped);

    let status: LevelStatus;
    if (passedByTest) status = "PASSED_BY_TEST";
    else if (complete) status = "COMPLETED";
    else if (!currentFound) {
      status = "CURRENT";
      currentFound = true;
    } else status = "AHEAD";

    const grammar: GrammarState[] = requirements.grammar.map((topic) => {
      const teaching = own.filter((u) => u.unit.grammar.includes(topic.id));
      const done = teaching.length > 0 && teaching.every((u) => u.status === "COMPLETED");
      const started = teaching.some((u) => u.completedLessons > 0);
      return { topic, status: done ? "DONE" : started ? "IN_PROGRESS" : "TODO", units: teaching.map((u) => u.unit) };
    });

    const total = own.reduce((sum, u) => sum + u.totalLessons, 0);
    const done = own.reduce((sum, u) => sum + u.completedLessons, 0);
    return {
      level,
      title,
      status,
      units: own,
      words: { learned: own.reduce((sum, u) => sum + u.words.learned, 0), target: requirements.words },
      grammar,
      grammarDone: grammar.filter((g) => g.status === "DONE").length,
      missions: { done, total, published: own.reduce((sum, u) => sum + u.publishedLessons, 0) },
      percent: total ? Math.floor((done / total) * 100) : 0,
      canDo: requirements.canDo,
    };
  });
}

/**
 * The learner's CEFR level given their progress: the first level that is not
 * finished. It never drops below the level the placement test set.
 */
export function earnedLevel(levels: LevelState[], placed: CEFRLevel): CEFRLevel {
  const current = levels.find((l) => l.status === "CURRENT" || l.status === "AHEAD") ?? levels[levels.length - 1];
  if (!current) return placed;
  return cefrIndex(current.level) > cefrIndex(placed) ? current.level : placed;
}
