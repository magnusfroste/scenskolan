// DATA LAYER: Demo content for MiniScriptDemo

export interface DemoLine {
  character: string;
  text: string;
}

export const demoLines: DemoLine[] = [
  { character: 'Pippi', text: 'Ska vi gå på cirkus idag?' },
  { character: 'Tommy', text: 'Ja! Jag älskar cirkus!' },
  { character: 'Annika', text: 'Men har vi pengar?' },
  { character: 'Pippi', text: 'Jag har en hel väska full!' },
];

export const demoCharacters = ['Pippi', 'Tommy', 'Annika'];
