import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premier feu vert bancaire — Étape 3 | ImmoPilot",
  description: "Obtenez un accord de principe de votre banque avant de chercher un bien. Attestation de financement pour crédibiliser votre offre.",
  alternates: { canonical: "/parcours/3-accord-bancaire" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
