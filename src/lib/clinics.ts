// Cliniques et polycliniques partenaires (données fictives de démonstration).
// La Tunisie est une destination majeure de tourisme médical, notamment pour
// les patients libyens : chaque clinique précise son accueil international.

export interface Clinic {
  slug: string;
  name: string;
  nameAr: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  specialties: string[];
  doctorSlugs: string[]; // praticiens Seha exerçant dans la clinique
  beds: number;
  emergency24h: boolean;
  international: {
    libyaDesk: boolean; // guichet dédié patients libyens
    languages: string[];
    services: string[]; // accompagnement international
  };
}

export const CLINICS: Clinic[] = [
  {
    slug: "clinique-carthage-internationale-tunis",
    name: "Clinique Carthage Internationale",
    nameAr: "مصحة قرطاج الدولية",
    city: "Tunis",
    address: "Avenue de la Bourse, Les Berges du Lac II, Tunis",
    phone: "+216 71 123 456",
    description:
      "Clinique pluridisciplinaire de référence à Tunis : chirurgie, cardiologie interventionnelle, oncologie et maternité. Guichet dédié aux patients internationaux.",
    specialties: ["Cardiologie", "Chirurgie", "Oncologie", "Maternité", "Imagerie médicale"],
    doctorSlugs: ["dr-amine-ben-salah-cardiologie-tunis", "dr-leila-hammami-gynecologie-tunis"],
    beds: 120,
    emergency24h: true,
    international: {
      libyaDesk: true,
      languages: ["Arabe", "Français", "Anglais"],
      services: [
        "Devis et prise en charge avant le voyage",
        "Coordination hébergement et transport depuis la frontière ou l'aéroport",
        "Facturation internationale (espèces, virement, assurances libyennes)",
        "Interprète et suivi post-opératoire à distance",
      ],
    },
  },
  {
    slug: "clinique-el-yasmine-sousse",
    name: "Clinique El Yasmine",
    nameAr: "مصحة الياسمين",
    city: "Sousse",
    address: "Boulevard du 14 Janvier, Sousse",
    phone: "+216 73 234 567",
    description:
      "Clinique moderne du Sahel : orthopédie, pédiatrie et procréation médicalement assistée. Très fréquentée par les patients libyens et algériens.",
    specialties: ["Orthopédie", "Pédiatrie", "PMA", "ORL"],
    doctorSlugs: ["dr-salma-bouazizi-pediatrie-sousse", "mme-asma-ferchichi-kine-sousse"],
    beds: 80,
    emergency24h: true,
    international: {
      libyaDesk: true,
      languages: ["Arabe", "Français"],
      services: [
        "Guichet patients libyens (dossier, devis, séjour)",
        "Chambres accompagnant",
        "Paiement en dinar libyen négociable via bureau de change partenaire",
      ],
    },
  },
  {
    slug: "polyclinique-mediterranee-sfax",
    name: "Polyclinique Méditerranée",
    nameAr: "المصحة المتوسطية",
    city: "Sfax",
    address: "Route de l'Aéroport Km 3, Sfax",
    phone: "+216 74 345 678",
    description:
      "Polyclinique du sud : chirurgie générale, gastro-entérologie, néphrologie-dialyse et orthopédie. Point d'entrée naturel des patients venant de Libye par la route.",
    specialties: ["Chirurgie", "Gastro-entérologie", "Dialyse", "Orthopédie"],
    doctorSlugs: ["dr-hatem-baccouche-orthopedie-sfax", "dr-walid-abidi-gastro-bizerte"],
    beds: 95,
    emergency24h: true,
    international: {
      libyaDesk: true,
      languages: ["Arabe", "Français", "Anglais"],
      services: [
        "Accueil 24h/24 des urgences venant de la frontière de Ras Jedir",
        "Séances de dialyse programmées pour patients de passage",
        "Coordination avec cliniques de Tripoli et Benghazi pour le suivi",
      ],
    },
  },
  {
    slug: "clinique-les-oliviers-djerba",
    name: "Clinique Les Oliviers",
    nameAr: "مصحة الزياتين",
    city: "Djerba",
    address: "Zone touristique Midoun, Djerba",
    phone: "+216 75 456 789",
    description:
      "Clinique insulaire orientée tourisme médical : chirurgie esthétique, dentaire, ophtalmologie et bilans de santé complets combinés à un séjour à Djerba.",
    specialties: ["Chirurgie esthétique", "Dentaire", "Ophtalmologie", "Check-up"],
    doctorSlugs: ["dr-nizar-mejri-ophtalmologie-monastir"],
    beds: 45,
    emergency24h: false,
    international: {
      libyaDesk: true,
      languages: ["Arabe", "Français", "Anglais", "Italien"],
      services: [
        "Forfaits soins + hôtel + transferts",
        "Bilans de santé complets en 48 h",
        "Suivi à distance par téléconsultation Seha après le retour",
      ],
    },
  },
];

export function findClinic(slug: string): Clinic | undefined {
  return CLINICS.find((c) => c.slug === slug);
}

export function clinicMapsEmbedUrl(c: Clinic): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(c.address)}&output=embed`;
}
