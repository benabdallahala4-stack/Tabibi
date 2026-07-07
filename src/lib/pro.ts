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
  // Champs enrichis (optionnels — rétro-compatibles avec l'ancien seed)
  gender?: "H" | "F";
  email?: string;
  address?: string;
  city?: string;
  bloodGroup?: string; // O+, A-, …
  cnamId?: string; // identifiant unique CNAM
  insurer?: string; // CNAM / assurance privée / aucun
  antecedents?: string; // antécédents médicaux/chirurgicaux/familiaux
  treatments?: string; // traitements en cours
  notes?: string; // note libre du praticien
  createdAt?: string; // YYYY-MM-DD
}

export interface VitalsRecord {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  weightKg?: number;
  heightCm?: number;
  systolic?: number; // TA systolique
  diastolic?: number; // TA diastolique
  heartRate?: number; // bpm
  tempC?: number;
  glycemia?: number; // g/L
  spo2?: number; // %
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  title: string;
  kind: "analyse" | "imagerie" | "ordonnance" | "certificat" | "courrier" | "autre";
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
  vitals: VitalsRecord[];
  documents: MedicalDocument[];
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
      gender: "H",
      email: "m.karray@example.tn",
      address: "Rue de Marseille, Tunis",
      city: "Tunis",
      bloodGroup: "O+",
      cnamId: "0123456-78",
      insurer: "CNAM",
      antecedents: "Père hypertendu. Appendicectomie 1992.",
      treatments: "Amlodipine 5mg",
      createdAt: "2024-02-14",
    },
    {
      id: "p2",
      name: "Fatma Jebali",
      phone: "98 333 444",
      birthYear: "1988",
      origin: "Tunisie",
      allergies: "—",
      chronic: "—",
      gender: "F",
      email: "fatma.jebali@example.tn",
      city: "Ariana",
      bloodGroup: "A+",
      insurer: "Assurance privée (STAR)",
      antecedents: "RAS.",
      createdAt: "2025-01-09",
    },
    {
      id: "p3",
      name: "Abdallah El-Mansouri",
      phone: "+218 91 555 666",
      birthYear: "1957",
      origin: "Libye",
      allergies: "—",
      chronic: "Diabète type 2, insuffisance coronarienne",
      gender: "H",
      address: "Tripoli, Libye",
      city: "Tripoli",
      bloodGroup: "B+",
      insurer: "Aucun (patient international)",
      antecedents: "Diabète depuis 2009. Stent coronaire 2021 (Tunis).",
      treatments: "Bisoprolol 5mg, Aspirine 100mg, Metformine 1000mg",
      notes: "Patient suivi à distance entre deux séjours à Tunis.",
      createdAt: "2025-11-20",
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
  vitals: [
    { id: "v1", patientId: "p1", date: "2026-06-22", weightKg: 84, heightCm: 174, systolic: 140, diastolic: 90, heartRate: 78, glycemia: 0.98 },
    { id: "v2", patientId: "p1", date: "2026-03-15", weightKg: 86, heightCm: 174, systolic: 150, diastolic: 95, heartRate: 82 },
    { id: "v3", patientId: "p3", date: "2026-07-03", weightKg: 79, heightCm: 170, systolic: 135, diastolic: 85, heartRate: 72, glycemia: 1.45, spo2: 97 },
  ],
  documents: [
    { id: "d1", patientId: "p1", date: "2026-06-22", title: "ECG de repos", kind: "analyse" },
    { id: "d2", patientId: "p3", date: "2026-07-03", title: "Échographie cardiaque", kind: "imagerie" },
    { id: "d3", patientId: "p3", date: "2026-07-03", title: "Bilan lipidique + HbA1c", kind: "analyse" },
    { id: "d4", patientId: "p2", date: "2026-06-29", title: "Compte-rendu téléconsultation", kind: "courrier" },
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
    const parsed = JSON.parse(raw) as Partial<ProWorkspace>;
    // Rétro-compatibilité : garantir la présence des nouveaux tableaux.
    return {
      patients: parsed.patients ?? [],
      consultations: parsed.consultations ?? [],
      followUps: parsed.followUps ?? [],
      threads: parsed.threads ?? [],
      vitals: parsed.vitals ?? [],
      documents: parsed.documents ?? [],
    };
  } catch {
    return SEED;
  }
}

// Âge à partir de l'année de naissance (approximation, année courante figée
// côté démo pour rester déterministe SSR/CSR).
export function ageFromBirthYear(birthYear: string): number | null {
  const y = parseInt(birthYear, 10);
  if (!y || y < 1900) return null;
  return 2026 - y;
}

export function saveWorkspace(ws: ProWorkspace): void {
  window.localStorage.setItem(KEY, JSON.stringify(ws));
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
