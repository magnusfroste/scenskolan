
import React, { useState } from 'react';
import ScriptDisplay from '@/components/ScriptDisplay';
import { parseScript } from '@/utils/scriptParser';
import { validateScript, ValidationResult } from '@/utils/scriptValidator';
import { ScriptValidationDialog } from '@/components/ScriptValidationDialog';
import { ScriptConverterDialog } from '@/components/ScriptConverterDialog';
import type { Character, ScriptLine, ParsedScript } from '@/types/script';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Upload, ClipboardPaste, Sparkles, HelpCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const sampleScripts = [
  {
    title: "Tre Vänner",
    description: "Tre vänner bygger en koja",
    content: `SCEN 1
Lisa: Ska vi bygga en koja idag?
Erik: Ja! Jag har idéer!
Sara: Var ska vi bygga den?
Lisa: Under det stora trädet!
(Alla springer till trädet)

SCEN 2
Erik: Jag hittar grenar!
Sara: Jag samlar löv!
Lisa: Jag gör dörren!
(De arbetar tillsammans)
Erik: Titta hur fin den blir!
Sara: Vi är bra på att bygga!

SCEN 3
Lisa: Nu är kojan klar!
Erik: Ska vi gå in?
Sara: Ja! Det är mysigt här!
(Alla sitter i kojan)
Lisa: Det här är vår hemliga plats!
Erik: Vår bästa koja någonsin!
Sara: Vänner för alltid!
Alla: (tillsammans) Hurra!`
  },
  {
    title: "Skogspicknick",
    description: "En magisk picknick i skogen",
    content: `SCEN 1
Kanin: Hej alla! Ska vi ha picknick idag?
Ekorre: Ja! Jag tar med nötter!
(Djuren samlas på ängen)
Igelkott: Jag har ett stort äpple!
Fågel: Jag sjunger en glad sång!
(Fågeln börjar sjunga)

SCEN 2
Räv: Får jag vara med?
Kanin: Ja! Du är välkommen!
Ekorre: Vi delar allt med varandra.
(Alla sätter sig i en ring)
Igelkott: Det här är den bästa dagen!
Fågel: (sjunger) La la la!

SCEN 3
Kanin: Titta! Det regnar!
Räv: Kom! Vi springer till trädet!
(Alla springer till det stora trädet)
Ekorre: Vi är torra här!
Igelkott: Vi kan fortsätta vår picknick här!
Fågel: Regnet är som musik!

SCEN 4
Kanin: Regnet har slutat! Titta på regnbågen!
Alla: (tillsammans) Så vacker!
Räv: Tack för en fin dag!
Ekorre: Vi är de bästa vännerna!
Igelkott: Ses vi imorgon?
Fågel: Ja! Adjö, vänner!
Alla: (tillsammans) Adjö!`
  },
  {
    title: "Alice in Wonderland",
    description: "A magical journey down the rabbit hole",
    content: `SCENE 1
Alice: Oh dear! Oh dear! I shall be late!
White Rabbit: I'm late, I'm late, for a very important date!
(Alice follows the White Rabbit down the rabbit hole)
Alice: What a curious thing! I seem to be falling!
White Rabbit: No time to say hello, goodbye! I'm late, I'm late, I'm late!

SCENE 2
Mad Hatter: Would you like some tea?
Alice: I suppose so... but I haven't been invited.
March Hare: No room! No room!
Alice: There's plenty of room!
Mad Hatter: Your hair wants cutting.
Alice: You should learn not to make personal remarks. It's very rude.
(The Dormouse falls asleep in his teacup)
March Hare: Have some more tea!
Alice: I haven't had any yet, so I can't take more.

SCENE 3
Queen of Hearts: Off with her head!
Alice: Nonsense!
(The cards begin to swirl around Alice)
White Rabbit: Oh my ears and whiskers!
Queen of Hearts: Are you ready now to play croquet?
Alice: Yes, your majesty.
(The flamingos and hedgehogs arrange themselves for the game)

SCENE 4
Cheshire Cat: We're all mad here.
Alice: How do you know I'm mad?
Cheshire Cat: You must be, or you wouldn't have come here.
(The Cheshire Cat slowly disappears, leaving only its grin)
Alice: Now I've seen a cat without a grin, but never a grin without a cat!
Mad Hatter: (appearing suddenly) Why is a raven like a writing desk?
Alice: I believe I can guess that riddle!`
  },
  {
    title: "Peter Pan",
    description: "The boy who wouldn't grow up",
    content: `SCENE 1
Peter Pan: All children grow up... except one.
Wendy: Can you really fly?
(Peter floats in the air)
Peter Pan: Of course I can! All it takes is faith, trust, and a little bit of pixie dust!
John: I should like to fly very much.
Michael: Me too!
(Tinker Bell sprinkles fairy dust on the children)

SCENE 2
Captain Hook: Pan! Come out and fight like a man!
Peter Pan: If you say so, Hook!
Tinker Bell: *tinkles angrily*
(Tinker Bell flies around sprinkling fairy dust)
Smee: Careful, Captain!
Captain Hook: Smee! Don't just stand there!
(The pirates gather on deck)

SCENE 3
Lost Boys: Welcome to Neverland!
Wendy: What a wonderful place!
(The children explore the magical forest)
John: Look! Indians!
Tiger Lily: Welcome, Flying Children.
Michael: Can we stay here forever?
Peter Pan: Of course! In Neverland, you never have to grow up!

SCENE 4
Captain Hook: At last! The hideout of Peter Pan!
Smee: Shall I wake the crocodile, Captain?
(The ticking clock sound grows louder)
Captain Hook: That dreadful beast! Keep it away!
Peter Pan: Ready for another adventure, Hook?
Lost Boys: (all together) Fight! Fight! Fight!
Wendy: Oh, be careful Peter!`
  },
  {
    title: "The Wizard of Oz",
    description: "The magical journey to the Emerald City",
    content: `SCENE 1
Dorothy: Toto, I've a feeling we're not in Kansas anymore.
(Glinda appears in a bubble)
Glinda: Are you a good witch, or a bad witch?
Dorothy: I'm not a witch at all. I'm Dorothy Gale from Kansas.
(Munchkins peek out from their hiding places)
Munchkins: (singing) Follow the yellow brick road!
Dorothy: Where does it lead?
Glinda: To the Emerald City, where the Wizard lives.

SCENE 2
Dorothy: What sort of creature are you?
Scarecrow: I'm not really a creature at all. I'm a scarecrow, and I don't have a brain.
Dorothy: How can you talk if you don't have a brain?
Scarecrow: I don't know... but some people without brains do an awful lot of talking.
(The Tin Man appears, completely rusted)
Dorothy: Oh! A man made out of tin!
Tin Man: Oil... can...

SCENE 3
Lion: Put 'em up, put 'em up! I'll fight you with one paw tied behind my back!
Dorothy: You're nothing but a great big coward!
Lion: You're right. I am a coward. I haven't any courage at all.
Scarecrow: Perhaps the Wizard could help you too!
Tin Man: To Oz?
All Together: To Oz!

SCENE 4
Wizard: I am Oz, the Great and Terrible!
Dorothy: Please, sir. I want to go home to Kansas.
(The curtain is pulled back, revealing the real wizard)
Scarecrow: You're not a real wizard at all!
Wizard: I'm a good man, but I'm a very bad wizard.
Lion: What about my courage?
Wizard: You have plenty of courage. What you lack is confidence.
(Glinda reappears)
Glinda: You've always had the power to go back to Kansas.
Dorothy: I have?
Glinda: Just click your heels three times and say "There's no place like home."`
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
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [pendingScriptText, setPendingScriptText] = useState<string>('');
  const [converterDialogOpen, setConverterDialogOpen] = useState(false);
  const [parsedScript, setParsedScript] = useState<ParsedScript | null>(null);

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
    setParsedScript(parsed);
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
      
      // Validate the script first
      const validation = validateScript(text);
      setValidationResult(validation);
      setPendingScriptText(text);
      setValidationDialogOpen(true);
    };
    reader.readAsText(file);
  };

  const handleScriptPaste = () => {
    if (!scriptText.trim()) return;
    
    // Validate the script first
    const validation = validateScript(scriptText);
    setValidationResult(validation);
    setPendingScriptText(scriptText);
    setValidationDialogOpen(true);
  };

  const handleValidationContinue = () => {
    // Parse the pending script
    const parsed = parseScript(pendingScriptText);
    setCharacters(parsed.characters);
    setLines(parsed.lines);
    setScenes(parsed.scenes);
    setParsedScript(parsed);
    setCurrentScene(null);
    setSelectedCharacter(null);
    setHasScript(true);
    setScriptText('');
    setValidationDialogOpen(false);
    setPendingScriptText('');
  };

  const handleValidationCancel = () => {
    setValidationDialogOpen(false);
    setPendingScriptText('');
    setValidationResult(null);
  };

  const handleGoBack = () => {
    setHasScript(false);
    setCurrentScene(null);
    setSelectedCharacter(null);
    setCharacters([]);
    setLines([]);
    setScenes([]);
  };

  const filteredLines = currentScene ? lines.filter(line => line.scene === currentScene) : lines;

  if (!hasScript) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
        <div className="text-center max-w-2xl mx-auto space-y-6 w-full">
          <h1 className="text-3xl md:text-5xl font-display font-semibold text-foreground tracking-tight">
            Stage Stars <span className="inline-block">🎭</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground px-2">
            Take center stage! Your script practice buddy.
          </p>
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full max-w-md md:max-w-none">
              <Sheet>
                <SheetTrigger asChild>
                  <div className="flex flex-row md:flex-col items-center justify-center gap-3 md:gap-2 px-4 md:px-6 py-4 bg-card border-2 border-dashed border-border rounded-lg hover:border-primary/40 hover:bg-accent/50 transition-all cursor-pointer w-full md:w-auto">
                    <HelpCircle size={24} className="text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-col items-start md:items-center">
                      <span className="text-sm font-medium text-foreground">Script Instructions</span>
                      <span className="text-xs text-muted-foreground">Format guidelines</span>
                    </div>
                  </div>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Script Format Instructions</SheetTitle>
                    <SheetDescription>
                      Your script should follow these formatting rules:
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4 text-left">
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <h3 className="text-sm font-semibold text-blue-800 mb-1">Importing Your Script</h3>
                      <p className="text-sm text-blue-700">
                        - File uploads currently support .txt files only<br />
                        - You can also easily copy and paste your script text directly
                      </p>
                    </div>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Start each scene with "SCENE" followed by a number</li>
                      <li>Write character names followed by a colon (e.g., "Alice: Hello there!")</li>
                      <li>Use parentheses for stage directions (e.g., "(enters stage)")</li>
                      <li>Separate scenes with blank lines</li>
                      <li>Group related characters/roles at the start using "ROLLER" or "CAST"</li>
                    </ul>
                    <div className="mt-4 p-4 bg-gray-100 rounded-md">
                      <p className="text-sm font-medium mb-2">Example:</p>
                      <pre className="text-xs whitespace-pre-wrap">
{`SCENE 1
Alice: Oh dear! Oh dear! I shall be late!
(Alice runs across the stage)
White Rabbit: I'm late, I'm late!

SCENE 2
Mad Hatter: Would you like some tea?
Alice: Yes, please.`}
                      </pre>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <label className="flex flex-row md:flex-col items-center justify-center gap-3 md:gap-2 px-4 md:px-6 py-4 bg-card border-2 border-dashed border-border rounded-lg hover:border-primary/40 hover:bg-accent/50 transition-all cursor-pointer w-full md:w-auto">
                <Upload size={24} className="text-muted-foreground flex-shrink-0" />
                <div className="flex flex-col items-start md:items-center">
                  <span className="text-sm font-medium text-foreground">Upload your script</span>
                  <span className="text-xs text-muted-foreground">Tap to select file</span>
                </div>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              
              <Sheet>
                <SheetTrigger asChild>
                  <div className="flex flex-row md:flex-col items-center justify-center gap-3 md:gap-2 px-4 md:px-6 py-4 bg-card border-2 border-dashed border-border rounded-lg hover:border-primary/40 hover:bg-accent/50 transition-all cursor-pointer w-full md:w-auto">
                    <ClipboardPaste size={24} className="text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-col items-start md:items-center">
                      <span className="text-sm font-medium text-foreground">Paste your script</span>
                      <span className="text-xs text-muted-foreground">Tap to open editor</span>
                    </div>
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

            <div className="w-full max-w-4xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles size={20} className="text-gold" />
                <h2 className="text-base md:text-lg font-display font-semibold text-foreground">Try a sample script</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {sampleScripts.map((script, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleScript(script)}
                    className="text-left p-4 bg-card border-2 border-border rounded-lg hover:border-gold/60 hover:shadow-md active:scale-[0.98] transition-all group min-h-[80px]"
                  >
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary">{script.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{script.description}</p>
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
        <header className="sticky top-0 z-10 flex items-center h-14 px-4 border-b border-border bg-card">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-display font-semibold text-foreground">Stage Stars 🎭</h1>
        </header>
        
        <div className="flex flex-1">
          <AppSidebar
            scenes={scenes}
            currentScene={currentScene}
            onSceneChange={setCurrentScene}
            onGoBack={handleGoBack}
            onConvert={() => setConverterDialogOpen(true)}
          />
          <main className="flex-1 bg-background">
            <div className="h-full max-w-5xl mx-auto px-3 md:px-4 py-3 md:py-4">
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
      <ScriptValidationDialog
        open={validationDialogOpen}
        onOpenChange={setValidationDialogOpen}
        validationResult={validationResult}
        onContinue={handleValidationContinue}
        onCancel={handleValidationCancel}
      />
      <ScriptConverterDialog
        open={converterDialogOpen}
        onOpenChange={setConverterDialogOpen}
        parsedScript={parsedScript}
      />
    </SidebarProvider>
  );
};

export default Index;
