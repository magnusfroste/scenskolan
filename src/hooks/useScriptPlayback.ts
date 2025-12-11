// MODEL LAYER: Script playback and text-to-speech hook

import { useState, useRef, useEffect, useCallback } from 'react';
import type { ScriptLine } from '@/types/script';

interface UseScriptPlaybackProps {
  lines: ScriptLine[];
  selectedCharacter: string | null;
  practiceMode: 'full' | 'cues' | 'lines';
}

interface UseScriptPlaybackReturn {
  isPlaying: boolean;
  currentLineIndex: number;
  togglePlayback: () => void;
  stopPlayback: () => void;
}

export const useScriptPlayback = ({
  lines,
  selectedCharacter,
  practiceMode,
}: UseScriptPlaybackProps): UseScriptPlaybackReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const visibleLinesRef = useRef<ScriptLine[]>([]);

  // Initialize speech synthesis
  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    return () => {
      speechSynthesisRef.current?.cancel();
    };
  }, []);

  // Determine which lines should be visible based on practice mode
  const shouldShowLine = useCallback((line: ScriptLine) => {
    if (practiceMode === 'full') return true;
    if (!selectedCharacter) return true;
    if (line.isStageDirection) return true;
    
    if (practiceMode === 'lines') {
      return line.character === selectedCharacter;
    }
    
    if (practiceMode === 'cues') {
      const lineIndex = lines.indexOf(line);
      const nextLine = lines[lineIndex + 1];
      return nextLine?.character === selectedCharacter || line.character === selectedCharacter;
    }
    
    return true;
  }, [lines, selectedCharacter, practiceMode]);

  // Update visible lines when dependencies change
  useEffect(() => {
    visibleLinesRef.current = lines.filter(shouldShowLine);
  }, [lines, shouldShowLine]);

  // Handle playback
  useEffect(() => {
    if (isPlaying && currentLineIndex >= 0 && currentLineIndex < visibleLinesRef.current.length) {
      const currentLine = visibleLinesRef.current[currentLineIndex];
      if (currentLine) {
        const textToSpeak = currentLine.isStageDirection 
          ? "Stage direction: " + currentLine.text
          : `${currentLine.character}: ${currentLine.text}`;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.9;
        utterance.onend = () => {
          setCurrentLineIndex(prev => prev + 1);
        };

        speechSynthesisRef.current?.speak(utterance);
      }
    }

    return () => {
      speechSynthesisRef.current?.cancel();
    };
  }, [isPlaying, currentLineIndex]);

  // Reset playback when context changes
  useEffect(() => {
    speechSynthesisRef.current?.cancel();
    setCurrentLineIndex(-1);
    setIsPlaying(false);
  }, [selectedCharacter, practiceMode]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      speechSynthesisRef.current?.cancel();
      setIsPlaying(false);
    } else {
      setCurrentLineIndex(0);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const stopPlayback = useCallback(() => {
    speechSynthesisRef.current?.cancel();
    setIsPlaying(false);
    setCurrentLineIndex(-1);
  }, []);

  return {
    isPlaying,
    currentLineIndex,
    togglePlayback,
    stopPlayback,
  };
};
