/**
 * The user's own copy of their Chinese-horoscope handbook, read on the device.
 *
 * Nothing in here ships with the app: the user picks their PDF once, the text is
 * extracted in the browser (extract.ts), split per animal and section
 * (parse.ts) and kept in this device's IndexedDB (store.ts). The Animal Oracle
 * then shows each passage word for word.
 */

export const HB_ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"] as const;
export type HbAnimal = (typeof HB_ANIMALS)[number];

export const HB_ELEMENTS = ["Metal", "Water", "Wood", "Fire", "Earth"] as const;
export const HB_SEASONS = ["Spring", "Summer", "Autumn", "Winter"] as const;
export const HB_WESTERN = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

/** One line of text as the PDF lays it out (y grows upwards, as in PDF space). */
export interface PdfLine {
  page: number;
  y: number;
  x0: number;
  x1: number;
  /** Font size (glyph height). */
  size: number;
  text: string;
}

/** A sub-heading of a section and the words under it. */
export interface HbItem {
  /** Normalised key: an element, app animal name, Western sign or season. */
  key: string;
  /** The heading exactly as the book prints it. */
  heading: string;
  /** Paragraphs separated by blank lines. */
  text: string;
  /** Moon-sign entries: the "Sagittarius Rat = Fire + Positive Water" line. */
  formula?: string;
}

export interface HbSection {
  heading: string;
  /** Text before the first sub-heading. */
  intro: string;
  items: HbItem[];
}

export interface HbChapter {
  animal: HbAnimal;
  /** The animal's name in the book (the book calls the Goat "Sheep" and the Pig "Boar"). */
  bookName: string;
  personality?: HbSection;
  child?: HbSection;
  five?: HbSection;
  compat?: HbSection;
  ascendant?: HbSection;
  moon?: HbSection;
  seasons?: HbSection;
  /** items: one per element, text = one name per line. */
  famous?: HbSection;
}

export interface Handbook {
  v: 1;
  chapters: Partial<Record<HbAnimal, HbChapter>>;
  /** "Rat + Ox" passages (144, from each side), keyed by pairKey(). */
  pairs: Record<string, HbItem>;
  meta: { file: string; pages: number; loadedAt: string };
}

/** Key of the "Rat + Ox" passage (the book reads every pair from each side: Rat + Ox and Ox + Rat differ). */
export function pairKey(a: string, b: string): string {
  return `${a}+${b}`;
}

const BOOK_TO_APP: Record<string, HbAnimal> = { Sheep: "Goat", Boar: "Pig", Oxen: "Ox", Cat: "Rabbit", Ram: "Goat" };
/** "Sheep" → "Goat", "Boar" → "Pig", "Rats" → "Rat"; null when it isn't an animal. */
export function appAnimal(name: string): HbAnimal | null {
  const n = name.trim().replace(/[’']s$/, "");
  if ((HB_ANIMALS as readonly string[]).includes(n)) return n as HbAnimal;
  if (BOOK_TO_APP[n]) return BOOK_TO_APP[n];
  const single = n.replace(/s$/, "");
  if ((HB_ANIMALS as readonly string[]).includes(single)) return single as HbAnimal;
  return BOOK_TO_APP[single] ?? null;
}

/**
 * The Chinese season of a birth date — spring from Li Chun (4 Feb), summer
 * from Li Xia (5 May), autumn from Li Qiu (7 Aug), winter from Li Dong (7 Nov).
 */
export function birthSeason(day: number, month: number): (typeof HB_SEASONS)[number] {
  const md = month * 100 + day;
  if (md >= 204 && md < 505) return "Spring";
  if (md >= 505 && md < 807) return "Summer";
  if (md >= 807 && md < 1107) return "Autumn";
  return "Winter";
}
