/** Fiscalite immobiliere — regles principales.
 * Source: impots.gouv.fr, service-public.fr, legifrance.gouv.fr — verifie le 2026-05-09
 */

export interface AbattementPlusValue {
  type: "ir" | "prelevements_sociaux";
  tranches: { de_annee: number; a_annee: number; taux_par_an: number }[];
  exoneration_totale_annee: number;
}

/** Source: impots.gouv.fr — abattements plus-values immobilieres (hors RP, exoneree d'office) */
export const ABATTEMENTS_PLUS_VALUES: AbattementPlusValue[] = [
  {
    type: "ir",
    tranches: [
      { de_annee: 0, a_annee: 5, taux_par_an: 0 },
      { de_annee: 6, a_annee: 21, taux_par_an: 6 },
      { de_annee: 22, a_annee: 22, taux_par_an: 4 },
    ],
    exoneration_totale_annee: 22,
  },
  {
    type: "prelevements_sociaux",
    tranches: [
      { de_annee: 0, a_annee: 5, taux_par_an: 0 },
      { de_annee: 6, a_annee: 21, taux_par_an: 1.65 },
      { de_annee: 22, a_annee: 22, taux_par_an: 1.6 },
      { de_annee: 23, a_annee: 30, taux_par_an: 9 },
    ],
    exoneration_totale_annee: 30,
  },
];

/**
 * LMNP — Reforme loi de finances 2025 (art. 84) :
 * Depuis le 15 fevrier 2025, les amortissements deduits pendant la periode de location
 * au regime BIC reel doivent etre REINTEGRES dans le calcul de la plus-value imposable.
 * Formule : Plus-value brute = Prix cession − (Prix acquisition − Amortissements deduits)
 * Exceptions :
 *   - Micro-BIC : non concerne (pas d'amortissements deduits)
 *   - Residences etudiantes, seniors, EHPAD : totalement exonerees
 *   - Amortissements anterieurs a 2025 : aussi concernes pour cessions post 15/02/2025
 * Source: legifrance.gouv.fr — loi finances 2025 art. 84, legifiscal.fr — verifie 2026-05-09
 */
export const LMNP_REFORME_2025 = {
  date_entree_vigueur: "2025-02-15",
  reintegration_amortissements_cession: true,
  exceptions: [
    "Micro-BIC (abattement 50%, pas d'amortissements)",
    "Residences etudiantes agrees",
    "Residences seniors agrees",
    "EHPAD (Etablissement d'Hebergement pour Personnes Agees Dependantes)",
  ],
  formule: "PV brute = Prix cession - (Prix acquisition - Amortissements deduits BIC reel)",
  url_reference: "https://www.legifiscal.fr/actualites-fiscales/4461--value-immobiliere-lmnp-amortissements-anterieurs-2025-egalement-reintegrer.html",
} as const;

export interface DispositifFiscal {
  nom: string;
  type: "reduction_ir" | "amortissement" | "deduction_revenus" | "exoneration";
  actif: boolean;
  date_fin?: string;
  description: string;
  zones_eligibles: string[] | null;
  engagement_min_annees: number;
  url_reference: string;
}

/**
 * Source: impots.gouv.fr, service-public.fr, trackstone.fr, jimmi.fr — verifie le 2026-05-09
 *
 * PINEL : supprime definitivement au 01/01/2025 — plus aucun investissement possible
 *   Source : service-public.gouv.fr/particuliers/vosdroits/F31151
 *
 * JEANBRUN (Statut du Bailleur Prive) : nouveau dispositif entre en vigueur le 21/02/2026
 *   Remplace le Pinel — amortissement comptable (3,5% a 5,5% sur 80% valeur bien/an)
 *   Plafond deduction : 8 000€ (intermediaire) / 10 000€ (social) / 12 000€ (tres social)
 *   Logements anciens : plafond 10 700€ quel que soit le niveau de loyer
 *   Pas de zonage geographique (tout territoire)
 *   Engagement location : 9 ans minimum
 *   Valide pour acquisitions du 21/02/2026 au 31/12/2028
 *   Source : aequitas.fr, cogedim.com, vinci-immobilier.com — loi finances 2026 (promulguee 19/02/2026)
 *
 * LOC'AVANTAGES : prolonge jusqu'au 31/12/2027 (loi finances 2026 promulguee 19/02/2026)
 *   Reduction IR 15% a 65% selon decote de loyer vs marche local
 *   Tout territoire (seul dispositif couvrant zones detendues)
 *   Engagement : 6 ans minimum
 *   Source : service-public.gouv.fr/particuliers/actualites/A18077
 */
export const DISPOSITIFS_FISCAUX: DispositifFiscal[] = [
  {
    nom: "Pinel / Pinel+",
    type: "reduction_ir",
    actif: false,
    date_fin: "2024-12-31", // supprime au 01/01/2025 — plus aucune nouvelle acquisition possible
    description: "SUPPRIME depuis le 01/01/2025. Reduction IR investissement locatif neuf : 9% (6 ans), 12% (9 ans), 14% (12 ans). Les contrats en cours continuent de generer la reduction.",
    zones_eligibles: ["Abis", "A", "B1"],
    engagement_min_annees: 6,
    url_reference: "https://www.service-public.gouv.fr/particuliers/vosdroits/F31151",
  },
  {
    nom: "Statut du Bailleur Prive (Jeanbrun)",
    type: "deduction_revenus", // amortissement annuel deductible des revenus fonciers
    actif: true,
    date_fin: "2028-12-31",
    description: "Remplacant du Pinel depuis le 21/02/2026. Amortissement annuel de 3,5% a 5,5% sur 80% de la valeur du bien. Plafond : 8 000€ (loyer intermediaire), 10 000€ (loyer social), 12 000€ (loyer tres social). Ancien : 10 700€/an. Pas de zonage. Location nue, residence principale locataire. Engagement 9 ans.",
    zones_eligibles: null, // tout territoire
    engagement_min_annees: 9,
    url_reference: "https://www.aequitas.fr/statut-du-bailleur-prive-2026-le-nouveau-dispositif-fiscal-qui-remplace-le-pinel/",
  },
  {
    nom: "Denormandie",
    type: "reduction_ir",
    actif: true,
    description: "Pinel dans l'ancien avec travaux >= 25% du cout total — communes ORT/coeur de ville. Memes taux que l'ancien Pinel mais dans l'ancien renove.",
    zones_eligibles: null, // communes ORT — pas de zonage ABC
    engagement_min_annees: 6,
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F35011",
  },
  {
    nom: "Loc'Avantages",
    type: "reduction_ir",
    actif: true,
    date_fin: "2027-12-31", // prolonge par loi finances 2026 (promulguee 19/02/2026)
    description: "Reduction IR de 15% a 65% selon decote de loyer vs marche local. Trois niveaux : Loc1 (loyer - 15%), Loc2 (loyer - 30%), Loc3 (avec intermediation locative). Tout territoire (zones detendues incluses). Engagement 6 ans minimum.",
    zones_eligibles: null, // tout territoire
    engagement_min_annees: 6,
    url_reference: "https://www.service-public.gouv.fr/particuliers/actualites/A18077",
  },
  {
    nom: "LMNP (Loueur Meuble Non Professionnel)",
    type: "amortissement",
    actif: true,
    description: "Micro-BIC : abattement 50% sur recettes (plafond 77 700€/an). Reel : amortissement du bien + charges deductibles. ATTENTION reforme 2025 : depuis le 15/02/2025, amortissements BIC reel reintegres dans calcul plus-value a la cession (sauf residences etudiantes/seniors/EHPAD et micro-BIC).",
    zones_eligibles: null,
    engagement_min_annees: 0,
    url_reference: "https://www.impots.gouv.fr/particulier/les-locations-meublees",
  },
];

export const TAXE_FONCIERE_INFO = {
  exoneration_neuf_annees: 2,
  base: "Valeur locative cadastrale x taux communal",
  note: "Certaines communes peuvent accorder une exoneration partielle ou totale temporaire supplementaire",
  url_reference: "https://www.impots.gouv.fr/particulier/taxe-fonciere",
} as const;

/** Source: impots.gouv.fr — IFI seuil inchange depuis 2018 */
export const IFI_SEUIL = 1_300_000;

export const IFI_INFO = {
  seuil_euros: IFI_SEUIL,
  assiette: "Valeur nette des biens immobiliers au 1er janvier de l'annee d'imposition",
  dettes_deductibles: [
    "Emprunts immobiliers en cours (capital restant du)",
    "Impots dus sur les revenus fonciers (sous conditions)",
  ],
  taux_progressif: [
    { de: 800_000, a: 1_300_000, taux: 0 },
    { de: 1_300_000, a: 2_570_000, taux: 0.005 },
    { de: 2_570_000, a: 5_000_000, taux: 0.007 },
    { de: 5_000_000, a: 10_000_000, taux: 0.0100 },
    { de: 10_000_000, a: null, taux: 0.0150 },
  ],
  url_reference: "https://www.impots.gouv.fr/particulier/lifi",
} as const;
