// Assurance maladie en Tunisie : CNAM (régime obligatoire) + assurances
// privées / mutuelles complémentaires.
//
// ⚠️ Les tarifs de référence, taux et plafonds ci-dessous sont approximatifs
// et évoluent par arrêté. Ils servent à *estimer* un remboursement, pas à
// garantir un montant. Source de vérité : CNAM (cnam.nat.tn).

import type { Doctor } from "./types";

/* ------------------------------------------------------------------ */
/* Assurances privées / mutuelles tunisiennes                          */
/* ------------------------------------------------------------------ */

export interface Insurer {
  id: string;
  label: string;
}

/** Principaux assureurs santé et mutuelles en Tunisie. */
export const INSURERS: Insurer[] = [
  { id: "star", label: "STAR Assurances" },
  { id: "comar", label: "COMAR" },
  { id: "gat", label: "GAT Assurances" },
  { id: "maghrebia", label: "Maghrebia" },
  { id: "ami", label: "AMI Assurances" },
  { id: "lloyd", label: "Lloyd Tunisien" },
  { id: "carte", label: "Assurances CARTE" },
  { id: "bh", label: "BH Assurance" },
  { id: "attijari", label: "Attijari Assurance" },
  { id: "zitouna", label: "Zitouna Takaful" },
  { id: "mae", label: "MAE Mutuelle" },
];

export function insurerLabel(id: string): string {
  return INSURERS.find((i) => i.id === id)?.label ?? id;
}

/* ------------------------------------------------------------------ */
/* CNAM — les trois filières                                           */
/* ------------------------------------------------------------------ */

export interface Filiere {
  id: "publique" | "privee" | "remboursement";
  title: string;
  titleAr: string;
  text: string;
  textAr: string;
}

export const FILIERES: Filiere[] = [
  {
    id: "publique",
    title: "Filière publique",
    titleAr: "المسار العمومي",
    text: "Vous êtes soigné dans le secteur public (hôpitaux, centres de santé de base). Vous ne payez qu'un faible ticket modérateur. Économique, mais disponibilité et files d'attente du public.",
    textAr: "تُعالَج في القطاع العمومي (المستشفيات ومراكز الصحة الأساسية). لا تدفع سوى معلوم مساهمة بسيط. اقتصادي، لكن حسب توفّر القطاع العمومي وطوابيره.",
  },
  {
    id: "privee",
    title: "Filière privée (médecin de famille)",
    titleAr: "المسار الخاص (طبيب العائلة)",
    text: "Vous désignez un médecin de famille qui vous oriente vers les spécialistes. Soins dans le privé conventionné, avec prise en charge d'un panier de soins défini.",
    textAr: "تختار طبيب عائلة يوجّهك نحو الأخصائيين. العلاج في القطاع الخاص المتعاقد، مع تكفّل بسلّة علاجية محدّدة.",
  },
  {
    id: "remboursement",
    title: "Système de remboursement",
    titleAr: "نظام الإرجاع",
    text: "Vous choisissez librement votre praticien (public ou privé), vous payez, puis vous êtes remboursé selon les tarifs de référence CNAM, dans la limite d'un plafond annuel pour l'ambulatoire.",
    textAr: "تختار طبيبك بحرية (عام أو خاص)، تدفع، ثم تُعوَّض حسب التعريفات المرجعية للكنام في حدود سقف سنوي للعلاج الخارجي.",
  },
];

/* ------------------------------------------------------------------ */
/* Tarifs de référence & estimation de remboursement                   */
/* ------------------------------------------------------------------ */

/** Tarif de référence CNAM (DT) par famille de spécialité — approximatif. */
const REF_TARIFF: Record<string, number> = {
  "Médecine générale": 30,
  Pédiatrie: 35,
  Gynécologie: 40,
  "Gynécologie-Obstétrique": 40,
  Cardiologie: 40,
  Dermatologie: 40,
  Ophtalmologie: 40,
  "Oto-rhino-laryngologie": 40,
  Gastro: 40,
  Psychiatrie: 40,
  _default: 40,
};

/** Taux de remboursement ambulatoire (après ticket modérateur). */
export const AMBULATORY_RATE = 0.7;

export function refTariff(specialty: string): number {
  return REF_TARIFF[specialty] ?? REF_TARIFF._default;
}

export interface Reimbursement {
  price: number; // prix annoncé par le praticien
  ref: number; // tarif de référence CNAM
  rate: number; // taux appliqué
  reimbursed: number; // estimation remboursée
  outOfPocket: number; // reste à charge estimé
  refCapsPrice: boolean; // le prix dépasse le tarif de référence
}

/** Estimation « à titre indicatif » du remboursement CNAM d'une consultation. */
export function estimateReimbursement(
  price: number,
  specialty: string,
  rate: number = AMBULATORY_RATE
): Reimbursement {
  const ref = refTariff(specialty);
  const reimbursed = Math.round(ref * rate);
  const outOfPocket = Math.max(0, price - reimbursed);
  return { price, ref, rate, reimbursed, outOfPocket, refCapsPrice: price > ref };
}

/* ------------------------------------------------------------------ */
/* Vue « assurance » d'un praticien (avec valeurs par défaut sûres)     */
/* ------------------------------------------------------------------ */

export interface DoctorInsurance {
  cnam: boolean;
  convention?: string;
  tiersPayant: boolean;
  insurers: string[];
  reimbursement: Reimbursement;
}

export function doctorInsurance(doctor: Doctor): DoctorInsurance {
  return {
    cnam: doctor.cnam,
    convention: doctor.cnamConvention,
    // Un praticien conventionné propose en général le tiers payant pour les
    // actes pris en charge, sauf indication contraire.
    tiersPayant: doctor.tiersPayant ?? doctor.cnam,
    insurers: doctor.insurers ?? [],
    reimbursement: estimateReimbursement(doctor.priceTnd, doctor.specialty),
  };
}
