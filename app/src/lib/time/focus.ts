/**
 * The Focus Date: the day the whole app reads "today" as.
 *
 * Every reading that depends on the current date — personal years, months and
 * days, the alerts, the Chinese year, the Temporal Trajectory, the Fate Map,
 * the Foundations verdict… — asks `appNow()` instead of `new Date()`. By
 * default that is simply now; choosing another day in the Focus Date bar makes
 * the whole app read as if it were that day (the clock time stays real).
 * It is kept for the session only: reopening the app starts from today again.
 */
import * as React from "react";

export interface FocusDay { year: number; month: number; day: number }

let focus: FocusDay | null = null;
const listeners = new Set<() => void>();

const sameDay = (a: FocusDay, d: Date) => a.year === d.getFullYear() && a.month === d.getMonth() + 1 && a.day === d.getDate();

/** "Now", as the app reads it: the Focus Date (at the real time of day) or the real now. */
export function appNow(): Date {
  const real = new Date();
  if (!focus) return real;
  const d = new Date(real);
  d.setFullYear(focus.year, focus.month - 1, focus.day);
  return d;
}

/** The chosen day, or null when the app reads today. */
export function getFocusDay(): FocusDay | null {
  return focus;
}

export function isFocused(): boolean {
  return focus !== null;
}

/** Choose the day the app reads as today (null, or today's date, goes back to today). */
export function setFocusDay(day: FocusDay | null): void {
  const next = day && !sameDay(day, new Date()) ? { ...day } : null;
  if (JSON.stringify(next) === JSON.stringify(focus)) return;
  focus = next;
  listeners.forEach((l) => l());
}

/** Move the Focus Date by a number of days, months or years. */
export function shiftFocus(by: { days?: number; months?: number; years?: number }): void {
  const d = appNow();
  if (by.years) d.setFullYear(d.getFullYear() + by.years);
  if (by.months) d.setMonth(d.getMonth() + by.months);
  if (by.days) d.setDate(d.getDate() + by.days);
  setFocusDay({ year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() });
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
const snapshot = () => (focus ? `${focus.year}-${String(focus.month).padStart(2, "0")}-${String(focus.day).padStart(2, "0")}` : "");

/** "YYYY-MM-DD" of the Focus Date ("" for today); re-renders when it changes. */
export function useFocusKey(): string {
  return React.useSyncExternalStore(subscribe, snapshot, snapshot);
}
