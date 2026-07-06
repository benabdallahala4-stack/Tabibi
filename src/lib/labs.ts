// Laboratoires d'analyses médicales (données fictives de démonstration).
// Production : annuaire alimenté par les inscriptions des laboratoires
// partenaires, avec agenda de prélèvements et remise de résultats via
// le portail laboratoire (/labo) directement dans le dossier du patient.

export interface Lab {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  homeSampling: boolean; // prélèvement à domicile
  resultsOnline: boolean; // résultats via Seha
  analyses: string[]; // familles d'analyses
}

export const ANALYSIS_TYPES = [
  "Biochimie",
  "Hématologie",
  "Hormonologie",
  "Immunologie",
  "Microbiologie",
  "Sérologie",
  "Bilan prénatal",
  "Anatomopathologie",
];

export const LABS: Lab[] = [
  {
    id: "lab1",
    name: "Laboratoire Ibn Sina",
    nameAr: "مخبر ابن سينا",
    city: "Tunis",
    address: "Avenue de la Liberté, Tunis",
    phone: "71 010 101",
    hours: "Lun–Sam 6h30–18h, Dim 7h–12h",
    homeSampling: true,
    resultsOnline: true,
    analyses: ["Biochimie", "Hématologie", "Hormonologie", "Sérologie", "Bilan prénatal"],
  },
  {
    id: "lab2",
    name: "Laboratoire du Lac",
    nameAr: "مخبر البحيرة",
    city: "Tunis",
    address: "Les Berges du Lac II, Tunis",
    phone: "71 020 202",
    hours: "Lun–Sam 7h–19h",
    homeSampling: true,
    resultsOnline: true,
    analyses: ["Biochimie", "Hématologie", "Immunologie", "Microbiologie", "Anatomopathologie"],
  },
  {
    id: "lab3",
    name: "Laboratoire El Yasmine",
    nameAr: "مخبر الياسمين",
    city: "Ariana",
    address: "Avenue Habib Bourguiba, Ariana",
    phone: "71 030 303",
    hours: "Lun–Sam 7h–18h",
    homeSampling: false,
    resultsOnline: true,
    analyses: ["Biochimie", "Hématologie", "Sérologie"],
  },
  {
    id: "lab4",
    name: "Laboratoire Thyna",
    nameAr: "مخبر ثينة",
    city: "Sfax",
    address: "Route de Gabès Km 1, Sfax",
    phone: "74 040 404",
    hours: "Lun–Sam 6h30–18h30, Dim 7h–12h",
    homeSampling: true,
    resultsOnline: true,
    analyses: ["Biochimie", "Hématologie", "Hormonologie", "Microbiologie", "Bilan prénatal"],
  },
  {
    id: "lab5",
    name: "Laboratoire du Sahel",
    nameAr: "مخبر الساحل",
    city: "Sousse",
    address: "Avenue Léopold Senghor, Sousse",
    phone: "73 050 505",
    hours: "Lun–Sam 7h–18h",
    homeSampling: true,
    resultsOnline: false,
    analyses: ["Biochimie", "Hématologie", "Immunologie", "Sérologie"],
  },
  {
    id: "lab6",
    name: "Laboratoire Ribat",
    nameAr: "مخبر الرباط",
    city: "Monastir",
    address: "Avenue de l'Indépendance, Monastir",
    phone: "73 060 606",
    hours: "Lun–Sam 7h–17h30",
    homeSampling: false,
    resultsOnline: true,
    analyses: ["Biochimie", "Hématologie", "Hormonologie"],
  },
  {
    id: "lab7",
    name: "Laboratoire Jerba Santé",
    nameAr: "مخبر جربة الصحة",
    city: "Djerba",
    address: "Houmt Souk, Djerba",
    phone: "75 070 707",
    hours: "Lun–Sam 7h–18h",
    homeSampling: true,
    resultsOnline: true,
    analyses: ["Biochimie", "Hématologie", "Sérologie", "Microbiologie"],
  },
  {
    id: "lab8",
    name: "Laboratoire Bizerte Nord",
    nameAr: "مخبر بنزرت الشمال",
    city: "Bizerte",
    address: "Rue Ibn Khaldoun, Bizerte",
    phone: "72 080 808",
    hours: "Lun–Sam 7h–18h",
    homeSampling: false,
    resultsOnline: true,
    analyses: ["Biochimie", "Hématologie", "Immunologie"],
  },
];
