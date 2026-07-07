# CLAUDE.md — guide du projet Seha (صحة)

Guide pour tout agent/développeur travaillant sur ce dépôt. Lire en premier.

## 1. Le produit

**Seha (صحة, « santé »)** — plateforme tunisienne de santé, façon Doctolib mais
plus large : **le système d'exploitation de la santé tunisienne**. Elle relie
patients ↔ médecins ↔ cliniques ↔ laboratoires ↔ pharmacies, et fournit aux
soignants un **logiciel SaaS** pour gérer leur activité (agenda, dossiers,
caisse, file d'attente).

- **Nom** : *Seha* = « santé » en arabe — nom **générique** volontaire (couvre
  tout le produit, pas seulement « le médecin »). Décliné en **Seha Pro**
  (médecins), **Seha Clinique**, **Seha Labo**, **Seha Plus** (premium).
- **Domaine cible** : `seha.tn` (à réserver).
- **Déploiement** : Vercel. Repo GitHub : `benabdallahala4-stack/Seha`.
  Branche de travail : **`main`** (pousser directement sur main).

## 2. Démarrer

```bash
npm install
npm run dev      # http://localhost:3000  (mode local, sans base)
npm run build    # build de production (doit toujours passer avant push)
docker compose up --build   # stack complète front+API+Postgres
```

## 3. Architecture (résumé — détails dans docs/ARCHITECTURE.md)

- **Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS 3**.
- **Hybride** : marche **sans base** (démo, `localStorage`) OU **avec base**
  (mode cloud dès que `DATABASE_URL` est défini). Les routes API renvoient 503
  sans base ; le front bascule en local.
- **Prisma 6** (⚠️ *pas* Prisma 7 — il casse le schéma) + PostgreSQL.
- **Sessions** : cookie HttpOnly signé HMAC (`seha_session`), pas de lib JWT.
- **Auth** : OTP SMS (démo : code affiché à l'écran) + Google (NextAuth, opt-in).
- **IA** : `@anthropic-ai/sdk` (réponses Q&A).
- **Rôles/accès** : voir `src/lib/roles.ts`, `RoleGuard`, docs/ROLES.md.

## 4. Ce qui existe déjà (inventaire)

Patients : recherche praticiens (spécialité/ville/**filtre CNAM, tiers payant,
télé**, géoloc), profils riches (bio, langues, tarifs, avis Google/vérifiés,
réseaux, Maps, Calendly), réservation 7 j (cabinet/**téléconsultation Jitsi**),
**dossier médical** (upload + partage par code), **questions publiques + réponse
IA**, **Magazine Santé** (articles SEO), pharmacies de garde, laboratoires,
médicaments + géoloc, file d'attente, **CNAM & remboursement** (page `/cnam` +
estimateur), Mon compte, PWA installable.

Pros : **Seha Pro dashboard** (agenda, dossiers patients, ordonnances, caisse,
file d'attente, stats), **back-office clinique** (devis, tourisme médical
libyen, praticiens), **espace labo** (dépôt résultats), **admin** (vérif
inscriptions, invitations, modération), abonnement (passerelles TN) + **Seha
Plus**.

Voir `docs/FEATURES.md`, `docs/GROWTH.md`, `docs/COMPETITORS.md`.

## 5. 🌍 Politique de langue & traduction — RÈGLE STRICTE

Le site est **bilingue** : **français (défaut)** + **العربية (arabe)** avec
**mise en page RTL complète**. Bascule via le bouton FR/العربية de l'en-tête
(pas de thème clair/sombre — uniquement la langue).

> **RÈGLE : tout texte visible par l'utilisateur DOIT exister en français ET en
> arabe. Ne jamais livrer une chaîne uniquement en français.** Un ajout non
> traduit est un bug.

Deux façons de traduire (les deux coexistent dans le code) :

1. **Clés i18n** — `src/lib/i18n.tsx` : `"cle": { fr: "…", ar: "…" }`, appelées
   via `t("cle")`. À privilégier pour l'UI partagée (nav, cartes, footer…).
2. **Inline bilingue** — dans une page : `locale === "ar" ? "نص" : "texte"`
   (ou `const fr = locale === "fr"`). Toujours fournir les deux langues.

Checklist avant de committer un écran :
- [ ] Chaque libellé, titre, bouton, placeholder, message, `alt` a sa version AR.
- [ ] Le contenu s'affiche correctement en **RTL** (flèches inversées si besoin).
- [ ] Les tarifs : « DT » ↔ « د.ت ».

### Articles en dialecte (stratégie de contenu — à venir)

Le **Magazine Santé** (`src/lib/articles.ts`) est aujourd'hui FR + arabe
standard. **Piste de croissance** : proposer certains articles aussi en
**dialecte tunisien (derja), libyen et algérien** — l'arabe dialectal parle
bien plus directement au grand public du Maghreb et élargit l'audience
(Libyens = cible clé pour le tourisme médical des cliniques).
- Modèle possible : variantes `bodyDerjaTn`, `bodyLy`, `bodyDz` optionnelles
  sur un article, avec un sélecteur de « ton » (arabe standard / tunisien /
  libyen / algérien). L'arabe standard reste le défaut.
- Non encore implémenté — documenté ici pour ne pas l'oublier.

## 6. Design system

- **Couleur** : palette `primary` = **bleu azur médical** (voir
  `tailwind.config.ts`, 50→900). Tout passe par `primary-*`. Accent **rouge
  tunisien** (`accent`, `#e70013`).
- **Vert `emerald` = sémantique** (succès / vérifié / disponible / remboursé) —
  **ne pas** le remplacer par du bleu ; c'est distinct de la marque.
- **Typo** : **serif système** (`font-serif`) pour les grands titres. Pas de
  webfont (CSP/offline).
- **Pas de bouton de thème** clair/sombre — uniquement FR/AR.
- **Logo** : croix-jasmin + tracé ECG rouge (`public/logo.svg`, `icon.svg`).
- Animations via `Reveal`/`CountUp`, neutres si `prefers-reduced-motion`
  (le contenu reste visible — base `opacity:1`).

## 7. Conventions & garde-fous

- **Pousser sur `main`** ; build vert obligatoire avant push. Vérifier
  visuellement les changements d'UI (Chromium headless disponible).
- Messages de commit : finir par `Co-Authored-By:` + `Claude-Session:`.
- **Ne jamais** mettre l'identifiant de modèle dans un artefact du repo
  (commits, PR, commentaires) — chat uniquement.
- Clés `localStorage` préfixées `seha.*` ; cookie `seha_session` ; DB/volume
  Docker `seha`.
- **CNAM/assurance** : logique dans `src/lib/insurance.ts` (tarifs de référence
  **approximatifs** — toujours afficher un disclaimer ; APCI = 100 %).
- Ne pas créer de PR sauf demande explicite.

## 8. Plan / feuille de route (voir docs/FEATURES.md)

- **Sécurité prod** : revalider `session.role` côté serveur dans chaque route
  API pro ; vraie passerelle SMS ; rate limiting ; RGPD/données de santé.
- **Paiement** abonnements via passerelle tunisienne agréée.
- **Contenu** : articles en dialectes TN/LY/DZ (voir §5).
- **Photo hero réelle** : remplacer `public/illustrations/hero-care.svg`.
- **App mobile** : PWA → APK/AAB via PWABuilder (TWA).
- Tests e2e des parcours critiques (réservation, annulation, accès pro refusé).
