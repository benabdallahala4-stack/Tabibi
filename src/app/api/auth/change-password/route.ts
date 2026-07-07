// Changement de mot de passe pour l'utilisateur connecté.
// - Si un mot de passe existe déjà, le mot de passe actuel est exigé.
// - Les comptes Google (sans mot de passe) peuvent en définir un (le champ
//   « actuel » est alors ignoré).

import { NextResponse } from "next/server";
import { dbConfigured, getDb } from "@/lib/db";
import { readSession } from "@/lib/session";
import { hashPassword, verifyPassword, passwordProblem } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!dbConfigured()) return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  const session = readSession();
  if (!session) return NextResponse.json({ error: "Non connecté." }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { current?: string; next?: string };
  const next = body.next ?? "";
  const pwErr = passwordProblem(next);
  if (pwErr) return NextResponse.json({ error: pwErr }, { status: 400 });

  const db = getDb();
  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "Compte introuvable." }, { status: 404 });

  if (user.passwordHash && !verifyPassword(body.current ?? "", user.passwordHash)) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 401 });
  }

  await db.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(next) } });
  return NextResponse.json({ ok: true });
}
