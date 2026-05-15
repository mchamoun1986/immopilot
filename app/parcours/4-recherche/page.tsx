'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/parcours/step-layout";
import { getTipsForEtape } from "@/lib/data/tips-par-etape";
import { SEUILS_DPE, CALENDRIER_PASSOIRES } from "@/lib/data/dpe-rules";
import { loadProjet, createEmptyProjet } from "@/lib/storage";
import { createDossier } from "@/lib/dossiers";
import type { ProjetImmobilier } from "@/lib/types";

import { VISITE_CHECKLIST, ALL_CHECKLIST_ITEMS as ALL_ITEMS } from "@/lib/data/checklist-visite-items";
const CHECKLIST_VISITE_KEY = "immopilot_checklist_visite";

// ─── DPE classes ──────────────────────────────────────────────────────────────

// Build DPE display from centralized data
const DPE_COLORS: Record<string, string> = {
  A: "#009900", B: "#52a800", C: "#99cc00", D: "#ffcc00",
  E: "#ff9900", F: "#ff6600", G: "#cc0000",
};

interface DpeInfo {
  classe: string;
  couleur: string;
  conso: string;
  note: string;
  alerte?: string;
}

const DPE_CLASSES: DpeInfo[] = SEUILS_DPE.map((s) => {
  const passoire = CALENDRIER_PASSOIRES.find((p) => p.classe === s.classe);
  return {
    classe: s.classe,
    couleur: DPE_COLORS[s.classe] || "#999",
    conso: s.energie_max_kwh === Infinity ? `> 420 kWh/m2/an` : `< ${s.energie_max_kwh} kWh/m2/an`,
    note: s.qualificatif,
    ...(passoire ? { alerte: passoire.description } : {}),
  };
});

// ─── Tips ─────────────────────────────────────────────────────────────────────

const TIPS = getTipsForEtape(4);

const CHECKLIST = [
  "J'ai préparé ma checklist de visite",
  "J'ai visité au moins un bien",
  "J'ai créé un dossier pour chaque bien intéressant",
  "J'ai demandé les documents nécessaires",
];

// ─── Composant : Checklist de visite ─────────────────────────────────────────

function ChecklistVisite() {
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(CHECKLIST_VISITE_KEY);
    if (raw) {
      try { setChecked(JSON.parse(raw) as boolean[]); }
      catch { setChecked(new Array(ALL_ITEMS.length).fill(false)); }
    } else {
      setChecked(new Array(ALL_ITEMS.length).fill(false));
    }
  }, []);

  const toggle = (idx: number) => {
    const next = checked.map((v, i) => (i === idx ? !v : v));
    setChecked(next);
    localStorage.setItem(CHECKLIST_VISITE_KEY, JSON.stringify(next));
  };

  const totalChecked = checked.filter(Boolean).length;
  const total = ALL_ITEMS.length;

  // Build flat index per category
  let globalIdx = 0;

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-[var(--bleu-marine)]">Checklist de visite</h2>
        <span className="rounded-full bg-[var(--gris-clair)] px-3 py-1 text-xs font-semibold text-gray-600">
          {totalChecked} / {total} points
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[var(--bleu-secondaire)] transition-all duration-300"
          style={{ width: `${total > 0 ? (totalChecked / total) * 100 : 0}%` }}
        />
      </div>

      <div className="space-y-5">
        {VISITE_CHECKLIST.map((categorie) => {
          const catStart = globalIdx;
          globalIdx += categorie.items.length;

          return (
            <div key={categorie.titre}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {categorie.titre}
              </h3>
              <ul className="space-y-2">
                {categorie.items.map((item, localIdx) => {
                  const idx = catStart + localIdx;
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
                        aria-label={isChecked ? "Démarquer" : "Marquer comme vérifié"}
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
            </div>
          );
        })}
      </div>

      {totalChecked === total && total > 0 && (
        <div className="mt-4 rounded-lg border border-green-300 bg-green-50 p-3 text-sm font-semibold text-green-800">
          Checklist complète — vous avez vérifié tous les points importants !
        </div>
      )}
    </div>
  );
}

// ─── Composant : Guide DPE ────────────────────────────────────────────────────

function GuideDPE() {
  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Guide DPE — Étiquettes énergétiques</h2>
      <p className="mb-4 text-xs text-gray-500">
        Diagnostic de Performance Énergétique — obligatoire dans toute annonce immobilière
      </p>

      <div className="space-y-2">
        {DPE_CLASSES.map((dpe) => (
          <div
            key={dpe.classe}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
              ["E", "F", "G"].includes(dpe.classe)
                ? "border border-orange-200 bg-orange-50"
                : "bg-[var(--gris-clair)]"
            }`}
          >
            {/* Badge classe */}
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded font-bold text-white text-base"
              style={{ backgroundColor: dpe.couleur }}
            >
              {dpe.classe}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-800">{dpe.conso}</span>
                <span className="text-xs text-gray-500">{dpe.note}</span>
              </div>
              {dpe.alerte && (
                <p className="mt-0.5 text-xs font-medium text-orange-700">{dpe.alerte}</p>
              )}
            </div>

            {/* Warning icon for E/F/G */}
            {["E", "F", "G"].includes(dpe.classe) && (
              <span className="text-orange-500 text-base flex-shrink-0">&#9888;</span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Source : réglementation RE2020 et loi Climat et Résilience 2021. Les classes F et G sont progressivement
        interdites à la location. Un DPE médiocre impacte directement la valeur de revente.
      </p>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function EtapeRecherchePage() {
  const router = useRouter();
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const p = loadProjet() ?? createEmptyProjet();
    setProjet(p);
    setLoaded(true);
  }, []);

  function handleCreateDossier() {
    const d = createDossier();
    router.push(`/dossiers/${d.id}`);
  }

  if (!loaded || !projet) {
    return (
      <div role="status" aria-label="Chargement en cours" className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-secondaire)] border-t-transparent" />
      </div>
    );
  }

  const tools = (
    <div className="space-y-5">
      {/* Create dossier CTA */}
      <div className="rounded-lg border border-[var(--bleu-secondaire)] bg-blue-50 p-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-[var(--bleu-marine)] text-sm">
            Un bien vous intéresse ?
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            Créez un dossier pour centraliser toutes les infos, checklist et analyse financière.
          </p>
        </div>
        <button
          onClick={handleCreateDossier}
          className="flex-shrink-0 rounded-lg bg-[var(--bleu-secondaire)] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Créer un dossier
        </button>
      </div>

      <ChecklistVisite />
      <GuideDPE />
    </div>
  );

  return (
    <StepLayout
      etape={4}
      guide={
        <p>
          Vous connaissez votre budget et votre capacité. Il est temps de chercher le bien
          idéal. Préparez vos visites avec notre checklist et créez un dossier pour chaque
          bien qui vous intéresse.
        </p>
      }
      outils={tools}
      tips={TIPS}
      checklist={CHECKLIST}
    />
  );
}
