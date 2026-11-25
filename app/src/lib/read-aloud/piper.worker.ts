/// <reference lib="webworker" />
/**
 * Runs a Piper neural voice (VITS, ONNX) off the main thread.
 *
 * Messages in:  { type: "load", voice, model, config, size }
 *               { type: "generate", id, text, voice, speed }
 * Messages out: { type: "progress", voice, loaded, total }  |  { type: "ready", voice, rtf }
 *               { type: "audio", id, audio, sampleRate }  |  { type: "error", id?, voice?, message }
 *
 * Each voice is one ~63 MB file, downloaded once and kept in Cache Storage
 * ("mc-piper-voices"), so after the first use it works offline. Piper makes
 * a whole sentence in one pass, several times faster than it is spoken even
 * on a phone processor, which is why the reading flows without waits.
 * Messages are handled one at a time, in order.
 */
import * as ort from "onnxruntime-web/wasm";
import { phonemize } from "phonemizer";
// The ONNX runtime's processor engine and its loader, served from our own
// origin (not a CDN) so they work offline.
import ortWasmUrl from "../../../node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm?url";
import ortMjsUrl from "../../../node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.mjs?url";
import { splitClauses, phonemesToIds, finishAudio, type PiperConfig } from "./piper-text";

type InMsg =
  | { type: "load"; voice: string; model: string; config: string; size?: number }
  | { type: "generate"; id: number; text: string; voice: string; speed: number };

interface Loaded {
  voice: string;
  session: ort.InferenceSession;
  cfg: PiperConfig;
}

const CACHE = "mc-piper-voices";
const ctx = self as unknown as DedicatedWorkerGlobalScope;

ort.env.wasm.wasmPaths = {
  wasm: new URL(ortWasmUrl, ctx.location.href).href,
  mjs: new URL(ortMjsUrl, ctx.location.href).href,
};
ort.env.wasm.numThreads = 1; // one worker = one core; the page runs a second worker for more

let current: Loaded | null = null;

async function download(url: string, size: number, onProgress?: (loaded: number, total: number) => void): Promise<ArrayBuffer> {
  let cache: Cache | null = null;
  try {
    cache = await caches.open(CACHE);
    const hit = await cache.match(url);
    if (hit) return await hit.arrayBuffer();
  } catch {
    cache = null; // storage unavailable (private mode): just download
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed (${res.status})`);
  const total = Number(res.headers.get("content-length")) || size;
  let buf: ArrayBuffer;
  if (res.body && onProgress) {
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let loaded = 0;
    let last = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      const now = Date.now();
      if (now - last > 150) {
        last = now;
        onProgress(loaded, Math.max(total, loaded));
      }
    }
    const bytes = new Uint8Array(loaded);
    let at = 0;
    for (const c of chunks) {
      bytes.set(c, at);
      at += c.length;
    }
    buf = bytes.buffer;
  } else {
    buf = await res.arrayBuffer();
  }
  if (cache) await cache.put(url, new Response(buf)).catch(() => {});
  return buf;
}

async function speak(v: Loaded, text: string, speed: number): Promise<Float32Array> {
  const sr = v.cfg.audio.sample_rate;
  const phonemes: string[] = [];
  for (const clause of splitClauses(text)) {
    const ph = (await phonemize(clause.text, v.cfg.espeak.voice)).join(" ").trim();
    if (ph) phonemes.push(ph + clause.punct);
  }
  if (!phonemes.length) return new Float32Array(Math.round(sr * 0.1));
  const ids = phonemesToIds(phonemes.join(" "), v.cfg.phoneme_id_map);
  const inf = v.cfg.inference;
  const feeds: Record<string, ort.Tensor> = {
    input: new ort.Tensor("int64", BigInt64Array.from(ids, (n) => BigInt(n)), [1, ids.length]),
    input_lengths: new ort.Tensor("int64", BigInt64Array.from([BigInt(ids.length)]), [1]),
    scales: new ort.Tensor("float32", Float32Array.from([inf.noise_scale, inf.length_scale / Math.max(0.3, speed), inf.noise_w]), [3]),
  };
  if ((v.cfg.num_speakers ?? 1) > 1) feeds.sid = new ort.Tensor("int64", BigInt64Array.from([0n]), [1]);
  const out = await v.session.run(feeds);
  const wav = out.output.data as Float32Array;
  return finishAudio(wav, sr, text);
}

async function load(msg: Extract<InMsg, { type: "load" }>) {
  if (current?.voice === msg.voice) {
    ctx.postMessage({ type: "ready", voice: msg.voice, rtf: 0 });
    return;
  }
  const config = JSON.parse(new TextDecoder().decode(await download(msg.config, 6000))) as PiperConfig;
  const model = await download(msg.model, msg.size ?? 63_201_294, (loaded, total) => ctx.postMessage({ type: "progress", voice: msg.voice, loaded, total }));
  const session = await ort.InferenceSession.create(new Uint8Array(model), { executionProviders: ["wasm"], graphOptimizationLevel: "all" });
  const old = current;
  current = { voice: msg.voice, session, cfg: config };
  if (old) void old.session.release().catch(() => {});
  // Warm-up (prepares the phoneme dictionary and the model) and speed check:
  // seconds of work per second of speech.
  const t0 = performance.now();
  const probe = await speak(current, "Your reading is ready.", 1);
  const rtf = (performance.now() - t0) / 1000 / Math.max(probe.length / config.audio.sample_rate, 0.5);
  ctx.postMessage({ type: "ready", voice: msg.voice, rtf });
}

async function handle(msg: InMsg) {
  if (msg.type === "load") {
    try {
      await load(msg);
    } catch (err) {
      ctx.postMessage({ type: "error", voice: msg.voice, message: err instanceof Error ? err.message : String(err) });
    }
    return;
  }
  if (msg.type === "generate") {
    try {
      if (!current || current.voice !== msg.voice) throw new Error("Voice not loaded");
      const audio = await speak(current, msg.text, msg.speed);
      ctx.postMessage({ type: "audio", id: msg.id, audio, sampleRate: current.cfg.audio.sample_rate }, [audio.buffer]);
    } catch (err) {
      ctx.postMessage({ type: "error", id: msg.id, message: err instanceof Error ? err.message : String(err) });
    }
  }
}

let chain: Promise<void> = Promise.resolve();
ctx.onmessage = (ev: MessageEvent<InMsg>) => {
  chain = chain.then(() => handle(ev.data));
};
