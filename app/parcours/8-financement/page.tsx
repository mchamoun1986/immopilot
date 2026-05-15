'use client';

import { useEffect, useState } from "react";
import { StepLayout } from "@/components/parcours/step-layout";
import { getTipsForEtape } from "@/lib/data/tips-par-etape";
import { loadProjet, createEmptyProjet } from "@/lib/storage";
import type { ProjetImmobilier, LeadCapture } from "@/lib/types";
import { LeadModal } from "@/components/formulaires/lead-modal";
import { fmt } from "@/lib/utils/format";
import { calculerMensualite } from "@/lib/calculateurs/credit";
import { LOI_LEMOINE, TAUX_ASSURANCE_INDICATIFS } from "@/lib/data/assurance-emprunteur";

// ─── Types internes ───────────────────────────────────────────────────────────

interface OffreBanque {
  nom: string;
  taux: string;
  tauxAssurance: string;
  fraisDossier: string;
  typeGarantie: "caution" | "hypotheque" | "";
}

const EMPTY_OFFRE: OffreBanque = {
  nom: "",
  taux: "",
  tauxAssurance: "",
  fraisDossier: "",
  typeGarantie: "",
};

const COMPARATEUR_KEY = "immopilot_comparateur_banques";
const NEGOCIATION_KEY = "immopilot_negociation_checked";
const DOCS_BANQUE_KEY = "immopilot_docs_banque_checked";

// ─── Points de négociation ────────────────────────────────────────────────────

interface PointNegociation {
  id: string;
  titre: string;
  detail: string;
}

const POINTS_NEGOCIATION: PointNegociation[] = [
  {
    id: "taux",
    titre: "Taux nominal",
    detail: "Comparer au moins 3 banques — 0,1% de différence peut représenter plusieurs milliers d'euros sur la durée.",
  },
  {
    id: "assurance",
    titre: "Assurance emprunteur (délégation)",
    detail:
      "La délégation d'assurance (loi Lemoine) permet de changer à tout moment, sans frais. Économie typique : 10 000 à 15 000 EUR sur la durée du prêt.",
  },
  {
    id: "frais",
    titre: "Frais de dossier",
    detail: "Souvent supprimables ou fortement négociables, en particulier si vous avez plusieurs offres concurrentes.",
  },
  {
    id: "ira",
    titre: "IRA (Indemnités Remboursement Anticipé)",
    detail:
      "Demandez la suppression ou le plafonnement. En cas de revente anticipée, cela peut vous économiser 2 000 à 5 000 EUR.",
  },
  {
    id: "garantie",
    titre: "Garantie : caution vs hypothèque",
    detail:
      "Privilégier la caution (Crédit Logement, CAMCA) plutôt que l'hypothèque — moins chère et une partie vous est restituée à la fin du prêt.",
  },
];

// ─── Checklist documents banque ───────────────────────────────────────────────

const DOCS_BANQUE: string[] = [
  "3 derniers bulletins de salaire",
  "2 derniers avis d'imposition",
  "3 derniers relevés bancaires",
  "Justificatif d'apport",
  "Compromis de vente signé",
  "Pièce d'identité",
  "Justificatif de domicile",
];

// ─── Tips ─────────────────────────────────────────────────────────────────────

const TIPS = getTipsForEtape(8);

const CHECKLIST = [
  "J'ai contacté au moins 3 banques",
  "J'ai comparé les offres (taux, assurance, frais)",
  "J'ai négocié les IRA et frais de dossier",
  "J'ai obtenu mon offre de prêt",
];

// ─── Composant : Comparateur simplifié ───────────────────────────────────────

function ComparateurBanques({ projet }: { projet: ProjetImmobilier }) {
  const capital = projet.capacite_emprunt > 0 ? projet.capacite_emprunt : projet.budget_max - projet.apport;
  const duree = projet.duree_souhaitee > 0 ? projet.duree_souhaitee : 20;

  const [offres, setOffres] = useState<OffreBanque[]>([
    { ...EMPTY_OFFRE },
    { ...EMPTY_OFFRE },
    { ...EMPTY_OFFRE },
  ]);

  useEffect(() => {
    const raw = localStorage.getItem(COMPARATEUR_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 3 && parsed.every((o: unknown) => typeof o === "object" && o !== null && "taux" in o)) {
          setOffres(parsed as OffreBanque[]);
        }
      } catch {
        // keep default
      }
    }
  }, []);

  const updateOffre = (idx: number, field: keyof OffreBanque, value: string) => {
    const next = offres.map((o, i) =>
      i === idx ? { ...o, [field]: value } : o
    );
    setOffres(next);
    localStorage.setItem(COMPARATEUR_KEY, JSON.stringify(next));
  };

  // Compute results per offre
  interface ResultatOffre {
    mensualiteCredit: number;
    mensualiteAssurance: number;
    mensualiteTotale: number;
    coutTotalCredit: number;
    coutTotalAssurance: number;
    coutTotal: number;
    valide: boolean;
  }

  const resultats: ResultatOffre[] = offres.map((o) => {
    const taux = parseFloat(o.taux);
    const tauxAss = parseFloat(o.tauxAssurance);
    const frais = parseFloat(o.fraisDossier) || 0;
    if (isNaN(taux) || isNaN(tauxAss) || capital <= 0) {
      return { mensualiteCredit: 0, mensualiteAssurance: 0, mensualiteTotale: 0, coutTotalCredit: 0, coutTotalAssurance: 0, coutTotal: 0, valide: false };
    }
    const mensualiteCredit = calculerMensualite(capital, taux, duree).mensualite;
    const mensualiteAssurance = (capital * tauxAss) / 100 / 12;
    const mensualiteTotale = mensualiteCredit + mensualiteAssurance;
    const mois = duree * 12;
    const coutTotalCredit = mensualiteCredit * mois - capital + frais;
    const coutTotalAssurance = mensualiteAssurance * mois;
    const coutTotal = coutTotalCredit + coutTotalAssurance;
    return { mensualiteCredit, mensualiteAssurance, mensualiteTotale, coutTotalCredit, coutTotalAssurance, coutTotal, valide: true };
  });

  // Find best offer index (lowest coutTotal among valid ones)
  const validIndices = resultats.map((r, i) => r.valide ? i : -1).filter((i) => i >= 0);
  const bestIdx = validIndices.length > 0
    ? validIndices.reduce((best, i) => resultats[i].coutTotal < resultats[best].coutTotal ? i : best, validIndices[0])
    : -1;

  const OFFRE_LABELS = ["Offre 1", "Offre 2", "Offre 3"];

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Comparateur simplifié</h2>
      <p className="mb-1 text-xs text-gray-500">
        Saisissez jusqu&apos;à 3 offres de banques pour les comparer instantanément
      </p>
      {capital > 0 && (
        <p className="mb-4 text-xs text-gray-400">
          Capital à emprunter : <strong className="text-[var(--bleu-marine)]">{fmt(capital)} EUR</strong> — Durée : <strong className="text-[var(--bleu-marine)]">{duree} ans</strong>
        </p>
      )}
      {capital <= 0 && (
        <p className="mb-4 rounded bg-orange-50 border border-orange-200 px-3 py-2 text-xs text-orange-700">
          Renseignez votre capacité d&apos;emprunt à l&apos;étape 2 pour un calcul précis. Les calculs ci-dessous utilisent vos données disponibles.
        </p>
      )}

      <div className="space-y-4">
        {offres.map((offre, idx) => {
          const res = resultats[idx];
          const isBest = bestIdx === idx;

          return (
            <div
              key={idx}
              className={`rounded-lg border px-4 py-3 ${
                isBest && res.valide
                  ? "border-green-400 bg-green-50"
                  : "border-[var(--gris-border)] bg-[var(--gris-clair)]"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--bleu-marine)]">{OFFRE_LABELS[idx]}</h3>
                {isBest && res.valide && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
                    Meilleure offre
                  </span>
                )}
              </div>

              {/* Inputs */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor={`offre-${idx}-nom`}>
                    Nom banque
                  </label>
                  <input
                    id={`offre-${idx}-nom`}
                    type="text"
                    value={offre.nom}
                    onChange={(e) => updateOffre(idx, "nom", e.target.value)}
                    placeholder="Ex. BNP Paribas"
                    className="w-full rounded border border-[var(--gris-border)] bg-white px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor={`offre-${idx}-garantie`}>
                    Type de garantie
                  </label>
                  <select
                    id={`offre-${idx}-garantie`}
                    value={offre.typeGarantie}
                    onChange={(e) => updateOffre(idx, "typeGarantie", e.target.value)}
                    className="w-full rounded border border-[var(--gris-border)] bg-white px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
                  >
                    <option value="">-- Choisir --</option>
                    <option value="caution">Caution (Crédit Logement)</option>
                    <option value="hypotheque">Hypothèque</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor={`offre-${idx}-taux`}>
                    Taux nominal (%)
                  </label>
                  <div className="relative">
                    <input
                      id={`offre-${idx}-taux`}
                      type="number"
                      step="0.01"
                      min={0}
                      max={15}
                      value={offre.taux}
                      onChange={(e) => updateOffre(idx, "taux", e.target.value)}
                      placeholder="Ex. 3.50"
                      className="w-full rounded border border-[var(--gris-border)] bg-white px-3 py-1.5 pr-8 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
                    />
                    <span className="absolute right-2 top-1.5 text-xs text-gray-400">%</span>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor={`offre-${idx}-taux-ass`}>
                    Taux assurance (%)
                  </label>
                  <div className="relative">
                    <input
                      id={`offre-${idx}-taux-ass`}
                      type="number"
                      step="0.01"
                      min={0}
                      max={5}
                      value={offre.tauxAssurance}
                      onChange={(e) => updateOffre(idx, "tauxAssurance", e.target.value)}
                      placeholder="Ex. 0.30"
                      className="w-full rounded border border-[var(--gris-border)] bg-white px-3 py-1.5 pr-8 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
                    />
                    <span className="absolute right-2 top-1.5 text-xs text-gray-400">%</span>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor={`offre-${idx}-frais`}>
                    Frais de dossier (EUR)
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      id={`offre-${idx}-frais`}
                      type="number"
                      min={0}
                      value={offre.fraisDossier}
                      onChange={(e) => updateOffre(idx, "fraisDossier", e.target.value)}
                      placeholder="Ex. 500"
                      className="w-full rounded border border-[var(--gris-border)] bg-white px-3 py-1.5 pr-12 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
                    />
                    <span className="absolute right-2 top-1.5 text-xs text-gray-400">EUR</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              {res.valide && (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded bg-white border border-gray-200 p-2 text-center">
                    <p className="text-xs text-gray-500">Mensualité crédit</p>
                    <p className="text-sm font-bold text-[var(--bleu-marine)]">{fmt(res.mensualiteCredit)} EUR</p>
                  </div>
                  <div className="rounded bg-white border border-gray-200 p-2 text-center">
                    <p className="text-xs text-gray-500">Mensualité assurance</p>
                    <p className="text-sm font-bold text-[var(--bleu-marine)]">{fmt(res.mensualiteAssurance)} EUR</p>
                  </div>
                  <div className={`rounded border p-2 text-center ${isBest ? "border-green-300 bg-green-100" : "bg-white border-gray-200"}`}>
                    <p className="text-xs text-gray-500">Mensualité totale</p>
                    <p className={`text-sm font-bold ${isBest ? "text-green-800" : "text-[var(--bleu-marine)]"}`}>{fmt(res.mensualiteTotale)} EUR</p>
                  </div>
                  <div className={`rounded border p-2 text-center ${isBest ? "border-green-300 bg-green-100" : "bg-white border-gray-200"}`}>
                    <p className="text-xs text-gray-500">Coût total crédit + ass.</p>
                    <p className={`text-sm font-bold ${isBest ? "text-green-800" : "text-[var(--bleu-marine)]"}`}>{fmt(res.coutTotal)} EUR</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Calculs indicatifs sur la base d&apos;un amortissement constant. Le TAEG (Taux Annuel Effectif Global) peut différer selon les banques.
      </p>
    </div>
  );
}

// ─── Composant : Guide négociation ────────────────────────────────────────────

function GuideNegociation() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const raw = localStorage.getItem(NEGOCIATION_KEY);
    if (raw) {
      try {
        setChecked(JSON.parse(raw) as Record<string, boolean>);
      } catch {
        setChecked({});
      }
    }
  }, []);

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem(NEGOCIATION_KEY, JSON.stringify(next));
  };

  const negocie = Object.values(checked).filter(Boolean).length;

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Guide négociation</h2>
      <p className="mb-4 text-xs text-gray-500">
        Cochez les points que vous avez négociés avec votre banque
      </p>

      <div className="space-y-3">
        {POINTS_NEGOCIATION.map((point) => {
          const isNegocie = checked[point.id] ?? false;
          return (
            <div
              key={point.id}
              className={`rounded-lg border px-4 py-3 transition-colors ${
                isNegocie
                  ? "border-green-300 bg-green-50"
                  : "border-[var(--gris-border)] bg-[var(--gris-clair)]"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggle(point.id)}
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    isNegocie
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                  aria-label={isNegocie ? "Marquer comme non négocié" : "Marquer comme négocié"}
                >
                  {isNegocie && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[var(--bleu-marine)]">{point.titre}</p>
                    {isNegocie && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        Négocié
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-600 leading-relaxed">{point.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
        <p className="text-xs text-blue-800">
          <strong>{negocie} / {POINTS_NEGOCIATION.length}</strong> points négociés
        </p>
      </div>
    </div>
  );
}

// ─── Composant : Checklist dossier banque ─────────────────────────────────────

function ChecklistDossierBanque() {
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(DOCS_BANQUE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as boolean[];
        if (Array.isArray(parsed)) {
          // Normalize to current checklist length
          const normalized = DOCS_BANQUE.map((_, i) => parsed[i] ?? false);
          setChecked(normalized);
        } else {
          setChecked(new Array(DOCS_BANQUE.length).fill(false));
        }
      } catch {
        setChecked(new Array(DOCS_BANQUE.length).fill(false));
      }
    } else {
      setChecked(new Array(DOCS_BANQUE.length).fill(false));
    }
  }, []);

  const toggle = (idx: number) => {
    const next = checked.map((v, i) => (i === idx ? !v : v));
    setChecked(next);
    localStorage.setItem(DOCS_BANQUE_KEY, JSON.stringify(next));
  };

  const totalChecked = checked.filter(Boolean).length;
  const total = DOCS_BANQUE.length;

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-[var(--bleu-marine)]">Checklist dossier banque</h2>
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
        {DOCS_BANQUE.map((item, idx) => {
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
                aria-label={isChecked ? "Démarquer" : "Marquer comme préparé"}
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
          Dossier complet — vous pouvez le déposer auprès de vos banques !
        </div>
      )}
    </div>
  );
}

// ─── Gate lead : courtier ─────────────────────────────────────────────────────

function GateLeadCourtier() {
  const [showModal, setShowModal] = useState(false);

  const handleLeadSubmit = (_lead: LeadCapture) => {
    // Modal handles save internally
  };

  return (
    <>
      <div className="rounded-lg border border-[var(--bleu-secondaire)] bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="font-semibold text-[var(--bleu-marine)]">Être mis en relation avec un courtier</p>
            <p className="mt-1 text-sm text-gray-600">
              Un courtier compare les banques pour vous et négocie le meilleur taux. Gratuit pour l&apos;emprunteur.
            </p>
          </div>
          <button
            className="flex-shrink-0 rounded-lg bg-[var(--bleu-secondaire)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            onClick={() => setShowModal(true)}
          >
            Être mis en relation
          </button>
        </div>
      </div>

      <LeadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        source="courtier"
        etape={8}
        titre="Mise en relation avec un courtier"
        description="Un courtier compare les banques pour vous et négocie le meilleur taux. Gratuit pour l'emprunteur."
        showPhone={true}
        showConsent={true}
        onSubmit={handleLeadSubmit}
      />
    </>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function EtapeFinancementPage() {
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
      <ComparateurBanques projet={projet} />
      <GuideNegociation />
      <ChecklistDossierBanque />
      <GateLeadCourtier />

      {/* Assurance emprunteur — source: lib/data/assurance-emprunteur.ts */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-5">
        <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Assurance emprunteur — Loi Lemoine</h2>
        <p className="mb-4 text-xs text-gray-500">
          {LOI_LEMOINE.droit_principal} — en vigueur depuis le {new Date(LOI_LEMOINE.date_entree_vigueur).toLocaleDateString("fr-FR")}
        </p>

        <div className="mb-4 space-y-1">
          {LOI_LEMOINE.conditions.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--bleu-secondaire)]" />
              {c}
            </div>
          ))}
        </div>

        <h3 className="mb-2 text-sm font-semibold text-[var(--bleu-marine)]">Économie potentielle par délégation</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--gris-border)] text-left text-xs text-gray-500">
                <th className="pb-2 pr-3">Âge</th>
                <th className="pb-2 pr-3">Taux banque</th>
                <th className="pb-2">Taux délégation</th>
              </tr>
            </thead>
            <tbody>
              {TAUX_ASSURANCE_INDICATIFS.map((t) => (
                <tr key={t.tranche_age} className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-medium text-[var(--bleu-marine)]">{t.tranche_age}</td>
                  <td className="py-2 pr-3 text-gray-600">{t.taux_banque}</td>
                  <td className="py-2 text-green-700 font-semibold">{t.taux_delegation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Source : meilleurtaux.com, reassurez-moi.fr — indicatif, varie selon profil et garanties choisies.
        </p>
      </div>
    </div>
  );

  return (
    <StepLayout
      etape={8}
      guide={
        <p>
          Vous avez signé le compromis. Vous avez généralement 45 à 60 jours pour obtenir votre prêt.
          C&apos;est le moment de faire jouer la concurrence entre les banques et de négocier chaque élément du crédit.
        </p>
      }
      outils={tools}
      tips={TIPS}
      checklist={CHECKLIST}
    />
  );
}
