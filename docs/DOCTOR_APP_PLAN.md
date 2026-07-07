# Seha Pro — plan de l'application médecin (le cœur du revenu)

## 0. Thèse

En Tunisie, **le patient paie rarement un logiciel** — mais **le médecin, oui**,
s'il lui fait gagner du temps et de l'argent. Aujourd'hui la majorité des
cabinets tournent encore sur **Excel + Word + agenda papier + WhatsApp**.
**Seha Pro remplace tout ça** par un outil unique, bilingue, pensé pour le
contexte tunisien (CNAM, dinar, espèces, ordonnance papier remise en main).

- **Médecins & cliniques = le produit payant** (abonnement mensuel).
- **Patients = acquisition gratuite** : le grand public (recherche, RDV, dossier,
  CNAM) reste gratuit et alimente le carnet des médecins → qui deviennent
  dépendants de l'outil → qui s'abonnent.
- **Stratégie freemium** : **toutes** les fonctions Pro/Premium sont **visibles
  mais verrouillées** (cadenas + « Passer à Pro »). On vend en montrant, pas en
  cachant.

---

## 1. Les besoins quotidiens d'un médecin tunisien (ce qu'on remplace)

| Aujourd'hui (Excel/Word/papier) | Dans Seha Pro |
|---|---|
| Agenda papier / appels | **Agenda** cabinet + téléconsultation, RDV en ligne 24/7 |
| Fichier Excel des patients | **Registre patients** (fiche complète, recherche, historique) |
| Notes Word par patient | **Dossier médical** : motifs, antécédents, allergies, mesures |
| Ordonnance manuscrite | **Ordonnancier** : DCI + médicaments tunisiens, imprimable, en-tête |
| Certificats Word | **Certificats** : arrêt de travail, aptitude sport, présence… (modèles) |
| Cahier de caisse | **Caisse** : recettes/jour, impayés, espèces/carte/CNAM, export |
| Bulletins CNAM à la main | **Bulletin de soins** pré-rempli (patient, acte, tarif de référence) |
| Rappels par WhatsApp manuel | **Rappels auto** SMS + WhatsApp (FR/AR) — moins de lapins |
| Rien | **File d'attente** temps réel (le patient voit sa position) |
| Rien | **Statistiques** : remplissage, nouveaux patients, revenus |

**Principe UX** : chaque écran fait gagner du temps en **≤ 3 clics**, fonctionne
sur **mobile** (beaucoup de médecins n'ont pas de PC au cabinet), imprime en **FR
+ AR**, et marche **hors-ligne** pour l'essentiel (PWA).

---

## 2. Fonctionnalités spécifiques à la Tunisie (nos différenciateurs)

1. **CNAM natif** : conventionnement affiché, **bulletin de soins** généré,
   patients **APCI** (100 %) suivis, tarifs de référence.
2. **Ordonnance conforme** : DCI + noms commerciaux tunisiens (base **DPM**),
   posologie, durée ; imprimée et **remise en main propre** (Seha n'émet aucun
   document médical en ligne — trace uniquement).
3. **Certificats tunisiens** : arrêt de travail, aptitude, présence, bonne santé
   — modèles conformes, remis au cabinet.
4. **Espèces d'abord** : caisse pensée pour le cash (dominant), + carte + CNAM
   tiers payant ; suivi des **impayés**.
5. **WhatsApp** : canal n°1 en Tunisie — rappels, résumé de RDV, résultats.
6. **Bilingue FR/AR** partout, y compris à l'impression (nom patient en arabe).
7. **Secrétaire** : compte assistant qui gère l'agenda et la caisse (rôle dédié).
8. **Multi-cabinet** : un médecin exerce souvent sur plusieurs sites/villes.
9. **Vérification Ordre** : n° d'inscription au **Conseil de l'Ordre** →
   badge « médecin vérifié » (confiance patient + anti-fraude).

---

## 3. Paliers d'abonnement (toujours visibles, verrouillés selon le plan)

### 🆓 Gratuit (freemium — l'hameçon)
- Profil public + référencement dans la recherche Seha.
- **RDV en ligne** (plafonné, ex. 30 RDV/mois) + agenda de base.
- Registre patients **limité** (ex. 50 fiches).
- **10 rappels SMS/mois**.
- Toutes les fonctions Pro/Premium **affichées mais verrouillées** 🔒.

### ⭐ Pro (le cœur de cible — la majorité des médecins)
- Agenda, RDV **illimités** ; patients **illimités**.
- **Dossier médical** complet + historique.
- **Ordonnances + certificats** (modèles, impression FR/AR, en-tête perso).
- **Caisse** + impayés + statistiques de base.
- **Rappels SMS + WhatsApp illimités**.
- **Bulletin de soins CNAM**.
- **File d'attente** temps réel.

### 💎 Premium (gros cabinets, cliniques, multi-site)
- **Téléconsultation** intégrée (vidéo + paiement en ligne).
- **Analytics avancés** (cohortes, prévision de revenus, taux de présence).
- **Multi-cabinet + multi-praticien + comptes secrétaire**.
- **Export comptable** (expert-comptable, TVA) + rapprochement.
- **En-tête & branding** personnalisés, support prioritaire.
- **Intégrations** : import auto des **résultats labo**, sync **Calendly**, API.
- **Marketing** : rappels de suivi, campagnes de prévention.

> Tarification indicative (à valider) : Gratuit 0 DT · Pro ~**39–59 DT/mois** ·
> Premium ~**99–149 DT/mois**. Paiement via passerelle tunisienne agréée
> (e-Dinar / carte) + option virement / D17.

---

## 4. Données publiques tunisiennes exploitables

| Source | Ce qu'on en tire | Statut |
|---|---|---|
| **DPM** (Direction de la Pharmacie et du Médicament, dpm.tn) | Registre officiel des médicaments : **DCI, dosage, forme, prix réglementés, AMM** — base de l'ordonnancier + prix | Données publiques ; **images de boîtes = incertain** (souvent absentes → à photographier / partenariat fabricants/PCT) |
| **CNAM** (cnam.nat.tn) | Liste **APCI**, **tarifs de référence**, médicaments remboursables (vignette), format bulletin de soins | Public (documents/arrêtés) |
| **Conseil de l'Ordre des Médecins** (ordre-medecins.org.tn) | **Vérification** du n° d'inscription → badge « vérifié » | Annuaire public consultable |
| **Ordre des Pharmaciens** | Registre pharmacies + **pharmacies de garde** | Public (rotas régionales) |
| **Ministère de la Santé** (santetunisie.rns.tn) | Établissements, **calendrier vaccinal**, alertes sanitaires, gardes | Public |
| **INS** (ins.tn) | Démographie par gouvernorat (aide au ciblage) | Public (open data) |
| **PCT** (Pharmacie Centrale de Tunisie) | Disponibilité/ruptures de médicaments | Partiellement public |

**Honnêteté** : il n'existe pas toujours d'**API propre** ; certaines sources
demandent du **scraping** encadré ou un **partenariat officiel** (surtout images
de médicaments et données CNAM temps réel). À sécuriser juridiquement avant prod.

---

## 5. Application ADMIN (back-office Seha)

Pour piloter la plateforme et **encaisser** :
- **Vérification médecins** : contrôle du n° Ordre, pièces, activation du profil.
- **Abonnements & facturation** : plans, paiements, relances, MRR, churn.
- **Modération** : avis, questions publiques, signalements.
- **Support** : tickets, prise en main à distance.
- **Contenu** : Magazine Santé, ingestion **pharmacies de garde**, alertes.
- **Analytics plateforme** : médecins actifs, RDV, revenus, cohortes de villes.
- **Invitations** : campagnes d'acquisition médecins (demande-driven).

## 6. Application PATIENT (gratuite — l'acquisition)

Reste **gratuite** (c'est le funnel qui nourrit les médecins) :
- Recherche + RDV + rappels, **dossier médical** partageable par code.
- **CNAM** : estimation de remboursement, médecins conventionnés.
- Historique, ordonnances/certificats reçus (trace), questions aux médecins.
- Notifications (RDV, rappels de suivi, résultats labo).

---

## 7. Feuille de route

- **Phase 1 — « Tuer Excel/Word »** : agenda, registre patients, dossier,
  **ordonnancier + certificats imprimables**, caisse, tiering + previews
  verrouillées. → *raison d'abonner n°1.*
- **Phase 2 — CNAM & communication** : bulletin de soins, APCI, rappels
  **SMS/WhatsApp**, rôle **secrétaire**, vérification **Ordre**.
- **Phase 3 — Premium & données** : téléconsultation, analytics, multi-cabinet,
  export comptable ; intégrations **DPM** (médicaments + prix), import labo.
- **Transverse** : app admin (facturation), app patient gratuite, articles en
  dialectes (TN/LY/DZ), sécurité prod (rôles serveur, RGPD santé).
