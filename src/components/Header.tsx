"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLocale } from "@/lib/i18n";

export default function Header() {
  const { t, locale, setLocale } = useLocale();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="Tabibi" className="h-9 w-9" />
          <span className="text-xl font-bold text-primary-700">
            Tabibi <span className="text-sm font-normal text-primary-500">طبيبي</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-3">
          <Link
            href="/recherche"
            className="hidden rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 md:block"
          >
            {t("nav.search")}
          </Link>
          <Link
            href="/cliniques"
            className="hidden rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 md:block"
          >
            {t("nav.clinics")}
          </Link>
          <Link
            href="/mes-rdv"
            className="hidden rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 sm:block"
          >
            {t("nav.myAppointments")}
          </Link>
          <Link
            href="/compte"
            className="rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-100"
            title={t("nav.account")}
          >
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="" className="h-6 w-6 rounded-full" />
            ) : (
              <span>👤</span>
            )}
          </Link>
          <Link
            href="/pro"
            className="hidden rounded-lg bg-primary-600 px-3 py-2 font-medium text-white hover:bg-primary-700 sm:block"
          >
            {t("nav.pro")}
          </Link>
          <button
            type="button"
            onClick={() => setLocale(locale === "fr" ? "ar" : "fr")}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            aria-label="Changer de langue / تغيير اللغة"
          >
            {locale === "fr" ? "العربية" : "FR"}
          </button>
        </nav>
      </div>
    </header>
  );
}
