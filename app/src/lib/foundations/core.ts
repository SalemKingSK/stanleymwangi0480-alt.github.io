/** Shared pieces of the Foundations: the birthday, a year's pillar and how two elements stand to each other. */
import { stemBranchIndex, ZODIAC_ANIMALS, STEM_ELEMENTS } from "@/lib/astrology/chinese-calendar-math";
import { CONTROLS, FEEDS, type Animal, type Element, type Polarity } from "./data";

export interface Birth {
  day: number;
  month: number;
  year: number;
  sign: string;
  element: string;
  western: string;
  /** Animal of the birth hour, when the reader has chosen it. */
  hour?: Animal | null;
}

/** Element and polarity of a Chinese year (from its Heavenly Stem). */
export function yearPillar(year: number): { element: Element; polarity: Polarity; animal: Animal } {
  const { stem, branch } = stemBranchIndex(year);
  return { element: STEM_ELEMENTS[Math.floor(stem / 2)] as Element, polarity: stem % 2 === 0 ? "Yang" : "Yin", animal: ZODIAC_ANIMALS[branch] as Animal };
}

export type Relation = "same" | "feeds-you" | "you-feed" | "you-control" | "controls-you";
/** How element `other` stands to element `mine`. */
export function relation(mine: Element, other: Element): Relation {
  if (mine === other) return "same";
  if (FEEDS[other] === mine) return "feeds-you";
  if (FEEDS[mine] === other) return "you-feed";
  if (CONTROLS[mine] === other) return "you-control";
  return "controls-you";
}

/** The traditional verdict on a year for a person of `mine`: own, mother and child years favour you; the two destruction links do not. */
export const favourable = (r: Relation) => r === "same" || r === "feeds-you" || r === "you-feed";

/** Element of the "go-between": it is fed by the controller and feeds the controlled, so it turns conflict into flow. */
export const mediator = (controller: Element): Element => FEEDS[controller];
