// État de la plateforme : le front l'interroge pour savoir si le mode
// « cloud » (base de données) est disponible, sinon il reste en mode local.

import { NextResponse } from "next/server";
import { dbConfigured, getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!dbConfigured()) {
    return NextResponse.json({ ok: true, db: false, mode: "local" });
  }
  try {
    await getDb().$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: true, mode: "cloud" });
  } catch {
    return NextResponse.json({ ok: true, db: false, mode: "local" });
  }
}
