'use client';

import { useEffect, useState } from "react";
import { StepLayout } from "@/components/parcours/step-layout";
import { getTipsForEtape } from "@/lib/data/tips-par-etape";
import { loadProjet, createEmptyProjet } from "@/lib/storage";
import type { ProjetImmobilier } from "@/lib/types";
import { fmt } from "@/lib/utils/format";

const TIPS = getTipsForEtape(3);

const CHECKLIST = [
  "J'ai rassemble mes 3 derniers bulletins de salaire",
  "J'ai mes 2 derniers avis d'imposition",
  "J'ai un justificatif d'apport (releve epargne)",
  "J'ai contacte ma banque ou un courtier",
  "J'ai obtenu un accord de principe ecrit",
];

const DOCUMENTS_ACCORD = [
  { nom: "Piece d'identite", detail: "CNI ou passeport en cours de validite" },
  { nom: "Justificatif de domicile", detail: "Moins de 3 mois (facture, quittance)" },
  { nom: "3 derniers bulletins de salaire", detail: "Ou bilans si independant" },
  { nom: "2 derniers avis d'imposition", detail: "Revenus N-1 et N-2" },
  { nom: "Releves bancaires 3 mois", detail: "Tous comptes (courant + epargne)" },
  { nom: "Justificatif d'apport", detail: "Releve epargne, attestation donation, etc." },
  { nom: "Tableau d'amortissement", detail: "Si credits en cours" },
];

export default function AccordBancairePage() {
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);

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
          <p className="text-sm font-semibold text-blue-200">Votre capacite calculee</p>
          <p className="mt-1 text-2xl font-extrabold text-white">{fmt(projet.capacite_emprunt)} EUR</p>
          <p className="mt-1 text-sm text-blue-200/70">
            Revenus : {fmt(revenus)} EUR/mois &middot; Apport : {fmt(projet.apport)} EUR
            {projet.eligible_ptz && ` · PTZ : ${fmt(projet.montant_ptz)} EUR`}
          </p>
        </div>
      )}

      {/* Documents a preparer */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-5">
        <h2 className="mb-4 font-semibold text-[var(--bleu-marine)]">Documents a preparer pour la banque</h2>
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
      <div className="rounded-xl border-l-3 border-l-blue-500 bg-blue-50 p-4">
        <div className="flex items-start gap-2">
          <span>💡</span>
          <div>
            <p className="text-sm font-semibold">Accord de principe ≠ offre de pret</p>
            <p className="mt-0.5 text-sm text-gray-700">
              L&apos;accord de principe est un &quot;feu vert&quot; indicatif de la banque. Il n&apos;engage ni vous ni la banque.
              Mais il renforce enormement votre credibilite aupres du vendeur quand vous faites une offre.
            </p>
          </div>
        </div>
      </div>

      {/* Lien dossier financement */}
      <div className="card-hero">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">Dossier de financement</p>
            <p className="mt-1 text-xs text-blue-200/70">Generez un dossier complet a presenter a votre banque.</p>
          </div>
          <a
            href="/parcours/dossier-financement"
            className="flex-shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[var(--bleu-marine)] hover:opacity-90"
          >
            Generer le PDF
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <StepLayout
      etape={3}
      guide={
        <p>
          Avant de visiter des biens, obtenez un accord de principe de votre banque.
          C&apos;est une attestation qui prouve que vous pouvez financer votre projet.
          Ca credibilise votre offre et evite les mauvaises surprises.
        </p>
      }
      outils={tools}
      tips={TIPS}
      checklist={CHECKLIST}
    />
  );
}
