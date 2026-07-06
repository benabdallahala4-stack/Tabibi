// Espace de travail Seha Pro (démonstration) : dossiers patients,
// consultations, ordonnances, certificats, caisse, messagerie et suivis.
//
// ⚖️ Cadre tunisien : pas de certificat médical « en ligne ». Le certificat
// est établi APRÈS examen (au cabinet ou après téléconsultation de contrôle)
// et remis EN MAIN PROPRE au patient. Seha n'en garde qu'une TRACE
// administrative (type, date, durée) dans le dossier — jamais de document
// téléchargeable.
//
// Stockage localStorage (démo mono-appareil). V1 : API + base de données.

export type PaymentMethod = "especes" | "carte" | "cnam" | "impaye";

export interface ConsultationRecord {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  kind: "cabinet" | "teleconsultation";
  motif: string;
  notes: string;
  prescription: string; // ordonnance : trace texte, remise en main propre
  certificate: { type: string; days: number } | null; // remis en main propre
  amount: number; // DT
  method: PaymentMethod;
  paid: boolean;
}

export interface ProPatient {
  id: string;
  name: string;
  phone: string;
  birthYear: string;
  origin: "Tunisie" | "Libye" | "Algérie" | "Autre";
  allergies: string;
  chronic: string; // maladies chroniques
}

export interface FollowUp {
  id: string;
  patientId: string;
  dueDate: string;
  note: string;
  done: boolean;
}

export interface ChatMessage {
  from: "medecin" | "patient";
  text: string;
  at: string;
}

export interface MessageThread {
  id: string;
  patientName: string;
  messages: ChatMessage[];
}

export interface ProWorkspace {
  patients: ProPatient[];
  consultations: ConsultationRecord[];
  followUps: FollowUp[];
  threads: MessageThread[];
}

const KEY = "seha.pro.workspace.v1";

const SEED: ProWorkspace = {
  patients: [
    {
      id: "p1",
      name: "Mohamed Karray",
      phone: "22 111 222",
      birthYear: "1969",
      origin: "Tunisie",
      allergies: "Pénicilline",
      chronic: "Hypertension artérielle",
    },
    {
      id: "p2",
      name: "Fatma Jebali",
      phone: "98 333 444",
      birthYear: "1988",
      origin: "Tunisie",
      allergies: "—",
      chronic: "—",
    },
    {
      id: "p3",
      name: "Abdallah El-Mansouri",
      phone: "+218 91 555 666",
      birthYear: "1957",
      origin: "Libye",
      allergies: "—",
      chronic: "Diabète type 2, insuffisance coronarienne",
    },
  ],
  consultations: [
    {
      id: "c1",
      patientId: "p1",
      date: "2026-06-22",
      kind: "cabinet",
      motif: "Contrôle tension",
      notes: "TA 14/9 sous traitement. ECG normal.",
      prescription: "Amlodipine 5mg — 1/j pendant 3 mois",
      certificate: null,
      amount: 80,
      method: "cnam",
      paid: true,
    },
    {
      id: "c2",
      patientId: "p2",
      date: "2026-06-29",
      kind: "teleconsultation",
      motif: "Palpitations",
      notes: "Contrôle vidéo : bénin probable, Holter demandé. Certificat de repos remis en main propre au cabinet le 30/06.",
      prescription: "",
      certificate: { type: "Repos", days: 2 },
      amount: 60,
      method: "carte",
      paid: true,
    },
    {
      id: "c3",
      patientId: "p3",
      date: "2026-07-03",
      kind: "cabinet",
      motif: "Bilan cardiaque complet (patient venu de Tripoli)",
      notes: "Écho + épreuve d'effort. Coordination avec la Clinique Carthage Internationale pour coronarographie.",
      prescription: "Bisoprolol 5mg — 1/j ; Aspirine 100mg — 1/j",
      certificate: null,
      amount: 250,
      method: "especes",
      paid: false,
    },
  ],
  followUps: [
    { id: "f1", patientId: "p1", dueDate: "2026-09-22", note: "Renouvellement ordonnance + contrôle TA", done: false },
    { id: "f2", patientId: "p2", dueDate: "2026-07-13", note: "Résultat Holter — téléconsultation de contrôle", done: false },
    { id: "f3", patientId: "p3", dueDate: "2026-07-10", note: "Appeler la clinique : date de coronarographie", done: false },
  ],
  threads: [
    {
      id: "t1",
      patientName: "Fatma Jebali",
      messages: [
        { from: "patient", text: "Bonjour Docteur, j'ai récupéré le Holter, je le dépose demain ?", at: "2026-07-04 18:12" },
        { from: "medecin", text: "Bonjour, oui déposez-le à l'accueil avant 12h. On fait un point vidéo lundi.", at: "2026-07-04 19:05" },
      ],
    },
    {
      id: "t2",
      patientName: "Abdallah El-Mansouri",
      messages: [
        { from: "patient", text: "سلام دكتور، وصلت طرابلس بخير. متى نتيجة التحاليل؟", at: "2026-07-05 10:40" },
      ],
    },
  ],
};

export function loadWorkspace(): ProWorkspace {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as ProWorkspace;
  } catch {
    return SEED;
  }
}

export function saveWorkspace(ws: ProWorkspace): void {
  window.localStorage.setItem(KEY, JSON.stringify(ws));
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
