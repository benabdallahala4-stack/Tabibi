"use client";

// Suivi de la file d'attente du cabinet, côté patient.

import { useEffect, useState } from "react";
import { estimate, loadQueue, type QueueState } from "@/lib/queue";
import { useLocale } from "@/lib/i18n";

const L = {
  fr: {
    title: "File d'attente du cabinet",
    sub: "Suivez votre position en temps réel et arrivez juste à l'heure (démo : cabinet du Dr Ben Salah).",
    current: "En consultation",
    waiting: "En attente",
    done: "Passé",
    yourTicket: "Votre numéro de ticket",
    position: "position",
    eta: "Passage estimé dans",
    minutes: "min",
    notFound: "Ticket introuvable dans la file (ou déjà passé).",
    empty: "La file est vide pour le moment.",
    refresh: "Actualiser",
    note: "Le praticien met la file à jour depuis son espace Seha Pro. En production : mise à jour en temps réel et notification quand votre tour approche.",
  },
  ar: {
    title: "طابور الانتظار في العيادة",
    sub: "تابع ترتيبك في الوقت الحقيقي وتعال في الوقت المناسب (تجريبي: عيادة د. بن صالح).",
    current: "في الاستشارة",
    waiting: "في الانتظار",
    done: "انتهى",
    yourTicket: "رقم تذكرتك",
    position: "الترتيب",
    eta: "الدخول المتوقع بعد",
    minutes: "دقيقة",
    notFound: "التذكرة غير موجودة في الطابور (أو انتهى دورها).",
    empty: "الطابور فارغ حاليًا.",
    refresh: "تحديث",
    note: "يحدّث الطبيب الطابور من فضائه المهني. في الإنتاج: تحديث فوري وإشعار عند اقتراب دورك.",
  },
};

export default function AttentePage() {
  const { locale } = useLocale();
  const t = L[locale];
  const [queue, setQueue] = useState<QueueState | null>(null);
  const [ticket, setTicket] = useState("");

  function refresh() {
    setQueue(loadQueue());
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!queue) return <p className="p-10 text-slate-400">…</p>;

  const visible = queue.entries.filter((e) => e.status !== "done").sort((a, b) => a.ticket - b.ticket);
  const myEstimate = ticket ? estimate(queue, Number(ticket)) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">⏳ {t.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.sub}</p>

      {/* Mon ticket */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <label className="text-sm font-semibold text-slate-700">{t.yourTicket}</label>
        <div className="mt-2 flex gap-2">
          <input
            type="number"
            min={1}
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            placeholder="N°"
            className="w-28 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            dir="ltr"
          />
          <button
            type="button"
            onClick={refresh}
            className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200"
          >
            🔄 {t.refresh}
          </button>
        </div>
        {ticket && (
          <div className="mt-4">
            {myEstimate ? (
              <div className="rounded-xl bg-primary-50 p-4 text-primary-800">
                <p className="text-sm">
                  {t.position} : <span className="text-2xl font-bold">{myEstimate.position}</span>
                </p>
                <p className="mt-1 text-sm">
                  {t.eta} <span className="font-bold">≈ {myEstimate.minutes} {t.minutes}</span>
                </p>
              </div>
            ) : (
              <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{t.notFound}</p>
            )}
          </div>
        )}
      </div>

      {/* File */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        {visible.length === 0 ? (
          <p className="text-sm text-slate-400">{t.empty}</p>
        ) : (
          <div className="space-y-2">
            {visible.map((e) => (
              <div
                key={e.ticket}
                className={`flex items-center justify-between rounded-xl p-3 text-sm ${
                  e.status === "current" ? "bg-emerald-50 ring-1 ring-emerald-200" : "bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold text-slate-700 ring-1 ring-slate-200" dir="ltr">
                    {e.ticket}
                  </span>
                  <span className="font-medium text-slate-700">{e.name}</span>
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    e.status === "current" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {e.status === "current" ? `🩺 ${t.current}` : t.waiting}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">{t.note}</p>
    </div>
  );
}
