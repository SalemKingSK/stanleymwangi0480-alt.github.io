/**
 * Text and audio helpers for the Piper voices (no browser APIs, so they're
 * unit-tested directly). They follow what Piper's own tools do:
 * - the text is cut into clauses at punctuation; each clause is turned into
 *   phonemes by espeak-ng, and the punctuation mark is put back after it, so
 *   the voice pauses and inflects at commas, full stops and questions;
 * - phonemes become model ids as  ^ _ (phoneme _)* $  ("_" = padding);
 * - the result is normalised in volume and ends with a short silence, so
 *   sentences played back to back are spaced like natural speech.
 */

export interface PiperConfig {
  audio: { sample_rate: number };
  espeak: { voice: string };
  inference: { noise_scale: number; length_scale: number; noise_w: number };
  phoneme_id_map: Record<string, number[]>;
  num_speakers?: number;
}

export interface Clause {
  text: string;
  /** Punctuation that ended it: one of , . ? ! ; :  or "" at the very end. */
  punct: string;
}

const MARKS = ".,!?;:…—–";
// "Dr. Smith", "J. K. Rowling", "e.g. this": a full stop that doesn't end a clause.
const ABBREVIATION = /(?:^|[\s(])(?:mr|mrs|ms|dr|st|prof|sr|jr|vs|etc|no|vol|fig|approx|e\.g|i\.e|[a-z])\.$/i;

/** Splits text into clauses at punctuation (keeping 3.5, 1,000, 10:30 and "Dr." intact). */
export function splitClauses(text: string): Clause[] {
  const t = text.replace(/\s+/g, " ").trim();
  const out: Clause[] = [];
  let buf = "";
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (!MARKS.includes(c)) {
      buf += c;
      continue;
    }
    const prev = t[i - 1] ?? "";
    const next = t[i + 1] ?? "";
    if (".,:".includes(c) && /\d/.test(prev) && /\d/.test(next)) {
      buf += c; // a number
      continue;
    }
    if (c === "." && next === " " && ABBREVIATION.test(buf + ".")) {
      buf += c;
      continue;
    }
    let run = c;
    while (i + 1 < t.length && MARKS.includes(t[i + 1])) run += t[++i];
    const punct = run.includes("?") ? "?" : run.includes("!") ? "!" : /[.…]/.test(run) ? "." : run.includes(";") ? ";" : run.includes(":") ? ":" : ",";
    const clause = buf.trim();
    if (clause) out.push({ text: clause, punct });
    else if (out.length && punct !== ",") out[out.length - 1].punct = punct;
    buf = "";
  }
  if (buf.trim()) out.push({ text: buf.trim(), punct: "" });
  return out;
}

/** Phoneme string → model input ids. Unknown symbols are skipped. */
export function phonemesToIds(phonemes: string, map: Record<string, number[]>): number[] {
  const pad = map["_"] ?? [0];
  const ids = [...(map["^"] ?? [1]), ...pad];
  for (const ch of phonemes.normalize("NFD")) {
    const id = map[ch];
    if (id) ids.push(...id, ...pad);
  }
  ids.push(...(map["$"] ?? [2]));
  return ids;
}

/**
 * Even loudness (Piper normalises every utterance the same way) plus a
 * natural gap after the clip: longer after a full stop than after a comma.
 */
export function finishAudio(samples: Float32Array, sampleRate: number, text: string): Float32Array {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const a = Math.abs(samples[i]);
    if (a > peak) peak = a;
  }
  const gain = 0.9 / Math.max(peak, 0.01);
  const gap = Math.round(sampleRate * (/[.!?…]["'’”)\]]*\s*$/.test(text) ? 0.22 : 0.1));
  const out = new Float32Array(samples.length + gap);
  for (let i = 0; i < samples.length; i++) out[i] = samples[i] * gain;
  return out;
}
