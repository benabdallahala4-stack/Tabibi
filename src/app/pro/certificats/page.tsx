"use client";

// Certificats médicaux Seha Pro — Phase 1 « tuer Word ».
// Modèles conformes à la pratique tunisienne, remplis puis imprimés et remis
// en main propre. Aucun document médical n'est émis en ligne.

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRoleGate, SessionBar } from "@/components/RoleGuard";
import { useLocale } from "@/lib/i18n";

type TplId = "arret" | "aptitude" | "presence" | "bonnesante" | "reprise";

interface Template {
  id: TplId;
  label: string;
  labelAr: string;
  needsDays?: boolean;
  body: (p: { name: string; days: string; date: string }) => string;
  bodyAr: (p: { name: string; days: string; date: string }) => string;
}

const TEMPLATES: Template[] = [
  {
    id: "arret",
    label: "Arrêt de travail",
    labelAr: "شهادة عطلة مرض",
    needsDays: true,
    body: (p) => `certifie que l'état de santé de ${p.name || "……………"} nécessite un repos de ${p.days || "…"} jour(s) à compter du ${p.date}, sauf complications.`,
    bodyAr: (p) => `أشهد أنّ الحالة الصحية للسيد(ة) ${p.name || "……"} تستوجب راحة لمدة ${p.days || "…"} يوم(أيام) ابتداءً من ${p.date}، ما لم تطرأ مضاعفات.`,
  },
  {
    id: "aptitude",
    label: "Aptitude à la pratique sportive",
    labelAr: "شهادة أهلية لممارسة الرياضة",
    body: (p) => `certifie avoir examiné ${p.name || "……………"} ce jour et n'avoir constaté aucune contre-indication apparente à la pratique du sport.`,
    bodyAr: (p) => `أشهد أنّني فحصت ${p.name || "……"} هذا اليوم ولم ألاحظ أي مانع ظاهر لممارسة الرياضة.`,
  },
  {
    id: "presence",
    label: "Certificat de présence",
    labelAr: "شهادة حضور",
    body: (p) => `certifie que ${p.name || "……………"} s'est présenté(e) à ma consultation le ${p.date}.`,
    bodyAr: (p) => `أشهد أنّ ${p.name || "……"} حضر(ت) إلى عيادتي بتاريخ ${p.date}.`,
  },
  {
    id: "bonnesante",
    label: "Certificat de bonne santé",
    labelAr: "شهادة حسن صحة",
    body: (p) => `certifie avoir examiné ${p.name || "……………"} ce jour et l'avoir trouvé(e) en bon état de santé apparent.`,
    bodyAr: (p) => `أشهد أنّني فحصت ${p.name || "……"} هذا اليوم ووجدته(ها) في حالة صحية جيّدة ظاهريًا.`,
  },
  {
    id: "reprise",
    label: "Reprise du travail",
    labelAr: "شهادة استئناف العمل",
    body: (p) => `certifie que l'état de santé de ${p.name || "……………"} lui permet de reprendre son travail à compter du ${p.date}.`,
    bodyAr: (p) => `أشهد أنّ الحالة الصحية للسيد(ة) ${p.name || "……"} تسمح له(ها) باستئناف العمل ابتداءً من ${p.date}.`,
  },
];

export default function CertificatsPage() {
  const gate = useRoleGate(["medecin", "admin"]);
  const { locale } = useLocale();
  const fr = locale === "fr";

  const [tplId, setTplId] = useState<TplId>("arret");
  const [name, setName] = useState("");
  const [days, setDays] = useState("");
  const date = "06/07/2026";
  const tpl = useMemo(() => TEMPLATES.find((t) => t.id === tplId)!, [tplId]);

  if (gate) return gate;

  const doctor = { name: "Dr Amine Ben Salah", specialty: fr ? "Cardiologue" : "طبيب قلب", address: "12 Avenue Habib Bourguiba, 1001 Tunis", order: "12345" };

  return (
    <>
      <SessionBar />
      <div className="mx-auto max-w-6xl px-4 py-6 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">Seha Pro</p>
            <h1 className="text-2xl font-bold text-slate-800">{fr ? "Certificats médicaux" : "الشهادات الطبية"}</h1>
            <p className="text-sm text-slate-500">{fr ? "Modèles conformes, imprimés et remis en main propre." : "نماذج مطابقة، تُطبع وتُسلّم يدًا بيد."}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/pro/dashboard" className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">← {fr ? "Tableau de bord" : "لوحة التحكم"}</Link>
            <button type="button" onClick={() => window.print()} className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700">🖨️ {fr ? "Imprimer" : "طباعة"}</button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-bold text-slate-700">{fr ? "Type de certificat" : "نوع الشهادة"}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTplId(t.id)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${tplId === t.id ? "bg-primary-600 text-white" : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"}`}
                  >
                    {fr ? t.label : t.labelAr}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-bold text-slate-700">{fr ? "Informations" : "المعطيات"}</h2>
              <div className="mt-3 grid gap-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={fr ? "Nom & prénom du patient" : "اسم ولقب المريض"} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200" />
                {tpl.needsDays && (
                  <input value={days} onChange={(e) => setDays(e.target.value.replace(/[^0-9]/g, ""))} placeholder={fr ? "Nombre de jours de repos" : "عدد أيام الراحة"} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200" />
                )}
              </div>
            </section>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">{fr ? "Aperçu impression" : "معاينة الطباعة"}</p>
            <CertSheet fr={fr} doctor={doctor} tpl={tpl} name={name} days={days} date={date} preview />
          </div>
        </div>

        <p className="mt-6 rounded-xl bg-slate-100 p-4 text-xs leading-relaxed text-slate-500">
          ⚖️ {fr
            ? "Le certificat est imprimé, signé et remis en main propre après examen. Seha n'émet aucun document médical en ligne — il en garde uniquement la trace dans le dossier du patient."
            : "تُطبع الشهادة وتُمضى وتُسلّم يدًا بيد بعد الفحص. صحة لا يُصدر أي وثيقة طبية عبر الإنترنت، بل يحتفظ بأثرها في ملف المريض."}
        </p>
      </div>

      <div className="hidden print:block">
        <CertSheet fr={fr} doctor={doctor} tpl={tpl} name={name} days={days} date={date} />
      </div>
    </>
  );
}

function CertSheet({ fr, doctor, tpl, name, days, date, preview = false }: {
  fr: boolean;
  doctor: { name: string; specialty: string; address: string; order: string };
  tpl: Template; name: string; days: string; date: string; preview?: boolean;
}) {
  const p = { name, days, date };
  return (
    <div className={preview ? "rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200" : "mx-auto max-w-2xl bg-white p-10"}>
      <div className="flex items-start justify-between border-b-2 border-primary-600 pb-4">
        <div>
          <p className="text-lg font-bold text-primary-700">{doctor.name}</p>
          <p className="text-sm text-slate-600">{doctor.specialty}</p>
          <p className="mt-1 text-xs text-slate-500">{doctor.address}</p>
          <p className="text-xs text-slate-500">{fr ? "N° Ordre" : "رقم الترسيم"} : {doctor.order}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5"><span className="text-xl font-bold text-primary-700">Seha</span><span className="text-sm text-primary-400">صحة</span></div>
          <p className="mt-1 text-xs text-slate-400">Tunis, {date}</p>
        </div>
      </div>

      <h2 className="mt-8 text-center font-serif text-xl font-semibold uppercase tracking-wide text-slate-800">
        {fr ? tpl.label : tpl.labelAr}
      </h2>

      <p className="mt-6 text-[15px] leading-8 text-slate-700">
        {fr ? (
          <>Je soussigné, <b>{doctor.name}</b>, {doctor.specialty.toLowerCase()}, {tpl.body(p)}</>
        ) : (
          <span dir="rtl">أنا الموقّع أسفله، <b>{doctor.name}</b>، {tpl.bodyAr(p)}</span>
        )}
      </p>

      <p className="mt-3 text-xs text-slate-400">
        {fr ? "Certificat établi à la demande de l'intéressé(e) et remis en main propre pour faire valoir ce que de droit." : "شهادة مسلّمة بطلب من المعني(ة) بالأمر يدًا بيد للاستعمال القانوني."}
      </p>

      <div className="mt-12 flex items-end justify-end">
        <div className="text-center">
          <div className="h-14 w-40 border-b border-slate-300" />
          <p className="mt-1 text-xs text-slate-500">{fr ? "Cachet & signature" : "الختم والإمضاء"}</p>
        </div>
      </div>
    </div>
  );
}
