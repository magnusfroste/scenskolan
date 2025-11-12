
import { ParsedScript, ScriptLine, Character } from '@/types/script';

// Helper function to detect if a line is in ROLLER format (character-actor pair)
const isRollerLine = (line: string): boolean => {
  // Support multiple separators: colon, dash, or en-dash
  return /^[^:–-]+\s*[:–-]\s*.+$/.test(line);
};

// Extract character name from ROLLER section line
const extractCharacterFromRoller = (line: string): string | null => {
  // Support both "Character: Actor" and "Character – Actor" formats
  const match = line.match(/^([^:–-]+)\s*[:–-]/);
  return match ? match[1].trim() : null;
};

// Detect markdown headers (# Character:, ## Character:, etc.)
const isMarkdownHeader = (line: string): boolean => {
  return /^#+\s*.+:/.test(line);
};

// Extract character and text from markdown header format
const extractCharacterFromMarkdown = (line: string): { character: string, text: string } | null => {
  const match = line.match(/^#+\s*([^:]+):\s*(.*)$/);
  if (match) {
    const [_, character, text] = match;
    // Remove any stage directions from character name
    const cleanCharacter = character.trim().replace(/\s*\([^)]+\).*$/, '');
    return {
      character: cleanCharacter,
      text: text.trim()
    };
  }
  return null;
};

// Flexible scene header detection supporting multiple formats
const detectSceneHeader = (line: string): { scene: string, description: string } | null => {
  // Format 1: SCEN 4, SCEN 4:1, SCEN 4: Description
  let match = line.match(/^SCEN\s*(\d+(?::\d+)?)\s*:?\s*(.*)$/i);
  if (match) {
    return { scene: match[1], description: match[2].trim() };
  }
  
  // Format 2: Scene 1, Scene 1:, Scene 1: Description
  match = line.match(/^Scene\s+(\d+(?::\d+)?)\s*:?\s*(.*)$/i);
  if (match) {
    return { scene: match[1], description: match[2].trim() };
  }
  
  // Format 3: Markdown headers (## Scen 1, ## Scene 1)
  match = line.match(/^#+\s*(?:Scen|Scene)\s+(\d+(?::\d+)?)\s*:?\s*(.*)$/i);
  if (match) {
    return { scene: match[1], description: match[2].trim() };
  }
  
  // Format 4: Simple numbered scenes (1., 2., etc.) - only if at start of line
  match = line.match(/^(\d+)\.\s*(.*)$/);
  if (match && parseInt(match[1]) <= 50) { // Reasonable limit to avoid false positives
    return { scene: match[1], description: match[2].trim() };
  }
  
  return null;
};

export const parseScript = (text: string): ParsedScript => {
  const lines: ScriptLine[] = [];
  const characters = new Set<string>();
  const scenesSet = new Set<string>();
  let currentScene = "1";
  let isInRollerSection = false;

  // Split the text into lines
  const textLines = text.split('\n');

  textLines.forEach((line, lineIndex) => {
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
      if (isRollerLine(line)) {
        const character = extractCharacterFromRoller(line);
        if (character) {
          characters.add(character);
          return;
        }
      } else {
        // If line doesn't match ROLLER format, we're out of the section
        isInRollerSection = false;
      }
    }

    // If we're not in the ROLLER section, process regular script lines
    if (!isInRollerSection) {
      // Check for scene markers (multiple formats)
      const sceneHeader = detectSceneHeader(line);
      if (sceneHeader) {
        currentScene = sceneHeader.scene;
        scenesSet.add(currentScene);
        
        // Store the scene line with its description
        const sceneText = sceneHeader.description 
          ? `SCEN ${currentScene}: ${sceneHeader.description}`
          : `SCEN ${currentScene}`;
        
        lines.push({
          character: '',
          text: sceneText,
          isStageDirection: true,
          scene: currentScene
        });
        return;
      }

      // Check for markdown header format (# Character: dialogue)
      const markdownMatch = extractCharacterFromMarkdown(line);
      if (markdownMatch) {
        characters.add(markdownMatch.character);
        lines.push({
          character: markdownMatch.character,
          text: markdownMatch.text,
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

      // If it's just text and we have a previous line, append to it (continuation)
      if (lines.length > 0 && !line.includes(':')) {
        const lastLine = lines[lines.length - 1];
        
        // Only append to dialogue lines (not scene headers or empty character lines)
        if (!lastLine.isStageDirection && lastLine.character && lastLine.text) {
          // For theatrical scripts, preserve line breaks; for simple scripts, concatenate
          // Check if the last line already has the character speaking
          const nextLine = textLines[lineIndex + 1]?.trim();
          const isLikelyContinuation = nextLine && !nextLine.includes(':') && !nextLine.startsWith('(');
          
          // Preserve intentional line breaks in theatrical scripts
          if (isLikelyContinuation || line.length < 60) {
            lastLine.text += ' ' + line;
          } else {
            // New line might be a new thought, preserve the break
            lastLine.text += '\n' + line;
          }
        }
      }
    }
  });

  // Convert characters to the required format
  const charactersList = Array.from(characters).map(char => ({
    name: char,
    actor: '',
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
