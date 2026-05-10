import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur frais de notaire gratuit 2026 | ImmoPilot",
  description:
    "Estimez les frais de notaire pour un bien ancien ou neuf. Detail complet : droits de mutation, emoluments, debours et contribution securite immobiliere.",
};

export default function FraisNotaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
