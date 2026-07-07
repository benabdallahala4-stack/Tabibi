"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n";
import { loadSession, logout, ROLE_LABELS, type Session } from "@/lib/roles";
import { useTheme } from "@/lib/theme";

export default function Header() {
  const { t, locale, setLocale } = useLocale();
  const { theme, toggle } = useTheme();
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setSession(loadSession()), []);
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const langBtn = (
    <button
      type="button"
      onClick={() => setLocale(locale === "fr" ? "ar" : "fr")}
      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
      aria-label="Changer de langue / تغيير اللغة"
    >
      {locale === "fr" ? "العربية" : "FR"}
    </button>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="Seha" className="h-9 w-9" />
          <span className="text-xl font-bold text-primary-700">
            Seha <span className="text-sm font-normal text-primary-500">صحة</span>
          </span>
        </Link>

        {session ? (
          <nav className="flex items-center gap-2 text-sm">
            <Link href={session.home} className="hidden rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 sm:block">
              {locale === "ar" ? "مساحتي" : "Mon espace"}
            </Link>
            {langBtn}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  {session.name.trim().charAt(0).toUpperCase() || "👤"}
                </span>
                <span className="hidden max-w-[9rem] truncate font-medium text-slate-700 sm:block">{session.name}</span>
              </button>
              {open && (
                <div className="absolute end-0 mt-2 w-56 overflow-hidden rounded-xl bg-white py-1 shadow-lg ring-1 ring-slate-200">
                  <div className="border-b border-slate-100 px-4 py-2">
                    <p className="truncate text-sm font-semibold text-slate-800">{session.name}</p>
                    <p className="text-xs text-slate-400">{ROLE_LABELS[session.role]}</p>
                  </div>
                  <Link href={session.home} onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                    🏠 {locale === "ar" ? "مساحتي" : "Mon espace"}
                  </Link>
                  <Link href="/compte" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                    ⚙️ {locale === "ar" ? "حسابي" : "Mon compte"}
                  </Link>
                  <button type="button" onClick={() => { toggle(); }} className="block w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50">
                    {theme === "dark" ? "☀️ " : "🌙 "}{locale === "ar" ? "المظهر" : "Thème"} : {theme === "dark" ? (locale === "ar" ? "فاتح" : "clair") : (locale === "ar" ? "داكن" : "sombre")}
                  </button>
                  <button
                    type="button"
                    onClick={() => { logout(); window.location.href = "/connexion"; }}
                    className="block w-full border-t border-slate-100 px-4 py-2 text-left text-sm font-medium text-accent-600 hover:bg-red-50"
                  >
                    ⏻ {locale === "ar" ? "تسجيل الخروج" : "Déconnexion"}
                  </button>
                </div>
              )}
            </div>
          </nav>
        ) : (
          <nav className="flex items-center gap-1 text-sm sm:gap-3">
            <Link href="/recherche" className="hidden rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 md:block">{t("nav.search")}</Link>
            <Link href="/cliniques" className="hidden rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 md:block">{t("nav.clinics")}</Link>
            <Link href="/questions" className="hidden rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 lg:block">💬 {t("nav.qna")}</Link>
            <Link href="/connexion" className="rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-100">
              {locale === "ar" ? "دخول" : "Connexion"}
            </Link>
            <Link href="/pro" className="hidden rounded-lg bg-primary-600 px-3 py-2 font-medium text-white hover:bg-primary-700 sm:block">{t("nav.pro")}</Link>
            {langBtn}
          </nav>
        )}
      </div>
    </header>
  );
}
