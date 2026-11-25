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

describe("the voice (Piper, on the device) is the only voice", () => {
  beforeEach(() => {
    readAloud.stop();
    resetFakes();
  });

  it("drops the old 'device voice' setting", () => {
    expect(localStorage.getItem("mc-voice")).toBeNull();
  });

  it("first Listen downloads the default voice, shows it's waiting, then reads with it", async () => {
    fake.autoReady = false;
    expect(neuralVoice.getState().status).toBe("idle");
    const root = mount(`<p>One. Two. Three. Four. Five. Six. Seven.</p>`);
    readAloud.start("t", root);
    await tick();
    expect(neuralVoice.getState().status).toBe("loading");
    expect(NEURAL_VOICE).toBe("en_US-lessac-medium");
    expect(fake.worker!.sent[0]).toMatchObject({
      type: "load",
      voice: NEURAL_VOICE,
      model: "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx",
      config: "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json",
    });
    expect(readAloud.getState()).toMatchObject({ status: "playing", index: 0, waiting: true });
    expect(fake.played).toHaveLength(0); // nothing else speaks meanwhile
    expect(fake.speechSpy.speak).not.toHaveBeenCalled();

    fake.worker!.emit({ type: "progress", voice: NEURAL_VOICE, loaded: 31, total: 62 });
    expect(neuralVoice.getState().progress).toBeCloseTo(0.5);
    fake.worker!.emit({ type: "ready", voice: NEURAL_VOICE, rtf: 0.1 });
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

  it("speaks with the voice picked in the menu, and switching loads and reads in the new voice", async () => {
    voiceSettings.set({ naturalVoice: "en_US-ryan-medium" });
    try {
      readAloud.start("t", mount(`<p>Picked voice.</p>`));
      await tick();
      expect(generated().at(-1)).toMatchObject({ text: "Picked voice.", voice: "en_US-ryan-medium" });
      fake.autoReady = false;
      voiceSettings.set({ naturalVoice: "en_GB-jenny_dioco-medium" });
      readAloud.voiceChanged();
      await tick();
      // the new voice is fetched (once) and the reader waits for it
      expect(fake.worker!.sent.at(-1)).toMatchObject({ type: "load", voice: "en_GB-jenny_dioco-medium", model: expect.stringContaining("/en/en_GB/jenny_dioco/medium/") });
      expect(neuralVoice.getState()).toMatchObject({ status: "loading", voice: "en_GB-jenny_dioco-medium" });
      expect(readAloud.getState()).toMatchObject({ status: "playing", waiting: true });
      fake.worker!.emit({ type: "ready", voice: "en_GB-jenny_dioco-medium", rtf: 0.1 });
      await tick();
      expect(generated().at(-1)).toMatchObject({ text: "Picked voice.", voice: "en_GB-jenny_dioco-medium" });
      expect(fake.played).toHaveLength(2);
      expect(fake.played[0].stopped).toBe(true);
    } finally {
      fake.autoReady = true;
      voiceSettings.set({ naturalVoice: NEURAL_VOICE });
      await tick();
    }
  });

  it("when idle, picking a voice or speed plays a short sample", async () => {
    voiceSettings.set({ naturalVoice: "en_GB-alba-medium", rate: 1.2 });
    try {
      readAloud.voiceChanged();
      await tick();
      expect(generated().at(-1)).toMatchObject({ voice: "en_GB-alba-medium", speed: 1.2 });
      expect(lastPlayed()).toMatch(/^Hello\./);
    } finally {
      voiceSettings.set({ naturalVoice: NEURAL_VOICE, rate: 1 });
      await tick();
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

  it("prepares the opening sentence in advance, so Listen plays at once", async () => {
    const root = mount(`<p>Prepared before the tap. And the rest.</p>`);
    readAloud.prefetch([{ root }]);
    await tick();
    expect(generated().filter((m) => m.text === "Prepared before the tap.")).toHaveLength(1);
    expect(fake.played).toHaveLength(0); // prepared, not played
    expect(neuralVoice.prepared("Prepared before the tap.", voiceSettings.get().rate)).toBe(true);

    fake.slowText = "Prepared before the tap."; // would take a while if it were made now
    readAloud.start("t", root);
    await tick(5);
    expect(lastPlayed()).toBe("Prepared before the tap.");
    expect(readAloud.getState().waiting).toBe(false);
    expect(generated().filter((m) => m.text === "Prepared before the tap.")).toHaveLength(1); // not made again
  });

  it("doesn't prepare anything while a reading is going on", async () => {
    readAloud.start("t", mount(`<p>Reading now.</p>`));
    await tick();
    const before = generated().length;
    readAloud.prefetch([{ root: mount(`<p>Something else entirely.</p>`) }]);
    await tick();
    expect(generated().length).toBe(before);
  });

  it("a long opening sentence starts after its first clause, then continues", async () => {
    const sentence = "Similar to the PY4 in many ways, this is a trough year of consolidation when no major change should be undertaken at all.";
    readAloud.start("t", mount(`<p>${sentence}</p>`));
    await tick();
    expect(lastPlayed()).toBe("Similar to the PY4 in many ways,");
    await endClip();
    expect(lastPlayed()).toBe("this is a trough year of consolidation when no major change should be undertaken at all.");
    expect(readAloud.getState().index).toBe(0); // one sentence, highlighted once
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

describe("speed: no waiting between sentences", () => {
  beforeEach(() => {
    readAloud.stop();
    resetFakes();
  });

  it("where a second worker helps (4+ cores), the next sentences are made in parallel", async () => {
    Object.defineProperty(navigator, "hardwareConcurrency", { value: 8, configurable: true });
    fake.rtf = 0.5;
    voiceSettings.set({ naturalVoice: "en_US-amy-medium" });
    await neuralVoice.load();
    await tick();
    expect(neuralVoice.getState()).toMatchObject({ status: "ready", workers: 2 });
    const live = fake.workers.filter((w) => !w.terminated);
    expect(live).toHaveLength(2);
    expect(live[1].sent[0]).toMatchObject({ type: "load", voice: "en_US-amy-medium" });

    readAloud.start("t", mount(`<p>One. Two. Three. Four.</p>`));
    await tick();
    expect(lastPlayed()).toBe("One.");
    // both workers took a share of the upcoming sentences
    for (const w of live) expect(w.sent.some((m) => m.type === "generate")).toBe(true);
    await endClip();
    expect(lastPlayed()).toBe("Two.");
    voiceSettings.set({ naturalVoice: NEURAL_VOICE });
    await tick();
  });

  it("if the helper worker fails, reading carries on with the main one", async () => {
    const live = fake.workers.filter((w) => !w.terminated);
    expect(live).toHaveLength(2); // set up by the test above
    live[1].onerror?.({ message: "out of memory", preventDefault() {} });
    expect(neuralVoice.getState()).toMatchObject({ status: "ready", workers: 1 });
    readAloud.start("t", mount(`<p>Still here.</p>`));
    await tick();
    expect(lastPlayed()).toBe("Still here.");
  });

  it("a failed download is reported and Listen tries again", async () => {
    fake.autoReady = false;
    const errors: string[] = [];
    readAloud.setErrorHandler((m) => errors.push(m));
    const p = (neuralVoice as unknown as { start(v: string): Promise<void> }).start(NEURAL_VOICE);
    p.catch(() => {});
    readAloud.start("t", mount(`<p>Offline first time.</p>`));
    fake.worker!.emit({ type: "error", voice: NEURAL_VOICE, message: "Failed to fetch" });
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
