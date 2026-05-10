import type { SimulationCredit } from "@/lib/types";
import { TAUX_ENDETTEMENT_MAX } from "@/lib/constants";

export interface SimulationCapacite extends SimulationCredit {
  mensualite_max: number;
}

/**
 * Calcule la mensualité et le coût total d'un crédit immobilier.
 * Formule de rente : M = P * r * (1+r)^n / ((1+r)^n - 1)
 * Cas taux=0 : mensualité = montant / (duree * 12)
 */
export function calculerMensualite(
  montant: number,
  tauxAnnuel: number,
  dureeAnnees: number
): SimulationCredit {
  if (montant === 0) {
    return { mensualite: 0, cout_total: 0, cout_interets: 0, capacite_emprunt: 0 };
  }

  if (dureeAnnees <= 0) {
    return { mensualite: 0, cout_total: 0, cout_interets: 0, capacite_emprunt: 0 };
  }

  const n = dureeAnnees * 12;

  let mensualite: number;
  if (tauxAnnuel === 0) {
    mensualite = montant / n;
  } else {
    const r = tauxAnnuel / 100 / 12;
    const facteur = Math.pow(1 + r, n);
    mensualite = (montant * r * facteur) / (facteur - 1);
  }

  const cout_total = mensualite * n;
  const cout_interets = cout_total - montant;

  return {
    mensualite: Math.round(mensualite * 100) / 100,
    cout_total: Math.round(cout_total * 100) / 100,
    cout_interets: Math.round(cout_interets * 100) / 100,
    capacite_emprunt: 0,
  };
}

/**
 * Calcule la capacité d'emprunt à partir d'une mensualité maximale.
 * mensualite_max = max(0, revenus * TAUX_ENDETTEMENT_MAX - charges)
 * Formule inverse de la rente : P = M * ((1+r)^n - 1) / (r * (1+r)^n)
 */
export function calculerCapaciteEmprunt(
  revenusNetMensuels: number,
  chargesFixes: number,
  tauxAnnuel: number,
  dureeAnnees: number
): SimulationCapacite {
  if (dureeAnnees <= 0) {
    return {
      mensualite: 0,
      mensualite_max: 0,
      cout_total: 0,
      cout_interets: 0,
      capacite_emprunt: 0,
    };
  }

  const mensualite_max = Math.max(0, revenusNetMensuels * TAUX_ENDETTEMENT_MAX - chargesFixes);

  if (mensualite_max === 0) {
    return {
      mensualite: 0,
      mensualite_max: 0,
      cout_total: 0,
      cout_interets: 0,
      capacite_emprunt: 0,
    };
  }

  const n = dureeAnnees * 12;

  let capacite: number;
  if (tauxAnnuel === 0) {
    capacite = mensualite_max * n;
  } else {
    const r = tauxAnnuel / 100 / 12;
    const facteur = Math.pow(1 + r, n);
    capacite = (mensualite_max * (facteur - 1)) / (r * facteur);
  }

  const cout_total = mensualite_max * n;
  const cout_interets = cout_total - capacite;

  return {
    mensualite: Math.round(mensualite_max * 100) / 100,
    mensualite_max: Math.round(mensualite_max * 100) / 100,
    cout_total: Math.round(cout_total * 100) / 100,
    cout_interets: Math.round(cout_interets * 100) / 100,
    capacite_emprunt: Math.round(capacite * 100) / 100,
  };
}
