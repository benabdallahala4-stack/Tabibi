"use client";

// Bulletin de soins CNAM — Seha Pro (Phase 1/2).
// Pré-remplit le formulaire de remboursement : patient, acte, tarif de référence
// et estimation CNAM (réutilise src/lib/insurance.ts). Imprimé et remis au
// patient pour sa demande de remboursement (système du remboursement).

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRoleGate, SessionBar } from "@/components/RoleGuard";
import { useLocale } from "@/lib/i18n";
import { SPECIALTIES } from "@/lib/data";
import { estimateReimbursement } from "@/lib/insurance";

const QUALITY = [
  { id: "assure", fr: "Assuré(e)", ar: "المؤمَّن" },
  { id: "conjoint", fr: "Conjoint(e)", ar: "القرين" },
  { id: "enfant", fr: "Enfant", ar: "الابن/الابنة" },
  { id: "ascendant", fr: "Ascendant", ar: "الأصل" },
];

export default function BulletinPage() {
  const gate = useRoleGate(["medecin", "admin"]);
  const { locale } = useLocale();
  const fr = locale === "fr";

  const [f, setF] = useState({
    name: "",
    nameAr: "",
    cnam: "",
    quality: "assure",
    acte: fr ? "Consultation" : "استشارة",
    specialty: SPECIALTIES[0]?.label ?? "Médecine générale",
    amount: 50,
  });
  const set = (patch: Partial<typeof f>) => setF((s) => ({ ...s, ...patch }));
  const est = useMemo(() => estimateReimbursement(f.amount, f.specialty), [f.amount, f.specialty]);
  const date = "06/07/2026";
  const doctor = { name: "Dr Amine Ben Salah", specialty: fr ? "Cardiologue" : "طبيب قلب", convention: "CNAM-2011-31-4587", order: "12345" };

  if (gate) return gate;

  return (
    <>
      <SessionBar />
      <div className="mx-auto max-w-6xl px-4 py-6 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">Seha Pro · CNAM</p>
            <h1 className="text-2xl font-bold text-slate-800">{fr ? "Bulletin de soins" : "بطاقة العلاج"}</h1>
            <p className="text-sm text-slate-500">
              {fr ? "Pré-rempli pour la demande de remboursement du patient." : "مُعبّأة مسبقًا لطلب تعويض المريض."}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/pro/dashboard" className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">← {fr ? "Tableau de bord" : "لوحة التحكم"}</Link>
            <button type="button" onClick={() => window.print()} className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700">🖨️ {fr ? "Imprimer" : "طباعة"}</button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <div className="space-y-5">
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-bold text-slate-700">{fr ? "Patient / bénéficiaire" : "المريض / المستفيد"}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder={fr ? "Nom & prénom" : "الاسم واللقب"} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200" />
                <input value={f.nameAr} onChange={(e) => set({ nameAr: e.target.value })} placeholder="الاسم بالعربية" dir="rtl" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200" />
                <input value={f.cnam} onChange={(e) => set({ cnam: e.target.value })} placeholder={fr ? "N° d'identifiant unique CNAM" : "رقم التعريف الوحيد بالكنام"} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200" />
                <select value={f.quality} onChange={(e) => set({ quality: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200">
                  {QUALITY.map((q) => <option key={q.id} value={q.id}>{fr ? q.fr : q.ar}</option>)}
                </select>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-bold text-slate-700">{fr ? "Acte" : "العمل الطبي"}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input value={f.acte} onChange={(e) => set({ acte: e.target.value })} placeholder={fr ? "Libellé de l'acte" : "تسمية العمل"} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200" />
                <select value={f.specialty} onChange={(e) => set({ specialty: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200">
                  {SPECIALTIES.map((s) => <option key={s.id} value={s.label}>{fr ? s.label : s.labelAr}</option>)}
                </select>
                <label className="block">
                  <span className="text-xs text-slate-500">{fr ? "Montant payé (DT)" : "المبلغ المدفوع (د.ت)"}</span>
                  <input type="number" min={0} value={f.amount} onChange={(e) => set({ amount: Math.max(0, Number(e.target.value) || 0) })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200" />
                </label>
              </div>
            </section>
          </div>

          {/* Preview */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">{fr ? "Aperçu impression" : "معاينة الطباعة"}</p>
            <BulletinSheet fr={fr} doctor={doctor} f={f} est={est} date={date} preview />
          </div>
        </div>

        <p className="mt-6 rounded-xl bg-slate-100 p-4 text-xs leading-relaxed text-slate-500">
          ⚖️ {fr
            ? "Estimation indicative sur le tarif de référence CNAM (≥70 %, hors APCI à 100 %). Le remboursement réel dépend de la filière et du plafond du patient. Bulletin remis en main propre."
            : "تقدير إرشادي على التعريفة المرجعية للكنام (≥70٪، عدا APCI بنسبة 100٪). التعويض الفعلي يتوقّف على المسار وسقف المريض. تُسلّم البطاقة يدًا بيد."}
        </p>
      </div>

      <div className="hidden print:block">
        <BulletinSheet fr={fr} doctor={doctor} f={f} est={est} date={date} />
      </div>
    </>
  );
}

function BulletinSheet({ fr, doctor, f, est, date, preview = false }: {
  fr: boolean;
  doctor: { name: string; specialty: string; convention: string; order: string };
  f: { name: string; nameAr: string; cnam: string; quality: string; acte: string; specialty: string; amount: number };
  est: { ref: number; reimbursed: number; outOfPocket: number };
  date: string;
  preview?: boolean;
}) {
  const q = QUALITY.find((x) => x.id === f.quality);
  const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
    <div className="flex justify-between border-b border-dashed border-slate-200 py-1.5 text-sm">
      <span className="text-slate-500">{k}</span>
      <span className="font-medium text-slate-800">{v}</span>
    </div>
  );
  return (
    <div className={preview ? "rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200" : "mx-auto max-w-2xl bg-white p-10"}>
      <div className="flex items-start justify-between border-b-2 border-primary-600 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
            {fr ? "Bulletin de soins — CNAM" : "بطاقة علاج — الكنام"}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-800">{doctor.name}</p>
          <p className="text-xs text-slate-500">{doctor.specialty} · {fr ? "Conventionné" : "متعاقد"} · {doctor.convention}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5"><span className="text-lg font-bold text-primary-700">Seha</span><span className="text-xs text-primary-400">صحة</span></div>
          <p className="mt-1 text-xs text-slate-400">Tunis, {date}</p>
        </div>
      </div>

      <div className="mt-4">
        <Row k={fr ? "Bénéficiaire" : "المستفيد"} v={<>{f.name || "—"}{f.nameAr && <span className="ms-2" dir="rtl">{f.nameAr}</span>}</>} />
        <Row k={fr ? "Qualité" : "الصفة"} v={fr ? q?.fr : q?.ar} />
        <Row k={fr ? "Identifiant CNAM" : "المعرّف بالكنام"} v={<span dir="ltr">{f.cnam || "—"}</span>} />
        <Row k={fr ? "Acte" : "العمل الطبي"} v={f.acte} />
        <Row k={fr ? "Date de l'acte" : "تاريخ العمل"} v={date} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">{fr ? "Montant payé" : "المبلغ المدفوع"}</p>
          <p className="mt-0.5 text-lg font-bold text-slate-800">{f.amount} DT</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
          <p className="text-[10px] uppercase tracking-wide text-emerald-700">{fr ? "Remboursé CNAM ≈" : "تعويض الكنام ≈"}</p>
          <p className="mt-0.5 text-lg font-bold text-emerald-700">{est.reimbursed} DT</p>
        </div>
        <div className="rounded-xl bg-primary-50 p-3 ring-1 ring-primary-100">
          <p className="text-[10px] uppercase tracking-wide text-primary-700">{fr ? "Reste à charge ≈" : "يبقى على العاتق ≈"}</p>
          <p className="mt-0.5 text-lg font-bold text-primary-700">{est.outOfPocket} DT</p>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-400">
        {fr ? `Tarif de référence CNAM : ${est.ref} DT` : `التعريفة المرجعية للكنام: ${est.ref} د.ت`}
      </p>

      <div className="mt-10 flex items-end justify-between">
        <p className="text-[11px] text-slate-400">{fr ? "Cachet du praticien conventionné." : "ختم الطبيب المتعاقد."}</p>
        <div className="text-center">
          <div className="h-14 w-40 border-b border-slate-300" />
          <p className="mt-1 text-xs text-slate-500">{fr ? "Cachet & signature" : "الختم والإمضاء"}</p>
        </div>
      </div>
    </div>
  );
}
