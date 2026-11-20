
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, FastForward, Rewind, Volume2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  text: string;
  sentences: string[];
  onBoundary: (index: number) => void;
  onEnd: () => void;
  lang?: string;
}

export const SpeechPlayer: React.FC<Props> = ({ text, sentences, onBoundary, onEnd, lang = 'en-US' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const currentSentenceIndexRef = useRef(0);
    const userInitiatedStop = useRef(false);
    const { toast } = useToast();

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            userInitiatedStop.current = true;
            window.speechSynthesis.cancel();
        };
    }, []);

    const speakSentence = useCallback((index: number) => {
        if (userInitiatedStop.current || index >= sentences.length || index < 0) {
            setIsPlaying(false);
            setIsPaused(false);
            if (index >= sentences.length) {
                onEnd();
                currentSentenceIndexRef.current = 0;
                setIsExpanded(false);
            }
            userInitiatedStop.current = false;
            return;
        }

        onBoundary(index);
        currentSentenceIndexRef.current = index;

        const utterance = new SpeechSynthesisUtterance(sentences[index]);
        utterance.lang = lang;
        utterance.rate = 0.95;

        utterance.onend = () => {
            if (!userInitiatedStop.current) {
                speakSentence(index + 1);
            }
        };

        utterance.onerror = (event) => {
            if (event.error === 'canceled' || event.error === 'interrupted') return; 
            console.error("SpeechSynthesis Error:", event);
            toast({
                variant: 'destructive',
                title: 'Speech Error',
                description: `An error occurred: ${event.error}`,
            });
            setIsPlaying(false);
            setIsPaused(false);
            onEnd();
            currentSentenceIndexRef.current = 0;
        };
        
        window.speechSynthesis.speak(utterance);
    }, [lang, sentences, onBoundary, onEnd, toast]);

    const handlePlayPause = useCallback(() => {
        const synth = window.speechSynthesis;
        
        if (synth.speaking && !isPaused) {
            userInitiatedStop.current = true;
            synth.pause();
            setIsPlaying(false);
            setIsPaused(true);
        } else if (synth.paused && isPaused) {
            userInitiatedStop.current = false;
            synth.resume();
            setIsPlaying(true);
            setIsPaused(false);
        } else {
            userInitiatedStop.current = false;
            if (synth.speaking) synth.cancel();
            setIsPlaying(true);
            setIsPaused(false);
            setIsExpanded(true);
            speakSentence(currentSentenceIndexRef.current);
        }
    }, [isPaused, speakSentence]);

    const handleStop = useCallback(() => {
        userInitiatedStop.current = true;
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setIsExpanded(false);
        onEnd();
        currentSentenceIndexRef.current = 0;
    }, [onEnd]);

    const skipForward = () => {
        window.speechSynthesis.cancel();
        speakSentence(currentSentenceIndexRef.current + 1);
    };

    const skipBackward = () => {
        window.speechSynthesis.cancel();
        speakSentence(Math.max(0, currentSentenceIndexRef.current - 1));
    };

    return (
        <motion.div 
            initial={false}
            animate={{ width: isExpanded ? 'auto' : '120px' }}
            className="flex items-center bg-primary/10 border border-primary/20 rounded-full p-1 overflow-hidden"
        >
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="w-full"
                    >
                        <Button 
                            onClick={handlePlayPause} 
                            variant="ghost" 
                            size="sm" 
                            className="w-full rounded-full hover:bg-primary/20 text-primary font-cinzel text-[0.7rem] tracking-widest uppercase py-0 h-8"
                        >
                            <Volume2 className="h-3 w-3 mr-2" />
                            Listen
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="active"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-1 px-1"
                    >
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-primary/70 hover:text-primary hover:bg-primary/10"
                            onClick={skipBackward}
                        >
                            <Rewind className="h-4 w-4" />
                        </Button>

                        <Button 
                            onClick={handlePlayPause} 
                            variant="default" 
                            size="icon" 
                            className="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                        </Button>

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-primary/70 hover:text-primary hover:bg-primary/10"
                            onClick={skipForward}
                        >
                            <FastForward className="h-4 w-4" />
                        </Button>

                        <div className="w-px h-4 bg-primary/20 mx-1" />

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-rose-400 hover:text-rose-500 hover:bg-rose-500/10"
                            onClick={handleStop}
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};