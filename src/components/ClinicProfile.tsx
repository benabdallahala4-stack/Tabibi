"use client";

import Link from "next/link";
import DoctorCard from "@/components/DoctorCard";
import { DOCTORS } from "@/lib/data";
import { clinicMapsEmbedUrl, type Clinic } from "@/lib/clinics";
import { useLocale } from "@/lib/i18n";

export default function ClinicProfile({ clinic }: { clinic: Clinic }) {
  const { t, locale, city } = useLocale();
  const fr = locale === "fr";
  const doctors = DOCTORS.filter((d) => clinic.doctorSlugs.includes(d.slug));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {fr ? clinic.name : clinic.nameAr}{" "}
              <span className="text-base font-normal text-slate-400" dir={fr ? "rtl" : "ltr"}>
                {fr ? clinic.nameAr : clinic.name}
              </span>
            </h1>
            <p className="text-slate-500">
              {city(clinic.city)} · <span dir="ltr">{clinic.address}</span>
            </p>
            <p className="mt-1 text-sm text-slate-400" dir="ltr">
              ☎ {clinic.phone}
            </p>
          </div>
          <span className="text-5xl">🏥</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{clinic.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
          {clinic.emergency24h && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-700">
              {fr ? "Urgences 24h/24" : "استعجالي 24/24"}
            </span>
          )}
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
            {clinic.beds} {fr ? "lits" : "سرير"}
          </span>
          {clinic.specialties.map((s) => (
            <span key={s} className="rounded-full bg-primary-50 px-2 py-0.5 text-primary-700">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Patients internationaux */}
      {clinic.international.libyaDesk && (
        <section className="mt-6 rounded-2xl bg-violet-50 p-6 ring-1 ring-violet-100">
          <h2 className="text-lg font-bold text-violet-900">🇱🇾 {t("clinics.libyaTitle")}</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-violet-800">
            {clinic.international.services.map((s) => (
              <li key={s}>✓ {s}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-violet-600">
            {fr ? "Langues parlées : " : "اللغات: "}
            {clinic.international.languages.join(", ")}
          </p>
        </section>
      )}

      {/* Praticiens de la clinique */}
      <section className="mt-6">
        <h2 className="text-lg font-bold text-slate-800">{t("clinics.doctors")}</h2>
        <div className="mt-3 space-y-4">
          {doctors.map((d) => (
            <DoctorCard key={d.slug} doctor={d} />
          ))}
          {doctors.length === 0 && (
            <p className="text-sm text-slate-400">—</p>
          )}
        </div>
      </section>

      {/* Localisation */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-800">📍 {t("doc.location")}</h2>
        <div className="mt-3 overflow-hidden rounded-xl">
          <iframe
            src={clinicMapsEmbedUrl(clinic)}
            className="h-56 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Google Maps — ${clinic.name}`}
          />
        </div>
      </section>

      <div className="mt-6">
        <Link href="/cliniques" className="text-sm font-medium text-primary-600 hover:underline">
          ← {t("clinics.title")}
        </Link>
      </div>
    </div>
  );
}
