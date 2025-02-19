
import React, { useState } from 'react';
import ScriptDisplay from '@/components/ScriptDisplay';

// Sample data
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

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState(1);
  const [practiceMode, setPracticeMode] = useState<'full' | 'cues' | 'lines'>('full');

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCharacterSelect = (character: string) => {
    setSelectedCharacter(character === selectedCharacter ? null : character);
  };

  const handlePracticeModeChange = (mode: 'full' | 'cues' | 'lines') => {
    setPracticeMode(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Script Trainer</h1>
          <p className="text-gray-600">Practice your lines and perfect your performance</p>
        </header>

        <ScriptDisplay
          currentScene={currentScene}
          characters={sampleCharacters}
          lines={sampleLines}
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
