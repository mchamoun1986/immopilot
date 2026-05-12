import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post-achat — Étape 10 | ImmoPilot",
  description: "Déménagement, assurance habitation, déclarations fiscales : tout ce qu'il faut faire après la signature.",
  alternates: { canonical: "/parcours/10-emmenagement" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
