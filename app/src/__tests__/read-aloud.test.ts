import { describe, it, expect } from "vitest";
import { sentencesOf, toSpeechText, isSpeakable, chunkForSpeech } from "@/lib/read-aloud/split-sentences";

describe("read-aloud sentence splitter", () => {
  it("keeps a final sentence without a full stop", () => {
    expect(sentencesOf("First sentence. And the last bit")).toEqual(["First sentence.", "And the last bit"]);
  });

  it("does not split decimals, percentages or versions", () => {
    expect(sentencesOf("Emphasis is 12.5% this year. Version 2.0 shipped.")).toEqual([
      "Emphasis is 12.5% this year.",
      "Version 2.0 shipped.",
    ]);
  });

  it("does not split titles, abbreviations or initials", () => {
    expect(sentencesOf("Dr. King met St. John in 1963. J. K. Rowling wrote it, e.g. in cafés. Done.")).toEqual([
      "Dr. King met St. John in 1963.",
      "J. K. Rowling wrote it, e.g. in cafés.",
      "Done.",
    ]);
    expect(sentencesOf("Martin Luther King Jr. was born in 1929.")).toEqual(["Martin Luther King Jr. was born in 1929."]);
  });

  it("ends a sentence after a soft abbreviation only before a capital", () => {
    expect(sentencesOf("Money, career, etc. Then rest.")).toEqual(["Money, career, etc.", "Then rest."]);
    expect(sentencesOf("Money, career, etc. and rest.")).toEqual(["Money, career, etc. and rest."]);
  });

  it("handles ! ? … and closing quotes", () => {
    expect(sentencesOf('He said "Go now!" Then he left? Yes… Maybe.')).toEqual([
      'He said "Go now!"',
      "Then he left?",
      "Yes…",
      "Maybe.",
    ]);
    expect(sentencesOf("Wait... and see.")).toEqual(["Wait... and see."]);
  });

  it("treats line breaks as sentence ends (headings, list items)", () => {
    expect(sentencesOf("THE SHAPE OF 2026\nA year of arrival. It begins now.\n\n• First item\n• Second item")).toEqual([
      "THE SHAPE OF 2026",
      "A year of arrival.",
      "It begins now.",
      "• First item",
      "• Second item",
    ]);
  });

  it("makes numerology notation speakable and drops pure symbols", () => {
    expect(toSpeechText("✦ 17/8 × 8/8 — **The Star**")).toBe("17 slash 8 by 8 slash 8 — The Star");
    expect(isSpeakable(" ◆ — ")).toBe(false);
    expect(isSpeakable("7")).toBe(true);
  });

  it("splits very long sentences into clause-sized speech parts without losing words", () => {
    const long = Array.from({ length: 30 }, (_, i) => `clause number ${i} carries meaning`).join(", ") + ".";
    const parts = chunkForSpeech(long, 180);
    expect(parts.length).toBeGreaterThan(1);
    expect(parts.every((p) => p.length <= 180)).toBe(true);
    expect(parts.join(" ")).toBe(long);
    expect(chunkForSpeech("Short one.")).toEqual(["Short one."]);
  });
});
