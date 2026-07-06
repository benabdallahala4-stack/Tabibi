"use client";

import Link from "next/link";
import { useState } from "react";
import { ANALYSIS_TYPES, LABS } from "@/lib/labs";
import { CITIES } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

const L = {
  fr: {
    title: "Laboratoires d'analyses",
    sub: "Trouvez un laboratoire près de chez vous : familles d'analyses, horaires, prélèvement à domicile et résultats en ligne dans votre dossier Seha.",
    allCities: "Toutes les villes",
    allAnalyses: "Toutes les analyses",
    home: "🏠 Prélèvement à domicile",
    online: "📲 Résultats dans Seha",
    hours: "Horaires",
    call: "Appeler",
    map: "Itinéraire",
    count: "laboratoire(s)",
    empty: "Aucun laboratoire ne correspond à ces filtres (démo).",
    cta: "Vous êtes un laboratoire ? Déposez les résultats directement dans le dossier du patient via le",
    ctaLink: "portail laboratoire",
    note: "Données fictives de démonstration.",
  },
  ar: {
    title: "مخابر التحاليل",
    sub: "اعثر على مخبر قريب منك: أنواع التحاليل، التوقيت، أخذ العينات في المنزل والنتائج مباشرة في ملفك على صحة.",
    allCities: "كل المدن",
    allAnalyses: "كل التحاليل",
    home: "🏠 أخذ العينات في المنزل",
    online: "📲 النتائج في صحة",
    hours: "التوقيت",
    call: "اتصال",
    map: "الاتجاهات",
    count: "مخبر/مخابر",
    empty: "لا يوجد مخبر يطابق هذه المعايير (نسخة تجريبية).",
    cta: "هل أنت مخبر؟ أودع النتائج مباشرة في ملف المريض عبر",
    ctaLink: "بوابة المخابر",
    note: "بيانات تجريبية.",
  },
};

export default function LabsPage() {
  const { locale, city } = useLocale();
  const t = L[locale];
  const [selectedCity, setSelectedCity] = useState("");
  const [analysis, setAnalysis] = useState("");

  const list = LABS.filter(
    (l) => (!selectedCity || l.city === selectedCity) && (!analysis || l.analyses.includes(analysis))
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">🧪 {t.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.sub}</p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm sm:w-56"
        >
          <option value="">{t.allCities}</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {city(c)}
            </option>
          ))}
        </select>
        <select
          value={analysis}
          onChange={(e) => setAnalysis(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm sm:w-64"
        >
          <option value="">{t.allAnalyses}</option>
          {ANALYSIS_TYPES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <span className="self-center text-sm text-slate-500">
          {list.length} {t.count}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {list.map((l) => (
          <div key={l.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="font-bold text-slate-800">{locale === "ar" ? l.nameAr : l.name}</h2>
            <p className="text-sm text-slate-500">{city(l.city)}</p>
            <p className="mt-0.5 text-xs text-slate-400" dir="ltr">{l.address}</p>
            <p className="mt-1 text-xs text-slate-500">
              🕐 <span className="font-medium">{t.hours} :</span> {l.hours}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              {l.homeSampling && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">{t.home}</span>
              )}
              {l.resultsOnline && (
                <span className="rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-700">{t.online}</span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              {l.analyses.map((a) => (
                <span key={a} className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                  {a}
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2 text-sm">
              <a
                href={`tel:${l.phone.replace(/\s/g, "")}`}
                className="rounded-xl bg-primary-600 px-4 py-2 font-semibold text-white transition hover:bg-primary-700"
              >
                📞 {t.call}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-200"
              >
                📍 {t.map}
              </a>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-200 sm:col-span-2">
            {t.empty}
          </p>
        )}
      </div>

      <p className="mt-6 rounded-xl bg-primary-50 p-4 text-center text-sm text-primary-800">
        {t.cta}{" "}
        <Link href="/labo" className="font-semibold underline">
          {t.ctaLink}
        </Link>
        .
      </p>
      <p className="mt-3 text-center text-xs text-slate-400">{t.note}</p>
    </div>
  );
}
