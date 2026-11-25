// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from "vitest";

// ── Fakes: Web Speech (device voice), a Kokoro worker, and Web Audio ──────────
class FakeUtterance {
  text: string;
  lang = "";
  rate = 1;
  onend: (() => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}
const spoken: FakeUtterance[] = [];
const synth = { speaking: false, pending: false, paused: false, speak: (u: FakeUtterance) => spoken.push(u), cancel: vi.fn(), pause: vi.fn(), resume: vi.fn() };

type Msg = { type: string; id?: number; text?: string; voice?: string; speed?: number; device?: string };
let worker: FakeWorker | null = null;
let failText: string | null = null;
let hangText: string | null = null;
class FakeWorker {
  onmessage: ((ev: { data: unknown }) => void) | null = null;
  onerror: ((ev: unknown) => void) | null = null;
  sent: Msg[] = [];
  constructor() {
    worker = this; // eslint-disable-line @typescript-eslint/no-this-alias
  }
  postMessage(msg: Msg) {
    this.sent.push(msg);
    if (msg.type === "generate") {
      // one "sample" per character, so tests can tell clips apart;
      // hangText takes 3 s, like a long sentence on a slow phone
      setTimeout(() => {
        if (msg.text === failText) this.onmessage?.({ data: { type: "error", id: msg.id, message: "boom" } });
        else this.onmessage?.({ data: { type: "audio", id: msg.id, audio: new Float32Array(msg.text!.length), sampleRate: 24000 } });
      }, msg.text === hangText ? 3000 : 1);
    }
  }
  emit(data: unknown) {
    this.onmessage?.({ data });
  }
  terminate() {}
}

interface FakeSource {
  buffer: { length: number } | null;
  onended: (() => void) | null;
  stopped: boolean;
}
const played: FakeSource[] = [];
const audioClock = { frozen: false, t: 0 };
class FakeAudioContext {
  state = "running";
  private t0 = performance.now();
  get currentTime() {
    return audioClock.frozen ? 0 : (performance.now() - this.t0) / 1000;
  }
  destination = {};
  resume = vi.fn(() => Promise.resolve());
  createBuffer(_c: number, length: number) {
    return { length, getChannelData: () => new Float32Array(length) };
  }
  createBufferSource() {
    const s: FakeSource & { connect: () => void; start: () => void; stop: () => void } = {
      buffer: null,
      onended: null,
      stopped: false,
      connect() {},
      start() {
        if ((s.buffer?.length ?? 0) > 1) played.push(s); // ignore the 1-sample unlock blip
      },
      stop() {
        s.stopped = true;
      },
    };
    return s;
  }
}

Object.assign(globalThis, { SpeechSynthesisUtterance: FakeUtterance, Worker: FakeWorker, AudioContext: FakeAudioContext });
Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
Object.assign(window, { AudioContext: FakeAudioContext });

const { readAloud } = await import("@/lib/read-aloud/engine");
const { neuralVoice, NEURAL_VOICE } = await import("@/lib/read-aloud/neural-voice");

const tick = () => new Promise((r) => setTimeout(r, 20));
const generated = () => worker!.sent.filter((m) => m.type === "generate").map((m) => m.text);
async function endClip() {
  played.at(-1)!.onended?.();
  await tick();
}
function mount(html: string): HTMLElement {
  document.body.innerHTML = `<main>${html}</main>`;
  return document.querySelector("main")!;
}

describe("natural voice (Kokoro af_heart)", () => {
  beforeEach(() => {
    readAloud.stop();
    spoken.length = 0;
    played.length = 0;
    failText = null;
    hangText = null;
    audioClock.frozen = false;
  });

  it("uses the device voice while the model downloads, then switches at the next sentence", async () => {
    expect(neuralVoice.getState().status).toBe("idle");
    const root = mount(`<p>One. Two. Three. Four.</p>`);
    readAloud.start("t", root);
    await tick();
    // Pressing Listen starts the one-time download...
    expect(neuralVoice.getState().status).toBe("loading");
    expect(worker!.sent[0]).toMatchObject({ type: "load" });
    // ...and reading starts at once with the device voice.
    expect(spoken.map((u) => u.text)).toEqual(["One."]);

    worker!.emit({ type: "progress", loaded: 46, total: 92 });
    expect(neuralVoice.getState().progress).toBeCloseTo(0.5);
    worker!.emit({ type: "ready", device: "wasm" });
    expect(neuralVoice.getState().status).toBe("ready");

    spoken[0].onend?.(); // device voice finishes "One."
    await tick();
    expect(spoken).toHaveLength(1); // no more device speech
    expect(played).toHaveLength(1); // "Two." comes from the natural voice
    expect(played[0].buffer!.length).toBe("Two.".length);
    // the next two sentences were generated ahead, with the af_heart voice
    expect(generated()).toEqual(["Two.", "Three.", "Four."]);
    expect(worker!.sent.filter((m) => m.type === "generate").every((m) => m.voice === NEURAL_VOICE)).toBe(true);
    expect(readAloud.getState().index).toBe(1);

    await endClip();
    expect(readAloud.getState().index).toBe(2);
    expect(played.at(-1)!.buffer!.length).toBe("Three.".length);
    expect(generated().filter((t) => t === "Three.")).toHaveLength(1); // reused, not regenerated
    await endClip();
    await endClip();
    expect(readAloud.getState().status).toBe("idle");
  });

  it("pause stops the audio and resume replays the sentence from cache", async () => {
    const root = mount(`<p>Alpha. Beta.</p>`);
    readAloud.start("t", root);
    await tick();
    const clip = played.at(-1)!;
    const before = generated().length;
    readAloud.pause();
    expect(clip.stopped).toBe(true);
    clip.onended?.(); // a late "ended" must not advance
    await tick();
    expect(readAloud.getState()).toMatchObject({ status: "paused", index: 0 });
    readAloud.resume();
    await tick();
    expect(played.at(-1)!.buffer!.length).toBe("Alpha.".length);
    expect(generated().length).toBe(before);
    expect(spoken).toHaveLength(0);
  });

  it("splits a very long sentence into model-sized parts and plays them in order", async () => {
    const long = Array.from({ length: 30 }, (_, i) => `part ${i} of a long thought`).join(", ") + ".";
    const root = mount(`<p>${long} After.</p>`);
    const from = generated().length;
    readAloud.start("t", root);
    await tick();
    const parts = generated().slice(from, -1); // last one is "After." generated ahead
    expect(parts.length).toBeGreaterThan(1);
    expect(parts.join(" ")).toBe(long);
    expect(parts.every((t) => t!.length <= 200)).toBe(true);
    // the first part plays as soon as it's ready; the rest follow
    for (let i = 0; i < parts.length; i++) {
      expect(played.at(-1)!.buffer!.length).toBe(parts[i]!.length);
      expect(readAloud.getState().index).toBe(0);
      await endClip();
    }
    expect(readAloud.getState().index).toBe(1);
    expect(played.at(-1)!.buffer!.length).toBe("After.".length);
  });

  it("if the audio output is blocked, the device voice reads instead of going quiet", async () => {
    audioClock.frozen = true; // e.g. iOS interrupted the audio session
    const root = mount(`<p>Muted one. Muted two.</p>`);
    readAloud.start("t", root);
    await new Promise((r) => setTimeout(r, 450));
    expect(played).toHaveLength(1);
    expect(spoken.map((u) => u.text)).toEqual(["Muted one."]);
    expect(readAloud.getState()).toMatchObject({ status: "playing", index: 0 });
  });

  it("if a sentence isn't generated in time, the device voice says it and reading continues", async () => {
    hangText = "Stuck sentence here.";
    const root = mount(`<p>Stuck sentence here. Flowing sentence.</p>`);
    readAloud.start("t", root);
    await tick();
    expect(played).toHaveLength(0);
    expect(spoken).toHaveLength(0);
    await new Promise((r) => setTimeout(r, 2600));
    expect(spoken.map((u) => u.text)).toEqual(["Stuck sentence here."]);
    spoken[0].onend?.();
    await new Promise((r) => setTimeout(r, 600)); // the slow part finishes, then the next one
    expect(spoken).toHaveLength(1);
    expect(played.at(-1)!.buffer!.length).toBe("Flowing sentence.".length);
    readAloud.stop();
  }, 8000);

  it("falls back to the device voice for a sentence the model can't say", async () => {
    failText = "Gamma.";
    const root = mount(`<p>Gamma. Delta.</p>`);
    readAloud.start("t", root);
    await tick();
    expect(spoken.map((u) => u.text)).toEqual(["Gamma."]);
    spoken[0].onend?.();
    await tick();
    expect(played.at(-1)!.buffer!.length).toBe("Delta.".length);
  });

  it("can be switched off for the device voice, and it's remembered", async () => {
    const root = mount(`<p>Eins. Zwei.</p>`);
    readAloud.start("t", root);
    await tick();
    expect(played).toHaveLength(1);
    readAloud.setNaturalVoice(false);
    await tick();
    expect(played[0].stopped).toBe(true);
    expect(spoken.at(-1)!.text).toBe("Eins.");
    expect(localStorage.getItem("mc-voice")).toBe("system");
    readAloud.setNaturalVoice(true);
    await tick();
    expect(localStorage.getItem("mc-voice")).toBe("natural");
    expect(played.at(-1)!.buffer!.length).toBe("Eins.".length);
  });

  it("non-English readings keep the device voice", async () => {
    const root = mount(`<p>Bonjour. Merci.</p>`);
    readAloud.start("t", root, { lang: "fr-FR" });
    await tick();
    expect(spoken.map((u) => u.text)).toEqual(["Bonjour."]);
    expect(played).toHaveLength(0);
  });

  it("speaks with the natural voice picked in the voice menu", async () => {
    const { voiceSettings } = await import("@/lib/read-aloud/voice-settings");
    voiceSettings.set({ naturalVoice: "af_bella" });
    try {
      const root = mount(`<p>Picked voice.</p>`);
      readAloud.start("t", root);
      await tick();
      const last = worker!.sent.filter((m) => m.type === "generate").at(-1)!;
      expect(last).toMatchObject({ text: "Picked voice.", voice: "af_bella" });
      expect(played).toHaveLength(1);
      // switching voice regenerates the sentence in the new voice
      voiceSettings.set({ naturalVoice: "bm_george" });
      readAloud.voiceChanged();
      await tick();
      expect(worker!.sent.filter((m) => m.type === "generate").at(-1)).toMatchObject({ text: "Picked voice.", voice: "bm_george" });
      expect(played).toHaveLength(2);
    } finally {
      readAloud.stop();
      voiceSettings.set({ naturalVoice: "af_heart" });
    }
  });

  it("a device too slow to keep up is detected, remembered, and uses its own voice", async () => {
    // Make the singleton reload so it runs the speed test again.
    (neuralVoice as unknown as { fail(m: string): void }).fail("reset");
    expect(neuralVoice.getState().status).toBe("error");
    const ready = neuralVoice.load();
    worker!.emit({ type: "ready", device: "wasm", rtf: 3.1 }); // 3 s of work per second of speech
    await expect(ready).rejects.toThrow(/too slow/);
    expect(neuralVoice.getState().status).toBe("slow");
    expect(JSON.parse(localStorage.getItem("mc-voice-speed")!)).toMatchObject({ device: "wasm", slow: true, rtf: 3.1 });
    expect(neuralVoice.wanted("en-US")).toBe(false);

    const root = mount(`<p>Plain one. Plain two.</p>`);
    readAloud.start("t", root);
    await tick();
    expect(spoken.map((u) => u.text)).toEqual(["Plain one."]);
    expect(played).toHaveLength(0);
  });
});
