// Utilitaires HTTP côté serveur.

/** Origine publique du site (schéma + hôte), en tenant compte des proxys
 *  (Vercel, Caddy…). Surchargée par SITE_URL si défini. */
export function siteOrigin(req: Request): string {
  const h = new Headers(req.headers);
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return process.env.SITE_URL ?? `${proto}://${host}`;
}
