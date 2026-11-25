/**
 * The read-aloud voice: Kokoro-82M (Apache-2.0), generated on the device.
 *
 * Kokoro is the highest-rated open-weight text-to-speech model that runs
 * entirely in the browser; "af_heart" (its only grade-A voice) is the
 * default, and the listener can pick any of the voices in voice-settings.ts.
 * It is the app's only voice — the browser's built-in speech is not used.
 *
 * The model runs in a Web Worker (kokoro.worker.ts), in one of two modes:
 * - "wasm":   8-bit model on the processor, a one-time ~92 MB download.
 * - "webgpu": full-precision model on the graphics chip, ~325 MB, much
 *             faster where the browser supports WebGPU.
 * Desktops with WebGPU use it by default. Phones start on the processor;
 * if that turns out slower than speech (the load-time speed test), the
 * player offers the graphics-chip mode. Both are cached and work offline.
 */
import { chunkForSpeech } from "./split-sentences";
import { voiceSettings } from "./voice-settings";

/** Default (and best) voice. */
export const NEURAL_VOICE = "af_heart";
const DEVICE_KEY = "mc-voice-device"; // "webgpu" | "wasm", once the listener chose
const MAX_PART = 180; // characters per model call (≤510 tokens); parts play as they're ready
const CACHE_LIMIT = 40;
/** Seconds of work per second of speech above which reading has pauses. */
export const MAX_RTF = 0.8;

export type NeuralStatus = "unsupported" | "idle" | "loading" | "ready" | "error";
export type Device = "webgpu" | "wasm";

export interface NeuralState {
  status: NeuralStatus;
  /** Download progress 0..1 while loading. */
  progress: number;
  /** Mode in use (or about to load). */
  device: Device;
  /** One-time download size for that mode, for labels. */
  sizeLabel: string;
  /** Seconds of work per second of speech, from the speed test (0 = unknown). */
  rtf: number;
  /** The browser offers WebGPU (the faster mode may work). */
  gpuAvailable: boolean;
  /** The faster mode was tried and failed on this device. */
  gpuFailed: boolean;
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

type AudioCtor = typeof AudioContext;

function audioCtor(): AudioCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { AudioContext?: AudioCtor; webkitAudioContext?: AudioCtor };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

function nav(): (Navigator & { gpu?: unknown; audioSession?: { type: string } }) | null {
  return typeof navigator === "undefined" ? null : (navigator as never);
}

const sizeOf = (d: Device) => (d === "webgpu" ? "325 MB" : "92 MB");

function storedDevice(): Device | null {
  try {
    const v = localStorage.getItem(DEVICE_KEY);
    return v === "webgpu" || v === "wasm" ? v : null;
  } catch {
    return null;
  }
}

function defaultDevice(): Device {
  const stored = storedDevice();
  if (stored) return stored;
  const coarse = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
  // The graphics-chip mode is a 325 MB download: automatic on desktops only.
  return nav()?.gpu && !coarse ? "webgpu" : "wasm";
}

// Settings from the earlier version that mixed in the device's voice.
function dropOldSettings() {
  try {
    localStorage.removeItem("mc-voice");
    localStorage.removeItem("mc-voice-speed");
  } catch {
    /* private mode */
  }
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
  private ctx: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;

  constructor() {
    const capable = NeuralVoice.capable();
    const device = capable ? defaultDevice() : "wasm";
    if (capable) dropOldSettings();
    this.state = {
      status: capable ? "idle" : "unsupported",
      progress: 0,
      device,
      sizeLabel: sizeOf(device),
      rtf: 0,
      gpuAvailable: !!nav()?.gpu,
      gpuFailed: false,
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

  /** Slower than speech here, so reading pauses between sentences. */
  get slow(): boolean {
    return this.state.rtf > MAX_RTF;
  }

  /** Download + start the model (once). Resolves when it can speak. */
  load(): Promise<void> {
    if (this.state.status === "unsupported") return Promise.reject(new Error("This browser can't run the voice"));
    if (this.ready && this.state.status !== "error") return this.ready;
    return this.start(this.state.device);
  }

  /**
   * Switch to the graphics-chip mode (faster where supported). Keeps the
   * processor mode if it fails.
   */
  useGpu(): Promise<void> {
    if (this.state.status === "unsupported") return Promise.reject(new Error("This browser can't run the voice"));
    try {
      localStorage.setItem(DEVICE_KEY, "webgpu");
    } catch {
      /* private mode */
    }
    return this.start("webgpu");
  }

  private start(device: Device): Promise<void> {
    this.rejectPending(new Error("Voice restarted"));
    this.readyHooks?.reject(new Error("Voice restarted"));
    this.ready = new Promise<void>((resolve, reject) => {
      this.readyHooks = { resolve, reject };
    });
    this.ready.catch(() => {});
    this.set({ status: "loading", progress: 0, device, sizeLabel: sizeOf(device), error: null });
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
      this.fail(ev.message || "The voice stopped unexpectedly");
    };
    this.worker.postMessage({ type: "load", device });
    return this.ready;
  }

  private onMessage(msg: { type: string; id?: number; loaded?: number; total?: number; device?: Device; rtf?: number; audio?: Float32Array; sampleRate?: number; message?: string }) {
    if (msg.type === "progress") {
      if (msg.total) this.set({ progress: Math.min(1, (msg.loaded ?? 0) / msg.total) });
    } else if (msg.type === "ready") {
      const device = msg.device ?? this.state.device;
      const wanted = this.state.device;
      const rtf = typeof msg.rtf === "number" && Number.isFinite(msg.rtf) ? msg.rtf : 0;
      const gpuFailed = wanted === "webgpu" && device !== "webgpu";
      if (gpuFailed) {
        try {
          localStorage.setItem(DEVICE_KEY, "wasm");
        } catch {
          /* private mode */
        }
      }
      this.set({ status: "ready", progress: 1, device, sizeLabel: sizeOf(device), rtf, gpuFailed: this.state.gpuFailed || gpuFailed });
      this.readyHooks?.resolve();
      // Ask the browser not to evict the downloaded model.
      void nav()?.storage?.persist?.().catch(() => {});
      if (device === "webgpu") void dropModelFile("model_quantized"); // the processor copy isn't needed now
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
        this.fail(msg.message || "The voice couldn't load");
      }
    }
  }

  private rejectPending(err: Error) {
    this.calls.forEach((c) => c.reject(err));
    this.calls.clear();
    this.queue.forEach((j) => j.reject(err));
    this.queue = [];
    this.cache.clear();
    this.busy = false;
  }

  private fail(message: string) {
    this.set({ status: "error", error: message });
    const err = new Error(message);
    this.readyHooks?.reject(err);
    this.readyHooks = null;
    this.rejectPending(err);
    this.worker?.terminate();
    this.worker = null;
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

  /** How a sentence is split into model calls (each played as soon as it's ready). */
  partsOf(text: string): string[] {
    return chunkForSpeech(text, MAX_PART);
  }

  /**
   * Audio for each part of texts[0] (see partsOf); texts[1..] are generated
   * next, in order, so the following sentences are ready when they're needed.
   * Queued work for anything not in the list is dropped (the reader jumped).
   */
  want(texts: string[], speed: number): Promise<Clip>[] {
    const voice = voiceSettings.get().naturalVoice || NEURAL_VOICE;
    const firstParts = this.partsOf(texts[0] ?? "");
    const parts = [...firstParts, ...texts.slice(1).flatMap((t) => this.partsOf(t))];
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

/** Delete one model variant from the download cache (frees storage). */
async function dropModelFile(name: string) {
  try {
    if (typeof caches === "undefined") return;
    const cache = await caches.open("transformers-cache");
    const keys = await cache.keys();
    await Promise.all(keys.filter((k) => k.url.includes("Kokoro-82M") && k.url.includes(`/${name}.onnx`)).map((k) => cache.delete(k)));
  } catch {
    /* storage unavailable */
  }
}

export const neuralVoice = new NeuralVoice();
