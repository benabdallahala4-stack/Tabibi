// Rendez-vous multi-appareils (nécessite une session OTP).
// GET  : liste des rendez-vous de l'utilisateur connecté.
// POST : création avec garantie anti-surréservation (contrainte unique slotKey).

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { dbConfigured, getDb } from "@/lib/db";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!dbConfigured()) return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  const session = readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const appointments = await getDb().appointment.findMany({
    where: { userId: session.userId },
    orderBy: [{ dateIso: "desc" }, { time: "desc" }],
  });
  return NextResponse.json({ appointments });
}

export async function POST(req: Request) {
  if (!dbConfigured()) return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  const session = readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const b = (await req.json().catch(() => null)) as Record<string, string> | null;
  const required = ["id", "doctorSlug", "doctorName", "specialty", "city", "dateIso", "time", "kind", "patientName", "patientPhone"];
  if (!b || required.some((k) => !b[k] || typeof b[k] !== "string")) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.dateIso) || !/^\d{2}:\d{2}$/.test(b.time)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  try {
    const appointment = await getDb().appointment.create({
      data: {
        id: b.id,
        userId: session.userId,
        doctorSlug: b.doctorSlug,
        doctorName: b.doctorName,
        specialty: b.specialty,
        city: b.city,
        dateIso: b.dateIso,
        time: b.time,
        kind: b.kind === "teleconsultation" ? "teleconsultation" : "cabinet",
        patientName: b.patientName,
        patientPhone: b.patientPhone,
        patientEmail: b.patientEmail ?? "",
        reason: b.reason ?? "",
        status: "confirme",
        slotKey: `${b.doctorSlug}|${b.dateIso}|${b.time}`,
      },
    });
    return NextResponse.json({ ok: true, appointment }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      // slotKey déjà pris : le créneau vient d'être réservé par quelqu'un d'autre.
      return NextResponse.json({ error: "slot_taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
