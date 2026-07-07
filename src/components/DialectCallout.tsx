"use client";

// Encart « L'essentiel en darija » : l'essentiel d'un article en langue parlée
// (تونسي / ليبي / جزائري), avec des onglets pour changer de dialecte. Toujours
// affiché en RTL puisque le contenu est en arabe dialectal.

import { useState } from "react";
import type { ArticleDialects } from "@/lib/articles";

const DIALECTS = [
  { id: "tn", flag: "🇹🇳", label: "تونسي" },
  { id: "ly", flag: "🇱🇾", label: "ليبي" },
  { id: "dz", flag: "🇩🇿", label: "جزائري" },
] as const;

export default function DialectCallout({
  dialects,
  fr,
}: {
  dialects: ArticleDialects;
  fr: boolean;
}) {
  const [active, setActive] = useState<keyof ArticleDialects>("tn");

  return (
    <section className="mt-10 rounded-2xl bg-primary-50/60 p-5 ring-1 ring-primary-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-primary-800">
          🗣️ {fr ? "L'essentiel en darija" : "الزبدة بالدارجة"}
        </p>
        <div className="flex gap-1">
          {DIALECTS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActive(d.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                active === d.id
                  ? "bg-primary-600 text-white"
                  : "bg-white text-primary-700 ring-1 ring-primary-200 hover:bg-primary-100"
              }`}
            >
              {d.flag} {d.label}
            </button>
          ))}
        </div>
      </div>
      <p dir="rtl" lang="ar" className="mt-3 text-right text-lg leading-loose text-slate-700">
        {dialects[active]}
      </p>
      <p className="mt-3 text-xs text-primary-700/70">
        {fr
          ? "Résumé en langue parlée — le texte complet reste en français et en arabe standard ci-dessus."
          : "ملخّص باللهجة المحكية — النص الكامل بالفرنسية والعربية الفصحى في الأعلى."}
      </p>
    </section>
  );
}
