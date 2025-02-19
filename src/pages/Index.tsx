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
  },
  {
    title: "Murder Behind the Scenes",
    description: "A theatrical mystery with a twist",
    content: `ROLLER
Stella – Ellen H.
Bella – Esther
Leila – Ainhoa
Bianca – Sophia
Tim – John
Tea – Mia
Amalia – Eleanor
Titti – Andrea
Flora – Nadja
Konstapel Knep – Ellen D.
Konstapel Knåp – Melissa

SCENE 1
(Ljuset upp, skådespelarna står i statyer tills Flora kommer in)

Flora: Titti, Titti, Titti…. Är du redo med manuset

Titti (som sitter på sin plats): Ja, såklart

Leila/Tybalt: Två starka släkter fläckar med sin splittring. Det ljuva Verona där vi spelar

Tea/Vakt: En gammal fejd slår upp i ny förbittring. Som stadens endräkt åter sönderdelar.

Bianca/Amman: Ett kärlekspar som kalla stjärnor skiljer. Tar sina liv till följd av fiendskapen

Tim/Romeo: Först sörjande kan deras två familjer. Med sina barn begrava sina vapen

Alla: Och har vi missat något av det hela. Så får ni resten när ni ser oss spela

Flora: Bra början, nu kör vi balkongscenen.

Alla gör sig redo, Tim/Romeo vid balkongen.

Tea: Så fort Romeo finner kärleken i Julias blick. Skyndar han efter henne till hennes balkong

Allt stannar upp, alla väntar på Stella. Tim som spelar Romeo står redo vid Julias balkong. Det blir tyst en stund, lite för länge...

Flora: Stella, du kan komma in nu!

Bianca: (kommer fram från kulissen) Hon är inte här. Som vanligt! Men jag kan ta hennes roll så länge.

Bella (sitter eller står vid sidan av scenen): Min syster kommer när hon är redo, det behövs faktiskt en del föreberedelse när man är huvudrollen.

Alla börjar prata med varandra om hur typiskt det är att Stella inte är där. De pratar i munnen på varandra så man hör inte vad de säger.

Flora: Tysta nu allihop! Vad är min stjärna. Titti, spring efter och leta efter Stella, så väntar vi så länge.

Alla: VÄNTA?! Tittar irriterat på varandra

Stella (kommer in): Åh! Var i min loge och tittade mig i spegeln. Men nu är jag här.

Alla stannar upp, kollar på Stella som kollar på alla.

Bella (stolt): Nu är hon här!

Stella: Så! Ska vi börja då, nu när jag är här.

Flora: (Vänd mot Stella) Nämen vad bra att du kom nu. Då repeterar vi
balkongscenen.

Plötsligt försvinner ljuset och allt blir svart.

Alla skriker: Amalia!!!! Tänd ljuset.

Amalia: Det är inte jag som har gjort nåt. Jag har inte rört en spak.

Plötsligt tänds det och man ser Stella Stjärnskott ligga på
golvet.

Bianca: Lägg av nu, res på dig, sluta fåna dig. Föreställningen måste ju fortsätta. Publiken
väntar.

Bella fram till Stella och känner på pulsen

Bella: Åh herregud, hon är död! Min fantastiska syster är död!`
  }
];

const IndexPage: React.FC = () => {
  const [script, setScript] = useState<string>('');
  const [parsedScript, setParsedScript] = useState<ScriptLine[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedSample, setSelectedSample] = useState<string>('');

  const handleParse = () => {
    try {
      const { scriptLines, characters: extractedCharacters } = parseScript(script);
      setParsedScript(scriptLines);
      setCharacters(extractedCharacters);
    } catch (error) {
      console.error("Error parsing script:", error);
      alert("Failed to parse script. Please check the script format.");
    }
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScript(e.target.value);
  };

  const handleSampleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSample(e.target.value);
    const selectedScript = sampleScripts.find(s => s.title === e.target.value)?.content || '';
    setScript(selectedScript);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setScript(content);
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setScript(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      alert("Failed to read from clipboard. Please ensure you have clipboard access enabled.");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100 text-gray-700">

        <AppSidebar />

        <main className="flex-1 p-4">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Script Interface</h1>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span>Example Scripts</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Load Example Script</SheetTitle>
                  <SheetDescription>
                    Choose a sample script to load into the editor.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <select
                    value={selectedSample}
                    onChange={handleSampleSelect}
                    className="rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <option value="">Select a sample script...</option>
                    {sampleScripts.map(s => (
                      <option key={s.title} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="flex gap-2 mb-2">
                <Button variant="secondary" size="sm" onClick={handleParse}>
                  Parse Script
                </Button>
                <label htmlFor="upload-script">
                  <Button variant="ghost" size="sm" asChild>
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Upload Script</span>
                  </Button>
                </label>
                <input
                  id="upload-script"
                  type="file"
                  accept=".txt, .script"
                  className="hidden"
                  onChange={handleUpload}
                />
                <Button variant="ghost" size="sm" onClick={handlePaste}>
                  <ClipboardPaste className="h-4 w-4 mr-2" />
                  <span>Paste from Clipboard</span>
                </Button>
              </div>

              <textarea
                value={script}
                onChange={handleScriptChange}
                placeholder="Enter or paste your script here..."
                className="flex-grow p-3 border rounded-md focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                rows={10}
              />
            </div>

            <div>
              <ScriptDisplay scriptLines={parsedScript} characters={characters} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default IndexPage;
