import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales & Politique de confidentialité | ImmoPilot",
  description: "Mentions légales, politique de confidentialité RGPD et informations sur la gestion de vos données personnelles.",
  alternates: { canonical: "/mentions-legales" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
