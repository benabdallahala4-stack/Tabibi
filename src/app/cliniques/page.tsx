"use client";

import Link from "next/link";
import { CLINICS } from "@/lib/clinics";
import { useLocale } from "@/lib/i18n";

export default function CliniquesPage() {
  const { t, locale, city } = useLocale();
  const fr = locale === "fr";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">{t("clinics.title")}</h1>
      <p className="mt-1 text-sm text-slate-500">{t("clinics.sub")}</p>

      {/* Bandeau patients internationaux / Libye */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-800 p-6 text-white">
        <h2 className="text-lg font-bold">🇱🇾 {t("clinics.libyaTitle")}</h2>
        <p className="mt-1 max-w-2xl text-sm text-violet-100">{t("clinics.libyaText")}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white/15 px-3 py-1">{fr ? "Devis avant le voyage" : "تسعيرة قبل السفر"}</span>
          <span className="rounded-full bg-white/15 px-3 py-1">{fr ? "Guichet dédié en arabe" : "مكتب استقبال بالعربية"}</span>
          <span className="rounded-full bg-white/15 px-3 py-1">{fr ? "Coordination séjour + transport" : "تنسيق الإقامة والنقل"}</span>
          <span className="rounded-full bg-white/15 px-3 py-1">{fr ? "Suivi à distance après retour" : "متابعة عن بُعد بعد العودة"}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {CLINICS.map((c) => (
          <Link
            key={c.slug}
            href={`/clinique/${c.slug}`}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:ring-primary-400"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-bold text-primary-700">{fr ? c.name : c.nameAr}</h2>
                <p className="text-sm text-slate-500">
                  {city(c.city)} · {c.beds} {fr ? "lits" : "سرير"}
                </p>
              </div>
              <span className="text-3xl">🏥</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{c.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
              {c.emergency24h && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-700">
                  {fr ? "Urgences 24h/24" : "استعجالي 24/24"}
                </span>
              )}
              {c.international.libyaDesk && (
                <span className="rounded-full bg-violet-50 px-2 py-0.5 font-medium text-violet-700">
                  {fr ? "Guichet patients libyens" : "مكتب المرضى الليبيين"}
                </span>
              )}
              {c.specialties.slice(0, 3).map((s) => (
                <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                  {s}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">{t("clinics.disclaimer")}</p>
    </div>
  );
}
