"use client";

// Disponibilités du médecin — le praticien définit ses jours et horaires de
// travail, la durée d'un créneau, sa pause déjeuner et bloque des jours
// (congés, gardes). Ces réglages alimentent les créneaux proposés au patient
// et la grille de l'agenda. Démo : localStorage par médecin.

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { useRoleGate } from "@/components/RoleGuard";
import {
  loadAvailability,
  saveAvailability,
  timesForWeekday,
  WEEKDAY_LABELS,
  type WeeklyAvailability,
} from "@/lib/availability";

// Le cabinet de démonstration (même slug que l'agenda et le tableau de bord).
const DOCTOR_SLUG = "dr-amine-ben-salah-cardiologie-tunis";

const CARD = "rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700";
const INPUT =
  "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export default function DisponibilitesPage() {
  const gate = useRoleGate(["medecin", "secretaire", "admin"]);
  const [av, setAv] = useState<WeeklyAvailability | null>(null);
  const [saved, setSaved] = useState(false);
  const [newBlock, setNewBlock] = useState("");

  useEffect(() => setAv(loadAvailability(DOCTOR_SLUG)), []);

  const totalWeekly = useMemo(() => {
    if (!av) return 0;
    return av.days.reduce((s, _d, i) => s + timesForWeekday(av, i).length, 0);
  }, [av]);

  if (gate) return gate;

  const update = (next: WeeklyAvailability) => { setAv(next); setSaved(false); };
  const setDay = (i: number, patch: Partial<WeeklyAvailability["days"][number]>) => {
    if (!av) return;
    update({ ...av, days: av.days.map((d, idx) => (idx === i ? { ...d, ...patch } : d)) });
  };
  const save = () => { if (av) { saveAvailability(DOCTOR_SLUG, av); setSaved(true); } };
  const addBlock = () => {
    if (!av || !newBlock || av.blockedDates.includes(newBlock)) return;
    update({ ...av, blockedDates: [...av.blockedDates, newBlock].sort() });
    setNewBlock("");
  };
  const removeBlock = (d: string) => av && update({ ...av, blockedDates: av.blockedDates.filter((x) => x !== d) });

  return (
    <AppShell>
      {!av ? (
        <p className="text-slate-400">Chargement…</p>
      ) : (
        <div className="mx-auto max-w-4xl space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">Seha Pro</p>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Mes disponibilités</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Définissez quand les patients peuvent réserver en ligne. {totalWeekly} créneaux / semaine.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {saved && <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">✓ Enregistré</span>}
              <button type="button" onClick={save} className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
                Enregistrer
              </button>
            </div>
          </div>

          {/* Réglages généraux */}
          <div className={CARD}>
            <h2 className="mb-3 font-bold text-slate-800 dark:text-white">Réglages généraux</h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                Durée d&apos;un créneau
                <select className={INPUT} value={av.slotMinutes} onChange={(e) => update({ ...av, slotMinutes: parseInt(e.target.value, 10) })}>
                  {[15, 20, 30, 45, 60].map((m) => <option key={m} value={m}>{m} min</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                Pause déjeuner
                <input type="time" className={INPUT} value={av.breakStart} onChange={(e) => update({ ...av, breakStart: e.target.value })} />
                <span>→</span>
                <input type="time" className={INPUT} value={av.breakEnd} onChange={(e) => update({ ...av, breakEnd: e.target.value })} />
              </label>
            </div>
          </div>

          {/* Horaires par jour */}
          <div className={CARD}>
            <h2 className="mb-3 font-bold text-slate-800 dark:text-white">Horaires de la semaine</h2>
            <div className="space-y-2">
              {av.days.map((d, i) => {
                const count = timesForWeekday(av, i).length;
                return (
                  <div key={i} className={`flex flex-wrap items-center gap-3 rounded-xl p-3 ring-1 ${d.enabled ? "bg-slate-50 ring-slate-200 dark:bg-slate-900/50 dark:ring-slate-700" : "bg-slate-50/50 ring-slate-100 dark:bg-slate-900/30 dark:ring-slate-800"}`}>
                    <label className="flex w-32 items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
                      <input type="checkbox" checked={d.enabled} onChange={(e) => setDay(i, { enabled: e.target.checked })} className="h-4 w-4 rounded accent-primary-600" />
                      {WEEKDAY_LABELS[i]}
                    </label>
                    {d.enabled ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <input type="time" className={INPUT} value={d.start} onChange={(e) => setDay(i, { start: e.target.value })} />
                          <span>→</span>
                          <input type="time" className={INPUT} value={d.end} onChange={(e) => setDay(i, { end: e.target.value })} />
                        </div>
                        <span className="ms-auto rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
                          {count} créneaux
                        </span>
                      </>
                    ) : (
                      <span className="ms-auto text-sm text-slate-400">Fermé</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Jours bloqués */}
          <div className={CARD}>
            <h2 className="mb-1 font-bold text-slate-800 dark:text-white">Jours fermés (congés, gardes)</h2>
            <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">Aucune réservation en ligne possible ces jours-là.</p>
            <div className="flex flex-wrap items-center gap-2">
              <input type="date" className={INPUT} value={newBlock} onChange={(e) => setNewBlock(e.target.value)} />
              <button type="button" onClick={addBlock} className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-700">
                + Bloquer
              </button>
            </div>
            {av.blockedDates.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {av.blockedDates.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30">
                    {d}
                    <button type="button" onClick={() => removeBlock(d)} className="hover:text-rose-900" aria-label="Retirer">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Ces réglages sont enregistrés sur cet appareil (démo). En production, ils seront synchronisés à votre compte et visibles par tous les patients.
          </p>
        </div>
      )}
    </AppShell>
  );
}
