"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { loadProfile, saveProfile } from "@/lib/profile";
import { useLocale } from "@/lib/i18n";

function SmsOtpBlock() {
  const { t } = useLocale();
  const fr = t("account.whereTitle") === "Où sont enregistrés mes rendez-vous ?";
  const [phone, setPhone] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [entered, setEntered] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setVerified(window.localStorage.getItem("tabibi.phoneVerified") === "1");
  }, []);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (phone.trim().length < 8) return;
    // Démo : le code est affiché à l'écran. Production : envoi via passerelle
    // SMS tunisienne (Orange / Ooredoo / Tunisie Télécom ou agrégateur).
    setSentCode(String(Math.floor(1000 + Math.random() * 9000)));
    setEntered("");
  }

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (entered === sentCode) {
      window.localStorage.setItem("tabibi.phoneVerified", "1");
      setVerified(true);
    }
  }

  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-bold text-slate-800">
        📲 {fr ? "Vérifier mon numéro par SMS" : "التحقق من رقمي عبر SMS"}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {fr
          ? "Un numéro vérifié fiabilise vos réservations et prépare la connexion par SMS (OTP)."
          : "الرقم الموثّق يعزز موثوقية حجوزاتك ويمهد لتسجيل الدخول عبر SMS."}
      </p>
      {verified ? (
        <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
          ✓ {fr ? "Numéro vérifié" : "الرقم موثّق"}
        </p>
      ) : sentCode ? (
        <form onSubmit={check} className="mt-4 space-y-2">
          <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
            {fr
              ? `Démo (pas d'envoi SMS réel) — votre code : ${sentCode}. En production, il arriverait par SMS via Orange/Ooredoo/Tunisie Télécom.`
              : `تجريبي (دون إرسال فعلي) — رمزك: ${sentCode}. في الإنتاج يصلك عبر SMS من Orange/Ooredoo/اتصالات تونس.`}
          </p>
          <div className="flex gap-2">
            <input
              value={entered}
              onChange={(e) => setEntered(e.target.value)}
              placeholder={fr ? "Code à 4 chiffres" : "رمز من 4 أرقام"}
              maxLength={4}
              className="w-40 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
              dir="ltr"
            />
            <button className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
              {fr ? "Vérifier" : "تحقق"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={send} className="mt-4 flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={fr ? "Ex. 22 123 456" : "مثال: 22 123 456"}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            dir="ltr"
          />
          <button className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
            {fr ? "Recevoir le code" : "أرسل الرمز"}
          </button>
        </form>
      )}
    </section>
  );
}

export default function AccountPage() {
  const { t } = useLocale();
  const { data: session, status } = useSession();
  const [googleAvailable, setGoogleAvailable] = useState<boolean | null>(null);
  const [profile, setProfile] = useState({ name: "", phone: "", email: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    // Le bouton Google n'est proposé que si le fournisseur est configuré côté serveur.
    fetch("/api/auth/providers")
      .then((r) => (r.ok ? r.json() : {}))
      .then((providers: Record<string, unknown>) => setGoogleAvailable(!!providers?.google))
      .catch(() => setGoogleAvailable(false));
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">{t("account.title")}</h1>

      {/* Connexion Google */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        {status === "authenticated" && session?.user ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {session.user.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" className="h-11 w-11 rounded-full" />
              )}
              <div>
                <p className="text-sm text-slate-500">{t("account.loggedAs")}</p>
                <p className="font-semibold text-slate-800">
                  {session.user.name ?? session.user.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
            >
              {t("account.logout")}
            </button>
          </div>
        ) : googleAvailable ? (
          <button
            type="button"
            onClick={() => signIn("google")}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.7 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
              <path fill="#FBBC05" d="M10.4 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1z"/>
              <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2.1 1.4-4.7 2.2-7.7 2.2-6.3 0-11.7-3.7-13.6-9.2l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/>
            </svg>
            {t("account.googleCta")}
          </button>
        ) : (
          <p className="text-sm text-slate-500">
            {googleAvailable === null ? t("common.loading") : t("account.googleNotConfigured")}
          </p>
        )}
      </section>

      {/* Vérification SMS (démo) */}
      <SmsOtpBlock />

      {/* Profil local */}
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
            {t("account.whereTitle") === "Où sont enregistrés mes rendez-vous ?"
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
