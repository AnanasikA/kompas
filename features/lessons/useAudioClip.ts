"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { AudioSource } from "@/types";
import { audioPlayer } from "@/lib/services/tts";

export type ClipStatus = "idle" | "playing" | "ended" | "error";

export interface AudioClip {
  status: ClipStatus;
  /** False when neither a recording nor a TTS voice is available. */
  supported: boolean;
  /** How many times playback was started. */
  plays: number;
  /** Plays left when the exercise caps them, otherwise null. */
  playsLeft: number | null;
  canPlay: boolean;
  play(): void;
  stop(): void;
}

const subscribeNever = () => () => {};

/**
 * Playback state for one audio source. Used by listening exercises, the
 * placement test and every "listen" button — none of them know whether the
 * sound comes from a file or from TTS.
 */
export function useAudioClip(source: AudioSource | null | undefined, opts: { maxPlays?: number } = {}): AudioClip {
  const [status, setStatus] = useState<ClipStatus>("idle");
  const [plays, setPlays] = useState(0);
  // Support differs between server and browser, so read it as an external value.
  const supported = useSyncExternalStore(
    subscribeNever,
    () => (source ? audioPlayer.isSupported(source) : false),
    () => true,
  );
  const token = useRef(0);

  useEffect(() => {
    return () => {
      token.current += 1;
      audioPlayer.stop();
    };
  }, []);

  const playsLeft = opts.maxPlays == null ? null : Math.max(0, opts.maxPlays - plays);
  const canPlay = !!source && supported && (playsLeft === null || playsLeft > 0);

  const play = useCallback(() => {
    if (!source || !canPlay) return;
    const mine = ++token.current;
    setStatus("playing");
    setPlays((n) => n + 1);
    audioPlayer
      .play(source)
      .then(() => {
        if (token.current === mine) setStatus("ended");
      })
      .catch(() => {
        if (token.current === mine) setStatus("error");
      });
  }, [source, canPlay]);

  const stop = useCallback(() => {
    token.current += 1;
    audioPlayer.stop();
    setStatus((s) => (s === "playing" ? "ended" : s));
  }, []);

  return { status, supported, plays, playsLeft, canPlay, play, stop };
}
