# Analyse concurrentielle — marché tunisien de la e-santé

*Mise à jour : juillet 2026. Sources : recherche web (le lien partagé pointe vers une page annuaire « laboratoires d'analyses » de med.tn).*

## 1. Med.tn — le leader 🥇

**Profil.** Fondée en 2017 (Aymen Turki, Issam Bellaj, Emna Jellouli). Levée de **+650 000 $ en 2019 auprès de la première compagnie d'assurance du pays**. Présente en Tunisie, Algérie, Maroc, Turquie, Égypte, Émirats et Sénégal. ~**3 000 médecins actifs**. Applications iOS + Android (« Med »), portail praticien pro.med.tn.

**Fonctionnalités patient :**
| Fonctionnalité | Détail | Seha ? |
|---|---|---|
| Annuaire complet | Médecins **+ pharmacies + laboratoires**, recherche par **géolocalisation / proximité** et par quartier | 🟡 partiel (médecins, cliniques, pharmacies de garde — pas de géoloc) |
| Prise de RDV gratuite | Notifications app à chaque étape | ✅ (sans notifications push) |
| **Questions médicales** | Le patient pose une question **anonyme**, des centaines de médecins répondent, notification à chaque réponse | ❌ **GAP majeur — signature de med.tn** |
| **Med AI** | Réponse IA à une question médicale « en moins d'une minute » | ❌ GAP (notre chatbot est FAQ produit, pas médical) |
| **Base de médicaments** | Données officielles (Direction de la Pharmacie et du Médicament + Pharmacie Centrale) | ❌ GAP |
| Avis | Sur médecins, pharmacies et laboratoires | 🟡 (avis vérifiés médecins uniquement) |
| SEO massif | Pages par spécialité × ville × **quartier** (ex. « laboratoire d'analyses Sidi El Bechir Tunis ») | 🟡 (annuaire spécialité × ville) |

**Fonctionnalités praticien :** gestion des RDV (accepter/refuser/reprogrammer), réponses aux questions médicales (anonymat du patient préservé), annuaire pro.

**Faiblesses observées :**
- Présence quasi nulle sur Trustpilot (1 avis) — la réputation ne verrouille pas le marché.
- Pas (publiquement) de **téléconsultation vidéo intégrée**, ni de **dossier médical patient partageable**, ni de **caisse/gestion de cabinet**, ni de **file d'attente**, ni d'offre **cliniques/devis/international** structurée — tout ce que Seha a déjà.
- Modèle centré sur le Q&A et l'annuaire ; l'outillage « cabinet » semble léger face à notre espace praticien.

## 2. RDV Médecins (rdvmedecins.tn) 🥈

Annuaire + réservation instantanée en ligne : horaires, **honoraires affichés**, avis patients, confirmation immédiate, interface multilingue (URLs EN). Couvre aussi les laboratoires par ville. Moins riche que med.tn ; pression principale sur le SEO local.

## 3. Autres acteurs

- **telemedecine.tn** — téléconsultation et **deuxième avis médical** en ligne.
- **Medicalys / cliniques privées** — tourisme médical (chirurgie esthétique) pour patients étrangers.
- **Doctolib** n'est **pas présent** en Tunisie — la fenêtre reste ouverte.

## 4. Ce que Seha a et que med.tn n'a pas (à mettre en avant)

1. **Téléconsultation vidéo intégrée** (Jitsi) reliée au RDV.
2. **Dossier médical contrôlé par le patient** + partage par code + **portail laboratoire** qui y dépose les résultats.
3. **Espace praticien complet** : caisse (espèces/carte/CNAM, impayés), dossiers, ordonnances/certificats en trace légale, messagerie, suivis, **file d'attente en temps réel**.
4. **Cliniques + demandes de devis** (y compris patients internationaux 🇱🇾).
5. **Arabe intégral avec RTL** (med.tn est principalement FR).
6. **Avis vérifiés** (réservation obligatoire) — plus crédible que des avis ouverts.
7. Pharmacies **de garde** (med.tn liste les pharmacies, pas les gardes).

## 5. Gaps à combler pour attaquer med.tn (priorités)

| Priorité | Fonctionnalité | Pourquoi |
|---|---|---|
| 🔴 P1 | **Questions médicales anonymes** (patient → médecins, publication modérée) | C'est LE moteur d'acquisition et de SEO de med.tn (chaque Q/R = une page indexée) |
| 🔴 P1 | **Réponse IA immédiate** (API Claude) en attendant la réponse du médecin, avec disclaimer et escalade | Réplique « Med AI », différenciable en dialecte tunisien |
| 🟠 P2 | **Base de médicaments** (données Pharmacie Centrale / DPM) avec prix et disponibilité | Trafic récurrent énorme, croise avec les ordonnances du dossier |
| 🟠 P2 | **Géolocalisation** « autour de moi » + pages par quartier | Parité SEO/UX mobile |
| 🟡 P3 | **Notifications push** (PWA) + apps stores | Rétention ; med.tn a l'avantage app native |
| 🟡 P3 | Annuaire élargi : laboratoires et pharmacies **réservables** comme les médecins | Parité annuaire complet |
| 🟢 P4 | Partenariat **assurance** (modèle med.tn : assureur investisseur) et extension Maghreb | Croissance |

## 6. Approfondissement med.tn (scan de juillet 2026)

**Magazine médical** (`blog.med.tn` + `/magazine-medical/<catégorie>`) : articles illustrés classés par zone du corps (santé mentale, peau, cœur, yeux, reins, enfants, santé sexuelle…), signés par des praticiens (gériatre, nutritionniste, chirurgien pédiatre…). Chaque article = une page indexée + un lien vers la prise de RDV → c'est leur moteur SEO. **Réplique Seha : Magazine Santé (`/sante`), articles originaux liés à l'annuaire de chaque spécialité (fait ✅).**

**Pharmacies** : arborescence `/pharmacie/garde/<ville>/<quartier>` avec variantes garde-jour, garde-24/24, ouvertes en journée. **Source des données : le Conseil National de l'Ordre des Pharmaciens (cnopt.tn)**, qui publie la liste officielle des gardes et a lancé sa propre plateforme de géolocalisation (medicapp.tn/cnoptLocalisation). Contact CNOPT : +216 71 795 722. **Réplique Seha : recherche + filtres jour/nuit/24h (fait ✅) ; brancher la liste CNOPT en production.**

**Laboratoires** : entités réservables comme les médecins (`/medecin/laboratoire-danalyses-de-biologie-medicale/<ville>/<quartier>`), avec services, disponibilités en temps réel et consultation des résultats à distance. **Réplique Seha : annuaire `/laboratoires` avec filtres ville + famille d'analyses, badges prélèvement à domicile / résultats dans le dossier patient (fait ✅) ; réservation de créneaux labo à brancher en V2.**

**Spécialités** : pages spécialité × ville × quartier (dermatologue, psychiatre, pédiatre, ORL, ophtalmo, gynéco, généraliste, gastro…). **Réplique Seha : contenu éditorial « que soigne / quand consulter » sur chaque page annuaire + article du magazine lié (fait ✅) ; granularité quartier à ajouter quand la densité de praticiens le justifie.**

**Paiement** : la réservation est gratuite pour les patients — le modèle est l'abonnement praticien (pro.med.tn) ; pas de paiement en ligne patient visible. Seha va plus loin avec le checkout ClicToPay/Konnect/e-Dinar déjà maquetté.

**Sources de données officielles à consommer (production Seha)** :
| Donnée | Source officielle |
|---|---|
| Pharmacies de garde | CNOPT (cnopt.tn, medicapp.tn) — liste hebdomadaire |
| Médicaments (prix, AMM) | Direction de la Pharmacie et du Médicament + Pharmacie Centrale de Tunisie |
| Registre des médecins | Conseil National de l'Ordre des Médecins (CNOM) — vérification à l'inscription |
| Conventionnement / APCI | CNAM (cnam.nat.tn) |

## 7. Positionnement recommandé

> med.tn = un **annuaire + Q&A** qui prend des rendez-vous.
> **Seha = le système d'exploitation du soin tunisien** : le patient possède son dossier, le praticien gère tout son cabinet, la clinique reçoit le monde — en français **et en arabe**.

Attaquer par : (1) le Q&A médical + IA pour l'acquisition, (2) l'outillage cabinet (caisse, file, dossiers) pour verrouiller les praticiens, (3) l'arabe/RTL et l'international pour élargir le marché.
