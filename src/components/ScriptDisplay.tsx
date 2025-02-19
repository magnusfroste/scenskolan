import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, BookOpen, BookCopy, BookText, SunDim } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

interface Character {
  name: string;
  actor: string;
}

interface Line {
  character: string;
  text: string;
  isStageDirection?: boolean;
  scene: string;
}

interface ScriptDisplayProps {
  currentScene: string;
  characters: Character[];
  lines: Line[];
  isPlaying: boolean;
  onPlayPause: () => void;
  selectedCharacter: string | null;
  onSelectCharacter: (character: string) => void;
  practiceMode: 'full' | 'cues' | 'lines';
  onPracticeModeChange: (mode: 'full' | 'cues' | 'lines') => void;
}

const ScriptDisplay = ({
  currentScene,
  characters,
  lines,
  isPlaying,
  onPlayPause,
  selectedCharacter,
  onSelectCharacter,
  practiceMode,
  onPracticeModeChange,
}: ScriptDisplayProps) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [contrastLevel, setContrastLevel] = useState(50);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const visibleLinesRef = useRef<Line[]>([]);

  const getActiveCharacters = () => {
    if (currentScene === 'all') return characters;
    
    const activeCharacterNames = new Set(
      lines
        .filter(line => line.scene === currentScene && !line.isStageDirection)
        .map(line => line.character)
    );
    
    return characters.filter(char => activeCharacterNames.has(char.name));
  };

  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  const shouldShowLine = (line: Line) => {
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
  };

  const getSceneName = () => {
    if (currentScene === 'all') return 'All Scenes';
    const firstSceneLine = lines.find(line => line.isStageDirection && line.scene === currentScene);
    const sceneText = firstSceneLine?.text || '';
    const sceneMatch = sceneText.match(/SCEN\s*(\d+(?::\d+)?)/i);
    
    if (sceneMatch) {
      const [fullMatch, sceneNum] = sceneMatch;
      let description = sceneText.replace(fullMatch, '').trim();
      
      description = description.replace(/^[–-]\s*/, '');
      
      return description ? `Scene ${sceneNum} ${description}` : `Scene ${sceneNum}`;
    } else {
      return `Scene ${currentScene}`;
    }
  };

  useEffect(() => {
    visibleLinesRef.current = lines.filter(line => shouldShowLine(line));
  }, [lines, selectedCharacter, practiceMode]);

  useEffect(() => {
    if (isPlaying && currentLineIndex < visibleLinesRef.current.length) {
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

  const handlePlayPause = () => {
    if (isPlaying) {
      speechSynthesisRef.current?.cancel();
      onPlayPause();
    } else {
      setCurrentLineIndex(0);
      onPlayPause();
    }
  };

  useEffect(() => {
    speechSynthesisRef.current?.cancel();
    setCurrentLineIndex(-1);
    if (isPlaying) {
      onPlayPause();
    }
  }, [currentScene, selectedCharacter, practiceMode]);

  const handleScriptPaste = () => {
    console.log('Script pasted');
  };

  const getOpacityValue = (baseOpacity: number) => {
    const multiplier = (contrastLevel + 50) / 100;
    return Math.min(Math.max(baseOpacity * multiplier, 0), 1);
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm animate-fade-in">
      <div className="sticky top-0 z-10 flex items-center justify-between p-2 bg-white border-b">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-sm font-medium text-gray-600">{getSceneName()}</span>
          <div className="flex items-center gap-1 bg-secondary/30 rounded-xl p-1 ml-auto mr-4">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPracticeModeChange('full')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      practiceMode === 'full'
                        ? 'bg-[#8B5CF6] text-white shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <BookOpen size={18} />
                    Full
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p>Show the complete script with all lines visible</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPracticeModeChange('cues')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      practiceMode === 'cues'
                        ? 'bg-[#D946EF] text-white shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <BookCopy size={18} />
                    Cues
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p>Shows your lines and the lines that come right before yours (your cues), helping you learn when to speak</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPracticeModeChange('lines')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      practiceMode === 'lines'
                        ? 'bg-[#F97316] text-white shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <BookText size={18} />
                    Lines
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p>Shows only your character's lines, perfect for memorization practice</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <SunDim size={16} className="text-gray-500" />
                  <Slider
                    value={[contrastLevel]}
                    onValueChange={(value) => setContrastLevel(value[0])}
                    max={100}
                    min={0}
                    step={1}
                    className="w-24"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust contrast for better visibility</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <button
            onClick={handlePlayPause}
            className="p-1.5 rounded-full bg-primary text-white hover:opacity-90 transition-opacity"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>

      <div className="p-1.5 flex flex-wrap gap-1 border-b bg-gray-50">
        {getActiveCharacters().map((char) => (
          <button
            key={char.name}
            onClick={() => onSelectCharacter(char.name)}
            className={`px-2 py-0.5 rounded-full text-xs transition-all ${
              selectedCharacter === char.name
                ? 'bg-primary text-white'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            {char.name}
          </button>
        ))}
      </div>

      <div className="space-y-2 p-3 max-h-[calc(100vh-10rem)] overflow-y-auto">
        {lines.map((line, index) => {
          const isCurrentLine = visibleLinesRef.current.indexOf(line) === currentLineIndex;
          const getHighlightStyle = () => {
            if (!shouldShowLine(line)) {
              return `bg-secondary/50 blur-sm hover:blur-none cursor-help`;
            }
            if (line.isStageDirection) {
              return `bg-accent/50 italic text-gray-600 hover:bg-accent/70`;
            }
            if (selectedCharacter === line.character) {
              const opacity = getOpacityValue(0.05);
              return `bg-primary bg-opacity-[${opacity}] hover:bg-opacity-[${opacity * 2}]`;
            }
            return 'bg-white hover:bg-gray-50';
          };

          return (
            <div
              key={index}
              className={`p-2 rounded-lg transition-all ${getHighlightStyle()} ${
                isCurrentLine ? 'ring-1 ring-primary ring-opacity-30' : ''
              }`}
            >
              {!line.isStageDirection && (
                <div className="font-medium text-xs text-gray-500 mb-0.5">
                  {line.character}:
                </div>
              )}
              <div className="text-gray-800 text-sm">{line.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScriptDisplay;
