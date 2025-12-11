// VIEW LAYER: Main page component

import React, { useState } from 'react';
import ScriptDisplay from '@/components/ScriptDisplay';
import { ScriptValidationDialog } from '@/components/ScriptValidationDialog';
import { ScriptConverterDialog } from '@/components/ScriptConverterDialog';
import { MiniScriptDemo } from '@/components/MiniScriptDemo';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Upload, ClipboardPaste, Sparkles, HelpCircle, FileText, UserCircle, Play, Share2, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useScript } from '@/hooks/useScript';
import { useSettings } from '@/hooks/useSettings';
import { sampleScripts } from '@/data/sampleScripts';
import { toast } from 'sonner';

const Index = () => {
  // View state (local only)
  const [scriptText, setScriptText] = useState('');
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [converterDialogOpen, setConverterDialogOpen] = useState(false);

  // Persisted settings
  const {
    practiceMode,
    selectedCharacter,
    currentScene,
    updatePracticeMode,
    updateSelectedCharacter,
    updateCurrentScene,
    resetSettings,
  } = useSettings();

  // Script data (persisted)
  const {
    characters,
    lines,
    scenes,
    parsedScript,
    hasScript,
    scriptTitle,
    validationResult,
    pendingSharedScript,
    loadScript,
    loadSampleScript,
    loadSharedScript,
    dismissSharedScript,
    confirmScript,
    cancelValidation,
    resetScript,
    getShareUrl,
  } = useScript();

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = getShareUrl();
    if (!url) return;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Länk kopierad!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Kunde inte kopiera länken');
    }
  };

  const handleCharacterSelect = (character: string) => {
    updateSelectedCharacter(character === selectedCharacter ? null : character);
  };

  const handlePracticeModeChange = (mode: 'full' | 'cues' | 'lines') => {
    updatePracticeMode(mode);
  };

  const handleSampleScript = (script: typeof sampleScripts[0]) => {
    loadSampleScript(script);
    updateCurrentScene(null);
    updateSelectedCharacter(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      loadScript(text);
      setValidationDialogOpen(true);
    };
    reader.readAsText(file);
  };

  const handleScriptPaste = () => {
    if (!scriptText.trim()) return;
    loadScript(scriptText);
    setValidationDialogOpen(true);
  };

  const handleValidationContinue = () => {
    confirmScript();
    updateCurrentScene(null);
    updateSelectedCharacter(null);
    setScriptText('');
    setValidationDialogOpen(false);
  };

  const handleValidationCancel = () => {
    cancelValidation();
    setValidationDialogOpen(false);
  };

  const handleGoBack = () => {
    resetScript();
    resetSettings();
  };

  const filteredLines = currentScene ? lines.filter(line => line.scene === currentScene) : lines;

  // Shared script welcome screen
  if (pendingSharedScript) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
        <div className="text-center max-w-md mx-auto space-y-6 w-full">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Share2 size={40} className="text-primary" />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Någon har delat ett manus med dig</p>
            <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
              {pendingSharedScript.title}
            </h1>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              size="lg" 
              onClick={loadSharedScript}
              className="w-full gap-2"
            >
              <Play size={20} />
              Börja öva
            </Button>
            <Button 
              variant="outline" 
              onClick={dismissSharedScript}
              className="w-full"
            >
              Avbryt
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Landing page (no script loaded)
  if (!hasScript) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
        <div className="text-center max-w-2xl mx-auto space-y-6 w-full">
          <h1 className="text-3xl md:text-5xl font-display font-semibold text-foreground tracking-tight">
            Scenskolan <span className="inline-block">🎭</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground px-2">
            Din kompis för att öva repliker!
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full max-w-md md:max-w-none">
              {/* Instructions */}
              <Sheet>
                <SheetTrigger asChild>
                  <div className="flex flex-row md:flex-col items-center justify-center gap-3 md:gap-2 px-4 md:px-6 py-4 bg-card border-2 border-dashed border-border rounded-lg hover:border-primary/40 hover:bg-accent/50 transition-all cursor-pointer w-full md:w-auto">
                    <HelpCircle size={24} className="text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-col items-start md:items-center">
                      <span className="text-sm font-medium text-foreground">Instruktioner</span>
                      <span className="text-xs text-muted-foreground">Så skriver du manus</span>
                    </div>
                  </div>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Så skriver du manus</SheetTitle>
                    <SheetDescription>
                      Ditt manus ska följa dessa regler:
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4 text-left">
                    <div className="mb-4 p-3 bg-accent/50 border border-primary/20 rounded-md">
                      <h3 className="text-sm font-semibold text-foreground mb-1">Importera ditt manus</h3>
                      <p className="text-sm text-muted-foreground">
                        - Filuppladdning stöder .txt-filer<br />
                        - Du kan också klistra in manus direkt
                      </p>
                    </div>
                    <ul className="list-disc pl-4 space-y-2 text-sm">
                      <li>Börja varje scen med "SCEN" följt av ett nummer</li>
                      <li>Skriv rollnamn följt av kolon (t.ex. "Pippi: Hej alla!")</li>
                      <li>Använd parenteser för scenanvisningar (t.ex. "(springer in)")</li>
                      <li>Separera scener med tomma rader</li>
                    </ul>
                    <div className="mt-4 p-4 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-2">Exempel:</p>
                      <pre className="text-xs whitespace-pre-wrap text-foreground">
{`SCEN 1
Pippi: Hej Tommy och Annika!
(Pippi springer in på scenen)
Tommy: Hej Pippi!

SCEN 2
Annika: Vad ska vi göra idag?
Pippi: Vi går på cirkus!`}
                      </pre>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Upload */}
              <label className="flex flex-row md:flex-col items-center justify-center gap-3 md:gap-2 px-4 md:px-6 py-4 bg-card border-2 border-dashed border-border rounded-lg hover:border-primary/40 hover:bg-accent/50 transition-all cursor-pointer w-full md:w-auto">
                <Upload size={24} className="text-muted-foreground flex-shrink-0" />
                <div className="flex flex-col items-start md:items-center">
                  <span className="text-sm font-medium text-foreground">Ladda upp manus</span>
                  <span className="text-xs text-muted-foreground">Välj en fil</span>
                </div>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              
              {/* Paste */}
              <Sheet>
                <SheetTrigger asChild>
                  <div className="flex flex-row md:flex-col items-center justify-center gap-3 md:gap-2 px-4 md:px-6 py-4 bg-card border-2 border-dashed border-border rounded-lg hover:border-primary/40 hover:bg-accent/50 transition-all cursor-pointer w-full md:w-auto">
                    <ClipboardPaste size={24} className="text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-col items-start md:items-center">
                      <span className="text-sm font-medium text-foreground">Klistra in manus</span>
                      <span className="text-xs text-muted-foreground">Öppna textredigerare</span>
                    </div>
                  </div>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Klistra in ditt manus</SheetTitle>
                    <SheetDescription>
                      Klistra in din manustext här. Se till att den följer rätt format.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <textarea
                      value={scriptText}
                      onChange={(e) => setScriptText(e.target.value)}
                      className="w-full h-[300px] p-4 border rounded-md"
                      placeholder="Klistra in ditt manus här..."
                    />
                    <Button onClick={handleScriptPaste} className="w-full">
                      Läs in manus
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* How it works */}
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
              
              <div className="mt-6">
                <MiniScriptDemo />
              </div>
            </div>

            {/* Sample scripts */}
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

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border/50 w-full max-w-2xl">
          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
            <p>
              Skapad av{' '}
              <a 
                href="https://www.froste.eu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Magnus Froste
              </a>
            </p>
            <p>
              <a 
                href="https://github.com/magnusfroste" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Öppen källkod på GitHub
              </a>
            </p>
          </div>
        </footer>

        {/* Dialogs */}
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
      </div>
    );
  }

  // Script practice view
  return (
    <SidebarProvider>
      <AppSidebar
        scenes={scenes}
        currentScene={currentScene}
        onSceneChange={updateCurrentScene}
        onGoBack={handleGoBack}
        onConvert={() => setConverterDialogOpen(true)}
      />
      <div className="min-h-screen flex flex-col w-full">
        <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b border-border bg-card">
          <div className="flex items-center">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-display font-semibold text-foreground">
              {scriptTitle || 'Scenskolan'} 🎭
            </h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="gap-2"
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span className="hidden sm:inline">{copied ? 'Kopierad!' : 'Dela'}</span>
          </Button>
        </header>
        
        <div className="flex flex-1">
          <main className="flex-1 p-4 md:p-6">
            <ScriptDisplay
              currentScene={currentScene || 'all'}
              characters={characters}
              lines={filteredLines}
              selectedCharacter={selectedCharacter}
              onSelectCharacter={handleCharacterSelect}
              practiceMode={practiceMode}
              onPracticeModeChange={handlePracticeModeChange}
            />
          </main>
        </div>
      </div>

      <ScriptConverterDialog
        open={converterDialogOpen}
        onOpenChange={setConverterDialogOpen}
        parsedScript={parsedScript}
      />
    </SidebarProvider>
  );
};

export default Index;
