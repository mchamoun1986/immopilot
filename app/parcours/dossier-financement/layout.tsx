import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dossier de Financement | ImmoPilot",
  description: "Generez votre dossier de financement immobilier complet pour votre banque. Profil emprunteur, capacite, plan de financement, alertes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
