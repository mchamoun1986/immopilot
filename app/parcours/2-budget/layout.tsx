import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capacité d'emprunt — Étape 2 | ImmoPilot",
  description: "Calculez votre capacité d'emprunt, simulez votre crédit immobilier et vérifiez votre éligibilité au PTZ.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
