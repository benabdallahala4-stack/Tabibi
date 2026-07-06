# Tabibi — Architecture backend & plan de montée en charge

> Positionnement : *med.tn est un annuaire avec Q&A ; **Tabibi est le système d'exploitation de la santé tunisienne***.
> Ce document décrit comment passer du MVP actuel (front Next.js + localStorage) à une plateforme nationale.

## 1. État actuel (V0 — ce dépôt)

Tout est côté navigateur : données seed dans `src/lib/*.ts`, état dans `localStorage` (rendez-vous, dossier médical, espace praticien, file d'attente, avis, devis). Zéro coût, parfait pour la démo — mais mono-appareil, non partagé, non durable.

## 2. Stack cible (V1)

| Couche | Choix recommandé | Pourquoi |
|---|---|---|
| Front | **Next.js (ce dépôt)** sur Vercel | Déjà construit ; SSR/SSG pour le SEO |
| API | **NestJS** (Node/TypeScript) ou **Next.js API routes** au départ | Même langage que le front ; NestJS structure mieux à l'échelle |
| ORM | **Prisma** | Migrations, typage bout-en-bout |
| Base de données | **PostgreSQL** (Neon / Supabase / RDS) | Relationnel, row-level security, réplication |
| Cache / files | **Redis** (Upstash) | Créneaux chauds, files d'attente, rate limiting |
| Temps réel | **WebSocket / Supabase Realtime** | File d'attente en direct, messagerie, agenda |
| Stockage fichiers | **S3-compatible chiffré** (hébergement Tunisie de préférence) | Documents médicaux (AES-256, URLs signées) |
| Auth | **NextAuth** (Google déjà scaffoldé) + **OTP SMS** (Orange/Ooredoo/TT ou agrégateur) | Téléphone-first pour la Tunisie |
| Paiements | **ClicToPay (SMT)** + **Konnect** (webhooks d'activation) | Voir docs/FEATURES.md §4 bis |
| Notifications | **Web Push (VAPID)** + SMS + WhatsApp Business API | Rappels J-1/H-2, créneau libéré, tour de file |
| Visio | Jitsi auto-hébergé (`meet.tabibi.tn`) | Confidentialité médicale, marque |
| Observabilité | Sentry + logs structurés + uptime | SLO 99,9 % |

**Conformité tunisienne** : hébergement des données de santé à instruire avec l'INPDP (loi 2004-63) — prévoir un déploiement des données sensibles chez un hébergeur tunisien certifié, chiffrement au repos et en transit, journal d'accès immuable, consentement explicite par praticien.

## 3. Schéma de données (référence Prisma simplifiée)

```prisma
model User {            // patient, praticien, clinique-admin, labo, admin
  id            String   @id @default(cuid())
  role          Role     // PATIENT | DOCTOR | CLINIC_ADMIN | LAB | ADMIN
  phone         String?  @unique   // OTP SMS
  email         String?  @unique   // Google OAuth
  name          String
  locale        String   @default("fr")
  patientProfile  PatientProfile?
  doctorProfile   DoctorProfile?
}

model PatientProfile {
  id           String  @id @default(cuid())
  userId       String  @unique
  bloodType    String?
  allergies    String?
  chronic      String?
  medications  String?
  familyMembers FamilyMember[]        // profils famille (Tabibi Plus)
  documents    MedicalDocument[]
  accessGrants RecordAccessGrant[]   // partage par praticien + audit
  appointments Appointment[]
}

model DoctorProfile {
  id            String  @id @default(cuid())
  userId        String  @unique
  slug          String  @unique
  specialtyId   String
  bio           String?
  cityId        String
  address       String
  lat           Float?              // géoloc « autour de moi »
  lng           Float?
  priceTnd      Int
  cnam          Boolean
  teleconsult   Boolean
  calendlyUrl   String?
  socials       Json?
  clinicId      String?             // rattachement clinique
  subscription  Subscription?       // Essentiel / Avancé / Premium
  scheduleRules ScheduleRule[]      // règles de créneaux par motif
  appointments  Appointment[]
  consultations Consultation[]
  queue         QueueEntry[]
}

model Clinic {
  id        String @id @default(cuid())
  slug      String @unique
  name      String
  cityId    String
  beds      Int
  emergency Boolean
  intlDesk  Boolean
  doctors   DoctorProfile[]
  quotes    QuoteRequest[]
}

model Appointment {
  id        String   @id @default(cuid())
  doctorId  String
  patientId String
  startsAt  DateTime
  kind      ApptKind // CABINET | TELECONSULT
  status    ApptStatus // CONFIRMED | CANCELLED | DONE | NO_SHOW
  reason    String?
  reminders Reminder[]
  review    Review?    // avis vérifié 1-1 avec RDV honoré
  @@unique([doctorId, startsAt])   // anti double-réservation
  @@index([patientId, startsAt])
}

model Consultation {      // dossier praticien
  id           String @id @default(cuid())
  doctorId     String
  patientId    String
  date         DateTime
  motif        String
  notes        String?   // chiffré applicativement
  prescription String?   // trace — document remis en main propre
  certificate  Json?     // { type, days } — remis en main propre
  amountTnd    Int
  method       PayMethod // CASH | CARD | CNAM
  paid         Boolean
}

model MedicalDocument {
  id         String @id @default(cuid())
  patientId  String
  category   DocCategory
  s3Key      String      // objet chiffré, URL signée à la demande
  uploadedBy UploaderKind // PATIENT | LAB | DOCTOR
}

model RecordAccessGrant {   // consentement + audit (INPDP)
  id         String   @id @default(cuid())
  patientId  String
  doctorId   String
  expiresAt  DateTime?
  revokedAt  DateTime?
  accesses   RecordAccessLog[]   // chaque ouverture est journalisée
}

model Review {           // avis vérifié : lié à un RDV honoré
  id            String @id @default(cuid())
  appointmentId String @unique
  rating        Int
  text          String
}

model QueueEntry { id String @id; doctorId String; ticket Int; name String; status QueueStatus }
model MessageThread { id String @id; doctorId String; patientId String; messages Message[] }
model Subscription { id String @id; doctorId String @unique; tier Tier; status SubStatus; gateway String; renewsAt DateTime }
model QuoteRequest { id String @id; clinicId String; name String; phone String; country String; details String; status QuoteStatus }
model Medicine { id String @id; brand String; dci String; classe String; priceTnd Decimal; prescription Boolean; cnam Boolean }  // import DPM/PCT
model Pharmacy { id String @id; name String; cityId String; lat Float; lng Float; gardeType Garde?; gardeWeek String? }        // import Ordre des Pharmaciens
```

## 4. Découpage des applications

- **tabibi.tn** — app patient (ce front) : recherche/géoloc, RDV, visio, dossier, historique, Plus.
- **pro.tabibi.tn** — app praticien : agenda, dossiers, caisse, file, messagerie, stats, abonnement. (Aujourd'hui `/pro/dashboard` ; à extraire quand l'équipe grandit.)
- **clinique.tabibi.tn** — app clinique : devis entrants, praticiens rattachés, stats internationales. (Aujourd'hui `/clinique-admin`.)
- **labo.tabibi.tn** — dépôt de résultats (aujourd'hui `/labo`).
- **admin.tabibi.tn** — back-office interne : validation des praticiens (CNOM), modération avis/Q&A, support.
- **API** commune versionnée (`api.tabibi.tn/v1`) consommée par le web et les apps mobiles (TWA → React Native/Capacitor en V3).

## 5. Notifications (V1)

1. **Web Push (VAPID)** : le service worker existant s'abonne (`pushManager.subscribe`), la clé publique est côté front, le backend envoie via `web-push`. Cas : rappel J-1 et H-2, créneau libéré (liste d'attente), « votre tour approche » (file), réponse du médecin.
2. **SMS** (Orange/Ooredoo/TT) : fallback universel — confirmation + rappel.
3. **WhatsApp Business API** : rappels riches et récaps (opt-in), file d'attente.

Le démo actuel utilise l'API Notification locale à la confirmation de RDV — le branchement Web Push remplace `notifyUser()` sans toucher aux appels.

## 6. Montée en charge

- **Phase 1 (0-50k utilisateurs/mois)** : Vercel + Neon Postgres + Upstash Redis — coût ~50-150 $/mois, zéro ops.
- **Phase 2 (50k-500k)** : API NestJS dédiée (Railway/Fly/VPS tunisien), lecture répliquée Postgres, CDN images, files BullMQ pour SMS/notifications, cache créneaux Redis (invalidation à la réservation — verrou `SELECT … FOR UPDATE` sur le créneau).
- **Phase 3 (national + Maghreb)** : partition par pays, données de santé localisées par juridiction, équipe SRE, audits sécurité annuels, bug bounty.

**Points chauds connus** (leçons Doctolib) : la table `Appointment` et la recherche de créneaux concentrent la charge → index `(doctorId, startsAt)`, créneaux pré-matérialisés en cache, idempotence des réservations, et anti-surréservation par contrainte unique (déjà dans le schéma).

## 7. Feuille de route backend

1. **V1.0** : Postgres + Prisma, auth OTP/Google, RDV réels multi-appareils, agenda praticien, rappels SMS.
2. **V1.5** : dossier médical serveur (S3 chiffré + grants + audit), portail labo authentifié, Web Push.
3. **V2.0** : abonnements ClicToPay/Konnect + facturation, messagerie temps réel, file d'attente WebSocket, stats.
4. **V2.5** : Q&A médical modéré + réponse IA (API Claude), base médicaments officielle (DPM/PCT), pharmacies de garde officielles.
5. **V3.0** : apps stores (TWA puis natif), multi-cliniques, API publique partenaires (assurances, labos).
