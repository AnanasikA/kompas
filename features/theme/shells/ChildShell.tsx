"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Home, Map as MapIcon, User, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useLearner } from "@/features/progress/useLearner";
import { AVATAR_COLORS, initialOf } from "@/features/theme/avatar";
import { cx } from "@/lib/utils";

const TABS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/home", label: "Start", icon: Home },
  { href: "/journey", label: "Podróż", icon: MapIcon },
  { href: "/practice", label: "Trening", icon: Dumbbell },
  { href: "/me", label: "Ja", icon: User },
];

function TabIcon({ icon: Icon, on }: { icon: LucideIcon; on: boolean }) {
  return <Icon aria-hidden size={22} strokeWidth={on ? 2.6 : 2.1} className="shrink-0" />;
}

/** Explorer shell: sidebar on desktop, bottom tab bar on phones. */
export function ChildShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, level, rank, due } = useLearner();
  const isOn = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-[22px] border-r border-line-soft bg-sand px-4 py-[22px] lg:flex">
        <Link href="/home" className="self-start rounded-lg px-1.5">
          <Logo size={32} />
        </Link>
        <Link href="/me" className="flex flex-col gap-2.5 rounded-[22px] bg-card p-3.5 shadow-[0_4px_0_var(--color-line)]">
          <span className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid size-[46px] shrink-0 place-items-center rounded-full font-display text-xl font-extrabold shadow-[0_0_0_3px_var(--color-card),0_0_0_5px_var(--color-ink)]"
              style={{ background: AVATAR_COLORS[user.avatarColor] }}
            >
              {initialOf(user.name)}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[15px] font-bold">{user.name}</span>
              <span className="font-mono text-[11px] text-muted">
                LVL {level.level} · {rank}
              </span>
            </span>
          </span>
          <span className="flex flex-col gap-1">
            <span className="h-2 rounded bg-[oklch(0.92_0.01_85)]">
              <span className="block h-full rounded bg-amber" style={{ width: `${level.percent}%` }} />
            </span>
            <span className="font-mono text-[10px] text-muted">
              {level.into} / {level.needed} XP
            </span>
          </span>
        </Link>
        <nav aria-label="Główna" className="flex flex-col gap-1.5">
          {TABS.map((t) => {
            const on = isOn(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={cx(
                  "flex items-center gap-3.5 rounded-2xl px-3.5 py-[13px] font-display text-lg",
                  on ? "bg-amber font-extrabold shadow-[0_4px_0_var(--color-amber-deep)]" : "font-semibold hover:bg-[oklch(0.92_0.03_80)]",
                )}
              >
                <TabIcon icon={t.icon} on={on} />
                <span className="flex-1">{t.label}</span>
                {t.href === "/practice" && due.length > 0 && (
                  <span className="rounded-full bg-coral px-2 py-0.5 font-mono text-[11px]" aria-label={`${due.length} do powtórki`}>
                    {due.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-1">
          <Link href="/settings" className="rounded-xl px-3.5 py-2.5 text-sm font-semibold hover:bg-[oklch(0.92_0.01_85)]">
            Ustawienia
          </Link>
          <Link href="/parent" className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-muted hover:bg-[oklch(0.92_0.01_85)]">
            Panel rodzica
          </Link>
        </div>
      </aside>

      <div className="min-w-0 pb-[84px] lg:pb-0">
        <header className="flex items-center justify-between gap-3 px-5 pt-4 lg:hidden">
          <Logo size={28} />
          <Link href="/settings" className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-sand">
            Ustawienia
          </Link>
        </header>
        {children}
      </div>

      <nav aria-label="Główna" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 gap-1 border-t border-line-soft bg-sand px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 lg:hidden">
        {TABS.map((t) => {
          const on = isOn(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={on ? "page" : undefined}
              className={cx("relative flex flex-col items-center gap-1 rounded-2xl py-2 font-display text-[13px]", on ? "bg-amber font-extrabold" : "font-semibold")}
            >
              <TabIcon icon={t.icon} on={on} />
              {t.label}
              {t.href === "/practice" && due.length > 0 && (
                <span className="absolute right-[18%] top-1 rounded-full bg-coral px-1.5 font-mono text-[10px]" aria-label={`${due.length} do powtórki`}>
                  {due.length}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
