"use client";

// Mon compte : profil, changement de mot de passe, abonnement, déconnexion.
// Affiché dans la coquille applicative (barre latérale selon le rôle, thème
// clair par défaut avec bascule sombre).

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { cloudMe, type CloudUser } from "@/lib/cloud";
import { loadSession, ROLE_LABELS, type Role } from "@/lib/roles";
import { loadPlan, PLAN_LABELS, type Plan } from "@/lib/plan";

const CARD = "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700";
const INPUT = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100";

export default function AccountPage() {
  const [user, setUser] = useState<CloudUser | null>(null);
  const [role, setRole] = useState<Role>("patient");
  const [plan, setPlan] = useState<Plan>("gratuit");

  useEffect(() => {
    setPlan(loadPlan());
    const local = loadSession();
    if (local) setRole(local.role);
    (async () => {
      const me = await cloudMe();
      if (me) {
        setUser(me);
        if (me.role) setRole(me.role as Role);
      } else if (local) {
        setUser({ id: local.key, name: local.name, role: local.role });
      }
    })();
  }, []);

  const isDoctor = role === "medecin" || role === "admin";

  return (
    <AppShell>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Mon compte</h1>

        {/* Profil */}
        <section className={CARD}>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-300">
              {(user?.name ?? "?").trim().charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-lg font-bold text-slate-800 dark:text-white">{user?.name ?? "Mon compte"}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email ?? "—"}</p>
              <span className="mt-1 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
                {ROLE_LABELS[role]}
              </span>
            </div>
          </div>
        </section>

        {/* Abonnement */}
        <section className={CARD}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white">Abonnement</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Plan actuel : <span className="font-semibold text-slate-700 dark:text-slate-200">{PLAN_LABELS[plan] ?? "Gratuit"}</span>
              </p>
            </div>
            <Link
              href={isDoctor ? "/pro/tarifs" : "/pro"}
              className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
            >
              {isDoctor ? "Gérer / changer d'abonnement" : "Découvrir Seha Pro"}
            </Link>
          </div>
        </section>

        {/* Mot de passe */}
        <ChangePassword />
      </div>
    </AppShell>
  );
}

function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      const data = await res.json();
      if (!res.ok) setMsg({ ok: false, text: data.error ?? "Échec du changement." });
      else {
        setMsg({ ok: true, text: "Mot de passe mis à jour." });
        setCurrent("");
        setNext("");
      }
    } catch {
      setMsg({ ok: false, text: "Erreur réseau." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={CARD}>
      <h2 className="font-bold text-slate-800 dark:text-white">Changer mon mot de passe</h2>
      <form onSubmit={submit} className="mt-3 grid max-w-sm gap-3">
        <input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Mot de passe actuel" className={INPUT} />
        <input type="password" autoComplete="new-password" minLength={8} required value={next} onChange={(e) => setNext(e.target.value)} placeholder="Nouveau mot de passe (min. 8)" className={INPUT} />
        {msg && (
          <p className={`text-sm ${msg.ok ? "text-emerald-600 dark:text-emerald-400" : "text-accent-600"}`}>{msg.text}</p>
        )}
        <button type="submit" disabled={busy} className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {busy ? "Mise à jour…" : "Mettre à jour"}
        </button>
      </form>
      <p className="mt-3 text-xs text-slate-400">
        Compte créé via Google ? Laissez « actuel » vide pour définir un premier mot de passe.
      </p>
    </section>
  );
}
