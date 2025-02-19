
import React from 'react';
import { Play, Pause, Eye, EyeOff } from 'lucide-react';

interface Character {
  name: string;
  actor: string;
}

interface Line {
  character: string;
  text: string;
  isStageDirection?: boolean;
}

interface ScriptDisplayProps {
  currentScene: number;
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
  const shouldShowLine = (line: Line) => {
    if (practiceMode === 'full') return true;
    if (!selectedCharacter) return true;
    if (line.isStageDirection) return true;
    
    if (practiceMode === 'lines') {
      return line.character === selectedCharacter;
    }
    
    if (practiceMode === 'cues') {
      // Show the line before the selected character's line
      const lineIndex = lines.indexOf(line);
      const nextLine = lines[lineIndex + 1];
      return nextLine?.character === selectedCharacter || line.character === selectedCharacter;
    }
    
    return true;
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm animate-fade-in">
      {/* Controls */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-3 bg-white border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Scene {currentScene}</span>
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
            <button
              onClick={() => onPracticeModeChange('full')}
              className={`px-2 py-1 rounded-md text-xs transition-all ${
                practiceMode === 'full'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Full
            </button>
            <button
              onClick={() => onPracticeModeChange('cues')}
              className={`px-2 py-1 rounded-md text-xs transition-all ${
                practiceMode === 'cues'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Cues
            </button>
            <button
              onClick={() => onPracticeModeChange('lines')}
              className={`px-2 py-1 rounded-md text-xs transition-all ${
                practiceMode === 'lines'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Lines
            </button>
          </div>
        </div>
        <button
          onClick={onPlayPause}
          className="p-2 rounded-full bg-primary text-white hover:bg-opacity-90 transition-all"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      {/* Character Selection */}
      <div className="p-2 flex flex-wrap gap-1 border-b bg-gray-50">
        {characters.map((char) => (
          <button
            key={char.name}
            onClick={() => onSelectCharacter(char.name)}
            className={`px-3 py-1 rounded-full text-xs transition-all ${
              selectedCharacter === char.name
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {char.name}
          </button>
        ))}
      </div>

      {/* Script Lines */}
      <div className="space-y-3 p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {lines.map((line, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg transition-all ${
              !shouldShowLine(line)
                ? 'bg-secondary/50 blur-sm hover:blur-none cursor-help'
                : line.isStageDirection
                ? 'bg-accent italic text-gray-600'
                : selectedCharacter === line.character
                ? 'bg-primary/5 border border-primary/20'
                : 'bg-white border border-gray-100'
            }`}
          >
            {!line.isStageDirection && (
              <div className="font-medium text-xs text-gray-500 mb-1">
                {line.character}:
              </div>
            )}
            <div className="text-gray-800">{line.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptDisplay;
