// Client du mode « cloud » : détecte la disponibilité de l'API (base de
// données), gère la session OTP et synchronise les rendez-vous.
// Si l'API est indisponible, tout le site continue en mode local.

import type { Appointment } from "./types";

let cachedMode: "cloud" | "local" | null = null;

export async function cloudAvailable(): Promise<boolean> {
  if (cachedMode) return cachedMode === "cloud";
  try {
    const r = await fetch("/api/health", { cache: "no-store" });
    const j = (await r.json()) as { db?: boolean };
    cachedMode = j.db ? "cloud" : "local";
  } catch {
    cachedMode = "local";
  }
  return cachedMode === "cloud";
}

export interface CloudUser {
  id: string;
  phone: string;
  name?: string | null;
}

export async function cloudMe(): Promise<CloudUser | null> {
  try {
    const r = await fetch("/api/me", { cache: "no-store" });
    const j = (await r.json()) as { user: CloudUser | null };
    return j.user;
  } catch {
    return null;
  }
}

export async function cloudRequestOtp(phone: string): Promise<{ ok: boolean; devCode?: string; error?: string }> {
  try {
    const r = await fetch("/api/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const j = await r.json();
    return r.ok ? { ok: true, devCode: j.devCode } : { ok: false, error: j.error };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function cloudVerifyOtp(
  phone: string,
  code: string,
  name?: string
): Promise<{ ok: boolean; user?: CloudUser; error?: string }> {
  try {
    const r = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code, name }),
    });
    const j = await r.json();
    return r.ok ? { ok: true, user: j.user } : { ok: false, error: j.error };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function cloudLogout(): Promise<void> {
  try {
    await fetch("/api/me", { method: "DELETE" });
  } catch {
    /* ignore */
  }
}

/** Pousse un RDV vers le serveur. "slot_taken" = créneau déjà réservé. */
export async function cloudPushAppointment(
  appt: Appointment
): Promise<{ ok: boolean; error?: "slot_taken" | "unauthorized" | "unavailable" }> {
  try {
    const r = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appt),
    });
    if (r.ok) return { ok: true };
    if (r.status === 409) return { ok: false, error: "slot_taken" };
    if (r.status === 401) return { ok: false, error: "unauthorized" };
    return { ok: false, error: "unavailable" };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

export async function cloudFetchAppointments(): Promise<Appointment[] | null> {
  try {
    const r = await fetch("/api/appointments", { cache: "no-store" });
    if (!r.ok) return null;
    const j = (await r.json()) as { appointments: (Appointment & { createdAt: string })[] };
    return j.appointments.map((a) => ({ ...a, createdAt: String(a.createdAt) }));
  } catch {
    return null;
  }
}

export async function cloudCancelAppointment(id: string): Promise<boolean> {
  try {
    const r = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    return r.ok;
  } catch {
    return false;
  }
}
