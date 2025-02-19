
export interface Character {
  name: string;
  actor: string;
}

export interface ScriptLine {
  character: string;
  text: string;
  scene: string;
  isStageDirection?: boolean;
}

export interface ParsedScript {
  characters: Character[];
  lines: ScriptLine[];
  scenes: string[];
}
