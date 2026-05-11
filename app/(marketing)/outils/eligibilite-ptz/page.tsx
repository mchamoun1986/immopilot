"use client";

import { useState } from "react";
import Link from "next/link";
import { calculerPTZ } from "@/lib/calculateurs/ptz";
import type { ParamsPTZ } from "@/lib/calculateurs/ptz";
import { fmt } from "@/lib/utils/format";
import { LeadModal } from "@/components/formulaires/lead-modal";

const ZONES = [
  { value: "Abis", label: "Zone Abis — Paris + 3 communes (Hauts-de-Seine, etc.)" },
  { value: "A", label: "Zone A — Grande couronne, Cote d\u2019Azur, Genevois francais" },
  { value: "B1", label: "Zone B1 — Grandes agglomerations, DOM, Corse" },
  { value: "B2", label: "Zone B2 — Villes moyennes" },
  { value: "C", label: "Zone C — Reste du territoire" },
] as const;

const FAQ = [
  {
    question: "Qui a droit au PTZ en 2026 ?",
    answer:
      "Le PTZ est reserve aux primo-accedants (personnes n\u2019ayant pas ete proprietaires de leur residence principale au cours des 2 dernieres annees) sous conditions de ressources. Le revenu fiscal de reference (annee N-2) ne doit pas depasser les plafonds definis par zone et par taille de foyer.",
  },
  {
    question: "Quelles sont les zones PTZ eligibles ?",
    answer:
      "Le territoire est divise en 5 zones : Abis (Paris et certaines communes), A (grande couronne parisienne, Cote d\u2019Azur), B1 (grandes agglomerations, DOM, Corse), B2 et C (reste du territoire). Les plafonds de ressources et les montants PTZ varient selon la zone.",
  },
  {
    question: "Le PTZ est-il cumulable avec d\u2019autres prets ?",
    answer:
      "Oui, le PTZ se cumule avec le pret principal de la banque, un pret Action Logement, un pret epargne logement, ou d\u2019autres aides. Il finance une partie du bien (en general 20 a 40% selon la zone), le reste etant finance par les autres prets.",
  },
  {
    question: "Quel est le montant maximum du PTZ ?",
    answer:
      "Le PTZ est calcule sur la base du cout total de l\u2019operation (plafonne a un certain montant selon zone et foyer), multiplie par un taux de quotite (40% en zones Abis et A, 20% en B1, B2, C). Le simulateur ci-dessus applique ces baremes pour vous donner une estimation.",
  },
] as const;

export default function EligibilitePTZPage() {
  const [zone, setZone] = useState<string>("B1");
  const [revenuFiscal, setRevenuFiscal] = useState(40000);
  const [tailleFoyer, setTailleFoyer] = useState(2);
  const [coutOp, setCoutOp] = useState(250000);
  const [showLeadModal, setShowLeadModal] = useState(false);

  const params: ParamsPTZ = {
    zone,
    revenu_fiscal: revenuFiscal,
    taille_foyer: tailleFoyer,
    cout_operation: coutOp,
  };
  const result = calculerPTZ(params);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--rouge-francais)]">
          Outil gratuit
        </p>
        <h1 className="mb-3 text-3xl font-extrabold text-[var(--bleu-marine)] md:text-4xl">
          Éligibilité au PTZ 2026
        </h1>
        <p className="text-gray-600">
          Vérifiez votre éligibilité au Prêt à Taux Zéro et estimez le montant selon votre zone et
          vos revenus.
        </p>
      </div>

      {/* Calculator card */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-semibold text-[var(--bleu-marine)]">Votre situation</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Zone */}
          <div className="sm:col-span-2">
            <label htmlFor="ptz-zone" className="mb-1 block text-sm font-medium text-gray-700">
              Zone géographique du bien
            </label>
            <select
              id="ptz-zone"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            >
              {ZONES.map((z) => (
                <option key={z.value} value={z.value}>
                  {z.label}
                </option>
              ))}
            </select>
          </div>

          {/* Revenu fiscal */}
          <div>
            <label htmlFor="ptz-rfr" className="mb-1 block text-sm font-medium text-gray-700">
              Revenu fiscal de référence N-2 (EUR/an)
            </label>
            <input
              id="ptz-rfr"
              type="number"
              min={0}
              step={1000}
              value={revenuFiscal}
              onChange={(e) => setRevenuFiscal(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">
              Visible sur votre avis d&apos;imposition (case 1DFR ou somme des cases).
            </p>
          </div>

          {/* Taille foyer */}
          <div>
            <label htmlFor="ptz-foyer" className="mb-1 block text-sm font-medium text-gray-700">
              Personnes dans le foyer
            </label>
            <input
              id="ptz-foyer"
              type="number"
              min={1}
              max={8}
              value={tailleFoyer}
              onChange={(e) => setTailleFoyer(parseInt(e.target.value) || 1)}
              className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
          </div>

          {/* Cout operation */}
          <div className="sm:col-span-2">
            <label htmlFor="ptz-cout" className="mb-1 block text-sm font-medium text-gray-700">
              Cout total de l&apos;operation (EUR)
            </label>
            <input
              id="ptz-cout"
              type="number"
              min={0}
              step={1000}
              value={coutOp}
              onChange={(e) => setCoutOp(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">
              Prix du bien + frais de notaire + travaux eventuels.
            </p>
          </div>
        </div>

        {/* Result */}
        <div className="mt-6">
          {result.eligible ? (
            <div className="rounded-lg border border-green-300 bg-green-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-green-500 px-3 py-0.5 text-xs font-bold uppercase text-white">
                  Éligible PTZ
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Montant PTZ estimé</p>
                  <p className="mt-1 text-2xl font-extrabold text-green-700">
                    {fmt(result.montant)}
                  </p>
                  <p className="text-xs text-gray-400">EUR</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Période différée</p>
                  <p className="mt-1 text-2xl font-extrabold text-[var(--bleu-marine)]">
                    {result.duree_differee}
                  </p>
                  <p className="text-xs text-gray-400">ans</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Durée remboursement</p>
                  <p className="mt-1 text-2xl font-extrabold text-[var(--bleu-marine)]">
                    {result.duree_remboursement}
                  </p>
                  <p className="text-xs text-gray-400">ans</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-green-700">
                Pendant la période différée, vous ne remboursez pas le PTZ — vos mensualités sont
                allégées.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-red-500 px-3 py-0.5 text-xs font-bold uppercase text-white">
                  Non éligible
                </span>
              </div>
              <p className="text-sm text-red-700">{result.raison_ineligibilite}</p>
            </div>
          )}
        </div>

        <p className="mt-3 text-center text-xs text-gray-400">
          Simulation basée sur les barèmes PTZ 2026. Vérification définitive auprès de votre
          banque ou courtier.
        </p>

        {/* Lead capture */}
        <div className="mt-6 rounded-xl border border-[var(--bleu-secondaire)] bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[var(--bleu-marine)]">Recevez votre éligibilité PTZ par email</p>
              <p className="mt-1 text-sm text-gray-600">Résultat détaillé avec montant, durée et conditions.</p>
            </div>
            <button
              onClick={() => setShowLeadModal(true)}
              className="flex-shrink-0 rounded-xl bg-[var(--bleu-secondaire)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Recevoir par email
            </button>
          </div>
        </div>
      </div>

      {/* CTA parcours */}
      <div className="mt-8 rounded-xl border border-[var(--bleu-secondaire)] bg-white p-6 text-center">
        <p className="mb-1 font-semibold text-[var(--bleu-marine)]">
          Vous souhaitez aller plus loin ?
        </p>
        <p className="mb-4 text-sm text-gray-600">
          Notre parcours complet integre le PTZ dans votre plan de financement global et vous
          accompagne jusqu&apos;a l&apos;acte authentique.
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
          Questions fréquentes sur le PTZ
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
        titre="Recevez votre éligibilité PTZ détaillée"
        description="Un récap personnalisé : capacité d'emprunt, PTZ, budget total."
        showPhone={false}
        showConsent={false}
        onSubmit={() => {}}
      />
    </div>
  );
}
