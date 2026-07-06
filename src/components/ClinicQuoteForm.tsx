"use client";

// Demande de devis auprès d'une clinique (patients tunisiens et internationaux).

import { useState } from "react";
import { useLocale } from "@/lib/i18n";

const L = {
  fr: {
    title: "Demander un devis",
    sub: "Décrivez votre besoin : la clinique vous répond avec un devis et les étapes de prise en charge (sous 48 h ouvrées).",
    name: "Nom et prénom",
    phone: "Téléphone / WhatsApp",
    country: "Pays",
    countries: ["Tunisie", "Libye", "Algérie", "Autre"],
    speciality: "Spécialité / intervention souhaitée",
    details: "Décrivez votre situation (antécédents, examens déjà faits, dates souhaitées…)",
    submit: "Envoyer la demande de devis",
    ok: "✓ Demande envoyée (démo). La clinique vous recontactera par téléphone ou WhatsApp. Astuce : préparez votre dossier médical Seha pour accélérer la prise en charge.",
  },
  ar: {
    title: "طلب تسعيرة",
    sub: "صف حاجتك: تجيبك المصحة بتسعيرة وخطوات التكفل (خلال 48 ساعة عمل).",
    name: "الاسم واللقب",
    phone: "الهاتف / واتساب",
    country: "البلد",
    countries: ["تونس", "ليبيا", "الجزائر", "أخرى"],
    speciality: "الاختصاص / التدخل المطلوب",
    details: "صف حالتك (السوابق، الفحوصات المنجزة، التواريخ المرغوبة…)",
    submit: "إرسال طلب التسعيرة",
    ok: "✓ تم إرسال الطلب (تجريبي). ستتواصل معك المصحة هاتفيًا أو عبر واتساب. نصيحة: جهّز ملفك الطبي على صحة لتسريع التكفل.",
  },
};

export default function ClinicQuoteForm({ clinicName }: { clinicName: string }) {
  const { locale } = useLocale();
  const t = L[locale];
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", country: t.countries[0], speciality: "", details: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    // Démo : la demande est conservée localement. Production : envoi à la
    // clinique (e-mail/CRM) + accusé WhatsApp au patient.
    const all = JSON.parse(window.localStorage.getItem("seha.quotes") ?? "[]");
    all.push({ ...form, clinicName, at: new Date().toISOString() });
    window.localStorage.setItem("seha.quotes", JSON.stringify(all));
    setSent(true);
  }

  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-bold text-slate-800">💬 {t.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{t.sub}</p>
      {sent ? (
        <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{t.ok}</p>
      ) : (
        <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={`${t.name} *`}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
          />
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder={`${t.phone} *`}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
          />
          <select
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
            aria-label={t.country}
          >
            {t.countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            value={form.speciality}
            onChange={(e) => setForm({ ...form, speciality: e.target.value })}
            placeholder={t.speciality}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
          />
          <textarea
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            placeholder={t.details}
            rows={3}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 sm:col-span-2"
          />
          <button className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 sm:col-span-2">
            {t.submit}
          </button>
        </form>
      )}
    </section>
  );
}
