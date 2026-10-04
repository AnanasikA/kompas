import type { AudioSource } from "@/types";

/**
 * AUDIO SERVICE
 *
 * Exercises never call the browser speech API directly. They hand an
 * `AudioSource` to an `AudioPlayer`. If the source has a recorded file (`src`)
 * it is played; otherwise the text is spoken by a TTS engine.
 * To plug in real recordings: fill `src` in the content.
 * To plug in a cloud TTS: implement `TtsEngine` and pass it to `createAudioPlayer`.
 */

export interface TtsEngine {
  isSupported(): boolean;
  /** Resolves when speech ends, rejects on error. */
  speak(text: string, opts: { lang?: string; rate?: number }): Promise<void>;
  cancel(): void;
}

export interface AudioPlayer {
  isSupported(source: AudioSource): boolean;
  play(source: AudioSource): Promise<void>;
  stop(): void;
}

export class BrowserTtsEngine implements TtsEngine {
  isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  speak(text: string, opts: { lang?: string; rate?: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error("tts-unsupported"));
        return;
      }
      const synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const lang = opts.lang ?? "en-GB";
      utterance.lang = lang;
      utterance.rate = opts.rate ?? 0.9;
      const voice = synth.getVoices().find((v) => v.lang === lang) ?? synth.getVoices().find((v) => v.lang.startsWith("en"));
      if (voice) utterance.voice = voice;
      // Some browsers never fire `onend` (e.g. no voice installed). Don't leave the UI "playing" forever.
      const guard = setTimeout(() => resolve(), 4000 + text.length * 110);
      utterance.onend = () => {
        clearTimeout(guard);
        resolve();
      };
      utterance.onerror = (event) => {
        clearTimeout(guard);
        // "interrupted"/"canceled" happen when we stop playback ourselves.
        if (event.error === "interrupted" || event.error === "canceled") resolve();
        else reject(new Error(event.error || "tts-error"));
      };
      synth.speak(utterance);
    });
  }

  cancel(): void {
    if (this.isSupported()) window.speechSynthesis.cancel();
  }
}

export function createAudioPlayer(tts: TtsEngine): AudioPlayer {
  let element: HTMLAudioElement | null = null;

  const stopFile = () => {
    if (element) {
      element.pause();
      element = null;
    }
  };

  return {
    isSupported(source) {
      if (source.src) return typeof Audio !== "undefined";
      return tts.isSupported();
    },
    play(source) {
      stopFile();
      tts.cancel();
      if (source.src) {
        return new Promise((resolve, reject) => {
          const audio = new Audio(source.src);
          element = audio;
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error("audio-file-error"));
          audio.play().catch(reject);
        });
      }
      return tts.speak(source.text, { lang: source.lang, rate: source.rate });
    },
    stop() {
      stopFile();
      tts.cancel();
    },
  };
}

export const audioPlayer: AudioPlayer = createAudioPlayer(new BrowserTtsEngine());
