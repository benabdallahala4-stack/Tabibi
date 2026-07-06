// Demande de code OTP par SMS.
// Sans passerelle SMS configurée (SMS_GATEWAY_URL), le code est renvoyé dans
// la réponse avec devCode (mode démonstration) — à retirer en production.

import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { dbConfigured, getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^0-9+]/g, "");
  if (digits.length < 8) return null;
  return digits.startsWith("+") ? digits : `+216${digits}`;
}

export async function POST(req: Request) {
  if (!dbConfigured()) {
    return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as { phone?: string };
  const phone = normalizePhone(body.phone ?? "");
  if (!phone) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }

  const db = getDb();
  // Anti-spam : max 3 demandes non expirées par numéro.
  const pending = await db.otpCode.count({
    where: { phone, expiresAt: { gt: new Date() } },
  });
  if (pending >= 3) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  await db.otpCode.create({
    data: {
      phone,
      codeHash: createHash("sha256").update(code).digest("hex"),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  const smsConfigured = !!process.env.SMS_GATEWAY_URL;
  if (smsConfigured) {
    // Branchement passerelle SMS tunisienne (Orange/Ooredoo/TT ou agrégateur) :
    // POST process.env.SMS_GATEWAY_URL avec { to: phone, text: `Code Seha : ${code}` }
    try {
      await fetch(process.env.SMS_GATEWAY_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SMS_GATEWAY_TOKEN ?? ""}`,
        },
        body: JSON.stringify({ to: phone, text: `Votre code Seha : ${code}` }),
      });
    } catch {
      return NextResponse.json({ error: "sms_failed" }, { status: 502 });
    }
  }

  return NextResponse.json({
    ok: true,
    phone,
    // Mode démo uniquement : jamais en production.
    ...(smsConfigured ? {} : { devCode: code }),
  });
}
