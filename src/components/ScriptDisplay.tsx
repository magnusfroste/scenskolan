// VIEW LAYER: Script display component

import React, { useState, useMemo } from 'react';
import { Play, Pause, BookOpen, BookCopy, BookText, SunDim } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import type { Character, ScriptLine } from '@/types/script';
import { useScriptPlayback } from '@/hooks/useScriptPlayback';

interface ScriptDisplayProps {
  currentScene: string;
  characters: Character[];
  lines: ScriptLine[];
  selectedCharacter: string | null;
  onSelectCharacter: (character: string) => void;
  practiceMode: 'full' | 'cues' | 'lines';
  onPracticeModeChange: (mode: 'full' | 'cues' | 'lines') => void;
}

const ScriptDisplay = ({
  currentScene,
  characters,
  lines,
  selectedCharacter,
  onSelectCharacter,
  practiceMode,
  onPracticeModeChange,
}: ScriptDisplayProps) => {
  const [contrastLevel, setContrastLevel] = useState(50);

  const { isPlaying, currentLineIndex, togglePlayback } = useScriptPlayback({
    lines,
    selectedCharacter,
    practiceMode,
  });

  const activeCharacters = useMemo(() => {
    if (currentScene === 'all') return characters;
    
    const activeCharacterNames = new Set(
      lines
        .filter(line => line.scene === currentScene && !line.isStageDirection)
        .map(line => line.character)
    );
    
    return characters.filter(char => activeCharacterNames.has(char.name));
  }, [currentScene, characters, lines]);

  const sceneName = useMemo(() => {
    if (currentScene === 'all') return 'Alla scener';
    const firstSceneLine = lines.find(line => line.isStageDirection && line.scene === currentScene);
    const sceneText = firstSceneLine?.text || '';
    const sceneMatch = sceneText.match(/SCEN\s*(\d+(?::\d+)?)/i);
    
    if (sceneMatch) {
      const [fullMatch, sceneNum] = sceneMatch;
      let description = sceneText.replace(fullMatch, '').trim();
      description = description.replace(/^[–-]\s*/, '');
      return description ? `Scen ${sceneNum} ${description}` : `Scen ${sceneNum}`;
    }
    return `Scen ${currentScene}`;
  }, [currentScene, lines]);

  const shouldShowLine = (line: ScriptLine) => {
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

  const getLineStyle = (line: ScriptLine) => {
    if (!shouldShowLine(line)) {
      const blurIntensity = Math.max(2, 8 - (contrastLevel / 20));
      return {
        backgroundColor: `hsl(35 25% 92% / 0.3)`,
        filter: `blur(${blurIntensity}px)`,
      };
    }
    
    if (line.isStageDirection) {
      const opacity = Math.max(0.3, contrastLevel / 200);
      return {
        backgroundColor: `hsl(35 40% 94% / ${opacity})`,
        fontStyle: 'italic' as const,
      };
    }
    
    if (selectedCharacter === line.character) {
      const baseOpacity = Math.max(0.1, contrastLevel / 100);
      return {
        backgroundColor: `hsl(352 70% 40% / ${baseOpacity * 0.15})`,
      };
    }
    
    return {
      backgroundColor: 'hsl(var(--card))',
    };
  };

  const visibleLines = useMemo(() => 
    lines.filter(shouldShowLine), 
    [lines, selectedCharacter, practiceMode]
  );

  return (
    <div className="w-full mx-auto bg-card rounded-lg shadow-sm animate-fade-in border border-border">
      {/* Header */}
      <div className="sticky top-0 z-10 flex flex-col md:flex-row items-start md:items-center gap-2 p-2 md:p-3 bg-card border-b border-border rounded-t-lg">
        <span className="text-sm md:text-base font-display font-medium text-foreground w-full md:w-auto">{sceneName}</span>
        <div className="flex items-center justify-between w-full md:w-auto gap-2">
          {/* Practice mode buttons */}
          <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPracticeModeChange('full')}
                    className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-1 md:gap-2 ${
                      practiceMode === 'full'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <BookOpen size={16} className="md:w-[18px] md:h-[18px]" />
                    <span className="hidden md:inline">Full</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p>Visa hela manuset med alla repliker</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPracticeModeChange('cues')}
                    className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-1 md:gap-2 ${
                      practiceMode === 'cues'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <BookCopy size={16} className="md:w-[18px] md:h-[18px]" />
                    <span className="hidden md:inline">Stickord</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p>Visa dina repliker och stickorden innan</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPracticeModeChange('lines')}
                    className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-1 md:gap-2 ${
                      practiceMode === 'lines'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <BookText size={16} className="md:w-[18px] md:h-[18px]" />
                    <span className="hidden md:inline">Repliker</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p>Visa bara dina egna repliker</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="hidden md:flex items-center gap-2">
                    <SunDim size={16} className="text-muted-foreground" />
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
                  <p>Justera kontrast</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <button
              onClick={togglePlayback}
              className="p-2 md:p-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity touch-manipulation"
            >
              {isPlaying ? <Pause size={18} className="md:w-4 md:h-4" /> : <Play size={18} className="md:w-4 md:h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Character buttons */}
      <div className="p-2 md:p-1.5 flex flex-wrap gap-1.5 md:gap-1 border-b border-border bg-secondary/30">
        {activeCharacters.map((char) => (
          <button
            key={char.name}
            onClick={() => onSelectCharacter(char.name)}
            className={`px-3 md:px-2 py-1.5 md:py-0.5 rounded-full text-sm md:text-xs transition-all touch-manipulation ${
              selectedCharacter === char.name
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-foreground hover:bg-accent'
            }`}
          >
            {char.name}
          </button>
        ))}
      </div>

      {/* Script lines */}
      <div className="space-y-2 p-3 md:p-3 max-h-[calc(100vh-14rem)] md:max-h-[calc(100vh-10rem)] overflow-y-auto bg-card/50">
        {lines.map((line, index) => {
          const isCurrentLine = visibleLines.indexOf(line) === currentLineIndex;
          
          return (
            <div
              key={index}
              className={`p-3 md:p-2 rounded-lg transition-all hover:opacity-90 ${
                isCurrentLine ? 'ring-2 md:ring-1 ring-gold ring-opacity-50' : ''
              }`}
              style={getLineStyle(line)}
            >
              {!line.isStageDirection && (
                <div className="font-semibold text-sm md:text-xs text-primary mb-1 md:mb-0.5">
                  {line.character}:
                </div>
              )}
              <div className="text-base md:text-sm text-foreground leading-relaxed">
                {line.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScriptDisplay;
