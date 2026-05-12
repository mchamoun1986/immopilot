import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes données — Gestion RGPD | ImmoPilot",
  description: "Consultez et supprimez toutes vos données personnelles stockées localement par ImmoPilot.",
  alternates: { canonical: "/mes-donnees" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
