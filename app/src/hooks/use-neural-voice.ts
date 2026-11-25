import { useSyncExternalStore } from "react";
import { neuralVoice, type NeuralState } from "@/lib/read-aloud/neural-voice";

const subscribe = (fn: () => void) => neuralVoice.subscribe(fn);
const snapshot = (): NeuralState => neuralVoice.getState();

/** Download / ready state of the natural (Piper) voice. */
export function useNeuralVoiceState(): NeuralState {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
