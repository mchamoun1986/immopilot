import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://immopilot-rust.vercel.app"),
  alternates: { canonical: "https://immopilot-rust.vercel.app" },
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
      "@id": "https://immopilot-rust.vercel.app/#organization",
      name: "ImmoPilot",
      url: "https://immopilot-rust.vercel.app",
      description: "Guide gratuit pour l'achat immobilier des primo-accédants en France.",
      logo: "https://immopilot-rust.vercel.app/icon.png",
    },
    {
      "@type": "WebSite",
      "@id": "https://immopilot-rust.vercel.app/#website",
      url: "https://immopilot-rust.vercel.app",
      name: "ImmoPilot",
      publisher: { "@id": "https://immopilot-rust.vercel.app/#organization" },
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
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--bleu-action)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg">
          Aller au contenu
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
