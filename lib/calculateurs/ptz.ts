import type { ResultatPTZ } from "@/lib/types";
import {
  PTZ_PLAFONDS_RESSOURCES,
  PTZ_PLAFONDS_OPERATION,
  PTZ_TRANCHES,
} from "@/lib/data/ptz-baremes";

export interface ParamsPTZ {
  zone: string;
  revenu_fiscal: number;
  taille_foyer: number;
  cout_operation: number;
}

/**
 * Retourne l'index de colonne (0-based) pour une taille de foyer.
 * Les tableaux ont 8 colonnes (foyer 1 à 8+).
 */
function indexFoyer(taille: number): number {
  return Math.min(Math.max(taille, 1), 8) - 1;
}

/**
 * Calcule l'éligibilité et le montant PTZ selon les barèmes 2026.
 * Réforme du 8 mars 2026 : quotité variable par tranche (50/40/40/20%).
 */
export function calculerPTZ(params: ParamsPTZ): ResultatPTZ {
  const { zone, revenu_fiscal, taille_foyer, cout_operation } = params;

  // Zones valides : Abis, A, B1, B2, C
  const zonesValides = ["Abis", "A", "B1", "B2", "C"];
  if (!zonesValides.includes(zone)) {
    return {
      eligible: false,
      montant: 0,
      duree_differee: 0,
      duree_remboursement: 0,
      raison_ineligibilite: `Zone "${zone}" non reconnue. Zones valides : Abis, A, B1, B2, C.`,
    };
  }

  const idx = indexFoyer(taille_foyer);
  const plafond_ressources = PTZ_PLAFONDS_RESSOURCES[zone][idx];

  // Vérification ressources
  if (revenu_fiscal > plafond_ressources) {
    return {
      eligible: false,
      montant: 0,
      duree_differee: 0,
      duree_remboursement: 0,
      raison_ineligibilite: `Revenus fiscaux (${revenu_fiscal}€) dépassent le plafond de ressources (${plafond_ressources}€) pour la zone ${zone} avec ${taille_foyer} personne(s).`,
    };
  }

  // Détermination de la tranche (ratio revenus / plafond) — nécessaire AVANT le calcul du montant
  // car la quotité est désormais variable par tranche (réforme mars 2026)
  const ratio = revenu_fiscal / plafond_ressources;
  const tranche =
    PTZ_TRANCHES.find((t) => ratio <= t.plafond_revenus_ratio) ??
    PTZ_TRANCHES[PTZ_TRANCHES.length - 1];

  // Plafond de l'opération — 5 entrées (index 4 = 5 personnes et plus)
  const idxOp = Math.min(idx, PTZ_PLAFONDS_OPERATION[zone].length - 1);
  const plafond_operation = PTZ_PLAFONDS_OPERATION[zone][idxOp];
  const base_calcul = Math.min(cout_operation, plafond_operation);
  const montant = Math.round(base_calcul * tranche.quotite);

  return {
    eligible: true,
    montant,
    duree_differee: tranche.duree_differee,
    duree_remboursement: tranche.duree_remboursement,
    raison_ineligibilite: null,
  };
}
