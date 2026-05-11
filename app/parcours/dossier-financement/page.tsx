'use client';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { loadProjet } from "@/lib/storage";
import { getCompletedSteps } from "@/lib/selectors";
import { buildProjectAlerts } from "@/lib/alertes";
import { calculerMensualite } from "@/lib/calculateurs/credit";
import { calculerEndettement } from "@/lib/calculateurs/endettement";
import { calculerFraisNotaire } from "@/lib/calculateurs/notaire";
import { calculerPTZ } from "@/lib/calculateurs/ptz";
import type { ProjetImmobilier, DossierBien } from "@/lib/types";
import { fmt, fmtPct, formatDateLong, fmtEur } from "@/lib/utils/format";

// ─── Section components (print-optimized) ────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 mb-4 border-b-2 border-[var(--bleu-marine)] pb-2 text-lg font-bold text-[var(--bleu-marine)] print:mt-6 print:text-base">{children}</h2>;
}

function Row({ label, value, bold, danger }: { label: string; value: string; bold?: boolean; danger?: boolean }) {
  return (
    <div className="flex justify-between border-b border-gray-100 py-2 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={`${bold ? "font-bold" : "font-semibold"} ${danger ? "text-red-600" : "text-[var(--bleu-marine)]"}`}>{value}</span>
    </div>
  );
}

function TotalRow({ label, value, variant }: { label: string; value: string; variant: "blue" | "green" | "red" }) {
  const colors = {
    blue: "bg-[var(--bleu-marine)] text-white",
    green: "bg-green-600 text-white",
    red: "bg-red-600 text-white",
  };
  return (
    <div className={`flex justify-between rounded-lg px-4 py-2.5 text-sm font-bold ${colors[variant]}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DossierFinancementPage() {
  const router = useRouter();
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);

  useEffect(() => {
    const p = loadProjet();
    if (!p) { router.push("/parcours"); return; }
    setProjet(p);
  }, [router]);

  const data = useMemo(() => {
    if (!projet) return null;

    const revenus = projet.revenus_net + (projet.revenus_conjoint ?? 0);
    const taux = 3.5;
    const duree = projet.duree_souhaitee || 20;
    const montantEmprunt = Math.max(0, projet.budget_max - projet.apport);
    const credit = calculerMensualite(montantEmprunt, taux, duree);
    const endettement = calculerEndettement(revenus, projet.charges_fixes, taux, duree);
    const fraisNotaire = calculerFraisNotaire(projet.budget_max, "ancien");
    // TODO: lookup real zone from projet.code_postal via zones-communes.ts
    const zone = "B1";
    const ptzResult = calculerPTZ({
      zone,
      revenu_fiscal: Math.round(revenus * 12 * 0.9),
      taille_foyer: projet.taille_foyer,
      cout_operation: projet.budget_max,
    });
    const completedSteps = getCompletedSteps(projet);
    const alertes = buildProjectAlerts(projet);
    const budgetTotal = projet.budget_max + fraisNotaire.total;
    const financementTotal = projet.apport + endettement.capacite_emprunt + (ptzResult.eligible ? ptzResult.montant : 0);
    const resteAVivre = revenus - credit.mensualite - projet.charges_fixes;

    return {
      revenus, taux, duree, montantEmprunt, credit, endettement, fraisNotaire,
      ptzResult, completedSteps, alertes, budgetTotal, financementTotal, resteAVivre,
    };
  }, [projet]);

  if (!projet || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-action)] border-t-transparent" />
      </div>
    );
  }

  const dossierPrincipal: DossierBien | null = projet.dossiers[0] ?? null;
  const todayStr = formatDateLong(new Date());
  const isFinancable = data.financementTotal >= data.budgetTotal;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 print:max-w-none print:px-12 print:py-0">
      {/* Print button — hidden on print */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-[var(--bleu-action)]">&larr; Retour</button>
        <button
          onClick={() => window.print()}
          className="rounded-xl bg-[var(--rouge-fr)] px-6 py-3 text-sm font-bold text-white shadow hover:opacity-90"
        >
          Télécharger en PDF
        </button>
      </div>

      {/* ── Couverture ──────────────────────────────────────────────── */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-[var(--bleu-marine)] to-[#1e3a5f] p-10 text-white print:rounded-none print:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">ImmoPilot</p>
        <h1 className="mt-2 text-3xl font-extrabold print:text-2xl">Dossier de Financement</h1>
        <p className="mt-1 text-lg text-blue-200">Projet d&apos;acquisition immobilière</p>
        <div className="mt-6 space-y-1 text-sm text-blue-200/80">
          {projet.prenom && <p>Emprunteur : <strong className="text-white">{projet.prenom}</strong></p>}
          <p>Date : <strong className="text-white">{todayStr}</strong></p>
          <p>Budget envisagé : <strong className="text-white">{fmt(projet.budget_max)} EUR</strong></p>
          <p>Étapes complétées : <strong className="text-white">{data.completedSteps.length} / 10</strong></p>
        </div>
      </div>

      {/* ── 1. Profil Emprunteur ────────────────────────────────────── */}
      <SectionTitle>1. Profil de l&apos;emprunteur</SectionTitle>
      <div className="space-y-0">
        {projet.prenom && <Row label="Prénom" value={projet.prenom} />}
        <Row label="Situation familiale" value={projet.situation === "celibataire" ? "Célibataire" : projet.situation === "couple" ? "En couple" : "Famille"} />
        <Row label="Âge" value={projet.age > 0 ? `${projet.age} ans` : "Non renseigné"} />
        <Row label="Taille du foyer" value={`${projet.taille_foyer} personne${projet.taille_foyer > 1 ? "s" : ""}`} />
        <Row label="Type de contrat" value={projet.type_contrat.toUpperCase()} />
        <Row label="Revenus nets mensuels" value={`${fmt(projet.revenus_net)} EUR`} bold />
        {projet.revenus_conjoint != null && projet.revenus_conjoint > 0 && (
          <Row label="Revenus conjoint" value={`${fmt(projet.revenus_conjoint)} EUR`} />
        )}
        <Row label="Revenus totaux du foyer" value={`${fmt(data.revenus)} EUR / mois`} bold />
        <Row label="Charges fixes mensuelles" value={`${fmt(projet.charges_fixes)} EUR`} />
      </div>

      {/* ── 2. Capacite Financiere ──────────────────────────────────── */}
      <SectionTitle>2. Capacité financière</SectionTitle>
      <div className="space-y-0 mb-4">
        <Row label="Capacité d'emprunt" value={`${fmt(data.endettement.capacite_emprunt)} EUR`} bold />
        <Row label="Mensualité max autorisée" value={`${fmt(data.endettement.mensualite_max)} EUR / mois`} />
        <Row label="Taux d'endettement actuel" value={`${fmtPct(data.endettement.taux)}%`} danger={!data.endettement.conforme_hcsf} />
        <Row label="Conformité HCSF (35%)" value={data.endettement.conforme_hcsf ? "CONFORME" : "NON CONFORME"} danger={!data.endettement.conforme_hcsf} />
        <Row label="Apport personnel" value={`${fmt(projet.apport)} EUR`} bold />
      </div>

      {/* Barre endettement */}
      <div className="rounded-lg border border-gray-200 p-4 print:border-gray-300">
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span className="font-semibold">{`${fmtPct(data.endettement.taux)}%`}</span>
          <span className="font-medium text-orange-600">Plafond 35%</span>
        </div>
        <div className="relative h-4 overflow-hidden rounded-full bg-gray-200 print:bg-gray-100">
          <div className="absolute top-0 h-full w-0.5 bg-orange-500" style={{ left: "70%" }} />
          <div
            className={`h-full rounded-full ${data.endettement.conforme_hcsf ? "bg-green-500" : "bg-red-500"}`}
            style={{ width: `${Math.min((data.endettement.taux / 0.5) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* ── 3. Projet Immobilier ────────────────────────────────────── */}
      <SectionTitle>3. Projet immobilier</SectionTitle>
      <div className="space-y-0 mb-4">
        <Row label="Type de bien recherché" value={projet.type_bien === "appartement" ? "Appartement" : "Maison"} />
        <Row label="Usage" value="Résidence principale" />
        <Row label="Commune visée" value={projet.commune || "Non renseignée"} />
        <Row label="Code postal" value={projet.code_postal || "Non renseigné"} />
        <Row label="Budget max" value={`${fmt(projet.budget_max)} EUR`} bold />
      </div>

      {dossierPrincipal && (
        <>
          <h3 className="mt-4 mb-2 text-sm font-bold text-[var(--bleu-marine)]">Bien identifié</h3>
          <div className="space-y-0 rounded-lg border border-gray-200 p-4">
            <Row label="Adresse" value={dossierPrincipal.adresse || "Non renseignée"} />
            <Row label="Commune" value={dossierPrincipal.commune || "—"} />
            <Row label="Prix" value={`${fmt(dossierPrincipal.prix)} EUR`} bold />
            <Row label="Surface" value={`${dossierPrincipal.surface} m2`} />
            <Row label="Pièces" value={`${dossierPrincipal.pieces}`} />
            <Row label="DPE Énergie" value={dossierPrincipal.dpe_energie} danger={["F", "G"].includes(dossierPrincipal.dpe_energie)} />
            <Row label="Année de construction" value={dossierPrincipal.annee_construction > 0 ? String(dossierPrincipal.annee_construction) : "—"} />
            {dossierPrincipal.type_copro && <Row label="Copropriété" value={`Oui — ${dossierPrincipal.charges_copro} EUR/mois charges`} />}
          </div>
        </>
      )}

      {/* ── 4. Plan de Financement ──────────────────────────────────── */}
      <div className="print:break-before-page" />
      <SectionTitle>4. Plan de financement</SectionTitle>

      <h3 className="mb-2 text-sm font-bold text-gray-500 uppercase tracking-wide">Besoin total</h3>
      <div className="space-y-0 mb-3">
        <Row label="Prix du bien" value={`${fmt(projet.budget_max)} EUR`} />
        <Row label="Frais de notaire (ancien, est.)" value={`${fmt(data.fraisNotaire.total)} EUR`} />
      </div>
      <TotalRow label="TOTAL BESOIN" value={`${fmt(data.budgetTotal)} EUR`} variant="blue" />

      <h3 className="mt-6 mb-2 text-sm font-bold text-gray-500 uppercase tracking-wide">Sources de financement</h3>
      <div className="space-y-0 mb-3">
        <Row label="Apport personnel" value={`${fmt(projet.apport)} EUR`} />
        <Row label="Crédit immobilier (capacité)" value={`${fmt(data.endettement.capacite_emprunt)} EUR`} />
        {data.ptzResult.eligible && (
          <Row label="Prêt à Taux Zéro (PTZ)" value={`${fmt(data.ptzResult.montant)} EUR`} />
        )}
      </div>
      <TotalRow label="TOTAL FINANCEMENT" value={`${fmt(data.financementTotal)} EUR`} variant="green" />

      {/* Verdict */}
      <div className={`mt-4 rounded-lg border-2 p-4 text-center ${
        isFinancable ? "border-green-400 bg-green-50 text-green-800" : "border-red-400 bg-red-50 text-red-800"
      }`}>
        <p className="text-base font-bold">
          {isFinancable
            ? `PROJET FINANÇABLE — excédent de ${fmtEur(data.financementTotal - data.budgetTotal)}`
            : `DÉPASSEMENT DE ${fmtEur(data.budgetTotal - data.financementTotal)}`
          }
        </p>
      </div>

      {/* ── 5. Simulation Credit ────────────────────────────────────── */}
      <SectionTitle>5. Simulation de crédit</SectionTitle>
      <div className="space-y-0 mb-4">
        <Row label="Montant emprunté" value={`${fmt(data.montantEmprunt)} EUR`} bold />
        <Row label="Taux nominal (indicatif)" value={`${data.taux}%`} />
        <Row label="Durée" value={`${data.duree} ans (${data.duree * 12} mois)`} />
        <Row label="Mensualité estimée" value={`${fmt(data.credit.mensualite)} EUR / mois`} bold />
        <Row label="Coût total du crédit" value={`${fmt(data.credit.cout_total)} EUR`} />
        <Row label="Coût des intérêts" value={`${fmt(data.credit.cout_interets)} EUR`} />
      </div>

      {/* Reste a vivre */}
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-bold text-[var(--bleu-marine)]">Reste à vivre mensuel</h3>
        <div className="space-y-0">
          <Row label="Revenus nets" value={`${fmt(data.revenus)} EUR`} />
          <Row label="- Mensualité crédit" value={`- ${fmt(data.credit.mensualite)} EUR`} />
          <Row label="- Charges fixes" value={`- ${fmt(projet.charges_fixes)} EUR`} />
        </div>
        <TotalRow
          label="RESTE A VIVRE"
          value={`${fmt(data.resteAVivre)} EUR / mois`}
          variant={data.resteAVivre > 0 ? "green" : "red"}
        />
      </div>

      {/* ── 6. Eligibilite PTZ ──────────────────────────────────────── */}
      <SectionTitle>6. Éligibilité au Prêt à Taux Zéro</SectionTitle>
      <div className="space-y-0">
        <Row label="Éligible" value={data.ptzResult.eligible ? "OUI" : "NON"} bold danger={!data.ptzResult.eligible} />
        {data.ptzResult.eligible ? (
          <>
            <Row label="Montant PTZ" value={`${fmt(data.ptzResult.montant)} EUR`} bold />
            <Row label="Durée différée (sans remboursement)" value={`${data.ptzResult.duree_differee} ans`} />
            <Row label="Durée de remboursement" value={`${data.ptzResult.duree_remboursement} ans`} />
          </>
        ) : (
          <Row label="Raison" value={data.ptzResult.raison_ineligibilite || "Conditions non remplies"} />
        )}
      </div>

      {/* ── 7. Frais de notaire ─────────────────────────────────────── */}
      <SectionTitle>7. Détail des frais de notaire</SectionTitle>
      <div className="space-y-0 mb-3">
        <Row label="Droits de mutation (taxes)" value={`${fmt(data.fraisNotaire.droits_mutation)} EUR`} />
        <Row label="Émoluments du notaire" value={`${fmt(data.fraisNotaire.emoluments)} EUR`} />
        <Row label="Débours forfaitaires" value={`${fmt(data.fraisNotaire.debours)} EUR`} />
        <Row label="Contribution sécurité immobilière" value={`${fmt(data.fraisNotaire.contribution_securite)} EUR`} />
      </div>
      <TotalRow label="TOTAL FRAIS DE NOTAIRE" value={`${fmt(data.fraisNotaire.total)} EUR`} variant="blue" />

      {/* ── 8. Alertes ──────────────────────────────────────────────── */}
      {data.alertes.length > 0 && (
        <>
          <SectionTitle>8. Alertes et points d&apos;attention</SectionTitle>
          <div className="space-y-2">
            {data.alertes.map((a, i) => (
              <div key={i} className={`rounded-lg border p-3 text-sm ${
                a.severity === "danger" ? "border-red-300 bg-red-50" : "border-orange-300 bg-orange-50"
              }`}>
                <p className={`font-semibold ${a.severity === "danger" ? "text-red-800" : "text-orange-800"}`}>{a.message}</p>
                <p className={`mt-0.5 ${a.severity === "danger" ? "text-red-700" : "text-orange-700"}`}>{a.detail}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── 9. Documents a fournir ──────────────────────────────────── */}
      <div className="print:break-before-page" />
      <SectionTitle>9. Documents à fournir à la banque</SectionTitle>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 print:grid-cols-2">
        {[
          { cat: "Identité", docs: ["Pièce d'identité (CNI ou passeport)", "Justificatif de domicile (< 3 mois)", "Livret de famille (si applicable)"] },
          { cat: "Revenus", docs: ["3 derniers bulletins de salaire", "2 derniers avis d'imposition", "Contrat de travail ou attestation employeur"] },
          { cat: "Patrimoine", docs: ["3 derniers relevés bancaires (tous comptes)", "Justificatif d'apport (épargne, donation, vente)", "Tableaux d'amortissement (crédits en cours)"] },
          { cat: "Projet", docs: ["Compromis de vente (si signé)", "Diagnostics immobiliers (DPE, amiante, etc.)", "Devis travaux (si applicable)", "Plan de financement (ce document)"] },
        ].map((section) => (
          <div key={section.cat} className="rounded-lg border border-gray-200 p-3 print:border-gray-300">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{section.cat}</p>
            <ul className="space-y-1">
              {section.docs.map((doc) => (
                <li key={doc} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border border-gray-300 text-[8px]">&nbsp;</span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div className="mt-10 border-t border-gray-200 pt-4 text-center text-xs text-gray-400 print:mt-6">
        <p>Document généré par <strong>ImmoPilot</strong> le {todayStr}</p>
        <p className="mt-1">Ce document est un outil d&apos;aide à la décision. Il ne constitue pas une offre de prêt ni un engagement contractuel.</p>
        <p>Les montants sont indicatifs et basés sur les informations saisies par l&apos;utilisateur.</p>
        <p className="mt-2">Sources : ANIL, service-public.fr, Banque de France, LegiFrance</p>
      </div>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          header, footer, nav, .print\\:hidden { display: none !important; }
          main { padding: 0 !important; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>
    </div>
  );
}
