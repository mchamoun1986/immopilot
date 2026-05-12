import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur frais de notaire gratuit 2026 | ImmoPilot",
  description:
    "Estimez les frais de notaire pour un bien ancien ou neuf. Détail complet : droits de mutation, émoluments, débours et contribution sécurité immobilière.",
  alternates: { canonical: "/outils/frais-de-notaire" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Combien coûtent les frais de notaire en 2026 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pour un bien ancien, les frais représentent environ 7 à 8% du prix. Pour un bien neuf, entre 2 et 3%. Ils comprennent les droits de mutation, émoluments, débours et contribution de sécurité immobilière.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la différence entre frais ancien et frais neuf ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dans l\u2019ancien, les droits de mutation s\u2019élèvent à environ 5,8%. Dans le neuf, ils sont réduits à 0,715%. En contrepartie, la TVA (20%) est incluse dans le prix de vente du neuf.",
      },
    },
    {
      "@type": "Question",
      name: "Les frais de notaire sont-ils négociables ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les émoluments sont réglementés par décret. Pour les transactions supérieures à 150 000 EUR, une remise maximale de 10% sur les émoluments peut être consentie. Les droits de mutation sont des taxes non négociables.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on financer les frais de notaire avec le crédit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Certaines banques acceptent un prêt à 110% qui inclut les frais de notaire. Cela nécessite généralement un dossier solide.",
      },
    },
  ],
};

export default function FraisNotaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
