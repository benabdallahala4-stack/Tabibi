import { notFound } from "next/navigation";
import ClinicProfile from "@/components/ClinicProfile";
import { CLINICS, findClinic } from "@/lib/clinics";

export function generateStaticParams() {
  return CLINICS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const clinic = findClinic(params.slug);
  return {
    title: clinic ? `${clinic.name} — ${clinic.city} | Seha` : "Clinique introuvable | Seha",
  };
}

export default function ClinicPage({ params }: { params: { slug: string } }) {
  const clinic = findClinic(params.slug);
  if (!clinic) notFound();
  return <ClinicProfile clinic={clinic} />;
}
