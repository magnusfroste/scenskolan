// MODEL LAYER: Script state management hook with localStorage persistence

import { useState, useCallback, useEffect } from 'react';
import { parseScript } from '@/utils/scriptParser';
import { validateScript, ValidationResult } from '@/utils/scriptValidator';
import type { Character, ScriptLine, ParsedScript } from '@/types/script';
import { SampleScript } from '@/data/sampleScripts';
import { useLocalStorage } from './useLocalStorage';

interface SavedScriptData {
  content: string;
  title?: string;
}

interface UseScriptReturn {
  // State
  characters: Character[];
  lines: ScriptLine[];
  scenes: string[];
  parsedScript: ParsedScript | null;
  hasScript: boolean;
  scriptTitle: string | null;
  
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
  const [scriptTitle, setScriptTitle] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [pendingScriptText, setPendingScriptText] = useState('');

  // Persist script to localStorage
  const [savedScript, setSavedScript, clearSavedScript] = useLocalStorage<SavedScriptData | null>(
    'scenskolan-saved-script',
    null
  );

  const applyParsedScript = useCallback((parsed: ParsedScript, content: string, title?: string) => {
    setCharacters(parsed.characters);
    setLines(parsed.lines);
    setScenes(parsed.scenes);
    setParsedScript(parsed);
    setHasScript(true);
    setScriptTitle(title || null);
    
    // Save to localStorage
    setSavedScript({ content, title });
  }, [setSavedScript]);

  // Load saved script on mount
  useEffect(() => {
    if (savedScript?.content && !hasScript) {
      const parsed = parseScript(savedScript.content);
      setCharacters(parsed.characters);
      setLines(parsed.lines);
      setScenes(parsed.scenes);
      setParsedScript(parsed);
      setHasScript(true);
      setScriptTitle(savedScript.title || null);
    }
  }, []); // Only run on mount

  const loadScript = useCallback((text: string): ValidationResult => {
    const validation = validateScript(text);
    setValidationResult(validation);
    setPendingScriptText(text);
    return validation;
  }, []);

  const loadSampleScript = useCallback((sample: SampleScript) => {
    const parsed = parseScript(sample.content);
    applyParsedScript(parsed, sample.content, sample.title);
  }, [applyParsedScript]);

  const confirmScript = useCallback(() => {
    if (!pendingScriptText) return;
    
    const parsed = parseScript(pendingScriptText);
    applyParsedScript(parsed, pendingScriptText);
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
    setScriptTitle(null);
    clearSavedScript();
  }, [clearSavedScript]);

  return {
    characters,
    lines,
    scenes,
    parsedScript,
    hasScript,
    scriptTitle,
    validationResult,
    pendingScriptText,
    loadScript,
    loadSampleScript,
    confirmScript,
    cancelValidation,
    resetScript,
  };
};
