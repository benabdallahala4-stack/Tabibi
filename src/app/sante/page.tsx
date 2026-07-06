"use client";

import Link from "next/link";
import { useState } from "react";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/lib/articles";
import { useLocale } from "@/lib/i18n";

export default function MagazinePage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [category, setCategory] = useState("");

  const list = ARTICLES.filter((a) => !category || a.category === category);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">
        📰 {fr ? "Magazine Santé" : "مجلة الصحة"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {fr
          ? "Prévention, dépistage, bons réflexes : des articles clairs pour prendre soin de vous et de votre famille."
          : "وقاية، كشف مبكر، عادات صحيحة: مقالات واضحة للاعتناء بك وبعائلتك."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            !category ? "bg-primary-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          {fr ? "Tous" : "الكل"}
        </button>
        {ARTICLE_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c === category ? "" : c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              category === c ? "bg-primary-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {list.map((a) => (
          <Link
            key={a.slug}
            href={`/sante/${a.slug}`}
            className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
          >
            {/* Couverture générative */}
            <div
              className="flex h-36 items-center justify-center text-6xl"
              style={{ background: `linear-gradient(135deg, ${a.gradient[0]}, ${a.gradient[1]})` }}
            >
              <span className="drop-shadow-lg transition group-hover:scale-110">{a.emoji}</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-primary-50 px-2 py-0.5 font-medium text-primary-700">
                  {fr ? a.category : a.categoryAr}
                </span>
                <span className="text-slate-400">
                  {a.readMinutes} min · <span dir="ltr">{a.date}</span>
                </span>
              </div>
              <h2 className="mt-2 font-bold leading-snug text-slate-800 group-hover:text-primary-700">
                {fr ? a.title : a.titleAr}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{fr ? a.summary : a.summaryAr}</p>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        {fr
          ? "Contenu informatif — ne remplace pas une consultation médicale. Production : articles signés et validés par des praticiens partenaires."
          : "محتوى إعلامي — لا يعوّض الاستشارة الطبية."}
      </p>
    </div>
  );
}
