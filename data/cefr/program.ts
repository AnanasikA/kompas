import type { CEFRLevel } from "@/types";

/**
 * CEFR PROGRAM
 *
 * What a learner has to know to finish each level, the same for children,
 * teenagers and adults. The three courses in /data/curriculum teach this
 * program through different situations; `tests/program.test.ts` checks that
 * every course covers every word target and every grammar topic exactly.
 *
 * Word counts: CEFR itself does not publish official numbers. The targets
 * below follow the ranges commonly used by coursebooks and exam word lists
 * (running totals of about 200 / 600 / 1200 / 2200 / 3700 words). They are a
 * proposal to confirm with the teacher: change a number here and the whole
 * app follows.
 */

export interface GrammarTopic {
  id: string;
  /** Name shown to the learner. */
  label: string;
  /** One model sentence, in English. */
  example: string;
}

export interface CefrLevelProgram {
  level: CEFRLevel;
  /** New words taught at this level (not the running total). */
  words: number;
  grammar: GrammarTopic[];
  /** "After this level I can…", in Polish. */
  canDo: string[];
}

const g = (id: string, label: string, example: string): GrammarTopic => ({ id, label, example });

export const CEFR_PROGRAM: Record<CEFRLevel, CefrLevelProgram> = {
  "Pre-A1": {
    level: "Pre-A1",
    words: 200,
    grammar: [
      g("pa1.be", "to be: am / is / are", "I am Zosia. It is a cat."),
      g("pa1.articles-plurals", "a / an i liczba mnoga", "a dog, an apple, two dogs"),
      g("pa1.this-that", "this / that / these / those", "This is my room."),
      g("pa1.have-got", "have got", "I have got a sister."),
      g("pa1.can", "can / can't", "I can swim. I can't fly."),
      g("pa1.imperatives", "polecenia", "Open the door. Don't run!"),
    ],
    canDo: [
      "witam się, żegnam i przedstawiam",
      "nazywam rzeczy wokół siebie: kolory, liczby, rodzinę, zabawki",
      "rozumiem proste polecenia",
      "mówię, co mam i co potrafię",
    ],
  },
  A1: {
    level: "A1",
    words: 400,
    grammar: [
      g("a1.present-simple", "Present Simple: zdania twierdzące", "She likes pizza."),
      g("a1.present-simple-questions", "Present Simple: pytania i przeczenia", "Do you like tea? I don't like fish."),
      g("a1.possessives", "my / your / his / her i dopełniacz ’s", "This is Tom's bag."),
      g("a1.there-is", "there is / there are", "There is a park near my house."),
      g("a1.some-any", "some / any, rzeczowniki policzalne i niepoliczalne", "Have you got any milk?"),
      g("a1.prepositions", "przyimki miejsca i czasu", "next to the bank, at five o'clock"),
      g("a1.frequency", "przysłówki częstotliwości", "I always walk to school."),
      g("a1.wh-questions", "pytania: what / where / when / who / how", "Where do you live?"),
      g("a1.would-like", "would like i Can I have…?", "I'd like a hot chocolate, please."),
      g("a1.present-continuous", "Present Continuous", "He is playing football now."),
      g("a1.was-were", "was / were", "I was at home yesterday."),
    ],
    canDo: [
      "opowiadam o sobie, rodzinie, szkole lub pracy i swoim dniu",
      "zamawiam jedzenie, kupuję bilet, pytam o cenę i o drogę",
      "zadaję proste pytania i odpowiadam na nie",
      "rozumiem krótkie, wolno mówione wypowiedzi na znane tematy",
    ],
  },
  A2: {
    level: "A2",
    words: 600,
    grammar: [
      g("a2.past-simple-regular", "Past Simple: czasowniki regularne", "We visited a castle."),
      g("a2.past-simple-irregular", "Past Simple: czasowniki nieregularne", "I went to London."),
      g("a2.past-continuous", "Past Continuous", "I was sleeping when you called."),
      g("a2.comparatives", "stopniowanie przymiotników", "bigger, the most interesting"),
      g("a2.going-to", "be going to: plany", "I'm going to visit my grandma."),
      g("a2.will", "will: przewidywania i decyzje", "It will rain tomorrow."),
      g("a2.present-perfect", "Present Perfect: ever / never / just / already / yet", "Have you ever been to Spain?"),
      g("a2.obligation", "must / have to / should", "You should wear a helmet."),
      g("a2.quantifiers", "much / many / a lot of / a few / a little", "How much is it?"),
      g("a2.first-conditional", "pierwszy tryb warunkowy", "If it rains, we'll stay at home."),
      g("a2.adverbs", "przysłówki sposobu", "She speaks quietly."),
    ],
    canDo: [
      "opowiadam, co robiłem wczoraj, w weekend i na wakacjach",
      "radzę sobie w podróży: lotnisko, hotel, sklep, restauracja",
      "planuję, umawiam się, zapraszam i odmawiam",
      "porównuję rzeczy i mówię, co wolę",
    ],
  },
  B1: {
    level: "B1",
    words: 1000,
    grammar: [
      g("b1.present-perfect-past", "Present Perfect a Past Simple, for / since", "I've lived here for two years."),
      g("b1.present-perfect-continuous", "Present Perfect Continuous", "I've been waiting for an hour."),
      g("b1.past-perfect", "Past Perfect", "The film had started when we arrived."),
      g("b1.used-to", "used to", "I used to play the piano."),
      g("b1.future-forms", "przyszłość: will / going to / Present Continuous", "I'm meeting Anna at six."),
      g("b1.second-conditional", "drugi tryb warunkowy", "If I had more time, I would travel."),
      g("b1.passive", "strona bierna: Present i Past Simple", "The bridge was built in 1890."),
      g("b1.reported-speech", "mowa zależna: zdania", "She said she was tired."),
      g("b1.relative-clauses", "zdania z who / which / that / where", "That's the café where we met."),
      g("b1.modals-deduction", "must / might / can't: przypuszczenia", "He must be at work."),
      g("b1.gerund-infinitive", "-ing czy to + bezokolicznik", "I enjoy reading. I want to go."),
    ],
    canDo: [
      "opowiadam historie, opisuję przeżycia, plany i marzenia",
      "wyrażam i krótko uzasadniam swoją opinię",
      "radzę sobie w większości sytuacji w podróży i w nieoczekiwanych problemach",
      "rozumiem główne myśli jasnych wypowiedzi i tekstów na znane tematy",
    ],
  },
  B2: {
    level: "B2",
    words: 1500,
    grammar: [
      g("b2.narrative-tenses", "czasy narracyjne", "I was walking home when I realised I had lost my keys."),
      g("b2.future-perfect-continuous", "Future Continuous i Future Perfect", "By June I will have finished."),
      g("b2.third-conditional", "trzeci tryb warunkowy", "If I had known, I would have come."),
      g("b2.mixed-conditionals", "tryby warunkowe mieszane", "If I had studied, I would be a doctor now."),
      g("b2.wish", "wish / if only", "I wish I had more time."),
      g("b2.past-modals", "should have / could have / must have", "You should have told me."),
      g("b2.passive-advanced", "strona bierna we wszystkich czasach, have something done", "I'm having my car repaired."),
      g("b2.reported-advanced", "mowa zależna: pytania, polecenia, czasowniki raportujące", "He asked me where I lived."),
      g("b2.relative-advanced", "zdania przydawkowe niedefiniujące i imiesłowowe", "My brother, who lives in Leeds, is a chef."),
      g("b2.emphasis", "inwersja i zdania podkreślające", "What I need is a holiday."),
      g("b2.linking", "spójniki i wyrażenia łączące w dłuższej wypowiedzi", "However, on the other hand, as a result"),
      g("b2.phrasal-verbs", "czasowniki frazowe i kolokacje", "put off, come up with, make a decision"),
    ],
    canDo: [
      "rozmawiam swobodnie i spontanicznie z rodzimymi użytkownikami języka",
      "przedstawiam argumenty za i przeciw i bronię swojego zdania",
      "rozumiem dłuższe wypowiedzi, filmy i artykuły na tematy bieżące",
      "piszę jasne, szczegółowe teksty na wiele tematów",
    ],
  },
};

const TOPIC_INDEX: Record<string, GrammarTopic> = Object.fromEntries(
  Object.values(CEFR_PROGRAM).flatMap((p) => p.grammar.map((t) => [t.id, t])),
);

export function getGrammarTopic(id: string): GrammarTopic | undefined {
  return TOPIC_INDEX[id];
}
