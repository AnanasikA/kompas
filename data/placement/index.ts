import type { AgeGroup, AudioSource, CEFRLevel, Skill } from "@/types";

export interface PlacementQuestion {
  id: string;
  skill: Skill;
  /** Small label above the question (as shown per age mode). */
  label: string;
  /** Headline for the question card (child mode). */
  prompt?: string;
  audio?: AudioSource;
  /** Reading text / situation. */
  context?: string;
  question: string;
  options: string[];
  answer: number;
  level?: string;
}

export interface PlacementTest {
  ageGroup: AgeGroup;
  questions: PlacementQuestion[];
  /** Index = number of correct answers → estimated CEFR level. */
  bands: CEFRLevel[];
  /** Index = self-assessment option → CEFR level (when the test is skipped). */
  selfAssessment: CEFRLevel[];
}

const child: PlacementTest = {
  ageGroup: "CHILD",
  questions: [
    { id: "c1", skill: "LISTENING", label: "POSŁUCHAJ", prompt: "Gdzie jest kot?", audio: { text: "The cat is under the table.", lang: "en-GB", rate: 0.88 }, question: "Posłuchaj i wybierz, gdzie jest kot.", options: ["Na stole", "Pod stołem", "Obok stołu", "W pudełku"], answer: 1 },
    { id: "c2", skill: "VOCABULARY", label: "SŁÓWKA", prompt: "Co to jest?", question: "Which one is a „pencil case”?", options: ["plecak", "piórnik", "linijka", "zeszyt"], answer: 1 },
    { id: "c3", skill: "GRAMMAR", label: "UZUPEŁNIJ", prompt: "Które słowo pasuje?", question: "My dog ___ very big.", options: ["is", "are", "am", "be"], answer: 0 },
    { id: "c4", skill: "READING", label: "CZYTANIE", prompt: "Przeczytaj i odpowiedz", context: "Hi, I'm Leo. I'm ten. I've got a little sister and a cat called Max. I love football!", question: "What does Leo love?", options: ["His cat", "Swimming", "Football", "School"], answer: 2 },
    { id: "c5", skill: "SPEAKING", label: "ROZMOWA", prompt: "Co odpowiesz?", question: "“Hi! How old are you?”", options: ["I'm fine.", "I'm ten.", "Yes, I am.", "My name is Kuba."], answer: 1 },
  ],
  bands: ["Pre-A1", "Pre-A1", "A1", "A1", "A1", "A1"],
  selfAssessment: ["Pre-A1", "Pre-A1", "A1", "A1"],
};

const teen: PlacementTest = {
  ageGroup: "TEEN",
  questions: [
    { id: "t1", skill: "LISTENING", label: "LISTENING", audio: { text: "Hey, it's Sam. The bus is running late, so I'll be there at quarter past seven.", lang: "en-GB", rate: 0.95 }, question: "When will Sam arrive?", options: ["7:00", "7:15", "7:45", "6:45"], answer: 1 },
    { id: "t2", skill: "SPEAKING", label: "REAL LIFE", context: "You're meeting your friends at 7, but your bus is running late.", question: "What would you text them?", options: ["I'm running a bit late. I'll be there around 7:15.", "I late bus.", "I am delay.", "Yesterday I arrive."], answer: 0 },
    { id: "t3", skill: "GRAMMAR", label: "GRAMMAR", question: "Have you ever ___ to a live concert?", options: ["went", "go", "been", "going"], answer: 2 },
    { id: "t4", skill: "VOCABULARY", label: "VOCABULARY", question: "This game is so ___ — I literally can't stop playing.", options: ["addictive", "boring", "expensive", "quiet"], answer: 0 },
    { id: "t5", skill: "READING", label: "READING", context: "Can’t make it tonight — loads of homework. Saturday instead?", question: "What does she suggest?", options: ["Doing homework together", "Meeting on Saturday", "Going out tonight", "Cancelling for good"], answer: 1 },
  ],
  bands: ["A1", "A1", "A2", "A2", "B1", "B1"],
  selfAssessment: ["A1", "A1", "A2", "B1"],
};

const adult: PlacementTest = {
  ageGroup: "ADULT",
  questions: [
    { id: "a1", skill: "LISTENING", label: "Listening", level: "A2", audio: { text: "Hi, I'm calling because I'd like to change my appointment from Tuesday to Thursday.", lang: "en-GB", rate: 0.95 }, question: "Why is the person calling?", options: ["To change an appointment", "To cancel a hotel booking", "To order something", "To ask for directions"], answer: 0 },
    { id: "a2", skill: "GRAMMAR", label: "Grammar", level: "A2", question: "We ___ in this flat since 2019.", options: ["live", "lived", "have lived", "are living"], answer: 2 },
    { id: "a3", skill: "READING", label: "Reading", level: "A2–B1", context: "Due to maintenance, the office car park will be closed on Monday. Staff are advised to use public transport.", question: "What should staff do on Monday?", options: ["Park as usual", "Use public transport", "Work from home", "Call maintenance"], answer: 1 },
    { id: "a4", skill: "SPEAKING", label: "Speaking", level: "B1", context: "You've booked a hotel room, but when you arrive the receptionist can't find your reservation.", question: "What would you say?", options: ["I booked it online last week — here's my confirmation.", "Find my room now.", "I am reservation yesterday.", "Where is hotel?"], answer: 0 },
    { id: "a5", skill: "VOCABULARY", label: "Vocabulary", level: "B1", question: "Could you ___ me know by Friday?", options: ["let", "make", "tell", "give"], answer: 0 },
  ],
  bands: ["A1", "A1", "A2", "A2", "B1", "B1"],
  selfAssessment: ["A1", "A1", "A2", "B1"],
};

export const PLACEMENT_TESTS: Record<AgeGroup, PlacementTest> = { CHILD: child, TEEN: teen, ADULT: adult };
