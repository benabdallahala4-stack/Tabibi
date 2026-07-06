"use client";

import { useState } from "react";
import { MEDICINE_CLASSES, searchMedicines } from "@/lib/medicines";
import { useLocale } from "@/lib/i18n";

const L = {
  fr: {
    title: "Base de médicaments",
    sub: "Cherchez par nom commercial, molécule (DCI) ou classe : prix public en dinars, ordonnance, remboursement CNAM et générique.",
    placeholder: "Ex. Doliprane, paracétamol, antibiotique…",
    allClasses: "Toutes les classes",
    otc: "Sans ordonnance uniquement",
    rx: "Ordonnance obligatoire",
    noRx: "Sans ordonnance",
    cnam: "Remboursable CNAM",
    generic: "Générique disponible",
    price: "Prix public",
    uses: "Indications",
    empty: "Aucun médicament trouvé.",
    count: "médicament(s)",
    note: "Données fictives de démonstration — ne remplace pas l'avis d'un professionnel de santé. Production : données officielles DPM / Pharmacie Centrale de Tunisie.",
    warn: "⚠️ Ne prenez jamais un médicament soumis à ordonnance sans prescription. En cas de doute, consultez votre médecin ou pharmacien.",
  },
  ar: {
    title: "قاعدة الأدوية",
    sub: "ابحث بالاسم التجاري أو المادة الفعالة أو الفئة: السعر بالدينار، الوصفة، تعويض CNAM والدواء الجنيس.",
    placeholder: "مثال: دوليبران، باراسيتامول، مضاد حيوي…",
    allClasses: "كل الفئات",
    otc: "بدون وصفة فقط",
    rx: "وصفة إجبارية",
    noRx: "بدون وصفة",
    cnam: "قابل للتعويض CNAM",
    generic: "جنيس متوفر",
    price: "السعر العمومي",
    uses: "دواعي الاستعمال",
    empty: "لم يتم العثور على دواء.",
    count: "دواء/أدوية",
    note: "بيانات تجريبية — لا تعوّض رأي مختص في الصحة. في الإنتاج: بيانات رسمية من إدارة الصيدلة والدواء والصيدلية المركزية.",
    warn: "⚠️ لا تتناول أبدًا دواءً خاضعًا للوصفة دون وصفة طبية. عند الشك، استشر طبيبك أو صيدليك.",
  },
};

export default function MedicamentsPage() {
  const { locale } = useLocale();
  const t = L[locale];
  const [query, setQuery] = useState("");
  const [classe, setClasse] = useState("");
  const [otcOnly, setOtcOnly] = useState(false);

  const results = searchMedicines(query, classe, otcOnly);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">💊 {t.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.sub}</p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-400"
        />
        <select
          value={classe}
          onChange={(e) => setClasse(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm sm:w-64"
        >
          <option value="">{t.allClasses}</option>
          {MEDICINE_CLASSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={otcOnly}
          onChange={(e) => setOtcOnly(e.target.checked)}
          className="h-4 w-4 accent-primary-600"
        />
        {t.otc}
      </label>

      <p className="mt-4 text-sm text-slate-500">
        {results.length} {t.count}
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {results.map((m) => (
          <div key={m.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-bold text-slate-800">{m.brand}</h2>
                <p className="text-sm text-primary-700">{m.dci}</p>
                <p className="text-xs text-slate-400">{m.form}</p>
              </div>
              <span className="shrink-0 rounded-xl bg-primary-50 px-3 py-1.5 text-sm font-bold text-primary-700" dir="ltr">
                {m.priceTnd.toFixed(1)} DT
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              <span className="font-medium">{t.uses} :</span> {m.uses}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{m.classe}</span>
              {m.prescription ? (
                <span className="rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-700">📋 {t.rx}</span>
              ) : (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">{t.noRx}</span>
              )}
              {m.cnam && <span className="rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-700">{t.cnam}</span>}
              {m.generic && <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700">{t.generic}</span>}
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-200 sm:col-span-2">
            {t.empty}
          </p>
        )}
      </div>

      <p className="mt-6 rounded-xl bg-amber-50 p-3 text-center text-xs text-amber-700">{t.warn}</p>
      <p className="mt-2 text-center text-xs text-slate-400">{t.note}</p>
    </div>
  );
}
