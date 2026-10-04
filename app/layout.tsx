import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/instrument-sans/wdth.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AppProviders } from "@/components/AppProviders";
import { FeedbackTab } from "@/components/FeedbackTab";

export const metadata: Metadata = {
  title: "Kompas – angielski online dla dzieci, nastolatków i dorosłych",
  description:
    "Ucz się angielskiego w praktycznych sytuacjach. Interaktywne lekcje, mówienie, słuchanie i inteligentne powtórki na poziomach CEFR Pre-A1–B2.",
  // Wersja pokazowa z kontami testowymi: nie do wyszukiwarek. Usuń przy publicznym starcie.
  robots: { index: false, follow: false },
  applicationName: "Kompas",
  // iPhone: po „Dodaj do ekranu początkowego” otwiera się jak aplikacja, bez pasków przeglądarki.
  appleWebApp: { capable: true, title: "Kompas", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f9f6f1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <AppProviders>{children}</AppProviders>
        <FeedbackTab />
        {/* Visit statistics exist only on Vercel; locally the script would just fail to load. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
