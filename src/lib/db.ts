// Client Prisma (singleton) — actif uniquement si DATABASE_URL est défini.
// Sans base de données, les routes API répondent 503 et le front bascule
// automatiquement en mode local (localStorage).

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function dbConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

export function getDb(): PrismaClient {
  if (!dbConfigured()) {
    throw new Error("DATABASE_URL non défini");
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
