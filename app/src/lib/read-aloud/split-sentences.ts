/**
 * Sentence splitter for read-aloud. Returns [start, end) character offsets
 * (trimmed) so callers can map each sentence back onto the DOM.
 *
 * Handles what the old `/[^.!?\n]+[.!?\n]+/g` regex got wrong:
 * - a final sentence without a full stop is kept (it used to be dropped)
 * - decimals and versions ("12.5%", "v2.0") don't split
 * - titles and common abbreviations ("Dr.", "St.", "e.g.", "vs.") don't split
 * - initials ("J. K. Rowling", "Martin Luther King Jr.") don't split
 * - "!" / "?" / "…" only split when the next word starts a new sentence
 * - closing quotes/brackets stay with their sentence
 * - a line break always ends a sentence (headings, list items)
 */

/** Never end a sentence after these (titles, Latin abbreviations, references). */
const HARD_ABBREVIATIONS = new Set([
  "mr", "mrs", "ms", "mx", "dr", "prof", "sr", "jr", "st", "mt", "ft", "fr", "rev", "hon", "pres",
  "gen", "gov", "lt", "col", "capt", "sgt", "cmdr", "adm", "sen", "rep", "supt",
  "e.g", "i.e", "cf", "vs", "viz", "approx", "ca", "c", "no", "nos", "vol", "vols", "fig", "figs",
  "p", "pp", "ch", "sec", "art", "op", "ed", "eds", "trans", "dept", "univ", "ave", "blvd", "rd",
  "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec",
  "a.m", "p.m", "b", "d", "u.s", "u.k", "u.n",
]);

/** End a sentence after these only when a capitalised word follows ("…and so on, etc. Then"). */
const SOFT_ABBREVIATIONS = new Set(["etc", "inc", "ltd", "co", "corp", "al", "bros", "llc", "plc"]);

const TERMINALS = ".!?…";
const CLOSERS = "\"'”’)]}»*_";
const OPENERS = "\"'“‘([{«";

function isUpperStart(ch: string | undefined): boolean {
  if (!ch) return false;
  return ch !== ch.toLowerCase() && ch === ch.toUpperCase();
}
function isLowerStart(ch: string | undefined): boolean {
  if (!ch) return false;
  return ch !== ch.toUpperCase() && ch === ch.toLowerCase();
}
function isSpace(ch: string | undefined): boolean {
  return ch !== undefined && /\s/.test(ch);
}

/** The word immediately before position `dot` (exclusive), without leading punctuation. */
function wordBefore(text: string, dot: number): string {
  let i = dot - 1;
  while (i >= 0 && !isSpace(text[i]) && !OPENERS.includes(text[i]) && text[i] !== "—" && text[i] !== "–") i--;
  return text.slice(i + 1, dot);
}

export function splitSentences(text: string): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  const n = text.length;
  let start = 0;

  const push = (s: number, e: number) => {
    while (s < e && isSpace(text[s])) s++;
    while (e > s && isSpace(text[e - 1])) e--;
    if (e > s) out.push([s, e]);
  };

  let i = 0;
  while (i < n) {
    const ch = text[i];

    if (ch === "\n") {
      push(start, i);
      start = i + 1;
      i++;
      continue;
    }

    if (!TERMINALS.includes(ch)) {
      i++;
      continue;
    }

    // Consume the whole terminal run ("?!", "...", "…") and any closing quotes/brackets.
    let j = i;
    while (j < n && TERMINALS.includes(text[j])) j++;
    const run = text.slice(i, j);
    while (j < n && CLOSERS.includes(text[j])) j++;

    if (j >= n) {
      push(start, j);
      start = j;
      i = j;
      break;
    }
    // A terminal must be followed by whitespace to end a sentence ("12.5", "a.m.").
    if (!isSpace(text[j])) {
      i = j;
      continue;
    }

    let k = j;
    while (k < n && isSpace(text[k]) && text[k] !== "\n") k++;
    const nextCh = text[k];
    const nextIsNewline = text[k] === "\n" || k >= n;
    let boundary = true;

    if (!nextIsNewline) {
      if (run === ".") {
        const word = wordBefore(text, i);
        const lower = word.toLowerCase();
        if (HARD_ABBREVIATIONS.has(lower)) boundary = false;
        else if (SOFT_ABBREVIATIONS.has(lower)) boundary = isUpperStart(nextCh) || OPENERS.includes(nextCh ?? "");
        else if (/^[A-Za-z]$/.test(word)) boundary = false; // initial: "J. K. Rowling"
        else if (/^(?:[A-Za-z]\.)+[A-Za-z]$/.test(word)) boundary = isUpperStart(nextCh); // "U.S.A." then a capital
        else if (isLowerStart(nextCh)) boundary = false; // "approx. five", "fig. b"
      } else if (run.includes("…") || run.startsWith("..")) {
        boundary = isUpperStart(nextCh) || OPENERS.includes(nextCh ?? "");
      } else if (isLowerStart(nextCh)) {
        boundary = false; // "Yahoo! is", "why? because"
      }
    }

    if (boundary) {
      push(start, j);
      start = j;
    }
    i = j;
  }
  if (start < n) push(start, n);
  return out;
}

/** Text as it should be spoken: symbols and bullets removed, ratios made speakable. */
export function toSpeechText(raw: string): string {
  return raw
    .replace(/\p{Extended_Pictographic}/gu, " ")
    .replace(/[✦✧◆◇★☆•·›‹»«→←↑↓⟶▸▹▶◀●○■□▪▫※¶§⚠︎️]/g, " ")
    .replace(/(\d)\s*\/\s*(\d)/g, "$1 slash $2")
    .replace(/(\d)\s*[×x]\s*(\d)/g, "$1 by $2")
    .replace(/\s×\s/g, " by ")
    .replace(/\s&\s/g, " and ")
    .replace(/[*_=`#|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split a long sentence into clause-sized parts for the speech engine (the
 * highlight stays on the whole sentence). Some engines, notably Chrome's
 * online voices, stop about 15 seconds into a single utterance.
 */
export function chunkForSpeech(text: string, max = 180): string[] {
  if (text.length <= max) return [text];
  const clauses = text.split(/(?<=[;:—–,)])\s+/);
  const parts: string[] = [];
  let cur = "";
  const pushWords = (piece: string) => {
    for (const word of piece.split(/\s+/)) {
      if (cur && cur.length + 1 + word.length > max) {
        parts.push(cur);
        cur = word;
      } else cur = cur ? `${cur} ${word}` : word;
    }
  };
  for (const clause of clauses) {
    if (cur && cur.length + 1 + clause.length > max) {
      parts.push(cur);
      cur = "";
    }
    if (clause.length > max) pushWords(clause);
    else cur = cur ? `${cur} ${clause}` : clause;
  }
  if (cur) parts.push(cur);
  return parts;
}

/** True when there is something worth saying (letters or digits). */
export function isSpeakable(text: string): boolean {
  return /[\p{L}\p{N}]/u.test(text);
}

/** Convenience for plain strings: the sentences themselves. */
export function sentencesOf(text: string): string[] {
  return splitSentences(text).map(([s, e]) => text.slice(s, e));
}
