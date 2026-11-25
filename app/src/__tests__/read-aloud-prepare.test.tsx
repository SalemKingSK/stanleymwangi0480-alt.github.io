// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { fake, installFakeVoice, resetFakes, tick, generated } from "./helpers/fake-voice";

installFakeVoice();
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
// Cache Storage holding the voices that were downloaded before.
const stored = new Set<string>();
Object.assign(globalThis, {
  caches: {
    open: async () => ({ match: async (url: string) => (stored.has(url) ? new Response("x") : undefined), keys: async () => [], delete: async () => true }),
    delete: async () => true,
  },
});
const { neuralVoice, voiceFiles, NEURAL_VOICE } = await import("@/lib/read-aloud/neural-voice");
const { ReadAloudDock } = await import("@/components/read-aloud/read-aloud-dock");
const { readAloud } = await import("@/lib/read-aloud/engine");

describe("getting the voice ready before Listen is tapped", () => {
  beforeEach(() => resetFakes());

  it("doesn't download anything unasked: no warm-up for a voice never downloaded", async () => {
    await neuralVoice.warmUp();
    expect(neuralVoice.getState().status).toBe("idle");
    expect(fake.workers).toHaveLength(0);
  });

  it("on low battery (not charging) it waits for the first Listen instead", async () => {
    stored.add(voiceFiles(NEURAL_VOICE).model);
    Object.assign(navigator, { getBattery: async () => ({ level: 0.12, charging: false }) });
    await neuralVoice.warmUp();
    expect(neuralVoice.getState().status).toBe("idle");
    Object.assign(navigator, { getBattery: async () => ({ level: 0.12, charging: true }) });
  });

  it("the first touch anywhere prepares the audio output, parked until Listen", async () => {
    document.body.innerHTML = `<div id="app"></div><main><p>Text.</p></main>`;
    const root = createRoot(document.getElementById("app")!);
    await act(async () => root.render(<ReadAloudDock />));
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    const ctx = (neuralVoice as unknown as { ctx: { state: string; suspend: { mock: { calls: unknown[] } } } }).ctx;
    expect(ctx).toBeTruthy();
    expect(ctx.state).toBe("suspended"); // doesn't interrupt other apps' sound
    neuralVoice.unlock(); // the Listen tap
    expect(ctx.state).toBe("running");
    await act(async () => root.unmount());
  });

  it("opened in the background, it warms up (voice and audio) when first shown", async () => {
    stored.add(voiceFiles(NEURAL_VOICE).model);
    (neuralVoice as unknown as { ctx: unknown }).ctx = null;
    const setVisibility = (v: string) => Object.defineProperty(document, "visibilityState", { value: v, configurable: true });
    setVisibility("hidden");
    await neuralVoice.warmUp();
    expect(neuralVoice.getState().status).toBe("idle");
    setVisibility("visible");
    document.dispatchEvent(new Event("visibilitychange"));
    await tick(50);
    expect(neuralVoice.getState().status).toBe("ready");
    const ctx = (neuralVoice as unknown as { ctx: { state: string } | null }).ctx;
    expect(ctx?.state).toBe("suspended"); // ready for the tap, without taking over the sound
  });

  it("the app starts a downloaded voice by itself, then prepares what's on screen", async () => {
    stored.add(voiceFiles(NEURAL_VOICE).model);
    document.body.innerHTML = `<div id="app"></div><main><p>Opening line on screen. Second line.</p><div data-tts-scope><p>A field's first sentence. More.</p></div></main>`;
    // the field is on screen (the test DOM has no layout)
    const scope = document.querySelector<HTMLElement>("[data-tts-scope]")!;
    scope.getBoundingClientRect = () => ({ top: 120, bottom: 400, left: 0, right: 360, width: 360, height: 280, x: 0, y: 120, toJSON() {} }) as DOMRect;
    const root = createRoot(document.getElementById("app")!);
    await act(async () => root.render(<ReadAloudDock />));
    // after the app settles: voice started in the background, no tap needed
    await act(async () => tick(1500));
    expect(neuralVoice.getState().status).toBe("ready");
    expect(fake.worker!.sent[0]).toMatchObject({ type: "load", voice: NEURAL_VOICE });
    await act(async () => tick(500));
    const made = generated().map((m) => m.text);
    expect(made).toContain("Opening line on screen.");
    expect(made).toContain("A field's first sentence.");
    expect(fake.played).toHaveLength(0);
    expect(readAloud.getState().status).toBe("idle");
    await act(async () => root.unmount());
  });
});
