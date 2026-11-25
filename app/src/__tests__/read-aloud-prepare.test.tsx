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
