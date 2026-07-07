// Sessions par cookie HttpOnly signé HMAC (sans dépendance externe).
// Format du jeton : base64url(userId|exp) + "." + HMAC-SHA256.
// Le rôle et le profil sont relus en base à partir de userId — on ne fait
// jamais confiance à une valeur (rôle, e-mail) portée par le cookie.

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "seha_session";
const MAX_AGE_S = 60 * 60 * 24 * 90; // 90 jours

function secret(): string {
  return process.env.SESSION_SECRET ?? process.env.NEXTAUTH_SECRET ?? "seha-demo-secret-change-me";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export interface SessionData {
  userId: string;
}

export function createToken(data: SessionData): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_S;
  const payload = Buffer.from(`${data.userId}|${exp}`).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): SessionData | null {
  if (!token) return null;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const expected = sign(payload);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const [userId, expStr] = Buffer.from(payload, "base64url").toString().split("|");
  if (!userId || Number(expStr) < Date.now() / 1000) return null;
  return { userId };
}

export function readSession(): SessionData | null {
  return verifyToken(cookies().get(COOKIE)?.value);
}

export function sessionCookie(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: MAX_AGE_S,
    path: "/",
  };
}

export function clearedSessionCookie() {
  return { ...sessionCookie(""), maxAge: 0 };
}
