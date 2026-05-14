'use client';

import { useEffect, useState } from "react";
import { StepLayout } from "@/components/parcours/step-layout";
import { getTipsForEtape } from "@/lib/data/tips-par-etape";
import { loadProjet, createEmptyProjet } from "@/lib/storage";
import type { ProjetImmobilier } from "@/lib/types";
import { fmt } from "@/lib/utils/format";
import { LeadModal } from "@/components/formulaires/lead-modal";

const TIPS = getTipsForEtape(3);

const CHECKLIST = [
  "J'ai rassemblé mes 3 derniers bulletins de salaire",
  "J'ai mes 2 derniers avis d'imposition",
  "J'ai un justificatif d'apport (relevé épargne)",
  "J'ai contacté ma banque ou un courtier",
  "J'ai obtenu un accord de principe écrit",
];

const DOCUMENTS_ACCORD = [
  { nom: "Pièce d'identité", detail: "CNI ou passeport en cours de validité" },
  { nom: "Justificatif de domicile", detail: "Moins de 3 mois (facture, quittance)" },
  { nom: "3 derniers bulletins de salaire", detail: "Ou bilans si indépendant" },
  { nom: "2 derniers avis d'imposition", detail: "Revenus N-1 et N-2" },
  { nom: "Relevés bancaires 3 mois", detail: "Tous comptes (courant + épargne)" },
  { nom: "Justificatif d'apport", detail: "Relevé épargne, attestation donation, etc." },
  { nom: "Tableau d'amortissement", detail: "Si crédits en cours" },
];

export default function AccordBancairePage() {
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);
  const [showCourtierModal, setShowCourtierModal] = useState(false);

  useEffect(() => {
    setProjet(loadProjet() ?? createEmptyProjet());
  }, []);

  if (!projet) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-action)] border-t-transparent" />
      </div>
    );
  }

  const revenus = projet.revenus_net + (projet.revenus_conjoint ?? 0);

  const tools = (
    <div className="space-y-6">
      {/* Resume capacite */}
      {projet.capacite_emprunt > 0 && (
        <div className="card-hero">
          <p className="text-sm font-semibold text-blue-200">Votre capacité calculée</p>
          <p className="mt-1 text-2xl font-extrabold text-white">{fmt(projet.capacite_emprunt)} EUR</p>
          <p className="mt-1 text-sm text-blue-200/70">
            Revenus : {fmt(revenus)} EUR/mois &middot; Apport : {fmt(projet.apport)} EUR
            {projet.eligible_ptz && ` · PTZ : ${fmt(projet.montant_ptz)} EUR`}
          </p>
        </div>
      )}

      {/* Documents a preparer */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-5">
        <h2 className="mb-4 font-semibold text-[var(--bleu-marine)]">Documents à préparer pour la banque</h2>
        <div className="space-y-3">
          {DOCUMENTS_ACCORD.map((doc) => (
            <div key={doc.nom} className="flex items-start gap-3 rounded-lg bg-[var(--gris-fond)] px-4 py-3">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 border-gray-300 text-[10px]">&nbsp;</span>
              <div>
                <p className="text-sm font-semibold text-[var(--bleu-marine)]">{doc.nom}</p>
                <p className="text-xs text-gray-500">{doc.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conseil */}
      <div className="rounded-xl border-l-4 border-l-blue-500 bg-blue-50 p-4">
        <div className="flex items-start gap-2">
          <span>💡</span>
          <div>
            <p className="text-sm font-semibold">Accord de principe ≠ offre de pret</p>
            <p className="mt-0.5 text-sm text-gray-700">
              L&apos;accord de principe est un &quot;feu vert&quot; indicatif de la banque. Il n&apos;engage ni vous ni la banque.
              Mais il renforce énormément votre crédibilité auprès du vendeur quand vous faites une offre.
            </p>
          </div>
        </div>
      </div>

      {/* CTA courtier */}
      <div className="rounded-xl border border-[var(--bleu-secondaire)] bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-[var(--bleu-marine)]">Un courtier peut comparer 100+ banques pour vous</p>
            <p className="mt-1 text-sm text-gray-600">Service gratuit — un courtier partenaire vous rappelle sous 24h.</p>
          </div>
          <button
            onClick={() => setShowCourtierModal(true)}
            className="flex-shrink-0 rounded-xl bg-[var(--bleu-secondaire)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Être rappelé
          </button>
        </div>
      </div>

      {/* Lien dossier financement */}
      <div className="card-hero">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">Dossier de financement</p>
            <p className="mt-1 text-xs text-blue-200/70">Générez un dossier complet à présenter à votre banque.</p>
          </div>
          <a
            href="/parcours/dossier-financement"
            className="flex-shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[var(--bleu-marine)] hover:opacity-90"
          >
            Générer le PDF
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <StepLayout
        etape={3}
        guide={
          <p>
            Avant de visiter des biens, obtenez un accord de principe de votre banque.
            C&apos;est une attestation qui prouve que vous pouvez financer votre projet.
            Ça crédibilise votre offre et évite les mauvaises surprises.
          </p>
        }
        outils={tools}
        tips={TIPS}
        checklist={CHECKLIST}
      />
      <LeadModal
        isOpen={showCourtierModal}
        onClose={() => setShowCourtierModal(false)}
        source="courtier"
        etape={3}
        titre="Être rappelé par un courtier"
        description="Un courtier partenaire vous rappelle sous 24h pour étudier votre dossier."
        showPhone={true}
        showConsent={true}
        onSubmit={() => {}}
      />
    </>
  );
}
