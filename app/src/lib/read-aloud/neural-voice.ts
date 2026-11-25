/**
 * The read-aloud voice: Piper neural voices (rhasspy/piper-voices), generated
 * on the device. It is the app's only voice — the browser's built-in speech
 * is not used.
 *
 * Piper (VITS) makes a whole sentence in a single pass, several times faster
 * than it's spoken on a phone processor, so reading flows from sentence to
 * sentence without "Preparing speech" waits. (The earlier Kokoro model took
 * about three seconds of work per second of speech on a processor.)
 *
 * The voice runs in Web Workers (piper.worker.ts). On devices with 4+ cores a
 * second worker starts once the first is ready and makes the next sentences
 * in parallel, so the reader stays well ahead of the speech. Each voice is a
 * one-time ~63 MB download, kept for offline use (the last few voices used).
 *
 * To start reading the moment Listen is tapped:
 * - warmUp(): once the app has settled, a voice that is already downloaded
 *   is started in the background (no download is ever started unasked);
 * - prefetch(): while nothing is being read, the opening of what each
 *   Listen button would read is made in advance and kept ready;
 * - the opening of a reading is cut at its first comma when that comes
 *   early, so even something not prepared starts sooner.
 */
import { chunkForSpeech } from "./split-sentences";
import { voiceSettings, NATURAL_VOICES } from "./voice-settings";

/** Default voice. */
export const NEURAL_VOICE = NATURAL_VOICES[0].id;
const VOICE_BASE = "https://huggingface.co/rhasspy/piper-voices/resolve/main/";
const VOICE_BYTES = 63_201_294;
const VOICE_CACHE = "mc-piper-voices";
const RECENT_KEY = "mc-voice-recent";
const KEEP_VOICES = 3;
const MAX_PART = 180; // characters per model call; parts play as they're ready
/** A reading's first part ends at the first clause break within this many characters. */
const OPENING_MAX = 80;
const PREFETCH_LIMIT = 4;
const CACHE_LIMIT = 40;
/** Above this speed-test result a second worker is worth its memory. */
const PARALLEL_RTF = 0.2;

export type NeuralStatus = "unsupported" | "idle" | "loading" | "ready" | "error";

export interface NeuralState {
  status: NeuralStatus;
  /** Download progress 0..1 while loading. */
  progress: number;
  /** Voice id in use (or being loaded). */
  voice: string;
  /** One-time download size of a voice, for labels. */
  sizeLabel: string;
  /** Seconds of work per second of speech, from the warm-up (0 = unknown). */
  rtf: number;
  /** Workers generating speech (1 or 2). */
  workers: number;
  /** Last load error, for messages. */
  error: string | null;
}

export interface Clip {
  samples: Float32Array;
  sampleRate: number;
}

interface Job {
  key: string;
  text: string;
  voice: string;
  speed: number;
  resolve: (c: Clip) => void;
  reject: (e: Error) => void;
}

interface Slot {
  worker: Worker;
  primary: boolean;
  /** Voice this worker has ready (null while loading). */
  voice: string | null;
  busy: boolean;
}

type WorkerMsg = { type: string; id?: number; voice?: string; loaded?: number; total?: number; rtf?: number; audio?: Float32Array; sampleRate?: number; message?: string };

type AudioCtor = typeof AudioContext;

function audioCtor(): AudioCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { AudioContext?: AudioCtor; webkitAudioContext?: AudioCtor };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

function nav(): (Navigator & { deviceMemory?: number; audioSession?: { type: string } }) | null {
  return typeof navigator === "undefined" ? null : (navigator as never);
}

/** Download addresses of a voice, e.g. en_US-lessac-medium → en/en_US/lessac/medium/… */
export function voiceFiles(id: string): { model: string; config: string } {
  const [locale, speaker, quality] = id.split("-");
  const dir = `${VOICE_BASE}${locale.split("_")[0]}/${locale}/${speaker}/${quality}/${id}.onnx`;
  return { model: dir, config: `${dir}.json` };
}

/** 2 workers where there are cores and memory to spare, else 1. */
function poolLimit(): number {
  const n = nav();
  const cores = n?.hardwareConcurrency ?? 2;
  const memory = n?.deviceMemory ?? 4;
  return cores >= 4 && memory >= 3 ? 2 : 1;
}

function currentVoice(): string {
  const id = voiceSettings.get().naturalVoice;
  return NATURAL_VOICES.some((v) => v.id === id) ? id : NEURAL_VOICE;
}

// Leftovers from earlier versions: the device-voice settings and the Kokoro
// model (92–325 MB) — free that storage.
function dropOldVersions() {
  try {
    localStorage.removeItem("mc-voice");
    localStorage.removeItem("mc-voice-speed");
    localStorage.removeItem("mc-voice-device");
  } catch {
    /* private mode */
  }
  try {
    if (typeof caches !== "undefined") {
      void caches.delete("transformers-cache").catch(() => {});
      void caches.delete("kokoro-voices").catch(() => {});
    }
  } catch {
    /* storage unavailable */
  }
}

/** Keep the last few voices used offline; delete older downloads. */
async function pruneVoices(voice: string) {
  try {
    let recent: string[] = [];
    try {
      recent = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    } catch {
      recent = [];
    }
    recent = [voice, ...recent.filter((v) => v !== voice)].slice(0, KEEP_VOICES);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    if (typeof caches === "undefined") return;
    const keep = new Set(recent.flatMap((v) => Object.values(voiceFiles(v))));
    const cache = await caches.open(VOICE_CACHE);
    const keys = await cache.keys();
    await Promise.all(keys.filter((k) => !keep.has(k.url)).map((k) => cache.delete(k)));
  } catch {
    /* storage unavailable */
  }
}

class NeuralVoice {
  private state: NeuralState;
  private listeners = new Set<(s: NeuralState) => void>();
  private slots: Slot[] = [];
  private nextId = 1;
  private calls = new Map<number, { resolve: (c: Clip) => void; reject: (e: Error) => void; slot: Slot }>();
  private cache = new Map<string, Promise<Clip>>();
  private queue: Job[] = [];
  private ready: Promise<void> | null = null;
  private readyHooks: { resolve: () => void; reject: (e: Error) => void } | null = null;
  private ctx: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;

  constructor() {
    const capable = NeuralVoice.capable();
    if (capable) {
      dropOldVersions();
      // A different voice picked while one is loaded: switch to it.
      voiceSettings.subscribe(() => {
        const voice = currentVoice();
        if ((this.state.status === "ready" || this.state.status === "loading") && voice !== this.state.voice) void this.start(voice);
      });
    }
    this.state = {
      status: capable ? "idle" : "unsupported",
      progress: 0,
      voice: currentVoice(),
      sizeLabel: "63 MB",
      rtf: 0,
      workers: 0,
      error: null,
    };
  }

  static capable(): boolean {
    return typeof window !== "undefined" && typeof Worker !== "undefined" && typeof WebAssembly !== "undefined" && !!audioCtor();
  }

  getState(): NeuralState {
    return this.state;
  }

  subscribe(fn: (s: NeuralState) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private set(patch: Partial<NeuralState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((fn) => fn(this.state));
  }

  /** Download (once) and start the chosen voice. Resolves when it can speak. */
  load(): Promise<void> {
    if (this.state.status === "unsupported") return Promise.reject(new Error("This browser can't run the voice"));
    const voice = currentVoice();
    if (this.ready && voice === this.state.voice && (this.state.status === "ready" || this.state.status === "loading")) return this.ready;
    return this.start(voice);
  }

  private start(voice: string): Promise<void> {
    this.rejectPending(new Error("Voice changed"));
    this.readyHooks?.reject(new Error("Voice changed"));
    this.ready = new Promise<void>((resolve, reject) => {
      this.readyHooks = { resolve, reject };
    });
    this.ready.catch(() => {});
    this.set({ status: "loading", progress: 0, voice, error: null });
    if (!this.slots.length) {
      try {
        this.spawn(true);
      } catch (err) {
        this.fail(err instanceof Error ? err.message : String(err));
        return this.ready;
      }
    }
    for (const slot of this.slots) this.loadInto(slot, voice);
    return this.ready;
  }

  private spawn(primary: boolean): Slot {
    const worker = new Worker(new URL("./piper.worker.ts", import.meta.url), { type: "module" });
    const slot: Slot = { worker, primary, voice: null, busy: false };
    worker.onmessage = (ev) => this.onMessage(slot, ev.data as WorkerMsg);
    worker.onerror = (ev) => {
      ev.preventDefault?.();
      this.lost(slot, ev.message || "The voice stopped unexpectedly");
    };
    this.slots.push(slot);
    this.set({ workers: this.slots.length });
    return slot;
  }

  private loadInto(slot: Slot, voice: string) {
    slot.voice = null;
    slot.worker.postMessage({ type: "load", voice, ...voiceFiles(voice), size: VOICE_BYTES });
  }

  private onMessage(slot: Slot, msg: WorkerMsg) {
    if (msg.type === "progress") {
      if (slot.primary && msg.voice === this.state.voice && msg.total) this.set({ progress: Math.min(1, (msg.loaded ?? 0) / msg.total) });
    } else if (msg.type === "ready") {
      if (msg.voice !== this.state.voice) return; // an older request
      slot.voice = msg.voice;
      const rtf = typeof msg.rtf === "number" && Number.isFinite(msg.rtf) && msg.rtf > 0 ? msg.rtf : this.state.rtf;
      if (this.state.status !== "ready") {
        this.set({ status: "ready", progress: 1, rtf });
        this.readyHooks?.resolve();
        this.readyHooks = null;
        void nav()?.storage?.persist?.().catch(() => {}); // ask the browser to keep the download
        void pruneVoices(msg.voice);
      }
      // Now the file is cached, a second worker can start from it quickly.
      if (slot.primary && this.slots.length < poolLimit() && rtf > PARALLEL_RTF) {
        try {
          this.loadInto(this.spawn(false), msg.voice);
        } catch {
          /* one worker is enough */
        }
      }
      void this.pump();
    } else if (msg.type === "audio" && msg.id) {
      const call = this.calls.get(msg.id);
      this.calls.delete(msg.id);
      call?.resolve({ samples: msg.audio as Float32Array, sampleRate: msg.sampleRate ?? 22050 });
    } else if (msg.type === "error") {
      if (msg.id) {
        const call = this.calls.get(msg.id);
        this.calls.delete(msg.id);
        call?.reject(new Error(msg.message || "Speech generation failed"));
      } else if (msg.voice === this.state.voice) {
        this.lost(slot, msg.message || "The voice couldn't load");
      }
    }
  }

  /** A worker failed: the main one ends this load; a helper is just dropped. */
  private lost(slot: Slot, message: string) {
    if (slot.primary || this.slots.length === 1) {
      this.fail(message);
      return;
    }
    slot.worker.terminate();
    this.slots = this.slots.filter((s) => s !== slot);
    this.calls.forEach((c, id) => {
      if (c.slot === slot) {
        this.calls.delete(id);
        c.reject(new Error(message));
      }
    });
    this.set({ workers: this.slots.length });
  }

  private rejectPending(err: Error) {
    this.calls.forEach((c) => c.reject(err));
    this.calls.clear();
    this.queue.forEach((j) => j.reject(err));
    this.queue = [];
    this.cache.clear();
    this.slots.forEach((s) => (s.busy = false));
  }

  private fail(message: string) {
    this.set({ status: "error", error: message, workers: 0 });
    const err = new Error(message);
    this.readyHooks?.reject(err);
    this.readyHooks = null;
    this.rejectPending(err);
    this.slots.forEach((s) => s.worker.terminate());
    this.slots = [];
  }

  private rpc(slot: Slot, job: Job): Promise<Clip> {
    const id = this.nextId++;
    return new Promise<Clip>((resolve, reject) => {
      this.calls.set(id, { resolve, reject, slot });
      slot.worker.postMessage({ type: "generate", id, text: job.text, voice: job.voice, speed: job.speed });
    });
  }

  /** Hands the most urgent queued parts to free workers. */
  private pump() {
    for (const slot of this.slots) {
      if (slot.busy || !slot.voice) continue;
      const at = this.queue.findIndex((j) => j.voice === slot.voice);
      if (at < 0) return;
      const [job] = this.queue.splice(at, 1);
      slot.busy = true;
      this.rpc(slot, job)
        .then(job.resolve, (err) => {
          this.cache.delete(job.key);
          job.reject(err instanceof Error ? err : new Error(String(err)));
        })
        .finally(() => {
          slot.busy = false;
          this.pump();
        });
    }
  }

  /** How a sentence is split into model calls (each played as soon as it's ready). */
  partsOf(text: string): string[] {
    return chunkForSpeech(text, MAX_PART);
  }

  /**
   * The same, for the sentence a reading starts with: a long first part is
   * cut at its first clause break ("Similar to the PY4," | "this is…"), so
   * the voice can start after making only a few words.
   */
  openingParts(text: string): string[] {
    const parts = this.partsOf(text);
    const first = parts[0] ?? "";
    if (first.length <= OPENING_MAX) return parts;
    const m = /^([\s\S]{20,}?[,;:—–])\s+([\s\S]+)$/.exec(first);
    if (!m || m[1].length > OPENING_MAX) return parts;
    return [m[1], m[2], ...parts.slice(1)];
  }

  private key(voice: string, speed: number, text: string): string {
    return `${voice}|${speed}|${text}`;
  }

  /**
   * Start a voice that is already downloaded, in the background, so the
   * first Listen doesn't wait for it. Never downloads.
   */
  async warmUp(): Promise<void> {
    if (this.state.status !== "idle") return;
    if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
    const voice = currentVoice();
    try {
      if (typeof caches === "undefined") return;
      const cache = await caches.open(VOICE_CACHE);
      if (!(await cache.match(voiceFiles(voice).model))) return;
    } catch {
      return;
    }
    if (this.state.status !== "idle") return;
    void this.start(voice).catch(() => {});
  }

  /**
   * Make the opening of each text in advance (low priority, nothing else
   * dropped), so starting a reading with one of them plays at once.
   */
  prefetch(texts: string[], speed: number) {
    if (this.state.status !== "ready") return;
    const voice = this.state.voice;
    for (const text of texts.slice(0, PREFETCH_LIMIT)) {
      const part = this.openingParts(text)[0];
      if (!part) continue;
      const key = this.key(voice, speed, part);
      if (this.cache.has(key)) continue;
      const p = new Promise<Clip>((resolve, reject) => this.queue.push({ key, text: part, voice, speed, resolve, reject }));
      p.catch(() => {});
      this.cache.set(key, p);
    }
    while (this.cache.size > CACHE_LIMIT) this.cache.delete(this.cache.keys().next().value as string);
    this.pump();
  }

  /** Whether the opening of this text is ready (or being made) already. */
  prepared(text: string, speed: number): boolean {
    const part = this.openingParts(text)[0];
    return !!part && this.cache.has(this.key(this.state.voice, speed, part));
  }

  /**
   * Audio for each part of texts[0] (see partsOf); texts[1..] are generated
   * next, in order, so the following sentences are ready when they're needed.
   * Queued work for anything not in the list is dropped (the reader jumped).
   */
  want(texts: string[], speed: number): Promise<Clip>[] {
    const voice = this.state.voice;
    // The sentence to play now: as already made (it was read ahead, or
    // paused), else split for a quick start.
    const whole = this.partsOf(texts[0] ?? "");
    const firstParts = whole.every((t) => this.cache.has(this.key(voice, speed, t))) ? whole : this.openingParts(texts[0] ?? "");
    const parts = [...firstParts, ...texts.slice(1).flatMap((t) => this.partsOf(t))];
    const keys = parts.map((t) => this.key(voice, speed, t));
    parts.forEach((text, i) => {
      const key = keys[i];
      if (this.cache.has(key)) {
        const p = this.cache.get(key)!;
        this.cache.delete(key); // refresh LRU position
        this.cache.set(key, p);
        return;
      }
      const p = new Promise<Clip>((resolve, reject) => this.queue.push({ key, text, voice, speed, resolve, reject }));
      p.catch(() => {});
      this.cache.set(key, p);
    });
    const order = new Map(keys.map((k, i) => [k, i]));
    this.queue = this.queue.filter((j) => {
      if (order.has(j.key)) return true;
      this.cache.delete(j.key);
      j.reject(new Error("skipped"));
      return false;
    });
    this.queue.sort((a, b) => order.get(a.key)! - order.get(b.key)!);
    const out = keys.slice(0, firstParts.length).map((k) => this.cache.get(k)!);
    while (this.cache.size > CACHE_LIMIT) this.cache.delete(this.cache.keys().next().value as string);
    this.pump();
    return out;
  }

  // ── Playback ──────────────────────────────────────────────────────────────

  /**
   * Call inside the user's tap: browsers (iOS Safari especially) only let
   * audio start from a gesture, and generated audio arrives later.
   */
  unlock() {
    const Ctor = audioCtor();
    if (!Ctor) return;
    try {
      const n = nav();
      // iOS: play even when the ring/silent switch is on.
      if (n?.audioSession) n.audioSession.type = "playback";
      if (!this.ctx) this.ctx = new Ctor();
      if (this.ctx.state !== "running") void this.ctx.resume().catch(() => {});
      const silent = this.ctx.createBuffer(1, 1, 22050);
      const s = this.ctx.createBufferSource();
      s.buffer = silent;
      s.connect(this.ctx.destination);
      s.start(0);
    } catch {
      /* playback will report its own error */
    }
  }

  /**
   * Plays a clip; resolves when it finishes (never, if stopped first).
   * Rejects if the audio output is blocked or stuck (a suspended or
   * interrupted AudioContext plays nothing and never "ends"), so the reader
   * can ask for a tap instead of hanging silently.
   */
  play(clip: Clip): Promise<void> {
    this.stopPlayback();
    const Ctor = audioCtor();
    if (!Ctor) return Promise.reject(new Error("No audio output"));
    if (!this.ctx || this.ctx.state === "closed") this.ctx = new Ctor();
    const ctx = this.ctx;
    const seconds = clip.samples.length / clip.sampleRate;
    return new Promise<void>((resolve, reject) => {
      let done = false;
      let watchdog: ReturnType<typeof setTimeout> | null = null;
      const finish = (err?: Error) => {
        if (done) return;
        done = true;
        if (watchdog) clearTimeout(watchdog);
        if (err) {
          this.stopPlayback();
          reject(err);
        } else resolve();
      };
      try {
        if (ctx.state !== "running") void ctx.resume().catch(() => {});
        const buffer = ctx.createBuffer(1, clip.samples.length, clip.sampleRate);
        buffer.getChannelData(0).set(clip.samples);
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(ctx.destination);
        src.onended = () => {
          if (this.source === src) this.source = null;
          finish();
        };
        this.source = src;
        const startedAt = ctx.currentTime;
        src.start();
        const check = (ms: number, final: boolean) => {
          watchdog = setTimeout(() => {
            if (done || this.source !== src) return; // stopped meanwhile
            const advanced = ctx.currentTime > startedAt + 0.05;
            if (!advanced || ctx.state !== "running") return finish(new Error(`Audio output is ${ctx.state}`));
            if (final) {
              // Played through but "ended" never came: move on anyway.
              if (this.source === src) this.source = null;
              return finish();
            }
            check(seconds * 1000 + 1500, true);
          }, ms);
        };
        check(Math.min(1200, seconds * 1000 + 300), false);
      } catch (err) {
        finish(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }

  stopPlayback() {
    const src = this.source;
    this.source = null;
    if (!src) return;
    src.onended = null;
    try {
      src.stop();
    } catch {
      /* already stopped */
    }
  }

  get playing(): boolean {
    return this.source !== null;
  }
}

export const neuralVoice = new NeuralVoice();
