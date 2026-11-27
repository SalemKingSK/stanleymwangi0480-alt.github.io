// @vitest-environment happy-dom
/** The app-wide Focus Date: every "today / this year" reading follows it. */
import { describe, it, expect, vi, afterEach } from "vitest";
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";

vi.mock("framer-motion", () => ({
  motion: new Proxy({}, { get: () => (p: { children?: React.ReactNode }) => React.createElement("div", null, p.children) }),
  AnimatePresence: (p: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, p.children),
}));

import { appNow, getFocusDay, setFocusDay, shiftFocus, isFocused } from "@/lib/time/focus";
import { currentPersonalYear } from "@/lib/curriculum/catalogue";
import { computePersonalYearNumber } from "@/lib/numerology/personal-year-full";
import { personalNumbers } from "@/components/profile-generator/today-card";

const TODAY = new Date(2026, 10, 20, 9, 30);

describe("Focus Date", () => {
  afterEach(() => {
    setFocusDay(null);
    vi.useRealTimers();
  });

  it("defaults to today and moves the whole app's 'now'", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(TODAY);
    expect(isFocused()).toBe(false);
    expect(appNow().getFullYear()).toBe(2026);
    setFocusDay({ year: 2030, month: 3, day: 14 });
    expect(getFocusDay()).toEqual({ year: 2030, month: 3, day: 14 });
    const d = appNow();
    expect([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours()]).toEqual([2030, 3, 14, 9]);
    // Readings that use "this year" follow it.
    expect(currentPersonalYear(12, 9)).toBe(computePersonalYearNumber(12, 9, 2030));
    expect(personalNumbers(12, 9).personalDay).toBe(personalNumbers(12, 9, new Date(2030, 2, 14)).personalDay);
    shiftFocus({ days: 1 });
    expect(appNow().getDate()).toBe(15);
    shiftFocus({ years: -5 });
    expect(appNow().getFullYear()).toBe(2025);
    // Choosing today's date is the same as going back to today.
    setFocusDay({ year: 2026, month: 11, day: 20 });
    expect(isFocused()).toBe(false);
  });

  it("re-reads the alerts for the chosen day", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(TODAY);
    const { generateAlerts } = await import("@/components/profile-generator/results-display");
    const numerology = { birthDay: 12, birthMonth: 9, birthYear: 1981, numberCounts: { "8": 1 } };
    const ids = () => generateAlerts(numerology as never).map((a) => `${a.id}:${a.title}`).join("|");
    const today = ids();
    // The year-in-the-elements verdict is gone from the alerts.
    expect(today).not.toContain("element-year");
    setFocusDay({ year: 2031, month: 9, day: 12 });
    expect(ids()).not.toBe(today);
  });

  it("has a bar that steps by day and year and returns to today", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(TODAY);
    const { FocusDateBar } = await import("@/components/time/focus-date-bar");
    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = createRoot(div);
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    await act(async () => root.render(<FocusDateBar />));
    const bar = () => div.querySelector<HTMLElement>("[data-focus-date]")!;
    expect(bar().dataset.focusDate).toBe("today");
    expect(bar().querySelector("input")!.value).toBe("2026-11-20");
    await act(async () => bar().querySelector<HTMLButtonElement>("[aria-label='Forward one year']")!.click());
    expect(bar().dataset.focusDate).toBe("2027-11-20");
    expect(bar().textContent).toContain("Looking ahead");
    await act(async () => bar().querySelector<HTMLButtonElement>("[aria-label='Back one day']")!.click());
    expect(bar().dataset.focusDate).toBe("2027-11-19");
    expect(bar().querySelector("input")!.value).toBe("2027-11-19");
    await act(async () => Array.from(bar().querySelectorAll("button")).find((b) => b.textContent === "Today")!.click());
    expect(bar().dataset.focusDate).toBe("today");
    await act(async () => root.unmount());
  });
});
