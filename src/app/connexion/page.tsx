"use client";

// Connexion réelle : e-mail + mot de passe, ou Google.
// Le rôle (patient / médecin) est porté par le compte serveur et vérifié en
// base ; après connexion on redirige vers l'espace correspondant au rôle.

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { saveSession } from "@/lib/roles";

const GOOGLE_ERRORS: Record<string, string> = {
  google_indisponible: "La connexion Google n'est pas encore activée. Utilisez votre e-mail.",
  google_state: "Session Google expirée, réessayez.",
  google_token: "Échec de l'authentification Google.",
  google_profil: "Impossible de lire votre profil Google.",
  google_email: "Aucune adresse e-mail Google disponible.",
  db_indisponible: "Service indisponible pour le moment.",
};

function ConnexionInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(GOOGLE_ERRORS[params.get("error") ?? ""] ?? "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Connexion impossible.");
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
      <h1 className="text-2xl font-bold text-slate-800">Connexion</h1>
      <p className="mt-1 text-sm text-slate-500">
        Accédez à votre espace patient ou médecin.
      </p>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-accent-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <a
        href="/api/auth/google/start"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 transition hover:bg-slate-50"
      >
        <GoogleGlyph /> Continuer avec Google
      </a>

      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" /> ou <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">E-mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Mot de passe</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
        >
          {busy ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-primary-600 hover:underline">
          Créer un compte
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-slate-400">
        Vous cherchez juste un médecin ?{" "}
        <Link href="/recherche" className="font-medium text-primary-600 hover:underline">
          Rechercher sans compte
        </Link>
      </p>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-24 text-center text-slate-400">Chargement…</div>}>
      <ConnexionInner />
    </Suspense>
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
