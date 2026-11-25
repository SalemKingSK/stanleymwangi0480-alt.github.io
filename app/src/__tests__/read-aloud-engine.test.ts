// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from "vitest";

// Minimal Web Speech API: records what is spoken; `finish()` ends the current utterance.
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
const synth = {
  speaking: false,
  paused: false,
  speak: (u: FakeUtterance) => spoken.push(u),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
};
Object.assign(globalThis, { SpeechSynthesisUtterance: FakeUtterance });
Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });

const { collectSentences, readAloud } = await import("@/lib/read-aloud/engine");

const tick = () => new Promise((r) => setTimeout(r, 40));
async function finish() {
  spoken[spoken.length - 1].onend?.();
  await tick();
}

function mount(html: string): HTMLElement {
  document.body.innerHTML = `<main>${html}</main>`;
  return document.querySelector("main")!;
}

describe("read-aloud: collecting sentences from the page", () => {
  beforeEach(() => {
    readAloud.stop();
    spoken.length = 0;
  });

  it("splits a paragraph into sentences that map onto the exact text", () => {
    const root = mount(`<p>Dr. King spoke in 1963. The <strong>dream</strong> endured! Last bit without a stop</p>`);
    const s = collectSentences(root);
    expect(s.map((x) => x.text)).toEqual(["Dr. King spoke in 1963.", "The dream endured!", "Last bit without a stop"]);
    // each highlight range covers exactly that sentence, across inline tags
    expect(s.map((x) => x.ranges.map((r) => r.toString()).join(""))).toEqual([
      "Dr. King spoke in 1963.",
      "The dream endured!",
      "Last bit without a stop",
    ]);
  });

  it("skips controls, hidden and aria-hidden content", () => {
    const root = mount(`
      <p>Visible sentence.</p>
      <button>Listen</button>
      <div style="display:none">Hidden sentence.</div>
      <span aria-hidden="true">✦</span>
      <div data-tts-skip>Skipped sentence.</div>
      <input value="typed" />
      <p>Second visible sentence.</p>`);
    expect(collectSentences(root).map((x) => x.text)).toEqual(["Visible sentence.", "Second visible sentence."]);
  });

  it("joins a label with its value and a 'Label:' with its sentence", () => {
    const root = mount(`
      <div><div>Life Path</div><div>7</div></div>
      <div><span style="display:block">Lesson:</span><p>Guard the open door.</p></div>`);
    const s = collectSentences(root);
    expect(s.map((x) => x.text)).toEqual(["Life Path, 7", "Lesson: Guard the open door."]);
    expect(s[0].ranges).toHaveLength(2);
  });

  it("treats <br> and separate blocks as sentence ends", () => {
    const root = mount(`<p>First line<br>Second line</p><p>Next paragraph.</p>`);
    expect(collectSentences(root).map((x) => x.text)).toEqual(["First line", "Second line", "Next paragraph."]);
  });

  it("a source line break shown as a space doesn't split a name", () => {
    const root = mount(`<p>Born the same day as John D.\nRockefeller, you share his drive.</p>`);
    expect(collectSentences(root).map((x) => x.text)).toEqual(["Born the same day as John D. Rockefeller, you share his drive."]);
  });

  it("speaks numerology notation readably", () => {
    const root = mount(`<p>Your pair is 17/8 × 8/8 this year.</p>`);
    expect(collectSentences(root)[0].speech).toBe("Your pair is 17 slash 8 by 8 slash 8 this year.");
  });
});

describe("read-aloud: playback", () => {
  beforeEach(() => {
    readAloud.stop();
    spoken.length = 0;
  });

  it("reads one sentence at a time, in order, then stops", async () => {
    const root = mount(`<p>One. Two. Three.</p>`);
    readAloud.start("t", root);
    await tick();
    expect(spoken.map((u) => u.text)).toEqual(["One."]);
    expect(readAloud.getState()).toMatchObject({ status: "playing", index: 0, total: 3 });
    await finish();
    await finish();
    expect(spoken.map((u) => u.text)).toEqual(["One.", "Two.", "Three."]);
    await finish();
    expect(readAloud.getState().status).toBe("idle");
  });

  it("pause, resume, next and previous work on sentence boundaries", async () => {
    const root = mount(`<p>One. Two. Three.</p>`);
    readAloud.start("t", root);
    await tick();
    readAloud.next();
    await tick();
    expect(spoken.at(-1)!.text).toBe("Two.");
    readAloud.pause();
    expect(readAloud.getState().status).toBe("paused");
    // the cancelled utterance's late "end" must not advance
    spoken.at(-1)!.onend?.();
    await tick();
    expect(readAloud.getState().index).toBe(1);
    readAloud.resume();
    await tick();
    expect(spoken.at(-1)!.text).toBe("Two.");
    readAloud.prev();
    await tick();
    expect(spoken.at(-1)!.text).toBe("One.");
  });

  it("only one reader at a time: starting another stops the first", async () => {
    const root = mount(`<section id="a"><p>Alpha one. Alpha two.</p></section><section id="b"><p>Beta one.</p></section>`);
    readAloud.start("a", root.querySelector("#a") as HTMLElement);
    await tick();
    readAloud.start("b", root.querySelector("#b") as HTMLElement);
    await tick();
    expect(readAloud.getState()).toMatchObject({ owner: "b", total: 1 });
    expect(spoken.at(-1)!.text).toBe("Beta one.");
  });

  it("speaks a very long sentence in parts and highlights it once", async () => {
    const long = Array.from({ length: 20 }, (_, i) => `part ${i} of a long thought`).join(", ") + ".";
    const root = mount(`<p>${long} Next.</p>`);
    readAloud.start("t", root);
    await tick();
    const first = spoken.length;
    while (spoken.at(-1)!.text !== "Next.") await finish();
    const parts = spoken.slice(first - 1, -1).map((u) => u.text);
    expect(parts.length).toBeGreaterThan(1);
    expect(parts.join(" ")).toBe(long);
    expect(readAloud.getState().index).toBe(1);
  });

  it("keeps its place when the page changes mid-reading", async () => {
    const root = mount(`<p id="p1">One. Two.</p><div id="slot"></div><p>Four.</p>`);
    readAloud.start("t", root);
    await tick();
    await finish(); // now on "Two."
    root.querySelector("#slot")!.innerHTML = "<p>Three.</p>"; // an accordion opens
    await tick();
    await finish();
    expect(spoken.at(-1)!.text).toBe("Three.");
    await finish();
    expect(spoken.at(-1)!.text).toBe("Four.");
  });

  it("uses the voice, speed and pitch chosen in the voice menu", async () => {
    const { voiceSettings } = await import("@/lib/read-aloud/voice-settings");
    const voices = [
      { name: "English United States", lang: "en-US", voiceURI: "us", default: true, localService: true },
      { name: "English Kenya", lang: "en-KE", voiceURI: "ke", default: false, localService: true },
      { name: "Français", lang: "fr-FR", voiceURI: "fr", default: false, localService: true },
    ];
    Object.assign(synth, { getVoices: () => voices });
    voiceSettings.set({ deviceVoice: "ke", rate: 1.2, pitch: 1.3 });
    try {
      const root = mount(`<p>Habari. Karibu.</p>`);
      readAloud.start("t", root);
      await tick();
      const u = spoken.at(-1) as FakeUtterance & { voice?: { voiceURI: string }; pitch?: number };
      expect(u.voice?.voiceURI).toBe("ke");
      expect(u.pitch).toBe(1.3);
      expect(u.rate).toBeCloseTo(0.95 * 1.2);
      readAloud.stop();
      // a chosen English voice isn't forced onto another language
      readAloud.start("t", mount(`<p>Bonjour.</p>`), { lang: "fr-FR" });
      await tick();
      expect((spoken.at(-1) as unknown as { voice?: { voiceURI: string } }).voice?.voiceURI).toBe("fr");
    } finally {
      readAloud.stop();
      voiceSettings.set({ deviceVoice: null, rate: 1, pitch: 1 });
      Object.assign(synth, { getVoices: undefined });
    }
  });
});
