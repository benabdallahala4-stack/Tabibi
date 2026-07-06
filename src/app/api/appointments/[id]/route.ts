// Annulation d'un rendez-vous : status = annule et libération du créneau
// (slotKey remis à NULL — l'unicité ignore les NULL).

import { NextResponse } from "next/server";
import { dbConfigured, getDb } from "@/lib/db";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!dbConfigured()) return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  const session = readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const db = getDb();
  const appt = await db.appointment.findUnique({ where: { id: params.id } });
  if (!appt || appt.userId !== session.userId) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  await db.appointment.update({
    where: { id: params.id },
    data: { status: "annule", slotKey: null },
  });
  return NextResponse.json({ ok: true });
}
