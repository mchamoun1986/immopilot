import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ImmoPilot Pro — Recevez des leads immobiliers qualifiés",
  description: "Courtiers, diagnostiqueurs, agents, assureurs : recevez des leads primo-accédants qualifiés dans votre zone. Budget, étape, consentement RGPD inclus.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
