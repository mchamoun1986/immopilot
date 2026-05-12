import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur crédit immobilier gratuit 2026 | ImmoPilot",
  description:
    "Calculez vos mensualités de crédit immobilier gratuitement. Simulez votre capacité d\u2019emprunt, comparez les durées et les taux.",
  alternates: { canonical: "/outils/simulateur-credit-immobilier" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Comment calculer ses mensualités de crédit immobilier ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La formule : M = P \u00d7 r \u00d7 (1+r)\u207f / ((1+r)\u207f \u2212 1), où P est le capital emprunté, r le taux mensuel et n le nombre de mensualités.",
      },
    },
    {
      "@type": "Question",
      name: "Quel taux d\u2019endettement maximum est autorisé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le HCSF impose un taux d\u2019endettement maximum de 35% des revenus nets mensuels, toutes charges comprises.",
      },
    },
    {
      "@type": "Question",
      name: "Qu\u2019est-ce que le PTZ (Prêt à Taux Zéro) ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le PTZ est un prêt sans intérêts accordé aux primo-accédants sous conditions de ressources et de zone géographique.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle durée choisir pour mon crédit immobilier ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plus la durée est longue, plus les mensualités sont basses mais le coût total des intérêts est élevé. La durée maximum est généralement de 25 ans.",
      },
    },
  ],
};

export default function SimulateurCreditLayout({
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
