import React from "react";
import { SpeechPlayer } from "./speech-player";
import { ScrollableTextDisplay } from "./scrollable-text-display";

/** A reading with its own Listen button; reads and highlights one sentence at a time. */
export function AccordionContentWithPlayer({ text = "" }: { text?: string }) {
  const scopeRef = React.useRef<HTMLDivElement>(null);
  if (!text) return null;
  return (
    <div ref={scopeRef} data-tts-scope className="flex flex-col space-y-4">
      <div className="flex justify-start">
        <SpeechPlayer targetRef={scopeRef} text={text} />
      </div>
      <ScrollableTextDisplay text={text} />
    </div>
  );
}
