/** Options shown during onboarding. Copy comes from the design prototype. */

export const CHILD_AGES = [8, 9, 10, 11, 12];
export const TEEN_AGES = [13, 14, 15, 16, 17];

export interface ChildInterest {
  id: string;
  label: string;
  desc: string;
  /** Tile colour and the little shape inside it. */
  color: string;
  shape: string;
  rotate?: boolean;
}

export const CHILD_INTERESTS: ChildInterest[] = [
  { id: "animals", label: "Zwierzęta", desc: "Psy, koty, dinozaury i ZOO", color: "oklch(0.93 0.06 145)", shape: "50%" },
  { id: "games", label: "Gry", desc: "Gry na konsoli, telefonie i planszówki", color: "oklch(0.93 0.04 305)", shape: "4px", rotate: true },
  { id: "sport", label: "Sport", desc: "Piłka, rower, basen", color: "oklch(0.93 0.05 225)", shape: "50%" },
  { id: "music", label: "Muzyka", desc: "Piosenki i tańce", color: "oklch(0.94 0.04 35)", shape: "50% 50% 50% 4px" },
  { id: "school", label: "Szkoła", desc: "Żeby było łatwiej na angielskim", color: "oklch(0.94 0.06 80)", shape: "4px" },
  { id: "films", label: "Bajki i filmy", desc: "Oglądać i rozumieć", color: "oklch(0.93 0.01 265)", shape: "50% 50% 4px 4px" },
];

export const CHILD_SELF_LEVELS = [
  { label: "Zaczynam od zera", example: "„Hello”… i tyle." },
  { label: "Znam podstawowe słowa", example: "„cat, dog, red, school”" },
  { label: "Tworzę proste zdania", example: "„I have a brother. He is ten.”" },
  { label: "Potrafię rozmawiać", example: "„Last summer we went to Spain.”" },
  { label: "Nie wiem — sprawdź mój poziom", example: "4 minuty, bez stresu" },
];

export const CHILD_MINUTES = [
  { minutes: 5, desc: "luźno" },
  { minutes: 10, desc: "regularnie · polecane" },
  { minutes: 15, desc: "ambitnie" },
  { minutes: 20, desc: "intensywnie" },
];

export const TEEN_GOALS = [
  { id: "school", label: "SCHOOL & EXAMS", sub: "oceny, egzamin ósmoklasisty, matura" },
  { id: "travel", label: "TRAVEL", sub: "wyjazdy, wymiany, obozy" },
  { id: "games", label: "GAMES & INTERNET", sub: "gry online, streamy, Discord" },
  { id: "music", label: "MUSIC & FILMS", sub: "teksty, seriale bez napisów" },
  { id: "friends", label: "FRIENDS & SOCIAL", sub: "znajomi z zagranicy, social media" },
  { id: "future", label: "MY FUTURE", sub: "studia, praca, wyjazd" },
];

export const TEEN_HARDEST = ["Speaking", "Listening", "Grammar", "Vocabulary", "Writing"];
export const TEEN_MINUTES = [5, 10, 15, 20];

export const ADULT_GOALS = [
  "Everyday life",
  "Work",
  "Travel",
  "Conversation",
  "Moving abroad",
  "Exams",
  "I just want to speak better",
];

export const ADULT_IMPROVE = [
  "Speaking confidently",
  "Understanding people",
  "Vocabulary",
  "Grammar",
  "Writing",
  "Pronunciation",
];

export const ADULT_MINUTES = [
  { minutes: 5, label: "5 min" },
  { minutes: 10, label: "10 min" },
  { minutes: 15, label: "15 min" },
  { minutes: 20, label: "20 min+" },
];
