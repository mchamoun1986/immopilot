/** Assurance emprunteur — regles et lois en vigueur.
 * Source: LegiFrance, service-public.fr, magnolia.fr — verifie le 2026-05-09
 */

export interface LoiAssurance {
  nom: string;
  date_entree_vigueur: string;
  droit_principal: string;
  conditions: string[];
  reference_legale: string;
}

/**
 * Source: LegiFrance — loi n° 2022-270 du 28/02/2022
 * https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045278274
 *
 * EVOLUTIONS 2025-2026 :
 * 1. Sanctions DGCCRF (15/10/2025) : 4 banques sanctionnees pour non-respect du delai
 *    de 10 jours ouvrés (Credit Agricole Paris IDF 323 518€, BRED 298 000€,
 *    CIC Est 196 000€, CE IDF 80 000€)
 *    Source: magnolia.fr — verifie 2026-05-09
 *
 * 2. Ordonnance 2026-2 du 05/01/2026 : commercialisation a distance de services financiers
 *    (transposition directive UE 2023/2673)
 *    - Obligation d'information annuelle des clients sur leur droit a la resiliation
 *    - Bouton de retractation "en un clic" pour contrats en ligne
 *    - Entree en vigueur : 19/06/2026 (sauf art.9 = 01/01/2027, art.18 = 11/08/2026)
 *    Source: legifrance.gouv.fr/jorf/id/JORFTEXT000053298845 — verifie 2026-05-09
 *
 * SEUIL QUESTIONNAIRE MEDICAL :
 *    - Pret < 200 000€ par personne (soit < 400 000€ pour un couple en co-emprunt)
 *    - ET echeance avant les 60 ans de l'emprunteur
 *    - Source : magnolia.fr, cautioneo.com — verifie 2026-05-09
 *
 * DROIT A L'OUBLI :
 *    - Reduit de 10 ans a 5 ans pour anciens malades du cancer et hepatite C virale
 *    - S'applique apres la fin du protocole therapeutique
 */
export const LOI_LEMOINE: LoiAssurance = {
  nom: "Loi Lemoine",
  date_entree_vigueur: "2022-06-01",
  droit_principal: "Resiliation a tout moment sans frais ni penalite",
  conditions: [
    "Applicable a tous les contrats (neufs et en cours) depuis le 01/06/2022",
    "Garanties equivalentes requises selon grille CCSF (11 criteres)",
    "Banque a 10 jours ouvrés pour accepter ou motiver un refus (sous peine de sanction DGCCRF)",
    "Suppression du questionnaire medical : pret < 200 000€ par emprunteur ET echeance avant 60 ans",
    "Pour couple co-emprunteur : seuil 400 000€ total si chaque part < 200 000€",
    "Droit a l'oubli renforce : 5 ans apres fin traitement (cancer, hepatite C virale)",
    "Depuis 19/06/2026 (ordonnance 2026-2) : information annuelle obligatoire du droit de resiliation",
  ],
  reference_legale: "Loi n° 2022-270 du 28/02/2022 + Ordonnance n° 2026-2 du 05/01/2026",
} as const;

export interface GarantieAssurance {
  code: string;
  nom: string;
  description: string;
  obligatoire_pret_immo: boolean;
}

export const GARANTIES_ASSURANCE: GarantieAssurance[] = [
  { code: "DC", nom: "Deces", description: "Remboursement du capital restant du en cas de deces", obligatoire_pret_immo: true },
  { code: "PTIA", nom: "Perte Totale et Irreversible d'Autonomie", description: "Invalidite 3e categorie, besoin assistance pour actes quotidiens", obligatoire_pret_immo: true },
  { code: "ITT", nom: "Incapacite Temporaire Totale de Travail", description: "Arret de travail > franchise (90 jours general)", obligatoire_pret_immo: true },
  { code: "IPT", nom: "Invalidite Permanente Totale", description: "Taux invalidite >= 66%", obligatoire_pret_immo: true },
  { code: "IPP", nom: "Invalidite Permanente Partielle", description: "Taux invalidite 33-66%", obligatoire_pret_immo: false },
  { code: "PE", nom: "Perte d'Emploi", description: "Chomage involontaire, carences et franchises importantes", obligatoire_pret_immo: false },
];

export interface TauxAssuranceIndicatif {
  tranche_age: string;
  taux_banque: string;
  taux_delegation: string;
}

/**
 * Source: meilleurtaux.com, reassurez-moi.fr — indicatif, verifie 2026-05-09
 * Note : les taux en delegation ont baisse en 2024-2026 grace a la concurrence
 * post-Lemoine. Ces valeurs sont des fourchettes de marche — varient selon profil/garanties.
 */
export const TAUX_ASSURANCE_INDICATIFS: TauxAssuranceIndicatif[] = [
  { tranche_age: "< 30 ans", taux_banque: "0.30 - 0.40%", taux_delegation: "0.07 - 0.15%" },
  { tranche_age: "30 - 40 ans", taux_banque: "0.35 - 0.50%", taux_delegation: "0.10 - 0.25%" },
  { tranche_age: "40 - 50 ans", taux_banque: "0.45 - 0.70%", taux_delegation: "0.20 - 0.40%" },
  { tranche_age: "50 - 60 ans", taux_banque: "0.60 - 1.00%", taux_delegation: "0.35 - 0.65%" },
];

/**
 * Ordonnance 2026-2 du 05/01/2026 — commercialisation a distance de services financiers
 * Transposition directive UE 2023/2673 du 22/11/2023
 * Entree en vigueur : 19/06/2026
 * Source: https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053298845
 */
export const ORDONNANCE_2026_2 = {
  reference: "Ordonnance n° 2026-2 du 05/01/2026",
  date_publication: "2026-01-05",
  date_entree_vigueur: "2026-06-19",
  obligations_assureur: [
    "Information annuelle obligatoire du client sur son droit a la resiliation (sous peine de sanction)",
    "Bouton de retractation 'en un clic' pour tout contrat souscrit en ligne",
    "Indication obligatoire du nom, but commercial et enregistrement en debut d'appel telephonique",
    "Fourniture d'une fiche d'information pre-contractuelle standardisee",
  ],
  url_reference: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053298845",
} as const;
