"use client";

// Portail laboratoire (démo) : un labo partenaire dépose le résultat
// d'analyse directement dans le dossier médical du patient, avec le
// code d'accès que le patient lui a remis.

import { useRef, useState } from "react";
import {
  accessRecordWithCode,
  saveRecord,
  totalDocumentsBytes,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
} from "@/lib/medicalRecord";
import { useLocale } from "@/lib/i18n";
import { useRoleGate, SessionBar } from "@/components/RoleGuard";

const L = {
  fr: {
    title: "Portail laboratoire",
    sub: "Laboratoires et centres d'imagerie partenaires : déposez le résultat directement dans le dossier Seha du patient, avec son code d'accès.",
    lab: "Nom du laboratoire",
    code: "Code d'accès du patient",
    file: "Choisir le fichier (PDF ou image)",
    send: "Déposer dans le dossier du patient",
    ok: "✓ Résultat déposé dans le dossier du patient. Il le retrouvera dans « Mon dossier médical » et pourra le partager avec son médecin.",
    badCode: "Code invalide ou partage désactivé par le patient.",
    tooBig: "Fichier trop volumineux (démo : 1,5 Mo max).",
    quota: "Dossier du patient plein (démo : 3,5 Mo).",
    note: "Démo sur un seul appareil. En production : comptes laboratoires vérifiés, dépôt via API sécurisée, notification au patient, journal des accès.",
  },
  ar: {
    title: "بوابة المخابر",
    sub: "المخابر ومراكز التصوير الشريكة: أودعوا النتيجة مباشرة في ملف المريض على صحة باستعمال رمز الوصول الذي سلّمه لكم.",
    lab: "اسم المخبر",
    code: "رمز وصول المريض",
    file: "اختر الملف (PDF أو صورة)",
    send: "إيداع في ملف المريض",
    ok: "✓ تم إيداع النتيجة في ملف المريض. سيجدها في « ملفي الطبي » ويمكنه مشاركتها مع طبيبه.",
    badCode: "رمز غير صالح أو مشاركة معطّلة من طرف المريض.",
    tooBig: "الملف كبير جدًا (تجريبي: 1.5 م.ب كحد أقصى).",
    quota: "ملف المريض ممتلئ (تجريبي: 3.5 م.ب).",
    note: "نسخة تجريبية على جهاز واحد. في الإنتاج: حسابات مخابر موثّقة، إيداع عبر واجهة آمنة، إشعار للمريض وسجل للوصول.",
  },
};

export default function LaboPage() {
  const gate = useRoleGate(["labo", "medecin", "admin"]);
  const { locale } = useLocale();
  const t = L[locale];
  const [labName, setLabName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "badCode" | "tooBig" | "quota">("idle");
  const fileInput = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInput.current?.files?.[0];
    if (!file || !code.trim()) return;
    const record = accessRecordWithCode(code);
    if (!record) {
      setStatus("badCode");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setStatus("tooBig");
      return;
    }
    if (totalDocumentsBytes(record) + file.size > MAX_TOTAL_BYTES) {
      setStatus("quota");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      record.documents.push({
        id: `doc-${Date.now().toString(36)}`,
        name: `${labName.trim() || "Laboratoire"} — ${file.name}`,
        category: "analyse",
        mimeType: file.type,
        dataUrl: String(reader.result),
        size: file.size,
        addedAt: new Date().toISOString().slice(0, 10),
      });
      saveRecord(record);
      setStatus("ok");
      setCode("");
      setLabName("");
      if (fileInput.current) fileInput.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  if (gate) return gate;

  return (
    <>
    <SessionBar />
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">🧪 {t.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.sub}</p>

      <form onSubmit={submit} className="mt-6 space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <input
          value={labName}
          onChange={(e) => setLabName(e.target.value)}
          placeholder={t.lab}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
        />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t.code}
          maxLength={6}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-mono text-sm uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary-400"
          dir="ltr"
        />
        <label className="block text-sm text-slate-600">
          {t.file}
          <input
            ref={fileInput}
            type="file"
            accept="image/*,application/pdf"
            className="mt-1 block w-full text-sm file:me-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700"
          />
        </label>
        <button className="w-full rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">
          {t.send}
        </button>
        {status === "ok" && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{t.ok}</p>}
        {status === "badCode" && <p className="rounded-xl bg-red-50 p-3 text-sm text-accent-600">{t.badCode}</p>}
        {status === "tooBig" && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{t.tooBig}</p>}
        {status === "quota" && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{t.quota}</p>}
      </form>

      <p className="mt-4 text-center text-xs text-slate-400">{t.note}</p>
    </div>
    </>
  );
}
