import { useSyncExternalStore } from "react";
import { voiceSettings, type VoiceSettings } from "@/lib/read-aloud/voice-settings";

const subscribe = (fn: () => void) => voiceSettings.subscribe(fn);
const snapshot = (): VoiceSettings => voiceSettings.get();

/** The listener's saved voice and speed. */
export function useVoiceSettings(): VoiceSettings {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
