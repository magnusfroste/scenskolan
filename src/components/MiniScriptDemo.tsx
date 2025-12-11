import React, { useState } from 'react';

const demoLines = [
  { character: 'Pippi', text: 'Ska vi gå på cirkus idag?' },
  { character: 'Tommy', text: 'Ja! Jag älskar cirkus!' },
  { character: 'Annika', text: 'Men har vi pengar?' },
  { character: 'Pippi', text: 'Jag har en hel väska full!' },
];

const characters = ['Pippi', 'Tommy', 'Annika'];

export const MiniScriptDemo = () => {
  const [selectedChar, setSelectedChar] = useState<string | null>('Pippi');

  return (
    <div className="w-full max-w-md mx-auto">
      <p className="text-xs text-muted-foreground text-center mb-3">
        Klicka på en roll för att se hur dina repliker markeras
      </p>
      
      {/* Character buttons */}
      <div className="flex justify-center gap-2 mb-4">
        {characters.map((char) => (
          <button
            key={char}
            onClick={() => setSelectedChar(selectedChar === char ? null : char)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
              selectedChar === char
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Demo script lines */}
      <div className="bg-card/80 border border-border rounded-lg p-3 space-y-2">
        {demoLines.map((line, index) => {
          const isSelected = selectedChar === line.character;
          return (
            <div
              key={index}
              className={`py-1.5 px-2 rounded transition-all text-sm ${
                isSelected
                  ? 'bg-primary/15 border-l-2 border-primary'
                  : 'opacity-60'
              }`}
            >
              <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                {line.character}:
              </span>{' '}
              <span className="text-foreground">{line.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
