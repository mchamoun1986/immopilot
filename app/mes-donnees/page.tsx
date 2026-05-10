'use client';

import { useEffect, useState } from "react";
import { clearProjet } from "@/lib/storage";

interface LocalDataSummary {
  hasProjet: boolean;
  leadsCount: number;
  extraKeys: string[];
  totalKeys: number;
}

function getLocalDataSummary(): LocalDataSummary {
  const allKeys = Object.keys(localStorage).filter((k) => k.startsWith("immopilot_"));
  const hasProjet = allKeys.includes("immopilot_projet");
  let leadsCount = 0;
  const rawLeads = localStorage.getItem("immopilot_leads");
  if (rawLeads) {
    try {
      const parsed = JSON.parse(rawLeads) as unknown[];
      leadsCount = Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      leadsCount = 0;
    }
  }
  const extraKeys = allKeys.filter(
    (k) => k !== "immopilot_projet" && k !== "immopilot_leads"
  );
  return { hasProjet, leadsCount, extraKeys, totalKeys: allKeys.length };
}

export default function MesDonneesPage() {
  const [summary, setSummary] = useState<LocalDataSummary | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    setSummary(getLocalDataSummary());
  }, []);

  const handleDeleteAll = () => {
    // Remove all immopilot_ keys
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("immopilot_"));
    keys.forEach((k) => localStorage.removeItem(k));
    clearProjet(); // belt-and-suspenders
    setDeleted(true);
    setConfirmDelete(false);
    setSummary(getLocalDataSummary());
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-[var(--bleu-marine)]">Mes donnees</h1>
      <p className="mb-8 text-sm text-gray-500">
        Toutes les donnees ImmoPilot sont stockees localement dans votre navigateur.
        Aucun compte n&apos;est requis.
      </p>

      {deleted ? (
        <div className="rounded-xl border border-green-300 bg-green-50 p-6 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-base font-semibold text-green-800">Donnees supprimees</p>
          <p className="mt-1 text-sm text-gray-600">
            Toutes vos donnees locales ImmoPilot ont ete effacees de ce navigateur.
          </p>
          <a
            href="/"
            className="mt-5 inline-block rounded-lg bg-[var(--bleu-secondaire)] px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Retour a l&apos;accueil
          </a>
        </div>
      ) : (
        <>
          {/* Summary */}
          {summary && (
            <section className="mb-8">
              <h2 className="mb-3 text-lg font-semibold text-[var(--bleu-marine)]">
                Donnees stockees localement
              </h2>
              <div className="rounded-lg border border-[var(--gris-border)] bg-white divide-y divide-[var(--gris-border)]">
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-gray-600">Projet immobilier</span>
                  <span className={`font-semibold ${summary.hasProjet ? "text-[var(--bleu-marine)]" : "text-gray-400"}`}>
                    {summary.hasProjet ? "Present" : "Aucun"}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-gray-600">Formulaires soumis (leads)</span>
                  <span className={`font-semibold ${summary.leadsCount > 0 ? "text-[var(--bleu-marine)]" : "text-gray-400"}`}>
                    {summary.leadsCount} {summary.leadsCount === 1 ? "entree" : "entrees"}
                  </span>
                </div>
                {summary.extraKeys.length > 0 && (
                  <div className="px-4 py-3 text-sm">
                    <p className="mb-2 text-gray-600">Autres donnees (outils, checklists)</p>
                    <div className="flex flex-wrap gap-1">
                      {summary.extraKeys.map((k) => (
                        <code key={k} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
                          {k}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="font-semibold text-gray-700">Total cles immopilot</span>
                  <span className="font-bold text-[var(--bleu-marine)]">{summary.totalKeys}</span>
                </div>
              </div>
            </section>
          )}

          {/* Delete section */}
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-[var(--bleu-marine)]">
              Supprimer mes donnees
            </h2>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="mb-3 text-sm text-gray-700">
                Cette action supprime <strong>toutes les donnees ImmoPilot</strong> stockees
                dans ce navigateur (projet, simulations, checklists, formulaires). Cette action
                est <strong>irreversible</strong>.
              </p>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="rounded-lg border border-red-500 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Supprimer toutes mes donnees
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="rounded-lg border border-red-400 bg-white px-3 py-2 text-sm font-semibold text-red-700">
                    Etes-vous certain ? Cette action est irreversible.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAll}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Oui, tout supprimer
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Serveur */}
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-[var(--bleu-marine)]">
              Donnees serveur
            </h2>
            <div className="rounded-lg border border-[var(--gris-border)] bg-white p-4 text-sm text-gray-700">
              <p>
                Si vous avez soumis un formulaire, vos donnees de contact peuvent etre stockees
                sur nos serveurs. Pour demander leur suppression :
              </p>
              <p className="mt-2">
                <a
                  href="mailto:contact@immopilot.fr"
                  className="text-[var(--bleu-secondaire)] underline hover:opacity-80"
                >
                  contact@immopilot.fr
                </a>
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Nous traitons les demandes de suppression sous 30 jours, conformement au RGPD.
              </p>
            </div>
          </section>

          <p className="text-xs text-gray-400">
            En savoir plus :{" "}
            <a href="/mentions-legales" className="text-[var(--bleu-secondaire)] underline hover:opacity-80">
              Politique de confidentialite
            </a>
          </p>
        </>
      )}
    </main>
  );
}
