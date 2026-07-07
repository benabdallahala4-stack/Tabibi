"use client";

import { useState } from "react";
import BookingWidget from "@/components/BookingWidget";
import VerifiedReviews from "@/components/VerifiedReviews";
import Link from "next/link";
import type { Doctor } from "@/lib/types";
import { mapsEmbedUrl, mapsUrl } from "@/lib/data";
import { doctorInsurance, insurerLabel } from "@/lib/insurance";
import { FacebookIcon, InstagramIcon, LinkedInIcon, GlobeIcon } from "@/components/Icons";
import { useLocale } from "@/lib/i18n";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500" aria-label={`${rating}/5`}>
      {"★".repeat(Math.round(rating))}
      <span className="text-slate-300">{"★".repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

const SOCIAL_META: Record<string, { label: string; className: string; Icon: React.ComponentType<{ className?: string }> }> = {
  facebook: { label: "Facebook", className: "bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white", Icon: FacebookIcon },
  instagram: { label: "Instagram", className: "bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white", Icon: InstagramIcon },
  linkedin: { label: "LinkedIn", className: "bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white", Icon: LinkedInIcon },
  website: { label: "Site web", className: "bg-slate-100 text-slate-600 hover:bg-slate-700 hover:text-white", Icon: GlobeIcon },
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
            <div className="mt-3 flex flex-wrap gap-2">
              {socials.map(([key, url]) => {
                const meta = SOCIAL_META[key];
                if (!meta) return null;
                const SocialSvg = meta.Icon;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={meta.label}
                    aria-label={meta.label}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${meta.className}`}
                  >
                    <SocialSvg className="h-3.5 w-3.5" />
                    {meta.label}
                  </a>
                );
              })}
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

      {/* Revendication du profil par le praticien */}
      <p className="mt-3 text-center text-xs text-slate-400">
        {locale === "ar" ? (
          <>
            هل أنت {doctor.fullNameAr}؟{" "}
            <a href={`/pro/inscription?claim=${doctor.slug}`} className="font-medium text-primary-600 hover:underline">
              استرجع ملفك مجانًا
            </a>
          </>
        ) : (
          <>
            Vous êtes {doctor.fullName} ?{" "}
            <a href={`/pro/inscription?claim=${doctor.slug}`} className="font-medium text-primary-600 hover:underline">
              Revendiquez ce profil gratuitement
            </a>
          </>
        )}
      </p>

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

          {/* Assurance & remboursement */}
          {(() => {
            const ins = doctorInsurance(doctor);
            const fr = locale === "fr";
            return (
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">
                    {fr ? "Assurance & remboursement" : "التأمين والتعويض"}
                  </h2>
                  <Link href="/cnam" className="text-xs font-medium text-primary-600 hover:underline">
                    {fr ? "En savoir plus" : "المزيد"}
                  </Link>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  <span className={`rounded-full px-2.5 py-1 font-medium ${ins.cnam ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {ins.cnam ? (fr ? "✓ Conventionné CNAM" : "✓ متعاقد مع الكنام") : fr ? "Non conventionné CNAM" : "غير متعاقد"}
                  </span>
                  {ins.tiersPayant && (
                    <span className="rounded-full bg-primary-50 px-2.5 py-1 font-medium text-primary-700">
                      {fr ? "✓ Tiers payant" : "✓ دفع مسبق"}
                    </span>
                  )}
                </div>

                {ins.convention && (
                  <p className="mt-2 text-xs text-slate-400">
                    {fr ? "N° de conventionnement" : "رقم التعاقد"} · <span dir="ltr">{ins.convention}</span>
                  </p>
                )}

                {/* Estimation de remboursement */}
                {ins.cnam && (
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">{fr ? "Consultation" : "الاستشارة"}</p>
                      <p className="mt-0.5 text-lg font-bold text-slate-800">{ins.reimbursement.price} DT</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-2.5 ring-1 ring-emerald-100">
                      <p className="text-[10px] uppercase tracking-wide text-emerald-700">{fr ? "Remboursé ≈" : "مُعوَّض ≈"}</p>
                      <p className="mt-0.5 text-lg font-bold text-emerald-700">{ins.reimbursement.reimbursed} DT</p>
                    </div>
                    <div className="rounded-xl bg-primary-50 p-2.5 ring-1 ring-primary-100">
                      <p className="text-[10px] uppercase tracking-wide text-primary-700">{fr ? "Reste ≈" : "يبقى ≈"}</p>
                      <p className="mt-0.5 text-lg font-bold text-primary-700">{ins.reimbursement.outOfPocket} DT</p>
                    </div>
                  </div>
                )}

                {ins.insurers.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-slate-600">{fr ? "Assurances acceptées" : "التأمينات المقبولة"}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {ins.insurers.map((id) => (
                        <span key={id} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                          {insurerLabel(id)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {ins.cnam && (
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                    {fr
                      ? "Estimation indicative sur le tarif de référence CNAM (≥70 %). Les maladies chroniques (APCI) sont prises en charge à 100 %."
                      : "تقدير إرشادي على التعريفة المرجعية للكنام (≥70٪). الأمراض المزمنة (APCI) تُغطّى 100٪."}
                  </p>
                )}
              </section>
            );
          })()}

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

          <VerifiedReviews doctorSlug={doctor.slug} />

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
