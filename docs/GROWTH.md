# Tabibi — Stratégie de croissance, position concurrentielle et cadre légal

## 1. Où sommes-nous meilleurs que med.tn ?

| Domaine | Avantage Tabibi |
|---|---|
| Téléconsultation | Salle vidéo intégrée à chaque RDV (Jitsi) — med.tn ne l'affiche pas |
| Dossier patient | Le patient possède son dossier, le partage par code, les labos y déposent les résultats |
| Outillage cabinet | Caisse (impayés, CNAM), file d'attente temps réel, suivis, messagerie, stats — leur outillage visible est bien plus léger |
| Cliniques & international | Fiches cliniques, devis en ligne, guichet international (Libye/Algérie) |
| Arabe | Interface 100 % bilingue FR/AR avec RTL — med.tn est essentiellement francophone |
| Avis | Avis vérifiés (réservation obligatoire) → confiance ; leurs avis sont ouverts |
| Anti-surréservation | Garantie par la base de données (contrainte unique) |
| Pharmacies | Nous ciblons les **gardes** (besoin aigu) avec filtres jour/nuit/24h |

## 2. Où devons-nous encore progresser ?

1. **Volume de contenu** : leur magazine a des années d'articles signés par de vrais praticiens ; notre magazine doit publier ~2 articles/semaine avec signatures réelles.
2. **Profondeur d'annuaire** : 3 000 médecins actifs chez eux vs notre seed — c'est LE chantier (voir §5).
3. **Granularité quartier** (SEO) : leurs pages descendent au quartier ; à activer quand la densité le justifie.
4. **Apps natives + notoriété** : ils sont sur les stores depuis des années ; notre PWA→TWA doit sortir vite.
5. **Réseau et capital** : ils sont adossés à un assureur ; chercher un partenaire institutionnel (assurance, opérateur télécom, banque).

## 3. Sommes-nous légalement protégés face à eux ?

**Principes (à valider avec un avocat tunisien — ceci n'est pas un conseil juridique) :**

- ✅ **S'inspirer de fonctionnalités est licite** : les idées et fonctionnalités (prise de RDV, Q&A, annuaire) ne sont pas protégeables en soi. Doctolib, med.tn et des dizaines d'autres partagent le même modèle.
- ✅ **Notre exécution est propre** : nom, logo, code, textes, articles et données de démonstration sont 100 % originaux — aucune copie de leur design, de leurs textes ou de leurs images.
- ⚠️ **À ne jamais faire** : scraper/copier leur base de praticiens ou leurs avis (concurrence déloyale + droit sui generis des bases de données), copier leurs articles, utiliser « med » dans notre marque d'une façon qui crée la confusion.
- 🔒 **À faire pour NOUS protéger** :
  1. **Déposer la marque « Tabibi » (+ logo)** à l'**INNORPI** (classes 35, 38, 42, 44) — priorité absolue avant tout marketing.
  2. Réserver les domaines tabibi.tn / .com et les réseaux sociaux.
  3. Rédiger CGU/CGV + politique de confidentialité + contrat praticien (avocat).
  4. **Déclaration INPDP** (loi 2004-63) avant de traiter de vraies données de santé.
  5. Vérifier le cadre de la **télémédecine** (décret 2020 et textes CNOM) et les règles déontologiques sur la communication des médecins (pas de publicité comparative, réponses Q&A informatives uniquement).
  6. Contrats écrits avec cliniques/labos partenaires.

## 4. Comment attirer les médecins ? (implémenté ✅)

**Modèle freemium avec fonctionnalités verrouillées visibles :**
- **Gratuit (0 DT)** : profil vérifié + agenda (20 RDV/mois) + 50 dossiers + **réponses aux questions publiques** — le médecin gagne en visibilité sans rien payer.
- Dans son espace, les onglets Caisse, Messagerie, Suivis, File d'attente, Dossier partagé et Statistiques apparaissent **🔒 verrouillés** avec un argumentaire et un bouton « Débloquer » → conversion naturelle.
- Le **Q&A public est l'appât principal** (le levier med.tn : « 8 millions de vues sur les réponses ») : chaque réponse = visibilité + bouton « Prendre RDV » vers son agenda.

**Autres leviers d'acquisition praticiens :**
- Bouton « **Revendiquez ce profil** » sur chaque fiche pré-remplie (implémenté ✅).
- Onboarding 2 minutes (`/pro/inscription`, implémenté ✅) + appel de bienvenue + formation 15 min.
- Programme de parrainage : 1 mois offert par confrère parrainé.
- Ambassadeurs par spécialité/région ; partenariats avec les **syndicats de médecins libéraux** et associations de spécialités ; présence aux congrès médicaux (JNMG, congrès de cardiologie…).
- Argument différenciant vs med.tn : « tout votre cabinet (caisse, file, dossiers), pas seulement un annuaire ».

**Prix med.tn ?** Non publics — modèle « essai des fonctionnalités Med Pro puis Premium » vendu par contact commercial. Notre grille publique transparente (0/89/179/299 DT) est en soi un avantage : les médecins tunisiens se plaignent partout des prix opaques.

## 5. Collecter médecins, cliniques et labos dans toute la Tunisie

**Phase A — Amorçage de l'annuaire (sans scraper les concurrents) :**
| Source | Contenu | Mode |
|---|---|---|
| CNOM (Conseil de l'Ordre des Médecins) | Registre officiel des médecins autorisés | Demande de partenariat / listes publiques |
| Ministère de la Santé / DPM | Cliniques et labos autorisés (arrêtés publiés) | Données publiques (JORT) |
| CNAM | Listes des conventionnés | Partenariat |
| CNOPT / medicapp | Pharmacies + gardes | Partenariat officiel |
| Pages Jaunes / annuaires téléphoniques publics | Coordonnées de cabinets | Saisie/vérification manuelle |
| Terrain | Vérification par appels + visites | Équipe d'onboarding |

Chaque fiche amorcée est marquée « non revendiquée » → le praticien la **revendique gratuitement** (flux implémenté). C'est exactement la stratégie qui a fait Doctolib et Google Business.

**Phase B — Machine de terrain :**
- 2-3 « **city launchers** » (Tunis, Sfax, Sousse) payés à l'activation de profils.
- Objectif : 300 profils revendiqués en 6 mois, dont 10 % convertis en payant.
- Cliniques : approche directe des directions (l'argument = devis internationaux entrants).
- Labos : l'argument = dépôt des résultats dans le dossier patient (fidélisation).

**Phase C — Effet réseau :**
- Chaque question publique sans réponse dans une spécialité/région = e-mail d'invitation aux médecins concernés non inscrits (« Un patient de Sfax attend une réponse en cardiologie »).
- Les patients invitent leur médecin (« Invitez votre médecin sur Tabibi » + lien de parrainage).
