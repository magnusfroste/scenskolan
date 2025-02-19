
import React from 'react';
import { Upload } from 'lucide-react';

interface ScriptHeaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ScriptHeader = ({ onFileUpload }: ScriptHeaderProps) => {
  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-end">
        <label className="inline-flex items-center gap-1 px-2 py-1 text-gray-500 hover:text-gray-700 rounded-lg cursor-pointer text-sm">
          <Upload size={14} />
          <input
            type="file"
            accept=".txt"
            onChange={onFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </header>
  );
};

export default ScriptHeader;
