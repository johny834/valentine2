import type { Template, TextEntry } from "@/types/content";
import templatesData from "../../content/templates.json";
import textsData from "../../content/texts/texts.json";

/**
 * Load all available templates
 * Server-side import from JSON
 */
export function loadTemplates(): Template[] {
  return templatesData as Template[];
}

/**
 * Load all text entries
 * Server-side import from JSON
 */
export function loadTexts(): TextEntry[] {
  return textsData as TextEntry[];
}

/**
 * Get a specific template by ID
 */
export function getTemplateById(id: string): Template | undefined {
  return loadTemplates().find((t) => t.id === id);
}

/**
 * Get texts filtered by tone
 */
export function getTextsByTone(tone: TextEntry["tone"]): TextEntry[] {
  return loadTexts().filter((t) => t.tone === tone);
}
