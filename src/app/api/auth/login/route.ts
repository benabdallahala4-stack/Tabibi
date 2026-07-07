// Connexion par e-mail + mot de passe. Message d'erreur volontairement
// générique (ne révèle pas si l'e-mail existe).

import { NextResponse } from "next/server";
import { dbConfigured, getDb } from "@/lib/db";
import { createToken, sessionCookie } from "@/lib/session";
import { verifyPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!dbConfigured()) {
    return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "E-mail et mot de passe requis." }, { status: 400 });
  }

  const db = getDb();
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "E-mail ou mot de passe incorrect." }, { status: 401 });
  }

  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
  res.cookies.set(sessionCookie(createToken({ userId: user.id })));
  return res;
}
