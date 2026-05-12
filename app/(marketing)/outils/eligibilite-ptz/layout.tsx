import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Éligibilité PTZ 2026 — Prêt à Taux Zéro | ImmoPilot",
  description:
    "Vérifiez votre éligibilité au PTZ 2026 gratuitement. Montant, durée différée, zone — simulateur officiel en ligne.",
  alternates: { canonical: "/outils/eligibilite-ptz" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qui a droit au PTZ en 2026 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le PTZ est réservé aux primo-accédants n\u2019ayant pas été propriétaires de leur résidence principale au cours des 2 dernières années, sous conditions de ressources par zone et taille de foyer.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles sont les zones PTZ éligibles ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le territoire est divisé en 5 zones : Abis (Paris), A (grande couronne, Côte d\u2019Azur), B1 (grandes agglomérations, DOM), B2 et C. Les plafonds et montants PTZ varient selon la zone.",
      },
    },
    {
      "@type": "Question",
      name: "Le PTZ est-il cumulable avec d\u2019autres prêts ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, le PTZ se cumule avec le prêt principal, un prêt Action Logement, un prêt épargne logement ou d\u2019autres aides. Il finance en général 20 à 40% du bien selon la zone.",
      },
    },
    {
      "@type": "Question",
      name: "Quel est le montant maximum du PTZ ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le PTZ est calculé sur le coût total de l\u2019opération (plafonné selon zone et foyer), multiplié par un taux de quotité variable par tranche de revenus (50/40/40/20% depuis mars 2026).",
      },
    },
  ],
};

export default function EligibilitePTZLayout({
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
