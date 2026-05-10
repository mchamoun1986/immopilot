import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Outils gratuits pour votre achat immobilier 2026 | ImmoPilot",
  description:
    "Simulateur de credit immobilier, calculateur de frais de notaire, eligibilite PTZ — tous les outils gratuits pour preparer votre premier achat.",
};

const OUTILS = [
  {
    titre: "Simulateur de credit immobilier",
    description:
      "Calculez vos mensualites, le cout total et le cout des interets. Simulez differentes durees et taux en temps reel.",
    href: "/outils/simulateur-credit-immobilier",
    tag: "Credit",
    tagColor: "bg-blue-100 text-blue-800",
    cta: "Simuler mon credit",
  },
  {
    titre: "Calculateur frais de notaire",
    description:
      "Estimez les frais de notaire pour un bien ancien ou neuf avec le detail complet : droits de mutation, emoluments, debours.",
    href: "/outils/frais-de-notaire",
    tag: "Notaire",
    tagColor: "bg-amber-100 text-amber-800",
    cta: "Calculer les frais",
  },
  {
    titre: "Eligibilite PTZ 2026",
    description:
      "Verifiez si vous etes eligible au Pret a Taux Zero. Renseignez votre zone, revenus et taille de foyer pour obtenir le montant estimatif.",
    href: "/outils/eligibilite-ptz",
    tag: "PTZ",
    tagColor: "bg-green-100 text-green-800",
    cta: "Verifier mon PTZ",
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
          couts avant de vous lancer.
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
          Suivez notre parcours complet en 10 etapes — de la definition de votre projet jusqu&apos;a
          la signature chez le notaire.
        </p>
        <Link
          href="/parcours"
          className="inline-block rounded-lg bg-[var(--bleu-secondaire)] px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Decouvrir le parcours complet
        </Link>
      </div>
    </div>
  );
}
