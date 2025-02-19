
import React from 'react';
import { Upload } from 'lucide-react';

interface ScriptHeaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ScriptHeader = ({ onFileUpload }: ScriptHeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-4 px-2">
      <div>
        <h1 className="text-xl font-semibold text-gray-700">Script Trainer</h1>
        <p className="text-sm text-gray-500">Practice your lines</p>
      </div>
      
      <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all cursor-pointer text-sm">
        <Upload size={16} />
        Upload
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
