import React, { useCallback, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, FastForward, Rewind, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { readAloud } from "@/lib/read-aloud/engine";
import { useReadAloudState } from "@/hooks/use-read-aloud";

interface Props {
  /** Element whose visible text is read. Defaults to the nearest
   * `[data-tts-scope]` ancestor, else the closest ancestor holding the text. */
  targetRef?: React.RefObject<HTMLElement | null>;
  /** Used only to find the right container when no scope is marked. */
  text?: string;
  /** Legacy props, kept so older call sites compile; reading now follows the DOM. */
  sentences?: string[];
  onBoundary?: (index: number) => void;
  onEnd?: () => void;
  lang?: string;
}

function textLength(el: Element, exclude: Element): number {
  let n = 0;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    if (!exclude.contains(t)) n += (t as Text).data.trim().length;
  }
  return n;
}

function resolveRoot(wrapper: HTMLElement, text?: string): HTMLElement | null {
  const scoped = wrapper.closest<HTMLElement>("[data-tts-scope]");
  if (scoped) return scoped;
  const want = Math.max(40, Math.min(400, Math.round((text?.trim().length ?? 0) * 0.5)));
  let el = wrapper.parentElement;
  for (let hops = 0; el && hops < 8; hops++, el = el.parentElement) {
    if (textLength(el, wrapper) >= want) return el;
  }
  return wrapper.parentElement;
}

/**
 * Per-field Listen button. Reads the field one sentence at a time and
 * highlights only the sentence being spoken.
 */
export const SpeechPlayer: React.FC<Props> = ({ targetRef, text, onEnd, lang = "en-US" }) => {
  const owner = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const state = useReadAloudState();
  const mine = state.owner === owner && state.status !== "idle";
  const wasMine = useRef(false);

  React.useEffect(() => {
    if (wasMine.current && !mine) onEnd?.();
    wasMine.current = mine;
  }, [mine, onEnd]);

  React.useEffect(() => () => {
    if (readAloud.isOwner(owner)) readAloud.stop();
  }, [owner]);

  const start = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const root = targetRef?.current ?? resolveRoot(wrapper, text);
    if (root) readAloud.start(owner, root, { lang });
  }, [owner, targetRef, text, lang]);

  if (!readAloud.supported) return null;

  return (
    <motion.div
      ref={wrapperRef}
      data-tts-skip
      initial={false}
      animate={{ width: mine ? "auto" : "120px" }}
      className="flex items-center bg-primary/10 border border-primary/20 rounded-full p-1 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {!mine ? (
          <motion.div key="idle" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="w-full">
            <Button
              onClick={start}
              variant="ghost"
              size="sm"
              aria-label="Listen: read this section aloud"
              className="w-full rounded-full hover:bg-primary/20 text-primary font-cinzel text-[0.7rem] tracking-widest uppercase py-0 h-8"
            >
              <Volume2 className="h-3 w-3 mr-2" />
              Listen
            </Button>
          </motion.div>
        ) : (
          <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-1 px-1">
            <Button variant="ghost" size="icon" aria-label="Previous sentence" className="h-8 w-8 rounded-full text-primary/70 hover:text-primary hover:bg-primary/10" onClick={() => readAloud.prev()}>
              <Rewind className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => readAloud.toggle()}
              variant="default"
              size="icon"
              aria-label={state.status === "playing" ? "Pause" : "Resume"}
              className="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              {state.status === "playing" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Next sentence" className="h-8 w-8 rounded-full text-primary/70 hover:text-primary hover:bg-primary/10" onClick={() => readAloud.next()}>
              <FastForward className="h-4 w-4" />
            </Button>
            <span className="text-[0.62rem] tabular-nums text-primary/60 px-1 font-cinzel" aria-live="off">
              {state.index + 1}/{state.total}
            </span>
            <div className="w-px h-4 bg-primary/20 mx-0.5" />
            <Button variant="ghost" size="icon" aria-label="Stop reading" className="h-8 w-8 rounded-full text-rose-400 hover:text-rose-500 hover:bg-rose-500/10" onClick={() => readAloud.stop()}>
              <Square className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
