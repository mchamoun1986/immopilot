/** Bandeau intro par etape — objectif, entree, sortie.
 * Affiche en haut de chaque etape sous le titre.
 */

import type { EtapeNumber } from "@/lib/types";

export interface BandeauIntro {
  etape: EtapeNumber;
  objectif: string;
  entree: string;
  sortie: string;
}

export const BANDEAUX_INTRO: BandeauIntro[] = [
  { etape: 1, objectif: "definir votre projet d'achat", entree: "votre situation personnelle", sortie: "une fiche projet claire (type, zone, budget)" },
  { etape: 2, objectif: "connaitre votre budget reel", entree: "revenus, charges, apport", sortie: "capacite d'emprunt + budget total (notaire inclus)" },
  { etape: 3, objectif: "obtenir un premier feu vert de votre banque", entree: "vos justificatifs de revenus et d'apport", sortie: "une attestation de financement" },
  { etape: 4, objectif: "trouver des biens qui correspondent a votre projet", entree: "votre budget et vos criteres", sortie: "une short-list de biens a analyser" },
  { etape: 5, objectif: "verifier en detail le bien que vous visez", entree: "un bien identifie", sortie: "une decision : je fonce ou je passe" },
  { etape: 6, objectif: "faire une offre d'achat au bon prix", entree: "votre analyse du bien + attestation bancaire", sortie: "une offre acceptee par le vendeur" },
  { etape: 7, objectif: "signer le contrat qui reserve le bien", entree: "offre acceptee", sortie: "compromis signe + delai retractation 10 jours" },
  { etape: 8, objectif: "obtenir votre pret et souscrire vos assurances", entree: "compromis signe", sortie: "offre de pret + attestation MRH" },
  { etape: 9, objectif: "signer l'acte final chez le notaire", entree: "offre de pret acceptee + MRH + deblocage fonds", sortie: "cles + titre de propriete" },
  { etape: 10, objectif: "vous installer dans votre nouveau chez-vous", entree: "les cles", sortie: "demarches faites, vous etes chez vous" },
];

export function getBandeauForEtape(etape: EtapeNumber): BandeauIntro | undefined {
  return BANDEAUX_INTRO.find((b) => b.etape === etape);
}
