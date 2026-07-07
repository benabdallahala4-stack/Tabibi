"use client";

// Espace praticien Seha Pro — application médecin (thème sombre, style SaaS).
// Reprend la maquette validée : barre latérale (profil + navigation + upsell),
// en-tête d'accueil, cartes d'indicateurs, agenda du jour et file d'attente en
// direct. Démo interactive ; en production les données viennent de la base.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRoleGate } from "@/components/RoleGuard";
import { listAppointments } from "@/lib/appointments";
import { loadWorkspace, type ProWorkspace } from "@/lib/pro";
import { loadPlan, PLAN_LABELS, type Plan } from "@/lib/plan";
import { logout } from "@/lib/roles";

const DOCTOR = { name: "Dr Amine Ben Salah", specialty: "Cardiologue", city: "Tunis", initials: "AB" };

// Agenda du jour (démo, calqué sur la maquette).
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
  done: "bg-slate-700 text-slate-300",
  cabinet: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30",
  visio: "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30",
  pay: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  cnam: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  current: "bg-sky-500/20 text-sky-300",
  wait: "bg-amber-500/15 text-amber-300",
};

type View = "agenda" | "patients" | "caisse" | "file" | "teleconsultation" | "analytics";

const NAV: { id: View; label: string; icon: string; href?: string; premium?: boolean; badge?: number }[] = [
  { id: "agenda", label: "Agenda", icon: "M4 5h16M4 5v14h16V5M8 3v4M16 3v4" },
  { id: "patients", label: "Patients", icon: "M16 14a4 4 0 10-8 0M12 10a3 3 0 100-6 3 3 0 000 6" },
  { id: "ordonnances", label: "Ordonnances", icon: "M7 4h7l4 4v12H7zM14 4v4h4", href: "/pro/ordonnances" } as never,
  { id: "caisse", label: "Caisse", icon: "M3 7h18v10H3zM3 11h18" },
  { id: "file", label: "File d'attente", icon: "M5 4h14M7 4v6l3 3-3 3v4M17 4v6l-3 3 3 3v4", badge: 3 },
  { id: "bulletins", label: "Bulletins CNAM", icon: "M6 3h9l3 3v15H6zM9 12h6M9 16h6", href: "/pro/bulletin" } as never,
  { id: "teleconsultation", label: "Téléconsultation", icon: "M4 6h11v12H4zM15 10l5-3v10l-5-3", premium: true },
  { id: "analytics", label: "Analytics", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2", premium: true },
];

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
      { label: "RDV du jour", value: String(12 + bookings), unit: "", note: "▲ 2 vs hier", tone: "text-emerald-400" },
      { label: "Encaissé", value: "480", unit: "DT", note: "▲ 60 DT", tone: "text-emerald-400" },
      { label: "Impayés", value: "2", unit: "", note: "90 DT à relancer", tone: "text-amber-400" },
      { label: "File d'attente", value: "3", unit: "", note: "~25 min", tone: "text-sky-400" },
    ],
    [bookings],
  );

  if (gate) return gate;
  if (!ws) return <div className="min-h-screen bg-slate-900 p-10 text-slate-400">Chargement…</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 p-4 lg:flex-row lg:p-6">
        {/* Barre latérale */}
        <aside className="lg:w-64 lg:shrink-0">
          <div className="rounded-2xl bg-slate-800/60 p-4 ring-1 ring-slate-700">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500/20 text-sm font-bold text-primary-300">
                {DOCTOR.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{DOCTOR.name}</p>
                <p className="truncate text-xs text-slate-400">{DOCTOR.specialty} · {DOCTOR.city}</p>
              </div>
            </div>

            <nav className="mt-4 space-y-1">
              {NAV.map((item) => {
                const href = (item as { href?: string }).href;
                const active = view === item.id;
                const cls = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-primary-600 text-white" : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                }`;
                const inner = (
                  <>
                    <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-accent-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>
                    )}
                    {item.premium && (
                      <span className="rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300">Premium</span>
                    )}
                  </>
                );
                return href ? (
                  <Link key={item.id} href={href} className={cls}>{inner}</Link>
                ) : (
                  <button key={item.id} type="button" onClick={() => setView(item.id)} className={cls}>{inner}</button>
                );
              })}
            </nav>

            <div className="mt-4 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 p-4">
              <p className="text-sm font-bold text-white">Plan {PLAN_LABELS[plan] ?? "Gratuit"} · 49 DT/mois</p>
              <p className="mt-1 text-xs text-primary-100">Débloquez la visio + analytics.</p>
              <Link href="/pro/tarifs" className="mt-3 block rounded-lg bg-white px-3 py-2 text-center text-xs font-semibold text-primary-700 hover:bg-primary-50">
                Passer à Premium
              </Link>
            </div>

            <button type="button" onClick={() => { logout(); window.location.href = "/connexion"; }} className="mt-3 w-full rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200">
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Contenu */}
        <main className="min-w-0 flex-1">
          {view === "agenda" && <AgendaHome kpis={kpis} />}
          {view === "patients" && <Patients ws={ws} />}
          {view === "caisse" && <Caisse ws={ws} />}
          {view === "file" && <FileAttente />}
          {(view === "teleconsultation" || view === "analytics") && <PremiumPanel view={view} />}
        </main>
      </div>
    </div>
  );
}

function AgendaHome({ kpis }: { kpis: { label: string; value: string; unit: string; note: string; tone: string }[] }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Bonjour, {DOCTOR.name.replace("Dr Amine ", "Dr ")} 👋</h1>
          <p className="mt-1 text-sm text-slate-400">Lundi 6 juillet · 12 RDV · 2 téléconsultations</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 ring-1 ring-slate-700 hover:bg-slate-700">Semaine</button>
          <Link href="/pro/agenda" className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">+ Nouveau RDV</Link>
        </div>
      </div>

      {/* Indicateurs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl bg-slate-800/60 p-4 ring-1 ring-slate-700">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">{k.label}</p>
            <p className="mt-1 text-3xl font-bold text-white">{k.value}{k.unit && <span className="ms-1 text-sm font-medium text-slate-400">{k.unit}</span>}</p>
            <p className={`mt-1 text-xs font-medium ${k.tone}`}>{k.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Agenda du jour */}
        <section className="rounded-2xl bg-slate-800/60 p-5 ring-1 ring-slate-700 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white">Agenda — aujourd&apos;hui</h2>
            <span className="text-xs text-slate-400">cabinet · visio</span>
          </div>
          <div className="mt-3 divide-y divide-slate-700/70">
            {AGENDA.map((a) => (
              <div key={a.time} className="flex items-center gap-4 py-3">
                <span className="w-12 shrink-0 font-mono text-sm text-slate-400">{a.time}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{a.name}</p>
                  <p className="truncate text-xs text-slate-400">{a.reason}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${TAG_TONE[a.tone]}`}>{a.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* File d'attente + upsell */}
        <div className="space-y-4">
          <section className="rounded-2xl bg-slate-800/60 p-5 ring-1 ring-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white">File d&apos;attente</h2>
              <span className="text-xs text-emerald-400">● en direct</span>
            </div>
            <div className="mt-3 space-y-2">
              {QUEUE.map((q) => (
                <div key={q.n} className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-200">{q.n}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{q.name}</p>
                    <p className="truncate text-xs text-slate-400">{q.info}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${TAG_TONE[q.tone]}`}>{q.tag}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-indigo-900/60 to-slate-800/60 p-5 ring-1 ring-indigo-500/30">
            <div className="flex items-center gap-2">
              <span className="text-lg">📹</span>
              <h2 className="font-bold text-white">Téléconsultation vidéo</h2>
              <span className="ms-auto rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-300">Premium</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              Consultations vidéo sécurisées + paiement en ligne. Idéal pour le suivi et les patients libyens.
            </p>
            <Link href="/pro/tarifs" className="mt-3 inline-block rounded-lg bg-white px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">
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
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <section className="rounded-2xl bg-slate-800/60 p-5 ring-1 ring-slate-700">{children}</section>
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
          <tbody className="divide-y divide-slate-700/70">
            {ws.patients.map((p) => (
              <tr key={p.id} className="text-slate-200">
                <td className="py-2.5 font-medium text-white">{p.name}</td>
                <td className="py-2.5" dir="ltr">{p.phone}</td>
                <td className="py-2.5 text-slate-400">{p.origin}</td>
                <td className="py-2.5 text-slate-400">{p.chronic || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

const METHOD_LABEL: Record<string, string> = {
  especes: "Espèces", carte: "Carte", cnam: "CNAM", impaye: "Impayé",
};

function Caisse({ ws }: { ws: ProWorkspace }) {
  const nameById = Object.fromEntries(ws.patients.map((p) => [p.id, p.name]));
  const total = ws.consultations.reduce((s, c) => s + (c.method !== "impaye" ? c.amount : 0), 0);
  const impaye = ws.consultations.filter((c) => c.method === "impaye").reduce((s, c) => s + c.amount, 0);
  return (
    <Panel title="Caisse">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
          <p className="text-xs text-emerald-300">Encaissé</p>
          <p className="text-xl font-bold text-white">{total} DT</p>
        </div>
        <div className="rounded-xl bg-amber-500/10 p-3 ring-1 ring-amber-500/20">
          <p className="text-xs text-amber-300">Impayés</p>
          <p className="text-xl font-bold text-white">{impaye} DT</p>
        </div>
      </div>
      <div className="divide-y divide-slate-700/70">
        {ws.consultations.map((c) => (
          <div key={c.id} className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-slate-200">{nameById[c.patientId] ?? c.motif}<span className="ms-2 text-xs text-slate-500">{c.date}</span></span>
            <span className="font-semibold text-white">{c.amount} DT <span className="ms-1 text-xs text-slate-400">{METHOD_LABEL[c.method]}</span></span>
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
          <div key={q.n} className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-slate-200">{q.n}</span>
            <div className="flex-1"><p className="font-semibold text-white">{q.name}</p><p className="text-xs text-slate-400">{q.info}</p></div>
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
        <p className="mt-3 font-semibold text-white">
          {isTele ? "Consultations vidéo sécurisées" : "Statistiques avancées de votre activité"}
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
          {isTele
            ? "Visio + paiement en ligne, idéal pour le suivi et les patients à l'étranger."
            : "Revenus, taux de présence, actes CNAM, tendances — pour piloter votre cabinet."}
        </p>
        <span className="mt-3 inline-block rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300">Fonctionnalité Premium</span>
        <div className="mt-4">
          <Link href="/pro/tarifs" className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">
            Passer à Premium
          </Link>
        </div>
      </div>
    </Panel>
  );
}
