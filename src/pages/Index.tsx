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

Bella: Åh herregud, hon är död! Min fantastiska syster är död!


Tim (går närmare för att titta): Va, är hon död?

Bella: Håll dig borta från henne!

Bianca: Vad ska vi göra Flora?

Flora (som inte hängt med på att Stella ramlat ihop): Göra? Repetera såklart, sätt igång

Tim: Har du inte fattat någonting?!

Tea: Hon är död! Stella är död!

Flora: Död, men det är ju förfärligt. Vad ska vi göra?!! Ring någonstans.
Titti!! Ring brandkår, ambulans, polis… (Titti ringer)

Titti: Ja hallå har jag kommit till 112? Jag det var från Medborgarplatsens teater här. Det
har hänt en liten olycka…tja liten och liten…hon är död… Stella Stjärnskott är
död…… Jaha, tack så mycket då. (Lägger på) De kommer.

Flora: Hur kunde det här ha hänt…min stjärna…Rör henne inte!!! Ingen rör någonting!!!




SCENE 2
Konstapel Knep: Det var från polisen. Har det skett ett brott här?

Konstapel Knåp: Vart är brottslingen? (tar fram handbojor)

Flora Förvirrad: Brottslingen? Här finns det ingen brottsling.

Konstapel Knep: Men ni har ringt till polisen. Någonting måste väl ha hänt?!

Alla pratar i mun på varandra, berättar vad som har hänt.
Konstapel Knep antecknar febrilt. Konstapel Knåp tar sig fram
till liket.

Konstapel Knep: Lugn, en i taget.

Konstapel Knåp: Jag tror jag har hittat liket.

Konstapel Knep: På så vis, på så vis… Backa backa… så nu ska vi se här
Det var som jag misstänkte hela tiden. Hon är död... Sannolikt mördad.

Alla: Mördad!

Bella: Min älskade syster, mördad! Ni måste genast hitta den skyldige!

Konstapel Knep: Ja frågan är bara av vem och hur? Ingen får lämna teatern.

Konstapel Knåp: Alla är misstänkta.

Konstapel Knep: Vi måste förhöra alla.

Konstapel Knep: Vi börjar med de båda där. (pekar på Tim och Tea)

Konstapel Knåp: Ni andra kan lämna salongen så länge. Kan någon ta undan liket?
(Titti och Amalia drar ut liket)



SCENE 3
Tea och Tim sätter sig på varsin stol vid bordet som står på vänster sida av scenen. Konstapel Knep och Knåp kanske står, kanske sitter ner.

Konstapel Knep: Vart befann ni er vid tidpunkten för mordet?

Tim: På scenen såklart.

Tea: Det var ju repetition.

Konstapel Knåp: Har ni någon aning om vem som kan ha gjort detta?

Tim: Ingen aning men jag har mina misstankar.

Tea: Tänker du på samma som mig? Det börjar på B och slutar på ianca.

Tim: Exakt. Precis vad jag tänkte på också…

Konstapel Knep: Varför Bianca?

Tim: Hon har alltid önskat att få spela Julia.

Tea: Och hon kan bli väldigt arg.

Tim: Verkligen, hon skulle nog kunna ha ihjäl någon om hon ville.

Tea
Va! Tror du det?

Tim:
Hon dödade en fluga en gång utan att blinka.

Tea
Just det, sedan också det där som hände tidigare idag.

Konstapel Knåp: Vadå, berätta!

Tea: Vi var i logen och skulle göra oss i ordning.

Musik och ljusförändring. Scenen utspelar sig.




SCENE 3:2
Man ser Tim och Tea gömma sig vid lilla scenen. De tjuvlyssnar och kollar på det som händer. Bianca och Flora är inne på Floras kontor, Bianca är arg på Flora.

Bianca: Du lovade mig att jag skulle få spela huvudrollen den här gången. Du har lovat mig
många gånger. Nu måste jag få spela Julia!

Flora: Förlåt jag glömde… igen…. och så blev det så tokigt. Stella...

Bianca: DET ÄR ALLTID STELLA!

Flora: Men, du är alltid så arg

Bianca
Jag är inte arg, jag är bara besviken på att jag aldrig får spela
huvudrollen. Du lovar mig alltid rollen men får jag nånsin den? Nej. Är det rättvist!?

Flora: Ja, jag vet... Men nästa gång ska du få vara huvudrollen... jag kan skriva upp det
på en ”komihåg lapp”… om jag bara kunde hitta lapparna.

Flora börjar leta på sitt skrivbord

Bianca: Ähh jag löser det här själv. Nästa gång är det jag som har huvudrollen, om jag så
måste kliva över lik så ska jag ha rollen. (Bianca ut)

Musik och ljusförändring. Tillbaka till förhörssituationen.

Tea: Där hör ni klart och tydligt, det måste vara Bianca. ”Om jag så måste kliva över
lik”

Tim: Det är väl inte konstigt att Bianca vill spela Julia eftersom jag är hennes favorit och jag spelar ju Romeo så…

Tea: Vad menar du med det? Du är väl inte hennes favorit! Det är det ju jag som är. Det
vet väl alla.

Tim:
Lägg av, såhär har du hållit på ändå sen vi var små...
(Tim och Tea går ut samtidigt som de fortsätter bråka)

Konstapel Knep & Knåp (Tittar på varandra): Vi måste nog förhöra Bianca

Knep:
Titti!
(Titti tittar in)

Knåp:
Vi vill förhöra Bianca nu.
(Titti försvinner, kommer fort tillbaka med Bianca som sätter sig på
förhörsstolen)



SCENE 4:1
Konstapel Knep: Vart befann ni er vid tidpunkten för mordet?

Bianca: På scenen såklart.

Konstapel Knåp: Och vad hände innan det?

Bianca: Vadå innan?

Konstapel Knep: Inne på Floras kontor.

Bianca: Jag fattar inte vad ni menar.

Konstapel Knep: (Härmar B) Nästa gång är det jag som ska ha huvudrollen om jag så ska kliva
över lik. Känns det igen?

Bianca: Äh skitsnack. Det var bara nåt jag sa. Såklart att jag inte skulle döda henne. Men
jag vet vem som gjorde det.

Konstapel Knep & Knåp: VEM DÅ!?

Bianca: Igår när jag var på väg hem och som vanligt gick förbi regissör Floras kontor så
hörde jag att någon kom. Jag trodde det var Flora och tänkte skoja med honom
lite så jag gömde mig för att skrämma honom.

Musik och ljusförändring. Scenen utspelar sig.




SCENE 4:2
Bianca, som om hon är på väg hem, gömmer sig i kulissen. In kommer Leila med en bunt med manus. Hon går in på Floras kontor.

Leila (för sig själv men så publiken hör:):
Nu ska vi se. Var kan Flora ha lappen med allas roller i nästa pjäs, så jag bara kan
ändra lite.

Leila tittar runt omkring, letar igenom pappershögarna på bordet. Samtidigt som Leila kommer in på kontoret ser vi Stella komma in på scenen, hon ser att någon är inne på kontoret och smyger in.


Stella (för sig själv men så publiken hör):
Nu du Leila, detta ser inte bra ut.
Hostar/Harklar så Leila blir skrämd, hör Stella och vänder sig om.

Leila:
Oj! Stella. Jag skulle bara...

Stella:
Aj aj, detta ser inte bra ut Leila. Inbrott på chefens kontor, inbrott är olagligt vet
du.

Leila:
Men snälla Stella...

Stellan:
Men jag är inte snälla Stella, jag är Stella Stjärnskott (Hon går därifrån)

Leila:
Stella ska inte få prata med Flora, det ska jag se till!!
(hon går ut)

Musik och ljusförändring. Tillbaka till förhörssituationen.


Konstapel Knep & Knåp: Tack Bianca.

Knep:
Vi måste nog förhöra Leila.

Knåp:
Titti! Är du snäll och hämtar Leila.
(Titti tittar ut på scenen och går för att hämta Leila.
Bella kommer in).

Bella:
Hur går utredningen, har ni hittat min systers mördare?

Knep:
Inte än, men...

Bella:
Inte än! Ni har ingen aning om vem det kan vara?

Knåp:
Aning och aning, det kanske vi...

Bella:
Vet ni vem min syster var? Hon var faktiskt Stella Stjärnskott, en av de största skådespelerskorna i det här landet, och en alldeles fantastisk människa. Det är bäst för er att ni hittar mördaren, annars lovar jag er att jag kommer gå till tidningarna med det här.

(Leila kommer in)

Knep:
Tack för dina... tankar, men...

Knåp:
Nu måste vi fortsätta med förhören.

(Bella går ut)



SCENE 5:1
Konstapel Knep: Varsågod och sitt, Leila. Nå, vart befann ni er vid tidpunkten för mordet?

Leila: På scenen.

Konstapel Knåp: Och vad gjorde du på Floras kontor igår?

Leila: Jag har inte varit där.

Konstapel Knep: Bianca har redan berättat, det är ingen idé att förneka.

Leila: Jag fattar inte vad ni menar.

Konstapel Knep: (härmar Leila) Stella ska inte få prata med Flora, det ska jag se till!!! Känns
det igen?

Leila: Hon ljuger. Men jag vet vem som är mördaren.

Knep & Knåp: Vem då?

Leila: Amalia.

Musik och ljusförändring. Scenen utspelar sig.




SCENE 5:2
(Leila in med manus i hand, läser repliker tyst för sig själv. Amalia in med en stege, klättrar upp och fixar med lamporna. Sufflösen Titti in och sätter sig och läser manus. Stella in står och glänser i ljuset. Bella står och tar foton av Stella.)

Amalia: Blir det bra här Stella?

Stella: Nej nej lite mera åt höger… Ändra den där lampan.

Amalia: (får klättra ner och rikta om) Här då?

Stella: Nää inte riktigt bra. Jag tycker det blir lite skuggor i mitt ansikte. Du, öhh du….
(menar Titti) Hallå du där… sufflösen, visst är det skuggor i mitt ansikte.

Titti: Jag heter Titti. Nää inte så mycket.

Stella: INTE SÅ MYCKET!! Är du blind, människa? Nää Amalia. Du får rikta om den där
lampan. Mera ljus på mig.

Amalia: (Klättrar upp för stegen, muttrar) Mera ljus på mig…

Stella: Vad sa du?

Amalia: Ingenting. Blir det bra så?

Stella: Nää jag tycker fortfarande det är skuggor. Mitt hår får inte den rätta glansen. Vad säger du Bella?

Bella: Ja du har rätt, ditt hår ser strålande ut, vi vill ju att publiken ska få se det, eller hur?

Stella: Du hörde henne, rikta om ett par till.

Amalia: Det finns inga fler lampor.

Stella: Finns inga fler? Fixa det då!! Stjärnans hår måste faktiskt se bra ut, det fattar du
väl. Åhh nu har jag fått huvudvärk också du…Sufflösen hämta mina
huvudvärkstabletter!! (går ut klagandes)

Bella (till Amalia och Titti):
Det här får ni faktiskt fixa, så svårt kan det inte vara.
(Hon går ut efter Stella)
​
Amalia:
(härmar Stella) Stjärnans hår måste faktiskt se bra ut... Åhhh nu har jag
huvudvärk, hämta mina tabletter…. Hon är inte riktigt klok.

Titti:
(på väg ut) Lite jobbig kanske.

Amalia:
Lite!! Hon är en idiot! Man skulle ge henne en rejäl stöt så slapp vi hans klagande
en gång för alla.

Stella (ropar från sidan av scenen): Fiffi!!! Piffi!! Mina huvudvärkstabletter.

Titti: Jag kommer!! (Amalia ut.)

Musik och ljusförändring. Tillbaka till förhörssituationen.

Leila: Där ser ni! Amalia är mördaren.

Konstapel Knep & Knåp: Vi måste nog förhöra Amalia
(Ropar) Titti! Vi vill förhöra Amalia.

Amalia kommer in på scenen.



SCENE 6:1
Konstapel Knep: Vart befann ni er vid tidpunkten för mordet?

Amalia: Där uppe!!

Konstapel Knåp: Uppe?

Amalia: Jag sköter ljuset!

Konstapel Knep: På så vis…och du ville ge Stella en stöt så han dog!

Amalia: Jag fattar inte vad ni menar.

Konstapel Knep: (härmar Amalia) Man skulle ge henne en rejäl stöt så slapp vi hans klagande
en gång för alla. Känns det igen?

Amalia: Vem har sagt det, det var inte jag. Men jag vet hur hon dog.

Knep & Knåp: Hur då?

Amalia: Det var Titti, med dom här (Visar tablettburken).

Musik och ljusförändring. Scenen utspelar sig.




SCENE 6:2
(Stella Stjärnskott in)

Stella: Piffi! Piffi! PIFFI!!! (Titti in)

Titti: Jag heter faktiskt Titti, och jag är på väg hem.

Stella: Ja, ja Titti, Piffi what ever.. Jag har sån huvudvärk. Hämta mina huvudvärkstabletter, åhh mitt stackars huvud!!

Titti: (Går ut från scenen, kommer in tablettburken) Varsågod

Stella: Vatten. Hämta vatten…

Titti: (Går ut från scenen, kommer in med glas vatten) Ok. Varsågod. (är på väg ut)

Stella: Ge mig en tablett…. men absolut bara en. De är så starka att tre tabletter skulle
slå ut mig helt. Och på fyra tabletter vore jag nog död. (Titti tar burken,
ger henne en tablett, sedan påväg ut) Min favoritkudde, hämta den..

Titti: Jag är på väg hem

Stella: Min kudde!! Den ligger ju där (pekar på en stol med kudde på scenen) , ska det vara så mycket begärt.

Titti: Ok då (ger henne kudden, är på väg ut från scenen, på väg hem)

Stella: Åhh varför är det så ljust för?!

Titti: Scenlamporna är på.

Stella: Dra ner lyset lite är du snäll… inte så mycket... lite lagom

Titti:
(För sig själv men så publiken hör ) Tre tabletter slår ut henne helt,
fyra skulle han kanske dö av. Jag undrar vad som skulle hända med tio tabletter.
(Titti ut med burken, släcker ljuset helt)

Stella: PIFFI!! HALLÅ… PIFFI LJUSET!

Musik och ljusförändring. Tillbaka till förhörssituationen.

Konstapel Knep & Knåp: Tack Amalia.

Knåp:
Vi måste nog förhöra Titti.
Amalia går ut.

Knep:
Titti! Nu är det din tur att bli förhörd.
Titti kommer in och sätter sig på förhörsstolen



SCENE 7:1
Konstapel Knep: Vart befann ni er vid tidpunkten för mordet?

Titti: På scenen. Jag hade precis hämtat Stella från logen.

Konstapel Knep: På så vis… och du tänkte förgifta Stella!

Titti: Va! Jag förstår inte vad du menar?!

Konstapel Knåp: Tre tabletter slår ut henne helt, fyra skulle han kanske dö av. Jag undrar vad som
skulle hända med tio tabletter. Känns det igen?

Titti: Jag!!! Jag skulle inte kunna ta livet av en liten mus utan att börja gråta. Men jag
vet vem det var.

Knep & Knåp: Vem då?

Titti: Den som förlorade mest på att Stella var i livet. Den som verkade vara mest
förtvivlad över att hon dog – Flora… Förra veckan jobbade jag sent en kväll, då
jag såg att det lyste på Floras kontor….
Musik och ljusförändring. Scenen utspelar sig.




SCENE 7:2
(Flora in med sitt skrivbord. Vid sin en pappershög och med en
miniräknare i handen.

Flora: - 125 200, -142 300, -189 900…

(Telefonen ringer.) Medborgarplatsens teater, det är Flora… ja det är jag… ljusfirman Lyset sa du.. (letar fram räkningen ur pappershögen) Ja ha, den räkningen ska jag betala… ja genast… försenad två månader… ja den måste ha kommit bort i högen… nä jag ska betala den jag lovar. Inga problem..(lägger på)

- 230 000. Vi får dra in på något, inget fika till skådespelarna. Kanske måste vi avskeda någon?
(Telefonen ringer) Medborgarplatsens teater, det är Flora… nej det är inte jag. Jag är inte Flora och ni har absolut inte kommit till Medborgarplatsens teater. Tack och adjö.
(lägger på, det ringer igen. Han håller för öronen slänger till slut telefonen i papperskorgen)
Det är kört och allt tack vare att jag, i ett litet förvirrat ögonblick, skrev på det fördömda avtalet som ger Stella Stjärnskott en månadslön som är högre än hela teaterns övriga personal tillsammans.

Vi går i konkurs, vi får riva teatern, min dröm är snart bara en hög av sten (får
syn på en tegelsten) såvida inte (tar upp stenen, knyter repet
runt, håller upp den mot taket och släpper ner den.) Såvida inte…
(Flora ut)

Titti: Ni hör väl själva. Såvida inte…

Konstapel Knep: Vi måste nog förhöra Flora.

Konstapel Knåp:
Titti, kan du...

Titti:
Jag fattar, jag hämtar honom
Titti går ut, efter kort stund kommer Flora in, förvirrad.



Scen 8:1
Förhör med Flora

Flora: Det här är förfärligt, min stjärna är död, föreställningen är hotad…

Konstapel Knep: Sluta spela teater.

Flora: Vi går i konkurs…

Konstapel Knåp: Det hade ni gjort om inte du hade mördat Stella.

Flora: Va! Vad är det här för skämt. Skulle jag döda min egen stjärna?
Det var det dummaste jag har hört.

Knep & Knåp: Vem gjorde det då?

Flora: Här är det inte tal om vem, utan om vilka.

Musik och ljusförändring. Scenen utspelar sig.




SCEN 8:2
(I logen. Stella kommer in och sätter sig i sin fåtölj och slappar, tittar på mobilen, skakar på huvudet)

Stella: Usch!! (kastar den på golvet, Tim in på ena sidan av skärmen)

Tim: Hej bästis, vad tyckte du om de där youtube-klippen som jag skickade?

Stella: De var jätteroliga, verkligen... kul.

Tim: Jag visste det, vi har samma humor!

Stella: Det klart du är.

Tim: Då är jag din absoluta favorit?

Stella: Det vet du Tim. Jag var så glad att du fick rollen som Romeo.

Tim: Det var det jag visste!! (Han försvinner ut, Stella tar upp en
chokladask och smakar en chokladbit, spottar ut)

Stella: Bläää… (Tea in från andra sidan skärmen)

Tea: Hej bästis, vad tyckte du om chokladasken du fick av mig?

Stella: (tar snabbt upp chokladasken) Den var jättegod, den bästa chokladen jag
någonsin har ätit.

Tea: Jag visste det, vi har alltid samma smak! Då är jag din absoluta favorit?

Stella: Det vet du Tea. Synd att du inte fick en större roll, av dig och Tim är det ju tydligt du som är
talangen i er familj.

Tea: Det var det jag visste!! (Han försvinner bakom ut, Tim in)


Tim: Stella…

Stella: Mmmmm Tea...

Tim: TEA!!!

Stella: Ähh Tim menade jag.

Tim: Ja jag tänkte väl det! Den där galapremiären du ska på, visst är det fortfarande jag som får
följa med som ditt sällskap?

Stella: Klart det är, om du fixar limousine dit…

Tim: Klart jag gör…(Tim på väg ut men försvinner inte utan hör vad
Stella säger till Tea)

Tea: Stella…

Stella: Mmmm Tim

Tea: TIM!!

Stella: Ähh Tea menade jag.

Tea: Ja jag tänkte väl det!! Visst är det fortfarande jag som ska få följa med dig på den där
galapremiären?

Stella: Klart det är, om du fixar limousine.

Tea: Klart jag gör.

Tim: Vad pysslar du med?

Stella: Va!

Tim: Är det inte jag som är din bästis?

Stella: Det vet du att du är.

Tea: VA!! Det är väl jag som är din favorit!!

Stella: Men det är du jag lovar…

Tim: Nää nu får det vara nog! Tea hon har lurat oss båda två.

Tea: Vilken idiot!

Tim, Tea: Jag vill aldrig mera se dig, jag önskar att du var död!! (båda ut)

Stella: Äh! Struntar väl i dom två (ut)

Musik och ljusförändring.


SCEN 9
Förhör med Bella
(Knep och Knåp vid ditt förhörsbord)

Knep:
Jaha då har vi förhört alla utom en.

Knåp:
Ja den enda som är kvar nu, det är ju...

(Bella stormar in)

Bella:
Nu kräver jag att ni berättar hur utredningen går, har ni hittat mördaren NU då?

Knåp:
Vad bra att du kom Bella, nu är det din tur att bli förhörd.

Knep:
Varsågod och sitt.

(Bella sätter sig inte)

Bella:
Ni kan väl ändå inte tro att jag mördade min egen syster?

Knep:
Ni kanske var avundsjuk på henne?

Bella:
Verkligen inte, jag såg ju som alla andra vilken stjärna hon var.

Knåp:
Du kanske ville vara en stjärna själv?

Bella:
Struntprat, förresten så fick jag följa med henne på alla galapremiärer och fester, så det fanns ingenting att vara avundsjuk på. Nu tänker jag inte lyssna mer på det här, och ni borde göra ert jobb istället för att komma med såna här dumheter.

(Hon går ut).


SCEN 10
Alla blir inkallade – alla blir anklagade

Konstapel Knep: Vilken soppa, alla har motiv och dessutom varsitt mordvapen.

Konstapel Knåp: Men vem är mördaren!

Konstapel Knep: Jag har en idé. Kalla in alla.
Titti! (Titti tittar in på scenen) Hämta in alla till scenen på en gång.
(Alla kommer in på scenen och ställer upp sig)
Alla ni har motiv att mörda Stella Stjärnskott. Nu har vi listat ut vem av er som är
mördaren.

Konstapel Knåp: Har vi?!

Konstapel Knep: Ja det har vi. Vi vet vem som är
