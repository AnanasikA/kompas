# KOMPAS

Platforma do nauki angielskiego dla dzieci (8–12), nastolatków (13–17) i dorosłych (18+).
Jeden silnik nauki i jeden system poziomów CEFR, trzy warstwy prezentacji.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Zustand.

## Uruchomienie

```bash
npm install
npm run dev          # http://localhost:3000
```

Otwórz **http://localhost:3000** w przeglądarce na tym samym komputerze.

**Telefon / tablet w tej samej sieci Wi-Fi:** po starcie Next.js wypisuje w terminalu drugi adres
(`Network: http://192.168.x.x:3000`) — ten adres wpisz w telefonie. Adresy sieci domowej są dopuszczone
w `next.config.ts` (`allowedDevOrigins`). Bez tego wpisu tryb deweloperski wysyła na inne urządzenia sam
wygląd strony, a blokuje skrypty — strona wygląda poprawnie, ale nic nie reaguje na kliknięcia.
Jeżeli Twoja sieć ma inną adresację, dopisz ją tam i uruchom `npm run dev` ponownie.

### Konta testowe

Trzy stałe konta, po jednym na tryb wiekowy. Na ekranie logowania są jako przyciski
(„Konta testowe”) — jedno kliknięcie loguje. Można też wpisać dane ręcznie:

| Tryb | E-mail | Hasło | Uczeń | Poziom |
| --- | --- | --- | --- | --- |
| Dziecko 8–12 (Explorer) | `dziecko@kompas.test` | `kompas123` | Zosia, 10 lat | A1 |
| Nastolatek 13–17 (Player) | `nastolatek@kompas.test` | `kompas123` | Kuba, 15 lat | A2 |
| Dorosły 18+ (Navigator) | `dorosly@kompas.test` | `kompas123` | Anna | A2 |

Każde konto ma własny, zapisywany postęp (wylogowanie niczego nie usuwa). Konto dziecka jest kontem
rodzica — ma dostęp do panelu rodzica. Żeby zacząć od zera: Ustawienia → „Wyzeruj postęp”.
Definicje są w `data/demo/accounts.ts`; przed publicznym startem ustaw tam `DEMO_ACCOUNTS_ENABLED = false`.

Własne konta zakłada się normalnie przez „Załóż konto” (przechodzą cały onboarding). Na jednym
urządzeniu może być dowolnie wiele kont obok siebie.

### Wdrożenie na Vercel

Projekt nie wymaga żadnej konfiguracji ani zmiennych środowiskowych.

1. Wyślij repozytorium na GitHub (`git remote add origin … && git push -u origin main`).
2. Na vercel.com: **Add New → Project → Import** tego repozytorium → **Deploy**
   (Vercel sam rozpozna Next.js; polecenie budowania to `next build`).
3. Każdy kolejny `git push` na `main` wdraża nową wersję; inne gałęzie dostają adres podglądu.

Na wdrożonej wersji działają te same konta testowe. Dane nadal zapisują się w przeglądarce
urządzenia (telefon i komputer mają osobny postęp) — wspólne konta to Etap 1 w `ROADMAP.md`.
Strona ma `noindex` (`app/layout.tsx`), żeby wersja pokazowa nie trafiła do Google.

### Wersja pokazowa: instalacja, uwagi, statystyki

- **Instalacja na telefonie:** `app/manifest.ts` + ikony w `public/icons`. Android/Chrome: menu →
  „Zainstaluj aplikację”; iPhone/Safari: Udostępnij → „Do ekranu początkowego”.
  Aplikacja nie działa jeszcze bez internetu (to Etap 05).
- **Zakładka „UWAGI”** (`components/FeedbackTab.tsx`) jest na każdym ekranie. Tester wpisuje uwagę,
  klika „Wyślij uwagę” i wiadomość przychodzi na adres z `data/site.ts` razem z ekranem, trybem
  i urządzeniem. Wysyłka idzie przez FormSubmit (formsubmit.co), bo aplikacja nie ma jeszcze serwera.
  **Jednorazowo:** pierwsza uwaga wysłana z danej strony nie dochodzi — FormSubmit wysyła wtedy
  e-mail z linkiem „Activate”; po kliknięciu kolejne uwagi dochodzą normalnie.
- **Statystyki odwiedzin:** `@vercel/analytics`, działa tylko na Vercelu i dopiero po kliknięciu
  **Enable** w zakładce Analytics projektu. Bez ciasteczek; pokazuje liczbę odwiedzin, strony,
  kraj i urządzenie — nie konkretne osoby.

### Polecenia

| Polecenie | Co robi |
| --- | --- |
| `npm run check` | TypeScript + ESLint + testy jednostkowe |
| `npm test` | testy jednostkowe (Vitest): silnik nauki i konta |
| `npm run build && npm run start -- -p 3100` | build produkcyjny |
| `npm run e2e` | pełny flow w przeglądarce (Playwright, wymaga serwera na :3100) |

Plan dalszych etapów (program CEFR, backend, płatności): [`ROADMAP.md`](./ROADMAP.md).

## Cztery zasady

```
DESIGN            = prototyp (tokeny w app/globals.css)
CONTENT           = wymienialne dane w /data
LEARNING ENGINE   = wspólna logika w /features/learning
EXPERIENCE        = zależna od wieku (/features/theme)
```

## Struktura

```
app/                      trasy (cienkie — wybierają ekran)
  page.tsx                landing
  auth/                   rejestracja / logowanie
  onboarding/             kto się uczy → kroki zależne od wieku → wynik
  (app)/                  ekrany z nawigacją: home, journey, practice, me, settings
  (focus)/                pełny ekran: lesson/[id], …/play, …/summary, …/reward, practice/session, parent
components/ui/            Logo, ilustracje, ikony, RichText
data/
  cefr/program.ts         PROGRAM CEFR: słowa, gramatyka i „potrafię” dla każdego poziomu
  curriculum/             Course → Unit → Lesson → Exercise[] (child / teen / adult)
  topics/                 bank słów według tematów i poziomów (rundy bez końca)
  placement/              testy poziomujące
  demo/                   konta testowe
  onboarding/             opcje onboardingu
features/
  learning/               SILNIK: sprawdzanie odpowiedzi, sesja lekcji, XP, dialogue engine
  lessons/                odtwarzacz lekcji + widoki ćwiczeń (wspólne dla 3 trybów)
  practice/               powtórki błędów + rundy tematyczne bez końca (rounds.ts)
  progress/               statusy światów i misji (units.ts), postęp poziomów CEFR (cefr.ts)
  gamification/           poziomy, seria, cel dnia, misje dnia
  onboarding/             kroki CHILD / TEEN / ADULT, test poziomujący
  dashboard/ journey/     ekrany per tryb wiekowy
  parent/                 panel rodzica
  theme/                  AgeScope, skórki (skins.ts), powłoki nawigacji
  auth/                   formularz, bramka dostępu
lib/
  persistence/            AppStateRepository + AuthRepository (dziś localStorage)
  services/               tts.ts (audio), speech-recognition.ts (mowa)
  store/                  stan aplikacji (Zustand) — spina silnik z zapisem
types/                    User, curriculum, progress
tests/                    engine, program, rounds, auth (.test.ts) + e2e/
```

## Jak dodać lekcję

Bez nowych stron React — tylko dane:

1. Utwórz plik, np. `data/curriculum/child/a1/city.ts`, i wyeksportuj `Lesson`
   (wzór: `data/curriculum/child/a1/food.ts`).
2. Dodaj `Concept` dla każdej rzeczy, w której można się pomylić — z niego powstaje
   pozycja w Treningu i krótkie pytanie powtórkowe.
3. Wstaw lekcję do listy `missions` odpowiedniego świata, w miejsce jej tytułu.
   Liczbę słów świata dzieli `buildUnit` — napisana lekcja liczy swoje `vocabulary`.

`npm test` sprawdza spójność treści: każde ćwiczenie wskazuje istniejący `Concept`,
każde zdanie da się ułożyć z banku słów, każdy dialog ma wyjście z każdego węzła.

Typy ćwiczeń: `MULTIPLE_CHOICE`, `IMAGE_CHOICE`, `LISTENING`, `SENTENCE_BUILDER`,
`FILL_GAP`, `MATCHING`, `SPEAKING`, `DIALOGUE`.

## Program CEFR

`data/cefr/program.ts` mówi, ile trzeba umieć na każdym poziomie — tak samo dla dzieci,
nastolatków i dorosłych:

| Poziom | Nowe słowa | Razem | Zagadnienia gramatyczne |
| --- | --- | --- | --- |
| Pre-A1 | 200 | 200 | 6 |
| A1 | 400 | 600 | 11 |
| A2 | 600 | 1200 | 11 |
| B1 | 1000 | 2200 | 11 |
| B2 | 1500 | 3700 | 12 |

CEFR nie podaje oficjalnych liczb słów; to progi zbliżone do tych z podręczników i list
egzaminacyjnych, do zatwierdzenia z nauczycielem. Zmiana liczby w tym pliku zmienia całą aplikację.

Każdy świat / arc / moduł w `data/curriculum` ma przypisane: poziom, liczbę słów, zagadnienia
gramatyczne i ponumerowane misje. `npm test` pilnuje, żeby w każdym trybie słowa światów sumowały
się dokładnie do progu poziomu i żeby każde zagadnienie gramatyczne było gdzieś uczone.
Nastolatki i dorośli zaczynają od A1, więc ich A1 obejmuje też program Pre-A1 (600 słów).

Dziś zaplanowane: dzieci 31 światów / 382 misje, nastolatki 30 arców / 276 misji, dorośli 30 modułów /
208 lekcji. **Napisane i grywalne są 3 lekcje** (po jednej na tryb); reszta ma tytuły (Pre-A1 i A1
u dzieci, część u pozostałych) albo czeka na tytuł i treść.

## Rundy bez końca

`data/topics/index.ts` — 12 tematów (jedzenie, ubrania, dom, hotel…), ponad 500 słów z poziomem.
Z tego banku `features/practice/rounds.ts` generuje rundy po 8 zadań na poziomie ucznia:
najpierw słowa, przy których była pomyłka, potem nowe, potem najsłabiej znane. Rund nie da się
„skończyć”. Dodanie słowa albo tematu do pliku od razu trafia do gry; światy wskazują swój temat
polem `topic`.

## Ikony i kroje

- Ikony: jedna rodzina liniowa (`lucide-react`), opakowana w `components/ui/icons.tsx`.
- Kroje: Bricolage Grotesque (nagłówki dzieci i nastolatków), Instrument Sans (tekst oraz —
  zwężony i półgruby — nagłówki dorosłych), DM Mono (etykiety). Krój nagłówków dorosłych zmienia
  się jedną linią `--font-serif` w `app/globals.css`.

## Trzy tryby wiekowe

`User.ageGroup` → `<AgeScope>` ustawia `data-age` i kontekst. Ekrany o różnym układzie
(dashboard, journey, onboarding) mają osobne komponenty per tryb; ćwiczenia są wspólne
i biorą wygląd ze `features/theme/skins.ts`. Logika pod spodem jest ta sama.

## Miejsca przygotowane na wymianę

| Dziś | Później | Gdzie |
| --- | --- | --- |
| localStorage (jeden dokument na konto) | baza danych / API | `lib/persistence` — implementacje `AppStateRepository` i `AuthRepository` |
| TTS przeglądarki | nagrania lub TTS w chmurze | `AudioSource.src` w treści albo `TtsEngine` w `lib/services/tts.ts` |
| Web Speech API (porównanie transkrypcji) | ocena wymowy | `PronunciationAssessor` w `lib/services/speech-recognition.ts` |
| gałęzie dialogu z treści | rozmowa z AI | `DialogueResponder` w `features/learning/dialogue/engine.ts` |
| prosty harmonogram powtórek (new → learning → mastered, weak) | spaced repetition | `ReviewScheduler` w `features/practice/review.ts` |
| konta na urządzeniu (hasło sprawdzane lokalnie — to nie jest zabezpieczenie) | prawdziwe logowanie i sesje | `features/auth/service.ts` + `AuthRepository` |

## Reguły, które warto znać

- **XP**: pełne za ćwiczenie bez błędu, połowa po błędzie, zero za pominięte; premia za ukończenie lekcji.
  Powtórka lekcji dolicza tylko poprawę najlepszego wyniku.
- **Trafność**: udział ćwiczeń rozwiązanych za pierwszym razem (pominięte się nie liczą).
- **Poziom gracza**: poziom *n* wymaga *n* × 100 XP.
- **Świat jest ukończony** dopiero po wszystkich swoich misjach, także tych jeszcze nienapisanych.
  Jedna zrobiona lekcja to „1 / 10”, nie „100%”.
- **Poziom CEFR jest ukończony** dopiero po wszystkich światach poziomu (wszystkie słowa i cała
  gramatyka) albo gdy test poziomujący ustawił ucznia wyżej. Wtedy `currentCEFR` przechodzi na następny.
- **Odblokowanie świata**: we wcześniejszych światach nie została żadna napisana lekcja do zrobienia.
  Światy czekające na treść nie blokują ścieżki — mają oznaczenie „w przygotowaniu”.
- **Runda tematyczna**: 2 XP za zadanie bez błędu (4 za łączenie par), połowa po błędzie, +4 za rundę.
  Słowo jest „opanowane” po dwóch rundach z rzędu bez pomyłki.
- **Mówienie**: sprawdzamy, które słowa rozpoznała przeglądarka. To nie jest ocena wymowy
  i interfejs tak tego nie nazywa. Bez rozpoznawania mowy uczeń potwierdza samodzielnie.

Treść lekcji, listy słów i podział programu są na tym etapie propozycją — do weryfikacji z nauczycielem.
