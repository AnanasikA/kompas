import { describe, expect, it } from "vitest";
import { TOPICS, getTopic } from "@/data/topics";
import { MIN_POOL, ROUND_BONUS_XP, buildRound, finishRound, isMastered, isTopicOpen, pickWords, seededRandom, topicProgress, topicStartLevel, wordsForLevel, type WordStats } from "@/features/practice/rounds";
import { CEFR_LEVELS, type TopicRound } from "@/types";

const now = new Date("2026-10-04T12:00:00");
const food = getTopic("food")!;

function play(steps: TopicRound["steps"], missed: string[] = []): TopicRound {
  return {
    topicId: "food",
    level: "A1",
    steps,
    index: steps.length,
    results: steps.map((s) => ({ correct: !s.wordIds.some((id) => missed.includes(id)), missed: s.wordIds.filter((id) => missed.includes(id)) })),
    startedAt: now.toISOString(),
    summary: null,
  };
}

describe("topic word bank", () => {
  it("has unique words and translations inside every topic", () => {
    const ids = TOPICS.flatMap((t) => t.words.map((w) => w.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const topic of TOPICS) {
      const terms = topic.words.map((w) => w.term.toLowerCase());
      const translations = topic.words.map((w) => w.translation.toLowerCase());
      expect(terms.filter((x, i) => terms.indexOf(x) !== i), `${topic.id} terms`).toEqual([]);
      expect(translations.filter((x, i) => translations.indexOf(x) !== i), `${topic.id} translations`).toEqual([]);
    }
  });

  it("gives every topic enough words at each level from its first one", () => {
    for (const topic of TOPICS) {
      const start = topicStartLevel(topic);
      for (const level of CEFR_LEVELS.slice(CEFR_LEVELS.indexOf(start))) {
        expect(isTopicOpen(topic, level), `${topic.id} ${level}`).toBe(true);
        expect(wordsForLevel(topic, level).filter((w) => w.level === level).length, `${topic.id} ${level}`).toBeGreaterThanOrEqual(MIN_POOL);
      }
    }
  });
});

describe("round generator", () => {
  it.each(TOPICS)("$id: builds a valid round at every playable level", (topic) => {
    for (const level of CEFR_LEVELS.filter((l) => isTopicOpen(topic, l))) {
      const steps = buildRound(topic, level, {}, { seed: 7, language: "pl", audio: true });
      expect(steps).toHaveLength(8);
      for (const { exercise, wordIds } of steps) {
        expect(wordIds.length).toBeGreaterThan(0);
        if (exercise.type === "MATCHING") {
          expect(exercise.pairs).toHaveLength(4);
          expect(exercise.pairs.map((p) => p.id)).toEqual(wordIds);
        } else if (exercise.type === "MULTIPLE_CHOICE" || exercise.type === "LISTENING") {
          expect(exercise.options).toHaveLength(4);
          expect(new Set(exercise.options.map((o) => o.text)).size).toBe(4);
          expect(exercise.options.some((o) => o.id === exercise.correctOptionId)).toBe(true);
          expect(exercise.correctOptionId).toBe(wordIds[0]);
        } else throw new Error(`unexpected exercise type ${exercise.type}`);
      }
    }
  });

  it("stays inside the learner's level", () => {
    const steps = buildRound(food, "A1", {}, { seed: 3, language: "pl", audio: true });
    const used = steps.flatMap((s) => s.wordIds).map((id) => food.words.find((w) => w.id === id)!.level);
    expect(used.every((l) => l === "Pre-A1" || l === "A1")).toBe(true);
    // New words of the learner's own level come before lower ones.
    expect(pickWords(food, "A1", {}, seededRandom(3)).every((w) => w.level === "A1")).toBe(true);
  });

  it("is reproducible for a seed and different for another", () => {
    const a = buildRound(food, "A2", {}, { seed: 11, language: "en", audio: true });
    expect(buildRound(food, "A2", {}, { seed: 11, language: "en", audio: true })).toEqual(a);
    expect(buildRound(food, "A2", {}, { seed: 12, language: "en", audio: true })).not.toEqual(a);
    expect(a[1].exercise.type === "MULTIPLE_CHOICE" && a[1].exercise.prompt).toMatch(/^What does/);
  });

  it("turns listening into reading when the device has no audio", () => {
    expect(buildRound(food, "A1", {}, { seed: 5, language: "pl", audio: true }).some((s) => s.exercise.type === "LISTENING")).toBe(true);
    expect(buildRound(food, "A1", {}, { seed: 5, language: "pl", audio: false }).some((s) => s.exercise.type === "LISTENING")).toBe(false);
  });
});

describe("what a round changes", () => {
  it("brings back a missed word first and masters a word after two clean rounds", () => {
    const first = buildRound(food, "A1", {}, { seed: 21, language: "pl", audio: false });
    const missedId = first[1].wordIds[0];
    const one = finishRound(play(first, [missedId]), {}, now);
    expect(one.stats[missedId]).toMatchObject({ seen: 1, correct: 0, streak: 0 });
    expect(one.summary).toMatchObject({ totalWords: 8, correctWords: 7, newlyMastered: 0 });
    // The missed word is asked twice in a round (meaning, then English), so two steps pay half.
    expect(one.summary.xp).toBe(4 + 5 * 2 + 2 * 1 + ROUND_BONUS_XP);

    expect(pickWords(food, "A1", one.stats, seededRandom(22))[0].id).toBe(missedId);

    const cleanIds = Object.keys(one.stats).filter((id) => id !== missedId);
    const repeat: TopicRound["steps"] = first.filter((s) => s.wordIds.every((id) => cleanIds.includes(id)));
    const two = finishRound(play(repeat), one.stats, now);
    expect(two.summary.newlyMastered).toBeGreaterThan(0);
    expect(isMastered(two.stats[repeat[0].wordIds[0]])).toBe(true);
    expect(isMastered(two.stats[missedId])).toBe(false);
  });

  it("never runs out: rounds keep coming after every word is mastered", () => {
    let stats: WordStats = {};
    for (let i = 0; i < 40; i++) {
      const steps = buildRound(food, "A1", stats, { seed: 100 + i, language: "pl", audio: true });
      expect(steps, `round ${i + 1}`).toHaveLength(8);
      stats = finishRound(play(steps), stats, new Date(now.getTime() + i * 60000)).stats;
    }
    const progress = topicProgress(food, "A1", stats);
    expect(progress.mastered).toBe(progress.total);
    expect(buildRound(food, "A1", stats, { seed: 999, language: "pl", audio: true })).toHaveLength(8);
  });
});
