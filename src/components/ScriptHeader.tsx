
import React from 'react';
import { Upload } from 'lucide-react';

interface ScriptHeaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ScriptHeader = ({ onFileUpload }: ScriptHeaderProps) => {
  return (
    <header className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Script Trainer</h1>
      <p className="text-gray-600 mb-6">Practice your lines and perfect your performance</p>
      
      <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all cursor-pointer">
        <Upload size={20} />
        Upload Script
        <input
          type="file"
          accept=".txt"
          onChange={onFileUpload}
          className="hidden"
        />
      </label>
    </header>
  );
};

export default ScriptHeader;
