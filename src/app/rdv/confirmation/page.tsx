"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAppointment } from "@/lib/appointments";
import type { Appointment } from "@/lib/types";
import { useLocale } from "@/lib/i18n";

function ConfirmationContent() {
  const params = useSearchParams();
  const { t, city } = useLocale();
  const id = params.get("id") ?? "";
  const [appt, setAppt] = useState<Appointment | null | undefined>(undefined);

  useEffect(() => {
    setAppt(getAppointment(id) ?? null);
  }, [id]);

  if (appt === undefined) {
    return <p className="text-slate-400">{t("common.loading")}</p>;
  }

  if (appt === null) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200">
        <p className="text-slate-600">{t("confirm.notFound")}</p>
        <Link href="/recherche" className="mt-4 inline-block text-primary-600 hover:underline">
          {t("confirm.search")}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">
          ✓
        </span>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t("confirm.title")}</h1>
          <p className="text-sm text-slate-500">{t("confirm.sub")}</p>
        </div>
      </div>
      <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-700">{t("confirm.doctor")}</dt>
          <dd className="text-slate-500">
            {appt.doctorName} — {appt.specialty}, {city(appt.city)}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">{t("confirm.datetime")}</dt>
          <dd className="text-slate-500" dir="ltr">
            {appt.dateIso} {appt.time}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">{t("confirm.type")}</dt>
          <dd className="text-slate-500">
            {appt.kind === "cabinet" ? t("confirm.cabinet") : t("confirm.tele")}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">{t("confirm.patient")}</dt>
          <dd className="text-slate-500">
            {appt.patientName} · <span dir="ltr">{appt.patientPhone}</span>
          </dd>
        </div>
        {appt.reason && (
          <div className="sm:col-span-2">
            <dt className="font-medium text-slate-700">{t("confirm.reason")}</dt>
            <dd className="text-slate-500">{appt.reason}</dd>
          </div>
        )}
      </dl>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {appt.kind === "teleconsultation" && (
          <Link
            href={`/visio?rdv=${appt.id}`}
            className="rounded-xl bg-sky-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            {t("mine.join")}
          </Link>
        )}
        <Link
          href="/mes-rdv"
          className="rounded-xl bg-primary-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          {t("confirm.myAppts")}
        </Link>
        <Link
          href="/"
          className="rounded-xl bg-slate-100 px-6 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
        >
          {t("confirm.home")}
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Suspense fallback={<p className="text-slate-400">…</p>}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
