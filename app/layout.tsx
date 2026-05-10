import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://immopilot.fr"),
  title: "ImmoPilot — Achat immobilier primo-accedant | Guide gratuit",
  description: "Guide gratuit pour votre premier achat immobilier en France. Simulateur credit, PTZ 2026, frais de notaire, 10 etapes de A a Z. Sans compte, 100% gratuit.",
  openGraph: {
    title: "ImmoPilot — Votre premier achat immobilier sans rien louper",
    description: "73% des Francais sont eligibles au PTZ sans le savoir. Calculez votre capacite, suivez les 10 etapes, generez votre dossier de financement.",
    type: "website",
    locale: "fr_FR",
    siteName: "ImmoPilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImmoPilot — Achat immobilier primo-accedant",
    description: "Guide gratuit en 10 etapes pour acheter votre premier appartement en France. Simulateurs, alertes, conseils d'experts.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.className}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
