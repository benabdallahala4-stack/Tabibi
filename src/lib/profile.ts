// Profil patient local : reste sur l'appareil, pré-remplit les réservations.

import type { PatientProfile } from "./types";

const KEY = "tabibi.profile";

export function loadProfile(): PatientProfile {
  if (typeof window === "undefined") return { name: "", phone: "", email: "" };
  try {
    return {
      name: "",
      phone: "",
      email: "",
      ...JSON.parse(window.localStorage.getItem(KEY) ?? "{}"),
    } as PatientProfile;
  } catch {
    return { name: "", phone: "", email: "" };
  }
}

export function saveProfile(p: PatientProfile): void {
  window.localStorage.setItem(KEY, JSON.stringify(p));
}
