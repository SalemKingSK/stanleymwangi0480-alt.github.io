import React from 'react';
import { SpeechPlayer } from './speech-player';
import { ScrollableTextDisplay } from './scrollable-text-display';

export function AccordionContentWithPlayer({ text = "" }: { text?: string }) {
    const [activeSentenceIndex, setActiveSentenceIndex] = React.useState(-1);
    
    // Safety check: ensure text is a string before matching
    const sentences = React.useMemo(() => {
        if (!text) return [""];
        // Split by major punctuation while preserving it
        const matches = text.match(/[^.!?\n]+[.!?\n]+/g);
        return matches || [text];
    }, [text]);

    if (!text) return null;

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex justify-start">
                <SpeechPlayer
                    text={text}
                    sentences={sentences}
                    onBoundary={setActiveSentenceIndex}
                    onEnd={() => setActiveSentenceIndex(-1)}
                />
            </div>
            <ScrollableTextDisplay
                text={text}
                sentences={sentences}
                activeSentenceIndex={activeSentenceIndex}
            />
        </div>
    )
}
