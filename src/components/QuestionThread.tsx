"use client";

// Fil de question : question anonyme + réponses des médecins (profil,
// vote « utile », lien profil et prise de RDV).

import Link from "next/link";
import { useEffect, useState } from "react";
import { findDoctor, SPECIALTIES } from "@/lib/data";
import { hasVoted, voteHelpful, type QnaQuestion } from "@/lib/qna";
import { useLocale } from "@/lib/i18n";

const L = {
  fr: {
    anonymous: "Patient anonyme",
    waiting: "En attente de réponse d'un médecin…",
    helpful: "Utile",
    voted: "Merci !",
    profile: "Voir le profil",
    book: "Prendre RDV",
    verified: "Médecin vérifié",
  },
  ar: {
    anonymous: "مريض مجهول",
    waiting: "في انتظار إجابة طبيب…",
    helpful: "مفيد",
    voted: "شكرًا!",
    profile: "عرض الملف",
    book: "حجز موعد",
    verified: "طبيب موثّق",
  },
};

export default function QuestionThread({ question }: { question: QnaQuestion }) {
  const { t: tr, locale } = useLocale();
  const t = L[locale];
  const specialty = SPECIALTIES.find((s) => s.id === question.specialtyId);
  // Votes locaux, chargés après montage pour éviter tout écart d'hydratation.
  const [votes, setVotes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const v: Record<string, boolean> = {};
    for (const a of question.answers) v[a.id] = hasVoted(a.id);
    setVotes(v);
  }, [question]);

  function vote(answerId: string) {
    if (voteHelpful(answerId)) {
      setVotes((prev) => ({ ...prev, [answerId]: true }));
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      {/* Question */}
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg">
          🕵️
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-500">{t.anonymous}</span>
            <span dir="ltr">{question.date}</span>
            {specialty && (
              <Link
                href={`/annuaire/${specialty.id}`}
                className="rounded-full bg-primary-50 px-2 py-0.5 font-medium text-primary-700 hover:bg-primary-100"
              >
                {specialty.emoji} {locale === "ar" ? specialty.labelAr : specialty.label}
              </Link>
            )}
          </div>
          <h2 className="mt-1 text-lg font-bold leading-snug text-slate-800">{question.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{question.body}</p>
        </div>
      </div>

      {/* Réponse IA immédiate (en attendant un médecin) */}
      {question.aiAnswer && (
        <div className="mt-5 rounded-xl bg-violet-50 p-4 ring-1 ring-violet-100">
          <p className="flex items-center gap-2 text-sm font-bold text-violet-800">
            🤖 {locale === "ar" ? "إجابة فورية من مساعد طبيبي الذكي" : "Réponse immédiate de l'assistant IA Tabibi"}
          </p>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{question.aiAnswer}</p>
        </div>
      )}

      {/* Réponses */}
      <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
        {question.answers.length === 0 && !question.aiAnswer && (
          <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">⏳ {t.waiting}</p>
        )}
        {question.answers.map((a) => {
          const doctor = findDoctor(a.doctorSlug);
          if (!doctor) return null;
          const voted = votes[a.id];
          return (
            <div key={a.id} className="rounded-xl bg-primary-50/40 p-4 ring-1 ring-primary-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link href={`/medecin/${doctor.slug}`} className="flex items-center gap-3 hover:opacity-90">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                    {doctor.photoSeed}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-primary-800">
                      {locale === "ar" ? doctor.fullNameAr : doctor.fullName}
                      <span className="ms-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        ✓ {t.verified}
                      </span>
                    </span>
                    <span className="block text-xs text-slate-500">
                      {locale === "ar" ? doctor.specialtyAr : doctor.specialty} · {doctor.city}
                    </span>
                  </span>
                </Link>
                <span className="text-xs text-slate-400" dir="ltr">{a.date}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{a.text}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => vote(a.id)}
                  disabled={voted}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    voted
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  👍 {voted ? t.voted : t.helpful} ({a.helpful + (voted ? 1 : 0)})
                </button>
                <Link
                  href={`/medecin/${doctor.slug}`}
                  className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-primary-700 ring-1 ring-primary-200 transition hover:bg-primary-50"
                >
                  {t.profile}
                </Link>
                <Link
                  href={`/medecin/${doctor.slug}`}
                  className="rounded-full bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
                >
                  📅 {t.book}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      {/* Le libellé tr est gardé pour d'éventuels ajouts i18n globaux */}
      <span className="hidden">{tr("common.loading")}</span>
    </div>
  );
}
