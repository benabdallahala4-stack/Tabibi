// Disponibilités du médecin : horaires de travail hebdomadaires + pause +
// durée d'un créneau + jours bloqués. C'est LA source des créneaux proposés
// au patient (remplace l'ancienne génération par hachage). Le médecin la
// pilote depuis /pro/disponibilites. Stockage localStorage par médecin (démo)
// — en mode cloud ce sera une table `availability`.

import { toDateIso, type DaySlots } from "./slots";

export interface DayHours {
  enabled: boolean;
  start: string; // "08:30"
  end: string; // "17:00"
}

export interface WeeklyAvailability {
  slotMinutes: number; // durée d'un créneau (15 / 20 / 30 / 45 / 60)
  breakStart: string; // début pause déjeuner ("12:30")
  breakEnd: string; // fin pause ("14:00")
  days: DayHours[]; // index 0 = Lundi … 6 = Dimanche
  blockedDates: string[]; // jours entiers fermés (YYYY-MM-DD)
}

export const WEEKDAY_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export const DEFAULT_AVAILABILITY: WeeklyAvailability = {
  slotMinutes: 30,
  breakStart: "12:30",
  breakEnd: "14:00",
  days: [
    { enabled: true, start: "08:30", end: "17:00" }, // Lundi
    { enabled: true, start: "08:30", end: "17:00" }, // Mardi
    { enabled: true, start: "08:30", end: "17:00" }, // Mercredi
    { enabled: true, start: "08:30", end: "17:00" }, // Jeudi
    { enabled: true, start: "08:30", end: "17:00" }, // Vendredi
    { enabled: true, start: "09:00", end: "13:00" }, // Samedi
    { enabled: false, start: "09:00", end: "12:00" }, // Dimanche
  ],
  blockedDates: [],
};

const KEY = (slug: string) => `seha.availability.${slug}`;

export function loadAvailability(doctorSlug: string): WeeklyAvailability {
  if (typeof window === "undefined") return DEFAULT_AVAILABILITY;
  try {
    const raw = window.localStorage.getItem(KEY(doctorSlug));
    if (!raw) return DEFAULT_AVAILABILITY;
    const parsed = JSON.parse(raw) as Partial<WeeklyAvailability>;
    return {
      slotMinutes: parsed.slotMinutes ?? DEFAULT_AVAILABILITY.slotMinutes,
      breakStart: parsed.breakStart ?? DEFAULT_AVAILABILITY.breakStart,
      breakEnd: parsed.breakEnd ?? DEFAULT_AVAILABILITY.breakEnd,
      days: parsed.days && parsed.days.length === 7 ? parsed.days : DEFAULT_AVAILABILITY.days,
      blockedDates: parsed.blockedDates ?? [],
    };
  } catch {
    return DEFAULT_AVAILABILITY;
  }
}

export function saveAvailability(doctorSlug: string, av: WeeklyAvailability): void {
  window.localStorage.setItem(KEY(doctorSlug), JSON.stringify(av));
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  return h * 60 + (m || 0);
}
function fromMinutes(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

/** Créneaux théoriques d'un jour de la semaine (Lundi = 0), hors pause. */
export function timesForWeekday(av: WeeklyAvailability, mondayIndex: number): string[] {
  const d = av.days[mondayIndex];
  if (!d || !d.enabled) return [];
  const start = toMinutes(d.start);
  const end = toMinutes(d.end);
  const bStart = toMinutes(av.breakStart);
  const bEnd = toMinutes(av.breakEnd);
  const step = av.slotMinutes > 0 ? av.slotMinutes : 30;
  const times: string[] = [];
  for (let t = start; t + step <= end; t += step) {
    const inBreak = t < bEnd && t + step > bStart; // chevauche la pause
    if (!inBreak) times.push(fromMinutes(t));
  }
  return times;
}

/** Index Lundi=0 à partir d'un objet Date (getDay : 0 = dimanche). */
export function mondayIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/**
 * Créneaux réellement réservables sur `days` jours, en retirant les créneaux
 * déjà pris (`bookedByDate`) et les jours bloqués.
 */
export function bookableSlots(
  av: WeeklyAvailability,
  from: Date,
  days: number,
  bookedByDate: Record<string, Set<string>>,
): DaySlots[] {
  const result: DaySlots[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    const dateIso = toDateIso(d);
    const blocked = av.blockedDates.includes(dateIso);
    const taken = bookedByDate[dateIso] ?? new Set<string>();
    const times = blocked ? [] : timesForWeekday(av, mondayIndex(d)).filter((t) => !taken.has(t));
    result.push({ dateIso, weekday: d.getDay(), day: d.getDate(), month: d.getMonth(), times });
  }
  return result;
}
