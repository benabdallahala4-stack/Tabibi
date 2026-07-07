// Déconnexion : efface le cookie de session.

import { NextResponse } from "next/server";
import { clearedSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearedSessionCookie());
  return res;
}
