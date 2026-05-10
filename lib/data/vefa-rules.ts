/** Regles VEFA (Vente en l'Etat Futur d'Achevement).
 * Source: service-public.fr, Code de la construction, art. R261-14 CCH — verifie le 2026-05-09
 *
 * CONTEXTE 2026 :
 *   Pas de reforme majeure de la VEFA en 2026. Le cadre legal reste celui de la loi ELAN (2018).
 *   La GFA (Garantie Financiere d'Achevement) extrinsèque est obligatoire depuis 01/01/2015.
 *   La RE2025 (palier RE2020 depuis 01/01/2025) s'applique aux permis de construire deposes depuis 01/01/2025.
 *   => Tout logement neuf VEFA avec PC depose apres 01/01/2025 est soumis aux seuils RE2025.
 */

export interface GarantieConstructeur {
  nom: string;
  duree_annees: number;
  couvre: string;
  base_legale: string;
}

/** Source: Code de la construction, art. 1792 et suivants du Code civil */
export const GARANTIES_CONSTRUCTEUR: GarantieConstructeur[] = [
  {
    nom: "Garantie de parfait achevement",
    duree_annees: 1,
    couvre: "Tous les desordres signales par le maitre d'ouvrage (reserves + PV livraison)",
    base_legale: "Code civil art. 1792-6",
  },
  {
    nom: "Garantie biennale (bon fonctionnement)",
    duree_annees: 2,
    couvre: "Equipements dissociables : volets, portes, robinetterie, chauffage, prises",
    base_legale: "Code civil art. 1792-3",
  },
  {
    nom: "Garantie decennale",
    duree_annees: 10,
    couvre: "Dommages compromettant la solidite ou rendant impropre a destination (structure, toiture, fondations, etancheite)",
    base_legale: "Code civil art. 1792",
  },
];

export interface EcheancierAppelsFonds {
  etape: string;
  pourcentage_max: number;
}

/** Source: Code de la construction art. R261-14 CCH — verifie le 2026-05-09
 * Ces pourcentages sont des PLAFONDS CUMULATIFS (montant verse au total ne peut pas depasser X% a cette etape).
 * Le promoteur peut decoupe en davantage d'appels intermediaires dans les limites.
 * Ex: il peut appeler 40% a la mise hors d'air (menuiseries posees), a condition de ne pas depasser 70% a la mise hors d'eau.
 *
 * DEPOT DE GARANTIE (contrat de reservation, avant acte authentique) :
 *   - 5% max si delai signature acte < 1 an
 *   - 2% max si delai signature acte entre 1 et 2 ans
 *   - 0% si delai signature acte > 2 ans
 *   Ce depot est DEFALQUE des appels de fonds ulterieurs (il n'est pas en sus du 35%).
 */
export const ECHEANCIER_VEFA: EcheancierAppelsFonds[] = [
  { etape: "Achevement des fondations", pourcentage_max: 35 },
  { etape: "Mise hors d'eau (charpente + toiture posees)", pourcentage_max: 70 },
  { etape: "Mise hors d'air (menuiseries exterieures posees)", pourcentage_max: 80 },
  { etape: "Achevement des travaux (immeuble acheve)", pourcentage_max: 95 },
  { etape: "Livraison (remise des cles)", pourcentage_max: 100 },
];

/** Depot de garantie au stade du contrat de reservation (avant acte authentique)
 * Source: Code de la construction art. R261-28 — verifie le 2026-05-09
 */
export const DEPOT_GARANTIE_RESERVATION = {
  pct_si_delai_moins_1_an: 5,
  pct_si_delai_1_a_2_ans: 2,
  pct_si_delai_plus_2_ans: 0,
  description: "Versement sur compte sequestre, defalque des appels de fonds. Rembourse si vente non conclue du fait du promoteur.",
} as const;

export const RESERVES_LIVRAISON = {
  consignation_max_pct: 5,
  delai_levee_reserves_jours: 30,
  description: "A la livraison, l'acheteur peut consigner jusqu'a 5% du prix si des reserves sont emises. Le promoteur a 1 an (garantie parfait achevement) pour corriger. Consignation deposee chez un tiers agree (notaire ou Caisse des Depots).",
} as const;

/** Garantie Financiere d'Achevement (GFA) — obligatoire en VEFA depuis 01/01/2015
 * Source: Code de la construction art. L261-10-1, efficience.notaires.fr — verifie le 2026-05-09
 * Protege l'acheteur contre le risque de defaillance du promoteur.
 * La garantie intrinsèque a ete supprimee au profit de la garantie extrinsèque uniquement.
 */
export const GARANTIE_FINANCIERE_ACHEVEMENT = {
  obligatoire_depuis: "2015-01-01",
  type: "extrinsèque uniquement (garantie intrinseque supprimee)",
  garants_autorises: ["etablissement de credit", "compagnie d'assurance", "societe de caution mutuelle"],
  description: "L'attestation GFA doit figurer dans les pieces annexees a l'acte authentique de vente. Verifier qu'elle couvre bien l'integralite du prix du logement et porte sur le bon programme.",
  verification_acheteur: "Exiger l'attestation GFA avant signature chez le notaire — verifier garant, montant couvert, date validite.",
} as const;

/** Norme environnementale applicable aux logements neufs VEFA en 2026
 * Source: MDDE, developpement-durable.gouv.fr — verifie le 2026-05-09
 */
export const NORME_CONSTRUCTION_NEUF_2026 = {
  reglementation: "RE2025 (palier 1 RE2020)",
  en_vigueur_depuis: "2025-01-01",
  applicable_a: "Tous permis de construire deposes a partir du 01/01/2025",
  ic_construction_maison_kg_co2_m2: 530,
  ic_construction_collectif_kg_co2_m2: 650,
  note: "RE2025 n'est pas une nouvelle norme independante — c'est le premier palier de renforcement de la RE2020. Les prochains paliers sont prevus en 2028 et 2031.",
} as const;
