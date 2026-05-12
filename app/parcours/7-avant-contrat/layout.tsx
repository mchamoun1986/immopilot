import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compromis de vente — Étape 7 | ImmoPilot",
  description: "Comprendre les clauses suspensives, les documents obligatoires et les délais légaux du compromis de vente.",
  alternates: { canonical: "/parcours/7-avant-contrat" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
