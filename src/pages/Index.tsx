import React, { useState } from 'react';
import ScriptDisplay from '@/components/ScriptDisplay';
import { parseScript } from '@/utils/scriptParser';
import type { Character, ScriptLine } from '@/types/script';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Upload, ClipboardPaste } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
  const [currentScene, setCurrentScene] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState<'full' | 'cues' | 'lines'>('full');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [lines, setLines] = useState<ScriptLine[]>([]);
  const [scenes, setScenes] = useState<string[]>([]);
  const [hasScript, setHasScript] = useState(false);
  const [scriptText, setScriptText] = useState('');

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
      setCurrentScene(null);
      setSelectedCharacter(null);
      setHasScript(true);
    };
    reader.readAsText(file);
  };

  const handleScriptPaste = () => {
    if (!scriptText.trim()) return;
    
    const parsed = parseScript(scriptText);
    setCharacters(parsed.characters);
    setLines(parsed.lines);
    setScenes(parsed.scenes);
    setCurrentScene(null);
    setSelectedCharacter(null);
    setHasScript(true);
    setScriptText('');
  };

  const filteredLines = currentScene ? lines.filter(line => line.scene === currentScene) : lines;

  if (!hasScript) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">Script Trainer</h1>
          <p className="text-xl text-gray-600">
            Upload your script and practice your lines with our interactive reader.
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              <label className="flex flex-col items-center gap-2 px-6 py-4 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-all cursor-pointer">
                <Upload size={24} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Upload your script</span>
                <span className="text-xs text-gray-500">Drag and drop or click to select</span>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              
              <Sheet>
                <SheetTrigger asChild>
                  <div className="flex flex-col items-center gap-2 px-6 py-4 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-all cursor-pointer">
                    <ClipboardPaste size={24} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Paste your script</span>
                    <span className="text-xs text-gray-500">Click to open editor</span>
                  </div>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Paste Your Script</SheetTitle>
                    <SheetDescription>
                      Paste your script text here. Make sure it follows the correct format.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <textarea
                      value={scriptText}
                      onChange={(e) => setScriptText(e.target.value)}
                      className="w-full h-[300px] p-4 border rounded-md"
                      placeholder="Paste your script here..."
                    />
                    <Button onClick={handleScriptPaste} className="w-full">
                      Process Script
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <div className="flex flex-1">
          <AppSidebar
            scenes={scenes}
            currentScene={currentScene}
            onSceneChange={setCurrentScene}
            onGoBack={() => setHasScript(false)}
          />
          <main className="flex-1 bg-gray-50">
            <div className="h-full max-w-5xl mx-auto px-2 py-4">
              <ScriptDisplay
                currentScene={currentScene ?? "all"}
                characters={characters}
                lines={filteredLines}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                selectedCharacter={selectedCharacter}
                onSelectCharacter={handleCharacterSelect}
                practiceMode={practiceMode}
                onPracticeModeChange={handlePracticeModeChange}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
