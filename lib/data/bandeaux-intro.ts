/** Bandeau intro par étape — objectif, entrée, sortie.
 * Affiché en haut de chaque étape sous le titre.
 */

import type { EtapeNumber } from "@/lib/types";

export interface BandeauIntro {
  etape: EtapeNumber;
  objectif: string;
  entree: string;
  sortie: string;
}

export const BANDEAUX_INTRO: BandeauIntro[] = [
  { etape: 1, objectif: "définir votre projet d'achat", entree: "votre situation personnelle", sortie: "une fiche projet claire (type, zone, budget)" },
  { etape: 2, objectif: "connaître votre budget réel", entree: "revenus, charges, apport", sortie: "capacité d'emprunt + budget total (notaire inclus)" },
  { etape: 3, objectif: "obtenir un premier feu vert de votre banque", entree: "vos justificatifs de revenus et d'apport", sortie: "une attestation de financement" },
  { etape: 4, objectif: "trouver des biens qui correspondent à votre projet", entree: "votre budget et vos critères", sortie: "une short-list de biens à analyser" },
  { etape: 5, objectif: "vérifier en détail le bien que vous visez", entree: "un bien identifié", sortie: "une décision : je fonce ou je passe" },
  { etape: 6, objectif: "faire une offre d'achat au bon prix", entree: "votre analyse du bien + attestation bancaire", sortie: "une offre acceptée par le vendeur" },
  { etape: 7, objectif: "signer le contrat qui réserve le bien", entree: "offre acceptée", sortie: "compromis signé + délai rétractation 10 jours" },
  { etape: 8, objectif: "obtenir votre prêt et souscrire vos assurances", entree: "compromis signé", sortie: "offre de prêt + attestation MRH" },
  { etape: 9, objectif: "signer l'acte final chez le notaire", entree: "offre de prêt acceptée + MRH + déblocage fonds", sortie: "clés + titre de propriété" },
  { etape: 10, objectif: "vous installer dans votre nouveau chez-vous", entree: "les clés", sortie: "démarches faites, vous êtes chez vous" },
];

export function getBandeauForEtape(etape: EtapeNumber): BandeauIntro | undefined {
  return BANDEAUX_INTRO.find((b) => b.etape === etape);
}
