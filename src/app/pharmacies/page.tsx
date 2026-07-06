"use client";

import { useState } from "react";
import { PHARMACIES } from "@/lib/pharmacies";
import { CITIES } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

const L = {
  fr: {
    title: "Pharmacies de garde",
    sub: "Trouvez une pharmacie ouverte la nuit, le dimanche et les jours fériés, ville par ville.",
    all: "Toutes les villes",
    garde: { jour: "Garde de jour", nuit: "Garde de nuit", "24h": "Ouverte 24h/24" },
    call: "Appeler",
    map: "Itinéraire",
    empty: "Aucune pharmacie de garde trouvée pour cette ville (démo).",
    note: "Données de démonstration. En production : liste officielle du Conseil de l'Ordre des Pharmaciens, actualisée chaque semaine.",
  },
  ar: {
    title: "صيدليات الحراسة",
    sub: "اعثر على صيدلية مفتوحة ليلًا وأيام الآحاد والأعياد، مدينة بمدينة.",
    all: "كل المدن",
    garde: { jour: "حراسة نهارية", nuit: "حراسة ليلية", "24h": "مفتوحة 24/24" },
    call: "اتصال",
    map: "الاتجاهات",
    empty: "لا توجد صيدلية حراسة في هذه المدينة (نسخة تجريبية).",
    note: "بيانات تجريبية. في الإنتاج: القائمة الرسمية لعمادة الصيادلة، محيّنة أسبوعيًا.",
  },
};

const GARDE_STYLE: Record<string, string> = {
  jour: "bg-amber-50 text-amber-700",
  nuit: "bg-indigo-50 text-indigo-700",
  "24h": "bg-emerald-50 text-emerald-700",
};

export default function PharmaciesPage() {
  const { locale, city } = useLocale();
  const t = L[locale];
  const [selectedCity, setSelectedCity] = useState("");

  const list = PHARMACIES.filter((p) => !selectedCity || p.city === selectedCity);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">💊 {t.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.sub}</p>

      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-400"
      >
        <option value="">{t.all}</option>
        {CITIES.map((c) => (
          <option key={c} value={c}>
            {city(c)}
          </option>
        ))}
      </select>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {list.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold text-slate-800">{locale === "ar" ? p.nameAr : p.name}</h2>
                <p className="text-sm text-slate-500">{city(p.city)}</p>
                <p className="mt-0.5 text-xs text-slate-400" dir="ltr">{p.address}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${GARDE_STYLE[p.garde]}`}>
                {t.garde[p.garde]}
              </span>
            </div>
            <div className="mt-3 flex gap-2 text-sm">
              <a
                href={`tel:${p.phone.replace(/\s/g, "")}`}
                className="rounded-xl bg-primary-600 px-4 py-2 font-semibold text-white transition hover:bg-primary-700"
              >
                📞 {t.call} <span dir="ltr">{p.phone}</span>
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`}
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

      <p className="mt-6 text-center text-xs text-slate-400">{t.note}</p>
    </div>
  );
}
