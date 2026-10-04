import type { CEFRLevel } from "@/types";

/**
 * TOPIC WORD BANK
 *
 * Words grouped by topic and CEFR level. Endless practice rounds
 * (features/practice/rounds.ts) are generated from this file, so adding a
 * word or a whole topic here is all it takes to make it playable.
 *
 * Rules for content authors:
 *   - inside one topic every English term and every Polish translation is
 *     unique (they are used as wrong answers for each other),
 *   - a word sits at the level where learners first need it.
 *
 * The lists are a starting set, to be reviewed with the teacher.
 */

export interface TopicWord {
  id: string;
  term: string;
  translation: string;
  level: CEFRLevel;
}

export interface Topic {
  id: string;
  title: { pl: string; en: string };
  words: TopicWord[];
}

type Pairs = [term: string, translation: string][];

function topic(id: string, pl: string, en: string, levels: Partial<Record<CEFRLevel, Pairs>>): Topic {
  const words = (Object.entries(levels) as [CEFRLevel, Pairs][]).flatMap(([level, pairs]) =>
    pairs.map(([term, translation]) => ({
      id: `${id}.${term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      term,
      translation,
      level,
    })),
  );
  return { id, title: { pl, en }, words };
}

export const TOPICS: Topic[] = [
  topic("food", "Jedzenie i picie", "Food & drink", {
    "Pre-A1": [["apple", "jabłko"], ["bread", "chleb"], ["milk", "mleko"], ["water", "woda"], ["egg", "jajko"], ["banana", "banan"], ["cake", "ciasto"], ["juice", "sok"]],
    A1: [["cheese", "ser"], ["chicken", "kurczak"], ["rice", "ryż"], ["soup", "zupa"], ["breakfast", "śniadanie"], ["vegetables", "warzywa"], ["fruit", "owoce"], ["sandwich", "kanapka"], ["tea", "herbata"], ["hungry", "głodny"], ["thirsty", "spragniony"], ["menu", "karta dań"]],
    A2: [["bill", "rachunek"], ["waiter", "kelner"], ["dessert", "deser"], ["spicy", "ostry"], ["to order", "zamawiać"], ["fresh", "świeży"], ["fried", "smażony"], ["slice", "plasterek"], ["recipe", "przepis"], ["tip", "napiwek"]],
    B1: [["ingredient", "składnik"], ["raw", "surowy"], ["flavour", "smak"], ["portion", "porcja"], ["to stir", "mieszać"], ["starter", "przystawka"], ["main course", "danie główne"], ["takeaway", "jedzenie na wynos"]],
    B2: [["cuisine", "kuchnia danego kraju"], ["nutritious", "pożywny"], ["to season", "przyprawiać"], ["leftovers", "resztki"], ["craving", "zachcianka"], ["savoury", "wytrawny"], ["to simmer", "gotować na wolnym ogniu"], ["appetising", "apetyczny"]],
  }),
  topic("clothes", "Ubrania", "Clothes", {
    "Pre-A1": [["hat", "czapka"], ["shoes", "buty"], ["dress", "sukienka"], ["T-shirt", "koszulka"], ["socks", "skarpetki"], ["jacket", "kurtka"], ["trousers", "spodnie"], ["skirt", "spódnica"]],
    A1: [["coat", "płaszcz"], ["jumper", "sweter"], ["shirt", "koszula"], ["scarf", "szalik"], ["gloves", "rękawiczki"], ["boots", "kozaki"], ["to wear", "nosić"], ["size", "rozmiar"], ["pocket", "kieszeń"], ["shorts", "szorty"]],
    A2: [["to try on", "przymierzać"], ["tight", "ciasny"], ["loose", "luźny"], ["fitting room", "przymierzalnia"], ["sleeve", "rękaw"], ["belt", "pasek"], ["suit", "garnitur"], ["comfortable", "wygodny"], ["fashionable", "modny"], ["trainers", "buty sportowe"]],
    B1: [["casual", "nieformalny"], ["striped", "w paski"], ["plain", "gładki, bez wzoru"], ["fabric", "tkanina"], ["to suit", "pasować komuś"], ["outfit", "strój"], ["second-hand", "z drugiej ręki"], ["to get dressed", "ubierać się"]],
    B2: [["tailored", "szyty na miarę"], ["to dress up", "wystroić się"], ["worn out", "znoszony"], ["garment", "część garderoby"], ["to go with", "pasować do czegoś"], ["dress code", "wymagany strój"], ["baggy", "workowaty"], ["accessories", "dodatki"]],
  }),
  topic("home", "Dom", "Home", {
    "Pre-A1": [["bed", "łóżko"], ["chair", "krzesło"], ["table", "stół"], ["door", "drzwi"], ["window", "okno"], ["room", "pokój"], ["lamp", "lampa"], ["house", "dom"]],
    A1: [["kitchen", "kuchnia"], ["bathroom", "łazienka"], ["bedroom", "sypialnia"], ["living room", "salon"], ["garden", "ogród"], ["fridge", "lodówka"], ["wardrobe", "szafa"], ["floor", "podłoga"], ["stairs", "schody"], ["key", "klucz"]],
    A2: [["flat", "mieszkanie"], ["neighbour", "sąsiad"], ["rent", "czynsz"], ["furniture", "meble"], ["to tidy", "sprzątać"], ["shelf", "półka"], ["washing machine", "pralka"], ["cooker", "kuchenka"], ["heating", "ogrzewanie"], ["upstairs", "na górze"]],
    B1: [["landlord", "właściciel mieszkania"], ["to move in", "wprowadzić się"], ["cosy", "przytulny"], ["spacious", "przestronny"], ["household chores", "obowiązki domowe"], ["to redecorate", "odnowić"], ["ceiling", "sufit"], ["basement", "piwnica"]],
    B2: [["mortgage", "kredyt hipoteczny"], ["tenant", "najemca"], ["to renovate", "remontować"], ["detached house", "dom wolnostojący"], ["utility bills", "rachunki za media"], ["cramped", "ciasny, zagracony"], ["to furnish", "umeblować"], ["storage space", "miejsce do przechowywania"]],
  }),
  topic("family", "Rodzina i ludzie", "Family & people", {
    "Pre-A1": [["mum", "mama"], ["dad", "tata"], ["sister", "siostra"], ["brother", "brat"], ["baby", "niemowlę"], ["friend", "przyjaciel"], ["boy", "chłopiec"], ["girl", "dziewczynka"]],
    A1: [["grandmother", "babcia"], ["grandfather", "dziadek"], ["aunt", "ciocia"], ["uncle", "wujek"], ["cousin", "kuzyn"], ["parents", "rodzice"], ["husband", "mąż"], ["wife", "żona"], ["tall", "wysoki"], ["young", "młody"]],
    A2: [["married", "po ślubie"], ["relatives", "krewni"], ["twins", "bliźniaki"], ["friendly", "przyjazny"], ["shy", "nieśmiały"], ["wedding", "wesele"], ["teenager", "nastolatek"], ["adult", "dorosły"], ["to grow up", "dorastać"], ["generous", "hojny"]],
    B1: [["reliable", "niezawodny"], ["stubborn", "uparty"], ["to get on with", "dogadywać się z"], ["to bring up", "wychowywać"], ["in-laws", "teściowie"], ["only child", "jedynak"], ["relationship", "związek"], ["to argue", "kłócić się"]],
    B2: [["upbringing", "wychowanie"], ["siblings", "rodzeństwo"], ["to take after", "być podobnym do kogoś z rodziny"], ["close-knit", "zżyty"], ["to fall out with", "pokłócić się z"], ["considerate", "taktowny"], ["self-confident", "pewny siebie"], ["to look up to", "podziwiać"]],
  }),
  topic("school", "Szkoła i nauka", "School & learning", {
    "Pre-A1": [["book", "książka"], ["pen", "długopis"], ["pencil", "ołówek"], ["school bag", "plecak"], ["teacher", "nauczyciel"], ["desk", "ławka"], ["ruler", "linijka"], ["rubber", "gumka"]],
    A1: [["lesson", "lekcja"], ["homework", "praca domowa"], ["subject", "przedmiot"], ["break", "przerwa"], ["timetable", "plan lekcji"], ["notebook", "zeszyt"], ["to learn", "uczyć się"], ["to read", "czytać"], ["to write", "pisać"], ["test", "sprawdzian"]],
    A2: [["exam", "egzamin"], ["to pass", "zdać"], ["to fail", "nie zdać"], ["mark", "ocena"], ["to revise", "powtarzać materiał"], ["history", "historia"], ["dictionary", "słownik"], ["mistake", "błąd"], ["to explain", "wyjaśniać"], ["term", "semestr"]],
    B1: [["degree", "dyplom uczelni"], ["lecture", "wykład"], ["assignment", "zadanie do oddania"], ["to graduate", "ukończyć studia"], ["deadline", "termin"], ["to take notes", "robić notatki"], ["scholarship", "stypendium"], ["research", "badania"]],
    B2: [["curriculum", "program nauczania"], ["tuition fees", "czesne"], ["to enrol", "zapisać się"], ["thesis", "praca dyplomowa"], ["compulsory", "obowiązkowy"], ["to cram", "wkuwać"], ["plagiarism", "plagiat"], ["to drop out", "rzucić szkołę"]],
  }),
  topic("city", "Miasto", "City", {
    "Pre-A1": [["shop", "sklep"], ["street", "ulica"], ["car", "samochód"], ["bus", "autobus"], ["bike", "rower"], ["tree", "drzewo"], ["road", "droga"], ["bridge", "most"]],
    A1: [["station", "dworzec"], ["square", "plac"], ["library", "biblioteka"], ["museum", "muzeum"], ["traffic lights", "światła"], ["corner", "róg"], ["left", "w lewo"], ["right", "w prawo"], ["straight on", "prosto"], ["near", "blisko"]],
    A2: [["pedestrian", "pieszy"], ["crossing", "przejście dla pieszych"], ["roundabout", "rondo"], ["traffic jam", "korek"], ["town hall", "ratusz"], ["car park", "parking"], ["crowded", "zatłoczony"], ["underground", "metro"], ["to get lost", "zgubić się"], ["opposite", "naprzeciwko"]],
    B1: [["suburbs", "przedmieścia"], ["district", "dzielnica"], ["rush hour", "godziny szczytu"], ["public transport", "komunikacja miejska"], ["to commute", "dojeżdżać do pracy"], ["pavement", "chodnik"], ["landmark", "charakterystyczny punkt"], ["noisy", "hałaśliwy"]],
    B2: [["outskirts", "obrzeża"], ["congestion", "zator drogowy"], ["skyscraper", "wieżowiec"], ["vibrant", "tętniący życiem"], ["run-down", "zaniedbany"], ["to regenerate", "rewitalizować"], ["residential area", "dzielnica mieszkaniowa"], ["infrastructure", "infrastruktura"]],
  }),
  topic("travel", "Podróże", "Travel", {
    "Pre-A1": [["plane", "samolot"], ["train", "pociąg"], ["boat", "łódka"], ["ticket", "bilet"], ["map", "mapa"], ["sea", "morze"], ["beach", "plaża"], ["holiday", "wakacje"]],
    A1: [["airport", "lotnisko"], ["passport", "paszport"], ["suitcase", "walizka"], ["platform", "peron"], ["to arrive", "przyjeżdżać"], ["to leave", "wyjeżdżać"], ["single ticket", "bilet w jedną stronę"], ["return ticket", "bilet powrotny"], ["late", "spóźniony"], ["trip", "wycieczka"]],
    A2: [["boarding pass", "karta pokładowa"], ["gate", "bramka"], ["delayed", "opóźniony"], ["luggage", "bagaż"], ["customs", "odprawa celna"], ["departure", "odlot"], ["arrival", "przylot"], ["to book", "rezerwować"], ["journey", "podróż"], ["abroad", "za granicą"]],
    B1: [["to check in", "odprawić się"], ["connecting flight", "lot z przesiadką"], ["aisle seat", "miejsce przy przejściu"], ["to cancel", "odwołać"], ["travel insurance", "ubezpieczenie podróżne"], ["destination", "cel podróży"], ["sightseeing", "zwiedzanie"], ["itinerary", "plan podróży"]],
    B2: [["layover", "długa przesiadka"], ["to set off", "wyruszyć"], ["off the beaten track", "z dala od utartych szlaków"], ["jet lag", "zmęczenie po zmianie strefy czasowej"], ["to get away", "wyrwać się na urlop"], ["breathtaking", "zapierający dech"], ["remote", "odległy"], ["to board", "wchodzić na pokład"]],
  }),
  topic("hotel", "Hotel i nocleg", "Hotel", {
    A1: [["reception", "recepcja"], ["key card", "karta do drzwi"], ["towel", "ręcznik"], ["pillow", "poduszka"], ["blanket", "koc"], ["shower", "prysznic"], ["night", "noc"], ["double room", "pokój dwuosobowy"], ["single room", "pokój jednoosobowy"], ["breakfast included", "ze śniadaniem"]],
    A2: [["reservation", "rezerwacja"], ["to check out", "wymeldować się"], ["lift", "winda"], ["receipt", "paragon"], ["available", "dostępny"], ["guest", "gość"], ["air conditioning", "klimatyzacja"], ["to complain", "złożyć skargę"], ["quiet", "cichy"], ["to stay", "zatrzymać się"]],
    B1: [["deposit", "kaucja"], ["to confirm", "potwierdzić"], ["vacancy", "wolny pokój"], ["facilities", "udogodnienia"], ["to overcharge", "policzyć za dużo"], ["full board", "pełne wyżywienie"], ["late check-out", "późne wymeldowanie"], ["to upgrade", "podwyższyć standard"]],
    B2: [["complimentary", "bezpłatny, w cenie"], ["amenities", "wyposażenie i usługi"], ["to accommodate", "zakwaterować"], ["refund", "zwrot pieniędzy"], ["peak season", "szczyt sezonu"], ["to compensate", "zrekompensować"], ["en-suite", "z własną łazienką"], ["hospitality", "gościnność"]],
  }),
  topic("animals", "Zwierzęta i przyroda", "Animals & nature", {
    "Pre-A1": [["cat", "kot"], ["dog", "pies"], ["bird", "ptak"], ["fish", "ryba"], ["horse", "koń"], ["cow", "krowa"], ["flower", "kwiat"], ["sun", "słońce"]],
    A1: [["rabbit", "królik"], ["mouse", "mysz"], ["lion", "lew"], ["monkey", "małpa"], ["elephant", "słoń"], ["forest", "las"], ["river", "rzeka"], ["mountain", "góra"], ["rain", "deszcz"], ["snow", "śnieg"]],
    A2: [["wild", "dziki"], ["farm", "gospodarstwo"], ["to feed", "karmić"], ["tail", "ogon"], ["wing", "skrzydło"], ["insect", "owad"], ["lake", "jezioro"], ["island", "wyspa"], ["storm", "burza"], ["to protect", "chronić"]],
    B1: [["species", "gatunek"], ["endangered", "zagrożony wyginięciem"], ["habitat", "siedlisko"], ["to hunt", "polować"], ["mammal", "ssak"], ["pollution", "zanieczyszczenie"], ["environment", "środowisko"], ["wildlife", "dzika przyroda"]],
    B2: [["extinct", "wymarły"], ["predator", "drapieżnik"], ["biodiversity", "bioróżnorodność"], ["conservation", "ochrona przyrody"], ["to thrive", "dobrze się rozwijać"], ["drought", "susza"], ["deforestation", "wylesianie"], ["sustainable", "zrównoważony"]],
  }),
  topic("health", "Ciało i zdrowie", "Body & health", {
    "Pre-A1": [["head", "głowa"], ["hand", "dłoń"], ["leg", "noga"], ["eye", "oko"], ["nose", "nos"], ["mouth", "usta"], ["ear", "ucho"], ["hair", "włosy"]],
    A1: [["arm", "ręka"], ["foot", "stopa"], ["tooth", "ząb"], ["back", "plecy"], ["stomach", "brzuch"], ["ill", "chory"], ["doctor", "lekarz"], ["tired", "zmęczony"], ["a cold", "przeziębienie"], ["to hurt", "boleć"]],
    A2: [["headache", "ból głowy"], ["temperature", "gorączka"], ["medicine", "lekarstwo"], ["chemist's", "apteka"], ["appointment", "wizyta"], ["cough", "kaszel"], ["to feel sick", "mieć mdłości"], ["healthy", "zdrowy"], ["to break", "złamać"], ["dentist", "dentysta"]],
    B1: [["prescription", "recepta"], ["injury", "uraz"], ["to recover", "wyzdrowieć"], ["symptom", "objaw"], ["allergic", "uczulony"], ["painkiller", "środek przeciwbólowy"], ["check-up", "badanie kontrolne"], ["to sprain", "skręcić"]],
    B2: [["side effect", "skutek uboczny"], ["to diagnose", "zdiagnozować"], ["chronic", "przewlekły"], ["surgery", "operacja"], ["immune system", "układ odpornościowy"], ["to relieve", "złagodzić"], ["well-being", "dobre samopoczucie"], ["contagious", "zaraźliwy"]],
  }),
  topic("free-time", "Czas wolny i sport", "Free time & sport", {
    "Pre-A1": [["ball", "piłka"], ["game", "gra"], ["toy", "zabawka"], ["to play", "grać"], ["to run", "biegać"], ["to swim", "pływać"], ["to jump", "skakać"], ["song", "piosenka"]],
    A1: [["football", "piłka nożna"], ["to dance", "tańczyć"], ["to draw", "rysować"], ["guitar", "gitara"], ["cinema", "kino"], ["team", "drużyna"], ["to win", "wygrać"], ["match", "mecz"], ["swimming pool", "basen"], ["to watch", "oglądać"]],
    A2: [["to lose", "przegrać"], ["to practise", "ćwiczyć"], ["competition", "zawody"], ["score", "wynik"], ["to go camping", "jechać pod namiot"], ["tent", "namiot"], ["concert", "koncert"], ["to collect", "zbierać"], ["board game", "gra planszowa"], ["gym", "siłownia"]],
    B1: [["to take up", "zacząć uprawiać"], ["championship", "mistrzostwa"], ["opponent", "przeciwnik"], ["referee", "sędzia"], ["to keep fit", "dbać o formę"], ["spectator", "widz"], ["to train", "trenować"], ["equipment", "sprzęt"]],
    B2: [["endurance", "wytrzymałość"], ["to unwind", "odprężyć się"], ["pastime", "ulubione zajęcie"], ["competitive", "nastawiony na rywalizację"], ["to outperform", "wypaść lepiej niż"], ["amateur", "amator"], ["stamina", "kondycja"], ["a draw", "remis"]],
  }),
  topic("work", "Praca i pieniądze", "Work & money", {
    A1: [["job", "praca"], ["money", "pieniądze"], ["office", "biuro"], ["boss", "szef"], ["shop assistant", "sprzedawca"], ["to work", "pracować"], ["to buy", "kupować"], ["to pay", "płacić"], ["price", "cena"], ["cheap", "tani"], ["expensive", "drogi"]],
    A2: [["salary", "pensja"], ["meeting", "spotkanie"], ["colleague", "kolega z pracy"], ["to earn", "zarabiać"], ["to spend", "wydawać"], ["cash", "gotówka"], ["discount", "zniżka"], ["customer", "klient"], ["part-time", "na pół etatu"], ["to apply for", "ubiegać się o"]],
    B1: [["CV", "życiorys"], ["interview", "rozmowa kwalifikacyjna"], ["to hire", "zatrudnić"], ["to resign", "zrezygnować z pracy"], ["promotion", "awans"], ["overtime", "nadgodziny"], ["invoice", "faktura"], ["to save up", "odkładać pieniądze"]],
    B2: [["redundancy", "redukcja etatów"], ["revenue", "przychód"], ["to negotiate", "negocjować"], ["shareholder", "udziałowiec"], ["workload", "obciążenie pracą"], ["perk", "benefit pracowniczy"], ["to delegate", "delegować zadania"], ["turnover", "obrót"]],
  }),
];

export function getTopic(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}
