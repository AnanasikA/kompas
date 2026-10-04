import type { Concept, Lesson, MissionKind, Unit, UnitLesson } from "@/types";

/** Builds a vocabulary concept with a "what does it mean?" practice check. */
export function wordConcept(
  id: string,
  term: string,
  translation: string,
  distractors: string[],
  opts: { prompt?: string; example?: string; correctTitle?: string; incorrectTitle?: string } = {},
): Concept {
  const options = [translation, ...distractors].map((text, i) => ({ id: `o${i}`, text }));
  // Stable, content-defined shuffle: rotate by the term length so the right answer is not always first.
  const shift = term.length % options.length;
  const rotated = [...options.slice(shift), ...options.slice(0, shift)];
  return {
    id,
    label: term,
    translation,
    explanation: `**${term}** = ${translation}.`,
    example: opts.example,
    skill: "VOCABULARY",
    practice: {
      id: `${id}.check`,
      type: "MULTIPLE_CHOICE",
      skill: "VOCABULARY",
      xp: 5,
      conceptId: id,
      prompt: opts.prompt ?? `Co znaczy „${term}”?`,
      options: rotated,
      correctOptionId: "o0",
      feedback: {
        correct: { title: opts.correctTitle ?? "Dobrze!", note: `**${term}** = ${translation}.` },
        incorrect: { title: opts.incorrectTitle ?? "Jeszcze nie.", note: `**${term}** = ${translation}.` },
      },
    },
  };
}

/**
 * One step of a unit:
 *   "Title"      a planned lesson with a title
 *   null         a planned lesson that still needs a title
 *   Lesson       a written, playable lesson
 *   review(…) / checkpoint(…)   the closing steps of a unit (no new words)
 */
export type MissionSpec = string | null | Lesson | { kind: Exclude<MissionKind, "LESSON">; title: string };

export const untitled = (count: number): null[] => Array.from({ length: count }, () => null);
export const review = (title: string): MissionSpec => ({ kind: "REVIEW", title });
export const checkpoint = (title: string): MissionSpec => ({ kind: "CHECKPOINT", title });

const isWritten = (m: MissionSpec): m is Lesson => typeof m === "object" && m !== null && "exercises" in m;
const isClosing = (m: MissionSpec): m is { kind: Exclude<MissionKind, "LESSON">; title: string } =>
  typeof m === "object" && m !== null && !("exercises" in m);

export interface UnitSpec extends Omit<Unit, "lessons"> {
  /** Placeholder name for untitled steps: "Misja", "Mission", "Lesson". */
  missionLabel: string;
  missions: MissionSpec[];
}

/**
 * Builds a unit from its list of steps and shares the unit's word target
 * between them: written lessons count their real vocabulary, the remaining
 * words are spread evenly over the planned lessons. The unit therefore always
 * adds up to `words`.
 */
export function buildUnit({ missionLabel, missions, ...unit }: UnitSpec): Unit {
  const written = missions.filter(isWritten).reduce((sum, m) => sum + m.vocabulary.length, 0);
  const slots = missions.filter((m) => !isWritten(m) && !isClosing(m)).length;
  const remaining = Math.max(0, unit.words - written);
  const base = slots ? Math.floor(remaining / slots) : 0;
  let extra = slots ? remaining % slots : 0;

  const lessons: UnitLesson[] = missions.map((m, i) => {
    const order = i + 1;
    if (isWritten(m)) return m;
    const id = `${unit.id}.l${String(order).padStart(2, "0")}`;
    if (isClosing(m)) return { id, order, title: m.title, planned: true, kind: m.kind, words: 0, titled: true };
    const words = base + (extra-- > 0 ? 1 : 0);
    return { id, order, title: m ?? `${missionLabel} ${order}`, planned: true, kind: "LESSON", words, titled: m !== null };
  });
  return { ...unit, lessons };
}
