// Article du Magazine Santé — page statique (SEO), contenu bilingue FR/AR
// rendu côté client selon la langue choisie.

import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { ARTICLES, findArticle } from "@/lib/articles";

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
  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);
  return <ArticleBody article={article} related={related} />;
}
