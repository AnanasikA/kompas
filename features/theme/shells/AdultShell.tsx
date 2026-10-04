"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { useLearner } from "@/features/progress/useLearner";
import { cx } from "@/lib/utils";

const TABS = [
  { href: "/home", label: "Dziś" },
  { href: "/journey", label: "Ścieżka" },
  { href: "/practice", label: "Powtórki" },
  { href: "/me", label: "Postęp" },
];

/** Navigator shell: one quiet header, content on a centred column. */
export function AdultShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, due } = useLearner();
  const initials = user.name.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-line-soft px-[clamp(20px,4vw,56px)] py-5">
        <div className="flex flex-wrap items-center gap-x-9 gap-y-3">
          <Link href="/home" className="rounded">
            <Logo variant="adult" />
          </Link>
          <nav aria-label="Main" className="flex gap-[26px] text-sm">
            {TABS.map((t) => {
              const on = pathname === t.href || pathname.startsWith(`${t.href}/`);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  aria-current={on ? "page" : undefined}
                  className={cx("k-tap border-b-[1.5px] pb-1", on ? "border-ink font-semibold text-ink" : "border-transparent text-muted")}
                >
                  {t.label}
                  {t.href === "/practice" && due.length > 0 && <span className="ml-1.5 font-mono text-[11px] text-azure">{due.length}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3.5">
          <Link href="/settings" className="k-tap rounded font-mono text-xs text-muted">
            Cel: {user.currentCEFR} → {user.targetCEFR}
          </Link>
          <Link href="/settings" aria-label="Settings" className="grid size-9 place-items-center rounded-full bg-[oklch(0.90_0.02_225)] text-[13px] font-semibold">
            {initials}
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,56px)] py-[clamp(28px,5vw,56px)]">{children}</div>
    </div>
  );
}
