"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProfile, saveProfile } from "@/lib/profile";
import { useLocale } from "@/lib/i18n";
import { cloudMe, cloudLogout, type CloudUser } from "@/lib/cloud";
import { loadSession, logout as clearClientSession, ROLE_LABELS, type Role } from "@/lib/roles";

export default function AccountPage() {
  const { t, locale } = useLocale();
  const fr = locale === "fr";
  const [user, setUser] = useState<CloudUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [profile, setProfile] = useState({ name: "", phone: "", email: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    const local = loadSession();
    // Priorité au compte serveur (cookie) ; repli sur la session cliente.
    (async () => {
      const me = await cloudMe();
      if (me) setUser(me);
      else if (local) setUser({ id: local.key, name: local.name, role: local.role });
      setChecked(true);
    })();
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function doLogout() {
    await cloudLogout();
    clearClientSession();
    setUser(null);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">{t("account.title")}</h1>

      {/* Compte */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        {!checked ? (
          <p className="text-sm text-slate-400">{fr ? "Chargement…" : "جارٍ التحميل…"}</p>
        ) : user ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                {(user.name ?? "?").trim().charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm text-slate-500">{fr ? "Connecté en tant que" : "متصل بصفة"}</p>
                <p className="font-semibold text-slate-800">{user.name ?? user.email}</p>
                {user.role && (
                  <span className="mt-0.5 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                    {ROLE_LABELS[user.role as Role] ?? user.role}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={doLogout}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
            >
              {fr ? "Se déconnecter" : "تسجيل الخروج"}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-slate-600">
              {fr ? "Vous n'êtes pas connecté." : "لست متصلاً."}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                href="/connexion"
                className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                {fr ? "Se connecter" : "تسجيل الدخول"}
              </Link>
              <Link
                href="/inscription"
                className="rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                {fr ? "Créer un compte" : "إنشاء حساب"}
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Profil local (pré-remplissage des réservations) */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-800">{t("account.profileTitle")}</h2>
        <p className="mt-1 text-sm text-slate-500">{t("account.profileText")}</p>
        <form onSubmit={save} className="mt-4 grid gap-3">
          <input
            type="text"
            placeholder={t("booking.name")}
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
          />
          <input
            type="tel"
            placeholder={t("booking.phone")}
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
          />
          <input
            type="email"
            placeholder={t("booking.email")}
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            {saved ? t("account.saved") : t("account.save")}
          </button>
        </form>
      </section>

      {/* Dossier médical */}
      <a
        href="/dossier"
        className="mt-6 flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:ring-primary-400"
      >
        <span>
          <span className="block font-semibold text-slate-800">🗄️ {t("nav.dossier")}</span>
          <span className="mt-0.5 block text-sm text-slate-500">
            {fr
              ? "Allergies, traitements, documents (photos/PDF) et partage sécurisé avec votre médecin."
              : "الحساسية، الأدوية، الوثائق (صور/PDF) والمشاركة الآمنة مع طبيبك."}
          </span>
        </span>
        <span className="text-2xl text-slate-300">›</span>
      </a>

      {/* Où sont mes données ? */}
      <section className="mt-6 rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-100">
        <h2 className="font-semibold text-primary-900">💡 {t("account.whereTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-primary-800">{t("account.whereText")}</p>
      </section>
    </div>
  );
}
