"use client";

// Abonnement Tabibi Pro — paiement en ligne via les passerelles tunisiennes.
// Démo : le parcours est complet mais aucun paiement réel n'est effectué.
// Production : API ClicToPay (SMT), Konnect ou e-Dinar (voir docs/FEATURES.md).

import { useState } from "react";
import Link from "next/link";

const TIERS = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: 89,
    tagline: "Pour digitaliser la prise de rendez-vous",
    features: [
      "Profil public référencé (CNAM, tarifs, langues)",
      "Agenda en ligne + réservation 24h/24",
      "Rendez-vous illimités",
      "Application mobile (PWA)",
    ],
  },
  {
    id: "avance",
    name: "Avancé",
    price: 179,
    popular: true,
    tagline: "Le cabinet connecté au quotidien",
    features: [
      "Tout Essentiel, plus :",
      "Rappels SMS + e-mail illimités (FR/AR)",
      "Téléconsultation vidéo + paiement en ligne",
      "Dossiers patients, ordonnances (traces) et caisse",
      "Messagerie sécurisée patients",
      "Suivis et relances automatiques",
      "Synchro Calendly / Google Agenda",
      "Statistiques du cabinet",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 299,
    tagline: "Pour développer la patientèle",
    features: [
      "Tout Avancé, plus :",
      "Mise en avant dans la recherche Tabibi",
      "Synchro des avis Google (API Places)",
      "Widget de réservation pour votre site",
      "Multi-assistants / secrétariat",
      "Accueil patients internationaux (Libye…)",
      "Support prioritaire 7j/7",
    ],
  },
];

const GATEWAYS = [
  {
    id: "clictopay",
    name: "ClicToPay — carte bancaire",
    detail: "Passerelle officielle de la Société Monétique Tunisie (toutes banques tunisiennes)",
    emoji: "💳",
  },
  {
    id: "edinar",
    name: "e-Dinar",
    detail: "Carte e-Dinar de la Poste Tunisienne",
    emoji: "📮",
  },
  {
    id: "konnect",
    name: "Konnect",
    detail: "Agrégateur tunisien (cartes locales 1,3 %, internationales 2,9 %, e-Dinar)",
    emoji: "🔗",
  },
  {
    id: "virement",
    name: "Virement bancaire",
    detail: "Facture annuelle avec remise de 2 mois",
    emoji: "🏦",
  },
];

export default function TarifsPage() {
  const [tier, setTier] = useState<string | null>(null);
  const [gateway, setGateway] = useState("clictopay");
  const [paid, setPaid] = useState(false);
  const selected = TIERS.find((t) => t.id === tier);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-center text-3xl font-bold text-slate-800">Tarifs Tabibi Pro</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-slate-500">
        Sans engagement, résiliable à tout moment. Gratuit pour les patients — l&apos;abonnement praticien
        finance la plateforme, comme chez Doctolib.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.id}
            className={`relative flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-2 transition ${
              tier === t.id ? "ring-primary-600" : t.popular ? "ring-primary-200" : "ring-slate-200"
            }`}
          >
            {t.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white">
                Le plus choisi
              </span>
            )}
            <h2 className="text-lg font-bold text-slate-800">{t.name}</h2>
            <p className="text-sm text-slate-500">{t.tagline}</p>
            <p className="mt-4 text-3xl font-bold text-slate-800">
              {t.price} <span className="text-base font-normal text-slate-500">DT / mois HT</span>
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
              {t.features.map((f) => (
                <li key={f} className={f.startsWith("Tout ") ? "font-semibold text-slate-800" : ""}>
                  {f.startsWith("Tout ") ? f : `✓ ${f}`}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setTier(t.id);
                setPaid(false);
              }}
              className={`mt-6 rounded-xl px-6 py-3 text-sm font-semibold transition ${
                tier === t.id
                  ? "bg-primary-600 text-white"
                  : "bg-primary-50 text-primary-700 hover:bg-primary-100"
              }`}
            >
              {tier === t.id ? "Sélectionné ✓" : "Choisir " + t.name}
            </button>
          </div>
        ))}
      </div>

      {/* Checkout */}
      {selected && (
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          {paid ? (
            <div className="text-center">
              <span className="text-5xl">🎉</span>
              <h2 className="mt-3 text-xl font-bold text-slate-800">Abonnement {selected.name} activé (démo)</h2>
              <p className="mt-2 text-sm text-slate-500">
                Environnement de démonstration : aucun paiement réel n&apos;a été effectué. En production, cette
                étape appelle l&apos;API de la passerelle choisie (ClicToPay, Konnect ou e-Dinar) puis active
                l&apos;abonnement à la confirmation du webhook.
              </p>
              <Link
                href="/pro/dashboard"
                className="mt-6 inline-block rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Ouvrir mon espace praticien
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-800">
                Paiement — {selected.name} ({selected.price} DT/mois HT)
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choisissez votre moyen de paiement tunisien :
              </p>
              <div className="mt-4 space-y-2">
                {GATEWAYS.map((g) => (
                  <label
                    key={g.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      gateway === g.id ? "border-primary-500 bg-primary-50/50" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gateway"
                      checked={gateway === g.id}
                      onChange={() => setGateway(g.id)}
                      className="accent-primary-600"
                    />
                    <span className="text-2xl">{g.emoji}</span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">{g.name}</span>
                      <span className="block text-xs text-slate-500">{g.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPaid(true)}
                className="mt-6 w-full rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white transition hover:bg-primary-700"
              >
                Payer {selected.price} DT (démo)
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                🔒 Démo sans paiement réel. Production : redirection sécurisée vers la passerelle, 3-D Secure,
                activation à la confirmation.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
