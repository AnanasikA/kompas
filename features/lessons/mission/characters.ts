import type { AudioSource, CharacterId } from "@/types";

/**
 * THE PEOPLE OF KOMPAS TOWN
 * Art: /public/characters/<pose>.webp, cut from the character sheet.
 * Voices: the browser's English voice, a little higher or lower per person,
 * so a child can tell who is speaking with eyes closed.
 */
export const CHARACTERS: Record<CharacterId, { name: string; role: string; pose: string; voice: Omit<AudioSource, "text">; tint: string }> = {
  leo: { name: "Leo", role: "Twój przewodnik po Kompasie", pose: "leo-happy", voice: { lang: "en-GB", rate: 0.88, pitch: 1.3 }, tint: "oklch(0.92 0.04 245)" },
  mia: { name: "Mia", role: "piesek Leo", pose: "mia", voice: { lang: "en-GB", rate: 0.95, pitch: 1.6 }, tint: "oklch(0.94 0.05 85)" },
  bell: { name: "Ms Bell", role: "nauczycielka angielskiego", pose: "bell-smile", voice: { lang: "en-GB", rate: 0.85, pitch: 1.1 }, tint: "oklch(0.93 0.04 15)" },
  grandma: { name: "Grandma", role: "babcia Leo", pose: "grandma-smile", voice: { lang: "en-GB", rate: 0.8, pitch: 0.85 }, tint: "oklch(0.93 0.04 145)" },
};

export function voiceOf(who: CharacterId, text: string): AudioSource {
  return { text, ...CHARACTERS[who].voice };
}

export function characterSrc(pose: string): string {
  return `/characters/${pose}.webp`;
}
