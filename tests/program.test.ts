import { describe, expect, it } from "vitest";
import { CEFR_PROGRAM, getGrammarTopic } from "@/data/cefr/program";
import { COURSES } from "@/data/curriculum";
import { getTopic } from "@/data/topics";
import { childCourse } from "@/data/curriculum/child";
import { orderingAtACafe as cafe } from "@/data/curriculum/child/a1/food";
import { advance, closeExercise, completeLesson, startLesson } from "@/features/learning";
import { unitsSkippedByPlacement } from "@/features/onboarding/placement";
import { earnedLevel, levelRequirements, levelStates } from "@/features/progress/cefr";
import { currentUnit, nextLesson, unitStates } from "@/features/progress/units";
import { CEFR_LEVELS, isPlayable, lessonWords, type Course, type LessonProgress } from "@/types";

const now = new Date("2026-10-04T12:00:00");
const courses = Object.values(COURSES);

function finished(lesson: typeof cafe): LessonProgress {
  let p = startLesson(lesson, undefined, now);
  for (let i = 0; i < lesson.exercises.length; i++) p = advance(closeExercise(p, lesson, now), lesson);
  return completeLesson(p, lesson, now).progress;
}

describe("CEFR program", () => {
  it("defines words, grammar and can-do for every level", () => {
    for (const level of CEFR_LEVELS) {
      const program = CEFR_PROGRAM[level];
      expect(program.words, level).toBeGreaterThan(0);
      expect(program.grammar.length, level).toBeGreaterThanOrEqual(6);
      expect(program.canDo.length, level).toBeGreaterThanOrEqual(3);
    }
    const ids = Object.values(CEFR_PROGRAM).flatMap((p) => p.grammar.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("folds Pre-A1 into A1 for courses that start at A1", () => {
    expect(levelRequirements(COURSES.CHILD, "A1")).toMatchObject({ words: 400 });
    expect(levelRequirements(COURSES.CHILD, "A1").grammar).toHaveLength(11);
    expect(levelRequirements(COURSES.TEEN, "A1")).toMatchObject({ words: 600 });
    expect(levelRequirements(COURSES.ADULT, "A1").grammar).toHaveLength(17);
  });
});

describe.each(courses)("$id course covers the program", (course: Course) => {
  it("teaches exactly the word target of every level", () => {
    for (const { level } of course.levels) {
      const units = course.units.filter((u) => u.level === level);
      expect(units.reduce((sum, u) => sum + u.words, 0), `${course.id} ${level}`).toBe(levelRequirements(course, level).words);
    }
    const total = course.units.reduce((sum, u) => sum + u.words, 0);
    expect(total).toBe(CEFR_LEVELS.reduce((sum, l) => sum + CEFR_PROGRAM[l].words, 0));
  });

  it("splits each unit's words between its lessons without losing any", () => {
    for (const unit of course.units) {
      expect(unit.lessons.reduce((sum, l) => sum + lessonWords(l), 0), unit.id).toBe(unit.words);
      expect(unit.lessons.length, unit.id).toBeGreaterThanOrEqual(6);
    }
  });

  it("teaches every grammar topic of a level in that level, and no other", () => {
    for (const { level } of course.levels) {
      const required = levelRequirements(course, level).grammar.map((t) => t.id).sort();
      const taught = course.units.filter((u) => u.level === level).flatMap((u) => u.grammar);
      for (const id of taught) expect(getGrammarTopic(id), `${course.id}: unknown topic ${id}`).toBeDefined();
      expect([...new Set(taught)].sort(), `${course.id} ${level}`).toEqual(required);
    }
  });

  it("links units only to topics that exist in the word bank", () => {
    for (const unit of course.units) if (unit.topic) expect(getTopic(unit.topic), `${unit.id} → ${unit.topic}`).toBeDefined();
    expect(course.units.filter((u) => u.topic).length).toBeGreaterThan(5);
  });

  it("numbers units and steps continuously", () => {
    expect(course.units.map((u) => u.order)).toEqual(course.units.map((_, i) => i + 1));
    const levelOrder = course.units.map((u) => CEFR_LEVELS.indexOf(u.level));
    expect(levelOrder).toEqual([...levelOrder].sort((a, b) => a - b));
    for (const unit of course.units) {
      expect(unit.lessons.map((l) => l.order), unit.id).toEqual(unit.lessons.map((_, i) => i + 1));
      for (const lesson of unit.lessons.filter(isPlayable)) expect(lesson.unitId).toBe(unit.id);
    }
    const ids = course.units.flatMap((u) => u.lessons.map((l) => l.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("level progress", () => {
  const skipped = unitsSkippedByPlacement(childCourse, "A1");

  it("one finished lesson moves the counters, not the level", () => {
    const before = levelStates(childCourse, unitStates(childCourse, {}, skipped));
    expect(before.map((l) => l.status)).toEqual(["PASSED_BY_TEST", "CURRENT", "AHEAD", "AHEAD", "AHEAD"]);
    expect(before[1]).toMatchObject({ words: { learned: 0, target: 400 }, missions: { done: 0, total: 50 }, percent: 0, grammarDone: 0 });

    const units = unitStates(childCourse, { [cafe.id]: finished(cafe) }, skipped);
    const food = units.find((u) => u.unit.id === "child.food-town")!;
    expect(food).toMatchObject({ status: "IN_PROGRESS", awaitingContent: true, completedLessons: 1, totalLessons: 10, percent: 10 });
    expect(food.words).toEqual({ learned: cafe.vocabulary.length, target: 80 });

    const after = levelStates(childCourse, units);
    expect(after[1]).toMatchObject({ status: "CURRENT", words: { learned: cafe.vocabulary.length, target: 400 }, missions: { done: 1, total: 50 }, percent: 2, grammarDone: 0 });
    expect(after[1].grammar.find((g) => g.topic.id === "a1.would-like")?.status).toBe("IN_PROGRESS");
    expect(earnedLevel(after, "A1")).toBe("A1");
  });

  it("counts levels passed in the placement test as fully learned", () => {
    const levels = levelStates(childCourse, unitStates(childCourse, {}, skipped));
    expect(levels[0]).toMatchObject({ status: "PASSED_BY_TEST", words: { learned: 200, target: 200 }, percent: 100, grammarDone: 6 });
  });

  it("moves to the next level only when every unit of the level is complete", () => {
    const done = unitStates(childCourse, {}, unitsSkippedByPlacement(childCourse, "A1")).map((u) =>
      u.unit.level === "A1" ? { ...u, status: "COMPLETED" as const, completedLessons: u.totalLessons, words: { learned: u.words.target, target: u.words.target } } : u,
    );
    const levels = levelStates(childCourse, done);
    expect(levels[1]).toMatchObject({ status: "COMPLETED", percent: 100, grammarDone: 11, words: { learned: 400, target: 400 } });
    expect(levels[2].status).toBe("CURRENT");
    expect(earnedLevel(levels, "A1")).toBe("A2");

    const almost = done.map((u) => (u.unit.id === "child.city" ? { ...u, status: "IN_PROGRESS" as const, completedLessons: u.totalLessons - 1 } : u));
    expect(earnedLevel(levelStates(childCourse, almost), "A1")).toBe("A1");
  });

  it("never lowers the level set by the placement test", () => {
    const levels = levelStates(childCourse, unitStates(childCourse, {}, []));
    expect(levels[0].status).toBe("CURRENT");
    expect(earnedLevel(levels, "A2")).toBe("A2");
  });
});

describe("path through the course", () => {
  it.each(courses)("$id: every placement level leads to a lesson that can be played", (course: Course) => {
    for (const level of CEFR_LEVELS) {
      const units = unitStates(course, {}, unitsSkippedByPlacement(course, level));
      expect(nextLesson(units), `${course.id} ${level}`).not.toBeNull();
      expect(currentUnit(units)?.unit.id).toBe(nextLesson(units)?.unit.unit.id);
    }
  });

  it("after the last written lesson the learner stays in that world, which is not finished", () => {
    const skipped = unitsSkippedByPlacement(childCourse, "A1");
    const units = unitStates(childCourse, { [cafe.id]: finished(cafe) }, skipped);
    expect(nextLesson(units)).toBeNull();
    expect(currentUnit(units)?.unit.id).toBe("child.food-town");
    expect(units.find((u) => u.unit.id === "child.city")).toMatchObject({ status: "AVAILABLE", comingSoon: true });
  });
});
