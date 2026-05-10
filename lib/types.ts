export interface ProjetImmobilier {
  id: string;
  situation: "celibataire" | "couple" | "famille";
  age: number;
  revenus_net: number;
  revenus_conjoint: number | null;
  charges_fixes: number;
  type_contrat: "cdi" | "cdd" | "independant" | "fonctionnaire" | "autre";
  taille_foyer: number;
  apport: number;
  code_postal: string;
  commune: string;
  type_bien: "appartement" | "maison";
  usage: "residence_principale";
  budget_max: number;
  capacite_emprunt: number;
  taux_endettement: number;
  eligible_ptz: boolean;
  montant_ptz: number;
  duree_souhaitee: number;
  dossiers: DossierBien[];
  etape_courante: EtapeNumber;
  progression: StepProgress[];
  alertes: Alerte[];
  date_creation: string;
  lead_captured: boolean;
  prenom: string;
  checklists: Record<number, boolean[]>;
  schema_version: number;
}

export type EtapeNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface StepProgress {
  etape: EtapeNumber;
  pct: number;
}

export interface DossierBien {
  id: string;
  adresse: string;
  code_postal: string;
  commune: string;
  prix: number;
  surface: number;
  pieces: number;
  etage: number | null;
  exposition: string | null;
  type_chauffage: string | null;
  annee_construction: number;
  url_annonce: string | null;
  type_copro: boolean;
  nb_lots_copro: number | null;
  dpe_energie: DpeClasse;
  dpe_ges: DpeClasse | null;
  audit_energetique_present: boolean;
  charges_copro: number;
  taxe_fonciere: number;
  documents: DocumentRef[];
  checklist_visite: ChecklistItem[];
  date_visite: string | null;
  notes_visite: string | null;
  offre: Offre | null;
  compromis: Compromis | null;
  financement: Financement | null;
  notaire: Notaire | null;
  analyse_ia: RapportAnalyse | null;
  score: number;
  statut: DossierStatut;
}

export type DpeClasse = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type DossierStatut = "en_recherche" | "offre" | "compromis" | "financement" | "acte" | "termine" | "abandonne";

export interface DocumentRef { nom: string; type: string; url: string; }
export interface ChecklistItem { item: string; ok: boolean; }

export interface Offre {
  montant: number | null;
  date: string | null;
  date_expiration: string | null;
  statut: "brouillon" | "envoyee" | "acceptee" | "refusee" | null;
}

export interface Compromis {
  signe: boolean;
  date_signature: string | null;
  date_retractation: string | null;
  depot_garantie: number | null;
  clauses_suspensives: string[];
  date_limite_financement: string | null;
  date_limite_acte: string | null;
}

export interface Financement {
  banque: string | null;
  taux_obtenu: number | null;
  assurance_taux: number | null;
  mensualite: number | null;
  duree: number | null;
  type_garantie: "caution" | "hypotheque" | null;
}

export interface Notaire {
  frais_estimes: number;
  date_acte: string | null;
  notaire_acheteur: string | null;
  notaire_vendeur: string | null;
}

export interface Alerte {
  type: "economie" | "attention" | "danger" | "astuce" | "checklist";
  message: string;
  detail: string;
  etape: EtapeNumber;
  severity: "info" | "warning" | "danger";
  source_reglementaire: string | null;
  date_effet: string | null;
}

export interface RapportAnalyse {
  score_global: number;
  prix_vs_marche: string;
  alertes: Alerte[];
  recommandations: string[];
  points_forts: string[];
  points_vigilance: string[];
  date_analyse: string;
}

export interface LeadCapture {
  email: string;
  telephone: string | null;
  nom: string | null;
  prenom: string | null;
  ville: string | null;
  code_postal: string | null;
  source: LeadSource;
  etape: EtapeNumber;
  consent_partners: boolean;
}

export type LeadSource = "simulation" | "analyse_prix" | "courtier" | "analyse_ia" | "travaux" | "diagnostiqueur" | "assurance" | "demenagement" | "renovation" | "sauvegarde";

export interface SimulationCredit {
  mensualite: number;
  cout_total: number;
  cout_interets: number;
  capacite_emprunt: number;
}

export interface ResultatPTZ {
  eligible: boolean;
  montant: number;
  duree_differee: number;
  duree_remboursement: number;
  raison_ineligibilite: string | null;
}

export interface FraisNotaire {
  total: number;
  droits_mutation: number;
  emoluments: number;
  debours: number;
  contribution_securite: number;
}

export interface ResultatEndettement {
  taux: number;
  mensualite_max: number;
  capacite_emprunt: number;
  conforme_hcsf: boolean;
}
