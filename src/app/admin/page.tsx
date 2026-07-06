"use client";

// Back-office interne Tabibi (démonstration) : vérification des inscriptions
// praticiens/cliniques/labos, invitations pilotées par la demande (questions
// sans réponse) et vue d'ensemble de la plateforme.
// Production : accès restreint (rôles ADMIN), journalisation, modération Q&A.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRoleGate, SessionBar } from "@/components/RoleGuard";
import { DOCTORS, SPECIALTIES } from "@/lib/data";
import { CLINICS } from "@/lib/clinics";
import { LABS } from "@/lib/labs";
import { PHARMACIES } from "@/lib/pharmacies";
import { ARTICLES } from "@/lib/articles";
import { allQuestions, type QnaQuestion } from "@/lib/qna";

interface Lead {
  type: "medecin" | "clinique" | "laboratoire";
  name: string;
  specialty: string;
  registration: string;
  city: string;
  phone: string;
  email: string;
  claimSlug: string | null;
  at: string;
  status?: "en_attente" | "approuve" | "rejete";
}

const TABS = [
  { id: "verifs", label: "✅ Vérifications" },
  { id: "invitations", label: "📨 Invitations médecins" },
  { id: "overview", label: "📊 Vue d'ensemble" },
] as const;

const TYPE_LABEL = { medecin: "🩺 Médecin", clinique: "🏥 Clinique", laboratoire: "🧪 Laboratoire" };

export default function AdminPage() {
  const gate = useRoleGate(["admin"]);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("verifs");
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [questions, setQuestions] = useState<QnaQuestion[]>([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    try {
      const raw = JSON.parse(window.localStorage.getItem("tabibi.pro.leads") ?? "[]") as Lead[];
      setLeads(raw.map((l) => ({ status: "en_attente", ...l })));
    } catch {
      setLeads([]);
    }
    setQuestions(allQuestions());
  }, []);

  function persist(next: Lead[]) {
    setLeads(next);
    window.localStorage.setItem("tabibi.pro.leads", JSON.stringify(next));
  }

  function setStatus(index: number, status: Lead["status"]) {
    if (!leads) return;
    persist(leads.map((l, i) => (i === index ? { ...l, status } : l)));
  }

  const unanswered = useMemo(() => questions.filter((q) => q.answers.length === 0), [questions]);
  const specialtyLabel = (id: string) => SPECIALTIES.find((s) => s.id === id)?.label ?? id;

  function invitationText(q: QnaQuestion): string {
    return `Objet : Un patient attend une réponse en ${specialtyLabel(q.specialtyId).toLowerCase()} sur Tabibi

Bonjour Docteur,

Un patient vient de poser anonymement cette question sur Tabibi :

« ${q.title} »

Aucun spécialiste en ${specialtyLabel(q.specialtyId).toLowerCase()} n'y a encore répondu. En y répondant avec votre profil vérifié, votre réponse sera publique, notée « utile » par les lecteurs, et affichera un bouton de prise de rendez-vous vers votre agenda.

Créer votre profil gratuit (2 minutes) : https://tabibi-livid.vercel.app/pro/inscription
Répondre à la question : https://tabibi-livid.vercel.app/questions/${q.slug}

L'équipe Tabibi — le système d'exploitation de la santé tunisienne`;
  }

  async function copyInvitation(q: QnaQuestion) {
    try {
      await navigator.clipboard.writeText(invitationText(q));
      setCopied(q.id);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      /* clipboard indisponible */
    }
  }

  if (gate) return gate;

  return (
    <>
    <SessionBar />
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">Back-office Tabibi</h1>
      <p className="text-sm text-slate-500">
        Outil interne{" "}
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
          Démo — en production : accès restreint aux administrateurs
        </span>
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tItem) => (
          <button
            key={tItem.id}
            type="button"
            onClick={() => setTab(tItem.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === tItem.id ? "bg-primary-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {tItem.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* Vérifications des inscriptions */}
        {tab === "verifs" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="font-bold text-slate-800">Inscriptions à vérifier</h2>
            <p className="mt-1 text-sm text-slate-500">
              Chaque candidature est vérifiée contre le registre officiel (CNOM pour les médecins,
              autorisations du ministère pour cliniques et labos) avant publication du profil.
            </p>
            {leads === null ? (
              <p className="mt-4 text-slate-400">Chargement…</p>
            ) : leads.length === 0 ? (
              <div className="mt-4 rounded-xl bg-slate-50 p-6 text-sm text-slate-500">
                Aucune candidature.{" "}
                <Link href="/pro/inscription" className="text-primary-600 hover:underline">
                  Créez-en une via le formulaire d&apos;inscription
                </Link>{" "}
                pour tester le flux.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {leads.map((l, i) => (
                  <div
                    key={`${l.at}-${i}`}
                    className={`rounded-xl p-4 text-sm ring-1 ${
                      l.status === "approuve"
                        ? "bg-emerald-50/50 ring-emerald-100"
                        : l.status === "rejete"
                          ? "bg-red-50/50 ring-red-100"
                          : "bg-slate-50 ring-slate-200"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800">
                        {TYPE_LABEL[l.type]} — {l.name}
                        {l.claimSlug && (
                          <span className="ms-2 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                            Revendication de profil
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-slate-400" dir="ltr">{l.at.slice(0, 16).replace("T", " ")}</span>
                    </div>
                    <p className="mt-1 text-slate-600">
                      {l.specialty} · {l.city} · <span dir="ltr">{l.phone}</span>
                      {l.registration && (
                        <> · N° registre : <span className="font-mono font-medium">{l.registration}</span></>
                      )}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {l.status === "en_attente" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setStatus(i, "approuve")}
                            className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            ✓ Approuver (registre vérifié)
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(i, "rejete")}
                            className="rounded-lg bg-red-50 px-4 py-1.5 text-xs font-semibold text-accent-600 hover:bg-red-100"
                          >
                            ✗ Rejeter
                          </button>
                          <a
                            href={`tel:${l.phone.replace(/\s/g, "")}`}
                            className="rounded-lg bg-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                          >
                            📞 Appel de bienvenue
                          </a>
                        </>
                      ) : (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            l.status === "approuve" ? "bg-emerald-600 text-white" : "bg-red-100 text-accent-600"
                          }`}
                        >
                          {l.status === "approuve" ? "Profil approuvé — en ligne" : "Rejeté"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Invitations pilotées par la demande */}
        {tab === "invitations" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="font-bold text-slate-800">Questions sans réponse → invitations médecins</h2>
            <p className="mt-1 text-sm text-slate-500">
              Chaque question sans réponse est une opportunité de recrutement : invitez les spécialistes
              non inscrits de la région à y répondre. (Production : envoi e-mail/SMS automatisé.)
            </p>
            {unanswered.length === 0 ? (
              <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
                🎉 Toutes les questions ont au moins une réponse.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {unanswered.map((q) => (
                  <div key={q.id} className="rounded-xl bg-slate-50 p-4 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800">{q.title}</span>
                      <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                        {specialtyLabel(q.specialtyId)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => copyInvitation(q)}
                        className="rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-700"
                      >
                        {copied === q.id ? "✓ Copié !" : "📋 Copier l'e-mail d'invitation"}
                      </button>
                      <a
                        href={`mailto:?subject=${encodeURIComponent(
                          `Un patient attend une réponse en ${specialtyLabel(q.specialtyId).toLowerCase()} sur Tabibi`
                        )}&body=${encodeURIComponent(invitationText(q))}`}
                        className="rounded-lg bg-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                      >
                        ✉️ Ouvrir dans la messagerie
                      </a>
                      <Link
                        href={`/questions/${q.slug}`}
                        className="rounded-lg bg-white px-4 py-1.5 text-xs font-semibold text-primary-700 ring-1 ring-primary-200 hover:bg-primary-50"
                      >
                        Voir la question
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Vue d'ensemble */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Médecins référencés", value: DOCTORS.length, href: "/recherche" },
                { label: "Cliniques", value: CLINICS.length, href: "/cliniques" },
                { label: "Laboratoires", value: LABS.length, href: "/laboratoires" },
                { label: "Pharmacies (gardes)", value: PHARMACIES.length, href: "/pharmacies" },
                { label: "Articles Magazine", value: ARTICLES.length, href: "/sante" },
                { label: "Questions publiques", value: questions.length, href: "/questions" },
              ].map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:ring-primary-400"
                >
                  <p className="text-xs uppercase tracking-wide text-slate-400">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-800">{s.value}</p>
                </Link>
              ))}
            </div>
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="font-bold text-slate-800">Priorités opérationnelles</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>📨 {unanswered.length} question(s) sans réponse → onglet Invitations</li>
                <li>
                  ✅ {(leads ?? []).filter((l) => l.status === "en_attente").length} inscription(s) à
                  vérifier → onglet Vérifications
                </li>
                <li>🗂️ Brancher les registres officiels (CNOM, CNOPT, DPM) — voir docs/GROWTH.md</li>
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
