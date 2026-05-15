'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/parcours/step-layout";
import { loadProjet, saveProjetDebounced, flushPendingSave, createEmptyProjet } from "@/lib/storage";
import type { ProjetImmobilier } from "@/lib/types";
import { getTipsForEtape } from "@/lib/data/tips-par-etape";
import { GARANTIES_CONSTRUCTEUR, ECHEANCIER_VEFA, GARANTIE_FINANCIERE_ACHEVEMENT } from "@/lib/data/vefa-rules";

const TIPS = getTipsForEtape(1);

export default function EtapeProjetPage() {
  const router = useRouter();
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const p = loadProjet() ?? createEmptyProjet();
    setProjet(p);
    setLoaded(true);
    return () => flushPendingSave();
  }, []);

  const update = <K extends keyof ProjetImmobilier>(key: K, value: ProjetImmobilier[K]) => {
    if (!projet) return;
    const next = { ...projet, [key]: value };
    setProjet(next);
    saveProjetDebounced(next);
  };

  if (!loaded || !projet) {
    return (
      <div role="status" aria-label="Chargement en cours" className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-secondaire)] border-t-transparent" />
      </div>
    );
  }

  const showConjoint = projet.situation === "couple" || projet.situation === "famille";

  const handleNext = () => {
    router.push("/parcours/2-budget");
  };

  const formContent = (
    <div className="space-y-6">
      {/* Situation */}
      <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
        <h2 className="mb-3 font-semibold text-[var(--bleu-marine)]">Votre situation</h2>
        <div className="space-y-4">
          {/* Prenom */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="prenom">
              Votre prénom <span className="text-gray-400">(optionnel)</span>
            </label>
            <input
              id="prenom"
              type="text"
              value={projet.prenom ?? ""}
              onChange={(e) => update("prenom", e.target.value)}
              placeholder="Ex. Thomas"
              className="w-full max-w-xs rounded-xl border border-[var(--gris-border)] px-4 py-2.5 text-sm focus:border-[var(--bleu-action)] focus:outline-none"
            />
          </div>

          {/* Situation familiale */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Situation familiale</label>
            <div className="flex flex-wrap gap-3" role="group" aria-label="Situation familiale">
              {(["celibataire", "couple", "famille"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    update("situation", s);
                    if (s === "celibataire") update("revenus_conjoint", null);
                  }}
                  aria-pressed={projet.situation === s}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    projet.situation === s
                      ? "border-[var(--bleu-secondaire)] bg-[var(--bleu-secondaire)] text-white"
                      : "border-[var(--gris-border)] bg-white text-gray-700 hover:border-[var(--bleu-secondaire)]"
                  }`}
                >
                  {s === "celibataire" ? "Célibataire" : s === "couple" ? "En couple" : "Famille"}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="age">
              Votre âge
            </label>
            <input
              id="age"
              type="number"
              min={18}
              max={99}
              value={projet.age || ""}
              onChange={(e) => update("age", parseInt(e.target.value) || 0)}
              placeholder="Ex. 32"
              className="w-full max-w-xs rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
          </div>

          {/* Taille du foyer */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="taille_foyer">
              Nombre de personnes dans le foyer
            </label>
            <input
              id="taille_foyer"
              type="number"
              min={1}
              max={10}
              value={projet.taille_foyer || ""}
              onChange={(e) => update("taille_foyer", parseInt(e.target.value) || 1)}
              placeholder="Ex. 2"
              className="w-full max-w-xs rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
          </div>

          {/* Type de contrat */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="type_contrat">
              Type de contrat de travail
            </label>
            <select
              id="type_contrat"
              value={projet.type_contrat}
              onChange={(e) => update("type_contrat", e.target.value as ProjetImmobilier["type_contrat"])}
              className="w-full max-w-xs rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            >
              <option value="cdi">CDI (salarié)</option>
              <option value="fonctionnaire">Fonctionnaire / titulaire</option>
              <option value="cdd">CDD</option>
              <option value="independant">Indépendant / freelance</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Revenus et charges */}
      <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
        <h2 className="mb-3 font-semibold text-[var(--bleu-marine)]">Revenus et charges</h2>
        <div className="space-y-4">
          {/* Revenus nets */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="revenus_net">
              Revenus nets mensuels <span className="text-gray-400">(après impôts, avant charges)</span>
            </label>
            <div className="relative max-w-xs">
              <input
                id="revenus_net"
                type="number"
                min={0}
                value={projet.revenus_net || ""}
                onChange={(e) => update("revenus_net", parseFloat(e.target.value) || 0)}
                placeholder="Ex. 3500"
                className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 pr-10 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
              />
              <span className="absolute right-3 top-2 text-sm text-gray-400">EUR</span>
            </div>
          </div>

          {/* Revenus conjoint */}
          {showConjoint && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="revenus_conjoint">
                Revenus nets mensuels du conjoint
              </label>
              <div className="relative max-w-xs">
                <input
                  id="revenus_conjoint"
                  type="number"
                  min={0}
                  value={projet.revenus_conjoint ?? ""}
                  onChange={(e) => update("revenus_conjoint", parseFloat(e.target.value) || 0)}
                  placeholder="Ex. 2800"
                  className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 pr-10 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-sm text-gray-400">EUR</span>
              </div>
            </div>
          )}

          {/* Charges fixes */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="charges_fixes">
              Charges fixes mensuelles{" "}
              <span className="text-gray-400">(crédits en cours, pension alimentaire, etc.)</span>
            </label>
            <div className="relative max-w-xs">
              <input
                id="charges_fixes"
                type="number"
                min={0}
                value={projet.charges_fixes || ""}
                onChange={(e) => update("charges_fixes", parseFloat(e.target.value) || 0)}
                placeholder="Ex. 400"
                className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 pr-10 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
              />
              <span className="absolute right-3 top-2 text-sm text-gray-400">EUR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projet immobilier */}
      <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
        <h2 className="mb-3 font-semibold text-[var(--bleu-marine)]">Votre projet</h2>
        <div className="space-y-4">
          {/* Apport */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="apport">
              Apport personnel disponible
            </label>
            <div className="relative max-w-xs">
              <input
                id="apport"
                type="number"
                min={0}
                value={projet.apport || ""}
                onChange={(e) => update("apport", parseFloat(e.target.value) || 0)}
                placeholder="Ex. 30000"
                className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 pr-10 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
              />
              <span className="absolute right-3 top-2 text-sm text-gray-400">EUR</span>
            </div>
          </div>

          {/* Budget max */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="budget_max">
              Budget maximum envisagé
            </label>
            <div className="relative max-w-xs">
              <input
                id="budget_max"
                type="number"
                min={0}
                value={projet.budget_max || ""}
                onChange={(e) => update("budget_max", parseFloat(e.target.value) || 0)}
                placeholder="Ex. 250000"
                className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 pr-10 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
              />
              <span className="absolute right-3 top-2 text-sm text-gray-400">EUR</span>
            </div>
          </div>

          {/* Type de bien */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Type de bien recherché</label>
            <div className="flex gap-3" role="group" aria-label="Type de bien recherché">
              {(["appartement", "maison"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update("type_bien", t)}
                  aria-pressed={projet.type_bien === t}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    projet.type_bien === t
                      ? "border-[var(--bleu-secondaire)] bg-[var(--bleu-secondaire)] text-white"
                      : "border-[var(--gris-border)] bg-white text-gray-700 hover:border-[var(--bleu-secondaire)]"
                  }`}
                >
                  {t === "appartement" ? "Appartement" : "Maison"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Localisation */}
      <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4">
        <h2 className="mb-3 font-semibold text-[var(--bleu-marine)]">Localisation souhaitée</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="code_postal">
              Code postal
            </label>
            <input
              id="code_postal"
              type="text"
              maxLength={5}
              value={projet.code_postal}
              onChange={(e) => update("code_postal", e.target.value)}
              placeholder="Ex. 69001"
              className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="commune">
              Commune
            </label>
            <input
              id="commune"
              type="text"
              value={projet.commune}
              onChange={(e) => update("commune", e.target.value)}
              placeholder="Ex. Lyon"
              className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* CTA passer à l'étape suivante */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="rounded-lg bg-[var(--bleu-secondaire)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Passer à l&apos;étape suivante &rarr;
        </button>
      </div>

      {/* Si achat dans le neuf — source: lib/data/vefa-rules.ts */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="mb-1 font-semibold text-blue-900">Si vous achetez dans le neuf (VEFA)</h2>
        <p className="mb-3 text-xs text-blue-700">
          {GARANTIE_FINANCIERE_ACHEVEMENT.description}
        </p>

        <h3 className="mb-2 text-sm font-semibold text-blue-900">Échéancier des appels de fonds</h3>
        <div className="space-y-1 mb-4">
          {ECHEANCIER_VEFA.map((e) => (
            <div key={e.etape} className="flex items-center justify-between rounded bg-white/60 px-3 py-2 text-xs">
              <span className="text-gray-700">{e.etape}</span>
              <span className="font-bold text-blue-900">{e.pourcentage_max}%</span>
            </div>
          ))}
        </div>

        <h3 className="mb-2 text-sm font-semibold text-blue-900">Garanties constructeur</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {GARANTIES_CONSTRUCTEUR.map((g) => (
            <div key={g.nom} className="rounded-lg bg-white/60 px-3 py-2">
              <p className="text-xs font-bold text-blue-900">{g.nom}</p>
              <p className="text-xs text-blue-800">{g.duree_annees} an{g.duree_annees > 1 ? "s" : ""}</p>
              <p className="mt-1 text-xs text-blue-700">{g.couvre}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <StepLayout
      etape={1}
      guide={
        <p>
          Définissez votre projet immobilier. Ces informations serviront à calculer votre
          capacité d&apos;emprunt, votre éligibilité au PTZ, et à personnaliser vos alertes tout
          au long du parcours.
        </p>
      }
      tips={TIPS}
      outils={formContent}
    />
  );
}
