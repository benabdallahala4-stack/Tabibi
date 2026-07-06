"use client";

// Espace clinique (démonstration : « Clinique Carthage Internationale »).
// Interface en français, langue de travail des établissements de santé.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CLINICS } from "@/lib/clinics";
import { DOCTORS } from "@/lib/data";

interface QuoteRequest {
  name: string;
  phone: string;
  country: string;
  speciality: string;
  details: string;
  clinicName: string;
  at: string;
  status?: "nouveau" | "traite";
}

const TABS = [
  { id: "devis", label: "📥 Demandes de devis" },
  { id: "praticiens", label: "👩‍⚕️ Praticiens" },
  { id: "stats", label: "📊 Statistiques" },
] as const;

const CLINIC = CLINICS[0];

export default function ClinicAdminPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("devis");
  const [quotes, setQuotes] = useState<QuoteRequest[] | null>(null);

  useEffect(() => {
    try {
      const all = JSON.parse(window.localStorage.getItem("tabibi.quotes") ?? "[]") as QuoteRequest[];
      setQuotes(all.map((q) => ({ status: "nouveau", ...q })));
    } catch {
      setQuotes([]);
    }
  }, []);

  function persist(next: QuoteRequest[]) {
    setQuotes(next);
    window.localStorage.setItem("tabibi.quotes", JSON.stringify(next));
  }

  const clinicDoctors = DOCTORS.filter((d) => CLINIC.doctorSlugs.includes(d.slug));

  const stats = useMemo(() => {
    const byCountry = new Map<string, number>();
    for (const q of quotes ?? []) byCountry.set(q.country, (byCountry.get(q.country) ?? 0) + 1);
    return { total: quotes?.length ?? 0, byCountry: [...byCountry.entries()] };
  }, [quotes]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Espace clinique</h1>
          <p className="text-sm text-slate-500">
            {CLINIC.name} ·{" "}
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              Démo interactive (données sur cet appareil)
            </span>
          </p>
        </div>
        <Link href={`/clinique/${CLINIC.slug}`} className="text-sm font-medium text-primary-600 hover:underline">
          Voir la fiche publique →
        </Link>
      </div>

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
        {/* Devis */}
        {tab === "devis" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="font-bold text-slate-800">Demandes de devis reçues</h2>
            <p className="mt-1 text-sm text-slate-500">
              Les formulaires « Demander un devis » remplis sur les fiches cliniques arrivent ici.
              Répondez sous 48 h ouvrées (engagement Tabibi).
            </p>
            {quotes === null ? (
              <p className="mt-4 text-slate-400">Chargement…</p>
            ) : quotes.length === 0 ? (
              <div className="mt-4 rounded-xl bg-slate-50 p-6 text-sm text-slate-500">
                Aucune demande pour l&apos;instant.{" "}
                <Link href={`/clinique/${CLINIC.slug}`} className="text-primary-600 hover:underline">
                  Envoyez-en une depuis la fiche publique
                </Link>{" "}
                pour tester.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {quotes.map((q, i) => (
                  <div
                    key={`${q.at}-${i}`}
                    className={`rounded-xl p-4 text-sm ring-1 ${
                      q.status === "traite" ? "bg-slate-50 ring-slate-100" : "bg-emerald-50/50 ring-emerald-100"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800">
                        {q.name}{" "}
                        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                          {q.country}
                        </span>
                        {q.status !== "traite" && (
                          <span className="ml-1 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                            Nouveau
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-slate-400" dir="ltr">{q.at.slice(0, 16).replace("T", " ")}</span>
                    </div>
                    <p className="mt-1 text-slate-600">
                      {q.speciality && <span className="font-medium">{q.speciality} — </span>}
                      {q.details || "(sans détails)"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a
                        href={`tel:${q.phone.replace(/\s/g, "")}`}
                        className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700"
                      >
                        📞 <span dir="ltr">{q.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${q.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Bonjour ${q.name}, ${CLINIC.name} — suite à votre demande de devis sur Tabibi :`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                      >
                        💬 WhatsApp
                      </a>
                      {q.status !== "traite" && (
                        <button
                          type="button"
                          onClick={() => persist(quotes.map((x, j) => (j === i ? { ...x, status: "traite" as const } : x)))}
                          className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                        >
                          ✓ Marquer traité
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Praticiens */}
        {tab === "praticiens" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="font-bold text-slate-800">Praticiens rattachés ({clinicDoctors.length})</h2>
            <p className="mt-1 text-sm text-slate-500">
              Leurs agendas Tabibi alimentent la fiche publique de la clinique. (Ajout/retrait : V1 backend.)
            </p>
            <div className="mt-4 space-y-2">
              {clinicDoctors.map((d) => (
                <div key={d.slug} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm">
                  <span>
                    <span className="font-semibold text-slate-800">{d.fullName}</span>
                    <span className="text-slate-500"> — {d.specialty}</span>
                  </span>
                  <Link href={`/medecin/${d.slug}`} className="text-primary-600 hover:underline">
                    Profil →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stats */}
        {tab === "stats" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-400">Demandes de devis</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-400">Praticiens rattachés</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">{clinicDoctors.length}</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-400">Lits</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">{CLINIC.beds}</p>
              </div>
            </div>
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="font-bold text-slate-800">Demandes par pays</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {stats.byCountry.map(([c, n]) => (
                  <li key={c} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-slate-700">{c}</span>
                    <span className="font-semibold text-slate-500">{n}</span>
                  </li>
                ))}
                {stats.byCountry.length === 0 && <li className="text-slate-400">Pas encore de données.</li>}
              </ul>
              <p className="mt-3 text-xs text-slate-400">
                Le suivi Tunisie / Libye / Algérie mesure votre activité internationale.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
