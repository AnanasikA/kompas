import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { FEEDBACK } from "@/data/site";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Nauka",
    links: [
      { label: "Jak to działa", href: "/#jak-to-dziala" },
      { label: "Poziomy CEFR", href: "/#poziomy" },
      { label: "Dla dzieci", href: "/#dla-dzieci" },
      { label: "Dla nastolatków", href: "/#dla-nastolatkow" },
      { label: "Dla dorosłych", href: "/#dla-doroslych" },
    ],
  },
  {
    title: "Informacje",
    links: [
      { label: "Dla rodziców", href: "/#dla-rodzicow" },
      ...(FEEDBACK.email ? [{ label: "Kontakt", href: `mailto:${FEEDBACK.email}` }] : []),
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Prawne",
    links: [
      { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
      { label: "Regulamin", href: "/regulamin" },
      { label: "Bezpieczeństwo dzieci", href: "/bezpieczenstwo-dzieci" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

/** Footer of the public pages: plain and light, one thin line above. */
export function SiteFooter() {
  return (
    <footer className="mx-[clamp(20px,4vw,56px)] border-t border-line pb-8 pt-[clamp(32px,4vw,48px)]">
      <div className="grid grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
        <div className="col-span-2 flex flex-col items-start gap-3 md:col-span-1">
          <Link href="/" aria-label="Kompas — strona główna" className="rounded-lg">
            <Logo size={30} />
          </Link>
          <p className="m-0 max-w-[24ch] text-[15px] leading-normal text-body">Angielski, którego naprawdę użyjesz.</p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
            <h2 className="m-0 font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-faint">{column.title}</h2>
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="inline-block rounded-md py-1.5 text-[15px] text-body hover:text-ink hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="m-0 mt-[clamp(28px,4vw,44px)] border-t border-line pt-5 text-[13px] text-muted">© 2026 Kompas</p>
    </footer>
  );
}
