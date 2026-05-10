import type { FraisNotaire } from "@/lib/types";
import {
  TRANCHES_EMOLUMENTS,
  TAUX_DROITS_MUTATION_ANCIEN,
  TAUX_DROITS_MUTATION_NEUF,
  DEBOURS_FORFAIT,
  TAUX_CONTRIBUTION_SECURITE,
} from "@/lib/data/notaire-baremes";

/**
 * Calcule les émoluments du notaire par tranches dégressive.
 */
function calculerEmoluments(prix: number): number {
  let emoluments = 0;
  for (const tranche of TRANCHES_EMOLUMENTS) {
    if (prix <= tranche.de) break;
    const base = Math.min(prix, tranche.a) - tranche.de;
    emoluments += base * (tranche.taux / 100);
  }
  return Math.round(emoluments * 100) / 100;
}

/**
 * Calcule les frais de notaire pour une transaction immobilière.
 * @param prix - Prix du bien en euros
 * @param type - "ancien" ou "neuf"
 */
export function calculerFraisNotaire(
  prix: number,
  type: "ancien" | "neuf"
): FraisNotaire {
  const taux_droits =
    type === "ancien" ? TAUX_DROITS_MUTATION_ANCIEN : TAUX_DROITS_MUTATION_NEUF;

  const droits_mutation = Math.round(prix * taux_droits * 100) / 100;
  const emoluments = calculerEmoluments(prix);
  const debours = DEBOURS_FORFAIT;
  const contribution_securite = Math.round(prix * TAUX_CONTRIBUTION_SECURITE * 100) / 100;

  const total =
    Math.round((droits_mutation + emoluments + debours + contribution_securite) * 100) / 100;

  return {
    total,
    droits_mutation,
    emoluments,
    debours,
    contribution_securite,
  };
}
