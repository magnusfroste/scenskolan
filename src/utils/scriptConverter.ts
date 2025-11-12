import { ParsedScript, ScriptLine } from '@/types/script';

export type ScriptFormat = 'simple' | 'theatrical';

export interface ConversionOptions {
  targetFormat: ScriptFormat;
  includeRollerSection?: boolean;
  useMarkdownHeaders?: boolean;
  theaterName?: string;
}

export const convertScriptFormat = (
  parsedScript: ParsedScript,
  options: ConversionOptions
): string => {
  const { targetFormat, includeRollerSection = true, useMarkdownHeaders = false, theaterName } = options;

  if (targetFormat === 'theatrical') {
    return convertToTheatrical(parsedScript, includeRollerSection, useMarkdownHeaders, theaterName);
  } else {
    return convertToSimple(parsedScript);
  }
};

const convertToTheatrical = (
  script: ParsedScript,
  includeRoller: boolean,
  useMarkdown: boolean,
  theaterName?: string
): string => {
  let output = '';

  // Add title section if theater name provided
  if (theaterName) {
    output += `${theaterName}\n\n`;
  }

  // Add ROLLER section with character-actor pairs
  if (includeRoller && script.characters.length > 0) {
    output += 'ROLLER\n';
    script.characters.forEach(char => {
      const actorName = char.actor || '[Actor Name]';
      output += `${char.name}: ${actorName}\n`;
    });
    output += '\n';
  }

  // Group lines by scene
  const sceneGroups = new Map<string, ScriptLine[]>();
  script.lines.forEach(line => {
    const scene = line.scene || '1';
    if (!sceneGroups.has(scene)) {
      sceneGroups.set(scene, []);
    }
    sceneGroups.get(scene)!.push(line);
  });

  // Sort scenes
  const sortedScenes = Array.from(sceneGroups.keys()).sort((a, b) => {
    const [aMajor, aMinor = "0"] = a.split(":");
    const [bMajor, bMinor = "0"] = b.split(":");
    const aMajorNum = parseInt(aMajor);
    const bMajorNum = parseInt(bMajor);
    if (aMajorNum !== bMajorNum) return aMajorNum - bMajorNum;
    return parseInt(aMinor) - parseInt(bMinor);
  });

  // Write each scene
  sortedScenes.forEach((sceneNumber, index) => {
    const sceneLines = sceneGroups.get(sceneNumber)!;
    
    // Add scene header
    const sceneHeader = sceneLines.find(l => l.isStageDirection && l.text.toUpperCase().startsWith('SCEN'));
    if (sceneHeader) {
      output += `${sceneHeader.text}\n\n`;
    } else {
      output += useMarkdown ? `## Scen ${sceneNumber}\n\n` : `SCEN ${sceneNumber}\n\n`;
    }

    // Write dialogue lines
    sceneLines.forEach(line => {
      // Skip the scene header line we already wrote
      if (line.isStageDirection && line.text.toUpperCase().startsWith('SCEN')) {
        return;
      }

      if (line.isStageDirection) {
        output += `${line.text}\n`;
      } else if (line.character) {
        if (useMarkdown) {
          output += `# ${line.character}: ${line.text}\n`;
        } else {
          output += `${line.character}: ${line.text}\n`;
        }
      }
    });

    // Add spacing between scenes
    if (index < sortedScenes.length - 1) {
      output += '\n';
    }
  });

  return output.trim();
};

const convertToSimple = (script: ParsedScript): string => {
  let output = '';

  // Group lines by scene
  const sceneGroups = new Map<string, ScriptLine[]>();
  script.lines.forEach(line => {
    const scene = line.scene || '1';
    if (!sceneGroups.has(scene)) {
      sceneGroups.set(scene, []);
    }
    sceneGroups.get(scene)!.push(line);
  });

  // Sort scenes
  const sortedScenes = Array.from(sceneGroups.keys()).sort((a, b) => {
    const [aMajor, aMinor = "0"] = a.split(":");
    const [bMajor, bMinor = "0"] = b.split(":");
    const aMajorNum = parseInt(aMajor);
    const bMajorNum = parseInt(bMajor);
    if (aMajorNum !== bMajorNum) return aMajorNum - bMajorNum;
    return parseInt(aMinor) - parseInt(bMinor);
  });

  // Write each scene
  sortedScenes.forEach((sceneNumber, index) => {
    const sceneLines = sceneGroups.get(sceneNumber)!;
    
    // Simple scene header
    output += `SCEN ${sceneNumber}\n`;

    // Write dialogue lines
    sceneLines.forEach(line => {
      // Skip the scene header line
      if (line.isStageDirection && line.text.toUpperCase().startsWith('SCEN')) {
        return;
      }

      if (line.isStageDirection) {
        output += `${line.text}\n`;
      } else if (line.character) {
        // Remove markdown if present and use simple format
        const cleanText = line.text.replace(/^#+\s*/, '');
        output += `${line.character}: ${cleanText}\n`;
      }
    });

    // Add spacing between scenes
    if (index < sortedScenes.length - 1) {
      output += '\n';
    }
  });

  return output.trim();
};

export const detectCurrentFormat = (script: ParsedScript): ScriptFormat => {
  // Check if has ROLLER section or markdown headers
  const hasActors = script.characters.some(c => c.actor && c.actor.trim() !== '');
  const hasMarkdown = script.lines.some(line => 
    line.text.includes('#') || (line.character && line.text.startsWith('#'))
  );

  return hasActors || hasMarkdown ? 'theatrical' : 'simple';
};
