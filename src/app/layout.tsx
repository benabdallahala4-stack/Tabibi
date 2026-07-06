import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seha — صحة | Prenez rendez-vous avec un médecin en Tunisie",
  description:
    "Seha est la plateforme tunisienne de prise de rendez-vous médicaux en ligne : trouvez un médecin près de chez vous, réservez 24h/24 et consultez à distance.",
  icons: { icon: "/icon.svg" },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Seha", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#1c4fdb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
