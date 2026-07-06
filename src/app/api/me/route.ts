// Session courante (GET) et déconnexion (DELETE).

import { NextResponse } from "next/server";
import { readSession, clearedSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = readSession();
  if (!session) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { id: session.userId, phone: session.phone } });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearedSessionCookie());
  return res;
}
