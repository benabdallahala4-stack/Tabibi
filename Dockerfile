# Tabibi — image de production (Next.js 14 + Prisma).
# Multi-stage : build puis image d'exécution allégée.

FROM node:22-bookworm-slim AS base
# openssl requis par Prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# --- Dépendances ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- Build ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# prisma generate + next build (les migrations sont appliquées au démarrage,
# pas au build — la base n'existe pas encore ici).
RUN npx prisma generate && npx next build

# --- Runner ---
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.mjs ./next.config.mjs
EXPOSE 3000
# La commande réelle (migrate + seed + start) est fournie par docker-compose ;
# ce CMD sert de repli pour un run standalone avec une base déjà migrée.
CMD ["npx", "next", "start"]
