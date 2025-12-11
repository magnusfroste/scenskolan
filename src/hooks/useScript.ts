// MODEL LAYER: Script state management hook

import { useState, useCallback } from 'react';
import { parseScript } from '@/utils/scriptParser';
import { validateScript, ValidationResult } from '@/utils/scriptValidator';
import type { Character, ScriptLine, ParsedScript } from '@/types/script';
import { SampleScript } from '@/data/sampleScripts';

interface UseScriptReturn {
  // State
  characters: Character[];
  lines: ScriptLine[];
  scenes: string[];
  parsedScript: ParsedScript | null;
  hasScript: boolean;
  
  // Validation state
  validationResult: ValidationResult | null;
  pendingScriptText: string;
  
  // Actions
  loadScript: (text: string) => ValidationResult;
  loadSampleScript: (sample: SampleScript) => void;
  confirmScript: () => void;
  cancelValidation: () => void;
  resetScript: () => void;
}

export const useScript = (): UseScriptReturn => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [lines, setLines] = useState<ScriptLine[]>([]);
  const [scenes, setScenes] = useState<string[]>([]);
  const [parsedScript, setParsedScript] = useState<ParsedScript | null>(null);
  const [hasScript, setHasScript] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [pendingScriptText, setPendingScriptText] = useState('');

  const applyParsedScript = useCallback((parsed: ParsedScript) => {
    setCharacters(parsed.characters);
    setLines(parsed.lines);
    setScenes(parsed.scenes);
    setParsedScript(parsed);
    setHasScript(true);
  }, []);

  const loadScript = useCallback((text: string): ValidationResult => {
    const validation = validateScript(text);
    setValidationResult(validation);
    setPendingScriptText(text);
    return validation;
  }, []);

  const loadSampleScript = useCallback((sample: SampleScript) => {
    const parsed = parseScript(sample.content);
    applyParsedScript(parsed);
  }, [applyParsedScript]);

  const confirmScript = useCallback(() => {
    if (!pendingScriptText) return;
    
    const parsed = parseScript(pendingScriptText);
    applyParsedScript(parsed);
    setPendingScriptText('');
    setValidationResult(null);
  }, [pendingScriptText, applyParsedScript]);

  const cancelValidation = useCallback(() => {
    setPendingScriptText('');
    setValidationResult(null);
  }, []);

  const resetScript = useCallback(() => {
    setHasScript(false);
    setCharacters([]);
    setLines([]);
    setScenes([]);
    setParsedScript(null);
  }, []);

  return {
    characters,
    lines,
    scenes,
    parsedScript,
    hasScript,
    validationResult,
    pendingScriptText,
    loadScript,
    loadSampleScript,
    confirmScript,
    cancelValidation,
    resetScript,
  };
};
