import { randomBytes } from "crypto";

/**
 * Generate a cryptographically secure, URL-safe token
 * 
 * Uses 16 bytes (128 bits) of randomness encoded as base64url
 * Results in 22 character tokens (e.g., "aB3cD4eF5gH6iJ7kL8mN9o")
 * 
 * Collision probability: ~1 in 3.4×10^38 (effectively zero)
 */
export function generateToken(): string {
  // 16 bytes = 128 bits of entropy
  const bytes = randomBytes(16);
  
  // Convert to base64url (URL-safe base64 without padding)
  return bytes
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Validate token format
 * Tokens must be 22 characters, base64url alphabet only
 */
export function isValidToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{22}$/.test(token);
}
