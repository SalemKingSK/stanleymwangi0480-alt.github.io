/**
 * The app's voice and the listener's one choice about it: how fast it reads.
 */

const KEY = "mc-voice-settings";

export interface VoiceSettings {
  /** 1 = normal speed. */
  rate: number;
}

/**
 * The app's only voice: "Cori" (Piper en_GB-cori-medium), a British English
 * female voice trained by Bryce Beattie on public-domain LibriVox recordings.
 */
export const APP_VOICE = {
  id: "cori-v1",
  name: "Cori",
  credit: "Cori",
  description: "British English · built into the app · recordings from LibriVox (public domain)",
  /** Files under public/voice/<id>/ (the model in pieces, each under hosting limits). */
  parts: ["model.onnx.part0", "model.onnx.part1"],
  config: "config.json",
  /** Model size in bytes (fp16 weights; full-precision maths at run time). */
  bytes: 32_276_874,
} as const;

const DEFAULTS: VoiceSettings = { rate: 1 };

const clamp = (n: unknown, lo: number, hi: number, d: number) => (typeof n === "number" && Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d);

function read(): VoiceSettings {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null") as Partial<VoiceSettings> | null;
    if (!raw) return { ...DEFAULTS };
    // Earlier versions also stored a chosen voice; only the speed is kept.
    return { rate: clamp(raw.rate, 0.5, 2, 1) };
  } catch {
    return { ...DEFAULTS };
  }
}

let current: VoiceSettings = typeof window === "undefined" ? { ...DEFAULTS } : read();
const listeners = new Set<(s: VoiceSettings) => void>();

export const voiceSettings = {
  get(): VoiceSettings {
    return current;
  },
  set(patch: Partial<VoiceSettings>) {
    current = { ...current, ...patch };
    try {
      localStorage.setItem(KEY, JSON.stringify(current));
    } catch {
      /* private mode */
    }
    listeners.forEach((fn) => fn(current));
  },
  subscribe(fn: (s: VoiceSettings) => void): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  /** Reload from storage (tests). */
  reset() {
    current = read();
  },
};
