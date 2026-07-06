// Base de médicaments (données fictives de démonstration).
// Production : données officielles de la Direction de la Pharmacie et du
// Médicament (DPM) et de la Pharmacie Centrale de Tunisie (PCT), avec prix
// homologués et disponibilité.

export interface Medicine {
  id: string;
  brand: string; // nom commercial
  dci: string; // dénomination commune internationale
  form: string; // forme et dosage
  classe: string;
  priceTnd: number;
  prescription: boolean; // ordonnance obligatoire
  cnam: boolean; // remboursable CNAM
  generic: boolean; // générique disponible
  uses: string; // indications principales (grand public)
}

export const MEDICINES: Medicine[] = [
  { id: "m1", brand: "Doliprane", dci: "Paracétamol", form: "Comprimé 1000 mg — boîte de 8", classe: "Antalgique / Antipyrétique", priceTnd: 3.2, prescription: false, cnam: true, generic: true, uses: "Douleurs légères à modérées, fièvre" },
  { id: "m2", brand: "Panadol", dci: "Paracétamol", form: "Comprimé 500 mg — boîte de 24", classe: "Antalgique / Antipyrétique", priceTnd: 4.1, prescription: false, cnam: true, generic: true, uses: "Douleurs, fièvre, états grippaux" },
  { id: "m3", brand: "Brufen", dci: "Ibuprofène", form: "Comprimé 400 mg — boîte de 30", classe: "Anti-inflammatoire (AINS)", priceTnd: 6.8, prescription: false, cnam: true, generic: true, uses: "Douleurs inflammatoires, fièvre" },
  { id: "m4", brand: "Amoxil", dci: "Amoxicilline", form: "Gélule 500 mg — boîte de 12", classe: "Antibiotique (pénicilline)", priceTnd: 8.5, prescription: true, cnam: true, generic: true, uses: "Infections bactériennes ORL, respiratoires, urinaires" },
  { id: "m5", brand: "Augmentin", dci: "Amoxicilline + Acide clavulanique", form: "Comprimé 1 g — boîte de 14", classe: "Antibiotique (pénicilline)", priceTnd: 19.4, prescription: true, cnam: true, generic: true, uses: "Infections résistantes, sinusites, otites" },
  { id: "m6", brand: "Glucophage", dci: "Metformine", form: "Comprimé 850 mg — boîte de 60", classe: "Antidiabétique oral", priceTnd: 7.9, prescription: true, cnam: true, generic: true, uses: "Diabète de type 2" },
  { id: "m7", brand: "Amlor", dci: "Amlodipine", form: "Gélule 5 mg — boîte de 30", classe: "Antihypertenseur (inhibiteur calcique)", priceTnd: 12.3, prescription: true, cnam: true, generic: true, uses: "Hypertension artérielle, angor" },
  { id: "m8", brand: "Concor", dci: "Bisoprolol", form: "Comprimé 5 mg — boîte de 30", classe: "Bêtabloquant", priceTnd: 14.6, prescription: true, cnam: true, generic: true, uses: "Hypertension, insuffisance cardiaque" },
  { id: "m9", brand: "Kardégic", dci: "Acide acétylsalicylique", form: "Sachet 100 mg — boîte de 30", classe: "Antiagrégant plaquettaire", priceTnd: 5.4, prescription: true, cnam: true, generic: true, uses: "Prévention cardiovasculaire" },
  { id: "m10", brand: "Ventoline", dci: "Salbutamol", form: "Aérosol 100 µg — flacon 200 doses", classe: "Bronchodilatateur", priceTnd: 9.7, prescription: true, cnam: true, generic: false, uses: "Asthme, crise de bronchospasme" },
  { id: "m11", brand: "Aerius", dci: "Desloratadine", form: "Comprimé 5 mg — boîte de 15", classe: "Antihistaminique", priceTnd: 11.2, prescription: false, cnam: false, generic: true, uses: "Allergies, rhinite, urticaire" },
  { id: "m12", brand: "Smecta", dci: "Diosmectite", form: "Sachet 3 g — boîte de 30", classe: "Antidiarrhéique", priceTnd: 8.9, prescription: false, cnam: false, generic: true, uses: "Diarrhée aiguë, douleurs digestives" },
  { id: "m13", brand: "Gaviscon", dci: "Alginate de sodium", form: "Suspension buvable — flacon 250 ml", classe: "Antireflux", priceTnd: 10.5, prescription: false, cnam: false, generic: false, uses: "Reflux gastro-œsophagien, brûlures d'estomac" },
  { id: "m14", brand: "Omez", dci: "Oméprazole", form: "Gélule 20 mg — boîte de 14", classe: "Inhibiteur de la pompe à protons", priceTnd: 9.3, prescription: true, cnam: true, generic: true, uses: "Ulcère, reflux, protection gastrique" },
  { id: "m15", brand: "Levothyrox", dci: "Lévothyroxine", form: "Comprimé 100 µg — boîte de 30", classe: "Hormone thyroïdienne", priceTnd: 6.1, prescription: true, cnam: true, generic: false, uses: "Hypothyroïdie" },
  { id: "m16", brand: "Tahor", dci: "Atorvastatine", form: "Comprimé 20 mg — boîte de 30", classe: "Hypolipémiant (statine)", priceTnd: 16.8, prescription: true, cnam: true, generic: true, uses: "Cholestérol élevé, prévention cardiovasculaire" },
  { id: "m17", brand: "Xanax", dci: "Alprazolam", form: "Comprimé 0,5 mg — boîte de 30", classe: "Anxiolytique (benzodiazépine)", priceTnd: 7.4, prescription: true, cnam: false, generic: true, uses: "Anxiété — usage strictement encadré" },
  { id: "m18", brand: "Vitamine D3 BON", dci: "Cholécalciférol", form: "Ampoule 200 000 UI", classe: "Vitamine", priceTnd: 4.8, prescription: false, cnam: false, generic: true, uses: "Carence en vitamine D" },
  { id: "m19", brand: "Fer UCB", dci: "Fumarate ferreux", form: "Comprimé 66 mg — boîte de 30", classe: "Antianémique", priceTnd: 5.9, prescription: false, cnam: true, generic: true, uses: "Anémie ferriprive" },
  { id: "m20", brand: "Spasfon", dci: "Phloroglucinol", form: "Comprimé 80 mg — boîte de 30", classe: "Antispasmodique", priceTnd: 6.4, prescription: false, cnam: false, generic: true, uses: "Douleurs spasmodiques digestives, gynécologiques" },
];

export const MEDICINE_CLASSES = Array.from(new Set(MEDICINES.map((m) => m.classe))).sort();

export function searchMedicines(query: string, classe: string, otcOnly: boolean): Medicine[] {
  const q = query.trim().toLowerCase();
  return MEDICINES.filter((m) => {
    const matchQ =
      !q ||
      m.brand.toLowerCase().includes(q) ||
      m.dci.toLowerCase().includes(q) ||
      m.classe.toLowerCase().includes(q) ||
      m.uses.toLowerCase().includes(q);
    const matchC = !classe || m.classe === classe;
    const matchOtc = !otcOnly || !m.prescription;
    return matchQ && matchC && matchOtc;
  });
}
