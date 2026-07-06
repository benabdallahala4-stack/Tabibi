"use client";

// Connexion (démo) : choisir un compte de test par rôle. En production, cette
// page devient l'OTP SMS / Google, et le rôle est porté par le compte serveur.

import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAs, MOCK_USERS, ROLE_LABELS, type MockUser } from "@/lib/roles";

const ROLE_STYLE: Record<string, string> = {
  patient: "bg-sky-50 text-sky-700",
  medecin: "bg-primary-50 text-primary-700",
  clinique: "bg-violet-50 text-violet-700",
  labo: "bg-amber-50 text-amber-700",
  admin: "bg-slate-800 text-white",
};

export default function ConnexionPage() {
  const router = useRouter();

  function connect(user: MockUser) {
    loginAs(user);
    router.push(user.home);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-800">Connexion</h1>
      <p className="mt-1 text-sm text-slate-500">
        Choisissez un compte de démonstration pour explorer chaque espace. En production, la
        connexion se fait par SMS (OTP) ou Google, et chaque personne n'accède qu'à son propre
        espace selon son rôle vérifié.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {MOCK_USERS.map((u) => (
          <button
            key={u.key}
            type="button"
            onClick={() => connect(u)}
            className="group rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-primary-400"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-800">{u.name}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_STYLE[u.role]}`}>
                {ROLE_LABELS[u.role]}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{u.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
              Se connecter en tant que {ROLE_LABELS[u.role].toLowerCase()} →
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-primary-50 p-5 text-sm text-primary-900 ring-1 ring-primary-100">
        <p className="font-semibold">💡 Comptes de test</p>
        <p className="mt-1 text-primary-800">
          Ces comptes fictifs servent à tester les rôles. Ils sont aussi créés en base par le script
          de démarrage Docker (voir <span className="font-mono">docs/ROLES.md</span>). Les patients
          n'ont pas besoin de se connecter pour réserver — seuls les espaces professionnels sont
          protégés.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Vous êtes patient ?{" "}
        <Link href="/recherche" className="font-medium text-primary-600 hover:underline">
          Trouvez un médecin sans compte
        </Link>
      </p>
    </div>
  );
}
