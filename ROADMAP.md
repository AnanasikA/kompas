# KOMPAS — plan etapów

Cel: działająca platforma, na której każdy może uczyć się angielskiego łatwo i bez reklam.
Cała nauka jest ułożona według poziomów CEFR: **Pre-A1 → A1 → A2 → B1 → B2**.
Płatności (14,99 zł / mies.) wchodzą na końcu, gdy jest za co płacić.

Zasada dla każdego etapu: kończy się czymś, co da się otworzyć i sprawdzić, a nie makietą.

## Etap 0 — fundament (zrobione)

- Silnik lekcji (8 typów zadań), dialogi z gałęziami, XP, poziomy gracza, seria dni.
- Trzy tryby wiekowe na jednym silniku, onboarding z testem poziomującym.
- Postęp, powtórki błędów, panel rodzica.
- Konta na urządzeniu (wiele obok siebie) + trzy stałe konta testowe.
- **Program CEFR**: dla każdego poziomu liczba słów, lista gramatyki i umiejętności; poziom kończy
  się dopiero po całym programie.
- **Mapa-droga**: wszystkie światy i ponumerowane misje od pierwszego poziomu do B2, z bramą
  na końcu każdego poziomu — w trzech trybach.
- **Rundy bez końca**: 12 tematów, ponad 500 słów, rundy generowane na poziomie ucznia.
- Treść lekcji: **po jednej pełnej lekcji na tryb** (3 lekcje). To jest dziś główne ograniczenie
  ścieżki; rundy tematyczne są grywalne bez ograniczeń.

## Etap 1 — prawdziwa platforma w sieci

Efekt: adres w internecie, pod którym każdy zakłada konto i uczy się na telefonie i komputerze
z tym samym postępem.

- Baza danych i serwer: konta, profile, postęp, powtórki (wymiana `lib/persistence` — interfejsy już są).
- Prawdziwe logowanie: e-mail + hasło, reset hasła, potwierdzenie adresu; opcjonalnie Google.
- Konto rodzica z profilami dzieci (jedno konto, kilku uczniów), zgoda rodzica dla dzieci.
- Wdrożenie (hosting + domena), kopie zapasowe, monitoring błędów.
- Instalacja na telefonie jako aplikacja (PWA), praca przy słabym internecie.
- Podstawy prawne: polityka prywatności, regulamin, RODO (szczególnie dane dzieci).

## Etap 2 — domknięcie programu CEFR

Szkielet już jest (patrz Etap 0). Zostaje:

- Przegląd progów słów, list gramatyki i podziału na światy z nauczycielem.
- Tytuły wszystkich misji od A2 wzwyż.
- Test poziomujący obejmujący wszystkie poziomy (dziś jest krótki, 5 pytań).
- Sprawdzian na koniec każdego poziomu: zaliczenie otwiera bramę do następnego.
- Narzędzie dla nauczyciela: dodawanie lekcji i słów bez programisty (formularz lub arkusz
  z automatycznym sprawdzaniem poprawności).
- Grafika: postacie i przedmioty w scenkach jako ilustracje 3D (decyzja o źródle grafik —
  dziś są rysowane w CSS, miejsce podmiany: `components/ui/Illustration.tsx`).

## Etap 3 — treść, poziom po poziomie

Efekt: po każdym kroku jeden poziom jest kompletny i można go przejść od początku do końca.

1. **Pre-A1 + A1** — pierwszy pełny poziom, od zera.
2. **A2**
3. **B1**
4. **B2**

Każdy poziom: działy → lekcje → powtórki → sprawdzian poziomu. Do tego nagrania audio
(lektor lub synteza w chmurze zamiast głosu przeglądarki).
Kolejność trybów do ustalenia: te same umiejętności CEFR, ale sytuacje i teksty osobne
dla dzieci, nastolatków i dorosłych — to trzy razy więcej treści, więc warto zacząć od jednego trybu.

## Etap 4 — lepsza nauka

- Powtórki rozłożone w czasie (spaced repetition) zamiast prostego harmonogramu.
- Mówienie: prawdziwa ocena wymowy (dziś tylko porównanie rozpoznanych słów).
- Rozmowy z AI w scenkach (dziś gałęzie dialogu zapisane w treści).
- Raporty dla rodziców, przypomnienia, potwierdzenie ukończenia poziomu.

## Etap 5 — płatności

- Subskrypcja 14,99 zł / mies. (karta, BLIK), zarządzanie i anulowanie w ustawieniach, faktury.
- Decyzja: co jest darmowe, a co w subskrypcji.
- Bez reklam — w wersji darmowej i płatnej.
