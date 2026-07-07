"use client";

// Agenda hebdomadaire Seha Pro — « tuer l'agenda papier ».
// - Bandeau « Demandes de RDV » : les réservations en ligne des patients
//   arrivent en attente ; le médecin confirme ou refuse.
// - Grille 7 jours × créneaux, bornée aux disponibilités du médecin
//   (/pro/disponibilites) : les créneaux hors horaires/jours fermés sont grisés.
// - Un clic sur un créneau libre ajoute un patient reçu au cabinet (walk-in).
// Démo : rendez-vous en localStorage (mode cloud = PostgreSQL).

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRoleGate } from "@/components/RoleGuard";
import AppShell from "@/components/AppShell";
import { useLocale } from "@/lib/i18n";
import { listAppointments, saveAppointment, cancelAppointment, updateAppointmentStatus } from "@/lib/appointments";
import { loadAvailability, timesForWeekday, mondayIndex, type WeeklyAvailability } from "@/lib/availability";
import type { Appointment } from "@/lib/types";

const DOCTOR_SLUG = "dr-amine-ben-salah-cardiologie-tunis";
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
  const gate = useRoleGate(["medecin", "secretaire", "admin"]);
  const { locale } = useLocale();
  const fr = locale === "fr";

  const [weekStart, setWeekStart] = useState<Date | null>(null);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [av, setAv] = useState<WeeklyAvailability | null>(null);
  const [pick, setPick] = useState<{ dateIso: string; time: string } | null>(null);
  const [form, setForm] = useState({ name: "", kind: "cabinet" as "cabinet" | "teleconsultation" });

  const refresh = () => setAppts(listAppointments().filter((a) => a.doctorSlug === DOCTOR_SLUG));

  useEffect(() => {
    setWeekStart(startOfWeek(new Date()));
    setAv(loadAvailability(DOCTOR_SLUG));
    refresh();
  }, []);

  const days = useMemo(() => (weekStart ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)) : []), [weekStart]);
  const weekAppts = useMemo(() => {
    if (!weekStart) return [];
    const from = iso(weekStart), to = iso(addDays(weekStart, 6));
    return appts.filter((a) => a.status !== "annule" && a.status !== "refuse" && a.dateIso >= from && a.dateIso <= to);
  }, [appts, weekStart]);

  const todayIso = iso(new Date());
  const pendingReq = useMemo(
    () =>
      appts
        .filter((a) => a.status === "en_attente" && a.dateIso >= todayIso)
        .sort((a, b) => a.dateIso.localeCompare(b.dateIso) || a.time.localeCompare(b.time)),
    [appts, todayIso],
  );

  // Lignes de la grille : union des créneaux de tous les jours ouvrés.
  const gridTimes = useMemo(() => {
    if (!av) return [];
    const set = new Set<string>();
    for (let i = 0; i < 7; i++) timesForWeekday(av, i).forEach((t) => set.add(t));
    return [...set].sort();
  }, [av]);

  if (gate) return gate;

  const at = (dISO: string, time: string) => weekAppts.find((a) => a.dateIso === dISO && a.time === time);
  const isOpen = (d: Date, time: string) =>
    !!av && !av.blockedDates.includes(iso(d)) && timesForWeekday(av, mondayIndex(d)).includes(time);

  function confirmReq(id: string) { updateAppointmentStatus(id, "confirme"); refresh(); }
  function refuseReq(id: string) { updateAppointmentStatus(id, "refuse"); refresh(); }

  function addRdv() {
    if (!pick || !form.name.trim()) return;
    const a: Appointment = {
      id: `pro-${pick.dateIso}-${pick.time}-${Math.round(performance.now())}`,
      doctorSlug: DOCTOR_SLUG,
      doctorName: "Dr Amine Ben Salah",
      specialty: "Cardiologie",
      city: "Tunis",
      dateIso: pick.dateIso,
      time: pick.time,
      kind: form.kind,
      patientName: form.name.trim(),
      patientPhone: "",
      patientEmail: "",
      reason: fr ? "Reçu au cabinet" : "استقبال بالعيادة",
      createdAt: new Date().toISOString(),
      status: "confirme",
      source: "cabinet",
    };
    saveAppointment(a);
    refresh();
    setPick(null);
    setForm({ name: "", kind: "cabinet" });
  }
  function remove(id: string) { cancelAppointment(id); refresh(); setPick(null); }

  const monthLabel = weekStart
    ? weekStart.toLocaleDateString(fr ? "fr-FR" : "ar-TN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">Seha Pro</p>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{fr ? "Agenda" : "الجدول"}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {fr
                ? "Confirmez les demandes en ligne, ajoutez les patients reçus au cabinet."
                : "أكّد الطلبات عبر الإنترنت وأضِف مرضى العيادة."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/pro/disponibilites" className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
              ⚙︎ {fr ? "Disponibilités" : "التوفّر"}
            </Link>
            <button type="button" onClick={() => weekStart && setWeekStart(addDays(weekStart, -7))} className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">◀</button>
            <button type="button" onClick={() => setWeekStart(startOfWeek(new Date()))} className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-primary-700 ring-1 ring-primary-200 hover:bg-primary-50 dark:bg-slate-800 dark:ring-primary-500/40">{fr ? "Aujourd'hui" : "اليوم"}</button>
            <button type="button" onClick={() => weekStart && setWeekStart(addDays(weekStart, 7))} className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">▶</button>
          </div>
        </div>

        {/* Demandes de RDV en ligne à confirmer */}
        {pendingReq.length > 0 && (
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-amber-800 dark:text-amber-200">
                {fr ? "Demandes de rendez-vous" : "طلبات المواعيد"}
              </h2>
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">{pendingReq.length}</span>
            </div>
            <div className="mt-3 space-y-2">
              {pendingReq.map((a) => (
                <div key={a.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                      {a.patientName}
                      <span className="ms-2 text-xs font-normal text-slate-400">{a.kind === "teleconsultation" ? "📹 " + (fr ? "Visio" : "عن بُعد") : "🏥 " + (fr ? "Cabinet" : "عيادة")}</span>
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      <span dir="ltr">{a.dateIso} · {a.time}</span>
                      {a.patientPhone && <> · <span dir="ltr">{a.patientPhone}</span></>}
                      {a.reason && <> · {a.reason}</>}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => confirmReq(a.id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                      ✓ {fr ? "Confirmer" : "تأكيد"}
                    </button>
                    <button type="button" onClick={() => refuseReq(a.id)} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:ring-slate-600">
                      {fr ? "Refuser" : "رفض"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span>{fr ? "Semaine du" : "أسبوع"} <span className="font-semibold text-slate-700 dark:text-slate-200">{monthLabel}</span></span>
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">{weekAppts.length} {fr ? "RDV" : "موعد"}</span>
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">{weekAppts.filter((a) => a.kind === "teleconsultation").length} {fr ? "téléconsultations" : "عن بُعد"}</span>
          <span className="ms-auto flex items-center gap-1 text-xs text-slate-400"><span className="h-2.5 w-2.5 rounded bg-slate-100 dark:bg-slate-700" /> {fr ? "hors horaires" : "خارج الأوقات"}</span>
        </div>

        {/* Grille */}
        <div className="mt-3 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr>
                <th className="sticky start-0 z-10 w-16 border-b border-slate-100 bg-white p-2 text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-800"></th>
                {days.map((d, i) => {
                  const isToday = iso(d) === todayIso;
                  const blocked = av?.blockedDates.includes(iso(d));
                  return (
                    <th key={i} className={`border-b border-slate-100 p-2 text-center text-xs font-semibold dark:border-slate-700 ${isToday ? "bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300" : "text-slate-600 dark:text-slate-300"}`}>
                      {fr ? DAYS_FR[i] : DAYS_AR[i]}
                      <span className="block text-[11px] font-normal text-slate-400">{d.getDate()}/{d.getMonth() + 1}</span>
                      {blocked && <span className="block text-[10px] font-normal text-rose-500">{fr ? "fermé" : "مغلق"}</span>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {gridTimes.map((time) => (
                <tr key={time}>
                  <td className="sticky start-0 z-10 border-b border-slate-50 bg-white p-2 text-center align-top font-mono text-[11px] text-slate-400 dark:border-slate-700 dark:bg-slate-800">{time}</td>
                  {days.map((d, i) => {
                    const dISO = iso(d);
                    const a = at(dISO, time);
                    const open = isOpen(d, time);
                    const selected = pick?.dateIso === dISO && pick?.time === time;
                    const pendingCell = a?.status === "en_attente";
                    return (
                      <td key={i} className={`border-b border-s border-slate-50 p-1 align-top dark:border-slate-700/60 ${!open && !a ? "bg-slate-50/70 dark:bg-slate-900/40" : ""}`}>
                        {a ? (
                          <div className={`rounded-lg px-2 py-1.5 text-[11px] leading-tight ring-1 ${
                            pendingCell
                              ? "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-500/30"
                              : a.kind === "teleconsultation"
                                ? "bg-sky-50 text-sky-800 ring-sky-100 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-500/30"
                                : "bg-primary-50 text-primary-800 ring-primary-100 dark:bg-primary-500/15 dark:text-primary-200 dark:ring-primary-500/30"
                          }`}>
                            <span className="block truncate font-semibold">{a.patientName || (fr ? "Patient" : "مريض")}</span>
                            <span className="text-[10px] opacity-70">
                              {pendingCell ? "⏳ " + (fr ? "En attente" : "قيد الانتظار") : a.kind === "teleconsultation" ? "📹 " + (fr ? "Visio" : "عن بُعد") : "🏥 " + (fr ? "Cabinet" : "عيادة")}
                            </span>
                            <div className="mt-0.5 flex gap-2">
                              {pendingCell && <button type="button" onClick={() => confirmReq(a.id)} className="text-[10px] font-semibold text-emerald-600 hover:underline">{fr ? "Confirmer" : "تأكيد"}</button>}
                              <button type="button" onClick={() => remove(a.id)} className="text-[10px] font-medium text-accent-600 hover:underline">{fr ? "Annuler" : "إلغاء"}</button>
                            </div>
                          </div>
                        ) : open ? (
                          <button
                            type="button"
                            onClick={() => { setPick({ dateIso: dISO, time }); setForm({ name: "", kind: "cabinet" }); }}
                            className={`h-11 w-full rounded-lg text-sm transition ${selected ? "bg-primary-100 text-primary-700 ring-1 ring-primary-300 dark:bg-primary-500/20" : "text-slate-300 hover:bg-slate-50 hover:text-primary-500 dark:text-slate-600 dark:hover:bg-slate-700/50"}`}
                          >
                            {selected ? "✓" : "+"}
                          </button>
                        ) : (
                          <div className="h-11 w-full" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ajout de RDV cabinet (walk-in) */}
        {pick && (
          <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary-200 dark:bg-slate-800 dark:ring-primary-500/40">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-100">
              {fr ? "Patient reçu au cabinet" : "مريض بالعيادة"} — <span className="font-mono text-primary-700 dark:text-primary-300">{pick.dateIso} · {pick.time}</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addRdv()}
                placeholder={fr ? "Nom du patient" : "اسم المريض"}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as "cabinet" | "teleconsultation" })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <option value="cabinet">{fr ? "🏥 Cabinet" : "🏥 عيادة"}</option>
                <option value="teleconsultation">{fr ? "📹 Téléconsultation" : "📹 عن بُعد"}</option>
              </select>
              <button type="button" onClick={addRdv} className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">{fr ? "Ajouter" : "أضف"}</button>
              <button type="button" onClick={() => setPick(null)} className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200">{fr ? "Annuler" : "إلغاء"}</button>
            </div>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-400">
          {fr
            ? "Les créneaux proposés aux patients viennent de vos disponibilités. Démo : stockage local ; en mode cloud, synchronisation PostgreSQL anti-surréservation."
            : "المواعيد المقترحة تأتي من أوقات توفّرك. تجريبي: تخزين محلي؛ في وضع السحابة مزامنة PostgreSQL."}
        </p>
      </div>
    </AppShell>
  );
}
