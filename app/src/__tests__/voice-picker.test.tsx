// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { fake, installFakeVoice, tick } from "./helpers/fake-voice";

installFakeVoice();
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const { ReadAloudDock } = await import("@/components/read-aloud/read-aloud-dock");

async function openMenu() {
  document.body.innerHTML = `<div id="app"></div><main><p>Some text.</p></main>`;
  const root = createRoot(document.getElementById("app")!);
  await act(async () => root.render(<ReadAloudDock />));
  await act(async () => document.querySelector<HTMLButtonElement>("[data-voice-toggle]")!.click());
  return { root, menu: document.querySelector('[role="dialog"][aria-label="Choose a voice"]')! };
}

describe("voice menu in the player", () => {
  it("offers only the natural voices and speed — no device voices or pitch", async () => {
    const { root, menu } = await openMenu();
    const text = menu.textContent!;
    for (const name of ["Lessac", "Amy", "Jenny", "Ryan", "Alan"]) expect(text).toContain(name);
    expect(text).toContain("Speed");
    expect(text).not.toMatch(/Automatic|device's voices|Pitch/);
    expect(text).toContain("One-time 63 MB download per voice");
    expect(text).not.toMatch(/graphics|faster mode|slower than/);

    const jenny = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="radio"]')).find((b) => b.textContent!.startsWith("Jenny"))!;
    expect(jenny.textContent).toContain("British female");
    await act(async () => jenny.click());
    expect(jenny.getAttribute("aria-checked")).toBe("true");
    expect(JSON.parse(localStorage.getItem("mc-voice-settings")!).naturalVoice).toBe("en_GB-jenny_dioco-medium");
    await act(async () => tick());
    expect(fake.worker!.sent.some((m) => m.type === "generate" && m.voice === "en_GB-jenny_dioco-medium")).toBe(true); // a sample in Jenny's voice
    expect(fake.speechSpy.speak).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  });

  it("an old Kokoro voice setting falls back to the default Piper voice", async () => {
    localStorage.setItem("mc-voice-settings", JSON.stringify({ naturalVoice: "af_heart", rate: 1.1 }));
    const { voiceSettings } = await import("@/lib/read-aloud/voice-settings");
    voiceSettings.reset();
    expect(voiceSettings.get()).toEqual({ naturalVoice: "en_US-lessac-medium", rate: 1.1 });
  });
});
