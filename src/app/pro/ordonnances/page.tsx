"use client";

// Ordonnancier Seha Pro — Phase 1 « tuer Word ».
// Recherche dans la base médicaments (DCI + noms tunisiens + prix), construction
// d'une ordonnance et impression bilingue FR/AR. Aucun document n'est émis en
// ligne : l'ordonnance est imprimée et remise/signée en main propre au cabinet.

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRoleGate, SessionBar } from "@/components/RoleGuard";
import { useLocale } from "@/lib/i18n";
import { MEDICINES, type Medicine } from "@/lib/medicines";

interface Line {
  med: Medicine;
  posology: string;
  duration: string;
}

export default function OrdonnancesPage() {
  const gate = useRoleGate(["medecin", "admin"]);
  const { locale } = useLocale();
  const fr = locale === "fr";

  const [query, setQuery] = useState("");
  const [patient, setPatient] = useState({ name: "", nameAr: "", age: "", cnam: "" });
  const [lines, setLines] = useState<Line[]>([]);
  const [doctor] = useState({
    name: "Dr Amine Ben Salah",
    specialty: fr ? "Cardiologue" : "طبيب قلب",
    address: "12 Avenue Habib Bourguiba, 1001 Tunis",
    phone: "+216 71 000 000",
    order: "12345",
  });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MEDICINES.filter(
      (m) => m.brand.toLowerCase().includes(q) || m.dci.toLowerCase().includes(q) || m.classe.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  if (gate) return gate;

  function addMed(med: Medicine) {
    if (lines.some((l) => l.med.id === med.id)) return;
    setLines((ls) => [...ls, { med, posology: "", duration: "" }]);
    setQuery("");
  }
  function updateLine(id: string, patch: Partial<Line>) {
    setLines((ls) => ls.map((l) => (l.med.id === id ? { ...l, ...patch } : l)));
  }
  function removeLine(id: string) {
    setLines((ls) => ls.filter((l) => l.med.id !== id));
  }

  const today = "06/07/2026"; // démo : date figée (déterministe)

  return (
    <>
      <SessionBar />
      <div className="mx-auto max-w-6xl px-4 py-6 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">Seha Pro</p>
            <h1 className="text-2xl font-bold text-slate-800">{fr ? "Ordonnancier" : "الوصفات الطبية"}</h1>
            <p className="text-sm text-slate-500">
              {fr
                ? "Recherchez, composez, imprimez — remise en main propre au cabinet."
                : "ابحث، حرّر، اطبع — تُسلّم يدًا بيد في العيادة."}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/pro/dashboard" className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
              ← {fr ? "Tableau de bord" : "لوحة التحكم"}
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={lines.length === 0}
              className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-40"
            >
              🖨️ {fr ? "Imprimer l'ordonnance" : "طباعة الوصفة"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* ---- Composition ---- */}
          <div className="space-y-5">
            {/* Patient */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-bold text-slate-700">{fr ? "Patient" : "المريض"}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  value={patient.name}
                  onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                  placeholder={fr ? "Nom & prénom" : "الاسم واللقب"}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200"
                />
                <input
                  value={patient.nameAr}
                  onChange={(e) => setPatient({ ...patient, nameAr: e.target.value })}
                  placeholder="الاسم بالعربية"
                  dir="rtl"
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200"
                />
                <input
                  value={patient.age}
                  onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                  placeholder={fr ? "Âge" : "العمر"}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200"
                />
                <input
                  value={patient.cnam}
                  onChange={(e) => setPatient({ ...patient, cnam: e.target.value })}
                  placeholder={fr ? "N° CNAM (optionnel)" : "رقم الكنام (اختياري)"}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </section>

            {/* Recherche médicament */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-bold text-slate-700">{fr ? "Ajouter un médicament" : "إضافة دواء"}</h2>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={fr ? "Nom commercial, DCI ou classe (ex. amlo, paracétamol…)" : "الاسم التجاري أو الـDCI…"}
                className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-200"
              />
              {results.length > 0 && (
                <ul className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-xl ring-1 ring-slate-100">
                  {results.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => addMed(m)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-primary-50"
                      >
                        <span className="text-lg">💊</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-slate-800">
                            {m.brand} <span className="font-normal text-slate-400">· {m.form}</span>
                          </span>
                          <span className="block text-xs text-slate-500">
                            DCI : {m.dci}
                            {m.prescription && <span className="ml-2 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Liste</span>}
                            {m.cnam && <span className="ml-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">CNAM</span>}
                          </span>
                        </span>
                        <span className="font-mono text-xs font-semibold text-primary-600">{m.priceTnd.toFixed(1)} DT</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Lignes de l'ordonnance */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-bold text-slate-700">
                {fr ? "Ordonnance" : "الوصفة"} <span className="text-slate-400">({lines.length})</span>
              </h2>
              {lines.length === 0 && (
                <p className="mt-3 text-sm text-slate-400">{fr ? "Aucun médicament ajouté." : "لم تُضف أي دواء."}</p>
              )}
              <div className="mt-3 space-y-3">
                {lines.map((l, i) => (
                  <div key={l.med.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-800">
                        {i + 1}. {l.med.brand} <span className="font-normal text-slate-400">· {l.med.form}</span>
                      </span>
                      <button type="button" onClick={() => removeLine(l.med.id)} className="text-xs font-medium text-accent-600 hover:underline">
                        {fr ? "Retirer" : "حذف"}
                      </button>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <input
                        value={l.posology}
                        onChange={(e) => updateLine(l.med.id, { posology: e.target.value })}
                        placeholder={fr ? "Posologie (ex. 1 cp matin & soir)" : "الجرعة"}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-200"
                      />
                      <input
                        value={l.duration}
                        onChange={(e) => updateLine(l.med.id, { duration: e.target.value })}
                        placeholder={fr ? "Durée (ex. 7 jours)" : "المدة"}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ---- Aperçu ---- */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">{fr ? "Aperçu impression" : "معاينة الطباعة"}</p>
            <OrdonnanceSheet fr={fr} doctor={doctor} patient={patient} lines={lines} date={today} preview />
          </div>
        </div>

        <p className="mt-6 rounded-xl bg-slate-100 p-4 text-xs leading-relaxed text-slate-500">
          ⚖️{" "}
          {fr
            ? "Conforme à la pratique tunisienne : l'ordonnance est imprimée puis signée et remise en main propre. Seha n'émet aucun document médical en ligne — il en conserve uniquement la trace dans le dossier. Prix indicatifs (base DPM), à vérifier en pharmacie."
            : "مطابق للممارسة التونسية: تُطبع الوصفة ثم تُمضى وتُسلّم يدًا بيد. صحة لا يُصدر أي وثيقة طبية عبر الإنترنت. الأسعار إرشادية (قاعدة DPM)."}
        </p>
      </div>

      {/* Version imprimable plein écran */}
      <div className="hidden print:block">
        <OrdonnanceSheet fr={fr} doctor={doctor} patient={patient} lines={lines} date={today} />
      </div>
    </>
  );
}

function OrdonnanceSheet({
  fr,
  doctor,
  patient,
  lines,
  date,
  preview = false,
}: {
  fr: boolean;
  doctor: { name: string; specialty: string; address: string; phone: string; order: string };
  patient: { name: string; nameAr: string; age: string; cnam: string };
  lines: Line[];
  date: string;
  preview?: boolean;
}) {
  return (
    <div className={preview ? "rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200" : "mx-auto max-w-2xl bg-white p-10"}>
      {/* En-tête praticien */}
      <div className="flex items-start justify-between border-b-2 border-primary-600 pb-4">
        <div>
          <p className="text-lg font-bold text-primary-700">{doctor.name}</p>
          <p className="text-sm text-slate-600">{doctor.specialty}</p>
          <p className="mt-1 text-xs text-slate-500">{doctor.address}</p>
          <p className="text-xs text-slate-500">
            Tél : {doctor.phone} · {fr ? "N° Ordre" : "رقم الترسيم"} : {doctor.order}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-xl font-bold text-primary-700">Seha</span>
            <span className="text-sm text-primary-400">صحة</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Tunis, {date}</p>
        </div>
      </div>

      {/* Patient */}
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <p className="text-slate-700">
          <span className="text-slate-400">{fr ? "Patient : " : "المريض : "}</span>
          <span className="font-semibold">{patient.name || "—"}</span>
          {patient.nameAr && <span className="ms-2 font-semibold" dir="rtl">{patient.nameAr}</span>}
        </p>
        <p className="text-slate-500">
          {patient.age && <>{fr ? "Âge : " : "العمر : "}{patient.age}</>}
          {patient.cnam && <span className="ms-3">CNAM : {patient.cnam}</span>}
        </p>
      </div>

      {/* Rx */}
      <div className="mt-5">
        <p className="font-serif text-3xl font-semibold text-primary-700">℞</p>
        <ol className="mt-2 space-y-3">
          {lines.length === 0 && <li className="text-sm text-slate-300">{fr ? "(ordonnance vide)" : "(وصفة فارغة)"}</li>}
          {lines.map((l, i) => (
            <li key={l.med.id} className="border-b border-dashed border-slate-200 pb-2">
              <p className="text-sm font-semibold text-slate-800">
                {i + 1}. {l.med.brand} <span className="font-normal text-slate-500">— {l.med.form}</span>
              </p>
              <p className="text-xs text-slate-500">
                {l.med.dci}
                {l.posology && <span className="ms-2 text-slate-700">· {l.posology}</span>}
                {l.duration && <span className="ms-2 text-slate-700">· {l.duration}</span>}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Signature */}
      <div className="mt-10 flex items-end justify-between">
        <p className="text-[11px] text-slate-400">
          {fr
            ? "Document imprimé, signé et remis en main propre."
            : "وثيقة مطبوعة، مُمضاة وتُسلّم يدًا بيد."}
        </p>
        <div className="text-center">
          <div className="h-14 w-40 border-b border-slate-300" />
          <p className="mt-1 text-xs text-slate-500">{fr ? "Cachet & signature" : "الختم والإمضاء"}</p>
        </div>
      </div>
    </div>
  );
}
