import type { Course, Unit } from "@/types";
import { buildUnit, checkpoint, review, untitled, type MissionSpec } from "../helpers";
import { foodConcepts, foodTown } from "./a1/food";

/**
 * CHILD course ("Explorer"): worlds from Pre-A1 to B2.
 *
 * Every world has a word target, grammar topics from the CEFR program and a
 * numbered path of missions. A world ends with a review and a challenge.
 * Mission titles are written for Pre-A1 and A1; later levels have their
 * worlds, word targets and grammar set, and wait for titles and content.
 */

interface WorldSpec {
  id: string;
  level: Unit["level"];
  title: string;
  canDo: string;
  words: number;
  grammar: string[];
  topic?: string;
  /** Learning missions: titles, or a number while they are still untitled. */
  missions: string[] | number;
}

let order = 0;

function world({ id, missions, ...spec }: WorldSpec): Unit {
  const learning: MissionSpec[] = typeof missions === "number" ? untitled(missions) : missions;
  return buildUnit({
    ...spec,
    id: `child.${id}`,
    order: ++order,
    missionLabel: "Misja",
    missions: [...learning, review("Powtórka"), checkpoint(`Wyzwanie: ${spec.title}`)],
  });
}

/** A world defined in its own file takes the next place on the path. */
function placed(unit: Unit): Unit {
  return { ...unit, order: ++order };
}

export const childCourse: Course = {
  id: "child",
  ageGroup: "CHILD",
  title: "Od „Hello” do World Explorer",
  levels: [
    { level: "Pre-A1", title: "Starter" },
    { level: "A1", title: "First Steps" },
    { level: "A2", title: "Out & About" },
    { level: "B1", title: "Big Cities" },
    { level: "B2", title: "World Explorer" },
  ],
  units: [
    /* ---------- Pre-A1 · 200 words ---------- */
    world({
      id: "hello-world", topic: "family",
      level: "Pre-A1",
      title: "Hello World",
      canDo: "Witasz się i przedstawiasz",
      words: 100,
      grammar: ["pa1.be", "pa1.articles-plurals", "pa1.imperatives"],
      missions: ["Hello!", "What's your name?", "Numbers 1–10", "Colours", "How are you?", "How old are you?", "Numbers 11–20", "Days of the week", "Stand up, sit down", "Goodbye!"],
    }),
    world({
      id: "home", topic: "home",
      level: "Pre-A1",
      title: "Home",
      canDo: "Nazywasz rzeczy w domu i rodzinę",
      words: 100,
      grammar: ["pa1.this-that", "pa1.have-got", "pa1.can"],
      missions: ["My family", "This is my mum", "Rooms", "In my room", "Toys", "I have got…", "Pets", "I can jump", "Clothes", "Where is it?"],
    }),

    /* ---------- A1 · 400 words ---------- */
    world({
      id: "school", topic: "school",
      level: "A1",
      title: "School",
      canDo: "Mówisz o szkole i planie lekcji",
      words: 80,
      grammar: ["a1.present-simple", "a1.possessives"],
      missions: ["In my school bag", "My classroom", "School subjects", "What time is it?", "My timetable", "Whose is it?", "At break time", "After school"],
    }),
    placed(foodTown),
    world({
      id: "city", topic: "city",
      level: "A1",
      title: "City",
      canDo: "Pytasz o drogę i kupujesz bilety",
      words: 80,
      grammar: ["a1.there-is", "a1.prepositions"],
      missions: ["Places in town", "There is a park", "Where is the bank?", "Turn left, turn right", "By bus, by train", "A ticket, please", "At the shop", "My street"],
    }),
    world({
      id: "my-day",
      level: "A1",
      title: "My Day",
      canDo: "Opowiadasz o swoim dniu i pytasz innych",
      words: 80,
      grammar: ["a1.present-simple-questions", "a1.frequency", "a1.wh-questions"],
      missions: ["Morning routine", "I always, I never", "Do you…?", "Free time", "Hobbies", "What do you do on Saturday?", "My friend's day", "Ask me anything"],
    }),
    world({
      id: "sports-park", topic: "free-time",
      level: "A1",
      title: "Sports Park",
      canDo: "Mówisz, co dzieje się teraz i co było wczoraj",
      words: 80,
      grammar: ["a1.present-continuous", "a1.was-were"],
      missions: ["Sports", "What are you doing?", "At the playground", "The weather", "Seasons", "Yesterday I was…", "Where were you?", "The big match"],
    }),

    /* ---------- A2 · 600 words ---------- */
    world({ id: "adventure-park", level: "A2", title: "Adventure Park", canDo: "Opisujesz, co robiłeś wczoraj", words: 100, grammar: ["a2.past-simple-regular", "a2.past-simple-irregular"], missions: 10 }),
    world({ id: "travel", topic: "travel", level: "A2", title: "Travel", canDo: "Radzisz sobie na lotnisku i w hotelu", words: 100, grammar: ["a2.going-to", "a2.obligation"], missions: 10 }),
    world({ id: "shopping-street", topic: "clothes", level: "A2", title: "Shopping Street", canDo: "Porównujesz rzeczy i robisz zakupy", words: 100, grammar: ["a2.comparatives", "a2.quantifiers"], missions: 10 }),
    world({ id: "nature-camp", topic: "animals", level: "A2", title: "Nature Camp", canDo: "Opowiadasz krok po kroku, co się działo", words: 100, grammar: ["a2.past-continuous", "a2.adverbs"], missions: 10 }),
    world({ id: "party-time", level: "A2", title: "Party Time", canDo: "Planujesz, zapraszasz i umawiasz się", words: 100, grammar: ["a2.will", "a2.first-conditional"], missions: 10 }),
    world({ id: "hobby-club", level: "A2", title: "Hobby Club", canDo: "Mówisz, co już zrobiłeś, a czego jeszcze nie", words: 100, grammar: ["a2.present-perfect"], missions: 10 }),

    /* ---------- B1 · 1000 words ---------- */
    world({ id: "london", level: "B1", title: "London", canDo: "Rozmawiasz z rówieśnikami w Londynie", words: 125, grammar: ["b1.present-perfect-past", "b1.future-forms"], missions: 10 }),
    world({ id: "new-york", level: "B1", title: "New York", canDo: "Wyrażasz opinię i opowiadasz historie", words: 125, grammar: ["b1.past-perfect", "b1.used-to"], missions: 10 }),
    world({ id: "science-lab", level: "B1", title: "Science Lab", canDo: "Wyjaśniasz, jak coś działa", words: 125, grammar: ["b1.passive"], missions: 10 }),
    world({ id: "movie-studio", level: "B1", title: "Movie Studio", canDo: "Opowiadasz film i przekazujesz, co ktoś powiedział", words: 125, grammar: ["b1.reported-speech"], missions: 10 }),
    world({ id: "dream-jobs", level: "B1", title: "Dream Jobs", canDo: "Mówisz o planach i marzeniach", words: 125, grammar: ["b1.second-conditional", "b1.gerund-infinitive"], missions: 10 }),
    world({ id: "green-planet", topic: "animals", level: "B1", title: "Green Planet", canDo: "Rozmawiasz o przyrodzie i środowisku", words: 125, grammar: ["b1.present-perfect-continuous"], missions: 10 }),
    world({ id: "mystery-island", level: "B1", title: "Mystery Island", canDo: "Zgadujesz, wnioskujesz i rozwiązujesz zagadki", words: 125, grammar: ["b1.modals-deduction"], missions: 10 }),
    world({ id: "sydney", level: "B1", title: "Sydney", canDo: "Opisujesz ludzi, miejsca i rzeczy ze szczegółami", words: 125, grammar: ["b1.relative-clauses"], missions: 10 }),

    /* ---------- B2 · 1500 words ---------- */
    world({ id: "newsroom", level: "B2", title: "Newsroom", canDo: "Relacjonujesz wydarzenia jak reporter", words: 150, grammar: ["b2.reported-advanced", "b2.passive-advanced"], missions: 12 }),
    world({ id: "time-machine", level: "B2", title: "Time Machine", canDo: "Opowiadasz dłuższe historie z przeszłości", words: 150, grammar: ["b2.narrative-tenses"], missions: 12 }),
    world({ id: "space-station", level: "B2", title: "Space Station", canDo: "Mówisz o tym, co będzie się działo w przyszłości", words: 150, grammar: ["b2.future-perfect-continuous"], missions: 12 }),
    world({ id: "debate-club", level: "B2", title: "Debate Club", canDo: "Bronisz swojego zdania i odpowiadasz na argumenty", words: 150, grammar: ["b2.linking", "b2.emphasis"], missions: 12 }),
    world({ id: "what-if-lab", level: "B2", title: "What If Lab", canDo: "Rozważasz, co by było, gdyby…", words: 150, grammar: ["b2.third-conditional", "b2.mixed-conditionals"], missions: 12 }),
    world({ id: "detective-agency", level: "B2", title: "Detective Agency", canDo: "Wyciągasz wnioski o tym, co się stało", words: 150, grammar: ["b2.past-modals"], missions: 12 }),
    world({ id: "art-gallery", level: "B2", title: "Art Gallery", canDo: "Opisujesz dzieła, wrażenia i emocje", words: 150, grammar: ["b2.relative-advanced"], missions: 12 }),
    world({ id: "tech-hub", level: "B2", title: "Tech Hub", canDo: "Rozmawiasz o technologii i wynalazkach", words: 150, grammar: ["b2.phrasal-verbs"], missions: 12 }),
    world({ id: "wish-mountain", level: "B2", title: "Wish Mountain", canDo: "Mówisz o życzeniach i o tym, czego żałujesz", words: 150, grammar: ["b2.wish"], missions: 12 }),
    world({ id: "world-explorer", level: "B2", title: "World Explorer", canDo: "Swobodnie rozmawiasz o wszystkim", words: 150, grammar: ["b2.linking", "b2.phrasal-verbs"], missions: 12 }),
  ],
  concepts: Object.fromEntries(foodConcepts.map((c) => [c.id, c])),
};
