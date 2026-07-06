# Tabibi — Analyse des fonctionnalités Doctolib & adaptation à la Tunisie

Ce document recense les fonctionnalités de Doctolib (référence du marché français/européen), indique ce qui est couvert par le MVP Tabibi et trace la feuille de route, avec les adaptations propres au marché tunisien.

## 1. Fonctionnalités Doctolib — côté patient

| Fonctionnalité Doctolib | Description | Statut Tabibi |
|---|---|---|
| Recherche de praticiens | Par spécialité, nom, établissement et localisation | ✅ MVP (spécialité, nom, ville) |
| Prise de RDV en ligne 24h/24 | Créneaux en temps réel, confirmation instantanée | ✅ MVP (créneaux de démo) |
| Profil praticien | Tarifs, conventionnement, formation, langues, accès, avis | ✅ MVP |
| Gestion des RDV | Consulter, déplacer, annuler ses rendez-vous | ✅ MVP (consulter/annuler) — 🔜 déplacement |
| Rappels automatiques | SMS + e-mail avant chaque rendez-vous | 🔜 Roadmap (nécessite backend + passerelle SMS) |
| Téléconsultation vidéo | Consultation à distance avec paiement en ligne | 🟡 MVP (choix du type de RDV) — 🔜 visio réelle |
| Compte patient | Identité, proches (enfants, parents), historique | 🔜 Roadmap |
| Documents médicaux | Partage sécurisé ordonnances, résultats, comptes rendus | 🔜 Roadmap |
| Messagerie patient-praticien | Questions non urgentes, suivi | 🔜 Roadmap |
| Ordonnance numérique | Délivrée après téléconsultation | 🔜 Roadmap |
| Liste d'attente / alerte créneau | Notification si un créneau plus tôt se libère | 🔜 Roadmap |
| Application mobile | iOS / Android | 🔜 Roadmap (PWA d'abord) |

## 2. Fonctionnalités Doctolib — côté praticien (Doctolib Pro)

| Fonctionnalité Doctolib | Description | Statut Tabibi |
|---|---|---|
| Agenda en ligne | Gestion multi-praticiens, motifs de consultation, règles de créneaux | 🟡 Vitrine Pro — 🔜 vrai back-office |
| Réduction des no-shows | Rappels automatiques, confirmation patient | 🔜 Roadmap |
| Gestion de la patientèle | Fiches patients, historique, notes | 🔜 Roadmap |
| Téléconsultation intégrée | Visio sécurisée + facturation | 🔜 Roadmap |
| Dossier patient / logiciel médical | Depuis 2025 : documentation clinique, classement OCR des documents, codage assisté par IA | 🔜 Vision long terme |
| Assistant téléphonique IA | Prise d'appels et de RDV automatisée | 🔜 Vision long terme |
| Statistiques du cabinet | Taux de remplissage, nouveaux patients, annulations | 🔜 Roadmap |
| Interopérabilité | Synchronisation logiciels métiers, agenda externe | 🔜 Vision long terme |

## 3. Adaptations spécifiques à la Tunisie

- **CNAM** : badge « Conventionné CNAM » sur les profils (fait ✅) ; à terme, filière de soins (APCI, remboursement) et tiers payant.
- **Bilinguisme** : interface française d'abord (usage dominant dans la santé), libellés arabes présents (fait ✅) ; à terme, bascule complète FR/AR avec RTL.
- **Tarifs en dinar tunisien (DT)** affichés dès le MVP ✅.
- **Paiement en ligne** : intégration e-Dinar, cartes locales (SMT/Monétique Tunisie), ou paiement au cabinet.
- **SMS d'abord** : taux de pénétration smartphone/e-mail variable → rappels par SMS via opérateurs locaux (Ooredoo, Orange, Tunisie Télécom).
- **Couverture des 24 gouvernorats** avec attention aux zones sous-dotées ; téléconsultation comme levier d'accès aux soins pour l'intérieur du pays.
- **Diaspora** : les Tunisiens à l'étranger peuvent réserver pour leurs proches ou pour leurs séjours au pays (fuseaux horaires, paiement international).
- **Cadre réglementaire** : conformité loi tunisienne n° 2004-63 sur la protection des données personnelles + INPDP ; hébergement des données de santé à définir avec les autorités (à instruire avant tout lancement réel).

## 4. Fonctionnalités premium (monétisation)

### Tabibi Plus (patients) — abonnement mensuel ou à l'acte
- **Alerte créneau prioritaire** : notification immédiate quand un créneau plus tôt se libère.
- **Profils famille** : gérer les rendez-vous des enfants et des parents âgés depuis un seul compte.
- **Coffre-fort santé** : stockage sécurisé d'ordonnances, analyses et carnets de vaccination.
- **Téléconsultation illimitée** à tarif réduit avec un réseau de généralistes partenaires.
- **Support prioritaire** et rappels multi-canaux (SMS + WhatsApp + e-mail).

### Tabibi Pro (praticiens) — 3 paliers
| | Essentiel | Avancé | Premium |
|---|---|---|---|
| Agenda + réservation en ligne | ✅ | ✅ | ✅ |
| Rappels SMS/e-mail illimités | — | ✅ | ✅ |
| Téléconsultation + paiement en ligne | — | ✅ | ✅ |
| Statistiques du cabinet | — | ✅ | ✅ |
| Mise en avant dans la recherche | — | — | ✅ |
| Synchro Calendly / Google Agenda | — | ✅ | ✅ |
| Synchro avis Google (API Places) | — | — | ✅ |
| Widget de réservation pour son propre site | — | — | ✅ |
| Multi-assistants / secrétariat | — | — | ✅ |

Modèle : gratuit pour les patients (hors Plus), abonnement praticien — même logique que Doctolib (~139 €/mois en France, à adapter au pouvoir d'achat tunisien, ex. 89–299 DT/mois).

## 5. Intégrations tierces

- **Jitsi Meet** (fait ✅) : salles vidéo gratuites et chiffrées pour la téléconsultation, sans compte ni clé API. Migration possible vers une instance auto-hébergée (`meet.tabibi.tn`) pour la confidentialité médicale.
- **Calendly** (fait ✅) : chaque praticien peut renseigner `calendlyUrl` ; son agenda Calendly s'affiche alors en widget sur son profil. Une synchro bidirectionnelle (API Calendly v2) est prévue pour le palier Avancé.
- **Google Maps** (fait ✅) : carte embarquée sans clé API + lien direct vers la fiche Google Maps du cabinet.
- **Avis Google** (partiel 🟡) : avis de démonstration affichés ; la synchro en direct nécessite l'API **Google Places Details** (clé facturée par Google, ~17 $/1000 requêtes) — champ `googleReviews` prêt à brancher.
- **Connexion Google** (scaffold ✅) : NextAuth est en place ; il suffit de définir `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` et `NEXTAUTH_SECRET` (voir README) pour activer le bouton. Sans ces variables, le site fonctionne en mode invité.

## 6. Mobile

- **PWA** (fait ✅) : manifest + service worker → « Ajouter à l'écran d'accueil » sur Android/iOS, icône, plein écran, cache hors-ligne de secours.
- **APK Android** (🔜) : générer une TWA (Trusted Web Activity) à partir de l'URL de production via [PWABuilder](https://www.pwabuilder.com) ou Bubblewrap — nécessite le SDK Android et l'URL déployée. App native (React Native/Capacitor) envisagée en V4 si besoin de notifications push riches.

## 7. Feuille de route proposée

1. **V0 (ce dépôt)** — vitrine + parcours de réservation complet en données de démonstration, stockage local.
2. **V1 — Backend réel** : API (NestJS/Express + PostgreSQL), comptes patients (téléphone + OTP SMS), agenda praticien réel, rappels SMS/e-mail.
3. **V2 — Espace Pro** : back-office praticien (gestion agenda, motifs, patientèle), avis vérifiés, statistiques.
4. **V3 — Téléconsultation** : visio WebRTC, paiement en ligne, ordonnance numérique.
5. **V4 — Écosystème** : app mobile, arabe/RTL complet, messagerie sécurisée, documents médicaux, liste d'attente intelligente.

## 8. Sources de l'analyse Doctolib

- [SelectHub — Doctolib Pro Reviews 2026](https://www.selecthub.com/p/patient-scheduling-software/doctolib-pro/)
- [Capterra — Doctolib](https://www.capterra.com/p/184480/Doctolib/)
- [GetApp — Doctolib Pricing & Features](https://www.getapp.com/healthcare-pharmaceuticals-software/a/doctolib/)
- [ICT&health — How this platform mastered appointment management](https://www.icthealth.org/news/how-this-platform-mastered-the-art-of-appointment-management)
- [SoftwareSuggest — Doctolib](https://www.softwaresuggest.com/doctolib)
