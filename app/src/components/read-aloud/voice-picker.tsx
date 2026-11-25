import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { readAloud } from "@/lib/read-aloud/engine";
import { neuralVoice } from "@/lib/read-aloud/neural-voice";
import { voiceSettings, NATURAL_VOICES, accentLabel } from "@/lib/read-aloud/voice-settings";
import { useNeuralVoiceState } from "@/hooks/use-neural-voice";
import { useDeviceVoices, useVoiceSettings } from "@/hooks/use-voice-settings";

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
        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
        {detail && <span style={{ display: "block", fontSize: "0.66rem", color: dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{detail}</span>}
      </span>
      {selected && <Check size={15} aria-hidden="true" />}
    </button>
  );
}

function Slider({ label, value, min, max, step, onChange, format }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.74rem", color: gold, margin: "0.35rem 0" }}>
      <span style={{ width: 44 }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: "#d4af37" }}
      />
      <span style={{ width: 38, textAlign: "right", fontVariantNumeric: "tabular-nums", color: dim }}>{format(value)}</span>
    </label>
  );
}

/**
 * Voice menu for the read-aloud player: natural voices (where the device can
 * run them), the device's own voices, speed and pitch. Picking a voice plays
 * it straight away (restarting the current sentence, or a short sample).
 */
export function VoicePicker({ onClose }: { onClose: () => void }) {
  const voice = useNeuralVoiceState();
  const settings = useVoiceSettings();
  const deviceVoices = useDeviceVoices(true);
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

  const naturalOk = voice.status === "idle" || voice.status === "loading" || voice.status === "ready";
  const usingNatural = naturalOk && voice.enabled;

  const pickNatural = (id: string) => {
    voiceSettings.set({ naturalVoice: id });
    neuralVoice.setEnabled(true);
    readAloud.voiceChanged();
  };
  const pickDevice = (uri: string | null) => {
    voiceSettings.set({ deviceVoice: uri });
    neuralVoice.setEnabled(false);
    readAloud.voiceChanged();
  };
  // Sliders: apply after the thumb settles, not on every step.
  const tune = (patch: { rate?: number; pitch?: number }) => {
    voiceSettings.set(patch);
    if (restart.current) clearTimeout(restart.current);
    restart.current = setTimeout(() => readAloud.voiceChanged(), 450);
  };

  const naturalStatus =
    voice.status === "ready"
      ? "Downloaded · works offline"
      : voice.status === "loading"
        ? voice.progress >= 0.999
          ? "Checking it runs smoothly on this device…"
          : `Downloading… ${Math.round(voice.progress * 100)}%`
        : `One-time ${voice.sizeLabel} download, then works offline`;

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

      {naturalOk && (
        <div role="radiogroup" aria-label="Natural voices">
          <div style={sectionTitle}>Natural voices · most lifelike</div>
          <div style={{ fontSize: "0.66rem", color: dim, marginBottom: 6 }}>{naturalStatus}</div>
          {NATURAL_VOICES.map((v) => (
            <Row
              key={v.id}
              selected={usingNatural && settings.naturalVoice === v.id}
              title={`${v.name}${v.note ? ` · ${v.note}` : ""}`}
              detail={`${v.accent} ${v.gender.toLowerCase()} · grade ${v.grade}`}
              onPick={() => pickNatural(v.id)}
            />
          ))}
        </div>
      )}

      <div role="radiogroup" aria-label="Device voices">
        <div style={sectionTitle}>This device's voices</div>
        {voice.status === "slow" && (
          <div style={{ fontSize: "0.66rem", color: dim, marginBottom: 6 }}>
            The natural voices run too slowly on this device to read smoothly, so its own voices are listed here.
          </div>
        )}
        <Row selected={!usingNatural && !settings.deviceVoice} title="Automatic" detail="The device's default English voice" onPick={() => pickDevice(null)} />
        {deviceVoices.map((v) => (
          <Row
            key={v.voiceURI}
            selected={!usingNatural && settings.deviceVoice === v.voiceURI}
            title={v.name}
            detail={`${accentLabel(v.lang)}${v.localService ? " · offline" : " · needs internet"}`}
            onPick={() => pickDevice(v.voiceURI)}
          />
        ))}
        <div style={{ fontSize: "0.64rem", color: dim, margin: "0.4rem 0 0.2rem", lineHeight: 1.45 }}>
          {deviceVoices.length <= 1 ? "Only one voice is installed. " : ""}
          More voices can be added in your phone's settings: Android — Settings › Accessibility › Text-to-speech › Install voice data; iPhone — Settings › Accessibility › Spoken Content › Voices.
        </div>
      </div>

      <div style={sectionTitle}>Sound</div>
      <Slider label="Speed" value={settings.rate} min={0.6} max={1.6} step={0.05} onChange={(rate) => tune({ rate })} format={(v) => `${v.toFixed(2)}×`} />
      {!usingNatural && <Slider label="Pitch" value={settings.pitch} min={0.6} max={1.6} step={0.05} onChange={(pitch) => tune({ pitch })} format={(v) => (v === 1 ? "normal" : v.toFixed(2))} />}
      {(settings.rate !== 1 || settings.pitch !== 1) && (
        <button
          type="button"
          onClick={() => tune({ rate: 1, pitch: 1 })}
          style={{ background: "none", border: "none", color: dim, fontSize: "0.66rem", textDecoration: "underline", cursor: "pointer", padding: 0 }}
        >
          Reset speed and pitch
        </button>
      )}
    </div>
  );
}
