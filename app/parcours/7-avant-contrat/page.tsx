'use client';

import { useEffect, useState } from "react";
import { StepLayout } from "@/components/parcours/step-layout";
import { getTipsForEtape } from "@/lib/data/tips-par-etape";
import { loadProjet, createEmptyProjet } from "@/lib/storage";
import type { ProjetImmobilier } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";
// TODO: refactor inline CLAUSES to use CONDITIONS_SUSPENSIVES from compromis-rules.ts

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Add N calendar days to a given date */
function addCalendarDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

/** Parse a date string input (YYYY-MM-DD) to Date */
function parseInputDate(val: string): Date | null {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

// ─── Données clauses suspensives ─────────────────────────────────────────────

interface ClauseSuspensive {
  id: string;
  titre: string;
  explication: string;
  obligatoire?: boolean;
}

// TODO: refactor to build from CONDITIONS_SUSPENSIVES (lib/data/compromis-rules.ts) — kept inline for now due to different UI schema (expandable checkboxes)
const CLAUSES: ClauseSuspensive[] = [
  {
    id: "pret",
    titre: "Clause suspensive d'obtention de pret",
    explication:
      "Incluse par defaut si l'achat est finance par emprunt. Protege l'acheteur si le pret est refuse par la banque — vous recuperez votre depot de garantie integrale. Ne JAMAIS la supprimer sauf achat comptant.",
    obligatoire: true,
  },
  {
    id: "servitude",
    titre: "Clause de decouverte de servitude",
    explication:
      "Permet de se retirer si une servitude (droit de passage, vue, etc.) non declaree est decouverte apres la signature. Utile pour les maisons et terrains.",
  },
  {
    id: "permis",
    titre: "Clause d'obtention du permis de construire",
    explication:
      "Indispensable si vous prevoyez des travaux necessitant un permis de construire. Vous annulez si le permis est refuse.",
  },
  {
    id: "vente_bien",
    titre: "Clause suspensive de vente d'un bien",
    explication:
      "Si vous devez vendre votre bien actuel avant de pouvoir acheter. Permet d'annuler sans perdre le depot de garantie si votre bien ne se vend pas dans les delais.",
  },
];

const CLAUSES_CHECK_KEY = "immopilot_clauses_checked";

// ─── Données checklist documents ──────────────────────────────────────────────

interface DocCategorie {
  titre: string;
  items: string[];
}

const DOCS_COMPROMIS: DocCategorie[] = [
  {
    titre: "Documents acheteur",
    items: [
      "Piece d'identite (carte nationale / passeport)",
      "Justificatif de domicile (moins de 3 mois)",
      "Attestation de financement (banque ou courtier)",
    ],
  },
  {
    titre: "Documents vendeur",
    items: [
      "Titre de propriete",
      "Diagnostics techniques obligatoires (DPE, amiante, plomb, etc.)",
      "PV d'AG (3 derniers, si copropriété)",
      "État daté des charges (si copropriété)",
    ],
  },
];

const ALL_DOCS: string[] = DOCS_COMPROMIS.flatMap((c) => c.items);
const DOCS_CHECK_KEY = "immopilot_docs_compromis_checked";

// ─── Tips ─────────────────────────────────────────────────────────────────────

const TIPS = getTipsForEtape(7);

const CHECKLIST = [
  "J'ai lu et compris toutes les clauses suspensives",
  "J'ai vérifié que la clause de prêt est incluse",
  "Le dépôt de garantie est versé chez le notaire",
  "J'ai noté les dates limites (rétractation, prêt, acte)",
];

// ─── Composant : Guide clauses suspensives ────────────────────────────────────

function GuideClauses() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const raw = localStorage.getItem(CLAUSES_CHECK_KEY);
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
    localStorage.setItem(CLAUSES_CHECK_KEY, JSON.stringify(next));
  };

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Guide clauses suspensives</h2>
      <p className="mb-4 text-xs text-gray-500">
        Vérifiez que ces clauses sont présentes dans votre compromis avant de signer
      </p>

      <div className="space-y-3">
        {CLAUSES.map((clause) => {
          const isChecked = checked[clause.id] ?? false;
          return (
            <div
              key={clause.id}
              className={`rounded-lg border px-4 py-3 transition-colors ${
                clause.obligatoire
                  ? "border-red-200 bg-red-50"
                  : "border-[var(--gris-border)] bg-[var(--gris-clair)]"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggle(clause.id)}
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    isChecked
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                  aria-label={isChecked ? "Demarquer" : "Marquer comme incluse"}
                >
                  {isChecked && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[var(--bleu-marine)]">{clause.titre}</p>
                    {clause.obligatoire && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        Obligatoire
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-600 leading-relaxed">{clause.explication}</p>
                  {isChecked && (
                    <p className="mt-1 text-xs font-medium text-green-700">Incluse dans mon compromis</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
        <p className="text-xs text-green-800">
          <strong>{Object.values(checked).filter(Boolean).length} / {CLAUSES.length}</strong> clauses vérifiées
        </p>
      </div>
    </div>
  );
}

// ─── Composant : Calendrier des delais ───────────────────────────────────────

function CalendrierDelais() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [dateSignature, setDateSignature] = useState(todayStr);
  const [delaiPret, setDelaiPret] = useState(45);
  const [delaiActe, setDelaiActe] = useState(90);

  const baseDate = parseInputDate(dateSignature) ?? today;
  const dateRetractation = addCalendarDays(baseDate, 10);
  const dateLimitePret = addCalendarDays(baseDate, delaiPret);
  const datePrevueActe = addCalendarDays(baseDate, delaiActe);

  interface TimelineEvent {
    label: string;
    date: Date;
    color: string;
    note: string;
  }

  const events: TimelineEvent[] = [
    {
      label: "Signature compromis",
      date: baseDate,
      color: "bg-[var(--bleu-secondaire)]",
      note: "Jour J",
    },
    {
      label: "Fin delai de retractation",
      date: dateRetractation,
      color: "bg-orange-500",
      note: "J+10 calendaires (loi SRU)",
    },
    {
      label: "Date limite obtention pret",
      date: dateLimitePret,
      color: "bg-amber-500",
      note: `J+${delaiPret} (ajustable)`,
    },
    {
      label: "Date prevue acte authentique",
      date: datePrevueActe,
      color: "bg-green-600",
      note: `J+${delaiActe} (ajustable)`,
    },
  ];

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Calendrier des delais</h2>
      <p className="mb-4 text-xs text-gray-500">
        Entrez la date de signature pour calculer automatiquement toutes les echeances
      </p>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-3 mb-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="date-signature">
            Date de signature compromis
          </label>
          <input
            id="date-signature"
            type="date"
            value={dateSignature}
            onChange={(e) => setDateSignature(e.target.value)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="delai-pret">
            Delai obtention pret (jours)
          </label>
          <input
            id="delai-pret"
            type="number"
            min={30}
            max={90}
            value={delaiPret}
            onChange={(e) => setDelaiPret(parseInt(e.target.value) || 45)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
          <p className="mt-0.5 text-xs text-gray-400">Generalement 45 a 60 jours</p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="delai-acte">
            Delai acte authentique (jours)
          </label>
          <input
            id="delai-acte"
            type="number"
            min={60}
            max={180}
            value={delaiActe}
            onChange={(e) => setDelaiActe(parseInt(e.target.value) || 90)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
          <p className="mt-0.5 text-xs text-gray-400">Generalement 90 a 120 jours</p>
        </div>
      </div>

      {/* Visual timeline */}
      <div className="space-y-3">
        {events.map((ev, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Dot + connector */}
            <div className="flex flex-col items-center">
              <div className={`h-4 w-4 flex-shrink-0 rounded-full ${ev.color}`} />
              {i < events.length - 1 && (
                <div className="h-8 w-0.5 bg-gray-200" />
              )}
            </div>
            {/* Content */}
            <div className={`flex-1 rounded-lg px-3 py-2 ${i === 0 ? "bg-blue-50 border border-blue-200" : "bg-[var(--gris-clair)]"}`}>
              <div className="flex items-center justify-between flex-wrap gap-1">
                <p className="text-sm font-semibold text-gray-800">{ev.label}</p>
                <p className="text-sm font-bold text-[var(--bleu-marine)]">{formatDate(ev.date)}</p>
              </div>
              <p className="text-xs text-gray-500">{ev.note}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Les dates ci-dessus sont calculées sur la base de la date de signature saisie. Vérifiez les délais exacts dans votre compromis.
      </p>
    </div>
  );
}

// ─── Composant : Checklist documents compromis ────────────────────────────────

function ChecklistDocumentsCompromis() {
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(DOCS_CHECK_KEY);
    if (raw) {
      try {
        setChecked(JSON.parse(raw) as boolean[]);
      } catch {
        setChecked(new Array(ALL_DOCS.length).fill(false));
      }
    } else {
      setChecked(new Array(ALL_DOCS.length).fill(false));
    }
  }, []);

  const toggle = (idx: number) => {
    const next = checked.map((v, i) => (i === idx ? !v : v));
    setChecked(next);
    localStorage.setItem(DOCS_CHECK_KEY, JSON.stringify(next));
  };

  const totalChecked = checked.filter(Boolean).length;
  const total = ALL_DOCS.length;

  let globalIdx = 0;

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-[var(--bleu-marine)]">Checklist documents compromis</h2>
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

      <div className="space-y-5">
        {DOCS_COMPROMIS.map((categorie) => {
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
                        aria-label={isChecked ? "Demarquer" : "Marquer comme recu"}
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
          Tous les documents sont rassembles — vous etes pret(e) pour la signature !
        </div>
      )}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function EtapeCompromisPage() {
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const p = loadProjet() ?? createEmptyProjet();
    setProjet(p);
    setLoaded(true);
  }, []);

  if (!loaded || !projet) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-secondaire)] border-t-transparent" />
      </div>
    );
  }

  const tools = (
    <div className="space-y-5">
      <GuideClauses />
      <CalendrierDelais />
      <ChecklistDocumentsCompromis />
    </div>
  );

  return (
    <StepLayout
      etape={7}
      guide={
        <p>
          Le compromis de vente (ou promesse synallagmatique) engage juridiquement les deux parties.
          C&apos;est l&apos;étape la plus importante du processus. Vous disposez d&apos;un délai de rétractation
          de 10 jours calendaires après la signature (loi SRU).
        </p>
      }
      outils={tools}
      tips={TIPS}
      checklist={CHECKLIST}
    />
  );
}
