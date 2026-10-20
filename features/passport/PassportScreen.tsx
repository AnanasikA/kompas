"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { COLOUR_FILL } from "@/components/ui/Illustration";
import { LineIcon, isLineIcon } from "@/components/ui/LineIcon";
import { realTasksOf } from "@/features/lessons/mission/realTasks";
import { useLearner } from "@/features/progress/useLearner";
import { AVATAR_COLORS, initialOf } from "@/features/theme/avatar";
import { audioPlayer } from "@/lib/services/tts";
import { useAppStore } from "@/lib/store/app-store";
import { cx, plural } from "@/lib/utils";
import type { Colour } from "@/types";

/**
 * EXPLORER PASSPORT: the child's own page in English. Their details, a photo
 * or drawing, a recorded "Hi! I'm…" and the stamps from real-life missions
 * a parent confirmed. Photo and voice stay on this device only.
 */

interface PassportData {
  age?: number;
  colour?: Colour;
  photo?: string;
  voice?: string;
}

const NUMBERS = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const COLOURS: Colour[] = ["red", "blue", "green", "yellow", "orange", "pink", "purple", "black", "white", "brown"];
const MAX_SECONDS = 15;

function storageKey(accountId: string) {
  return `kompas.passport.${accountId}`;
}

function load(accountId: string): PassportData {
  try {
    return JSON.parse(localStorage.getItem(storageKey(accountId)) ?? "{}") as PassportData;
  } catch {
    return {};
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** A photo or drawing, made small enough to keep on the device. */
async function shrinkImage(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const side = 360;
    const scale = Math.min(1, side / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function PassportScreen() {
  const { user, course, currentLevel, current } = useLearner();
  const accountId = useAppStore((s) => s.account?.id ?? "guest");
  const records = useAppStore((s) => s.realTasks);
  const [data, setData] = useState<PassportData>(() => load(accountId));
  const [recording, setRecording] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const page = useRef<HTMLDivElement>(null);
  const stamps = realTasksOf(course, records);
  const collected = stamps.filter((s) => s.state === "stamped").length;

  const update = (patch: Partial<PassportData>) => {
    setData((d) => {
      const next = { ...d, ...patch };
      try {
        localStorage.setItem(storageKey(accountId), JSON.stringify(next));
        setProblem(null);
      } catch {
        setProblem("Na tym urządzeniu brakuje miejsca, żeby to zapisać.");
      }
      return next;
    });
  };

  useEffect(() => () => recorder.current?.stream.getTracks().forEach((t) => t.stop()), []);

  const intro = [`Hi! I'm ${user.name}.`, data.age ? `I'm ${NUMBERS[data.age] ?? data.age}.` : "", data.colour ? `My favourite colour is ${data.colour}.` : ""].filter(Boolean).join(" ");

  async function record() {
    if (recording) {
      recorder.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: Blob[] = [];
      const rec = new MediaRecorder(stream);
      recorder.current = rec;
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        update({ voice: await blobToDataUrl(new Blob(chunks, { type: rec.mimeType })) });
      };
      rec.start();
      setRecording(true);
      setTimeout(() => rec.state === "recording" && rec.stop(), MAX_SECONDS * 1000);
    } catch {
      setProblem("Nie mam dostępu do mikrofonu. Zezwól na dostęp do mikrofonu w przeglądarce i spróbuj jeszcze raz.");
    }
  }

  async function saveImage() {
    if (!page.current) return;
    setSaving(true);
    try {
      const { toPng } = await import("html-to-image");
      const png = await toPng(page.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = png;
      a.download = `paszport-${user.name.toLowerCase()}.png`;
      a.click();
    } catch {
      setProblem("Nie udało się zapisać obrazka. Spróbuj jeszcze raz.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex max-w-[1100px] flex-col gap-6 p-[clamp(16px,3vw,40px)]">
      <div className="flex flex-col gap-2">
        <p className="m-0 font-mono text-xs tracking-[0.08em] text-coral-ink">TWÓJ PASZPORT · {collected} {plural(collected, "PIECZĄTKA", "PIECZĄTKI", "PIECZĄTEK")}</p>
        <h1 className="m-0 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-none tracking-[-0.035em]">Paszport odkrywcy</h1>
        <p className="m-0 max-w-[640px] text-[16px] text-body">Twoja strona po angielsku. Uzupełnij ją, nagraj, jak się przedstawiasz, i zbieraj pieczątki za misje w realu. Zdjęcie i nagranie zostają tylko na tym urządzeniu.</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* The passport page itself: this is what gets saved as an image. */}
        <div ref={page} className="flex flex-col gap-4 rounded-[28px] bg-[oklch(0.96_0.03_85)] p-5 shadow-[0_8px_24px_oklch(0.23_0.025_265/0.12),inset_0_0_0_2px_oklch(0.85_0.05_75)]">
          <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-[oklch(0.80_0.05_75)] pb-3">
            <span className="flex items-center gap-2 font-display text-lg font-extrabold">
              <span className="grid size-7 place-items-center rounded-full bg-ink text-[13px] text-amber">◆</span> KOMPAS
            </span>
            <span className="font-mono text-[11px] tracking-[0.12em]">EXPLORER PASSPORT</span>
          </div>
          <div className="grid grid-cols-[minmax(0,130px)_minmax(0,1fr)] gap-4">
            <label className="relative grid aspect-[4/5] cursor-pointer place-items-center overflow-hidden rounded-2xl bg-card shadow-[inset_0_0_0_2px_oklch(0.85_0.05_75)]">
              {data.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.photo} alt="Twoje zdjęcie lub rysunek" className="h-full w-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-2 p-2 text-center text-xs text-muted">
                  <span className="grid size-14 place-items-center rounded-full font-display text-2xl font-extrabold" style={{ background: AVATAR_COLORS[user.avatarColor] }}>
                    {initialOf(user.name)}
                  </span>
                  dodaj zdjęcie albo rysunek
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) update({ photo: await shrinkImage(file) });
                }}
              />
            </label>
            <dl className="m-0 flex flex-col gap-2.5">
              <div>
                <dt className="font-mono text-[10px] tracking-[0.1em] text-muted">NAME</dt>
                <dd className="m-0 font-display text-2xl font-extrabold">{user.name}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.1em] text-muted">AGE</dt>
                <dd className="m-0 font-display text-lg font-bold">{data.age ? `${data.age} · ${NUMBERS[data.age]}` : "—"}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.1em] text-muted">FAVOURITE COLOUR</dt>
                <dd className="m-0 flex items-center gap-2 font-display text-lg font-bold">
                  {data.colour ? (
                    <>
                      <span className="size-4 rounded-full shadow-[inset_0_0_0_1.5px_oklch(0.30_0.02_265/0.3)]" style={{ background: COLOUR_FILL[data.colour] }} />
                      {data.colour}
                    </>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.1em] text-muted">LEVEL</dt>
                <dd className="m-0 font-display text-lg font-bold">
                  {currentLevel.level}
                  {current ? ` · ${current.unit.title}` : ""}
                </dd>
              </div>
            </dl>
          </div>
          <p className="m-0 rounded-2xl bg-card px-4 py-3 font-display text-[18px] font-bold leading-snug">“{intro}”</p>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-[0.1em] text-muted">STAMPS</span>
            <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0 sm:grid-cols-4">
              {stamps.map(({ task, state }, i) => (
                <li
                  key={task.id}
                  className={cx(
                    "flex aspect-square flex-col items-center justify-center gap-1 rounded-full p-1 text-center",
                    state === "stamped" ? "border-[3px] border-[oklch(0.55_0.14_30)] bg-card" : "border-[3px] border-dashed border-[oklch(0.82_0.04_75)]",
                  )}
                  style={state === "stamped" ? { transform: `rotate(${(i % 3) * 7 - 7}deg)` } : undefined}
                >
                  {state === "stamped" ? <LineIcon name={isLineIcon(task.stamp.icon) ? task.stamp.icon : "stamp"} size={30} /> : <span className="font-mono text-[10px] text-muted">{state === "waiting" ? "czeka na rodzica" : "?"}</span>}
                  <span className={cx("text-[10px] leading-tight", state === "stamped" ? "font-bold text-[oklch(0.45_0.12_30)]" : "text-muted")}>{task.stamp.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-3 rounded-[24px] bg-card p-5 shadow-[inset_0_0_0_1.5px_var(--color-line-soft)]">
            <h2 className="m-0 font-display text-[20px] font-extrabold">How old are you?</h2>
            <div className="flex flex-wrap gap-2">
              {[7, 8, 9, 10, 11, 12, 13].map((n) => (
                <button key={n} type="button" aria-pressed={data.age === n} onClick={() => update({ age: n })} className={cx("rounded-full px-3.5 py-2 font-display font-bold", data.age === n ? "bg-ink text-on-ink" : "bg-sand")}>
                  {n}
                </button>
              ))}
            </div>
            <h2 className="m-0 font-display text-[20px] font-extrabold">{"What's your favourite colour?"}</h2>
            <div className="flex flex-wrap gap-2">
              {COLOURS.map((c) => (
                <button key={c} type="button" aria-pressed={data.colour === c} onClick={() => update({ colour: c })} className={cx("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold", data.colour === c ? "bg-ink text-on-ink" : "bg-sand")}>
                  <span className="size-3.5 rounded-full shadow-[inset_0_0_0_1px_oklch(0.30_0.02_265/0.3)]" style={{ background: COLOUR_FILL[c] }} />
                  {c}
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-[24px] bg-coral-soft p-5">
            <h2 className="m-0 font-display text-[20px] font-extrabold">Nagraj, jak się przedstawiasz</h2>
            <p className="m-0 text-[15px]">Posłuchaj, a potem powiedz to samo swoim głosem (do {MAX_SECONDS} sekund):</p>
            <button type="button" onClick={() => void audioPlayer.play({ text: intro, lang: "en-GB", rate: 0.85 }).catch(() => {})} className="self-start rounded-2xl bg-card px-4 py-2.5 text-left font-display text-[17px] font-bold shadow-[0_2px_0_var(--color-line)]">
              ▶ {intro}
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => void record()} className={cx("rounded-full px-5 py-3 font-display font-extrabold text-white", recording ? "bg-coral-deep" : "bg-[oklch(0.58_0.17_30)]")}>
                {recording ? "■ Zatrzymaj" : data.voice ? "● Nagraj jeszcze raz" : "● Nagraj"}
              </button>
              {data.voice && !recording && <audio controls src={data.voice} className="h-10 max-w-full" />}
            </div>
          </section>

          {problem && <p className="m-0 rounded-2xl bg-amber-soft px-4 py-3 text-sm">{problem}</p>}

          <button type="button" onClick={() => void saveImage()} disabled={saving} className="rounded-[20px] bg-amber px-6 py-4 font-display text-lg font-extrabold shadow-[0_5px_0_var(--color-amber-deep)] disabled:opacity-60">
            {saving ? "Zapisuję…" : "Zapisz paszport jako obrazek"}
          </button>
          <Link href="/journey" className="k-tap self-center rounded text-sm font-semibold text-muted">
            Wróć do mapy →
          </Link>
        </div>
      </div>
    </div>
  );
}
