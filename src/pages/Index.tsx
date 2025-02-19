
import React, { useState } from 'react';
import ScriptDisplay from '@/components/ScriptDisplay';
import ScriptHeader from '@/components/ScriptHeader';
import SceneNavigation from '@/components/SceneNavigation';
import { parseScript } from '@/utils/scriptParser';
import type { Character, ScriptLine } from '@/types/script';

// Sample data
const sampleCharacters: Character[] = [
  { name: "Stella", actor: "Ellen H." },
  { name: "Bella", actor: "Esther" },
  { name: "Leila", actor: "Ainhoa" },
  { name: "Tim", actor: "John" },
];

const sampleLines: ScriptLine[] = [
  { character: "Flora", text: "Titti, Titti, Titti…. Är du redo med manuset", scene: "1" },
  { character: "Titti", text: "Ja, såklart", scene: "1" },
  { isStageDirection: true, character: "", text: "(Ljuset upp, skådespelarna står i statyer tills Flora kommer in)", scene: "1" },
  { character: "Leila", text: "Två starka släkter fläckar med sin splittring Det ljuva Verona där vi spelar", scene: "1" },
];

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<string>("1");
  const [practiceMode, setPracticeMode] = useState<'full' | 'cues' | 'lines'>('full');
  const [characters, setCharacters] = useState(sampleCharacters);
  const [lines, setLines] = useState<ScriptLine[]>(sampleLines);
  const [scenes, setScenes] = useState<string[]>(["1"]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCharacterSelect = (character: string) => {
    setSelectedCharacter(character === selectedCharacter ? null : character);
  };

  const handlePracticeModeChange = (mode: 'full' | 'cues' | 'lines') => {
    setPracticeMode(mode);
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
      setScenes(parsed.scenes);
      setCurrentScene(parsed.scenes[0]);
      setSelectedCharacter(null);
    };
    reader.readAsText(file);
  };

  const filteredLines = lines.filter(line => line.scene === currentScene);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <ScriptHeader onFileUpload={handleFileUpload} />

        <ScriptDisplay
          currentScene={currentScene}
          characters={characters}
          lines={filteredLines}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={handleCharacterSelect}
          practiceMode={practiceMode}
          onPracticeModeChange={handlePracticeModeChange}
        />

        <SceneNavigation
          scenes={scenes}
          currentScene={currentScene}
          onSceneChange={setCurrentScene}
        />
      </div>
    </div>
  );
};

export default Index;
