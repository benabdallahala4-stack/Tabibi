"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/lib/i18n";
import { SPECIALTIES } from "@/lib/data";
import { FILIERES, INSURERS, estimateReimbursement } from "@/lib/insurance";

export default function CnamPage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]?.label ?? "Médecine générale");
  const [price, setPrice] = useState(60);

  const est = useMemo(() => estimateReimbursement(price, specialty), [price, specialty]);

  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-800 to-primary-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-200">
            {fr ? "Assurance maladie" : "التأمين على المرض"}
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            {fr ? "Comment la CNAM vous rembourse" : "كيف تعوّضك الكنام"}
          </h1>
          <p className="mt-3 max-w-2xl text-primary-100/90">
            {fr
              ? "La CNAM (Caisse Nationale d'Assurance Maladie) est l'assurance maladie obligatoire en Tunisie. Voici, simplement, comment fonctionnent les filières, le remboursement, le tiers payant et les assurances complémentaires."
              : "الكنام (الصندوق الوطني للتأمين على المرض) هو التأمين الإجباري على المرض في تونس. إليك ببساطة كيف تعمل المسارات والإرجاع والدفع المسبق والتأمينات التكميلية."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/recherche?cnam=1" className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-800 hover:bg-primary-50">
              {fr ? "Trouver un médecin conventionné" : "ابحث عن طبيب متعاقد"}
            </Link>
            <a href="#estimateur" className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/25 hover:bg-white/20">
              {fr ? "Estimer mon remboursement" : "قدّر تعويضي"}
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-12 px-4 py-12">
        {/* Filières */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800">
            {fr ? "Les 3 filières — vous en choisissez une" : "المسارات الثلاثة — تختار واحدًا"}
          </h2>
          <p className="mt-1 text-slate-500">
            {fr
              ? "À l'affiliation, vous choisissez comment vous êtes soigné et remboursé."
              : "عند الانخراط، تختار كيف تُعالَج وكيف تُعوَّض."}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {FILIERES.map((f, i) => (
              <div key={f.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-bold text-slate-800">{fr ? f.title : f.titleAr}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{fr ? f.text : f.textAr}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Estimateur */}
        <section id="estimateur" className="scroll-mt-20 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">
            {fr ? "Estimateur de remboursement" : "حاسبة التعويض"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {fr
              ? "Le remboursement se calcule sur le tarif de référence CNAM — pas sur le prix réel du médecin."
              : "يُحسب التعويض على التعريفة المرجعية للكنام — لا على السعر الحقيقي للطبيب."}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{fr ? "Spécialité" : "الاختصاص"}</span>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                {SPECIALTIES.map((s) => (
                  <option key={s.id} value={s.label}>
                    {fr ? s.label : s.labelAr}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {fr ? "Prix de la consultation (DT)" : "سعر الاستشارة (د.ت)"}
              </span>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </label>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4 text-center ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-500">{fr ? "Tarif de référence" : "التعريفة المرجعية"}</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{est.ref} DT</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center ring-1 ring-emerald-100">
              <p className="text-xs uppercase tracking-wide text-emerald-700">{fr ? "Remboursé (≥70%)" : "المُعوّض (≥70٪)"}</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{est.reimbursed} DT</p>
            </div>
            <div className="rounded-xl bg-primary-50 p-4 text-center ring-1 ring-primary-100">
              <p className="text-xs uppercase tracking-wide text-primary-700">{fr ? "Reste à charge" : "يبقى على عاتقك"}</p>
              <p className="mt-1 text-2xl font-bold text-primary-700">{est.outOfPocket} DT</p>
            </div>
          </div>
          {est.refCapsPrice && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 ring-1 ring-amber-100">
              ⚠️ {fr
                ? `Le prix (${price} DT) dépasse le tarif de référence (${est.ref} DT) : le dépassement reste à votre charge.`
                : `السعر (${price} د.ت) يفوق التعريفة المرجعية (${est.ref} د.ت): الفارق يبقى على عاتقك.`}
            </p>
          )}
          <p className="mt-3 text-xs text-slate-400">
            {fr
              ? "Estimation indicative. Tarifs, taux et plafonds évoluent par arrêté ; les affections chroniques (APCI) sont prises en charge à 100 %."
              : "تقدير إرشادي. التعريفات والنسب والسقوف تتغيّر بمقتضى قرار؛ الأمراض المزمنة (APCI) تُغطّى بنسبة 100٪."}
          </p>
        </section>

        {/* Tiers payant + APCI */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-bold text-slate-800">{fr ? "Le tiers payant" : "الدفع المسبق (تيار بايان)"}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {fr
                ? "Avec le tiers payant, la CNAM paie directement le prestataire : vous ne réglez que le ticket modérateur (votre part). Il s'applique surtout à l'hospitalisation, à la pharmacie (médicaments remboursables) et aux analyses."
                : "مع الدفع المسبق، تدفع الكنام مباشرة لمزوّد الخدمة: لا تدفع إلا معلوم المساهمة (حصتك). ينطبق خاصة على الاستشفاء والصيدلية (الأدوية القابلة للإرجاع) والتحاليل."}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-bold text-slate-800">{fr ? "APCI — maladies chroniques" : "APCI — الأمراض المزمنة"}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {fr
                ? "Environ 24 affections de longue durée (diabète, hypertension, cancer, insuffisance rénale, cardiopathies…) sont prises en charge à 100 %, sans plafond annuel, une fois le dossier APCI approuvé."
                : "حوالي 24 مرضًا مزمنًا (السكري، ضغط الدم، السرطان، القصور الكلوي، أمراض القلب…) تُغطّى بنسبة 100٪ دون سقف سنوي بعد قبول ملف APCI."}
            </p>
          </div>
        </section>

        {/* Assurances privées */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800">
            {fr ? "Assurances privées & mutuelles" : "التأمينات الخاصة والتعاضديات"}
          </h2>
          <p className="mt-1 text-slate-500">
            {fr
              ? "En complément de la CNAM, une assurance de groupe (souvent via l'employeur) peut couvrir tout ou partie du reste à charge. Beaucoup de praticiens facturent directement ces assureurs."
              : "إضافة إلى الكنام، يمكن لتأمين جماعي (غالبًا عبر المشغّل) أن يغطّي كل أو جزء ممّا يبقى على عاتقك. كثير من الأطباء يفوترون هذه الشركات مباشرة."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {INSURERS.map((i) => (
              <span key={i.id} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
                {i.label}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500">
            {fr
              ? "Sur chaque profil praticien, l'onglet « Assurance & remboursement » indique s'il est conventionné CNAM, s'il pratique le tiers payant, et quelles assurances il accepte."
              : "في كل ملف طبيب، يبيّن قسم « التأمين والتعويض » هل هو متعاقد مع الكنام، وهل يمارس الدفع المسبق، وأيّ تأمينات يقبل."}
          </p>
        </section>

        {/* Glossaire */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800">{fr ? "Petit glossaire" : "مصطلحات مفيدة"}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                t: fr ? "Ticket modérateur" : "معلوم المساهمة",
                d: fr ? "La part qui reste à votre charge après le remboursement CNAM." : "الحصة التي تبقى على عاتقك بعد تعويض الكنام.",
              },
              {
                t: fr ? "Tarif de référence" : "التعريفة المرجعية",
                d: fr ? "Le montant officiel sur lequel la CNAM calcule le remboursement (≠ prix réel)." : "المبلغ الرسمي الذي تحسب عليه الكنام التعويض (≠ السعر الحقيقي).",
              },
              {
                t: fr ? "Conventionné" : "متعاقد",
                d: fr ? "Praticien ayant signé une convention avec la CNAM (tarifs officiels, prise en charge)." : "طبيب أمضى اتفاقية مع الكنام (تعريفات رسمية وتكفّل).",
              },
              {
                t: fr ? "Bulletin de soins" : "بطاقة العلاج",
                d: fr ? "Le formulaire que le praticien remplit pour votre demande de remboursement." : "الاستمارة التي يملؤها الطبيب لطلب تعويضك.",
              },
            ].map((g) => (
              <div key={g.t} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <dt className="font-semibold text-slate-800">{g.t}</dt>
                <dd className="mt-1 text-sm text-slate-600">{g.d}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-center text-white">
          <h2 className="text-xl font-bold">{fr ? "Prêt à réserver malin ?" : "جاهز للحجز بذكاء؟"}</h2>
          <p className="mx-auto mt-1 max-w-lg text-sm text-primary-100">
            {fr
              ? "Filtrez les praticiens conventionnés CNAM et voyez l'estimation de remboursement directement sur leur profil."
              : "فلتر الأطباء المتعاقدين مع الكنام وشاهد تقدير التعويض مباشرة في ملفهم."}
          </p>
          <Link href="/recherche?cnam=1" className="mt-5 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-800 hover:bg-primary-50">
            {fr ? "Voir les médecins conventionnés" : "شاهد الأطباء المتعاقدين"}
          </Link>
        </section>

        <p className="text-center text-xs text-slate-400">
          {fr
            ? "Information générale à but pédagogique — ne remplace pas les règles officielles de la CNAM (cnam.nat.tn)."
            : "معلومات عامة لغرض تعليمي — لا تعوّض القواعد الرسمية للكنام (cnam.nat.tn)."}
        </p>
      </div>
    </div>
  );
}
