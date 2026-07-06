"use client";

// Rendu bilingue d'un article du Magazine Santé : le contenu suit la langue
// choisie (FR/AR) et la mise en page passe en RTL automatiquement.

import Link from "next/link";
import ArticleCover from "@/components/ArticleCover";
import { Icon } from "@/components/Icons";
import type { Article } from "@/lib/articles";
import { SPECIALTIES } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

export default function ArticleBody({
  article,
  related,
}: {
  article: Article;
  related: Article[];
}) {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const specialty = SPECIALTIES.find((s) => s.id === article.specialtyId);
  const sections = fr ? article.sections : article.sectionsAr;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-xs text-slate-400">
        <Link href="/" className="hover:text-primary-600">{fr ? "Accueil" : "الرئيسية"}</Link>
        {" › "}
        <Link href="/sante" className="hover:text-primary-600">{fr ? "Magazine Santé" : "مجلة الصحة"}</Link>
        {" › "}
        <span className="text-slate-600">{fr ? article.category : article.categoryAr}</span>
      </nav>

      <ArticleCover article={article} className="mt-4 h-48 rounded-2xl" />
      {/* Pour une vraie photo : placez le fichier dans /public/photos et
          remplacez ArticleCover par <Image src="/photos/…" fill …/>. */}

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-primary-50 px-2.5 py-1 font-medium text-primary-700">
          {fr ? article.category : article.categoryAr}
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <Icon name="clock" className="h-3.5 w-3.5" />
          {article.readMinutes} {fr ? "min de lecture" : "دقائق قراءة"} · <span dir="ltr">{article.date}</span>
        </span>
      </div>

      <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-800">
        {fr ? article.title : article.titleAr}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        {fr ? article.summary : article.summaryAr}
      </p>

      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-bold text-slate-800">{s.heading}</h2>
            <p className="mt-2 leading-relaxed text-slate-600">{s.body}</p>
          </section>
        ))}
      </div>

      {/* CTA prise de RDV */}
      {specialty && (
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary-700 to-primary-600 p-6 text-white sm:flex-row sm:items-center">
          <div>
            <p className="font-bold">
              {fr
                ? `Besoin d'un avis en ${specialty.label.toLowerCase()} ?`
                : `تحتاج رأيًا في ${specialty.labelAr}؟`}
            </p>
            <p className="mt-1 text-sm text-primary-100">
              {fr
                ? "Prenez rendez-vous en ligne, au cabinet ou en téléconsultation."
                : "احجز موعدًا عبر الإنترنت، في العيادة أو عن بُعد."}
            </p>
          </div>
          <Link
            href={`/annuaire/${specialty.id}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
          >
            {fr ? "Trouver un spécialiste" : "ابحث عن مختص"}
            <Icon name="arrow-right" className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`} />
          </Link>
        </div>
      )}

      <p className="mt-6 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
        {fr
          ? "⚕️ Contenu informatif rédigé pour Tabibi — il ne remplace pas une consultation médicale. En cas d'urgence, appelez le 190 (SAMU)."
          : "⚕️ محتوى إعلامي أُعدّ لطبيبي — لا يعوّض الاستشارة الطبية. في الحالات الطارئة اتصل بالرقم 190 (الإسعاف)."}
      </p>

      {/* Articles liés */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          {fr ? "À lire aussi" : "اقرأ أيضًا"}
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {related.map((a) => (
            <Link
              key={a.slug}
              href={`/sante/${a.slug}`}
              className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 transition hover:ring-primary-400"
            >
              <ArticleCover article={a} className="h-16" compact />
              <p className="p-3 text-sm font-semibold leading-snug text-slate-700">
                {fr ? a.title : a.titleAr}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
