import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes dossiers — Biens en cours d'étude | ImmoPilot",
  description: "Gérez vos dossiers de biens immobiliers : checklist de visite, analyse financière automatique et suivi du statut.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
