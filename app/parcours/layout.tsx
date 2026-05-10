import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parcours achat immobilier en 10 etapes | ImmoPilot",
  description: "Suivez votre achat de A a Z : du projet a la signature chez le notaire. 10 etapes, outils, alertes et checklists.",
};

export default function ParcoursLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>;
}
