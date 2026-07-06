"use client";

import Link from "next/link";
import type { Doctor } from "@/lib/types";
import { useLocale } from "@/lib/i18n";

const AVAIL_AR: Record<string, string> = {
  "Aujourd'hui": "اليوم",
  Demain: "غدًا",
  "Cette semaine": "هذا الأسبوع",
};

export default function DoctorCard({ doctor, distanceKm }: { doctor: Doctor; distanceKm?: number }) {
  const { t, locale, city } = useLocale();
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
          {doctor.photoSeed}
        </div>
        <div>
          <Link
            href={`/medecin/${doctor.slug}`}
            className="text-lg font-semibold text-primary-700 hover:underline"
          >
            {locale === "ar" ? doctor.fullNameAr : doctor.fullName}
          </Link>
          <p className="text-sm text-slate-500">
            {locale === "ar" ? doctor.specialtyAr : doctor.specialty} · {city(doctor.city)}
            {distanceKm !== undefined && (
              <span className="ms-2 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700" dir="ltr">
                📍 {distanceKm < 1 ? "<1" : Math.round(distanceKm)} km
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-slate-400" dir="ltr">{doctor.address}</p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
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
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
        <span className="text-xs text-slate-500">
          {t("card.nextAvail")}{" "}
          <span className="font-medium text-emerald-600">
            {locale === "ar"
              ? AVAIL_AR[doctor.nextAvailability] ?? doctor.nextAvailability
              : doctor.nextAvailability}
          </span>
        </span>
        <Link
          href={`/medecin/${doctor.slug}`}
          className="rounded-xl bg-primary-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          {t("card.book")}
        </Link>
        <span className="text-center text-xs text-slate-400 sm:text-end">
          {t("card.consultPrice")} {doctor.priceTnd} {locale === "ar" ? "د.ت" : "DT"}
        </span>
      </div>
    </div>
  );
}
