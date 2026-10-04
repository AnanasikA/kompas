import type {
  ChoiceOption,
  FillGapExercise,
  ImageChoiceExercise,
  ListeningExercise,
  MatchingExercise,
  MultipleChoiceExercise,
  SentenceBuilderExercise,
  SpeakingExercise,
} from "@/types";

/**
 * Pure answer checking. No React, no storage — easy to test and to reuse
 * on a server later.
 */

export interface Evaluation {
  correct: boolean;
  /** Concept to put into review when wrong. */
  conceptId: string;
  /** Explanation specific to this wrong answer, when the content has one. */
  hint?: string;
}

type ChoiceExercise = MultipleChoiceExercise | ImageChoiceExercise | ListeningExercise | FillGapExercise;

export function evaluateChoice(exercise: ChoiceExercise, optionId: string): Evaluation {
  const correct = optionId === exercise.correctOptionId;
  const option = (exercise.options as ChoiceOption[]).find((o) => o.id === optionId);
  return {
    correct,
    conceptId: (!correct && option?.conceptId) || exercise.conceptId,
    hint: correct ? undefined : option?.hint,
  };
}

function normaliseSentence(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function evaluateSentence(exercise: SentenceBuilderExercise, tokens: string[]): Evaluation {
  const built = normaliseSentence(tokens.join(" "));
  const correct = exercise.solutions.some((s) => normaliseSentence(s) === built);
  if (correct) return { correct, conceptId: exercise.conceptId };
  const hintToken = tokens.find((t) => exercise.tokenHints?.[t]);
  return {
    correct,
    conceptId: exercise.conceptId,
    hint: hintToken ? exercise.tokenHints?.[hintToken] : undefined,
  };
}

export function evaluateMatch(exercise: MatchingExercise, leftId: string, rightId: string): Evaluation & { conceptIds: string[] } {
  const correct = leftId === rightId;
  // Pair ids double as concept ids, so both confused words go to review.
  return { correct, conceptId: leftId, conceptIds: correct ? [] : [leftId, rightId] };
}

export interface SpokenWord {
  word: string;
  heard: boolean;
}

export interface SpeechEvaluation {
  correct: boolean;
  /** Share of expected words found in the transcript, 0–1. */
  ratio: number;
  words: SpokenWord[];
  transcript: string;
}

function tokeniseSpeech(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function matchWords(expected: string, transcript: string): { ratio: number; words: SpokenWord[] } {
  const display = expected.split(/\s+/).filter(Boolean);
  const wanted = display.map((w) => tokeniseSpeech(w).join(""));
  const pool = tokeniseSpeech(transcript);
  const words = display.map((word, i) => {
    const at = pool.indexOf(wanted[i]);
    if (at === -1) return { word, heard: false };
    pool.splice(at, 1);
    return { word, heard: true };
  });
  const heard = words.filter((w) => w.heard).length;
  return { ratio: words.length ? heard / words.length : 0, words };
}

/**
 * Compares what the recogniser heard with the expected sentence, word by word.
 * This is a transcript check — it says nothing about pronunciation quality.
 */
export function evaluateSpeech(exercise: SpeakingExercise, alternatives: string[]): SpeechEvaluation {
  let best: SpeechEvaluation = { correct: false, ratio: 0, words: matchWords(exercise.target, "").words, transcript: alternatives[0] ?? "" };
  for (const transcript of alternatives) {
    const { ratio, words } = matchWords(exercise.target, transcript);
    if (ratio > best.ratio) best = { correct: false, ratio, words, transcript };
  }
  return { ...best, correct: best.ratio >= exercise.passRatio };
}
