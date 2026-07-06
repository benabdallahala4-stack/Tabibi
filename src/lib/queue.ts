// File d'attente du cabinet — le praticien gère la file, le patient suit
// sa position et son heure estimée de passage en temps réel.
// Démo : localStorage (même appareil). Production : temps réel via WebSocket.

export type QueueStatus = "waiting" | "current" | "done";

export interface QueueEntry {
  ticket: number;
  name: string;
  status: QueueStatus;
}

export interface QueueState {
  avgMinutes: number; // durée moyenne d'une consultation
  nextTicket: number;
  entries: QueueEntry[];
}

const KEY = "seha.queue.v1";

const SEED: QueueState = {
  avgMinutes: 20,
  nextTicket: 4,
  entries: [
    { ticket: 1, name: "Mohamed K.", status: "done" },
    { ticket: 2, name: "Fatma J.", status: "current" },
    { ticket: 3, name: "Ali B.", status: "waiting" },
  ],
};

export function loadQueue(): QueueState {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as QueueState;
  } catch {
    return SEED;
  }
}

export function saveQueue(q: QueueState): void {
  window.localStorage.setItem(KEY, JSON.stringify(q));
}

/** Position (1 = prochain) et attente estimée en minutes pour un ticket. */
export function estimate(q: QueueState, ticket: number): { position: number; minutes: number } | null {
  const waiting = q.entries.filter((e) => e.status === "waiting").sort((a, b) => a.ticket - b.ticket);
  const idx = waiting.findIndex((e) => e.ticket === ticket);
  if (idx === -1) return null;
  const currentRemaining = q.entries.some((e) => e.status === "current") ? Math.round(q.avgMinutes / 2) : 0;
  return { position: idx + 1, minutes: currentRemaining + idx * q.avgMinutes };
}
