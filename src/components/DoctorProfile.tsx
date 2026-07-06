"use client";

import { useState } from "react";
import BookingWidget from "@/components/BookingWidget";
import type { Doctor } from "@/lib/types";
import { mapsEmbedUrl, mapsUrl } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500" aria-label={`${rating}/5`}>
      {"★".repeat(Math.round(rating))}
      <span className="text-slate-300">{"★".repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

const SOCIAL_META: Record<string, { label: string; emoji: string }> = {
  facebook: { label: "Facebook", emoji: "📘" },
  instagram: { label: "Instagram", emoji: "📸" },
  linkedin: { label: "LinkedIn", emoji: "💼" },
  website: { label: "Site web", emoji: "🌐" },
};

export default function DoctorProfile({ doctor }: { doctor: Doctor }) {
  const { t, locale, city } = useLocale();
  const [showCalendly, setShowCalendly] = useState(false);
  const socials = Object.entries(doctor.socials ?? {}).filter(([, url]) => !!url);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* En-tête praticien */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
          {doctor.photoSeed}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">
            {locale === "ar" ? doctor.fullNameAr : doctor.fullName}{" "}
            <span className="text-base font-normal text-slate-400" dir={locale === "ar" ? "ltr" : "rtl"}>
              {locale === "ar" ? doctor.fullName : doctor.fullNameAr}
            </span>
          </h1>
          <p className="text-slate-500">
            {locale === "ar" ? doctor.specialtyAr : doctor.specialty} · {city(doctor.city)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
            {doctor.cnam && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                {t("card.cnam")}
              </span>
            )}
            {doctor.teleconsultation && (
              <span className="rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-700">
                {t("card.tele")}
              </span>
            )}
            <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
              ★ {doctor.rating} ({doctor.reviewCount} {t("card.reviews")})
            </span>
          </div>
          {socials.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {socials.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 transition hover:bg-slate-200"
                >
                  {SOCIAL_META[key]?.emoji} {SOCIAL_META[key]?.label ?? key}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="text-sm text-slate-500 sm:text-end">
          <p className="font-semibold text-slate-700">
            {doctor.priceTnd} {locale === "ar" ? "د.ت" : "DT"}
          </p>
          <p className="text-xs">{t("doc.basePrice")}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Colonne infos */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-800">{t("doc.presentation")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{doctor.bio}</p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-800">{t("doc.education")}</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
              {doctor.education.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-800">{t("doc.practicalInfo")}</h2>
            <dl className="mt-2 space-y-2 text-sm">
              <div>
                <dt className="font-medium text-slate-700">{t("doc.address")}</dt>
                <dd className="text-slate-500" dir="ltr">{doctor.address}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">{t("doc.languages")}</dt>
                <dd className="text-slate-500">{doctor.languages.join(", ")}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">{t("doc.payment")}</dt>
                <dd className="text-slate-500">
                  {t("doc.paymentText")}
                  {doctor.cnam ? t("doc.cnamCovered") : ""}
                </dd>
              </div>
            </dl>
          </section>

          {/* Localisation Google Maps */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-800">📍 {t("doc.location")}</h2>
            <div className="mt-3 overflow-hidden rounded-xl">
              <iframe
                src={mapsEmbedUrl(doctor)}
                className="h-52 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Google Maps — ${doctor.fullName}`}
              />
            </div>
            <a
              href={mapsUrl(doctor)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-primary-600 hover:underline"
            >
              {t("doc.openMaps")}
            </a>
          </section>

          {/* Avis Google */}
          {doctor.googleReviews && doctor.googleReviews.length > 0 && (
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-bold text-slate-800">
                <span dir="ltr">G</span> {t("doc.gmapsReviews")}
              </h2>
              <div className="mt-3 space-y-4">
                {doctor.googleReviews.map((r) => (
                  <div key={`${r.author}-${r.date}`} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">{r.author}</span>
                      <span className="text-xs text-slate-400" dir="ltr">{r.date}</span>
                    </div>
                    <Stars rating={r.rating} />
                    <p className="mt-1 text-sm text-slate-600">{r.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">{t("doc.gmapsNote")}</p>
            </section>
          )}
        </div>

        {/* Colonne réservation */}
        <div className="space-y-6 lg:col-span-3">
          <BookingWidget doctor={doctor} />

          {/* Calendly optionnel */}
          {doctor.calendlyUrl && (
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">🗓️ {t("doc.calendly")}</h2>
                  <p className="mt-1 text-sm text-slate-500">{t("doc.calendlyNote")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalendly((v) => !v)}
                  className="shrink-0 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  {showCalendly ? "−" : "+"}
                </button>
              </div>
              {showCalendly && (
                <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-slate-100">
                  <iframe
                    src={`${doctor.calendlyUrl}?hide_gdpr_banner=1`}
                    className="h-[600px] w-full border-0"
                    title="Calendly"
                  />
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
