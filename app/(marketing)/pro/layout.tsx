import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ImmoPilot Pro — Recevez des leads immobiliers qualifies",
  description: "Courtiers, diagnostiqueurs, agents, assureurs : recevez des leads primo-accedants qualifies dans votre zone. Budget, etape, consentement RGPD inclus.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
