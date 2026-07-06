# Déploiement & exécution locale

Seha fonctionne selon **deux modes**, avec bascule automatique :

- **Mode local** — sans base de données. Rendez-vous et profil dans le
  `localStorage` du navigateur (mono-appareil). Idéal pour une démo rapide.
- **Mode cloud** — dès que `DATABASE_URL` est présent. Comptes (OTP SMS),
  rendez-vous en PostgreSQL, synchronisés entre appareils, anti-surréservation
  garantie par contrainte unique sur le créneau.

---

## 1. Développement rapide (sans base)

```bash
npm install
npm run dev      # http://localhost:3000  (mode local)
npm run build    # build de production
```

---

## 2. Stack complète en local avec Docker (front + API + base)

Un seul `docker compose` lance **PostgreSQL + l'application** (front et routes
API dans le même service Next.js), applique les migrations et sème les comptes
de test.

```bash
cp .env.example .env          # ajustez SESSION_SECRET si besoin
docker compose up --build
# → http://localhost:3000     (mode « cloud » : comptes, RDV multi-appareils)
```

Ce que fait la commande :

| Service | Rôle |
|---------|------|
| `db` | PostgreSQL 16, données persistées dans le volume `seha_pgdata`, `healthcheck` `pg_isready` |
| `web` | Build Next.js (multi-stage `Dockerfile`), puis au démarrage : `prisma migrate deploy` → `node prisma/seed.mjs` → `next start` |

Le service `web` attend que la base soit *healthy* (`depends_on: condition:
service_healthy`) avant de démarrer.

**Commandes utiles**

```bash
docker compose logs -f web        # suivre les logs de l'app
docker compose exec db psql -U seha -d seha   # ouvrir psql
docker compose down               # arrêter (garde les données)
docker compose down -v            # arrêter ET effacer la base
```

**Comptes de test** (semés automatiquement) : voir [`docs/ROLES.md`](ROLES.md).
Connexion démo : page **`/connexion`** → choisir un rôle.

---

## 3. Déploiement Vercel (production managée)

1. **Storage → Create Database → Neon (Postgres)** : Vercel injecte
   `DATABASE_URL`. (Ou une base Neon/Supabase et la variable à la main.)
2. Ajoutez `SESSION_SECRET` (`openssl rand -base64 32`).
3. Redéployez : le build exécute `prisma migrate deploy` (script
   `scripts/migrate-if-db.mjs`, sauté s'il n'y a pas de base).
4. Vérifiez `https://<domaine>/api/health` → `{"db":true,"mode":"cloud"}`.

Variables optionnelles : `GOOGLE_CLIENT_ID/SECRET` + `NEXTAUTH_*` (connexion
Google), `ANTHROPIC_API_KEY` (réponse IA aux questions), `SMS_GATEWAY_URL/TOKEN`
(vrais SMS OTP). Détails dans le [README](../README.md) et `.env.example`.

---

## 4. Checklist « production ready »

Ce qui est **en place** :

- [x] Deux modes (local / cloud) avec bascule automatique et dégradation propre
      (les API renvoient 503 sans base ; le front bascule en local).
- [x] Sessions **HMAC HttpOnly** (aucune dépendance JWT externe).
- [x] Anti-surréservation par **contrainte unique** sur le créneau (`slotKey`).
- [x] Migrations Prisma versionnées + `role` sur `User` (migration `0002`).
- [x] Séparation des rôles côté client (`RoleGuard`) + comptes de test semés.
- [x] Image Docker multi-stage + `docker compose` reproductible.
- [x] Bilingue FR/AR avec RTL, PWA installable, endpoint `/api/health`.

À faire **avant une mise en production réelle** :

- [ ] **Revalider `session.role` dans chaque route API pro** (le garde client ne
      protège que l'affichage — voir [`docs/ROLES.md`](ROLES.md)).
- [ ] Brancher une **vraie passerelle SMS** (Orange/Ooredoo/TT ou agrégateur) et
      retirer l'affichage du code OTP à l'écran.
- [ ] **Rotation des secrets** : `SESSION_SECRET` fort et distinct par
      environnement ; ne jamais committer de `.env`.
- [ ] **Sauvegardes** automatiques de la base (Neon/Supabase les proposent).
- [ ] **Rate limiting** sur `/api/auth/*` et les routes de réservation.
- [ ] Journalisation / supervision (erreurs, latence) et alertes.
- [ ] **RGPD/protection des données de santé** : consentement, durée de
      conservation, chiffrement au repos, registre des traitements.
- [ ] Intégration du **paiement d'abonnement** (passerelle tunisienne agréée)
      pour Seha Pro / Plus.
- [ ] Tests end-to-end sur les parcours critiques (réservation, annulation,
      accès pro refusé).
