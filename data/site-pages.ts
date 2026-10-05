/**
 * Short information pages linked from the footer (FAQ and the legal notes).
 *
 * These describe the TEST version honestly: accounts and progress live in the
 * browser, nothing is sold yet. Before the public launch the legal pages must
 * be replaced with full documents (see ROADMAP, stage 05).
 */
export type InfoSection = { title: string; text: string[] };
export type InfoPage = { slug: string; title: string; lead: string; demoNote?: boolean; sections: InfoSection[] };

export const INFO_PAGES: InfoPage[] = [
  {
    slug: "faq",
    title: "Najczęstsze pytania",
    lead: "Krótko o tym, jak działa Kompas i czego możesz się spodziewać w wersji testowej.",
    sections: [
      {
        title: "Dla kogo jest Kompas?",
        text: ["Dla dzieci w wieku 8–12 lat, nastolatków 13–17 lat i dorosłych. Każda grupa ma własny wygląd aplikacji, własne tematy i własny sposób nauki."],
      },
      {
        title: "Od jakiego poziomu mogę zacząć?",
        text: ["Od zera. Program prowadzi od poziomu Pre-A1 do B2 według skali CEFR. Krótki test na starcie pomaga dobrać poziom, a jeśli coś już umiesz, wcześniejsze etapy zostaną zaliczone."],
      },
      {
        title: "Czy Kompas jest płatny?",
        text: ["Wersja testowa jest bezpłatna i bez reklam. O ewentualnych płatnych planach poinformujemy przed ich wprowadzeniem."],
      },
      {
        title: "Czy mogę uczyć się na telefonie?",
        text: ["Tak. Kompas działa w przeglądarce na telefonie, tablecie i komputerze. Na telefonie możesz dodać go do ekranu głównego i otwierać jak zwykłą aplikację."],
      },
      {
        title: "Czy potrzebuję mikrofonu?",
        text: ["Mikrofon przydaje się w ćwiczeniach z mówieniem. Korzystają one z rozpoznawania mowy wbudowanego w przeglądarkę, dlatego najlepiej działają w Chrome i Edge."],
      },
      {
        title: "Gdzie zapisują się moje postępy?",
        text: ["W wersji testowej konto i postępy są zapisane w przeglądarce na urządzeniu, na którym się uczysz. Na innym urządzeniu albo po wyczyszczeniu danych przeglądarki zaczniesz od nowa."],
      },
      {
        title: "Czy wszystkie lekcje są już gotowe?",
        text: ["Jeszcze nie. Plan nauki dla każdego poziomu jest rozpisany, a lekcje dodajemy stopniowo. Treningi tematyczne — na przykład jedzenie, ubrania czy hotel — są dostępne już teraz i nie mają końca."],
      },
    ],
  },
  {
    slug: "polityka-prywatnosci",
    title: "Polityka prywatności",
    lead: "Jakie dane zbiera wersja testowa Kompasu i co się z nimi dzieje.",
    demoNote: true,
    sections: [
      {
        title: "Konto i postępy",
        text: [
          "Adres e-mail, imię, grupa wiekowa i postępy w nauce są zapisywane w pamięci przeglądarki na Twoim urządzeniu. Hasło jest przechowywane wyłącznie w postaci skrótu.",
          "Wersja testowa nie ma jeszcze serwera z kontami, więc tych danych nie otrzymujemy i nie przekazujemy nikomu.",
        ],
      },
      {
        title: "Mikrofon",
        text: ["Ćwiczenia z mówieniem używają rozpoznawania mowy wbudowanego w przeglądarkę. W części przeglądarek dźwięk jest w tym celu przetwarzany przez usługę dostawcy przeglądarki. Kompas nie zapisuje nagrań."],
      },
      {
        title: "Statystyki odwiedzin",
        text: ["Korzystamy z Vercel Web Analytics, które zlicza odwiedziny stron anonimowo i bez plików cookie. Nie pozwala to rozpoznać konkretnej osoby."],
      },
      {
        title: "Uwagi wysyłane z aplikacji",
        text: ["Uwaga z zakładki „Uwagi” trafia na skrzynkę e-mail autorki aplikacji za pośrednictwem usługi FormSubmit. Zawiera treść, którą wpisujesz, oraz nazwę ekranu, tryb i typ urządzenia. Nie podawaj w niej danych osobowych."],
      },
      {
        title: "Usunięcie danych",
        text: ["Postęp możesz wyzerować w ustawieniach konta. Wszystkie dane znikają także po wyczyszczeniu danych tej strony w przeglądarce."],
      },
    ],
  },
  {
    slug: "regulamin",
    title: "Regulamin",
    lead: "Zasady korzystania z wersji testowej Kompasu.",
    demoNote: true,
    sections: [
      {
        title: "Czym jest wersja testowa",
        text: ["Kompas jest aplikacją do nauki języka angielskiego w fazie testów. Korzystanie z niej jest bezpłatne. Treści i funkcje mogą się zmieniać, a część lekcji jest dopiero w przygotowaniu."],
      },
      {
        title: "Konto",
        text: ["Profil dziecka tworzy rodzic lub opiekun. Konto i postępy są zapisane na urządzeniu, dlatego w czasie testów mogą zostać utracone."],
      },
      {
        title: "Korzystanie z treści",
        text: ["Lekcje, dialogi i ćwiczenia służą do własnej nauki. Nie wolno ich kopiować ani rozpowszechniać bez zgody autorów."],
      },
      {
        title: "Odpowiedzialność",
        text: ["Dokładamy starań, żeby treści były poprawne. Jeśli zauważysz błąd, zgłoś go w zakładce „Uwagi” albo e-mailem."],
      },
    ],
  },
  {
    slug: "bezpieczenstwo-dzieci",
    title: "Bezpieczeństwo dzieci",
    lead: "Jak Kompas dba o najmłodszych uczniów.",
    sections: [
      {
        title: "Bez reklam",
        text: ["W aplikacji dziecka nie ma reklam, a lekcje nie odsyłają do zewnętrznych stron."],
      },
      {
        title: "Bez kontaktu z obcymi",
        text: ["Kompas nie ma czatu ani wiadomości między użytkownikami. Dziecko rozmawia wyłącznie z postaciami z lekcji."],
      },
      {
        title: "Konto zakłada dorosły",
        text: ["Dziecko nie podaje własnego adresu e-mail. Profil dziecka tworzy rodzic lub opiekun na swoim koncie."],
      },
      {
        title: "Wgląd dla rodzica",
        text: ["Rodzic widzi czas nauki, ukończone lekcje, poznane słownictwo i to, co warto jeszcze powtórzyć."],
      },
      {
        title: "Mikrofon tylko za zgodą",
        text: ["Ćwiczenia z mówieniem działają dopiero po zezwoleniu na użycie mikrofonu w przeglądarce. Kompas nie zapisuje nagrań."],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookies",
    lead: "Krótko: Kompas nie używa plików cookie do śledzenia ani do reklam.",
    sections: [
      {
        title: "Pamięć przeglądarki",
        text: ["Żeby pamiętać konto i postępy, Kompas zapisuje dane w pamięci przeglądarki (localStorage) na Twoim urządzeniu. Są one niezbędne do działania aplikacji."],
      },
      {
        title: "Statystyki bez cookies",
        text: ["Odwiedziny zliczamy anonimowo za pomocą Vercel Web Analytics, które nie zapisuje plików cookie."],
      },
      {
        title: "Jak usunąć dane",
        text: ["Wystarczy wyczyścić dane tej strony w ustawieniach przeglądarki."],
      },
    ],
  },
];

export const getInfoPage = (slug: string) => INFO_PAGES.find((page) => page.slug === slug);
