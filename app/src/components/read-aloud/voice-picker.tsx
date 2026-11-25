import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { readAloud } from "@/lib/read-aloud/engine";
import { voiceSettings, NATURAL_VOICES } from "@/lib/read-aloud/voice-settings";
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

function Row({ selected, title, detail, onPick }: { selected: boolean; title: string; detail?: string; onPick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onPick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        textAlign: "left",
        padding: "0.45rem 0.55rem",
        marginBottom: 2,
        borderRadius: 10,
        border: selected ? "1px solid rgba(212,175,55,0.7)" : "1px solid transparent",
        background: selected ? "rgba(212,175,55,0.16)" : "rgba(255,255,255,0.03)",
        color: gold,
        cursor: "pointer",
        fontSize: "0.78rem",
      }}
    >
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block" }}>{title}</span>
        {detail && <span style={{ display: "block", fontSize: "0.66rem", color: dim }}>{detail}</span>}
      </span>
      {selected && <Check size={15} aria-hidden="true" />}
    </button>
  );
}

/**
 * Voice menu for the read-aloud player: the Piper voices and speed, plus the
 * voice's download status. Picking a voice plays it straight away (restarting
 * the current sentence, or a short sample); a voice not used before is
 * downloaded first (once).
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

  const pick = (id: string) => {
    voiceSettings.set({ naturalVoice: id });
    readAloud.voiceChanged();
  };
  // Speed: apply after the thumb settles, not on every step.
  const setRate = (rate: number) => {
    voiceSettings.set({ rate });
    if (restart.current) clearTimeout(restart.current);
    restart.current = setTimeout(() => readAloud.voiceChanged(), 450);
  };

  const status =
    voice.status === "ready"
      ? "Ready · works offline · made on this device"
      : voice.status === "loading"
        ? voice.progress >= 0.999
          ? "Starting the voice…"
          : `Downloading the voice… ${Math.round(voice.progress * 100)}% (one-time ${voice.sizeLabel})`
        : voice.status === "error"
          ? `The voice couldn't load${voice.error ? ` (${voice.error})` : ""}. Check your connection, then pick a voice to try again.`
          : `One-time ${voice.sizeLabel} download per voice the first time you listen, then it works offline.`;

  return (
    <div
      ref={panel}
      role="dialog"
      aria-label="Choose a voice"
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

      <div role="radiogroup" aria-label="Voices">
        <div style={sectionTitle}>Voices</div>
        {NATURAL_VOICES.map((v) => (
          <Row
            key={v.id}
            selected={settings.naturalVoice === v.id}
            title={`${v.name}${v.note ? ` · ${v.note}` : ""}`}
            detail={`${v.accent} ${v.gender.toLowerCase()}`}
            onPick={() => pick(v.id)}
          />
        ))}
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
