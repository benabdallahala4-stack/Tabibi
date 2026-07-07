// Seed des comptes de test (rôles). Exécuté au démarrage Docker :
//   npx prisma migrate deploy && node prisma/seed.mjs && npm run start
// Idempotent (upsert par téléphone).

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const USERS = [
  { phone: "+21620000001", name: "Yasmine Gharbi", role: "patient" },
  { phone: "+21620000002", name: "Dr Amine Ben Salah", role: "medecin" },
  { phone: "+21620000005", name: "Amira Sassi (secrétaire)", role: "secretaire" },
  { phone: "+21671000003", name: "Clinique Carthage Internationale", role: "clinique" },
  { phone: "+21671000004", name: "Laboratoire Ibn Sina", role: "labo" },
  { phone: "+21620000009", name: "Équipe Seha", role: "admin" },
];

async function main() {
  for (const u of USERS) {
    await db.user.upsert({
      where: { phone: u.phone },
      create: u,
      update: { name: u.name, role: u.role },
    });
  }
  console.log(`[seha] Seed : ${USERS.length} comptes de test prêts.`);
}

main()
  .catch((e) => {
    console.error("[seha] Échec du seed :", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
