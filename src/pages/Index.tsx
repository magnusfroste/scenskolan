import React, { useState } from 'react';
import ScriptDisplay from '@/components/ScriptDisplay';
import { Upload } from 'lucide-react';

// Sample data - kept as fallback
const sampleCharacters = [
  { name: "Stella", actor: "Ellen H." },
  { name: "Bella", actor: "Esther" },
  { name: "Leila", actor: "Ainhoa" },
  { name: "Tim", actor: "John" },
];

const sampleLines = [
  { character: "Flora", text: "Titti, Titti, Titti…. Är du redo med manuset" },
  { character: "Titti", text: "Ja, såklart" },
  { isStageDirection: true, character: "", text: "(Ljuset upp, skådespelarna står i statyer tills Flora kommer in)" },
  { character: "Leila", text: "Två starka släkter fläckar med sin splittring Det ljuva Verona där vi spelar" },
];

interface ParsedScript {
  characters: { name: string; actor: string }[];
  lines: { character: string; text: string; isStageDirection?: boolean }[];
}

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState(1);
  const [practiceMode, setPracticeMode] = useState<'full' | 'cues' | 'lines'>('full');
  const [characters, setCharacters] = useState(sampleCharacters);
  const [lines, setLines] = useState(sampleLines);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCharacterSelect = (character: string) => {
    setSelectedCharacter(character === selectedCharacter ? null : character);
  };

  const handlePracticeModeChange = (mode: 'full' | 'cues' | 'lines') => {
    setPracticeMode(mode);
  };

  const parseScript = (text: string): ParsedScript => {
    const lines: ParsedScript['lines'] = [];
    const characters = new Set<string>();
    const characterActors = new Map<string, string>();

    // Split the text into lines
    const textLines = text.split('\n');

    textLines.forEach((line) => {
      // Clean the line
      line = line.trim();
      if (!line) return;

      // Check if it's a stage direction (text between parentheses)
      if (line.startsWith('(') && line.endsWith(')')) {
        lines.push({
          character: '',
          text: line,
          isStageDirection: true,
        });
        return;
      }

      // Check if it's a character name with actor definition (Format: Character – Actor)
      if (line.includes('–') || line.includes('-')) {
        const [character, actor] = line.split(/[–-]/).map(part => part.trim());
        if (character && actor) {
          characters.add(character);
          characterActors.set(character, actor);
          return;
        }
      }

      // Check if it's a character's line (Format: Character: Text)
      if (line.includes(':')) {
        const [character, text] = line.split(':').map(part => part.trim());
        if (character && text) {
          characters.add(character);
          lines.push({
            character,
            text,
          });
          return;
        }
      }

      // If it's just text and we have a previous line, assume it's continuation
      if (lines.length > 0 && !line.includes(':')) {
        const lastLine = lines[lines.length - 1];
        lastLine.text += ' ' + line;
      }
    });

    // Convert characters to the required format
    const charactersList = Array.from(characters).map(char => ({
      name: char,
      actor: characterActors.get(char) || '',
    }));

    return {
      characters: charactersList,
      lines,
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseScript(text);
      setCharacters(parsed.characters);
      setLines(parsed.lines);
      setCurrentScene(1);
      setSelectedCharacter(null);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Script Trainer</h1>
          <p className="text-gray-600 mb-6">Practice your lines and perfect your performance</p>
          
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all cursor-pointer">
            <Upload size={20} />
            Upload Script
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </header>

        <ScriptDisplay
          currentScene={currentScene}
          characters={characters}
          lines={lines}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={handleCharacterSelect}
          practiceMode={practiceMode}
          onPracticeModeChange={handlePracticeModeChange}
        />
      </div>
    </div>
  );
};

export default Index;
