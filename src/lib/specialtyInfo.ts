// Contenu éditorial original par spécialité pour les pages annuaire (SEO) :
// ce que soigne le spécialiste et quand le consulter.

export const SPECIALTY_INFO: Record<string, { treats: string; whenToConsult: string }> = {
  "medecine-generale": {
    treats:
      "Le médecin généraliste (médecin de famille) est le premier interlocuteur pour la plupart des problèmes de santé : infections courantes, suivi des maladies chroniques (diabète, hypertension, cholestérol), vaccination, certificats après examen, et orientation vers le bon spécialiste quand c'est nécessaire.",
    whenToConsult:
      "Consultez pour tout symptôme nouveau ou persistant, un bilan de santé annuel après 40 ans, le renouvellement d'un traitement au long cours, ou simplement pour avoir un médecin qui connaît votre histoire et coordonne vos soins.",
  },
  dentiste: {
    treats:
      "Le chirurgien-dentiste prend en charge caries, détartrage, dévitalisations, extractions (dont dents de sagesse), prothèses, implants et orthodontie. Il traite aussi les urgences dentaires : rage de dent, abcès, dent cassée.",
    whenToConsult:
      "Une visite de contrôle tous les 6 à 12 mois permet de traiter les caries avant qu'elles ne fassent mal. Consultez sans attendre en cas de douleur, de saignement des gencives répété ou de sensibilité au chaud/froid qui persiste.",
  },
  cardiologie: {
    treats:
      "Le cardiologue diagnostique et traite les maladies du cœur et des vaisseaux : hypertension, troubles du rythme (palpitations), insuffisance cardiaque, angine de poitrine, suites d'infarctus. Il réalise ECG, échographie cardiaque, épreuve d'effort et Holter.",
    whenToConsult:
      "Consultez en cas de douleur thoracique à l'effort, d'essoufflement inhabituel, de palpitations répétées ou de tension difficile à équilibrer — et en prévention si vous cumulez des facteurs de risque (tabac, diabète, hérédité). Douleur thoracique intense et brutale = appel direct au 190.",
  },
  dermatologie: {
    treats:
      "Le dermatologue traite les maladies de la peau, des cheveux et des ongles : acné, eczéma, psoriasis, mycoses, chute de cheveux, ainsi que le dépistage des cancers cutanés par l'examen des grains de beauté.",
    whenToConsult:
      "Consultez pour toute lésion qui change (taille, couleur, contour), une acné qui résiste ou laisse des marques, des démangeaisons persistantes, ou un contrôle des grains de beauté — surtout en cas d'expositions solaires répétées.",
  },
  gynecologie: {
    treats:
      "Le gynécologue-obstétricien assure le suivi gynécologique (contraception, frottis de dépistage, troubles des règles, ménopause), le suivi de grossesse avec échographies, et la prise en charge de l'infertilité.",
    whenToConsult:
      "Un suivi régulier est recommandé dès le début de la vie intime, puis un frottis de dépistage selon le rythme conseillé par votre médecin. Consultez rapidement en cas de saignements anormaux, douleurs pelviennes ou dès le début d'une grossesse.",
  },
  pediatrie: {
    treats:
      "Le pédiatre suit la santé de l'enfant de la naissance à l'adolescence : croissance, vaccination, alimentation, infections de l'enfance, asthme, allergies, troubles du sommeil et du développement.",
    whenToConsult:
      "Outre les visites obligatoires du nourrisson et les vaccins, consultez en cas de fièvre mal tolérée, de cassure de la courbe de croissance ou de poids, ou de toute inquiétude sur le développement (langage, motricité, comportement).",
  },
  ophtalmologie: {
    treats:
      "L'ophtalmologue prend en charge la vision et les maladies de l'œil : lunettes et lentilles, cataracte, glaucome, DMLA, strabisme de l'enfant, sécheresse oculaire, et chirurgie réfractive.",
    whenToConsult:
      "Un contrôle est conseillé avant l'entrée à l'école, puis régulièrement après 45 ans (presbytie, tension oculaire). Consultez en urgence pour une baisse de vision brutale, un œil rouge et douloureux, ou des éclairs lumineux avec « mouches volantes » soudaines.",
  },
  orl: {
    treats:
      "L'ORL traite les affections de l'oreille, du nez et de la gorge : otites, sinusites chroniques, angines à répétition, baisse d'audition, acouphènes, vertiges, ronflement et apnées du sommeil.",
    whenToConsult:
      "Consultez pour des otites ou angines qui se répètent, une baisse d'audition, un ronflement avec pauses respiratoires, des vertiges, ou un enrouement qui dure plus de trois semaines.",
  },
  psychiatrie: {
    treats:
      "Le psychiatre diagnostique et traite les troubles anxieux, la dépression, les troubles du sommeil, le burn-out, les troubles bipolaires et les addictions — par la psychothérapie, et si nécessaire un traitement médicamenteux encadré.",
    whenToConsult:
      "Consultez quand l'anxiété, la tristesse ou l'insomnie durent depuis plusieurs semaines et retentissent sur le travail ou la vie familiale. La téléconsultation facilite un premier contact confidentiel. Idées noires = consultation urgente (190 en cas de danger immédiat).",
  },
  orthopedie: {
    treats:
      "Le chirurgien orthopédiste traite os, articulations, ligaments et tendons : fractures, entorses graves, arthrose du genou et de la hanche, hernies discales, épaule douloureuse et traumatologie du sport.",
    whenToConsult:
      "Consultez après un traumatisme avec douleur ou gonflement persistant, pour une douleur articulaire qui limite la marche ou le sommeil, ou quand un traitement médical bien suivi ne suffit plus.",
  },
  gastro: {
    treats:
      "Le gastro-entérologue prend en charge l'appareil digestif : reflux, ulcères, côlon irritable, maladies du foie, hépatites, maladies inflammatoires de l'intestin, et réalise fibroscopies et coloscopies de dépistage.",
    whenToConsult:
      "Consultez pour des brûlures d'estomac fréquentes, des troubles du transit persistants, des douleurs abdominales répétées — et sans attendre en cas de sang dans les selles, d'amaigrissement inexpliqué ou de difficulté à avaler.",
  },
  kine: {
    treats:
      "Le kinésithérapeute rééduque après blessure ou chirurgie, soulage les lombalgies et cervicalgies, traite les tendinites, et accompagne les affections respiratoires et neurologiques par des techniques manuelles et des exercices adaptés.",
    whenToConsult:
      "Sur prescription médicale après une opération, une fracture ou une entorse, ou pour un mal de dos qui se répète : quelques séances bien conduites évitent souvent la chronicisation.",
  },
};
