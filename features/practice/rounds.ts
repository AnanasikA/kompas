import type { Topic, TopicWord } from "@/data/topics";
import { cefrIndex } from "@/lib/utils";
import type { CEFRLevel, ChoiceOption, Exercise, TopicRound, WordStat } from "@/types";

/**
 * ENDLESS TOPIC ROUNDS
 *
 * A round is eight short tasks generated from the topic word bank, at the
 * learner's level. There is always a next round: words that went wrong come
 * back first, then words not seen yet, then the ones known least well.
 * Pure functions; the store keeps the state.
 */

export const ROUND_WORDS = 8;
export const MASTERED_STREAK = 2;
export const ROUND_BONUS_XP = 4;
/** A topic needs this many words at or below the learner's level to be playable. */
export const MIN_POOL = 6;

export type WordStats = Record<string, WordStat>;
export type RoundLanguage = "pl" | "en";

/** Small seeded generator, so a round can be reproduced in tests. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Words of a topic the learner can meet: everything up to their level. */
export function wordsForLevel(topic: Topic, level: CEFRLevel): TopicWord[] {
  return topic.words.filter((w) => cefrIndex(w.level) <= cefrIndex(level));
}

export function isTopicOpen(topic: Topic, level: CEFRLevel): boolean {
  return wordsForLevel(topic, level).length >= MIN_POOL;
}

/** First level at which the topic has enough words to play. */
export function topicStartLevel(topic: Topic): CEFRLevel {
  const levels: CEFRLevel[] = ["Pre-A1", "A1", "A2", "B1", "B2"];
  return levels.find((l) => isTopicOpen(topic, l)) ?? "B2";
}

export function isMastered(stat: WordStat | undefined): boolean {
  return !!stat && stat.streak >= MASTERED_STREAK;
}

export function topicProgress(topic: Topic, level: CEFRLevel, stats: WordStats) {
  const pool = wordsForLevel(topic, level);
  return {
    total: pool.length,
    seen: pool.filter((w) => stats[w.id]).length,
    mastered: pool.filter((w) => isMastered(stats[w.id])).length,
  };
}

/**
 * Which words go into the next round. Order of preference:
 * missed last time → new at the learner's level → new from lower levels →
 * least practised.
 */
export function pickWords(topic: Topic, level: CEFRLevel, stats: WordStats, random: () => number, count = ROUND_WORDS): TopicWord[] {
  const pool = shuffle(wordsForLevel(topic, level), random);
  const rank = (w: TopicWord): number => {
    const stat = stats[w.id];
    if (stat && stat.streak === 0) return 0;
    if (!stat) return w.level === level ? 1 : 2;
    return 3 + stat.streak;
  };
  const byTime = (w: TopicWord) => stats[w.id]?.last ?? "";
  return pool.sort((a, b) => rank(a) - rank(b) || byTime(a).localeCompare(byTime(b))).slice(0, count);
}

const COPY = {
  pl: {
    eyebrow: (title: string) => `RUNDA · ${title.toUpperCase()}`,
    meaning: (term: string) => `Co znaczy „${term}”?`,
    english: (translation: string) => `Jak powiedzieć po angielsku „${translation}”?`,
    listen: "Co słyszysz?",
    match: "Połącz słowa w pary",
    speaker: { name: "Kompas", caption: "posłuchaj słowa" },
    correct: "Dobrze!",
    incorrect: "Jeszcze nie.",
  },
  en: {
    eyebrow: (title: string) => `ROUND · ${title.toUpperCase()}`,
    meaning: (term: string) => `What does “${term}” mean?`,
    english: (translation: string) => `How do you say “${translation}” in English?`,
    listen: "What did you hear?",
    match: "Match the pairs",
    speaker: { name: "Kompas", caption: "listen to the word" },
    correct: "Correct.",
    incorrect: "Not quite.",
  },
};

export interface RoundOptions {
  seed: number;
  language: RoundLanguage;
  /** Whether this device can play audio; without it listening tasks become reading tasks. */
  audio: boolean;
}

export function buildRound(topic: Topic, level: CEFRLevel, stats: WordStats, { seed, language, audio }: RoundOptions): TopicRound["steps"] {
  const random = seededRandom(seed);
  const t = COPY[language];
  const title = topic.title[language];
  const picked = pickWords(topic, level, stats, random);
  if (picked.length < 4) return [];
  // Short pools repeat words instead of producing a shorter round.
  const word = (i: number) => picked[i % picked.length];
  const base = { skill: "VOCABULARY" as const, eyebrow: t.eyebrow(title) };
  const feedback = (w: TopicWord) => ({
    correct: { title: t.correct, note: `**${w.term}** = ${w.translation}.` },
    incorrect: { title: t.incorrect, note: `**${w.term}** = ${w.translation}.` },
  });

  /** Three wrong answers from the same topic, the closest levels first. */
  const options = (w: TopicWord, side: "term" | "translation"): { options: ChoiceOption[]; correctOptionId: string } => {
    const others = shuffle(topic.words.filter((o) => o.id !== w.id), random)
      .sort((a, b) => Math.abs(cefrIndex(a.level) - cefrIndex(w.level)) - Math.abs(cefrIndex(b.level) - cefrIndex(w.level)))
      .slice(0, 3);
    const all = shuffle([w, ...others], random).map((o) => ({ id: o.id, text: o[side] }));
    return { options: all, correctOptionId: w.id };
  };

  const meaning = (i: number, n: number): TopicRound["steps"][number] => {
    const w = word(i);
    return { wordIds: [w.id], exercise: { ...base, id: `round.${seed}.${n}`, type: "MULTIPLE_CHOICE", xp: 2, conceptId: w.id, prompt: t.meaning(w.term), ...options(w, "translation"), feedback: feedback(w) } };
  };
  const english = (i: number, n: number): TopicRound["steps"][number] => {
    const w = word(i);
    return { wordIds: [w.id], exercise: { ...base, id: `round.${seed}.${n}`, type: "MULTIPLE_CHOICE", xp: 2, conceptId: w.id, prompt: t.english(w.translation), ...options(w, "term"), feedback: feedback(w) } };
  };
  const listening = (i: number, n: number): TopicRound["steps"][number] => {
    const w = word(i);
    if (!audio) return meaning(i, n);
    const exercise: Exercise = {
      ...base,
      skill: "LISTENING",
      id: `round.${seed}.${n}`,
      type: "LISTENING",
      xp: 2,
      conceptId: w.id,
      audio: { text: w.term, lang: "en-GB", rate: 0.9 },
      speaker: t.speaker,
      question: t.listen,
      ...options(w, "translation"),
      feedback: feedback(w),
    };
    return { wordIds: [w.id], exercise };
  };
  const matching: TopicRound["steps"][number] = {
    wordIds: picked.slice(0, 4).map((w) => w.id),
    exercise: {
      ...base,
      id: `round.${seed}.0`,
      type: "MATCHING",
      xp: 4,
      conceptId: picked[0].id,
      prompt: t.match,
      pairs: picked.slice(0, 4).map((w) => ({ id: w.id, left: w.term, right: w.translation })),
      feedback: { correct: { title: t.correct }, incorrect: { title: t.incorrect } },
    },
  };

  return [matching, meaning(4, 1), meaning(5, 2), listening(6, 3), english(0, 4), meaning(7, 5), english(4, 6), english(5, 7)];
}

/** XP for a step: full without a mistake, half after one. */
export function stepXp(exercise: Exercise, correct: boolean): number {
  return correct ? exercise.xp : Math.floor(exercise.xp / 2);
}

/** Closes a round: updates what is known about each word and totals the XP. */
export function finishRound(round: TopicRound, stats: WordStats, now: Date): { stats: WordStats; summary: NonNullable<TopicRound["summary"]> } {
  const missed = new Set(round.results.flatMap((r) => r.missed));
  const words = [...new Set(round.steps.flatMap((s) => s.wordIds))];
  const next: WordStats = { ...stats };
  let newlyMastered = 0;
  for (const id of words) {
    const before = stats[id];
    const correct = !missed.has(id);
    const after: WordStat = {
      seen: (before?.seen ?? 0) + 1,
      correct: (before?.correct ?? 0) + (correct ? 1 : 0),
      streak: correct ? (before?.streak ?? 0) + 1 : 0,
      last: now.toISOString(),
    };
    if (isMastered(after) && !isMastered(before)) newlyMastered++;
    next[id] = after;
  }
  const xp = round.steps.reduce((sum, s, i) => sum + stepXp(s.exercise, round.results[i]?.correct ?? false), 0) + ROUND_BONUS_XP;
  return { stats: next, summary: { xp, correctWords: words.filter((id) => !missed.has(id)).length, totalWords: words.length, newlyMastered } };
}
