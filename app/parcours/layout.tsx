import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parcours achat immobilier en 10 étapes | ImmoPilot",
  description: "Suivez votre achat de A à Z : du projet à la signature chez le notaire. 10 étapes, outils, alertes et checklists.",
  alternates: { canonical: "/parcours" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Accueil",
      item: "https://immopilot-rust.vercel.app/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Parcours",
      item: "https://immopilot-rust.vercel.app/parcours",
    },
  ],
};

export default function ParcoursLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </>
  );
}
