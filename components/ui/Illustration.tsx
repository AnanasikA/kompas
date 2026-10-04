import type { IllustrationId } from "@/types";

/**
 * Picture cards for vocabulary. Drawn in CSS exactly as in the prototype;
 * replace with real artwork by swapping this component.
 */
export function Illustration({ id }: { id: IllustrationId }) {
  return (
    <div className="relative h-full w-full overflow-hidden" aria-hidden>
      {id === "juice" && (
        <>
          <div
            className="absolute left-1/2 top-1/2 h-[92px] w-[60px] -translate-x-1/2 -translate-y-[44%] rounded-[6px_6px_16px_16px]"
            style={{ background: "linear-gradient(oklch(0.92 0.06 70) 0 14%,oklch(0.76 0.17 60) 14%)", boxShadow: "inset 0 0 0 3px oklch(0.97 0.01 85 / 0.6)" }}
          />
          <div className="absolute top-5 h-[60px] w-1.5 rotate-[14deg] rounded-[3px]" style={{ left: "calc(50% + 4px)", background: "oklch(0.62 0.17 35)" }} />
          <div className="absolute top-9 size-[34px] rounded-full" style={{ left: "calc(50% - 46px)", background: "oklch(0.80 0.16 70)", boxShadow: "inset 0 0 0 4px oklch(0.70 0.16 60)" }} />
        </>
      )}
      {id === "coffee" && (
        <>
          <div className="absolute bottom-[30px] left-1/2 h-4 w-[110px] -translate-x-1/2 rounded-full" style={{ background: "oklch(0.97 0.01 85)", boxShadow: "0 2px 0 oklch(0.85 0.02 85)" }} />
          <div className="absolute bottom-10 left-1/2 h-14 w-[70px] -translate-x-[56%] rounded-[4px_4px_30px_30px]" style={{ background: "oklch(0.99 0.004 85)", boxShadow: "inset 0 10px 0 oklch(0.42 0.07 50)" }} />
          <div className="absolute bottom-[58px] h-6 w-[22px] rounded-full" style={{ left: "calc(50% + 26px)", border: "6px solid oklch(0.99 0.004 85)" }} />
          <div className="absolute top-[22px] h-[26px] w-1.5 rounded-[3px]" style={{ left: "calc(50% - 16px)", background: "oklch(0.85 0.02 85)" }} />
          <div className="absolute top-4 h-[30px] w-1.5 rounded-[3px]" style={{ left: "calc(50% - 2px)", background: "oklch(0.85 0.02 85)" }} />
        </>
      )}
      {id === "sandwich" &&
        [
          ["120px", "80px", "-40%", "oklch(0.82 0.10 75)"],
          ["116px", "70px", "-30%", "oklch(0.70 0.17 140)"],
          ["112px", "62px", "-22%", "oklch(0.86 0.12 90)"],
          ["108px", "54px", "-14%", "oklch(0.90 0.06 80)"],
        ].map(([w, h, y, bg]) => (
          <div
            key={w}
            className="absolute left-1/2 top-1/2"
            style={{ width: w, height: h, background: bg, transform: `translate(-50%, ${y})`, clipPath: "polygon(0 100%,100% 100%,50% 0)" }}
          />
        ))}
      {id === "water" && (
        <>
          <div className="absolute left-1/2 top-[22px] h-3.5 w-5 -translate-x-1/2 rounded-[3px]" style={{ background: "oklch(0.52 0.12 235)" }} />
          <div className="absolute left-1/2 top-[34px] h-3 w-7 -translate-x-1/2" style={{ background: "oklch(0.88 0.04 225)" }} />
          <div className="absolute left-1/2 top-11 h-24 w-[50px] -translate-x-1/2 rounded-[16px_16px_10px_10px]" style={{ background: "oklch(0.88 0.06 225)", boxShadow: "inset -8px 0 0 oklch(0.84 0.07 225)" }} />
          <div className="absolute left-1/2 top-20 h-6 w-[50px] -translate-x-1/2" style={{ background: "oklch(0.74 0.15 225)" }} />
        </>
      )}
    </div>
  );
}
