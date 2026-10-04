import type { Course, Unit } from "@/types";
import { buildUnit, checkpoint, untitled, type MissionSpec } from "../helpers";
import { travelArc, travelConcepts } from "./a2/travel";

/**
 * TEEN course ("Player"): story arcs made of missions, A1 to B2.
 *
 * Teenagers start at A1, so their A1 also covers the Pre-A1 program.
 * Each arc has a word target, grammar topics and a numbered run of missions
 * that ends with a final mission.
 */

interface ArcSpec {
  id: string;
  level: Unit["level"];
  title: string;
  canDo: string;
  words: number;
  grammar: string[];
  topic?: string;
  /** Mission titles; the last one is the final. `total` pads with untitled missions. */
  missions?: string[];
  total: number;
}

let order = 0;

function arc({ id, missions = [], total, ...spec }: ArcSpec): Unit {
  const final = missions.length ? missions[missions.length - 1] : `${spec.title}: final`;
  const titled: MissionSpec[] = missions.slice(0, -1);
  return buildUnit({
    ...spec,
    id: `teen.${id}`,
    order: ++order,
    missionLabel: "Mission",
    missions: [...titled, ...untitled(total - 1 - titled.length), checkpoint(final)],
  });
}

function placed(unit: Unit): Unit {
  return { ...unit, order: ++order };
}

export const teenCourse: Course = {
  id: "teen",
  ageGroup: "TEEN",
  title: "Campaign",
  levels: [
    { level: "A1", title: "Rookie" },
    { level: "A2", title: "Voyager" },
    { level: "B1", title: "Explorer" },
    { level: "B2", title: "Navigator" },
  ],
  units: [
    /* ---------- A1 · 600 words (Pre-A1 + A1 program) ---------- */
    arc({ id: "social", topic: "family", level: "A1", title: "SOCIAL", canDo: "Przedstawiasz się i zagadujesz do nowych ludzi.", words: 100, grammar: ["pa1.be", "pa1.articles-plurals", "a1.possessives"], total: 8, missions: ["Introduce yourself", "Follow back", "Small talk", "Compliments", "Make plans", "Day one"] }),
    arc({ id: "online", level: "A1", title: "ONLINE", canDo: "Piszesz na czacie, komentujesz i zgłaszasz problem.", words: 100, grammar: ["pa1.have-got", "pa1.can", "pa1.imperatives"], total: 8, missions: ["Gaming chat", "Comments", "Reviews", "Stream talk", "Report a problem", "The collab"] }),
    arc({ id: "home-base", topic: "home", level: "A1", title: "HOME BASE", canDo: "Opisujesz swój pokój, dom i okolicę.", words: 100, grammar: ["pa1.this-that", "a1.there-is", "a1.prepositions"], total: 8 }),
    arc({ id: "daily-grind", level: "A1", title: "DAILY GRIND", canDo: "Opowiadasz o swoim dniu i pytasz innych o ich.", words: 100, grammar: ["a1.present-simple", "a1.present-simple-questions", "a1.frequency"], total: 8 }),
    arc({ id: "food", topic: "food", level: "A1", title: "FOOD", canDo: "Zamawiasz, pytasz o cenę i mówisz, co lubisz.", words: 100, grammar: ["a1.some-any", "a1.would-like", "a1.wh-questions"], total: 8 }),
    arc({ id: "live", level: "A1", title: "LIVE", canDo: "Relacjonujesz, co dzieje się teraz i co było wczoraj.", words: 100, grammar: ["a1.present-continuous", "a1.was-were"], total: 8 }),

    /* ---------- A2 · 600 words ---------- */
    arc({ id: "school", topic: "school", level: "A2", title: "SCHOOL", canDo: "Odnajdujesz się w nowej szkole i w pracy w grupie.", words: 100, grammar: ["a2.obligation", "a2.adverbs"], total: 8, missions: ["Exchange student", "Timetable", "Group project", "Excuses, excuses", "Clubs", "The presentation"] }),
    placed(travelArc),
    arc({ id: "friends", level: "A2", title: "FRIENDS", canDo: "Umawiasz się, planujesz i dogadujesz ze znajomymi.", words: 100, grammar: ["a2.will", "a2.first-conditional"], total: 8, missions: ["Order a burger", "What do you want?", "Split the bill", "Weekend plans", "Group chat drama", "Birthday surprise"] }),
    arc({ id: "music", level: "A2", title: "MUSIC & CULTURE", canDo: "Mówisz o muzyce i filmach, porównujesz i oceniasz.", words: 100, grammar: ["a2.comparatives", "a2.present-perfect"], total: 8, missions: ["Playlists", "Concert tickets", "Lyrics", "Film night", "Write a review", "Festival day"] }),
    arc({ id: "shopping", topic: "clothes", level: "A2", title: "SHOPPING", canDo: "Kupujesz, wymieniasz i reklamujesz.", words: 100, grammar: ["a2.quantifiers"], total: 8 }),
    arc({ id: "weekend-stories", level: "A2", title: "WEEKEND STORIES", canDo: "Opowiadasz, co się wydarzyło.", words: 100, grammar: ["a2.past-simple-irregular", "a2.past-continuous"], total: 8 }),

    /* ---------- B1 · 1000 words ---------- */
    arc({ id: "city", topic: "city", level: "B1", title: "CITY", canDo: "Radzisz sobie sam w obcym mieście.", words: 125, grammar: ["b1.present-perfect-past"], total: 10 }),
    arc({ id: "future", level: "B1", title: "FUTURE", canDo: "Mówisz o planach, studiach i pracy marzeń.", words: 125, grammar: ["b1.future-forms", "b1.second-conditional"], total: 10 }),
    arc({ id: "media", level: "B1", title: "MEDIA", canDo: "Streszczasz newsy i przekazujesz, co ktoś powiedział.", words: 125, grammar: ["b1.reported-speech"], total: 10 }),
    arc({ id: "tech", level: "B1", title: "TECH", canDo: "Wyjaśniasz, jak coś działa i jak powstało.", words: 125, grammar: ["b1.passive"], total: 10 }),
    arc({ id: "stories", level: "B1", title: "STORIES", canDo: "Opowiadasz historie z przeszłości.", words: 125, grammar: ["b1.past-perfect", "b1.used-to"], total: 10 }),
    arc({ id: "health-sport", topic: "health", level: "B1", title: "HEALTH & SPORT", canDo: "Rozmawiasz o treningu, zdrowiu i nawykach.", words: 125, grammar: ["b1.present-perfect-continuous", "b1.gerund-infinitive"], total: 10 }),
    arc({ id: "mystery", level: "B1", title: "MYSTERY", canDo: "Zgadujesz, wnioskujesz i rozwiązujesz zagadki.", words: 125, grammar: ["b1.modals-deduction"], total: 10 }),
    arc({ id: "people", level: "B1", title: "PEOPLE", canDo: "Opisujesz ludzi i miejsca ze szczegółami.", words: 125, grammar: ["b1.relative-clauses"], total: 10 }),

    /* ---------- B2 · 1500 words ---------- */
    arc({ id: "news", level: "B2", title: "NEWS", canDo: "Relacjonujesz i komentujesz wydarzenia.", words: 150, grammar: ["b2.reported-advanced", "b2.passive-advanced"], total: 10 }),
    arc({ id: "debate", level: "B2", title: "DEBATE", canDo: "Bronisz swojego zdania i zbijasz argumenty.", words: 150, grammar: ["b2.emphasis"], total: 10 }),
    arc({ id: "science", level: "B2", title: "SCIENCE", canDo: "Mówisz o tym, co będzie za 10 i 50 lat.", words: 150, grammar: ["b2.future-perfect-continuous"], total: 10 }),
    arc({ id: "what-if", level: "B2", title: "WHAT IF", canDo: "Rozważasz, co by było, gdyby…", words: 150, grammar: ["b2.third-conditional", "b2.mixed-conditionals"], total: 10 }),
    arc({ id: "case-files", level: "B2", title: "CASE FILES", canDo: "Wyciągasz wnioski o tym, co się stało.", words: 150, grammar: ["b2.past-modals"], total: 10 }),
    arc({ id: "art-design", level: "B2", title: "ART & DESIGN", canDo: "Opisujesz dzieła, styl i wrażenia.", words: 150, grammar: ["b2.relative-advanced"], total: 10 }),
    arc({ id: "startup", level: "B2", title: "STARTUP", canDo: "Przedstawiasz pomysł i przekonujesz do niego.", words: 150, grammar: ["b2.phrasal-verbs"], total: 10 }),
    arc({ id: "second-chances", level: "B2", title: "SECOND CHANCES", canDo: "Mówisz o tym, czego żałujesz i czego byś chciał.", words: 150, grammar: ["b2.wish"], total: 10 }),
    arc({ id: "storytelling", level: "B2", title: "STORYTELLING", canDo: "Opowiadasz dłuższą historię tak, że chce się słuchać.", words: 150, grammar: ["b2.narrative-tenses"], total: 10 }),
    arc({ id: "world", level: "B2", title: "WORLD", canDo: "Rozmawiasz swobodnie na każdy temat.", words: 150, grammar: ["b2.linking"], total: 10 }),
  ],
  concepts: Object.fromEntries(travelConcepts.map((c) => [c.id, c])),
};
