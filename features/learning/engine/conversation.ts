import type { ConversationAnswer, ConversationTurn } from "@/types";

/**
 * CONVERSATION MATCHING
 *
 * The learner answers in their own words, by voice or typing. We check the
 * meaning on words, not spelling or punctuation: "good morning" accepts
 * "Good morning, Leo!", "goodmorning" and "Good morning Leo". Contractions are
 * opened up first ("I'm" = "I am"), so both forms match.
 */

const CONTRACTIONS: [RegExp, string][] = [
  [/\bi'm\b/g, "i am"],
  [/\bwhat's\b/g, "what is"],
  [/\bit's\b/g, "it is"],
  [/\bthat's\b/g, "that is"],
  [/\bhe's\b/g, "he is"],
  [/\bshe's\b/g, "she is"],
  [/\byou're\b/g, "you are"],
  [/\bwho's\b/g, "who is"],
  [/\bwhere's\b/g, "where is"],
  [/\bdon't\b/g, "do not"],
  [/\bcan't\b/g, "can not"],
  [/\bcannot\b/g, "can not"],
  [/\bthanks\b/g, "thank you"],
  [/\bgoodmorning\b/g, "good morning"],
  [/\bgoodnight\b/g, "good night"],
  [/\bgoodbye\b/g, "good bye"],
  [/\bbye-bye\b/g, "bye"],
  [/\bok\b/g, "okay"],
];

/** Lower case, contractions opened, punctuation dropped, single spaces. */
export function normalise(text: string): string {
  let t = text.toLowerCase().replace(/[’‘`]/g, "'");
  for (const [from, to] of CONTRACTIONS) t = t.replace(from, to);
  return t
    .replace(/[^a-z' ]+/g, " ")
    .replace(/'/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Does the phrase occur in the answer as whole words, in order? `*` alone: any answer with a word in it. */
export function says(answer: string, phrase: string): boolean {
  const said = normalise(answer);
  if (phrase.trim() === "*") return said.length > 0;
  const want = normalise(phrase);
  if (!want) return false;
  return ` ${said} `.includes(` ${want} `);
}

export type TurnOutcome =
  | { kind: "answer"; answer: ConversationAnswer; heard: string }
  | { kind: "miss"; reply: string; hint: string; heard: string }
  | { kind: "unclear"; heard: string };

/**
 * Judge what the learner said. Several hypotheses may come from speech
 * recognition (best first): the first one that fits wins. A known wrong
 * answer is checked before the catch-all, so "Good night" in the morning
 * gets a friendly correction rather than a pass.
 */
export function judgeTurn(turn: ConversationTurn, heard: string[]): TurnOutcome {
  const tries = heard.map((h) => h.trim()).filter(Boolean);
  if (!tries.length) return { kind: "unclear", heard: "" };
  const specific = turn.answers.filter((a) => !a.says.includes("*"));
  const catchAll = turn.answers.find((a) => a.says.includes("*"));
  for (const h of tries) {
    const answer = specific.find((a) => a.says.some((p) => says(h, p)));
    if (answer) return { kind: "answer", answer, heard: h };
  }
  for (const h of tries) {
    const miss = turn.misses?.find((m) => m.says.some((p) => says(h, p)));
    if (miss) return { kind: "miss", reply: miss.reply, hint: miss.hint, heard: h };
  }
  if (catchAll) return { kind: "answer", answer: catchAll, heard: tries[0] };
  return { kind: "unclear", heard: tries[0] };
}

/** Longest number of turns from `from` to the end (for a progress hint). */
export function turnsLeft(turns: Record<string, ConversationTurn>, from: string, seen = new Set<string>()): number {
  if (seen.has(from) || !turns[from]) return 0;
  seen.add(from);
  const nexts = turns[from].answers.map((a) => a.next).filter((n): n is string => !!n);
  return 1 + Math.max(0, ...nexts.map((n) => turnsLeft(turns, n, new Set(seen))));
}
