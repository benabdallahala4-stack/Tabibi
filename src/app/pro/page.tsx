"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";

const FEATURES = [
  {
    emoji: "📅",
    fr: { title: "Agenda intelligent", text: "Gérez cabinet et téléconsultations dans un seul agenda, synchronisé en temps réel et accessible depuis mobile." },
    ar: { title: "جدول ذكي", text: "أدر العيادة والاستشارات عن بُعد في جدول واحد متزامن ومتاح من الهاتف." },
  },
  {
    emoji: "🔔",
    fr: { title: "Rappels automatiques", text: "SMS et e-mails de rappel en français et en arabe pour réduire jusqu'à 60 % des rendez-vous non honorés." },
    ar: { title: "تذكيرات تلقائية", text: "رسائل SMS وبريد بالفرنسية والعربية لتقليل المواعيد الملغاة حتى 60٪." },
  },
  {
    emoji: "📹",
    fr: { title: "Téléconsultation intégrée", text: "Consultations vidéo sécurisées avec paiement en ligne (e-Dinar, carte bancaire) et ordonnance numérique." },
    ar: { title: "استشارة فيديو مدمجة", text: "استشارات فيديو آمنة مع دفع إلكتروني (الدينار الإلكتروني، بطاقة بنكية) ووصفة رقمية." },
  },
  {
    emoji: "🗂️",
    fr: { title: "Dossier patient", text: "Historique des consultations, documents partagés et notes privées, hébergés de manière sécurisée." },
    ar: { title: "ملف المريض", text: "سجل الاستشارات والوثائق المشتركة والملاحظات الخاصة، بحفظ آمن." },
  },
  {
    emoji: "📊",
    fr: { title: "Statistiques du cabinet", text: "Taux de remplissage, nouveaux patients, annulations : pilotez votre activité en un coup d'œil." },
    ar: { title: "إحصائيات العيادة", text: "نسبة الامتلاء، المرضى الجدد، الإلغاءات: تابع نشاطك بنظرة واحدة." },
  },
  {
    emoji: "🤝",
    fr: { title: "Visibilité en ligne", text: "Un profil public complet (CNAM, langues, tarifs, avis vérifiés) référencé dans la recherche Tabibi." },
    ar: { title: "حضور رقمي", text: "ملف عمومي كامل (CNAM، اللغات، الأسعار، تقييمات موثوقة) ضمن نتائج بحث طبيبي." },
  },
];

export default function ProPage() {
  const { t, locale } = useLocale();

  return (
    <>
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-300">
            {t("pro.kicker")}
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold sm:text-4xl">{t("pro.title")}</h1>
          <p className="mt-4 max-w-xl text-primary-100">{t("pro.text")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pro/dashboard"
              className="rounded-xl bg-white px-8 py-3 font-semibold text-primary-800 transition hover:bg-primary-50"
            >
              {locale === "fr" ? "🖥️ Essayer l'espace praticien (démo)" : "🖥️ جرّب فضاء الطبيب (تجريبي)"}
            </Link>
            <Link
              href="/pro/tarifs"
              className="rounded-xl border border-white/40 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              {locale === "fr" ? "Voir les tarifs" : "الأسعار"}
            </Link>
            <a
              href="#contact"
              className="rounded-xl border border-white/40 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              {t("pro.demo")}
            </a>
          </div>
          <p className="mt-6 max-w-2xl rounded-xl bg-white/10 p-4 text-xs leading-relaxed text-primary-100">
            ⚖️{" "}
            {locale === "fr"
              ? "Conforme à la pratique tunisienne : les certificats médicaux et ordonnances sont remis en main propre après examen — Tabibi n'émet aucun document médical en ligne, il en garde uniquement la trace dans le dossier. La téléconsultation sert au contrôle et au suivi."
              : "مطابق للممارسة الطبية التونسية: الشهادات الطبية والوصفات تُسلَّم يدًا بيد بعد الفحص — طبيبي لا يُصدر أي وثيقة طبية عبر الإنترنت، بل يحتفظ فقط بأثرها في الملف. الاستشارة عن بُعد مخصصة للمراقبة والمتابعة."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold text-slate-800">{t("pro.allTitle")}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.fr.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <span className="text-3xl">{f.emoji}</span>
              <h3 className="mt-3 font-semibold text-slate-800">{f[locale].title}</h3>
              <p className="mt-1 text-sm text-slate-500">{f[locale].text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-3xl px-4 pb-16">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-800">{t("pro.contactTitle")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("pro.contactText")}</p>
          <form className="mt-6 grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder={t("pro.name")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
            <input
              type="text"
              placeholder={t("pro.specialty")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
            <input
              type="tel"
              placeholder={t("pro.phone")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
            <input
              type="email"
              placeholder={t("pro.email")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
            <button
              type="button"
              className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 sm:col-span-2"
            >
              {t("pro.submit")}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-400">
            {t("pro.explore")}{" "}
            <Link href="/recherche" className="text-primary-600 hover:underline">
              {t("confirm.search")}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
