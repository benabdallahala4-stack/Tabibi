// Plan d'abonnement du praticien (démo : localStorage).
// Stratégie freemium : le plan Gratuit donne le profil public, l'agenda et
// les questions publiques ; les outils avancés apparaissent VERROUILLÉS 🔒
// dans l'espace praticien avec un appel à la mise à niveau.

export type Plan = "gratuit" | "essentiel" | "avance" | "premium";

const KEY = "tabibi.pro.plan";

export const PLAN_LABELS: Record<Plan, string> = {
  gratuit: "Gratuit",
  essentiel: "Essentiel",
  avance: "Avancé",
  premium: "Premium",
};

const PLAN_ORDER: Plan[] = ["gratuit", "essentiel", "avance", "premium"];

/** Plan minimal requis par onglet de l'espace praticien. */
export const TAB_MIN_PLAN: Record<string, Plan> = {
  agenda: "gratuit",
  patients: "gratuit",
  qna: "gratuit", // levier de visibilité : gratuit pour attirer les praticiens
  file: "essentiel",
  caisse: "avance",
  messages: "avance",
  suivis: "avance",
  dossier: "avance",
  stats: "avance",
};

export function loadPlan(): Plan {
  if (typeof window === "undefined") return "gratuit";
  const p = window.localStorage.getItem(KEY);
  return PLAN_ORDER.includes(p as Plan) ? (p as Plan) : "gratuit";
}

export function savePlan(plan: Plan): void {
  window.localStorage.setItem(KEY, plan);
}

export function planAllows(plan: Plan, tabId: string): boolean {
  const min = TAB_MIN_PLAN[tabId] ?? "gratuit";
  return PLAN_ORDER.indexOf(plan) >= PLAN_ORDER.indexOf(min);
}
