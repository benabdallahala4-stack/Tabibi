"use client";

// Coquille applicative commune (patients et professionnels) : barre latérale
// gauche avec la navigation propre au rôle, thème clair par défaut avec bascule
// sombre, carte de profil et déconnexion. Le thème sombre est limité à cet
// espace (la classe `dark` est posée ici) — le site public reste clair.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { loadSession, logout, ROLE_LABELS, type Role, type Session } from "@/lib/roles";
import { useTheme } from "@/lib/theme";

export interface NavItem {
  id: string;
  label: string;
  icon: string; // path(s) SVG
  href?: string; // lien vers une page ; sinon vue interne (onSelect)
  premium?: boolean;
  badge?: number;
}

const ICON: Record<string, string> = {
  rdv: "M4 5h16M4 5v14h16V5M8 3v4M16 3v4",
  dossier: "M4 4h9l3 3v13H4zM13 4v4h4",
  search: "M11 11a4 4 0 100-8 4 4 0 000 8zM21 21l-5-5",
  account: "M16 14a4 4 0 10-8 0M12 10a3 3 0 100-6 3 3 0 000 6",
  home: "M4 11l8-6 8 6M6 10v9h12v-9",
};

const PATIENT_NAV: NavItem[] = [
  { id: "rdv", label: "Mes rendez-vous", icon: ICON.rdv, href: "/mes-rdv" },
  { id: "dossier", label: "Mon dossier", icon: ICON.dossier, href: "/dossier" },
  { id: "recherche", label: "Trouver un médecin", icon: ICON.search, href: "/recherche" },
  { id: "compte", label: "Mon compte", icon: ICON.account, href: "/compte" },
];

const DOCTOR_NAV: NavItem[] = [
  { id: "dashboard", label: "Tableau de bord", icon: ICON.home, href: "/pro/dashboard" },
  { id: "agenda", label: "Agenda", icon: ICON.rdv, href: "/pro/agenda" },
  { id: "disponibilites", label: "Disponibilités", icon: "M12 8v4l3 2M12 3a9 9 0 100 18 9 9 0 000-18z", href: "/pro/disponibilites" },
  { id: "patients", label: "Patients", icon: ICON.account, href: "/pro/patients" },
  { id: "ordonnances", label: "Ordonnancier", icon: "M7 4h7l4 4v12H7zM14 4v4h4", href: "/pro/ordonnances" },
  { id: "certificats", label: "Certificats", icon: "M5 4h11l3 3v13H5zM8 12h8M8 16h8", href: "/pro/certificats" },
  { id: "bulletin", label: "Bulletin CNAM", icon: "M6 3h9l3 3v15H6zM9 12h6M9 16h6", href: "/pro/bulletin" },
  { id: "tarifs", label: "Abonnement", icon: "M12 2l3 7h7l-5.5 4 2 7L12 16l-6 4 2-7L2 9h7z", href: "/pro/tarifs" },
  { id: "compte", label: "Mon compte", icon: ICON.account, href: "/compte" },
];

export default function AppShell({
  children,
  nav,
  active,
  onSelect,
}: {
  children: React.ReactNode;
  nav?: NavItem[];
  active?: string;
  onSelect?: (id: string) => void;
}) {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => setSession(loadSession()), []);

  // Visiteur non connecté : pas de barre latérale (page publique normale).
  if (!session) return <>{children}</>;

  const role: Role = session.role;
  const items = nav ?? (role === "patient" ? PATIENT_NAV : DOCTOR_NAV);
  const name = session?.name ?? "Mon compte";
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-[calc(100vh-3.75rem)] bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 p-4 lg:flex-row lg:p-6">
          <aside className="lg:w-60 lg:shrink-0 print:hidden">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-300">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800 dark:text-white">{name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{ROLE_LABELS[role]}</p>
                </div>
              </div>

              <nav className="mt-4 space-y-1">
                {items.map((item) => {
                  const isActive = item.href ? pathname === item.href : active === item.id;
                  const cls = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/60 dark:hover:text-white"
                  }`;
                  const inner = (
                    <>
                      <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge ? (
                        <span className="rounded-full bg-accent-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>
                      ) : null}
                      {item.premium ? (
                        <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">Premium</span>
                      ) : null}
                    </>
                  );
                  return item.href ? (
                    <Link key={item.id} href={item.href} className={cls}>{inner}</Link>
                  ) : (
                    <button key={item.id} type="button" onClick={() => onSelect?.(item.id)} className={cls}>{inner}</button>
                  );
                })}
              </nav>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-700">
                <button
                  type="button"
                  onClick={toggle}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/60"
                  aria-label="Basculer le thème"
                >
                  {theme === "dark" ? "☀️ Clair" : "🌙 Sombre"}
                </button>
                <button
                  type="button"
                  onClick={() => { logout(); window.location.href = "/connexion"; }}
                  className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:text-accent-600 dark:text-slate-400"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
  );
}
