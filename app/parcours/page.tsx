'use client';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { loadProjet, createEmptyProjet } from "@/lib/storage";
import { getProjectSummary, getCompletedSteps, getCurrentStepInfo } from "@/lib/selectors";
import { buildProjectAlerts } from "@/lib/alertes";
import { ETAPES, NB_ETAPES } from "@/lib/constants";
import type { ProjetImmobilier } from "@/lib/types";
import { KpiCard } from "@/components/ui/kpi-card";
import { StepperHorizontal } from "@/components/ui/stepper";
import { AlertCard } from "@/components/ui/alert-card";
import { DossierMiniCard } from "@/components/dossiers/mini-card";
import { EmptyState } from "@/components/ui/empty-state";
import { fmt } from "@/lib/utils/format";

export default function DashboardPage() {
  const router = useRouter();
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);

  useEffect(() => {
    setProjet(loadProjet() ?? createEmptyProjet());
  }, []);

  const summary = useMemo(() => projet ? getProjectSummary(projet) : null, [projet]);
  const completedSteps = useMemo(() => projet ? getCompletedSteps(projet) : [], [projet]);
  const currentStep = useMemo(() => projet ? getCurrentStepInfo(projet, completedSteps) : null, [projet, completedSteps]);
  const alertes = useMemo(() => projet ? buildProjectAlerts(projet) : [], [projet]);

  if (!projet || !summary || !currentStep) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-action)] border-t-transparent" />
      </div>
    );
  }

  const dossiers = projet.dossiers.slice(0, 4);
  const greeting = projet.prenom ? `Bonjour ${projet.prenom} !` : "Bonjour !";

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--bleu-marine)]">{greeting}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Votre projet avance bien — étape {currentStep.numero} sur {NB_ETAPES}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Budget" value={summary.budget > 0 ? `${fmt(summary.budget)} EUR` : "\u2014"} href="/parcours/1-projet" />
        <KpiCard label="Capacité" value={summary.capacite > 0 ? `${fmt(summary.capacite)} EUR` : "\u2014"} color="var(--bleu-action)" href="/parcours/2-budget" />
        <KpiCard label="PTZ" value={summary.ptz > 0 ? `${fmt(summary.ptz)} EUR` : "\u2014"} color="var(--vert-succes)" href="/parcours/2-budget" />
        <KpiCard label="Dossiers" value={String(summary.nb_dossiers)} color="var(--rouge-fr)" href="/dossiers" />
      </div>

      {/* Stepper */}
      <div>
        <StepperHorizontal
          completedSteps={completedSteps}
          currentStep={currentStep.numero}
          onStepClick={(n) => {
            const etape = ETAPES.find((e) => e.numero === n);
            if (etape) router.push(`/parcours/${etape.slug}`);
          }}
        />
        <div className="card-hero mt-2">
          <p className="text-sm font-semibold opacity-80">Étape {currentStep.numero}</p>
          <p className="mt-1 text-lg font-bold">{currentStep.titre}</p>
          <p className="mt-1 text-sm opacity-80">{currentStep.description}</p>
          <button
            onClick={() => router.push(`/parcours/${currentStep.slug}`)}
            className="mt-3 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-[var(--bleu-marine)] hover:opacity-90"
          >
            Continuer &rarr;
          </button>
        </div>
      </div>

      {/* Alertes */}
      {alertes.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Alertes</h2>
          {alertes.slice(0, 3).map((a, i) => (
            <AlertCard
              key={i}
              severity={a.severity === "danger" ? "danger" : a.severity === "warning" ? "warning" : "info"}
              title={a.message}
              detail={a.detail}
            />
          ))}
          {alertes.length > 3 && (
            <p className="text-sm text-gray-500">
              +{alertes.length - 3} autres alertes — consultez chaque étape pour les détails
            </p>
          )}
        </div>
      )}

      {/* Dossiers */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Mes dossiers</h2>
        {dossiers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {dossiers.map((d) => (
                <DossierMiniCard
                  key={d.id}
                  dossier={d}
                  onClick={() => router.push(`/dossiers/${d.id}`)}
                />
              ))}
            </div>
            {projet.dossiers.length > 4 && (
              <button
                onClick={() => router.push("/dossiers")}
                className="mt-3 text-sm text-[var(--bleu-action)] hover:underline"
              >
                Voir tous mes dossiers ({projet.dossiers.length})
              </button>
            )}
          </>
        ) : (
          <EmptyState
            icon="🏠"
            title="Aucun dossier pour l'instant"
            description="Créez votre premier dossier pour suivre un bien."
            actionLabel="Créer un dossier"
            onAction={() => router.push("/dossiers")}
          />
        )}
      </div>

      {/* Dossier de financement */}
      <div className="card-hero mt-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">Dossier de financement</p>
            <p className="mt-1 text-xs text-blue-200/70">Générez un dossier complet pour votre banque — profil, capacité, plan de financement, alertes.</p>
          </div>
          <button
            onClick={() => router.push("/parcours/dossier-financement")}
            className="flex-shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[var(--bleu-marine)] hover:opacity-90"
          >
            Générer le PDF
          </button>
        </div>
      </div>
    </div>
  );
}
