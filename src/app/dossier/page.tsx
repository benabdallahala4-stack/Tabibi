"use client";

// Mon dossier médical — le patient saisit ses informations, téléverse
// photos/PDF et contrôle l'accès des praticiens (code de partage).

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n";
import {
  emptyRecord,
  generateCode,
  loadRecord,
  saveRecord,
  totalDocumentsBytes,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  type MedicalDocument,
  type MedicalRecord,
} from "@/lib/medicalRecord";

const L = {
  fr: {
    title: "Mon dossier médical",
    sub: "Votre dossier vous appartient : remplissez-le une fois, partagez-le au médecin de votre choix, coupez l'accès quand vous voulez.",
    info: "Informations médicales",
    bloodType: "Groupe sanguin",
    height: "Taille (cm)",
    weight: "Poids (kg)",
    allergies: "Allergies (médicaments, aliments…)",
    chronic: "Maladies chroniques (diabète, HTA…)",
    medications: "Traitements en cours",
    surgeries: "Antécédents chirurgicaux",
    family: "Antécédents familiaux",
    save: "Enregistrer",
    saved: "Dossier enregistré ✓",
    docs: "Mes documents (photos, PDF)",
    docsSub: "Ordonnances, analyses, radios, comptes rendus… Formats : images et PDF.",
    upload: "+ Ajouter un document",
    category: "Catégorie",
    cats: { ordonnance: "Ordonnance", analyse: "Analyse", imagerie: "Imagerie/Radio", "compte-rendu": "Compte rendu", vaccination: "Vaccination", autre: "Autre" },
    open: "Ouvrir",
    delete: "Supprimer",
    empty: "Aucun document pour l'instant.",
    tooBig: "Fichier trop volumineux (max 1,5 Mo par document en démo).",
    quotaFull: "Espace de démonstration plein (3,5 Mo). Supprimez un document.",
    badType: "Format non pris en charge (images et PDF uniquement).",
    used: "Espace utilisé",
    share: "Partage avec mon médecin",
    shareText: "Activez le partage puis donnez ce code à votre praticien (au cabinet, en visio ou par message). Il le saisit dans son espace Tabibi Pro pour consulter votre dossier. Désactivez ou changez le code à tout moment pour couper l'accès.",
    shareOn: "Partage activé",
    shareOff: "Partage désactivé",
    accessCode: "Code d'accès",
    regenerate: "Changer le code",
    legal: "🔒 Vos données restent sur cet appareil (démo). En production : stockage chiffré en Tunisie, conforme à la loi n° 2004-63 et à l'INPDP, avec journal des accès praticiens.",
  },
  ar: {
    title: "ملفي الطبي",
    sub: "ملفك ملك لك: املأه مرة واحدة، شاركه مع الطبيب الذي تختاره، واقطع الوصول متى شئت.",
    info: "المعلومات الطبية",
    bloodType: "فصيلة الدم",
    height: "الطول (سم)",
    weight: "الوزن (كغ)",
    allergies: "الحساسية (أدوية، أطعمة…)",
    chronic: "الأمراض المزمنة (سكري، ضغط…)",
    medications: "الأدوية الحالية",
    surgeries: "العمليات الجراحية السابقة",
    family: "السوابق العائلية",
    save: "حفظ",
    saved: "تم حفظ الملف ✓",
    docs: "وثائقي (صور، PDF)",
    docsSub: "وصفات، تحاليل، أشعة، تقارير… الصيغ المقبولة: صور وPDF.",
    upload: "+ إضافة وثيقة",
    category: "الفئة",
    cats: { ordonnance: "وصفة طبية", analyse: "تحليل", imagerie: "أشعة/تصوير", "compte-rendu": "تقرير طبي", vaccination: "تلقيح", autre: "أخرى" },
    open: "فتح",
    delete: "حذف",
    empty: "لا توجد وثائق بعد.",
    tooBig: "الملف كبير جدًا (الحد الأقصى 1.5 م.ب في النسخة التجريبية).",
    quotaFull: "المساحة التجريبية ممتلئة (3.5 م.ب). احذف وثيقة.",
    badType: "صيغة غير مدعومة (صور وPDF فقط).",
    used: "المساحة المستعملة",
    share: "المشاركة مع طبيبي",
    shareText: "فعّل المشاركة ثم أعطِ هذا الرمز لطبيبك (في العيادة، عبر الفيديو أو برسالة). يُدخله الطبيب في فضاء طبيبي برو للاطلاع على ملفك. عطّل المشاركة أو غيّر الرمز في أي وقت لقطع الوصول.",
    shareOn: "المشاركة مفعّلة",
    shareOff: "المشاركة معطّلة",
    accessCode: "رمز الوصول",
    regenerate: "تغيير الرمز",
    legal: "🔒 تبقى بياناتك على هذا الجهاز (نسخة تجريبية). في الإنتاج: تخزين مشفّر في تونس وفق القانون عدد 63 لسنة 2004 وهيئة حماية المعطيات الشخصية، مع سجل لدخول الأطباء.",
  },
};

export default function DossierPage() {
  const { locale } = useLocale();
  const t = L[locale];
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState<MedicalDocument["category"]>("ordonnance");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecord(loadRecord());
  }, []);

  if (!record) return <p className="p-10 text-slate-400">…</p>;

  function persist(next: MedicalRecord, flash = false) {
    if (!saveRecord(next)) {
      setError(t.quotaFull);
      return;
    }
    setRecord(next);
    setError("");
    if (flash) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !record) return;
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError(t.badType);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(t.tooBig);
      return;
    }
    if (totalDocumentsBytes(record) + file.size > MAX_TOTAL_BYTES) {
      setError(t.quotaFull);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const doc: MedicalDocument = {
        id: `doc-${Date.now().toString(36)}`,
        name: file.name,
        category,
        mimeType: file.type,
        dataUrl: String(reader.result),
        size: file.size,
        addedAt: new Date().toISOString().slice(0, 10),
      };
      persist({ ...record, documents: [...record.documents, doc] });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const usedBytes = totalDocumentsBytes(record);
  const field = (key: keyof MedicalRecord, label: string, textarea = false) => {
    const props = {
      value: record[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setRecord({ ...record, [key]: e.target.value }),
      placeholder: label,
      className:
        "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400",
    };
    return textarea ? <textarea rows={2} {...props} /> : <input type="text" {...props} />;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">🗄️ {t.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.sub}</p>

      {/* Informations médicales */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-800">{t.info}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {field("bloodType", t.bloodType)}
          {field("heightCm", t.height)}
          {field("weightKg", t.weight)}
        </div>
        <div className="mt-3 grid gap-3">
          {field("allergies", t.allergies, true)}
          {field("chronic", t.chronic, true)}
          {field("medications", t.medications, true)}
          {field("surgeries", t.surgeries, true)}
          {field("familyHistory", t.family, true)}
        </div>
        <button
          type="button"
          onClick={() => persist(record, true)}
          className="mt-4 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          {saved ? t.saved : t.save}
        </button>
      </section>

      {/* Documents */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-800">📎 {t.docs}</h2>
            <p className="text-sm text-slate-500">{t.docsSub}</p>
          </div>
          <span className="text-xs text-slate-400">
            {t.used} : {(usedBytes / 1_000_000).toFixed(1)} / {(MAX_TOTAL_BYTES / 1_000_000).toFixed(1)} Mo
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MedicalDocument["category"])}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
            aria-label={t.category}
          >
            {Object.entries(t.cats).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            {t.upload}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*,application/pdf"
            onChange={onUpload}
            className="hidden"
          />
        </div>
        {error && <p className="mt-2 text-sm text-accent-600">{error}</p>}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {record.documents.length === 0 && <p className="text-sm text-slate-400">{t.empty}</p>}
          {record.documents.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              {d.mimeType.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.dataUrl} alt={d.name} className="h-14 w-14 rounded-lg object-cover" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-red-100 text-2xl">📄</span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">{d.name}</p>
                <p className="text-xs text-slate-400">
                  {t.cats[d.category]} · {d.addedAt} · {(d.size / 1000).toFixed(0)} Ko
                </p>
                <div className="mt-1 flex gap-3 text-xs">
                  <a href={d.dataUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:underline">
                    {t.open}
                  </a>
                  <button
                    type="button"
                    onClick={() => persist({ ...record, documents: record.documents.filter((x) => x.id !== d.id) })}
                    className="font-medium text-accent-600 hover:underline"
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partage praticien */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-800">🔐 {t.share}</h2>
        <p className="mt-1 text-sm text-slate-500">{t.shareText}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => persist({ ...record, sharing: { ...record.sharing, enabled: !record.sharing.enabled } })}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              record.sharing.enabled
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            {record.sharing.enabled ? `✓ ${t.shareOn}` : t.shareOff}
          </button>
          {record.sharing.enabled && (
            <>
              <span className="rounded-xl bg-primary-50 px-5 py-2.5 font-mono text-lg font-bold tracking-widest text-primary-700" dir="ltr">
                {record.sharing.code}
              </span>
              <button
                type="button"
                onClick={() => persist({ ...record, sharing: { ...record.sharing, code: generateCode() } })}
                className="text-sm font-medium text-primary-600 hover:underline"
              >
                🔄 {t.regenerate}
              </button>
            </>
          )}
        </div>
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">{t.legal}</p>
      </section>
    </div>
  );
}
