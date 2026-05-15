'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listDossiers, createDossier } from "@/lib/dossiers";
import type { DossierBien } from "@/lib/types";
import { DossierMiniCard } from "@/components/dossiers/mini-card";
import { EmptyState } from "@/components/ui/empty-state";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DossiersPage() {
  const router = useRouter();
  const [dossiers, setDossiers] = useState<DossierBien[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDossiers(listDossiers());
    setLoaded(true);
  }, []);

  function handleCreate() {
    const d = createDossier();
    router.push(`/dossiers/${d.id}`);
  }

  if (!loaded) {
    return (
      <div role="status" aria-label="Chargement en cours" className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-secondaire)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--bleu-marine)]">
            Mes dossiers
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {dossiers.length === 0
              ? "Aucun dossier pour l'instant"
              : `${dossiers.length} dossier${dossiers.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-[var(--bleu-secondaire)] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          Créer un nouveau dossier
        </button>
      </div>

      {/* Empty state */}
      {dossiers.length === 0 && (
        <EmptyState
          icon="🏠"
          title="Vous n'avez pas encore de dossier"
          description="Créez-en un pour chaque bien qui vous intéresse."
          actionLabel="Créer mon premier dossier"
          onAction={handleCreate}
        />
      )}

      {/* Dossiers grid */}
      {dossiers.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {dossiers.map((d) => (
            <DossierMiniCard
              key={d.id}
              dossier={d}
              onClick={() => router.push(`/dossiers/${d.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
