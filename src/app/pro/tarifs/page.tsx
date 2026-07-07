"use client";

// Abonnement Seha Pro — 3 paliers : Gratuit · Pro · Premium.
// Stratégie freemium : les fonctions Pro/Premium sont TOUJOURS visibles,
// verrouillées 🔒 tant que le plan ne les couvre pas. Paiement en ligne via
// passerelles tunisiennes (démo — aucun paiement réel).

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadPlan, savePlan, PLAN_LABELS, type Plan } from "@/lib/plan";
import { useLocale } from "@/lib/i18n";
import AppShell from "@/components/AppShell";

type Feat = { fr: string; ar: string; lock?: "pro" | "premium" };

interface Tier {
  id: Plan; // identifiant interne (avance = Pro)
  name: string;
  price: number;
  tagline: { fr: string; ar: string };
  popular?: boolean;
  features: Feat[];
}

const TIERS: Tier[] = [
  {
    id: "gratuit",
    name: "Gratuit",
    price: 0,
    tagline: { fr: "Pour être visible dès aujourd'hui", ar: "لتكون ظاهرًا اليوم" },
    features: [
      { fr: "Profil public vérifié (référencé dans la recherche)", ar: "ملف عمومي موثّق (ضمن نتائج البحث)" },
      { fr: "RDV en ligne (30/mois) + agenda de base", ar: "مواعيد عبر الإنترنت (30/شهر) + جدول أساسي" },
      { fr: "Répondre aux questions publiques", ar: "الإجابة عن الأسئلة العمومية" },
      { fr: "Dossiers patients (jusqu'à 50)", ar: "ملفات المرضى (حتى 50)" },
      { fr: "Ordonnancier & certificats", ar: "الوصفات والشهادات", lock: "pro" },
      { fr: "Caisse, impayés & bulletin CNAM", ar: "الصندوق وغير المدفوع وبطاقة الكنام", lock: "pro" },
      { fr: "Téléconsultation & analytics", ar: "الاستشارة عن بُعد والتحليلات", lock: "premium" },
    ],
  },
  {
    id: "avance",
    name: "Pro",
    price: 49,
    popular: true,
    tagline: { fr: "Remplace Excel, Word et l'agenda papier", ar: "يعوّض إكسل وورد والجدول الورقي" },
    features: [
      { fr: "Tout le Gratuit, plus :", ar: "كل المجاني، بالإضافة إلى:" },
      { fr: "RDV & patients illimités", ar: "مواعيد ومرضى بلا حدود" },
      { fr: "Ordonnancier + certificats (impression FR/AR)", ar: "الوصفات + الشهادات (طباعة فر/ع)" },
      { fr: "Dossier médical complet + historique", ar: "ملف طبي كامل + السجل" },
      { fr: "Caisse, impayés & statistiques", ar: "الصندوق وغير المدفوع والإحصائيات" },
      { fr: "Rappels SMS + WhatsApp illimités", ar: "تذكيرات SMS وواتساب بلا حدود" },
      { fr: "Bulletin de soins CNAM · file d'attente", ar: "بطاقة علاج الكنام · طابور الانتظار" },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 129,
    tagline: { fr: "Gros cabinets, cliniques, multi-site", ar: "العيادات الكبرى والمصحات ومتعددة المواقع" },
    features: [
      { fr: "Tout le Pro, plus :", ar: "كل Pro، بالإضافة إلى:" },
      { fr: "Téléconsultation vidéo + paiement en ligne", ar: "استشارة فيديو + دفع إلكتروني" },
      { fr: "Analytics avancés (revenus, cohortes)", ar: "تحليلات متقدّمة (المداخيل، الأفواج)" },
      { fr: "Multi-cabinet + comptes secrétaire", ar: "عيادات متعددة + حسابات كتابة" },
      { fr: "Export comptable + TVA", ar: "تصدير محاسبي + الأداء" },
      { fr: "Mise en avant + widget de réservation", ar: "إبراز + أداة حجز لموقعك" },
      { fr: "Import résultats labo · API · support prioritaire", ar: "استيراد نتائج المخبر · API · دعم بالأولوية" },
    ],
  },
];

const GATEWAYS = [
  { id: "clictopay", name: { fr: "ClicToPay — carte bancaire", ar: "ClicToPay — بطاقة بنكية" }, detail: { fr: "Passerelle officielle de la Société Monétique Tunisie", ar: "البوابة الرسمية للنقدية التونسية" }, emoji: "💳" },
  { id: "edinar", name: { fr: "e-Dinar", ar: "الدينار الإلكتروني" }, detail: { fr: "Carte e-Dinar de la Poste Tunisienne", ar: "بطاقة الدينار الإلكتروني للبريد التونسي" }, emoji: "📮" },
  { id: "konnect", name: { fr: "Konnect", ar: "Konnect" }, detail: { fr: "Agrégateur tunisien (cartes locales & internationales)", ar: "مجمّع تونسي (بطاقات محلية ودولية)" }, emoji: "🔗" },
  { id: "virement", name: { fr: "Virement bancaire", ar: "تحويل بنكي" }, detail: { fr: "Facture annuelle avec 2 mois offerts", ar: "فاتورة سنوية مع شهرين مجانًا" }, emoji: "🏦" },
];

export default function TarifsPage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [tier, setTier] = useState<string | null>(null);
  const [gateway, setGateway] = useState("clictopay");
  const [paid, setPaid] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan>("gratuit");
  const selected = TIERS.find((t) => t.id === tier);

  useEffect(() => setCurrentPlan(loadPlan()), []);

  function activateFree() {
    savePlan("gratuit");
    setCurrentPlan("gratuit");
  }
  function confirmPaid(id: Plan) {
    savePlan(id);
    setCurrentPlan(id);
    setPaid(true);
  }

  return (
    <AppShell>
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-center text-3xl font-bold text-slate-800">{fr ? "Tarifs Seha Pro" : "أسعار صحة برو"}</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-slate-500">
        {fr ? (
          <><span className="font-semibold text-primary-700">Commencez gratuitement</span> — passez à Pro quand votre cabinet est prêt. Sans engagement, résiliable à tout moment.</>
        ) : (
          <><span className="font-semibold text-primary-700">ابدأ مجانًا</span> — انتقل إلى Pro عندما تكون عيادتك جاهزة. دون التزام، قابل للإلغاء في أي وقت.</>
        )}
      </p>
      <p className="mt-2 text-center text-xs text-slate-400">
        {fr ? "Votre plan actuel : " : "خطتك الحالية: "}
        <span className="font-semibold text-slate-600">{PLAN_LABELS[currentPlan]}</span>
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.id}
            className={`relative flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-2 transition ${
              tier === t.id ? "ring-primary-600" : t.popular ? "ring-primary-300" : "ring-slate-200"
            }`}
          >
            {t.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white">
                {fr ? "Le plus choisi" : "الأكثر اختيارًا"}
              </span>
            )}
            <h2 className="text-lg font-bold text-slate-800">{t.name}</h2>
            <p className="text-sm text-slate-500">{fr ? t.tagline.fr : t.tagline.ar}</p>
            <p className="mt-4 text-3xl font-bold text-slate-800">
              {t.price === 0 ? (fr ? "0 DT" : "0 د.ت") : t.price}{" "}
              {t.price > 0 && <span className="text-base font-normal text-slate-500">{fr ? "DT / mois HT" : "د.ت / شهر"}</span>}
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm">
              {t.features.map((f) => {
                const label = fr ? f.fr : f.ar;
                const isHeader = f.fr.startsWith("Tout ");
                if (isHeader) return <li key={f.fr} className="font-semibold text-slate-800">{label}</li>;
                if (f.lock)
                  return (
                    <li key={f.fr} className="flex items-center gap-1.5 text-slate-400">
                      🔒 <span>{label}</span>
                      <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${f.lock === "premium" ? "bg-violet-50 text-violet-600" : "bg-amber-50 text-amber-700"}`}>
                        {f.lock === "premium" ? "Premium" : "Pro"}
                      </span>
                    </li>
                  );
                return <li key={f.fr} className="text-slate-600">✓ {label}</li>;
              })}
            </ul>
            {t.price === 0 ? (
              <Link
                href="/pro/inscription"
                onClick={activateFree}
                className="mt-6 rounded-xl bg-slate-800 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                {fr ? "Commencer gratuitement" : "ابدأ مجانًا"}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTier(t.id);
                  setPaid(false);
                }}
                className={`mt-6 rounded-xl px-6 py-3 text-sm font-semibold transition ${
                  tier === t.id ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                }`}
              >
                {tier === t.id ? (fr ? "Sélectionné ✓" : "محدَّد ✓") : `${fr ? "Choisir" : "اختر"} ${t.name}`}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Checkout */}
      {selected && (
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          {paid ? (
            <div className="text-center">
              <span className="text-5xl">🎉</span>
              <h2 className="mt-3 text-xl font-bold text-slate-800">
                {fr ? `Abonnement ${selected.name} activé (démo)` : `تم تفعيل اشتراك ${selected.name} (تجريبي)`}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {fr
                  ? "Environnement de démonstration : aucun paiement réel. En production, cette étape appelle l'API de la passerelle choisie puis active l'abonnement à la confirmation du webhook."
                  : "بيئة تجريبية: لا دفع فعلي. في الإنتاج، تستدعي هذه الخطوة واجهة البوابة المختارة ثم تفعّل الاشتراك عند تأكيد الـwebhook."}
              </p>
              <Link href="/pro/dashboard" className="mt-6 inline-block rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">
                {fr ? "Ouvrir mon espace praticien" : "افتح فضائي الطبي"}
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-800">
                {fr ? `Paiement — ${selected.name} (${selected.price} DT/mois)` : `الدفع — ${selected.name} (${selected.price} د.ت/شهر)`}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{fr ? "Choisissez votre moyen de paiement tunisien :" : "اختر وسيلة الدفع التونسية:"}</p>
              <div className="mt-4 space-y-2">
                {GATEWAYS.map((g) => (
                  <label
                    key={g.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      gateway === g.id ? "border-primary-500 bg-primary-50/50" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input type="radio" name="gateway" checked={gateway === g.id} onChange={() => setGateway(g.id)} className="accent-primary-600" />
                    <span className="text-2xl">{g.emoji}</span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">{fr ? g.name.fr : g.name.ar}</span>
                      <span className="block text-xs text-slate-500">{fr ? g.detail.fr : g.detail.ar}</span>
                    </span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => confirmPaid(selected.id)}
                className="mt-6 w-full rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white transition hover:bg-primary-700"
              >
                {fr ? `Payer ${selected.price} DT (démo)` : `ادفع ${selected.price} د.ت (تجريبي)`}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                {fr ? "🔒 Démo sans paiement réel. Production : redirection sécurisée, 3-D Secure, activation à la confirmation." : "🔒 تجريبي دون دفع فعلي. الإنتاج: تحويل آمن، 3-D Secure، تفعيل عند التأكيد."}
              </p>
            </>
          )}
        </div>
      )}
    </div>
    </AppShell>
  );
}
