"use client";

// Inscription des professionnels : médecins, cliniques et laboratoires.
// Gratuit — le profil est vérifié (CNOM / registre) avant publication.
// Démo : la candidature est stockée localement ; production : back-office
// admin de validation + import des registres officiels (voir docs/GROWTH.md).

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CITIES, SPECIALTIES, findDoctor } from "@/lib/data";

type ProType = "medecin" | "clinique" | "laboratoire";

const TYPES: { id: ProType; label: string; emoji: string }[] = [
  { id: "medecin", label: "Médecin / Praticien", emoji: "🩺" },
  { id: "clinique", label: "Clinique", emoji: "🏥" },
  { id: "laboratoire", label: "Laboratoire", emoji: "🧪" },
];

function InscriptionContent() {
  const params = useSearchParams();
  const claimSlug = params.get("claim");
  const claimed = claimSlug ? findDoctor(claimSlug) : undefined;

  const [type, setType] = useState<ProType>("medecin");
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    specialty: SPECIALTIES[0].label,
    registration: "",
    city: CITIES[0],
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (claimed) {
      setForm((f) => ({ ...f, name: claimed.fullName, specialty: claimed.specialty, city: claimed.city }));
    }
  }, [claimed]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    const leads = JSON.parse(window.localStorage.getItem("tabibi.pro.leads") ?? "[]");
    leads.push({ type, ...form, claimSlug: claimSlug ?? null, at: new Date().toISOString() });
    window.localStorage.setItem("tabibi.pro.leads", JSON.stringify(leads));
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">Rejoindre Tabibi — gratuit</h1>
      <p className="mt-1 text-sm text-slate-500">
        Créez votre profil vérifié en 2 minutes. Le plan Gratuit inclut le profil public, l&apos;agenda en
        ligne et les questions publiques — passez au plan supérieur quand vous voulez.
      </p>

      {claimed && (
        <p className="mt-4 rounded-xl bg-primary-50 p-4 text-sm text-primary-800">
          👋 Vous revendiquez le profil <span className="font-bold">{claimed.fullName}</span> (
          {claimed.specialty}, {claimed.city}). Après vérification de votre identité (carte CNOM), vous en
          prendrez le contrôle : agenda, tarifs, photos, réponses publiques.
        </p>
      )}

      {sent ? (
        <div className="mt-6 rounded-2xl bg-emerald-50 p-8 text-center ring-1 ring-emerald-200">
          <span className="text-4xl">🎉</span>
          <h2 className="mt-2 text-lg font-bold text-emerald-800">Candidature envoyée (démo)</h2>
          <p className="mt-2 text-sm text-emerald-700">
            En production : vérification de votre inscription à l&apos;ordre (CNOM / registre), appel de
            bienvenue sous 24 h ouvrées, puis activation du profil et formation de 15 minutes.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/pro/dashboard"
              className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Découvrir l&apos;espace praticien (démo)
            </Link>
            <Link
              href="/pro/tarifs"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 ring-1 ring-primary-200 hover:bg-primary-50"
            >
              Voir les plans
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {/* Type de professionnel */}
          <div className="flex flex-wrap gap-2">
            {TYPES.map((tItem) => (
              <button
                key={tItem.id}
                type="button"
                onClick={() => setType(tItem.id)}
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  type === tItem.id
                    ? "bg-primary-600 text-white"
                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {tItem.emoji} {tItem.label}
              </button>
            ))}
          </div>

          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={type === "medecin" ? "Nom et prénom (Dr…) *" : "Nom de l'établissement *"}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {type === "medecin" ? (
              <select
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
              >
                {SPECIALTIES.map((s) => (
                  <option key={s.id} value={s.label}>
                    {s.emoji} {s.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                placeholder={type === "clinique" ? "Spécialités principales" : "Familles d'analyses"}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
              />
            )}
            <input
              value={form.registration}
              onChange={(e) => setForm({ ...form, registration: e.target.value })}
              placeholder={
                type === "medecin" ? "N° d'inscription CNOM *" : "N° d'autorisation / registre *"
              }
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Téléphone / WhatsApp *"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="E-mail"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 sm:col-span-2"
            />
          </div>

          <button className="w-full rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white transition hover:bg-primary-700">
            Créer mon profil gratuit
          </button>
          <p className="text-center text-xs text-slate-400">
            Vérification d&apos;identité obligatoire avant publication (protection des patients). Aucune
            carte bancaire demandée.
          </p>
        </form>
      )}
    </div>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={<p className="p-10 text-slate-400">…</p>}>
      <InscriptionContent />
    </Suspense>
  );
}
