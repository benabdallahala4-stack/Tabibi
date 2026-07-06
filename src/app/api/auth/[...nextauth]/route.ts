// Authentification NextAuth — connexion Google.
// Activée dès que GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET sont définis
// (voir README, section « Connexion Google »). Sans ces variables, le site
// fonctionne en mode invité (rendez-vous stockés sur l'appareil).

import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const authOptions: AuthOptions = {
  providers: googleConfigured
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    : [],
  // À surcharger en production via la variable d'environnement NEXTAUTH_SECRET.
  secret: process.env.NEXTAUTH_SECRET ?? "tabibi-demo-secret-change-me",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
