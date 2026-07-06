"use client";

import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ArticleCover from "@/components/ArticleCover";
import { Reveal, CountUp } from "@/components/Reveal";
import { Icon, SPECIALTY_ICON } from "@/components/Icons";
import { CITIES, DOCTORS, SPECIALTIES } from "@/lib/data";
import { ARTICLES } from "@/lib/articles";
import { useLocale } from "@/lib/i18n";

export default function HomePage() {
  const { t, locale, city } = useLocale();
  const fr = locale === "fr";
  const featured = DOCTORS.filter((d) => d.nextAvailability === "Aujourd'hui").slice(0, 4);

  return (
    <>
      {/* ============ Hero ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        {/* Halos animés en arrière-plan */}
        <div className="blob pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl" />
        <div className="blob pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-teal-300/10 blur-3xl" style={{ animationDelay: "-8s" }} />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          {/* Colonne texte */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-primary-100 ring-1 ring-white/15">
                <Icon name="sparkle" className="h-3.5 w-3.5" />
                {fr ? "La santé tunisienne, en un clic" : "الصحة التونسية بنقرة واحدة"}
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                {t("home.heroTitle")}
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-4 max-w-xl text-lg text-primary-100/90">{t("home.heroText")}</p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 max-w-2xl">
                <SearchBar />
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-100">
                {[t("home.badge.free"), t("home.badge.reminders"), t("home.badge.tele"), t("home.badge.cnam")].map((b) => (
                  <span key={b} className="inline-flex items-center gap-1.5">
                    <Icon name="check" className="h-4 w-4 text-teal-300" />
                    {b.replace(/^✓\s*/, "")}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Colonne visuelle : carte de réservation flottante */}
          <Reveal delay={250} className="hidden lg:block">
            <div className="relative mx-auto max-w-sm">
              <div className="float-anim rounded-3xl bg-white p-6 text-slate-800 shadow-2xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 font-bold text-white">AB</span>
                  <div>
                    <p className="font-bold">Dr Amine Ben Salah</p>
                    <p className="text-sm text-slate-500">{fr ? "Cardiologie · Tunis" : "أمراض القلب · تونس"}</p>
                  </div>
                  <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                    <Icon name="star" className="h-3 w-3 fill-current" /> 4.9
                  </span>
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {fr ? "Aujourd'hui" : "اليوم"}
                </p>
                <div className="mt-2 grid grid-cols-4 gap-2 text-center text-sm" dir="ltr">
                  {["09:00", "09:30", "11:00", "14:30"].map((h, i) => (
                    <span
                      key={h}
                      className={`rounded-lg py-2 font-medium ${i === 1 ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-700"}`}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                <button type="button" className="mt-5 w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white">
                  {fr ? "Confirmer le rendez-vous" : "تأكيد الموعد"}
                </button>
              </div>

              {/* Badges flottants */}
              <div className="float-anim-slow absolute -left-12 top-8 flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-slate-700 shadow-xl backdrop-blur">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <Icon name="video" className="h-4 w-4" />
                </span>
                {fr ? "Téléconsultation" : "استشارة عن بُعد"}
              </div>
              <div className="float-anim absolute -bottom-6 -right-8 flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-slate-700 shadow-xl backdrop-blur" style={{ animationDelay: "-3s" }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Icon name="shield" className="h-4 w-4" />
                </span>
                {fr ? "RDV confirmé" : "تم تأكيد الموعد"}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ Bandeau chiffres ============ */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4">
          {[
            { value: DOCTORS.length, suffix: "+", label: fr ? "Praticiens vérifiés" : "أطباء موثّقون" },
            { value: SPECIALTIES.length, suffix: "", label: fr ? "Spécialités" : "اختصاصًا" },
            { value: CITIES.length, suffix: "", label: fr ? "Villes couvertes" : "مدينة" },
            { value: 24, suffix: "/7", label: fr ? "Réservation en ligne" : "حجز عبر الإنترنت" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="text-center">
              <p className="text-3xl font-bold text-primary-700">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ Spécialités ============ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <h2 className="text-2xl font-bold text-slate-800">{t("home.specialties")}</h2>
          <p className="mt-1 text-slate-500">
            {fr ? "Réservez en quelques clics dans la spécialité qu'il vous faut." : "احجز بنقرات قليلة في الاختصاص الذي تحتاجه."}
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SPECIALTIES.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i * 60, 420)}>
              <Link
                href={`/recherche?q=${encodeURIComponent(s.label)}`}
                className="hover-lift group flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                  <Icon name={SPECIALTY_ICON[s.id] ?? "stethoscope"} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-700">
                    {locale === "ar" ? s.labelAr : s.label}
                  </span>
                  <span className="block text-xs text-slate-400" dir={locale === "ar" ? "ltr" : "rtl"}>
                    {locale === "ar" ? s.label : s.labelAr}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ Comment ça marche ============ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-slate-800">{t("home.how")}</h2>
          </Reveal>
          <div className="relative mt-10 grid gap-8 sm:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-7 hidden border-t-2 border-dashed border-primary-200 sm:block" />
            {([
              { icon: "search", step: "1" },
              { icon: "calendar", step: "2" },
              { icon: "video", step: "3" },
            ] as const).map((item, i) => (
              <Reveal key={item.step} delay={i * 150} className="relative text-center">
                <span className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/25">
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-bold text-slate-800">{t(`home.step${item.step}.title`)}</h3>
                <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500">{t(`home.step${item.step}.text`)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Disponibles aujourd'hui ============ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{t("home.available")}</h2>
              <p className="mt-1 text-slate-500">
                {fr ? "Des créneaux libres dans les prochaines heures." : "مواعيد متاحة خلال الساعات القادمة."}
              </p>
            </div>
            <Link href="/recherche" className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:gap-2 sm:inline-flex" style={{ transition: "gap .2s" }}>
              {t("home.seeAll").replace(/→|←/g, "").trim()}
              <Icon name="arrow-right" className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {featured.map((d, i) => (
            <Reveal key={d.slug} delay={i * 100}>
              <Link
                href={`/medecin/${d.slug}`}
                className="hover-lift flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-lg font-bold text-white">
                  {d.photoSeed}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-800">
                    {locale === "ar" ? d.fullNameAr : d.fullName}
                  </span>
                  <span className="block truncate text-sm text-slate-500">
                    {locale === "ar" ? d.specialtyAr : d.specialty} · {city(d.city)}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                    <Icon name="star" className="h-3.5 w-3.5" /> {d.rating} · {d.reviewCount} {t("card.reviews")}
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {t("home.today")}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ Magazine Santé ============ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
                  {fr ? "Prévention & conseils" : "وقاية ونصائح"}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800">
                  {locale === "ar" ? "مجلة الصحة" : "Magazine Santé"}
                </h2>
              </div>
              <Link href="/sante" className="hidden items-center gap-1 text-sm font-semibold text-primary-600 sm:inline-flex">
                {fr ? "Tous les articles" : "كل المقالات"}
                <Icon name="arrow-right" className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </Reveal>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {ARTICLES.slice(0, 3).map((a, i) => (
              <Reveal key={a.slug} delay={i * 120}>
                <Link href={`/sante/${a.slug}`} className="hover-lift group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  <ArticleCover article={a} className="h-36" />
                  <div className="p-5">
                    <p className="flex items-center gap-2 text-xs text-slate-400">
                      <Icon name="clock" className="h-3.5 w-3.5" />
                      {a.readMinutes} min · <span dir="ltr">{a.date}</span>
                    </p>
                    <h3 className="mt-2 font-bold leading-snug text-slate-800 group-hover:text-primary-700">
                      {locale === "ar" ? a.titleAr : a.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {locale === "ar" ? a.summaryAr : a.summary}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Cliniques ============ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <div className="hover-lift relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 p-10 text-white">
            <div className="blob pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <Icon name="building" className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-bold">{t("home.clinicsTitle")}</h2>
                  <p className="mt-1 max-w-xl text-sm text-slate-300">{t("home.clinicsText")}</p>
                </div>
              </div>
              <Link
                href="/cliniques"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                {t("home.clinicsCta").replace(/→|←/g, "").trim()}
                <Icon name="arrow-right" className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ Bandeau praticiens ============ */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Reveal>
          <div className="hover-lift relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-700 to-primary-600 p-10 text-white">
            <div className="blob pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <Icon name="stethoscope" className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-bold">{t("home.proBanner.title")}</h2>
                  <p className="mt-1 max-w-xl text-sm text-primary-100">{t("home.proBanner.text")}</p>
                </div>
              </div>
              <Link
                href="/pro"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
              >
                {t("home.proBanner.cta")}
                <Icon name="arrow-right" className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
