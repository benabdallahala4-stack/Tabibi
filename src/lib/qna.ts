// Questions médicales — Q&A public et anonyme.
// Les patients posent leurs questions anonymement ; les médecins répondent
// avec leur profil vérifié ; chacun peut voter « utile » sur une réponse.
// Démo : questions/réponses de démonstration (contenu original) + ajouts
// stockés en localStorage. Production : base de données + modération avant
// publication (voir docs/ARCHITECTURE.md).

export interface QnaAnswer {
  id: string;
  doctorSlug: string;
  text: string;
  date: string;
  helpful: number; // votes « utile » de base (démo)
}

export interface QnaQuestion {
  id: string;
  slug: string;
  specialtyId: string;
  title: string;
  body: string;
  date: string;
  answers: QnaAnswer[];
  aiAnswer?: string; // réponse IA immédiate, en attendant un médecin
}

export const QNA_SEED: QnaQuestion[] = [
  {
    id: "q1",
    slug: "palpitations-stress-ou-coeur",
    specialtyId: "cardiologie",
    title: "Palpitations le soir : stress ou problème cardiaque ?",
    body: "J'ai 34 ans et depuis quelques semaines je sens mon cœur battre fort le soir au coucher, parfois avec un battement « raté ». Ça dure quelques minutes puis ça passe. Je n'ai pas de douleur. Est-ce que je dois m'inquiéter ?",
    date: "2026-06-28",
    answers: [
      {
        id: "a1",
        doctorSlug: "dr-amine-ben-salah-cardiologie-tunis",
        text: "Les palpitations au repos chez un adulte jeune sont le plus souvent bénignes (extrasystoles favorisées par le stress, le café, le manque de sommeil). Le fait qu'elles cèdent spontanément et sans douleur est plutôt rassurant. Il faut cependant consulter pour un ECG si elles deviennent fréquentes, et rapidement si elles s'accompagnent de malaise, d'essoufflement ou de douleur thoracique. Un Holter de 24 h permet au besoin de les enregistrer. En attendant : réduisez café et boissons énergisantes, et régularisez le sommeil.",
        date: "2026-06-28",
        helpful: 42,
      },
    ],
  },
  {
    id: "q2",
    slug: "fievre-enfant-quand-urgences",
    specialtyId: "pediatrie",
    title: "Fièvre à 39° chez un enfant de 2 ans : quand aller aux urgences ?",
    body: "Ma fille de 2 ans a 39° depuis hier soir. Elle joue un peu moins mais boit bien. J'ai donné du paracétamol. À partir de quand faut-il aller aux urgences ?",
    date: "2026-06-25",
    answers: [
      {
        id: "a2",
        doctorSlug: "dr-salma-bouazizi-pediatrie-sousse",
        text: "Chez un enfant de 2 ans, c'est moins le chiffre de la fièvre qui compte que son comportement. Un enfant qui boit, urine normalement et reste réactif peut être surveillé à domicile avec du paracétamol à dose adaptée au poids toutes les 6 heures. Consultez rapidement si la fièvre dure plus de 48-72 h, et allez aux urgences sans attendre en cas de : somnolence inhabituelle, taches violacées sur la peau, difficulté à respirer, refus total de boire, vomissements répétés ou convulsion. Chez un nourrisson de moins de 3 mois, toute fièvre est une urgence.",
        date: "2026-06-25",
        helpful: 67,
      },
    ],
  },
  {
    id: "q3",
    slug: "chute-cheveux-apres-accouchement",
    specialtyId: "dermatologie",
    title: "Chute de cheveux importante 3 mois après l'accouchement",
    body: "J'ai accouché il y a 3 mois et je perds énormément de cheveux, par poignées. Est-ce que c'est réversible ? Faut-il faire des analyses ?",
    date: "2026-06-18",
    answers: [
      {
        id: "a3",
        doctorSlug: "dr-ines-trabelsi-dermatologie-la-marsa",
        text: "Ce que vous décrivez est très probablement un effluvium télogène du post-partum : la chute brutale, 2 à 4 mois après l'accouchement, des cheveux « retenus » pendant la grossesse par les hormones. C'est impressionnant mais réversible dans la grande majorité des cas, avec une repousse en 6 à 12 mois. Il est utile de vérifier par une prise de sang la ferritine (les réserves en fer sont souvent basses après un accouchement) et la thyroïde. Si la chute persiste au-delà de 6 mois ou s'accompagne de plaques dégarnies, une consultation s'impose.",
        date: "2026-06-19",
        helpful: 38,
      },
    ],
  },
  {
    id: "q4",
    slug: "insomnie-reveils-nocturnes-solutions",
    specialtyId: "psychiatrie",
    title: "Réveils à 3h du matin tous les jours, impossible de me rendormir",
    body: "Depuis 2 mois je me réveille presque chaque nuit vers 3h et je rumine pendant des heures. Je suis épuisé au travail. Je ne veux pas prendre de somnifères. Que faire ?",
    date: "2026-06-10",
    answers: [
      {
        id: "a4",
        doctorSlug: "dr-yosra-chaabane-psychiatrie-tunis",
        text: "Le réveil nocturne avec ruminations est un motif très fréquent, et votre prudence vis-à-vis des somnifères est justifiée : ils ne traitent pas la cause et créent une dépendance. Deux pistes efficaces : d'abord l'hygiène du sommeil (heures régulières, pas d'écran au lit, chambre fraîche, pas de café après 14h) ; ensuite et surtout, si les ruminations dominent, une évaluation de l'anxiété ou d'un épisode dépressif débutant — le réveil précoce en est un signe classique. La thérapie cognitivo-comportementale de l'insomnie (TCC-I) est le traitement de référence, possible en téléconsultation. N'attendez pas l'épuisement complet pour consulter.",
        date: "2026-06-11",
        helpful: 55,
      },
    ],
  },
  {
    id: "q5",
    slug: "ballonnements-apres-repas-permanents",
    specialtyId: "gastro",
    title: "Ballonnements après chaque repas depuis des mois",
    body: "Homme, 41 ans. Après chaque repas je suis ballonné avec des gaz, parfois des crampes. Pas de sang, pas de perte de poids. J'ai déjà arrêté les boissons gazeuses. Quelles analyses faire ?",
    date: "2026-05-30",
    answers: [
      {
        id: "a5",
        doctorSlug: "dr-walid-abidi-gastro-bizerte",
        text: "Sans signe d'alarme (pas de sang, pas d'amaigrissement, pas d'anémie), le tableau évoque en premier lieu un trouble fonctionnel intestinal, très fréquent. Avant les examens, un test simple : réduire pendant 3-4 semaines les aliments fermentescibles (légumineuses en excès, oignon cru, boissons gazeuses, chewing-gum) et manger plus lentement. Si les symptômes persistent, votre médecin pourra demander une recherche d'intolérance au lactose et un bilan de base ; la découverte récente d'un Helicobacter pylori mérite aussi d'être discutée si vous avez des douleurs hautes. La coloscopie n'est pas systématique à votre âge sans signe d'alarme.",
        date: "2026-05-31",
        helpful: 29,
      },
    ],
  },
  {
    id: "q6",
    slug: "lunettes-enfant-plisse-les-yeux",
    specialtyId: "ophtalmologie",
    title: "Mon fils de 6 ans plisse les yeux devant la télé",
    body: "L'institutrice me dit qu'il se rapproche du tableau et à la maison il plisse les yeux devant la télévision. Est-ce forcément des lunettes ? À quel âge peut-on faire un vrai examen de la vue ?",
    date: "2026-05-22",
    answers: [
      {
        id: "a6",
        doctorSlug: "dr-nizar-mejri-ophtalmologie-monastir",
        text: "Plisser les yeux et se rapprocher du tableau sont deux signes très évocateurs d'une myopie débutante — fréquente à cet âge. Bonne nouvelle : un examen complet est parfaitement réalisable à 6 ans (et bien avant), avec une mesure de la réfraction après instillation de gouttes. Si une correction est nécessaire, plus elle est mise tôt, mieux l'école se passe. Pensez aussi aux mesures qui freinent la progression de la myopie : au moins une heure par jour d'activités en extérieur et limitation des écrans à courte distance.",
        date: "2026-05-23",
        helpful: 33,
      },
    ],
  },
];

/* ----- Surcouche locale (questions posées, réponses ajoutées, votes) ----- */

interface QnaLocalState {
  questions: QnaQuestion[]; // questions posées depuis cet appareil
  extraAnswers: Record<string, QnaAnswer[]>; // réponses ajoutées par question
  votes: Record<string, boolean>; // answerId → a voté
}

const KEY = "seha.qna.v1";

export function loadQnaLocal(): QnaLocalState {
  if (typeof window === "undefined") return { questions: [], extraAnswers: {}, votes: {} };
  try {
    return {
      questions: [],
      extraAnswers: {},
      votes: {},
      ...JSON.parse(window.localStorage.getItem(KEY) ?? "{}"),
    } as QnaLocalState;
  } catch {
    return { questions: [], extraAnswers: {}, votes: {} };
  }
}

function saveQnaLocal(s: QnaLocalState): void {
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

/** Questions fusionnées (démo + locales), plus récentes d'abord. */
export function allQuestions(): QnaQuestion[] {
  const local = loadQnaLocal();
  const merged = [...local.questions, ...QNA_SEED].map((q) => ({
    ...q,
    answers: [...q.answers, ...(local.extraAnswers[q.id] ?? [])],
  }));
  return merged.sort((a, b) => b.date.localeCompare(a.date));
}

export function findQuestion(slug: string): QnaQuestion | undefined {
  return allQuestions().find((q) => q.slug === slug);
}

export function askQuestion(specialtyId: string, title: string, body: string): QnaQuestion {
  const local = loadQnaLocal();
  const id = `q-${Date.now().toString(36)}`;
  const question: QnaQuestion = {
    id,
    slug: id,
    specialtyId,
    title: title.trim(),
    body: body.trim(),
    date: new Date().toISOString().slice(0, 10),
    answers: [],
  };
  local.questions.unshift(question);
  saveQnaLocal(local);
  return question;
}

/** Attache la réponse IA à une question posée depuis cet appareil. */
export function setAiAnswer(questionId: string, text: string): void {
  const local = loadQnaLocal();
  const own = local.questions.find((q) => q.id === questionId);
  if (own) {
    own.aiAnswer = text;
    saveQnaLocal(local);
  }
}

export function answerQuestion(questionId: string, doctorSlug: string, text: string): void {
  const local = loadQnaLocal();
  const answer: QnaAnswer = {
    id: `a-${Date.now().toString(36)}`,
    doctorSlug,
    text: text.trim(),
    date: new Date().toISOString().slice(0, 10),
    helpful: 0,
  };
  // Question locale ou question de démo : la réponse va dans extraAnswers.
  const own = local.questions.find((q) => q.id === questionId);
  if (own) {
    own.answers.push(answer);
  } else {
    local.extraAnswers[questionId] = [...(local.extraAnswers[questionId] ?? []), answer];
  }
  saveQnaLocal(local);
}

/** Vote « utile » (1 par appareil et par réponse). Renvoie le nouveau total local. */
export function voteHelpful(answerId: string): boolean {
  const local = loadQnaLocal();
  if (local.votes[answerId]) return false;
  local.votes[answerId] = true;
  saveQnaLocal(local);
  return true;
}

export function hasVoted(answerId: string): boolean {
  return !!loadQnaLocal().votes[answerId];
}
