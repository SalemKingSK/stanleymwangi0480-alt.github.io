/**
 * The user's second book, "Chinese Zodiacs" — read on the device just like the
 * handbook (nothing of it ships with the app). Its opening chapters (the twelve
 * animals, your horoscope, Yang and Yin, the Elements with the Creation and
 * Destruction Cycles) become the Oracle's Foundations; each animal chapter
 * (virtues, vices, personality, love, career, the five elements, the year and
 * its fortunes) goes into that animal's Oracle.
 *
 * Headings are recognised by font size, ranked: chapter titles (largest),
 * sections, sub-sections, sub-sub-sections; body text is the most common size.
 */
import { clean, toParagraphs, type Ctx } from "./parse";
import { HB_ANIMALS, HB_ELEMENTS, appAnimal, type HbAnimal, type HbItem, type HbSection, type PdfLine } from "./types";

export interface ZgPassage {
  heading: string;
  text: string;
}

export interface ZgChapter {
  animal: HbAnimal;
  bookName: string;
  title: string;
  /** "(1936, 1948, …)" */
  years?: string;
  /** The chapter's short opening paragraph(s). */
  opening?: string;
  virtues?: ZgPassage;
  vices?: ZgPassage;
  personality?: ZgPassage;
  love?: ZgPassage;
  career?: ZgPassage;
  /** items keyed by element. */
  five?: HbSection;
  year?: ZgPassage;
  /** items keyed by the year's animal (app names): "The Rat in the Ox Year". */
  fortunes?: HbSection;
}

export interface ZgElementMeaning {
  key: string; // element
  heading: string; // "Wood People"
  text: string;
  yang?: ZgPassage;
  yin?: ZgPassage;
}

export interface ZgFoundation {
  /** Fixed key (FOUNDATION_KEYS), used by the Curriculum. */
  key: string;
  heading: string;
  text: string;
}

export interface Zodiacs {
  v: 1;
  kind: "zodiacs";
  /** In book order: the twelve animals, your horoscope, Yang and Yin, the elements and their sections. */
  foundations: ZgFoundation[];
  meanings?: { heading: string; intro: string; items: ZgElementMeaning[] };
  /** "Rat" → { polarity: "Yang", element: "Water", line } from "The Natural Elements of the Animals". */
  natural: Partial<Record<HbAnimal, { polarity: string; element: string }>>;
  chapters: Partial<Record<HbAnimal, ZgChapter>>;
  meta: { file: string; pages: number; loadedAt: string };
}

/** Foundation passages, in book order (also the Curriculum's library). */
export const FOUNDATION_KEYS = [
  "The Twelve Animals",
  "Your Chinese Horoscope",
  "Yang and Yin",
  "The Elements",
  "Elements and the Planets",
  "The Creation Cycle",
  "The Destruction Cycle",
  "The Natural Elements of the Animals",
  "Meanings of the Elements",
] as const;

function foundationKey(heading: string): string | null {
  const h = heading.toLowerCase();
  if (/introduction to the 12|twelve animals/.test(h)) return "The Twelve Animals";
  if (/your chinese horoscope/.test(h)) return "Your Chinese Horoscope";
  if (/^yang and yin|^yin and yang/.test(h)) return "Yang and Yin";
  if (/^the elements$/.test(h)) return "The Elements";
  if (/elements and the planets/.test(h)) return "Elements and the Planets";
  if (/creation cycle/.test(h)) return "The Creation Cycle";
  if (/destruction cycle/.test(h)) return "The Destruction Cycle";
  if (/natural elements of the animals/.test(h)) return "The Natural Elements of the Animals";
  if (/meanings of the elements/.test(h)) return "Meanings of the Elements";
  return null;
}

interface Node {
  level: number;
  heading: string;
  lines: PdfLine[];
  children: Node[];
}

function zgCtx(lines: PdfLine[]): Ctx {
  const counts = new Map<number, number>();
  for (const l of lines) counts.set(Math.round(l.size), (counts.get(Math.round(l.size)) ?? 0) + 1);
  const body = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 12;
  const heads = [...counts.keys()].filter((s) => s > body * 1.05).sort((a, b) => b - a);
  const level = (l: PdfLine) => {
    const i = heads.indexOf(Math.round(l.size));
    return i < 0 ? 0 : i + 1;
  };
  const bodyLines = lines.filter((l) => level(l) === 0);
  const gaps = new Map<number, number>();
  for (let i = 1; i < bodyLines.length; i++) {
    const a = bodyLines[i - 1], b = bodyLines[i];
    if (a.page === b.page && a.y > b.y) {
      const g = Math.round(a.y - b.y);
      gaps.set(g, (gaps.get(g) ?? 0) + 1);
    }
  }
  const lineGap = [...gaps.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? body * 1.4;
  const x1s = bodyLines.map((l) => l.x1).sort((a, b) => a - b);
  const x0s = new Map<number, number>();
  for (const l of bodyLines) x0s.set(Math.round(l.x0), (x0s.get(Math.round(l.x0)) ?? 0) + 1);
  return {
    level,
    lineGap,
    right: x1s[Math.floor(x1s.length * 0.95)] ?? 540,
    left: [...x0s.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 50,
    shortBreak: true,
  };
}

function tree(lines: PdfLine[], ctx: Ctx): Node {
  const root: Node = { level: 0, heading: "", lines: [], children: [] };
  const stack: Node[] = [root];
  for (const l of lines) {
    const lv = ctx.level(l);
    if (!lv) {
      stack[stack.length - 1].lines.push(l);
      continue;
    }
    const node: Node = { level: lv, heading: clean(l.text), lines: [], children: [] };
    while (stack.length > 1 && stack[stack.length - 1].level >= lv) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return root;
}

const paras = (n: Node, ctx: Ctx) => toParagraphs(n.lines, ctx);
const own = (n: Node, ctx: Ctx) => paras(n, ctx).join("\n\n");
/** A node's text with every sub-heading kept as a "### heading" line. */
function full(n: Node, ctx: Ctx): string {
  const out = [own(n, ctx)];
  for (const c of n.children) out.push(`### ${c.heading}`, full(c, ctx));
  return out.filter(Boolean).join("\n\n");
}

function chapter(animal: HbAnimal, title: string, n: Node, ctx: Ctx): ZgChapter {
  const ch: ZgChapter = { animal, title, bookName: title.replace(/^The\s+/i, "") };
  const opening = paras(n, ctx);
  if (opening[0] && /^\(\s*\d{4}/.test(opening[0])) ch.years = opening.shift();
  if (opening.length) ch.opening = opening.join("\n\n");
  const sections = n.children.flatMap((c) => (c.level === n.level + 1 ? [c] : [c]));
  for (const s of sections) {
    const h = s.heading;
    const p = { heading: h, text: full(s, ctx) };
    if (/^The Virtues of/i.test(h)) ch.virtues = p;
    else if (/^The Vices of/i.test(h)) ch.vices = p;
    else if (/Personality$|Character$/i.test(h)) ch.personality = p;
    else if (/ in Love$/i.test(h)) ch.love = p;
    else if (/ Career$/i.test(h)) ch.career = p;
    else if (/and the Five Elements$/i.test(h)) ch.five = fiveSection(s, ctx);
    else if (/^The Year of the/i.test(h)) {
      ch.year = { heading: h, text: own(s, ctx) };
      const f = s.children.find((c) => /^The Fortunes of/i.test(c.heading));
      if (f) ch.fortunes = fortunes(f, animal, ctx);
      // Any other sub-heading stays with the year's text.
      for (const c of s.children) if (c !== f) ch.year.text += `\n\n### ${c.heading}\n\n${full(c, ctx)}`;
    } else if (/^The Fortunes of/i.test(h)) ch.fortunes = fortunes(s, animal, ctx);
  }
  return ch;
}

function fiveSection(s: Node, ctx: Ctx): HbSection {
  const items: HbItem[] = [];
  for (const c of s.children) {
    const el = HB_ELEMENTS.find((e) => new RegExp(`\\b${e}\\b`).test(c.heading));
    if (el) items.push({ key: el, heading: c.heading, text: full(c, ctx) });
    else if (items.length) items[items.length - 1].text += `\n\n### ${c.heading}\n\n${full(c, ctx)}`;
  }
  return { heading: s.heading, intro: own(s, ctx), items };
}

function fortunes(s: Node, animal: HbAnimal, ctx: Ctx): HbSection {
  const items: HbItem[] = [];
  const intro: string[] = [];
  const RE = /^(The [\w’']+ in the ([\w’']+) Year)\s*[:.—-]\s*/;
  for (const p of [...paras(s, ctx), ...s.children.flatMap((c) => [`### ${c.heading}`, ...paras(c, ctx)])]) {
    const m = RE.exec(p);
    const key = m ? appAnimal(m[2]) : null;
    if (m && key) items.push({ key, heading: m[1], text: p.slice(m[0].length) });
    else if (items.length) items[items.length - 1].text += `\n\n${p}`;
    else intro.push(p);
  }
  void animal;
  return { heading: s.heading, intro: intro.join("\n\n"), items };
}

function naturalElements(text: string): Zodiacs["natural"] {
  const out: Zodiacs["natural"] = {};
  for (const m of text.matchAll(/(\w+) naturally prefers (Yang|Yin) and the (\w+) element/g)) {
    const a = appAnimal(m[1]);
    if (a) out[a] = { polarity: m[2], element: m[3] };
  }
  return out;
}

function meanings(n: Node, ctx: Ctx): Zodiacs["meanings"] {
  const items: ZgElementMeaning[] = [];
  for (const c of n.children) {
    const el = HB_ELEMENTS.find((e) => c.heading.startsWith(e));
    if (!el) continue;
    const m: ZgElementMeaning = { key: el, heading: c.heading, text: own(c, ctx) };
    for (const sub of c.children) {
      const p = { heading: sub.heading, text: full(sub, ctx) };
      if (/Yang/i.test(sub.heading) && !m.yang) m.yang = p;
      else if (/Yin/i.test(sub.heading) && !m.yin) m.yin = p;
      else m.text += `\n\n### ${sub.heading}\n\n${p.text}`;
    }
    items.push(m);
  }
  return { heading: n.heading, intro: own(n, ctx), items };
}

/** True when the lines look like this book (its animal chapters open with "The Virtues of the …"). */
export function looksLikeZodiacs(lines: PdfLine[]): boolean {
  return lines.filter((l) => /^The Virtues of the \w+$/.test(clean(l.text))).length >= 6;
}

export function parseZodiacs(raw: PdfLine[], meta: { file: string; pages: number }): Zodiacs {
  const lines = raw.filter((l) => clean(l.text));
  const ctx = zgCtx(lines);
  const root = tree(lines, ctx);
  const book: Zodiacs = { v: 1, kind: "zodiacs", foundations: [], natural: {}, chapters: {}, meta: { ...meta, loadedAt: new Date().toISOString() } };
  for (const top of root.children) {
    if (/^\d+$/.test(top.heading) || /^contents$/i.test(top.heading)) continue;
    const animal = /^The \w+$/.test(top.heading) ? appAnimal(top.heading.replace(/^The /, "")) : null;
    if (animal && (HB_ANIMALS as readonly string[]).includes(animal)) {
      book.chapters[animal] = chapter(animal, top.heading, top, ctx);
      continue;
    }
    const key = foundationKey(top.heading);
    if (!key) continue;
    book.foundations.push({ key, heading: top.heading, text: own(top, ctx) });
    for (const c of top.children) {
      const ck = foundationKey(c.heading);
      if (ck === "Meanings of the Elements") {
        book.meanings = meanings(c, ctx);
        book.foundations.push({ key: ck, heading: c.heading, text: own(c, ctx) });
      } else if (ck) {
        const text = full(c, ctx);
        book.foundations.push({ key: ck, heading: c.heading, text });
        if (ck === "The Natural Elements of the Animals") book.natural = naturalElements(text);
      } else {
        // A sub-section with no layer of its own (e.g. "The Chinese Year") stays inside its chapter.
        const f = book.foundations[book.foundations.length - 1];
        f.text = [f.text, `### ${c.heading}`, full(c, ctx)].filter(Boolean).join("\n\n");
      }
    }
  }
  return book;
}

export function zodiacsSummary(z: Zodiacs) {
  const chapters = HB_ANIMALS.filter((a) => z.chapters[a]);
  const complete = chapters.filter((a) => {
    const c = z.chapters[a]!;
    return c.personality && c.love && c.career && (c.five?.items.length ?? 0) >= 5 && (c.fortunes?.items.length ?? 0) >= 12;
  });
  return { chapters: chapters.length, complete: complete.length, foundations: z.foundations.length };
}

/** The animal moon of a Western sun sign (Sagittarius is the Moon of the Rat, Virgo of the Rooster…). */
export function animalMoon(western: string): HbAnimal | null {
  const order = ["Sagittarius", "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio"];
  const i = order.indexOf(western);
  return i < 0 ? null : HB_ANIMALS[i];
}

/** Every animal's year polarity: the Rat, Tiger, Dragon, Horse, Monkey and Dog are Yang. */
export function animalPolarity(animal: string): "Yang" | "Yin" {
  return HB_ANIMALS.indexOf(animal as HbAnimal) % 2 === 0 ? "Yang" : "Yin";
}
