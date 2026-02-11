import { describe, it, expect } from "vitest";
import {
  containsBlockedContent,
  escapeHtml,
  sanitizeInput,
  validateFormData,
  MAX_LENGTHS,
} from "./validation";

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;"
    );
  });

  it("escapes ampersands", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("escapes quotes", () => {
    expect(escapeHtml('"Hello"')).toBe("&quot;Hello&quot;");
  });

  it("leaves safe text unchanged", () => {
    expect(escapeHtml("Hello World 💕")).toBe("Hello World 💕");
  });
});

describe("containsBlockedContent", () => {
  it("returns false for clean text", () => {
    expect(containsBlockedContent("I love you")).toBe(false);
    expect(containsBlockedContent("Jsi krásná")).toBe(false);
  });

  // Note: This test depends on the actual blocklist content
  // Keeping it generic since we don't want to include explicit words
  it("handles empty string", () => {
    expect(containsBlockedContent("")).toBe(false);
  });
});

describe("sanitizeInput", () => {
  it("trims whitespace", () => {
    const result = sanitizeInput("  Hello  ", 100);
    expect(result.value).toBe("Hello");
    expect(result.error).toBeUndefined();
  });

  it("returns error for text exceeding max length", () => {
    const result = sanitizeInput("a".repeat(50), 32);
    expect(result.value).toBe("a".repeat(32));
    expect(result.error).toBe("Max 32 znaků");
  });

  it("escapes HTML in output", () => {
    const result = sanitizeInput("<b>Bold</b>", 100);
    expect(result.value).toBe("&lt;b&gt;Bold&lt;/b&gt;");
  });
});

describe("validateFormData", () => {
  it("validates valid form data", () => {
    const { errors, sanitized } = validateFormData({
      toName: "Jan",
      fromName: "Terka",
    });
    expect(Object.keys(errors)).toHaveLength(0);
    expect(sanitized.toName).toBe("Jan");
    expect(sanitized.fromName).toBe("Terka");
  });

  it("returns error for name exceeding max length", () => {
    const { errors } = validateFormData({
      toName: "a".repeat(MAX_LENGTHS.toName + 10),
    });
    expect(errors.toName).toBeDefined();
  });

  it("handles empty fields", () => {
    const { errors, sanitized } = validateFormData({});
    expect(Object.keys(errors)).toHaveLength(0);
    expect(sanitized).toEqual({});
  });
});

describe("MAX_LENGTHS", () => {
  it("has expected values", () => {
    expect(MAX_LENGTHS.toName).toBe(32);
    expect(MAX_LENGTHS.fromName).toBe(32);
    expect(MAX_LENGTHS.message).toBe(280);
  });
});
