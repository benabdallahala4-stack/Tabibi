// Hachage de mot de passe avec scrypt (module `crypto` natif de Node — aucune
// dépendance externe, compatible Vercel). Format stocké :
//   scrypt$<salt base64>$<hash base64>

import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEYLEN = 64;

export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, KEYLEN);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyPassword(plain: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const [scheme, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  try {
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(hashB64, "base64");
    const actual = scryptSync(plain, salt, expected.length);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** Validation minimale côté serveur (le front valide aussi). */
export function passwordProblem(plain: string): string | null {
  if (typeof plain !== "string" || plain.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  if (plain.length > 200) return "Mot de passe trop long.";
  return null;
}

export function emailProblem(email: string): string | null {
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Adresse e-mail invalide.";
  }
  return null;
}
