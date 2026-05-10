/** Regles de copropriete — loi Alur et obligations.
 * Source: LegiFrance (loi Alur 2014, loi ELAN 2018, loi Climat 2021, loi 3DS 2022), service-public.fr — verifie le 2026-05-09
 * MAJ 2026-05-09: fonds de travaux taux 5% confirme. Dispense corrigee (3 cas legaux).
 * Depuis 01/01/2025: fonds de travaux etendu aux syndicats <= 50 lots (loi Climat art. 171).
 * MAJ 2026-05-09: DPE collectif obligatoire pour TOUTES les coproprietes depuis 01/01/2026.
 * MAJ 2026-05-09: Mise en conformite reglement copropriete — loi ELAN art. 206 fixait
 *   une echeance au 01/01/2026, MAIS la loi 3DS 2022 a supprime l'obligation stricte
 *   et la remplace par: porter la question a CHAQUE AG. Fortement recommande (risque contentieux).
 * MAJ 2026-05-09: Diagnostic Structurel — decret 2025-814 du 12/08/2025 — obligation
 *   portee par le syndicat dans les secteurs delimites par la commune (18 mois apres notif).
 */

export interface DocumentCoproObligatoire {
  nom: string;
  description: string;
  qui_fournit: string;
}

/** Source: service-public.fr — documents obligatoires vente en copropriete */
export const DOCUMENTS_COPRO_VENTE: DocumentCoproObligatoire[] = [
  { nom: "Reglement de copropriete", description: "Regles de fonctionnement de l'immeuble", qui_fournit: "Syndic" },
  { nom: "Etat descriptif de division", description: "Repartition des lots et tantiemes", qui_fournit: "Syndic" },
  { nom: "PV des AG des 3 dernieres annees", description: "Decisions votees, travaux prevus", qui_fournit: "Syndic" },
  { nom: "Fiche synthetique", description: "Donnees cles : nb lots, budget, dette, fonds travaux", qui_fournit: "Syndic" },
  { nom: "Carnet d'entretien", description: "Historique des travaux realises sur les parties communes", qui_fournit: "Syndic" },
  { nom: "Pre-etat date", description: "Situation comptable du vendeur (charges dues, avances)", qui_fournit: "Syndic" },
  { nom: "Diagnostic Technique Global (DTG)", description: "Etat technique de l'immeuble (si vote en AG)", qui_fournit: "Syndic" },
];

export const FONDS_TRAVAUX_ALUR = {
  taux_minimum_budget_previsionnel: 5,
  /** Sans PPT : minimum 5% du budget previsionnel.
   * Avec PPT adopte : minimum le plus eleve entre 2.5% du cout PPT et 5% du budget previsionnel.
   */
  taux_avec_ppt_minimum_cout_ppt: 2.5,
  obligatoire_depuis: "2017-01-01",
  /** Source: LegiFrance art. 14-2 loi 1965, service-public.gouv.fr/F34026 — verifie le 2026-05-09
   * Extension aux syndicats <= 50 lots depuis 01/01/2025 (loi Climat n°2021-1104 art. 171).
   * 3 cas de dispense legaux (vote unanime AG requis sauf DTG) :
   *   1. Immeuble neuf : syndicat constitue depuis moins de 10 ans apres reception des travaux
   *   2. Moins de 10 lots a usage de logements/bureaux/commerces : vote unanime AG
   *   3. DTG realise ne faisant apparaitre aucun besoin de travaux dans les 10 prochaines annees
   */
  dispense_si: [
    "Syndicat constitue depuis moins de 10 ans (immeuble neuf)",
    "Copropriete de moins de 10 lots — vote unanime AG (art. 14-2-1)",
    "DTG realise sans besoin de travaux dans les 10 prochaines annees — pendant duree de validite du DTG",
  ],
  base_legale: "Loi Alur art. 14-2 loi du 10/07/1965 — modifie loi ELAN 2018 et loi Climat 2021",
} as const;

export interface AlerteCopro {
  condition: string;
  niveau: "info" | "attention" | "danger";
  message: string;
}

export const ALERTES_COPRO: AlerteCopro[] = [
  { condition: "charges_copro > 300 par mois", niveau: "attention", message: "Charges de copropriete elevees — verifier le detail dans les PV d'AG et le budget previsionnel." },
  { condition: "nb_lots > 100", niveau: "info", message: "Grande copropriete — verifier la gouvernance, le syndic professionnel, et l'historique des travaux." },
  { condition: "fonds_travaux < 5%", niveau: "danger", message: "Le fonds de travaux est inferieur au minimum legal (5% du budget). Risque d'appel de fonds exceptionnel." },
  { condition: "pas_dtg", niveau: "info", message: "Pas de Diagnostic Technique Global — envisagez de le demander ou de verifier l'etat des parties communes lors de la visite." },
  { condition: "pas_dpe_collectif", niveau: "attention", message: "DPE collectif obligatoire depuis 01/01/2026 pour toutes coproprietes. Si absent, le syndicat est en infraction. A verifier avant achat." },
  { condition: "reglement_copro_anterieur_2019", niveau: "info", message: "Reglement de copropriete anterieur a la loi ELAN (2018) — verifier si mise en conformite a ete votee en AG (loi 3DS 2022 : obligation a porter a chaque AG, sinon risque contentieux)." },
];

/** Nouvelles obligations copropriete depuis 2025-2026
 * Source: legifrance, service-public.fr — verifie le 2026-05-09
 */
export const OBLIGATIONS_COPRO_2025_2026 = {
  dpe_collectif: {
    obligatoire_depuis: "2026-01-01",
    concerne: "Toutes coproprietes avec au moins 2 lots",
    responsable: "Syndicat des coproprietaires (syndic)",
    impact_vente: "Le vendeur doit annexer le DPE collectif a la promesse si etabli",
    validite: "10 ans",
    base_legale: "Loi Climat 2021 — art. L731-2 CCH",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F37504",
  },
  diagnostic_structurel: {
    obligatoire_depuis: "2025-08-15",
    concerne: "Batiments collectifs > 15 ans dans secteurs definis par la commune",
    responsable: "Syndicat des coproprietaires",
    delai: "18 mois apres notification par la commune",
    base_legale: "Loi Habitat Degrade n°2024-322 du 09/04/2024 — decret 2025-814 du 12/08/2025",
    url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052097247",
  },
  conformite_reglement: {
    situation: "Loi 3DS 2022 a assoupli l'obligation ELAN — plus d'echeance stricte au 01/01/2026",
    obligation_actuelle: "Porter la question de mise en conformite a CHAQUE AG (art. 206 loi ELAN modifie)",
    risque_sans_conformite: "Contentieux en cas de vente, travaux, ou litige entre coproprietaires",
    base_legale: "Loi ELAN 2018 art. 206 — modifie loi 3DS n°2022-217 du 21/02/2022",
  },
} as const;
