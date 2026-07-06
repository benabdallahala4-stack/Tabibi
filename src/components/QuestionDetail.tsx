"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import QuestionThread from "@/components/QuestionThread";
import { findQuestion, type QnaQuestion } from "@/lib/qna";
import { useLocale } from "@/lib/i18n";

export default function QuestionDetail({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const [question, setQuestion] = useState<QnaQuestion | null | undefined>(undefined);

  useEffect(() => {
    setQuestion(findQuestion(slug) ?? null);
  }, [slug]);

  if (question === undefined) return <p className="text-slate-400">…</p>;
  if (question === null) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200">
        <p className="text-slate-600">
          {locale === "ar" ? "السؤال غير موجود." : "Question introuvable."}
        </p>
        <Link href="/questions" className="mt-3 inline-block text-primary-600 hover:underline">
          {locale === "ar" ? "← كل الأسئلة" : "Toutes les questions →"}
        </Link>
      </div>
    );
  }
  return <QuestionThread question={question} />;
}
