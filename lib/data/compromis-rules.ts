/** Regles du compromis de vente en France.
 * Source: LegiFrance (loi SRU art. L271-1 CCH), ANIL — verifie le 2026-05-09
 * Verification: delai 10 jours confirme — art. L271-1 inchange depuis 2015 (loi Macron).
 *   Avant loi Macron 2015 : 7 jours. Depuis 2015 : 10 jours calendaires.
 *   Depart du delai : lendemain de la 1ere presentation du courrier notifiant l'acte (LRAR).
 * Depot garantie 5-10% confirme par ANIL. Sequestre notaire/AI confirme.
 * Remboursement depot garantie si retractation : delai max 21 jours apres retractation
 *   (art. L271-2 CCH). Aucune retenue possible dans ce delai.
 * Aucune reforme SRU prevue pour 2026 — regles stables.
 */

export interface RegleCompromis {
  delai_retractation_jours: number;
  base_legale: string;
  depot_garantie_min_pct: number;
  depot_garantie_max_pct: number;
  sequestre: string;
}

/** Source: Code de la construction et de l'habitation, art. L271-1 */
export const REGLE_COMPROMIS: RegleCompromis = {
  delai_retractation_jours: 10,
  base_legale: "Loi SRU — CCH art. L271-1 (modifie loi Macron 2015)",
  depot_garantie_min_pct: 5,
  depot_garantie_max_pct: 10,
  sequestre: "Notaire ou agent immobilier (compte sequestre)",
} as const;

/** Regles complementaires SRU — verifie le 2026-05-09 */
export const DETAIL_RETRACTATION_SRU = {
  depart_delai: "Lendemain de la 1ere presentation de la LRAR notifiant le compromis",
  type_jours: "Calendaires (week-ends et feries inclus)",
  conditions_acheteur: [
    "Acte ayant pour objet l'acquisition ou la construction d'un immeuble a usage d'habitation",
    "Acquereur non-professionnel (particulier)",
  ],
  remboursement_si_retractation: {
    delai_max_jours: 21,
    base_legale: "CCH art. L271-2",
    note: "Le sequestre doit restituer 100% du depot de garantie — aucune retenue possible",
  },
  forma_notification: "LRAR ou remise en main propre avec recepisse",
} as const;

export interface ConditionSuspensive {
  nom: string;
  obligatoire: boolean;
  description: string;
  delai_usuel_jours: number | null;
  conseil_acheteur: string;
}

/** Source: ANIL, service-public.fr — verifie le 2026-05-09 */
export const CONDITIONS_SUSPENSIVES: ConditionSuspensive[] = [
  {
    nom: "Obtention de pret",
    obligatoire: true,
    description: "Le compromis est annule si l'acheteur n'obtient pas son pret dans le delai prevu",
    delai_usuel_jours: 60,
    conseil_acheteur: "NE JAMAIS renoncer a cette clause. Sans elle, vous perdez le depot de garantie si le pret est refuse.",
  },
  {
    nom: "Absence de servitude grave",
    obligatoire: false,
    description: "Annulation si une servitude non declaree greve significativement le bien",
    delai_usuel_jours: null,
    conseil_acheteur: "Demander un certificat d'urbanisme avant de signer.",
  },
  {
    nom: "Absence de preemption",
    obligatoire: false,
    description: "La mairie a 2 mois pour exercer son droit de preemption (DIA)",
    delai_usuel_jours: 60,
    conseil_acheteur: "Verifier si la commune a un DPU (Droit de Preemption Urbain).",
  },
  {
    nom: "Obtention du permis de construire",
    obligatoire: false,
    description: "Si l'achat est conditionne a un projet de construction/extension",
    delai_usuel_jours: 90,
    conseil_acheteur: "Utile si vous achetez un terrain ou prevoyez une extension importante.",
  },
  {
    nom: "Vente d'un bien existant",
    obligatoire: false,
    description: "L'achat est conditionne a la vente prealable de votre bien actuel",
    delai_usuel_jours: 90,
    conseil_acheteur: "Limite le risque mais affaiblit votre offre face aux autres acheteurs.",
  },
];

export interface DelaiCompromis {
  etape: string;
  delai: string;
  description: string;
}

export const DELAIS_COMPROMIS: DelaiCompromis[] = [
  { etape: "Signature compromis", delai: "J", description: "Debut de la periode" },
  { etape: "Fin retractation", delai: "J+10", description: "10 jours calendaires, droit inconditionnel" },
  { etape: "Depot DIA mairie", delai: "J+15", description: "Le notaire depose la DIA" },
  { etape: "Reponse mairie preemption", delai: "J+75", description: "2 mois apres DIA = silence vaut renonciation" },
  { etape: "Limite obtention pret", delai: "J+60", description: "Delai usuel (negociable)" },
  { etape: "Acte authentique", delai: "J+90 a J+120", description: "3 a 4 mois apres compromis en general" },
];
