"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Doctor } from "@/lib/types";
import { type DaySlots } from "@/lib/slots";
import { bookableSlots, loadAvailability } from "@/lib/availability";
import { listAppointments, saveAppointment } from "@/lib/appointments";
import { loadProfile } from "@/lib/profile";
import { notifyUser } from "@/lib/notify";
import { cloudPushAppointment } from "@/lib/cloud";
import { useLocale, WEEKDAYS, MONTHS } from "@/lib/i18n";

export default function BookingWidget({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const { t, locale } = useLocale();
  // Les créneaux dépendent de la date du jour : on les calcule côté client
  // pour éviter tout écart entre rendu serveur et navigateur.
  const [days, setDays] = useState<DaySlots[] | null>(null);
  const [selected, setSelected] = useState<{ dateIso: string; time: string } | null>(null);
  const [kind, setKind] = useState<"cabinet" | "teleconsultation">("cabinet");
  const [form, setForm] = useState({ name: "", phone: "", email: "", reason: "" });
  const [error, setError] = useState(false);
  const [slotTaken, setSlotTaken] = useState(false);

  useEffect(() => {
    // Créneaux issus des disponibilités réelles du médecin, moins les créneaux
    // déjà pris (RDV confirmés ou en attente).
    const av = loadAvailability(doctor.slug);
    const booked: Record<string, Set<string>> = {};
    for (const a of listAppointments()) {
      if (a.doctorSlug !== doctor.slug) continue;
      if (a.status === "annule" || a.status === "refuse") continue;
      (booked[a.dateIso] ??= new Set()).add(a.time);
    }
    setDays(bookableSlots(av, new Date(), 14, booked));
    const profile = loadProfile();
    setForm((f) => ({ ...f, name: profile.name, phone: profile.phone, email: profile.email }));
  }, [doctor.slug]);

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    if (!form.name.trim() || !form.phone.trim()) {
      setError(true);
      return;
    }
    const id = `rdv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const appt = {
      id,
      doctorSlug: doctor.slug,
      doctorName: doctor.fullName,
      specialty: doctor.specialty,
      city: doctor.city,
      dateIso: selected.dateIso,
      time: selected.time,
      kind,
      patientName: form.name.trim(),
      patientPhone: form.phone.trim(),
      patientEmail: form.email.trim(),
      reason: form.reason.trim(),
      createdAt: new Date().toISOString(),
      // Demande en attente de validation par le médecin (il confirme ou refuse).
      status: "en_attente" as const,
      source: "en_ligne" as const,
    };
    // Mode cloud (compte connecté + base de données) : le serveur garantit
    // qu'un même créneau ne peut pas être réservé deux fois.
    const cloud = await cloudPushAppointment(appt);
    if (!cloud.ok && cloud.error === "slot_taken") {
      setSlotTaken(true);
      setSelected(null);
      return;
    }
    saveAppointment(appt);
    notifyUser(
      "Seha — demande envoyée ⏳",
      `${doctor.fullName} · ${selected.dateIso} à ${selected.time} — en attente de confirmation`
    );
    router.push(`/rdv/confirmation?id=${id}`);
  }

  if (!days) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-slate-400 ring-1 ring-slate-200">
        {t("booking.loading")}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-bold text-slate-800">{t("booking.title")}</h2>

      {doctor.teleconsultation && (
        <div className="mt-4 flex gap-2">
          {(["cabinet", "teleconsultation"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                kind === k
                  ? "bg-primary-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {k === "cabinet" ? t("booking.cabinet") : t("booking.tele")}
            </button>
          ))}
        </div>
      )}

      {slotTaken && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{t("booking.slotTaken")}</p>
      )}

      <div className="mt-5 space-y-4">
        {days.map((day) => (
          <div key={day.dateIso}>
            <p className="text-sm font-semibold capitalize text-slate-700">
              {WEEKDAYS[locale][day.weekday]} {day.day} {MONTHS[locale][day.month]}
            </p>
            {day.times.length === 0 ? (
              <p className="mt-1 text-xs text-slate-400">{t("booking.noSlot")}</p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {day.times.map((tSlot) => {
                  const isSelected =
                    selected?.dateIso === day.dateIso && selected?.time === tSlot;
                  return (
                    <button
                      key={tSlot}
                      type="button"
                      onClick={() => setSelected({ dateIso: day.dateIso, time: tSlot })}
                      className={`rounded-lg px-3 py-1.5 text-sm transition ${
                        isSelected
                          ? "bg-primary-600 font-semibold text-white"
                          : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                      }`}
                      dir="ltr"
                    >
                      {tSlot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <form onSubmit={confirm} className="mt-6 space-y-3 border-t border-slate-100 pt-5">
          <p className="text-sm text-slate-600">
            {t("booking.chosen")}{" "}
            <span className="font-semibold text-primary-700" dir="ltr">
              {selected.dateIso} {selected.time}
            </span>{" "}
            ({kind === "cabinet" ? t("booking.inCabinet") : t("booking.inTele")})
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder={t("booking.name")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
            <input
              type="tel"
              placeholder={t("booking.phone")}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
            <input
              type="email"
              placeholder={t("booking.email")}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 sm:col-span-2"
            />
            <textarea
              placeholder={t("booking.reason")}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              rows={2}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 sm:col-span-2"
            />
          </div>
          {error && <p className="text-sm text-accent-600">{t("booking.error")}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            {t("booking.confirm")}
          </button>
          <p className="text-center text-xs text-slate-400">{t("booking.free")}</p>
        </form>
      )}
    </div>
  );
}
