# Rôles, accès & comptes de test

Seha distingue **cinq rôles**. Les espaces professionnels (agenda praticien,
back-office clinique, dépôt laboratoire, administration) ne sont **jamais**
accessibles au grand public : ils sont protégés côté client par `RoleGuard`
(démo) et devront l'être côté serveur en production (voir plus bas).

## Comptes de test

En mode démo, la « connexion » consiste à choisir un rôle sur **`/connexion`**
(aucun mot de passe : le rôle est stocké dans le `localStorage`). En mode cloud,
ces mêmes comptes sont semés en base par `prisma/seed.mjs` et se connectent par
**OTP SMS** sur leur numéro.

| Rôle | Compte | Téléphone (OTP) | Redirigé vers | Peut faire |
|------|--------|-----------------|---------------|------------|
| **Patient** | Yasmine Gharbi | `+216 20 000 001` | `/mes-rdv` | Réserver, gérer son dossier médical, ses documents et ses RDV |
| **Médecin** | Dr Amine Ben Salah | `+216 20 000 002` | `/pro/dashboard` | Agenda, dossiers patients, caisse, file d'attente, réponses aux questions publiques |
| **Clinique** | Clinique Carthage Internationale | `+216 71 000 003` | `/clinique-admin` | Demandes de devis, praticiens rattachés, statistiques internationales |
| **Laboratoire** | Laboratoire Ibn Sina | `+216 71 000 004` | `/labo` | Déposer les résultats d'analyses dans le dossier du patient |
| **Administration** | Équipe Seha | `+216 20 000 009` | `/admin` | Vérifier les inscriptions, inviter des médecins, modérer |

> Source de vérité des comptes : [`src/lib/roles.ts`](../src/lib/roles.ts)
> (`MOCK_USERS`) et [`prisma/seed.mjs`](../prisma/seed.mjs).

## Matrice d'accès

Chaque espace protégé autorise une liste de rôles (constante `ACCESS` dans
[`src/lib/roles.ts`](../src/lib/roles.ts)) :

| Route | Rôles autorisés | Public ? |
|-------|-----------------|----------|
| `/`, `/recherche`, `/medecin/*`, `/questions`, `/cliniques`, `/laboratoires`, `/pharmacies`, `/medicaments`, `/sante`, `/attente` | tous | ✅ oui |
| `/mes-rdv`, `/dossier`, `/compte` | patient (session) | 🔓 session patient |
| `/pro`, `/pro/tarifs` | tous (vitrine commerciale) | ✅ oui |
| **`/pro/dashboard`** | `medecin`, `admin` | 🔒 non |
| **`/clinique-admin`** | `clinique`, `admin` | 🔒 non |
| **`/labo`** | `labo`, `medecin`, `admin` | 🔒 non |
| **`/admin`** | `admin` | 🔒 non |

Le pied de page public ne renvoie donc **plus** vers les espaces professionnels :
il propose un unique point d'entrée **« 🔒 Connexion professionnels »**
(→ `/connexion`).

## Comment ça marche (démo → production)

**Démo (par défaut, sans base de données)**

1. `/connexion` liste les comptes de test. Un clic appelle `loginAs(user)` :
   la session (`{ key, role, name, home }`) est écrite dans `localStorage`
   (`seha.session`).
2. Chaque page protégée appelle `useRoleGate(allow: Role[])` **en tout premier
   hook**. Le hook :
   - affiche un écran de chargement le temps de lire la session ;
   - si le rôle n'est pas autorisé, affiche un écran « Accès réservé » avec des
     liens vers `/connexion` et `/` ;
   - sinon retourne `null` et la page s'affiche, coiffée d'une `SessionBar`
     (« Connecté : … · Déconnexion »).

**Production (mode cloud)**

Le contrôle d'accès **client seul ne suffit pas** : il empêche l'affichage mais
pas l'appel réseau. En production :

- le rôle est porté par le compte (`User.role`, défaut `patient`, migration
  `0002_user_role`) ;
- l'identité provient d'une **session signée (HMAC HttpOnly)** posée après OTP ;
- **chaque route API** d'un espace pro doit revalider `session.role` avant de
  répondre (à faire lors du branchement des API pro sur la base) ;
- `useRoleGate` reste utile pour l'expérience (redirection propre), mais la
  décision qui compte est côté serveur.

## Ajouter / modifier un rôle

1. Étendre le type `Role` et `ROLE_LABELS` dans `src/lib/roles.ts`.
2. Ajouter l'entrée dans `MOCK_USERS` (et dans `prisma/seed.mjs` pour le cloud).
3. Déclarer les routes protégées dans `ACCESS`.
4. Sur chaque page concernée : `const gate = useRoleGate([...]); if (gate) return gate;`
   (placé **après** tous les autres hooks, **avant** le rendu principal).
