/// <reference lib="webworker" />
/**
 * Runs the Kokoro-82M neural voice off the main thread.
 *
 * Messages in:  { type: "load", device }  |  { type: "generate", id, text, voice, speed }
 * Messages out: { type: "progress", loaded, total }  |  { type: "ready", device, rtf }
 *               { type: "audio", id, audio, sampleRate }  |  { type: "error", id?, message }
 *
 * The model and voice files are downloaded once from Hugging Face and kept in
 * Cache Storage by transformers.js ("transformers-cache") and kokoro-js
 * ("kokoro-voices"), so after the first load it works offline.
 */
import type { KokoroTTS as KokoroTTSType } from "kokoro-js";
// Served from our own origin (not the CDN default) so it works offline.
import ortWasmUrl from "../../../node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.wasm?url";

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";

type Device = "webgpu" | "wasm";
type InMsg = { type: "load"; device: Device } | { type: "generate"; id: number; text: string; voice: string; speed: number };

const ctx = self as unknown as DedicatedWorkerGlobalScope;
let tts: KokoroTTSType | null = null;
let loading: Promise<KokoroTTSType> | null = null;

async function load(device: Device): Promise<KokoroTTSType> {
  const { KokoroTTS, env } = await import("kokoro-js");
  env.wasmPaths = { wasm: new URL(ortWasmUrl, ctx.location.href).href } as unknown as string;

  // Byte totals per file, so progress covers the whole download.
  const files = new Map<string, { loaded: number; total: number }>();
  const progress_callback = (p: { status: string; file?: string; loaded?: number; total?: number }) => {
    if (p.status !== "progress" || !p.file) return;
    files.set(p.file, { loaded: p.loaded ?? 0, total: p.total ?? 0 });
    let loaded = 0;
    let total = 0;
    files.forEach((f) => {
      loaded += f.loaded;
      total += f.total;
    });
    ctx.postMessage({ type: "progress", loaded, total });
  };

  const make = (d: Device) =>
    KokoroTTS.from_pretrained(MODEL_ID, {
      // Full precision on the GPU (the reference quality); 8-bit on the CPU,
      // which sounds the same to the ear and is a quarter of the size.
      dtype: d === "webgpu" ? "fp32" : "q8",
      device: d,
      progress_callback: progress_callback as never,
    });

  let model: KokoroTTSType;
  let used: Device = device;
  try {
    model = await make(device);
  } catch (err) {
    if (device !== "webgpu") throw err;
    used = "wasm";
    model = await make("wasm");
  }
  // Warm up: fetches + caches the voice file and compiles the graph, so the
  // first real sentence starts quickly and everything is cached for offline.
  await model.generate("Ready.", { voice: "af_heart" });
  // Speed test: seconds of work per second of speech (real-time factor).
  // Above ~0.8 the voice can't keep up with reading and would leave long
  // silences between sentences (typical of phone CPUs).
  const t0 = performance.now();
  const probe = await model.generate("Your reading is ready, and this is the voice that will read it.", { voice: "af_heart" });
  const seconds = probe.audio.length / probe.sampling_rate;
  const rtf = (performance.now() - t0) / 1000 / Math.max(seconds, 0.5);
  ctx.postMessage({ type: "ready", device: used, rtf });
  return model;
}

ctx.onmessage = async (ev: MessageEvent<InMsg>) => {
  const msg = ev.data;
  if (msg.type === "load") {
    if (!loading) {
      loading = load(msg.device);
      loading.then(
        (m) => {
          tts = m;
        },
        (err) => {
          loading = null;
          ctx.postMessage({ type: "error", message: err instanceof Error ? err.message : String(err) });
        },
      );
    }
    return;
  }
  if (msg.type === "generate") {
    try {
      const model = tts ?? (loading ? await loading : null);
      if (!model) throw new Error("Voice not loaded");
      const out = await model.generate(msg.text, { voice: msg.voice as never, speed: msg.speed });
      const audio = new Float32Array(out.audio as Float32Array); // own buffer, safe to transfer
      ctx.postMessage({ type: "audio", id: msg.id, audio, sampleRate: out.sampling_rate }, [audio.buffer]);
    } catch (err) {
      ctx.postMessage({ type: "error", id: msg.id, message: err instanceof Error ? err.message : String(err) });
    }
  }
};
