'use client';

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDossier, updateDossier, deleteDossier } from "@/lib/dossiers";
import { loadProjet } from "@/lib/storage";
import { calculerFraisNotaire } from "@/lib/calculateurs/notaire";
import { calculerMensualite } from "@/lib/calculateurs/credit";
import type { DossierBien, DpeClasse, DossierStatut, ChecklistItem } from "@/lib/types";
import { fmt } from "@/lib/utils/format";

// ─── Constants ────────────────────────────────────────────────────────────────

const TAUX_DEFAULT = 3.5;

import { DpeBadge } from "@/components/ui/dpe-badge";

const DPE_OPTIONS: DpeClasse[] = ["A", "B", "C", "D", "E", "F", "G"];

const STATUT_OPTIONS: { value: DossierStatut; label: string }[] = [
  { value: "en_recherche", label: "En recherche" },
  { value: "offre", label: "Offre en cours" },
  { value: "compromis", label: "Compromis signé" },
  { value: "financement", label: "Financement" },
  { value: "acte", label: "Acte signé" },
  { value: "termine", label: "Terminé" },
  { value: "abandonne", label: "Abandonné" },
];

import { VISITE_CHECKLIST, ALL_CHECKLIST_ITEMS } from "@/lib/data/checklist-visite-items";


// ─── Helpers ──────────────────────────────────────────────────────────────────

function initChecklist(existing: ChecklistItem[]): ChecklistItem[] {
  // Build a map from existing items
  const existingMap = new Map(existing.map((ci) => [ci.item, ci.ok]));
  return ALL_CHECKLIST_ITEMS.map((item) => ({
    item,
    ok: existingMap.get(item) ?? false,
  }));
}

// ─── Section: Card wrapper ────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--gris-border)] bg-white p-5">
      <h2 className="mb-4 font-semibold text-[var(--bleu-marine)] text-base">{title}</h2>
      {children}
    </div>
  );
}

// ─── Input helpers ────────────────────────────────────────────────────────────

function FieldRow({ label, children, asDiv }: { label: string; children: React.ReactNode; asDiv?: boolean }) {
  if (asDiv) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        {children}
      </div>
    );
  }
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none focus:ring-1 focus:ring-[var(--bleu-secondaire)] transition-colors w-full";

// ─── Section: Informations du bien ────────────────────────────────────────────

function SectionInfos({
  dossier,
  onChange,
}: {
  dossier: DossierBien;
  onChange: (updates: Partial<DossierBien>) => void;
}) {
  return (
    <Section title="Informations du bien">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldRow label="Adresse">
          <input
            className={inputCls}
            value={dossier.adresse}
            onChange={(e) => onChange({ adresse: e.target.value })}
            placeholder="12 rue de la Paix"
          />
        </FieldRow>
        <FieldRow label="Code postal">
          <input
            className={inputCls}
            value={dossier.code_postal}
            onChange={(e) => onChange({ code_postal: e.target.value })}
            placeholder="75001"
          />
        </FieldRow>
        <FieldRow label="Commune">
          <input
            className={inputCls}
            value={dossier.commune}
            onChange={(e) => onChange({ commune: e.target.value })}
            placeholder="Paris"
          />
        </FieldRow>
        <FieldRow label="Prix (€)">
          <input
            type="number"
            className={inputCls}
            value={dossier.prix || ""}
            onChange={(e) => onChange({ prix: Number(e.target.value) })}
            placeholder="250000"
          />
        </FieldRow>
        <FieldRow label="Surface (m²)">
          <input
            type="number"
            className={inputCls}
            value={dossier.surface || ""}
            onChange={(e) => onChange({ surface: Number(e.target.value) })}
            placeholder="55"
          />
        </FieldRow>
        <FieldRow label="Pièces">
          <input
            type="number"
            className={inputCls}
            value={dossier.pieces || ""}
            onChange={(e) => onChange({ pieces: Number(e.target.value) })}
            placeholder="3"
          />
        </FieldRow>
        <FieldRow label="Étage">
          <input
            type="number"
            className={inputCls}
            value={dossier.etage ?? ""}
            onChange={(e) => onChange({ etage: e.target.value === "" ? null : Number(e.target.value) })}
            placeholder="3"
          />
        </FieldRow>
        <FieldRow label="Exposition">
          <input
            className={inputCls}
            value={dossier.exposition ?? ""}
            onChange={(e) => onChange({ exposition: e.target.value || null })}
            placeholder="Sud, Est..."
          />
        </FieldRow>
        <FieldRow label="Type de chauffage">
          <input
            className={inputCls}
            value={dossier.type_chauffage ?? ""}
            onChange={(e) => onChange({ type_chauffage: e.target.value || null })}
            placeholder="Gaz individuel, electrique..."
          />
        </FieldRow>
        <FieldRow label="Année de construction">
          <input
            type="number"
            className={inputCls}
            value={dossier.annee_construction || ""}
            onChange={(e) => onChange({ annee_construction: Number(e.target.value) })}
            placeholder="1975"
          />
        </FieldRow>
        <FieldRow label="URL de l'annonce">
          <input
            type="url"
            className={inputCls}
            value={dossier.url_annonce ?? ""}
            onChange={(e) => onChange({ url_annonce: e.target.value || null })}
            placeholder="https://..."
          />
        </FieldRow>
        <FieldRow label="DPE énergie">
          <select
            className={inputCls}
            value={dossier.dpe_energie}
            onChange={(e) => onChange({ dpe_energie: e.target.value as DpeClasse })}
          >
            {DPE_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FieldRow>
        <FieldRow label="DPE GES">
          <select
            className={inputCls}
            value={dossier.dpe_ges ?? ""}
            onChange={(e) => onChange({ dpe_ges: (e.target.value as DpeClasse) || null })}
          >
            <option value="">Non renseigné</option>
            {DPE_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FieldRow>
        <FieldRow label="Copropriété" asDiv>
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="type_copro"
              checked={dossier.type_copro}
              onChange={(e) => onChange({ type_copro: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="type_copro" className="text-sm text-gray-700">
              Bien en copropriété
            </label>
          </div>
        </FieldRow>
        {dossier.type_copro && (
          <FieldRow label="Nombre de lots">
            <input
              type="number"
              className={inputCls}
              value={dossier.nb_lots_copro ?? ""}
              onChange={(e) =>
                onChange({ nb_lots_copro: e.target.value === "" ? null : Number(e.target.value) })
              }
              placeholder="50"
            />
          </FieldRow>
        )}
        <FieldRow label="Charges copro mensuelles (€)">
          <input
            type="number"
            className={inputCls}
            value={dossier.charges_copro || ""}
            onChange={(e) => onChange({ charges_copro: Number(e.target.value) })}
            placeholder="200"
          />
        </FieldRow>
        <FieldRow label="Taxe foncière annuelle (€)">
          <input
            type="number"
            className={inputCls}
            value={dossier.taxe_fonciere || ""}
            onChange={(e) => onChange({ taxe_fonciere: Number(e.target.value) })}
            placeholder="1200"
          />
        </FieldRow>
      </div>
    </Section>
  );
}

// ─── Section: Checklist de visite ────────────────────────────────────────────

function SectionChecklist({
  checklist,
  onChange,
}: {
  checklist: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}) {
  const totalChecked = checklist.filter((ci) => ci.ok).length;
  const total = checklist.length;

  const toggle = (item: string) => {
    const next = checklist.map((ci) =>
      ci.item === item ? { ...ci, ok: !ci.ok } : ci
    );
    onChange(next);
  };

  let globalIdx = 0;

  return (
    <Section title="Checklist de visite">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-[var(--gris-clair)] px-3 py-1 text-xs font-semibold text-gray-600">
          {totalChecked} / {total} points
        </span>
      </div>
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
                  const ci = checklist[catStart + localIdx];
                  const isChecked = ci?.ok ?? false;
                  return (
                    <li key={item} className="flex items-start gap-3">
                      <button
                        onClick={() => toggle(item)}
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
    </Section>
  );
}

// ─── Section: Notes de visite ─────────────────────────────────────────────────

function SectionNotes({
  dossier,
  onChange,
}: {
  dossier: DossierBien;
  onChange: (updates: Partial<DossierBien>) => void;
}) {
  return (
    <Section title="Notes de visite">
      <div className="space-y-4">
        <FieldRow label="Date de visite">
          <input
            type="date"
            className={inputCls}
            value={dossier.date_visite ?? ""}
            onChange={(e) => onChange({ date_visite: e.target.value || null })}
          />
        </FieldRow>
        <FieldRow label="Notes libres">
          <textarea
            className={`${inputCls} min-h-[120px] resize-y`}
            value={dossier.notes_visite ?? ""}
            onChange={(e) => onChange({ notes_visite: e.target.value || null })}
            placeholder="Impressions générales, points forts, points faibles, questions à poser..."
          />
        </FieldRow>
      </div>
    </Section>
  );
}

// ─── Section: Analyse financiere ──────────────────────────────────────────────

function SectionFinance({ dossier }: { dossier: DossierBien }) {
  const projet = loadProjet();

  if (!projet || dossier.prix === 0 || dossier.surface === 0) {
    return (
      <Section title="Analyse financière automatique">
        <p className="text-sm text-gray-500">
          Renseignez le prix et la surface du bien pour obtenir l&apos;analyse financière.
        </p>
      </Section>
    );
  }

  const prix_m2 = dossier.surface > 0 ? Math.round(dossier.prix / dossier.surface) : 0;
  const frais = calculerFraisNotaire(dossier.prix, "ancien");
  const budget_total = dossier.prix + frais.total;

  const duree = projet.duree_souhaitee || 20;
  const montant_emprunt = Math.max(0, dossier.prix - (projet.apport || 0));
  const simCredit = calculerMensualite(montant_emprunt, TAUX_DEFAULT, duree);

  const revenus_total =
    (projet.revenus_net || 0) + (projet.revenus_conjoint || 0);
  const taux_effort =
    revenus_total > 0 ? (simCredit.mensualite / revenus_total) * 100 : 0;

  const financement_dispo =
    (projet.capacite_emprunt || 0) + (projet.apport || 0) + (projet.montant_ptz || 0);

  const ecart = budget_total - financement_dispo;
  const finançable = ecart <= 0;

  return (
    <Section title="Analyse financière automatique">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-[var(--gris-clair)] p-3">
          <p className="text-xs text-gray-500 mb-1">Prix au m²</p>
          <p className="font-semibold text-gray-800 text-sm">{fmt(prix_m2)} €/m²</p>
        </div>
        <div className="rounded-lg bg-[var(--gris-clair)] p-3">
          <p className="text-xs text-gray-500 mb-1">Frais de notaire</p>
          <p className="font-semibold text-gray-800 text-sm">~{fmt(frais.total)} €</p>
        </div>
        <div className="rounded-lg bg-[var(--gris-clair)] p-3">
          <p className="text-xs text-gray-500 mb-1">Budget total</p>
          <p className="font-semibold text-gray-800 text-sm">{fmt(budget_total)} €</p>
        </div>
        <div className="rounded-lg bg-[var(--gris-clair)] p-3">
          <p className="text-xs text-gray-500 mb-1">Mensualité estimée</p>
          <p className="font-semibold text-gray-800 text-sm">
            {fmt(simCredit.mensualite)} €/mois
          </p>
          <p className="text-xs text-gray-400">taux {TAUX_DEFAULT}%, {duree} ans</p>
        </div>
        <div className="rounded-lg bg-[var(--gris-clair)] p-3">
          <p className="text-xs text-gray-500 mb-1">Taux d&apos;effort</p>
          <p
            className={`font-semibold text-sm ${
              taux_effort > 35 ? "text-red-600" : "text-gray-800"
            }`}
          >
            {taux_effort.toFixed(1)}%
          </p>
          {taux_effort > 35 && (
            <p className="text-xs text-red-500">Dépasse 35%</p>
          )}
        </div>
        <div className="rounded-lg bg-[var(--gris-clair)] p-3">
          <p className="text-xs text-gray-500 mb-1">Financement dispo</p>
          <p className="font-semibold text-gray-800 text-sm">{fmt(financement_dispo)} €</p>
        </div>
      </div>

      {/* Verdict */}
      <div
        className={`mt-4 rounded-lg p-3 text-sm font-semibold ${
          finançable
            ? "border border-green-300 bg-green-50 text-green-800"
            : "border border-red-300 bg-red-50 text-red-800"
        }`}
      >
        {finançable
          ? "Finançable — votre budget couvre ce bien"
          : `Dépassement de ${fmt(ecart)} € par rapport à votre financement disponible`}
      </div>
    </Section>
  );
}

// ─── Section: Alertes automatiques ───────────────────────────────────────────

interface AlerteAuto {
  severity: "danger" | "warning" | "info";
  message: string;
}

function buildAlertes(dossier: DossierBien): AlerteAuto[] {
  const alertes: AlerteAuto[] = [];

  if (dossier.dpe_energie === "G") {
    alertes.push({
      severity: "danger",
      message:
        "Passoire thermique — location interdite depuis 2025 (classe G). Valeur de revente impactée.",
    });
  } else if (dossier.dpe_energie === "F") {
    alertes.push({
      severity: "danger",
      message:
        "Passoire thermique — interdiction de louer à partir de 2028 (classe F). Travaux de rénovation énergétique à prévoir.",
    });
  }

  if (dossier.dpe_energie === "E") {
    alertes.push({
      severity: "warning",
      message:
        "Classe E — gel des loyers en vigueur, interdiction de location prévue en 2034.",
    });
  }

  if (
    dossier.type_copro &&
    dossier.surface > 0 &&
    dossier.charges_copro > 0 &&
    dossier.charges_copro / dossier.surface > 50
  ) {
    alertes.push({
      severity: "warning",
      message: `Charges de copropriété élevées — ${fmt(dossier.charges_copro)} €/mois pour ${dossier.surface} m² (${fmt(dossier.charges_copro / dossier.surface)} €/m²).`,
    });
  }

  if (dossier.annee_construction > 0 && dossier.annee_construction < 1949) {
    alertes.push({
      severity: "warning",
      message:
        "Bien ancien (avant 1949) — vérifiez les diagnostics plomb et amiante obligatoires.",
    });
  } else if (
    dossier.annee_construction > 0 &&
    dossier.annee_construction < 1997
  ) {
    alertes.push({
      severity: "info",
      message:
        "Bien construit avant 1997 — vérifiez le diagnostic amiante (obligatoire pour toute rénovation).",
    });
  }

  return alertes;
}

const SEVERITY_STYLES: Record<AlerteAuto["severity"], string> = {
  danger: "border-red-300 bg-red-50 text-red-800",
  warning: "border-orange-300 bg-orange-50 text-orange-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

const SEVERITY_ICONS: Record<AlerteAuto["severity"], string> = {
  danger: "⛔",
  warning: "⚠️",
  info: "ℹ️",
};

function SectionAlertes({ dossier }: { dossier: DossierBien }) {
  const alertes = buildAlertes(dossier);

  return (
    <Section title="Alertes automatiques">
      {alertes.length === 0 ? (
        <p className="text-sm text-gray-500">
          Aucune alerte pour ce bien. Complétez les informations pour obtenir des alertes personnalisées.
        </p>
      ) : (
        <div className="space-y-3">
          {alertes.map((a, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${SEVERITY_STYLES[a.severity]}`}
            >
              <span className="flex-shrink-0 text-base leading-tight">{SEVERITY_ICONS[a.severity]}</span>
              <p>{a.message}</p>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

// ─── Section: Analyse IA ──────────────────────────────────────────────────────

function SectionAnalyseIA({ score }: { score: number }) {
  const [clicked, setClicked] = useState(false);

  return (
    <Section title="Analyse IA">
      <div className="rounded-lg border border-[var(--gris-border)] bg-[var(--gris-clair)] p-4 text-center">
        {score > 0 ? (
          <div className="mb-2">
            <span className="text-4xl font-extrabold text-[var(--bleu-secondaire)]">{score}</span>
            <span className="text-lg text-gray-500">/100</span>
            <p className="mt-1 text-xs text-gray-500">Score calculé par l&apos;IA</p>
          </div>
        ) : (
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Obtenez une analyse IA complète de ce dossier
            </p>
            <p className="text-xs text-gray-500">
              Score global, recommandations, points de vigilance, comparaison marché.
            </p>
          </div>
        )}

        {clicked ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            L&apos;analyse IA sera disponible prochainement. Recevez-la par email.
          </div>
        ) : (
          <button
            onClick={() => setClicked(true)}
            className="rounded-lg bg-[var(--bleu-secondaire)] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Lancer l&apos;analyse
          </button>
        )}
      </div>
    </Section>
  );
}

// ─── Section: Statut ──────────────────────────────────────────────────────────

function SectionStatut({
  statut,
  onChange,
}: {
  statut: DossierStatut;
  onChange: (s: DossierStatut) => void;
}) {
  return (
    <Section title="Statut du dossier">
      <FieldRow label="Statut actuel">
        <select
          className={inputCls}
          value={statut}
          onChange={(e) => onChange(e.target.value as DossierStatut)}
        >
          {STATUT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldRow>
    </Section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DossierDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [dossier, setDossier] = useState<DossierBien | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState(false);

  useEffect(() => {
    if (!id) return;
    const d = getDossier(id);
    if (!d) {
      router.push("/dossiers");
      return;
    }
    // Ensure checklist is initialised with all items
    const withChecklist: DossierBien = {
      ...d,
      checklist_visite: initChecklist(d.checklist_visite),
    };
    setDossier(withChecklist);
    setLoaded(true);
  }, [id, router]);

  const handleChange = useCallback(
    (updates: Partial<DossierBien>) => {
      if (!dossier) return;
      const next = { ...dossier, ...updates };
      setDossier(next);
      updateDossier(next.id, updates);
      // Brief save indicator
      setSaveIndicator(true);
      setTimeout(() => setSaveIndicator(false), 1200);
    },
    [dossier]
  );

  const handleChecklistChange = useCallback(
    (items: ChecklistItem[]) => {
      handleChange({ checklist_visite: items });
    },
    [handleChange]
  );

  function handleDelete() {
    if (!dossier) return;
    deleteDossier(dossier.id);
    router.push("/dossiers");
  }

  if (!loaded || !dossier) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-secondaire)] border-t-transparent" />
      </div>
    );
  }

  const labelAdresse = dossier.adresse || dossier.commune || "Nouveau dossier";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.push("/dossiers")}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--gris-border)] text-gray-500 hover:bg-[var(--gris-clair)] transition-colors"
          aria-label="Retour"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 12L6 8l4-4" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-extrabold text-[var(--bleu-marine)]">
            {labelAdresse}
          </h1>
        </div>

        <DpeBadge classe={dossier.dpe_energie} size="md" />

        {/* Auto-save indicator */}
        {saveIndicator && (
          <span className="flex-shrink-0 text-xs text-green-600 font-medium">
            Sauvegardé
          </span>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-5">
        <SectionInfos dossier={dossier} onChange={handleChange} />
        <SectionChecklist
          checklist={dossier.checklist_visite}
          onChange={handleChecklistChange}
        />
        <SectionNotes dossier={dossier} onChange={handleChange} />
        <SectionFinance dossier={dossier} />
        <SectionAlertes dossier={dossier} />
        <SectionAnalyseIA score={dossier.score} />
        <SectionStatut
          statut={dossier.statut}
          onChange={(s) => handleChange({ statut: s })}
        />

        {/* Delete */}
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 font-semibold text-red-700 text-sm">Zone de danger</h2>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded-lg border border-red-400 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
            >
              Supprimer ce dossier
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm text-red-700 font-medium">
                Confirmer la suppression ?
              </p>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
