/**
 * Keeps the user's books on this device only (IndexedDB): the handbook and the
 * "Chinese Zodiacs" book. A small localStorage marker per book lets the app
 * know synchronously which are loaded (the Curriculum uses it to show or hide
 * their fields).
 */
import * as React from "react";
import type { Handbook } from "./types";
import type { Zodiacs } from "./zodiacs";

const DB = "mc-handbook";
const STORE = "book";
/** IndexedDB keys and localStorage markers per book. */
const SLOTS = {
  handbook: { key: "current", mark: "mc-handbook-v1" },
  zodiacs: { key: "zodiacs", mark: "mc-zodiacs-v1" },
} as const;
export type BookKind = keyof typeof SLOTS;

export type HandbookStatus = "idle" | "loading" | "ready" | "none" | "error";

interface State {
  status: HandbookStatus;
  /** The handbook ("The Handbook of Chinese Horoscopes"). */
  book: Handbook | null;
  /** The "Chinese Zodiacs" book. */
  zodiacs: Zodiacs | null;
  progress?: { page: number; total: number };
  error?: string;
}

let state: State = { status: "idle", book: null, zodiacs: null };
const listeners = new Set<() => void>();
function set(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(new Error("This browser can't store files on the device."));
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Could not open device storage."));
  });
}

async function tx<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const t = db.transaction(STORE, mode);
      const req = run(t.objectStore(STORE));
      t.oncomplete = () => resolve(req.result);
      t.onerror = () => reject(t.error ?? req.error);
      t.onabort = () => reject(t.error ?? new Error("Storage was interrupted."));
    });
  } finally {
    db.close();
  }
}

function marked(kind: BookKind): boolean {
  try {
    return typeof localStorage !== "undefined" && !!localStorage.getItem(SLOTS[kind].mark);
  } catch {
    return false;
  }
}

/** True when the handbook was loaded on this device (no I/O). */
export function hasHandbook(): boolean {
  return marked("handbook");
}
/** True when the "Chinese Zodiacs" book was loaded on this device (no I/O). */
export function hasZodiacs(): boolean {
  return marked("zodiacs");
}

function mark(kind: BookKind, meta: object | null) {
  try {
    if (meta) localStorage.setItem(SLOTS[kind].mark, JSON.stringify(meta));
    else localStorage.removeItem(SLOTS[kind].mark);
  } catch { /* private mode */ }
}

let opening: Promise<void> | null = null;
/** Reads the stored books once per session. */
export function ensureHandbook(): Promise<void> {
  if (state.status === "ready" || state.status === "loading" || state.status === "none") return opening ?? Promise.resolve();
  if (!hasHandbook() && !hasZodiacs()) {
    set({ status: "none" });
    return Promise.resolve();
  }
  if (!opening) {
    const read = async <T,>(kind: BookKind, ok: (b: T | undefined) => boolean): Promise<T | null> => {
      if (!marked(kind)) return null;
      try {
        const b = await tx<T | undefined>("readonly", (s) => s.get(SLOTS[kind].key) as IDBRequest<T | undefined>);
        if (ok(b)) return b as T;
      } catch { /* fall through */ }
      mark(kind, null);
      return null;
    };
    opening = Promise.all([
      read<Handbook>("handbook", (b) => !!b && b.v === 1),
      read<Zodiacs>("zodiacs", (b) => !!b && b.v === 1 && b.kind === "zodiacs"),
    ])
      .then(([book, zodiacs]) => set({ status: book || zodiacs ? "ready" : "none", book, zodiacs }))
      .finally(() => { opening = null; });
  }
  return opening;
}

export interface LoadResult {
  kind: BookKind;
  message: string;
}

/**
 * Reads a PDF the user picked, works out which of the two books it is, splits
 * it and stores it. Returns which book it was and what was found.
 */
export async function loadBookFile(file: File): Promise<LoadResult> {
  const prevStatus = state.status;
  set({ status: "loading", progress: { page: 0, total: 0 }, error: undefined });
  try {
    const [{ extractPdfLines }, parse, zg] = await Promise.all([import("./extract"), import("./parse"), import("./zodiacs")]);
    const { lines, pages } = await extractPdfLines(await file.arrayBuffer(), (page, total) => set({ progress: { page, total } }));
    if (zg.looksLikeZodiacs(lines)) {
      const z = zg.parseZodiacs(lines, { file: file.name, pages });
      const s = zg.zodiacsSummary(z);
      if (!s.chapters) throw new Error("No animal chapters were found in this PDF.");
      await tx("readwrite", (st) => st.put(z, SLOTS.zodiacs.key));
      mark("zodiacs", z.meta);
      set({ status: "ready", zodiacs: z, progress: undefined });
      return { kind: "zodiacs", message: `Loaded "Chinese Zodiacs": ${s.chapters} animal chapters and ${s.foundations} foundation sections. They now appear in every Animal Oracle.` };
    }
    const book = parse.parseHandbook(lines, { file: file.name, pages });
    const s = parse.handbookSummary(book);
    if (!s.chapters) throw new Error("No animal chapters were found in this PDF. Pick the full book PDF (the one with selectable text).");
    await tx("readwrite", (st) => st.put(book, SLOTS.handbook.key));
    mark("handbook", book.meta);
    set({ status: "ready", book, progress: undefined });
    return { kind: "handbook", message: `Loaded the Handbook: ${s.chapters} animal chapters and ${s.pairs} relationship pairings. They now appear in every Animal Oracle.` };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    set({ status: state.book || state.zodiacs ? "ready" : prevStatus === "loading" ? "none" : "error", error: message, progress: undefined });
    throw e;
  }
}

/** Kept for older callers: loads the file whichever book it is. */
export async function loadHandbookFile(file: File): Promise<LoadResult> {
  return loadBookFile(file);
}

export async function removeBook(kind: BookKind): Promise<void> {
  try { await tx("readwrite", (s) => s.delete(SLOTS[kind].key)); } catch { /* already gone */ }
  mark(kind, null);
  const next = { ...state, [kind === "handbook" ? "book" : "zodiacs"]: null } as State;
  set({ book: next.book, zodiacs: next.zodiacs, status: next.book || next.zodiacs ? "ready" : "none", error: undefined });
}

export async function removeHandbook(): Promise<void> {
  return removeBook("handbook");
}

/** For tests. */
export function __setHandbookForTest(book: Handbook | null) {
  mark("handbook", book ? book.meta : null);
  set({ book, status: book || state.zodiacs ? "ready" : "none", error: undefined, progress: undefined });
}
export function __setZodiacsForTest(z: Zodiacs | null) {
  mark("zodiacs", z ? z.meta : null);
  set({ zodiacs: z, status: z || state.book ? "ready" : "none", error: undefined, progress: undefined });
}

export function useHandbook(): State {
  const snap = React.useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
    () => state,
  );
  React.useEffect(() => { void ensureHandbook(); }, []);
  return snap;
}
