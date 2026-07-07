// Connexion Google — étape 2 : échange du code, création/liaison du compte,
// pose du cookie de session, puis redirection vers l'espace du rôle.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConfigured, getDb } from "@/lib/db";
import { createToken, sessionCookie } from "@/lib/session";
import { siteOrigin } from "@/lib/http";

export const dynamic = "force-dynamic";

const HOME_BY_ROLE: Record<string, string> = {
  patient: "/mes-rdv",
  medecin: "/pro/dashboard",
  secretaire: "/pro/agenda",
  clinique: "/clinique-admin",
  labo: "/labo",
  admin: "/admin",
};

export async function GET(req: Request) {
  const origin = siteOrigin(req);
  const fail = (reason: string) =>
    NextResponse.redirect(`${origin}/connexion?error=${reason}`);

  if (!dbConfigured()) return fail("db_indisponible");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail("google_indisponible");

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = cookies().get("seha_oauth_state")?.value;
  if (!code || !state || state !== savedState) return fail("google_state");

  const role = state.split(".")[1] === "medecin" ? "medecin" : "patient";

  // 1. Échange du code contre un jeton d'accès.
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${origin}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  }).catch(() => null);
  if (!tokenRes || !tokenRes.ok) return fail("google_token");
  const token = (await tokenRes.json()) as { access_token?: string };
  if (!token.access_token) return fail("google_token");

  // 2. Récupération du profil (e-mail + nom).
  const infoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  }).catch(() => null);
  if (!infoRes || !infoRes.ok) return fail("google_profil");
  const info = (await infoRes.json()) as { email?: string; name?: string; verified_email?: boolean };
  const email = (info.email ?? "").toLowerCase();
  if (!email) return fail("google_email");

  // 3. Création ou liaison du compte (le rôle d'un compte existant est conservé).
  const db = getDb();
  const existing = await db.user.findUnique({ where: { email } });
  const user = existing
    ? existing
    : await db.user.create({
        data: { email, name: info.name ?? null, role },
      });

  const res = NextResponse.redirect(`${origin}${HOME_BY_ROLE[user.role] ?? "/"}`);
  res.cookies.set(sessionCookie(createToken({ userId: user.id })));
  res.cookies.set("seha_oauth_state", "", { maxAge: 0, path: "/" });
  return res;
}
