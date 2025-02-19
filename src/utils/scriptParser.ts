
import { ParsedScript, ScriptLine } from '@/types/script';

export const parseScript = (text: string): ParsedScript => {
  const lines: ScriptLine[] = [];
  const characters = new Set<string>();
  const characterActors = new Map<string, string>();
  const scenesSet = new Set<string>();
  let currentScene = "1";

  // Split the text into lines
  const textLines = text.split('\n');

  textLines.forEach((line) => {
    // Clean the line
    line = line.trim();
    if (!line) return;

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

    // Check if it's a character name with actor definition (Format: Character – Actor)
    if (line.includes('–') || line.includes('-')) {
      const [character, actor] = line.split(/[–-]/).map(part => part.trim());
      if (character && actor) {
        characters.add(character);
        characterActors.set(character, actor);
        return;
      }
    }

    // Check if it's a character's line (Format: Character: Text)
    if (line.includes(':')) {
      const [character, text] = line.split(':').map(part => part.trim());
      if (character && text) {
        characters.add(character);
        lines.push({
          character,
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
  });

  // Convert characters to the required format
  const charactersList = Array.from(characters).map(char => ({
    name: char,
    actor: characterActors.get(char) || '',
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
