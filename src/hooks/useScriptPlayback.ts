// MODEL LAYER: Script playback hook
//
// Repliker läses med inspelad röst (OmniVoice via Shipholms taltjänst). Texten
// är användarens eget manus och finns bara när appen körs, så varje replik
// hämtas från tjänsten och spelas upp som ljud. Ingen talsyntes i webbläsaren
// används – svarar tjänsten inte blir det tyst och texten står kvar på skärmen.

import { useState, useRef, useEffect, useCallback } from 'react';
import type { ScriptLine } from '@/types/script';
import { report } from '@/lib/skolappar';

const TAL_URL = 'https://api.shipholm.com/speak';

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
  const visibleLinesRef = useRef<ScriptLine[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const generationRef = useRef(0);

  const releaseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
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
    if (!isPlaying) return;
    const visible = visibleLinesRef.current;

    if (currentLineIndex >= 0 && currentLineIndex < visible.length) {
      const currentLine = visible[currentLineIndex];
      if (!currentLine) return;

      const textToSpeak = currentLine.isStageDirection
        ? 'Stage direction: ' + currentLine.text
        : `${currentLine.character}: ${currentLine.text}`;

      const generation = generationRef.current;
      releaseAudio();

      fetch(TAL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak, voice: 'omni' }),
      })
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
        .then((blob) => {
          if (generation !== generationRef.current) return;
          const url = URL.createObjectURL(blob);
          urlRef.current = url;
          const audio = new Audio(url);
          audioRef.current = audio;
          const next = () => {
            if (generation !== generationRef.current) return;
            URL.revokeObjectURL(url);
            if (urlRef.current === url) urlRef.current = null;
            setCurrentLineIndex((prev) => prev + 1);
          };
          audio.onended = next;
          audio.onerror = next;
          return audio.play().catch(next);
        })
        .catch(() => {
          // Tyst: repliken syns redan i manuset.
          if (generation === generationRef.current) setCurrentLineIndex((prev) => prev + 1);
        });
    } else if (currentLineIndex > 0 && currentLineIndex === visible.length) {
      // The read-through reached the last line.
      report('round_done');
    }

    return () => {
      releaseAudio();
    };
  }, [isPlaying, currentLineIndex, releaseAudio]);

  // Reset playback when context changes
  useEffect(() => {
    generationRef.current += 1;
    releaseAudio();
    setCurrentLineIndex(-1);
    setIsPlaying(false);
  }, [selectedCharacter, practiceMode, releaseAudio]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      generationRef.current += 1;
      releaseAudio();
      setIsPlaying(false);
    } else {
      setCurrentLineIndex(0);
      setIsPlaying(true);
      report('round_start');
    }
  }, [isPlaying, releaseAudio]);

  const stopPlayback = useCallback(() => {
    generationRef.current += 1;
    releaseAudio();
    setIsPlaying(false);
    setCurrentLineIndex(-1);
  }, [releaseAudio]);

  return {
    isPlaying,
    currentLineIndex,
    togglePlayback,
    stopPlayback,
  };
};
