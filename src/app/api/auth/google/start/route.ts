// Connexion Google — étape 1 : redirection vers l'écran de consentement.
// Flux OAuth « maison » (pas de dépendance NextAuth) : le callback crée/relie
// le compte et pose le même cookie de session HMAC que l'e-mail/mot de passe.
// Actif dès que GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET sont définis.

import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { siteOrigin } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const origin = siteOrigin(req);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(`${origin}/connexion?error=google_indisponible`);
  }

  const url = new URL(req.url);
  const role = url.searchParams.get("role") === "medecin" ? "medecin" : "patient";
  const state = `${randomBytes(16).toString("hex")}.${role}`;

  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.searchParams.set("client_id", clientId);
  auth.searchParams.set("redirect_uri", `${origin}/api/auth/google/callback`);
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("scope", "openid email profile");
  auth.searchParams.set("state", state);
  auth.searchParams.set("prompt", "select_account");

  const res = NextResponse.redirect(auth.toString());
  // Cookie anti-CSRF (court, HttpOnly) — comparé au retour.
  res.cookies.set("seha_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
