"use client";

// Espace praticien Seha Pro (démonstration interactive, compte fictif
// « Dr Amine Ben Salah »). Interface en français : langue de travail
// habituelle du corps médical tunisien.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listAppointments } from "@/lib/appointments";
import type { Appointment } from "@/lib/types";
import {
  loadWorkspace,
  saveWorkspace,
  uid,
  type ConsultationRecord,
  type PaymentMethod,
  type ProWorkspace,
} from "@/lib/pro";
import { accessRecordWithCode, type MedicalRecord } from "@/lib/medicalRecord";
import { loadQueue, saveQueue, type QueueState } from "@/lib/queue";
import { useRoleGate, SessionBar } from "@/components/RoleGuard";
import { allQuestions, answerQuestion, type QnaQuestion } from "@/lib/qna";
import { SPECIALTIES } from "@/lib/data";
import { loadPlan, planAllows, PLAN_LABELS, TAB_MIN_PLAN, type Plan } from "@/lib/plan";

const TABS = [
  { id: "agenda", label: "📅 Agenda" },
  { id: "patients", label: "🗂️ Patients" },
  { id: "caisse", label: "💰 Caisse" },
  { id: "messages", label: "💬 Messagerie" },
  { id: "suivis", label: "🔔 Suivis" },
  { id: "file", label: "⏳ File d'attente" },
  { id: "qna", label: "💬 Questions publiques" },
  { id: "dossier", label: "🔐 Dossier partagé" },
  { id: "stats", label: "📊 Statistiques" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const METHOD_LABEL: Record<PaymentMethod, string> = {
  especes: "Espèces",
  carte: "Carte",
  cnam: "CNAM",
  impaye: "Impayé",
};

export default function ProDashboard() {
  const gate = useRoleGate(["medecin", "admin"]);
  const [tab, setTab] = useState<TabId>("agenda");
  const [ws, setWs] = useState<ProWorkspace | null>(null);
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [plan, setPlan] = useState<Plan>("gratuit");

  useEffect(() => {
    setPlan(loadPlan());
    setWs(loadWorkspace());
    setBookings(
      listAppointments().filter(
        (a) => a.doctorSlug === "dr-amine-ben-salah-cardiologie-tunis" && a.status === "confirme"
      )
    );
  }, []);

  const unlocked = planAllows(plan, tab);

  function update(next: ProWorkspace) {
    setWs(next);
    saveWorkspace(next);
  }

  if (gate) return gate;
  if (!ws) return <p className="p-10 text-slate-400">Chargement…</p>;

  return (
    <>
    <SessionBar />
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Espace praticien</h1>
          <p className="text-sm text-slate-500">
            Dr Amine Ben Salah — Cardiologie, Tunis ·{" "}
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              Démo interactive (données sur cet appareil)
            </span>{" "}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                plan === "gratuit" ? "bg-slate-100 text-slate-600" : "bg-primary-50 text-primary-700"
              }`}
            >
              Plan : {PLAN_LABELS[plan]}
            </span>
          </p>
        </div>
        <Link
          href="/pro/tarifs"
          className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          ⭐ Passer à Seha Pro
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tItem) => {
          const locked = !planAllows(plan, tItem.id);
          return (
            <button
              key={tItem.id}
              type="button"
              onClick={() => setTab(tItem.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === tItem.id
                  ? "bg-primary-600 text-white"
                  : locked
                    ? "bg-slate-50 text-slate-400 ring-1 ring-slate-200 hover:bg-slate-100"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {locked ? "🔒 " : ""}
              {tItem.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {!unlocked ? (
          <LockedPanel tab={tab} plan={plan} />
        ) : (
          <>
            {tab === "agenda" && <AgendaTab bookings={bookings} />}
            {tab === "patients" && <PatientsTab ws={ws} update={update} />}
            {tab === "caisse" && <CaisseTab ws={ws} update={update} />}
            {tab === "messages" && <MessagesTab ws={ws} update={update} />}
            {tab === "suivis" && <SuivisTab ws={ws} update={update} />}
            {tab === "file" && <QueueTab />}
            {tab === "qna" && <QnaTab />}
            {tab === "dossier" && <SharedRecordTab />}
            {tab === "stats" && <StatsTab ws={ws} bookings={bookings} />}
          </>
        )}
      </div>
    </div>
    </>
  );
}

/* ---------------- Fonctionnalité verrouillée (freemium) ---------------- */

const LOCKED_PITCH: Record<string, string> = {
  file: "Vos patients suivent leur tour en temps réel et arrivent à l'heure — fini la salle d'attente bondée.",
  caisse: "Encaissements, impayés, répartition espèces/carte/CNAM : votre comptabilité du cabinet en un coup d'œil.",
  messages: "Messagerie sécurisée avec vos patients pour le suivi non urgent, sans donner votre numéro personnel.",
  suivis: "Relances automatiques : renouvellements, résultats, contrôles post-opératoires — aucun patient perdu de vue.",
  dossier: "Consultez le dossier médical que le patient choisit de partager avec vous (antécédents, analyses, radios).",
  stats: "Chiffre d'affaires, motifs fréquents, origine des patients : pilotez votre activité avec des données.",
};

function LockedPanel({ tab, plan }: { tab: string; plan: Plan }) {
  const tabInfo = TABS.find((t) => t.id === tab);
  const requiredPlan = TAB_MIN_PLAN[tab] ?? "essentiel";
  return (
    <section className="relative overflow-hidden rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
      <div className="mx-auto max-w-md">
        <span className="text-5xl">🔒</span>
        <h2 className="mt-3 text-xl font-bold text-slate-800">{tabInfo?.label.replace(/^\S+\s/, "")}</h2>
        <p className="mt-2 text-sm text-slate-500">{LOCKED_PITCH[tab]}</p>
        <p className="mt-4 text-sm text-slate-600">
          Inclus à partir du plan{" "}
          <span className="font-bold text-primary-700">{PLAN_LABELS[requiredPlan]}</span>
          {" — "}votre plan actuel : <span className="font-semibold">{PLAN_LABELS[plan]}</span>.
        </p>
        <Link
          href="/pro/tarifs"
          className="mt-5 inline-block rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          ⭐ Débloquer avec {PLAN_LABELS[requiredPlan]}
        </Link>
        <p className="mt-3 text-xs text-slate-400">Sans engagement — activation immédiate.</p>
      </div>
    </section>
  );
}

/* ---------------- Agenda ---------------- */

function AgendaTab({ bookings }: { bookings: Appointment[] }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-bold text-slate-800">Rendez-vous en ligne</h2>
      <p className="mt-1 text-sm text-slate-500">
        Les réservations effectuées côté patient sur le profil du Dr Ben Salah apparaissent ici
        (même appareil, démo).
      </p>
      {bookings.length === 0 ? (
        <div className="mt-4 rounded-xl bg-slate-50 p-6 text-sm text-slate-500">
          Aucune réservation pour l&apos;instant.{" "}
          <Link href="/medecin/dr-amine-ben-salah-cardiologie-tunis" className="text-primary-600 hover:underline">
            Réservez un créneau côté patient
          </Link>{" "}
          puis revenez ici.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-slate-800">{b.patientName}</p>
                <p className="text-sm text-slate-500">
                  {b.dateIso} à {b.time} · {b.kind === "cabinet" ? "Cabinet" : "Téléconsultation"}
                  {b.reason && <> · {b.reason}</>}
                </p>
                <p className="text-xs text-slate-400">{b.patientPhone}</p>
              </div>
              {b.kind === "teleconsultation" && (
                <Link
                  href={`/visio?rdv=${b.id}`}
                  className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  📹 Démarrer la vidéo
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Patients & dossiers ---------------- */

function PatientsTab({ ws, update }: { ws: ProWorkspace; update: (w: ProWorkspace) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(ws.patients[0]?.id ?? null);
  const [newPatient, setNewPatient] = useState({ name: "", phone: "", birthYear: "", origin: "Tunisie" as const });
  const [consult, setConsult] = useState({
    motif: "",
    notes: "",
    prescription: "",
    certType: "",
    certDays: 0,
    amount: 80,
    method: "especes" as PaymentMethod,
    kind: "cabinet" as "cabinet" | "teleconsultation",
  });

  const selected = ws.patients.find((p) => p.id === selectedId) ?? null;
  const history = ws.consultations
    .filter((c) => c.patientId === selectedId)
    .sort((a, b) => b.date.localeCompare(a.date));

  function addPatient(e: React.FormEvent) {
    e.preventDefault();
    if (!newPatient.name.trim()) return;
    const p = {
      id: uid("p"),
      name: newPatient.name.trim(),
      phone: newPatient.phone.trim(),
      birthYear: newPatient.birthYear.trim(),
      origin: newPatient.origin,
      allergies: "—",
      chronic: "—",
    };
    update({ ...ws, patients: [...ws.patients, p] });
    setNewPatient({ name: "", phone: "", birthYear: "", origin: "Tunisie" });
    setSelectedId(p.id);
  }

  function addConsultation(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !consult.motif.trim()) return;
    const record: ConsultationRecord = {
      id: uid("c"),
      patientId: selectedId,
      date: new Date().toISOString().slice(0, 10),
      kind: consult.kind,
      motif: consult.motif.trim(),
      notes: consult.notes.trim(),
      prescription: consult.prescription.trim(),
      certificate: consult.certType.trim()
        ? { type: consult.certType.trim(), days: consult.certDays || 0 }
        : null,
      amount: consult.amount,
      method: consult.method,
      paid: consult.method !== "impaye",
    };
    update({ ...ws, consultations: [...ws.consultations, record] });
    setConsult({ ...consult, motif: "", notes: "", prescription: "", certType: "", certDays: 0 });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Liste patients */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-bold text-slate-800">Patients ({ws.patients.length})</h2>
        <div className="mt-3 space-y-1">
          {ws.patients.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                selectedId === p.id ? "bg-primary-50 font-semibold text-primary-700" : "hover:bg-slate-50"
              }`}
            >
              {p.name}
              {p.origin !== "Tunisie" && (
                <span className="ml-2 rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700">
                  {p.origin}
                </span>
              )}
            </button>
          ))}
        </div>
        <form onSubmit={addPatient} className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Nouveau patient</p>
          <input
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            placeholder="Nom complet"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400"
          />
          <div className="flex gap-2">
            <input
              value={newPatient.phone}
              onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
              placeholder="Téléphone"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
            <input
              value={newPatient.birthYear}
              onChange={(e) => setNewPatient({ ...newPatient, birthYear: e.target.value })}
              placeholder="Année"
              className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <button className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            + Ajouter
          </button>
        </form>
      </section>

      {/* Dossier du patient sélectionné */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
        {!selected ? (
          <p className="text-sm text-slate-500">Sélectionnez un patient.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-800">{selected.name}</h2>
              <span className="text-xs text-slate-400">
                {selected.phone} {selected.birthYear && `· né(e) en ${selected.birthYear}`} · {selected.origin}
              </span>
            </div>
            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
              <p className="rounded-lg bg-red-50 px-3 py-2 text-red-800">
                <span className="font-semibold">Allergies :</span> {selected.allergies}
              </p>
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
                <span className="font-semibold">Chronique :</span> {selected.chronic}
              </p>
            </div>

            {/* Historique */}
            <h3 className="mt-5 font-semibold text-slate-700">Historique des consultations</h3>
            <div className="mt-2 space-y-3">
              {history.length === 0 && <p className="text-sm text-slate-400">Aucune consultation.</p>}
              {history.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800">
                      {c.date} — {c.motif}
                    </span>
                    <span className="text-xs text-slate-500">
                      {c.kind === "cabinet" ? "🏥 Cabinet" : "📹 Téléconsultation"} · {c.amount} DT ·{" "}
                      <span className={c.paid ? "text-emerald-600" : "font-semibold text-accent-600"}>
                        {c.paid ? METHOD_LABEL[c.method] : "Impayé"}
                      </span>
                    </span>
                  </div>
                  {c.notes && <p className="mt-1 text-slate-600">{c.notes}</p>}
                  {c.prescription && (
                    <p className="mt-2 rounded-lg bg-white px-3 py-2 text-slate-700 ring-1 ring-slate-200">
                      💊 <span className="font-medium">Ordonnance (remise en main propre) :</span> {c.prescription}
                    </p>
                  )}
                  {c.certificate && (
                    <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800">
                      📄 Certificat « {c.certificate.type} »{c.certificate.days ? ` — ${c.certificate.days} j` : ""} —{" "}
                      <span className="font-medium">remis en main propre au cabinet</span> (trace administrative,
                      aucun document en ligne)
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Nouvelle consultation */}
            <form onSubmit={addConsultation} className="mt-5 space-y-2 rounded-xl border border-primary-100 bg-primary-50/50 p-4">
              <p className="text-sm font-semibold text-primary-800">Nouvelle consultation</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={consult.motif}
                  onChange={(e) => setConsult({ ...consult, motif: e.target.value })}
                  placeholder="Motif *"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400"
                />
                <select
                  value={consult.kind}
                  onChange={(e) => setConsult({ ...consult, kind: e.target.value as "cabinet" | "teleconsultation" })}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="cabinet">Au cabinet</option>
                  <option value="teleconsultation">Téléconsultation (contrôle)</option>
                </select>
              </div>
              <textarea
                value={consult.notes}
                onChange={(e) => setConsult({ ...consult, notes: e.target.value })}
                placeholder="Notes cliniques"
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400"
              />
              <textarea
                value={consult.prescription}
                onChange={(e) => setConsult({ ...consult, prescription: e.target.value })}
                placeholder="Ordonnance (trace — le document est remis en main propre)"
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400"
              />
              <div className="grid gap-2 sm:grid-cols-4">
                <input
                  value={consult.certType}
                  onChange={(e) => setConsult({ ...consult, certType: e.target.value })}
                  placeholder="Certificat (ex. Repos)"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400 sm:col-span-2"
                />
                <input
                  type="number"
                  min={0}
                  value={consult.certDays || ""}
                  onChange={(e) => setConsult({ ...consult, certDays: Number(e.target.value) })}
                  placeholder="Jours"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    value={consult.amount}
                    onChange={(e) => setConsult({ ...consult, amount: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400"
                  />
                  <span className="self-center text-xs text-slate-500">DT</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={consult.method}
                  onChange={(e) => setConsult({ ...consult, method: e.target.value as PaymentMethod })}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="especes">Espèces</option>
                  <option value="carte">Carte bancaire</option>
                  <option value="cnam">CNAM / tiers payant</option>
                  <option value="impaye">Impayé (à encaisser)</option>
                </select>
                <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                  Enregistrer la consultation
                </button>
              </div>
              {consult.certType.trim() && (
                <p className="text-xs text-amber-700">
                  ⚖️ Rappel : le certificat doit être remis en main propre après examen — Seha n&apos;en conserve
                  qu&apos;une trace, aucun certificat n&apos;est émis en ligne.
                </p>
              )}
            </form>
          </>
        )}
      </section>
    </div>
  );
}

/* ---------------- Caisse ---------------- */

function CaisseTab({ ws, update }: { ws: ProWorkspace; update: (w: ProWorkspace) => void }) {
  const stats = useMemo(() => {
    const paid = ws.consultations.filter((c) => c.paid);
    const unpaid = ws.consultations.filter((c) => !c.paid);
    const month = new Date().toISOString().slice(0, 7);
    const monthTotal = paid.filter((c) => c.date.startsWith(month)).reduce((s, c) => s + c.amount, 0);
    const byMethod: Record<string, number> = {};
    for (const c of paid) byMethod[c.method] = (byMethod[c.method] ?? 0) + c.amount;
    return { total: paid.reduce((s, c) => s + c.amount, 0), monthTotal, unpaid, byMethod };
  }, [ws]);

  function markPaid(id: string, method: PaymentMethod) {
    update({
      ...ws,
      consultations: ws.consultations.map((c) => (c.id === id ? { ...c, paid: true, method } : c)),
    });
  }

  const name = (pid: string) => ws.patients.find((p) => p.id === pid)?.name ?? "?";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-400">Encaissé ce mois</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{stats.monthTotal} DT</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total encaissé</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{stats.total} DT</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-400">Impayés</p>
          <p className="mt-1 text-2xl font-bold text-accent-600">
            {stats.unpaid.reduce((s, c) => s + c.amount, 0)} DT
          </p>
        </div>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-bold text-slate-800">Répartition par mode de paiement</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {Object.entries(stats.byMethod).map(([m, v]) => (
            <span key={m} className="rounded-full bg-slate-100 px-4 py-1.5">
              {METHOD_LABEL[m as PaymentMethod] ?? m} : <span className="font-semibold">{v} DT</span>
            </span>
          ))}
          {Object.keys(stats.byMethod).length === 0 && <span className="text-slate-400">Aucun encaissement.</span>}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-bold text-slate-800">Impayés à encaisser</h2>
        {stats.unpaid.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">Aucun impayé 🎉</p>
        ) : (
          <div className="mt-3 space-y-2">
            {stats.unpaid.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-red-50/60 p-3 text-sm">
                <span>
                  <span className="font-semibold">{name(c.patientId)}</span> — {c.date} · {c.motif} ·{" "}
                  <span className="font-semibold text-accent-600">{c.amount} DT</span>
                </span>
                <span className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => markPaid(c.id, "especes")}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Encaissé espèces
                  </button>
                  <button
                    type="button"
                    onClick={() => markPaid(c.id, "carte")}
                    className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-200"
                  >
                    Carte
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------------- Messagerie ---------------- */

function MessagesTab({ ws, update }: { ws: ProWorkspace; update: (w: ProWorkspace) => void }) {
  const [openId, setOpenId] = useState(ws.threads[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const thread = ws.threads.find((th) => th.id === openId);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!thread || !draft.trim()) return;
    const at = new Date().toISOString().slice(0, 16).replace("T", " ");
    update({
      ...ws,
      threads: ws.threads.map((th) =>
        th.id === thread.id
          ? { ...th, messages: [...th.messages, { from: "medecin", text: draft.trim(), at }] }
          : th
      ),
    });
    setDraft("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-bold text-slate-800">Conversations</h2>
        <p className="mt-1 text-xs text-slate-400">
          Messagerie non urgente. Chiffrement de bout en bout prévu en production.
        </p>
        <div className="mt-3 space-y-1">
          {ws.threads.map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => setOpenId(th.id)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                openId === th.id ? "bg-primary-50 font-semibold text-primary-700" : "hover:bg-slate-50"
              }`}
            >
              {th.patientName}
              <span className="block truncate text-xs font-normal text-slate-400">
                {th.messages[th.messages.length - 1]?.text}
              </span>
            </button>
          ))}
        </div>
      </section>
      <section className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
        {!thread ? (
          <p className="text-sm text-slate-400">Sélectionnez une conversation.</p>
        ) : (
          <>
            <h2 className="font-bold text-slate-800">{thread.patientName}</h2>
            <div className="mt-3 flex-1 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-4">
              {thread.messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    m.from === "medecin"
                      ? "ml-auto bg-primary-600 text-white"
                      : "bg-white text-slate-700 ring-1 ring-slate-200"
                  }`}
                >
                  {m.text}
                  <span className={`mt-1 block text-[10px] ${m.from === "medecin" ? "text-primary-100" : "text-slate-400"}`}>
                    {m.at}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={send} className="mt-3 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Répondre…"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
              />
              <button className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
                Envoyer
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

/* ---------------- Statistiques ---------------- */

function StatsTab({ ws, bookings }: { ws: ProWorkspace; bookings: Appointment[] }) {
  const byMonth = new Map<string, { count: number; revenue: number }>();
  for (const c of ws.consultations) {
    const m = c.date.slice(0, 7);
    const cur = byMonth.get(m) ?? { count: 0, revenue: 0 };
    cur.count += 1;
    if (c.paid) cur.revenue += c.amount;
    byMonth.set(m, cur);
  }
  const months = [...byMonth.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
  const maxRevenue = Math.max(1, ...months.map(([, v]) => v.revenue));

  const motifs = new Map<string, number>();
  for (const c of ws.consultations) motifs.set(c.motif, (motifs.get(c.motif) ?? 0) + 1);
  const topMotifs = [...motifs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const origins = new Map<string, number>();
  for (const p of ws.patients) origins.set(p.origin, (origins.get(p.origin) ?? 0) + 1);

  const teleShare = ws.consultations.length
    ? Math.round((ws.consultations.filter((c) => c.kind === "teleconsultation").length / ws.consultations.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Patients", value: ws.patients.length },
          { label: "Consultations", value: ws.consultations.length },
          { label: "RDV en ligne", value: bookings.length },
          { label: "Part téléconsultation", value: `${teleShare} %` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-bold text-slate-800">Chiffre d&apos;affaires encaissé (6 derniers mois)</h2>
        <div className="mt-4 flex items-end gap-3" style={{ height: 140 }}>
          {months.length === 0 && <p className="text-sm text-slate-400">Pas encore de données.</p>}
          {months.map(([m, v]) => (
            <div key={m} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-semibold text-slate-600">{v.revenue} DT</span>
              <div
                className="w-full rounded-t-lg bg-primary-500"
                style={{ height: `${Math.max(6, (v.revenue / maxRevenue) * 100)}px` }}
                title={`${v.count} consultations`}
              />
              <span className="text-[10px] text-slate-400" dir="ltr">{m}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="font-bold text-slate-800">Motifs les plus fréquents</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {topMotifs.map(([m, n]) => (
              <li key={m} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-slate-700">{m}</span>
                <span className="font-semibold text-slate-500">{n}</span>
              </li>
            ))}
            {topMotifs.length === 0 && <li className="text-slate-400">—</li>}
          </ul>
        </section>
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="font-bold text-slate-800">Origine des patients</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[...origins.entries()].map(([o, n]) => (
              <li key={o} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-slate-700">{o}</span>
                <span className="font-semibold text-slate-500">{n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">
            Les patients internationaux (Libye…) sont suivis pour votre reporting clinique et fiscal.
          </p>
        </section>
      </div>
    </div>
  );
}

/* ---------------- File d'attente ---------------- */

function QueueTab() {
  const [queue, setQueue] = useState<QueueState | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    setQueue(loadQueue());
  }, []);

  if (!queue) return <p className="text-slate-400">Chargement…</p>;

  function update(next: QueueState) {
    setQueue(next);
    saveQueue(next);
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !queue) return;
    update({
      ...queue,
      nextTicket: queue.nextTicket + 1,
      entries: [...queue.entries, { ticket: queue.nextTicket, name: name.trim(), status: "waiting" }],
    });
    setName("");
  }

  function call(ticket: number) {
    if (!queue) return;
    update({
      ...queue,
      entries: queue.entries.map((e) =>
        e.ticket === ticket
          ? { ...e, status: "current" as const }
          : e.status === "current"
            ? { ...e, status: "done" as const }
            : e
      ),
    });
  }

  function finish(ticket: number) {
    if (!queue) return;
    update({ ...queue, entries: queue.entries.map((e) => (e.ticket === ticket ? { ...e, status: "done" as const } : e)) });
  }

  function remove(ticket: number) {
    if (!queue) return;
    update({ ...queue, entries: queue.entries.filter((e) => e.ticket !== ticket) });
  }

  const active = queue.entries.filter((e) => e.status !== "done").sort((a, b) => a.ticket - b.ticket);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">File d&apos;attente du jour</h2>
          <p className="text-sm text-slate-500">
            Les patients suivent leur position en temps réel sur la page publique « File d&apos;attente » (/attente).
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Durée moyenne :
          <input
            type="number"
            min={5}
            value={queue.avgMinutes}
            onChange={(e) => update({ ...queue, avgMinutes: Number(e.target.value) || 20 })}
            className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
          />
          min
        </label>
      </div>

      <form onSubmit={add} className="mt-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du patient (ex. Ali B.)"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
        />
        <button className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
          + Ticket n°{queue.nextTicket}
        </button>
      </form>

      <div className="mt-4 space-y-2">
        {active.length === 0 && <p className="text-sm text-slate-400">File vide.</p>}
        {active.map((e) => (
          <div
            key={e.ticket}
            className={`flex flex-wrap items-center justify-between gap-2 rounded-xl p-3 text-sm ${
              e.status === "current" ? "bg-emerald-50 ring-1 ring-emerald-200" : "bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold ring-1 ring-slate-200">
                {e.ticket}
              </span>
              <span className="font-medium">{e.name}</span>
              {e.status === "current" && (
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                  En consultation
                </span>
              )}
            </span>
            <span className="flex gap-2">
              {e.status === "waiting" && (
                <button
                  type="button"
                  onClick={() => call(e.ticket)}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Appeler
                </button>
              )}
              {e.status === "current" && (
                <button
                  type="button"
                  onClick={() => finish(e.ticket)}
                  className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-600"
                >
                  Terminer
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(e.ticket)}
                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-accent-600 hover:bg-red-100"
              >
                Retirer
              </button>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Questions publiques (Q&A) ---------------- */

const DEMO_DOCTOR_SLUG = "dr-amine-ben-salah-cardiologie-tunis";

function QnaTab() {
  const [questions, setQuestions] = useState<QnaQuestion[] | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [onlyMine, setOnlyMine] = useState(true);

  useEffect(() => {
    setQuestions(allQuestions());
  }, []);

  function reply(q: QnaQuestion) {
    const text = (drafts[q.id] ?? "").trim();
    if (!text) return;
    answerQuestion(q.id, DEMO_DOCTOR_SLUG, text);
    setDrafts((d) => ({ ...d, [q.id]: "" }));
    setQuestions(allQuestions());
  }

  const label = (id: string) => SPECIALTIES.find((s) => s.id === id)?.label ?? id;
  const list = (questions ?? []).filter((q) => !onlyMine || q.specialtyId === "cardiologie");

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Questions publiques des patients</h2>
          <p className="text-sm text-slate-500">
            Répondez avec votre profil vérifié : chaque réponse est publique, notée « utile » par les
            lecteurs, et affiche un bouton de prise de RDV vers votre agenda — un levier de visibilité.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
            className="h-4 w-4 accent-primary-600"
          />
          Ma spécialité uniquement
        </label>
      </div>

      <div className="mt-4 space-y-4">
        {questions === null && <p className="text-slate-400">Chargement…</p>}
        {list.map((q) => {
          const alreadyAnswered = q.answers.some((a) => a.doctorSlug === DEMO_DOCTOR_SLUG);
          return (
            <div key={q.id} className="rounded-xl bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="rounded-full bg-primary-50 px-2 py-0.5 font-medium text-primary-700">
                  {label(q.specialtyId)}
                </span>
                <span dir="ltr">{q.date}</span>
                <span>
                  {q.answers.length === 0 ? "🔴 Sans réponse" : `${q.answers.length} réponse(s)`}
                </span>
              </div>
              <p className="mt-1 font-semibold text-slate-800">{q.title}</p>
              <p className="mt-1 text-sm text-slate-600">{q.body}</p>
              {alreadyAnswered ? (
                <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  ✓ Vous avez répondu à cette question
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={drafts[q.id] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [q.id]: e.target.value }))}
                    placeholder="Votre réponse publique (générale, sans diagnostic individuel ni ordonnance)…"
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
                  />
                  <button
                    type="button"
                    onClick={() => reply(q)}
                    className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
                  >
                    Publier la réponse (Dr Ben Salah)
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {questions !== null && list.length === 0 && (
          <p className="text-sm text-slate-400">Aucune question dans votre spécialité pour l&apos;instant.</p>
        )}
      </div>
      <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
        ⚖️ Cadre déontologique : réponses d&apos;information générale uniquement — pas de diagnostic
        individuel ni de prescription en ligne. En production, chaque réponse passe par la modération.
      </p>
    </section>
  );
}

/* ---------------- Dossier partagé par le patient ---------------- */

function SharedRecordTab() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<MedicalRecord | null | undefined>(undefined);

  function open(e: React.FormEvent) {
    e.preventDefault();
    setResult(accessRecordWithCode(code));
  }

  const row = (label: string, value: string) =>
    value ? (
      <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
        <span className="font-semibold text-slate-700">{label} : </span>
        <span className="text-slate-600">{value}</span>
      </div>
    ) : null;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-bold text-slate-800">Consulter un dossier partagé par le patient</h2>
      <p className="mt-1 text-sm text-slate-500">
        Le patient remplit son dossier sur Seha (<span className="font-medium">Mon dossier médical</span>) et
        vous remet son code d&apos;accès à 6 caractères. Sans code — ou si le patient coupe le partage — le
        dossier est inaccessible. <span className="text-slate-400">(Démo : patient et praticien sur le même appareil.)</span>
      </p>
      <form onSubmit={open} className="mt-4 flex flex-wrap gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Code d'accès (ex. A3K7ZP)"
          maxLength={6}
          className="rounded-xl border border-slate-200 px-4 py-2.5 font-mono text-sm uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary-400"
          dir="ltr"
        />
        <button className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
          Ouvrir le dossier
        </button>
      </form>

      {result === null && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-accent-600">
          Code invalide ou partage désactivé par le patient.
        </p>
      )}

      {result && (
        <div className="mt-5 space-y-2">
          <p className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
            ✓ Accès autorisé par le patient — chaque consultation du dossier sera journalisée en production.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {row("Groupe sanguin", result.bloodType)}
            {row("Taille", result.heightCm && `${result.heightCm} cm`)}
            {row("Poids", result.weightKg && `${result.weightKg} kg`)}
          </div>
          {row("Allergies", result.allergies)}
          {row("Maladies chroniques", result.chronic)}
          {row("Traitements en cours", result.medications)}
          {row("Antécédents chirurgicaux", result.surgeries)}
          {row("Antécédents familiaux", result.familyHistory)}

          <h3 className="pt-2 font-semibold text-slate-700">Documents ({result.documents.length})</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.documents.map((d) => (
              <a
                key={d.id}
                href={d.dataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:ring-1 hover:ring-primary-300"
              >
                {d.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.dataUrl} alt={d.name} className="h-12 w-12 rounded-lg object-cover" />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-xl">📄</span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-700">{d.name}</span>
                  <span className="text-xs text-slate-400">{d.category} · {d.addedAt}</span>
                </span>
              </a>
            ))}
            {result.documents.length === 0 && <p className="text-sm text-slate-400">Aucun document.</p>}
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------- Suivis ---------------- */

function SuivisTab({ ws, update }: { ws: ProWorkspace; update: (w: ProWorkspace) => void }) {
  const [form, setForm] = useState({ patientId: ws.patients[0]?.id ?? "", dueDate: "", note: "" });
  const name = (pid: string) => ws.patients.find((p) => p.id === pid)?.name ?? "?";

  function toggle(id: string) {
    update({ ...ws, followUps: ws.followUps.map((f) => (f.id === id ? { ...f, done: !f.done } : f)) });
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.dueDate || !form.note.trim()) return;
    update({
      ...ws,
      followUps: [
        ...ws.followUps,
        { id: uid("f"), patientId: form.patientId, dueDate: form.dueDate, note: form.note.trim(), done: false },
      ],
    });
    setForm({ ...form, dueDate: "", note: "" });
  }

  const sorted = [...ws.followUps].sort((a, b) => Number(a.done) - Number(b.done) || a.dueDate.localeCompare(b.dueDate));

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="font-bold text-slate-800">Suivis et relances patients</h2>
      <p className="mt-1 text-sm text-slate-500">
        Renouvellements d&apos;ordonnance, résultats d&apos;analyses, contrôles post-opératoires…
      </p>
      <div className="mt-4 space-y-2">
        {sorted.map((f) => (
          <label
            key={f.id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 text-sm ring-1 ${
              f.done ? "bg-slate-50 text-slate-400 ring-slate-100 line-through" : "bg-white ring-slate-200"
            }`}
          >
            <input type="checkbox" checked={f.done} onChange={() => toggle(f.id)} className="h-4 w-4 accent-primary-600" />
            <span className="font-medium">{f.dueDate}</span>
            <span className="font-semibold">{name(f.patientId)}</span>
            <span className="flex-1">{f.note}</span>
          </label>
        ))}
      </div>
      <form onSubmit={add} className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <select
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          {ws.patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Note de suivi"
          className="min-w-48 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400"
        />
        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          + Ajouter
        </button>
      </form>
    </section>
  );
}
