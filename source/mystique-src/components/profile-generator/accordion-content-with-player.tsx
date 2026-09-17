import React from 'react';
import { SpeechPlayer } from './speech-player';
import { ScrollableTextDisplay } from './scrollable-text-display';

/**
 * Sentence splitter shared by the speech player and the highlighter.
 * Splits on newlines and on sentence-final punctuation, and — unlike a naive
 * match-all regex — keeps the trailing fragment so the last line is never dropped.
 */
export function splitIntoSentences(text: string): string[] {
    if (!text) return [""];
    const cleaned = text.replace(/\r\n/g, "\n");
    const out: string[] = [];
    for (const paragraph of cleaned.split(/\n+/)) {
        let start = 0;
        for (let i = 0; i < paragraph.length; i++) {
            const ch = paragraph[i];
            if (ch !== "." && ch !== "!" && ch !== "?") continue;
            const next = paragraph[i + 1];
            if (next !== undefined && !/\s/.test(next)) continue; // 16.5, 7.5% — not a sentence end
            const candidate = paragraph.slice(start, i + 1).trim();
            if (candidate) out.push(candidate);
            start = i + 1;
            while (start < paragraph.length && /\s/.test(paragraph[start])) start++;
            i = start - 1;
        }
        const tail = paragraph.slice(start).trim();
        if (tail) out.push(tail);
    }
    return out.length ? out : [text];
}

export function AccordionContentWithPlayer({ text = "" }: { text?: string }) {
    const [activeSentenceIndex, setActiveSentenceIndex] = React.useState(-1);

    const sentences = React.useMemo(() => splitIntoSentences(text), [text]);

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
