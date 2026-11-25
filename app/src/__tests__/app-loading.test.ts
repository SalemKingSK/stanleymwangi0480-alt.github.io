// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { fake, installFakeVoice, tick } from "./helpers/fake-voice";

installFakeVoice();
// Cache Storage, empty: a first-ever open, nothing downloaded before.
Object.assign(globalThis, {
  caches: {
    open: async () => ({ match: async () => undefined, keys: async () => [], delete: async () => true }),
    delete: async () => true,
  },
});
const { neuralVoice } = await import("@/lib/read-aloud/neural-voice");
const appLoading = await import("@/lib/app-loading");

describe("the reading comes first", () => {
  it("never competes with the reading's download: the voice's first download waits for it", async () => {
    (neuralVoice as unknown as { ctx: unknown }).ctx = null;
    appLoading.resetAppLoading(); // the reading's code hasn't arrived yet
    let arrive!: () => void;
    const reading = appLoading.whileLoading(() => new Promise<void>((r) => (arrive = r)));
    await neuralVoice.warmUp();
    expect(neuralVoice.getState().status).toBe("idle"); // nothing fetched alongside it
    expect(fake.workers).toHaveLength(0);
    appLoading.noteReadingCodeReady();
    arrive();
    await reading;
    await neuralVoice.warmUp();
    await tick(50);
    expect(neuralVoice.getState().status).toBe("ready");
  });

});
