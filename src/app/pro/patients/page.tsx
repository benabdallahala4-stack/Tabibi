"use client";

// Gestion des patients — module complet du portail médecin Seha Pro.
// Vue maître/détail : liste recherchable à gauche, dossier médical complet à
// droite (aperçu, timeline des consultations, constantes, documents, rappels,
// messagerie). Le praticien peut créer un patient, ajouter une consultation,
// des constantes, un rappel ou un document. Persistance localStorage (démo).

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useRoleGate } from "@/components/RoleGuard";
import {
  loadWorkspace,
  saveWorkspace,
  uid,
  ageFromBirthYear,
  type ProWorkspace,
  type ProPatient,
  type ConsultationRecord,
  type VitalsRecord,
  type MedicalDocument,
  type FollowUp,
  type PaymentMethod,
} from "@/lib/pro";

const CARD = "rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700";
const INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-primary-500/20";
const LABEL = "mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400";
const BTN_PRIMARY = "rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700";
const BTN_GHOST =
  "rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700";

const METHOD_LABEL: Record<PaymentMethod, string> = { especes: "Espèces", carte: "Carte", cnam: "CNAM", impaye: "Impayé" };
const DOC_ICON: Record<MedicalDocument["kind"], string> = {
  analyse: "🧪",
  imagerie: "🩻",
  ordonnance: "💊",
  certificat: "📄",
  courrier: "✉️",
  autre: "📎",
};

type Tab = "apercu" | "constantes" | "documents" | "rappels" | "messagerie";
type ModalKind = "patient" | "consultation" | "vitals" | "followup" | "document" | null;

export default function PatientsPage() {
  const gate = useRoleGate(["medecin", "admin"]);
  const [ws, setWs] = useState<ProWorkspace | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "chronic" | "unpaid" | "international">("all");
  const [tab, setTab] = useState<Tab>("apercu");
  const [modal, setModal] = useState<ModalKind>(null);

  useEffect(() => {
    const loaded = loadWorkspace();
    setWs(loaded);
    setSelectedId(loaded.patients[0]?.id ?? null);
  }, []);

  const persist = (next: ProWorkspace) => {
    setWs(next);
    saveWorkspace(next);
  };

  const filtered = useMemo(() => {
    if (!ws) return [];
    const q = search.trim().toLowerCase();
    return ws.patients.filter((p) => {
      if (q && !`${p.name} ${p.phone} ${p.cnamId ?? ""}`.toLowerCase().includes(q)) return false;
      if (filter === "chronic") return p.chronic && p.chronic !== "—";
      if (filter === "international") return p.origin !== "Tunisie";
      if (filter === "unpaid") return ws.consultations.some((c) => c.patientId === p.id && (c.method === "impaye" || !c.paid));
      return true;
    });
  }, [ws, search, filter]);

  const selected = ws?.patients.find((p) => p.id === selectedId) ?? null;

  if (gate) return gate;

  return (
    <AppShell>
      {!ws ? (
        <p className="text-slate-400">Chargement…</p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Patients</h1>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {ws.patients.length} dossier{ws.patients.length > 1 ? "s" : ""} · file patientèle du cabinet
              </p>
            </div>
            <button type="button" className={BTN_PRIMARY} onClick={() => setModal("patient")}>
              + Nouveau patient
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Colonne liste */}
            <div className="space-y-3">
              <div className="relative">
                <svg className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher (nom, téléphone, CNAM)…"
                  className={`${INPUT} ps-9`}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {([
                  ["all", "Tous"],
                  ["chronic", "Chroniques"],
                  ["unpaid", "Impayés"],
                  ["international", "International"],
                ] as const).map(([k, lbl]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFilter(k)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      filter === k
                        ? "bg-primary-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {filtered.length === 0 && (
                  <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-400 dark:bg-slate-800/60">Aucun patient.</p>
                )}
                {filtered.map((p) => {
                  const age = ageFromBirthYear(p.birthYear);
                  const unpaid = ws.consultations.some((c) => c.patientId === p.id && (c.method === "impaye" || !c.paid));
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setSelectedId(p.id); setTab("apercu"); }}
                      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ring-1 ${
                        selectedId === p.id
                          ? "bg-primary-50 ring-primary-300 dark:bg-primary-500/10 dark:ring-primary-500/40"
                          : "bg-white ring-slate-200 hover:bg-slate-50 dark:bg-slate-800/60 dark:ring-slate-700 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Avatar name={p.name} gender={p.gender} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{p.name}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {age !== null ? `${age} ans` : "—"} · <span dir="ltr">{p.phone}</span>
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {p.origin !== "Tunisie" && <span className="text-[10px]">🌍</span>}
                        {unpaid && <span className="h-2 w-2 rounded-full bg-amber-500" title="Impayé" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colonne dossier */}
            {selected ? (
              <PatientDossier
                key={selected.id}
                ws={ws}
                patient={selected}
                tab={tab}
                setTab={setTab}
                openModal={setModal}
                persist={persist}
              />
            ) : (
              <div className={`${CARD} flex min-h-[300px] items-center justify-center text-slate-400`}>
                Sélectionnez un patient
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modales */}
      {ws && modal === "patient" && (
        <NewPatientModal
          onClose={() => setModal(null)}
          onSave={(p) => {
            persist({ ...ws, patients: [p, ...ws.patients] });
            setSelectedId(p.id);
            setModal(null);
          }}
        />
      )}
      {ws && selected && modal === "consultation" && (
        <NewConsultationModal
          patient={selected}
          onClose={() => setModal(null)}
          onSave={(c) => {
            persist({ ...ws, consultations: [c, ...ws.consultations] });
            setModal(null);
          }}
        />
      )}
      {ws && selected && modal === "vitals" && (
        <NewVitalsModal
          patient={selected}
          onClose={() => setModal(null)}
          onSave={(v) => {
            persist({ ...ws, vitals: [v, ...ws.vitals] });
            setTab("constantes");
            setModal(null);
          }}
        />
      )}
      {ws && selected && modal === "followup" && (
        <NewFollowUpModal
          patient={selected}
          onClose={() => setModal(null)}
          onSave={(f) => {
            persist({ ...ws, followUps: [...ws.followUps, f] });
            setTab("rappels");
            setModal(null);
          }}
        />
      )}
      {ws && selected && modal === "document" && (
        <NewDocumentModal
          patient={selected}
          onClose={() => setModal(null)}
          onSave={(d) => {
            persist({ ...ws, documents: [d, ...ws.documents] });
            setTab("documents");
            setModal(null);
          }}
        />
      )}
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// Dossier patient
// ---------------------------------------------------------------------------

function PatientDossier({
  ws,
  patient,
  tab,
  setTab,
  openModal,
  persist,
}: {
  ws: ProWorkspace;
  patient: ProPatient;
  tab: Tab;
  setTab: (t: Tab) => void;
  openModal: (m: ModalKind) => void;
  persist: (ws: ProWorkspace) => void;
}) {
  const age = ageFromBirthYear(patient.birthYear);
  const consultations = ws.consultations
    .filter((c) => c.patientId === patient.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const vitals = ws.vitals.filter((v) => v.patientId === patient.id).sort((a, b) => b.date.localeCompare(a.date));
  const docs = ws.documents.filter((d) => d.patientId === patient.id).sort((a, b) => b.date.localeCompare(a.date));
  const followUps = ws.followUps.filter((f) => f.patientId === patient.id);
  const thread = ws.threads.find((t) => t.patientName === patient.name);

  const balance = consultations.filter((c) => c.method === "impaye" || !c.paid).reduce((s, c) => s + c.amount, 0);
  const lastVisit = consultations[0]?.date ?? null;
  const nextFollowUp = followUps.filter((f) => !f.done).sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0] ?? null;

  const toggleFollowUp = (id: string) => {
    persist({ ...ws, followUps: ws.followUps.map((f) => (f.id === id ? { ...f, done: !f.done } : f)) });
  };

  const TABS: [Tab, string, number | null][] = [
    ["apercu", "Aperçu", null],
    ["constantes", "Constantes", vitals.length || null],
    ["documents", "Documents", docs.length || null],
    ["rappels", "Rappels", followUps.filter((f) => !f.done).length || null],
    ["messagerie", "Messagerie", thread?.messages.length || null],
  ];

  return (
    <div className="space-y-4">
      {/* En-tête dossier */}
      <div className={CARD}>
        <div className="flex flex-wrap items-start gap-4">
          <Avatar name={patient.name} gender={patient.gender} large />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{patient.name}</h2>
              {patient.origin !== "Tunisie" && (
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                  🌍 {patient.origin}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {age !== null ? `${age} ans` : "âge inconnu"}
              {patient.gender ? ` · ${patient.gender === "H" ? "Homme" : "Femme"}` : ""}
              {patient.bloodGroup ? ` · Groupe ${patient.bloodGroup}` : ""}
              {patient.insurer ? ` · ${patient.insurer}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <a href={`tel:${patient.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-200" dir="ltr">
                📞 {patient.phone}
              </a>
              {patient.email && (
                <a href={`mailto:${patient.email}`} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-200">
                  ✉️ {patient.email}
                </a>
              )}
              {patient.city && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-700/60 dark:text-slate-200">
                  📍 {patient.city}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Alertes cliniques */}
        {(patient.allergies && patient.allergies !== "—") || (patient.chronic && patient.chronic !== "—") ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {patient.allergies && patient.allergies !== "—" && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30">
                ⚠️ Allergie : {patient.allergies}
              </span>
            )}
            {patient.chronic && patient.chronic !== "—" && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30">
                🫀 Chronique : {patient.chronic}
              </span>
            )}
          </div>
        ) : null}

        {/* Actions rapides */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className={BTN_PRIMARY} onClick={() => openModal("consultation")}>+ Consultation</button>
          <button type="button" className={BTN_GHOST} onClick={() => openModal("vitals")}>+ Constantes</button>
          <button type="button" className={BTN_GHOST} onClick={() => openModal("followup")}>+ Rappel</button>
          <button type="button" className={BTN_GHOST} onClick={() => openModal("document")}>+ Document</button>
          <Link href="/pro/agenda" className={BTN_GHOST}>Nouveau RDV</Link>
          <Link href="/pro/ordonnances" className={BTN_GHOST}>Ordonnance</Link>
        </div>
      </div>

      {/* Mini-KPI patient */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat label="Consultations" value={String(consultations.length)} />
        <MiniStat label="Dernière visite" value={lastVisit ? frDate(lastVisit) : "—"} />
        <MiniStat label="Solde" value={balance > 0 ? `${balance} DT` : "À jour"} tone={balance > 0 ? "amber" : "emerald"} />
        <MiniStat label="Prochain rappel" value={nextFollowUp ? frDate(nextFollowUp.dueDate) : "—"} tone={nextFollowUp ? "sky" : "slate"} />
      </div>

      {/* Onglets */}
      <div className={CARD}>
        <div className="-mx-1 mb-4 flex gap-1 overflow-x-auto border-b border-slate-100 pb-2 dark:border-slate-700">
          {TABS.map(([id, label, count]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                tab === id
                  ? "bg-primary-600 text-white"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/60"
              }`}
            >
              {label}
              {count ? <span className={`ms-1.5 rounded-full px-1.5 text-[10px] ${tab === id ? "bg-white/25" : "bg-slate-200 dark:bg-slate-600"}`}>{count}</span> : null}
            </button>
          ))}
        </div>

        {tab === "apercu" && <ApercuTab patient={patient} consultations={consultations} />}
        {tab === "constantes" && <ConstantesTab vitals={vitals} onAdd={() => openModal("vitals")} />}
        {tab === "documents" && <DocumentsTab docs={docs} onAdd={() => openModal("document")} />}
        {tab === "rappels" && <RappelsTab followUps={followUps} onToggle={toggleFollowUp} onAdd={() => openModal("followup")} />}
        {tab === "messagerie" && <MessagerieTab thread={thread} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Onglets
// ---------------------------------------------------------------------------

function ApercuTab({ patient, consultations }: { patient: ProPatient; consultations: ConsultationRecord[] }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoBlock title="Antécédents">{patient.antecedents || "Aucun antécédent renseigné."}</InfoBlock>
        <InfoBlock title="Traitements en cours">{patient.treatments || "—"}</InfoBlock>
      </div>
      {patient.notes && <InfoBlock title="Note du praticien">{patient.notes}</InfoBlock>}

      <div>
        <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">Historique des consultations</h3>
        {consultations.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400 dark:bg-slate-900/50">Aucune consultation enregistrée.</p>
        ) : (
          <ol className="relative space-y-4 border-s-2 border-slate-100 ps-5 dark:border-slate-700">
            {consultations.map((c) => (
              <li key={c.id} className="relative">
                <span className={`absolute -start-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-white dark:ring-slate-800 ${c.kind === "teleconsultation" ? "bg-indigo-500" : "bg-primary-500"}`} />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{c.motif}</p>
                  <span className="text-xs text-slate-400">{frDate(c.date)}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Chip tone={c.kind === "teleconsultation" ? "indigo" : "sky"}>{c.kind === "teleconsultation" ? "Téléconsultation" : "Cabinet"}</Chip>
                  <Chip tone={c.method === "impaye" || !c.paid ? "amber" : "emerald"}>{c.amount} DT · {METHOD_LABEL[c.method]}</Chip>
                  {c.certificate && <Chip tone="violet">Certificat {c.certificate.type} · {c.certificate.days}j</Chip>}
                </div>
                {c.notes && <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{c.notes}</p>}
                {c.prescription && (
                  <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-900/50 dark:text-slate-300">
                    💊 {c.prescription}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function ConstantesTab({ vitals, onAdd }: { vitals: VitalsRecord[]; onAdd: () => void }) {
  const latest = vitals[0];
  const bmi =
    latest?.weightKg && latest?.heightCm ? (latest.weightKg / (latest.heightCm / 100) ** 2).toFixed(1) : null;
  return (
    <div className="space-y-4">
      {latest && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {latest.systolic && latest.diastolic && <VitalCard label="Tension" value={`${latest.systolic}/${latest.diastolic}`} unit="mmHg" />}
          {latest.heartRate && <VitalCard label="Pouls" value={String(latest.heartRate)} unit="bpm" />}
          {latest.weightKg && <VitalCard label="Poids" value={String(latest.weightKg)} unit="kg" />}
          {bmi && <VitalCard label="IMC" value={bmi} unit="kg/m²" />}
          {latest.glycemia && <VitalCard label="Glycémie" value={String(latest.glycemia)} unit="g/L" />}
          {latest.tempC && <VitalCard label="Température" value={String(latest.tempC)} unit="°C" />}
          {latest.spo2 && <VitalCard label="SpO₂" value={String(latest.spo2)} unit="%" />}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Mesures</h3>
        <button type="button" className="text-sm font-semibold text-primary-600 hover:underline" onClick={onAdd}>+ Ajouter</button>
      </div>
      {vitals.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400 dark:bg-slate-900/50">Aucune mesure enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2">Date</th><th className="pb-2">TA</th><th className="pb-2">Pouls</th><th className="pb-2">Poids</th><th className="pb-2">Glycémie</th><th className="pb-2">Temp.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/70">
              {vitals.map((v) => (
                <tr key={v.id} className="text-slate-600 dark:text-slate-200">
                  <td className="py-2.5 font-medium text-slate-800 dark:text-white">{frDate(v.date)}</td>
                  <td className="py-2.5">{v.systolic && v.diastolic ? `${v.systolic}/${v.diastolic}` : "—"}</td>
                  <td className="py-2.5">{v.heartRate ?? "—"}</td>
                  <td className="py-2.5">{v.weightKg ? `${v.weightKg} kg` : "—"}</td>
                  <td className="py-2.5">{v.glycemia ? `${v.glycemia} g/L` : "—"}</td>
                  <td className="py-2.5">{v.tempC ? `${v.tempC}°C` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DocumentsTab({ docs, onAdd }: { docs: MedicalDocument[]; onAdd: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Documents & analyses</h3>
        <button type="button" className="text-sm font-semibold text-primary-600 hover:underline" onClick={onAdd}>+ Ajouter</button>
      </div>
      {docs.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400 dark:bg-slate-900/50">Aucun document.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
              <span className="text-xl">{DOC_ICON[d.kind]}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{d.title}</p>
                <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{d.kind} · {frDate(d.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-400">L&apos;upload de fichiers (PDF, imagerie) sera activé avec le stockage cloud.</p>
    </div>
  );
}

function RappelsTab({ followUps, onToggle, onAdd }: { followUps: FollowUp[]; onToggle: (id: string) => void; onAdd: () => void }) {
  const sorted = [...followUps].sort((a, b) => Number(a.done) - Number(b.done) || a.dueDate.localeCompare(b.dueDate));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Rappels & suivis</h3>
        <button type="button" className="text-sm font-semibold text-primary-600 hover:underline" onClick={onAdd}>+ Ajouter</button>
      </div>
      {sorted.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400 dark:bg-slate-900/50">Aucun rappel.</p>
      ) : (
        sorted.map((f) => (
          <label key={f.id} className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 ring-1 ${f.done ? "bg-slate-50 ring-slate-100 dark:bg-slate-900/40 dark:ring-slate-700/60" : "bg-white ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700"}`}>
            <input type="checkbox" checked={f.done} onChange={() => onToggle(f.id)} className="mt-0.5 h-4 w-4 rounded accent-primary-600" />
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium ${f.done ? "text-slate-400 line-through" : "text-slate-800 dark:text-white"}`}>{f.note}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Échéance : {frDate(f.dueDate)}</p>
            </div>
          </label>
        ))
      )}
    </div>
  );
}

function MessagerieTab({ thread }: { thread?: ProWorkspace["threads"][number] }) {
  if (!thread || thread.messages.length === 0) {
    return <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400 dark:bg-slate-900/50">Aucun message avec ce patient.</p>;
  }
  return (
    <div className="space-y-3">
      {thread.messages.map((m, i) => (
        <div key={i} className={`flex ${m.from === "medecin" ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${m.from === "medecin" ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100"}`}>
            <p>{m.text}</p>
            <p className={`mt-1 text-[10px] ${m.from === "medecin" ? "text-white/70" : "text-slate-400"}`}>{m.at}</p>
          </div>
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <input placeholder="Écrire un message…" className={INPUT} disabled />
        <button type="button" className={BTN_GHOST} disabled>Envoyer</button>
      </div>
      <p className="text-xs text-slate-400">La messagerie temps réel sera activée avec le backend.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modales
// ---------------------------------------------------------------------------

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl dark:bg-slate-800 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Fermer">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function NewPatientModal({ onClose, onSave }: { onClose: () => void; onSave: (p: ProPatient) => void }) {
  const [f, setF] = useState({ name: "", phone: "", birthYear: "", gender: "H", origin: "Tunisie", email: "", city: "", bloodGroup: "", insurer: "CNAM", cnamId: "", allergies: "", chronic: "", antecedents: "" });
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const submit = () => {
    if (!f.name.trim() || !f.phone.trim()) return;
    onSave({
      id: uid("p"),
      name: f.name.trim(),
      phone: f.phone.trim(),
      birthYear: f.birthYear.trim(),
      origin: f.origin as ProPatient["origin"],
      allergies: f.allergies.trim() || "—",
      chronic: f.chronic.trim() || "—",
      gender: f.gender as ProPatient["gender"],
      email: f.email.trim() || undefined,
      city: f.city.trim() || undefined,
      bloodGroup: f.bloodGroup.trim() || undefined,
      insurer: f.insurer,
      cnamId: f.cnamId.trim() || undefined,
      antecedents: f.antecedents.trim() || undefined,
      createdAt: "2026-07-07",
    });
  };
  return (
    <Modal title="Nouveau patient" onClose={onClose}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nom complet *"><input className={INPUT} value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Téléphone *"><input className={INPUT} dir="ltr" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label="Année de naissance"><input className={INPUT} inputMode="numeric" placeholder="1985" value={f.birthYear} onChange={(e) => set("birthYear", e.target.value)} /></Field>
        <Field label="Sexe">
          <select className={INPUT} value={f.gender} onChange={(e) => set("gender", e.target.value)}>
            <option value="H">Homme</option><option value="F">Femme</option>
          </select>
        </Field>
        <Field label="Origine">
          <select className={INPUT} value={f.origin} onChange={(e) => set("origin", e.target.value)}>
            <option>Tunisie</option><option>Libye</option><option>Algérie</option><option>Autre</option>
          </select>
        </Field>
        <Field label="Ville"><input className={INPUT} value={f.city} onChange={(e) => set("city", e.target.value)} /></Field>
        <Field label="Email"><input className={INPUT} value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="Groupe sanguin"><input className={INPUT} placeholder="O+" value={f.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} /></Field>
        <Field label="Couverture">
          <select className={INPUT} value={f.insurer} onChange={(e) => set("insurer", e.target.value)}>
            <option>CNAM</option><option>Assurance privée</option><option>Aucun (patient international)</option>
          </select>
        </Field>
        <Field label="Identifiant CNAM"><input className={INPUT} dir="ltr" value={f.cnamId} onChange={(e) => set("cnamId", e.target.value)} /></Field>
        <Field label="Allergies" full><input className={INPUT} value={f.allergies} onChange={(e) => set("allergies", e.target.value)} /></Field>
        <Field label="Maladies chroniques" full><input className={INPUT} value={f.chronic} onChange={(e) => set("chronic", e.target.value)} /></Field>
        <Field label="Antécédents" full><textarea className={INPUT} rows={2} value={f.antecedents} onChange={(e) => set("antecedents", e.target.value)} /></Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className={BTN_GHOST} onClick={onClose}>Annuler</button>
        <button type="button" className={BTN_PRIMARY} onClick={submit}>Créer le dossier</button>
      </div>
    </Modal>
  );
}

function NewConsultationModal({ patient, onClose, onSave }: { patient: ProPatient; onClose: () => void; onSave: (c: ConsultationRecord) => void }) {
  const [f, setF] = useState({ date: "2026-07-07", kind: "cabinet", motif: "", notes: "", prescription: "", amount: "60", method: "especes", paid: true, certType: "", certDays: "" });
  const set = (k: string, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));
  const submit = () => {
    if (!f.motif.trim()) return;
    onSave({
      id: uid("c"),
      patientId: patient.id,
      date: f.date,
      kind: f.kind as ConsultationRecord["kind"],
      motif: f.motif.trim(),
      notes: f.notes.trim(),
      prescription: f.prescription.trim(),
      certificate: f.certType.trim() ? { type: f.certType.trim(), days: parseInt(f.certDays, 10) || 0 } : null,
      amount: parseInt(f.amount, 10) || 0,
      method: f.method as PaymentMethod,
      paid: f.method !== "impaye" && f.paid,
    });
  };
  return (
    <Modal title={`Consultation — ${patient.name}`} onClose={onClose}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Date"><input type="date" className={INPUT} value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Type">
          <select className={INPUT} value={f.kind} onChange={(e) => set("kind", e.target.value)}>
            <option value="cabinet">Cabinet</option><option value="teleconsultation">Téléconsultation</option>
          </select>
        </Field>
        <Field label="Motif *" full><input className={INPUT} value={f.motif} onChange={(e) => set("motif", e.target.value)} /></Field>
        <Field label="Observations" full><textarea className={INPUT} rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
        <Field label="Ordonnance (trace)" full><textarea className={INPUT} rows={2} value={f.prescription} onChange={(e) => set("prescription", e.target.value)} /></Field>
        <Field label="Montant (DT)"><input className={INPUT} inputMode="numeric" value={f.amount} onChange={(e) => set("amount", e.target.value)} /></Field>
        <Field label="Paiement">
          <select className={INPUT} value={f.method} onChange={(e) => set("method", e.target.value)}>
            <option value="especes">Espèces</option><option value="carte">Carte</option><option value="cnam">CNAM</option><option value="impaye">Impayé</option>
          </select>
        </Field>
        <Field label="Certificat (type)"><input className={INPUT} placeholder="Repos…" value={f.certType} onChange={(e) => set("certType", e.target.value)} /></Field>
        <Field label="Certificat (jours)"><input className={INPUT} inputMode="numeric" value={f.certDays} onChange={(e) => set("certDays", e.target.value)} /></Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className={BTN_GHOST} onClick={onClose}>Annuler</button>
        <button type="button" className={BTN_PRIMARY} onClick={submit}>Enregistrer</button>
      </div>
    </Modal>
  );
}

function NewVitalsModal({ patient, onClose, onSave }: { patient: ProPatient; onClose: () => void; onSave: (v: VitalsRecord) => void }) {
  const [f, setF] = useState({ date: "2026-07-07", systolic: "", diastolic: "", heartRate: "", weightKg: "", heightCm: "", glycemia: "", tempC: "", spo2: "" });
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const num = (v: string) => (v.trim() ? Number(v) : undefined);
  const submit = () => {
    onSave({
      id: uid("v"),
      patientId: patient.id,
      date: f.date,
      systolic: num(f.systolic),
      diastolic: num(f.diastolic),
      heartRate: num(f.heartRate),
      weightKg: num(f.weightKg),
      heightCm: num(f.heightCm),
      glycemia: num(f.glycemia),
      tempC: num(f.tempC),
      spo2: num(f.spo2),
    });
  };
  return (
    <Modal title={`Constantes — ${patient.name}`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Date" full><input type="date" className={INPUT} value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="TA systolique"><input className={INPUT} inputMode="numeric" value={f.systolic} onChange={(e) => set("systolic", e.target.value)} /></Field>
        <Field label="TA diastolique"><input className={INPUT} inputMode="numeric" value={f.diastolic} onChange={(e) => set("diastolic", e.target.value)} /></Field>
        <Field label="Pouls (bpm)"><input className={INPUT} inputMode="numeric" value={f.heartRate} onChange={(e) => set("heartRate", e.target.value)} /></Field>
        <Field label="Poids (kg)"><input className={INPUT} inputMode="decimal" value={f.weightKg} onChange={(e) => set("weightKg", e.target.value)} /></Field>
        <Field label="Taille (cm)"><input className={INPUT} inputMode="numeric" value={f.heightCm} onChange={(e) => set("heightCm", e.target.value)} /></Field>
        <Field label="Glycémie (g/L)"><input className={INPUT} inputMode="decimal" value={f.glycemia} onChange={(e) => set("glycemia", e.target.value)} /></Field>
        <Field label="Température (°C)"><input className={INPUT} inputMode="decimal" value={f.tempC} onChange={(e) => set("tempC", e.target.value)} /></Field>
        <Field label="SpO₂ (%)"><input className={INPUT} inputMode="numeric" value={f.spo2} onChange={(e) => set("spo2", e.target.value)} /></Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className={BTN_GHOST} onClick={onClose}>Annuler</button>
        <button type="button" className={BTN_PRIMARY} onClick={submit}>Enregistrer</button>
      </div>
    </Modal>
  );
}

function NewFollowUpModal({ patient, onClose, onSave }: { patient: ProPatient; onClose: () => void; onSave: (f: FollowUp) => void }) {
  const [f, setF] = useState({ dueDate: "2026-08-07", note: "" });
  const submit = () => {
    if (!f.note.trim()) return;
    onSave({ id: uid("f"), patientId: patient.id, dueDate: f.dueDate, note: f.note.trim(), done: false });
  };
  return (
    <Modal title={`Rappel — ${patient.name}`} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Échéance"><input type="date" className={INPUT} value={f.dueDate} onChange={(e) => setF((s) => ({ ...s, dueDate: e.target.value }))} /></Field>
        <Field label="Objet"><textarea className={INPUT} rows={2} placeholder="Contrôle TA, résultats d'analyses…" value={f.note} onChange={(e) => setF((s) => ({ ...s, note: e.target.value }))} /></Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className={BTN_GHOST} onClick={onClose}>Annuler</button>
        <button type="button" className={BTN_PRIMARY} onClick={submit}>Ajouter</button>
      </div>
    </Modal>
  );
}

function NewDocumentModal({ patient, onClose, onSave }: { patient: ProPatient; onClose: () => void; onSave: (d: MedicalDocument) => void }) {
  const [f, setF] = useState({ date: "2026-07-07", title: "", kind: "analyse" });
  const submit = () => {
    if (!f.title.trim()) return;
    onSave({ id: uid("d"), patientId: patient.id, date: f.date, title: f.title.trim(), kind: f.kind as MedicalDocument["kind"] });
  };
  return (
    <Modal title={`Document — ${patient.name}`} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Intitulé"><input className={INPUT} placeholder="Bilan sanguin, IRM…" value={f.title} onChange={(e) => setF((s) => ({ ...s, title: e.target.value }))} /></Field>
        <Field label="Type">
          <select className={INPUT} value={f.kind} onChange={(e) => setF((s) => ({ ...s, kind: e.target.value }))}>
            <option value="analyse">Analyse</option><option value="imagerie">Imagerie</option><option value="ordonnance">Ordonnance</option><option value="certificat">Certificat</option><option value="courrier">Courrier</option><option value="autre">Autre</option>
          </select>
        </Field>
        <Field label="Date"><input type="date" className={INPUT} value={f.date} onChange={(e) => setF((s) => ({ ...s, date: e.target.value }))} /></Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className={BTN_GHOST} onClick={onClose}>Annuler</button>
        <button type="button" className={BTN_PRIMARY} onClick={submit}>Ajouter la référence</button>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Petits composants
// ---------------------------------------------------------------------------

function Avatar({ name, gender, large }: { name: string; gender?: "H" | "F"; large?: boolean }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const size = large ? "h-14 w-14 text-lg" : "h-10 w-10 text-sm";
  const tone = gender === "F" ? "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300" : "bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300";
  return <span className={`flex shrink-0 items-center justify-center rounded-full font-bold ${size} ${tone}`}>{initial}</span>;
}

function MiniStat({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "amber" | "emerald" | "sky" }) {
  const toneCls: Record<string, string> = {
    slate: "text-slate-800 dark:text-white",
    amber: "text-amber-600 dark:text-amber-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    sky: "text-sky-600 dark:text-sky-400",
  };
  return (
    <div className={CARD}>
      <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 text-lg font-bold ${toneCls[tone]}`}>{value}</p>
    </div>
  );
}

function VitalCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-900/50">
      <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-slate-800 dark:text-white">{value}</p>
      <p className="text-[10px] text-slate-400">{unit}</p>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <p className="text-sm text-slate-700 dark:text-slate-200">{children}</p>
    </div>
  );
}

function Chip({ children, tone }: { children: React.ReactNode; tone: "sky" | "indigo" | "emerald" | "amber" | "violet" }) {
  const cls: Record<string, string> = {
    sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls[tone]}`}>{children}</span>;
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={full ? "sm:col-span-2" : ""}>
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}

const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
function frDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
