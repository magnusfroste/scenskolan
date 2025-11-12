export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  stats: {
    hasRollerSection: boolean;
    sceneCount: number;
    characterCount: number;
    dialogueLineCount: number;
    formatType: 'simple' | 'theatrical' | 'mixed' | 'unknown';
  };
}

export const validateScript = (text: string): ValidationResult => {
  const issues: ValidationIssue[] = [];
  const lines = text.split('\n');
  
  let hasRollerSection = false;
  let sceneCount = 0;
  let characterCount = 0;
  let dialogueLineCount = 0;
  let hasMarkdownHeaders = false;
  let hasColonDialogue = false;
  let hasStageDirec = false;
  
  const characterNames = new Set<string>();
  const inconsistentCharacters: string[] = [];
  
  // Track if we're in ROLLER section
  let inRollerSection = false;
  let rollerLineCount = 0;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;
    
    // Check for ROLLER section
    if (trimmedLine.toUpperCase() === 'ROLLER') {
      hasRollerSection = true;
      inRollerSection = true;
      return;
    }
    
    // Parse ROLLER section
    if (inRollerSection) {
      if (/^[^:–-]+\s*[:–-]\s*.+$/.test(trimmedLine)) {
        rollerLineCount++;
        const match = trimmedLine.match(/^([^:–-]+)\s*[:–-]/);
        if (match) {
          characterNames.add(match[1].trim());
        }
      } else {
        inRollerSection = false;
      }
    }
    
    // Check for scene markers
    if (/^(SCEN|Scene|##?\s*Scen|##?\s*Scene|\d+\.)\s*\d+/i.test(trimmedLine)) {
      sceneCount++;
    }
    
    // Check for markdown headers
    if (/^#+\s*.+:/.test(trimmedLine)) {
      hasMarkdownHeaders = true;
      dialogueLineCount++;
      const match = trimmedLine.match(/^#+\s*([^:]+):/);
      if (match) {
        characterNames.add(match[1].trim());
      }
    }
    
    // Check for colon-based dialogue
    if (trimmedLine.includes(':') && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('SCEN')) {
      const colonIndex = trimmedLine.indexOf(':');
      const beforeColon = trimmedLine.substring(0, colonIndex).trim();
      const afterColon = trimmedLine.substring(colonIndex + 1).trim();
      
      // If there's text both before and after colon, likely dialogue
      if (beforeColon && afterColon && !beforeColon.includes(' ') || beforeColon.split(' ').length <= 3) {
        hasColonDialogue = true;
        dialogueLineCount++;
        characterNames.add(beforeColon.replace(/\s*\([^)]+\).*$/, '').trim());
      }
    }
    
    // Check for stage directions
    if (trimmedLine.startsWith('(') && trimmedLine.endsWith(')')) {
      hasStageDirec = true;
    }
  });
  
  characterCount = characterNames.size;
  
  // Determine format type
  let formatType: 'simple' | 'theatrical' | 'mixed' | 'unknown' = 'unknown';
  if (hasRollerSection && (hasMarkdownHeaders || sceneCount > 3)) {
    formatType = 'theatrical';
  } else if (!hasRollerSection && sceneCount > 0 && dialogueLineCount > 0) {
    formatType = 'simple';
  } else if ((hasMarkdownHeaders && hasColonDialogue) || (hasRollerSection && !hasMarkdownHeaders)) {
    formatType = 'mixed';
  }
  
  // Generate validation issues
  
  // Critical: No content
  if (lines.filter(l => l.trim()).length === 0) {
    issues.push({
      type: 'error',
      message: 'Script is empty',
      suggestion: 'Please paste or upload a script with content.'
    });
  }
  
  // No scenes detected
  if (sceneCount === 0 && dialogueLineCount > 3) {
    issues.push({
      type: 'warning',
      message: 'No scene markers detected',
      suggestion: 'Add scene markers like "SCEN 1" or "Scene 1" to organize your script into scenes.'
    });
  }
  
  // No characters detected
  if (characterCount === 0 && dialogueLineCount > 0) {
    issues.push({
      type: 'warning',
      message: 'No character names detected',
      suggestion: 'Make sure dialogue lines follow the format "Character: dialogue text".'
    });
  }
  
  // No dialogue detected
  if (dialogueLineCount === 0 && lines.filter(l => l.trim()).length > 5) {
    issues.push({
      type: 'error',
      message: 'No dialogue lines detected',
      suggestion: 'Add character dialogue in the format "Character: dialogue text".'
    });
  }
  
  // ROLLER section but no characters
  if (hasRollerSection && rollerLineCount === 0) {
    issues.push({
      type: 'warning',
      message: 'ROLLER section found but no characters listed',
      suggestion: 'Add character-actor pairs in the format "Character: Actor Name" or "Character - Actor Name".'
    });
  }
  
  // Very few characters for a theatrical script
  if (formatType === 'theatrical' && characterCount < 2) {
    issues.push({
      type: 'info',
      message: 'Only 1 character detected',
      suggestion: 'Theatrical scripts typically have multiple characters. Verify your character names are formatted correctly.'
    });
  }
  
  // Mixed format warning
  if (formatType === 'mixed') {
    issues.push({
      type: 'info',
      message: 'Mixed script format detected',
      suggestion: 'Your script uses both simple and theatrical formatting. This is fine, but ensure consistency for best results.'
    });
  }
  
  // Success messages
  if (issues.length === 0) {
    issues.push({
      type: 'info',
      message: `Script looks good! Detected ${sceneCount} scene${sceneCount !== 1 ? 's' : ''}, ${characterCount} character${characterCount !== 1 ? 's' : ''}, and ${dialogueLineCount} dialogue line${dialogueLineCount !== 1 ? 's' : ''}.`,
      suggestion: formatType === 'theatrical' 
        ? 'Theatrical format detected with proper structure.'
        : 'Simple format detected. Script will parse correctly.'
    });
  }
  
  return {
    isValid: !issues.some(i => i.type === 'error'),
    issues,
    stats: {
      hasRollerSection,
      sceneCount,
      characterCount,
      dialogueLineCount,
      formatType
    }
  };
};
