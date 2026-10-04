import { Lock, Mic, Play, Square, Undo2, Volume2 } from "lucide-react";

/**
 * Icons. One line-icon family (Lucide) everywhere, so the three age modes
 * share the same visual vocabulary. Decorative: always paired with text or an
 * aria-label on the control.
 */

export function PlayTriangle({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return <Play aria-hidden size={Math.round(size * 1.25)} color={color} fill={color} strokeWidth={2} className="inline-block shrink-0" />;
}

/** Small "play" mark in front of a label, sized to the text around it. */
export function PlayGlyph({ className = "mr-1.5" }: { className?: string }) {
  return <Play aria-hidden size="0.85em" fill="currentColor" strokeWidth={2} className={`inline-block shrink-0 align-[-0.08em] ${className}`} />;
}

export function UndoGlyph() {
  return <Undo2 aria-hidden size="1.1em" strokeWidth={2.2} className="mr-1 inline-block shrink-0 align-[-0.18em]" />;
}

export function SpeakerIcon({ color = "oklch(0.99 0.004 85)", size = 34 }: { color?: string; size?: number }) {
  return <Volume2 aria-hidden size={size} color={color} strokeWidth={2.25} />;
}

export function MicIcon({ color = "oklch(0.99 0.004 85)", size = 52 }: { color?: string; size?: number }) {
  return <Mic aria-hidden size={size} color={color} strokeWidth={2} />;
}

export function StopSquare({ color = "currentColor", size = 16 }: { color?: string; size?: number }) {
  return <Square aria-hidden size={size} color={color} fill={color} strokeWidth={2} className="inline-block shrink-0" />;
}

export function LockIcon({ color = "oklch(0.50 0.02 85)", size = 22 }: { color?: string; size?: number }) {
  return <Lock aria-hidden size={size} color={color} strokeWidth={2.25} />;
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
