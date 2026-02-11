import type { TextEntry, Tone } from "@/types/content";
import { loadTexts } from "./content";

interface SelectionParams {
  tone: Tone;
  keywords?: string;
  excludeIds?: string[];
}

interface ScoredText {
  entry: TextEntry;
  score: number;
}

/**
 * Score a text entry based on keywords
 * +2 for tag match, +1 for substring match in text
 */
function scoreText(entry: TextEntry, keywords: string): number {
  if (!keywords.trim()) return 0;

  const keywordList = keywords
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);

  let score = 0;

  for (const keyword of keywordList) {
    // Tag match: +2
    if (entry.tags.some((tag) => tag.toLowerCase().includes(keyword))) {
      score += 2;
    }
    // Substring match in text: +1
    if (entry.text.toLowerCase().includes(keyword)) {
      score += 1;
    }
  }

  return score;
}

/**
 * Select the best text based on tone and keywords
 * Falls back to random text from the tone if no good match
 */
export function selectText(params: SelectionParams): TextEntry | null {
  const { tone, keywords = "", excludeIds = [] } = params;
  const allTexts = loadTexts();

  // Filter by tone and exclude already used
  const candidates = allTexts.filter(
    (t) => t.tone === tone && !excludeIds.includes(t.id)
  );

  if (candidates.length === 0) {
    // Fallback: any text from the tone (even if excluded)
    const toneTexts = allTexts.filter((t) => t.tone === tone);
    if (toneTexts.length === 0) return null;
    return toneTexts[Math.floor(Math.random() * toneTexts.length)];
  }

  // Score all candidates
  const scored: ScoredText[] = candidates.map((entry) => ({
    entry,
    score: scoreText(entry, keywords),
  }));

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  const topScore = scored[0].score;

  if (topScore > 0) {
    // Return top scorer
    return scored[0].entry;
  } else {
    // No keyword matches: return random
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
}

/**
 * Get a different text (reshuffle)
 * Excludes the current text and prefers different results
 */
export function reshuffleText(
  params: SelectionParams,
  currentId?: string
): TextEntry | null {
  const excludeIds = currentId ? [currentId, ...(params.excludeIds || [])] : params.excludeIds || [];
  return selectText({ ...params, excludeIds });
}
