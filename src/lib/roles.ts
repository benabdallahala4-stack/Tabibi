// Rôles & contrôle d'accès.
//
// Le site distingue six rôles. Les espaces professionnels ne doivent JAMAIS
// être accessibles au grand public — ils sont protégés par RoleGuard.
//
// La « session » cliente (localStorage) porte le rôle pour l'UX ; la vraie
// protection est côté serveur (cookie HMAC + User.role relu en base).

export type Role = "patient" | "medecin" | "secretaire" | "clinique" | "labo" | "admin";

export const ROLE_LABELS: Record<Role, string> = {
  patient: "Patient",
  medecin: "Médecin",
  secretaire: "Secrétaire",
  clinique: "Clinique",
  labo: "Laboratoire",
  admin: "Administration",
};

export interface Session {
  key: string;
  role: Role;
  name: string;
  home: string;
}

const KEY = "seha.session";

/** Page d'accueil par défaut selon le rôle (après connexion). */
export const HOME_BY_ROLE: Record<Role, string> = {
  patient: "/mes-rdv",
  medecin: "/pro/dashboard",
  secretaire: "/pro/agenda",
  clinique: "/clinique-admin",
  labo: "/labo",
  admin: "/admin",
};

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

/** Enregistre la session cliente à partir d'un utilisateur serveur (réel). */
export function saveSession(user: { id: string; name?: string | null; role: string }): Session {
  const role = (user.role as Role) ?? "patient";
  const session: Session = {
    key: user.id,
    role,
    name: user.name ?? "Mon compte",
    home: HOME_BY_ROLE[role] ?? "/",
  };
  window.localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function logout(): void {
  window.localStorage.removeItem(KEY);
  // Efface aussi le cookie de session serveur (best-effort).
  if (typeof fetch !== "undefined") {
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  }
}

/** Matrice d'accès : rôles autorisés par espace protégé (source de vérité). */
export const ACCESS: Record<string, Role[]> = {
  "/pro/dashboard": ["medecin", "admin"],
  "/pro/agenda": ["medecin", "secretaire", "admin"], // la secrétaire gère l'agenda
  "/pro/ordonnances": ["medecin", "admin"], // clinique : médecin uniquement
  "/pro/certificats": ["medecin", "admin"],
  "/pro/bulletin": ["medecin", "secretaire", "admin"], // la secrétaire prépare les bulletins
  "/clinique-admin": ["clinique", "admin"],
  "/labo": ["labo", "medecin", "admin"], // le labo dépose ; un médecin peut tester
  "/admin": ["admin"],
};
