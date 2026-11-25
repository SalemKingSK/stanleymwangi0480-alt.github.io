// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";

// An old page whose files have been replaced: loading the reading's code fails.
// It must switch to the newest version and reload — never hang on
// "Unfolding your reading…".
const reload = vi.fn();
Object.defineProperty(window, "location", { value: { ...window.location, reload }, configurable: true });

const { recoverFromMissingCode } = await import("@/lib/sw-update");

describe("an older page whose code is gone", () => {
  beforeEach(() => {
    reload.mockClear();
    sessionStorage.clear();
    Object.defineProperty(navigator, "onLine", { value: true, configurable: true });
  });

  it("reloads into the newest version", async () => {
    expect(await recoverFromMissingCode()).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("only once a minute, so a real outage can't loop", async () => {
    await recoverFromMissingCode();
    expect(await recoverFromMissingCode()).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("offline, it keeps the page (nothing is missing; the connection is)", async () => {
    Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
    expect(await recoverFromMissingCode()).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});
