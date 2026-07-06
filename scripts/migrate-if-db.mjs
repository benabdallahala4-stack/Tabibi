// Applique les migrations Prisma au build UNIQUEMENT si DATABASE_URL est
// défini (sur Vercel : après avoir connecté Neon/Postgres). Sans base de
// données, le build continue et le site fonctionne en mode local.
import { execSync } from "node:child_process";

if (process.env.DATABASE_URL) {
  console.log("[tabibi] DATABASE_URL détecté — prisma migrate deploy…");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} else {
  console.log("[tabibi] Pas de DATABASE_URL — migrations ignorées (mode local).");
}
