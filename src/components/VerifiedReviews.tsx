"use client";

import { useEffect, useState } from "react";
import { addReview, canReview, listReviews, type VerifiedReview } from "@/lib/reviews";
import { useLocale } from "@/lib/i18n";

const L = {
  fr: {
    title: "Avis vérifiés Seha",
    sub: "Seuls les patients ayant réservé chez ce praticien peuvent laisser un avis.",
    empty: "Pas encore d'avis vérifié — soyez le premier après votre consultation.",
    notEligible: "🔒 Réservez et honorez un rendez-vous chez ce praticien pour pouvoir laisser un avis.",
    yourReview: "Votre avis (après votre rendez-vous)",
    name: "Votre prénom",
    placeholder: "Partagez votre expérience (accueil, écoute, délais…)",
    submit: "Publier l'avis vérifié",
    thanks: "Merci ! Votre avis vérifié est publié ✓",
    badge: "✓ Patient vérifié",
  },
  ar: {
    title: "تقييمات موثّقة من صحة",
    sub: "فقط المرضى الذين حجزوا لدى هذا الطبيب يمكنهم ترك تقييم.",
    empty: "لا توجد تقييمات موثقة بعد — كن الأول بعد استشارتك.",
    notEligible: "🔒 احجز موعدًا لدى هذا الطبيب لتتمكن من ترك تقييم.",
    yourReview: "تقييمك (بعد موعدك)",
    name: "اسمك",
    placeholder: "شارك تجربتك (الاستقبال، الإصغاء، الآجال…)",
    submit: "نشر التقييم الموثّق",
    thanks: "شكرًا! تم نشر تقييمك الموثّق ✓",
    badge: "✓ مريض موثّق",
  },
};

export default function VerifiedReviews({ doctorSlug }: { doctorSlug: string }) {
  const { locale } = useLocale();
  const t = L[locale];
  const [reviews, setReviews] = useState<VerifiedReview[]>([]);
  const [eligible, setEligible] = useState(false);
  const [form, setForm] = useState({ author: "", rating: 5, text: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setReviews(listReviews(doctorSlug));
    setEligible(canReview(doctorSlug));
  }, [doctorSlug]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.author.trim() || !form.text.trim()) return;
    addReview({
      id: `rev-${Date.now().toString(36)}`,
      doctorSlug,
      author: form.author.trim(),
      rating: form.rating,
      text: form.text.trim(),
      date: new Date().toISOString().slice(0, 10),
    });
    setReviews(listReviews(doctorSlug));
    setForm({ author: "", rating: 5, text: "" });
    setSubmitted(true);
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-bold text-slate-800">🛡️ {t.title}</h2>
      <p className="mt-1 text-xs text-slate-400">{t.sub}</p>

      <div className="mt-3 space-y-3">
        {reviews.length === 0 && <p className="text-sm text-slate-400">{t.empty}</p>}
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl bg-slate-50 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">
                {r.author}{" "}
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  {t.badge}
                </span>
              </span>
              <span className="text-xs text-slate-400" dir="ltr">{r.date}</span>
            </div>
            <span className="text-amber-500">{"★".repeat(r.rating)}<span className="text-slate-300">{"★".repeat(5 - r.rating)}</span></span>
            <p className="mt-1 text-slate-600">{r.text}</p>
          </div>
        ))}
      </div>

      {submitted ? (
        <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{t.thanks}</p>
      ) : eligible ? (
        <form onSubmit={submit} className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-slate-700">{t.yourReview}</p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder={t.name}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder={t.placeholder}
            rows={2}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
          />
          <button className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
            {t.submit}
          </button>
        </form>
      ) : (
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">{t.notEligible}</p>
      )}
    </section>
  );
}
