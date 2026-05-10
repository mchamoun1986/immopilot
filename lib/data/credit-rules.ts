/** Regles du credit immobilier en France.
 * Source: Banque de France, HCSF — verifie le 2026-05-09
 */

export interface RegleHCSF {
  taux_endettement_max: number;
  duree_max_annees: number;
  duree_max_vefa_annees: number;
  date_entree_vigueur: string;
  base_legale: string;
}

export const REGLE_HCSF: RegleHCSF = {
  taux_endettement_max: 0.35,
  duree_max_annees: 25,
  duree_max_vefa_annees: 27,
  date_entree_vigueur: "2022-01-01",
  base_legale: "Decision HCSF du 29/09/2021 — norme juridiquement contraignante",
} as const;

export interface TauxUsure {
  categorie: string;
  taux: number;
  periode: string;
}

/**
 * Source: Banque de France — Avis du 26 mars 2026, applicable du 1er avril au 30 juin 2026
 * https://www.banque-france.fr/fr/statistiques/taux-et-cours/taux-dusure-2026-q2
 * https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053724000
 * Verifie le 2026-05-09 — confirme par moneyvox.fr, meilleurtaux.com, ymanci.fr
 */
export const TAUX_USURE: TauxUsure[] = [
  { categorie: "Pret fixe < 10 ans",  taux: 4.00, periode: "T2 2026" },
  { categorie: "Pret fixe 10-20 ans", taux: 4.48, periode: "T2 2026" },
  { categorie: "Pret fixe >= 20 ans", taux: 5.19, periode: "T2 2026" },
  { categorie: "Pret variable",        taux: 5.00, periode: "T2 2026" },
  { categorie: "Pret-relais",          taux: 6.20, periode: "T2 2026" },
] as const;

export interface RegleIRA {
  description: string;
  plafond_pourcentage_crd: number;
  plafond_mois_interets: number;
  exoneration_vente_mutation: boolean;
}

/**
 * Source: Code de la consommation Art. L313-47 et R313-25
 * IRA = le moins eleve de : 3% du CRD OU 6 mois d'interets sur le CRD
 * Exonerations legales (Art. L313-48) :
 *   - Vente suite a mutation professionnelle
 *   - Vente suite a deces d'un des co-emprunteurs
 *   - Vente suite a cessation forcee d'activite (licenciement)
 * Note : exoneration_vente_mutation = false signifie qu'une vente simple (sans mutation/deces/licenciement)
 * n'exonere PAS des IRA — l'emprunteur les doit quand meme
 */
export const REGLE_IRA: RegleIRA = {
  description: "Indemnites de Remboursement Anticipe — plafond legal",
  plafond_pourcentage_crd: 3,
  plafond_mois_interets: 6,
  exoneration_vente_mutation: false, // vente simple ne suffit pas — voir exonerations legales ci-dessus
} as const;

export interface TauxMarcheIndicatif {
  duree: number;
  taux_moyen: number;
  taux_bon: number;
  taux_excellent: number;
  date_maj: string;
}

/**
 * Taux indicatifs du marche — mai 2026
 *
 * Sources croisees :
 * - CAFPI barometre hebdo : https://www.cafpi.fr/credit-immobilier/barometre-taux
 * - Observatoire Credit Logement/CSA : https://www.lobservatoirecreditlogement.fr/
 * - Meilleurtaux barometre : https://www.meilleurtaux.com/credit-immobilier/barometre-des-taux.html
 * - Banque de France taux effectif moyen T2 2026
 *
 * Verifie le 2026-05-10
 *
 * IMPORTANT : Ces taux sont INDICATIFS et varient selon :
 * - Le profil de l'emprunteur (revenus, apport, contrat, anciennete)
 * - La banque et la region
 * - Les conditions de marche au moment de la demande
 * - Le taux d'apport (plus l'apport est eleve, meilleur est le taux)
 * Le taux final est negocie individuellement avec votre banque.
 */
export const TAUX_MARCHE: TauxMarcheIndicatif[] = [
  { duree: 10, taux_moyen: 3.02, taux_bon: 2.92, taux_excellent: 2.82, date_maj: "2026-05-10" },
  { duree: 15, taux_moyen: 3.18, taux_bon: 3.06, taux_excellent: 3.00, date_maj: "2026-05-10" },
  { duree: 20, taux_moyen: 3.32, taux_bon: 3.27, taux_excellent: 3.05, date_maj: "2026-05-10" },
  { duree: 25, taux_moyen: 3.43, taux_bon: 3.31, taux_excellent: 3.20, date_maj: "2026-05-10" },
] as const;

/**
 * Disclaimer a afficher partout ou les taux sont montres.
 */
export const DISCLAIMER_TAUX = "Ces taux sont indicatifs et varient selon votre profil, votre apport, la banque et les conditions de marche. Seule une offre de pret de votre banque fait foi." as const;
