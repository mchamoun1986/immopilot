import type { ResultatEndettement } from "@/lib/types";
import { calculerCapaciteEmprunt } from "@/lib/calculateurs/credit";

/**
 * Calcule le taux d'endettement actuel et la conformité HCSF.
 * @param revenus - Revenus nets mensuels
 * @param charges - Charges fixes mensuelles actuelles (hors future mensualité)
 * @param taux - Taux annuel du crédit en %
 * @param duree - Durée en années
 */
export function calculerEndettement(
  revenus: number,
  charges: number,
  taux: number,
  duree: number
): ResultatEndettement {
  // taux actuel = charges courantes / revenus (sans la future mensualité)
  const taux_actuel = revenus > 0 ? charges / revenus : 0;

  // mensualite_max = marge disponible sous le plafond HCSF 35%
  // si charges > 35% des revenus, mensualite_max = 0 (plus de place pour un crédit)
  const simulation = calculerCapaciteEmprunt(revenus, charges, taux, duree);

  // conforme HCSF = il reste de la marge pour un nouveau crédit
  const conforme_hcsf = simulation.mensualite_max > 0;

  return {
    taux: Math.round(taux_actuel * 10000) / 10000,
    mensualite_max: simulation.mensualite_max,
    capacite_emprunt: simulation.capacite_emprunt,
    conforme_hcsf,
  };
}
