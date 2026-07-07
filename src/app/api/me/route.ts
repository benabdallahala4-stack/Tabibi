// Session courante (GET) et déconnexion (DELETE).

import { NextResponse } from "next/server";
import { readSession, clearedSessionCookie } from "@/lib/session";
import { dbConfigured, getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = readSession();
  if (!session || !dbConfigured()) return NextResponse.json({ user: null });
  const user = await getDb().user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  });
  return NextResponse.json({ user: user ?? null });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearedSessionCookie());
  return res;
}
