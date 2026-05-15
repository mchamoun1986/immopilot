'use client';

import { useEffect, useState } from "react";
import { StepLayout } from "@/components/parcours/step-layout";
import { getTipsForEtape } from "@/lib/data/tips-par-etape";
import { loadProjet, createEmptyProjet } from "@/lib/storage";
import type { ProjetImmobilier } from "@/lib/types";
import { calculerFraisNotaire } from "@/lib/calculateurs/notaire";
import { fmt } from "@/lib/utils/format";

// ─── Storage keys ─────────────────────────────────────────────────────────────

const JOUR_J_CHECK_KEY = "immopilot_jour_j_checked";

// ─── Données checklist jour J ─────────────────────────────────────────────────

const JOUR_J_ITEMS = [
  "Pièce d'identité en cours de validité",
  "RIB pour le virement du solde",
  "Attestation d'assurance habitation (obligatoire AVANT remise des clés)",
  "Chèque de banque ou preuve de virement pour les frais de notaire",
  "Vérifier que tous les diagnostics sont annexés",
  "Vérifier les servitudes mentionnées",
  "Compter les jeux de clés remis",
  "Relever les compteurs (eau, élec, gaz)",
];

// ─── Données guide deroulement ────────────────────────────────────────────────

const DEROULEMENT_ITEMS = [
  {
    titre: "Lecture de l'acte",
    detail: "Le notaire lit l'acte intégralement. Comptez 1h30 à 2h selon la complexité du dossier.",
  },
  {
    titre: "Questions autorisées",
    detail: "Vous pouvez poser des questions à tout moment. N'hésitez pas — le notaire est là pour ça.",
  },
  {
    titre: "Signature",
    detail: "Signature électronique ou manuscrite selon l'étude. Chaque page est paraphée, dernière page signée.",
  },
  {
    titre: "Remise des clés",
    detail: "Les clés vous sont remises immédiatement après la signature de l'acte.",
  },
  {
    titre: "Versement du prix",
    detail: "Le notaire verse le prix au vendeur sous 48h après la signature.",
  },
  {
    titre: "Titre de propriété",
    detail: "Vous recevrez le titre de propriété définitif sous 2 à 6 mois (délai de publication).",
  },
];

// ─── Tips ─────────────────────────────────────────────────────────────────────

const TIPS = getTipsForEtape(9);

const CHECKLIST = [
  "J'ai reçu le décompte détaillé des frais de notaire",
  "J'ai souscrit l'assurance habitation",
  "J'ai préparé tous les documents pour le jour J",
  "J'ai relevé les compteurs le jour de la signature",
];

// ─── Composant : Calculateur frais de notaire ─────────────────────────────────

function CalculateurFraisNotaire({ budgetInitial }: { budgetInitial: number }) {
  const [prix, setPrix] = useState(budgetInitial > 0 ? budgetInitial : 250000);
  const [type, setType] = useState<"ancien" | "neuf">("ancien");

  const result = calculerFraisNotaire(prix, type);

  const pct = prix > 0 ? ((result.total / prix) * 100).toFixed(1) : "0.0";

  const lignes = [
    { label: "Droits de mutation", montant: result.droits_mutation, note: type === "ancien" ? "~5,81% du prix" : "~0,71% du prix" },
    { label: "Emoluments du notaire", montant: result.emoluments, note: "Baremes degres par tranches" },
    { label: "Debours et frais divers", montant: result.debours, note: "Forfait (hypotheque, cadastre, etc.)" },
    { label: "Contribution securite immobiliere", montant: result.contribution_securite, note: "0,1% du prix" },
  ];

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Calculateur frais de notaire</h2>
      <p className="mb-4 text-xs text-gray-500">
        Estimez les frais d&apos;acquisition selon le prix et le type de bien
      </p>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2 mb-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="prix-bien">
            Prix du bien (EUR)
          </label>
          <input
            id="prix-bien"
            type="number"
            min={50000}
            max={5000000}
            step={1000}
            value={prix}
            onChange={(e) => setPrix(parseInt(e.target.value) || 0)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Type de bien
          </label>
          <div className="flex rounded border border-[var(--gris-border)] overflow-hidden">
            <button
              onClick={() => setType("ancien")}
              className={`flex-1 py-1.5 text-sm font-medium transition-colors ${
                type === "ancien"
                  ? "bg-[var(--bleu-secondaire)] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Ancien
            </button>
            <button
              onClick={() => setType("neuf")}
              className={`flex-1 py-1.5 text-sm font-medium transition-colors ${
                type === "neuf"
                  ? "bg-[var(--bleu-secondaire)] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Neuf
            </button>
          </div>
          {type === "neuf" && (
            <p className="mt-1 text-xs text-gray-400">
              Inclut les VEFA et les biens de moins de 5 ans jamais habites
            </p>
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-lg border border-[var(--gris-border)] overflow-x-auto mb-4">
        <table className="min-w-[360px] w-full text-sm">
          <thead>
            <tr className="bg-[var(--gris-clair)] border-b border-[var(--gris-border)]">
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Poste</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--gris-border)]">
            {lignes.map((ligne) => (
              <tr key={ligne.label} className="hover:bg-gray-50">
                <td className="px-3 py-2.5">
                  <p className="font-medium text-gray-800">{ligne.label}</p>
                  <p className="text-xs text-gray-400">{ligne.note}</p>
                </td>
                <td className="px-3 py-2.5 text-right font-semibold text-gray-800 whitespace-nowrap">
                  {fmt(ligne.montant)} EUR
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="rounded-lg border-2 border-[var(--bleu-secondaire)] bg-blue-50 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[var(--bleu-marine)]">Total frais de notaire</p>
          <p className="text-xs text-blue-600">{pct}% du prix d&apos;achat</p>
        </div>
        <p className="text-xl font-bold text-[var(--bleu-secondaire)]">{fmt(result.total)} EUR</p>
      </div>
    </div>
  );
}

// ─── Composant : Checklist jour J ─────────────────────────────────────────────

function ChecklistJourJ() {
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(JOUR_J_CHECK_KEY);
    if (raw) {
      try {
        setChecked(JSON.parse(raw) as boolean[]);
      } catch {
        setChecked(new Array(JOUR_J_ITEMS.length).fill(false));
      }
    } else {
      setChecked(new Array(JOUR_J_ITEMS.length).fill(false));
    }
  }, []);

  const toggle = (idx: number) => {
    const next = checked.map((v, i) => (i === idx ? !v : v));
    setChecked(next);
    localStorage.setItem(JOUR_J_CHECK_KEY, JSON.stringify(next));
  };

  const totalChecked = checked.filter(Boolean).length;
  const total = JOUR_J_ITEMS.length;

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-[var(--bleu-marine)]">Checklist jour J</h2>
        <span className="rounded-full bg-[var(--gris-clair)] px-3 py-1 text-xs font-semibold text-gray-600">
          {totalChecked} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[var(--bleu-secondaire)] transition-all duration-300"
          style={{ width: `${total > 0 ? (totalChecked / total) * 100 : 0}%` }}
        />
      </div>

      <ul className="space-y-2">
        {JOUR_J_ITEMS.map((item, idx) => {
          const isChecked = checked[idx] ?? false;
          return (
            <li key={item} className="flex items-start gap-3">
              <button
                onClick={() => toggle(idx)}
                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  isChecked
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 bg-white"
                }`}
                aria-label={isChecked ? "Demarquer" : "Marquer comme pret"}
              >
                {isChecked && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </button>
              <span className={`text-sm ${isChecked ? "text-gray-400 line-through" : "text-gray-700"}`}>
                {item}
              </span>
            </li>
          );
        })}
      </ul>

      {totalChecked === total && total > 0 && (
        <div className="mt-4 rounded-lg border border-green-300 bg-green-50 p-3 text-sm font-semibold text-green-800">
          Vous êtes prêt(e) pour le jour J !
        </div>
      )}
    </div>
  );
}

// ─── Composant : Guide deroulement ────────────────────────────────────────────

function GuideDeroulement() {
  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Déroulement de la signature</h2>
      <p className="mb-4 text-xs text-gray-500">
        Ce qui se passe le jour de la signature chez le notaire
      </p>

      <div className="space-y-3">
        {DEROULEMENT_ITEMS.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            {/* Step number + connector */}
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--bleu-secondaire)] text-xs font-bold text-white">
                {i + 1}
              </div>
              {i < DEROULEMENT_ITEMS.length - 1 && (
                <div className="h-6 w-0.5 bg-gray-200" />
              )}
            </div>
            {/* Content */}
            <div className="flex-1 pb-2">
              <p className="text-sm font-semibold text-[var(--bleu-marine)]">{item.titre}</p>
              <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function EtapeNotairePage() {
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const p = loadProjet() ?? createEmptyProjet();
    setProjet(p);
    setLoaded(true);
  }, []);

  if (!loaded || !projet) {
    return (
      <div role="status" aria-label="Chargement en cours" className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-secondaire)] border-t-transparent" />
      </div>
    );
  }

  const tools = (
    <div className="space-y-5">
      <CalculateurFraisNotaire budgetInitial={projet.budget_max} />
      <ChecklistJourJ />
      <GuideDeroulement />
    </div>
  );

  return (
    <StepLayout
      etape={9}
      guide={
        <p>
          L&apos;acte authentique est la dernière étape juridique. Le notaire officialise la vente et vous remet les clés.
          Les frais de notaire representent 7 a 8% du prix dans l&apos;ancien et 2 a 3% dans le neuf.
        </p>
      }
      outils={tools}
      tips={TIPS}
      checklist={CHECKLIST}
    />
  );
}
