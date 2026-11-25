// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { fake, installFakeVoice, tick } from "./helpers/fake-voice";

installFakeVoice();
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
Object.assign(navigator, { gpu: {} }); // the browser offers WebGPU
const { ReadAloudDock } = await import("@/components/read-aloud/read-aloud-dock");
const { neuralVoice } = await import("@/lib/read-aloud/neural-voice");

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
    for (const name of ["Heart", "Bella", "Michael", "Emma", "George"]) expect(text).toContain(name);
    expect(text).toContain("Speed");
    expect(text).not.toMatch(/Automatic|device's voices|Pitch/);
    expect(text).toMatch(/One-time (92|325) MB download/);

    const bella = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="radio"]')).find((b) => b.textContent!.startsWith("Bella"))!;
    await act(async () => bella.click());
    expect(bella.getAttribute("aria-checked")).toBe("true");
    expect(JSON.parse(localStorage.getItem("mc-voice-settings")!).naturalVoice).toBe("af_bella");
    await act(async () => tick());
    expect(fake.worker!.sent.some((m) => m.type === "generate" && m.voice === "af_bella")).toBe(true); // a sample in Bella's voice
    expect(fake.speechSpy.speak).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  });

  it("on a slow device it explains the pauses and offers the faster mode", async () => {
    fake.rtf = 3.4;
    await act(async () => (neuralVoice as unknown as { start(d: string): Promise<void> }).start("wasm"));
    const { root, menu } = await openMenu();
    expect(menu.textContent).toContain("about 3.4× slower");
    const gpu = Array.from(menu.querySelectorAll("button")).find((b) => b.textContent!.includes("faster mode"))!;
    expect(gpu).toBeTruthy();
    fake.rtf = 0.3;
    await act(async () => gpu.click());
    await act(async () => tick());
    expect(fake.worker!.sent[0]).toMatchObject({ type: "load", device: "webgpu" });
    expect(menu.textContent).toContain("graphics chip");
    await act(async () => root.unmount());
  });
});
