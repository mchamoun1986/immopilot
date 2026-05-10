import { ETAPES } from "@/lib/constants";
import type { EtapeNumber } from "@/lib/types";

interface ProgressBarProps {
  etapeCourante: EtapeNumber;
  completedSteps: EtapeNumber[];
}

export function ProgressBar({ etapeCourante, completedSteps }: ProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex gap-1">
        {ETAPES.map((etape) => {
          const isCompleted = completedSteps.includes(etape.numero);
          const isCurrent = etape.numero === etapeCourante;
          return (
            <div key={etape.numero} className={`h-1.5 flex-1 rounded-full ${isCompleted ? "bg-green-500" : isCurrent ? "bg-[var(--bleu-secondaire)]" : "bg-gray-200"}`} title={etape.titre} />
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        Etape {etapeCourante} sur {ETAPES.length} &mdash; {ETAPES.find((e) => e.numero === etapeCourante)?.titre}
      </p>
    </div>
  );
}
