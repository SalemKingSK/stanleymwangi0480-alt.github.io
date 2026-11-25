/**
 * Read-aloud engine: one reader for the whole app.
 *
 * It reads what is actually on screen. Given a root element it collects the
 * visible text, splits it into sentences (split-sentences.ts), and speaks
 * them one at a time. The voice is Kokoro "af_heart" (neural-voice.ts), run
 * on the device; until it has downloaded, or where it can't run, the
 * device's own Web Speech voice is used. Only the sentence being spoken
 * is highlighted, through the CSS Custom Highlight API, which paints DOM
 * Ranges without touching React's DOM. Browsers without that API fall back to
 * outlining the paragraph.
 *
 * - Only one reading runs at a time; starting another stops the first.
 * - Pause/resume restarts the current sentence: speechSynthesis.pause() is
 *   unreliable on Android and some desktops, and a sentence is short. (With
 *   the natural voice the sentence is already generated, so it's instant.)
 * - With the natural voice the next two sentences are generated while the
 *   current one plays.
 * - If the page changes while reading (an accordion opens, a tab re-renders),
 *   the sentence list is rebuilt and reading continues after the last spoken
 *   sentence.
 * - While reading, tapping a sentence inside the root jumps to it.
 */
import { splitSentences, toSpeechText, isSpeakable, chunkForSpeech } from "./split-sentences";
import { neuralVoice } from "./neural-voice";
import { voiceSettings } from "./voice-settings";

export interface TtsSentence {
  ranges: Range[];
  /** Blocks containing the sentence (for the no-Highlight-API fallback). */
  blocks: Element[];
  /** Displayed text. */
  text: string;
  /** Text sent to the speech engine. */
  speech: string;
}

export type ReaderStatus = "idle" | "playing" | "paused";

export interface ReaderState {
  status: ReaderStatus;
  owner: string | null;
  index: number;
  total: number;
}

const HIGHLIGHT_NAME = "mc-tts";
const FALLBACK_CLASS = "mc-tts-fallback";

/** Never read these (controls, hidden UI, graphics). */
const SKIP_SELECTOR = [
  "button",
  '[role="button"]',
  '[role="tab"]',
  '[role="tablist"]',
  '[role="menu"]',
  '[role="tooltip"]',
  "select",
  "option",
  "input",
  "textarea",
  "label",
  "script",
  "style",
  "noscript",
  "template",
  "svg",
  "canvas",
  "iframe",
  "nav",
  '[aria-hidden="true"]',
  "[hidden]",
  "[data-tts-skip]",
  "[inert]",
].join(",");

// ── Sentence collection ─────────────────────────────────────────────────────

/** Used only when an engine reports no computed display. */
const INLINE_TAGS = new Set(["A", "ABBR", "B", "BDI", "BDO", "CITE", "CODE", "DATA", "DFN", "EM", "I", "KBD", "MARK", "Q", "S", "SAMP", "SMALL", "SPAN", "STRONG", "SUB", "SUP", "TIME", "U", "VAR", "FONT"]);

interface RawSentence {
  range: Range;
  block: Element;
  text: string;
}

function wordCount(t: string): number {
  return t.split(/\s+/).filter(Boolean).length;
}
function endsSentence(t: string): boolean {
  return /[.!?…;]["'”’)\]]*$/.test(t.trim());
}
function isLabel(t: string): boolean {
  return /:\s*$/.test(t) && wordCount(t) <= 5;
}
function isFragment(t: string): boolean {
  return !endsSentence(t) && !isLabel(t) && wordCount(t) <= 5;
}

export function collectSentences(root: HTMLElement): TtsSentence[] {
  const styleCache = new Map<Element, CSSStyleDeclaration>();
  const style = (el: Element) => {
    let s = styleCache.get(el);
    if (!s) {
      s = getComputedStyle(el);
      styleCache.set(el, s);
    }
    return s;
  };
  const blockOf = (el: Element | null): Element => {
    let cur = el;
    while (cur && cur !== root) {
      const d = style(cur).display;
      const inline = d === "inline" || d === "contents" || (!d && INLINE_TAGS.has(cur.tagName));
      if (!inline) return cur;
      cur = cur.parentElement;
    }
    return root;
  };

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.nodeType === Node.TEXT_NODE) return NodeFilter.FILTER_ACCEPT;
      const el = node as Element;
      if (el.matches(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
      const s = style(el);
      if (s.display === "none" || s.visibility === "hidden" || s.visibility === "collapse") return NodeFilter.FILTER_REJECT;
      if (el.tagName === "BR") return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    },
  });

  const raw: RawSentence[] = [];
  let pieces: Array<{ node: Text; start: number; end: number }> = [];
  let buf = "";
  let block: Element | null = null;

  const locate = (offset: number, isEnd: boolean) => {
    for (const p of pieces) {
      if (isEnd ? offset > p.start && offset <= p.end : offset >= p.start && offset < p.end) {
        return { node: p.node, offset: offset - p.start };
      }
    }
    return null;
  };

  const flush = () => {
    if (block && buf.trim()) {
      for (const [s, e] of splitSentences(buf)) {
        const text = buf.slice(s, e).replace(/\s+/g, " ").trim();
        if (!isSpeakable(text)) continue;
        const a = locate(s, false);
        const b = locate(e, true);
        if (!a || !b) continue;
        const range = document.createRange();
        try {
          range.setStart(a.node, a.offset);
          range.setEnd(b.node, b.offset);
        } catch {
          continue;
        }
        raw.push({ range, block, text });
      }
    }
    pieces = [];
    buf = "";
    block = null;
  };

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      flush(); // <br>
      continue;
    }
    const textNode = node as Text;
    const parent = textNode.parentElement;
    if (!parent) continue;
    const b = blockOf(parent);
    if (b !== block) {
      flush();
      block = b;
    }
    pieces.push({ node: textNode, start: buf.length, end: buf.length + textNode.data.length });
    // A line break in the source is only a sentence end when it is displayed
    // as one; otherwise the browser shows it as a space. (Same length, so
    // offsets still map onto the text node.)
    const ws = style(parent).whiteSpace;
    buf += /^(pre|pre-wrap|pre-line|break-spaces)$/.test(ws) ? textNode.data : textNode.data.replace(/\n/g, " ");
  }
  flush();

  // Merge labels and short fragments from neighbouring blocks into one
  // utterance ("Life Path" + "7" → "Life Path, 7"; "Lesson:" + sentence).
  const out: TtsSentence[] = [];
  for (let i = 0; i < raw.length; i++) {
    const cur: TtsSentence = { ranges: [raw[i].range], blocks: [raw[i].block], text: raw[i].text, speech: "" };
    while (i + 1 < raw.length) {
      const next = raw[i + 1];
      if (next.block === cur.blocks[cur.blocks.length - 1]) break;
      const label = isLabel(cur.text);
      const bothFragments = isFragment(cur.text) && isFragment(next.text) && wordCount(cur.text) + wordCount(next.text) <= 12;
      if (!label && !bothFragments) break;
      cur.text = label ? `${cur.text} ${next.text}` : `${cur.text}, ${next.text}`;
      cur.ranges.push(next.range);
      cur.blocks.push(next.block);
      i++;
      if (label) break;
    }
    cur.speech = toSpeechText(cur.text);
    if (isSpeakable(cur.speech)) out.push(cur);
  }
  return out;
}

// ── Highlight + scroll ──────────────────────────────────────────────────────

type HighlightCtor = new (...ranges: Range[]) => unknown;
function highlightApi(): { registry: Map<string, unknown>; Ctor: HighlightCtor } | null {
  const g = globalThis as unknown as { CSS?: { highlights?: Map<string, unknown> }; Highlight?: HighlightCtor };
  if (g.CSS?.highlights && typeof g.Highlight === "function") return { registry: g.CSS.highlights, Ctor: g.Highlight };
  return null;
}

let fallbackBlocks: Element[] = [];
function paint(sentence: TtsSentence | null) {
  const api = highlightApi();
  if (api) {
    if (sentence) api.registry.set(HIGHLIGHT_NAME, new api.Ctor(...sentence.ranges));
    else api.registry.delete(HIGHLIGHT_NAME);
    return;
  }
  fallbackBlocks.forEach((b) => b.classList.remove(FALLBACK_CLASS));
  fallbackBlocks = sentence ? sentence.blocks : [];
  fallbackBlocks.forEach((b) => b.classList.add(FALLBACK_CLASS));
}

function prefersReducedMotion(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function bringIntoView(sentence: TtsSentence) {
  const range = sentence.ranges[0];
  const rect = range.getBoundingClientRect();
  if (!rect.width && !rect.height) return;
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";

  // Inner scroll box first (long readings sit in scrollable panels).
  let el: Element | null = range.startContainer.parentElement;
  while (el && el !== document.body && el !== document.documentElement) {
    const s = getComputedStyle(el);
    if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 4) {
      const box = el.getBoundingClientRect();
      if (rect.top < box.top + 8 || rect.bottom > box.bottom - 8) {
        el.scrollBy({ top: rect.top - box.top - box.height * 0.3, behavior });
        return;
      }
      break;
    }
    el = el.parentElement;
  }

  const vh = window.innerHeight;
  if (rect.top < 72 || rect.bottom > vh - 150) {
    window.scrollBy({ top: rect.top - vh * 0.35, behavior });
  }
}

function caretPoint(x: number, y: number): { node: Node; offset: number } | null {
  const d = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  if (d.caretPositionFromPoint) {
    const p = d.caretPositionFromPoint(x, y);
    return p ? { node: p.offsetNode, offset: p.offset } : null;
  }
  if (d.caretRangeFromPoint) {
    const r = d.caretRangeFromPoint(x, y);
    return r ? { node: r.startContainer, offset: r.startOffset } : null;
  }
  return null;
}

/**
 * The device voice to use: the one chosen in the voice menu if it speaks this
 * language, else an installed voice for the language (devices set to another
 * language may default to it).
 */
function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices?.() ?? [];
  if (!voices.length) return null;
  const norm = (l: string) => l.replace("_", "-").toLowerCase();
  const want = norm(lang);
  const base = want.split("-")[0];
  const chosenUri = voiceSettings.get().deviceVoice;
  const chosen = chosenUri ? voices.find((v) => v.voiceURI === chosenUri) : undefined;
  if (chosen && norm(chosen.lang).split("-")[0] === base) return chosen;
  const exact = voices.filter((v) => norm(v.lang) === want);
  const sameBase = voices.filter((v) => norm(v.lang).split("-")[0] === base);
  const pool = exact.length ? exact : sameBase;
  if (!pool.length) return null;
  return pool.find((v) => v.default) ?? pool.find((v) => v.localService) ?? pool[0];
}

function rangeAlive(r: Range): boolean {
  return r.startContainer.isConnected && r.endContainer.isConnected && !r.collapsed;
}

// ── Controller ──────────────────────────────────────────────────────────────

/** How long to wait for the natural voice before the device voice steps in. */
const NATURAL_WAIT_MS = 2500;

export interface StartOptions {
  /** Start at the first sentence visible on screen (global reader). */
  fromVisible?: boolean;
  lang?: string;
  /** Base speaking rate for device voices (the listener's speed setting multiplies it). */
  rate?: number;
}

const PREVIEW_TEXT = "Hello. This is how I'll sound reading your profile.";

class ReadAloudController {
  private state: ReaderState = { status: "idle", owner: null, index: 0, total: 0 };
  private listeners = new Set<(s: ReaderState) => void>();
  private sentences: TtsSentence[] = [];
  private root: HTMLElement | null = null;
  private generation = 0;
  private utterance: SpeechSynthesisUtterance | null = null; // kept to avoid Chrome GC'ing it mid-speech
  private observer: MutationObserver | null = null;
  private dirty = false;
  private lastEnd: { node: Node; offset: number } | null = null;
  private lang = "en-US";
  private rate = 0.95;
  private onError: ((message: string) => void) | null = null;
  private delayNextSpeak = false;

  /** The device has a Web Speech voice. */
  get hasSystemVoice(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
  }

  get supported(): boolean {
    return this.hasSystemVoice || neuralVoice.getState().status !== "unsupported";
  }

  getState(): ReaderState {
    return this.state;
  }

  subscribe(fn: (s: ReaderState) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  setErrorHandler(fn: ((message: string) => void) | null) {
    this.onError = fn;
  }

  private set(patch: Partial<ReaderState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((fn) => fn(this.state));
  }

  isOwner(owner: string): boolean {
    return this.state.owner === owner && this.state.status !== "idle";
  }

  start(owner: string, root: HTMLElement, opts: StartOptions = {}) {
    if (!this.supported) return;
    try {
      this.begin(owner, root, opts);
    } catch (err) {
      this.stop();
      this.onError?.(`Couldn't start reading: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  private begin(owner: string, root: HTMLElement, opts: StartOptions) {
    const synth = this.hasSystemVoice ? window.speechSynthesis : null;
    this.delayNextSpeak = !!synth && (synth.speaking || synth.pending); // switching from another reading
    this.stop();
    this.root = root;
    this.lang = opts.lang ?? "en-US";
    this.rate = opts.rate ?? 0.95;
    if (neuralVoice.wanted(this.lang)) {
      neuralVoice.unlock(); // still inside the tap
      neuralVoice.autoLoad();
    }
    this.sentences = collectSentences(root);
    if (!this.sentences.length) {
      this.onError?.("There's no text to read here yet.");
      return;
    }
    this.observe();
    root.addEventListener("click", this.handleClick, true);

    let index = 0;
    if (opts.fromVisible) {
      const found = this.sentences.findIndex((s) => {
        const r = s.ranges[0].getBoundingClientRect();
        return r.bottom > 72 && r.top < window.innerHeight - 40;
      });
      index = found >= 0 ? found : 0;
    }
    this.set({ status: "playing", owner, index, total: this.sentences.length });
    this.speak(index);
  }

  pause() {
    if (this.state.status !== "playing") return;
    this.generation++;
    this.silence();
    this.set({ status: "paused" });
  }

  resume() {
    if (this.state.status !== "paused") return;
    if (neuralVoice.wanted(this.lang)) neuralVoice.unlock();
    this.set({ status: "playing" });
    this.refreshIfDirty();
    this.speak(Math.min(this.state.index, this.sentences.length - 1));
  }

  toggle() {
    if (this.state.status === "playing") this.pause();
    else if (this.state.status === "paused") this.resume();
  }

  next() {
    if (this.state.status === "idle") return;
    this.refreshIfDirty();
    this.jump(Math.min(this.state.index + 1, this.sentences.length - 1));
  }

  prev() {
    if (this.state.status === "idle") return;
    this.refreshIfDirty();
    this.jump(Math.max(this.state.index - 1, 0));
  }

  /** Switch between the natural voice and the device voice (remembered). */
  setNaturalVoice(on: boolean) {
    neuralVoice.setEnabled(on);
    this.voiceChanged();
  }

  /**
   * Call (inside the tap) after the voice, speed or pitch changed: a reading
   * restarts its sentence in the new voice; otherwise a short sample plays.
   */
  voiceChanged() {
    if (neuralVoice.wanted(this.lang)) neuralVoice.unlock();
    if (this.state.status === "playing") {
      this.speak(this.state.index);
      return;
    }
    if (this.state.status === "paused") return; // used on resume
    this.preview();
  }

  private preview() {
    const gen = ++this.generation;
    const busy = this.hasSystemVoice && (window.speechSynthesis.speaking || window.speechSynthesis.pending);
    this.silence();
    const lang = "en-US";
    if (neuralVoice.usable(lang)) {
      neuralVoice
        .want([PREVIEW_TEXT], voiceSettings.get().rate)[0]
        .then((clip) => {
          if (gen === this.generation) return neuralVoice.play(clip);
        })
        .catch(() => {});
      return;
    }
    if (neuralVoice.wanted(lang)) void neuralVoice.load().catch(() => {}); // chosen: fetch it now
    if (!this.hasSystemVoice || neuralVoice.wanted(lang)) return;
    const u = new SpeechSynthesisUtterance(PREVIEW_TEXT);
    const { rate, pitch } = voiceSettings.get();
    u.lang = lang;
    u.rate = Math.min(2, Math.max(0.3, 0.95 * rate));
    u.pitch = pitch;
    const voice = pickVoice(lang);
    if (voice) u.voice = voice;
    this.utterance = u;
    // Speak now when nothing was playing (iOS needs it inside the tap);
    // after a cancel(), some engines drop a speak() in the same tick.
    if (!busy) window.speechSynthesis.speak(u);
    else
      setTimeout(() => {
        if (gen === this.generation) window.speechSynthesis.speak(u);
      }, 60);
  }

  private silence() {
    neuralVoice.stopPlayback();
    if (this.hasSystemVoice) window.speechSynthesis.cancel();
  }

  stop() {
    this.generation++;
    this.silence();
    this.utterance = null;
    this.observer?.disconnect();
    this.observer = null;
    this.root?.removeEventListener("click", this.handleClick, true);
    this.root = null;
    this.sentences = [];
    this.lastEnd = null;
    paint(null);
    if (this.state.status !== "idle" || this.state.owner) this.set({ status: "idle", owner: null, index: 0, total: 0 });
  }

  private jump(index: number) {
    if (neuralVoice.wanted(this.lang)) neuralVoice.unlock();
    this.set({ status: "playing" });
    this.speak(index);
  }

  private observe() {
    if (!this.root || typeof MutationObserver === "undefined") return;
    this.dirty = false;
    this.observer = new MutationObserver(() => {
      this.dirty = true;
    });
    this.observer.observe(this.root, { childList: true, subtree: true, characterData: true });
  }

  /** Rebuild after DOM changes; keep the position by the last spoken sentence. */
  private refreshIfDirty(): boolean {
    if (!this.dirty || !this.root) return false;
    this.dirty = false;
    if (!this.root.isConnected) {
      this.stop();
      return true;
    }
    const current = this.sentences[this.state.index];
    const fresh = collectSentences(this.root);
    let index = -1;
    if (current && rangeAlive(current.ranges[0])) {
      const start = current.ranges[0];
      index = fresh.findIndex((s) => s.ranges[0].compareBoundaryPoints(Range.START_TO_START, start) >= 0);
    }
    if (index < 0 && current) index = fresh.findIndex((s) => s.text === current.text);
    this.sentences = fresh;
    this.set({ index: Math.max(0, index), total: fresh.length });
    return true;
  }

  /** Index of the first sentence after the last spoken one (after a rebuild). */
  private indexAfterLastEnd(fallback: number): number {
    if (!this.lastEnd || !this.lastEnd.node.isConnected) return fallback;
    const { node, offset } = this.lastEnd;
    const found = this.sentences.findIndex((s) => {
      try {
        return s.ranges[0].comparePoint(node, offset) <= 0 && !s.ranges[0].isPointInRange(node, offset);
      } catch {
        return false;
      }
    });
    return found >= 0 ? found : fallback;
  }

  private speak(index: number) {
    if (!this.root) return;
    if (this.dirty) {
      this.refreshIfDirty();
      if (!this.root) return;
      index = this.indexAfterLastEnd(Math.min(index, this.sentences.length));
    }
    if (index >= this.sentences.length) {
      this.stop();
      return;
    }
    let sentence = this.sentences[index];
    if (!rangeAlive(sentence.ranges[0])) {
      this.dirty = true;
      this.refreshIfDirty();
      if (!this.root || !this.sentences.length) return this.stop();
      index = Math.min(this.indexAfterLastEnd(index), this.sentences.length - 1);
      sentence = this.sentences[index];
    }

    const gen = ++this.generation;
    this.set({ index, total: this.sentences.length });
    paint(sentence);
    bringIntoView(sentence);

    if (neuralVoice.usable(this.lang)) {
      if (this.hasSystemVoice) window.speechSynthesis.cancel();
      this.speakNatural(sentence, index, gen);
      return;
    }
    neuralVoice.stopPlayback();
    if (!this.hasSystemVoice) {
      // No device voice: wait for the natural voice to finish downloading.
      neuralVoice.load().then(
        () => {
          if (gen === this.generation) this.speak(index);
        },
        (err: Error) => {
          if (gen !== this.generation) return;
          this.stop();
          this.onError?.(`The voice couldn't load: ${err.message}`);
        },
      );
      return;
    }
    this.speakSystem(sentence, index, gen);
  }

  /** Called when a sentence has been fully spoken. */
  private finished(sentence: TtsSentence, index: number) {
    const last = sentence.ranges[sentence.ranges.length - 1];
    if (rangeAlive(last)) this.lastEnd = { node: last.endContainer, offset: last.endOffset };
    this.speak(index + 1);
  }

  private speakNatural(sentence: TtsSentence, index: number, gen: number) {
    const ahead = [sentence.speech];
    for (let i = index + 1; i < Math.min(index + 3, this.sentences.length); i++) ahead.push(this.sentences[i].speech);
    const parts = neuralVoice.partsOf(sentence.speech);
    const clips = neuralVoice.want(ahead, voiceSettings.get().rate);

    // Play each part as soon as it's ready. If a part isn't ready in time,
    // the device voice says the rest of the sentence, so reading never goes
    // quiet; repeated stalls switch the natural voice off for this device.
    const playPart = (p: number) => {
      let settled = false;
      const rest = () => parts.slice(p).join(" ");
      const timer = this.hasSystemVoice
        ? setTimeout(() => {
            if (settled || gen !== this.generation) return;
            settled = true;
            neuralVoice.reportStall();
            this.speakSystem(sentence, index, gen, rest());
          }, NATURAL_WAIT_MS)
        : null;
      const settle = () => {
        if (settled) return false;
        settled = true;
        if (timer) clearTimeout(timer);
        return gen === this.generation;
      };
      const fallBack = () => {
        neuralVoice.reportFailure();
        // Say the rest with the device voice instead.
        if (this.hasSystemVoice) return this.speakSystem(sentence, index, gen, rest());
        this.stop();
        this.onError?.("Speech stopped: the voice couldn't read this part.");
      };
      clips[p].then(
        (clip) => {
          if (!settle()) return;
          neuralVoice.reportOnTime();
          neuralVoice.play(clip).then(
            () => {
              if (gen !== this.generation) return;
              if (p + 1 < clips.length) playPart(p + 1);
              else this.finished(sentence, index);
            },
            () => {
              if (gen === this.generation) fallBack();
            },
          );
        },
        () => {
          if (settle()) fallBack();
        },
      );
    };
    playPart(0);
  }

  private speakSystem(sentence: TtsSentence, index: number, gen: number, text = sentence.speech) {
    const synth = window.speechSynthesis;
    const parts = chunkForSpeech(text);
    const sayPart = (p: number) => {
      const u = new SpeechSynthesisUtterance(parts[p]);
      u.lang = this.lang;
      const { rate, pitch } = voiceSettings.get();
      u.rate = Math.min(2, Math.max(0.3, this.rate * rate));
      u.pitch = pitch;
      const voice = pickVoice(this.lang);
      if (voice) u.voice = voice;
      u.onend = () => {
        if (gen !== this.generation) return;
        if (p + 1 < parts.length) return sayPart(p + 1);
        this.finished(sentence, index);
      };
      u.onerror = (e) => {
        if (gen !== this.generation) return;
        if (e.error === "interrupted" || e.error === "canceled") return;
        this.stop();
        this.onError?.(`Speech stopped: ${e.error}`);
      };
      this.utterance = u;
      synth.speak(u);
    };
    const delay = this.delayNextSpeak;
    this.delayNextSpeak = false;
    if (!delay && !synth.speaking && !synth.pending) {
      // Nothing to interrupt: speak now. iOS Safari only allows speech that
      // starts synchronously inside the tap that asked for it.
      if (synth.paused) synth.resume();
      sayPart(0);
      return;
    }
    synth.cancel();
    if (synth.paused) synth.resume();
    // Some engines drop a speak() issued in the same tick as cancel().
    setTimeout(() => {
      if (gen === this.generation) sayPart(0);
    }, 30);
  }

  private handleClick = (ev: MouseEvent) => {
    if (this.state.status === "idle") return;
    const target = ev.target as Element | null;
    if (target?.closest("a,button,input,select,textarea,label,[role='button'],[role='tab'],[data-tts-skip]")) return;
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) return; // the user is selecting text
    const p = caretPoint(ev.clientX, ev.clientY);
    if (!p) return;
    this.refreshIfDirty();
    const i = this.sentences.findIndex((s) =>
      s.ranges.some((r) => {
        try {
          return r.isPointInRange(p.node, p.offset);
        } catch {
          return false;
        }
      }),
    );
    if (i >= 0) this.jump(i);
  };
}

export const readAloud = new ReadAloudController();

/** Stop any reading (tab switches, closing results). */
export function stopReadAloud() {
  readAloud.stop();
}
