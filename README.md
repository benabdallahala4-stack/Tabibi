<p align="center">
  <img src="public/logo.svg" alt="Tabibi — طبيبي" width="420" />
</p>

# Tabibi — طبيبي

**La plateforme tunisienne de prise de rendez-vous médicaux en ligne**, inspirée de Doctolib et adaptée au contexte tunisien (CNAM, dinar tunisien, bilinguisme français/arabe, 24 gouvernorats).

> *Tabibi* signifie « mon médecin » en dialecte tunisien. Le logo combine une croix médicale aux pétales arrondis (clin d'œil au jasmin, fleur nationale) et un tracé d'électrocardiogramme rouge tunisien.

## ✨ Fonctionnalités

**Côté patient :**
- 🔍 Recherche de praticiens par spécialité, nom et ville (12 spécialités, 13 villes)
- 👨‍⚕️ Profils praticiens complets : bio, formation, langues, tarifs en DT, conventionnement CNAM, avis, **réseaux sociaux, carte Google Maps et avis Google**
- 📅 Réservation en ligne : calendrier de créneaux sur 7 jours, au cabinet ou en téléconsultation
- 📹 **Téléconsultation vidéo réelle** : salle Jitsi Meet dédiée à chaque rendez-vous (chiffré, sans compte)
- 🗓️ **Widget Calendly** embarqué pour les praticiens qui l'utilisent
- ✅ Confirmation instantanée et gestion des rendez-vous (consultation, annulation)
- 👤 **Mon compte** : profil patient local (pré-remplit les réservations) + **connexion Google** (NextAuth, à activer via variables d'environnement)
- 🇹🇳 **Bilingue français / العربية** : bouton de langue dans l'en-tête, toute l'interface bascule en arabe **avec mise en page RTL**
- 📱 **PWA installable** : « Ajouter à l'écran d'accueil » sur Android/iOS (manifest + service worker)

**Côté praticien (vitrine Tabibi Pro) :**
- Présentation de l'offre : agenda intelligent, rappels SMS/e-mail, téléconsultation, dossier patient, statistiques

La liste complète des fonctionnalités Doctolib analysées, **les paliers premium** et la feuille de route se trouvent dans [`docs/FEATURES.md`](docs/FEATURES.md).

## 🛠️ Stack technique

- [Next.js 14](https://nextjs.org/) (App Router) + React 18 + TypeScript
- [Tailwind CSS 3](https://tailwindcss.com/) (RTL-ready) · [NextAuth](https://next-auth.js.org/) (Google) · [Jitsi Meet](https://meet.jit.si) (visio)
- MVP sans backend : données de démonstration (`src/lib/data.ts`), créneaux générés de façon déterministe, rendez-vous stockés en `localStorage`
- Déployable sur Vercel sans configuration

## 🚀 Démarrage

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
```

## ❓ Où sont enregistrés les rendez-vous ?

**Deux modes, bascule automatique :**

- **Mode local** (par défaut, sans base de données) : rendez-vous et profil dans le localStorage du navigateur — mono-appareil.
- **Mode cloud** (V1, dès que `DATABASE_URL` est configuré) : compte par **SMS OTP**, rendez-vous en **PostgreSQL**, synchronisés entre appareils, avec **anti-surréservation garantie** par contrainte unique sur le créneau (`slotKey`).

## ☁️ Activer le mode cloud (V1) sur Vercel

1. Dans le dashboard Vercel du projet : **Storage → Create Database → Neon (Postgres)** — Vercel ajoute `DATABASE_URL` automatiquement. (Ou créez une base sur [neon.tech](https://neon.tech)/[supabase.com](https://supabase.com) et ajoutez `DATABASE_URL` dans Settings → Environment Variables.)
2. Ajoutez aussi `SESSION_SECRET` (chaîne aléatoire, ex. `openssl rand -base64 32`).
3. **Redéployez** : le build exécute `prisma migrate deploy` automatiquement (script `scripts/migrate-if-db.mjs`) et crée les tables.
4. Vérifiez : `https://<votre-domaine>/api/health` doit répondre `{"db":true,"mode":"cloud"}`.
5. Connexion : page « Mon compte » → « Vérifier mon numéro par SMS ». Sans passerelle SMS, le code s'affiche à l'écran (mode démo). Pour de vrais SMS : configurez `SMS_GATEWAY_URL` + `SMS_GATEWAY_TOKEN` (Orange/Ooredoo/TT ou agrégateur).

Une fois connecté : les réservations sont poussées au serveur (409 si le créneau vient d'être pris), « Mes rendez-vous » fusionne les données serveur (badge « ☁️ Synchronisé »), et l'annulation libère le créneau.

## 🔑 Activer la connexion Google

1. Créez un projet sur [console.cloud.google.com](https://console.cloud.google.com) → « APIs & Services » → « Credentials » → « Create OAuth client ID » (type **Web application**).
2. Ajoutez l'URI de redirection : `https://<votre-domaine>/api/auth/callback/google` (et `http://localhost:3000/api/auth/callback/google` pour le dev).
3. Définissez les variables d'environnement (sur Vercel : Settings → Environment Variables) :
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET` (chaîne aléatoire, ex. `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = `https://<votre-domaine>`
4. Redéployez : le bouton « Se connecter avec Google » apparaît automatiquement sur `/compte`.

## 📱 Android

Le site est une **PWA** : sur Android (Chrome), menu ⋮ → « Ajouter à l'écran d'accueil » → Tabibi s'installe comme une application (icône, plein écran).
Pour un **APK** distribuable : déployez le site, puis générez un package TWA sur [pwabuilder.com](https://www.pwabuilder.com) en entrant l'URL de production — il produit un APK/AAB signé prêt à tester ou à publier sur le Play Store.

## 📁 Structure

```
tabibi/
├── docs/FEATURES.md          # Analyse Doctolib + premium + feuille de route
├── public/                   # logo.svg, icon.svg, manifest.json, sw.js (PWA)
└── src/
    ├── app/
    │   ├── page.tsx              # Accueil (hero, spécialités, disponibilités)
    │   ├── recherche/            # Résultats de recherche + filtres
    │   ├── medecin/[slug]/       # Profil praticien + prise de RDV
    │   ├── rdv/confirmation/     # Confirmation de rendez-vous
    │   ├── mes-rdv/              # Tableau de bord patient
    │   ├── visio/                # Téléconsultation vidéo (Jitsi)
    │   ├── compte/               # Profil local + connexion Google
    │   ├── pro/                  # Vitrine Tabibi Pro (praticiens)
    │   └── api/auth/[...nextauth]/ # Authentification NextAuth
    ├── components/               # Header, Footer, SearchBar, DoctorCard,
    │                             # DoctorProfile, BookingWidget, Providers
    └── lib/                      # i18n FR/AR (RTL), types, données seed,
                                  # créneaux, rendez-vous, profil local
```

## ⚠️ Avertissement

Projet de démonstration à but éducatif : les praticiens, créneaux et avis sont fictifs. Ce projet n'est pas affilié à Doctolib, Google ou Calendly.
