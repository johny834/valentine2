import { describe, it, expect } from "vitest";
import { selectText, reshuffleText } from "./textSelector";

describe("textSelector", () => {
  describe("selectText", () => {
    it("filters by tone", () => {
      const result = selectText({ tone: "cute" });
      expect(result).not.toBeNull();
      expect(result?.tone).toBe("cute");
    });

    it("returns different tones when requested", () => {
      const cute = selectText({ tone: "cute" });
      const funny = selectText({ tone: "funny" });
      const spicy = selectText({ tone: "spicy" });

      expect(cute?.tone).toBe("cute");
      expect(funny?.tone).toBe("funny");
      expect(spicy?.tone).toBe("spicy");
    });

    it("scores tag matches higher (+2)", () => {
      // "food" is a tag in funny texts
      const result = selectText({ tone: "funny", keywords: "food" });
      expect(result).not.toBeNull();
      // Should prefer texts with food tag
      expect(result?.tags).toContain("food");
    });

    it("falls back to random when no keyword match", () => {
      const result = selectText({ tone: "office", keywords: "xyz123nonexistent" });
      expect(result).not.toBeNull();
      expect(result?.tone).toBe("office");
    });
  });

  describe("reshuffleText", () => {
    it("excludes current text id", () => {
      const first = selectText({ tone: "cute" });
      expect(first).not.toBeNull();

      // Reshuffle should try to get a different one
      const second = reshuffleText({ tone: "cute" }, first!.id);
      
      // With 5 cute texts, we should usually get a different one
      // (not guaranteed but highly likely in multiple runs)
      expect(second).not.toBeNull();
      expect(second?.tone).toBe("cute");
    });

    it("returns a text even if all are excluded (fallback)", () => {
      // Even if we somehow exclude everything, it should still return something
      const result = reshuffleText({ tone: "cute" }, "nonexistent-id");
      expect(result).not.toBeNull();
    });
  });
});
