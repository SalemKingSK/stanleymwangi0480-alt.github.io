/**
 * Keeps the parsed handbook on this device only (IndexedDB), with a small
 * localStorage marker so the app knows synchronously whether a book is loaded
 * (the Curriculum uses it to show or hide the handbook fields).
 */
import * as React from "react";
import type { Handbook } from "./types";

const DB = "mc-handbook";
const STORE = "book";
const KEY = "current";
const MARK = "mc-handbook-v1";

export type HandbookStatus = "idle" | "loading" | "ready" | "none" | "error";

interface State {
  status: HandbookStatus;
  book: Handbook | null;
  progress?: { page: number; total: number };
  error?: string;
}

let state: State = { status: "idle", book: null };
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

/** True when a handbook was loaded on this device (no I/O). */
export function hasHandbook(): boolean {
  try {
    return typeof localStorage !== "undefined" && !!localStorage.getItem(MARK);
  } catch {
    return false;
  }
}

function mark(book: Handbook | null) {
  try {
    if (book) localStorage.setItem(MARK, JSON.stringify(book.meta));
    else localStorage.removeItem(MARK);
  } catch { /* private mode */ }
}

let opening: Promise<void> | null = null;
/** Reads the stored book once per session. */
export function ensureHandbook(): Promise<void> {
  if (state.status === "ready" || state.status === "loading") return Promise.resolve();
  if (!hasHandbook()) {
    if (state.status === "idle") set({ status: "none" });
    return Promise.resolve();
  }
  if (!opening) {
    opening = tx<Handbook | undefined>("readonly", (s) => s.get(KEY) as IDBRequest<Handbook | undefined>)
      .then((book) => {
        if (book && book.v === 1) set({ status: "ready", book });
        else { mark(null); set({ status: "none", book: null }); }
      })
      .catch(() => set({ status: "none", book: null }))
      .finally(() => { opening = null; });
  }
  return opening;
}

/** Reads the user's PDF, splits it and stores it. Returns what was found. */
export async function loadHandbookFile(file: File): Promise<Handbook> {
  set({ status: "loading", progress: { page: 0, total: 0 }, error: undefined });
  try {
    const [{ extractPdfLines }, { parseHandbook, handbookSummary }] = await Promise.all([import("./extract"), import("./parse")]);
    const { lines, pages } = await extractPdfLines(await file.arrayBuffer(), (page, total) => set({ progress: { page, total } }));
    const book = parseHandbook(lines, { file: file.name, pages });
    const sum = handbookSummary(book);
    if (!sum.chapters) throw new Error("No animal chapters were found in this PDF. Pick the full handbook PDF (the one with selectable text).");
    await tx("readwrite", (s) => s.put(book, KEY));
    mark(book);
    set({ status: "ready", book, progress: undefined });
    return book;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    set({ status: state.book ? "ready" : "error", error: message, progress: undefined });
    throw e;
  }
}

export async function removeHandbook(): Promise<void> {
  try { await tx("readwrite", (s) => s.delete(KEY)); } catch { /* already gone */ }
  mark(null);
  set({ status: "none", book: null, error: undefined });
}

/** For tests. */
export function __setHandbookForTest(book: Handbook | null) {
  mark(book);
  set({ status: book ? "ready" : "none", book, error: undefined, progress: undefined });
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
