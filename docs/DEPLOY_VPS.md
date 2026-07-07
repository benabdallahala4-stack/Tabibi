# Déployer Seha sur un VPS (Hostinger, Contabo, OVH…)

Ce guide déploie la **stack complète** — PostgreSQL + backend/API + front —
avec **HTTPS automatique**, en une commande, via Docker Compose.

Résultat : `https://votre-domaine` servi par Caddy (certificat Let's Encrypt
auto-renouvelé), l'app Next.js et la base Postgres tournant en privé derrière.

---

## 0. Ce qu'il vous faut

- Un VPS Ubuntu 22.04/24.04 (Hostinger « KVM 1 » suffit : 1 vCPU / 4 Go).
- Un nom de domaine (ex. `seha.tn`) dont vous gérez le DNS.
- Un accès SSH `root` (ou un utilisateur `sudo`).

---

## 1. Pointer le domaine vers le VPS

Dans votre gestionnaire DNS (hPanel Hostinger → Domaines → DNS), créez :

| Type | Nom | Valeur                 |
|------|-----|------------------------|
| A    | `@` | `IP_PUBLIQUE_DU_VPS`   |
| A    | `www` (optionnel) | `IP_PUBLIQUE_DU_VPS` |

Attendez la propagation (`ping seha.tn` doit renvoyer l'IP du VPS). **Caddy ne
pourra obtenir le certificat TLS que si le DNS pointe déjà correctement.**

---

## 2. Installer Docker sur le VPS

> Hostinger propose un template « Ubuntu 24.04 with Docker » à la création du
> VPS — dans ce cas, sautez cette étape.

```bash
ssh root@IP_DU_VPS
curl -fsSL https://get.docker.com | sh
docker version   # vérifie l'installation
```

---

## 3. Récupérer le code

```bash
git clone https://github.com/benabdallahala4-stack/Seha.git seha
cd seha
```

---

## 4. Configurer les secrets

```bash
cp .env.prod.example .env
nano .env
```

Renseignez au minimum :

```env
DOMAIN=seha.tn
POSTGRES_PASSWORD=<un mot de passe fort>
SESSION_SECRET=<résultat de: openssl rand -base64 32>
```

Astuce pour générer le secret sans quitter l'éditeur :
```bash
echo "SESSION_SECRET=$(openssl rand -base64 32)" >> .env
```

---

## 5. Ouvrir le pare-feu (ports 80 / 443 uniquement)

```bash
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

> N'ouvrez **pas** le 5432 (Postgres) ni le 3000 (app) : en production ils ne
> sont pas publiés sur l'hôte, ils restent sur le réseau Docker privé.

---

## 6. Lancer la stack

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Au premier démarrage : build de l'image, migrations Prisma appliquées, comptes
de démo créés, puis Caddy récupère le certificat TLS. Comptez 3–6 minutes.

Suivez les logs :
```bash
docker compose -f docker-compose.prod.yml logs -f
```

Ouvrez ensuite **https://seha.tn** 🎉

---

## 7. Vérifier

```bash
curl -s https://seha.tn/api/health
# → {"ok":true,"db":true,"mode":"cloud"}
```

`mode:"cloud"` confirme que l'app parle bien à PostgreSQL (et non au mode démo
localStorage).

---

## Exploitation courante

```bash
# Mettre à jour après un nouveau commit
git pull
docker compose -f docker-compose.prod.yml up -d --build

# Redémarrer / arrêter
docker compose -f docker-compose.prod.yml restart
docker compose -f docker-compose.prod.yml down

# Sauvegarde de la base (à automatiser via cron)
docker compose -f docker-compose.prod.yml exec db \
  pg_dump -U seha seha | gzip > seha_$(date +%F).sql.gz

# Restauration
gunzip -c seha_2026-07-07.sql.gz | \
  docker compose -f docker-compose.prod.yml exec -T db psql -U seha seha
```

Exemple de cron (sauvegarde quotidienne à 3h) — `crontab -e` :
```
0 3 * * * cd /root/seha && docker compose -f docker-compose.prod.yml exec -T db pg_dump -U seha seha | gzip > /root/backups/seha_$(date +\%F).sql.gz
```

---

## Ce qui reste à brancher (avant un vrai lancement public)

Le déploiement ci-dessus est **fonctionnel** (comptes, RDV, ordonnances,
bulletins CNAM… persistés en base). Pour une mise en production « grand
public », il reste des intégrations tierces, aujourd'hui en mode dégradé :

| Sujet | État actuel | À faire pour la prod |
|-------|-------------|----------------------|
| **SMS OTP** | Le code est renvoyé dans la réponse API (mode dev) faute de passerelle. | Souscrire un agrégateur SMS tunisien (Konnect, Orange, …) et renseigner `SMS_GATEWAY_URL` / `SMS_GATEWAY_TOKEN`. |
| **Comptes de démo** | `prisma/seed.mjs` crée 6 comptes de test à chaque démarrage. | Retirer/segmenter le seed pour la prod, ou le remplacer par un seul compte admin. |
| **Paiement Pro** | Le checkout (passerelles tunisiennes) est une maquette UI. | Intégrer un PSP réel (Konnect, Flouci, ClicToPay…) et vérifier les webhooks. |
| **Paramètres médecin** | Profil « Dr Amine Ben Salah » codé en dur dans certaines pages Pro. | Lier ces pages au médecin connecté (session → profil). |
| **E-mail transactionnel** | Aucun. | Brancher un service (Resend, Postmark, SES) pour confirmations/rappels. |
| **Rate-limiting / anti-abus** | Basique. | Limiter les demandes d'OTP par IP/téléphone (déjà un champ `attempts`). |
| **Sauvegardes** | Manuelles (cf. ci-dessus). | Automatiser + externaliser (S3/Backblaze) et tester la restauration. |
| **Observabilité** | Logs Docker. | Ajouter monitoring/uptime (Uptime Kuma, Sentry…). |

---

## Dépannage

- **Caddy n'obtient pas le certificat** → le DNS ne pointe pas encore, ou le
  port 80 est fermé. Vérifiez `ping DOMAIN` et `ufw status`.
- **`web` redémarre en boucle** → base pas prête ou `DATABASE_URL` erronée.
  `docker compose -f docker-compose.prod.yml logs web`.
- **Login échoue en HTTP** → normal : le cookie de session est `Secure`, il
  exige HTTPS. Passez toujours par `https://`.
