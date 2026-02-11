import copy from "../../content/copy.cs.json";

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

type CopyKey = NestedKeyOf<typeof copy>;

/**
 * Get a translated string by key path (e.g., "landing.hero.title")
 * Supports placeholder replacement with {key} syntax
 */
export function t(key: string, replacements?: Record<string, string | number>): string {
  const keys = key.split(".");
  let value: unknown = copy;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      console.warn(`Missing translation key: ${key}`);
      return key;
    }
  }

  if (typeof value !== "string") {
    console.warn(`Translation key is not a string: ${key}`);
    return key;
  }

  if (replacements) {
    return value.replace(/\{(\w+)\}/g, (_, placeholder) => {
      return String(replacements[placeholder] ?? `{${placeholder}}`);
    });
  }

  return value;
}

/**
 * Export the raw copy object for direct access if needed
 */
export { copy };
