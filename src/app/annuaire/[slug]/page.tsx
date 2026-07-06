// Pages annuaire SEO : /annuaire/cardiologie, /annuaire/cardiologie-tunis…
// Générées statiquement pour le référencement « <spécialité> <ville> RDV en ligne ».

import Link from "next/link";
import { notFound } from "next/navigation";
import DoctorCard from "@/components/DoctorCard";
import { CITIES, DOCTORS, SPECIALTIES } from "@/lib/data";
import { SPECIALTY_INFO } from "@/lib/specialtyInfo";
import { ARTICLES } from "@/lib/articles";

function citySlug(city: string): string {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-");
}

interface Parsed {
  specialty: (typeof SPECIALTIES)[number];
  city: string | null;
}

function parseSlug(slug: string): Parsed | null {
  // ids triés du plus long au plus court pour matcher « medecine-generale » avant « medecine »
  const sorted = [...SPECIALTIES].sort((a, b) => b.id.length - a.id.length);
  for (const s of sorted) {
    if (slug === s.id) return { specialty: s, city: null };
    if (slug.startsWith(`${s.id}-`)) {
      const rest = slug.slice(s.id.length + 1);
      const city = CITIES.find((c) => citySlug(c) === rest);
      if (city) return { specialty: s, city };
    }
  }
  return null;
}

function doctorsFor(specialtyLabel: string, city: string | null) {
  return DOCTORS.filter(
    (d) => d.specialty === specialtyLabel && (!city || d.city === city || d.governorate === city)
  );
}

export function generateStaticParams() {
  const params: { slug: string }[] = SPECIALTIES.map((s) => ({ slug: s.id }));
  for (const s of SPECIALTIES) {
    for (const c of CITIES) {
      if (doctorsFor(s.label, c).length > 0) {
        params.push({ slug: `${s.id}-${citySlug(c)}` });
      }
    }
  }
  return params;
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const parsed = parseSlug(params.slug);
  if (!parsed) return { title: "Annuaire | Seha" };
  const where = parsed.city ?? "Tunisie";
  return {
    title: `${parsed.specialty.label} à ${where} — Rendez-vous en ligne | Seha`,
    description: `Trouvez un spécialiste en ${parsed.specialty.label.toLowerCase()} à ${where} et prenez rendez-vous en ligne gratuitement sur Seha : tarifs, CNAM, avis et téléconsultation.`,
  };
}

export default function AnnuairePage({ params }: { params: { slug: string } }) {
  const parsed = parseSlug(params.slug);
  if (!parsed) notFound();
  const { specialty, city } = parsed;
  const doctors = doctorsFor(specialty.label, city);
  const otherCities = CITIES.filter((c) => doctorsFor(specialty.label, c).length > 0 && c !== city);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="text-xs text-slate-400">
        <Link href="/" className="hover:text-primary-600">Accueil</Link>
        {" › "}
        <Link href={`/annuaire/${specialty.id}`} className="hover:text-primary-600">{specialty.label}</Link>
        {city && <> {" › "} <span className="text-slate-600">{city}</span></>}
      </nav>

      <h1 className="mt-3 text-2xl font-bold text-slate-800">
        {specialty.emoji} {specialty.label} {city ? `à ${city}` : "en Tunisie"}
        <span className="ms-2 text-base font-normal text-slate-400" dir="rtl">{specialty.labelAr}</span>
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Prenez rendez-vous en ligne avec un spécialiste en {specialty.label.toLowerCase()}
        {city ? ` à ${city}` : " partout en Tunisie"} : consultez les tarifs en dinars, le
        conventionnement CNAM, les avis vérifiés et réservez un créneau en quelques clics —
        au cabinet ou en téléconsultation. Service gratuit pour les patients.
      </p>

      {/* Contenu éditorial spécialité (SEO) */}
      {SPECIALTY_INFO[specialty.id] && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="text-sm font-bold text-slate-800">Que soigne ce spécialiste ?</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {SPECIALTY_INFO[specialty.id].treats}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="text-sm font-bold text-slate-800">Quand consulter ?</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {SPECIALTY_INFO[specialty.id].whenToConsult}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {doctors.map((d) => (
          <DoctorCard key={d.slug} doctor={d} />
        ))}
        {doctors.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            Aucun praticien référencé pour l&apos;instant dans cette ville.{" "}
            <Link href={`/annuaire/${specialty.id}`} className="text-primary-600 hover:underline">
              Voir toute la Tunisie
            </Link>
          </div>
        )}
      </div>

      {/* Article du magazine lié à la spécialité */}
      {ARTICLES.filter((a) => a.specialtyId === specialty.id).map((a) => (
        <Link
          key={a.slug}
          href={`/sante/${a.slug}`}
          className="mt-8 flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition hover:ring-primary-400"
        >
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl"
            style={{ background: `linear-gradient(135deg, ${a.gradient[0]}, ${a.gradient[1]})` }}
          >
            {a.emoji}
          </span>
          <span>
            <span className="block text-xs font-semibold uppercase tracking-wide text-primary-600">
              📰 Magazine Santé
            </span>
            <span className="block font-semibold text-slate-800">{a.title}</span>
          </span>
        </Link>
      ))}

      {otherCities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {specialty.label} dans d&apos;autres villes
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {otherCities.map((c) => (
              <Link
                key={c}
                href={`/annuaire/${specialty.id}-${citySlug(c)}`}
                className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200 transition hover:ring-primary-400"
              >
                {specialty.label} {c}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Autres spécialités</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {SPECIALTIES.filter((s) => s.id !== specialty.id).map((s) => (
            <Link
              key={s.id}
              href={`/annuaire/${s.id}`}
              className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200 transition hover:ring-primary-400"
            >
              {s.emoji} {s.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
