import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parcours achat immobilier en 10 étapes | ImmoPilot",
  description: "Suivez votre achat de A à Z : du projet à la signature chez le notaire. 10 étapes, outils, alertes et checklists.",
};

export default function ParcoursLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>;
}
