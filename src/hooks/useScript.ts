// MODEL LAYER: Script state management hook with localStorage persistence

import { useState, useCallback, useEffect } from 'react';
import { parseScript } from '@/utils/scriptParser';
import { validateScript, ValidationResult } from '@/utils/scriptValidator';
import type { Character, ScriptLine, ParsedScript } from '@/types/script';
import { SampleScript } from '@/data/sampleScripts';
import { useLocalStorage } from './useLocalStorage';
import { 
  getSharedScriptFromUrl, 
  clearScriptFromUrl, 
  generateShareUrl,
  SharedScriptData
} from '@/utils/scriptSharing';

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
  scriptContent: string | null;
  
  // Shared script state
  pendingSharedScript: SharedScriptData | null;
  
  // Validation state
  validationResult: ValidationResult | null;
  pendingScriptText: string;
  
  // Actions
  loadScript: (text: string) => ValidationResult;
  loadSampleScript: (sample: SampleScript) => void;
  loadSharedScript: () => void;
  dismissSharedScript: () => void;
  confirmScript: () => void;
  cancelValidation: () => void;
  resetScript: () => void;
  getShareUrl: () => string | null;
}

export const useScript = (): UseScriptReturn => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [lines, setLines] = useState<ScriptLine[]>([]);
  const [scenes, setScenes] = useState<string[]>([]);
  const [parsedScript, setParsedScript] = useState<ParsedScript | null>(null);
  const [hasScript, setHasScript] = useState(false);
  const [scriptTitle, setScriptTitle] = useState<string | null>(null);
  const [scriptContent, setScriptContent] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [pendingScriptText, setPendingScriptText] = useState('');
  const [pendingSharedScript, setPendingSharedScript] = useState<SharedScriptData | null>(null);

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
    setScriptContent(content);
    
    // Save to localStorage
    setSavedScript({ content, title });
  }, [setSavedScript]);

  // Check for shared script in URL on mount
  useEffect(() => {
    const sharedScript = getSharedScriptFromUrl();
    if (sharedScript) {
      // Store as pending, don't auto-load
      setPendingSharedScript(sharedScript);
      clearScriptFromUrl();
      return;
    }
    
    // Fall back to localStorage
    if (savedScript?.content && !hasScript) {
      const parsed = parseScript(savedScript.content);
      setCharacters(parsed.characters);
      setLines(parsed.lines);
      setScenes(parsed.scenes);
      setParsedScript(parsed);
      setHasScript(true);
      setScriptTitle(savedScript.title || null);
      setScriptContent(savedScript.content);
    }
  }, []); // Only run on mount

  const loadSharedScript = useCallback(() => {
    if (!pendingSharedScript) return;
    const parsed = parseScript(pendingSharedScript.content);
    applyParsedScript(parsed, pendingSharedScript.content, pendingSharedScript.title);
    setPendingSharedScript(null);
  }, [pendingSharedScript, applyParsedScript]);

  const dismissSharedScript = useCallback(() => {
    setPendingSharedScript(null);
  }, []);

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
    setScriptContent(null);
    clearSavedScript();
  }, [clearSavedScript]);

  const getShareUrl = useCallback((): string | null => {
    if (!scriptContent) return null;
    return generateShareUrl(scriptTitle || 'Delat manus', scriptContent);
  }, [scriptContent, scriptTitle]);

  return {
    characters,
    lines,
    scenes,
    parsedScript,
    hasScript,
    scriptTitle,
    scriptContent,
    pendingSharedScript,
    validationResult,
    pendingScriptText,
    loadScript,
    loadSampleScript,
    loadSharedScript,
    dismissSharedScript,
    confirmScript,
    cancelValidation,
    resetScript,
    getShareUrl,
  };
};
