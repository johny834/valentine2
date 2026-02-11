import { describe, it, expect } from "vitest";
import { generateToken, isValidToken } from "./token";

describe("generateToken", () => {
  it("generates a 22 character token", () => {
    const token = generateToken();
    expect(token).toHaveLength(22);
  });

  it("generates URL-safe characters only", () => {
    const token = generateToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("generates unique tokens", () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      tokens.add(generateToken());
    }
    // All 1000 tokens should be unique
    expect(tokens.size).toBe(1000);
  });
});

describe("isValidToken", () => {
  it("validates correct tokens", () => {
    expect(isValidToken("aB3cD4eF5gH6iJ7kL8mN9o")).toBe(true);
    expect(isValidToken("AAAAAAAAAAAAAAAAAAAAAA")).toBe(true);
    expect(isValidToken("__--__--__--__--__--__")).toBe(true);
  });

  it("rejects invalid tokens", () => {
    expect(isValidToken("")).toBe(false);
    expect(isValidToken("too-short")).toBe(false);
    expect(isValidToken("this-token-is-way-too-long-for-our-format")).toBe(false);
    expect(isValidToken("invalid+characters/here")).toBe(false);
    expect(isValidToken("has spaces in it here")).toBe(false);
  });
});
