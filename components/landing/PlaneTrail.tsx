import { Plane } from "lucide-react";

const TRAIL = "M 254 74 C 249.3 76.7 235.7 86.3 226 90 C 216.3 93.7 204.3 97.0 196 96 C 187.7 95.0 178.3 89.3 176 84 C 173.7 78.7 177.7 67.0 182 64 C 186.3 61.0 198.3 61.7 202 66 C 205.7 70.3 207.0 82.3 204 90 C 201.0 97.7 193.0 105.7 184 112 C 175.0 118.3 162.7 123.3 150 128 C 137.3 132.7 121.3 134.7 108 140 C 94.7 145.3 81.0 151.3 70 160 C 59.0 168.7 49.0 179.3 42 192 C 35.0 204.7 30.3 228.7 28 236";

/** A plane taking off over the map, its trail curling once behind it. Decorative only. */
export function PlaneTrail({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 300 250" className={className}>
      <defs>
        <linearGradient id="plane-trail" gradientUnits="userSpaceOnUse" x1="28" y1="236" x2="150" y2="128">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <path d={TRAIL} fill="none" stroke="url(#plane-trail)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <Plane x={240} y={24} width={46} height={46} fill="currentColor" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}
