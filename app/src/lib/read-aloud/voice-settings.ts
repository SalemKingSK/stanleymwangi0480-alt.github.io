/**
 * The listener's voice choices, remembered on the device:
 * - which natural (Kokoro) voice to use,
 * - which of the device's own voices to use (null = automatic),
 * - speaking speed and pitch.
 * Whether the natural voice is on at all is kept by neural-voice.ts.
 */

const KEY = "mc-voice-settings";

export interface VoiceSettings {
  /** Kokoro voice id, e.g. "af_heart". */
  naturalVoice: string;
  /** voiceURI of the chosen device voice; null picks one automatically. */
  deviceVoice: string | null;
  /** 1 = normal speed. */
  rate: number;
  /** 1 = normal pitch (device voices only; the natural voices have their own). */
  pitch: number;
}

export interface NaturalVoiceInfo {
  id: string;
  name: string;
  accent: "American" | "British";
  gender: "Female" | "Male";
  grade: string;
  note?: string;
}

/**
 * Kokoro's voices graded C or better by its makers (VOICES.md), best first.
 * The rest (D/F) are left out.
 */
export const NATURAL_VOICES: NaturalVoiceInfo[] = [
  { id: "af_heart", name: "Heart", accent: "American", gender: "Female", grade: "A", note: "Best" },
  { id: "af_bella", name: "Bella", accent: "American", gender: "Female", grade: "A-" },
  { id: "af_nicole", name: "Nicole", accent: "American", gender: "Female", grade: "B-", note: "Soft" },
  { id: "bf_emma", name: "Emma", accent: "British", gender: "Female", grade: "B-" },
  { id: "am_michael", name: "Michael", accent: "American", gender: "Male", grade: "C+" },
  { id: "am_fenrir", name: "Fenrir", accent: "American", gender: "Male", grade: "C+" },
  { id: "am_puck", name: "Puck", accent: "American", gender: "Male", grade: "C+" },
  { id: "af_aoede", name: "Aoede", accent: "American", gender: "Female", grade: "C+" },
  { id: "af_kore", name: "Kore", accent: "American", gender: "Female", grade: "C+" },
  { id: "af_sarah", name: "Sarah", accent: "American", gender: "Female", grade: "C+" },
  { id: "bm_george", name: "George", accent: "British", gender: "Male", grade: "C" },
  { id: "bm_fable", name: "Fable", accent: "British", gender: "Male", grade: "C" },
  { id: "bf_isabella", name: "Isabella", accent: "British", gender: "Female", grade: "C" },
];

const DEFAULTS: VoiceSettings = { naturalVoice: "af_heart", deviceVoice: null, rate: 1, pitch: 1 };

const clamp = (n: unknown, lo: number, hi: number, d: number) => (typeof n === "number" && Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d);

function read(): VoiceSettings {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null") as Partial<VoiceSettings> | null;
    if (!raw) return { ...DEFAULTS };
    return {
      naturalVoice: NATURAL_VOICES.some((v) => v.id === raw.naturalVoice) ? (raw.naturalVoice as string) : DEFAULTS.naturalVoice,
      deviceVoice: typeof raw.deviceVoice === "string" ? raw.deviceVoice : null,
      rate: clamp(raw.rate, 0.5, 2, 1),
      pitch: clamp(raw.pitch, 0.5, 2, 1),
    };
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

/** The device's English voices, best candidates first (Kenyan English first if installed). */
export function deviceEnglishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  const all = window.speechSynthesis.getVoices?.() ?? [];
  const norm = (l: string) => l.replace("_", "-").toLowerCase();
  const rank = (v: SpeechSynthesisVoice) => {
    const l = norm(v.lang);
    if (l === "en-ke") return 0;
    if (l === "en-us" || l === "en-gb") return 1;
    return 2;
  };
  const seen = new Set<string>();
  return all
    .filter((v) => norm(v.lang).startsWith("en"))
    .filter((v) => (seen.has(v.voiceURI) ? false : (seen.add(v.voiceURI), true)))
    .sort((a, b) => rank(a) - rank(b) || norm(a.lang).localeCompare(norm(b.lang)) || a.name.localeCompare(b.name));
}

/** "English (Kenya)"-style label for a voice's accent. */
export function accentLabel(lang: string): string {
  const region = lang.replace("_", "-").split("-")[1];
  if (!region) return "English";
  try {
    const name = new Intl.DisplayNames(["en"], { type: "region" }).of(region.toUpperCase());
    return name ? `English (${name})` : lang;
  } catch {
    return lang;
  }
}
