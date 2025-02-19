
import React from 'react';

interface SceneNavigationProps {
  scenes: string[];
  currentScene: string;
  onSceneChange: (scene: string) => void;
}

const SceneNavigation = ({ scenes, currentScene, onSceneChange }: SceneNavigationProps) => {
  if (scenes.length <= 1) return null;

  return (
    <div className="mt-6 flex justify-center gap-2 flex-wrap">
      {scenes.map((sceneNum) => (
        <button
          key={sceneNum}
          onClick={() => onSceneChange(sceneNum)}
          className={`px-4 py-2 rounded-lg transition-all ${
            currentScene === sceneNum
              ? 'bg-primary text-white'
              : 'bg-secondary hover:bg-gray-200'
          }`}
        >
          Scene {sceneNum}
        </button>
      ))}
    </div>
  );
};

export default SceneNavigation;
