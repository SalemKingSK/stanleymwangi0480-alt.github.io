/**
 * Natural voice for read-aloud: Kokoro-82M (Apache-2.0), voice "af_heart".
 *
 * Kokoro is the highest-rated open-weight text-to-speech model that runs
 * entirely in the browser, and af_heart is its only grade-A voice. The model
 * runs in a Web Worker (kokoro.worker.ts): WebGPU at full precision on
 * desktops that have it, otherwise 8-bit on the CPU (WASM).
 *
 * It is downloaded once (about 92 MB on the CPU path, 325 MB on the GPU path)
 * and then works offline. Until it is ready, or if it can't run, the reader
 * uses the device's own voice (speechSynthesis) instead.
 *
 * Speed matters as much as quality: on many phone CPUs the model needs 3-10
 * seconds of work per second of speech, which would mean long silences
 * between sentences. So after loading it times itself; if it can't keep up
 * with reading (real-time factor above MAX_RTF), it isn't used on that device
 * and the verdict is remembered so the phone isn't asked to load it again.
 */
import { chunkForSpeech } from "./split-sentences";
import { voiceSettings } from "./voice-settings";

/** Default (and best) voice; the listener can pick another in the voice menu. */
export const NEURAL_VOICE = "af_heart";
const PREF_KEY = "mc-voice"; // "natural" (default) | "system"
const SPEED_KEY = "mc-voice-speed"; // remembered speed-test verdict
const MAX_PART = 200; // characters per model call (the model takes ≤510 tokens); parts play as they're ready
const CACHE_LIMIT = 40;
/** Seconds of work per second of speech above which reading would stall. */
export const MAX_RTF = 0.8;
const SLOW_RETEST_MS = 30 * 24 * 3600 * 1000;

/** "slow": works, but too slowly on this device to read without gaps. */
export type NeuralStatus = "unsupported" | "idle" | "loading" | "ready" | "slow" | "error";
type Device = "webgpu" | "wasm";

export interface NeuralState {
  status: NeuralStatus;
  /** The user wants the natural voice (stored preference). */
  enabled: boolean;
  /** Download progress 0..1 while loading. */
  progress: number;
  /** Approximate one-time download size, for labels. */
  sizeLabel: string;
  device: Device | null;
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

type AudioCtor = typeof AudioContext;

function audioCtor(): AudioCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { AudioContext?: AudioCtor; webkitAudioContext?: AudioCtor };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

function nav(): (Navigator & { deviceMemory?: number; connection?: { saveData?: boolean }; gpu?: unknown; audioSession?: { type: string } }) | null {
  return typeof navigator === "undefined" ? null : (navigator as never);
}

function readPref(): boolean {
  try {
    return localStorage.getItem(PREF_KEY) !== "system";
  } catch {
    return true;
  }
}

function rememberedSlow(device: Device): boolean {
  try {
    const v = JSON.parse(localStorage.getItem(SPEED_KEY) || "null") as { device?: string; slow?: boolean; at?: number } | null;
    return !!v && v.slow === true && v.device === device && Date.now() - (v.at ?? 0) < SLOW_RETEST_MS;
  } catch {
    return false;
  }
}

function rememberSpeed(device: Device, rtf: number, slow: boolean) {
  try {
    localStorage.setItem(SPEED_KEY, JSON.stringify({ device, rtf: Math.round(rtf * 100) / 100, slow, at: Date.now() }));
  } catch {
    /* private mode */
  }
}

function pickDevice(): Device {
  const n = nav();
  const coarse = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
  // The GPU path downloads the full-precision model (325 MB): desktops only.
  return n?.gpu && !coarse && !n.connection?.saveData ? "webgpu" : "wasm";
}

class NeuralVoice {
  private state: NeuralState;
  private listeners = new Set<(s: NeuralState) => void>();
  private worker: Worker | null = null;
  private nextId = 1;
  private calls = new Map<number, { resolve: (c: Clip) => void; reject: (e: Error) => void }>();
  private cache = new Map<string, Promise<Clip>>();
  private queue: Job[] = [];
  private busy = false;
  private ready: Promise<void> | null = null;
  private readyHooks: { resolve: () => void; reject: (e: Error) => void } | null = null;
  private failures = 0;
  private stalls = 0;
  private ctx: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;

  constructor() {
    const capable = NeuralVoice.capable();
    const device = capable ? pickDevice() : null;
    this.state = {
      status: !capable ? "unsupported" : rememberedSlow(device!) ? "slow" : "idle",
      enabled: readPref(),
      progress: 0,
      sizeLabel: device === "webgpu" ? "325 MB" : "92 MB",
      device,
    };
  }

  static capable(): boolean {
    if (typeof window === "undefined" || typeof Worker === "undefined" || typeof WebAssembly === "undefined" || !audioCtor()) return false;
    const mem = nav()?.deviceMemory;
    return !(typeof mem === "number" && mem < 2);
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

  /** The natural voice is ready and wanted for this language. */
  usable(lang: string): boolean {
    return this.state.enabled && this.state.status === "ready" && /^en\b/i.test(lang);
  }

  /** Could the natural voice be used (now or once downloaded)? */
  wanted(lang: string): boolean {
    const st = this.state.status;
    return this.state.enabled && (st === "idle" || st === "loading" || st === "ready") && /^en\b/i.test(lang);
  }

  /** It can run here but not fast enough, or failed to load. */
  get unavailable(): boolean {
    const st = this.state.status;
    return st === "unsupported" || st === "slow" || st === "error";
  }

  setEnabled(on: boolean) {
    try {
      localStorage.setItem(PREF_KEY, on ? "natural" : "system");
    } catch {
      /* private mode */
    }
    this.set({ enabled: on });
    if (on) this.load();
  }

  /** Start the download automatically unless the device asked to save data. */
  autoLoad() {
    if (!this.state.enabled || this.state.status !== "idle") return;
    if (nav()?.connection?.saveData) return; // the dock offers a button instead
    this.load();
  }

  /** Download + start the model (once). Resolves when it can speak. */
  load(): Promise<void> {
    if (this.state.status === "unsupported") return Promise.reject(new Error("Natural voice isn't supported on this device"));
    if (this.state.status === "slow") return Promise.reject(new Error("Natural voice is too slow on this device"));
    if (this.ready && this.state.status !== "error") return this.ready;
    this.failures = 0;
    this.stalls = 0;
    this.ready = new Promise<void>((resolve, reject) => {
      this.readyHooks = { resolve, reject };
    });
    this.ready.catch(() => {});
    this.set({ status: "loading", progress: 0 });
    try {
      this.worker?.terminate();
      this.worker = new Worker(new URL("./kokoro.worker.ts", import.meta.url), { type: "module" });
    } catch (err) {
      this.fail(err instanceof Error ? err.message : String(err));
      return this.ready;
    }
    this.worker.onmessage = (ev) => this.onMessage(ev.data);
    this.worker.onerror = (ev) => {
      ev.preventDefault?.();
      this.fail(ev.message || "The voice worker crashed");
    };
    this.worker.postMessage({ type: "load", device: this.state.device ?? "wasm" });
    return this.ready;
  }

  private onMessage(msg: { type: string; id?: number; loaded?: number; total?: number; device?: Device; rtf?: number; audio?: Float32Array; sampleRate?: number; message?: string }) {
    if (msg.type === "progress") {
      if (msg.total) this.set({ progress: Math.min(1, (msg.loaded ?? 0) / msg.total) });
    } else if (msg.type === "ready") {
      const device = msg.device ?? this.state.device ?? "wasm";
      const rtf = typeof msg.rtf === "number" && Number.isFinite(msg.rtf) ? msg.rtf : 0;
      const slow = rtf > MAX_RTF;
      if (slow) {
        this.markSlow(rtf);
        return;
      }
      rememberSpeed(device, rtf, false);
      this.set({ status: "ready", progress: 1, device });
      this.readyHooks?.resolve();
      // Ask the browser not to evict the downloaded model.
      void nav()?.storage?.persist?.().catch(() => {});
    } else if (msg.type === "audio" && msg.id) {
      const call = this.calls.get(msg.id);
      this.calls.delete(msg.id);
      call?.resolve({ samples: msg.audio as Float32Array, sampleRate: msg.sampleRate ?? 24000 });
    } else if (msg.type === "error") {
      if (msg.id) {
        const call = this.calls.get(msg.id);
        this.calls.delete(msg.id);
        call?.reject(new Error(msg.message || "Speech generation failed"));
      } else {
        this.fail(msg.message || "The natural voice couldn't load");
      }
    }
  }

  /** Too slow to read without gaps here: stop using it (and free its memory). */
  private markSlow(rtf = MAX_RTF + 1) {
    if (this.state.device) rememberSpeed(this.state.device, rtf, true);
    this.shutdown("slow", "Natural voice is too slow on this device");
    void freeDownloadedModel();
  }

  private fail(message: string) {
    this.shutdown("error", message);
  }

  private shutdown(status: "slow" | "error", message: string) {
    this.set({ status });
    const err = new Error(message);
    this.readyHooks?.reject(err);
    this.readyHooks = null;
    this.calls.forEach((c) => c.reject(err));
    this.calls.clear();
    this.queue.forEach((j) => j.reject(err));
    this.queue = [];
    this.cache.clear();
    this.worker?.terminate();
    this.worker = null;
  }

  /** A sentence failed to generate; give up on the natural voice after a few. */
  reportFailure() {
    if (++this.failures >= 3) this.fail("Too many speech errors");
  }

  /** A part wasn't ready in time and the device voice stepped in. */
  reportStall() {
    if (++this.stalls >= 3) this.markSlow();
  }

  /** A part was ready in time. */
  reportOnTime() {
    this.stalls = 0;
  }

  /** How a sentence is split into model calls (each played as soon as it's ready). */
  partsOf(text: string): string[] {
    return chunkForSpeech(text, MAX_PART);
  }

  private rpc(text: string, voice: string, speed: number): Promise<Clip> {
    const worker = this.worker;
    if (!worker) return Promise.reject(new Error("Voice not loaded"));
    const id = this.nextId++;
    return new Promise<Clip>((resolve, reject) => {
      this.calls.set(id, { resolve, reject });
      worker.postMessage({ type: "generate", id, text, voice, speed });
    });
  }

  private async pump() {
    if (this.busy) return;
    const job = this.queue.shift();
    if (!job) return;
    this.busy = true;
    try {
      job.resolve(await this.rpc(job.text, job.voice, job.speed));
    } catch (err) {
      this.cache.delete(job.key);
      job.reject(err instanceof Error ? err : new Error(String(err)));
    } finally {
      this.busy = false;
      void this.pump();
    }
  }

  /**
   * Audio for each part of texts[0] (see partsOf); texts[1..] are generated
   * next, in order, so the following sentences are ready when they're needed.
   * Queued work for anything not in the list is dropped (the reader jumped).
   */
  want(texts: string[], speed: number): Promise<Clip>[] {
    const firstParts = this.partsOf(texts[0] ?? "");
    const parts = [...firstParts, ...texts.slice(1).flatMap((t) => this.partsOf(t))];
    const voice = voiceSettings.get().naturalVoice || NEURAL_VOICE;
    const keys = parts.map((t) => `${voice}|${speed}|${t}`);
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
    void this.pump();
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
      // iOS: play even when the ring/silent switch is on, like speech does.
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
   * can fall back instead of going quiet.
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

/** Give back the storage used by a model this device can't use. */
async function freeDownloadedModel() {
  try {
    if (typeof caches === "undefined") return;
    await caches.delete("kokoro-voices");
    const cache = await caches.open("transformers-cache");
    const keys = await cache.keys();
    await Promise.all(keys.filter((k) => k.url.includes("Kokoro-82M")).map((k) => cache.delete(k)));
  } catch {
    /* storage unavailable */
  }
}

export const neuralVoice = new NeuralVoice();
