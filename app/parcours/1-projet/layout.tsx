import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Définir son projet — Étape 1 | ImmoPilot",
  description: "Première étape : définissez votre situation, votre budget et vos critères de recherche pour votre achat immobilier.",
  alternates: { canonical: "/parcours/1-projet" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
