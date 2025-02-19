
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
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm animate-fade-in">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Scene {currentScene}</h2>
          <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
            <button
              onClick={() => onPracticeModeChange('full')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                practiceMode === 'full'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Full Script
            </button>
            <button
              onClick={() => onPracticeModeChange('cues')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                practiceMode === 'cues'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Cues Only
            </button>
            <button
              onClick={() => onPracticeModeChange('lines')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                practiceMode === 'lines'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              My Lines
            </button>
          </div>
        </div>
        <button
          onClick={onPlayPause}
          className="p-3 rounded-full bg-primary text-white hover:bg-opacity-90 transition-all"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>

      {/* Character Selection */}
      <div className="mb-6 flex flex-wrap gap-2">
        {characters.map((char) => (
          <button
            key={char.name}
            onClick={() => onSelectCharacter(char.name)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              selectedCharacter === char.name
                ? 'bg-primary text-white'
                : 'bg-secondary hover:bg-gray-200'
            }`}
          >
            {char.name}
          </button>
        ))}
      </div>

      {/* Script Lines */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
        {lines.map((line, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg transition-all ${
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
              <div className="font-semibold text-sm text-gray-600 mb-1">
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
