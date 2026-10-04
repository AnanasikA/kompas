import { cx } from "@/lib/utils";

type Variant = "light" | "dark" | "teen" | "adult";

/** Kompas wordmark. Shapes and sizes follow the prototype for each surface. */
export function Logo({ variant = "light", size = 34, className }: { variant?: Variant; size?: number; className?: string }) {
  if (variant === "adult") {
    return (
      <span className={cx("inline-flex items-center gap-2.5", className)}>
        <span className="grid size-[26px] place-items-center rounded-full border-[1.5px] border-ink" aria-hidden>
          <span className="size-[7px] rotate-45 bg-ink" />
        </span>
        <span className="font-serif text-2xl leading-none">Kompas</span>
      </span>
    );
  }
  if (variant === "teen") {
    return (
      <span className={cx("inline-flex items-center gap-2", className)}>
        <span className="grid size-6 place-items-center rounded-md bg-lime" aria-hidden>
          <span className="size-2 rotate-45 bg-night" />
        </span>
        <span className="font-display font-extrabold">Kompas</span>
      </span>
    );
  }
  const dark = variant === "dark";
  const diamond = Math.round(size * 0.32);
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <span
        className={cx("grid place-items-center rounded-full", dark ? "bg-amber" : "bg-ink")}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <span className={cx("rotate-45", dark ? "bg-ink" : "bg-amber")} style={{ width: diamond, height: diamond }} />
      </span>
      <span className="font-display font-extrabold tracking-[-0.02em]" style={{ fontSize: Math.round(size * 0.65) }}>
        Kompas
      </span>
    </span>
  );
}
