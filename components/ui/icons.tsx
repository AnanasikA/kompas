/** Small CSS-drawn icons used by the prototype. Decorative: always paired with text. */

export function PlayTriangle({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <span
      aria-hidden
      className="inline-block"
      style={{
        width: 0,
        height: 0,
        borderLeft: `${size}px solid ${color}`,
        borderTop: `${Math.round(size * 0.62)}px solid transparent`,
        borderBottom: `${Math.round(size * 0.62)}px solid transparent`,
        marginLeft: Math.round(size / 4),
      }}
    />
  );
}

export function SpeakerIcon({ color = "oklch(0.99 0.004 85)" }: { color?: string }) {
  return (
    <span className="flex items-center gap-1" aria-hidden>
      <span className="h-4 w-3 rounded-[2px]" style={{ background: color }} />
      <span style={{ width: 0, height: 0, borderRight: `14px solid ${color}`, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", marginLeft: -6 }} />
      <span className="ml-1 h-5 w-2 rounded-r-xl" style={{ border: `3px solid ${color}`, borderLeft: "none" }} />
    </span>
  );
}

export function MicIcon({ color = "oklch(0.99 0.004 85)" }: { color?: string }) {
  return (
    <span className="flex flex-col items-center gap-[3px]" aria-hidden>
      <span className="h-11 w-7 rounded-[14px]" style={{ background: color }} />
      <span className="-mt-3.5 h-4 w-10 rounded-b-[20px]" style={{ border: `4px solid ${color}`, borderTop: "none" }} />
      <span className="h-2 w-1" style={{ background: color }} />
    </span>
  );
}

export function StopSquare({ color = "currentColor", size = 16 }: { color?: string; size?: number }) {
  return <span aria-hidden className="inline-block rounded-[3px]" style={{ width: size, height: size, background: color }} />;
}

export function LockIcon({ color = "oklch(0.60 0.02 85)" }: { color?: string }) {
  return (
    <span className="flex flex-col items-center" aria-hidden>
      <span className="h-2.5 w-3.5 rounded-t-lg" style={{ border: `3px solid ${color}`, borderBottom: "none" }} />
      <span className="h-4 w-[22px] rounded" style={{ background: color }} />
    </span>
  );
}

/** Animated bars shown while the microphone is listening. */
export function RecordingBars({ color, count = 14, height = 56, width = 6 }: { color: string; count?: number; height?: number; width?: number }) {
  return (
    <div className="flex items-center gap-[5px]" style={{ height }} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="k-bar rounded-[3px]"
          style={{ width, height, background: color, animationDuration: `${0.6 + (i % 4) * 0.15}s`, animationDelay: `${i * 0.05}s` }}
        />
      ))}
    </div>
  );
}
