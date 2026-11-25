/**
 * Keeps the speech the voice has made, on the device (IndexedDB), so a
 * sentence is only ever made once: reading it again — on this visit or any
 * later one, even straight after the app opens, before the voice has started
 * — plays at once, the way a device voice does.
 *
 * Audio is kept as 16-bit samples (~44 KB per second of speech), up to
 * LIMIT_BYTES (about half an hour of speech); the least recently played
 * sentences make room for new ones. Where storage isn't available (private
 * mode, old browsers) everything still works; sentences are just made again.
 */
import type { Clip } from "./neural-voice";

const DB = "mc-voice-clips";
const PCM = "pcm";
const INFO = "info";
const LIMIT_BYTES = 80 * 1024 * 1024;

interface Info {
  key: string;
  bytes: number;
  used: number;
}

function req<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = tx.onabort = () => reject(tx.error);
  });
}

function toPcm(samples: Float32Array): Int16Array {
  const out = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    out[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
  }
  return out;
}

function fromPcm(pcm: Int16Array): Float32Array {
  const out = new Float32Array(pcm.length);
  for (let i = 0; i < pcm.length; i++) out[i] = pcm[i] / (pcm[i] < 0 ? 0x8000 : 0x7fff);
  return out;
}

class ClipStore {
  private db: IDBDatabase | null = null;
  /** What is stored: key → size and last use (loaded once, kept in step). */
  private index = new Map<string, Info>();
  /** Saved but not yet written (readable meanwhile). */
  private pending = new Map<string, Clip>();
  private opening: Promise<void> | null = null;
  private voice = "";
  private bytes = 0;

  /** Opens the store for this voice; speech made by other voices is deleted. */
  open(voice: string): Promise<void> {
    if (this.opening && this.voice === voice) return this.opening;
    this.voice = voice;
    this.opening = this.load(voice).catch(() => {
      this.db = null; // no storage: work without it
    });
    return this.opening;
  }

  private async load(voice: string) {
    if (typeof indexedDB === "undefined") return;
    const open = indexedDB.open(DB, 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      if (!db.objectStoreNames.contains(PCM)) db.createObjectStore(PCM);
      if (!db.objectStoreNames.contains(INFO)) db.createObjectStore(INFO, { keyPath: "key" });
    };
    const db = await req(open);
    const all = (await req(db.transaction(INFO).objectStore(INFO).getAll())) as Info[];
    const stale = all.filter((i) => !i.key.startsWith(`${voice}|`));
    this.index = new Map(all.filter((i) => i.key.startsWith(`${voice}|`)).map((i) => [i.key, i]));
    this.bytes = [...this.index.values()].reduce((a, i) => a + i.bytes, 0);
    this.db = db;
    if (stale.length) await this.remove(stale.map((i) => i.key));
    await this.prune();
  }

  /** Whether this sentence is kept (known at once; false until the store opens). */
  has(key: string): boolean {
    return this.pending.has(key) || this.index.has(key);
  }

  /** Open and usable (speech can be kept). */
  get ready(): boolean {
    return this.db !== null;
  }

  get size(): number {
    return this.index.size;
  }

  async get(key: string): Promise<Clip | null> {
    const p = this.pending.get(key);
    if (p) return p;
    const info = this.index.get(key);
    if (!this.db || !info) return null;
    try {
      const rec = (await req(this.db.transaction(PCM).objectStore(PCM).get(key))) as { sr: number; pcm: ArrayBuffer } | undefined;
      if (!rec) {
        this.index.delete(key);
        return null;
      }
      info.used = Date.now();
      try {
        this.db.transaction(INFO, "readwrite").objectStore(INFO).put(info);
      } catch {
        /* best effort */
      }
      return { samples: fromPcm(new Int16Array(rec.pcm)), sampleRate: rec.sr };
    } catch {
      return null;
    }
  }

  /** Keep a sentence (in the background; readable at once). */
  put(key: string, clip: Clip) {
    if (!this.db || this.index.has(key) || this.pending.has(key) || !key.startsWith(`${this.voice}|`)) return;
    this.pending.set(key, clip);
    void this.write(key, clip).finally(() => this.pending.delete(key));
  }

  private async write(key: string, clip: Clip) {
    const db = this.db;
    if (!db) return;
    try {
      const pcm = toPcm(clip.samples);
      const info: Info = { key, bytes: pcm.byteLength, used: Date.now() };
      const tx = db.transaction([PCM, INFO], "readwrite");
      tx.objectStore(PCM).put({ sr: clip.sampleRate, pcm: pcm.buffer }, key);
      tx.objectStore(INFO).put(info);
      await done(tx);
      this.index.set(key, info);
      this.bytes += info.bytes;
      if (this.bytes > LIMIT_BYTES) await this.prune();
    } catch {
      /* storage full or unavailable: it will just be made again */
    }
  }

  /** Least recently played first, until back under the limit. */
  private async prune() {
    if (this.bytes <= LIMIT_BYTES) return;
    const old = [...this.index.values()].sort((a, b) => a.used - b.used);
    const drop: string[] = [];
    let bytes = this.bytes;
    for (const i of old) {
      if (bytes <= LIMIT_BYTES * 0.9) break;
      drop.push(i.key);
      bytes -= i.bytes;
    }
    await this.remove(drop);
  }

  private async remove(keys: string[]) {
    const db = this.db;
    if (!db || !keys.length) return;
    try {
      const tx = db.transaction([PCM, INFO], "readwrite");
      for (const k of keys) {
        tx.objectStore(PCM).delete(k);
        tx.objectStore(INFO).delete(k);
      }
      await done(tx);
    } catch {
      /* best effort */
    }
    for (const k of keys) {
      const i = this.index.get(k);
      if (i) this.bytes -= i.bytes;
      this.index.delete(k);
    }
  }

  /** Tests: forget the open connection. */
  reset() {
    this.db?.close();
    this.db = null;
    this.opening = null;
    this.index.clear();
    this.pending.clear();
    this.bytes = 0;
  }
}

export const clipStore = new ClipStore();
