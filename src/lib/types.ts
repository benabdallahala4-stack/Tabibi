export interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Doctor {
  slug: string;
  fullName: string;
  fullNameAr: string;
  specialty: string;
  specialtyAr: string;
  city: string;
  governorate: string;
  address: string;
  photoSeed: string; // initials used for the avatar
  languages: string[];
  cnam: boolean; // conventionné CNAM
  cnamConvention?: string; // n° de conventionnement CNAM (affiché sur le profil)
  tiersPayant?: boolean; // pratique le tiers payant / prise en charge CNAM
  insurers?: string[]; // ids d'assurances privées/mutuelles acceptées (voir insurance.ts)
  teleconsultation: boolean;
  priceTnd: number; // consultation de base en dinars
  rating: number;
  reviewCount: number;
  bio: string;
  education: string[];
  nextAvailability: string; // libellé indicatif
  socials?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  googleMapsUrl?: string;
  calendlyUrl?: string; // agenda Calendly optionnel, embarqué sur le profil
  googleReviews?: GoogleReview[]; // avis de démo — synchro réelle via API Google Places
}

export interface Specialty {
  id: string;
  label: string;
  labelAr: string;
  emoji: string;
}

export interface PatientProfile {
  name: string;
  phone: string;
  email: string;
}

export interface Appointment {
  id: string;
  doctorSlug: string;
  doctorName: string;
  specialty: string;
  city: string;
  dateIso: string; // jour du RDV (YYYY-MM-DD)
  time: string; // HH:mm
  kind: "cabinet" | "teleconsultation";
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  reason: string;
  createdAt: string;
  // en_attente : demandé par le patient, en attente de validation du médecin.
  // confirme : validé par le médecin (ou ajouté directement au cabinet).
  // refuse : demande déclinée. annule : annulé. termine : consultation faite.
  status: "en_attente" | "confirme" | "refuse" | "annule" | "termine";
  source?: "en_ligne" | "cabinet"; // origine du RDV
}
