"use client";

// Seha Plus — offre premium côté patient (démo).

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/i18n";

const FEATURES = [
  {
    emoji: "⚡",
    fr: { title: "Alerte créneau prioritaire", text: "Soyez averti en premier quand un rendez-vous plus tôt se libère chez votre médecin." },
    ar: { title: "تنبيه الموعد الأقرب", text: "كن أول من يُعلَم عند توفر موعد أقرب لدى طبيبك." },
  },
  {
    emoji: "👨‍👩‍👧",
    fr: { title: "Profils famille", text: "Gérez les rendez-vous et carnets de santé de vos enfants et parents depuis un seul compte." },
    ar: { title: "ملفات العائلة", text: "أدر مواعيد ودفاتر صحة أبنائك ووالديك من حساب واحد." },
  },
  {
    emoji: "🗄️",
    fr: { title: "Coffre-fort santé", text: "Ordonnances, analyses et carnets de vaccination stockés de manière sécurisée." },
    ar: { title: "خزنة صحية", text: "وصفات وتحاليل ودفاتر تلقيح محفوظة بأمان." },
  },
  {
    emoji: "📹",
    fr: { title: "Téléconsultations à tarif réduit", text: "Accès au réseau de généralistes partenaires pour un avis rapide, 7j/7." },
    ar: { title: "استشارات عن بُعد بسعر مخفّض", text: "شبكة أطباء عامّين شركاء لرأي سريع طيلة أيام الأسبوع." },
  },
  {
    emoji: "💬",
    fr: { title: "Rappels multi-canaux", text: "SMS + WhatsApp + e-mail, en français ou en arabe, pour toute la famille." },
    ar: { title: "تذكير متعدد القنوات", text: "SMS وواتساب وبريد إلكتروني بالفرنسية أو العربية لكل العائلة." },
  },
  {
    emoji: "🤝",
    fr: { title: "Support prioritaire", text: "Une équipe dédiée pour vos démarches (CNAM, cliniques, patients venant de l'étranger)." },
    ar: { title: "دعم أولوي", text: "فريق مخصص لمساعدتك في الإجراءات (CNAM، المصحات، المرضى القادمون من الخارج)." },
  },
];

export default function PlusPage() {
  const { locale } = useLocale();
  const [subscribed, setSubscribed] = useState(false);
  const fr = locale === "fr";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-800">
          ⭐ Seha Plus
        </span>
        <h1 className="mt-4 text-3xl font-bold text-slate-800">
          {fr ? "La santé de toute la famille, sans stress" : "صحة كل العائلة، دون عناء"}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-500">
          {fr
            ? "L'application reste gratuite. Seha Plus ajoute le confort : priorité, famille, coffre-fort santé."
            : "يبقى التطبيق مجانيًا. صحة بلس يضيف الراحة: الأولوية، العائلة، الخزنة الصحية."}
        </p>
        <p className="mt-4 text-3xl font-bold text-slate-800">
          9 <span className="text-base font-normal text-slate-500">{fr ? "DT / mois" : "د.ت / شهر"}</span>
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.fr.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <span className="text-3xl">{f.emoji}</span>
            <h3 className="mt-3 font-semibold text-slate-800">{f[locale].title}</h3>
            <p className="mt-1 text-sm text-slate-500">{f[locale].text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-md text-center">
        {subscribed ? (
          <div className="rounded-2xl bg-emerald-50 p-6 ring-1 ring-emerald-200">
            <p className="font-semibold text-emerald-800">
              {fr ? "🎉 Abonnement Plus activé (démo, aucun paiement réel)." : "🎉 تم تفعيل الاشتراك (تجريبي، دون دفع فعلي)."}
            </p>
            <Link href="/recherche" className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline">
              {fr ? "Trouver un médecin →" : "← ابحث عن طبيب"}
            </Link>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setSubscribed(true)}
              className="w-full rounded-xl bg-amber-500 px-8 py-4 font-semibold text-white shadow transition hover:bg-amber-600"
            >
              {fr ? "S'abonner à Seha Plus (démo)" : "الاشتراك في صحة بلس (تجريبي)"}
            </button>
            <p className="mt-3 text-xs text-slate-400">
              {fr
                ? "Paiement en production : carte bancaire (ClicToPay), e-Dinar ou Konnect."
                : "الدفع في النسخة النهائية: بطاقة بنكية (ClicToPay) أو الدينار الإلكتروني أو Konnect."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
