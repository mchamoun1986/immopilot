import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vérifier et comparer le bien — Étape 5 | ImmoPilot",
  description: "Analysez en détail le bien immobilier que vous visez : DPE, diagnostics, copropriété, prix au m2, servitudes, urbanisme.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
