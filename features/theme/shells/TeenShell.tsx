"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, Map as MapIcon, Target, type LucideIcon } from "lucide-react";
import { useLearner } from "@/features/progress/useLearner";
import { initialOf } from "@/features/theme/avatar";
import { cx } from "@/lib/utils";

const TABS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/journey", label: "Journey", icon: MapIcon },
  { href: "/practice", label: "Practice", icon: Target },
  { href: "/me", label: "Stats", icon: BarChart3 },
];

/** Player shell: icon rail on desktop, bottom bar on phones. */
export function TeenShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, due } = useLearner();
  const isOn = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const tabs = (compact: boolean) =>
    TABS.map((t) => {
      const on = isOn(t.href);
      return (
        <Link
          key={t.href}
          href={t.href}
          aria-current={on ? "page" : undefined}
          className={cx(
            "relative flex h-[52px] flex-col items-center justify-center gap-[5px] rounded-xl hover:bg-[oklch(0.24_0.025_275)]",
            compact ? "flex-1" : "w-14",
            on ? "bg-night-raised text-lime" : "text-night-muted",
          )}
        >
          <t.icon aria-hidden size={18} strokeWidth={on ? 2.4 : 2} />
          <span className="text-[9px] font-semibold">{t.label}</span>
          {t.href === "/practice" && due.length > 0 && (
            <span className="absolute right-1.5 top-1 rounded-sm bg-grape px-1 font-mono text-[9px] text-night" aria-label={`${due.length} due`}>
              {due.length}
            </span>
          )}
        </Link>
      );
    });

  return (
    <div className="min-h-dvh bg-night text-night-text md:grid md:grid-cols-[76px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col items-center gap-2.5 border-r border-night-line-soft py-5 md:flex">
        <Link href="/home" aria-label="Kompas — home" className="mb-3.5 grid size-[38px] place-items-center rounded-[10px] bg-lime">
          <span className="size-3 rotate-45 bg-night" aria-hidden />
        </Link>
        <nav aria-label="Main" className="flex flex-col items-center gap-2.5">
          {tabs(false)}
        </nav>
        <Link href="/settings" aria-label="Settings" className="mt-auto grid size-10 place-items-center rounded-[10px] bg-grape font-display font-extrabold text-night">
          {initialOf(user.name)}
        </Link>
      </aside>
      <div className="mx-auto flex w-full min-w-0 max-w-[1300px] flex-col gap-[22px] p-[clamp(20px,3vw,36px)] pb-24 md:pb-[clamp(20px,3vw,36px)]">{children}</div>
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-20 flex gap-1 border-t border-night-line-soft bg-night px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 md:hidden">
        {tabs(true)}
        <Link href="/settings" aria-label="Settings" className="grid h-[52px] w-12 place-items-center rounded-xl bg-grape font-display font-extrabold text-night">
          {initialOf(user.name)}
        </Link>
      </nav>
    </div>
  );
}
