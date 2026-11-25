// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";

class FakeUtterance {
  text: string;
  voice: unknown = null;
  pitch = 1;
  rate = 1;
  lang = "";
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(t: string) {
    this.text = t;
  }
}
const spoken: FakeUtterance[] = [];
const voices = [
  { name: "English United States", lang: "en-US", voiceURI: "us", default: true, localService: true },
  { name: "English Nigeria", lang: "en-NG", voiceURI: "ng", default: false, localService: false },
];
Object.assign(globalThis, { SpeechSynthesisUtterance: FakeUtterance, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(window, "speechSynthesis", {
  value: { speaking: false, pending: false, paused: false, speak: (u: FakeUtterance) => spoken.push(u), cancel: vi.fn(), resume: vi.fn(), getVoices: () => voices, addEventListener: vi.fn(), removeEventListener: vi.fn() },
  configurable: true,
});

const { ReadAloudDock } = await import("@/components/read-aloud/read-aloud-dock");

describe("voice menu in the player", () => {
  it("lists the device's voices with speed and pitch, and picking one plays a sample", async () => {
    document.body.innerHTML = `<div id="app"></div><main><p>Some text.</p></main>`;
    const root = createRoot(document.getElementById("app")!);
    await act(async () => root.render(<ReadAloudDock />));
    const toggle = document.querySelector<HTMLButtonElement>("[data-voice-toggle]")!;
    expect(toggle).toBeTruthy();
    await act(async () => toggle.click());
    const menu = document.querySelector('[role="dialog"][aria-label="Choose a voice"]')!;
    expect(menu).toBeTruthy();
    const text = menu.textContent!;
    expect(text).toContain("Automatic");
    expect(text).toContain("English Nigeria");
    expect(text).toContain("English (Nigeria) · needs internet");
    expect(text).toContain("Speed");
    expect(text).toContain("Pitch");
    // no natural voices in this environment (no Web Audio / workers)
    expect(text).not.toContain("Heart");

    const ng = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="radio"]')).find((b) => b.textContent!.includes("Nigeria"))!;
    await act(async () => ng.click());
    expect(ng.getAttribute("aria-checked")).toBe("true");
    expect((spoken.at(-1)!.voice as { voiceURI: string }).voiceURI).toBe("ng");
    expect(JSON.parse(localStorage.getItem("mc-voice-settings")!).deviceVoice).toBe("ng");
    await act(async () => root.unmount());
  });
});
