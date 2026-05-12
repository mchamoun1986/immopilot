import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acte authentique chez le notaire — Étape 9 | ImmoPilot",
  description: "Tout savoir sur la signature de l'acte authentique, les frais de notaire et la remise des clés.",
  alternates: { canonical: "/parcours/9-acte" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
