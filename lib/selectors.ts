import type { ProjetImmobilier, EtapeNumber } from "./types";
import { ETAPES } from "./constants";

export interface ProjectSummary {
  budget: number;
  capacite: number;
  ptz: number;
  nb_dossiers: number;
  endettement: number;
  verdict: "financable" | "depassement" | "incomplet";
}

export interface StepInfo {
  numero: EtapeNumber;
  titre: string;
  description: string;
  slug: string;
}

export function getProjectSummary(projet: ProjetImmobilier): ProjectSummary {
  const budget = projet.budget_max;
  const capacite = projet.capacite_emprunt;
  const ptz = projet.montant_ptz;
  const nb_dossiers = projet.dossiers.length;
  const endettement = projet.taux_endettement;

  let verdict: ProjectSummary["verdict"] = "incomplet";
  if (budget > 0 && capacite > 0) {
    const financement = capacite + projet.apport + ptz;
    verdict = financement >= budget ? "financable" : "depassement";
  }

  return { budget, capacite, ptz, nb_dossiers, endettement, verdict };
}

/**
 * 10-step completion rules (v2 structure).
 */
export function getCompletedSteps(projet: ProjetImmobilier): EtapeNumber[] {
  const completed: EtapeNumber[] = [];

  // 1. Definir son projet
  if (projet.revenus_net > 0 && projet.commune !== "" && projet.budget_max > 0) {
    completed.push(1);
  }
  // 2. Definir son budget
  if (projet.capacite_emprunt > 0 && projet.taux_endettement > 0) {
    completed.push(2);
  }
  // 3. Premier feu vert bancaire (accord de principe = capacite validee)
  if (projet.capacite_emprunt > 0) {
    completed.push(3);
  }
  // 4. Rechercher et visiter
  if (projet.dossiers.length > 0) {
    completed.push(4);
  }
  // 5. Verifier et comparer le bien
  if (projet.dossiers.some((d) => d.surface > 0 && d.prix > 0)) {
    completed.push(5);
  }
  // 6. Faire une offre
  if (projet.dossiers.some((d) => d.offre !== null)) {
    completed.push(6);
  }
  // 7. Signer l'avant-contrat
  if (projet.dossiers.some((d) => d.compromis?.signe)) {
    completed.push(7);
  }
  // 8. Obtenir le pret et les assurances
  if (projet.dossiers.some((d) => d.financement?.taux_obtenu != null)) {
    completed.push(8);
  }
  // 9. Signer chez le notaire
  if (projet.dossiers.some((d) => d.notaire?.date_acte != null)) {
    completed.push(9);
  }
  // 10. Emmenager
  const checklist10 = projet.checklists?.[10];
  if (checklist10 && checklist10.length > 0) {
    const pct = checklist10.filter(Boolean).length / checklist10.length;
    if (pct >= 0.5) completed.push(10);
  }

  return completed;
}

export function getCurrentStepInfo(projet: ProjetImmobilier, precomputed?: EtapeNumber[]): StepInfo {
  const completed = precomputed ?? getCompletedSteps(projet);
  const firstIncomplete = ETAPES.map((e) => e.numero).find(
    (n) => !completed.includes(n)
  ) ?? 10;

  const def = ETAPES.find((e) => e.numero === firstIncomplete) ?? ETAPES[0];
  return {
    numero: def.numero,
    titre: def.titre,
    description: def.description,
    slug: def.slug,
  };
}
