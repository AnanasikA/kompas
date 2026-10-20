import { describe, expect, it } from "vitest";
import { COURSES } from "@/data/curriculum";
import { childCourse } from "@/data/curriculum/child";
import { helloWorld } from "@/data/curriculum/child/pre-a1/hello-world";
import { home } from "@/data/curriculum/child/pre-a1/home";
import { longestPath } from "@/features/learning/dialogue/engine";
import { judgeTurn } from "@/features/learning/engine/conversation";
import { isLineIcon } from "@/components/ui/LineIcon";
import { isPlayable, type Course, type Exercise, type Lesson } from "@/types";

/**
 * CONTENT CHECKS
 * Catch writing mistakes before a learner does: answers that cannot be built,
 * scenes that never end, mistakes that would be recorded under a concept
 * that does not exist.
 */

function lessons(course: Course): Lesson[] {
  return course.units.flatMap((u) => u.lessons.filter(isPlayable));
}

/** Every concept id an exercise can record a mistake under. */
function conceptIds(e: Exercise): string[] {
  const ids = [e.conceptId];
  if ("options" in e && Array.isArray(e.options)) ids.push(...e.options.flatMap((o) => (o.conceptId ? [o.conceptId] : [])));
  if (e.type === "MATCHING") ids.push(...e.pairs.map((p) => p.id));
  if (e.type === "DIALOGUE") ids.push(...Object.values(e.script.nodes).flatMap((n) => n.options.flatMap((o) => (o.conceptId ? [o.conceptId] : []))));
  if (e.type === "CONVERSATION") ids.push(...Object.values(e.turns).map((t) => t.conceptId));
  return ids;
}

function problems(e: Exercise): string[] {
  const found: string[] = [];
  switch (e.type) {
    case "MULTIPLE_CHOICE":
    case "IMAGE_CHOICE":
    case "LISTENING":
    case "FILL_GAP": {
      const ids = e.options.map((o) => o.id);
      if (new Set(ids).size !== ids.length) found.push("option ids repeat");
      if (!ids.includes(e.correctOptionId)) found.push("the right answer is not among the options");
      const texts = e.options.map((o) => o.text);
      if (new Set(texts).size !== texts.length) found.push("two options read the same");
      if (e.type === "FILL_GAP" && e.sentence.split("___").length !== 2) found.push("the sentence needs exactly one ___ gap");
      break;
    }
    case "SENTENCE_BUILDER":
      for (const solution of e.solutions) {
        const bank = [...e.tokens];
        for (const token of solution.split(" ")) {
          const at = bank.indexOf(token);
          if (at === -1) found.push(`"${solution}" needs a "${token}" tile`);
          else bank.splice(at, 1);
        }
      }
      break;
    case "MATCHING":
      if (e.pairs.length < 3 || e.pairs.length > 5) found.push("matching needs 3–5 pairs");
      if (new Set(e.pairs.map((p) => p.right)).size !== e.pairs.length) found.push("two pairs have the same translation");
      break;
    case "DIALOGUE": {
      const { nodes, startNodeId } = e.script;
      if (!nodes[startNodeId]) found.push("the start node is missing");
      for (const node of Object.values(nodes)) {
        for (const o of node.options) if (o.next && !nodes[o.next]) found.push(`${node.id} → ${o.next} does not exist`);
        if (!node.end && !node.options.some((o) => o.next)) found.push(`${node.id} has no way forward`);
        if (node.options.some((o) => !o.next && !o.hint)) found.push(`${node.id} has a reply with neither a next step nor a hint`);
      }
      if (nodes[startNodeId] && longestPath(e.script) === 0) found.push("the scene never ends");
      break;
    }
    case "SPEAKING":
      if (!e.target.trim()) found.push("nothing to say");
      break;
    case "STORY":
      if (!e.panels.length) found.push("a story needs pictures");
      for (const p of e.panels) if (!p.lines.length || p.lines.some((l) => !l.en.trim() || !l.pl.trim())) found.push(`${p.id}: every line needs English and Polish`);
      break;
    case "CONVERSATION": {
      if (!e.turns[e.start]) found.push("the first turn is missing");
      let ends = false;
      for (const [id, turn] of Object.entries(e.turns)) {
        for (const a of turn.answers) {
          if (a.next && !e.turns[a.next]) found.push(`${id} → ${a.next} does not exist`);
          if (!a.next) ends = true;
        }
        // The example answer shown to the learner must be accepted, and not caught as a mistake.
        const model = judgeTurn(turn, [turn.model.replaceAll("{name}", "Ola")]);
        if (model.kind !== "answer" || model.answer.says.includes("*")) found.push(`${id}: the example answer "${turn.model}" is not accepted`);
        // The sentence starter must lead to an accepted answer.
        if (!turn.frame.includes("___")) found.push(`${id}: the sentence starter needs a ___ gap`);
      }
      if (!ends) found.push("the conversation never ends");
      break;
    }
    case "REAL_TASK":
      if (!e.steps.length || !e.phrases.length) found.push("a real-life mission needs steps and phrases");
      break;
  }
  return found;
}

describe.each(Object.values(COURSES))("$id course content", (course) => {
  it("every written lesson and exercise has a unique id", () => {
    const lessonIds = lessons(course).map((l) => l.id);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
    const exerciseIds = lessons(course).flatMap((l) => l.exercises.map((e) => e.id));
    expect(exerciseIds.filter((id, i) => exerciseIds.indexOf(id) !== i)).toEqual([]);
  });

  it("every mistake is recorded under a concept that exists", () => {
    const missing = lessons(course).flatMap((l) => l.exercises.flatMap((e) => conceptIds(e).filter((id) => !course.concepts[id]).map((id) => `${e.id}: ${id}`)));
    expect(missing).toEqual([]);
  });

  it("every exercise can be solved", () => {
    const broken = lessons(course).flatMap((l) => l.exercises.flatMap((e) => problems(e).map((p) => `${e.id}: ${p}`)));
    expect(broken).toEqual([]);
  });

  it("every picture can be drawn", () => {
    const images = lessons(course).flatMap((l) => l.exercises.flatMap((e) => ("options" in e ? e.options.flatMap((o) => ("image" in o && o.image ? [o.image as string] : [])) : [])));
    const missing = images.filter((id) => !/^(colour|count)-/.test(id) && !isLineIcon(id.replace(/^(face|time|home)-/, "")));
    expect(missing).toEqual([]);
  });

  it("every concept's practice check can be solved", () => {
    const broken = Object.values(course.concepts).flatMap((c) => problems(c.practice).map((p) => `${c.id}: ${p}`));
    expect(broken).toEqual([]);
  });
});

describe.each([
  { world: helloWorld, place: 0 },
  { world: home, place: 1 },
])("$world.title (child · Pre-A1)", ({ world, place }) => {
  const steps = world.lessons;

  it("is written in full: 10 missions, a review and a challenge", () => {
    expect(steps).toHaveLength(12);
    expect(steps.every(isPlayable)).toBe(true);
    expect(steps.map((l) => l.kind ?? "LESSON")).toEqual([...Array(10).fill("LESSON"), "REVIEW", "CHECKPOINT"]);
    expect(steps.map((l) => l.order)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
  });

  it("teaches exactly its 100 words, 10 per mission, none twice", () => {
    const written = steps.filter(isPlayable);
    expect(written.slice(0, 10).map((l) => l.vocabulary.length)).toEqual(Array(10).fill(10));
    expect(written.slice(10).every((l) => l.vocabulary.length === 0)).toBe(true);
    const terms = written.flatMap((l) => l.vocabulary.map((v) => v.term.toLowerCase()));
    expect(terms).toHaveLength(world.words);
    expect(terms.filter((t, i) => terms.indexOf(t) !== i)).toEqual([]);
  });

  it("every mission is either a story mission or a full practice mission", () => {
    for (const lesson of steps.filter(isPlayable).slice(0, 10)) {
      const types = lesson.exercises.map((e) => e.type);
      if (types.includes("STORY")) {
        // New format: watch the story, talk, then do it for real.
        expect(types, lesson.title).toEqual(["STORY", "CONVERSATION", "REAL_TASK"]);
      } else {
        for (const type of ["MATCHING", "LISTENING", "SENTENCE_BUILDER", "SPEAKING", "DIALOGUE"] as const) expect(types.includes(type), `${lesson.title}: ${type}`).toBe(true);
      }
    }
  });

  it("has its place on the child path", () => {
    expect(childCourse.units[place].id).toBe(world.id);
    expect(childCourse.units[place].order).toBe(place + 1);
  });
});

it("Pre-A1 worlds do not teach the same word twice", () => {
  const terms = [helloWorld, home].flatMap((w) => w.lessons.filter(isPlayable).flatMap((l) => l.vocabulary.map((v) => v.term.toLowerCase())));
  expect(terms.filter((t, i) => terms.indexOf(t) !== i)).toEqual([]);
});
