import { describe, it, expect } from "vitest";
import { splitClauses, phonemesToIds, finishAudio } from "@/lib/read-aloud/piper-text";
import { voiceFiles } from "@/lib/read-aloud/neural-voice";
import { NATURAL_VOICES } from "@/lib/read-aloud/voice-settings";

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
  });

  it("every voice in the menu maps to a Piper voice file", () => {
    for (const v of NATURAL_VOICES) {
      const { model, config } = voiceFiles(v.id);
      expect(model).toMatch(new RegExp(`^https://huggingface\\.co/rhasspy/piper-voices/resolve/main/en/en_(US|GB)/[a-z_]+/medium/${v.id}\\.onnx$`));
      expect(config).toBe(`${model}.json`);
    }
    expect(new Set(NATURAL_VOICES.map((v) => v.id)).size).toBe(NATURAL_VOICES.length);
  });
});
