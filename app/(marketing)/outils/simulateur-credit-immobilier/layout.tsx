import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur crédit immobilier gratuit 2026 | ImmoPilot",
  description:
    "Calculez vos mensualités de crédit immobilier gratuitement. Simulez votre capacité d\u2019emprunt, comparez les durées et les taux.",
};

export default function SimulateurCreditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
