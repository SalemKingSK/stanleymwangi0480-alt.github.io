// @vitest-environment happy-dom
import "fake-indexeddb/auto";
import { describe, it, expect, vi } from "vitest";
import { fake, installFakeVoice, resetFakes, tick, endClip, lastPlayed, playedTexts, generated } from "./helpers/fake-voice";

installFakeVoice();

function mount(html: string): HTMLElement {
  document.body.innerHTML = `<main>${html}</main>`;
  return document.querySelector("main")!;
}

/** A fresh app (new page load) on the same device: same storage, nothing in memory. */
async function openApp() {
  vi.resetModules();
  fake.worker = null;
  const { readAloud } = await import("@/lib/read-aloud/engine");
  const { neuralVoice, NEURAL_VOICE } = await import("@/lib/read-aloud/neural-voice");
  const { clipStore } = await import("@/lib/read-aloud/clip-store");
  await clipStore.open(NEURAL_VOICE);
  return { readAloud, neuralVoice, clipStore, NEURAL_VOICE };
}

const PAGE = `<p>Your Life Path is seven. You seek hidden truths. Quiet years suit you. Others look to you for answers. Trust what you notice.</p>`;

describe("speech is made once and kept, so Listen plays at once like a device voice", () => {
  it("on a later visit, a reading heard before plays the moment Listen is tapped — before the voice has even started", async () => {
    resetFakes();
    const first = await openApp();
    first.readAloud.start("t", mount(PAGE));
    await tick();
    for (let i = 0; i < 5; i++) await endClip();
    expect(playedTexts()).toEqual(["Your Life Path is seven.", "You seek hidden truths.", "Quiet years suit you.", "Others look to you for answers.", "Trust what you notice."]);
    await tick(50); // kept in the background
    expect(first.clipStore.size).toBe(5);
    first.readAloud.stop();

    // Next day: the app opens and Listen is tapped straight away.
    resetFakes();
    fake.autoReady = false; // the voice takes its time to start
    const later = await openApp();
    expect(later.clipStore.size).toBe(5);
    const before = generated().length;
    later.readAloud.start("t", mount(PAGE));
    await tick();
    expect(later.neuralVoice.getState().status).toBe("loading"); // still starting…
    expect(lastPlayed()).toBe("Your Life Path is seven."); // …yet it's already reading
    expect(later.readAloud.getState().waiting).toBe(false);
    await endClip();
    expect(lastPlayed()).toBe("You seek hidden truths.");
    expect(generated().length).toBe(before); // nothing had to be made again
    later.readAloud.stop();
    fake.autoReady = true;
  });

  it("while nothing is read, every sentence on screen is made in the background and kept", async () => {
    resetFakes();
    const app = await openApp();
    const other = `<p>Personal Year 7 is a trough year of focus. Rest is part of the work. Old plans can be finished. New ones can wait. Notice what returns.</p>`;
    await app.neuralVoice.load();
    await tick();
    const root = mount(other);
    app.readAloud.prefetch([{ root }]);
    await tick(150);
    const made = generated().map((m) => m.text);
    for (const s of ["Rest is part of the work.", "Old plans can be finished.", "New ones can wait.", "Notice what returns."]) expect(made).toContain(s);
    // the first sentence's opening was made first, for an instant start
    expect(made[made.length - 5]).toBe("Personal Year 7 is a trough year");
    await tick(50);

    // Listen: every sentence after the first plays without being made again.
    const before = generated().length;
    app.readAloud.start("t", root);
    await tick();
    expect(lastPlayed()).toBe("Personal Year 7 is a trough year");
    for (let i = 0; i < 5; i++) await endClip();
    expect(playedTexts().slice(-4)).toEqual(["Rest is part of the work.", "Old plans can be finished.", "New ones can wait.", "Notice what returns."]);
    const remade = generated().slice(before).map((m) => m.text);
    expect(remade).not.toContain("Rest is part of the work.");
    app.readAloud.stop();
  });

  it("keeps the audio faithfully, and only for the app's voice", async () => {
    const app = await openApp();
    const samples = Float32Array.from([0, 0.5, -0.5, 0.999, -1]);
    app.clipStore.put(`${app.NEURAL_VOICE}|1|Hi.`, { samples, sampleRate: 22050 });
    app.clipStore.put(`some-old-voice|1|Hi.`, { samples, sampleRate: 22050 });
    await tick(30);
    const again = await openApp();
    const clip = (await again.clipStore.get(`${again.NEURAL_VOICE}|1|Hi.`))!;
    expect(clip.sampleRate).toBe(22050);
    Array.from(samples).forEach((v, i) => expect(clip.samples[i]).toBeCloseTo(v, 4));
    expect(again.clipStore.has(`some-old-voice|1|Hi.`)).toBe(false);
  });
});
