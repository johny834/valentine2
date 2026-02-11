export type Tone = "cute" | "funny" | "spicy" | "office";

export interface TextEntry {
  id: string;
  tone: Tone;
  tags: string[];
  text: string;
}

export interface Template {
  id: string;
  name: string;
  illustrationPath: string;
  styleTokens: {
    primaryColor: string;
    accentColor: string;
    fontStyle?: string;
  };
}
