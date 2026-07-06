// Rôles & contrôle d'accès (démo).
//
// Le site distingue cinq rôles. Les espaces professionnels ne doivent JAMAIS
// être accessibles au grand public — ils sont protégés par RoleGuard.
//
// Démo : la « session » est un rôle choisi sur /connexion et stocké en
// localStorage (comptes fictifs ci-dessous). Production : rôle porté par le
// compte (champ User.role), vérifié côté serveur à chaque requête + OTP/session
// (voir docs/ARCHITECTURE.md et docs/ROLES.md).

export type Role = "patient" | "medecin" | "clinique" | "labo" | "admin";

export const ROLE_LABELS: Record<Role, string> = {
  patient: "Patient",
  medecin: "Médecin",
  clinique: "Clinique",
  labo: "Laboratoire",
  admin: "Administration",
};

export interface MockUser {
  key: string;
  role: Role;
  name: string;
  phone: string; // pour l'OTP SMS en production
  home: string; // page d'accueil après connexion
  desc: string;
  doctorSlug?: string;
  clinicSlug?: string;
}

/** Comptes de test — à utiliser pour explorer chaque rôle. */
export const MOCK_USERS: MockUser[] = [
  {
    key: "patiente-yasmine",
    role: "patient",
    name: "Yasmine Gharbi",
    phone: "+216 20 000 001",
    home: "/mes-rdv",
    desc: "Réserve des rendez-vous, gère son dossier médical et ses documents.",
  },
  {
    key: "dr-ben-salah",
    role: "medecin",
    name: "Dr Amine Ben Salah",
    phone: "+216 20 000 002",
    home: "/pro/dashboard",
    doctorSlug: "dr-amine-ben-salah-cardiologie-tunis",
    desc: "Agenda, dossiers patients, caisse, file d'attente, questions publiques.",
  },
  {
    key: "clinique-carthage",
    role: "clinique",
    name: "Clinique Carthage Internationale",
    phone: "+216 71 000 003",
    home: "/clinique-admin",
    clinicSlug: "clinique-carthage-internationale-tunis",
    desc: "Demandes de devis, praticiens rattachés, statistiques internationales.",
  },
  {
    key: "labo-ibn-sina",
    role: "labo",
    name: "Laboratoire Ibn Sina",
    phone: "+216 71 000 004",
    home: "/labo",
    desc: "Dépôt des résultats d'analyses dans le dossier du patient.",
  },
  {
    key: "admin-seha",
    role: "admin",
    name: "Équipe Seha",
    phone: "+216 20 000 009",
    home: "/admin",
    desc: "Vérification des inscriptions, invitations médecins, modération.",
  },
];

export interface Session {
  key: string;
  role: Role;
  name: string;
  home: string;
}

const KEY = "seha.session";

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function loginAs(user: MockUser): void {
  const session: Session = { key: user.key, role: user.role, name: user.name, home: user.home };
  window.localStorage.setItem(KEY, JSON.stringify(session));
}

export function logout(): void {
  window.localStorage.removeItem(KEY);
}

/** Matrice d'accès : rôles autorisés par espace protégé (source de vérité). */
export const ACCESS: Record<string, Role[]> = {
  "/pro/dashboard": ["medecin", "admin"],
  "/clinique-admin": ["clinique", "admin"],
  "/labo": ["labo", "medecin", "admin"], // le labo dépose ; un médecin peut tester
  "/admin": ["admin"],
};
