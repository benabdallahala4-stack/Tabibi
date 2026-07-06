import { notFound } from "next/navigation";
import DoctorProfile from "@/components/DoctorProfile";
import { DOCTORS, findDoctor } from "@/lib/data";

export function generateStaticParams() {
  return DOCTORS.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const doctor = findDoctor(params.slug);
  return {
    title: doctor
      ? `${doctor.fullName} — ${doctor.specialty} à ${doctor.city} | Seha`
      : "Praticien introuvable | Seha",
  };
}

export default function DoctorPage({ params }: { params: { slug: string } }) {
  const doctor = findDoctor(params.slug);
  if (!doctor) notFound();
  return <DoctorProfile doctor={doctor} />;
}
