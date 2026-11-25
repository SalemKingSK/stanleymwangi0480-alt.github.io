/**
 * Test stand-ins for the Kokoro worker and Web Audio, so the reader can be
 * exercised without the 92 MB model. Generated "audio" encodes its text
 * (one sample per character), so tests can tell which sentence played.
 * Also installs a speechSynthesis spy: the app must never use it.
 */
import { vi } from "vitest";

type Msg = { type: string; id?: number; text?: string; voice?: string; speed?: number; device?: string };

export interface FakeSource {
  buffer: { length: number; data: Float32Array } | null;
  onended: (() => void) | null;
  stopped: boolean;
}

export const fake = {
  worker: null as FakeWorker | null,
  workers: [] as FakeWorker[],
  /** Answer "load" automatically with this speed-test result. */
  autoReady: true as boolean,
  rtf: 0.3,
  /** Device the fake reports after loading (null = what was asked for). */
  readyDevice: null as string | null,
  failText: null as string | null,
  slowText: null as string | null,
  slowMs: 300,
  played: [] as FakeSource[],
  audioFrozen: false,
  speechSpy: { speak: vi.fn(), cancel: vi.fn(), getVoices: vi.fn(() => []) },
};

export class FakeWorker {
  onmessage: ((ev: { data: unknown }) => void) | null = null;
  onerror: ((ev: unknown) => void) | null = null;
  sent: Msg[] = [];
  constructor() {
    fake.worker = this;
    fake.workers.push(this);
  }
  postMessage(msg: Msg) {
    this.sent.push(msg);
    if (msg.type === "load" && fake.autoReady) {
      setTimeout(() => this.emit({ type: "ready", device: fake.readyDevice ?? msg.device, rtf: fake.rtf }), 1);
    }
    if (msg.type === "generate") {
      setTimeout(
        () => {
          if (msg.text === fake.failText) this.emit({ type: "error", id: msg.id, message: "boom" });
          else this.emit({ type: "audio", id: msg.id, audio: encode(msg.text!), sampleRate: 24000 });
        },
        msg.text === fake.slowText ? fake.slowMs : 1,
      );
    }
  }
  emit(data: unknown) {
    this.onmessage?.({ data });
  }
  terminate() {}
}

const encode = (t: string) => Float32Array.from([...t].map((c) => c.charCodeAt(0) / 1000));
const decode = (a: Float32Array) => String.fromCharCode(...Array.from(a, (x) => Math.round(x * 1000)));

export class FakeAudioContext {
  state = "running";
  destination = {};
  private t0 = performance.now();
  resume = vi.fn(() => Promise.resolve());
  get currentTime() {
    return fake.audioFrozen ? 0 : (performance.now() - this.t0) / 1000;
  }
  createBuffer(_c: number, length: number) {
    const data = new Float32Array(length);
    return { length, data, getChannelData: () => data };
  }
  createBufferSource() {
    const s: FakeSource & { connect: () => void; start: () => void; stop: () => void } = {
      buffer: null,
      onended: null,
      stopped: false,
      connect() {},
      start() {
        if ((s.buffer?.length ?? 0) > 1) fake.played.push(s); // ignore the 1-sample unlock blip
      },
      stop() {
        s.stopped = true;
      },
    };
    return s;
  }
}

export function installFakeVoice() {
  Object.assign(globalThis, { Worker: FakeWorker, AudioContext: FakeAudioContext });
  Object.assign(window, { AudioContext: FakeAudioContext });
  Object.defineProperty(window, "speechSynthesis", { value: fake.speechSpy, configurable: true });
  Object.assign(globalThis, { SpeechSynthesisUtterance: vi.fn() });
}

export const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));

/** Text of each clip played so far. */
export const playedTexts = () => fake.played.map((s) => decode(s.buffer!.data));
export const lastPlayed = () => playedTexts().at(-1);
export const generated = () => fake.workers.flatMap((w) => w.sent.filter((m) => m.type === "generate"));

/** The current clip finishes playing. */
export async function endClip() {
  fake.played.at(-1)!.onended?.();
  await tick();
}

export function resetFakes() {
  fake.played.length = 0;
  fake.failText = null;
  fake.slowText = null;
  fake.audioFrozen = false;
  fake.autoReady = true;
  fake.rtf = 0.3;
  fake.readyDevice = null;
}
