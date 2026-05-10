/** Baremes des frais de notaire — emoluments et droits de mutation.
 * Source: notaires.fr, arrete du 25/02/2026 (NOR: ECOC2604872A), en vigueur le 01/03/2026
 * Valable jusqu'au 29/02/2028
 * verifie le 2026-05-09 (immopilot-juridique + immopilot-donnees)
 *
 * EMOLUMENTS PROPORTIONNELS — CHANGE au 01/03/2026 (arrete 25/02/2026) :
 *   Tranche 1 : 3.870% → 3.945%
 *   Tranche 2 : 1.596% → 1.627%
 *   Tranche 3 : 1.064% → 1.085%
 *   Tranche 4 : 0.799% → 0.814%
 * Source: legifrance.gouv.fr/jorf/id/JORFTEXT000053593921
 *
 * DROITS DE MUTATION (DMTO) — ATTENTION VARIABILITE DEPUIS 2025 :
 *   TAUX_DROITS_MUTATION_ANCIEN = 5.806% reste la reference nationale de base.
 *   MAIS loi de finances 2025 autorise les departements a augmenter le taux
 *   departemental de +0.5 point (4.5% → 5%) entre 01/04/2025 et 31/03/2028.
 *   Certains departements ont vote cette hausse (ex: Nord => ~6.32% depuis 01/05/2025).
 *   Exception: primo-accedants pour residence principale exoneres de la majoration.
 *   => Toujours verifier le taux reel aupres du notaire selon le departement.
 * Source: notaires.fr, service-public.gouv.fr/actualites/A18183
 */

export interface TrancheEmoluments {
  de: number;
  a: number;
  taux: number;
}

export const TRANCHES_EMOLUMENTS: TrancheEmoluments[] = [
  { de: 0,     a: 6500,     taux: 3.945 },
  { de: 6500,  a: 17000,    taux: 1.627 },
  { de: 17000, a: 60000,    taux: 1.085 },
  { de: 60000, a: Infinity, taux: 0.814 },
];

export const TAUX_DROITS_MUTATION_ANCIEN = 0.05806;
export const TAUX_DROITS_MUTATION_NEUF = 0.00715;
export const DEBOURS_FORFAIT = 1200;
export const TAUX_CONTRIBUTION_SECURITE = 0.001;

/** DMTO PAR DEPARTEMENT — loi de finances 2025 art. 116
 * 83 departements sur 101 ont vote la hausse de +0.5 pt (taux departemental 4.5% → 5.0%)
 * Taux global avec majoration : ~6.31-6.32% (5.0% + 1.20% taxe communale + frais assiette)
 * Periode d'application : 01/04/2025 → 31/03/2028
 * Exoneration : primo-accedants pour residence principale (n'ont pas ete proprietaires
 *   de leur RP au cours des 2 dernieres annees avant signature acte).
 * Source: service-public.gouv.fr/A18183, notaires.fr — verifie le 2026-05-09
 *
 * Departements SANS hausse (taux departemental reste 4.5%, taux global ~5.81%) :
 *   Ain (01), Indre (36), Morbihan (56)*, Isere (38), Corse-du-Sud (2A), Haute-Corse (2B)
 *   et quelques autres — liste definitive a verifier via notaires.fr/syage.notaires.fr
 *   * Morbihan : hausse votee au 01/06/2025, cf. evolution
 * NB : Pour un calcul precis, toujours verifier le taux exact aupres du notaire.
 * Lien reference: https://syage.notaires.fr/taux-dmto-2025-departements/
 */
export const DMTO_AVEC_MAJORATION = 0.0632; // taux global ~6.32% dans les 83 departements
export const DMTO_SANS_MAJORATION = 0.05806; // = TAUX_DROITS_MUTATION_ANCIEN — departements non-majorants

/** Remise negociable sur emoluments proportionnels (depuis decret n°2026-128 du 15/02/2026)
 * Pour toute vente > 150 000 €, le notaire PEUT accorder une remise jusqu'a 10%
 * sur la part des emoluments calculee au-dela de 150 000 €.
 * NB : non automatique — doit etre demandee explicitement par l'acheteur par ecrit.
 * Source: decret 2026-128 du 15/02/2026 — verifie le 2026-05-09
 */
export const REMISE_EMOLUMENTS = {
  seuil_euros: 150_000,
  remise_max_pct: 10,
  automatique: false,
  note: "Demander par ecrit avant redaction de l'acte",
} as const;
