// Article du Magazine Santé — page statique (SEO) avec liens vers
// l'annuaire de la spécialité et la prise de rendez-vous.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, findArticle } from "@/lib/articles";
import { SPECIALTIES } from "@/lib/data";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = findArticle(params.slug);
  if (!article) return { title: "Article introuvable | Tabibi" };
  return {
    title: `${article.title} | Magazine Santé Tabibi`,
    description: article.summary,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = findArticle(params.slug);
  if (!article) notFound();
  const specialty = SPECIALTIES.find((s) => s.id === article.specialtyId);
  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-xs text-slate-400">
        <Link href="/" className="hover:text-primary-600">Accueil</Link>
        {" › "}
        <Link href="/sante" className="hover:text-primary-600">Magazine Santé</Link>
        {" › "}
        <span className="text-slate-600">{article.category}</span>
      </nav>

      {/* Couverture */}
      <div
        className="mt-4 flex h-44 items-center justify-center rounded-2xl text-7xl"
        style={{ background: `linear-gradient(135deg, ${article.gradient[0]}, ${article.gradient[1]})` }}
      >
        <span className="drop-shadow-lg">{article.emoji}</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-primary-50 px-2.5 py-1 font-medium text-primary-700">{article.category}</span>
        <span className="text-slate-400">
          Lecture : {article.readMinutes} min · Publié le <span dir="ltr">{article.date}</span>
        </span>
      </div>

      <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-800">{article.title}</h1>
      <p className="mt-1 text-sm text-slate-400" dir="rtl">{article.titleAr}</p>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">{article.summary}</p>

      <div className="mt-8 space-y-8">
        {article.sections.map((s) => (
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
              {specialty.emoji} Besoin d&apos;un avis en {specialty.label.toLowerCase()} ?
            </p>
            <p className="mt-1 text-sm text-primary-100">
              Prenez rendez-vous en ligne, au cabinet ou en téléconsultation.
            </p>
          </div>
          <Link
            href={`/annuaire/${specialty.id}`}
            className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
          >
            Trouver un spécialiste →
          </Link>
        </div>
      )}

      <p className="mt-6 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
        ⚕️ Contenu informatif rédigé pour Tabibi — il ne remplace pas une consultation médicale.
        En cas d&apos;urgence, appelez le 190 (SAMU).
      </p>

      {/* Articles liés */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">À lire aussi</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {related.map((a) => (
            <Link
              key={a.slug}
              href={`/sante/${a.slug}`}
              className="rounded-xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-primary-400"
            >
              <span className="text-2xl">{a.emoji}</span>
              <p className="mt-1 text-sm font-semibold leading-snug text-slate-700">{a.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
