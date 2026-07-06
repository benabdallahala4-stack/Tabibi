// Page individuelle d'une question (SEO) — questions de démonstration
// pré-générées ; les questions posées sur l'appareil sont résolues côté client.

import Link from "next/link";
import QuestionDetail from "@/components/QuestionDetail";
import { QNA_SEED } from "@/lib/qna";

export function generateStaticParams() {
  return QNA_SEED.map((q) => ({ slug: q.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const q = QNA_SEED.find((x) => x.slug === params.slug);
  return {
    title: q ? `${q.title} — réponse de médecin | Seha` : "Question médicale | Seha",
    description: q?.body.slice(0, 155),
  };
}

export default function QuestionPage({ params }: { params: { slug: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-4 text-xs text-slate-400">
        <Link href="/" className="hover:text-primary-600">Accueil</Link>
        {" › "}
        <Link href="/questions" className="hover:text-primary-600">Questions médicales</Link>
      </nav>
      <QuestionDetail slug={params.slug} />
    </div>
  );
}
