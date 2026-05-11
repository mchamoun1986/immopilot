import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Outils gratuits pour votre achat immobilier 2026 | ImmoPilot",
  description:
    "Simulateur de crédit immobilier, calculateur de frais de notaire, éligibilité PTZ — tous les outils gratuits pour préparer votre premier achat.",
};

const OUTILS = [
  {
    titre: "Simulateur de crédit immobilier",
    description:
      "Calculez vos mensualités, le coût total et le coût des intérêts. Simulez différentes durées et taux en temps réel.",
    href: "/outils/simulateur-credit-immobilier",
    tag: "Crédit",
    tagColor: "bg-blue-100 text-blue-800",
    cta: "Simuler mon crédit",
  },
  {
    titre: "Calculateur frais de notaire",
    description:
      "Estimez les frais de notaire pour un bien ancien ou neuf avec le détail complet : droits de mutation, émoluments, débours.",
    href: "/outils/frais-de-notaire",
    tag: "Notaire",
    tagColor: "bg-amber-100 text-amber-800",
    cta: "Calculer les frais",
  },
  {
    titre: "Éligibilité PTZ 2026",
    description:
      "Vérifiez si vous êtes éligible au Prêt à Taux Zéro. Renseignez votre zone, revenus et taille de foyer pour obtenir le montant estimatif.",
    href: "/outils/eligibilite-ptz",
    tag: "PTZ",
    tagColor: "bg-green-100 text-green-800",
    cta: "Vérifier mon PTZ",
  },
] as const;

export default function OutilsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--rouge-francais)]">
          100% gratuit
        </p>
        <h1 className="mb-4 text-4xl font-extrabold text-[var(--bleu-marine)]">
          Outils immobiliers gratuits
        </h1>
        <p className="mx-auto max-w-xl text-lg text-gray-600">
          Tous les simulateurs et calculateurs pour estimer votre projet, votre financement et vos
          coûts avant de vous lancer.
        </p>
      </div>

      {/* Tool cards */}
      <div className="grid gap-8 sm:grid-cols-3">
        {OUTILS.map((outil) => (
          <div
            key={outil.href}
            className="flex flex-col rounded-xl border border-[var(--gris-border)] bg-white p-6 shadow-sm"
          >
            <span
              className={`mb-3 inline-block self-start rounded-full px-3 py-0.5 text-xs font-semibold ${outil.tagColor}`}
            >
              {outil.tag}
            </span>
            <h2 className="mb-2 text-xl font-bold text-[var(--bleu-marine)]">{outil.titre}</h2>
            <p className="mb-6 flex-1 text-sm text-gray-600">{outil.description}</p>
            <Link
              href={outil.href}
              className="inline-block self-start rounded-lg bg-[var(--rouge-francais)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              {outil.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* CTA parcours */}
      <div className="mt-14 rounded-xl border border-[var(--bleu-secondaire)] bg-white p-8 text-center">
        <h2 className="mb-2 text-xl font-bold text-[var(--bleu-marine)]">
          Vous souhaitez aller plus loin ?
        </h2>
        <p className="mb-5 text-gray-600">
          Suivez notre parcours complet en 10 étapes — de la définition de votre projet jusqu&apos;à
          la signature chez le notaire.
        </p>
        <Link
          href="/parcours"
          className="inline-block rounded-lg bg-[var(--bleu-secondaire)] px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Découvrir le parcours complet
        </Link>
      </div>
    </div>
  );
}
