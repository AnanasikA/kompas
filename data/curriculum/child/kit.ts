import type {
  ChoiceOption,
  Concept,
  ConversationExercise,
  RealTaskExercise,
  StoryExercise,
  StoryPanel,
  DialogueExercise,
  DialogueNode,
  FillGapExercise,
  IllustrationId,
  ImageChoiceExercise,
  Lesson,
  ListeningExercise,
  MatchingExercise,
  MissionKind,
  MultipleChoiceExercise,
  PracticeCheck,
  SceneSetting,
  SentenceBuilderExercise,
  Skill,
  SpeakingExercise,
} from "@/types";
import { wordConcept } from "../helpers";

/**
 * WRITING KIT for the child course.
 *
 * Short builders that fill in what every child exercise shares (Polish
 * instructions, labels, XP, feedback wording), so a lesson file reads like a
 * lesson plan. Every builder returns plain content objects from @/types.
 *
 * Feedback rule: a hint for a wrong answer helps to find the answer, it does
 * not give it away. The answer is shown by the app after a second mistake.
 */

const VOICE = { lang: "en-GB", rate: 0.85 };

export interface Word {
  /** Concept id, also used to record mistakes. */
  id: string;
  en: string;
  pl: string;
  example?: string;
}

/** A lesson's word list: [key, English, Polish, example?]. Keys become `${prefix}.${key}` ids. */
export function words<K extends string>(prefix: string, rows: readonly (readonly [K, string, string, string?])[]): Record<K, Word> {
  return Object.fromEntries(rows.map(([key, en, pl, example]) => [key, { id: `${prefix}.${key}`, en, pl, example }])) as Record<K, Word>;
}

/** "What does it mean?" checks for Practice; wrong answers are other words of the same list. */
export function wordConcepts(list: Record<string, Word>): Concept[] {
  const all = Object.values(list);
  return all.map((w, i) => {
    const distractors = [1, 2, 3].map((k) => all[(i + k) % all.length].pl);
    return wordConcept(w.id, w.en, w.pl, distractors, { example: w.example });
  });
}

/** A grammar or usage point with its own quick check for Practice. */
export function rule(id: string, label: string, translation: string, explanation: string, example: string, skill: Skill, practice: PracticeCheck): Concept {
  return { id, label, translation, explanation, example, skill, practice: { ...practice, conceptId: id } };
}

/* ---------- options ---------- */

type Wrong = string | readonly [text: string, hint: string];

function spread(seed: string, n: number): number {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % n;
}

/** One right answer and wrong ones (optionally with their own hint); the order is mixed but stable. */
export function options(seed: string, right: string, wrong: readonly Wrong[]): { options: ChoiceOption[]; correctOptionId: string } {
  const list: ChoiceOption[] = [
    { id: "a", text: right },
    ...wrong.map((w, i) => (typeof w === "string" ? { id: "bcd"[i], text: w } : { id: "bcd"[i], text: w[0], hint: w[1] })),
  ];
  const shift = spread(seed, list.length);
  return { options: [...list.slice(shift), ...list.slice(0, shift)], correctOptionId: "a" };
}

/** Picture options: [illustration, label] pairs, the first one is right. */
export function pictureOptions(seed: string, items: readonly (readonly [IllustrationId, string])[]): { options: (ChoiceOption & { image: IllustrationId })[]; correctOptionId: string } {
  const list = items.map(([image, text]) => ({ id: image, text, image }));
  const shift = spread(seed, list.length);
  return { options: [...list.slice(shift), ...list.slice(0, shift)], correctOptionId: items[0][0] };
}

const TRY_AGAIN = "Prawie! Spróbuj jeszcze raz.";

/* ---------- exercises ---------- */

export function matching(id: string, pairs: Word[], prompt = "Połącz pary"): MatchingExercise {
  return {
    id,
    type: "MATCHING",
    skill: "VOCABULARY",
    xp: 20,
    conceptId: pairs[0].id,
    eyebrow: "SŁÓWKA",
    prompt,
    pairs: pairs.map((w) => ({ id: w.id, left: w.en, right: w.pl })),
    feedback: {
      correct: { title: "Komplet! Wszystkie pary." },
      incorrect: { title: "Prawie!", note: "Te słowa nie tworzą pary. Dodaliśmy je do powtórek." },
    },
  };
}

export function pictures(
  id: string,
  spec: { word: Word; items: readonly (readonly [IllustrationId, string])[]; ok?: string; hint: string; prompt?: string },
): ImageChoiceExercise {
  return {
    id,
    type: "IMAGE_CHOICE",
    skill: "VOCABULARY",
    xp: 10,
    conceptId: spec.word.id,
    eyebrow: "OBRAZKI",
    prompt: spec.prompt ?? "Który obrazek pokazuje…",
    target: spec.word.en,
    ...pictureOptions(id, spec.items),
    feedback: {
      correct: { title: `Świetnie! ${capitalise(spec.word.en)}.`, note: spec.ok ?? `**${spec.word.en}** = ${spec.word.pl}.` },
      incorrect: { title: TRY_AGAIN, note: spec.hint },
    },
  };
}

export function listen(
  id: string,
  spec: {
    say: string;
    speaker: { name: string; caption: string };
    question: string;
    conceptId: string;
    ok: string;
    hint: string;
    okTitle?: string;
  } & ({ answer: string; wrong: readonly Wrong[] } | { items: readonly (readonly [IllustrationId, string])[] }),
): ListeningExercise {
  const choice = "items" in spec ? pictureOptions(id, spec.items) : options(id, spec.answer, spec.wrong);
  return {
    id,
    type: "LISTENING",
    skill: "LISTENING",
    xp: 10,
    conceptId: spec.conceptId,
    eyebrow: "SŁUCHANIE",
    audio: { text: spec.say, ...VOICE },
    speaker: spec.speaker,
    question: spec.question,
    ...choice,
    feedback: {
      correct: { title: spec.okTitle ?? "Świetnie!", note: spec.ok },
      incorrect: { title: TRY_AGAIN, note: spec.hint },
    },
  };
}

export function quiz(
  id: string,
  spec: { prompt: string; context?: string; answer: string; wrong: readonly Wrong[]; conceptId: string; ok: string; hint: string; skill?: Skill; eyebrow?: string },
): MultipleChoiceExercise {
  return {
    id,
    type: "MULTIPLE_CHOICE",
    skill: spec.skill ?? "GRAMMAR",
    xp: 10,
    conceptId: spec.conceptId,
    eyebrow: spec.eyebrow ?? "QUIZ",
    prompt: spec.prompt,
    context: spec.context,
    ...options(id, spec.answer, spec.wrong),
    feedback: {
      correct: { title: "Dobrze!", note: spec.ok },
      incorrect: { title: TRY_AGAIN, note: spec.hint },
    },
  };
}

export function gap(
  id: string,
  spec: { sentence: string; translation: string; answer: string; wrong: readonly Wrong[]; conceptId: string; ok: string; hint: string; skill?: Skill; prompt?: string },
): FillGapExercise {
  return {
    id,
    type: "FILL_GAP",
    skill: spec.skill ?? "GRAMMAR",
    xp: 10,
    conceptId: spec.conceptId,
    eyebrow: "UZUPEŁNIJ",
    prompt: spec.prompt ?? "Które słowo pasuje?",
    sentence: spec.sentence,
    translation: spec.translation,
    ...options(id, spec.answer, spec.wrong),
    feedback: {
      correct: { title: "Dobrze!", note: spec.ok },
      incorrect: { title: TRY_AGAIN, note: spec.hint },
    },
  };
}

export function build(
  id: string,
  spec: { pl: string; tokens: string[]; solution: string | string[]; conceptId: string; ok: string; hint: string; tokenHints?: Record<string, string>; prompt?: string },
): SentenceBuilderExercise {
  return {
    id,
    type: "SENTENCE_BUILDER",
    skill: "GRAMMAR",
    xp: 15,
    conceptId: spec.conceptId,
    eyebrow: "UŁÓŻ ZDANIE",
    prompt: spec.prompt ?? "Ułóż zdanie po angielsku",
    source: { label: "PL", text: spec.pl },
    tokens: spec.tokens,
    solutions: Array.isArray(spec.solution) ? spec.solution : [spec.solution],
    tokenHints: spec.tokenHints,
    feedback: {
      correct: { title: "Świetnie ułożone!", note: spec.ok },
      incorrect: { title: TRY_AGAIN, note: spec.hint },
    },
  };
}

export function say(id: string, spec: { target: string; translation: string; conceptId: string; tip?: string; tipAudio?: string; passRatio?: number }): SpeakingExercise {
  return {
    id,
    type: "SPEAKING",
    skill: "SPEAKING",
    xp: 15,
    conceptId: spec.conceptId,
    eyebrow: "MÓWIENIE · POWIEDZ NA GŁOS",
    target: spec.target,
    translation: spec.translation,
    tip: spec.tip ? { text: spec.tip, audio: spec.tipAudio ? { text: spec.tipAudio, lang: "en-GB", rate: 0.8 } : undefined } : undefined,
    passRatio: spec.passRatio ?? 0.6,
    feedback: {
      correct: { title: "Bardzo dobrze!" },
      incorrect: { title: "Spróbuj jeszcze raz.", note: "Nie wszystkie słowa udało się rozpoznać. Posłuchaj wzoru i powiedz całe zdanie." },
    },
  };
}

/**
 * A reply in a scene:
 *   [text, nextNodeId]          moves the conversation on
 *   [text, null, hint, concept] a wrong reply: the hint is shown, the mistake recorded
 */
export type Reply = readonly [text: string, next: string] | readonly [text: string, next: null, hint: string, conceptId: string];

/** Scene nodes: id → [character line, replies]. A node without replies ends the scene. */
export type SceneNodes = Record<string, readonly [line: string, replies?: readonly Reply[]]>;

export function scene(
  id: string,
  spec: {
    title: string;
    prompt: string;
    setting: SceneSetting;
    character: { name: string; role: string };
    conceptId: string;
    start: string;
    nodes: SceneNodes;
    board?: { title: string; rows: string[][] };
    done: string;
  },
): DialogueExercise {
  const nodes: Record<string, DialogueNode> = Object.fromEntries(
    Object.entries(spec.nodes).map(([nodeId, [line, replies]]) => [
      nodeId,
      replies && replies.length
        ? {
            id: nodeId,
            line,
            options: replies.map((r) => (r[1] === null ? { text: r[0], hint: r[2], conceptId: r[3] } : { text: r[0], next: r[1] })),
          }
        : { id: nodeId, line, options: [], end: true },
    ]),
  );
  return {
    id,
    type: "DIALOGUE",
    skill: "SPEAKING",
    xp: 30,
    conceptId: spec.conceptId,
    eyebrow: `SCENKA · ${spec.title.toUpperCase()}`,
    prompt: spec.prompt,
    scene: { id: `${id}.scene`, title: spec.title, setting: spec.setting, board: spec.board },
    script: {
      character: { name: spec.character.name, role: spec.character.role, initial: spec.character.name.charAt(0) },
      startNodeId: spec.start,
      nodes,
    },
    feedback: {
      correct: { title: spec.done },
      incorrect: { title: "Prawie!" },
    },
  };
}

/* ---------- lessons ---------- */

export function lesson(spec: {
  unitId: string;
  id: string;
  order: number;
  title: string;
  canDo: string;
  outcome: string;
  minutes: number;
  keyPhrases: string[];
  words: Word[];
  exercises: Lesson["exercises"];
  kind?: MissionKind;
}): Lesson {
  return {
    id: `${spec.unitId}.${spec.id}`,
    unitId: spec.unitId,
    kind: spec.kind,
    level: "Pre-A1",
    order: spec.order,
    title: spec.title,
    canDo: spec.canDo,
    outcome: spec.outcome,
    estimatedMinutes: spec.minutes,
    completionBonus: spec.kind === "CHECKPOINT" ? 20 : 10,
    keyPhrases: spec.keyPhrases,
    vocabulary: spec.words.map((w) => ({ term: w.en, translation: w.pl })),
    exercises: spec.exercises,
  };
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ---------- the mission format: story → conversation → real-life task ---------- */

export function story(id: string, spec: { title: string; panels: StoryPanel[]; conceptId: string }): StoryExercise {
  return {
    id,
    type: "STORY",
    skill: "LISTENING",
    xp: 10,
    conceptId: spec.conceptId,
    title: spec.title,
    panels: spec.panels,
    feedback: { correct: { title: "Historia obejrzana!" }, incorrect: { title: "" } },
  };
}

export function conversation(
  id: string,
  spec: { title: string; goal: string; setting: SceneSetting; start: string; turns: ConversationExercise["turns"]; ending: string; conceptId: string },
): ConversationExercise {
  return {
    id,
    type: "CONVERSATION",
    skill: "SPEAKING",
    xp: 40,
    conceptId: spec.conceptId,
    title: spec.title,
    goal: spec.goal,
    setting: spec.setting,
    start: spec.start,
    turns: spec.turns,
    ending: spec.ending,
    feedback: { correct: { title: "Udało się porozumieć po angielsku!" }, incorrect: { title: "Spróbuj jeszcze raz." } },
  };
}

export function realTask(id: string, spec: Omit<RealTaskExercise, "id" | "type" | "skill" | "xp" | "conceptId" | "feedback"> & { conceptId: string }): RealTaskExercise {
  return {
    id,
    type: "REAL_TASK",
    skill: "SPEAKING",
    xp: 20,
    ...spec,
    feedback: { correct: { title: "Misja zapisana!" }, incorrect: { title: "" } },
  };
}
