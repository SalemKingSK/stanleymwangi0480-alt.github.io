/**
 * The listener's voice choices, remembered on the device: which voice
 * reads, and how fast.
 */

const KEY = "mc-voice-settings";

export interface VoiceSettings {
  /** Piper voice id, e.g. "en_US-lessac-medium". */
  naturalVoice: string;
  /** 1 = normal speed. */
  rate: number;
}

export interface NaturalVoiceInfo {
  id: string;
  name: string;
  accent: string;
  gender: "Female" | "Male";
  note?: string;
}

/**
 * Piper voices (rhasspy/piper-voices), all "medium" quality: natural-sounding
 * and fast enough to read without waits on phones. Each is a one-time
 * download of about 63 MB, fetched only when it's first used.
 */
export const NATURAL_VOICES: NaturalVoiceInfo[] = [
  { id: "en_US-lessac-medium", name: "Lessac", accent: "American", gender: "Female", note: "Default" },
  { id: "en_US-hfc_female-medium", name: "Hi-Fi Female", accent: "American", gender: "Female" },
  { id: "en_US-amy-medium", name: "Amy", accent: "American", gender: "Female" },
  { id: "en_US-kristin-medium", name: "Kristin", accent: "American", gender: "Female" },
  { id: "en_GB-jenny_dioco-medium", name: "Jenny", accent: "British", gender: "Female" },
  { id: "en_GB-cori-medium", name: "Cori", accent: "British", gender: "Female" },
  { id: "en_GB-alba-medium", name: "Alba", accent: "Scottish", gender: "Female" },
  { id: "en_US-ryan-medium", name: "Ryan", accent: "American", gender: "Male" },
  { id: "en_US-hfc_male-medium", name: "Hi-Fi Male", accent: "American", gender: "Male" },
  { id: "en_US-joe-medium", name: "Joe", accent: "American", gender: "Male" },
  { id: "en_US-john-medium", name: "John", accent: "American", gender: "Male" },
  { id: "en_US-norman-medium", name: "Norman", accent: "American", gender: "Male" },
  { id: "en_GB-alan-medium", name: "Alan", accent: "British", gender: "Male" },
  { id: "en_GB-northern_english_male-medium", name: "Northern English", accent: "British", gender: "Male" },
];

const DEFAULTS: VoiceSettings = { naturalVoice: NATURAL_VOICES[0].id, rate: 1 };

const clamp = (n: unknown, lo: number, hi: number, d: number) => (typeof n === "number" && Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d);

function read(): VoiceSettings {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null") as Partial<VoiceSettings> | null;
    if (!raw) return { ...DEFAULTS };
    return {
      // A voice from an earlier version (or unknown) falls back to the default.
      naturalVoice: NATURAL_VOICES.some((v) => v.id === raw.naturalVoice) ? (raw.naturalVoice as string) : DEFAULTS.naturalVoice,
      rate: clamp(raw.rate, 0.5, 2, 1),
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
