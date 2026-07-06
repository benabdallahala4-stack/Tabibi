// Dossier médical du patient — saisi et contrôlé PAR le patient.
//
// Modèle de consentement (loi tunisienne n° 2004-63 / INPDP) :
// le dossier appartient au patient ; il n'est JAMAIS visible d'un praticien
// sans action explicite du patient. Le patient active le partage et remet
// un CODE D'ACCÈS au praticien de son choix (au cabinet, en visio ou par
// message). Le praticien saisit ce code dans son espace pour consulter le
// dossier. Le patient peut couper l'accès à tout moment (désactivation ou
// régénération du code).
//
// Démo : stockage local (localStorage, même appareil). Production : stockage
// serveur chiffré, partage par praticien avec journal d'accès (audit trail).

export interface MedicalDocument {
  id: string;
  name: string;
  category: "ordonnance" | "analyse" | "imagerie" | "compte-rendu" | "vaccination" | "autre";
  mimeType: string;
  dataUrl: string; // contenu embarqué (démo) — production : URL chiffrée
  size: number; // octets
  addedAt: string;
}

export interface MedicalRecord {
  bloodType: string;
  heightCm: string;
  weightKg: string;
  allergies: string;
  chronic: string;
  medications: string;
  surgeries: string;
  familyHistory: string;
  documents: MedicalDocument[];
  sharing: {
    enabled: boolean;
    code: string; // code d'accès remis au praticien par le patient
  };
}

const KEY = "seha.medicalRecord.v1";

// localStorage ≈ 5 Mo : limites prudentes pour la démo.
export const MAX_FILE_BYTES = 1_500_000; // 1,5 Mo par document
export const MAX_TOTAL_BYTES = 3_500_000; // 3,5 Mo au total

export function emptyRecord(): MedicalRecord {
  return {
    bloodType: "",
    heightCm: "",
    weightKg: "",
    allergies: "",
    chronic: "",
    medications: "",
    surgeries: "",
    familyHistory: "",
    documents: [],
    sharing: { enabled: false, code: generateCode() },
  };
}

export function generateCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function loadRecord(): MedicalRecord {
  if (typeof window === "undefined") return emptyRecord();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyRecord();
    return { ...emptyRecord(), ...JSON.parse(raw) } as MedicalRecord;
  } catch {
    return emptyRecord();
  }
}

export function saveRecord(r: MedicalRecord): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(r));
    return true;
  } catch {
    return false; // quota dépassé
  }
}

export function totalDocumentsBytes(r: MedicalRecord): number {
  return r.documents.reduce((s, d) => s + d.size, 0);
}

/** Côté praticien : le dossier n'est rendu que si le partage est actif ET le code correct. */
export function accessRecordWithCode(code: string): MedicalRecord | null {
  const r = loadRecord();
  if (!r.sharing.enabled) return null;
  if (r.sharing.code.toUpperCase() !== code.trim().toUpperCase()) return null;
  return r;
}
