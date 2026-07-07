"use client";

// Agenda hebdomadaire Seha Pro — Phase 1 « tuer l'agenda papier ».
// Grille 7 jours × créneaux : voir les RDV, cliquer un créneau libre pour en
// ajouter un. Démo : rendez-vous en localStorage (mode cloud = PostgreSQL).

import { useEffect, useMemo, useState } from "react";
import { useRoleGate, SessionBar } from "@/components/RoleGuard";
import { useLocale } from "@/lib/i18n";
import { listAppointments, saveAppointment, cancelAppointment } from "@/lib/appointments";
import type { Appointment } from "@/lib/types";

const HOURS = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
const DAYS_FR = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const DAYS_AR = ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"];

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function startOfWeek(d: Date): Date {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Lundi = 0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export default function AgendaPage() {
  const gate = useRoleGate(["medecin", "admin"]);
  const { locale } = useLocale();
  const fr = locale === "fr";

  const [weekStart, setWeekStart] = useState<Date | null>(null);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [pick, setPick] = useState<{ dateIso: string; time: string } | null>(null);
  const [form, setForm] = useState({ name: "", kind: "cabinet" as "cabinet" | "teleconsultation" });

  useEffect(() => {
    setWeekStart(startOfWeek(new Date()));
    setAppts(listAppointments());
  }, []);

  const days = useMemo(() => (weekStart ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)) : []), [weekStart]);
  const weekAppts = useMemo(() => {
    if (!weekStart) return [];
    const from = iso(weekStart), to = iso(addDays(weekStart, 6));
    return appts.filter((a) => a.status !== "annule" && a.dateIso >= from && a.dateIso <= to);
  }, [appts, weekStart]);

  if (gate) return gate;

  const at = (dISO: string, time: string) => weekAppts.find((a) => a.dateIso === dISO && a.time === time);

  function addRdv() {
    if (!pick || !form.name.trim()) return;
    const a: Appointment = {
      id: `pro-${pick.dateIso}-${pick.time}-${Math.round(performance.now())}`,
      doctorSlug: "dr-amine-ben-salah-cardiologie-tunis",
      doctorName: "Dr Amine Ben Salah",
      specialty: "Cardiologie",
      city: "Tunis",
      dateIso: pick.dateIso,
      time: pick.time,
      kind: form.kind,
      patientName: form.name.trim(),
      patientPhone: "",
      patientEmail: "",
      reason: fr ? "Ajouté depuis l'agenda" : "أُضيف من الجدول",
      createdAt: new Date().toISOString(),
      status: "confirme",
    };
    saveAppointment(a);
    setAppts(listAppointments());
    setPick(null);
    setForm({ name: "", kind: "cabinet" });
  }
  function remove(id: string) {
    cancelAppointment(id);
    setAppts(listAppointments());
    setPick(null);
  }

  const monthLabel = weekStart
    ? weekStart.toLocaleDateString(fr ? "fr-FR" : "ar-TN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <>
      <SessionBar />
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">Seha Pro</p>
            <h1 className="text-2xl font-bold text-slate-800">{fr ? "Agenda" : "الجدول"}</h1>
            <p className="text-sm text-slate-500">{fr ? "Votre semaine, d'un coup d'œil. Cliquez un créneau libre pour ajouter un RDV." : "أسبوعك بنظرة واحدة. انقر موعدًا فارغًا لإضافة حجز."}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => weekStart && setWeekStart(addDays(weekStart, -7))} className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">◀</button>
            <button type="button" onClick={() => setWeekStart(startOfWeek(new Date()))} className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-primary-700 ring-1 ring-primary-200 hover:bg-primary-50">{fr ? "Aujourd'hui" : "اليوم"}</button>
            <button type="button" onClick={() => weekStart && setWeekStart(addDays(weekStart, 7))} className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">▶</button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{fr ? "Semaine du" : "أسبوع"} <span className="font-semibold text-slate-700">{monthLabel}</span></span>
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">{weekAppts.length} {fr ? "RDV" : "موعد"}</span>
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700">{weekAppts.filter((a) => a.kind === "teleconsultation").length} {fr ? "téléconsultations" : "عن بُعد"}</span>
        </div>

        {/* Grille */}
        <div className="mt-5 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr>
                <th className="sticky start-0 z-10 w-16 border-b border-slate-100 bg-white p-2 text-xs text-slate-400"></th>
                {days.map((d, i) => {
                  const todayIso = iso(new Date());
                  const isToday = iso(d) === todayIso;
                  return (
                    <th key={i} className={`border-b border-slate-100 p-2 text-center text-xs font-semibold ${isToday ? "bg-primary-50 text-primary-700" : "text-slate-600"}`}>
                      {fr ? DAYS_FR[i] : DAYS_AR[i]}
                      <span className="block text-[11px] font-normal text-slate-400">{d.getDate()}/{d.getMonth() + 1}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((time) => (
                <tr key={time}>
                  <td className="sticky start-0 z-10 border-b border-slate-50 bg-white p-2 text-center align-top font-mono text-[11px] text-slate-400">{time}</td>
                  {days.map((d, i) => {
                    const dISO = iso(d);
                    const a = at(dISO, time);
                    const selected = pick?.dateIso === dISO && pick?.time === time;
                    return (
                      <td key={i} className="border-b border-s border-slate-50 p-1 align-top">
                        {a ? (
                          <div className={`rounded-lg px-2 py-1.5 text-[11px] leading-tight ${a.kind === "teleconsultation" ? "bg-sky-50 text-sky-800 ring-1 ring-sky-100" : "bg-primary-50 text-primary-800 ring-1 ring-primary-100"}`}>
                            <span className="block truncate font-semibold">{a.patientName || (fr ? "Patient" : "مريض")}</span>
                            <span className="text-[10px] opacity-70">{a.kind === "teleconsultation" ? "📹 " + (fr ? "Visio" : "عن بُعد") : "🏥 " + (fr ? "Cabinet" : "عيادة")}</span>
                            <button type="button" onClick={() => remove(a.id)} className="mt-0.5 block text-[10px] font-medium text-accent-600 hover:underline">{fr ? "Annuler" : "إلغاء"}</button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setPick({ dateIso: dISO, time }); setForm({ name: "", kind: "cabinet" }); }}
                            className={`h-11 w-full rounded-lg text-sm transition ${selected ? "bg-primary-100 text-primary-700 ring-1 ring-primary-300" : "text-slate-300 hover:bg-slate-50 hover:text-primary-500"}`}
                          >
                            {selected ? "✓" : "+"}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ajout de RDV */}
        {pick && (
          <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary-200">
            <p className="text-sm font-bold text-slate-700">
              {fr ? "Nouveau rendez-vous" : "موعد جديد"} — <span className="font-mono text-primary-700">{pick.dateIso} · {pick.time}</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addRdv()}
                placeholder={fr ? "Nom du patient" : "اسم المريض"}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200"
              />
              <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as "cabinet" | "teleconsultation" })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200">
                <option value="cabinet">{fr ? "🏥 Cabinet" : "🏥 عيادة"}</option>
                <option value="teleconsultation">{fr ? "📹 Téléconsultation" : "📹 عن بُعد"}</option>
              </select>
              <button type="button" onClick={addRdv} className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">{fr ? "Ajouter" : "أضف"}</button>
              <button type="button" onClick={() => setPick(null)} className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200">{fr ? "Annuler" : "إلغاء"}</button>
            </div>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-400">
          {fr ? "Démo : les rendez-vous sont stockés sur cet appareil. En mode cloud, ils sont synchronisés (PostgreSQL) et anti-surréservation." : "تجريبي: تُحفظ المواعيد على هذا الجهاز. في وضع السحابة تُزامَن (PostgreSQL) مع منع الحجز المزدوج."}
        </p>
      </div>
    </>
  );
}
