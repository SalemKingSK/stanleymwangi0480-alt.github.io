/**
 * Marks Curriculum fields studied from read-aloud.
 *
 * Every sentence the voice finishes is matched to the tagged passage
 * ([data-study-field]) it belongs to. Once a passage has been heard to its
 * end — its last sentence and at least 85% of all its sentences, so skipping
 * through doesn't count — one study is credited to that field/variant/part
 * in the Syllabus Scheme, and the passage starts counting afresh for the next
 * full listen. Works for the per-field Listen buttons and the global reader.
 */
import { collectSentences, readAloud, type TtsSentence } from "@/lib/read-aloud/engine";
import { syllabus } from "./store";
import { studyNav } from "./navigation";

export const COMPLETE_SHARE = 0.85;

export interface StudiedEvent {
  field: string;
  variant: string;
  part: string;
  /** The part's listen count after this one. */
  count: number;
  who?: string;
}

/**
 * Heard sentences per unit part ("field|variant|part"). Keyed by the unit, not the
 * element, so it survives sections closing and re-opening, and adds up across the
 * separate Listen buttons inside one study block. Cleared when the part is credited.
 */
const progress = new Map<string, Set<string>>();
const studiedListeners = new Set<(e: StudiedEvent) => void>();
let unsubscribe: (() => void) | null = null;

function scopeOf(sentence: TtsSentence): HTMLElement | null {
  const node = sentence.ranges[0]?.startContainer;
  const el = node ? (node.nodeType === 1 ? (node as Element) : node.parentElement) : (sentence.blocks[0] ?? null);
  return el?.closest<HTMLElement>("[data-study-field]") ?? null;
}

/** The sentences a tagged passage owns (not those of tagged passages nested in it). */
export function ownSentences(scope: HTMLElement): string[] {
  return collectSentences(scope)
    .filter((s) => scopeOf(s) === scope)
    .map((s) => s.text);
}

/** Forget partial listens (tests, reset). */
export function resetTrackerProgress() {
  progress.clear();
}

/** Feed one heard sentence; returns the credit when it completes a passage. */
export function noteSpoken(sentence: TtsSentence): StudiedEvent | null {
  const scope = scopeOf(sentence);
  if (!scope) return null;
  const field = scope.dataset.studyField;
  if (!field) return null;
  const variant = scope.dataset.studyVariant || "Practice";
  const part = scope.dataset.studyPart || "main";
  const key = `${field}|${variant}|${part}`;
  let heard = progress.get(key);
  if (!heard) progress.set(key, (heard = new Set()));
  heard.add(sentence.text);
  // What the passage shows now (sections inside a block may have been opened since).
  const texts = ownSentences(scope);
  if (!texts.length) return null;
  const needed = Math.max(1, Math.ceil(texts.length * COMPLETE_SHARE));
  const heardCount = texts.filter((t) => heard!.has(t)).length;
  if (!(heard.has(texts[texts.length - 1]) && heardCount >= needed)) return null;
  progress.delete(key);
  const who = studyNav.getSubject()?.name;
  const count = syllabus.credit(field, variant, part, who);
  const event: StudiedEvent = { field, variant, part, count, ...(who ? { who } : {}) };
  studiedListeners.forEach((fn) => {
    try {
      fn(event);
    } catch {
      /* ignore */
    }
  });
  return event;
}

/** Start listening to read-aloud (safe to call more than once). */
export function startCurriculumTracker() {
  if (unsubscribe) return;
  unsubscribe = readAloud.onSpoken((s) => {
    noteSpoken(s);
  });
}

export function onStudied(fn: (e: StudiedEvent) => void): () => void {
  studiedListeners.add(fn);
  return () => {
    studiedListeners.delete(fn);
  };
}
