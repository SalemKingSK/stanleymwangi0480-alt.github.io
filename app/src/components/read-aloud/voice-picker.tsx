import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { readAloud } from "@/lib/read-aloud/engine";
import { voiceSettings, APP_VOICE } from "@/lib/read-aloud/voice-settings";
import { useNeuralVoiceState } from "@/hooks/use-neural-voice";
import { useVoiceSettings } from "@/hooks/use-voice-settings";

const gold = "#f1d98a";
const dim = "rgba(241,217,138,0.6)";

const sectionTitle: React.CSSProperties = {
  margin: "0.7rem 0 0.3rem",
  fontFamily: "'Cinzel',serif",
  fontSize: "0.62rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: dim,
};

/**
 * Voice menu for the read-aloud player: the app's voice (Jenny, credited as
 * its licence asks), its status, and the reading speed. Changing the speed
 * plays it straight away (restarting the current sentence, or a short sample).
 */
export function VoicePicker({ onClose }: { onClose: () => void }) {
  const voice = useNeuralVoiceState();
  const settings = useVoiceSettings();
  const panel = useRef<HTMLDivElement>(null);
  const restart = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (panel.current && t && !panel.current.contains(t) && !t.closest("[data-voice-toggle]")) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      if (restart.current) clearTimeout(restart.current);
    };
  }, [onClose]);

  // Speed: apply after the thumb settles, not on every step.
  const setRate = (rate: number) => {
    voiceSettings.set({ rate });
    if (restart.current) clearTimeout(restart.current);
    restart.current = setTimeout(() => readAloud.voiceChanged(), 450);
  };

  const status =
    voice.status === "ready"
      ? "Ready · works offline"
      : voice.status === "loading"
        ? voice.progress >= 0.999
          ? "Starting the voice…"
          : `Getting the voice ready… ${Math.round(voice.progress * 100)}% (first time only)`
        : voice.status === "error"
          ? `The voice couldn't load${voice.error ? ` (${voice.error})` : ""}. Check your connection; tap Listen to try again.`
          : "Gets ready by itself when the app opens.";

  return (
    <div
      ref={panel}
      role="dialog"
      aria-label="Voice and speed"
      style={{
        position: "absolute",
        bottom: "calc(100% + 10px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(340px, 94vw)",
        maxHeight: "min(70vh, 560px)",
        overflowY: "auto",
        padding: "0.7rem 0.8rem 0.8rem",
        borderRadius: 16,
        background: "linear-gradient(160deg, rgba(20,10,45,0.98), rgba(48,20,90,0.98))",
        border: "1px solid rgba(212,175,55,0.45)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
        color: gold,
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <strong style={{ fontFamily: "'Cinzel',serif", fontSize: "0.8rem", letterSpacing: "0.1em" }}>Voice</strong>
        <button type="button" onClick={onClose} aria-label="Close voice menu" style={{ background: "none", border: "none", color: dim, cursor: "pointer", padding: 4 }}>
          <X size={16} />
        </button>
      </div>
      <div role="status" style={{ fontSize: "0.68rem", color: dim, margin: "0.3rem 0 0.2rem", lineHeight: 1.45 }}>
        {status}
      </div>

      <div style={{ margin: "0.5rem 0 0.2rem", padding: "0.55rem 0.65rem", borderRadius: 10, border: "1px solid rgba(212,175,55,0.45)", background: "rgba(212,175,55,0.12)" }}>
        <div style={{ fontSize: "0.82rem", color: gold }}>{APP_VOICE.credit}</div>
        <div style={{ fontSize: "0.66rem", color: dim }}>{APP_VOICE.description}</div>
      </div>

      <div style={sectionTitle}>Speed</div>
      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.74rem", color: gold, margin: "0.35rem 0" }}>
        <span className="sr-only">Speed</span>
        <input
          type="range"
          min={0.6}
          max={1.6}
          step={0.05}
          value={settings.rate}
          onChange={(e) => setRate(Number(e.target.value))}
          style={{ flex: 1, accentColor: "#d4af37" }}
          aria-label="Speed"
        />
        <span style={{ width: 42, textAlign: "right", fontVariantNumeric: "tabular-nums", color: dim }}>{settings.rate.toFixed(2)}×</span>
      </label>
      {settings.rate !== 1 && (
        <button type="button" onClick={() => setRate(1)} style={{ background: "none", border: "none", color: dim, fontSize: "0.66rem", textDecoration: "underline", cursor: "pointer", padding: 0 }}>
          Normal speed
        </button>
      )}
    </div>
  );
}
