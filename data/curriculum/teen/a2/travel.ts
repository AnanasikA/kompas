import type { Concept, Lesson, Unit } from "@/types";
import { buildUnit, checkpoint, wordConcept } from "../../helpers";

/**
 * TEEN · A2 · TRAVEL arc
 * Sample content for the first milestone. To be reviewed with an English teacher.
 */

const UNIT_ID = "teen.travel";
const en = { correctTitle: "Correct.", incorrectTitle: "Not quite." };

export const travelConcepts: Concept[] = [
  wordConcept("teen.w.boarding-pass", "boarding pass", "karta pokładowa", ["bagaż podręczny", "odprawa", "bramka"], { prompt: "What does “boarding pass” mean?", ...en }),
  wordConcept("teen.w.delayed", "delayed", "opóźniony", ["odwołany", "przesiadka", "przed czasem"], { prompt: "What does “delayed” mean?", ...en }),
  {
    id: "teen.c.proceed-to",
    label: "proceed to gate…",
    translation: "prosimy przejść do bramki…",
    explanation: "**„Passengers are asked to proceed to…”** — formalny komunikat = „prosimy przejść do…”. „Proceed” = przejdź, idź dalej.",
    example: "Passengers are asked to proceed to gate B12.",
    skill: "LISTENING",
    practice: {
      id: "teen.c.proceed-to.check",
      type: "MULTIPLE_CHOICE",
      skill: "LISTENING",
      xp: 5,
      conceptId: "teen.c.proceed-to",
      prompt: "What should you do?",
      context: "“Passengers are asked to proceed to gate B12.”",
      options: [
        { id: "a", text: "Wait at the old gate" },
        { id: "b", text: "Go to gate B12" },
        { id: "c", text: "Go back to check-in" },
      ],
      correctOptionId: "b",
      feedback: {
        correct: { title: "Correct.", note: "**proceed to** = przejdź do." },
        incorrect: { title: "Not quite.", note: "**proceed to gate B12** = przejdź do bramki B12." },
      },
    },
  },
  {
    id: "teen.c.does-question",
    label: "Which gate does the flight leave from?",
    translation: "szyk pytania z „does”",
    explanation: "Szyk pytania: **Which gate + does + the flight + leave from?** Z „the flight” (it) używamy **does**, nie „do”.",
    example: "Which gate does the flight leave from?",
    skill: "GRAMMAR",
    practice: {
      id: "teen.c.does-question.check",
      type: "FILL_GAP",
      skill: "GRAMMAR",
      xp: 5,
      conceptId: "teen.c.does-question",
      prompt: "Pick the right word",
      sentence: "Which gate ___ the flight leave from?",
      options: [
        { id: "a", text: "do" },
        { id: "b", text: "does" },
        { id: "c", text: "is" },
      ],
      correctOptionId: "b",
      feedback: {
        correct: { title: "Correct.", note: "the flight = it → **does**." },
        incorrect: { title: "Not quite.", note: "Z „the flight” (it) używamy **does**, nie „do”." },
      },
    },
  },
  {
    id: "teen.c.indirect-question",
    label: "Could you tell me where… is?",
    translation: "pytanie pośrednie",
    explanation: "Po **could you tell me** szyk jak w zdaniu oznajmującym — „where gate B12 **is**” (nie „is gate B12”).",
    example: "Excuse me, could you tell me where gate B12 is?",
    skill: "GRAMMAR",
    practice: {
      id: "teen.c.indirect-question.check",
      type: "MULTIPLE_CHOICE",
      skill: "GRAMMAR",
      xp: 5,
      conceptId: "teen.c.indirect-question",
      prompt: "Which one sounds right?",
      options: [
        { id: "a", text: "Could you tell me where is gate B12?" },
        { id: "b", text: "Could you tell me where gate B12 is?" },
        { id: "c", text: "Could you tell me where does gate B12?" },
      ],
      correctOptionId: "b",
      feedback: {
        correct: { title: "Correct.", note: "Pytanie pośrednie: „where gate B12 **is**”." },
        incorrect: { title: "Not quite.", note: "Po „could you tell me” czasownik idzie na koniec: „where gate B12 **is**”." },
      },
    },
  },
  {
    id: "teen.c.stay-on-mission",
    label: "Where's B12?",
    translation: "pytanie o drogę",
    explanation: "Najpierw załatw najważniejsze: zapytaj o bramkę — **Where's B12?** albo pełnym zdaniem.",
    example: "My gate changed. Where's B12?",
    skill: "SPEAKING",
    practice: {
      id: "teen.c.stay-on-mission.check",
      type: "MULTIPLE_CHOICE",
      skill: "SPEAKING",
      xp: 5,
      conceptId: "teen.c.stay-on-mission",
      prompt: "Your gate has changed. What do you ask first?",
      options: [
        { id: "a", text: "Where's the nearest coffee shop?" },
        { id: "b", text: "My gate changed. Where's B12?" },
        { id: "c", text: "What time is it in London?" },
      ],
      correctOptionId: "b",
      feedback: {
        correct: { title: "Correct.", note: "Krótko i na temat." },
        incorrect: { title: "Not quite.", note: "Najpierw znajdź swoją bramkę: **Where's B12?**" },
      },
    },
  },
];

export const flightDelayed: Lesson = {
  id: "teen.travel.flight-delayed",
  unitId: UNIT_ID,
  level: "A2",
  order: 2,
  title: "Flight delayed",
  canDo:
    "Po misji zrozumiesz komunikaty lotniskowe i zapytasz o drogę tak, jak robią to native speakerzy — bez szkolnego „Excuse me, where is the gate number twelve?”.",
  outcome: "You can now handle a delayed flight in English.",
  estimatedMinutes: 8,
  completionBonus: 10,
  keyPhrases: ["has been delayed", "proceed to gate", "Could you tell me…?", "How long does it take?"],
  vocabulary: [
    { term: "has been delayed", translation: "jest opóźniony" },
    { term: "proceed to gate…", translation: "przejść do bramki…" },
    { term: "Could you tell me where… is?", translation: "Czy mógłbyś mi powiedzieć, gdzie jest…?" },
    { term: "How long does it take?", translation: "Ile to zajmuje?" },
    { term: "shuttle train", translation: "kolejka lotniskowa" },
    { term: "voucher", translation: "bon" },
  ],
  exercises: [
    {
      id: "flight.word-1",
      type: "MULTIPLE_CHOICE",
      skill: "VOCABULARY",
      xp: 5,
      conceptId: "teen.w.boarding-pass",
      eyebrow: "SPEED ROUND · AIRPORT WORDS",
      prompt: "boarding pass",
      context: "WHAT DOES IT MEAN?",
      options: [
        { id: "a", text: "bagaż podręczny" },
        { id: "b", text: "karta pokładowa" },
        { id: "c", text: "odprawa" },
        { id: "d", text: "bramka" },
      ],
      correctOptionId: "b",
      feedback: {
        correct: { title: "Correct.", note: "**boarding pass** = karta pokładowa." },
        incorrect: { title: "Not quite.", note: "**boarding pass** = karta pokładowa — pokazujesz ją przy wejściu do samolotu." },
      },
    },
    {
      id: "flight.word-2",
      type: "MULTIPLE_CHOICE",
      skill: "VOCABULARY",
      xp: 5,
      conceptId: "teen.w.delayed",
      eyebrow: "SPEED ROUND · AIRPORT WORDS",
      prompt: "delayed",
      context: "WHAT DOES IT MEAN?",
      options: [
        { id: "a", text: "opóźniony" },
        { id: "b", text: "odwołany" },
        { id: "c", text: "przesiadka" },
        { id: "d", text: "przed czasem" },
      ],
      correctOptionId: "a",
      feedback: {
        correct: { title: "Correct.", note: "**delayed** = opóźniony." },
        incorrect: { title: "Not quite.", note: "**delayed** = opóźniony. „Odwołany” to **cancelled**." },
      },
    },
    {
      id: "flight.listening",
      type: "LISTENING",
      skill: "LISTENING",
      xp: 10,
      conceptId: "teen.c.proceed-to",
      eyebrow: "LISTEN TO THE ANNOUNCEMENT",
      audio: {
        text: "Attention please. Flight K L 1 3 4 2 to London has been delayed by two hours. Passengers are asked to proceed to gate B 12.",
        lang: "en-GB",
        rate: 0.92,
      },
      speaker: { name: "PA SYSTEM", caption: "TERMINAL 3" },
      question: "What should you do next?",
      options: [
        { id: "b12", text: "Go to gate B12" },
        { id: "wait", text: "Wait at the old gate" },
        { id: "board", text: "Board the plane now" },
        { id: "leave", text: "Go back to check-in" },
      ],
      correctOptionId: "b12",
      feedback: {
        correct: {
          title: "Correct. Head to B12.",
          note: "**„Passengers are asked to proceed to…”** — formalny komunikat = „prosimy przejść do…”. Usłyszysz to na każdym lotnisku.",
        },
        incorrect: {
          title: "Not quite — listen for the gate.",
          note: "Kluczowe słowa są na końcu: **„proceed to gate B12”**. „Proceed” = przejdź, idź dalej.",
        },
      },
    },
    {
      id: "flight.sentence",
      type: "SENTENCE_BUILDER",
      skill: "GRAMMAR",
      xp: 15,
      conceptId: "teen.c.does-question",
      eyebrow: "SENTENCE CHALLENGE",
      prompt: "Zapytaj, z której bramki odlatuje Twój samolot.",
      source: null,
      tokens: ["the", "Which", "flight", "from?", "does", "leave", "gate", "do"],
      solutions: ["Which gate does the flight leave from?"],
      tokenHints: { do: "Z „the flight” (it) używamy „does”, nie „do”." },
      feedback: {
        correct: {
          title: "Clean.",
          note: "„Which gate does the flight leave from?” — przyimek „from” ląduje na końcu pytania. Tak mówi się naturalnie.",
        },
        incorrect: { title: "Almost.", note: "Szyk pytania: Which gate + does + the flight + leave from?" },
      },
    },
    {
      id: "flight.speaking",
      type: "SPEAKING",
      skill: "SPEAKING",
      xp: 15,
      conceptId: "teen.c.indirect-question",
      eyebrow: "SAY IT · SPEAKING",
      target: "Excuse me, could you tell me where gate B12 is?",
      translation: "Pytanie pośrednie: po „could you tell me” szyk jak w zdaniu oznajmującym — „where gate B12 **is**”.",
      tip: { text: "Tip: **„could you”** w szybkiej mowie brzmi jak „kudżu”. Połącz słowa — zabrzmisz pewniej." },
      passRatio: 0.6,
      feedback: {
        correct: { title: "Nice delivery." },
        incorrect: { title: "Try that again.", note: "Nie wszystkie słowa udało się rozpoznać. Odsłuchaj wzór i powiedz całe pytanie." },
      },
    },
    {
      id: "flight.scenario",
      type: "DIALOGUE",
      skill: "SPEAKING",
      xp: 30,
      conceptId: "teen.c.stay-on-mission",
      eyebrow: "LIVE SCENARIO",
      prompt: "You are at Heathrow Airport. Your gate has changed.",
      scene: {
        id: "heathrow",
        title: "Heathrow · Info desk",
        description: "Find where B12 is and how long it takes to get there.",
        board: {
          title: "DEPARTURES",
          rows: [
            ["KL1342", "LONDON", "B12 · DELAYED"],
            ["BA0861", "DUBLIN", "A9 · BOARDING"],
          ],
        },
      },
      script: {
        character: { name: "Airport employee", role: "INFO DESK · T3", initial: "AE" },
        startNodeId: "n0",
        nodes: {
          n0: {
            id: "n0",
            line: "Hi there. Can I help you?",
            options: [
              { text: "Yeah — my gate changed. Where's B12?", next: "n1" },
              { text: "I'm lost. Flight London.", next: "n0b" },
              {
                text: "Where's the nearest coffee shop?",
                hint: "Off-mission. Najpierw znajdź swoją bramkę!",
                conceptId: "teen.c.stay-on-mission",
              },
            ],
          },
          n0b: {
            id: "n0b",
            line: "No worries. Which flight are you on?",
            options: [
              { text: "KL1342 to London.", next: "n1" },
              { text: "The one to London — it's delayed.", next: "n1" },
            ],
          },
          n1: {
            id: "n1",
            line: "B12 is in Terminal 5. You'll need to take the shuttle train.",
            options: [
              { text: "How long does it take?", next: "n2" },
              { text: "Can I just walk there?", next: "n1w" },
            ],
          },
          n1w: {
            id: "n1w",
            line: "It's pretty far — the train is quicker. It leaves every three minutes.",
            options: [{ text: "OK. How long does it take?", next: "n2" }],
          },
          n2: {
            id: "n2",
            line: "About five minutes. Boarding starts at 14:40.",
            options: [
              { text: "Thanks! Since it's delayed, can I get a food voucher?", next: "n3" },
              { text: "Cool, thanks a lot!", next: "end" },
            ],
          },
          n3: {
            id: "n3",
            line: "Sure. Here's a ten-pound voucher.",
            options: [{ text: "Thank you so much. Bye!", next: "end" }],
          },
          end: { id: "end", line: "Have a good flight!", options: [], end: true },
        },
      },
      feedback: {
        correct: { title: "Mission complete." },
        incorrect: { title: "Not quite." },
      },
    },
  ],
};

export const travelArc: Unit = buildUnit({
  id: UNIT_ID,
  order: 8,
  level: "A2",
  title: "TRAVEL",
  subtitle: "Survive the trip to London.",
  canDo: "Lotniska, opóźnienia, hotel, nowi ludzie. Finał: zgubiłeś się w Londynie i masz 10 minut.",
  description:
    "Jesteś na Heathrow. Lot do domu ma 2 godziny opóźnienia, a bramka właśnie się zmieniła. Zrozum komunikat, znajdź drogę i ogarnij voucher na jedzenie.",
  objectives: ["Zrozum komunikat o opóźnieniu", "Zapytaj, jak dojść do nowej bramki", "Side quest: zdobądź voucher"],
  words: 100,
  grammar: ["a2.going-to", "a2.past-simple-regular"],
  topic: "travel",
  missionLabel: "Mission",
  missions: ["At the airport", flightDelayed, "Find your gate", "Ask for help", "Hotel check-in", "Meet new people", null, checkpoint("Lost in London")],
});
