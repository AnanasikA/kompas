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
  | "DIALOGUE"
  | "STORY"
  | "CONVERSATION"
  | "REAL_TASK";

/** Something that can be played: a recording when `src` exists, TTS otherwise. */
export interface AudioSource {
  text: string;
  /** Path/URL of a recorded file. When absent the TTS service speaks `text`. */
  src?: string;
  lang?: string;
  rate?: number;
  /** Voice height for TTS (1 = normal): lets characters sound different. */
  pitch?: number;
}

export type Colour = "red" | "blue" | "green" | "yellow" | "orange" | "pink" | "purple" | "black" | "white" | "brown";
export type Feeling = "happy" | "sad" | "tired" | "hungry";
export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";
export type Count = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
/** Pictures of the Home world (line icons, components/ui/LineIcon). */
export type HomeThing =
  | "mum" | "dad" | "sister" | "brother" | "baby" | "grandma" | "grandpa"
  | "kitchen" | "bathroom" | "bedroom" | "living-room"
  | "bed" | "table" | "chair" | "lamp"
  | "ball" | "doll" | "teddy" | "car" | "train" | "kite"
  | "dog" | "cat" | "fish" | "bird" | "rabbit"
  | "jump" | "swim" | "climb" | "dance" | "run" | "fly"
  | "tshirt" | "shoes" | "hat" | "dress" | "jacket" | "socks"
  | "where-in" | "where-on" | "where-under" | "where-next-to";

/** Ids of illustrations that the presentation layer knows how to draw (components/ui/Illustration). */
export type IllustrationId =
  | "coffee"
  | "juice"
  | "sandwich"
  | "water"
  | "cake"
  | "present"
  | "balloon"
  | "candle"
  | `colour-${Colour}`
  | `face-${Feeling}`
  | `time-${TimeOfDay}`
  | `count-${Count}`
  | `home-${HomeThing}`;

/** Where a scene takes place: picks the colours of the scene art. */
export type SceneSetting = "cafe" | "park" | "classroom" | "home" | "party" | "shop";

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

/**
 * A scripted conversation. Lines and replies may contain `{name}`, which is
 * replaced with the learner's first name when the scene is played.
 */
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
    /** Child mode: where the scene takes place (café when absent). */
    setting?: SceneSetting;
  };
  script: DialogueScript;
}

/* ---------- the mission format: story → conversation → real-world task ---------- */

/** The people of Kompas town (art in /public/characters). */
export type CharacterId = "leo" | "mia" | "bell" | "grandma";

/** One picture of a story: who is there, what they say, and what happens (in Polish). */
export interface StoryPanel {
  id: string;
  setting: SceneSetting;
  /** Character pictures shown in the panel: file names in /public/characters, e.g. "leo-wave". */
  cast: string[];
  /** Short narration in Polish, e.g. "Rano. Wysiadasz z pociągu w miasteczku Kompas." */
  caption?: string;
  lines: { who: CharacterId; en: string; pl: string }[];
}

/** Watch and listen: a short illustrated story where the new phrases are used for real. No questions. */
export interface StoryExercise extends ExerciseBase {
  type: "STORY";
  title: string;
  panels: StoryPanel[];
}

/**
 * What the learner may say. Each phrase is matched on words, not spelling:
 * "good morning" accepts "Good morning, Leo!". `*` alone accepts any answer.
 */
export interface ConversationAnswer {
  says: string[];
  /** The next turn, or null when this answer ends the conversation. */
  next: string | null;
  /** What is said back before the next turn (in English, read aloud). */
  reply?: string;
  /** Who says the reply, when it is not the character asking (e.g. Mia barks back). */
  replyBy?: CharacterId;
}

/** A turn: the character speaks, the learner answers in their own words (voice or typing). */
export interface ConversationTurn {
  who: CharacterId;
  /** Character picture for this turn, e.g. "leo-laugh". */
  pose: string;
  line: string;
  /** Polish meaning, shown on request. */
  pl: string;
  answers: ConversationAnswer[];
  /** Answers that are real English but wrong here: the character reacts (English, aloud) and a hint explains (Polish). */
  misses?: { says: string[]; reply: string; hint: string }[];
  /** Sentence starter shown after a first miss, e.g. "Good morning, ___!". */
  frame: string;
  /** A good answer, shown after a second miss for the learner to repeat. */
  model: string;
  conceptId: string;
}

export interface ConversationExercise extends ExerciseBase {
  type: "CONVERSATION";
  title: string;
  /** What to do, in Polish. */
  goal: string;
  setting: SceneSetting;
  start: string;
  turns: Record<string, ConversationTurn>;
  /** The last thing the character says when the conversation is done. */
  ending: string;
}

/** A mission for real life, away from the screen. A parent confirms it; the stamp goes to the passport. */
export interface RealTaskExercise extends ExerciseBase {
  type: "REAL_TASK";
  title: string;
  /** Why and what, in Polish. */
  intro: string;
  /** Steps to tick off, in Polish (may contain **bold** English). */
  steps: string[];
  /** Phrases to use, with their meaning. */
  phrases: { en: string; pl: string }[];
  stamp: { id: string; label: string; icon: string };
}

export type Exercise =
  | StoryExercise
  | ConversationExercise
  | RealTaskExercise
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
