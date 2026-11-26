import React from "react";
import { SpeechPlayer } from "./speech-player";
import { ScrollableTextDisplay } from "./scrollable-text-display";
import { studyAttrs, useStudyTag, type StudyTag } from "@/lib/curriculum/study-scope";

/**
 * A reading with its own Listen button; reads and highlights one sentence at a time.
 * Inside a <StudyScope>, listening to the whole passage marks that Curriculum
 * field studied. `part` names this passage within the field; `study` tags it
 * directly (or `false` to keep it out of the Curriculum).
 */
export function AccordionContentWithPlayer({
  text = "",
  part,
  study,
}: {
  text?: string;
  part?: string;
  study?: Partial<StudyTag> | false;
}) {
  const scopeRef = React.useRef<HTMLDivElement>(null);
  const scope = useStudyTag();
  if (!text) return null;
  const attrs = studyAttrs(scope, study === false ? false : { ...study, part: study?.part ?? part });
  return (
    <div ref={scopeRef} data-tts-scope className="flex flex-col space-y-4" {...attrs}>
      <div className="flex justify-start">
        <SpeechPlayer targetRef={scopeRef} text={text} />
      </div>
      <ScrollableTextDisplay text={text} />
    </div>
  );
}
