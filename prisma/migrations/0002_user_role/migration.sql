-- Ajout du rôle utilisateur (patient | medecin | clinique | labo | admin)
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'patient';
