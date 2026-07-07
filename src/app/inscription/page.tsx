"use client";

// Inscription : compte patient ou compte médecin (onglets).
// E-mail + mot de passe, ou Google. Le médecin est créé avec le rôle
// « medecin » ; son profil public reste soumis à vérification (Ordre/CNOM)
// côté back-office avant d'apparaître dans l'annuaire.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveSession } from "@/lib/roles";

type Role = "patient" | "medecin";

export default function InscriptionPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("patient");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (patch: Partial<typeof f>) => setF((s) => ({ ...s, ...patch }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Inscription impossible.");
        return;
      }
      const session = saveSession(data.user);
      router.push(session.home);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-800">Créer un compte</h1>
      <p className="mt-1 text-sm text-slate-500">Rejoignez Seha en une minute.</p>

      {/* Onglets patient / médecin */}
      <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        {(["patient", "medecin"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              role === r ? "bg-white text-primary-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {r === "patient" ? "🧑 Patient" : "🩺 Médecin"}
          </button>
        ))}
      </div>

      <p className="mt-3 rounded-xl bg-primary-50 px-4 py-2.5 text-xs text-primary-800 ring-1 ring-primary-100">
        {role === "patient"
          ? "Réservez vos rendez-vous, gérez votre dossier médical et vos documents."
          : "Agenda, ordonnancier, certificats, bulletins CNAM. Votre profil public sera vérifié (n° d'inscription à l'Ordre) avant d'apparaître dans l'annuaire."}
      </p>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-accent-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <a
        href={`/api/auth/google/start?role=${role}`}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 transition hover:bg-slate-50"
      >
        <GoogleGlyph /> S'inscrire avec Google
      </a>

      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" /> ou <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">
            {role === "medecin" ? "Nom du praticien" : "Nom complet"}
          </span>
          <input
            required
            value={f.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder={role === "medecin" ? "Dr Prénom Nom" : "Prénom Nom"}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">E-mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={f.email}
            onChange={(e) => set({ email: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Mot de passe</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={f.password}
            onChange={(e) => set({ password: e.target.value })}
            placeholder="Au moins 8 caractères"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
        >
          {busy ? "Création…" : role === "medecin" ? "Créer mon compte médecin" : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Vous avez déjà un compte ?{" "}
        <Link href="/connexion" className="font-semibold text-primary-600 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.8 6.1C12.3 13.3 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.3-4.6 7l7.1 5.5c4.2-3.9 6.9-9.6 6.9-17z" />
      <path fill="#FBBC05" d="M10.4 28.6c-.5-1.4-.8-2.9-.8-4.6s.3-3.2.8-4.6l-7.8-6.1C1 16.5 0 20.1 0 24s1 7.5 2.6 10.7l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.5 2.1-8.8 2.1-6.4 0-11.7-3.8-13.6-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}
