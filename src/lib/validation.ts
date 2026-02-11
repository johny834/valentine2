import blocklist from "../../content/blocklist.json";

export const MAX_LENGTHS = {
  toName: 32,
  fromName: 32,
  keywords: 140,
  message: 280,
} as const;

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Check if text contains blocked content
 */
export function containsBlockedContent(text: string): boolean {
  const lowerText = text.toLowerCase();

  // Check exact words
  for (const word of blocklist.words) {
    if (lowerText.includes(word.toLowerCase())) {
      return true;
    }
  }

  // Check regex patterns
  for (const pattern of blocklist.patterns) {
    try {
      const regex = new RegExp(pattern, "i");
      if (regex.test(text)) {
        return true;
      }
    } catch {
      // Invalid regex, skip
    }
  }

  return false;
}

/**
 * Sanitize user input: trim, escape HTML, check length
 */
export function sanitizeInput(
  text: string,
  maxLength: number
): { value: string; error?: string } {
  const trimmed = text.trim();

  if (trimmed.length > maxLength) {
    return {
      value: trimmed.slice(0, maxLength),
      error: `Max ${maxLength} znaků`,
    };
  }

  if (containsBlockedContent(trimmed)) {
    return {
      value: trimmed,
      error: "Text obsahuje nevhodný obsah",
    };
  }

  return { value: escapeHtml(trimmed) };
}

/**
 * Validate and sanitize form data
 */
export function validateFormData(data: {
  toName?: string;
  fromName?: string;
  keywords?: string;
}): { errors: Record<string, string>; sanitized: typeof data } {
  const errors: Record<string, string> = {};
  const sanitized: Record<string, string> = {};

  if (data.toName) {
    const result = sanitizeInput(data.toName, MAX_LENGTHS.toName);
    sanitized.toName = result.value;
    if (result.error) errors.toName = result.error;
  }

  if (data.fromName) {
    const result = sanitizeInput(data.fromName, MAX_LENGTHS.fromName);
    sanitized.fromName = result.value;
    if (result.error) errors.fromName = result.error;
  }

  if (data.keywords) {
    const result = sanitizeInput(data.keywords, MAX_LENGTHS.keywords);
    sanitized.keywords = result.value;
    if (result.error) errors.keywords = result.error;
  }

  return { errors, sanitized };
}
