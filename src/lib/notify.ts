// Notifications navigateur (PWA). Démo : notification locale à la
// confirmation d'un rendez-vous. Production : Web Push (VAPID) envoyé par
// le backend — rappels J-1 et H-2, alertes créneau libéré, réponses du
// médecin (voir docs/ARCHITECTURE.md).

export async function notifyUser(title: string, body: string): Promise<void> {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission !== "granted") return;
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) {
      await reg.showNotification(title, { body, icon: "/icon.svg", badge: "/icon.svg" });
    } else {
      new Notification(title, { body, icon: "/icon.svg" });
    }
  } catch {
    // notifications non disponibles : silencieux
  }
}
