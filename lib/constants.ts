import type { EtapeNumber } from "./types";

export const BRAND = {
  name: "ImmoPilot",
  colors: {
    bleu_marine: "#1a365d",
    rouge_francais: "#c1272d",
    blanc: "#ffffff",
    bleu_secondaire: "#2563eb",
    gris_clair: "#f8fafc",
    gris_border: "#e2e8f0",
  },
} as const;

export interface StepDefinition {
  numero: EtapeNumber;
  slug: string;
  titre: string;
  description: string;
  phase: "preparer" | "trouver" | "acheter" | "finaliser";
  jalon: string;
}

export const ETAPES: StepDefinition[] = [
  // Phase: Préparer
  { numero: 1, slug: "1-projet", titre: "Définir son projet", description: "Situation, budget, zone, type de bien", phase: "preparer", jalon: "Je sais ce que je cherche" },
  { numero: 2, slug: "2-budget", titre: "Définir son budget", description: "Capacité d'emprunt, PTZ, aides, frais notaire", phase: "preparer", jalon: "Je connais mon budget réel" },
  { numero: 3, slug: "3-accord-bancaire", titre: "Premier feu vert bancaire", description: "Accord de principe, attestation financement", phase: "preparer", jalon: "Je peux prouver mon financement" },
  // Phase: Trouver
  { numero: 4, slug: "4-recherche", titre: "Rechercher et visiter", description: "Portails, agents, visites, checklist", phase: "trouver", jalon: "J'ai une short-list de biens" },
  { numero: 5, slug: "5-analyse", titre: "Vérifier et comparer", description: "DPE, diagnostics, copro, prix m²", phase: "trouver", jalon: "J'ai validé un bien à cibler" },
  // Phase: Acheter
  { numero: 6, slug: "6-offre", titre: "Faire une offre", description: "Prix, conditions, négociation", phase: "acheter", jalon: "Mon offre est acceptée" },
  { numero: 7, slug: "7-avant-contrat", titre: "Signer l'avant-contrat", description: "Compromis, clauses, rétractation 10j", phase: "acheter", jalon: "Mon achat est encadré juridiquement" },
  { numero: 8, slug: "8-financement", titre: "Prêt et assurances", description: "Offre de prêt, assurance emprunteur, MRH", phase: "acheter", jalon: "Mon financement est sécurisé" },
  // Phase: Finaliser & s'installer
  { numero: 9, slug: "9-acte", titre: "Signer chez le notaire", description: "Acte authentique, frais, remise des clés", phase: "finaliser", jalon: "J'ai les clés" },
  { numero: 10, slug: "10-emmenagement", titre: "Emménager", description: "Déménagement, adresse, compteurs, impôts", phase: "finaliser", jalon: "Je suis chez moi" },
];

export const PHASES = [
  { id: "preparer", label: "Préparer", etapes: [1, 2, 3] },
  { id: "trouver", label: "Trouver", etapes: [4, 5] },
  { id: "acheter", label: "Acheter", etapes: [6, 7, 8] },
  { id: "finaliser", label: "Finaliser", etapes: [9, 10] },
] as const;

export const TAUX_ENDETTEMENT_MAX = 0.35;
export const DUREE_MAX_PRET_ANNEES = 25;
export const DELAI_RETRACTATION_JOURS = 10;
export const NB_ETAPES = 10;
