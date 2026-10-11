import type { Concept, Unit } from "@/types";
import { buildUnit } from "../../helpers";
import { build, gap, lesson, listen, matching, pictures, quiz, rule, say, scene, wordConcepts, words } from "../kit";

/**
 * CHILD · Pre-A1 · World 2: HOME
 *
 * Written in full: 10 missions, a review and a challenge. 100 new words
 * (10 per mission) about family, the house, toys, pets, abilities and
 * clothes, and the Pre-A1 grammar topics "this / that / these / those",
 * "have got" and "can".
 *
 * Characters: Mia and Leo (friends from Hello World), Ms Bell (teacher),
 * Robo (toy robot), Ben (toy shop), Ms Green (pet shop), Coach Tom, Mum.
 *
 * To be reviewed with an English teacher before the public launch.
 */

const UNIT_ID = "child.home";
const P = "child.hm";
/** Points taught in Hello World, practised again here. */
const HW = { plural: "child.hw.g.plural-s", colour: "child.hw.g.its-colour" };

/* ---------- words, 10 per mission ---------- */

const w1 = words(P, [
  ["family", "family", "rodzina", "This is my family."],
  ["mum", "mum", "mama", "This is my mum."],
  ["dad", "dad", "tata", "This is my dad."],
  ["sister", "sister", "siostra", "My sister is ten."],
  ["brother", "brother", "brat", "My brother is six."],
  ["grandma", "grandma", "babcia", "Hello, Grandma!"],
  ["grandpa", "grandpa", "dziadek", "Good night, Grandpa!"],
  ["baby", "baby", "dzidziuś", "a baby brother"],
  ["parents", "parents", "rodzice", "These are my parents."],
  ["this-is", "This is…", "To jest…", "This is my sister."],
] as const);

const w2 = words(P, [
  ["whos-this", "Who's this?", "Kto to jest?", "Who's this? – This is my aunt."],
  ["he", "he", "on", "He's my brother."],
  ["she", "she", "ona", "She's my sister."],
  ["his", "his", "jego", "His name is Tom."],
  ["her", "her", "jej", "Her name is Ola."],
  ["friend", "friend", "przyjaciel / przyjaciółka", "Leo is my friend."],
  ["aunt", "aunt", "ciocia", "My aunt is nice."],
  ["uncle", "uncle", "wujek", "This is my uncle."],
  ["cousin", "cousin", "kuzyn / kuzynka", "Max is my cousin."],
  ["photo", "photo", "zdjęcie", "a family photo"],
] as const);

const w3 = words(P, [
  ["house", "house", "dom", "a big house"],
  ["flat", "flat", "mieszkanie", "I live in a flat."],
  ["kitchen", "kitchen", "kuchnia", "Mum is in the kitchen."],
  ["bathroom", "bathroom", "łazienka", "the bathroom"],
  ["bedroom", "bedroom", "sypialnia", "my bedroom"],
  ["living-room", "living room", "salon (pokój dzienny)", "Dad is in the living room."],
  ["garden", "garden", "ogród", "a garden with flowers"],
  ["door", "door", "drzwi", "Open the door, please."],
  ["window", "window", "okno", "Close the window, please."],
  ["stairs", "stairs", "schody", "Up the stairs!"],
] as const);

const w4 = words(P, [
  ["room", "room", "pokój", "This is my room."],
  ["bed", "bed", "łóżko", "a big bed"],
  ["table", "table", "stół", "a kitchen table"],
  ["chair", "chair", "krzesło", "Sit on the chair."],
  ["lamp", "lamp", "lampa", "a yellow lamp"],
  ["desk", "desk", "biurko", "my desk"],
  ["wardrobe", "wardrobe", "szafa", "a white wardrobe"],
  ["shelf", "shelf", "półka", "books on the shelf"],
  ["rug", "rug", "dywanik", "a red rug"],
  ["picture", "picture", "obrazek", "a picture of a cat"],
] as const);

const w5 = words(P, [
  ["toy", "toy", "zabawka", "my favourite toy"],
  ["ball", "ball", "piłka", "a red ball"],
  ["doll", "doll", "lalka", "a doll"],
  ["teddy-bear", "teddy bear", "miś (pluszowy)", "My teddy bear is brown."],
  ["car", "car", "samochód (autko)", "a blue car"],
  ["train", "train", "pociąg", "a long train"],
  ["kite", "kite", "latawiec", "a yellow kite"],
  ["robot", "robot", "robot", "Beep! I'm a robot."],
  ["puzzle", "puzzle", "układanka (puzzle)", "a puzzle"],
  ["game", "game", "gra", "a game for two"],
] as const);

const w6 = words(P, [
  ["ive-got", "I've got", "mam", "I've got a bike."],
  ["havent-got", "I haven't got", "nie mam", "I haven't got a dog."],
  ["have-you-got", "Have you got…?", "Czy masz…?", "Have you got a pet?"],
  ["shes-got", "she's got", "ona ma", "She's got a scooter."],
  ["bike", "bike", "rower", "a new bike"],
  ["scooter", "scooter", "hulajnoga", "a pink scooter"],
  ["skateboard", "skateboard", "deskorolka", "a cool skateboard"],
  ["comic", "comic", "komiks", "a funny comic"],
  ["watch", "watch", "zegarek", "a new watch"],
  ["favourite", "favourite", "ulubiony", "my favourite toy"],
] as const);

const w7 = words(P, [
  ["pet", "pet", "zwierzątko domowe", "Have you got a pet?"],
  ["dog", "dog", "pies", "a brown dog"],
  ["cat", "cat", "kot", "a black cat"],
  ["fish", "fish", "rybka", "a goldfish"],
  ["bird", "bird", "ptak", "a yellow bird"],
  ["rabbit", "rabbit", "królik", "a white rabbit"],
  ["hamster", "hamster", "chomik", "a little hamster"],
  ["tortoise", "tortoise", "żółw", "a slow tortoise"],
  ["mouse", "mouse", "mysz", "a grey mouse"],
  ["horse", "horse", "koń", "a big horse"],
] as const);

const w8 = words(P, [
  ["i-can", "I can", "umiem / potrafię", "I can swim."],
  ["i-cant", "I can't", "nie umiem / nie potrafię", "I can't fly."],
  ["jump", "jump", "skakać", "I can jump!"],
  ["run", "run", "biegać", "I can run fast."],
  ["swim", "swim", "pływać", "Fish can swim."],
  ["fly", "fly", "latać", "Birds can fly."],
  ["climb", "climb", "wspinać się", "Cats can climb."],
  ["dance", "dance", "tańczyć", "I can dance."],
  ["sing", "sing", "śpiewać", "I can sing."],
  ["ride", "ride", "jeździć (na rowerze, koniu)", "I can ride a bike."],
] as const);

const w9 = words(P, [
  ["clothes", "clothes", "ubrania", "Put on your clothes."],
  ["t-shirt", "T-shirt", "koszulka", "a green T-shirt"],
  ["shoes", "shoes", "buty", "my new shoes"],
  ["hat", "hat", "czapka", "a blue hat"],
  ["dress", "dress", "sukienka", "a pink dress"],
  ["jacket", "jacket", "kurtka", "Put on your jacket."],
  ["socks", "socks", "skarpetki", "yellow socks"],
  ["trousers", "trousers", "spodnie", "black trousers"],
  ["skirt", "skirt", "spódnica", "a red skirt"],
  ["put-on", "put on", "założyć (ubranie)", "Put on your hat!"],
] as const);

const w10 = words(P, [
  ["wheres", "Where's…?", "Gdzie jest…?", "Where's my ball?"],
  ["in", "in", "w (w środku)", "in the box"],
  ["on", "on", "na", "on the table"],
  ["under", "under", "pod", "under the bed"],
  ["next-to", "next to", "obok", "next to the door"],
  ["behind", "behind", "za", "behind the sofa"],
  ["in-front-of", "in front of", "przed", "in front of the house"],
  ["here", "here", "tutaj", "It's here!"],
  ["there", "there", "tam", "Look, it's there!"],
  ["box", "box", "pudełko", "a toy box"],
] as const);

/* ---------- grammar and usage points ---------- */

const G = {
  thisIs: `${P}.g.this-is`,
  heShe: `${P}.g.he-she`,
  hisHer: `${P}.g.his-her`,
  possessive: `${P}.g.possessive-s`,
  thisThat: `${P}.g.this-that`,
  theseThose: `${P}.g.these-those`,
  haveGot: `${P}.g.have-got`,
  hasGot: `${P}.g.has-got`,
  can: `${P}.g.can`,
  where: `${P}.g.where-is`,
};

const rules: Concept[] = [
  rule(G.thisIs, "This is my…", "przedstawianie", "Pokazując kogoś lub coś, mówimy **This is** + osoba: **This is my mum.** Z **my** nie dodajemy **a**.", "This is my brother.", "GRAMMAR",
    gap(`${G.thisIs}.check`, { sentence: "___ is my grandpa.", translation: "To jest mój dziadek.", answer: "This", wrong: ["These", "Is"], conceptId: G.thisIs, ok: "**This is…** = To jest…", hint: "Przedstawiasz jedną osobę." })),
  rule(G.heShe, "he / she", "on / ona", "O chłopcu lub mężczyźnie mówimy **he**, o dziewczynce lub kobiecie **she**. **He's** = he is, **she's** = she is.", "She's my aunt. He's my uncle.", "GRAMMAR",
    quiz(`${G.heShe}.check`, { prompt: "Mówisz o babci. Które słowo pasuje?", answer: "she", wrong: ["he", "it"], conceptId: G.heShe, ok: "Babcia to kobieta — **she**.", hint: "Babcia to kobieta." })),
  rule(G.hisHer, "his / her", "jego / jej", "**his** = jego (chłopca, mężczyzny), **her** = jej (dziewczynki, kobiety): **His name is Tom. Her name is Ola.**", "Her name is Kate.", "GRAMMAR",
    gap(`${G.hisHer}.check`, { sentence: "This is my dad. ___ name is Adam.", translation: "To mój tata. Ma na imię Adam.", answer: "His", wrong: ["Her", "He"], conceptId: G.hisHer, ok: "Tata to mężczyzna — **his** name.", hint: "Szukamy słowa „jego”." })),
  rule(G.possessive, "Tom's dog", "czyje to jest", "Żeby powiedzieć, czyje coś jest, dodajemy **'s** do imienia: **Tom's dog** = pies Toma, **Mum's car** = samochód mamy.", "This is Mia's cat.", "GRAMMAR",
    quiz(`${G.possessive}.check`, { prompt: "Jak powiesz „rower Leo”?", answer: "Leo's bike", wrong: ["Leo bike", "bike Leo"], conceptId: G.possessive, ok: "**Leo's bike** — imię + **'s** + rzecz.", hint: "Do imienia dodajemy dwa znaki." })),
  rule(G.thisThat, "this / that", "ten (blisko) / tamten (daleko)", "O rzeczy blisko nas mówimy **this**, o rzeczy daleko **that**: **This is my bed. That is my wardrobe.**", "That is my lamp.", "GRAMMAR",
    quiz(`${G.thisThat}.check`, { prompt: "Trzymasz misia w rękach. Co mówisz?", answer: "This is my teddy bear.", wrong: ["That is my teddy bear.", "These is my teddy bear."], conceptId: G.thisThat, ok: "Blisko → **this**.", hint: "Miś jest bardzo blisko." })),
  rule(G.theseThose, "these / those", "te (blisko) / tamte (daleko)", "Gdy rzeczy jest kilka: blisko **these are**, daleko **those are**: **These are my socks. Those are my shoes.**", "These are my shoes.", "GRAMMAR",
    gap(`${G.theseThose}.check`, { sentence: "___ are my books (tutaj, w rękach).", translation: "To są moje książki.", answer: "These", wrong: ["This", "That"], conceptId: G.theseThose, ok: "Kilka rzeczy blisko → **these**.", hint: "Książek jest kilka i są blisko." })),
  rule(G.haveGot, "I've got / I haven't got", "mam / nie mam", "**I've got** (= I have got) = mam. **I haven't got** = nie mam. Pytanie: **Have you got…?** Odpowiedź: **Yes, I have. / No, I haven't.**", "I've got a dog. I haven't got a cat.", "GRAMMAR",
    quiz(`${G.haveGot}.check`, { prompt: "Kolega pyta: “Have you got a bike?” Masz rower. Co odpowiesz?", answer: "Yes, I have.", wrong: ["Yes, I am.", "Yes, I can."], conceptId: G.haveGot, ok: "Na **Have you got…?** → **Yes, I have.**", hint: "W odpowiedzi powtórz słowo z początku pytania." })),
  rule(G.hasGot, "he / she has got", "on / ona ma", "Z **he**, **she** i imieniem mówimy **has got**: **She has got a cat.** Skrót: **she's got**.", "My brother has got a scooter.", "GRAMMAR",
    gap(`${G.hasGot}.check`, { sentence: "Leo ___ got a skateboard.", translation: "Leo ma deskorolkę.", answer: "has", wrong: ["have", "is"], conceptId: G.hasGot, ok: "Z jedną osobą (Leo) → **has got**.", hint: "Leo to „on” — z **he** to słowo się zmienia." })),
  rule(G.can, "can / can't", "umiem / nie umiem", "**can** + czasownik = umiem coś zrobić: **I can swim.** **can't** = nie umiem. Po **can** nie dodajemy **to** ani **-ing**.", "I can dance, but I can't sing.", "GRAMMAR",
    gap(`${G.can}.check`, { sentence: "I can ___.", translation: "Umiem pływać.", answer: "swim", wrong: ["to swim", "swimming"], conceptId: G.can, ok: "Po **can** sam czasownik: **I can swim**.", hint: "Po **can** czasownik zostaje w najprostszej formie." })),
  rule(G.where, "Where's…? – It's in / on / under…", "gdzie coś jest", "O miejsce pytamy **Where's…?** (= Where is). Odpowiadamy **It's** + **in** (w), **on** (na), **under** (pod), **next to** (obok).", "Where's my cat? – It's under the bed.", "GRAMMAR",
    quiz(`${G.where}.check`, { prompt: "Jak zapytasz „Gdzie jest moja czapka?”", answer: "Where's my hat?", wrong: ["Who's my hat?", "What's my hat?"], conceptId: G.where, ok: "O miejsce pytamy **Where**.", hint: "**Who** = kto, **What** = co. Szukamy słowa „gdzie”." })),
];

/* ---------- mission 1: My family ---------- */

const family = lesson({
  unitId: UNIT_ID,
  id: "l01-family",
  order: 1,
  title: "My family",
  canDo: "Po tej misji przedstawisz swoją rodzinę: mamę, tatę, rodzeństwo i dziadków.",
  outcome: "Teraz potrafisz przedstawić swoją rodzinę.",
  minutes: 6,
  keyPhrases: ["This is my mum.", "This is my dad.", "This is my family."],
  words: Object.values(w1),
  exercises: [
    matching("hm1.words", [w1.mum, w1.dad, w1.sister, w1.brother, w1.baby], "Połącz pary: rodzina"),
    pictures("hm1.grandma", {
      word: w1.grandma,
      items: [
        ["home-grandma", "grandma"],
        ["home-mum", "mum"],
        ["home-sister", "sister"],
        ["home-grandpa", "grandpa"],
      ],
      hint: "Szukaj kobiety z siwymi włosami.",
    }),
    listen("hm1.listen", {
      say: "This is my brother, Tom.",
      speaker: { name: "Leo", caption: "Leo pokazuje zdjęcie" },
      question: "Kogo przedstawia Leo?",
      items: [
        ["home-brother", "brother"],
        ["home-sister", "sister"],
        ["home-dad", "dad"],
        ["home-baby", "baby"],
      ],
      conceptId: w1.brother.id,
      ok: "**brother** = brat.",
      hint: "Posłuchaj słowa zaraz po **my**.",
    }),
    quiz("hm1.parents", {
      prompt: "Mama i tata to razem…",
      answer: "parents",
      wrong: [
        ["babies", "**baby** = dzidziuś."],
        ["brothers", "**brother** = brat."],
      ],
      conceptId: w1.parents.id,
      skill: "VOCABULARY",
      eyebrow: "ZAGADKA",
      ok: "**parents** = rodzice.",
      hint: "Szukamy słowa „rodzice”.",
    }),
    gap("hm1.this", {
      sentence: "___ is my dad.",
      translation: "To jest mój tata.",
      answer: "This",
      wrong: [
        ["These", "**These** mówimy o kilku osobach lub rzeczach."],
        ["Is", "**is** już jest w zdaniu."],
      ],
      conceptId: G.thisIs,
      ok: "**This is…** = To jest…",
      hint: "Przedstawiasz jedną osobę: „To jest…”.",
    }),
    build("hm1.build", {
      pl: "To jest moja siostra.",
      tokens: ["is", "This", "my", "sister.", "brother."],
      solution: "This is my sister.",
      conceptId: G.thisIs,
      tokenHints: { "brother.": "**brother** = brat. Szukamy siostry." },
      ok: "**This is my sister.** = To jest moja siostra.",
      hint: "Zacznij od **This**.",
    }),
    say("hm1.say", {
      target: "This is my family.",
      translation: "„To jest moja rodzina.”",
      conceptId: w1.family.id,
      tip: "**family** czytamy **„FE-mi-li”** — mocno na początek.",
      tipAudio: "family",
    }),
    scene("hm1.scene", {
      title: "Mia w odwiedzinach",
      prompt: "Przedstaw Mii swoją rodzinę",
      setting: "home",
      character: { name: "Mia", role: "koleżanka w odwiedzinach" },
      conceptId: G.thisIs,
      start: "hi",
      nodes: {
        hi: ["Hi, {name}! What a nice house!", [
          ["Thank you! Come in, Mia!", "mum"],
          ["Good night, Mia!", null, "Mia dopiero przyszła! Podziękuj i zaproś ją do środka.", w1["this-is"].id],
        ]],
        mum: ["Who's that lady in the kitchen?", [
          ["This is my mum.", "dad"],
          ["This is my dad.", null, "To kobieta. **dad** = tata, a mama to **mum**.", w1.mum.id],
        ]],
        dad: ["Hello! And who's that man?", [
          ["This is my dad.", "baby"],
          ["This is my sister.", null, "To mężczyzna — **sister** to siostra.", w1.dad.id],
        ]],
        baby: ["Oh, and a baby!", [
          ["Yes! This is my baby brother.", "end"],
          ["Yes! This is my grandpa.", null, "**grandpa** = dziadek. Malutkie dziecko to **baby**.", w1.baby.id],
        ]],
        end: ["Your family is great, {name}!"],
      },
      done: "Scenka zaliczona! Mia poznała Twoją rodzinę.",
    }),
  ],
});

/* ---------- mission 2: Who's this? ---------- */

const whosThis = lesson({
  unitId: UNIT_ID,
  id: "l02-whos-this",
  order: 2,
  title: "Who's this?",
  canDo: "Po tej misji zapytasz, kto jest na zdjęciu, i powiesz, jak ma na imię ciocia, wujek czy kuzyn.",
  outcome: "Teraz potrafisz opowiedzieć o rodzinie na zdjęciu.",
  minutes: 6,
  keyPhrases: ["Who's this?", "He's my uncle.", "Her name is Kate."],
  words: Object.values(w2),
  exercises: [
    matching("hm2.words", [w2.friend, w2.aunt, w2.uncle, w2.cousin, w2.photo]),
    quiz("hm2.he", {
      prompt: "Mówisz o bracie. Którego słowa użyjesz?",
      answer: "he",
      wrong: [
        ["she", "**she** = ona — mówimy tak o dziewczynce lub kobiecie."],
        ["it", "**it** mówimy o rzeczach i zwierzętach."],
      ],
      conceptId: G.heShe,
      ok: "O chłopcu lub mężczyźnie: **he**.",
      hint: "Brat to chłopiec.",
    }),
    listen("hm2.listen", {
      say: "This is my aunt. Her name is Kate.",
      speaker: { name: "Mia", caption: "Mia pokazuje zdjęcie" },
      question: "Jak ma na imię ciocia Mii?",
      answer: "Kate",
      wrong: ["Mia", "Tom", "Ann"],
      conceptId: G.hisHer,
      ok: "**Her name is Kate** = Ona ma na imię Kate (dosłownie: jej imię to Kate).",
      hint: "Imię pada na samym końcu.",
    }),
    gap("hm2.her", {
      sentence: "This is my sister. ___ name is Ola.",
      translation: "To moja siostra. Ma na imię Ola.",
      answer: "Her",
      wrong: [
        ["His", "**his** = jego — o chłopcu."],
        ["She", "**She** = ona. Tu potrzebujemy słowa „jej”."],
      ],
      conceptId: G.hisHer,
      ok: "Siostra → **her** name.",
      hint: "Siostra to dziewczynka — szukamy słowa „jej”.",
    }),
    quiz("hm2.toms", {
      prompt: "Co znaczy “Tom's dog”?",
      answer: "pies Toma",
      wrong: [
        ["Tom jest psem", "**'s** po imieniu mówi, czyje coś jest."],
        ["psy Toma", "Pies jest jeden — **dog** nie ma **-s** na końcu."],
      ],
      conceptId: G.possessive,
      eyebrow: "CO TO ZNACZY?",
      ok: "**Tom's dog** = pies Toma.",
      hint: "**'s** po imieniu mówi, czyje coś jest.",
    }),
    build("hm2.build", {
      pl: "Kto to jest?",
      tokens: ["this?", "Who's", "What's", "is"],
      solution: "Who's this?",
      conceptId: w2["whos-this"].id,
      tokenHints: { "What's": "**What's** = co to jest. O osobę pytamy inaczej.", is: "**Who's** to już **Who is**." },
      ok: "**Who's this?** = Kto to jest?",
      hint: "Wystarczą dwa słowa.",
    }),
    say("hm2.say", {
      target: "Who's this? This is my uncle.",
      translation: "„Kto to jest? To jest mój wujek.”",
      conceptId: w2["whos-this"].id,
      tip: "**Who's** czytamy krótko: **„huz”**.",
      tipAudio: "Who's this?",
    }),
    scene("hm2.scene", {
      title: "Zdjęcie rodziny",
      prompt: "Opowiedz pani Bell o zdjęciu",
      setting: "classroom",
      character: { name: "Ms Bell", role: "pani od angielskiego" },
      conceptId: G.heShe,
      start: "photo",
      nodes: {
        photo: ["Oh, a family photo! Who's this lady?", [
          ["This is my grandma.", "uncle"],
          ["She's my grandma.", "uncle"],
          ["He's my grandma.", null, "Babcia to kobieta — mówimy **she**.", G.heShe],
        ]],
        uncle: ["And who's this man?", [
          ["He's my uncle.", "girl"],
          ["She's my uncle.", null, "Wujek to mężczyzna — **he**.", G.heShe],
        ]],
        girl: ["And the girl? What's her name?", [
          ["Her name is Zuza. She's my cousin.", "end"],
          ["His name is Zuza.", null, "Pytamy o dziewczynkę — **her** name.", G.hisHer],
        ]],
        end: ["What a lovely family, {name}!"],
      },
      done: "Scenka zaliczona! Pani Bell zna już Twoją rodzinę.",
    }),
  ],
});

/* ---------- mission 3: My house ---------- */

const house = lesson({
  unitId: UNIT_ID,
  id: "l03-house",
  order: 3,
  title: "My house",
  canDo: "Po tej misji nazwiesz pomieszczenia w domu i oprowadzisz po nim kolegę.",
  outcome: "Teraz potrafisz oprowadzić kogoś po domu.",
  minutes: 6,
  keyPhrases: ["This is the kitchen.", "my bedroom", "Up the stairs!"],
  words: Object.values(w3),
  exercises: [
    matching("hm3.words", [w3.house, w3.kitchen, w3.garden, w3.door, w3.window]),
    pictures("hm3.bathroom", {
      word: w3.bathroom,
      items: [
        ["home-bathroom", "bathroom"],
        ["home-kitchen", "kitchen"],
        ["home-bedroom", "bedroom"],
        ["home-living-room", "living room"],
      ],
      hint: "Szukaj wanny.",
    }),
    listen("hm3.listen", {
      say: "I'm in the kitchen!",
      speaker: { name: "Mum", caption: "Mama woła z domu" },
      question: "Gdzie jest mama?",
      items: [
        ["home-kitchen", "kitchen"],
        ["home-bedroom", "bedroom"],
        ["home-bathroom", "bathroom"],
        ["home-living-room", "living room"],
      ],
      conceptId: w3.kitchen.id,
      ok: "**kitchen** = kuchnia.",
      hint: "Posłuchaj ostatniego słowa.",
    }),
    quiz("hm3.sleep", {
      prompt: "W którym pokoju śpisz?",
      answer: "bedroom",
      wrong: [
        ["kitchen", "W **kitchen** gotujemy."],
        ["bathroom", "W **bathroom** się myjemy."],
      ],
      conceptId: w3.bedroom.id,
      skill: "VOCABULARY",
      eyebrow: "ZAGADKA",
      ok: "**bedroom** = sypialnia (**bed** = łóżko, **room** = pokój).",
      hint: "To pokój z łóżkiem.",
    }),
    gap("hm3.flat", {
      sentence: "I live in a ___.",
      translation: "Mieszkam w mieszkaniu.",
      answer: "flat",
      wrong: [
        ["garden", "**garden** = ogród."],
        ["window", "**window** = okno."],
      ],
      conceptId: w3.flat.id,
      skill: "VOCABULARY",
      ok: "**flat** = mieszkanie.",
      hint: "Szukamy słowa „mieszkanie”.",
    }),
    build("hm3.build", {
      pl: "To jest moja kuchnia.",
      tokens: ["This", "kitchen.", "is", "my", "garden."],
      solution: "This is my kitchen.",
      conceptId: G.thisIs,
      tokenHints: { "garden.": "**garden** = ogród." },
      ok: "**This is my kitchen.** = To jest moja kuchnia.",
      hint: "Zacznij od **This is…**",
    }),
    say("hm3.say", {
      target: "This is the living room.",
      translation: "„To jest salon.”",
      conceptId: w3["living-room"].id,
      tip: "**living room** to dwa słowa: **„LI-wing rum”**.",
      tipAudio: "living room",
    }),
    scene("hm3.scene", {
      title: "Wycieczka po domu",
      prompt: "Oprowadź Leo po domu",
      setting: "home",
      character: { name: "Leo", role: "kolega w odwiedzinach" },
      conceptId: w3.kitchen.id,
      start: "kitchen",
      nodes: {
        kitchen: ["Wow, a big house! Where's the kitchen?", [
          ["Here! This is the kitchen.", "garden"],
          ["Here! This is the bathroom.", null, "Leo pyta o **kitchen** — kuchnię.", w3.kitchen.id],
        ]],
        garden: ["Cool! And that? Is that a garden?", [
          ["Yes! That's our garden.", "bedroom"],
          ["Yes! That's our bedroom.", null, "Za oknem jest **garden** — ogród.", w3.garden.id],
        ]],
        bedroom: ["And where's your bedroom?", [
          ["Up the stairs! Come!", "end"],
          ["In the kitchen!", null, "Sypialnia w kuchni? 🙂 Pokaż Leo schody na górę — **stairs**.", w3.stairs.id],
        ]],
        end: ["What a great house, {name}!"],
      },
      done: "Scenka zaliczona! Leo zwiedził Twój dom.",
    }),
  ],
});

/* ---------- mission 4: In my room ---------- */

const room = lesson({
  unitId: UNIT_ID,
  id: "l04-room",
  order: 4,
  title: "In my room",
  canDo: "Po tej misji nazwiesz meble w swoim pokoju i pokażesz rzeczy blisko (this) i daleko (that).",
  outcome: "Teraz potrafisz opisać swój pokój.",
  minutes: 7,
  keyPhrases: ["This is my bed.", "That is my wardrobe.", "These are my pictures."],
  words: Object.values(w4),
  exercises: [
    matching("hm4.words", [w4.bed, w4.table, w4.chair, w4.lamp, w4.desk]),
    pictures("hm4.lamp", {
      word: w4.lamp,
      items: [
        ["home-lamp", "lamp"],
        ["home-chair", "chair"],
        ["home-table", "table"],
        ["home-bed", "bed"],
      ],
      hint: "Ta rzecz świeci.",
    }),
    listen("hm4.listen", {
      say: "My books are on the shelf.",
      speaker: { name: "Mia", caption: "Mia sprząta pokój" },
      question: "Gdzie są książki Mii?",
      answer: "na półce",
      wrong: ["na łóżku", "na biurku", "w szafie"],
      conceptId: w4.shelf.id,
      ok: "**shelf** = półka.",
      hint: "Posłuchaj ostatniego słowa.",
    }),
    quiz("hm4.that", {
      prompt: "Pokazujesz lampę po drugiej stronie pokoju. Co mówisz?",
      answer: "That is my lamp.",
      wrong: [
        ["This is my lamp.", "**this** mówimy o rzeczy blisko nas."],
        ["These is my lamp.", "**these** mówimy o kilku rzeczach."],
      ],
      conceptId: G.thisThat,
      ok: "Daleko → **that**. Blisko → **this**.",
      hint: "Lampa jest daleko.",
    }),
    gap("hm4.these", {
      sentence: "___ are my pictures.",
      translation: "To są moje obrazki (tutaj, blisko).",
      answer: "These",
      wrong: [
        ["This", "**this** mówimy o jednej rzeczy."],
        ["That", "**that** to jedna rzecz, daleko."],
      ],
      conceptId: G.theseThose,
      ok: "Kilka rzeczy blisko → **these are**.",
      hint: "Obrazków jest kilka i są blisko.",
    }),
    build("hm4.build", {
      pl: "Tamto to moja szafa.",
      tokens: ["is", "That", "wardrobe.", "my", "This"],
      solution: "That is my wardrobe.",
      conceptId: G.thisThat,
      tokenHints: { This: "„Tamto” — szafa jest daleko. **this** mówimy o rzeczy blisko." },
      ok: "**That is my wardrobe.** = Tamto to moja szafa.",
      hint: "Szafa jest daleko — zacznij od słowa „tamto”.",
    }),
    say("hm4.say", {
      target: "This is my room.",
      translation: "„To jest mój pokój.”",
      conceptId: w4.room.id,
      tip: "W **this** czubek języka dotyka zębów: **„dys”**, nie **„zis”**.",
      tipAudio: "this",
    }),
    scene("hm4.scene", {
      title: "Sprzątanie pokoju",
      prompt: "Pomóż Robo posprzątać pokój",
      setting: "home",
      character: { name: "Robo", role: "robot-sprzątacz" },
      conceptId: G.thisThat,
      start: "room",
      nodes: {
        room: ["Beep! Hello, {name}! Is this your room?", [
          ["Yes, this is my room.", "bed"],
          ["Yes, this is my kitchen.", null, "Jesteście w pokoju — **room**.", w4.room.id],
        ]],
        bed: ["Beep! This is big and soft. Is it a chair?", [
          ["No, it's my bed.", "rug"],
          ["Yes, it's a chair.", null, "Duże i miękkie, do spania — to **bed**.", w4.bed.id],
        ]],
        rug: ["Beep! And that? On the floor?", [
          ["That's my rug.", "end"],
          ["That's my lamp.", null, "Na podłodze leży **rug** — dywanik.", w4.rug.id],
        ]],
        end: ["Beep beep! Your room is clean now!"],
      },
      done: "Scenka zaliczona! Pokój posprzątany.",
    }),
  ],
});

/* ---------- mission 5: Toys ---------- */

const toys = lesson({
  unitId: UNIT_ID,
  id: "l05-toys",
  order: 5,
  title: "Toys",
  canDo: "Po tej misji nazwiesz swoje zabawki i wybierzesz zabawkę w sklepie.",
  outcome: "Teraz potrafisz rozmawiać o zabawkach.",
  minutes: 6,
  keyPhrases: ["a teddy bear", "A train, please.", "This is my kite."],
  words: Object.values(w5),
  exercises: [
    matching("hm5.words", [w5.toy, w5.doll, w5.train, w5.kite, w5.game]),
    pictures("hm5.teddy", {
      word: w5["teddy-bear"],
      items: [
        ["home-teddy", "teddy bear"],
        ["home-doll", "doll"],
        ["home-ball", "ball"],
        ["home-car", "car"],
      ],
      hint: "Ma okrągłe uszy i jest mięciutki.",
    }),
    listen("hm5.listen", {
      say: "A red car, please.",
      speaker: { name: "Ben", caption: "Ben w sklepie z zabawkami" },
      question: "Co chce Ben?",
      items: [
        ["home-car", "car"],
        ["home-train", "train"],
        ["home-ball", "ball"],
        ["home-kite", "kite"],
      ],
      conceptId: w5.car.id,
      ok: "**a red car** = czerwone autko.",
      hint: "Posłuchaj słowa po **red**.",
    }),
    quiz("hm5.robot", {
      prompt: "Która zabawka mówi „beep beep”?",
      answer: "a robot",
      wrong: [
        ["a doll", "**doll** = lalka."],
        ["a puzzle", "**puzzle** = układanka."],
      ],
      conceptId: w5.robot.id,
      skill: "VOCABULARY",
      eyebrow: "ZAGADKA",
      ok: "**robot** po angielsku to też **robot**!",
      hint: "Pomyśl o Robo.",
    }),
    gap("hm5.balls", {
      sentence: "Look! Three ___!",
      translation: "Patrz! Trzy piłki!",
      answer: "balls",
      wrong: [
        ["ball", "Piłek jest więcej niż jedna."],
        ["a ball", "**a** mówimy przed jedną rzeczą."],
      ],
      conceptId: HW.plural,
      ok: "Więcej niż jedna → **-s**: three **balls**.",
      hint: "Piłek jest więcej niż jedna.",
    }),
    build("hm5.build", {
      pl: "To jest mój latawiec.",
      tokens: ["my", "This", "kite.", "is", "a"],
      solution: "This is my kite.",
      conceptId: G.thisIs,
      tokenHints: { a: "Z **my** nie dodajemy **a**: **my kite**." },
      ok: "**This is my kite.** = To jest mój latawiec.",
      hint: "Zacznij od **This is…**",
    }),
    say("hm5.say", {
      target: "My teddy bear is brown.",
      translation: "„Mój miś jest brązowy.”",
      conceptId: w5["teddy-bear"].id,
      tip: "**teddy bear** czytamy **„TE-di ber”**.",
      tipAudio: "teddy bear",
    }),
    scene("hm5.scene", {
      title: "Sklep z zabawkami",
      prompt: "Kup prezent dla brata",
      setting: "shop",
      character: { name: "Ben", role: "sprzedawca w sklepie z zabawkami" },
      conceptId: w5.toy.id,
      start: "hi",
      nodes: {
        hi: ["Hello! Can I help you?", [
          ["Yes, please. A toy for my brother.", "which"],
          ["Good night!", null, "Dopiero przyszedłeś do sklepu — powiedz, że szukasz zabawki (**toy**).", w5.toy.id],
        ]],
        which: ["A car or a train?", [
          ["A train, please.", "colour"],
          ["A car, please.", "colour"],
          ["A doll, please.", null, "Ben pyta: autko czy pociąg? Wybierz jedno z nich.", w5.car.id],
        ]],
        colour: ["Red or blue?", [
          ["Blue, please.", "end"],
          ["Red, please.", "end"],
          ["Green, please.", null, "Ben ma tylko czerwone i niebieskie — wybierz jeden z tych kolorów.", HW.colour],
        ]],
        end: ["Here you are! Your brother is a lucky boy!"],
      },
      done: "Scenka zaliczona! Prezent dla brata kupiony.",
    }),
  ],
});

/* ---------- mission 6: I've got a bike ---------- */

const haveGot = lesson({
  unitId: UNIT_ID,
  id: "l06-have-got",
  order: 6,
  title: "I've got a bike",
  canDo: "Po tej misji powiesz, co masz, a czego nie masz, i zapytasz o to kolegę.",
  outcome: "Teraz potrafisz powiedzieć, co masz.",
  minutes: 7,
  keyPhrases: ["I've got a bike.", "I haven't got a scooter.", "Have you got…?"],
  words: Object.values(w6),
  exercises: [
    matching("hm6.words", [w6.bike, w6.scooter, w6.skateboard, w6.comic, w6.watch]),
    quiz("hm6.meaning", {
      prompt: "Co znaczy “I've got a bike”?",
      answer: "Mam rower.",
      wrong: [
        ["Jestem rowerem.", "**I've got** = mam, a nie „jestem”."],
        ["Lubię rowery.", "Tu nie ma „lubię”. **I've got** = mam."],
      ],
      conceptId: G.haveGot,
      eyebrow: "CO TO ZNACZY?",
      ok: "**I've got** = mam.",
      hint: "**I've got** to „mam”.",
    }),
    listen("hm6.listen", {
      say: "I haven't got a bike. I've got a scooter.",
      speaker: { name: "Leo", caption: "Leo opowiada o sobie" },
      question: "Co ma Leo?",
      answer: "hulajnogę",
      wrong: ["rower", "deskorolkę", "komiks"],
      conceptId: w6["havent-got"].id,
      ok: "**I haven't got a bike** = nie mam roweru. **I've got a scooter** = mam hulajnogę.",
      hint: "Posłuchaj drugiego zdania — pierwsze mówi, czego Leo **nie ma**.",
    }),
    gap("hm6.has", {
      sentence: "She ___ got a watch.",
      translation: "Ona ma zegarek.",
      answer: "has",
      wrong: [
        ["have", "Z **she** mówimy **has**."],
        ["is", "**is got** nie istnieje — mówimy **has got**."],
      ],
      conceptId: G.hasGot,
      ok: "**She has got** = ona ma.",
      hint: "Z **he / she** to słowo się zmienia.",
    }),
    quiz("hm6.question", {
      prompt: "Jak zapytasz kolegę: „Czy masz deskorolkę?”",
      answer: "Have you got a skateboard?",
      wrong: [
        ["You have got a skateboard?", "W pytaniu **Have** idzie na początek."],
        ["Has you got a skateboard?", "Z **you** mówimy **have**."],
      ],
      conceptId: w6["have-you-got"].id,
      ok: "Pytanie: **Have you got…?**",
      hint: "Pytanie zaczyna się od **Have**.",
    }),
    build("hm6.build", {
      pl: "Nie mam komiksu.",
      tokens: ["got", "I", "a", "haven't", "comic.", "have"],
      solution: "I haven't got a comic.",
      conceptId: w6["havent-got"].id,
      tokenHints: { have: "Przeczenie to **haven't** (= have not)." },
      ok: "**I haven't got a comic.** = Nie mam komiksu.",
      hint: "Zacznij od **I haven't…**",
    }),
    say("hm6.say", {
      target: "My favourite toy is my bike.",
      translation: "„Moją ulubioną zabawką jest rower.”",
      conceptId: w6.favourite.id,
      tip: "**favourite** czytamy **„FEJ-vrit”**.",
      tipAudio: "favourite",
    }),
    scene("hm6.scene", {
      title: "W parku",
      prompt: "Porozmawiaj z Leo o tym, co macie",
      setting: "park",
      character: { name: "Leo", role: "kolega z parku" },
      conceptId: G.haveGot,
      start: "bike",
      nodes: {
        bike: ["Hi, {name}! Look, I've got a new bike!", [
          ["Cool! I've got a bike too.", "scooter"],
          ["Cool! I haven't got a bike.", "scooter"],
          ["Cool! I has got a bike.", null, "Z **I** mówimy **have**: **I've got**.", G.haveGot],
        ]],
        scooter: ["Have you got a scooter?", [
          ["Yes, I have.", "sister"],
          ["No, I haven't.", "sister"],
          ["Yes, I am.", null, "Na **Have you got…?** odpowiadamy **Yes, I have** albo **No, I haven't**.", G.haveGot],
        ]],
        sister: ["My sister has got a skateboard!", [
          ["Wow! She's got a skateboard!", "end"],
          ["Wow! He's got a skateboard!", null, "Mowa o siostrze — **she**.", G.heShe],
        ]],
        end: ["Let's ride in the park, {name}!"],
      },
      done: "Scenka zaliczona! Jedziecie razem do parku.",
    }),
  ],
});

/* ---------- mission 7: Pets ---------- */

const pets = lesson({
  unitId: UNIT_ID,
  id: "l07-pets",
  order: 7,
  title: "Pets",
  canDo: "Po tej misji nazwiesz zwierzątka domowe i powiesz, jakie masz.",
  outcome: "Teraz potrafisz opowiedzieć o swoim zwierzątku.",
  minutes: 6,
  keyPhrases: ["I've got a cat.", "Have you got a pet?", "My dog is brown."],
  words: Object.values(w7),
  exercises: [
    matching("hm7.words", [w7.pet, w7.rabbit, w7.hamster, w7.tortoise, w7.horse]),
    pictures("hm7.cat", {
      word: w7.cat,
      items: [
        ["home-cat", "cat"],
        ["home-dog", "dog"],
        ["home-rabbit", "rabbit"],
        ["home-bird", "bird"],
      ],
      hint: "To zwierzątko mówi „miau”.",
    }),
    listen("hm7.listen", {
      say: "Woof! Woof! I'm a dog!",
      speaker: { name: "Rex", caption: "Ktoś szczeka za drzwiami" },
      question: "Kto to mówi?",
      items: [
        ["home-dog", "dog"],
        ["home-cat", "cat"],
        ["home-bird", "bird"],
        ["home-fish", "fish"],
      ],
      conceptId: w7.dog.id,
      ok: "**dog** = pies. Po angielsku pies robi **woof!**",
      hint: "Posłuchaj ostatniego słowa.",
    }),
    quiz("hm7.fish", {
      prompt: "Które zwierzątko mieszka w wodzie?",
      answer: "a fish",
      wrong: [
        ["a hamster", "**hamster** = chomik."],
        ["a horse", "**horse** = koń."],
      ],
      conceptId: w7.fish.id,
      skill: "VOCABULARY",
      eyebrow: "ZAGADKA",
      ok: "**fish** = rybka.",
      hint: "Szukamy rybki.",
    }),
    gap("hm7.got", {
      sentence: "I've ___ a hamster.",
      translation: "Mam chomika.",
      answer: "got",
      wrong: [
        ["get", "Mówimy zawsze **have got** — z **got**."],
        ["a", "**a** już stoi przed **hamster**."],
      ],
      conceptId: G.haveGot,
      ok: "**I've got** = mam.",
      hint: "Brakuje drugiej części **I've …**",
    }),
    build("hm7.build", {
      pl: "Mój pies jest brązowy.",
      tokens: ["dog", "My", "brown.", "is", "are"],
      solution: "My dog is brown.",
      conceptId: w7.dog.id,
      tokenHints: { are: "Pies jest jeden — mówimy **is**." },
      ok: "**My dog is brown.** = Mój pies jest brązowy.",
      hint: "Zacznij od **My dog…**",
    }),
    say("hm7.say", {
      target: "I've got a rabbit.",
      translation: "„Mam królika.”",
      conceptId: w7.rabbit.id,
      tip: "**rabbit** czytamy **„RE-bit”**.",
      tipAudio: "rabbit",
    }),
    scene("hm7.scene", {
      title: "Sklep zoologiczny",
      prompt: "Wybierz zwierzątko",
      setting: "shop",
      character: { name: "Ms Green", role: "pani ze sklepu zoologicznego" },
      conceptId: w7.pet.id,
      start: "pet",
      nodes: {
        pet: ["Hello! Have you got a pet?", [
          ["No, I haven't.", "which"],
          ["Yes, I have. A cat.", "which"],
          ["Yes, I am.", null, "Odpowiedz **Yes, I have** albo **No, I haven't**.", G.haveGot],
        ]],
        which: ["Look! A rabbit, a hamster and a fish. Which one?", [
          ["The rabbit, please!", "colour"],
          ["The hamster, please!", "colour"],
          ["The horse, please!", null, "W sklepie nie ma konia 🙂 Wybierz królika, chomika albo rybkę.", w7.horse.id],
        ]],
        colour: ["Here you are! What colour is it?", [
          ["It's white!", "end"],
          ["It's brown!", "end"],
          ["It's a pet!", null, "Pani pyta o **kolor**: **It's** + kolor.", HW.colour],
        ]],
        end: ["Great! Take good care of your new pet!"],
      },
      done: "Scenka zaliczona! Masz nowe zwierzątko.",
    }),
  ],
});

/* ---------- mission 8: I can jump! ---------- */

const can = lesson({
  unitId: UNIT_ID,
  id: "l08-can",
  order: 8,
  title: "I can jump!",
  canDo: "Po tej misji powiesz, co umiesz, a czego nie umiesz, i zapytasz o to innych.",
  outcome: "Teraz potrafisz powiedzieć, co umiesz.",
  minutes: 7,
  keyPhrases: ["I can swim.", "I can't fly.", "Can you climb?"],
  words: Object.values(w8),
  exercises: [
    matching("hm8.words", [w8.jump, w8.run, w8.swim, w8.climb, w8.sing]),
    pictures("hm8.swim", {
      word: w8.swim,
      items: [
        ["home-swim", "swim"],
        ["home-climb", "climb"],
        ["home-dance", "dance"],
        ["home-jump", "jump"],
      ],
      hint: "Szukaj wody.",
    }),
    listen("hm8.listen", {
      say: "I can't swim, but I can climb.",
      speaker: { name: "Mia", caption: "Mia mówi, co umie" },
      question: "Co umie Mia?",
      items: [
        ["home-climb", "climb"],
        ["home-swim", "swim"],
        ["home-dance", "dance"],
        ["home-run", "run"],
      ],
      conceptId: G.can,
      ok: "**I can't swim** = nie umiem pływać. **I can climb** = umiem się wspinać.",
      hint: "**can't** = nie umiem. Szukaj tego, co Mia **umie** — w drugiej części zdania.",
    }),
    quiz("hm8.fly", {
      prompt: "Które zdanie jest prawdziwe?",
      answer: "A bird can fly.",
      wrong: [
        ["A fish can fly.", "Rybki nie latają 🙂"],
        ["A dog can fly.", "Psy nie latają 🙂"],
      ],
      conceptId: w8.fly.id,
      skill: "VOCABULARY",
      eyebrow: "PRAWDA CZY NIE?",
      ok: "**A bird can fly.** = Ptak umie latać.",
      hint: "**fly** = latać. Kto umie latać?",
    }),
    gap("hm8.ride", {
      sentence: "I can ___ a bike.",
      translation: "Umiem jeździć na rowerze.",
      answer: "ride",
      wrong: [
        ["to ride", "Po **can** nie dodajemy **to**."],
        ["rides", "Po **can** czasownik zostaje bez zmian."],
      ],
      conceptId: G.can,
      ok: "**can** + czasownik: **I can ride**.",
      hint: "Po **can** czasownik zostaje w najprostszej formie.",
    }),
    build("hm8.build", {
      pl: "Nie umiem śpiewać.",
      tokens: ["sing.", "I", "can't", "can", "to"],
      solution: "I can't sing.",
      conceptId: w8["i-cant"].id,
      tokenHints: { can: "Przeczenie to **can't**.", to: "Po **can't** nie ma **to**." },
      ok: "**I can't sing.** = Nie umiem śpiewać.",
      hint: "Wystarczą trzy słowa.",
    }),
    say("hm8.say", {
      target: "I can run and jump!",
      translation: "„Umiem biegać i skakać!”",
      conceptId: G.can,
      tip: "**can** w zdaniu czytamy krótko i lekko: **„kən”**.",
      tipAudio: "I can run.",
    }),
    scene("hm8.scene", {
      title: "Dzień sportu",
      prompt: "Powiedz trenerowi, co umiesz",
      setting: "park",
      character: { name: "Coach Tom", role: "trener" },
      conceptId: G.can,
      start: "run",
      nodes: {
        run: ["Hello, {name}! Can you run?", [
          ["Yes, I can!", "swim"],
          ["No, I can't.", "swim"],
          ["Yes, I run.", null, "Na **Can you…?** odpowiadamy **Yes, I can** albo **No, I can't**.", G.can],
        ]],
        swim: ["Can you swim?", [
          ["Yes, I can.", "climb"],
          ["No, I can't.", "climb"],
          ["Yes, I can swimming.", null, "Po **can** czasownik bez zmian: **I can swim**.", G.can],
        ]],
        climb: ["OK! Now, can you climb this tree?", [
          ["Yes! Look, I can climb!", "end"],
          ["Yes! I can to climb!", null, "Po **can** nie ma **to**.", G.can],
        ]],
        end: ["Great job, {name}! You're a star!"],
      },
      done: "Scenka zaliczona! Trener jest z Ciebie dumny.",
    }),
  ],
});

/* ---------- mission 9: Clothes ---------- */

const clothes = lesson({
  unitId: UNIT_ID,
  id: "l09-clothes",
  order: 9,
  title: "Clothes",
  canDo: "Po tej misji nazwiesz ubrania i zrozumiesz, co założyć przed wyjściem.",
  outcome: "Teraz potrafisz rozmawiać o ubraniach.",
  minutes: 6,
  keyPhrases: ["Put on your jacket!", "These are my shoes.", "a green T-shirt"],
  words: Object.values(w9),
  exercises: [
    matching("hm9.words", [w9.dress, w9.jacket, w9.trousers, w9.skirt, w9.socks]),
    pictures("hm9.shoes", {
      word: w9.shoes,
      items: [
        ["home-shoes", "shoes"],
        ["home-socks", "socks"],
        ["home-hat", "hat"],
        ["home-tshirt", "T-shirt"],
      ],
      hint: "Zakładamy je na stopy na samym końcu, tuż przed wyjściem.",
    }),
    listen("hm9.listen", {
      say: "It's cold! Put on your jacket.",
      speaker: { name: "Mum", caption: "Mama przed wyjściem" },
      question: "Co trzeba założyć?",
      items: [
        ["home-jacket", "jacket"],
        ["home-dress", "dress"],
        ["home-tshirt", "T-shirt"],
        ["home-hat", "hat"],
      ],
      conceptId: w9["put-on"].id,
      ok: "**Put on your jacket** = Załóż kurtkę.",
      hint: "Posłuchaj ostatniego słowa.",
    }),
    quiz("hm9.these", {
      prompt: "Trzymasz buty w rękach. Co mówisz?",
      answer: "These are my shoes.",
      wrong: [
        ["This is my shoes.", "Butów jest para — **these are**."],
        ["Those are my shoes.", "**those** mówimy o rzeczach daleko."],
      ],
      conceptId: G.theseThose,
      ok: "Kilka rzeczy blisko → **these are**.",
      hint: "Butów jest kilka i są blisko.",
    }),
    gap("hm9.hat", {
      sentence: "Put on your ___!",
      translation: "Załóż czapkę!",
      answer: "hat",
      wrong: [
        ["socks", "**socks** = skarpetki."],
        ["skirt", "**skirt** = spódnica."],
      ],
      conceptId: w9.hat.id,
      skill: "VOCABULARY",
      ok: "**hat** = czapka.",
      hint: "Szukamy słowa „czapka”.",
    }),
    build("hm9.build", {
      pl: "Załóż buty!",
      tokens: ["your", "Put", "shoes!", "on", "in"],
      solution: "Put on your shoes!",
      conceptId: w9["put-on"].id,
      tokenHints: { in: "Zakładać = **put on**, nie **put in**." },
      ok: "**Put on your shoes!** = Załóż buty!",
      hint: "Zakładać ubranie = **put on**.",
    }),
    say("hm9.say", {
      target: "My T-shirt is green.",
      translation: "„Moja koszulka jest zielona.”",
      conceptId: w9["t-shirt"].id,
      tip: "**T-shirt** czytamy **„TI-szert”**.",
      tipAudio: "T-shirt",
    }),
    scene("hm9.scene", {
      title: "Ubieramy się",
      prompt: "Ubierz się do szkoły",
      setting: "home",
      character: { name: "Mum", role: "mama" },
      conceptId: w9.clothes.id,
      start: "morning",
      nodes: {
        morning: ["Good morning, {name}! Put on your clothes, please.", [
          ["OK, Mum!", "tshirt"],
          ["Good night, Mum!", null, "Jest rano! Odpowiedz mamie, że już się ubierasz.", w9.clothes.id],
        ]],
        tshirt: ["Where's your T-shirt?", [
          ["Here it is!", "cold"],
          ["Here they are!", null, "Koszulka jest jedna — **Here it is**.", w9["t-shirt"].id],
        ]],
        cold: ["It's cold today. Put on your jacket!", [
          ["OK, Mum! And my hat too.", "end"],
          ["OK, Mum!", "end"],
          ["No! My socks!", null, "Mama mówi, że jest zimno. Załóż **jacket** — kurtkę.", w9.jacket.id],
        ]],
        end: ["Great! Have a nice day at school!"],
      },
      done: "Scenka zaliczona! Gotowe do szkoły.",
    }),
  ],
});

/* ---------- mission 10: Where is it? ---------- */

const where = lesson({
  unitId: UNIT_ID,
  id: "l10-where",
  order: 10,
  title: "Where is it?",
  canDo: "Po tej misji zapytasz, gdzie coś jest, i odpowiesz: w, na, pod, obok, za.",
  outcome: "Teraz potrafisz powiedzieć, gdzie coś jest.",
  minutes: 7,
  keyPhrases: ["Where's my ball?", "It's under the bed.", "It's on the shelf."],
  words: Object.values(w10),
  exercises: [
    matching("hm10.words", [w10.in, w10.on, w10.under, w10.behind, w10.box]),
    pictures("hm10.under", {
      word: w10.under,
      items: [
        ["home-where-under", "under"],
        ["home-where-in", "in"],
        ["home-where-on", "on"],
        ["home-where-next-to", "next to"],
      ],
      prompt: "Gdzie jest piłka? Który obrazek pokazuje…",
      hint: "Szukaj piłki, nad którą coś stoi.",
    }),
    listen("hm10.listen", {
      say: "Your ball is in the box.",
      speaker: { name: "Robo", caption: "Robo znalazł piłkę" },
      question: "Gdzie jest piłka?",
      items: [
        ["home-where-in", "in"],
        ["home-where-on", "on"],
        ["home-where-under", "under"],
        ["home-where-next-to", "next to"],
      ],
      conceptId: w10.in.id,
      ok: "**in the box** = w pudełku.",
      hint: "Posłuchaj słowa przed **the box**.",
    }),
    quiz("hm10.where", {
      prompt: "Jak zapytasz „Gdzie jest mój kot?”",
      answer: "Where's my cat?",
      wrong: [
        ["Who's my cat?", "**Who** = kto. O miejsce pytamy **Where**."],
        ["What's my cat?", "**What** = co."],
      ],
      conceptId: G.where,
      ok: "**Where's…?** = Gdzie jest…?",
      hint: "Szukamy słowa „gdzie”.",
    }),
    gap("hm10.next", {
      sentence: "The lamp is ___ to the bed.",
      translation: "Lampa jest obok łóżka.",
      answer: "next",
      wrong: [
        ["in", "**in** = w (w środku)."],
        ["under", "**under** = pod."],
      ],
      conceptId: w10["next-to"].id,
      skill: "VOCABULARY",
      ok: "**next to** = obok.",
      hint: "„Obok” to dwa słowa: **… to**.",
    }),
    build("hm10.build", {
      pl: "Kot jest pod łóżkiem.",
      tokens: ["is", "The", "the", "under", "cat", "bed.", "on"],
      solution: "The cat is under the bed.",
      conceptId: G.where,
      tokenHints: { on: "**on** = na. Kot jest **pod** łóżkiem." },
      ok: "**The cat is under the bed.** = Kot jest pod łóżkiem.",
      hint: "Zacznij od **The cat is…**",
    }),
    say("hm10.say", {
      target: "Where's my teddy bear?",
      translation: "„Gdzie jest mój miś?”",
      conceptId: G.where,
      tip: "**Where's** czytamy **„łerz”**.",
      tipAudio: "Where's my teddy bear?",
    }),
    scene("hm10.scene", {
      title: "Szukamy zabawek",
      prompt: "Pomóż Robo znaleźć zabawki — spójrz na tabliczkę",
      setting: "home",
      character: { name: "Robo", role: "robot-pomocnik" },
      conceptId: G.where,
      start: "ball",
      board: { title: "GDZIE CO JEST?", rows: [["piłka", "pod łóżkiem"], ["autko", "na półce"], ["miś", "w pudełku"]] },
      nodes: {
        ball: ["Beep! Where's the ball?", [
          ["It's under the bed.", "car"],
          ["It's on the bed.", null, "Sprawdź tabliczkę: piłka jest **pod** łóżkiem — **under**.", w10.under.id],
        ]],
        car: ["Beep! And the car?", [
          ["It's on the shelf.", "teddy"],
          ["It's under the shelf.", null, "Sprawdź tabliczkę: autko jest **na** półce — **on**.", w10.on.id],
        ]],
        teddy: ["Beep! Where's the teddy bear?", [
          ["It's in the box.", "end"],
          ["It's next to the box.", null, "Miś jest **w** pudełku — **in**.", w10.in.id],
        ]],
        end: ["Beep beep! Thank you, {name}! All the toys are here!"],
      },
      done: "Scenka zaliczona! Wszystkie zabawki znalezione.",
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
  canDo: "Powtarzasz wszystko z Home: rodzinę, dom, zabawki, zwierzęta, to, co umiesz, ubrania i gdzie co jest.",
  outcome: "Home powtórzone!",
  minutes: 7,
  keyPhrases: ["She's my aunt.", "Have you got a cat?", "These are my socks."],
  words: [],
  exercises: [
    matching("hmr.words", [w1.grandpa, w3.garden, w5.puzzle, w7.mouse, w9.trousers], "Połącz pary ze wszystkich misji"),
    pictures("hmr.living-room", {
      word: w3["living-room"],
      items: [
        ["home-living-room", "living room"],
        ["home-bedroom", "bedroom"],
        ["home-kitchen", "kitchen"],
        ["home-bathroom", "bathroom"],
      ],
      hint: "Tu stoi kanapa i telewizor.",
    }),
    listen("hmr.listen", {
      say: "My uncle has got a horse!",
      speaker: { name: "Leo", caption: "Leo opowiada o wujku" },
      question: "Co ma wujek Leo?",
      answer: "konia",
      wrong: ["psa", "królika", "rower"],
      conceptId: w7.horse.id,
      ok: "**horse** = koń.",
      hint: "Posłuchaj ostatniego słowa.",
    }),
    quiz("hmr.she", {
      prompt: "Mówisz o cioci. Które zdanie jest dobre?",
      answer: "She's my aunt.",
      wrong: [
        ["He's my aunt.", "Ciocia to kobieta — **she**."],
        ["Her my aunt.", "Brakuje „jest”: **She is** = **She's**."],
      ],
      conceptId: G.heShe,
      ok: "**She's my aunt.** = To moja ciocia.",
      hint: "Ciocia to kobieta.",
    }),
    gap("hmr.can", {
      sentence: "Birds ___ fly.",
      translation: "Ptaki umieją latać.",
      answer: "can",
      wrong: [
        ["can't", "Ptaki latają!"],
        ["are", "Umieć = **can**."],
      ],
      conceptId: G.can,
      ok: "**Birds can fly.** = Ptaki umieją latać.",
      hint: "Szukamy słowa „umieją”.",
    }),
    build("hmr.build", {
      pl: "Czy masz kota?",
      tokens: ["got", "Have", "a", "you", "cat?", "Has"],
      solution: "Have you got a cat?",
      conceptId: w6["have-you-got"].id,
      tokenHints: { Has: "Z **you** mówimy **have**." },
      ok: "**Have you got a cat?** = Czy masz kota?",
      hint: "Pytanie zaczyna się od **Have**.",
    }),
    say("hmr.say", {
      target: "These are my socks.",
      translation: "„To są moje skarpetki.”",
      conceptId: G.theseThose,
    }),
    quiz("hmr.on", {
      prompt: "Książka leży na stole. Jak to powiesz?",
      answer: "The book is on the table.",
      wrong: [
        ["The book is under the table.", "**under** = pod."],
        ["The book is in the table.", "**in** = w środku."],
      ],
      conceptId: w10.on.id,
      ok: "**on** = na.",
      hint: "Szukamy słowa „na”.",
    }),
  ],
});

/* ---------- challenge ---------- */

const challenge = lesson({
  unitId: UNIT_ID,
  id: "l12-challenge",
  kind: "CHECKPOINT",
  order: 12,
  title: "Wyzwanie: Home",
  canDo: "Wielki finał świata: idziesz na urodziny Mii, przedstawiasz rodzeństwo, dajesz prezent i szukasz chomika.",
  outcome: "Świat Home ukończony!",
  minutes: 9,
  keyPhrases: ["This is my sister.", "Yes, I have.", "It's under the table."],
  words: [],
  exercises: [
    listen("hmc.listen", {
      say: "This is my cousin. His name is Max.",
      speaker: { name: "Mia", caption: "Mia przedstawia gościa" },
      question: "Kim jest Max dla Mii?",
      answer: "kuzynem",
      wrong: ["bratem", "wujkiem", "tatą"],
      conceptId: w2.cousin.id,
      ok: "**cousin** = kuzyn.",
      hint: "Posłuchaj słowa po **my**.",
    }),
    pictures("hmc.grandpa", {
      word: w1.grandpa,
      items: [
        ["home-grandpa", "grandpa"],
        ["home-grandma", "grandma"],
        ["home-dad", "dad"],
        ["home-brother", "brother"],
      ],
      hint: "Siwe włosy, okulary i spodnie.",
    }),
    quiz("hmc.has", {
      prompt: "Jak powiesz „Mój brat ma deskorolkę”?",
      answer: "My brother has got a skateboard.",
      wrong: [
        ["My brother have got a skateboard.", "Brat to „on” — mówimy **has got**."],
        ["My brother is got a skateboard.", "Mówimy **has got**, nie **is got**."],
      ],
      conceptId: G.hasGot,
      ok: "**has got** z jedną osobą: **My brother has got…**",
      hint: "Brat to „on” — z **he** to słowo się zmienia.",
    }),
    gap("hmc.those", {
      sentence: "Look! ___ are my shoes, over there.",
      translation: "Patrz! Tamte buty, tam, są moje.",
      answer: "Those",
      wrong: [
        ["These", "**these** — blisko. Buty są daleko (**over there**)."],
        ["That", "**that** to jedna rzecz."],
      ],
      conceptId: G.theseThose,
      ok: "Kilka rzeczy daleko → **those**.",
      hint: "Butów jest kilka i są daleko.",
    }),
    gap("hmc.toms", {
      sentence: "This is ___ dog.",
      translation: "To jest pies Toma.",
      answer: "Tom's",
      wrong: [
        ["Tom", "Dodaj **'s**, żeby powiedzieć, czyj jest pies."],
        ["Toms", "Potrzebny jest apostrof: **Tom's**."],
      ],
      conceptId: G.possessive,
      ok: "**Tom's dog** = pies Toma.",
      hint: "Czyj jest pies? Do imienia coś dodajemy.",
    }),
    build("hmc.build", {
      pl: "Umiem tańczyć, ale nie umiem śpiewać.",
      tokens: ["can't", "I", "dance,", "sing.", "but", "can", "I", "to"],
      solution: "I can dance, but I can't sing.",
      conceptId: G.can,
      tokenHints: { to: "Po **can** i **can't** nie ma **to**." },
      ok: "**I can dance, but I can't sing.**",
      hint: "Zacznij od **I can dance,** — potem **but**.",
    }),
    say("hmc.say", {
      target: "This is my house. Come in!",
      translation: "„To jest mój dom. Wejdź!”",
      conceptId: G.thisIs,
    }),
    scene("hmc.scene", {
      title: "Urodziny Mii",
      prompt: "Porozmawiaj z Mią na przyjęciu",
      setting: "party",
      character: { name: "Mia", role: "solenizantka" },
      conceptId: G.thisIs,
      start: "who",
      nodes: {
        who: ["Hi, {name}! Welcome to my party! Who's this?", [
          ["This is my sister, Ola.", "present"],
          ["This is my brother, Tom.", "present"],
          ["This is my house.", null, "Mia pyta, **kto** to jest — przedstaw osobę.", G.thisIs],
        ]],
        present: ["Hello! Oh, a present! Thank you! What is it?", [
          ["It's a teddy bear!", "pet"],
          ["It's a kite!", "pet"],
          ["It's my bedroom!", null, "Prezent to zabawka, a nie pokój 🙂", w5.toy.id],
        ]],
        pet: ["I love it! Have you got a pet, {name}?", [
          ["Yes, I have. A dog.", "where"],
          ["No, I haven't.", "where"],
          ["Yes, I can.", null, "Na **Have you got…?** odpowiadamy **Yes, I have** albo **No, I haven't**.", G.haveGot],
        ]],
        where: ["I've got a hamster! But where is he? Is he under the table?", [
          ["Yes! He's under the table!", "end"],
          ["No! He's on the chair!", "end"],
          ["Yes! He's in the table!", null, "Pod stołem = **under** the table.", w10.under.id],
        ]],
        end: ["There he is! Thank you, {name}! Let's have some cake!"],
      },
      done: "Wyzwanie zaliczone! Świetna zabawa na urodzinach.",
    }),
    matching("hmc.words", [w4.wardrobe, w6.scooter, w8.dance, w9.skirt, w10.behind], "Ostatnie pary — dasz radę!"),
  ],
});

/* ---------- the world ---------- */

export const homeConcepts: Concept[] = [
  ...[w1, w2, w3, w4, w5, w6, w7, w8, w9, w10].flatMap(wordConcepts),
  ...rules,
];

export const home: Unit = buildUnit({
  id: UNIT_ID,
  order: 2,
  level: "Pre-A1",
  title: "Home",
  subtitle: "Home and family",
  canDo: "Nazywasz rzeczy w domu i rodzinę",
  description: "Drugi świat: rodzina, dom i pokój, zabawki, zwierzątka, to, co umiesz, ubrania i gdzie co jest.",
  objectives: ["przedstawić rodzinę i opowiedzieć o zdjęciu", "oprowadzić kogoś po domu i pokoju", "powiedzieć, co masz i co umiesz", "powiedzieć, gdzie coś jest"],
  words: 100,
  grammar: ["pa1.this-that", "pa1.have-got", "pa1.can"],
  topic: "home",
  missionLabel: "Misja",
  missions: [family, whosThis, house, room, toys, haveGot, pets, can, clothes, where, reviewMission, challenge],
});
