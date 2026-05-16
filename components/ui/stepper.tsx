import type { EtapeNumber } from "@/lib/types";
import { ETAPES, PHASES } from "@/lib/constants";

interface StepperProps {
  completedSteps: EtapeNumber[];
  currentStep: EtapeNumber;
  onStepClick?: (step: EtapeNumber) => void;
}

const STEP_ICONS: Record<number, string> = {
  1: "📋", 2: "💰", 3: "🏦", 4: "🔍", 5: "🔎",
  6: "✉️", 7: "📝", 8: "🔐", 9: "🔑", 10: "🏠",
};

export function StepperHorizontal({ completedSteps, currentStep, onStepClick }: StepperProps) {
  const currentDef = ETAPES.find((e) => e.numero === currentStep);
  const currentPhase = PHASES.find((p) => (p.etapes as readonly number[]).includes(currentStep));

  return (
    <div className="mb-6">
      {/* ── Mobile: compact progress bar + current step label ── */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="rounded-full bg-[var(--bleu-action)]/10 px-3 py-1 text-xs font-bold text-[var(--bleu-action)]">
            Étape {currentStep}/10
          </span>
          {currentPhase && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              {currentPhase.label}
            </span>
          )}
        </div>
        {/* Mini progress dots */}
        <div className="flex items-center gap-1">
          {ETAPES.map((etape) => {
            const isCompleted = completedSteps.includes(etape.numero);
            const isCurrent = etape.numero === currentStep;
            return (
              <button
                key={etape.numero}
                onClick={() => onStepClick?.(etape.numero)}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  isCurrent
                    ? "bg-[var(--bleu-action)]"
                    : isCompleted
                      ? "bg-[var(--vert-succes)]"
                      : "bg-gray-200"
                }`}
                aria-label={`Étape ${etape.numero} : ${etape.titre}`}
                aria-current={isCurrent ? "step" : undefined}
              />
            );
          })}
        </div>
      </div>

      {/* ── Desktop: full stepper with circles ── */}
      <div className="hidden lg:block">
        {/* Phase labels */}
        <div className="mb-3 flex items-center">
          {PHASES.map((phase) => (
            <div
              key={phase.id}
              className="flex-1 text-center"
              style={{ flex: phase.etapes.length }}
            >
              <span className="rounded-full bg-[var(--gris-fond)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {phase.label}
              </span>
            </div>
          ))}
        </div>

        {/* Steps circles + connectors */}
        <div className="flex items-center">
          {ETAPES.map((etape, i) => {
            const isCompleted = completedSteps.includes(etape.numero);
            const isCurrent = etape.numero === currentStep;
            return (
              <div key={etape.numero} className="flex flex-1 items-center">
                <button
                  onClick={() => onStepClick?.(etape.numero)}
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    isCompleted
                      ? "bg-[var(--vert-succes)] text-white shadow-sm"
                      : isCurrent
                        ? "bg-[var(--bleu-action)] text-white shadow-md ring-2 ring-[var(--bleu-action)]/30"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                  aria-label={`Étape ${etape.numero} : ${etape.titre}`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4 4 6-6" />
                    </svg>
                  ) : (
                    etape.numero
                  )}
                </button>
                {i < ETAPES.length - 1 && (
                  <div
                    className={`mx-0.5 h-0.5 flex-1 rounded ${
                      completedSteps.includes(etape.numero) ? "bg-[var(--vert-succes)]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Labels with icons */}
        <div className="mt-2 flex items-start justify-between">
          {ETAPES.map((etape) => {
            const isCompleted = completedSteps.includes(etape.numero);
            const isCurrent = etape.numero === currentStep;
            return (
              <div key={etape.numero} className="flex-1 text-center">
                <span className="text-xs" aria-hidden="true">{STEP_ICONS[etape.numero]}</span>
                <p className={`text-[10px] leading-tight ${
                  isCurrent ? "font-bold text-[var(--bleu-action)]" : isCompleted ? "font-medium text-[var(--vert-succes)]" : "text-gray-400"
                }`}>
                  {etape.titre}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
