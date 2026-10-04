import type { Course, Unit } from "@/types";
import { buildUnit, review, untitled, type MissionSpec } from "../helpers";
import { hotelConcepts, hotelsModule } from "./a2/hotels";

/**
 * ADULT course ("Navigator"): modules built around real-life situations, A1 to B2.
 *
 * Adults start at A1, so their A1 also covers the Pre-A1 program.
 * Each module has a word target, grammar topics and a numbered list of
 * lessons that ends with a module review.
 */

interface ModuleSpec {
  id: string;
  level: Unit["level"];
  title: string;
  canDo: string;
  words: number;
  grammar: string[];
  topic?: string;
  /** Lesson titles written so far; `total` pads with untitled lessons. */
  lessons?: string[];
  total: number;
}

let order = 0;

function mod({ id, lessons = [], total, ...spec }: ModuleSpec): Unit {
  const titled: MissionSpec[] = lessons;
  return buildUnit({
    ...spec,
    id: `adult.${id}`,
    order: ++order,
    missionLabel: "Lesson",
    missions: [...titled, ...untitled(total - 1 - titled.length), review("Module review")],
  });
}

function placed(unit: Unit): Unit {
  return { ...unit, order: ++order };
}

export const adultCourse: Course = {
  id: "adult",
  ageGroup: "ADULT",
  title: "Confident everyday English",
  levels: [
    { level: "A1", title: "Beginner" },
    { level: "A2", title: "Elementary" },
    { level: "B1", title: "Intermediate" },
    { level: "B2", title: "Upper-intermediate" },
  ],
  units: [
    /* ---------- A1 · 600 words (Pre-A1 + A1 program) ---------- */
    mod({ id: "everyday", level: "A1", title: "Everyday conversations", canDo: "Small talk, introductions, giving opinions", words: 100, grammar: ["pa1.be", "pa1.articles-plurals", "a1.possessives"], total: 6, lessons: ["Introductions", "Talking about work", "Opinions", "Plans"] }),
    mod({ id: "travel", topic: "travel", level: "A1", title: "Travel essentials", canDo: "Tickets, directions, airport and transport", words: 100, grammar: ["a1.there-is", "a1.prepositions", "a1.wh-questions"], total: 6, lessons: ["Buying tickets", "Asking for directions", "At the airport", "Public transport"] }),
    mod({ id: "home-family", topic: "home", level: "A1", title: "Home & family", canDo: "Describe your home, family and what you can do", words: 100, grammar: ["pa1.this-that", "pa1.have-got", "pa1.can"], total: 6 }),
    mod({ id: "routines", level: "A1", title: "Daily routines", canDo: "Talk about your day and ask about someone else's", words: 100, grammar: ["a1.present-simple", "a1.present-simple-questions", "a1.frequency"], total: 6 }),
    mod({ id: "shopping", topic: "work", level: "A1", title: "Shopping & money", canDo: "Ask for things, prices and sizes; follow simple instructions", words: 100, grammar: ["a1.some-any", "a1.would-like", "pa1.imperatives"], total: 6 }),
    mod({ id: "free-time", topic: "free-time", level: "A1", title: "Free time & weather", canDo: "Say what is happening now and where you were", words: 100, grammar: ["a1.present-continuous", "a1.was-were"], total: 6 }),

    /* ---------- A2 · 600 words ---------- */
    mod({ id: "health", topic: "health", level: "A2", title: "Health & appointments", canDo: "Describe what happened, book and change appointments", words: 100, grammar: ["a2.past-simple-regular", "a2.past-simple-irregular"], total: 6 }),
    mod({ id: "small-talk", level: "A2", title: "Stories & small talk", canDo: "Tell a short story and compare experiences", words: 100, grammar: ["a2.past-continuous", "a2.comparatives"], total: 6 }),
    mod({ id: "restaurants", topic: "food", level: "A2", title: "Restaurants & services", canDo: "Book a table, order, explain a food allergy, sort out the bill", words: 100, grammar: ["a2.quantifiers", "a2.will"], total: 6, lessons: ["Booking a table", "Ordering a meal", "Explaining a food allergy", "A problem with the bill"] }),
    placed(hotelsModule),
    mod({ id: "work", topic: "work", level: "A2", title: "Work & meetings", canDo: "Join meetings, give updates, agree and disagree politely", words: 100, grammar: ["a2.present-perfect", "a2.adverbs"], total: 6 }),
    mod({ id: "phone", level: "A2", title: "Phone conversations", canDo: "Make calls, leave messages, arrange appointments", words: 100, grammar: ["a2.first-conditional"], total: 6 }),

    /* ---------- B1 · 1000 words ---------- */
    mod({ id: "problems", level: "B1", title: "Problems & solutions", canDo: "Complain politely and get a result", words: 125, grammar: ["b1.modals-deduction"], total: 7 }),
    mod({ id: "social", level: "B1", title: "Social situations", canDo: "Invitations, parties, keeping a conversation going", words: 125, grammar: ["b1.present-perfect-past"], total: 7 }),
    mod({ id: "projects", topic: "work", level: "B1", title: "Work projects", canDo: "Explain processes, plans and deadlines", words: 125, grammar: ["b1.passive", "b1.future-forms"], total: 7 }),
    mod({ id: "money", topic: "work", level: "B1", title: "Money & banking", canDo: "Discuss options and what you would do", words: 125, grammar: ["b1.second-conditional"], total: 7 }),
    mod({ id: "news", level: "B1", title: "News & media", canDo: "Summarise what you read and what people said", words: 125, grammar: ["b1.reported-speech"], total: 7 }),
    mod({ id: "lifestyle", topic: "health", level: "B1", title: "Health & lifestyle", canDo: "Talk about habits, routines and changes", words: 125, grammar: ["b1.present-perfect-continuous", "b1.gerund-infinitive"], total: 7 }),
    mod({ id: "life-stories", level: "B1", title: "Life stories", canDo: "Tell your story: where you lived, what you used to do", words: 125, grammar: ["b1.past-perfect", "b1.used-to"], total: 7 }),
    mod({ id: "people-places", level: "B1", title: "People & places", canDo: "Describe people, places and things in detail", words: 125, grammar: ["b1.relative-clauses"], total: 7 }),

    /* ---------- B2 · 1500 words ---------- */
    mod({ id: "presentations", level: "B2", title: "Presentations", canDo: "Structure a talk and stress what matters", words: 150, grammar: ["b2.linking", "b2.emphasis"], total: 8 }),
    mod({ id: "interviews", level: "B2", title: "Job interviews", canDo: "Tell your career story with confidence", words: 150, grammar: ["b2.narrative-tenses"], total: 8 }),
    mod({ id: "current-affairs", level: "B2", title: "Current affairs", canDo: "Report and discuss what is in the news", words: 150, grammar: ["b2.reported-advanced", "b2.passive-advanced"], total: 8 }),
    mod({ id: "decisions", level: "B2", title: "Decisions & regrets", canDo: "Talk about what you would have done differently", words: 150, grammar: ["b2.third-conditional", "b2.wish"], total: 8 }),
    mod({ id: "feedback", level: "B2", title: "Feedback & conflict", canDo: "Give and take criticism without damage", words: 150, grammar: ["b2.past-modals"], total: 8 }),
    mod({ id: "planning", level: "B2", title: "Planning ahead", canDo: "Describe timelines, forecasts and commitments", words: 150, grammar: ["b2.future-perfect-continuous"], total: 8 }),
    mod({ id: "negotiations", level: "B2", title: "Negotiations", canDo: "Make offers, set conditions, reach a deal", words: 150, grammar: ["b2.mixed-conditionals"], total: 8 }),
    mod({ id: "culture", level: "B2", title: "Culture & ideas", canDo: "Discuss books, films and ideas in depth", words: 150, grammar: ["b2.relative-advanced"], total: 8 }),
    mod({ id: "idiomatic", level: "B2", title: "Idiomatic English", canDo: "Sound natural: phrasal verbs and collocations", words: 150, grammar: ["b2.phrasal-verbs"], total: 8 }),
    mod({ id: "fluency", level: "B2", title: "Fluent conversation", canDo: "Hold a long conversation on any topic", words: 150, grammar: ["b2.linking"], total: 8 }),
  ],
  concepts: Object.fromEntries(hotelConcepts.map((c) => [c.id, c])),
};
