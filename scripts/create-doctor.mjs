// Crée (ou met à jour) un compte de test avec un rôle donné.
// Par défaut : un médecin « super-utilisateur » (rôle admin = accès à TOUS les
// espaces protégés) pour tester l'application de bout en bout.
//
// Usage (nécessite DATABASE_URL, ex. via docker compose ou .env) :
//   node scripts/create-doctor.mjs
//   DOCTOR_EMAIL=dr@seha.tn DOCTOR_PASSWORD='MonPass123' DOCTOR_ROLE=medecin \
//     node scripts/create-doctor.mjs
//
// Rôles possibles : patient | medecin | secretaire | clinique | labo | admin
// « admin » a toutes les permissions (autorisé sur chaque espace).

import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "crypto";

// Même format que src/lib/password.ts : scrypt$<sel base64>$<hash base64>
function hashPassword(plain) {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

const email = (process.env.DOCTOR_EMAIL ?? "docteur@seha.tn").toLowerCase();
const password = process.env.DOCTOR_PASSWORD ?? "Docteur2026!";
const name = process.env.DOCTOR_NAME ?? "Dr Test Seha";
const role = process.env.DOCTOR_ROLE ?? "admin";

const db = new PrismaClient();

const user = await db.user.upsert({
  where: { email },
  update: { role, name, passwordHash: hashPassword(password) },
  create: { email, name, role, passwordHash: hashPassword(password) },
  select: { id: true, email: true, name: true, role: true },
});

console.log("[seha] Compte prêt :", user);
console.log("[seha] Connexion   :", email, "/", password);
await db.$disconnect();
