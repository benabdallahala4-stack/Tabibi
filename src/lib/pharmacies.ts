// Pharmacies de garde (données fictives de démonstration).
// Production : synchronisation avec la liste officielle du Conseil de
// l'Ordre des Pharmaciens de Tunisie, mise à jour chaque semaine.

export interface Pharmacy {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  address: string;
  phone: string;
  garde: "jour" | "nuit" | "24h"; // garde de jour (dimanche/fériés), de nuit, ou 24h/24
}

export const PHARMACIES: Pharmacy[] = [
  { id: "ph1", name: "Pharmacie Ben Ammar", nameAr: "صيدلية بن عمار", city: "Tunis", address: "Avenue de la Liberté, Tunis", phone: "71 111 111", garde: "nuit" },
  { id: "ph2", name: "Pharmacie du Passage", nameAr: "صيدلية الباساج", city: "Tunis", address: "Place du Passage, Tunis", phone: "71 222 222", garde: "24h" },
  { id: "ph3", name: "Pharmacie El Manar", nameAr: "صيدلية المنار", city: "Tunis", address: "Campus El Manar, Tunis", phone: "71 333 333", garde: "jour" },
  { id: "ph4", name: "Pharmacie Ariana Centre", nameAr: "صيدلية أريانة الوسط", city: "Ariana", address: "Avenue Habib Bourguiba, Ariana", phone: "71 444 444", garde: "nuit" },
  { id: "ph5", name: "Pharmacie La Marsa Plage", nameAr: "صيدلية المرسى الشاطئ", city: "La Marsa", address: "Avenue de la Plage, La Marsa", phone: "71 555 555", garde: "jour" },
  { id: "ph6", name: "Pharmacie Sfax Médina", nameAr: "صيدلية صفاقس المدينة", city: "Sfax", address: "Rue de la République, Sfax", phone: "74 111 111", garde: "24h" },
  { id: "ph7", name: "Pharmacie Route Tunis", nameAr: "صيدلية طريق تونس", city: "Sfax", address: "Route de Tunis Km 1, Sfax", phone: "74 222 222", garde: "nuit" },
  { id: "ph8", name: "Pharmacie Sousse Corniche", nameAr: "صيدلية سوسة الكورنيش", city: "Sousse", address: "Boulevard de la Corniche, Sousse", phone: "73 111 111", garde: "nuit" },
  { id: "ph9", name: "Pharmacie Bab Bhar", nameAr: "صيدلية باب بحر", city: "Sousse", address: "Place Farhat Hached, Sousse", phone: "73 222 222", garde: "jour" },
  { id: "ph10", name: "Pharmacie Monastir Marina", nameAr: "صيدلية المنستير المارينا", city: "Monastir", address: "Zone Marina, Monastir", phone: "73 333 333", garde: "nuit" },
  { id: "ph11", name: "Pharmacie Nabeul Centre", nameAr: "صيدلية نابل الوسط", city: "Nabeul", address: "Avenue Habib Thameur, Nabeul", phone: "72 111 111", garde: "jour" },
  { id: "ph12", name: "Pharmacie Bizerte Port", nameAr: "صيدلية بنزرت الميناء", city: "Bizerte", address: "Vieux Port, Bizerte", phone: "72 222 222", garde: "nuit" },
  { id: "ph13", name: "Pharmacie Djerba Houmt Souk", nameAr: "صيدلية جربة حومة السوق", city: "Djerba", address: "Houmt Souk, Djerba", phone: "75 111 111", garde: "24h" },
  { id: "ph14", name: "Pharmacie Kairouan Médina", nameAr: "صيدلية القيروان المدينة", city: "Kairouan", address: "Bab Tunis, Kairouan", phone: "77 111 111", garde: "jour" },
];
