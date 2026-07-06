"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import DoctorCard from "@/components/DoctorCard";
import { searchDoctors } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

function SearchContent() {
  const params = useSearchParams();
  const { t, city } = useLocale();
  const q = params.get("q") ?? "";
  const ville = params.get("ville") ?? "";
  const doctors = searchDoctors(q, ville);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">{t("search.title")}</h1>
      <div className="mt-4">
        <SearchBar initialQuery={q} initialCity={ville} compact />
      </div>
      <p className="mt-6 text-sm text-slate-500">
        {doctors.length} {t("search.found")}
        {q && (
          <>
            {" "}{t("search.for")} « <span className="font-medium text-slate-700">{q}</span> »
          </>
        )}
        {ville && (
          <>
            {" "}{t("search.in")} <span className="font-medium text-slate-700">{city(ville)}</span>
          </>
        )}
      </p>
      <div className="mt-4 space-y-4">
        {doctors.map((d) => (
          <DoctorCard key={d.slug} doctor={d} />
        ))}
        {doctors.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500 ring-1 ring-slate-200">
            {t("search.none1")}
            <br />
            {t("search.none2")}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
