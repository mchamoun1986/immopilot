/** Baremes PTZ (Pret a Taux Zero) — plafonds et tranches de remboursement.
 * Source: ANIL.org, decret n°2026-187 du 24 fevrier 2026 (en vigueur le 8 mars 2026)
 * verifie le 2026-05-09 — MAJ: Agent immopilot-donnees
 *
 * ATTENTION: reforme importante au 8 mars 2026 :
 *   - Plafonds ressources revises (hausse ~25% par rapport a 2024)
 *   - Plafonds operation revises (nouvelles valeurs par tranche de personnes)
 *   - Quotite desormais variable par tranche (50% / 40% / 40% / 20%)
 *   - Tranches de remboursement entierement restructurees
 *
 * Index du tableau (0-based) = nombre de personnes - 1
 * Index 0 = 1 personne, index 1 = 2 personnes, ..., index 7 = 8 personnes et plus
 */

export const PTZ_PLAFONDS_RESSOURCES: Record<string, number[]> = {
  // Zones Abis et A : memes plafonds
  Abis: [49000, 73500, 88200, 102900, 117600, 132300, 147000, 161700],
  A:    [49000, 73500, 88200, 102900, 117600, 132300, 147000, 161700],
  B1:   [34500, 51750, 62100, 72450,  82800,  93150, 103500, 113850],
  B2:   [31500, 47250, 56700, 66150,  75600,  85050,  94500, 103950],
  C:    [28500, 42750, 51300, 59850,  68400,  76950,  85500,  94050],
};

/**
 * Plafonds d'operation PTZ 2026 — par nombre de personnes (index 0 = 1 pers, index 4 = 5 pers et +)
 * Note: 5 tranches seulement (la 5e couvre 5 personnes et plus)
 */
export const PTZ_PLAFONDS_OPERATION: Record<string, number[]> = {
  // Index : [1 pers, 2 pers, 3 pers, 4 pers, 5 pers+]
  Abis: [150000, 225000, 270000, 315000, 360000],
  A:    [150000, 225000, 270000, 315000, 360000],
  B1:   [135000, 202500, 243000, 283500, 324000],
  B2:   [110000, 165000, 198000, 231000, 264000],
  C:    [100000, 150000, 180000, 210000, 240000],
};

/**
 * Quotite PTZ 2026 — variable selon la tranche de revenus (index 0 = tranche 1 la plus modeste)
 * Tranche 1 : 50% | Tranche 2 : 40% | Tranche 3 : 40% | Tranche 4 : 20%
 */
export const PTZ_QUOTITES = [0.50, 0.40, 0.40, 0.20];

/** @deprecated Utiliser PTZ_QUOTITES[] — la quotite n'est plus unique depuis le 8 mars 2026 */
export const PTZ_QUOTITE = 0.40;

export interface TranchePTZ {
  plafond_revenus_ratio: number;
  quotite: number;
  duree_totale: number;
  duree_differee: number;
  duree_remboursement: number;
}

/**
 * Tranches PTZ 2026 — decret du 24 fevrier 2026
 * plafond_revenus_ratio : ratio revenus / plafond zone pour delimiter la tranche
 * quotite : part du plafond d'operation financee par le PTZ
 * Source: ANIL.org / stop-loyer.fr / blog.qoridor.fr — verifie le 2026-05-09
 */
export const PTZ_TRANCHES: TranchePTZ[] = [
  { plafond_revenus_ratio: 0.45, quotite: 0.50, duree_totale: 25, duree_differee: 10, duree_remboursement: 15 },
  { plafond_revenus_ratio: 0.65, quotite: 0.40, duree_totale: 20, duree_differee: 8,  duree_remboursement: 12 },
  { plafond_revenus_ratio: 0.85, quotite: 0.40, duree_totale: 15, duree_differee: 2,  duree_remboursement: 13 },
  { plafond_revenus_ratio: 1.0,  quotite: 0.20, duree_totale: 10, duree_differee: 0,  duree_remboursement: 10 },
];
