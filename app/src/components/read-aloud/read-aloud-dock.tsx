import { onAppIdle } from "@/lib/app-loading";
import { useCallback, useEffect, useState } from "react";
import { AudioLines, Headphones, Pause, Play, Square, SkipBack, SkipForward } from "lucide-react";
import { readAloud, type ReadTarget } from "@/lib/read-aloud/engine";
import { neuralVoice } from "@/lib/read-aloud/neural-voice";
import { voiceSettings } from "@/lib/read-aloud/voice-settings";
import { useReadAloudState } from "@/hooks/use-read-aloud";
import { useNeuralVoiceState } from "@/hooks/use-neural-voice";
import { useToast } from "@/hooks/use-toast";
import { VoicePicker } from "./voice-picker";

const OWNER = "read-aloud-dock";

/** What the floating button reads: an open dialog if there is one, else the page. */
function pageRoot(): HTMLElement | null {
  const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]'));
  return dialogs[dialogs.length - 1] ?? document.querySelector("main");
}

/** On screen (at least partly), below the header and above the dock. */
function onScreen(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > 72 && r.top < window.innerHeight - 40 && r.width > 0;
}

/** Where a Listen tap would start right now: this button, then the fields on screen. */
function likelyTargets(): ReadTarget[] {
  const targets: ReadTarget[] = [];
  const root = pageRoot();
  if (root) targets.push({ root, fromVisible: true });
  const scopes = Array.from((root ?? document).querySelectorAll<HTMLElement>("[data-tts-scope]")).filter(onScreen);
  for (const scope of scopes.slice(0, 3)) targets.push({ root: scope });
  return targets;
}

const idle = (fn: () => void) => {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 1500 });
  else setTimeout(fn, 50);
};

/**
 * Gets the voice ready before Listen is tapped: prepares the audio output on
 * the first touch, starts the app's voice (fetching it the first time) once
 * the app has settled (not on low battery), then — whenever nothing is
 * being read and the screen has settled (after scrolling, a tap, a voice or
 * speed change) — prepares the first sentence each Listen button would read.
 */
function usePrepareVoice() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const prepare = () => {
      timer = null;
      if (document.visibilityState === "hidden") return;
      idle(() => {
        void neuralVoice.warmUp(); // if it held off earlier (the reading was loading)
        try {
          readAloud.prefetch(likelyTargets());
        } catch {
          /* best effort */
        }
      });
    };
    const schedule = (ms = 700) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(prepare, ms);
    };
    const onScroll = () => schedule();
    const onTap = () => schedule(900);
    const onFirstTouch = () => neuralVoice.primeAudio();
    const onShow = () => {
      if (document.visibilityState !== "visible") return;
      void neuralVoice.warmUp();
      schedule();
    };
    const warm = setTimeout(() => idle(() => void neuralVoice.warmUp()), 1200);
    schedule(1500); // the voice may already be ready (warmed while hidden)
    let wasReady = neuralVoice.getState().status === "ready";
    const offVoice = neuralVoice.subscribe((s) => {
      const ready = s.status === "ready";
      if (ready && !wasReady) schedule(200);
      wasReady = ready;
    });
    const offReader = readAloud.subscribe((s) => {
      if (s.status === "idle") schedule(1000);
    });
    const offSettings = voiceSettings.subscribe(() => schedule(1500));
    const offIdle = onAppIdle(() => schedule(1500)); // the reading arrived: carry on preparing
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("click", onTap, true);
    document.addEventListener("pointerdown", onFirstTouch, { capture: true, once: true });
    document.addEventListener("visibilitychange", onShow);
    return () => {
      clearTimeout(warm);
      if (timer) clearTimeout(timer);
      offVoice();
      offReader();
      offSettings();
      offIdle();
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", onTap, true);
      document.removeEventListener("pointerdown", onFirstTouch, true);
      document.removeEventListener("visibilitychange", onShow);
    };
  }, []);
}

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 34,
  height: 34,
  borderRadius: 999,
  border: "none",
  background: "transparent",
  color: "#f1d98a",
  cursor: "pointer",
};

/**
 * Floating "Listen" button, bottom centre of every screen. Reads everything visible, from the
 * first sentence on screen, one sentence at a time with highlighting,
 * including fields that have no Listen button of their own. While any
 * reading runs (this one or a field's), it shows the controls.
 */
export function ReadAloudDock() {
  const state = useReadAloudState();
  const voice = useNeuralVoiceState();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  usePrepareVoice();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    readAloud.setErrorHandler((message) => toast({ title: "Read aloud", description: message }));
    const onHide = () => {
      if (document.visibilityState === "hidden" && readAloud.getState().status === "playing") readAloud.pause();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      readAloud.setErrorHandler(null);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [toast]);

  if (!readAloud.supported) return null;
  const active = state.status !== "idle";
  // Shown above the controls while the voice downloads or prepares speech.
  const voiceNote = !active
    ? null
    : voice.status === "loading"
      ? voice.progress >= 0.999
        ? "Starting the voice…"
        : `Getting the voice ready… ${Math.round(voice.progress * 100)}% (first time only)`
      : state.waiting && state.status === "playing"
        ? "Preparing speech…"
        : null;
  const voiceButton = (
    <button
      type="button"
      data-voice-toggle
      style={{ ...btn, color: menuOpen ? "#1a0d33" : "#f1d98a", background: menuOpen ? "rgba(241,217,138,0.85)" : "transparent" }}
      onClick={() => setMenuOpen((o) => !o)}
      aria-expanded={menuOpen}
      aria-haspopup="dialog"
      aria-label="Voice and speed"
      title="Voice and speed"
    >
      <AudioLines size={16} />
    </button>
  );

  return (
    <div
      data-tts-skip
      role="region"
      aria-label="Read aloud"
      style={{
        position: "fixed",
        // Bottom centre, in line with the back / history buttons (bottom-6),
        // so it never covers the PDF and history buttons on the right.
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "max(24px, env(safe-area-inset-bottom))",
        zIndex: 45,
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: active ? "0.2rem 0.35rem" : 0,
        borderRadius: 999,
        background: "linear-gradient(135deg, rgba(20,10,45,0.96), rgba(60,24,110,0.96))",
        border: "1px solid rgba(212,175,55,0.45)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
      }}
    >
      {!active ? (
        <button
          type="button"
          onClick={() => {
            const root = pageRoot();
            if (root) readAloud.start(OWNER, root, { fromVisible: true });
          }}
          aria-label="Listen: read this screen aloud from here"
          title="Read this screen aloud, one sentence at a time"
          style={{ ...btn, width: "auto", height: 42, padding: "0 1rem", gap: 8, fontFamily: "'Cinzel',serif", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}
        >
          <Headphones size={16} />
          Listen
        </button>
      ) : null}
      {!active && <span style={{ paddingRight: 4, display: "inline-flex" }}>{voiceButton}</span>}
      {active && (
        <>
          <button type="button" style={btn} onClick={() => readAloud.prev()} aria-label="Previous sentence">
            <SkipBack size={16} />
          </button>
          <button
            type="button"
            style={{ ...btn, background: "#d4af37", color: "#1a0d33" }}
            onClick={() => readAloud.toggle()}
            aria-label={state.status === "playing" ? "Pause" : "Resume"}
          >
            {state.status === "playing" ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
          </button>
          <button type="button" style={btn} onClick={() => readAloud.next()} aria-label="Next sentence">
            <SkipForward size={16} />
          </button>
          {voiceButton}
          <span className="mc-tts-count" style={{ color: "rgba(241,217,138,0.75)", fontSize: "0.66rem", fontVariantNumeric: "tabular-nums", padding: "0 0.3rem", fontFamily: "'Cinzel',serif" }}>
            {state.index + 1}/{state.total}
          </span>
          <button type="button" style={{ ...btn, color: "#fb7185" }} onClick={() => readAloud.stop()} aria-label="Stop reading">
            <Square size={14} />
          </button>
        </>
      )}
      {menuOpen && <VoicePicker onClose={closeMenu} />}
      {voiceNote && !menuOpen && (
        <div
          role="status"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            maxWidth: "92vw",
            overflow: "hidden",
            textOverflow: "ellipsis",
            padding: "0.2rem 0.6rem",
            borderRadius: 999,
            background: "rgba(20,10,45,0.92)",
            border: "1px solid rgba(212,175,55,0.3)",
            color: "rgba(241,217,138,0.85)",
            fontSize: "0.62rem",
          }}
        >
          {voiceNote}
        </div>
      )}
    </div>
  );
}
