import type { Concept, Unit } from "@/types";
import { buildUnit } from "../../helpers";
import { build, gap, lesson, listen, matching, pictures, quiz, rule, say, scene, wordConcepts, words } from "../kit";

/**
 * CHILD · Pre-A1 · World 1: HELLO WORLD
 *
 * The first world of the course, written in full: 10 missions, a review and
 * a challenge. 100 new words (10 per mission) and the Pre-A1 grammar topics
 * "to be", "a / an and plurals" and "commands".
 *
 * Characters: Leo (a boy from the park), Mia (a new classmate),
 * Ms Bell (teacher), Grandma, Ben (sticker shop), Robo (a toy robot),
 * Coach Tom (English club).
 *
 * To be reviewed with an English teacher before the public launch.
 */

const UNIT_ID = "child.hello-world";
const P = "child.hw";

/* ---------- words, 10 per mission ---------- */

const w1 = words(P, [
  ["hello", "hello", "cześć / dzień dobry", "Hello, Leo!"],
  ["hi", "hi", "hej", "Hi, Mia!"],
  ["good-morning", "good morning", "dzień dobry (rano)", "Good morning, Mum!"],
  ["good-afternoon", "good afternoon", "dzień dobry (po południu)", "Good afternoon, Ms Bell!"],
  ["good-evening", "good evening", "dobry wieczór", "Good evening, Grandma!"],
  ["good-night", "good night", "dobranoc", "Good night, Dad!"],
  ["yes", "yes", "tak", "Yes, please!"],
  ["no", "no", "nie", "No, thank you."],
  ["please", "please", "proszę", "An apple, please."],
  ["thank-you", "thank you", "dziękuję", "Thank you, Leo!"],
] as const);

const w2 = words(P, [
  ["whats-your-name", "What's your name?", "Jak masz na imię?", "Hi! What's your name?"],
  ["my-name-is", "My name is…", "Mam na imię…", "My name is Leo."],
  ["i-am", "I'm (I am)", "jestem", "I'm Mia."],
  ["you-are", "you are", "jesteś", "You are my friend."],
  ["name", "name", "imię", "What's your name?"],
  ["my", "my", "mój / moja", "This is my friend."],
  ["your", "your", "twój / twoja", "What's your name?"],
  ["nice-to-meet-you", "Nice to meet you!", "Miło cię poznać!", "Hi, Mia! Nice to meet you!"],
  ["boy", "boy", "chłopiec", "Leo is a boy."],
  ["girl", "girl", "dziewczynka", "Mia is a girl."],
] as const);

const w3 = words(P, [
  ["one", "one", "jeden", "One apple."],
  ["two", "two", "dwa", "Two cats."],
  ["three", "three", "trzy", "Three balls."],
  ["four", "four", "cztery", "Four dogs."],
  ["five", "five", "pięć", "Five fingers."],
  ["six", "six", "sześć", "Six pencils."],
  ["seven", "seven", "siedem", "Seven days."],
  ["eight", "eight", "osiem", "Eight legs."],
  ["nine", "nine", "dziewięć", "I'm nine."],
  ["ten", "ten", "dziesięć", "Ten fingers."],
] as const);

const w4 = words(P, [
  ["red", "red", "czerwony", "It's red."],
  ["blue", "blue", "niebieski", "The sky is blue."],
  ["green", "green", "zielony", "The grass is green."],
  ["yellow", "yellow", "żółty", "The sun is yellow."],
  ["orange", "orange", "pomarańczowy", "an orange ball"],
  ["pink", "pink", "różowy", "a pink bag"],
  ["purple", "purple", "fioletowy", "a purple pencil"],
  ["black", "black", "czarny", "a black cat"],
  ["white", "white", "biały", "white snow"],
  ["brown", "brown", "brązowy", "a brown dog"],
] as const);

const w5 = words(P, [
  ["how-are-you", "How are you?", "Jak się masz?", "Hi, Grandma! How are you?"],
  ["fine", "fine", "dobrze", "I'm fine, thank you."],
  ["great", "great", "świetnie", "I'm great!"],
  ["so-so", "so-so", "tak sobie", "I'm so-so."],
  ["happy", "happy", "wesoły / szczęśliwy", "I'm happy!"],
  ["sad", "sad", "smutny", "I'm sad."],
  ["tired", "tired", "zmęczony", "I'm tired."],
  ["hungry", "hungry", "głodny", "I'm hungry!"],
  ["thirsty", "thirsty", "spragniony", "I'm thirsty."],
  ["and-you", "And you?", "A ty?", "I'm fine. And you?"],
] as const);

const w6 = words(P, [
  ["how-old", "How old are you?", "Ile masz lat?", "How old are you, Mia?"],
  ["im-ten", "I'm ten.", "Mam dziesięć lat.", "I'm ten. And you?"],
  ["years-old", "years old", "lat (o wieku)", "I'm nine years old."],
  ["birthday", "birthday", "urodziny", "It's my birthday!"],
  ["happy-birthday", "Happy birthday!", "Wszystkiego najlepszego!", "Happy birthday, Mia!"],
  ["cake", "a cake", "tort", "A big cake!"],
  ["present", "a present", "prezent", "A present for you!"],
  ["balloon", "a balloon", "balon", "A red balloon."],
  ["candle", "a candle", "świeczka", "Nine candles!"],
  ["party", "a party", "przyjęcie", "A birthday party."],
] as const);

const w7 = words(P, [
  ["eleven", "eleven", "jedenaście", "eleven stars"],
  ["twelve", "twelve", "dwanaście", "twelve cats"],
  ["thirteen", "thirteen", "trzynaście", "thirteen balls"],
  ["fourteen", "fourteen", "czternaście", "fourteen dogs"],
  ["fifteen", "fifteen", "piętnaście", "fifteen stickers"],
  ["sixteen", "sixteen", "szesnaście", "sixteen pencils"],
  ["seventeen", "seventeen", "siedemnaście", "seventeen balloons"],
  ["eighteen", "eighteen", "osiemnaście", "eighteen books"],
  ["nineteen", "nineteen", "dziewiętnaście", "nineteen candles"],
  ["twenty", "twenty", "dwadzieścia", "twenty fingers and toes"],
] as const);

const w8 = words(P, [
  ["monday", "Monday", "poniedziałek", "See you on Monday!"],
  ["tuesday", "Tuesday", "wtorek", "on Tuesday"],
  ["wednesday", "Wednesday", "środa", "on Wednesday"],
  ["thursday", "Thursday", "czwartek", "on Thursday"],
  ["friday", "Friday", "piątek", "It's Friday!"],
  ["saturday", "Saturday", "sobota", "Today is Saturday."],
  ["sunday", "Sunday", "niedziela", "Tomorrow is Sunday."],
  ["today", "today", "dzisiaj", "What day is it today?"],
  ["tomorrow", "tomorrow", "jutro", "See you tomorrow!"],
  ["week", "week", "tydzień", "Seven days in a week."],
] as const);

const w9 = words(P, [
  ["stand-up", "stand up", "wstań", "Stand up, please."],
  ["sit-down", "sit down", "usiądź", "Sit down, please."],
  ["open", "open", "otwórz", "Open your book."],
  ["close", "close", "zamknij", "Close your book."],
  ["listen", "listen", "słuchaj", "Listen, please!"],
  ["look", "look", "patrz", "Look at the board."],
  ["come-here", "come here", "chodź tutaj", "Come here, Leo!"],
  ["be-quiet", "be quiet", "bądź cicho", "Be quiet, please."],
  ["dont", "don't", "nie (w zakazach)", "Don't run!"],
  ["book", "book", "książka", "Open your book."],
] as const);

const w10 = words(P, [
  ["goodbye", "goodbye", "do widzenia", "Goodbye, Ms Bell!"],
  ["bye", "bye", "pa", "Bye, Mia!"],
  ["see-you", "see you", "do zobaczenia", "See you!"],
  ["see-you-tomorrow", "See you tomorrow!", "Do zobaczenia jutro!", "Bye! See you tomorrow!"],
  ["have-a-nice-day", "Have a nice day!", "Miłego dnia!", "Bye! Have a nice day!"],
  ["thanks", "thanks", "dzięki", "Thanks, Leo!"],
  ["youre-welcome", "You're welcome.", "Proszę bardzo. / Nie ma za co.", "Thank you! – You're welcome."],
  ["sorry", "sorry", "przepraszam (gdy coś zrobisz źle)", "Oh, sorry!"],
  ["excuse-me", "excuse me", "przepraszam (gdy kogoś zaczepiasz)", "Excuse me, where is the park?"],
  ["thats-ok", "That's OK.", "Nic nie szkodzi.", "Sorry! – That's OK."],
] as const);

/* ---------- grammar and usage points ---------- */

const G = {
  greeting: `${P}.g.greeting-time`,
  iAm: `${P}.g.i-am`,
  youAre: `${P}.g.you-are`,
  aAn: `${P}.g.a-an`,
  itsColour: `${P}.g.its-colour`,
  age: `${P}.g.age-be`,
  plural: `${P}.g.plural-s`,
  onDay: `${P}.g.on-day`,
  command: `${P}.g.commands`,
  sorry: `${P}.g.sorry-excuse-me`,
};

const rules: Concept[] = [
  rule(G.greeting, "good morning / good night", "powitanie a pora dnia", "Rano: **Good morning**. Po południu: **Good afternoon**. Wieczorem na powitanie: **Good evening**. **Good night** mówimy, idąc spać.", "Good evening, Grandma!", "VOCABULARY",
    quiz(`${G.greeting}.check`, { prompt: "Jest rano. Wchodzisz do klasy. Co powiesz?", answer: "Good morning!", wrong: ["Good night!", "Good evening!"], conceptId: G.greeting, ok: "Rano mówimy **Good morning**.", hint: "Pomyśl, jaka jest pora dnia." })),
  rule(G.iAm, "I am = I'm", "ja jestem", "Mówiąc o sobie: **I am**, w skrócie **I'm**. Z **I** zawsze **am**.", "I'm Mia.", "GRAMMAR",
    gap(`${G.iAm}.check`, { sentence: "I ___ Leo.", translation: "Jestem Leo.", answer: "am", wrong: ["is", "are"], conceptId: G.iAm, ok: "**I am** = jestem.", hint: "Z **I** łączy się zawsze to samo słowo." })),
  rule(G.youAre, "you are", "ty jesteś", "Z **you** mówimy **are**: **you are**, **How are you?**", "How are you?", "GRAMMAR",
    gap(`${G.youAre}.check`, { sentence: "How ___ you?", translation: "Jak się masz?", answer: "are", wrong: ["am", "is"], conceptId: G.youAre, ok: "**How are you?** — z **you** zawsze **are**.", hint: "Z **you** łączy się zawsze to samo słowo." })),
  rule(G.aAn, "a / an", "przed rzeczownikiem", "Przed jedną rzeczą mówimy **a**: a ball. Gdy słowo zaczyna się samogłoską (a, e, i, o, u), mówimy **an**: an apple, an orange ball.", "an apple, a red ball", "GRAMMAR",
    gap(`${G.aAn}.check`, { sentence: "It's ___ orange.", translation: "To jest pomarańcza.", answer: "an", wrong: ["a", "two"], conceptId: G.aAn, ok: "**orange** zaczyna się na **o** — więc **an**.", hint: "Spójrz, na jaką literę zaczyna się następne słowo." })),
  rule(G.itsColour, "What colour is it? – It's…", "pytanie o kolor", "O kolor pytamy **What colour is it?** Odpowiadamy **It's** + kolor: **It's red.**", "What colour is it? – It's blue.", "GRAMMAR",
    quiz(`${G.itsColour}.check`, { prompt: "Ktoś pyta: “What colour is it?” Co odpowiesz?", answer: "It's green.", wrong: ["Green is it.", "I'm green."], conceptId: G.itsColour, ok: "**It's** + kolor.", hint: "Zacznij od **It's**." })),
  rule(G.age, "I'm ten.", "mówienie o wieku", "Po angielsku wiek podajemy z **am**: **I'm ten** (dosłownie „jestem dziesięć”). Nie mówimy „I have ten years”.", "I'm nine years old.", "GRAMMAR",
    quiz(`${G.age}.check`, { prompt: "Jak powiesz „Mam dziewięć lat”?", answer: "I'm nine.", wrong: ["I have nine years.", "My nine."], conceptId: G.age, ok: "Wiek podajemy z **am**: **I'm nine**.", hint: "Po angielsku wiek mówimy z **am**, a nie z **have**." })),
  rule(G.plural, "two balls", "liczba mnoga z -s", "Gdy rzeczy jest więcej niż jedna, zwykle dodajemy **-s**: one ball → two **balls**.", "twelve cats", "GRAMMAR",
    gap(`${G.plural}.check`, { sentence: "three ___", translation: "trzy koty", answer: "cats", wrong: ["cat", "a cat"], conceptId: G.plural, ok: "Więcej niż jeden → **-s**: three **cats**.", hint: "Kotów jest więcej niż jeden." })),
  rule(G.onDay, "on Monday", "z dniami tygodnia", "Dni tygodnia piszemy **wielką literą** i mówimy z **on**: **on Monday**, **See you on Friday!**", "See you on Friday!", "GRAMMAR",
    gap(`${G.onDay}.check`, { sentence: "See you ___ Friday!", translation: "Do zobaczenia w piątek!", answer: "on", wrong: ["in", "at"], conceptId: G.onDay, ok: "Z dniami tygodnia: **on** Friday.", hint: "Z dniami tygodnia łączy się zawsze to samo krótkie słowo." })),
  rule(G.command, "Stand up! / Don't run!", "polecenia i zakazy", "Polecenie zaczyna się od czasownika: **Open the door!** Zakaz: **Don't** + czasownik: **Don't run!**", "Don't run!", "GRAMMAR",
    quiz(`${G.command}.check`, { prompt: "Jak powiesz „Nie krzycz!” (krzyczeć = shout)?", answer: "Don't shout!", wrong: ["No shout!", "Shout don't!"], conceptId: G.command, ok: "Zakaz: **Don't** + czasownik.", hint: "Zakaz zaczyna się od jednego krótkiego słowa." })),
  rule(G.sorry, "sorry / excuse me", "dwa „przepraszam”", "**Sorry** mówimy, gdy coś zrobiliśmy źle. **Excuse me** — gdy kogoś zaczepiamy, np. pytamy o drogę.", "Excuse me, where is the park?", "VOCABULARY",
    quiz(`${G.sorry}.check`, { prompt: "Przez przypadek popychasz kogoś na korytarzu. Co mówisz?", answer: "Sorry!", wrong: ["Excuse me…", "Thanks!"], conceptId: G.sorry, ok: "Gdy coś zrobimy źle: **Sorry!**", hint: "Coś poszło nie tak z Twojej winy — które „przepraszam” pasuje?" })),
];

/* ---------- mission 1: Hello! ---------- */

const hello = lesson({
  unitId: UNIT_ID,
  id: "l01-hello",
  order: 1,
  title: "Hello!",
  canDo: "Po tej misji przywitasz się o każdej porze dnia i powiesz „proszę” i „dziękuję”.",
  outcome: "Teraz potrafisz przywitać się po angielsku.",
  minutes: 6,
  keyPhrases: ["Hello!", "Good morning!", "Please.", "Thank you."],
  words: Object.values(w1),
  exercises: [
    matching("hw1.words", [w1.hello, w1.yes, w1.no, w1.please, w1["thank-you"]], "Połącz pary: pierwsze słówka"),
    pictures("hw1.morning", {
      word: w1["good-morning"],
      items: [
        ["time-morning", "good morning"],
        ["time-afternoon", "good afternoon"],
        ["time-evening", "good evening"],
        ["time-night", "good night"],
      ],
      ok: "**good morning** mówimy rano, kiedy słońce dopiero wstaje.",
      hint: "Poszukaj obrazka, na którym słońce dopiero wschodzi.",
    }),
    listen("hw1.listen", {
      say: "Good night, Mum!",
      speaker: { name: "Leo", caption: "Leo mówi coś do mamy" },
      question: "Kiedy Leo to mówi?",
      items: [
        ["time-night", "good night"],
        ["time-morning", "good morning"],
        ["time-afternoon", "good afternoon"],
        ["time-evening", "good evening"],
      ],
      conceptId: w1["good-night"].id,
      ok: "**Good night** = dobranoc. Mówimy tak, idąc spać.",
      hint: "Posłuchaj jeszcze raz pierwszych dwóch słów.",
    }),
    quiz("hw1.evening", {
      prompt: "Jest wieczór. Wchodzisz do sklepu. Co powiesz?",
      answer: "Good evening!",
      wrong: [
        ["Good night!", "**Good night** mówimy, idąc spać — nie na powitanie."],
        ["Good morning!", "**Good morning** mówimy rano."],
      ],
      conceptId: G.greeting,
      ok: "Wieczorem na powitanie: **Good evening**.",
      hint: "Pomyśl, jaka jest pora dnia.",
    }),
    gap("hw1.thanks", {
      sentence: "Thank ___!",
      translation: "Dziękuję!",
      answer: "you",
      wrong: [
        ["me", "**Thank me** znaczyłoby „podziękuj mnie”. Dziękujesz komuś innemu."],
        ["your", "**your** = twój. Szukamy słowa „ty”."],
      ],
      conceptId: w1["thank-you"].id,
      skill: "VOCABULARY",
      ok: "**Thank you** = dziękuję.",
      hint: "Dziękujesz komuś — szukamy słowa „ty”.",
    }),
    build("hw1.build", {
      pl: "Dzień dobry, Leo! (rano)",
      tokens: ["morning,", "Leo!", "Good", "night,"],
      solution: "Good morning, Leo!",
      conceptId: w1["good-morning"].id,
      tokenHints: { "night,": "**Good night** = dobranoc. Rano mówimy inaczej." },
      ok: "**Good morning** = dzień dobry (rano).",
      hint: "Najpierw **Good**, potem pora dnia, na końcu imię.",
    }),
    say("hw1.say", {
      target: "Hello! Good morning!",
      translation: "„Cześć! Dzień dobry!”",
      conceptId: w1["good-morning"].id,
      tip: "**morning** czytamy jak **„MOR-ning”** — mocno na pierwszą część.",
      tipAudio: "morning",
    }),
    scene("hw1.scene", {
      title: "W parku",
      prompt: "Przywitaj się z Leo",
      setting: "park",
      character: { name: "Leo", role: "kolega z parku" },
      conceptId: G.greeting,
      start: "hi",
      nodes: {
        hi: ["Good morning!", [
          ["Good morning, Leo!", "apple"],
          ["Good night!", null, "Jest rano! **Good night** mówimy wieczorem, idąc spać.", G.greeting],
          ["Thank you!", null, "Leo się z Tobą wita. Najpierw też się przywitaj.", w1.hello.id],
        ]],
        apple: ["Do you want an apple?", [
          ["Yes, please!", "here"],
          ["No, thank you.", "ok"],
          ["Yes!", null, "Dodaj magiczne słowo — będzie grzecznie.", w1.please.id],
        ]],
        here: ["Here you are!", [
          ["Thank you!", "welcome"],
          ["Good morning!", null, "Leo daje Ci jabłko. Co mówimy, gdy coś dostajemy?", w1["thank-you"].id],
        ]],
        welcome: ["You're welcome!"],
        ok: ["OK! See you!"],
      },
      done: "Scenka zaliczona! Leo już Cię zna.",
    }),
  ],
});

/* ---------- mission 2: What's your name? ---------- */

const name = lesson({
  unitId: UNIT_ID,
  id: "l02-name",
  order: 2,
  title: "What's your name?",
  canDo: "Po tej misji powiesz, jak masz na imię, i zapytasz o imię kolegę.",
  outcome: "Teraz potrafisz się przedstawić.",
  minutes: 6,
  keyPhrases: ["What's your name?", "My name is…", "I'm…", "Nice to meet you!"],
  words: Object.values(w2),
  exercises: [
    matching("hw2.words", [w2.name, w2.my, w2.your, w2.boy, w2.girl]),
    quiz("hw2.meaning", {
      prompt: "Co znaczy “What's your name?”",
      answer: "Jak masz na imię?",
      wrong: [
        ["Ile masz lat?", "To pytanie poznasz w misji 6: **How old are you?**"],
        ["Jak się masz?", "To jest **How are you?** — poznasz je w misji 5."],
      ],
      conceptId: w2["whats-your-name"].id,
      skill: "VOCABULARY",
      eyebrow: "CO TO ZNACZY?",
      ok: "**What's your name?** = Jak masz na imię?",
      hint: "Ważne słowo w pytaniu to **name**.",
    }),
    listen("hw2.listen", {
      say: "Hi! I'm Mia. What's your name?",
      speaker: { name: "Mia", caption: "Nowa koleżanka z klasy" },
      question: "Jak ma na imię nowa koleżanka?",
      answer: "Mia",
      wrong: ["Leo", "Ola", "Emma"],
      conceptId: G.iAm,
      ok: "**I'm Mia** = Jestem Mia.",
      hint: "Imię pada zaraz po **I'm…**",
    }),
    gap("hw2.my-name", {
      sentence: "My ___ is Leo.",
      translation: "Mam na imię Leo.",
      answer: "name",
      wrong: [
        ["your", "**your** = twój. Tu mówisz o sobie."],
        ["is", "**is** już jest w zdaniu."],
      ],
      conceptId: w2["my-name-is"].id,
      skill: "VOCABULARY",
      ok: "**My name is…** = Mam na imię…",
      hint: "Brakuje słowa „imię”.",
    }),
    gap("hw2.i-am", {
      sentence: "I ___ Mia.",
      translation: "Jestem Mia.",
      answer: "am",
      wrong: [
        ["is", "**is** pasuje do he / she / it."],
        ["are", "**are** pasuje do **you**."],
      ],
      conceptId: G.iAm,
      ok: "**I am** (w skrócie **I'm**) = jestem.",
      hint: "Z **I** łączy się zawsze to samo słowo.",
    }),
    build("hw2.build", {
      pl: "Miło cię poznać!",
      tokens: ["to", "Nice", "meet", "you!", "me!"],
      solution: "Nice to meet you!",
      conceptId: w2["nice-to-meet-you"].id,
      tokenHints: { "me!": "Poznajesz kogoś innego — więc „ciebie”, nie „mnie”." },
      ok: "**Nice to meet you!** = Miło cię poznać!",
      hint: "Zacznij od **Nice**.",
    }),
    say("hw2.say", {
      target: "What's your name?",
      translation: "„Jak masz na imię?”",
      conceptId: w2["whats-your-name"].id,
      tip: "**What's** to skrót od **What is**. Czytaj krótko: **„łots”**.",
      tipAudio: "What's your name?",
    }),
    scene("hw2.scene", {
      title: "Pierwszy dzień w szkole",
      prompt: "Poznaj nową koleżankę",
      setting: "classroom",
      character: { name: "Mia", role: "nowa koleżanka" },
      conceptId: w2["my-name-is"].id,
      start: "hi",
      nodes: {
        hi: ["Hi! I'm Mia. What's your name?", [
          ["My name is {name}.", "nice"],
          ["Hi! I'm {name}.", "nice"],
          ["Your name is Mia.", null, "Mia pyta o **Twoje** imię. Powiedz, jak masz na imię.", w2["my-name-is"].id],
        ]],
        nice: ["Nice to meet you, {name}!", [
          ["Nice to meet you too!", "leo"],
          ["What's your name?", null, "Już wiesz, że to Mia! Odpowiedz, że też miło Ci ją poznać.", w2["nice-to-meet-you"].id],
        ]],
        leo: ["This is Leo. He's my friend.", [
          ["Hi, Leo!", "end"],
          ["Hi, Mia!", null, "Mia przedstawia Ci Leo — przywitaj się z nim.", w1.hello.id],
        ]],
        end: ["Hi, {name}! Welcome to our class!"],
      },
      done: "Scenka zaliczona! Masz nową koleżankę.",
    }),
  ],
});

/* ---------- mission 3: Numbers 1–10 ---------- */

const numbers = lesson({
  unitId: UNIT_ID,
  id: "l03-numbers",
  order: 3,
  title: "Numbers 1–10",
  canDo: "Po tej misji policzysz do dziesięciu i powiesz, ile czegoś jest.",
  outcome: "Teraz potrafisz liczyć do dziesięciu.",
  minutes: 6,
  keyPhrases: ["one, two, three…", "How many?", "ten"],
  words: Object.values(w3),
  exercises: [
    matching("hw3.words", [w3.one, w3.three, w3.five, w3.eight, w3.ten], "Połącz liczby"),
    pictures("hw3.four", {
      word: w3.four,
      items: [
        ["count-4", "four"],
        ["count-6", "six"],
        ["count-2", "two"],
        ["count-9", "nine"],
      ],
      hint: "Policz kropki na każdym obrazku.",
    }),
    listen("hw3.listen", {
      say: "Seven balls!",
      speaker: { name: "Leo", caption: "Leo liczy piłki" },
      question: "Ile piłek ma Leo?",
      items: [
        ["count-7", "seven"],
        ["count-1", "one"],
        ["count-3", "three"],
        ["count-5", "five"],
      ],
      conceptId: w3.seven.id,
      ok: "**seven** = siedem.",
      hint: "Posłuchaj liczby jeszcze raz i policz kropki.",
    }),
    quiz("hw3.sum", {
      prompt: "Ile to jest: two + three?",
      answer: "five",
      wrong: [
        ["six", "Policz jeszcze raz: **two** to 2, **three** to 3."],
        ["four", "Policz jeszcze raz: **two** to 2, **three** to 3."],
      ],
      conceptId: w3.five.id,
      skill: "VOCABULARY",
      eyebrow: "ZAGADKA",
      ok: "2 + 3 = 5 → **five**.",
      hint: "Policz na palcach.",
    }),
    gap("hw3.three", {
      sentence: "one, two, ___, four",
      translation: "jeden, dwa, …, cztery",
      answer: "three",
      wrong: [
        ["tree", "**tree** = drzewo! Liczba pisze się z **h** w środku."],
        ["ten", "**ten** = 10. Szukamy liczby, która jest między 2 a 4."],
      ],
      conceptId: w3.three.id,
      skill: "VOCABULARY",
      ok: "**three** = trzy. Uwaga: **tree** to drzewo!",
      hint: "Szukamy liczby między 2 a 4.",
    }),
    build("hw3.build", {
      pl: "sześć, siedem, osiem",
      tokens: ["seven,", "eight", "six,", "nine"],
      solution: "six, seven, eight",
      conceptId: w3.eight.id,
      tokenHints: { nine: "**nine** = 9. Liczysz tylko do 8." },
      ok: "**six, seven, eight** = 6, 7, 8.",
      hint: "Ułóż liczby po kolei: od najmniejszej.",
    }),
    say("hw3.say", {
      target: "One, two, three, four, five!",
      translation: "Policz na głos do pięciu.",
      conceptId: w3.three.id,
      tip: "**three** zaczyna się od **th**: końcówka języka między zębami i lekko dmuchasz.",
      tipAudio: "three",
    }),
    scene("hw3.scene", {
      title: "Skrzynia z zabawkami",
      prompt: "Policz zabawki z Leo",
      setting: "home",
      character: { name: "Leo", role: "kolega" },
      conceptId: w3.three.id,
      board: { title: "TOY BOX", rows: [["teddies", "● ● ●"], ["cars", "● ● ● ● ●"], ["balls", "● ●"]] },
      start: "teddies",
      nodes: {
        teddies: ["Let's count the toys! How many teddies?", [
          ["Three!", "cars"],
          ["Two!", null, "Policz misie (teddies) na tablicy jeszcze raz.", w3.three.id],
          ["Five!", null, "Policz misie (teddies) na tablicy jeszcze raz.", w3.three.id],
        ]],
        cars: ["Yes! And how many cars?", [
          ["Five!", "balls"],
          ["Four!", null, "Policz auta (cars) jeszcze raz.", w3.five.id],
        ]],
        balls: ["Great! And balls?", [
          ["Two!", "end"],
          ["Ten!", null, "Tyle piłek nie ma! Policz jeszcze raz.", w3.two.id],
        ]],
        end: ["Three, five, two. Great counting!"],
      },
      done: "Scenka zaliczona! Wszystko policzone.",
    }),
  ],
});

/* ---------- mission 4: Colours ---------- */

const colours = lesson({
  unitId: UNIT_ID,
  id: "l04-colours",
  order: 4,
  title: "Colours",
  canDo: "Po tej misji nazwiesz dziesięć kolorów i powiesz, jakiego koloru coś jest.",
  outcome: "Teraz potrafisz nazywać kolory.",
  minutes: 7,
  keyPhrases: ["What colour is it?", "It's red.", "a red ball", "an orange ball"],
  words: Object.values(w4),
  exercises: [
    matching("hw4.words", [w4.red, w4.blue, w4.green, w4.yellow, w4.black], "Połącz kolory"),
    pictures("hw4.purple", {
      word: w4.purple,
      items: [
        ["colour-purple", "purple"],
        ["colour-pink", "pink"],
        ["colour-blue", "blue"],
        ["colour-red", "red"],
      ],
      hint: "To kolor śliwek i fiołków.",
    }),
    listen("hw4.listen", {
      say: "It's green.",
      speaker: { name: "Ms Bell", caption: "Pani Bell pokazuje farbę" },
      question: "Jaki to kolor?",
      items: [
        ["colour-green", "green"],
        ["colour-yellow", "yellow"],
        ["colour-blue", "blue"],
        ["colour-brown", "brown"],
      ],
      conceptId: w4.green.id,
      ok: "**green** = zielony, jak trawa.",
      hint: "Posłuchaj ostatniego słowa jeszcze raz.",
    }),
    quiz("hw4.a-an", {
      prompt: "Które jest poprawne?",
      answer: "an orange ball",
      wrong: [
        ["a orange ball", "**orange** zaczyna się na **o**. Przed samogłoską mówimy inaczej niż **a**."],
        ["an red ball", "**red** zaczyna się spółgłoską — wtedy mówimy **a**."],
      ],
      conceptId: G.aAn,
      ok: "Przed samogłoską (a, e, i, o, u): **an** — **an orange ball**.",
      hint: "Spójrz, na jaką literę zaczyna się słowo po **a / an**.",
    }),
    gap("hw4.apple", {
      sentence: "It's ___ apple.",
      translation: "To jest jabłko.",
      answer: "an",
      wrong: [
        ["a", "**apple** zaczyna się na **a** — samogłoskę."],
        ["two", "**two** = dwa. Tu jest jedno jabłko."],
      ],
      conceptId: G.aAn,
      ok: "**an apple** — bo **apple** zaczyna się samogłoską.",
      hint: "Spójrz, na jaką literę zaczyna się **apple**.",
    }),
    build("hw4.build", {
      pl: "Jaki to kolor?",
      tokens: ["colour", "is", "What", "it?", "Who"],
      solution: "What colour is it?",
      conceptId: G.itsColour,
      tokenHints: { Who: "**Who** = kto. O kolor pytamy inaczej." },
      ok: "**What colour is it?** = Jaki to kolor?",
      hint: "Zacznij od **What colour…**",
    }),
    say("hw4.say", {
      target: "It's yellow.",
      translation: "„To jest żółte.”",
      conceptId: w4.yellow.id,
      tip: "**yellow** czytamy jak **„JE-lou”**.",
      tipAudio: "yellow",
    }),
    scene("hw4.scene", {
      title: "Lekcja plastyki",
      prompt: "Pomaluj obrazek z panią Bell",
      setting: "classroom",
      character: { name: "Ms Bell", role: "nauczycielka" },
      conceptId: G.itsColour,
      board: { title: "MY PICTURE", rows: [["sun", "słońce"], ["grass", "trawa"], ["sky", "niebo"]] },
      start: "sun",
      nodes: {
        sun: ["Let's paint a picture! What colour is the sun?", [
          ["It's yellow.", "grass"],
          ["It's black.", null, "Słońce nie jest czarne! Pomyśl, jakie jest w ładny dzień.", w4.yellow.id],
          ["Yellow is it.", null, "Zacznij od **It's**, a potem kolor.", G.itsColour],
        ]],
        grass: ["Good! And the grass?", [
          ["It's green.", "sky"],
          ["It's pink.", null, "Trawa nie jest różowa. Spróbuj jeszcze raz.", w4.green.id],
        ]],
        sky: ["And the sky?", [
          ["It's blue.", "end"],
          ["It's brown.", null, "Niebo nie jest brązowe. Spójrz za okno!", w4.blue.id],
        ]],
        end: ["Yellow, green and blue. What a beautiful picture!"],
      },
      done: "Scenka zaliczona! Piękny obrazek.",
    }),
  ],
});

/* ---------- mission 5: How are you? ---------- */

const howAreYou = lesson({
  unitId: UNIT_ID,
  id: "l05-how-are-you",
  order: 5,
  title: "How are you?",
  canDo: "Po tej misji zapytasz, jak ktoś się czuje, i powiesz, jak się czujesz.",
  outcome: "Teraz potrafisz zapytać „How are you?” i odpowiedzieć.",
  minutes: 7,
  keyPhrases: ["How are you?", "I'm fine, thank you.", "And you?", "I'm tired."],
  words: Object.values(w5),
  exercises: [
    matching("hw5.words", [w5.happy, w5.sad, w5.tired, w5.hungry, w5.thirsty], "Połącz uczucia"),
    pictures("hw5.tired", {
      word: w5.tired,
      items: [
        ["face-tired", "tired"],
        ["face-happy", "happy"],
        ["face-sad", "sad"],
        ["face-hungry", "hungry"],
      ],
      hint: "Ta buzia chce już spać.",
    }),
    listen("hw5.listen", {
      say: "I'm hungry!",
      speaker: { name: "Leo", caption: "Leo wraca ze szkoły" },
      question: "Jak czuje się Leo?",
      items: [
        ["face-hungry", "hungry"],
        ["face-happy", "happy"],
        ["face-tired", "tired"],
        ["face-sad", "sad"],
      ],
      conceptId: w5.hungry.id,
      ok: "**hungry** = głodny.",
      hint: "Posłuchaj ostatniego słowa jeszcze raz.",
    }),
    quiz("hw5.answer", {
      prompt: "Ktoś pyta: “How are you?” Co odpowiesz?",
      answer: "I'm fine, thank you.",
      wrong: [
        ["I'm ten.", "To odpowiedź na pytanie o wiek."],
        ["My name is Ola.", "To odpowiedź na pytanie o imię."],
      ],
      conceptId: w5["how-are-you"].id,
      skill: "VOCABULARY",
      ok: "**How are you?** – **I'm fine, thank you.**",
      hint: "Ktoś pyta, jak się masz.",
    }),
    gap("hw5.are", {
      sentence: "How ___ you?",
      translation: "Jak się masz?",
      answer: "are",
      wrong: [
        ["am", "**am** łączy się z **I**."],
        ["is", "**is** łączy się z he / she / it."],
      ],
      conceptId: G.youAre,
      ok: "Z **you** zawsze **are**: **How are you?**",
      hint: "Z **you** łączy się zawsze to samo słowo.",
    }),
    build("hw5.build", {
      pl: "Dobrze, dziękuję. A ty?",
      tokens: ["fine,", "I'm", "thank", "you.", "And", "you?", "sad"],
      solution: "I'm fine, thank you. And you?",
      conceptId: w5["and-you"].id,
      tokenHints: { sad: "**sad** = smutny. Tu mówisz, że czujesz się dobrze." },
      ok: "**And you?** = A ty? — tak grzecznie odbijamy pytanie.",
      hint: "Zacznij od **I'm fine**, na końcu zapytaj **And you?**",
    }),
    say("hw5.say", {
      target: "How are you?",
      translation: "„Jak się masz?”",
      conceptId: w5["how-are-you"].id,
      tip: "Powiedz to jednym ciągiem, jak jedno słowo: **„HAŁ-ar-ju”**.",
      tipAudio: "How are you?",
    }),
    scene("hw5.scene", {
      title: "Babcia w odwiedzinach",
      prompt: "Porozmawiaj z babcią",
      setting: "home",
      character: { name: "Grandma", role: "babcia" },
      conceptId: w5["how-are-you"].id,
      start: "hi",
      nodes: {
        hi: ["Hello, sweetie! How are you?", [
          ["I'm fine, thank you. And you?", "gran"],
          ["I'm great! And you?", "gran"],
          ["I'm seven.", null, "Babcia pyta, **jak się masz**, a nie o wiek.", w5["how-are-you"].id],
        ]],
        gran: ["I'm OK, but I'm a bit tired. Are you hungry?", [
          ["Yes, I'm hungry!", "food"],
          ["No, I'm not hungry.", "play"],
          ["Yes, I'm sad.", null, "Babcia pyta, czy jesteś **głodny**.", w5.hungry.id],
        ]],
        food: ["Then let's have a sandwich!"],
        play: ["OK! Then let's play a game!"],
      },
      done: "Scenka zaliczona! Babcia jest zadowolona.",
    }),
  ],
});

/* ---------- mission 6: How old are you? ---------- */

const howOld = lesson({
  unitId: UNIT_ID,
  id: "l06-how-old",
  order: 6,
  title: "How old are you?",
  canDo: "Po tej misji powiesz, ile masz lat, i złożysz komuś życzenia urodzinowe.",
  outcome: "Teraz potrafisz powiedzieć, ile masz lat.",
  minutes: 7,
  keyPhrases: ["How old are you?", "I'm ten.", "Happy birthday!"],
  words: Object.values(w6),
  exercises: [
    pictures("hw6.cake", {
      word: w6.cake,
      items: [
        ["cake", "a cake"],
        ["present", "a present"],
        ["balloon", "a balloon"],
        ["candle", "a candle"],
      ],
      hint: "Na nim stoją świeczki.",
    }),
    matching("hw6.words", [w6.birthday, w6.present, w6.balloon, w6.candle, w6.party], "Połącz słowa z urodzin"),
    listen("hw6.listen", {
      say: "I'm nine years old.",
      speaker: { name: "Mia", caption: "Mia mówi o sobie" },
      question: "Ile lat ma Mia?",
      answer: "9",
      wrong: ["5", "10", "4"],
      conceptId: w6["years-old"].id,
      ok: "**I'm nine years old** = Mam dziewięć lat.",
      hint: "Liczba pada zaraz po **I'm…**",
    }),
    quiz("hw6.age", {
      prompt: "Jak powiesz po angielsku „Mam dziesięć lat”?",
      answer: "I'm ten.",
      wrong: [
        ["I have ten years.", "Po angielsku wiek podajemy z **am**, a nie z **have**."],
        ["My ten.", "Brakuje „jestem”."],
      ],
      conceptId: G.age,
      ok: "Wiek: **I'm ten** — dosłownie „jestem dziesięć”.",
      hint: "Po angielsku wiek mówimy z **am**.",
    }),
    gap("hw6.how-old", {
      sentence: "How ___ are you?",
      translation: "Ile masz lat?",
      answer: "old",
      wrong: [
        ["are", "**are** już jest w zdaniu."],
        ["many", "**How many** = ile rzeczy. O wiek pytamy inaczej."],
      ],
      conceptId: w6["how-old"].id,
      skill: "VOCABULARY",
      ok: "**How old are you?** = Ile masz lat? (dosłownie „jak stary jesteś?”)",
      hint: "Pytamy o wiek — dosłownie „jak stary…?”.",
    }),
    build("hw6.build", {
      pl: "Wszystkiego najlepszego, Mia!",
      tokens: ["birthday,", "Happy", "Mia!", "party"],
      solution: "Happy birthday, Mia!",
      conceptId: w6["happy-birthday"].id,
      tokenHints: { party: "**party** = przyjęcie. Życzenia to dwa inne słowa." },
      ok: "**Happy birthday!** = Wszystkiego najlepszego (z okazji urodzin)!",
      hint: "Zacznij od **Happy**.",
    }),
    say("hw6.say", {
      target: "Happy birthday!",
      translation: "„Wszystkiego najlepszego!”",
      conceptId: w6["happy-birthday"].id,
      tip: "W **birthday** jest dźwięk **th**, jak w **three**: język między zęby.",
      tipAudio: "birthday",
    }),
    scene("hw6.scene", {
      title: "Urodziny Mii",
      prompt: "Idziesz na urodziny Mii",
      setting: "party",
      character: { name: "Mia", role: "solenizantka" },
      conceptId: w6["happy-birthday"].id,
      start: "door",
      nodes: {
        door: ["Hi! Come in! It's my birthday!", [
          ["Happy birthday, Mia!", "present"],
          ["Good night, Mia!", null, "To nie pora na dobranoc! Złóż Mii życzenia.", w6["happy-birthday"].id],
          ["Thank you, Mia!", null, "To Mia ma urodziny — złóż jej życzenia.", w6["happy-birthday"].id],
        ]],
        present: ["Thank you! Is it a present for me?", [
          ["Yes! Here you are.", "age"],
          ["Yes, it's a cake.", null, "Dajesz Mii **prezent**, nie tort.", w6.present.id],
        ]],
        age: ["Wow, thank you! I'm nine today. How old are you?", [
          ["I'm ten.", "cake"],
          ["I'm nine years old.", "cake"],
          ["I have ten years.", null, "Wiek po angielsku podajemy z **am**.", G.age],
        ]],
        cake: ["Cool! Let's eat the cake!"],
      },
      done: "Scenka zaliczona! Świetne przyjęcie.",
    }),
  ],
});

/* ---------- mission 7: Numbers 11–20 ---------- */

const teens = lesson({
  unitId: UNIT_ID,
  id: "l07-numbers-11-20",
  order: 7,
  title: "Numbers 11–20",
  canDo: "Po tej misji policzysz do dwudziestu i powiesz, ile jest rzeczy: one ball, two balls.",
  outcome: "Teraz potrafisz liczyć do dwudziestu.",
  minutes: 7,
  keyPhrases: ["eleven, twelve…", "twenty", "one ball, two balls"],
  words: Object.values(w7),
  exercises: [
    matching("hw7.words", [w7.eleven, w7.twelve, w7.fifteen, w7.eighteen, w7.twenty], "Połącz liczby"),
    quiz("hw7.thirteen", {
      prompt: "Która liczba to “thirteen”?",
      answer: "13",
      wrong: [
        ["30", "**thirty** = 30. Liczby z końcówką **-teen** są od 13 do 19."],
        ["3", "**three** = 3. Tu jest końcówka **-teen**."],
      ],
      conceptId: w7.thirteen.id,
      skill: "VOCABULARY",
      eyebrow: "CO TO ZNACZY?",
      ok: "**thirteen** = 13. Końcówka **-teen** = liczby od 13 do 19.",
      hint: "Zwróć uwagę na końcówkę **-teen**.",
    }),
    listen("hw7.listen", {
      say: "Look! Sixteen stickers!",
      speaker: { name: "Leo", caption: "Leo pokazuje naklejki" },
      question: "Ile naklejek ma Leo?",
      answer: "16",
      wrong: ["6", "60", "14"],
      conceptId: w7.sixteen.id,
      ok: "**sixteen** = 16.",
      hint: "Posłuchaj końcówki liczby: **-teen** to liczby od 13 do 19.",
    }),
    gap("hw7.plural", {
      sentence: "one ball, two ___",
      translation: "jedna piłka, dwie piłki",
      answer: "balls",
      wrong: [
        ["ball", "Piłek jest więcej niż jedna."],
        ["a ball", "**a** mówimy tylko przy jednej rzeczy."],
      ],
      conceptId: G.plural,
      ok: "Więcej niż jedna rzecz → **-s**: two **balls**.",
      hint: "Piłek jest więcej niż jedna — co dodajemy na końcu?",
    }),
    quiz("hw7.cats", {
      prompt: "Które jest poprawne?",
      answer: "twelve cats",
      wrong: [
        ["twelve cat", "Kotów jest dwanaście — więcej niż jeden."],
        ["a twelve cats", "**a** mówimy tylko przy jednej rzeczy."],
      ],
      conceptId: G.plural,
      ok: "**twelve cats** — z **-s**, bo kotów jest dużo.",
      hint: "Kotów jest więcej niż jeden.",
    }),
    build("hw7.build", {
      pl: "siedemnaście balonów",
      tokens: ["seventeen", "balloons", "balloon", "seventy"],
      solution: "seventeen balloons",
      conceptId: G.plural,
      tokenHints: {
        balloon: "Balonów jest dużo — potrzebne **-s** na końcu.",
        seventy: "**seventy** = 70. Szukamy 17 — z końcówką **-teen**.",
      },
      ok: "**seventeen balloons** — 17 i **-s**, bo balonów jest dużo.",
      hint: "Najpierw liczba, potem rzecz.",
    }),
    say("hw7.say", {
      target: "eleven, twelve, thirteen",
      translation: "„jedenaście, dwanaście, trzynaście”",
      conceptId: w7.eleven.id,
      tip: "**eleven** czytamy **„i-LE-wen”** — mocno na środek.",
      tipAudio: "eleven",
    }),
    scene("hw7.scene", {
      title: "Sklep z naklejkami",
      prompt: "Kup naklejki",
      setting: "shop",
      character: { name: "Ben", role: "sprzedawca" },
      conceptId: G.plural,
      board: { title: "STICKERS", rows: [["stars", "gwiazdki"], ["cats", "koty"], ["dinosaurs", "dinozaury"]] },
      start: "which",
      nodes: {
        which: ["Hello! We have stars, cats and dinosaurs. What do you want?", [
          ["The cats, please.", "many"],
          ["The dinosaurs, please.", "many"],
          ["The cat, please.", null, "Naklejek z kotami jest dużo — potrzebne **-s**.", G.plural],
        ]],
        many: ["Great! How many stickers?", [
          ["Fifteen, please.", "end"],
          ["Fifty, please.", null, "**fifty** = 50. Tyle naklejek nie mamy! Wybierz liczbę z **-teen**.", w7.fifteen.id],
          ["Fifteen sticker, please.", null, "Naklejek jest piętnaście — dodaj **-s**.", G.plural],
        ]],
        end: ["Here you are. Fifteen stickers!"],
      },
      done: "Scenka zaliczona! Masz nowe naklejki.",
    }),
  ],
});

/* ---------- mission 8: Days of the week ---------- */

const days = lesson({
  unitId: UNIT_ID,
  id: "l08-days",
  order: 8,
  title: "Days of the week",
  canDo: "Po tej misji nazwiesz dni tygodnia i powiesz, co jest w który dzień.",
  outcome: "Teraz znasz dni tygodnia.",
  minutes: 7,
  keyPhrases: ["What day is it today?", "It's Monday.", "on Friday", "tomorrow"],
  words: Object.values(w8),
  exercises: [
    matching("hw8.words", [w8.monday, w8.wednesday, w8.friday, w8.sunday, w8.today], "Połącz dni"),
    quiz("hw8.after", {
      prompt: "Który dzień jest po wtorku (Tuesday)?",
      answer: "Wednesday",
      wrong: [
        ["Thursday", "**Thursday** = czwartek. Szukamy dnia zaraz po wtorku."],
        ["Monday", "**Monday** jest przed wtorkiem."],
      ],
      conceptId: w8.wednesday.id,
      skill: "VOCABULARY",
      eyebrow: "ZAGADKA",
      ok: "Po wtorku jest środa: **Wednesday**.",
      hint: "Poniedziałek, wtorek… co dalej?",
    }),
    listen("hw8.listen", {
      say: "Hooray! Today is Saturday!",
      speaker: { name: "Mia", caption: "Mia cieszy się z weekendu" },
      question: "Jaki dziś dzień?",
      answer: "sobota",
      wrong: ["niedziela", "środa", "piątek"],
      conceptId: w8.saturday.id,
      ok: "**Saturday** = sobota.",
      hint: "Posłuchaj końca zdania jeszcze raz.",
    }),
    gap("hw8.on", {
      sentence: "See you ___ Monday!",
      translation: "Do zobaczenia w poniedziałek!",
      answer: "on",
      wrong: [
        ["in", "Z dniami tygodnia łączy się inne krótkie słowo."],
        ["at", "Z dniami tygodnia łączy się inne krótkie słowo."],
      ],
      conceptId: G.onDay,
      ok: "Z dniami tygodnia: **on** Monday.",
      hint: "Z dniami tygodnia łączy się zawsze to samo krótkie słowo.",
    }),
    quiz("hw8.capital", {
      prompt: "Który zapis jest poprawny?",
      answer: "on Friday",
      wrong: [
        ["on friday", "Dni tygodnia po angielsku piszemy **wielką literą**."],
        ["in Friday", "Z dniami tygodnia mówimy **on**."],
      ],
      conceptId: G.onDay,
      ok: "**on Friday** — z **on** i wielką literą.",
      hint: "Sprawdź pierwszą literę dnia i krótkie słowo przed nim.",
    }),
    build("hw8.build", {
      pl: "Jutro jest niedziela.",
      tokens: ["is", "Tomorrow", "Sunday.", "Today"],
      solution: "Tomorrow is Sunday.",
      conceptId: w8.tomorrow.id,
      tokenHints: { Today: "**today** = dzisiaj. Szukamy słowa „jutro”." },
      ok: "**Tomorrow is Sunday.** = Jutro jest niedziela.",
      hint: "Zacznij od słowa „jutro”.",
    }),
    say("hw8.say", {
      target: "Monday, Tuesday, Wednesday",
      translation: "„poniedziałek, wtorek, środa”",
      conceptId: w8.wednesday.id,
      tip: "W **Wednesday** nie czytamy pierwszego „d”: **„ŁENZ-dej”**.",
      tipAudio: "Wednesday",
    }),
    scene("hw8.scene", {
      title: "Plan tygodnia",
      prompt: "Sprawdź plan z panią Bell",
      setting: "classroom",
      character: { name: "Ms Bell", role: "nauczycielka" },
      conceptId: G.onDay,
      board: { title: "OUR WEEK", rows: [["Monday", "basen"], ["Wednesday", "piłka nożna"], ["Friday", "muzyka"]] },
      start: "today",
      nodes: {
        today: ["Good morning, class! Today we go swimming. What day is it today?", [
          ["It's Monday.", "football"],
          ["It's Sunday.", null, "Sprawdź na tablicy, w który dzień jest basen.", w8.monday.id],
        ]],
        football: ["Yes! And when is football?", [
          ["On Wednesday.", "music"],
          ["In Wednesday.", null, "Z dniami tygodnia mówimy **on**.", G.onDay],
          ["On Tuesday.", null, "Sprawdź na tablicy, kiedy jest piłka nożna.", w8.wednesday.id],
        ]],
        music: ["Great! What about music?", [
          ["On Friday!", "end"],
          ["On Saturday!", null, "Sprawdź na tablicy, kiedy jest muzyka.", w8.friday.id],
        ]],
        end: ["Well done! Now let's go swimming!"],
      },
      done: "Scenka zaliczona! Znasz plan tygodnia.",
    }),
  ],
});

/* ---------- mission 9: Stand up, sit down ---------- */

const commands = lesson({
  unitId: UNIT_ID,
  id: "l09-commands",
  order: 9,
  title: "Stand up, sit down",
  canDo: "Po tej misji zrozumiesz polecenia na lekcji i sam wydasz kilka poleceń.",
  outcome: "Teraz rozumiesz polecenia na lekcji angielskiego.",
  minutes: 7,
  keyPhrases: ["Stand up!", "Sit down, please.", "Listen!", "Don't run!"],
  words: Object.values(w9),
  exercises: [
    matching("hw9.words", [w9["stand-up"], w9["sit-down"], w9.open, w9.close, w9.listen], "Połącz polecenia"),
    listen("hw9.listen", {
      say: "Sit down, please.",
      speaker: { name: "Ms Bell", caption: "Pani Bell mówi do klasy" },
      question: "Co masz zrobić?",
      answer: "usiąść",
      wrong: ["wstać", "otworzyć książkę", "słuchać"],
      conceptId: w9["sit-down"].id,
      ok: "**Sit down** = usiądź.",
      hint: "Posłuchaj jeszcze raz pierwszych dwóch słów.",
    }),
    quiz("hw9.quiet", {
      prompt: "Pani mówi: “Be quiet!” Co robisz?",
      answer: "Jestem cicho.",
      wrong: [
        ["Głośno śpiewam.", "**quiet** = cichy."],
        ["Wstaję.", "Wstać to **stand up**."],
      ],
      conceptId: w9["be-quiet"].id,
      skill: "LISTENING",
      ok: "**Be quiet** = bądź cicho.",
      hint: "**quiet** = cichy.",
    }),
    gap("hw9.open", {
      sentence: "___ your book, please.",
      translation: "Otwórz książkę, proszę.",
      answer: "Open",
      wrong: [
        ["Close", "**Close** = zamknij. Tu trzeba coś zrobić odwrotnie."],
        ["Look", "**Look** = patrz."],
      ],
      conceptId: w9.open.id,
      skill: "VOCABULARY",
      ok: "**Open your book** = Otwórz książkę.",
      hint: "Szukamy słowa „otwórz”.",
    }),
    quiz("hw9.dont", {
      prompt: "Jak powiesz „Nie biegaj!”?",
      answer: "Don't run!",
      wrong: [
        ["No run!", "Zakaz zaczynamy od **Don't**."],
        ["Run don't!", "**Don't** stoi na początku zakazu."],
      ],
      conceptId: G.command,
      ok: "Zakaz: **Don't** + czasownik.",
      hint: "Zakaz zaczyna się od jednego krótkiego słowa.",
    }),
    build("hw9.build", {
      pl: "Chodź tutaj i patrz!",
      tokens: ["here", "Come", "and", "look!", "listen!"],
      solution: "Come here and look!",
      conceptId: w9["come-here"].id,
      tokenHints: { "listen!": "**listen** = słuchaj. Szukamy słowa „patrz”." },
      ok: "**Come here and look!** = Chodź tutaj i patrz!",
      hint: "Zacznij od **Come here**.",
    }),
    say("hw9.say", {
      target: "Stand up, please!",
      translation: "„Wstań, proszę!”",
      conceptId: w9["stand-up"].id,
      tip: "Polecenie mówimy krótko i wyraźnie. **up** czytamy jak **„ap”**.",
      tipAudio: "Stand up",
    }),
    scene("hw9.scene", {
      title: "Gra z robotem",
      prompt: "Wydawaj polecenia robotowi",
      setting: "home",
      character: { name: "Robo", role: "robot do zabawy" },
      conceptId: G.command,
      start: "hi",
      nodes: {
        hi: ["Beep! I'm Robo. Tell me what to do!", [
          ["Stand up, Robo!", "sit"],
          ["Robo stand up is.", null, "Polecenie zaczynamy od czasownika.", G.command],
          ["Hello, Robo!", null, "Robo czeka na **polecenie**.", G.command],
        ]],
        sit: ["Beep! OK, I'm standing. Now what?", [
          ["Sit down, please.", "loud"],
          ["Sit up, please.", null, "Usiądź to **sit** i jeszcze jedno słowo — ale nie **up**.", w9["sit-down"].id],
        ]],
        loud: ["Beep beep! BEEP BEEP BEEP!", [
          ["Be quiet, Robo!", "run"],
          ["Open, Robo!", null, "Robo jest za głośno — powiedz mu, żeby był cicho.", w9["be-quiet"].id],
        ]],
        run: ["Shhh… OK. Can I run now?", [
          ["No! Don't run!", "end"],
          ["Run don't!", null, "Zakaz: **Don't** + czasownik.", G.command],
        ]],
        end: ["OK! Robo is a good robot. Beep!"],
      },
      done: "Scenka zaliczona! Robo słucha poleceń.",
    }),
  ],
});

/* ---------- mission 10: Goodbye! ---------- */

const goodbye = lesson({
  unitId: UNIT_ID,
  id: "l10-goodbye",
  order: 10,
  title: "Goodbye!",
  canDo: "Po tej misji pożegnasz się, przeprosisz i odpowiesz na „dziękuję”.",
  outcome: "Teraz potrafisz się pożegnać i grzecznie odpowiedzieć.",
  minutes: 7,
  keyPhrases: ["Goodbye!", "See you tomorrow!", "Sorry!", "You're welcome."],
  words: Object.values(w10),
  exercises: [
    matching("hw10.words", [w10.goodbye, w10.bye, w10.thanks, w10.sorry, w10["see-you"]], "Połącz pary"),
    quiz("hw10.welcome", {
      prompt: "Ktoś mówi: “Thank you!” Co odpowiesz?",
      answer: "You're welcome.",
      wrong: [
        ["Sorry.", "**Sorry** = przepraszam."],
        ["Good night.", "To jest „dobranoc”."],
      ],
      conceptId: w10["youre-welcome"].id,
      skill: "VOCABULARY",
      ok: "Na „dziękuję” odpowiadamy **You're welcome.** = Proszę bardzo.",
      hint: "Ktoś Ci dziękuje. Co odpowiadasz po polsku? „Proszę bardzo”…",
    }),
    quiz("hw10.excuse", {
      prompt: "Chcesz zapytać panią w sklepie o drogę. Jak zaczniesz?",
      answer: "Excuse me…",
      wrong: [
        ["Sorry!", "**Sorry** mówimy, gdy coś zrobiliśmy źle."],
        ["Goodbye!", "To jest pożegnanie."],
      ],
      conceptId: G.sorry,
      skill: "VOCABULARY",
      ok: "Zaczepiając kogoś: **Excuse me…**",
      hint: "Nic złego się nie stało — po prostu kogoś zaczepiasz.",
    }),
    listen("hw10.listen", {
      say: "Bye! See you tomorrow!",
      speaker: { name: "Leo", caption: "Leo wychodzi ze szkoły" },
      question: "Kiedy zobaczysz Leo?",
      answer: "jutro",
      wrong: ["dzisiaj", "w poniedziałek", "w piątek"],
      conceptId: w10["see-you-tomorrow"].id,
      ok: "**See you tomorrow!** = Do zobaczenia jutro!",
      hint: "Posłuchaj ostatniego słowa jeszcze raz.",
    }),
    gap("hw10.nice-day", {
      sentence: "Have a nice ___!",
      translation: "Miłego dnia!",
      answer: "day",
      wrong: [
        ["today", "**today** = dzisiaj. Szukamy słowa „dzień”."],
        ["name", "**name** = imię."],
      ],
      conceptId: w10["have-a-nice-day"].id,
      skill: "VOCABULARY",
      ok: "**Have a nice day!** = Miłego dnia!",
      hint: "Szukamy słowa „dzień”.",
    }),
    build("hw10.build", {
      pl: "Do widzenia, pani Bell!",
      tokens: ["Ms", "Goodbye,", "Bell!", "Hello,"],
      solution: "Goodbye, Ms Bell!",
      conceptId: w10.goodbye.id,
      tokenHints: { "Hello,": "**Hello** mówimy na powitanie. Tu się żegnasz." },
      ok: "**Goodbye, Ms Bell!** — **Ms** to „pani” przed nazwiskiem.",
      hint: "Zacznij od pożegnania, potem **Ms Bell**.",
    }),
    say("hw10.say", {
      target: "See you tomorrow!",
      translation: "„Do zobaczenia jutro!”",
      conceptId: w10["see-you-tomorrow"].id,
      tip: "**tomorrow** czytamy **„tu-MO-rou”** — mocno na środek.",
      tipAudio: "tomorrow",
    }),
    scene("hw10.scene", {
      title: "Po lekcjach",
      prompt: "Pożegnaj się z Mią",
      setting: "classroom",
      character: { name: "Mia", role: "koleżanka z klasy" },
      conceptId: w10.bye.id,
      start: "oops",
      nodes: {
        oops: ["Oh! Sorry!", [
          ["That's OK.", "pencil"],
          ["You're welcome.", null, "Mia przeprasza, a nie dziękuje. Powiedz, że nic nie szkodzi.", w10["thats-ok"].id],
          ["Good morning!", null, "Mia przeprasza. Powiedz, że nic nie szkodzi.", w10["thats-ok"].id],
        ]],
        pencil: ["Here's your pencil.", [
          ["Thanks, Mia!", "home"],
          ["Sorry, Mia!", null, "Mia oddaje Ci ołówek — podziękuj jej.", w10.thanks.id],
        ]],
        home: ["You're welcome! I'm going home now. Bye!", [
          ["Bye! See you tomorrow!", "end"],
          ["Hello, Mia!", null, "Mia wychodzi — pożegnaj się.", w10.bye.id],
        ]],
        end: ["See you! Have a nice day!"],
      },
      done: "Scenka zaliczona! Do zobaczenia jutro!",
    }),
  ],
});

/* ---------- review ---------- */

const reviewMission = lesson({
  unitId: UNIT_ID,
  id: "l11-review",
  kind: "REVIEW",
  order: 11,
  title: "Powtórka",
  canDo: "Powtarzasz wszystko z Hello World: powitania, liczby, kolory, uczucia, dni i polecenia.",
  outcome: "Hello World powtórzone!",
  minutes: 7,
  keyPhrases: ["Good evening!", "twenty", "How old are you?", "Close your book."],
  words: [],
  exercises: [
    matching("hwr.words", [w1.hello, w3.seven, w4.blue, w8.friday, w5.tired], "Połącz pary ze wszystkich misji"),
    pictures("hwr.orange", {
      word: w4.orange,
      items: [
        ["colour-orange", "orange"],
        ["colour-yellow", "yellow"],
        ["colour-red", "red"],
        ["colour-brown", "brown"],
      ],
      hint: "To kolor marchewki.",
    }),
    listen("hwr.listen", {
      say: "Good evening!",
      speaker: { name: "Grandma", caption: "Babcia wchodzi do domu" },
      question: "Kiedy babcia to mówi?",
      items: [
        ["time-evening", "good evening"],
        ["time-morning", "good morning"],
        ["time-afternoon", "good afternoon"],
        ["time-night", "good night"],
      ],
      conceptId: w1["good-evening"].id,
      ok: "**Good evening** = dobry wieczór.",
      hint: "Posłuchaj drugiego słowa jeszcze raz.",
    }),
    quiz("hwr.twenty", {
      prompt: "Ile to jest: ten + ten?",
      answer: "twenty",
      wrong: [
        ["twelve", "**twelve** = 12."],
        ["two", "**two** = 2."],
      ],
      conceptId: w7.twenty.id,
      skill: "VOCABULARY",
      eyebrow: "ZAGADKA",
      ok: "10 + 10 = 20 → **twenty**.",
      hint: "10 + 10 = ?",
    }),
    gap("hwr.are", {
      sentence: "You ___ my friend.",
      translation: "Jesteś moim przyjacielem.",
      answer: "are",
      wrong: [
        ["am", "**am** łączy się z **I**."],
        ["is", "**is** łączy się z he / she / it."],
      ],
      conceptId: G.youAre,
      ok: "**You are** = ty jesteś.",
      hint: "Z **you** łączy się zawsze to samo słowo.",
    }),
    build("hwr.build", {
      pl: "Ile masz lat?",
      tokens: ["old", "How", "are", "you?", "many"],
      solution: "How old are you?",
      conceptId: w6["how-old"].id,
      tokenHints: { many: "**How many** = ile rzeczy. O wiek pytamy inaczej." },
      ok: "**How old are you?** = Ile masz lat?",
      hint: "Zacznij od **How…**",
    }),
    say("hwr.say", {
      target: "Nice to meet you!",
      translation: "„Miło cię poznać!”",
      conceptId: w2["nice-to-meet-you"].id,
      tip: "Powiedz to płynnie, jak jedno słowo: **„najs-tu-MIT-ju”**.",
      tipAudio: "Nice to meet you!",
    }),
    quiz("hwr.close", {
      prompt: "Pani mówi: “Close your book.” Co robisz?",
      answer: "Zamykam książkę.",
      wrong: [
        ["Otwieram książkę.", "**open** = otwórz. Tu było inne słowo."],
        ["Czytam książkę.", "Posłuchaj pierwszego słowa polecenia."],
      ],
      conceptId: w9.close.id,
      skill: "LISTENING",
      ok: "**Close** = zamknij.",
      hint: "Pierwsze słowo polecenia mówi, co zrobić.",
    }),
  ],
});

/* ---------- challenge ---------- */

const challenge = lesson({
  unitId: UNIT_ID,
  id: "l12-challenge",
  kind: "CHECKPOINT",
  order: 12,
  title: "Wyzwanie: Hello World",
  canDo: "Wielki finał świata: przedstawiasz się, liczysz, mówisz, jak się czujesz, i umawiasz się na konkretny dzień.",
  outcome: "Świat Hello World ukończony!",
  minutes: 9,
  keyPhrases: ["My name is…", "I'm ten.", "See you on Thursday!"],
  words: [],
  exercises: [
    listen("hwc.listen", {
      say: "Twelve, please.",
      speaker: { name: "Ben", caption: "Ben zamawia naklejki" },
      question: "Ile naklejek chce Ben?",
      answer: "12",
      wrong: ["20", "2", "11"],
      conceptId: w7.twelve.id,
      ok: "**twelve** = 12.",
      hint: "Posłuchaj pierwszego słowa jeszcze raz.",
    }),
    pictures("hwc.happy", {
      word: w5.happy,
      items: [
        ["face-happy", "happy"],
        ["face-sad", "sad"],
        ["face-tired", "tired"],
        ["face-hungry", "hungry"],
      ],
      hint: "Ta buzia się uśmiecha.",
    }),
    quiz("hwc.night", {
      prompt: "Jest 21:00, idziesz spać. Co mówisz mamie?",
      answer: "Good night, Mum!",
      wrong: [
        ["Good evening, Mum!", "**Good evening** to powitanie wieczorem."],
        ["Good morning, Mum!", "**Good morning** mówimy rano."],
      ],
      conceptId: G.greeting,
      ok: "Idąc spać: **Good night!**",
      hint: "Idziesz spać — co mówisz po polsku? „Dobranoc”…",
    }),
    gap("hwc.egg", {
      sentence: "It's ___ egg.",
      translation: "To jest jajko.",
      answer: "an",
      wrong: [
        ["a", "**egg** zaczyna się samogłoską **e**."],
        ["two", "Jajko jest jedno."],
      ],
      conceptId: G.aAn,
      ok: "**an egg** — bo **egg** zaczyna się samogłoską.",
      hint: "Spójrz, na jaką literę zaczyna się **egg**.",
    }),
    gap("hwc.saturday", {
      sentence: "See you on ___!",
      translation: "Do zobaczenia w sobotę!",
      answer: "Saturday",
      wrong: [
        ["saturday", "Dni tygodnia piszemy **wielką literą**."],
        ["Sunday", "**Sunday** = niedziela."],
      ],
      conceptId: w8.saturday.id,
      skill: "VOCABULARY",
      ok: "**Saturday** = sobota, zawsze wielką literą.",
      hint: "Sprawdź dzień i pierwszą literę.",
    }),
    build("hwc.build", {
      pl: "Jestem zmęczony / zmęczona.",
      tokens: ["tired.", "I'm", "hungry.", "am"],
      solution: "I'm tired.",
      conceptId: w5.tired.id,
      tokenHints: { am: "**I'm** to już **I am** — nie trzeba dodawać **am**.", "hungry.": "**hungry** = głodny." },
      ok: "**I'm tired.** = Jestem zmęczony / zmęczona.",
      hint: "Wystarczą dwa słowa.",
    }),
    say("hwc.say", {
      target: "Good morning! How are you?",
      translation: "„Dzień dobry! Jak się masz?”",
      conceptId: w5["how-are-you"].id,
    }),
    scene("hwc.scene", {
      title: "Klub angielskiego",
      prompt: "Zapisz się do klubu angielskiego",
      setting: "park",
      character: { name: "Coach Tom", role: "trener klubu" },
      conceptId: w2["my-name-is"].id,
      start: "name",
      nodes: {
        name: ["Hello! Welcome to the English club! What's your name?", [
          ["My name is {name}.", "age"],
          ["I'm fine.", null, "Trener pyta o **imię**.", w2["whats-your-name"].id],
        ]],
        age: ["Nice to meet you, {name}! How old are you?", [
          ["I'm ten.", "feel"],
          ["I'm nine.", "feel"],
          ["I have ten years.", null, "Wiek podajemy z **am**.", G.age],
        ]],
        feel: ["Great! And how are you today?", [
          ["I'm happy! And you?", "day"],
          ["I'm fine, thank you.", "day"],
          ["I'm Monday.", null, "Trener pyta, **jak się czujesz**.", w5["how-are-you"].id],
        ]],
        day: ["I'm great, thanks! Our club is on Tuesday and Thursday. Can you come on Thursday?", [
          ["Yes! See you on Thursday!", "end"],
          ["Yes! See you in Thursday!", null, "Z dniami tygodnia mówimy **on**.", G.onDay],
        ]],
        end: ["Super! Goodbye, {name}! Have a nice day!"],
      },
      done: "Wyzwanie zaliczone! Jesteś w klubie.",
    }),
    matching("hwc.words", [w1["good-night"], w4.purple, w7.nineteen, w8.thursday, w10["excuse-me"]], "Ostatnie pary — dasz radę!"),
  ],
});

/* ---------- the world ---------- */

export const helloWorldConcepts: Concept[] = [
  ...[w1, w2, w3, w4, w5, w6, w7, w8, w9, w10].flatMap(wordConcepts),
  ...rules,
];

export const helloWorld: Unit = buildUnit({
  id: UNIT_ID,
  order: 1,
  level: "Pre-A1",
  title: "Hello World",
  subtitle: "First words",
  canDo: "Witasz się i przedstawiasz",
  description: "Pierwszy świat: powitania, imiona, liczby do dwudziestu, kolory, uczucia, dni tygodnia i polecenia z lekcji.",
  objectives: ["przywitać się i pożegnać", "przedstawić się i powiedzieć, ile masz lat", "liczyć do dwudziestu i nazywać kolory", "rozumieć polecenia na lekcji"],
  words: 100,
  grammar: ["pa1.be", "pa1.articles-plurals", "pa1.imperatives"],
  topic: "family",
  missionLabel: "Misja",
  missions: [hello, name, numbers, colours, howAreYou, howOld, teens, days, commands, goodbye, reviewMission, challenge],
});
