// Avis vérifiés Tabibi : seul un patient ayant un rendez-vous confirmé
// avec le praticien peut déposer un avis (anti-faux-avis).

import { listAppointments } from "./appointments";

export interface VerifiedReview {
  id: string;
  doctorSlug: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

const KEY = "tabibi.reviews.v1";

export function listReviews(doctorSlug: string): VerifiedReview[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as VerifiedReview[];
    return all.filter((r) => r.doctorSlug === doctorSlug);
  } catch {
    return [];
  }
}

export function addReview(review: VerifiedReview): void {
  const all = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as VerifiedReview[];
  all.push(review);
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

/** Éligible si au moins un RDV confirmé avec ce praticien existe sur l'appareil. */
export function canReview(doctorSlug: string): boolean {
  return listAppointments().some((a) => a.doctorSlug === doctorSlug && a.status === "confirme");
}
