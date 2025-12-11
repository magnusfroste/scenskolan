// MODEL LAYER: User settings persistence hook

import { useLocalStorage } from './useLocalStorage';

interface UserSettings {
  practiceMode: 'full' | 'cues' | 'lines';
  selectedCharacter: string | null;
  currentScene: string | null;
}

const defaultSettings: UserSettings = {
  practiceMode: 'full',
  selectedCharacter: null,
  currentScene: null,
};

export const useSettings = () => {
  const [settings, setSettings, clearSettings] = useLocalStorage<UserSettings>(
    'scenskolan-settings',
    defaultSettings
  );

  const updatePracticeMode = (mode: 'full' | 'cues' | 'lines') => {
    setSettings({ ...settings, practiceMode: mode });
  };

  const updateSelectedCharacter = (character: string | null) => {
    setSettings({ ...settings, selectedCharacter: character });
  };

  const updateCurrentScene = (scene: string | null) => {
    setSettings({ ...settings, currentScene: scene });
  };

  const resetSettings = () => {
    clearSettings();
  };

  return {
    ...settings,
    updatePracticeMode,
    updateSelectedCharacter,
    updateCurrentScene,
    resetSettings,
  };
};
