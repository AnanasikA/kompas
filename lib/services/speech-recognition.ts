/**
 * SPEECH SERVICES
 *
 * `SpeechRecognizer` turns the learner's speech into a transcript. The MVP
 * uses the browser Web Speech API where it exists. We compare the transcript
 * with the expected sentence (see features/learning/engine/speech.ts) — this
 * checks WHICH WORDS were said, not how well they were pronounced.
 *
 * `PronunciationAssessor` is the seam for a future pronunciation service.
 * Nothing implements it yet, and the UI does not claim pronunciation scores.
 */

export type RecognitionErrorCode = "unsupported" | "not-allowed" | "no-speech" | "network" | "aborted" | "unknown";

export class RecognitionError extends Error {
  constructor(public readonly code: RecognitionErrorCode) {
    super(code);
    this.name = "RecognitionError";
  }
}

export interface RecognitionResult {
  transcript: string;
  /** Other hypotheses from the recogniser, best first (includes `transcript`). */
  alternatives: string[];
}

export interface SpeechRecognizer {
  isSupported(): boolean;
  listen(opts: { lang?: string; timeoutMs?: number }): Promise<RecognitionResult>;
  abort(): void;
}

export interface PronunciationAssessment {
  overall: number;
  words: { word: string; score: number }[];
}

export interface PronunciationAssessor {
  assess(recording: Blob, expected: string, lang: string): Promise<PronunciationAssessment>;
}

/** No pronunciation service is connected in this milestone. */
export const pronunciationAssessor: PronunciationAssessor | null = null;

/* Minimal typings for the Web Speech API (not in lib.dom for every target). */
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionEventLike {
  results: { readonly length: number; [index: number]: SpeechRecognitionResultLike };
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export class BrowserSpeechRecognizer implements SpeechRecognizer {
  private active: SpeechRecognitionLike | null = null;

  isSupported(): boolean {
    return getCtor() !== null;
  }

  listen(opts: { lang?: string; timeoutMs?: number } = {}): Promise<RecognitionResult> {
    return new Promise((resolve, reject) => {
      const Ctor = getCtor();
      if (!Ctor) {
        reject(new RecognitionError("unsupported"));
        return;
      }
      this.abort();
      const recognition = new Ctor();
      this.active = recognition;
      recognition.lang = opts.lang ?? "en-GB";
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 3;

      let settled = false;
      const finish = (fn: () => void) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        this.active = null;
        fn();
      };
      const timer = setTimeout(() => {
        recognition.abort();
        finish(() => reject(new RecognitionError("no-speech")));
      }, opts.timeoutMs ?? 9000);

      recognition.onresult = (event) => {
        const first = event.results[0];
        const alternatives: string[] = [];
        for (let i = 0; i < first.length; i++) alternatives.push(first[i].transcript.trim());
        finish(() => resolve({ transcript: alternatives[0] ?? "", alternatives }));
      };
      recognition.onerror = (event) => {
        const map: Record<string, RecognitionErrorCode> = {
          "not-allowed": "not-allowed",
          "service-not-allowed": "not-allowed",
          "no-speech": "no-speech",
          "audio-capture": "not-allowed",
          network: "network",
          aborted: "aborted",
        };
        finish(() => reject(new RecognitionError(map[event.error] ?? "unknown")));
      };
      recognition.onend = () => finish(() => reject(new RecognitionError("no-speech")));

      try {
        recognition.start();
      } catch {
        finish(() => reject(new RecognitionError("unknown")));
      }
    });
  }

  abort(): void {
    try {
      this.active?.abort();
    } catch {
      // already stopped
    }
    this.active = null;
  }
}

export const speechRecognizer: SpeechRecognizer = new BrowserSpeechRecognizer();
