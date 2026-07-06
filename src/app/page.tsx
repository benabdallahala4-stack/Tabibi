"use client";

import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { DOCTORS, SPECIALTIES } from "@/lib/data";
import { ARTICLES } from "@/lib/articles";
import { useLocale } from "@/lib/i18n";

export default function HomePage() {
  const { t, locale, city } = useLocale();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-primary-100">
            {t("home.heroText")}{" "}
            <span dir="rtl" className="font-medium">صحتك أولويتنا</span>
          </p>
          <div className="mt-8 max-w-3xl">
            <SearchBar />
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-primary-100">
            <span className="rounded-full bg-white/10 px-3 py-1">{t("home.badge.free")}</span>
            <span className="rounded-full bg-white/10 px-3 py-1">{t("home.badge.reminders")}</span>
            <span className="rounded-full bg-white/10 px-3 py-1">{t("home.badge.tele")}</span>
            <span className="rounded-full bg-white/10 px-3 py-1">{t("home.badge.cnam")}</span>
          </div>
        </div>
      </section>

      {/* Spécialités populaires */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-bold text-slate-800">{t("home.specialties")}</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SPECIALTIES.map((s) => (
            <Link
              key={s.id}
              href={`/recherche?q=${encodeURIComponent(s.label)}`}
              className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:ring-primary-400"
            >
              <span className="text-2xl">{s.emoji}</span>
              <span>
                <span className="block text-sm font-medium text-slate-700">
                  {locale === "ar" ? s.labelAr : s.label}
                </span>
                <span className="block text-xs text-slate-400" dir={locale === "ar" ? "ltr" : "rtl"}>
                  {locale === "ar" ? s.label : s.labelAr}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl font-bold text-slate-800">{t("home.how")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {(["1", "2", "3"] as const).map((step) => (
              <div key={step} className="rounded-2xl bg-slate-50 p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 font-bold text-white">
                  {step}
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">{t(`home.step${step}.title`)}</h3>
                <p className="mt-1 text-sm text-slate-500">{t(`home.step${step}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Médecins mis en avant */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">{t("home.available")}</h2>
          <Link href="/recherche" className="text-sm font-medium text-primary-600 hover:underline">
            {t("home.seeAll")}
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {DOCTORS.filter((d) => d.nextAvailability === "Aujourd'hui")
            .slice(0, 4)
            .map((d) => (
              <Link
                key={d.slug}
                href={`/medecin/${d.slug}`}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:ring-primary-400"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700">
                  {d.photoSeed}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    {locale === "ar" ? d.fullNameAr : d.fullName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {locale === "ar" ? d.specialtyAr : d.specialty} · {city(d.city)}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                  {t("home.today")}
                </span>
              </Link>
            ))}
        </div>
      </section>

      {/* Magazine Santé */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              📰 {locale === "ar" ? "مجلة الصحة" : "Magazine Santé"}
            </h2>
            <Link href="/sante" className="text-sm font-medium text-primary-600 hover:underline">
              {locale === "ar" ? "← كل المقالات" : "Tous les articles →"}
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {ARTICLES.slice(0, 3).map((a) => (
              <Link
                key={a.slug}
                href={`/sante/${a.slug}`}
                className="group overflow-hidden rounded-2xl ring-1 ring-slate-200 transition hover:shadow-md"
              >
                <div
                  className="flex h-24 items-center justify-center text-4xl"
                  style={{ background: `linear-gradient(135deg, ${a.gradient[0]}, ${a.gradient[1]})` }}
                >
                  <span className="transition group-hover:scale-110">{a.emoji}</span>
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-primary-600">
                    {locale === "ar" ? a.categoryAr : a.category}
                  </span>
                  <p className="mt-1 text-sm font-semibold leading-snug text-slate-800">
                    {locale === "ar" ? a.titleAr : a.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cliniques & international */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-800 p-8 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold">🏥 {t("home.clinicsTitle")}</h2>
            <p className="mt-1 max-w-xl text-sm text-violet-100">{t("home.clinicsText")}</p>
          </div>
          <Link
            href="/cliniques"
            className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            {t("home.clinicsCta")}
          </Link>
        </div>
      </section>

      {/* Bandeau pro */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary-700 to-primary-600 p-8 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold">{t("home.proBanner.title")}</h2>
            <p className="mt-1 text-sm text-primary-100">{t("home.proBanner.text")}</p>
          </div>
          <Link
            href="/pro"
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
          >
            {t("home.proBanner.cta")}
          </Link>
        </div>
      </section>
    </>
  );
}
