// Vérification du code OTP → création/connexion du compte + cookie de session.

import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { dbConfigured, getDb } from "@/lib/db";
import { createToken, sessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!dbConfigured()) {
    return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as { phone?: string; code?: string; name?: string };
  const phone = (body.phone ?? "").trim();
  const code = (body.code ?? "").trim();
  if (!phone || !/^\d{4,8}$/.test(code)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const db = getDb();
  const codeHash = createHash("sha256").update(code).digest("hex");
  const otp = await db.otpCode.findFirst({
    where: { phone, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!otp || otp.attempts >= 5) {
    return NextResponse.json({ error: "expired" }, { status: 401 });
  }
  if (otp.codeHash !== codeHash) {
    await db.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    return NextResponse.json({ error: "wrong_code" }, { status: 401 });
  }

  // Code correct : purge des OTP du numéro + upsert utilisateur.
  await db.otpCode.deleteMany({ where: { phone } });
  const user = await db.user.upsert({
    where: { phone },
    create: { phone, name: body.name?.trim() || null },
    update: body.name?.trim() ? { name: body.name.trim() } : {},
  });

  const res = NextResponse.json({ ok: true, user: { id: user.id, phone: user.phone, name: user.name } });
  res.cookies.set(sessionCookie(createToken({ userId: user.id, phone: user.phone })));
  return res;
}
