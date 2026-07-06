"use client";

// Garde d'accès pour les espaces professionnels. Utilisation dans une page :
//   const gate = useRoleGate(["medecin", "admin"]);
//   ... (tous les autres hooks) ...
//   if (gate) return gate;   // avant le return principal
//
// Démo : vérifie le rôle en localStorage. Production : la vraie protection est
// côté serveur (session + rôle), cette garde n'étant qu'un confort d'UX.

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadSession, logout, ROLE_LABELS, type Role, type Session } from "@/lib/roles";

export function useRoleGate(allow: Role[]): React.ReactElement | null {
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const s = loadSession();
    setSession(s);
    setStatus(s && allow.includes(s.role) ? "ok" : "denied");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "ok") return null;

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center text-slate-400">Chargement…</div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <span className="text-4xl">🔒</span>
        <h1 className="mt-3 text-xl font-bold text-slate-800">Espace réservé</h1>
        <p className="mt-2 text-sm text-slate-500">
          {session ? (
            <>
              Vous êtes connecté en tant que{" "}
              <span className="font-semibold">{ROLE_LABELS[session.role]}</span>. Cet espace est
              réservé aux rôles :{" "}
              <span className="font-semibold">{allow.map((r) => ROLE_LABELS[r]).join(", ")}</span>.
            </>
          ) : (
            <>
              Cet espace est réservé aux professionnels (
              {allow.map((r) => ROLE_LABELS[r]).join(", ")}). Connectez-vous pour continuer.
            </>
          )}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/connexion"
            className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            {session ? "Changer de compte" : "Se connecter"}
          </Link>
          <Link href="/" className="rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Barre discrète « connecté en tant que … · Déconnexion » pour les espaces pro. */
export function SessionBar() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    setSession(loadSession());
  }, []);
  if (!session) return null;
  return (
    <div className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-xs">
        <span className="text-slate-500">
          Connecté : <span className="font-semibold text-slate-700">{session.name}</span>{" "}
          <span className="rounded-full bg-primary-50 px-2 py-0.5 font-medium text-primary-700">
            {ROLE_LABELS[session.role]}
          </span>
        </span>
        <button
          type="button"
          onClick={() => {
            logout();
            window.location.href = "/connexion";
          }}
          className="font-medium text-slate-500 hover:text-accent-600"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
