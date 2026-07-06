"use client";

import Link from "next/link";
import { useState } from "react";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/lib/articles";
import ArticleCover from "@/components/ArticleCover";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icons";
import { useLocale } from "@/lib/i18n";

export default function MagazinePage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [category, setCategory] = useState("");

  const list = ARTICLES.filter((a) => !category || a.category === category);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
        {fr ? "Prévention & conseils" : "وقاية ونصائح"}
      </p>
      <h1 className="mt-1 text-3xl font-bold text-slate-800">
        {fr ? "Magazine Santé" : "مجلة الصحة"}
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
        {list.map((a, i) => (
          <Reveal key={a.slug} delay={Math.min(i * 80, 320)}>
            <Link
              href={`/sante/${a.slug}`}
              className="hover-lift group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
            >
              <ArticleCover article={a} className="h-40" />
              <div className="p-5">
                <p className="flex items-center gap-2 text-xs text-slate-400">
                  <Icon name="clock" className="h-3.5 w-3.5" />
                  {a.readMinutes} min · <span dir="ltr">{a.date}</span>
                  <span className="ms-auto rounded-full bg-primary-50 px-2 py-0.5 font-medium text-primary-700">
                    {fr ? a.category : a.categoryAr}
                  </span>
                </p>
                <h2 className="mt-2 font-bold leading-snug text-slate-800 group-hover:text-primary-700">
                  {fr ? a.title : a.titleAr}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{fr ? a.summary : a.summaryAr}</p>
              </div>
            </Link>
          </Reveal>
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
