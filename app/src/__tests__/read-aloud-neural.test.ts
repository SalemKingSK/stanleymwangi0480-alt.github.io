// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { fake, installFakeVoice, resetFakes, tick, endClip, playedTexts, lastPlayed, generated } from "./helpers/fake-voice";

installFakeVoice();
localStorage.setItem("mc-voice", "system"); // a setting from the old version that mixed in the device voice
const { readAloud } = await import("@/lib/read-aloud/engine");
const { neuralVoice, NEURAL_VOICE } = await import("@/lib/read-aloud/neural-voice");
const { voiceSettings } = await import("@/lib/read-aloud/voice-settings");

function mount(html: string): HTMLElement {
  document.body.innerHTML = `<main>${html}</main>`;
  return document.querySelector("main")!;
}

describe("the voice (Kokoro, on the device) is the only voice", () => {
  beforeEach(() => {
    readAloud.stop();
    resetFakes();
  });

  it("drops the old 'device voice' setting", () => {
    expect(localStorage.getItem("mc-voice")).toBeNull();
  });

  it("first Listen downloads the voice, shows it's waiting, then reads with af_heart", async () => {
    fake.autoReady = false;
    expect(neuralVoice.getState().status).toBe("idle");
    const root = mount(`<p>One. Two. Three. Four. Five. Six. Seven.</p>`);
    readAloud.start("t", root);
    await tick();
    expect(neuralVoice.getState().status).toBe("loading");
    expect(fake.worker!.sent[0]).toMatchObject({ type: "load", device: "wasm" });
    expect(readAloud.getState()).toMatchObject({ status: "playing", index: 0, waiting: true });
    expect(fake.played).toHaveLength(0); // nothing else speaks meanwhile
    expect(fake.speechSpy.speak).not.toHaveBeenCalled();

    fake.worker!.emit({ type: "progress", loaded: 46, total: 92 });
    expect(neuralVoice.getState().progress).toBeCloseTo(0.5);
    fake.worker!.emit({ type: "ready", device: "wasm", rtf: 0.4 });
    await tick();
    expect(neuralVoice.getState().status).toBe("ready");
    expect(readAloud.getState().waiting).toBe(false);
    expect(playedTexts()).toEqual(["One."]);
    // the next four sentences are generated ahead, all in the chosen voice
    expect(generated().map((m) => m.text)).toEqual(["One.", "Two.", "Three.", "Four.", "Five."]);
    expect(generated().every((m) => m.voice === NEURAL_VOICE)).toBe(true);

    await endClip();
    expect(lastPlayed()).toBe("Two.");
    expect(generated().filter((m) => m.text === "Two.")).toHaveLength(1); // reused, not regenerated
  });

  it("pause stops the sound; resume replays the sentence without regenerating it", async () => {
    const root = mount(`<p>Alpha. Beta.</p>`);
    readAloud.start("t", root);
    await tick();
    const clip = fake.played.at(-1)!;
    const before = generated().length;
    readAloud.pause();
    expect(clip.stopped).toBe(true);
    readAloud.resume();
    await tick();
    expect(lastPlayed()).toBe("Alpha.");
    expect(generated().length).toBe(before);
  });

  it("speaks with the voice picked in the menu, and switching regenerates in the new voice", async () => {
    voiceSettings.set({ naturalVoice: "am_michael" });
    try {
      readAloud.start("t", mount(`<p>Picked voice.</p>`));
      await tick();
      expect(generated().at(-1)).toMatchObject({ text: "Picked voice.", voice: "am_michael" });
      voiceSettings.set({ naturalVoice: "af_bella" });
      readAloud.voiceChanged();
      await tick();
      expect(generated().at(-1)).toMatchObject({ text: "Picked voice.", voice: "af_bella" });
      expect(fake.played).toHaveLength(2);
      expect(fake.played[0].stopped).toBe(true);
    } finally {
      voiceSettings.set({ naturalVoice: "af_heart" });
    }
  });

  it("when idle, picking a voice or speed plays a short sample", async () => {
    voiceSettings.set({ naturalVoice: "bf_emma", rate: 1.2 });
    try {
      readAloud.voiceChanged();
      await tick();
      expect(generated().at(-1)).toMatchObject({ voice: "bf_emma", speed: 1.2 });
      expect(lastPlayed()).toMatch(/^Hello\./);
    } finally {
      voiceSettings.set({ naturalVoice: "af_heart", rate: 1 });
    }
  });

  it("waits (and says so) while a slow sentence is generated, instead of skipping it", async () => {
    fake.slowText = "Slow to make.";
    readAloud.start("t", mount(`<p>Slow to make. Then this.</p>`));
    await tick(200);
    expect(readAloud.getState()).toMatchObject({ index: 0, waiting: true });
    expect(fake.played).toHaveLength(0);
    await tick(200);
    expect(readAloud.getState().waiting).toBe(false);
    expect(lastPlayed()).toBe("Slow to make.");
  });

  it("skips a sentence the model can't say, and stops after repeated failures", async () => {
    fake.failText = "Broken.";
    readAloud.start("t", mount(`<p>Broken. Fine.</p>`));
    await tick();
    expect(lastPlayed()).toBe("Fine.");
    readAloud.stop();

    const errors: string[] = [];
    readAloud.setErrorHandler((m) => errors.push(m));
    readAloud.start("t", mount(`<p>Broken. Broken. Broken. Never.</p>`));
    await tick(60);
    expect(readAloud.getState().status).toBe("idle");
    expect(errors[0]).toMatch(/Reading stopped/);
    readAloud.setErrorHandler(null);
  });

  it("if the phone blocks sound, it pauses and asks for a tap instead of hanging", async () => {
    fake.audioFrozen = true;
    const errors: string[] = [];
    readAloud.setErrorHandler((m) => errors.push(m));
    readAloud.start("t", mount(`<p>Muted. Later.</p>`));
    await tick(450);
    expect(readAloud.getState()).toMatchObject({ status: "paused", index: 0 });
    expect(errors).toEqual(["Tap play to allow sound."]);
    expect(fake.speechSpy.speak).not.toHaveBeenCalled();
    readAloud.setErrorHandler(null);
  });
});

describe("slow devices", () => {
  beforeEach(() => {
    readAloud.stop();
    resetFakes();
  });

  it("still read with the natural voice, and can switch to the faster graphics-chip mode", async () => {
    fake.rtf = 3.1; // 3 s of work per second of speech, like a phone processor
    await (neuralVoice as unknown as { start(d: string): Promise<void> }).start("wasm");
    expect(neuralVoice.slow).toBe(true);
    readAloud.start("t", mount(`<p>Slow but natural.</p>`));
    await tick();
    expect(lastPlayed()).toBe("Slow but natural.");
    expect(fake.speechSpy.speak).not.toHaveBeenCalled();

    fake.rtf = 0.2;
    await neuralVoice.useGpu();
    expect(fake.worker!.sent[0]).toMatchObject({ type: "load", device: "webgpu" });
    expect(neuralVoice.getState()).toMatchObject({ status: "ready", device: "webgpu", gpuFailed: false });
    expect(neuralVoice.slow).toBe(false);
    expect(localStorage.getItem("mc-voice-device")).toBe("webgpu");
  });

  it("if the graphics-chip mode doesn't work, it stays on the processor and remembers", async () => {
    fake.readyDevice = "wasm"; // the worker fell back
    await neuralVoice.useGpu();
    expect(neuralVoice.getState()).toMatchObject({ status: "ready", device: "wasm", gpuFailed: true });
    expect(localStorage.getItem("mc-voice-device")).toBe("wasm");
  });

  it("a failed download is reported and Listen tries again", async () => {
    fake.autoReady = false;
    const errors: string[] = [];
    readAloud.setErrorHandler((m) => errors.push(m));
    const p = (neuralVoice as unknown as { start(d: string): Promise<void> }).start("wasm");
    p.catch(() => {});
    readAloud.start("t", mount(`<p>Offline first time.</p>`));
    fake.worker!.emit({ type: "error", message: "Failed to fetch" });
    await tick();
    expect(readAloud.getState().status).toBe("idle");
    expect(errors[0]).toMatch(/couldn't load: Failed to fetch/);
    fake.autoReady = true;
    readAloud.start("t", mount(`<p>Back online.</p>`));
    await tick();
    expect(lastPlayed()).toBe("Back online.");
    readAloud.setErrorHandler(null);
  });
});
