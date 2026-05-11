import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://immopilot.fr"),
  alternates: { canonical: "https://immopilot.fr" },
  title: "ImmoPilot — Achat immobilier primo-accédant | Guide gratuit",
  description: "Guide gratuit pour votre premier achat immobilier en France. Simulateur crédit, PTZ 2026, frais de notaire, 10 étapes de A à Z. Sans compte, 100% gratuit.",
  openGraph: {
    title: "ImmoPilot — Votre premier achat immobilier sans rien louper",
    description: "73% des Français sont éligibles au PTZ sans le savoir. Calculez votre capacité, suivez les 10 étapes, générez votre dossier de financement.",
    type: "website",
    locale: "fr_FR",
    siteName: "ImmoPilot",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ImmoPilot — Guide achat immobilier primo-accédant" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ImmoPilot — Achat immobilier primo-accédant",
    description: "Guide gratuit en 10 étapes pour acheter votre premier appartement en France. Simulateurs, alertes, conseils d'experts.",
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://immopilot.fr/#organization",
      name: "ImmoPilot",
      url: "https://immopilot.fr",
      description: "Guide gratuit pour l'achat immobilier des primo-accédants en France.",
      logo: "https://immopilot.fr/icon.png",
    },
    {
      "@type": "WebSite",
      "@id": "https://immopilot.fr/#website",
      url: "https://immopilot.fr",
      name: "ImmoPilot",
      publisher: { "@id": "https://immopilot.fr/#organization" },
      inLanguage: "fr-FR",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.className}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
