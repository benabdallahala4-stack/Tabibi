"use client";

// Téléconsultation vidéo : salle Jitsi Meet dédiée à chaque rendez-vous.
// Jitsi est gratuit, chiffré et fonctionne dans le navigateur sans compte.

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAppointment } from "@/lib/appointments";
import type { Appointment } from "@/lib/types";
import { useLocale } from "@/lib/i18n";

function VisioContent() {
  const params = useSearchParams();
  const { t } = useLocale();
  const id = params.get("rdv") ?? "";
  const [appt, setAppt] = useState<Appointment | null | undefined>(undefined);

  useEffect(() => {
    setAppt(getAppointment(id) ?? null);
  }, [id]);

  if (appt === undefined) {
    return <p className="p-8 text-slate-400">{t("common.loading")}</p>;
  }

  if (appt === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200">
          <p className="text-slate-600">{t("visio.notFound")}</p>
          <Link href="/mes-rdv" className="mt-4 inline-block text-primary-600 hover:underline">
            {t("mine.title")}
          </Link>
        </div>
      </div>
    );
  }

  const roomName = `tabibi-${appt.id}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-xl font-bold text-slate-800">
        {t("visio.title")} — {appt.doctorName}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        <span dir="ltr">{appt.dateIso} {appt.time}</span> · {t("visio.info")}
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200">
        <iframe
          src={`https://meet.jit.si/${roomName}#userInfo.displayName="${encodeURIComponent(appt.patientName)}"`}
          className="h-[70vh] w-full border-0"
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          title="Téléconsultation Tabibi"
        />
      </div>
      <div className="mt-4">
        <Link
          href="/mes-rdv"
          className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
        >
          ← {t("mine.title")}
        </Link>
      </div>
    </div>
  );
}

export default function VisioPage() {
  return (
    <Suspense fallback={<p className="p-8 text-slate-400">…</p>}>
      <VisioContent />
    </Suspense>
  );
}
