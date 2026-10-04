import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { Logo } from "@/components/ui/Logo";
import { FEEDBACK } from "@/data/site";
import { INFO_PAGES, getInfoPage } from "@/data/site-pages";

type Props = { params: Promise<{ slug: string }> };

/** Only the pages listed in data/site-pages exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return INFO_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getInfoPage((await params).slug);
  return page ? { title: `${page.title} — Kompas`, description: page.lead } : {};
}

export default async function InfoPage({ params }: Props) {
  const page = getInfoPage((await params).slug);
  if (!page) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="flex items-center justify-between gap-4 px-[clamp(20px,4vw,56px)] py-[18px]">
        <Link href="/" aria-label="Kompas — strona główna" className="rounded-lg">
          <Logo />
        </Link>
        <Link href="/" className="rounded-xl px-3.5 py-2.5 text-[15px] font-semibold hover:bg-sand">
          <ArrowLeft aria-hidden size="1em" strokeWidth={2.4} className="mr-1.5 inline-block align-[-0.14em]" />
          Strona główna
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-9 px-[clamp(20px,4vw,56px)] pb-[clamp(56px,7vw,96px)] pt-[clamp(24px,4vw,56px)]">
        <div className="flex flex-col gap-4">
          <h1 className="m-0 text-balance font-display text-[clamp(34px,5vw,56px)] font-extrabold leading-none tracking-[-0.035em]">{page.title}</h1>
          <p className="m-0 max-w-[52ch] text-pretty text-[clamp(17px,1.5vw,19px)] leading-[1.55] text-body">{page.lead}</p>
          {page.demoNote && (
            <p className="m-0 rounded-xl bg-sand px-4 py-3 text-sm leading-normal text-body">
              To opis wersji testowej. Przed publicznym startem zastąpi go pełny dokument.
            </p>
          )}
        </div>

        <div className="flex flex-col">
          {page.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-2 border-t border-line py-6">
              <h2 className="m-0 font-display text-[21px] font-bold tracking-[-0.015em]">{section.title}</h2>
              {section.text.map((paragraph) => (
                <p key={paragraph} className="m-0 max-w-[64ch] text-pretty text-base leading-[1.6] text-body">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        {FEEDBACK.email && (
          <p className="m-0 text-[15px] text-body">
            Masz pytanie? Napisz:{" "}
            <a href={`mailto:${FEEDBACK.email}`} className="font-semibold text-ink underline underline-offset-4">
              {FEEDBACK.email}
            </a>
          </p>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
