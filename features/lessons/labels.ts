import type { AgeGroup, Exercise, ExerciseType, Lesson, Skill } from "@/types";

const TYPE_NAMES: Record<AgeGroup, Record<ExerciseType, string>> = {
  CHILD: {
    MATCHING: "Słówka",
    IMAGE_CHOICE: "Obrazki",
    LISTENING: "Słuchanie",
    SENTENCE_BUILDER: "Ułóż zdanie",
    FILL_GAP: "Uzupełnij",
    SPEAKING: "Mówienie",
    DIALOGUE: "Scenka",
    MULTIPLE_CHOICE: "Quiz",
  },
  TEEN: {
    MATCHING: "Match the words",
    IMAGE_CHOICE: "Picture check",
    LISTENING: "Announcement",
    SENTENCE_BUILDER: "Build the question",
    FILL_GAP: "Fill the gap",
    SPEAKING: "Say it out loud",
    DIALOGUE: "Live scenario",
    MULTIPLE_CHOICE: "Speed round",
  },
  ADULT: {
    MATCHING: "Vocabulary",
    IMAGE_CHOICE: "Vocabulary",
    LISTENING: "Listening",
    SENTENCE_BUILDER: "Sentence building",
    FILL_GAP: "In context",
    SPEAKING: "Speaking",
    DIALOGUE: "Real-world scenario",
    MULTIPLE_CHOICE: "Quick check",
  },
};

const SKILL_CODES: Record<Skill, string> = { VOCABULARY: "VOC", LISTENING: "LIS", GRAMMAR: "GRM", SPEAKING: "SPK", READING: "RDG" };
const SKILL_NAMES: Record<Skill, string> = { VOCABULARY: "Vocabulary", LISTENING: "Listening", GRAMMAR: "Grammar", SPEAKING: "Speaking", READING: "Reading" };

export function exerciseName(age: AgeGroup, exercise: Exercise): string {
  return TYPE_NAMES[age][exercise.type];
}

export function skillCode(skill: Skill): string {
  return SKILL_CODES[skill];
}

export function skillName(skill: Skill): string {
  return SKILL_NAMES[skill];
}

/** Distinct skills practised in a lesson, in order of appearance. */
export function lessonSkills(lesson: Lesson): Skill[] {
  return [...new Set(lesson.exercises.map((e) => e.skill))];
}

/** Distinct exercise types in a lesson, in order of appearance. */
export function lessonTypes(lesson: Lesson): Exercise[] {
  const seen = new Set<ExerciseType>();
  return lesson.exercises.filter((e) => (seen.has(e.type) ? false : (seen.add(e.type), true)));
}
