import { useEffect } from "react";
import { Headphones, Pause, Play, Square, SkipBack, SkipForward } from "lucide-react";
import { readAloud } from "@/lib/read-aloud/engine";
import { useReadAloudState } from "@/hooks/use-read-aloud";
import { useToast } from "@/hooks/use-toast";

const OWNER = "read-aloud-dock";

/** What the floating button reads: an open dialog if there is one, else the page. */
function pageRoot(): HTMLElement | null {
  const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]'));
  return dialogs[dialogs.length - 1] ?? document.querySelector("main");
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
  const { toast } = useToast();

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
      ) : (
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
          <span className="mc-tts-count" style={{ color: "rgba(241,217,138,0.75)", fontSize: "0.66rem", fontVariantNumeric: "tabular-nums", padding: "0 0.3rem", fontFamily: "'Cinzel',serif" }}>
            {state.index + 1}/{state.total}
          </span>
          <button type="button" style={{ ...btn, color: "#fb7185" }} onClick={() => readAloud.stop()} aria-label="Stop reading">
            <Square size={14} />
          </button>
        </>
      )}
    </div>
  );
}
