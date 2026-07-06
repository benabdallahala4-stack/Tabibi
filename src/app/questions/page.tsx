"use client";

// Questions médicales : Q&A public et anonyme.

import Link from "next/link";
import { useEffect, useState } from "react";
import QuestionThread from "@/components/QuestionThread";
import { SPECIALTIES } from "@/lib/data";
import { allQuestions, askQuestion, type QnaQuestion } from "@/lib/qna";
import { useLocale } from "@/lib/i18n";

const L = {
  fr: {
    title: "Questions médicales",
    sub: "Posez votre question anonymement et publiquement — des médecins vérifiés y répondent avec leur profil. Votez « utile » pour faire remonter les meilleures réponses.",
    ask: "✍️ Poser ma question (anonyme)",
    specialty: "Spécialité concernée",
    qTitle: "Votre question en une phrase *",
    qBody: "Détaillez : âge, symptômes, durée, traitements essayés… (sans nom ni téléphone) *",
    submit: "Publier anonymement",
    published: "✓ Question publiée anonymement. Les médecins de la spécialité sont notifiés (démo : réponse via l'espace praticien).",
    all: "Toutes",
    empty: "Aucune question dans cette spécialité pour l'instant — posez la première !",
    privacy: "🕵️ Votre identité n'apparaît jamais : ni nom, ni téléphone. Évitez tout détail permettant de vous identifier.",
    emergency: "⚠️ Ce service ne traite pas les urgences. Urgence vitale : appelez le 190 (SAMU).",
    answersLabel: "réponse(s)",
  },
  ar: {
    title: "أسئلة طبية",
    sub: "اطرح سؤالك بشكل مجهول وعلني — يجيب عنه أطباء موثّقون بملفاتهم. صوّت « مفيد » لإبراز أفضل الإجابات.",
    ask: "✍️ اطرح سؤالي (مجهول)",
    specialty: "الاختصاص المعني",
    qTitle: "سؤالك في جملة واحدة *",
    qBody: "فصّل: العمر، الأعراض، المدة، الأدوية المجرّبة… (دون اسم أو هاتف) *",
    submit: "نشر بشكل مجهول",
    published: "✓ نُشر السؤال بشكل مجهول. يُعلَم أطباء الاختصاص (تجريبي: الإجابة عبر فضاء الطبيب).",
    all: "الكل",
    empty: "لا توجد أسئلة في هذا الاختصاص بعد — كن أول من يسأل!",
    privacy: "🕵️ هويتك لا تظهر أبدًا: لا اسم ولا هاتف. تجنّب أي تفاصيل تكشف هويتك.",
    emergency: "⚠️ هذه الخدمة لا تعالج الحالات الطارئة. في الخطر اتصل بـ190 (الإسعاف).",
    answersLabel: "إجابة/إجابات",
  },
};

export default function QuestionsPage() {
  const { locale } = useLocale();
  const t = L[locale];
  const [questions, setQuestions] = useState<QnaQuestion[] | null>(null);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [published, setPublished] = useState(false);
  const [form, setForm] = useState({ specialtyId: SPECIALTIES[0].id, title: "", body: "" });

  useEffect(() => {
    setQuestions(allQuestions());
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    askQuestion(form.specialtyId, form.title, form.body);
    setQuestions(allQuestions());
    setForm({ ...form, title: "", body: "" });
    setShowForm(false);
    setPublished(true);
    setTimeout(() => setPublished(false), 6000);
  }

  const list = (questions ?? []).filter((q) => !filter || q.specialtyId === filter);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">💬 {t.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.sub}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          {t.ask}
        </button>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
        >
          <option value="">{t.all}</option>
          {SPECIALTIES.map((s) => (
            <option key={s.id} value={s.id}>
              {locale === "ar" ? s.labelAr : s.label}
            </option>
          ))}
        </select>
      </div>

      {published && (
        <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{t.published}</p>
      )}

      {/* Formulaire anonyme */}
      {showForm && (
        <form onSubmit={submit} className="mt-4 space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary-200">
          <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">{t.privacy}</p>
          <label className="block text-sm font-medium text-slate-700">
            {t.specialty}
            <select
              value={form.specialtyId}
              onChange={(e) => setForm({ ...form, specialtyId: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
            >
              {SPECIALTIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {locale === "ar" ? s.labelAr : s.label}
                </option>
              ))}
            </select>
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={t.qTitle}
            maxLength={120}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
          />
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder={t.qBody}
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
          />
          <button className="w-full rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">
            {t.submit}
          </button>
          <p className="text-center text-xs text-amber-600">{t.emergency}</p>
        </form>
      )}

      {/* Liste */}
      <div className="mt-6 space-y-5">
        {questions === null && <p className="text-slate-400">…</p>}
        {list.map((q) => (
          <div key={q.id}>
            <QuestionThread question={q} />
            <div className="mt-1 text-end">
              <Link href={`/questions/${q.slug}`} className="text-xs text-slate-400 hover:text-primary-600">
                🔗 {q.answers.length} {t.answersLabel}
              </Link>
            </div>
          </div>
        ))}
        {questions !== null && list.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            {t.empty}
          </p>
        )}
      </div>
    </div>
  );
}
