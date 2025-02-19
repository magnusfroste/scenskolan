
import React from 'react';
import { Play, Pause, BookOpen, BookCopy, BookText } from 'lucide-react';

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

  // Update the scene name formatting
  const getSceneName = () => {
    if (currentScene === 'all') return 'All Scenes';
    const firstSceneLine = lines.find(line => line.isStageDirection && line.scene === currentScene);
    const sceneText = firstSceneLine?.text || '';
    const sceneMatch = sceneText.match(/SCEN\s*(\d+(?::\d+)?)/i);
    
    if (sceneMatch && sceneText.includes(':')) {
      // If we have both scene number and description
      const [fullMatch, sceneNum] = sceneMatch;
      const description = sceneText.replace(fullMatch, '').trim();
      return `Scene ${sceneNum}${description}`;
    } else {
      // Fallback to just the scene number
      return `Scene ${currentScene}`;
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm animate-fade-in">
      {/* Controls */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-2 bg-white border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">{getSceneName()}</span>
          <div className="flex items-center gap-1 bg-secondary/30 rounded-xl p-1">
            <button
              onClick={() => onPracticeModeChange('full')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                practiceMode === 'full'
                  ? 'bg-[#8B5CF6] text-white shadow-md scale-105'
                  : 'bg-white text-gray-600 hover:text-gray-800 hover:bg-[#8B5CF6]/10'
              }`}
            >
              <BookOpen size={18} />
              Full
            </button>
            <button
              onClick={() => onPracticeModeChange('cues')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                practiceMode === 'cues'
                  ? 'bg-[#D946EF] text-white shadow-md scale-105'
                  : 'bg-white text-gray-600 hover:text-gray-800 hover:bg-[#D946EF]/10'
              }`}
            >
              <BookCopy size={18} />
              Cues
            </button>
            <button
              onClick={() => onPracticeModeChange('lines')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                practiceMode === 'lines'
                  ? 'bg-[#F97316] text-white shadow-md scale-105'
                  : 'bg-white text-gray-600 hover:text-gray-800 hover:bg-[#F97316]/10'
              }`}
            >
              <BookText size={18} />
              Lines
            </button>
          </div>
        </div>
        <button
          onClick={onPlayPause}
          className="p-1.5 rounded-full bg-primary text-white hover:bg-opacity-90 transition-all"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>

      {/* Character Selection */}
      <div className="p-1.5 flex flex-wrap gap-1 border-b bg-gray-50">
        {characters.map((char) => (
          <button
            key={char.name}
            onClick={() => onSelectCharacter(char.name)}
            className={`px-2 py-0.5 rounded-full text-xs transition-all ${
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
      <div className="space-y-2 p-3 max-h-[calc(100vh-10rem)] overflow-y-auto">
        {lines.map((line, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg transition-all ${
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
              <div className="font-medium text-xs text-gray-500 mb-0.5">
                {line.character}:
              </div>
            )}
            <div className="text-gray-800 text-sm">{line.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptDisplay;
