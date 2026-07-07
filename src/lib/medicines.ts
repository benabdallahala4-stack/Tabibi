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
  { id: "m21", brand: "Efferalgan", dci: "Paracétamol", form: "Comprimé effervescent 1000 mg — boîte de 8", classe: "Antalgique / Antipyrétique", priceTnd: 3.6, prescription: false, cnam: true, generic: true, uses: "Douleurs, fièvre" },
  { id: "m22", brand: "Doliprane Codéiné", dci: "Paracétamol + Codéine", form: "Comprimé 500/30 mg — boîte de 16", classe: "Antalgique opioïde faible", priceTnd: 5.2, prescription: true, cnam: true, generic: true, uses: "Douleurs modérées à intenses" },
  { id: "m23", brand: "Voltarène", dci: "Diclofénac", form: "Comprimé 50 mg — boîte de 30", classe: "Anti-inflammatoire (AINS)", priceTnd: 7.3, prescription: true, cnam: true, generic: true, uses: "Douleurs articulaires, rhumatismes" },
  { id: "m24", brand: "Feldène", dci: "Piroxicam", form: "Gélule 20 mg — boîte de 20", classe: "Anti-inflammatoire (AINS)", priceTnd: 8.1, prescription: true, cnam: true, generic: true, uses: "Arthrose, poussées inflammatoires" },
  { id: "m25", brand: "Zithromax", dci: "Azithromycine", form: "Comprimé 500 mg — boîte de 3", classe: "Antibiotique (macrolide)", priceTnd: 14.9, prescription: true, cnam: true, generic: true, uses: "Infections ORL et respiratoires" },
  { id: "m26", brand: "Rovamycine", dci: "Spiramycine", form: "Comprimé 3 M.UI — boîte de 16", classe: "Antibiotique (macrolide)", priceTnd: 11.7, prescription: true, cnam: true, generic: false, uses: "Infections ORL, toxoplasmose de la grossesse" },
  { id: "m27", brand: "Ciflox", dci: "Ciprofloxacine", form: "Comprimé 500 mg — boîte de 10", classe: "Antibiotique (fluoroquinolone)", priceTnd: 12.6, prescription: true, cnam: true, generic: true, uses: "Infections urinaires, digestives" },
  { id: "m28", brand: "Flagyl", dci: "Métronidazole", form: "Comprimé 500 mg — boîte de 20", classe: "Antibactérien / Antiparasitaire", priceTnd: 5.8, prescription: true, cnam: true, generic: true, uses: "Infections digestives, gynécologiques, amibiase" },
  { id: "m29", brand: "Bactrim", dci: "Sulfaméthoxazole + Triméthoprime", form: "Comprimé 800/160 mg — boîte de 10", classe: "Antibiotique (sulfamide)", priceTnd: 6.2, prescription: true, cnam: true, generic: true, uses: "Infections urinaires et respiratoires" },
  { id: "m30", brand: "Zinnat", dci: "Céfuroxime", form: "Comprimé 500 mg — boîte de 10", classe: "Antibiotique (céphalosporine)", priceTnd: 17.3, prescription: true, cnam: true, generic: true, uses: "Infections ORL, respiratoires, cutanées" },
  { id: "m31", brand: "Zovirax", dci: "Aciclovir", form: "Comprimé 200 mg — boîte de 25", classe: "Antiviral", priceTnd: 13.4, prescription: true, cnam: true, generic: true, uses: "Herpès, zona" },
  { id: "m32", brand: "Diamicron", dci: "Gliclazide", form: "Comprimé LM 60 mg — boîte de 30", classe: "Antidiabétique oral (sulfamide)", priceTnd: 9.5, prescription: true, cnam: true, generic: true, uses: "Diabète de type 2" },
  { id: "m33", brand: "Januvia", dci: "Sitagliptine", form: "Comprimé 100 mg — boîte de 28", classe: "Antidiabétique oral (gliptine)", priceTnd: 42.7, prescription: true, cnam: true, generic: false, uses: "Diabète de type 2" },
  { id: "m34", brand: "Lantus", dci: "Insuline glargine", form: "Stylo SoloStar 100 UI/ml — 5 stylos", classe: "Insuline (analogue lent)", priceTnd: 78.5, prescription: true, cnam: true, generic: false, uses: "Diabète insulino-dépendant" },
  { id: "m35", brand: "Cozaar", dci: "Losartan", form: "Comprimé 50 mg — boîte de 28", classe: "Antihypertenseur (ARA II)", priceTnd: 15.9, prescription: true, cnam: true, generic: true, uses: "Hypertension artérielle" },
  { id: "m36", brand: "Triatec", dci: "Ramipril", form: "Comprimé 5 mg — boîte de 30", classe: "Antihypertenseur (IEC)", priceTnd: 11.4, prescription: true, cnam: true, generic: true, uses: "Hypertension, insuffisance cardiaque" },
  { id: "m37", brand: "Lasilix", dci: "Furosémide", form: "Comprimé 40 mg — boîte de 30", classe: "Diurétique de l'anse", priceTnd: 4.7, prescription: true, cnam: true, generic: true, uses: "Œdèmes, insuffisance cardiaque, HTA" },
  { id: "m38", brand: "Sintrom", dci: "Acénocoumarol", form: "Comprimé 4 mg — boîte de 20", classe: "Anticoagulant (AVK)", priceTnd: 5.6, prescription: true, cnam: true, generic: false, uses: "Prévention des thromboses — surveillance INR" },
  { id: "m39", brand: "Plavix", dci: "Clopidogrel", form: "Comprimé 75 mg — boîte de 30", classe: "Antiagrégant plaquettaire", priceTnd: 24.3, prescription: true, cnam: true, generic: true, uses: "Prévention après infarctus ou stent" },
  { id: "m40", brand: "Crestor", dci: "Rosuvastatine", form: "Comprimé 10 mg — boîte de 30", classe: "Hypolipémiant (statine)", priceTnd: 22.1, prescription: true, cnam: true, generic: true, uses: "Cholestérol élevé" },
  { id: "m41", brand: "Inexium", dci: "Ésoméprazole", form: "Comprimé 40 mg — boîte de 28", classe: "Inhibiteur de la pompe à protons", priceTnd: 15.7, prescription: true, cnam: true, generic: true, uses: "Reflux sévère, ulcère" },
  { id: "m42", brand: "Motilium", dci: "Dompéridone", form: "Comprimé 10 mg — boîte de 40", classe: "Antiémétique / Prokinétique", priceTnd: 7.1, prescription: false, cnam: false, generic: true, uses: "Nausées, vomissements, digestion lente" },
  { id: "m43", brand: "Primpéran", dci: "Métoclopramide", form: "Comprimé 10 mg — boîte de 20", classe: "Antiémétique", priceTnd: 4.3, prescription: true, cnam: true, generic: true, uses: "Nausées, vomissements" },
  { id: "m44", brand: "Forlax", dci: "Macrogol 4000", form: "Sachet 10 g — boîte de 20", classe: "Laxatif osmotique", priceTnd: 8.7, prescription: false, cnam: false, generic: true, uses: "Constipation occasionnelle ou chronique" },
  { id: "m45", brand: "Solupred", dci: "Prednisolone", form: "Comprimé orodispersible 20 mg — boîte de 20", classe: "Corticoïde", priceTnd: 6.9, prescription: true, cnam: true, generic: true, uses: "Inflammations, allergies sévères, asthme" },
  { id: "m46", brand: "Célestène", dci: "Bétaméthasone", form: "Comprimé 0,5 mg — boîte de 30", classe: "Corticoïde", priceTnd: 5.5, prescription: true, cnam: true, generic: true, uses: "Inflammations, allergies, poussées" },
  { id: "m47", brand: "Symbicort", dci: "Budésonide + Formotérol", form: "Turbuhaler 160/4,5 µg — 120 doses", classe: "Antiasthmatique (corticoïde + β2)", priceTnd: 38.2, prescription: true, cnam: true, generic: false, uses: "Asthme, BPCO — traitement de fond" },
  { id: "m48", brand: "Singulair", dci: "Montélukast", form: "Comprimé 10 mg — boîte de 28", classe: "Antiasthmatique (antileucotriène)", priceTnd: 19.6, prescription: true, cnam: true, generic: true, uses: "Asthme, rhinite allergique" },
  { id: "m49", brand: "Zyrtec", dci: "Cétirizine", form: "Comprimé 10 mg — boîte de 15", classe: "Antihistaminique", priceTnd: 7.8, prescription: false, cnam: false, generic: true, uses: "Allergies, rhinite, urticaire" },
  { id: "m50", brand: "Toplexil", dci: "Oxomémazine", form: "Sirop 0,33 mg/ml — flacon 150 ml", classe: "Antitussif", priceTnd: 6.6, prescription: false, cnam: false, generic: false, uses: "Toux sèche et d'irritation" },
  { id: "m51", brand: "Fluimucil", dci: "Acétylcystéine", form: "Sachet 200 mg — boîte de 30", classe: "Mucolytique / Expectorant", priceTnd: 8.4, prescription: false, cnam: false, generic: true, uses: "Toux grasse, encombrement bronchique" },
  { id: "m52", brand: "Lexomil", dci: "Bromazépam", form: "Comprimé 6 mg — boîte de 30", classe: "Anxiolytique (benzodiazépine)", priceTnd: 6.3, prescription: true, cnam: false, generic: true, uses: "Anxiété — usage strictement encadré" },
  { id: "m53", brand: "Prozac", dci: "Fluoxétine", form: "Gélule 20 mg — boîte de 14", classe: "Antidépresseur (ISRS)", priceTnd: 12.9, prescription: true, cnam: true, generic: true, uses: "Dépression, troubles anxieux" },
  { id: "m54", brand: "Stilnox", dci: "Zolpidem", form: "Comprimé 10 mg — boîte de 14", classe: "Hypnotique", priceTnd: 8.2, prescription: true, cnam: false, generic: true, uses: "Insomnie — usage court encadré" },
  { id: "m55", brand: "Lyrica", dci: "Prégabaline", form: "Gélule 75 mg — boîte de 56", classe: "Antiépileptique / Douleur neuropathique", priceTnd: 34.5, prescription: true, cnam: true, generic: true, uses: "Douleurs neuropathiques, anxiété généralisée" },
  { id: "m56", brand: "Débridat", dci: "Trimébutine", form: "Comprimé 100 mg — boîte de 20", classe: "Antispasmodique digestif", priceTnd: 6.7, prescription: false, cnam: false, generic: true, uses: "Colon irritable, troubles du transit" },
  { id: "m57", brand: "Daflon", dci: "Diosmine + Hespéridine", form: "Comprimé 500 mg — boîte de 30", classe: "Veinotonique", priceTnd: 13.8, prescription: false, cnam: false, generic: true, uses: "Insuffisance veineuse, crise hémorroïdaire" },
  { id: "m58", brand: "Clamoxyl Nourrisson", dci: "Amoxicilline", form: "Poudre susp. buvable 250 mg/5 ml — flacon", classe: "Antibiotique (pénicilline)", priceTnd: 6.1, prescription: true, cnam: true, generic: true, uses: "Infections bactériennes de l'enfant" },
  { id: "m59", brand: "Maalox", dci: "Hydroxydes d'aluminium et magnésium", form: "Comprimé à croquer — boîte de 40", classe: "Antiacide", priceTnd: 7.6, prescription: false, cnam: false, generic: true, uses: "Brûlures d'estomac, aigreurs" },
  { id: "m60", brand: "Cortancyl", dci: "Prednisone", form: "Comprimé 20 mg — boîte de 20", classe: "Corticoïde", priceTnd: 5.9, prescription: true, cnam: true, generic: true, uses: "Inflammations, maladies auto-immunes" },
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
