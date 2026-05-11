"use client";

import { useState } from "react";
import Link from "next/link";
import { calculerMensualite } from "@/lib/calculateurs/credit";
import { fmt } from "@/lib/utils/format";
import { LeadModal } from "@/components/formulaires/lead-modal";

const FAQ = [
  {
    question: "Comment calculer ses mensualites de credit immobilier ?",
    answer:
      "La formule de la rente : M = P \u00d7 r \u00d7 (1+r)\u207f / ((1+r)\u207f \u2212 1), ou P est le capital emprunte, r le taux mensuel (taux annuel / 12) et n le nombre de mensualites. Notre simulateur applique cette formule en temps reel.",
  },
  {
    question: "Quel taux d\u2019endettement maximum est autorise ?",
    answer:
      "Le Haut Conseil de Stabilite Financiere (HCSF) impose un taux d\u2019endettement maximum de 35% de vos revenus nets mensuels, toutes charges comprises. Au-dela, la banque peut refuser votre dossier.",
  },
  {
    question: "Qu\u2019est-ce que le PTZ (Pret a Taux Zero) ?",
    answer:
      "Le PTZ est un pret sans interets accorde aux primo-accedants sous conditions de ressources et de zone geographique. Il finance une partie du bien (jusqu\u2019a 40% dans les zones tendues) et se rembourse apres une periode differee. Utilisez notre outil eligibilite PTZ pour verifier votre situation.",
  },
  {
    question: "Quelle duree choisir pour mon credit immobilier ?",
    answer:
      "Plus la duree est longue, plus vos mensualites sont basses, mais plus le cout total des interets est eleve. En France, la duree maximum est generalement de 25 ans (27 ans en VEFA). Comparez les durees avec notre simulateur pour trouver le bon equilibre.",
  },
] as const;

export default function SimulateurCreditPage() {
  const [montant, setMontant] = useState(200000);
  const [taux, setTaux] = useState(3.5);
  const [duree, setDuree] = useState(20);
  const [showLeadModal, setShowLeadModal] = useState(false);

  const result = calculerMensualite(montant, taux, duree);
  const hasResult = montant > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--rouge-francais)]">
          Outil gratuit
        </p>
        <h1 className="mb-3 text-3xl font-extrabold text-[var(--bleu-marine)] md:text-4xl">
          Simulateur de crédit immobilier
        </h1>
        <p className="text-gray-600">
          Calculez vos mensualités, le coût total et le coût des intérêts en quelques secondes.
        </p>
      </div>

      {/* Calculator card */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-semibold text-[var(--bleu-marine)]">Vos paramètres</h2>

        <div className="grid gap-5 sm:grid-cols-3">
          {/* Montant */}
          <div>
            <label
              htmlFor="sc-montant"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Montant emprunté (EUR)
            </label>
            <input
              id="sc-montant"
              type="number"
              min={0}
              step={1000}
              value={montant}
              onChange={(e) => setMontant(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
          </div>

          {/* Taux */}
          <div>
            <label
              htmlFor="sc-taux"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Taux annuel (%)
            </label>
            <input
              id="sc-taux"
              type="number"
              step={0.05}
              min={0}
              max={15}
              value={taux}
              onChange={(e) => setTaux(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
          </div>

          {/* Duree */}
          <div>
            <label
              htmlFor="sc-duree"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Durée (années)
            </label>
            <input
              id="sc-duree"
              type="number"
              min={1}
              max={25}
              value={duree}
              onChange={(e) => setDuree(parseInt(e.target.value) || 20)}
              className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
          </div>
        </div>

        {/* Results */}
        {hasResult && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-[var(--bleu-marine)] p-4 text-center text-white">
              <p className="text-xs opacity-80">Mensualité</p>
              <p className="mt-1 text-2xl font-extrabold">{fmt(result.mensualite)}</p>
              <p className="text-xs opacity-70">EUR / mois</p>
            </div>
            <div className="rounded-lg bg-[var(--gris-clair)] p-4 text-center">
              <p className="text-xs text-gray-500">Coût total</p>
              <p className="mt-1 text-2xl font-extrabold text-[var(--bleu-marine)]">
                {fmt(result.cout_total)}
              </p>
              <p className="text-xs text-gray-400">EUR</p>
            </div>
            <div className="rounded-lg bg-[var(--gris-clair)] p-4 text-center">
              <p className="text-xs text-gray-500">Coût des intérêts</p>
              <p className="mt-1 text-2xl font-extrabold text-orange-600">
                {fmt(result.cout_interets)}
              </p>
              <p className="text-xs text-gray-400">EUR</p>
            </div>
          </div>
        )}

        {/* Lead capture */}
        {hasResult && (
          <div className="mt-6 rounded-xl border border-[var(--bleu-secondaire)] bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-[var(--bleu-marine)]">Recevez votre simulation détaillée</p>
                <p className="mt-1 text-sm text-gray-600">Plan de financement personnalisé envoyé par email.</p>
              </div>
              <button
                onClick={() => setShowLeadModal(true)}
                className="flex-shrink-0 rounded-xl bg-[var(--bleu-secondaire)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Recevoir par email
              </button>
            </div>
          </div>
        )}

        {hasResult && (
          <p className="mt-4 text-center text-xs text-gray-400">
            Simulation indicative — hors assurance emprunteur et frais de dossier.
          </p>
        )}
      </div>

      {/* CTA parcours */}
      <div className="mt-8 rounded-xl border border-[var(--bleu-secondaire)] bg-white p-6 text-center">
        <p className="mb-1 font-semibold text-[var(--bleu-marine)]">
          Vous souhaitez aller plus loin ?
        </p>
        <p className="mb-4 text-sm text-gray-600">
          Découvrez notre parcours complet : capacité d&apos;emprunt, PTZ, budget total, conseils
          d&apos;experts étape par étape.
        </p>
        <Link
          href="/parcours"
          className="inline-block rounded-lg bg-[var(--rouge-francais)] px-7 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Démarrer mon parcours
        </Link>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-extrabold text-[var(--bleu-marine)]">
          Questions fréquentes
        </h2>
        <div className="space-y-5">
          {FAQ.map((item) => (
            <div
              key={item.question}
              className="rounded-lg border border-[var(--gris-border)] bg-white p-5"
            >
              <h3 className="mb-2 font-semibold text-[var(--bleu-marine)]">{item.question}</h3>
              <p className="text-sm text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <LeadModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        source="simulation"
        etape={2}
        titre="Recevez votre simulation détaillée"
        description="Un récap personnalisé : capacité d'emprunt, PTZ, budget total."
        showPhone={false}
        showConsent={false}
        onSubmit={() => {}}
      />
    </div>
  );
}
