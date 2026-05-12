import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ImmoPilot Pro — Recevez des leads immobiliers qualifiés | ImmoPilot",
  description: "Courtiers, diagnostiqueurs, agents, assureurs : recevez des leads primo-accédants qualifiés dans votre zone. Budget, étape, consentement RGPD inclus.",
  alternates: { canonical: "/pro" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
