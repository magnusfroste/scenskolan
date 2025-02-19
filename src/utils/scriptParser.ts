
import { ParsedScript, ScriptLine, Character } from '@/types/script';

export const parseScript = (text: string): ParsedScript => {
  const lines: ScriptLine[] = [];
  const characters = new Set<string>();
  const scenesSet = new Set<string>();
  let currentScene = "1";
  let isInRollerSection = false;

  // Split the text into lines
  const textLines = text.split('\n');

  textLines.forEach((line) => {
    // Clean the line
    line = line.trim();
    if (!line) return;

    // Check if we're entering the ROLLER section
    if (line.toUpperCase() === 'ROLLER') {
      isInRollerSection = true;
      return;
    }

    // If we're in the ROLLER section, parse character names
    if (isInRollerSection) {
      // Check if the line contains a character-actor pair
      if (line.includes('–') || line.includes('-')) {
        const [character] = line.split(/[–-]/).map(part => part.trim());
        if (character) {
          characters.add(character);
          return;
        }
      }
      
      // If we encounter a line that doesn't match the character-actor format,
      // assume we're out of the ROLLER section
      if (!line.includes('–') && !line.includes('-')) {
        isInRollerSection = false;
      }
    }

    // If we're not in the ROLLER section, process regular script lines
    if (!isInRollerSection) {
      // Check for scene markers (supports both SCEN 4 and SCEN 4:1 formats)
      const sceneMatch = line.match(/SCEN\s*(\d+(?::\d+)?)/i);
      if (sceneMatch) {
        currentScene = sceneMatch[1];
        scenesSet.add(currentScene);
        // Add scene change as stage direction
        lines.push({
          character: '',
          text: `(Scene ${currentScene})`,
          isStageDirection: true,
          scene: currentScene
        });
        return;
      }

      // Check if it's a stage direction (text between parentheses)
      if (line.startsWith('(') && line.endsWith(')')) {
        lines.push({
          character: '',
          text: line,
          isStageDirection: true,
          scene: currentScene
        });
        return;
      }

      // Check if it's a character's line (Format: Character: Text or Character (action): Text)
      if (line.includes(':')) {
        let [character, ...textParts] = line.split(':').map(part => part.trim());
        const text = textParts.join(':').trim(); // Rejoin in case there were multiple colons
        
        // Extract character name if there's a stage direction after it
        const characterMatch = character.match(/^([^(]+)(?:\s*\([^)]+\))?/);
        if (characterMatch && text) {
          const cleanCharacterName = characterMatch[1].trim();
          characters.add(cleanCharacterName);
          lines.push({
            character: cleanCharacterName,
            text,
            scene: currentScene
          });
          return;
        }
      }

      // If it's just text and we have a previous line, assume it's continuation
      if (lines.length > 0 && !line.includes(':')) {
        const lastLine = lines[lines.length - 1];
        lastLine.text += ' ' + line;
      }
    }
  });

  // Convert characters to the required format (with empty actor field)
  const charactersList = Array.from(characters).map(char => ({
    name: char,
    actor: '', // We don't track actor names anymore
  }));

  // Convert scenes set to sorted array
  const sortedScenes = Array.from(scenesSet).sort((a, b) => {
    const [aMajor, aMinor = "0"] = a.split(":");
    const [bMajor, bMinor = "0"] = b.split(":");
    const aMajorNum = parseInt(aMajor);
    const bMajorNum = parseInt(bMajor);
    if (aMajorNum !== bMajorNum) return aMajorNum - bMajorNum;
    return parseInt(aMinor) - parseInt(bMinor);
  });

  return {
    characters: charactersList,
    lines,
    scenes: sortedScenes.length > 0 ? sortedScenes : ["1"]
  };
};
