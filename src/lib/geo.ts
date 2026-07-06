// Géolocalisation « autour de moi » : coordonnées approximatives des villes
// couvertes (centre-ville). Production : coordonnées GPS précises de chaque
// cabinet, geocodées à l'inscription du praticien.

export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Tunis: { lat: 36.8065, lng: 10.1815 },
  Ariana: { lat: 36.8665, lng: 10.1647 },
  "Ben Arous": { lat: 36.7531, lng: 10.2189 },
  "La Marsa": { lat: 36.8781, lng: 10.3247 },
  Sfax: { lat: 34.7406, lng: 10.7603 },
  Sousse: { lat: 35.8256, lng: 10.6412 },
  Monastir: { lat: 35.7643, lng: 10.8113 },
  Nabeul: { lat: 36.4561, lng: 10.7376 },
  Bizerte: { lat: 37.2744, lng: 9.8739 },
  Gabès: { lat: 33.8815, lng: 10.0982 },
  Kairouan: { lat: 35.6781, lng: 10.0963 },
  Gafsa: { lat: 34.425, lng: 8.7842 },
  Djerba: { lat: 33.8076, lng: 10.8451 },
};

/** Distance haversine en kilomètres. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function cityDistanceKm(userPos: { lat: number; lng: number }, city: string): number | null {
  const c = CITY_COORDS[city];
  return c ? distanceKm(userPos, c) : null;
}
