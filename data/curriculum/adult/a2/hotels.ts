import type { Concept, Lesson, Unit } from "@/types";
import { buildUnit, review } from "../../helpers";

/**
 * ADULT · A2 · Hotels & accommodation
 * Sample content for the first milestone. To be reviewed with an English teacher.
 */

const UNIT_ID = "adult.hotels";

export const hotelConcepts: Concept[] = [
  {
    id: "adult.c.reservation",
    label: "reservation",
    translation: "rezerwacja",
    explanation: "**reservation** = rezerwacja · **reception** = recepcja · **receipt** = paragon.",
    example: "I have a reservation under the name Kowalska.",
    skill: "VOCABULARY",
    practice: {
      id: "adult.c.reservation.check",
      type: "FILL_GAP",
      skill: "VOCABULARY",
      xp: 5,
      conceptId: "adult.c.reservation",
      prompt: "Vocabulary in context",
      sentence: "We made a ___ for two nights.",
      options: [
        { id: "a", text: "receipt" },
        { id: "b", text: "reservation" },
        { id: "c", text: "reception" },
      ],
      correctOptionId: "b",
      feedback: {
        correct: { title: "Correct.", note: "reservation = rezerwacja." },
        incorrect: { title: "Not quite.", note: "reservation = rezerwacja · reception = recepcja · receipt = paragon." },
      },
    },
  },
  {
    id: "adult.c.included",
    label: "included in the price",
    translation: "wliczone w cenę",
    explanation: "**included in the price** = wliczone w cenę.",
    example: "Is breakfast included in the price?",
    skill: "VOCABULARY",
    practice: {
      id: "adult.c.included.check",
      type: "FILL_GAP",
      skill: "VOCABULARY",
      xp: 5,
      conceptId: "adult.c.included",
      prompt: "Vocabulary in context",
      sentence: "Is Wi-Fi ___ in the price?",
      options: [
        { id: "a", text: "inside" },
        { id: "b", text: "contained" },
        { id: "c", text: "included" },
      ],
      correctOptionId: "c",
      feedback: {
        correct: { title: "Correct.", note: "included in the price = wliczone w cenę." },
        incorrect: { title: "Not quite.", note: "Mówimy **included in the price** = wliczone w cenę." },
      },
    },
  },
  {
    id: "adult.c.check-out-time",
    label: "check-out is at…",
    translation: "wymeldowanie jest o…",
    explanation: "Słuchaj frazy **„check-out is at…”** — zwykle pada na samym końcu.",
    example: "Breakfast is served from seven to ten, and check-out is at eleven.",
    skill: "LISTENING",
    practice: {
      id: "adult.c.check-out-time.check",
      type: "MULTIPLE_CHOICE",
      skill: "LISTENING",
      xp: 5,
      conceptId: "adult.c.check-out-time",
      prompt: "When is check-out?",
      context: "“Breakfast is served from seven to ten, and check-out is at eleven.”",
      options: [
        { id: "a", text: "At 7:00" },
        { id: "b", text: "At 10:00" },
        { id: "c", text: "At 11:00" },
      ],
      correctOptionId: "c",
      feedback: {
        correct: { title: "Correct.", note: "check-out is at eleven." },
        incorrect: { title: "Not quite.", note: "„From seven to ten” to śniadanie. Wymeldowanie: **at eleven**." },
      },
    },
  },
  {
    id: "adult.c.past-simple-vs-perfect",
    label: "Past Simple vs Present Perfect",
    translation: "booked / have booked",
    explanation: "Konkretny moment w przeszłości („last week”) → Past Simple: **I booked**. Doświadczenie do teraz → Present Perfect.",
    example: "I booked it online last week.",
    skill: "GRAMMAR",
    practice: {
      id: "adult.c.past-simple-vs-perfect.check",
      type: "FILL_GAP",
      skill: "GRAMMAR",
      xp: 5,
      conceptId: "adult.c.past-simple-vs-perfect",
      prompt: "Grammar in context",
      sentence: "We ___ the tickets yesterday.",
      options: [
        { id: "a", text: "bought" },
        { id: "b", text: "have bought" },
      ],
      correctOptionId: "a",
      feedback: {
        correct: { title: "Correct.", note: "„yesterday” = konkretny czas → Past Simple." },
        incorrect: { title: "Not quite.", note: "„yesterday” = konkretny czas w przeszłości → Past Simple: **bought**." },
      },
    },
  },
  {
    id: "adult.c.could-i-have",
    label: "Could I have…?",
    translation: "uprzejma prośba",
    explanation: "**„Could I have…?”** — najbardziej naturalna uprzejma prośba.",
    example: "Could I have a late check-out, please?",
    skill: "SPEAKING",
    practice: {
      id: "adult.c.could-i-have.check",
      type: "FILL_GAP",
      skill: "SPEAKING",
      xp: 5,
      conceptId: "adult.c.could-i-have",
      prompt: "Vocabulary in context",
      sentence: "Could I ___ an extra pillow, please?",
      options: [
        { id: "a", text: "make" },
        { id: "b", text: "have" },
        { id: "c", text: "do" },
      ],
      correctOptionId: "b",
      feedback: {
        correct: { title: "Correct.", note: "Could I have…? — uprzejma prośba." },
        incorrect: { title: "Not quite.", note: "**Could I have…?** — najbardziej naturalna uprzejma prośba." },
      },
    },
  },
];

export const hotelCheckIn: Lesson = {
  id: "adult.hotels.check-in",
  unitId: UNIT_ID,
  level: "A2",
  order: 1,
  title: "Hotel check-in",
  canDo: "By the end of this lesson you'll be able to check into a hotel and solve a simple booking problem.",
  outcome: "You can now check into a hotel and solve a simple booking problem.",
  estimatedMinutes: 8,
  completionBonus: 5,
  keyPhrases: ["It's under…", "I booked it online", "Could I have…?", "Is breakfast included?"],
  vocabulary: [
    { term: "It's under…", translation: "rezerwacja na nazwisko" },
    { term: "reservation", translation: "rezerwacja" },
    { term: "confirmation number", translation: "numer potwierdzenia" },
    { term: "Is breakfast included?", translation: "Czy śniadanie jest wliczone?" },
    { term: "late check-out", translation: "późne wymeldowanie" },
    { term: "I booked it online", translation: "zarezerwowałam/-em to online" },
    { term: "Could I have…?", translation: "Czy mogę prosić…?" },
  ],
  exercises: [
    {
      id: "hotel.vocab-1",
      type: "FILL_GAP",
      skill: "VOCABULARY",
      xp: 5,
      conceptId: "adult.c.reservation",
      eyebrow: "VOCABULARY IN CONTEXT",
      prompt: "Vocabulary in context",
      sentence: "I have a ___ under the name Kowalska.",
      options: [
        { id: "a", text: "reservation" },
        { id: "b", text: "reception" },
        { id: "c", text: "receipt" },
      ],
      correctOptionId: "a",
      feedback: {
        correct: { title: "Correct.", note: "reservation = rezerwacja · reception = recepcja · receipt = paragon" },
        incorrect: { title: "Not quite — this one returns in review.", note: "reservation = rezerwacja · reception = recepcja · receipt = paragon" },
      },
    },
    {
      id: "hotel.vocab-2",
      type: "FILL_GAP",
      skill: "VOCABULARY",
      xp: 5,
      conceptId: "adult.c.included",
      eyebrow: "VOCABULARY IN CONTEXT",
      prompt: "Vocabulary in context",
      sentence: "Is breakfast ___ in the price?",
      options: [
        { id: "a", text: "contained" },
        { id: "b", text: "inside" },
        { id: "c", text: "included" },
      ],
      correctOptionId: "c",
      feedback: {
        correct: { title: "Correct.", note: "included in the price = wliczone w cenę" },
        incorrect: { title: "Not quite — this one returns in review.", note: "included in the price = wliczone w cenę" },
      },
    },
    {
      id: "hotel.listening",
      type: "LISTENING",
      skill: "LISTENING",
      xp: 5,
      conceptId: "adult.c.check-out-time",
      eyebrow: "LISTENING · AT THE FRONT DESK",
      audio: {
        text: "Here's your key card. Your room is on the fourth floor. Breakfast is served from seven to ten, and check-out is at eleven.",
        lang: "en-GB",
        rate: 0.9,
      },
      speaker: { name: "Receptionist", caption: "0.9×" },
      question: "When is check-out?",
      options: [
        { id: "7", text: "At 7:00" },
        { id: "10", text: "At 10:00" },
        { id: "11", text: "At 11:00" },
        { id: "12", text: "At 12:00" },
      ],
      correctOptionId: "11",
      feedback: {
        correct: {
          title: "Correct — “check-out is at eleven.”",
          note: "Śniadanie trwa „from seven to ten”. W hotelach często usłyszysz też „eleven a.m.” albo „by eleven”.",
        },
        incorrect: {
          title: "Not quite.",
          note: "Recepcjonistka podaje trzy godziny. Słuchaj frazy „check-out is at…” — pada na samym końcu.",
        },
      },
    },
    {
      id: "hotel.grammar",
      type: "FILL_GAP",
      skill: "GRAMMAR",
      xp: 5,
      conceptId: "adult.c.past-simple-vs-perfect",
      eyebrow: "GRAMMAR IN CONTEXT",
      prompt: "Mail do hotelu przed przyjazdem:",
      sentence: "I ___ the room online last week.",
      options: [
        { id: "a", text: "booked" },
        { id: "b", text: "have booked" },
      ],
      correctOptionId: "a",
      feedback: {
        correct: { title: "Correct.", note: "Konkretny moment w przeszłości („last week”) → Past Simple: I booked." },
        incorrect: { title: "Not quite — this one returns in review.", note: "Konkretny moment w przeszłości („last week”) → Past Simple: I booked." },
      },
    },
    {
      id: "hotel.speaking",
      type: "SPEAKING",
      skill: "SPEAKING",
      xp: 5,
      conceptId: "adult.c.could-i-have",
      eyebrow: "SPEAKING · MAKING A REQUEST",
      target: "Could I have a late check-out, please?",
      translation: "Ask the receptionist for a late check-out.",
      tip: {
        text: "Brzmi jeszcze naturalniej: **“Could I possibly have a late check-out — until 1 p.m.?”**",
        audio: { text: "Could I possibly have a late check-out, until one p.m.?", lang: "en-GB", rate: 0.9 },
      },
      passRatio: 0.6,
      feedback: {
        correct: { title: "Task completed." },
        incorrect: { title: "Try again.", note: "Nie wszystkie słowa udało się rozpoznać. Odsłuchaj wzór i powiedz całe zdanie." },
      },
    },
    {
      id: "hotel.scenario",
      type: "DIALOGUE",
      skill: "SPEAKING",
      xp: 10,
      conceptId: "adult.c.past-simple-vs-perfect",
      eyebrow: "SCENARIO",
      prompt: "Hotel reception · London",
      scene: {
        id: "hotel-reception",
        title: "The Marlowe Hotel",
        description:
          "Przyjeżdżasz o 21:40 po długim dniu. Masz rezerwację online. Zamelduj się — i poradź sobie, jeśli coś pójdzie nie tak.",
      },
      script: {
        character: { name: "Receptionist", role: "The Marlowe Hotel", initial: "R" },
        startNodeId: "r0",
        nodes: {
          r0: {
            id: "r0",
            line: "Good evening. Do you have a reservation?",
            options: [
              { text: "Yes, it's under Kowalska.", next: "r1" },
              { text: "Yes, I have a reservation under the name Kowalska.", next: "r1" },
            ],
          },
          r1: {
            id: "r1",
            line: "Let me check… I'm sorry, I can't find your reservation.",
            options: [
              { text: "That's strange. I booked it online last week — I have a confirmation email.", next: "r2" },
              {
                text: "That's strange. I have booked it online last week.",
                hint: "„last week” = konkretny czas w przeszłości → Past Simple: I booked it online last week.",
                conceptId: "adult.c.past-simple-vs-perfect",
              },
            ],
          },
          r2: {
            id: "r2",
            line: "Do you have the confirmation number?",
            options: [
              { text: "Yes, it's KX4471.", next: "r3" },
              { text: "One moment — here it is: KX4471.", next: "r3" },
            ],
          },
          r3: {
            id: "r3",
            line: "Ah, I see — it's under Kovalska, with a V. Room 412, on the fourth floor.",
            options: [
              { text: "Perfect, thank you. What time is breakfast?", next: "end-breakfast" },
              { text: "Thank you. Could I have a late check-out, please?", next: "end-late" },
            ],
          },
          "end-breakfast": {
            id: "end-breakfast",
            line: "From seven to ten, in the restaurant. Enjoy your stay!",
            options: [],
            end: true,
          },
          "end-late": {
            id: "end-late",
            line: "Of course — until one o'clock. Enjoy your stay!",
            options: [],
            end: true,
          },
        },
      },
      feedback: {
        correct: { title: "Conversation complete." },
        incorrect: { title: "Not quite." },
      },
    },
  ],
};

export const hotelsModule: Unit = buildUnit({
  id: UNIT_ID,
  order: 10,
  level: "A2",
  title: "Hotels & accommodation",
  canDo: "Check in, solve booking problems, make requests",
  description:
    "Po tym module zameldujesz się w hotelu, rozwiążesz problem z rezerwacją i poprosisz o to, czego potrzebujesz — spokojnie i uprzejmie.",
  words: 100,
  grammar: ["a2.obligation", "a2.going-to"],
  topic: "hotel",
  missionLabel: "Lesson",
  missions: [hotelCheckIn, "Booking problems", "Requests & complaints", "Checking out", "Scenario: late arrival", review("Module review")],
});
