/**
 * Splits the handbook's text (PDF lines with their font sizes and positions)
 * into chapters, sections and sub-sections. Pure — no PDF library here — so it
 * can be tested with made-up lines.
 *
 * Structure it relies on (font sizes relative to the body text):
 *   level 1 (≈2×)   chapter titles: "The First Sign of the Lunar Cycle", "The Rat"
 *   level 2 (≈1.5×) sections: "The Five Different Rats", "Compatibility and Conflict for the Rat", …
 *   level 3 (≈1.2×) sub-headings: "Metal Rat—1900, 1960, 2020", "Ox", "Spring", …
 * Everything from the start of a chapter up to its first section (the poem,
 * the years table, the hours and direction notes) is skipped.
 */
import {
  HB_ANIMALS, HB_ELEMENTS, HB_SEASONS, HB_WESTERN, appAnimal, pairKey,
  type HbAnimal, type HbChapter, type HbItem, type HbSection, type Handbook, type PdfLine,
} from "./types";

type Level = 0 | 1 | 2 | 3;

interface Ctx {
  level: (l: PdfLine) => Level;
  lineGap: number;
  right: number;
  left: number;
}

const IMAGE_RE = /\.(tif|tiff|eps|jpe?g|png|gif|svg)$/i;
const CAPTION_RE = /^(Triangle of Affinity\b|Circle of Conflict\b)/i;
const clean = (s: string) => s.normalize("NFKC").replace(/\u00ad/g, "").replace(/\s+/g, " ").trim();

function mode(values: number[]): number {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best = values[0] ?? 0, n = -1;
  for (const [v, c] of counts) if (c > n) { best = v; n = c; }
  return best;
}

function quantile(values: number[], q: number): number {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))];
}

function makeCtx(lines: PdfLine[]): Ctx {
  const body = mode(lines.map((l) => Math.round(l.size * 2) / 2));
  const level = (l: PdfLine): Level => {
    const r = l.size / (body || 1);
    return r >= 1.75 ? 1 : r >= 1.35 ? 2 : r >= 1.1 ? 3 : 0;
  };
  const bodyLines = lines.filter((l) => level(l) === 0);
  const left = mode(bodyLines.map((l) => Math.round(l.x0)));
  const gaps: number[] = [];
  for (let i = 1; i < bodyLines.length; i++) {
    const a = bodyLines[i - 1], b = bodyLines[i];
    if (a.page === b.page && a.y > b.y) gaps.push(Math.round((a.y - b.y) * 2) / 2);
  }
  return { level, lineGap: mode(gaps) || body * 1.8, right: quantile(bodyLines.map((l) => l.x1), 0.95), left };
}

const TERMINAL = /[.!?:;”"’)\]]$/;

/** Joins body lines into paragraphs, mending page breaks and line-end hyphens and dashes. */
export function toParagraphs(lines: PdfLine[], ctx: Ctx): string[] {
  const paras: string[] = [];
  let cur = "";
  let prev: PdfLine | null = null;
  for (const raw of lines) {
    const text = clean(raw.text);
    if (!text) continue;
    if (IMAGE_RE.test(text)) continue;
    if (CAPTION_RE.test(text) && raw.x0 > ctx.left + 15) continue;
    let fresh = !prev;
    if (prev) {
      if (prev.page === raw.page) {
        fresh = prev.y - raw.y > ctx.lineGap * 1.3 || raw.y > prev.y;
      } else {
        const ended = TERMINAL.test(cur);
        const lowerStart = /^[a-z]/.test(text);
        const shortLast = prev.x1 < ctx.right * 0.93;
        fresh = ended && !lowerStart && shortLast;
      }
    }
    if (fresh) {
      if (cur) paras.push(cur);
      cur = text;
    } else {
      cur = joinLine(cur, text);
    }
    prev = raw;
  }
  if (cur) paras.push(cur);
  return paras;
}

function joinLine(a: string, b: string): string {
  // "do-" + "gooder" → "do-gooder"; "short-" + "and long-term" keeps the space.
  if (/[A-Za-z]-$/.test(a) && !/^(and|or|to|nor)\b/.test(b)) return a + b;
  if (/[—–]$/.test(a) || /^[—–]/.test(b)) return a + b;
  return `${a} ${b}`;
}

interface RawSection { heading: string; lines: PdfLine[] }

function splitBy(lines: PdfLine[], isHead: (l: PdfLine) => boolean): { head: PdfLine | null; lines: PdfLine[] }[] {
  const out: { head: PdfLine | null; lines: PdfLine[] }[] = [{ head: null, lines: [] }];
  for (const l of lines) {
    if (isHead(l)) out.push({ head: l, lines: [] });
    else out[out.length - 1].lines.push(l);
  }
  return out;
}

/** Glues a heading that wraps onto two lines back together. */
function mergeWrappedHeads(lines: PdfLine[], ctx: Ctx): PdfLine[] {
  const out: PdfLine[] = [];
  for (const l of lines) {
    const p = out[out.length - 1];
    const lv = ctx.level(l);
    if (p && lv > 0 && ctx.level(p) === lv && p.page === l.page && p.y - l.y < l.size * 2.2 && /^[a-z(]/.test(clean(l.text))) {
      out[out.length - 1] = { ...p, text: `${clean(p.text)} ${clean(l.text)}`, x1: Math.max(p.x1, l.x1), y: l.y };
    } else out.push(l);
  }
  return out;
}

function section(heading: string, lines: PdfLine[], ctx: Ctx, keyOf: (h: string) => string | null): HbSection {
  const parts = splitBy(lines, (l) => ctx.level(l) === 3);
  const intro = toParagraphs(parts[0].lines, ctx).join("\n\n");
  const items: HbItem[] = [];
  for (const p of parts.slice(1)) {
    const h = clean(p.head!.text);
    const key = keyOf(h);
    const paras = toParagraphs(p.lines, ctx);
    if (!key) {
      // An unexpected sub-heading: keep its words with the previous item (or the intro).
      const extra = [`### ${h}`, ...paras].join("\n\n");
      if (items.length) items[items.length - 1].text += `\n\n${extra}`;
      continue;
    }
    items.push({ key, heading: h, text: paras.join("\n\n") });
  }
  return { heading, intro, items };
}

/** Section whose sub-headings are just carried along as "### heading" lines. */
function plainSection(heading: string, lines: PdfLine[], ctx: Ctx): HbSection {
  const parts = splitBy(lines, (l) => ctx.level(l) === 3);
  const chunks = parts.flatMap((p) => [...(p.head ? [`### ${clean(p.head.text)}`] : []), ...toParagraphs(p.lines, ctx)]);
  return { heading, intro: chunks.join("\n\n"), items: [] };
}

const elementKey = (h: string) => (HB_ELEMENTS as readonly string[]).find((e) => h.startsWith(e)) ?? null;
const seasonKey = (h: string) => (HB_SEASONS as readonly string[]).find((s) => h.startsWith(s) || (s === "Autumn" && /^Fall\b/.test(h))) ?? null;
const westernKey = (h: string) => (HB_WESTERN as readonly string[]).find((w) => h.startsWith(w)) ?? null;
const animalKey = (h: string) => appAnimal(h.split(/\s+/)[0]);
const hoursKey = (h: string) => { const m = /Hours of the (\w+)/i.exec(h); return m ? appAnimal(m[1]) : null; };

function chapter(animal: HbAnimal, bookName: string, lines: PdfLine[], ctx: Ctx): HbChapter {
  const ch: HbChapter = { animal, bookName };
  const parts = splitBy(lines, (l) => ctx.level(l) === 2);
  for (const p of parts.slice(1)) {
    const h = clean(p.head!.text);
    if (/Personality$/i.test(h)) ch.personality = plainSection(h, p.lines, ctx);
    else if (/Child$/i.test(h)) ch.child = plainSection(h, p.lines, ctx);
    else if (/^The Five Different/i.test(h)) ch.five = section(h, p.lines, ctx, elementKey);
    else if (/^Compatibility and Conflict/i.test(h)) ch.compat = section(h, p.lines, ctx, animalKey);
    else if (/Ascendant/i.test(h)) ch.ascendant = section(h, p.lines, ctx, hoursKey);
    else if (/Moon Signs/i.test(h)) ch.moon = moonSection(h, p.lines, ctx);
    else if (/^The Seasons of/i.test(h)) ch.seasons = section(h, p.lines, ctx, seasonKey);
    else if (/^Famous People/i.test(h)) ch.famous = famousSection(h, p.lines, ctx);
  }
  return ch;
}

function moonSection(heading: string, lines: PdfLine[], ctx: Ctx): HbSection {
  const s = section(heading, lines, ctx, westernKey);
  // "Cancer Rat = Water + Positive Water" opens each entry (sometimes run into the first paragraph).
  const FORMULA = /^([A-Z][\w’']+ [A-Z][\w’']+\s*[=:]\s*[A-Z]\w+\s*\+\s*(?:Positive|Negative)\s+[A-Z]\w+)\s*([\s\S]*)$/;
  for (const it of s.items) {
    const m = FORMULA.exec(it.text);
    if (m) {
      it.formula = m[1];
      it.text = m[2].replace(/^\s+/, "");
    }
  }
  return s;
}

function famousSection(heading: string, lines: PdfLine[], ctx: Ctx): HbSection {
  const parts = splitBy(lines, (l) => ctx.level(l) === 3);
  const items: HbItem[] = [];
  const add = (key: string, heading: string, names: string[]) => items.push({ key, heading, text: names.join("\n") });
  for (const p of parts.slice(1)) {
    const h = clean(p.head!.text);
    const key = elementKey(h);
    if (!key) continue;
    let names: string[] = [];
    let curKey = key, curHead = h;
    for (const l of p.lines) {
      const t = clean(l.text);
      if (!t || IMAGE_RE.test(t)) continue;
      // The PDF sometimes runs the next element's heading into a name ("Venus WilliamsWater").
      const glued = /^(.*[a-z.)])(Metal|Water|Wood|Fire|Earth)$/.exec(t);
      if (glued && !items.some((i) => i.key === glued[2]) && glued[2] !== curKey) {
        names.push(glued[1]);
        add(curKey, curHead, names);
        names = []; curKey = glued[2]; curHead = glued[2];
        continue;
      }
      names.push(t);
    }
    add(curKey, curHead, names);
  }
  return { heading, intro: toParagraphs(parts[0].lines, ctx).join("\n\n"), items };
}

function relationships(lines: PdfLine[], ctx: Ctx): Record<string, HbItem> {
  const pairs: Record<string, HbItem> = {};
  const subs = splitBy(lines, (l) => ctx.level(l) === 3);
  for (const p of subs.slice(1)) {
    const h = clean(p.head!.text);
    const m = /^(\w+)\s*\+\s*(\w+)$/.exec(h);
    if (!m) continue;
    const a = appAnimal(m[1]), b = appAnimal(m[2]);
    if (!a || !b) continue;
    // Drop a trailing "The Ox’s Relationships" level-2 line if one slipped in.
    const body = p.lines.filter((l) => ctx.level(l) === 0);
    pairs[pairKey(a, b)] = { key: pairKey(a, b), heading: h, text: toParagraphs(body, ctx).join("\n\n") };
  }
  return pairs;
}

export function parseHandbook(rawLines: PdfLine[], meta: { file: string; pages: number }): Handbook {
  const ctx = makeCtx(rawLines);
  const lines = mergeWrappedHeads(rawLines.filter((l) => clean(l.text)), ctx);
  const chapters: Handbook["chapters"] = {};
  let pairs: Record<string, HbItem> = {};

  const l1 = lines.map((l, i) => (ctx.level(l) === 1 ? i : -1)).filter((i) => i >= 0);
  for (let k = 0; k < l1.length; k++) {
    const i = l1[k];
    const t = clean(lines[i].text);
    if (/Sign of the Lunar Cycle$/i.test(t)) {
      // "The Rat" follows on the next level-1 line; the chapter runs to the level-1 line after that.
      const nameIdx = l1[k + 1];
      if (nameIdx === undefined) continue;
      const bookName = clean(lines[nameIdx].text).replace(/^The\s+/i, "");
      const animal = appAnimal(bookName);
      if (!animal) continue;
      const end = l1[k + 2] ?? lines.length;
      chapters[animal] = chapter(animal, bookName, lines.slice(nameIdx + 1, end), ctx);
    } else if (/^Relationship Combinations$/i.test(t)) {
      const end = l1[k + 1] ?? lines.length;
      pairs = relationships(lines.slice(i + 1, end), ctx);
    }
  }
  return { v: 1, chapters, pairs, meta: { ...meta, loadedAt: new Date().toISOString() } };
}

/** What a parsed book holds, to tell the user whether it read correctly. */
export function handbookSummary(hb: Handbook) {
  const chapters = HB_ANIMALS.filter((a) => hb.chapters[a]);
  const full = chapters.filter((a) => {
    const c = hb.chapters[a]!;
    return (c.five?.items.length ?? 0) >= 5 && (c.compat?.items.length ?? 0) >= 12 && (c.ascendant?.items.length ?? 0) >= 12
      && (c.moon?.items.length ?? 0) >= 12 && (c.seasons?.items.length ?? 0) >= 4;
  });
  return { chapters: chapters.length, complete: full.length, pairs: Object.keys(hb.pairs).length };
}
