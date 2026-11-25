/**
 * The read-aloud voice: "Cori", a British English Piper neural voice that
 * ships with the app (public/voice/) and speaks on the device. It is the
 * app's only voice — the browser's built-in speech is not used.
 *
 * A device voice starts at once because nothing has to be worked out when
 * Listen is tapped. This voice gets the same effect by having the audio made
 * before it's needed, and keeping it:
 * - clipStore: every sentence made is kept on the device, so reading it
 *   again — this visit or any later one, even before the voice has started
 *   after the app opens — plays at once;
 * - warmUp(): once the app has settled, the voice starts in the background
 *   (fetching its ~32 MB model with the app the very first time);
 * - prefetch(): while nothing is being read, the opening of what each Listen
 *   button would read is made first, then every sentence on screen, one
 *   after another (on one worker at a time; dropped when scrolled away);
 * - primeAudio(): the audio output is created on the first touch;
 * - openingParts(): something not made yet starts after its first few words
 *   (about half a second of work), the rest following while they play.
 *
 * Piper (VITS) makes speech several times faster than it's spoken. The voice
 * runs in Web Workers (piper.worker.ts); on devices with 4+ cores a second
 * worker makes upcoming sentences in parallel.
 */
import { chunkForSpeech } from "./split-sentences";
import { APP_VOICE } from "./voice-settings";
import { clipStore } from "./clip-store";

/** The app's voice. */
export const NEURAL_VOICE = APP_VOICE.id;
const VOICE_CACHE = "mc-piper-voices";
const MAX_PART = 180; // characters per model call; parts play as they're ready
/** A reading that isn't made yet starts with a piece this short (a few words)… */
const FIRST_PIECE = 34;
/** …then one up to this long, then whole parts. */
const SECOND_PIECE = 60;
const PREFETCH_LIMIT = 4;
/** Sentences made in the background while nothing is read. */
const BACKGROUND_LIMIT = 40;
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
  /** Size of the voice's model, for labels. */
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
  /** Made in advance (prefetch), not for the reading in progress. */
  early?: boolean;
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

/** Addresses of the voice's files on the app's own site (absolute, for the worker). */
export function voiceFiles(): { parts: string[]; config: string } {
  const base = typeof location === "undefined" ? "http://localhost/" : location.href;
  const dir = new URL(`${import.meta.env.BASE_URL ?? "/"}voice/${APP_VOICE.id}/`, base).href;
  return { parts: APP_VOICE.parts.map((p) => dir + p), config: dir + APP_VOICE.config };
}

/** 2 workers where there are cores and memory to spare, else 1. */
function poolLimit(): number {
  const n = nav();
  const cores = n?.hardwareConcurrency ?? 2;
  const memory = n?.deviceMemory ?? 4;
  return cores >= 4 && memory >= 3 ? 2 : 1;
}

// Leftovers from earlier versions: the device-voice settings, the voice
// list, and the Kokoro model (92–325 MB) — free that storage.
function dropOldVersions() {
  try {
    localStorage.removeItem("mc-voice");
    localStorage.removeItem("mc-voice-speed");
    localStorage.removeItem("mc-voice-device");
    localStorage.removeItem("mc-voice-recent");
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

/** Battery under 20% and not charging (where the browser tells). */
async function lowBattery(): Promise<boolean> {
  try {
    const n = nav() as (Navigator & { getBattery?: () => Promise<{ level: number; charging: boolean }> }) | null;
    if (!n?.getBattery) return false;
    const b = await n.getBattery();
    return !b.charging && b.level < 0.2;
  } catch {
    return false;
  }
}

/** Delete voices downloaded by earlier versions (63 MB each); keep the app's. */
async function dropOtherVoices() {
  try {
    if (typeof caches === "undefined") return;
    const files = voiceFiles();
    const keep = new Set([...files.parts, files.config]);
    const cache = await caches.open(VOICE_CACHE);
    const keys = await cache.keys();
    await Promise.all(keys.filter((k) => !keep.has(k.url)).map((k) => cache.delete(k)));
  } catch {
    /* storage unavailable */
  }
}

/**
 * The start of `text` up to a clause break between `min` and `max`
 * characters, else up to a word boundary between `wordMin` and `wordMax`;
 * null when neither exists.
 */
function cutEarly(text: string, min: number, max: number, wordMin: number, wordMax: number): string | null {
  const clause = new RegExp(`^([\\s\\S]{${min},${max}}?[,;:—–])\\s`).exec(text);
  if (clause) return clause[1];
  const space = text.lastIndexOf(" ", wordMax);
  if (space >= wordMin) return text.slice(0, space);
  const next = text.indexOf(" ", wordMin);
  return next > 0 && next <= wordMax + 12 ? text.slice(0, next) : null;
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
    if (typeof window !== "undefined") void clipStore.open(NEURAL_VOICE);
    const capable = NeuralVoice.capable();
    if (capable) {
      dropOldVersions();
      // Opened in the background (a notification, a background tab): warm
      // up when the page is first shown instead of waiting for Listen.
      if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") void this.warmUp();
        });
      }
    }
    this.state = {
      status: capable ? "idle" : "unsupported",
      progress: 0,
      voice: NEURAL_VOICE,
      sizeLabel: "32 MB",
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

  /** Fetch (first time only) and start the voice. Resolves when it can speak. */
  load(): Promise<void> {
    if (this.state.status === "unsupported") return Promise.reject(new Error("This browser can't run the voice"));
    const voice = NEURAL_VOICE;
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
    slot.worker.postMessage({ type: "load", voice, ...voiceFiles(), size: APP_VOICE.bytes });
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
        void dropOtherVoices();
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
  private earlyRunning = 0;
  private batteryLow = false;

  private pump() {
    for (const slot of this.slots) {
      if (slot.busy || !slot.voice) continue;
      // Advance work uses one worker at a time, so with two workers one is
      // always free to start a reading the moment Listen is tapped.
      const earlyOk = this.earlyRunning === 0;
      const at = this.queue.findIndex((j) => j.voice === slot.voice && (!j.early || earlyOk));
      if (at < 0) return;
      const [job] = this.queue.splice(at, 1);
      slot.busy = true;
      if (job.early) this.earlyRunning++;
      this.rpc(slot, job)
        .then((clip) => {
          job.resolve(clip);
          clipStore.put(job.key, clip);
          // Made in the background: it's kept in the store, not in memory.
          if (job.early && clipStore.has(job.key)) this.cache.delete(job.key);
        }, (err) => {
          this.cache.delete(job.key);
          job.reject(err instanceof Error ? err : new Error(String(err)));
        })
        .finally(() => {
          slot.busy = false;
          if (job.early) this.earlyRunning--;
          this.pump();
        });
    }
  }

  /** How a sentence is split into model calls (each played as soon as it's ready). */
  partsOf(text: string): string[] {
    return chunkForSpeech(text, MAX_PART);
  }

  /**
   * The same, for a sentence a reading starts with that isn't made yet: the
   * voice starts after a few words — at a clause break that comes early
   * ("Similar to the PY4,"), else between words — then a piece of up to
   * ~60 characters, made while the first plays, then the rest.
   */
  openingParts(text: string): string[] {
    const parts = this.partsOf(text);
    const first = parts[0] ?? "";
    if (first.length <= FIRST_PIECE) return parts;
    const head = cutEarly(first, 12, FIRST_PIECE + 14, 16, FIRST_PIECE);
    if (!head) return parts;
    const rest = first.slice(head.length).trimStart();
    const second = rest.length > SECOND_PIECE ? cutEarly(rest, 24, SECOND_PIECE, 36, SECOND_PIECE) : null;
    const pieces = second ? [head, second, rest.slice(second.length).trimStart()] : [head, rest];
    return [...pieces.filter(Boolean), ...parts.slice(1)];
  }

  private key(voice: string, speed: number, text: string): string {
    return `${voice}|${speed}|${text}`;
  }

  /**
   * Start the voice in the background, so the first Listen doesn't wait for
   * it. The very first time, this also fetches it from the app's site, the
   * way the rest of the app is fetched.
   */
  async warmUp(): Promise<void> {
    if (this.state.status !== "idle") return;
    if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
    this.batteryLow = await lowBattery();
    if (this.batteryLow) return; // it starts on the first Listen instead
    // Audio output too, so the Listen tap only has to resume it (parked
    // suspended, so it doesn't interrupt other apps' sound).
    this.primeAudio();
    if (this.state.status !== "idle") return;
    void this.start(NEURAL_VOICE).catch(() => {});
  }

  /**
   * Make speech in advance, at low priority: first the opening of each of
   * `openings` (what Listen buttons on screen would start with), then each
   * of `more` whole (the sentences after them), so starting — and carrying
   * on — plays at once. What is kept already is skipped.
   */
  prefetch(openings: string[], speed: number, more: string[] = []) {
    if (this.state.status !== "ready") return;
    const voice = this.state.voice;
    const keys = new Set<string>();
    const add = (part: string) => {
      const key = this.key(voice, speed, part);
      keys.add(key);
      if (this.cache.has(key) || clipStore.has(key)) return;
      const p = new Promise<Clip>((resolve, reject) => this.queue.push({ key, text: part, voice, speed, early: true, resolve, reject }));
      p.catch(() => {});
      this.cache.set(key, p);
    };
    for (const text of openings.slice(0, PREFETCH_LIMIT)) {
      if (this.wholeKept(text, speed)) continue;
      const part = this.openingParts(text)[0];
      if (part) add(part);
    }
    // Then whole sentences — only where they can be kept (else they'd crowd
    // memory) and not on low battery.
    if (clipStore.ready && !this.batteryLow) {
      for (const text of more.slice(0, BACKGROUND_LIMIT)) for (const part of this.partsOf(text)) add(part);
    }
    // Advance work for what is no longer on screen is dropped (not started).
    this.queue = this.queue.filter((j) => {
      if (!j.early || keys.has(j.key)) return true;
      this.cache.delete(j.key);
      j.reject(new Error("skipped"));
      return false;
    });
    while (this.cache.size > CACHE_LIMIT) this.cache.delete(this.cache.keys().next().value as string);
    this.pump();
  }

  /** Every part of this sentence is made (in memory or kept on the device). */
  private wholeKept(text: string, speed: number): boolean {
    const parts = this.partsOf(text);
    return parts.length > 0 && parts.every((t) => this.known(this.key(this.state.voice, speed, t)));
  }

  private known(key: string): boolean {
    return this.cache.has(key) || clipStore.has(key);
  }

  /**
   * Whether a reading starting with this sentence can play at once without
   * the model: it is kept on the device (or in memory) already.
   */
  canStart(text: string, speed: number): boolean {
    if (this.wholeKept(text, speed)) return true;
    const part = this.openingParts(text)[0];
    return !!part && this.known(this.key(this.state.voice, speed, part));
  }

  /** Whether the opening of this text is ready (or being made) already. */
  prepared(text: string, speed: number): boolean {
    return this.canStart(text, speed);
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
    const firstParts = whole.every((t) => this.known(this.key(voice, speed, t))) ? whole : this.openingParts(texts[0] ?? "");
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
      const make = () => new Promise<Clip>((resolve, reject) => this.queue.push({ key, text, voice, speed, resolve, reject }));
      // Kept on the device: played from there (made again only if it's gone).
      const p = clipStore.has(key) ? clipStore.get(key).then((c) => c ?? this.enqueueNow(make)) : make();
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
    this.queue.forEach((j) => (j.early = false)); // needed now
    this.queue.sort((a, b) => order.get(a.key)! - order.get(b.key)!);
    const out = keys.slice(0, firstParts.length).map((k) => this.cache.get(k)!);
    while (this.cache.size > CACHE_LIMIT) this.cache.delete(this.cache.keys().next().value as string);
    this.pump();
    return out;
  }

  /** Queue a job outside want() (a kept sentence turned out to be missing). */
  private enqueueNow(make: () => Promise<Clip>): Promise<Clip> {
    const p = make();
    this.pump();
    return p;
  }

  // ── Playback ──────────────────────────────────────────────────────────────

  /**
   * Call on the first touch anywhere in the app: creates the audio output
   * ahead of time, then parks it (suspended, so it doesn't interrupt other
   * apps' music), so Listen only has to resume it.
   */
  primeAudio() {
    if (this.ctx) return;
    const Ctor = audioCtor();
    if (!Ctor) return;
    try {
      this.ctx = new Ctor();
      if (this.ctx.state === "running") void this.ctx.suspend?.().catch(() => {});
    } catch {
      this.ctx = null;
    }
  }

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
      if (!this.ctx || this.ctx.state === "closed") this.ctx = new Ctor();
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
