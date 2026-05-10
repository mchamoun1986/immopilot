import type { ProjetImmobilier, EtapeNumber } from "./types";

const STORAGE_KEY = "immopilot_projet";
const CURRENT_SCHEMA_VERSION = 3;

// Mapping old 8-step etape numbers to new 10-step numbers
const ETAPE_MAP_V1_TO_V2: Record<number, EtapeNumber> = {
  1: 1, 2: 2, 3: 4, 4: 6, 5: 7, 6: 8, 7: 9, 8: 10,
};

function migrateProjet(p: ProjetImmobilier): ProjetImmobilier {
  const version = p.schema_version ?? 1;
  if (version >= CURRENT_SCHEMA_VERSION) return p;

  // V1 → V2: 8 steps → 10 steps
  if (version < 2) {
    // Migrate etape_courante
    p.etape_courante = ETAPE_MAP_V1_TO_V2[p.etape_courante] ?? 1;

    // Migrate checklists keyed by old step numbers
    if (p.checklists) {
      const newChecklists: Record<number, boolean[]> = {};
      for (const [key, val] of Object.entries(p.checklists)) {
        const newKey = ETAPE_MAP_V1_TO_V2[Number(key)];
        if (newKey) newChecklists[newKey] = val;
      }
      p.checklists = newChecklists;
    }

    p.schema_version = 2;
  }

  // V2 → V3: add sources_captured
  if (version < 3) {
    if (!p.sources_captured) {
      p.sources_captured = [];
    }
    p.schema_version = 3;
  }

  return p;
}

export function createEmptyProjet(): ProjetImmobilier {
  return {
    id: crypto.randomUUID(),
    situation: "celibataire",
    age: 0,
    revenus_net: 0,
    revenus_conjoint: null,
    charges_fixes: 0,
    type_contrat: "cdi",
    taille_foyer: 1,
    apport: 0,
    code_postal: "",
    commune: "",
    type_bien: "appartement",
    usage: "residence_principale",
    budget_max: 0,
    capacite_emprunt: 0,
    taux_endettement: 0,
    eligible_ptz: false,
    montant_ptz: 0,
    duree_souhaitee: 20,
    dossiers: [],
    etape_courante: 1,
    progression: [],
    alertes: [],
    date_creation: new Date().toISOString(),
    lead_captured: false,
    prenom: "",
    checklists: {},
    schema_version: CURRENT_SCHEMA_VERSION,
    sources_captured: [],
  };
}

export function saveProjet(projet: ProjetImmobilier): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projet));
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export function saveProjetDebounced(projet: ProjetImmobilier): void {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveProjet(projet);
  }, 400);
}

export function loadProjet(): ProjetImmobilier | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as ProjetImmobilier;
    return migrateProjet(p);
  } catch {
    return null;
  }
}

export function clearProjet(): void {
  localStorage.removeItem(STORAGE_KEY);
}
