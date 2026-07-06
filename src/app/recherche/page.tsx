"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import DoctorCard from "@/components/DoctorCard";
import { searchDoctors } from "@/lib/data";
import { cityDistanceKm } from "@/lib/geo";
import { useLocale } from "@/lib/i18n";

function SearchContent() {
  const params = useSearchParams();
  const { t, city, locale } = useLocale();
  const q = params.get("q") ?? "";
  const ville = params.get("ville") ?? "";
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "loading" | "denied">("idle");

  function locate() {
    if (!navigator.geolocation) return setGeoState("denied");
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState("idle");
      },
      () => setGeoState("denied"),
      { timeout: 8000 }
    );
  }

  let doctors = searchDoctors(q, ville).map((d) => ({
    doctor: d,
    distance: userPos ? cityDistanceKm(userPos, d.city) ?? undefined : undefined,
  }));
  if (userPos) {
    doctors = [...doctors].sort((a, b) => (a.distance ?? 1e9) - (b.distance ?? 1e9));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">{t("search.title")}</h1>
      <div className="mt-4">
        <SearchBar initialQuery={q} initialCity={ville} compact />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={locate}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            userPos
              ? "bg-primary-600 text-white"
              : "bg-white text-primary-700 ring-1 ring-primary-200 hover:bg-primary-50"
          }`}
        >
          📍 {locale === "ar" ? "بالقرب مني" : "Autour de moi"}
          {geoState === "loading" && "…"}
        </button>
        {geoState === "denied" && (
          <span className="text-xs text-slate-400">
            {locale === "ar" ? "تعذّر تحديد الموقع (رفض الإذن؟)" : "Localisation impossible (permission refusée ?)"}
          </span>
        )}
        {userPos && (
          <span className="text-xs text-emerald-600">
            {locale === "ar" ? "مرتَّب حسب المسافة ✓" : "Trié par distance ✓"}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-slate-500">
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
        {doctors.map(({ doctor, distance }) => (
          <DoctorCard key={doctor.slug} doctor={doctor} distanceKm={distance} />
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
