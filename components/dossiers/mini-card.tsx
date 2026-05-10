import type { DossierBien } from "@/lib/types";
import { DpeBadge } from "@/components/ui/dpe-badge";
import { fmt } from "@/lib/utils/format";

interface DossierMiniCardProps {
  dossier: DossierBien;
  onClick: () => void;
}

export function DossierMiniCard({ dossier, onClick }: DossierMiniCardProps) {
  const label = dossier.adresse || dossier.commune || "Nouveau dossier";

  return (
    <button
      onClick={onClick}
      className="card-elevated hover-lift w-full bg-white text-left"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-sm font-semibold text-[var(--bleu-marine)]">{label}</p>
        <DpeBadge classe={dossier.dpe_energie} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        {dossier.prix > 0 && <span className="font-semibold text-gray-800">{fmt(dossier.prix)} EUR</span>}
        {dossier.surface > 0 && <span>{dossier.surface} m2</span>}
        {dossier.score > 0 && (
          <span className="ml-auto rounded-full bg-[var(--gris-fond)] px-2 py-0.5 font-semibold text-gray-700">
            {dossier.score}/100
          </span>
        )}
      </div>
    </button>
  );
}
