"use client";

// Espace praticien Seha Pro — application médecin. Thème clair par défaut,
// bascule sombre disponible (voir AppShell). Reprend la maquette : barre
// latérale, en-tête d'accueil, indicateurs, agenda du jour, file d'attente.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell, { type NavItem } from "@/components/AppShell";
import { useRoleGate } from "@/components/RoleGuard";
import { listAppointments } from "@/lib/appointments";
import { loadWorkspace, type ProWorkspace } from "@/lib/pro";
import { loadPlan, PLAN_LABELS, type Plan } from "@/lib/plan";

const DOCTOR = { name: "Dr Amine Ben Salah", specialty: "Cardiologue", city: "Tunis" };

const AGENDA = [
  { time: "08:30", name: "Salma Trabelsi", reason: "Contrôle · 30 min", tag: "Terminé", tone: "done" },
  { time: "09:00", name: "Karim Douiri", reason: "1re visite · ECG", tag: "Cabinet", tone: "cabinet" },
  { time: "09:45", name: "Nadia Ben Youssef", reason: "Suivi · téléconsultation", tag: "Visio", tone: "visio" },
  { time: "10:15", name: "Foued Mabrouk", reason: "Résultats d'analyses", tag: "À encaisser", tone: "pay" },
  { time: "11:00", name: "Leïla Gharbi", reason: "APCI · hypertension", tag: "CNAM 100%", tone: "cnam" },
];

const QUEUE = [
  { n: 1, name: "Mme Sassi", info: "arrivée 08:52", tag: "En consult.", tone: "current" },
  { n: 2, name: "M. Ayari", info: "arrivée 09:05", tag: "~10 min", tone: "wait" },
  { n: 3, name: "Mme Khaldi", info: "sans RDV", tag: "~25 min", tone: "wait" },
];

const TAG_TONE: Record<string, string> = {
  done: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  cabinet: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  visio: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  pay: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  cnam: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  current: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  wait: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

type View = "agenda" | "patients" | "caisse" | "file" | "teleconsultation" | "analytics";

const NAV: NavItem[] = [
  { id: "agenda", label: "Agenda", icon: "M4 5h16M4 5v14h16V5M8 3v4M16 3v4" },
  { id: "patients", label: "Patients", icon: "M16 14a4 4 0 10-8 0M12 10a3 3 0 100-6 3 3 0 000 6", href: "/pro/patients" },
  { id: "ordonnances", label: "Ordonnancier", icon: "M7 4h7l4 4v12H7zM14 4v4h4", href: "/pro/ordonnances" },
  { id: "caisse", label: "Caisse", icon: "M3 7h18v10H3zM3 11h18" },
  { id: "file", label: "File d'attente", icon: "M5 4h14M7 4v6l3 3-3 3v4M17 4v6l-3 3 3 3v4", badge: 3 },
  { id: "bulletin", label: "Bulletin CNAM", icon: "M6 3h9l3 3v15H6zM9 12h6M9 16h6", href: "/pro/bulletin" },
  { id: "teleconsultation", label: "Téléconsultation", icon: "M4 6h11v12H4zM15 10l5-3v10l-5-3", premium: true },
  { id: "analytics", label: "Analytics", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2", premium: true },
  { id: "compte", label: "Mon compte", icon: "M16 14a4 4 0 10-8 0M12 10a3 3 0 100-6 3 3 0 000 6", href: "/compte" },
];

const CARD = "rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700";

export default function ProDashboard() {
  const gate = useRoleGate(["medecin", "admin"]);
  const [view, setView] = useState<View>("agenda");
  const [ws, setWs] = useState<ProWorkspace | null>(null);
  const [plan, setPlan] = useState<Plan>("gratuit");
  const [bookings, setBookings] = useState(0);

  useEffect(() => {
    setPlan(loadPlan());
    setWs(loadWorkspace());
    setBookings(
      listAppointments().filter(
        (a) => a.doctorSlug === "dr-amine-ben-salah-cardiologie-tunis" && a.status === "confirme",
      ).length,
    );
  }, []);

  const kpis = useMemo(
    () => [
      { label: "RDV du jour", value: String(12 + bookings), unit: "", note: "▲ 2 vs hier", tone: "text-emerald-600 dark:text-emerald-400" },
      { label: "Encaissé", value: "480", unit: "DT", note: "▲ 60 DT", tone: "text-emerald-600 dark:text-emerald-400" },
      { label: "Impayés", value: "2", unit: "", note: "90 DT à relancer", tone: "text-amber-600 dark:text-amber-400" },
      { label: "File d'attente", value: "3", unit: "", note: "~25 min", tone: "text-sky-600 dark:text-sky-400" },
    ],
    [bookings],
  );

  if (gate) return gate;

  return (
    <AppShell nav={NAV} active={view} onSelect={(id) => setView(id as View)}>
      {!ws ? (
        <p className="text-slate-400">Chargement…</p>
      ) : view === "agenda" ? (
        <AgendaHome kpis={kpis} plan={plan} />
      ) : view === "patients" ? (
        <Patients ws={ws} />
      ) : view === "caisse" ? (
        <Caisse ws={ws} />
      ) : view === "file" ? (
        <FileAttente />
      ) : (
        <PremiumPanel view={view} />
      )}
    </AppShell>
  );
}

function AgendaHome({ kpis, plan }: { kpis: { label: string; value: string; unit: string; note: string; tone: string }[]; plan: Plan }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bonjour, Dr Ben Salah 👋</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Lundi 6 juillet · 12 RDV · 2 téléconsultations · Plan {PLAN_LABELS[plan] ?? "Gratuit"}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700">Semaine</button>
          <Link href="/pro/agenda" className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">+ Nouveau RDV</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className={CARD}>
            <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{k.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-800 dark:text-white">{k.value}{k.unit && <span className="ms-1 text-sm font-medium text-slate-400">{k.unit}</span>}</p>
            <p className={`mt-1 text-xs font-medium ${k.tone}`}>{k.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className={`${CARD} lg:col-span-2`}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800 dark:text-white">Agenda — aujourd&apos;hui</h2>
            <span className="text-xs text-slate-400">cabinet · visio</span>
          </div>
          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-700/70">
            {AGENDA.map((a) => (
              <div key={a.time} className="flex items-center gap-4 py-3">
                <span className="w-12 shrink-0 font-mono text-sm text-slate-400">{a.time}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{a.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{a.reason}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${TAG_TONE[a.tone]}`}>{a.tag}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <section className={CARD}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 dark:text-white">File d&apos;attente</h2>
              <span className="text-xs text-emerald-500">● en direct</span>
            </div>
            <div className="mt-3 space-y-2">
              {QUEUE.map((q) => (
                <div key={q.n} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/50">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">{q.n}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{q.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{q.info}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${TAG_TONE[q.tone]}`}>{q.tag}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-5 ring-1 ring-indigo-100 dark:from-indigo-900/60 dark:to-slate-800/60 dark:ring-indigo-500/30">
            <div className="flex items-center gap-2">
              <span className="text-lg">📹</span>
              <h2 className="font-bold text-slate-800 dark:text-white">Téléconsultation vidéo</h2>
              <span className="ms-auto rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">Premium</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Consultations vidéo sécurisées + paiement en ligne. Idéal pour le suivi et les patients libyens.
            </p>
            <Link href="/pro/tarifs" className="mt-3 inline-block rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700">
              Débloquer · +50 DT/mois
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1>
      <section className={CARD}>{children}</section>
    </div>
  );
}

function Patients({ ws }: { ws: ProWorkspace }) {
  return (
    <Panel title="Patients">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2">Nom</th><th className="pb-2">Téléphone</th><th className="pb-2">Origine</th><th className="pb-2">Chronique</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/70">
            {ws.patients.map((p) => (
              <tr key={p.id} className="text-slate-600 dark:text-slate-200">
                <td className="py-2.5 font-medium text-slate-800 dark:text-white">{p.name}</td>
                <td className="py-2.5" dir="ltr">{p.phone}</td>
                <td className="py-2.5 text-slate-500 dark:text-slate-400">{p.origin}</td>
                <td className="py-2.5 text-slate-500 dark:text-slate-400">{p.chronic || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

const METHOD_LABEL: Record<string, string> = { especes: "Espèces", carte: "Carte", cnam: "CNAM", impaye: "Impayé" };

function Caisse({ ws }: { ws: ProWorkspace }) {
  const nameById = Object.fromEntries(ws.patients.map((p) => [p.id, p.name]));
  const total = ws.consultations.reduce((s, c) => s + (c.method !== "impaye" ? c.amount : 0), 0);
  const impaye = ws.consultations.filter((c) => c.method === "impaye").reduce((s, c) => s + c.amount, 0);
  return (
    <Panel title="Caisse">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
          <p className="text-xs text-emerald-700 dark:text-emerald-300">Encaissé</p>
          <p className="text-xl font-bold text-slate-800 dark:text-white">{total} DT</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100 dark:bg-amber-500/10 dark:ring-amber-500/20">
          <p className="text-xs text-amber-700 dark:text-amber-300">Impayés</p>
          <p className="text-xl font-bold text-slate-800 dark:text-white">{impaye} DT</p>
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700/70">
        {ws.consultations.map((c) => (
          <div key={c.id} className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-slate-600 dark:text-slate-200">{nameById[c.patientId] ?? c.motif}<span className="ms-2 text-xs text-slate-400">{c.date}</span></span>
            <span className="font-semibold text-slate-800 dark:text-white">{c.amount} DT <span className="ms-1 text-xs text-slate-400">{METHOD_LABEL[c.method]}</span></span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function FileAttente() {
  return (
    <Panel title="File d'attente">
      <div className="space-y-2">
        {QUEUE.map((q) => (
          <div key={q.n} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">{q.n}</span>
            <div className="flex-1"><p className="font-semibold text-slate-800 dark:text-white">{q.name}</p><p className="text-xs text-slate-500 dark:text-slate-400">{q.info}</p></div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TAG_TONE[q.tone]}`}>{q.tag}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PremiumPanel({ view }: { view: "teleconsultation" | "analytics" }) {
  const isTele = view === "teleconsultation";
  return (
    <Panel title={isTele ? "Téléconsultation" : "Analytics"}>
      <div className="text-center">
        <span className="text-4xl">{isTele ? "📹" : "📈"}</span>
        <p className="mt-3 font-semibold text-slate-800 dark:text-white">
          {isTele ? "Consultations vidéo sécurisées" : "Statistiques avancées de votre activité"}
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {isTele
            ? "Visio + paiement en ligne, idéal pour le suivi et les patients à l'étranger."
            : "Revenus, taux de présence, actes CNAM, tendances — pour piloter votre cabinet."}
        </p>
        <span className="mt-3 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">Fonctionnalité Premium</span>
        <div className="mt-4">
          <Link href="/pro/tarifs" className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">Passer à Premium</Link>
        </div>
      </div>
    </Panel>
  );
}
