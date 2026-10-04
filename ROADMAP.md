# KOMPAS — plan etapów do kompletnej aplikacji

Cel: działająca platforma, na której każdy może uczyć się angielskiego łatwo i bez reklam.
Cała nauka jest ułożona według poziomów CEFR: **Pre-A1 → A1 → A2 → B1 → B2**.
Płatności (14,99 zł / mies.) wchodzą dopiero wtedy, gdy jest za co płacić.

Trzy zasady kolejności:

1. **Każdy etap kończy się czymś, co da się otworzyć i sprawdzić** — nie makietą.
2. **Najpierw to, bez czego nie da się uczyć** (treść, konta), potem to, co naukę ulepsza
   (AI, wymowa), na końcu to, co na niej zarabia (płatności).
3. **Treść powstaje równolegle** od Etapu 02 do końca. To najdłuższa część projektu i zależy
   od nauczyciela, nie od kodu — dlatego narzędzia do treści są tak wcześnie.

| Etap | Co dochodzi | Dla kogo jest wtedy gotowe |
| --- | --- | --- |
| 00 | Fundament: silnik, mapa, program CEFR, rundy | do pokazania (zrobione) |
| 01 | Wersja pokazowa w sieci | znajomi i pierwsi testerzy |
| 02 | Narzędzia do treści + pierwszy pełny świat | tester przechodzi cały świat |
| 03 | Prawdziwe konta i baza danych | ten sam postęp na telefonie i komputerze |
| 04 | Cały pierwszy poziom + sprawdzian poziomu | uczeń kończy poziom i przechodzi dalej |
| 05 | Publiczny start (darmowa beta) | każdy z internetu |
| 06 | Lepsza nauka: powtórki, wymowa, rozmowy z AI | uczniowie wracający codziennie |
| 07 | Gra i motywacja | utrzymanie nawyku |
| 08 | Płatności 14,99 zł / mies. | pierwsi płacący |
| 09 | Kolejne poziomy i pozostałe tryby wiekowe | pełna ścieżka do B2 |
| 10 | Skala: panel treści, szkoły, aplikacje w sklepach | rozwój po starcie |

---

## Etap 00 — fundament (zrobione)

- Silnik lekcji (8 typów zadań), dialogi z gałęziami, XP, poziomy gracza, seria dni.
- Trzy tryby wiekowe na jednym silniku, onboarding z testem poziomującym.
- Program CEFR: liczba słów, gramatyka i umiejętności dla każdego poziomu; poziom kończy się
  dopiero po całym programie.
- Mapa-droga z ponumerowanymi misjami do B2, w trzech trybach.
- Rundy tematyczne bez końca: 12 tematów, ponad 500 słów.
- Powtórki błędów, panel rodzica, konta na urządzeniu, trzy konta testowe.
- **Ograniczenie:** napisane są 3 lekcje (po jednej na tryb), a konta żyją w przeglądarce.

## Etap 01 — wersja pokazowa w sieci

**Cel:** adres, który można wysłać komuś i otworzyć na telefonie.

- ✅ Wdrożenie na Vercel z repozytorium (każdy `git push` = nowa wersja).
- ✅ Instalacja na ekranie telefonu jak aplikacja (ikona, nazwa, ekran startowy).
- ✅ Licznik odwiedzin bez ciasteczek (po włączeniu Analytics w panelu Vercela).
- ✅ Zakładka „UWAGI” na każdym ekranie (wysyłka przez udostępnianie w telefonie).
- Własna domena (opcjonalnie już teraz).
- Test na prawdziwych telefonach: dźwięk, mikrofon, klawiatura, obrót ekranu.

**Gotowe, gdy:** 5–10 osób przeszło lekcję i rundę na własnym telefonie, a ich uwagi są spisane.

## Etap 02 — narzędzia do treści i pierwszy pełny świat

**Cel:** lekcje powstają szybko i bez programisty; jeden świat da się przejść od misji 1 do końca.

- **Szablon lekcji:** nauczyciel podaje słowa, zwroty i zdania, a aplikacja sama układa z nich
  zadania (pary, wybór, słuchanie, układanie zdań, luki, mówienie).
- **Arkusz treści:** lekcje i słowa wpisywane w arkuszu, import jednym poleceniem,
  z automatycznym sprawdzeniem błędów (brak tłumaczenia, zdanie nie do ułożenia itp.).
- **Pierwszy cały świat** w wybranym trybie: wszystkie misje, powtórka, wyzwanie na koniec.
- **Powtórka i wyzwanie świata** jako prawdziwe typy misji (dziś są tylko na mapie).
- **Lekcje gramatyczne:** krótkie wyjaśnienie + ćwiczenia do każdego zagadnienia z programu.
- **Ilustracje:** decyzja o źródle grafik 3D i podmiana rysunków w scenkach i przy słowach.
- **Głos:** nagrania lektora albo synteza mowy w chmurze zamiast głosu przeglądarki.
- Przegląd progów słów i list gramatyki z nauczycielem.

**Gotowe, gdy:** tester przechodzi cały świat po kolei, a nauczyciel sam dodał jedną lekcję.

**Decyzje przed etapem:** od którego trybu zaczynamy (propozycja: dzieci 8–12, bo ich pierwsza
lekcja i mapa są najdalej); skąd grafiki 3D; kto jest nauczycielem zatwierdzającym treść.

## Etap 03 — prawdziwe konta i baza danych

**Cel:** jedno konto na wszystkich urządzeniach, bezpiecznie i zgodnie z prawem.

- Baza danych i serwer: konta, profile, postęp, powtórki, słowa z rund
  (wymiana `lib/persistence` — interfejsy już są przygotowane).
- Logowanie: e-mail + hasło, potwierdzenie adresu, reset hasła, opcjonalnie Google.
- Synchronizacja postępu między telefonem a komputerem; przeniesienie postępu z urządzenia
  na konto przy pierwszym logowaniu.
- **Konto rodzica z profilami dzieci:** jeden rodzic, kilku uczniów, przełączanie profili,
  PIN do panelu rodzica.
- Zgody i prawo: polityka prywatności, regulamin, zgoda rodzica dla dzieci, eksport i usunięcie
  danych. Dane dzieci wymagają szczególnej ostrożności — warto skonsultować z prawnikiem.
- Kopie zapasowe, monitoring błędów, ochrona przed nadużyciami (limity logowań).
- Wyłączenie kont testowych na produkcji (zostają tylko w wersji deweloperskiej).

**Gotowe, gdy:** uczeń zaczyna lekcję na komputerze i kończy ją na telefonie.

## Etap 04 — cały pierwszy poziom

**Cel:** uczeń przechodzi poziom od początku do końca i dostaje następny.

- Wszystkie światy pierwszego poziomu w wybranym trybie (Pre-A1 i A1 u dzieci).
- **Sprawdzian poziomu:** test ze słów, gramatyki, słuchania i czytania; zaliczenie otwiera bramę.
- **Pełny test poziomujący:** obejmuje wszystkie poziomy i dostosowuje trudność do odpowiedzi.
- Bank słów rund tematycznych rozszerzony do progu poziomu (każde słowo programu jest w grze).
- Ekran „Mój poziom”: czego już umiem, czego brakuje do bramy.
- Potwierdzenie ukończenia poziomu (do pobrania / pokazania rodzicowi).

**Gotowe, gdy:** osoba zaczynająca od zera kończy A1 bez wyjścia poza aplikację.

## Etap 05 — publiczny start (darmowa beta)

**Cel:** aplikacja jest otwarta dla każdego, jeszcze bez płatności.

- Strona główna pisana pod prawdziwych użytkowników, widoczność w Google (zdjęcie `noindex`).
- E-maile: powitalny, przypomnienie o nauce, tygodniowy raport dla rodzica.
- Powiadomienia na telefonie (przypomnienie o serii dni) — za zgodą.
- Zgłaszanie błędu w zadaniu jednym kliknięciem; kolejka zgłoszeń dla nauczyciela.
- Przegląd dostępności (klawiatura, czytniki ekranu, kontrast) i szybkości na słabych telefonach.
- Tryb słabego internetu: rozpoczętą lekcję da się dokończyć bez sieci.
- Strona pomocy i kontakt.

**Gotowe, gdy:** nieznajoma osoba zakłada konto, uczy się tydzień i nie potrzebuje pomocy.

## Etap 06 — lepsza nauka

**Cel:** aplikacja uczy skuteczniej, nie tylko więcej.

- **Powtórki rozłożone w czasie** (algorytm zamiast prostego harmonogramu), wspólne dla lekcji i rund.
- **Mówienie:** prawdziwa ocena wymowy z informacją, co poprawić (dziś tylko porównanie słów).
- **Rozmowy z AI w scenkach:** swobodna rozmowa w kawiarni, hotelu, na lotnisku — na poziomie
  ucznia, z ograniczeniami bezpieczeństwa dla dzieci.
- **Pisanie:** krótkie teksty z informacją zwrotną (od A2).
- **Czytanie i słuchanie:** dłuższe teksty i nagrania z pytaniami (od A2).
- Statystyki umiejętności: słownictwo, gramatyka, słuchanie, mówienie, czytanie, pisanie.
- Plan dnia dobierany do słabych stron ucznia.

**Gotowe, gdy:** uczeń widzi, co mu idzie słabo, a aplikacja sama podsuwa mu właśnie to.

## Etap 07 — gra i motywacja

**Cel:** uczeń wraca codziennie, bo chce.

- Odznaki i kolekcje (pocztówki ze światów), nagrody za serię dni, „zamrożenie” serii.
- Sklepik za XP: awatar, własny pokój / baza (tryb dziecięcy i nastoletni).
- Wyzwania tygodniowe i rundy na czas.
- Postać-przewodnik w trybie dziecięcym.
- Później, do decyzji: rywalizacja ze znajomymi i rankingi (wymaga moderacji i zgód rodziców).

**Gotowe, gdy:** większość aktywnych uczniów ma serię dłuższą niż tydzień.

## Etap 08 — płatności

**Cel:** subskrypcja 14,99 zł / mies., uczciwie i bez reklam.

- Decyzja, co jest darmowe, a co w subskrypcji (np. pierwszy poziom i rundy za darmo).
- Płatność kartą i BLIK-iem, okres próbny, plan roczny, plan rodzinny.
- Zarządzanie subskrypcją w ustawieniach: zmiana, anulowanie, historia płatności, faktury.
- Regulamin sprzedaży, prawo odstąpienia, obsługa nieudanych płatności.
- Płaci zawsze rodzic / dorosły; w aplikacji dziecka nie ma żadnych zakupów.
- Hosting w planie komercyjnym (darmowe plany hostingu zwykle nie pozwalają na sprzedaż).

**Gotowe, gdy:** obca osoba kupuje, korzysta i anuluje subskrypcję bez kontaktu z Tobą.

**Warunek wejścia:** co najmniej dwa pełne poziomy w jednym trybie — inaczej nie ma za co płacić.

## Etap 09 — kolejne poziomy i tryby

Każdy krok to osobne wydanie: światy → lekcje → powtórki → sprawdzian poziomu.

1. A2 w pierwszym trybie.
2. Drugi tryb wiekowy: jego pierwszy poziom i A2.
3. B1, potem B2.
4. Trzeci tryb wiekowy.

Te same umiejętności CEFR, ale osobne sytuacje i teksty dla dzieci, nastolatków i dorosłych —
to trzy razy więcej treści, dlatego tryby wchodzą po kolei.

## Etap 10 — skala

- Panel treści dla nauczycieli w przeglądarce (zamiast arkusza), z podglądem lekcji i historią zmian.
- Szkoły i korepetytorzy: klasa, przypisywanie zadań, wyniki uczniów.
- Aplikacje w App Store i Google Play, jeśli instalacja z przeglądarki nie wystarczy.
- Kolejne języki interfejsu (np. ukraiński), potem kolejne języki do nauki.

---

## Co idzie równolegle przez cały czas

- **Treść:** lekcje, słowa, nagrania, ilustracje — od Etapu 02.
- **Testy z użytkownikami:** po każdym etapie kilka osób na własnych telefonach.
- **Jakość:** testy automatyczne przy każdej zmianie, poprawki zgłoszonych błędów.

## Czego świadomie nie robimy na początku

Rankingów i funkcji społecznościowych, natywnych aplikacji mobilnych, panelu CMS, poziomów C1–C2,
reklam (nigdy). Każda z tych rzeczy ma swoje miejsce w planie albo jest poza nim.
