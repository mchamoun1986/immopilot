import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Éligibilité PTZ 2026 — Prêt à Taux Zéro | ImmoPilot",
  description:
    "Vérifiez votre éligibilité au PTZ 2026 gratuitement. Montant, durée différée, zone — simulateur officiel en ligne.",
};

export default function EligibilitePTZLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
