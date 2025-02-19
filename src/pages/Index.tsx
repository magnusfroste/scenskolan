import React, { useState } from 'react';
import ScriptDisplay from '@/components/ScriptDisplay';
import { parseScript } from '@/utils/scriptParser';
import type { Character, ScriptLine } from '@/types/script';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Upload, ClipboardPaste, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const sampleScripts = [
  {
    title: "Alice in Wonderland",
    description: "A magical journey down the rabbit hole",
    content: `SCENE 1
Alice: Oh dear! Oh dear! I shall be late!
White Rabbit: I'm late, I'm late, for a very important date!
(Alice follows the White Rabbit)
Alice: What a curious thing!

SCENE 2
Mad Hatter: Would you like some tea?
Alice: I suppose so... but I haven't been invited.
March Hare: No room! No room!
Alice: There's plenty of room!`
  },
  {
    title: "Peter Pan",
    description: "The boy who wouldn't grow up",
    content: `SCENE 1
Peter Pan: All children grow up... except one.
Wendy: Can you really fly?
(Peter floats in the air)
Peter Pan: Of course I can!

SCENE 2
Captain Hook: Pan! Come out and fight like a man!
Peter Pan: If you say so, Hook!
Tinker Bell: *tinkles angrily*
(Tinker Bell flies around sprinkling fairy dust)`
  },
  {
    title: "The Wizard of Oz",
    description: "The magical journey to the Emerald City",
    content: `SCENE 1
Dorothy: Toto, I've a feeling we're not in Kansas anymore.
Scarecrow: If I only had a brain...
(Glinda appears in a bubble)
Glinda: Are you a good witch, or a bad witch?

SCENE 2
Dorothy: There's no place like home.
Tin Man: If I only had a heart...
Lion: If I only had the nerve...
(The group walks down the yellow brick road)`
  }
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

  const handleSampleScript = (script: typeof sampleScripts[0]) => {
    const parsed = parseScript(script.content);
    setCharacters(parsed.characters);
    setLines(parsed.lines);
    setScenes(parsed.scenes);
    setCurrentScene(null);
    setSelectedCharacter(null);
    setHasScript(true);
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
          <div className="flex flex-col items-center gap-8">
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

            <div className="w-full">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-900">Try a sample script</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleScripts.map((script, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleScript(script)}
                    className="text-left p-4 bg-white border rounded-lg hover:border-purple-500 transition-all group"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">{script.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{script.description}</p>
                  </button>
                ))}
              </div>
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
