// Inscription par e-mail + mot de passe (patients et médecins).
// Crée le compte, ouvre la session (cookie HMAC) et renvoie le profil.
// Les rôles sensibles (clinique, labo, admin) ne sont jamais attribués ici :
// seuls "patient" et "medecin" sont autorisés à l'inscription publique.

import { NextResponse } from "next/server";
import { dbConfigured, getDb } from "@/lib/db";
import { createToken, sessionCookie } from "@/lib/session";
import { hashPassword, passwordProblem, emailProblem } from "@/lib/password";

export const dynamic = "force-dynamic";

const PUBLIC_ROLES = ["patient", "medecin"] as const;

export async function POST(req: Request) {
  if (!dbConfigured()) {
    return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
    name?: string;
    role?: string;
  };

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const name = (body.name ?? "").trim();
  const role = PUBLIC_ROLES.includes(body.role as (typeof PUBLIC_ROLES)[number])
    ? (body.role as string)
    : "patient";

  const emailErr = emailProblem(email);
  if (emailErr) return NextResponse.json({ error: emailErr }, { status: 400 });
  const pwErr = passwordProblem(password);
  if (pwErr) return NextResponse.json({ error: pwErr }, { status: 400 });
  if (name.length < 2) {
    return NextResponse.json({ error: "Nom complet requis." }, { status: 400 });
  }

  const db = getDb();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cet e-mail. Connectez-vous." },
      { status: 409 },
    );
  }

  const user = await db.user.create({
    data: { email, name, role, passwordHash: hashPassword(password) },
    select: { id: true, email: true, name: true, role: true },
  });

  const res = NextResponse.json({ ok: true, user });
  res.cookies.set(sessionCookie(createToken({ userId: user.id })));
  return res;
}
