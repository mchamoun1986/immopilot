'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { StepLayout } from "@/components/parcours/step-layout";
import { getTipsForEtape } from "@/lib/data/tips-par-etape";
import { loadProjet, createEmptyProjet } from "@/lib/storage";
import type { ProjetImmobilier, LeadCapture } from "@/lib/types";
import { LeadModal } from "@/components/formulaires/lead-modal";
import { CHECKLIST_DEMENAGEMENT } from "@/lib/data/demenagement-checklist";
import { DECLARATIONS_POST_ACHAT } from "@/lib/data/post-achat-declarations";
import { DISPOSITIFS_FISCAUX, TAXE_FONCIERE_INFO, IFI_INFO } from "@/lib/data/fiscalite-immo";

// ─── Storage keys ─────────────────────────────────────────────────────────────

const POST_ACHAT_CHECK_KEY = "immopilot_post_achat_checked";

// ─── Donnees checklist post-achat ─────────────────────────────────────────────

interface ChecklistSection {
  titre: string;
  badge: string;
  badgeColor: string;
  items: string[];
}

const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    titre: "Dans les 48h",
    badge: "Urgent",
    badgeColor: "bg-red-100 text-red-700",
    items: [
      "Souscrire / activer l'assurance habitation",
      "Relever les compteurs (eau, électricité, gaz)",
      "Changer les serrures (recommandé)",
    ],
  },
  {
    titre: "Dans les 30 jours",
    badge: "30 j",
    badgeColor: "bg-orange-100 text-orange-700",
    items: [
      "Déclarer le changement d'adresse (service-public.fr)",
      "Informer employeur, banque, impôts, CAF, CPAM",
      "Transférer ou souscrire abonnements (eau, élec, gaz, internet)",
      "Souscrire assurance propriétaire non-occupant (si investissement futur)",
    ],
  },
  {
    titre: "Dans les 90 jours",
    badge: "90 j",
    badgeColor: "bg-amber-100 text-amber-700",
    items: [
      "Déclaration aux impôts (formulaire H1 pour maison, H2 pour appartement)",
      "Demande exonération taxe foncière (si neuf — conditionnelle, peut être réduite par la commune)",
    ],
  },
  {
    titre: "À conserver précieusement",
    badge: "Permanent",
    badgeColor: "bg-blue-100 text-blue-700",
    items: [
      "Acte de vente authentique",
      "Diagnostics techniques",
      "Factures de travaux (utile pour la plus-value future)",
      "Garantie décennale (si construction < 10 ans)",
    ],
  },
];

// Flatten all items for indexed access
const ALL_POST_ACHAT_ITEMS = CHECKLIST_SECTIONS.flatMap((s) => s.items);

// ─── Donnees guide garanties ──────────────────────────────────────────────────

const GARANTIES = [
  {
    titre: "Vices cachés",
    duree: "2 ans",
    detail:
      "Action possible dans les 2 ans à compter de la DÉCOUVERTE du vice (pas de la vente). Documenter l'état du bien avec photos avant emménagement.",
    color: "border-orange-300 bg-orange-50",
    labelColor: "bg-orange-100 text-orange-700",
  },
  {
    titre: "Garantie décennale",
    duree: "10 ans",
    detail:
      "10 ans sur le gros œuvre (si construction ou extension). Demander l'attestation au vendeur.",
    color: "border-blue-300 bg-blue-50",
    labelColor: "bg-blue-100 text-blue-700",
  },
  {
    titre: "Garantie biennale",
    duree: "2 ans",
    detail:
      "2 ans sur les équipements (chaudière, volets, etc.). Couvre les éléments dissociables du gros œuvre.",
    color: "border-purple-300 bg-purple-50",
    labelColor: "bg-purple-100 text-purple-700",
  },
  {
    titre: "Garantie de parfait achèvement",
    duree: "1 an",
    detail:
      "1 an — VEFA uniquement. Couvre toutes les malfaçons signalées lors de la réception ou dans l'année qui suit.",
    color: "border-green-300 bg-green-50",
    labelColor: "bg-green-100 text-green-700",
  },
];

// ─── Tips ─────────────────────────────────────────────────────────────────────

const TIPS = getTipsForEtape(10);

const CHECKLIST = [
  "J'ai souscrit l'assurance habitation",
  "J'ai déclaré mon changement d'adresse",
  "J'ai fait les démarches fiscales (H1/H2)",
  "J'ai archivé tous les documents importants",
];

// ─── Composant : Checklist post-achat ────────────────────────────────────────

function ChecklistPostAchat() {
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(POST_ACHAT_CHECK_KEY);
    if (raw) {
      try {
        setChecked(JSON.parse(raw) as boolean[]);
      } catch {
        setChecked(new Array(ALL_POST_ACHAT_ITEMS.length).fill(false));
      }
    } else {
      setChecked(new Array(ALL_POST_ACHAT_ITEMS.length).fill(false));
    }
  }, []);

  const toggle = (idx: number) => {
    const next = checked.map((v, i) => (i === idx ? !v : v));
    setChecked(next);
    localStorage.setItem(POST_ACHAT_CHECK_KEY, JSON.stringify(next));
  };

  const totalChecked = checked.filter(Boolean).length;
  const total = ALL_POST_ACHAT_ITEMS.length;

  let globalIdx = 0;

  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-[var(--bleu-marine)]">Checklist post-achat</h2>
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
        {CHECKLIST_SECTIONS.map((section) => {
          const sectionStart = globalIdx;
          globalIdx += section.items.length;

          return (
            <div key={section.titre}>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {section.titre}
                </h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${section.badgeColor}`}>
                  {section.badge}
                </span>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, localIdx) => {
                  const idx = sectionStart + localIdx;
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
                        aria-label={isChecked ? "Démarquer" : "Marquer comme fait"}
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
          Toutes les démarches post-achat sont complétées !
        </div>
      )}
    </div>
  );
}

// ─── Composant : Guide garanties ──────────────────────────────────────────────

function GuideGaranties() {
  return (
    <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
      <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Garanties applicables</h2>
      <p className="mb-4 text-xs text-gray-500">
        Connaissez vos recours en cas de problème après l&apos;achat
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {GARANTIES.map((g) => (
          <div key={g.titre} className={`rounded-lg border p-3 ${g.color}`}>
            <div className="mb-1.5 flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-800">{g.titre}</p>
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${g.labelColor}`}>
                {g.duree}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{g.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Composant : Gate lead ─────────────────────────────────────────────────────

function GateLead() {
  const [showAssurance, setShowAssurance] = useState(false);
  const [showDemenagement, setShowDemenagement] = useState(false);

  const handleLeadSubmit = (_lead: LeadCapture) => {
    // Modal handles save internally
  };

  return (
    <>
      <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
        <h2 className="mb-3 font-semibold text-[var(--bleu-marine)]">Prochaines étapes pratiques</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--gris-border)] bg-[var(--gris-clair)] p-3">
            <p className="mb-1 text-sm font-semibold text-[var(--bleu-marine)]">Assurance habitation</p>
            <p className="mb-3 text-xs text-gray-500">
              Comparez les offres pour votre nouveau logement en quelques minutes.
            </p>
            <button
              className="w-full rounded-lg bg-[var(--bleu-secondaire)] py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              onClick={() => setShowAssurance(true)}
            >
              Comparer les assurances
            </button>
          </div>
          <div className="rounded-lg border border-[var(--gris-border)] bg-[var(--gris-clair)] p-3">
            <p className="mb-1 text-sm font-semibold text-[var(--bleu-marine)]">Déménagement</p>
            <p className="mb-3 text-xs text-gray-500">
              Obtenez des devis de déménageurs professionnels près de chez vous.
            </p>
            <button
              className="w-full rounded-lg bg-[var(--bleu-secondaire)] py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              onClick={() => setShowDemenagement(true)}
            >
              Trouver un déménageur
            </button>
          </div>
        </div>
      </div>

      <LeadModal
        isOpen={showAssurance}
        onClose={() => setShowAssurance(false)}
        source="assurance"
        etape={10}
        titre="Comparez votre assurance habitation"
        description="Recevez les meilleures offres d'assurance habitation adaptées à votre nouveau logement."
        showPhone={false}
        showConsent={true}
        onSubmit={handleLeadSubmit}
      />

      <LeadModal
        isOpen={showDemenagement}
        onClose={() => setShowDemenagement(false)}
        source="demenagement"
        etape={10}
        titre="Trouvez un déménageur"
        description="Obtenez des devis de déménageurs professionnels près de chez vous."
        showPhone={false}
        showConsent={true}
        onSubmit={handleLeadSubmit}
      />
    </>
  );
}

// ─── Composant : Banniere felicitations ───────────────────────────────────────

function BannereFelicitations() {
  return (
    <div className="rounded-xl border-2 border-green-300 bg-green-50 p-6 text-center">
      <div className="mb-3 text-4xl">🏠</div>
      <h2 className="mb-2 text-xl font-bold text-[var(--bleu-marine)]">
        Bravo ! Vous avez terminé le parcours ImmoPilot.
      </h2>
      <p className="mb-5 text-sm text-gray-600 max-w-lg mx-auto">
        Vous avez maintenant toutes les clés — au propre comme au figuré — pour réussir votre achat immobilier.
      </p>
      <Link
        href="/parcours"
        className="inline-block rounded-lg bg-[var(--bleu-secondaire)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
      >
        Retour au tableau de bord
      </Link>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function EtapePostAchatPage() {
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
      <ChecklistPostAchat />
      <GuideGaranties />
      <GateLead />
      <BannereFelicitations />

      {/* Timeline demenagement — source: lib/data/demenagement-checklist.ts */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-4">
        <h2 className="mb-3 font-semibold text-[var(--bleu-marine)]">Timeline déménagement</h2>
        <div className="space-y-2">
          {CHECKLIST_DEMENAGEMENT.map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-[var(--gris-fond)] px-3 py-2">
              <span className={`flex-shrink-0 rounded px-2 py-0.5 text-xs font-bold ${
                a.priorite === "obligatoire" ? "bg-red-100 text-red-700" : a.priorite === "recommande" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
              }`}>{a.delai}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{a.action}</p>
                <p className="text-xs text-gray-500">{a.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Declarations post-achat — source: lib/data/post-achat-declarations.ts */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-4">
        <h2 className="mb-3 font-semibold text-[var(--bleu-marine)]">Démarches administratives</h2>
        <div className="space-y-2">
          {DECLARATIONS_POST_ACHAT.map((d, i) => (
            <div key={i} className="rounded-lg border border-[var(--gris-border)] p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{d.nom}</p>
                  <p className="text-xs text-gray-500">{d.detail}</p>
                </div>
                {d.obligatoire && <span className="flex-shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Obligatoire</span>}
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                <span>Délai : {d.delai}</span>
                <span>Où : {d.ou_faire}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fiscalite et declarations — source: lib/data/fiscalite-immo.ts */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-5">
        <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Fiscalité et déclarations</h2>
        <p className="mb-4 text-xs text-gray-500">
          Exonérations, déductions et dispositifs fiscaux immobiliers
        </p>

        {/* Taxe fonciere */}
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-semibold text-green-800">Taxe foncière — exonération logement neuf</p>
          <p className="mt-1 text-xs text-green-700">
            Exonération de {TAXE_FONCIERE_INFO.exoneration_neuf_annees} ans pour les logements neufs (construction ou achat VEFA).
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Base : {TAXE_FONCIERE_INFO.base}. {TAXE_FONCIERE_INFO.note}
          </p>
        </div>

        {/* IFI */}
        <div className="mb-4 rounded-lg border border-[var(--gris-border)] bg-[var(--gris-clair)] px-4 py-3">
          <p className="text-sm font-semibold text-[var(--bleu-marine)]">IFI (Impôt sur la Fortune Immobilière)</p>
          <p className="mt-1 text-xs text-gray-600">
            Seuil : {new Intl.NumberFormat("fr-FR").format(IFI_INFO.seuil_euros)} EUR de patrimoine immobilier net.
            Assiette : {IFI_INFO.assiette}.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Dettes déductibles : {IFI_INFO.dettes_deductibles.join(" ; ")}.
          </p>
        </div>

        {/* Dispositifs fiscaux actifs */}
        <h3 className="mb-2 text-sm font-semibold text-[var(--bleu-marine)]">Dispositifs fiscaux en vigueur</h3>
        <div className="space-y-2">
          {DISPOSITIFS_FISCAUX.filter((d) => d.actif).map((d) => (
            <details key={d.nom} className="group rounded-lg border border-[var(--gris-border)] bg-[var(--gris-clair)]">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--bleu-marine)]">{d.nom}</p>
                  <p className="text-xs text-gray-500">
                    {d.type.replace(/_/g, " ")}
                    {d.date_fin ? ` — valide jusqu'au ${new Date(d.date_fin).toLocaleDateString("fr-FR")}` : ""}
                  </p>
                </div>
                {d.engagement_min_annees > 0 && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                    {d.engagement_min_annees} ans min
                  </span>
                )}
              </summary>
              <div className="border-t border-[var(--gris-border)] px-4 py-3">
                <p className="text-xs text-gray-600 leading-relaxed">{d.description}</p>
                {d.zones_eligibles && (
                  <p className="mt-2 text-xs text-gray-400">Zones : {d.zones_eligibles.join(", ")}</p>
                )}
                {!d.zones_eligibles && (
                  <p className="mt-2 text-xs text-gray-400">Tout territoire (pas de restriction de zone)</p>
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
      etape={10}
      guide={
        <p>
          Félicitations, vous êtes propriétaire ! Il reste quelques démarches administratives importantes
          à effectuer dans les semaines qui suivent l&apos;achat pour être en règle.
        </p>
      }
      outils={tools}
      tips={TIPS}
      checklist={CHECKLIST}
    />
  );
}
