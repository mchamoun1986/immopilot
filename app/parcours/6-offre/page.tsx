'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { StepLayout } from "@/components/parcours/step-layout";
import { getTipsForEtape } from "@/lib/data/tips-par-etape";
import { loadProjet, saveProjet, createEmptyProjet } from "@/lib/storage";
import type { ProjetImmobilier, LeadCapture } from "@/lib/types";
import { LeadModal } from "@/components/formulaires/lead-modal";
import { fmt, formatDate } from "@/lib/utils/format";
import { MARGES_NEGOCIATION } from "@/lib/data/negociation-tips";

/** Add N days to today */
function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// ─── Tips ─────────────────────────────────────────────────────────────────────

const TIPS = getTipsForEtape(6);

const CHECKLIST = [
  "J'ai analysé le prix au m2 du bien",
  "J'ai comparé avec les prix du quartier",
  "J'ai évalué les travaux éventuels",
  "J'ai préparé mon offre d'achat",
];

// ─── Niveaux de renovation ────────────────────────────────────────────────────

interface NiveauRenovation {
  id: string;
  label: string;
  description: string;
  min: number;
  max: number;
}

const NIVEAUX_RENOVATION: NiveauRenovation[] = [
  {
    id: "rafraichissement",
    label: "Rafraîchissement",
    description: "Peinture, sol souple, petites retouches",
    min: 200,
    max: 500,
  },
  {
    id: "renovation_moyenne",
    label: "Rénovation moyenne",
    description: "Cuisine, salle de bain, parquet",
    min: 500,
    max: 1000,
  },
  {
    id: "renovation_lourde",
    label: "Rénovation lourde",
    description: "Structure, électricité, plomberie",
    min: 1000,
    max: 1500,
  },
];

// ─── Composant : Analyse prix ─────────────────────────────────────────────────

function AnalysePrix({ projet }: { projet: ProjetImmobilier }) {
  const [prixDemande, setPrixDemande] = useState(projet.budget_max || 0);
  const [surface, setSurface] = useState(0);

  const prixM2 = surface > 0 ? Math.round(prixDemande / surface) : null;

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Analyse du prix</h2>
      <p className="mb-4 text-xs text-gray-500">
        Calculez le prix au m2 et comparez avec le marché local
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Prix demande */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="prix-demande">
            Prix demandé (EUR)
          </label>
          <div className="relative">
            <input
              id="prix-demande"
              type="number"
              min={0}
              value={prixDemande || ""}
              onChange={(e) => setPrixDemande(parseFloat(e.target.value) || 0)}
              placeholder="Ex. 250000"
              className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 pr-10 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
            <span className="absolute right-3 top-1.5 text-xs text-gray-400">EUR</span>
          </div>
        </div>

        {/* Surface */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="surface-bien">
            Surface (m2)
          </label>
          <div className="relative">
            <input
              id="surface-bien"
              type="number"
              min={1}
              value={surface || ""}
              onChange={(e) => setSurface(parseFloat(e.target.value) || 0)}
              placeholder="Ex. 65"
              className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 pr-10 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
            <span className="absolute right-3 top-1.5 text-xs text-gray-400">m2</span>
          </div>
        </div>
      </div>

      {/* Resultat prix m2 */}
      {prixM2 !== null && prixDemande > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[var(--gris-clair)] p-3 text-center">
            <p className="text-xs text-gray-500">Prix au m2</p>
            <p className="mt-1 text-xl font-bold text-[var(--bleu-marine)]">{fmt(prixM2)} EUR/m2</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
            <p className="text-xs text-blue-700">Prix total</p>
            <p className="mt-1 text-xl font-bold text-blue-900">{fmt(prixDemande)} EUR</p>
          </div>
        </div>
      )}

      {/* Comparaison marche — placeholder */}
      <div className="mt-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3">
        <p className="text-xs text-gray-500 text-center">
          Les prix moyens dans votre commune seront disponibles prochainement
          <br />
          <span className="text-gray-400">(source : DVF data.gouv.fr)</span>
        </p>
      </div>
    </div>
  );
}

// ─── Composant : Generateur lettre d'offre ────────────────────────────────────

function GenerateurOffre() {
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [prix, setPrix] = useState(0);
  const [delai, setDelai] = useState(7);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const generateLettre = () => {
    if (!nom || !adresse || prix <= 0) return;
    const dateExpiration = formatDate(addDays(delai));
    const today = formatDate(new Date());

    const lettre = `Lettre d'offre d'achat

Fait a _________________, le ${today}

Monsieur / Madame,

Je soussigne(e) ${nom}, demeurant a _________________, declare proposer l'acquisition du bien immobilier situe ${adresse} au prix de ${fmt(prix)} EUR (${fmt(prix)} euros).

Cette offre est formulee sous les conditions suivantes :
- Obtention d'un pret immobilier pour le financement de l'acquisition
- Resultats satisfaisants des diagnostics techniques obligatoires
- Absence de servitudes ou d'hypotheques non divulguees

La presente offre est valable jusqu'au ${dateExpiration}. Passe ce delai, elle deviendra caduque de plein droit.

Cette offre d'achat n'est pas juridiquement engageante pour l'acheteur. Seule la signature du compromis de vente creera des obligations reciproques. L'acheteur disposera d'un delai de retractation de 10 jours a compter de la notification du compromis signe.

Dans l'attente de votre reponse, je me tiens a votre disposition pour tout renseignement complementaire.

Signature : _________________________
Nom : ${nom}
Date : ${today}`;

    setGenerated(lettre);
    setCopied(false);
  };

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (copyTimerRef.current) clearTimeout(copyTimerRef.current); }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available
    }
  };

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Générateur de lettre d&apos;offre</h2>
      <p className="mb-4 text-xs text-gray-500">
        Remplissez les champs pour générer un modèle de lettre d&apos;offre d&apos;achat
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Nom acheteur */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="offre-nom">
            Votre nom complet
          </label>
          <input
            id="offre-nom"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex. Jean Dupont"
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
        </div>

        {/* Prix propose */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="offre-prix">
            Prix proposé (EUR)
          </label>
          <div className="relative">
            <input
              id="offre-prix"
              type="number"
              min={0}
              value={prix || ""}
              onChange={(e) => setPrix(parseFloat(e.target.value) || 0)}
              placeholder="Ex. 240000"
              className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 pr-10 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
            <span className="absolute right-3 top-1.5 text-xs text-gray-400">EUR</span>
          </div>
        </div>

        {/* Adresse bien */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="offre-adresse">
            Adresse du bien
          </label>
          <input
            id="offre-adresse"
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="Ex. 12 rue de la Paix, 75001 Paris"
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
        </div>

        {/* Delai validite */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="offre-delai">
            Délai de validité (jours)
          </label>
          <input
            id="offre-delai"
            type="number"
            min={1}
            max={30}
            value={delai}
            onChange={(e) => setDelai(parseInt(e.target.value) || 7)}
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={generateLettre}
        disabled={!nom || !adresse || prix <= 0}
        className="mt-4 rounded-lg bg-[var(--bleu-secondaire)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Générer la lettre
      </button>

      {/* Generated letter */}
      {generated && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600">Votre modèle de lettre</p>
            <button
              onClick={handleCopy}
              className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
            >
              {copied ? "Copie !" : "Copier"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap rounded-lg border border-[var(--gris-border)] bg-gray-50 p-4 text-xs text-gray-700 leading-relaxed font-sans">
            {generated}
          </pre>
          <p className="mt-2 text-xs text-gray-400">
            Ce modèle est fourni à titre indicatif. Faites-le relire par un professionnel avant envoi.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Composant : Estimateur travaux ──────────────────────────────────────────

function EstimateurTravaux({ projet, onUpdate }: { projet: ProjetImmobilier; onUpdate: (p: ProjetImmobilier) => void }) {
  const [niveau, setNiveau] = useState<string | null>(null);
  const [surface, setSurface] = useState(0);
  const [saved, setSaved] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); }, []);

  const selectedNiveau = NIVEAUX_RENOVATION.find((n) => n.id === niveau);
  const estimMin = selectedNiveau && surface > 0 ? selectedNiveau.min * surface : null;
  const estimMax = selectedNiveau && surface > 0 ? selectedNiveau.max * surface : null;

  const handleSave = () => {
    if (estimMin === null || estimMax === null) return;
    const milieu = Math.round((estimMin + estimMax) / 2);
    // Store the travaux estimation as a side note
    try {
      localStorage.setItem("immopilot_travaux_estim", JSON.stringify({ niveau, surface, min: estimMin, max: estimMax, milieu }));
    } catch { /* quota exceeded */ }
    setSaved(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Estimateur de travaux</h2>
      <p className="mb-4 text-xs text-gray-500">
        Estimez l&apos;enveloppe travaux selon le niveau de rénovation nécessaire
      </p>

      {/* Niveaux */}
      <div className="space-y-2 mb-4">
        {NIVEAUX_RENOVATION.map((n) => (
          <button
            key={n.id}
            onClick={() => setNiveau(n.id)}
            className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
              niveau === n.id
                ? "border-[var(--bleu-secondaire)] bg-blue-50"
                : "border-[var(--gris-border)] bg-white hover:border-[var(--bleu-secondaire)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--bleu-marine)]">{n.label}</p>
                <p className="text-xs text-gray-500">{n.description}</p>
              </div>
              <span className="text-xs font-medium text-gray-600">
                {fmt(n.min)} – {fmt(n.max)} EUR/m2
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Surface */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="travaux-surface">
          Surface à rénover (m2)
        </label>
        <div className="relative max-w-xs">
          <input
            id="travaux-surface"
            type="number"
            min={1}
            value={surface || ""}
            onChange={(e) => setSurface(parseFloat(e.target.value) || 0)}
            placeholder="Ex. 65"
            className="w-full rounded border border-[var(--gris-border)] px-3 py-1.5 pr-10 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
          />
          <span className="absolute right-3 top-1.5 text-xs text-gray-400">m2</span>
        </div>
      </div>

      {/* Resultat */}
      {estimMin !== null && estimMax !== null && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[var(--gris-clair)] p-3 text-center">
              <p className="text-xs text-gray-500">Estimation basse</p>
              <p className="mt-1 text-lg font-bold text-[var(--bleu-marine)]">{fmt(estimMin)} EUR</p>
            </div>
            <div className="rounded-lg bg-[var(--gris-clair)] p-3 text-center">
              <p className="text-xs text-gray-500">Estimation haute</p>
              <p className="mt-1 text-lg font-bold text-[var(--bleu-marine)]">{fmt(estimMax)} EUR</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
            <div>
              <p className="text-xs text-orange-700">Budget travaux moyen à prévoir</p>
              <p className="text-lg font-bold text-orange-800">
                {fmt(Math.round((estimMin + estimMax) / 2))} EUR
              </p>
            </div>
            <button
              onClick={handleSave}
              className="rounded bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600"
            >
              {saved ? "Sauvegarde !" : "Sauvegarder"}
            </button>
          </div>

          <p className="text-xs text-gray-400">
            Estimation indicative — obtenez plusieurs devis d&apos;artisans pour valider le montant.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Gate lead ────────────────────────────────────────────────────────────────

function GateLead() {
  const [showModal, setShowModal] = useState(false);

  const handleLeadSubmit = (_lead: LeadCapture) => {
    // Modal handles save internally
  };

  return (
    <>
      <div className="rounded-lg border border-[var(--bleu-secondaire)] bg-white p-5">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <p className="font-semibold text-[var(--bleu-marine)]">Comparez avec les prix du marché</p>
            <p className="mt-1 text-sm text-gray-600">
              Recevez une analyse comparative DVF pour votre commune : prix médian, évolution sur 2 ans, fourchette par type de bien.
            </p>
          </div>
          <button
            className="flex-shrink-0 rounded-lg bg-[var(--bleu-secondaire)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            onClick={() => setShowModal(true)}
          >
            Recevoir l&apos;analyse
          </button>
        </div>
      </div>

      <LeadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        source="analyse_prix"
        etape={6}
        titre="Analyse comparative des prix"
        description="Recevez une analyse DVF pour votre commune : prix médian, évolution sur 2 ans, fourchette par type de bien."
        showPhone={false}
        showConsent={false}
        onSubmit={handleLeadSubmit}
      />
    </>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function EtapeOffrePage() {
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const p = loadProjet() ?? createEmptyProjet();
    setProjet(p);
    setLoaded(true);
  }, []);

  const handleUpdate = useCallback(
    (updated: ProjetImmobilier) => {
      setProjet(updated);
      saveProjet(updated);
    },
    []
  );

  if (!loaded || !projet) {
    return (
      <div role="status" aria-label="Chargement en cours" className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-secondaire)] border-t-transparent" />
      </div>
    );
  }

  const tools = (
    <div className="space-y-5">
      <AnalysePrix projet={projet} />
      <GenerateurOffre />
      <EstimateurTravaux projet={projet} onUpdate={handleUpdate} />
      <GateLead />

      {/* Marges de negociation — source: lib/data/negociation-tips.ts */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-4">
        <h2 className="mb-3 font-semibold text-[var(--bleu-marine)]">Marges de négociation indicatives</h2>
        <div className="space-y-2">
          {MARGES_NEGOCIATION.map((m, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-[var(--gris-fond)] px-3 py-2 text-sm">
              <div>
                <span className="font-medium">{m.type_bien}</span>
                <span className="ml-2 text-xs text-gray-500">zone {m.zone}</span>
              </div>
              <span className="font-semibold text-[var(--bleu-action)]">{m.marge_min_pct}-{m.marge_max_pct}%</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">Source: indices Notaires, analyses marché — indicatif</p>
      </div>
    </div>
  );

  return (
    <StepLayout
      etape={6}
      guide={
        <p>
          Vous avez trouvé un bien qui vous plaît ? Avant de faire une offre, analysez le
          prix par rapport au marché et préparez votre stratégie de négociation. Une offre
          d&apos;achat écrite n&apos;est pas juridiquement engageante — seul le compromis vous engage.
        </p>
      }
      outils={tools}
      tips={TIPS}
      checklist={CHECKLIST}
    />
  );
}
