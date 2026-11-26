/**
 * Moving between the Curriculum and the readings: "open this case study and
 * take me to that field". The Curriculum asks; the profile generator loads
 * the birthday; the results screen switches tab, scrolls to the section and
 * shows a study banner until the unit has been heard.
 */
import type { BirthInput } from "./chart";

export interface StudyTarget {
  field: string;
  variant?: string;
  /** Birthday the target should be studied on; omitted = the open reading. */
  subject?: BirthInput;
  /** Start reading the passage aloud once it is found (default true). */
  play?: boolean;
  /** Set when the request was made (so stale ones can be ignored). */
  at: number;
}

let subject: BirthInput | null = null;
let pending: StudyTarget | null = null;
let banner: StudyTarget | null = null;
const openers = new Set<(input: BirthInput) => void>();
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((fn) => fn());

export function sameBirth(a: BirthInput | null | undefined, b: BirthInput | null | undefined): boolean {
  return !!a && !!b && a.day === b.day && a.month === b.month && a.year === b.year && a.name.trim() === b.name.trim();
}

export const studyNav = {
  /** The reading currently on screen (set by the results screen). */
  setSubject(s: BirthInput | null) {
    subject = s;
    emit();
  },
  getSubject(): BirthInput | null {
    return subject;
  },

  /** Ask to study a unit; loads the case-study birthday first if needed. */
  request(target: Omit<StudyTarget, "at">) {
    pending = { ...target, at: Date.now() };
    banner = pending;
    if (target.subject && !sameBirth(target.subject, subject)) openers.forEach((fn) => fn(target.subject!));
    emit();
  },

  /** The results screen takes a request once its reading matches. */
  take(): StudyTarget | null {
    if (!pending) return null;
    if (pending.subject && !sameBirth(pending.subject, subject)) return null;
    const t = pending;
    pending = null;
    return t;
  },

  hasPending(): boolean {
    return !!pending;
  },

  getBanner(): StudyTarget | null {
    return banner;
  },
  clearBanner() {
    banner = null;
    emit();
  },

  /** The profile generator registers how to load a birthday. */
  onOpen(fn: (input: BirthInput) => void): () => void {
    openers.add(fn);
    return () => {
      openers.delete(fn);
    };
  },

  subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
