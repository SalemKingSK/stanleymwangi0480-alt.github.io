// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { fake, installFakeVoice, tick } from "./helpers/fake-voice";

installFakeVoice();
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const { ReadAloudDock } = await import("@/components/read-aloud/read-aloud-dock");
const { NEURAL_VOICE } = await import("@/lib/read-aloud/neural-voice");

async function openMenu() {
  document.body.innerHTML = `<div id="app"></div><main><p>Some text.</p></main>`;
  const root = createRoot(document.getElementById("app")!);
  await act(async () => root.render(<ReadAloudDock />));
  await act(async () => document.querySelector<HTMLButtonElement>("[data-voice-toggle]")!.click());
  return { root, menu: document.querySelector('[role="dialog"][aria-label="Voice and speed"]')! };
}

describe("voice menu in the player", () => {
  it("shows the app's one voice, credited as Jenny (Dioco), and the speed — no voice list, device voices or pitch", async () => {
    const { root, menu } = await openMenu();
    const text = menu.textContent!;
    expect(text).toContain("Jenny (Dioco)");
    expect(text).toContain("Speed");
    expect(menu.querySelectorAll('[role="radio"]')).toHaveLength(0);
    expect(text).not.toMatch(/Lessac|Amy|Ryan|Automatic|device's voices|Pitch|MB download/);

    const slider = menu.querySelector<HTMLInputElement>('input[type="range"]')!;
    await act(async () => {
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      set.call(slider, "1.3");
      slider.dispatchEvent(new Event("input", { bubbles: true }));
      slider.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await act(async () => tick(600)); // the sample plays once the slider settles
    expect(JSON.parse(localStorage.getItem("mc-voice-settings")!)).toEqual({ rate: 1.3 });
    expect(fake.worker!.sent.some((m) => m.type === "generate" && m.voice === NEURAL_VOICE && m.speed === 1.3)).toBe(true); // a sample at the new speed
    expect(fake.speechSpy.speak).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  });

  it("an older saved voice choice is dropped; the speed is kept", async () => {
    localStorage.setItem("mc-voice-settings", JSON.stringify({ naturalVoice: "en_US-lessac-medium", rate: 1.1 }));
    const { voiceSettings } = await import("@/lib/read-aloud/voice-settings");
    voiceSettings.reset();
    expect(voiceSettings.get()).toEqual({ rate: 1.1 });
  });
});
