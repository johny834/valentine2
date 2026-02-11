export type Tone = "cute" | "funny" | "spicy" | "office";

export interface TextEntry {
  id: string;
  tone: Tone;
  tags: string[];
  text: string;
  image?: string; // Optional custom image for the card
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
