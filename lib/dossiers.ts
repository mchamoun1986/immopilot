import type { DossierBien, DossierStatut, DpeClasse } from "./types";
import { loadProjet, saveProjet, createEmptyProjet } from "./storage";

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createEmptyDossier(): DossierBien {
  return {
    id: crypto.randomUUID(),
    adresse: "",
    code_postal: "",
    commune: "",
    prix: 0,
    surface: 0,
    pieces: 0,
    etage: null,
    exposition: null,
    type_chauffage: null,
    annee_construction: 0,
    url_annonce: null,
    type_copro: false,
    nb_lots_copro: null,
    dpe_energie: "D" as DpeClasse,
    dpe_ges: null,
    audit_energetique_present: false,
    charges_copro: 0,
    taxe_fonciere: 0,
    documents: [],
    checklist_visite: [],
    date_visite: null,
    notes_visite: null,
    offre: null,
    compromis: null,
    financement: null,
    notaire: null,
    analyse_ia: null,
    score: 0,
    statut: "en_recherche" as DossierStatut,
  };
}

// ─── CRUD helpers ────────────────────────────────────────────────────────────

/**
 * Creates an empty dossier, appends it to the projet, persists, and returns it.
 */
export function createDossier(): DossierBien {
  const projet = loadProjet() ?? createEmptyProjet();
  const dossier = createEmptyDossier();
  projet.dossiers = [...projet.dossiers, dossier];
  saveProjet(projet);
  return dossier;
}

export function getDossier(id: string): DossierBien | null {
  const projet = loadProjet();
  if (!projet) return null;
  return projet.dossiers.find((d) => d.id === id) ?? null;
}

export function updateDossier(id: string, updates: Partial<DossierBien>): void {
  const projet = loadProjet() ?? createEmptyProjet();
  projet.dossiers = projet.dossiers.map((d) =>
    d.id === id ? { ...d, ...updates } : d
  );
  saveProjet(projet);
}

export function deleteDossier(id: string): void {
  const projet = loadProjet() ?? createEmptyProjet();
  projet.dossiers = projet.dossiers.filter((d) => d.id !== id);
  saveProjet(projet);
}

export function listDossiers(): DossierBien[] {
  const projet = loadProjet();
  return projet?.dossiers ?? [];
}
