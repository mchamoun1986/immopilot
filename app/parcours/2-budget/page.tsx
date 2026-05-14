'use client';

import { useEffect, useState, useCallback } from "react";
import { StepLayout } from "@/components/parcours/step-layout";
import type { TipData } from "@/components/parcours/step-layout";
import { loadProjet, saveProjet, saveProjetDebounced, flushPendingSave, createEmptyProjet } from "@/lib/storage";
import type { ProjetImmobilier } from "@/lib/types";
import { calculerMensualite } from "@/lib/calculateurs/credit";
import { calculerEndettement } from "@/lib/calculateurs/endettement";
import { calculerPTZ } from "@/lib/calculateurs/ptz";
import type { ParamsPTZ } from "@/lib/calculateurs/ptz";
import { calculerFraisNotaire } from "@/lib/calculateurs/notaire";
import { LeadModal } from "@/components/formulaires/lead-modal";
import type { LeadCapture } from "@/lib/types";
import { fmt } from "@/lib/utils/format";
import { getTipsForEtape } from "@/lib/data/tips-par-etape";
import { AIDES_ACHAT } from "@/lib/data/aides-achat";
import { TAUX_MARCHE, DISCLAIMER_TAUX } from "@/lib/data/credit-rules";

const TIPS = getTipsForEtape(2);

const CHECKLIST = [
  "J'ai calculé ma capacité d'emprunt",
  "J'ai vérifié mon éligibilité PTZ",
  "J'ai défini mon budget total (prix + frais + travaux)",
  "J'ai pris contact avec un courtier",
];

const ZONES_PTZ = ["Abis", "A", "B1", "B2", "C"] as const;
type ZonePTZ = (typeof ZONES_PTZ)[number];

// ─── Section : Simulateur credit ────────────────────────────────────────────

function SimulateurCredit({ projet, taux, duree, onTauxChange, onDureeChange }: {
  projet: ProjetImmobilier;
  taux: number;
  duree: number;
  onTauxChange: (t: number) => void;
  onDureeChange: (d: number) => void;
}) {
  const [montant, setMontant] = useState(projet.budget_max || 200000);

  const result = calculerMensualite(montant, taux, duree);

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Simulateur de crédit</h2>
      <p className="mb-4 text-xs text-gray-500">
        Formule : M = P &times; r &times; (1+r)&sup;n / ((1+r)&sup;n - 1)
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Montant */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="sim-montant">
            Montant emprunté (EUR)
          </label>
          <input
            id="sim-montant"
            type="number"
            min={0}
            value={montant}
            onChange={(e) => setMontant(parseFloat(e.target.value) || 0)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
        </div>

        {/* Taux */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="sim-taux">
            Taux annuel (%)
          </label>
          <input
            id="sim-taux"
            type="number"
            step={0.05}
            min={0}
            max={15}
            value={taux}
            onChange={(e) => onTauxChange(parseFloat(e.target.value) || 0)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
        </div>

        {/* Duree */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="sim-duree">
            Durée (années)
          </label>
          <input
            id="sim-duree"
            type="number"
            min={1}
            max={25}
            value={duree}
            onChange={(e) => onDureeChange(parseInt(e.target.value) || 20)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
        </div>
      </div>

      {montant > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-[var(--gris-clair)] p-3 text-center">
            <p className="text-xs text-gray-500">Mensualité</p>
            <p className="mt-1 text-lg font-bold text-[var(--bleu-marine)]">{fmt(result.mensualite)} EUR</p>
          </div>
          <div className="rounded-lg bg-[var(--gris-clair)] p-3 text-center">
            <p className="text-xs text-gray-500">Coût total</p>
            <p className="mt-1 text-lg font-bold text-[var(--bleu-marine)]">{fmt(result.cout_total)} EUR</p>
          </div>
          <div className="rounded-lg bg-[var(--gris-clair)] p-3 text-center">
            <p className="text-xs text-gray-500">Coût intérêts</p>
            <p className="mt-1 text-lg font-bold text-orange-600">{fmt(result.cout_interets)} EUR</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section : Taux endettement ─────────────────────────────────────────────

function TauxEndettement({ projet, taux, duree, onUpdate }: {
  projet: ProjetImmobilier;
  taux: number;
  duree: number;
  onUpdate: (fields: Partial<ProjetImmobilier>) => void;
}) {
  const revenus = projet.revenus_net + (projet.revenus_conjoint ?? 0);
  const [charges, setCharges] = useState(projet.charges_fixes || 0);

  const result = calculerEndettement(revenus, charges, taux, duree);
  const tauxPct = Math.round(result.taux * 10000) / 100; // to %, 2 decimals
  const isConform = result.conforme_hcsf;
  const barWidth = Math.min(tauxPct / 0.5, 100); // scale 0-50% range to 0-100% bar

  // Persist taux_endettement + capacite_emprunt (source of truth for capacity)
  useEffect(() => {
    onUpdate({ taux_endettement: result.taux, charges_fixes: charges, capacite_emprunt: result.capacite_emprunt, duree_souhaitee: duree });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charges, taux, duree]);

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Taux d&apos;endettement</h2>
      <p className="mb-4 text-xs text-gray-500">
        Règle HCSF : maximum 35% des revenus nets mensuels
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Revenus affiches */}
        <div>
          <p className="mb-1 text-xs font-medium text-gray-600">
            Revenus nets mensuels
          </p>
          <div className="rounded border border-[var(--gris-border)] bg-gray-50 px-3 py-1.5 text-sm text-gray-500">
            {fmt(revenus)} EUR <span className="text-xs">(depuis étape 1)</span>
          </div>
        </div>

        {/* Charges */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="endet-charges">
            Charges fixes mensuelles (EUR)
          </label>
          <input
            id="endet-charges"
            type="number"
            min={0}
            value={charges}
            onChange={(e) => setCharges(parseFloat(e.target.value) || 0)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Taux et durée utilisés : {taux}% sur {duree} ans (modifiables dans le simulateur ci-dessus)
      </p>

      {revenus > 0 && (
        <div className="mt-4 space-y-3">
          {/* Gauge */}
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span className={`font-semibold ${isConform ? "text-green-600" : "text-red-600"}`}>
                Votre taux : {tauxPct.toFixed(1)}%
              </span>
              <span className="font-medium text-orange-600">Plafond 35%</span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full bg-gray-200">
              {/* 35% marker */}
              <div
                className="absolute top-0 h-full w-0.5 bg-orange-500"
                style={{ left: `${(35 / 50) * 100}%` }}
              />
              {/* Current taux bar */}
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isConform ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <div className="mt-1 text-right">
              <span
                className={`rounded px-2 py-0.5 text-xs font-semibold ${
                  isConform ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {isConform ? "Conforme HCSF" : "Dépasse le plafond HCSF"}
              </span>
            </div>
          </div>

          {/* Key figures */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[var(--gris-clair)] p-3">
              <p className="text-xs text-gray-500">Mensualité max autorisée</p>
              <p className="mt-1 text-lg font-bold text-[var(--bleu-marine)]">{fmt(result.mensualite_max)} EUR</p>
            </div>
            <div className="rounded-lg bg-[var(--gris-clair)] p-3">
              <p className="text-xs text-gray-500">Capacite d&apos;emprunt</p>
              <p className="mt-1 text-lg font-bold text-[var(--bleu-marine)]">{fmt(result.capacite_emprunt)} EUR</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section : Eligibilite PTZ ───────────────────────────────────────────────

function EligibilitePTZ({ projet, onUpdate }: { projet: ProjetImmobilier; onUpdate: (fields: Partial<ProjetImmobilier>) => void }) {
  const revenus = projet.revenus_net + (projet.revenus_conjoint ?? 0);
  const [zone, setZone] = useState<ZonePTZ>("B1");
  // Revenu fiscal ≈ revenu net annuel * 0.9 (approximation)
  const [revenuFiscal, setRevenuFiscal] = useState(Math.round(revenus * 12 * 0.9));
  const [taille_foyer, setTailleFoyer] = useState(projet.taille_foyer || 1);
  const [cout_op, setCoutOp] = useState(projet.budget_max || 200000);

  const params: ParamsPTZ = { zone, revenu_fiscal: revenuFiscal, taille_foyer, cout_operation: cout_op };
  const result = calculerPTZ(params);

  // Persist PTZ result
  useEffect(() => {
    onUpdate({ eligible_ptz: result.eligible, montant_ptz: result.eligible ? result.montant : 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone, revenuFiscal, taille_foyer, cout_op]);

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Éligibilité au PTZ</h2>
      <p className="mb-4 text-xs text-gray-500">
        Prêt à Taux Zéro — réservé aux primo-accédants sous conditions de ressources (barèmes 2026)
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Zone */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="ptz-zone">
            Zone géographique
          </label>
          <select
            id="ptz-zone"
            value={zone}
            onChange={(e) => setZone(e.target.value as ZonePTZ)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          >
            <option value="Abis">Zone Abis (Paris + 3 communes)</option>
            <option value="A">Zone A (Grande couronne, Cote d&apos;Azur...)</option>
            <option value="B1">Zone B1 (Grandes agglomos, DOM...)</option>
            <option value="B2">Zone B2 (Villes moyennes)</option>
            <option value="C">Zone C (Reste du territoire)</option>
          </select>
        </div>

        {/* Taille foyer */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="ptz-foyer">
            Nombre de personnes dans le foyer
          </label>
          <input
            id="ptz-foyer"
            type="number"
            min={1}
            max={8}
            value={taille_foyer}
            onChange={(e) => setTailleFoyer(parseInt(e.target.value) || 1)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
        </div>

        {/* Revenu fiscal */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="ptz-rfr">
            Revenu fiscal de référence (N-2) — EUR/an
          </label>
          <input
            id="ptz-rfr"
            type="number"
            min={0}
            value={revenuFiscal}
            onChange={(e) => setRevenuFiscal(parseFloat(e.target.value) || 0)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
        </div>

        {/* Cout operation */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="ptz-cout">
            Cout total de l&apos;operation (EUR)
          </label>
          <input
            id="ptz-cout"
            type="number"
            min={0}
            value={cout_op}
            onChange={(e) => setCoutOp(parseFloat(e.target.value) || 0)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
        </div>
      </div>

      {/* Result */}
      <div className="mt-4">
        <div
          className={`rounded-lg border p-4 ${
            result.eligible
              ? "border-green-300 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase ${
                result.eligible
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {result.eligible ? "Éligible PTZ" : "Non éligible"}
            </span>
          </div>

          {result.eligible ? (
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500">Montant PTZ</p>
                <p className="font-bold text-green-700">{fmt(result.montant)} EUR</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Durée différée</p>
                <p className="font-bold text-[var(--bleu-marine)]">{result.duree_differee} ans</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Durée remboursement</p>
                <p className="font-bold text-[var(--bleu-marine)]">{result.duree_remboursement} ans</p>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-red-700">{result.raison_ineligibilite}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section : Budget total reel ────────────────────────────────────────────

function BudgetTotal({ projet }: { projet: ProjetImmobilier }) {
  const [travaux, setTravaux] = useState(0);

  const prix_bien = projet.budget_max || 0;
  const fraisNotaire = calculerFraisNotaire(prix_bien, "ancien");
  const budget_total = prix_bien + fraisNotaire.total + travaux;
  const capacite_totale = projet.capacite_emprunt + projet.apport + projet.montant_ptz;
  const delta = capacite_totale - budget_total;
  const is_ok = delta >= 0;

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Budget total réel</h2>
      <p className="mb-4 text-xs text-gray-500">
        Estimation complète : prix + frais de notaire + travaux éventuels
      </p>

      <div className="space-y-2">
        {/* Ligne prix */}
        <div className="flex justify-between rounded bg-[var(--gris-clair)] px-3 py-2 text-sm">
          <span className="text-gray-600">Prix du bien</span>
          <span className="font-semibold">{fmt(prix_bien)} EUR</span>
        </div>

        {/* Frais notaire */}
        <div className="flex justify-between rounded bg-[var(--gris-clair)] px-3 py-2 text-sm">
          <span className="text-gray-600">
            Frais de notaire{" "}
            <span className="text-xs text-gray-400">(bien ancien, est.)</span>
          </span>
          <span className="font-semibold">{fmt(fraisNotaire.total)} EUR</span>
        </div>

        {/* Travaux */}
        <div className="flex items-center justify-between rounded bg-[var(--gris-clair)] px-3 py-2 text-sm">
          <span className="text-gray-600">Travaux estimés</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={travaux}
              onChange={(e) => setTravaux(parseFloat(e.target.value) || 0)}
              aria-label="Travaux estimés en EUR"
              className="w-28 rounded border border-[var(--gris-border)] px-2 py-1 text-right text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
            <span className="text-gray-400">EUR</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between rounded border border-[var(--bleu-marine)] bg-[var(--bleu-marine)] px-3 py-2 text-sm text-white">
          <span className="font-bold">TOTAL BESOIN</span>
          <span className="font-bold">{fmt(budget_total)} EUR</span>
        </div>
      </div>

      {/* Financement dispo */}
      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Votre financement disponible</p>
        <div className="flex justify-between rounded bg-[var(--gris-clair)] px-3 py-2 text-sm">
          <span className="text-gray-600">Capacite d&apos;emprunt</span>
          <span className="font-semibold">{fmt(projet.capacite_emprunt)} EUR</span>
        </div>
        <div className="flex justify-between rounded bg-[var(--gris-clair)] px-3 py-2 text-sm">
          <span className="text-gray-600">Apport personnel</span>
          <span className="font-semibold">{fmt(projet.apport)} EUR</span>
        </div>
        {projet.eligible_ptz && projet.montant_ptz > 0 && (
          <div className="flex justify-between rounded bg-green-50 px-3 py-2 text-sm">
            <span className="text-green-700">PTZ</span>
            <span className="font-semibold text-green-700">{fmt(projet.montant_ptz)} EUR</span>
          </div>
        )}
        <div className="flex justify-between rounded border border-green-500 bg-green-600 px-3 py-2 text-sm text-white">
          <span className="font-bold">TOTAL FINANCEMENT</span>
          <span className="font-bold">{fmt(capacite_totale)} EUR</span>
        </div>
      </div>

      {/* Verdict */}
      {prix_bien > 0 && (
        <div
          className={`mt-4 rounded-lg border p-3 text-sm font-semibold ${
            is_ok
              ? "border-green-400 bg-green-50 text-green-800"
              : "border-red-400 bg-red-50 text-red-800"
          }`}
        >
          {is_ok ? (
            <>Votre projet est finançable — excédent de {fmt(delta)} EUR</>
          ) : (
            <>Attention : dépassement de {fmt(Math.abs(delta))} EUR par rapport à votre financement</>
          )}
        </div>
      )}

      {/* Detail frais notaire */}
      {prix_bien > 0 && (
        <details className="mt-3 text-xs text-gray-500">
          <summary className="cursor-pointer hover:text-gray-700">Détail des frais de notaire</summary>
          <div className="mt-2 space-y-1 rounded bg-gray-50 p-3">
            <div className="flex justify-between">
              <span>Droits de mutation</span>
              <span>{fmt(fraisNotaire.droits_mutation)} EUR</span>
            </div>
            <div className="flex justify-between">
              <span>Émoluments notaire</span>
              <span>{fmt(fraisNotaire.emoluments)} EUR</span>
            </div>
            <div className="flex justify-between">
              <span>Débours forfaitaires</span>
              <span>{fmt(fraisNotaire.debours)} EUR</span>
            </div>
            <div className="flex justify-between">
              <span>Contribution sécurité immobilière</span>
              <span>{fmt(fraisNotaire.contribution_securite)} EUR</span>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}

// ─── Gate lead ───────────────────────────────────────────────────────────────

function GateLead() {
  const [showModal, setShowModal] = useState(false);

  const handleLeadSubmit = (_lead: LeadCapture) => {
    // Modal handles save; close after a moment via modal's own success state
  };

  return (
    <>
      <div className="rounded-lg border border-[var(--bleu-secondaire)] bg-white p-5">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <p className="font-semibold text-[var(--bleu-marine)]">Recevez votre simulation détaillée par email</p>
            <p className="mt-1 text-sm text-gray-600">
              Un récap PDF personnalisé : capacité d&apos;emprunt, PTZ, budget total, conseils adaptés à votre profil.
            </p>
          </div>
          <button
            className="flex-shrink-0 rounded-lg bg-[var(--bleu-secondaire)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            onClick={() => setShowModal(true)}
          >
            Recevoir par email
          </button>
        </div>
      </div>

      <LeadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        source="simulation"
        etape={2}
        titre="Recevez votre simulation détaillée"
        description="Un récap PDF personnalisé : capacité d'emprunt, PTZ, budget total, conseils adaptés à votre profil."
        showPhone={false}
        showConsent={false}
        onSubmit={handleLeadSubmit}
      />
    </>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────

export default function EtapeCapacitePage() {
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const p = loadProjet() ?? createEmptyProjet();
    setProjet(p);
    setLoaded(true);
    return () => flushPendingSave();
  }, []);

  // Shared taux/duree state — single source of truth for both simulateur and endettement
  const [sharedTaux, setSharedTaux] = useState(3.5);
  const [sharedDuree, setSharedDuree] = useState(20);

  // Initialize shared duree from projet once loaded
  useEffect(() => {
    if (projet?.duree_souhaitee) setSharedDuree(projet.duree_souhaitee);
  }, [projet?.duree_souhaitee]);

  const handleFieldUpdate = useCallback(
    (fields: Partial<ProjetImmobilier>) => {
      setProjet((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...fields };
        saveProjetDebounced(next);
        return next;
      });
    },
    []
  );

  if (!loaded || !projet) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-secondaire)] border-t-transparent" />
      </div>
    );
  }

  const tools = (
    <div className="space-y-5">
      <SimulateurCredit projet={projet} taux={sharedTaux} duree={sharedDuree} onTauxChange={setSharedTaux} onDureeChange={setSharedDuree} />
      <TauxEndettement projet={projet} taux={sharedTaux} duree={sharedDuree} onUpdate={handleFieldUpdate} />
      <EligibilitePTZ projet={projet} onUpdate={handleFieldUpdate} />
      <BudgetTotal projet={projet} />
      <GateLead />

      {/* Taux du marche — source: lib/data/credit-rules.ts */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-5">
        <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Taux du marché</h2>
        <p className="mb-4 text-xs text-gray-500">
          Taux indicatifs crédit immobilier — mis à jour le {TAUX_MARCHE[0].date_maj}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--gris-border)] text-left text-xs text-gray-500">
                <th className="pb-2 pr-3">Durée</th>
                <th className="pb-2 pr-3">Moyen</th>
                <th className="pb-2 pr-3">Bon dossier</th>
                <th className="pb-2">Excellent</th>
              </tr>
            </thead>
            <tbody>
              {TAUX_MARCHE.map((t) => (
                <tr key={t.duree} className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-medium text-[var(--bleu-marine)]">{t.duree} ans</td>
                  <td className="py-2 pr-3">{t.taux_moyen}%</td>
                  <td className="py-2 pr-3 text-green-700 font-medium">{t.taux_bon}%</td>
                  <td className="py-2 text-green-600 font-bold">{t.taux_excellent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          {DISCLAIMER_TAUX}
        </p>
        <p className="mt-1 text-[10px] text-gray-300">
          Sources : CAFPI, Observatoire Credit Logement/CSA, Banque de France
        </p>
      </div>

      {/* Aides disponibles — source: lib/data/aides-achat.ts */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-5">
        <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Aides disponibles</h2>
        <p className="mb-4 text-xs text-gray-500">
          Prêts aidés et dispositifs d&apos;accession à la propriété en France
        </p>
        <div className="space-y-3">
          {AIDES_ACHAT.filter((a) => a.actif).map((aide) => (
            <details key={aide.nom} className="group rounded-lg border border-[var(--gris-border)] bg-[var(--gris-clair)]">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--bleu-marine)]">{aide.nom}</p>
                  <p className="text-xs text-gray-500">{aide.organisme}</p>
                </div>
                <div className="flex items-center gap-2">
                  {aide.montant_max && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                      Jusqu&apos;a {fmt(aide.montant_max)} EUR
                    </span>
                  )}
                  {aide.taux !== null && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                      {aide.taux}%
                    </span>
                  )}
                </div>
              </summary>
              <div className="border-t border-[var(--gris-border)] px-4 py-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Conditions</p>
                <ul className="space-y-1">
                  {aide.conditions.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                      {c}
                    </li>
                  ))}
                </ul>
                {aide.cumulable_ptz && (
                  <p className="mt-2 text-xs text-green-600 font-medium">Cumulable avec le PTZ</p>
                )}
                {aide.duree_max_annees && (
                  <p className="mt-1 text-xs text-gray-400">Durée max : {aide.duree_max_annees} ans</p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <StepLayout
      etape={2}
      guide={
        <p>
          La règle HCSF impose un taux d&apos;endettement maximum de 35%. Les banques regardent aussi
          votre reste à vivre et votre stabilité professionnelle.
        </p>
      }
      outils={tools}
      tips={TIPS}
      checklist={CHECKLIST}
    />
  );
}
