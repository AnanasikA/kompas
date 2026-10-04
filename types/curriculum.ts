import type { AgeGroup, CEFRLevel, Skill } from "./user";

/**
 * CONTENT MODEL
 * Course → CEFR Level → Unit → Lesson → Exercise[]
 * Everything under /data conforms to these types. UI never hardcodes content.
 */

export type ExerciseType =
  | "MULTIPLE_CHOICE"
  | "IMAGE_CHOICE"
  | "LISTENING"
  | "SENTENCE_BUILDER"
  | "FILL_GAP"
  | "MATCHING"
  | "SPEAKING"
  | "DIALOGUE";

/** Something that can be played: a recording when `src` exists, TTS otherwise. */
export interface AudioSource {
  text: string;
  /** Path/URL of a recorded file. When absent the TTS service speaks `text`. */
  src?: string;
  lang?: string;
  rate?: number;
}

/** Ids of illustrations that the presentation layer knows how to draw. */
export type IllustrationId = "coffee" | "juice" | "sandwich" | "water";

export interface FeedbackCopy {
  title: string;
  /** Short explanation shown under the title. May contain **bold** markers. */
  note?: string;
}

/**
 * A language point that can be missed and reviewed later.
 * Every wrong answer maps to one of these (→ ReviewItem in Practice).
 */
export interface Concept {
  id: string;
  /** Short label shown in Practice, e.g. "I'd like…". */
  label: string;
  translation?: string;
  explanation: string;
  example?: string;
  skill: Skill;
  /** Quick check used by the Practice session. Runs through the same engine. */
  practice: PracticeCheck;
}

export type PracticeCheck = MultipleChoiceExercise | FillGapExercise | SentenceBuilderExercise;

interface ExerciseBase {
  id: string;
  type: ExerciseType;
  skill: Skill;
  /** XP for solving without a mistake. Half when a mistake was made. */
  xp: number;
  /** Default concept recorded when the learner gets this wrong. */
  conceptId: string;
  /** Small label above the task, e.g. "SENTENCE BUILDER". */
  eyebrow?: string;
  feedback: {
    correct: FeedbackCopy;
    incorrect: FeedbackCopy;
  };
}

export interface ChoiceOption {
  id: string;
  text: string;
  image?: IllustrationId;
  /** Specific explanation when this (wrong) option is picked. */
  hint?: string;
  /** Overrides the exercise concept when this (wrong) option is picked. */
  conceptId?: string;
}

export interface MultipleChoiceExercise extends ExerciseBase {
  type: "MULTIPLE_CHOICE";
  prompt: string;
  context?: string;
  options: ChoiceOption[];
  correctOptionId: string;
}

export interface ImageChoiceExercise extends ExerciseBase {
  type: "IMAGE_CHOICE";
  prompt: string;
  /** The English word/phrase the learner is looking for. */
  target: string;
  options: (ChoiceOption & { image: IllustrationId })[];
  correctOptionId: string;
}

export interface ListeningExercise extends ExerciseBase {
  type: "LISTENING";
  audio: AudioSource;
  /** Who is speaking, shown next to the play button. */
  speaker: { name: string; caption: string };
  question: string;
  options: ChoiceOption[];
  correctOptionId: string;
  /** Optional cap on plays (first play included). Unlimited when absent. */
  maxPlays?: number;
}

export interface SentenceBuilderExercise extends ExerciseBase {
  type: "SENTENCE_BUILDER";
  prompt: string;
  /** Sentence in the learner's language, or a situation description. */
  source: { label: string; text: string } | null;
  /** Word bank, in display order. May include distractors. */
  tokens: string[];
  /** Accepted answers, tokens joined with single spaces. */
  solutions: string[];
  /** Explanation shown when a specific distractor token was used. */
  tokenHints?: Record<string, string>;
}

export interface FillGapExercise extends ExerciseBase {
  type: "FILL_GAP";
  prompt: string;
  /** Sentence with exactly one `___` gap. */
  sentence: string;
  translation?: string;
  options: ChoiceOption[];
  correctOptionId: string;
}

export interface MatchingExercise extends ExerciseBase {
  type: "MATCHING";
  prompt: string;
  pairs: { id: string; left: string; right: string }[];
}

export interface SpeakingExercise extends ExerciseBase {
  type: "SPEAKING";
  /** What the learner should say. */
  target: string;
  translation?: string;
  /** Teaching tip from the content author (not an automatic assessment). */
  tip?: { text: string; audio?: AudioSource };
  /** Share of target words that must be recognised (0–1). */
  passRatio: number;
}

export interface DialogueOption {
  text: string;
  /** Node to move to. Absent on options that only produce a hint. */
  next?: string;
  hint?: string;
  conceptId?: string;
}

export interface DialogueNode {
  id: string;
  /** Line spoken by the character. */
  line: string;
  options: DialogueOption[];
  /** Terminal node: the character says `line` and the scene ends. */
  end?: boolean;
}

export interface DialogueScript {
  character: { name: string; role: string; initial: string };
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
}

export interface DialogueExercise extends ExerciseBase {
  type: "DIALOGUE";
  prompt: string;
  scene: {
    id: string;
    title: string;
    description?: string;
    /** Things visible in the scene, e.g. a menu or departures board. */
    board?: { title: string; rows: string[][] };
  };
  script: DialogueScript;
}

export type Exercise =
  | MultipleChoiceExercise
  | ImageChoiceExercise
  | ListeningExercise
  | SentenceBuilderExercise
  | FillGapExercise
  | MatchingExercise
  | SpeakingExercise
  | DialogueExercise;

export interface LessonVocabulary {
  term: string;
  translation: string;
}

/**
 * What a step on the path is for: learning new material, repeating a unit's
 * material, or proving it at the end of the unit.
 */
export type MissionKind = "LESSON" | "REVIEW" | "CHECKPOINT";

export interface Lesson {
  id: string;
  unitId: string;
  /** Defaults to "LESSON". */
  kind?: MissionKind;
  level: CEFRLevel;
  /** 1-based position inside the unit. */
  order: number;
  title: string;
  /** "After this lesson you can…" */
  canDo: string;
  /** Finished-lesson headline. */
  outcome: string;
  estimatedMinutes: number;
  /** Awarded for finishing the lesson, on top of exercise XP. */
  completionBonus: number;
  keyPhrases: string[];
  vocabulary: LessonVocabulary[];
  exercises: Exercise[];
}

/** A lesson that is planned in the syllabus but has no exercises yet. */
export interface PlannedLesson {
  id: string;
  order: number;
  title: string;
  planned: true;
  kind: MissionKind;
  /** New words this lesson will teach (0 for reviews and checkpoints). */
  words: number;
  /** False while the title is only a placeholder such as "Misja 4". */
  titled: boolean;
}

export type UnitLesson = Lesson | PlannedLesson;

export interface Unit {
  id: string;
  /** 1-based position in the course. */
  order: number;
  level: CEFRLevel;
  title: string;
  subtitle?: string;
  /** "In this unit you learn to…" */
  canDo: string;
  description?: string;
  objectives?: string[];
  /** New words the unit teaches. Equals the sum over its lessons. */
  words: number;
  /** Grammar topics the unit teaches: ids from data/cefr/program.ts. */
  grammar: string[];
  /** Topic of the word bank (data/topics) for endless rounds on this unit's theme. */
  topic?: string;
  lessons: UnitLesson[];
  /** Presentation hints (map position etc.). Engine ignores these. */
  presentation?: Record<string, string | number>;
}

export interface CourseLevel {
  level: CEFRLevel;
  title: string;
}

export interface Course {
  id: string;
  ageGroup: AgeGroup;
  title: string;
  levels: CourseLevel[];
  units: Unit[];
  concepts: Record<string, Concept>;
}

export function isPlayable(lesson: UnitLesson): lesson is Lesson {
  return !("planned" in lesson);
}

/** New words a lesson teaches, whether it is written already or only planned. */
export function lessonWords(lesson: UnitLesson): number {
  return isPlayable(lesson) ? lesson.vocabulary.length : lesson.words;
}

export function missionKind(lesson: UnitLesson): MissionKind {
  return lesson.kind ?? "LESSON";
}
