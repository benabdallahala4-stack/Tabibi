"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { cancelAppointment, listAppointments } from "@/lib/appointments";
import { cloudCancelAppointment, cloudFetchAppointments, cloudMe } from "@/lib/cloud";
import type { Appointment } from "@/lib/types";
import { useLocale } from "@/lib/i18n";

const CARD = "rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700";

export default function MyAppointmentsPage() {
  const { t, city, locale } = useLocale();
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [cloudSynced, setCloudSynced] = useState(false);

  useEffect(() => {
    setAppointments(listAppointments());
    (async () => {
      const user = await cloudMe();
      if (!user) return;
      const remote = await cloudFetchAppointments();
      if (!remote) return;
      const local = listAppointments();
      const byId = new Map(local.map((a) => [a.id, a]));
      for (const r of remote) byId.set(r.id, r);
      const merged = [...byId.values()];
      window.localStorage.setItem("seha.appointments", JSON.stringify(merged));
      setAppointments(merged);
      setCloudSynced(true);
    })();
  }, []);

  function cancel(id: string) {
    cancelAppointment(id);
    if (cloudSynced) void cloudCancelAppointment(id);
    setAppointments(listAppointments());
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  const confirmed = (appointments ?? []).filter((a) => a.status === "confirme");
  const upcoming = confirmed.filter((a) => a.dateIso >= todayIso);
  const past = confirmed.filter((a) => a.dateIso < todayIso).sort((a, b) => b.dateIso.localeCompare(a.dateIso));
  const cancelled = (appointments ?? []).filter((a) => a.status === "annule");

  return (
    <AppShell>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t("mine.title")}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {cloudSynced ? (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            ☁️ {locale === "ar" ? "متزامن مع حسابك" : "Synchronisé avec votre compte"}
          </span>
        ) : (
          t("mine.sub")
        )}
      </p>

      {appointments === null ? (
        <p className="mt-8 text-slate-400">{t("common.loading")}</p>
      ) : appointments.length === 0 ? (
        <div className={`mt-8 p-10 text-center ${CARD}`}>
          <p className="text-slate-600 dark:text-slate-300">{t("mine.none")}</p>
          <Link href="/recherche" className="mt-4 inline-block rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">
            {t("mine.find")}
          </Link>
        </div>
      ) : (
        <>
          <section className="mt-6 space-y-4">
            {upcoming.map((a) => (
              <div key={a.id} className={`flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center ${CARD}`}>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    <Link href={`/medecin/${a.doctorSlug}`} className="hover:underline">{a.doctorName}</Link>
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {a.specialty} · {city(a.city)} · {a.kind === "cabinet" ? t("booking.inCabinet") : t("booking.inTele")}
                  </p>
                  <p className="mt-1 text-sm font-medium text-primary-700 dark:text-primary-300" dir="ltr">{a.dateIso} {a.time}</p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  {a.kind === "teleconsultation" && (
                    <Link href={`/visio?rdv=${a.id}`} className="rounded-xl bg-sky-50 px-4 py-2 text-center text-sm font-medium text-sky-700 transition hover:bg-sky-100 dark:bg-sky-500/15 dark:text-sky-300">
                      {t("mine.join")}
                    </Link>
                  )}
                  <button type="button" onClick={() => cancel(a.id)} className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-accent-600 transition hover:bg-red-100 dark:bg-red-500/15">
                    {t("mine.cancel")}
                  </button>
                </div>
              </div>
            ))}
            {upcoming.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">{t("mine.upcomingNone")}</p>}
          </section>

          {past.length > 0 && (
            <section className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t("mine.past")}</h2>
              <div className="mt-3 space-y-3">
                {past.map((a) => (
                  <div key={a.id} className={`flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center ${CARD}`}>
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">
                        <Link href={`/medecin/${a.doctorSlug}`} className="hover:underline">{a.doctorName}</Link>
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {a.specialty} · {city(a.city)} · <span dir="ltr">{a.dateIso} {a.time}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <Link href={`/medecin/${a.doctorSlug}`} className="rounded-xl bg-amber-50 px-4 py-2 font-medium text-amber-700 transition hover:bg-amber-100 dark:bg-amber-500/15 dark:text-amber-300">{t("mine.review")}</Link>
                      <Link href={`/medecin/${a.doctorSlug}`} className="rounded-xl bg-primary-50 px-4 py-2 font-medium text-primary-700 transition hover:bg-primary-100 dark:bg-primary-500/15 dark:text-primary-300">{t("mine.rebook")}</Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {cancelled.length > 0 && (
            <section className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t("mine.cancelled")}</h2>
              <div className="mt-3 space-y-3">
                {cancelled.map((a) => (
                  <div key={a.id} className={`p-4 text-sm text-slate-400 ${CARD}`}>
                    <span className="line-through">{a.doctorName} — <span dir="ltr">{a.dateIso} {a.time}</span></span>{" "}
                    <span className="mx-2 rounded-full bg-red-50 px-2 py-0.5 text-xs text-accent-600 dark:bg-red-500/15">{t("mine.cancelledBadge")}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </AppShell>
  );
}
