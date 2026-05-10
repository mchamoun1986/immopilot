import type { EtapeNumber } from "@/lib/types";
import { ETAPES, PHASES } from "@/lib/constants";

interface StepperProps {
  completedSteps: EtapeNumber[];
  currentStep: EtapeNumber;
  onStepClick?: (step: EtapeNumber) => void;
}

// Icon per step — small visual cue
const STEP_ICONS: Record<number, string> = {
  1: "📋", 2: "💰", 3: "🏦", 4: "🔍", 5: "🔎",
  6: "✉️", 7: "📝", 8: "🔐", 9: "🔑", 10: "🏠",
};

export function StepperHorizontal({ completedSteps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="mb-6">
      {/* Phase labels — desktop only */}
      <div className="mb-3 hidden items-center lg:flex">
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

      {/* Steps */}
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
                aria-label={`Etape ${etape.numero}: ${etape.titre}`}
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

      {/* Labels with icons — desktop only */}
      <div className="mt-2 hidden items-start justify-between lg:flex">
        {ETAPES.map((etape) => {
          const isCompleted = completedSteps.includes(etape.numero);
          const isCurrent = etape.numero === currentStep;
          return (
            <div key={etape.numero} className="flex-1 text-center">
              <span className="text-xs">{STEP_ICONS[etape.numero]}</span>
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
  );
}
