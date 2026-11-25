import { useEffect, useState, useSyncExternalStore } from "react";
import { voiceSettings, deviceEnglishVoices, type VoiceSettings } from "@/lib/read-aloud/voice-settings";

const subscribe = (fn: () => void) => voiceSettings.subscribe(fn);
const snapshot = (): VoiceSettings => voiceSettings.get();

/** The listener's saved voice, speed and pitch. */
export function useVoiceSettings(): VoiceSettings {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/** The device's English voices; the list fills in once the browser loads it. */
export function useDeviceVoices(active: boolean): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => deviceEnglishVoices());
  useEffect(() => {
    if (!active || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const update = () => setVoices(deviceEnglishVoices());
    update();
    synth.addEventListener?.("voiceschanged", update);
    // Some Android builds never fire the event: poll briefly.
    const timers = [300, 1000, 2500].map((ms) => setTimeout(update, ms));
    return () => {
      synth.removeEventListener?.("voiceschanged", update);
      timers.forEach(clearTimeout);
    };
  }, [active]);
  return voices;
}
