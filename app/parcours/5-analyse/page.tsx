'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/parcours/step-layout";
import { getTipsForEtape } from "@/lib/data/tips-par-etape";
import { loadProjet, createEmptyProjet } from "@/lib/storage";
import { listDossiers } from "@/lib/dossiers";
import { DIAGNOSTICS_OBLIGATOIRES, COUT_PACK_DIAGNOSTICS } from "@/lib/data/diagnostics-obligatoires";
import { CALENDRIER_PASSOIRES } from "@/lib/data/dpe-rules";
import { ALERTES_COPRO, DOCUMENTS_COPRO_VENTE, FONDS_TRAVAUX_ALUR } from "@/lib/data/copropriete-rules";
import { COUTS_TRAVAUX, AIDES_RENOVATION } from "@/lib/data/travaux-renovation";
import { REGLES_URBANISME, DROIT_PREEMPTION_URBAIN } from "@/lib/data/urbanisme-rules";
import type { ProjetImmobilier, DossierBien } from "@/lib/types";
import { fmt } from "@/lib/utils/format";
import { DpeBadge } from "@/components/ui/dpe-badge";

const TIPS = getTipsForEtape(5);

const CHECKLIST = [
  "J'ai verifie le DPE et les diagnostics obligatoires",
  "J'ai consulte les prix du quartier sur DVF Etalab",
  "J'ai demande les PV d'AG (si copropriete)",
  "J'ai verifie les risques sur georisques.gouv.fr",
  "J'ai fait ma decision : je fonce ou je passe",
];

export default function AnalysePage() {
  const router = useRouter();
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);
  const [dossiers, setDossiers] = useState<DossierBien[]>([]);

  useEffect(() => {
    setProjet(loadProjet() ?? createEmptyProjet());
    setDossiers(listDossiers());
  }, []);

  if (!projet) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-action)] border-t-transparent" />
      </div>
    );
  }

  const tools = (
    <div className="space-y-6">
      {/* Dossiers existants */}
      {dossiers.length > 0 ? (
        <div className="rounded-xl border border-[var(--gris-border)] bg-white p-5">
          <h2 className="mb-3 font-semibold text-[var(--bleu-marine)]">Vos biens a analyser</h2>
          <div className="space-y-2">
            {dossiers.map((d) => (
              <button
                key={d.id}
                onClick={() => router.push(`/dossiers/${d.id}`)}
                className="flex w-full items-center justify-between rounded-lg bg-[var(--gris-fond)] px-4 py-3 text-left hover:bg-gray-100 transition"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--bleu-marine)]">{d.adresse || d.commune || "Nouveau dossier"}</p>
                  <p className="text-xs text-gray-500">
                    {d.prix > 0 ? `${fmt(d.prix)} EUR` : "Prix non renseigne"} &middot; {d.surface > 0 ? `${d.surface} m2` : "Surface ?"}
                  </p>
                </div>
                <DpeBadge classe={d.dpe_energie} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-[var(--gris-border)] bg-[var(--gris-fond)] p-8 text-center">
          <p className="text-base font-semibold text-gray-700">Aucun dossier a analyser</p>
          <p className="mt-1 text-sm text-gray-500">Creez un dossier dans l&apos;etape &quot;Rechercher et visiter&quot; d&apos;abord.</p>
          <button
            onClick={() => router.push("/parcours/4-recherche")}
            className="mt-4 rounded-xl bg-[var(--bleu-action)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Retour a la recherche
          </button>
        </div>
      )}

      {/* Diagnostics obligatoires */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-5">
        <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Diagnostics obligatoires a verifier</h2>
        <p className="mb-4 text-xs text-gray-500">
          Cout estimatif pack complet : {COUT_PACK_DIAGNOSTICS.appartement.min}-{COUT_PACK_DIAGNOSTICS.appartement.max} EUR (appart) / {COUT_PACK_DIAGNOSTICS.maison.min}-{COUT_PACK_DIAGNOSTICS.maison.max} EUR (maison)
        </p>
        <div className="space-y-2">
          {DIAGNOSTICS_OBLIGATOIRES.map((d) => (
            <div key={d.code} className="rounded-lg bg-[var(--gris-fond)] px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--bleu-marine)]">{d.nom}</p>
                  <p className="text-xs text-gray-500">{d.description}</p>
                </div>
                <span className="flex-shrink-0 text-xs text-gray-400">Validite : {d.validite}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Obligatoire si : {d.obligatoire_si} &middot; Cout : {d.cout_moyen_euros.min}-{d.cout_moyen_euros.max} EUR
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Calendrier passoires thermiques */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-5">
        <h2 className="mb-3 font-semibold text-[var(--bleu-marine)]">Calendrier des interdictions de location</h2>
        <div className="space-y-2">
          {CALENDRIER_PASSOIRES.map((p) => (
            <div key={p.classe} className="flex items-center gap-3 rounded-lg bg-red-50 px-4 py-3">
              <DpeBadge classe={p.classe} />
              <div>
                <p className="text-sm font-semibold text-red-800">{p.description}</p>
                <p className="text-xs text-red-600">A partir du {new Date(p.date_interdiction).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lien DVF */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-2">
          <span>📊</span>
          <div>
            <p className="text-sm font-semibold text-blue-900">Comparez les prix du quartier</p>
            <p className="mt-0.5 text-sm text-blue-800">
              Le site DVF Etalab montre les prix reels des transactions immobilieres.
              C&apos;est votre meilleur outil pour savoir si le prix demande est juste.
            </p>
            <a
              href="https://app.dvf.etalab.gouv.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:underline"
            >
              Ouvrir DVF Etalab &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Points de vigilance copropriete — source: lib/data/copropriete-rules.ts */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-5">
        <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Points de vigilance copropriete</h2>
        <p className="mb-4 text-xs text-gray-500">
          Fonds de travaux : minimum {FONDS_TRAVAUX_ALUR.taux_minimum_budget_previsionnel}% du budget previsionnel (loi Alur)
        </p>

        <div className="mb-4 space-y-2">
          {ALERTES_COPRO.map((a, i) => (
            <div
              key={i}
              className={`rounded-lg px-4 py-3 ${
                a.niveau === "danger"
                  ? "border border-red-300 bg-red-50"
                  : a.niveau === "attention"
                  ? "border border-orange-300 bg-orange-50"
                  : "border border-blue-200 bg-blue-50"
              }`}
            >
              <p className={`text-sm font-semibold ${
                a.niveau === "danger" ? "text-red-800" : a.niveau === "attention" ? "text-orange-800" : "text-blue-800"
              }`}>
                {a.niveau === "danger" ? "Alerte" : a.niveau === "attention" ? "Attention" : "Info"} — {a.condition}
              </p>
              <p className="mt-1 text-xs text-gray-600">{a.message}</p>
            </div>
          ))}
        </div>

        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-[var(--bleu-secondaire)] hover:underline">
            Documents obligatoires en copropriete ({DOCUMENTS_COPRO_VENTE.length})
          </summary>
          <div className="mt-2 space-y-1">
            {DOCUMENTS_COPRO_VENTE.map((d) => (
              <div key={d.nom} className="flex items-start justify-between rounded bg-[var(--gris-clair)] px-3 py-2 text-xs">
                <div>
                  <span className="font-medium text-gray-800">{d.nom}</span>
                  <span className="ml-1 text-gray-500">— {d.description}</span>
                </div>
                <span className="flex-shrink-0 text-gray-400 ml-2">Fourni par : {d.qui_fournit}</span>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* Estimation travaux — source: lib/data/travaux-renovation.ts */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-5">
        <h2 className="mb-1 font-semibold text-[var(--bleu-marine)]">Estimation travaux</h2>
        <p className="mb-4 text-xs text-gray-500">
          Fourchettes de prix indicatives — marche 2026
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--gris-border)] text-left text-xs text-gray-500">
                <th className="pb-2 pr-3">Type de travaux</th>
                <th className="pb-2 pr-3">Cout min</th>
                <th className="pb-2 pr-3">Cout max</th>
                <th className="pb-2">Unite</th>
              </tr>
            </thead>
            <tbody>
              {COUTS_TRAVAUX.map((t) => (
                <tr key={t.type} className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-medium text-[var(--bleu-marine)]">{t.type}</td>
                  <td className="py-2 pr-3">{fmt(t.cout_m2_min)}</td>
                  <td className="py-2 pr-3">{fmt(t.cout_m2_max)}</td>
                  <td className="py-2 text-gray-500">{t.unite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <details className="mt-4 group">
          <summary className="cursor-pointer text-sm font-medium text-[var(--bleu-secondaire)] hover:underline">
            Aides renovation disponibles ({AIDES_RENOVATION.length})
          </summary>
          <div className="mt-2 space-y-2">
            {AIDES_RENOVATION.map((a) => (
              <div key={a.nom} className="rounded-lg border border-[var(--gris-border)] bg-[var(--gris-clair)] px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--bleu-marine)]">{a.nom}</p>
                  {a.montant_max && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                      Max {fmt(a.montant_max)} EUR
                    </span>
                  )}
                </div>
                <ul className="mt-2 space-y-1">
                  {a.conditions.slice(0, 3).map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-xs text-gray-400">Cumulable avec : {a.cumulable.join(", ")}</p>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* Urbanisme — source: lib/data/urbanisme-rules.ts */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <h2 className="mb-1 font-semibold text-blue-900">Urbanisme</h2>
        <p className="mb-3 text-xs text-blue-700">
          {DROIT_PREEMPTION_URBAIN.type} — delai de reponse : {DROIT_PREEMPTION_URBAIN.delai_reponse_mois} mois (silence = {DROIT_PREEMPTION_URBAIN.silence_vaut.toLowerCase()})
        </p>
        <div className="space-y-2">
          {REGLES_URBANISME.map((r) => (
            <div key={r.nom} className="rounded-lg bg-white/60 px-3 py-2">
              <p className="text-sm font-semibold text-blue-900">{r.nom}</p>
              <p className="text-xs text-blue-800">{r.description}</p>
              <p className="text-xs text-blue-600 mt-0.5">Ou consulter : {r.ou_consulter}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <StepLayout
      etape={5}
      guide={
        <p>
          Vous avez identifie un bien qui vous interesse. Avant de faire une offre,
          verifiez tout : DPE, diagnostics, charges de copropriete, prix du quartier,
          risques naturels. Cette etape vous evite les mauvaises surprises.
        </p>
      }
      outils={tools}
      tips={TIPS}
      checklist={CHECKLIST}
    />
  );
}
