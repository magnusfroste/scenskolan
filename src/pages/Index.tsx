
import React, { useState } from 'react';
import ScriptDisplay from '@/components/ScriptDisplay';
import { parseScript } from '@/utils/scriptParser';
import { validateScript, ValidationResult } from '@/utils/scriptValidator';
import { ScriptValidationDialog } from '@/components/ScriptValidationDialog';
import { ScriptConverterDialog } from '@/components/ScriptConverterDialog';
import type { Character, ScriptLine, ParsedScript } from '@/types/script';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Upload, ClipboardPaste, Sparkles, HelpCircle, FileText, UserCircle, Play } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const sampleScripts = [
  {
    title: "Pippi på cirkus",
    description: "Pippi visar sina konster",
    content: `SCEN 1
Pippi: Hej Tommy och Annika! Ska vi gå på cirkus idag?
Tommy: Ja! Jag älskar cirkus!
Annika: Men har vi pengar till biljetter?
Pippi: Pengar? Jag har en hel väska full!
(Pippi tar fram en stor väska med guldpengar)
Tommy: Oj! Var kommer alla de ifrån?
Pippi: Min pappa är kung på en sydhavsö!

SCEN 2
Cirkusdirektören: Damer och herrar! Välkomna till cirkus!
Pippi: Vad spännande!
(En lindansare går ut på linan)
Annika: Åh, hon är så duktig!
Pippi: Det där kan väl jag också!
Tommy: Pippi, nej! Du kan inte bara...
(Pippi klättrar upp och går på linan)
Cirkusdirektören: Vem är det barnet?!

SCEN 3
Pippi: Titta på mig! Jag kan dansa på linan!
(Publiken jublar)
Stark Man: Finns det någon som vågar brottas med mig?
Pippi: Jag! Jag är ganska stark!
Tommy: Pippi är världens starkaste!
(Pippi lyfter upp den starke mannen)
Annika: Hon vann! Hon vann!
Alla: (tillsammans) Hurra för Pippi!`
  },
  {
    title: "Emil i snickarboa",
    description: "Emil har gjort bus igen",
    content: `SCEN 1
Lansen: EMIL! Kom hit genast!
Emil: Ja, pappa?
(Emil kommer in med oskyldigt ansikte)
Lansen: Vem har släppt ut alla grisar?
Emil: Det var inte meningen...
Alma: Stackars lansen, nu blir du alldeles röd i ansiktet!
Alfred: Jag tyckte det var lite roligt faktiskt.
Ida: Emil gör alltid bus!

SCEN 2
Lansen: Nu får du sitta i snickarboa!
Emil: Men pappa! Jag ville bara hjälpa grisarna!
(Emil går in i snickarboden)
Alfred: Jag smyger dit med lite mat sen, Emil.
Emil: Tack Alfred! Du är min bästa vän!
(Dörren stängs)
Lina: Den pojken! Han är hopplös!

SCEN 3
(Emil sitter och snider gubbar)
Emil: Nu gör jag den hundrafemtionde gubben!
(Ida tittar in genom fönstret)
Ida: Hej Emil! Får jag se?
Emil: Titta! Den här ser ut som pappa när han är arg!
Ida: Ha ha! Den är precis lik!
Emil: Imorgon ska jag vara snäll. Kanske.
Ida: Det säger du alltid!
Emil: Men nu menar jag det! Nästan.`
  },
  {
    title: "Ronja och Birk",
    description: "Ett möte i skogen",
    content: `SCEN 1
Ronja: Vem är du? Vad gör du i min skog?
Birk: Din skog? Det är min skog!
(De stirrar argt på varandra)
Ronja: Jag är Ronja Rövardotter! Mattis är min far!
Birk: Och jag är Birk Borkason! Vi är fiender!
Ronja: Fiender? Varför då?
Birk: Det har vi alltid varit!

SCEN 2
(Ronja ramlar ner i en grop)
Ronja: Hjälp! Jag kan inte ta mig upp!
Birk: Ska jag hjälpa dig?
Ronja: Ja! Snälla!
(Birk sträcker ner sin hand)
Birk: Här! Ta min hand!
Ronja: Tack! Du räddade mig!
Birk: Kanske kan vi vara vänner istället?

SCEN 3
Ronja: Vi ses vid bäcken imorgon?
Birk: Ja! Men säg inte till våra fäder!
(De skakar hand)
Ronja: Det blir vår hemlighet.
Birk: Vänner i hemlighet!
Ronja: Jag tycker faktiskt att du är ganska snäll.
Birk: Du med! För att vara en Mattisdotter!
Båda: (skrattar) Ses imorgon!`
  },
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

            {/* How it works section */}
            <div className="w-full max-w-2xl">
              <h2 className="text-base md:text-lg font-display font-semibold text-foreground text-center mb-6">
                Så här funkar det
              </h2>
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText size={24} className="text-primary" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-foreground">1. Välj manus</span>
                  <span className="text-xs text-muted-foreground hidden md:block">Ladda upp eller prova ett exempel</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle size={24} className="text-primary" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-foreground">2. Välj din roll</span>
                  <span className="text-xs text-muted-foreground hidden md:block">Markera karaktären du spelar</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Play size={24} className="text-primary" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-foreground">3. Öva repliker</span>
                  <span className="text-xs text-muted-foreground hidden md:block">Tre övningslägen att välja på</span>
                </div>
              </div>
            </div>

            {/* Sample scripts section */}
            <div className="w-full max-w-4xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles size={20} className="text-gold" />
                <h2 className="text-base md:text-lg font-display font-semibold text-foreground">Prova ett manus</h2>
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
