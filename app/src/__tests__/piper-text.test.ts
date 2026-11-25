import { describe, it, expect } from "vitest";
import { splitClauses, phonemesToIds, finishAudio } from "@/lib/read-aloud/piper-text";
import { voiceFiles } from "@/lib/read-aloud/neural-voice";
import { APP_VOICE } from "@/lib/read-aloud/voice-settings";
import fs from "node:fs";
import path from "node:path";

describe("Piper text handling", () => {
  it("cuts clauses at punctuation and keeps the mark for the voice's pauses", () => {
    expect(splitClauses("Hello, world. How are you? Fine; thanks!")).toEqual([
      { text: "Hello", punct: "," },
      { text: "world", punct: "." },
      { text: "How are you", punct: "?" },
      { text: "Fine", punct: ";" },
      { text: "thanks", punct: "!" },
    ]);
  });

  it("keeps numbers, times and abbreviations whole", () => {
    expect(splitClauses("Dr. Smith paid 3.50 at 10:30 for 1,000 cards")).toEqual([{ text: "Dr. Smith paid 3.50 at 10:30 for 1,000 cards", punct: "" }]);
    expect(splitClauses("Wait... really?! Yes — truly.")).toEqual([
      { text: "Wait", punct: "." },
      { text: "really", punct: "?" },
      { text: "Yes", punct: "," },
      { text: "truly", punct: "." },
    ]);
  });

  it("encodes phonemes as ^ _ (phoneme _)* $ and skips unknown symbols", () => {
    const map = { "^": [1], $: [2], _: [0], a: [10], b: [11], " ": [3] };
    expect(phonemesToIds("a b✱", map)).toEqual([1, 0, 10, 0, 3, 0, 11, 0, 2]);
  });

  it("evens out loudness and adds a longer pause after a full stop than a comma", () => {
    const quiet = new Float32Array([0.1, -0.2, 0.05]);
    const end = finishAudio(quiet, 1000, "A sentence.");
    expect(Math.max(...Array.from(end, Math.abs))).toBeCloseTo(0.9);
    expect(end.length).toBe(3 + 220);
    expect(finishAudio(quiet, 1000, "A part,").length).toBe(3 + 100);
    // a sentence cut between words joins the next piece almost seamlessly
    expect(finishAudio(quiet, 1000, "Similar to the").length).toBe(3 + 20);
  });

  it("a short piece is not boosted louder than the voice's usual level", () => {
    const tiny = new Float32Array([0.05, -0.1]);
    const out = finishAudio(tiny, 1000, "Yes", 0.3);
    expect(Math.max(...Array.from(out, Math.abs))).toBeCloseTo(0.4); // 0.1 × 0.9/(0.3×0.75)
    const loud = finishAudio(new Float32Array([0.5]), 1000, "Yes", 0.3);
    expect(loud[0]).toBeCloseTo(0.9); // its own peak when louder
  });

  it("the voice ships with the app: its pieces are on the app's own site, each under the 25 MiB hosting limit", () => {
    const { parts, config } = voiceFiles();
    expect(parts).toHaveLength(APP_VOICE.parts.length);
    for (const u of [...parts, config]) expect(u).toMatch(new RegExp(`^http://localhost/voice/${APP_VOICE.id}/`));
    const dir = path.resolve(__dirname, "../../public/voice", APP_VOICE.id);
    const sizes = APP_VOICE.parts.map((p) => fs.statSync(path.join(dir, p)).size);
    for (const n of sizes) expect(n).toBeLessThan(25 * 1024 * 1024);
    expect(sizes.reduce((a, b) => a + b, 0)).toBe(APP_VOICE.bytes);
    const cfg = JSON.parse(fs.readFileSync(path.join(dir, APP_VOICE.config), "utf8"));
    expect(cfg).toMatchObject({ audio: { sample_rate: 22050 }, espeak: { voice: "en-gb-x-rp" } });
  });
});
