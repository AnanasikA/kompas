import { describe, expect, it } from "vitest";
import { childCourse } from "@/data/curriculum/child";
import { orderingAtACafe as lesson } from "@/data/curriculum/child/a1/food";
import { COURSES } from "@/data/curriculum";
import { PLACEMENT_TESTS } from "@/data/placement";
import {
  ScriptedResponder,
  advance,
  closeExercise,
  completeLesson,
  createDialogueState,
  evaluateChoice,
  evaluateMatch,
  evaluateSentence,
  evaluateSpeech,
  lessonMaxXp,
  longestPath,
  registerMistake,
  resume,
  startLesson,
} from "@/features/learning";
import { computeStreak, bumpActivity, dailyGoal } from "@/features/gamification/activity";
import { levelInfo } from "@/features/gamification/levels";
import { scorePlacement, unitsSkippedByPlacement } from "@/features/onboarding/placement";
import { dueItems, recordMistakes, simpleScheduler } from "@/features/practice/review";
import { nextLesson, unitStates } from "@/features/progress/units";
import { isPlayable } from "@/types";
import type { DialogueExercise, Exercise, LessonProgress } from "@/types";

const now = new Date("2026-10-03T18:00:00");
const byId = <T extends Exercise>(id: string) => lesson.exercises.find((e) => e.id === id) as T;

describe("content integrity", () => {
  for (const course of Object.values(COURSES)) {
    it(`${course.id}: every exercise and option points at a real concept`, () => {
      for (const unit of course.units) {
        for (const l of unit.lessons.filter(isPlayable)) {
          for (const e of l.exercises) {
            expect(course.concepts[e.conceptId], `${e.id} → ${e.conceptId}`).toBeDefined();
            if ("options" in e) {
              expect(e.options.some((o) => o.id === e.correctOptionId), `${e.id} has its correct option`).toBe(true);
              for (const o of e.options) if (o.conceptId) expect(course.concepts[o.conceptId]).toBeDefined();
            }
            if (e.type === "MATCHING") for (const p of e.pairs) expect(course.concepts[p.id], p.id).toBeDefined();
            if (e.type === "SENTENCE_BUILDER") {
              for (const s of e.solutions) {
                const pool = [...e.tokens];
                for (const word of s.split(" ")) {
                  const at = pool.indexOf(word);
                  expect(at, `${e.id}: "${word}" is in the word bank`).toBeGreaterThan(-1);
                  pool.splice(at, 1);
                }
              }
            }
            if (e.type === "DIALOGUE") {
              const nodes = e.script.nodes;
              expect(nodes[e.script.startNodeId]).toBeDefined();
              for (const node of Object.values(nodes)) {
                if (!node.end) expect(node.options.some((o) => o.next), `${node.id} can move on`).toBe(true);
                for (const o of node.options) {
                  if (o.next) expect(nodes[o.next], `${node.id} → ${o.next}`).toBeDefined();
                  else expect(o.hint, `${node.id}: dead-end option explains itself`).toBeTruthy();
                  if (o.conceptId) expect(course.concepts[o.conceptId]).toBeDefined();
                }
              }
            }
          }
        }
      }
      for (const c of Object.values(course.concepts)) {
        const p = c.practice;
        if ("options" in p) expect(p.options.some((o) => o.id === p.correctOptionId), c.id).toBe(true);
      }
    });
  }

  it("the café lesson is worth 120 XP and has 7 exercises", () => {
    expect(lesson.exercises).toHaveLength(7);
    expect(lessonMaxXp(lesson)).toBe(120);
  });
});

describe("answer checking", () => {
  it("accepts the right picture and explains a wrong one", () => {
    const listening = byId<Extract<Exercise, { type: "LISTENING" }>>("cafe.listening");
    expect(evaluateChoice(listening, "juice").correct).toBe(true);
    expect(evaluateChoice(listening, "coffee")).toMatchObject({ correct: false, conceptId: "child.c.orange-juice" });
  });

  it("checks sentence order and points at the distractor", () => {
    const sb = byId<Extract<Exercise, { type: "SENTENCE_BUILDER" }>>("cafe.sentence-builder");
    expect(evaluateSentence(sb, ["I'd", "like", "a", "hot", "chocolate,", "please."]).correct).toBe(true);
    expect(evaluateSentence(sb, ["I'd", "like", "hot", "a", "chocolate,", "please."]).correct).toBe(false);
    expect(evaluateSentence(sb, ["I'd", "want", "a", "hot", "chocolate,", "please."]).hint).toContain("I want");
  });

  it("sends both confused words to review", () => {
    const m = byId<Extract<Exercise, { type: "MATCHING" }>>("cafe.vocabulary");
    expect(evaluateMatch(m, "child.w.menu", "child.w.menu").correct).toBe(true);
    expect(evaluateMatch(m, "child.w.menu", "child.w.bill").conceptIds).toEqual(["child.w.menu", "child.w.bill"]);
  });

  it("compares a transcript word by word", () => {
    const sp = byId<Extract<Exercise, { type: "SPEAKING" }>>("cafe.speaking");
    const ok = evaluateSpeech(sp, ["can I have a croissant please"]);
    expect(ok.correct).toBe(true);
    expect(ok.ratio).toBe(1);
    const partial = evaluateSpeech(sp, ["can I have a cross on please"]);
    expect(partial.words.find((w) => w.word === "croissant,")?.heard).toBe(false);
    expect(partial.correct).toBe(true);
    expect(evaluateSpeech(sp, ["hello"]).correct).toBe(false);
  });
});

describe("dialogue engine", () => {
  const dialogue = byId<DialogueExercise>("cafe.dialogue");
  const responder = new ScriptedResponder(dialogue.script);

  it("gives a hint without moving on, then follows the branch", async () => {
    let state = createDialogueState(dialogue.script);
    const options = responder.options(state);
    const wrong = await responder.respond(state, options[1]);
    expect(wrong.kind).toBe("hint");
    expect(wrong.state.nodeId).toBe("order");
    const right = await responder.respond(wrong.state, options[0]);
    expect(right.kind).toBe("advance");
    state = right.state;
    expect(state.nodeId).toBe("size");
    expect(state.turns.at(-1)?.text).toBe("Sure! Small or large?");
  });

  it("charges the right price for each branch", async () => {
    const walk = async (picks: number[]) => {
      let state = createDialogueState(dialogue.script);
      for (const pick of picks) {
        const reply = await responder.respond(state, responder.options(state)[pick]);
        state = reply.state;
      }
      return state;
    };
    expect((await walk([0, 0, 0, 1])).turns.at(-1)?.text).toContain("three pounds twenty");
    expect((await walk([0, 0, 1, 0])).turns.at(-1)?.text).toContain("four pounds seventy");
    const end = await walk([0, 0, 0, 0, 1, 0]);
    expect(end.ended).toBe(true);
    expect(longestPath(dialogue.script)).toBe(6);
  });
});

describe("lesson session", () => {
  function run(mistakeOn: string[] = []): LessonProgress {
    let p = startLesson(lesson, undefined, now);
    for (const e of lesson.exercises) {
      if (mistakeOn.includes(e.id)) p = registerMistake(p, [e.conceptId]);
      p = closeExercise(p, lesson, now);
      p = advance(p, lesson);
    }
    return p;
  }

  it("gives full XP for a clean run and 100% accuracy", () => {
    const done = completeLesson(run(), lesson, now);
    expect(done.progress.xpEarned).toBe(120);
    expect(done.progress.accuracy).toBe(100);
    expect(done.xpAwarded).toBe(120);
    expect(done.progress.lessonCompleted).toBe(true);
  });

  it("halves XP for an exercise with a mistake", () => {
    const done = completeLesson(run(["cafe.dialogue"]), lesson, now);
    expect(done.progress.xpEarned).toBe(105);
    expect(done.progress.accuracy).toBe(86);
    expect(done.progress.exerciseResults.at(-1)?.conceptsMissed).toEqual(["child.c.id-like"]);
  });

  it("only pays out an improvement on replay", () => {
    const first = completeLesson(run(["cafe.dialogue"]), lesson, now).progress;
    let replay = startLesson(lesson, first, now);
    for (let i = 0; i < lesson.exercises.length; i++) replay = advance(closeExercise(replay, lesson, now), lesson);
    const second = completeLesson(replay, lesson, now);
    expect(second.xpAwarded).toBe(15);
    expect(second.progress.completions).toBe(2);
  });

  it("resumes after a refresh on the next unsolved exercise", () => {
    let p = startLesson(lesson, undefined, now);
    p = closeExercise(p, lesson, now);
    expect(resume(p, lesson).currentIndex).toBe(1);
    expect(resume(resume(p, lesson), lesson).currentIndex).toBe(1);
  });
});

describe("journey", () => {
  const skipped = unitsSkippedByPlacement(childCourse, "A1");

  it("placement at A1 skips the Pre-A1 worlds", () => {
    expect(skipped).toEqual(["child.hello-world", "child.home"]);
  });

  it("never places a learner past the last unit that has lessons", () => {
    // B1 has no published lessons yet, so a B1 learner starts in Food Town instead of on an empty path.
    const forB1 = unitsSkippedByPlacement(childCourse, "B1");
    expect(forB1).toEqual(["child.hello-world", "child.home", "child.school"]);
    expect(unitStates(childCourse, {}, forB1).find((s) => s.unit.id === "child.food-town")?.status).toBe("AVAILABLE");
    expect(nextLesson(unitStates(childCourse, {}, forB1))?.lesson.lesson.id).toBe(lesson.id);
    for (const course of Object.values(COURSES)) {
      for (const level of ["Pre-A1", "A1", "A2", "B1", "B2"] as const) {
        expect(nextLesson(unitStates(course, {}, unitsSkippedByPlacement(course, level))), `${course.id} ${level}`).not.toBeNull();
      }
    }
  });

  it("locks City while Food Town has a lesson to play", () => {
    const before = unitStates(childCourse, {}, skipped);
    const food = before.find((s) => s.unit.id === "child.food-town")!;
    const city = before.find((s) => s.unit.id === "child.city")!;
    expect(food.status).toBe("AVAILABLE");
    expect(city.status).toBe("LOCKED");
    expect(city.blockedBy?.id).toBe("child.food-town");
    expect(nextLesson(before)?.lesson.lesson.id).toBe(lesson.id);

    let p = startLesson(lesson, undefined, now);
    p = advance(closeExercise(p, lesson, now), lesson);
    const during = unitStates(childCourse, { [lesson.id]: p }, skipped);
    // One exercise out of seven in one lesson out of ten.
    expect(during.find((s) => s.unit.id === "child.food-town")).toMatchObject({ status: "IN_PROGRESS", percent: 1 });

    for (let i = 1; i < lesson.exercises.length; i++) p = advance(closeExercise(p, lesson, now), lesson);
    const after = unitStates(childCourse, { [lesson.id]: completeLesson(p, lesson, now).progress }, skipped);
    // The world has ten missions: finishing the one that is written does not finish the world.
    expect(after.find((s) => s.unit.id === "child.food-town")).toMatchObject({ status: "IN_PROGRESS", awaitingContent: true, percent: 10 });
    expect(after.find((s) => s.unit.id === "child.city")).toMatchObject({ status: "AVAILABLE", comingSoon: true });
  });
});

describe("review", () => {
  const concept = childCourse.concepts["child.c.id-like"];

  it("creates an item on the first mistake and marks repeats as weak", () => {
    let reviews = recordMistakes([], [concept], lesson, now);
    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toMatchObject({ concept: "I like ≠ I'd like", mistakes: 1, status: "new", sourceLesson: lesson.id });
    reviews = recordMistakes(reviews, [concept], lesson, now);
    expect(reviews[0]).toMatchObject({ mistakes: 2, status: "weak" });
    expect(dueItems(reviews, now)).toHaveLength(1);
  });

  it("moves new → learning → mastered and back to weak on a miss", () => {
    const [item] = recordMistakes([], [concept], lesson, now);
    const learning = simpleScheduler.onReview(item, true, now);
    expect(learning.status).toBe("learning");
    expect(dueItems([learning], now)).toHaveLength(0);
    const mastered = simpleScheduler.onReview(learning, true, now);
    expect(mastered.status).toBe("mastered");
    expect(simpleScheduler.onReview(mastered, false, now)).toMatchObject({ status: "weak", streak: 0 });
  });
});

describe("gamification", () => {
  it("levels up after the first lesson", () => {
    expect(levelInfo(0)).toMatchObject({ level: 1, into: 0, needed: 100 });
    expect(levelInfo(120)).toMatchObject({ level: 2, into: 20, needed: 200 });
  });

  it("counts a streak across days", () => {
    let activity = bumpActivity({}, new Date("2026-10-01T10:00:00"), { seconds: 120 });
    activity = bumpActivity(activity, new Date("2026-10-02T10:00:00"), { seconds: 60 });
    expect(computeStreak(activity, new Date("2026-10-03T08:00:00"))).toBe(2);
    activity = bumpActivity(activity, now, { seconds: 300 });
    expect(computeStreak(activity, now)).toBe(3);
    expect(dailyGoal(activity, now, 10)).toMatchObject({ minutesDone: 5, minutesLeft: 5, percent: 50 });
  });
});

describe("placement", () => {
  it("maps the score to a level", () => {
    const test = PLACEMENT_TESTS.CHILD;
    const answers = test.questions.map((q, i) => ({ questionId: q.id, skill: q.skill, correct: i < 3 }));
    expect(scorePlacement(test, answers, now)).toMatchObject({ score: 3, total: 5, level: "A1" });
    expect(scorePlacement(test, [], now).level).toBe("Pre-A1");
  });
});
