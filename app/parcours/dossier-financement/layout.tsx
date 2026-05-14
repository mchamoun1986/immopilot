import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dossier de Financement | ImmoPilot",
  description: "Générez votre dossier de financement immobilier complet pour votre banque. Profil emprunteur, capacité, plan de financement, alertes.",
  alternates: { canonical: "/parcours/dossier-financement" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
