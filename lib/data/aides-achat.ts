/** Aides a l'achat immobilier en France.
 * Source: service-public.fr, ANIL, Action Logement — verifie le 2026-05-09
 */

export interface AideAchat {
  nom: string;
  organisme: string;
  montant_max: number | null;
  taux: number | null;
  duree_max_annees: number | null;
  conditions: string[];
  cumulable_ptz: boolean;
  actif: boolean;
  validite?: string;
  url_reference: string;
}

/**
 * Source: actionlogement.fr, service-public.fr, ANIL — verifie le 2026-05-09
 *
 * IMPORTANT — Action Logement :
 *   - Montant max standard : 30 000€ (taux 1% fixe hors assurance)
 *   - Montant max vente HLM : 40 000€ (cas specifique cession de logement social)
 *   - Source : https://www.actionlogement.fr/le-pret-accession
 *   - Conditions non-propriete : ne pas avoir ete proprietaire de sa RP au cours des 10 dernieres annees
 *     (plus restrictif que la definition classique "2 ans" du primo-accedant PTZ)
 *
 * IMPORTANT — PTZ (reforme 2025-2026) :
 *   - Depuis le 1er avril 2025 (decret 2025-299 du 29/03/2025) : extension a tout le territoire
 *     (maisons individuelles comprises, toutes zones)
 *   - Quotite jusqu'a 50% pour logements collectifs (menages les plus modestes)
 *   - Quotite 10-30% pour maisons individuelles selon zone et ressources
 *   - Plafonds d'operation releves : 99 000€ (min) a 195 000€ (max) selon zone/foyer
 *   - Plafonds de ressources augmentes de 8-13% vs avant
 *   - Dispositif valide jusqu'au 31 decembre 2027
 *   - Source : legifrance.gouv.fr/jorf/id/JORFTEXT000051393341
 */
export const AIDES_ACHAT: AideAchat[] = [
  {
    nom: "Pret Action Logement (PAL)",
    organisme: "Action Logement",
    montant_max: 30000, // 40 000€ uniquement pour vente HLM
    taux: 1.0,
    duree_max_annees: 25,
    conditions: [
      "Salarie ou preretraite du secteur prive non agricole (entreprise >= 10 salaries)",
      "Ne pas avoir ete proprietaire de sa RP au cours des 10 dernieres annees",
      "Ou : mutation professionnelle avec residence principale qui change",
      "Residence principale obligatoire",
      "Avoir solde tout precedent pret Action Logement avant nouvelle demande",
      "Respecter les plafonds de ressources PAS",
      "Cumul autorise : PTZ, PAS, PC, credit classique",
    ],
    cumulable_ptz: true,
    actif: true,
    url_reference: "https://www.actionlogement.fr/le-pret-accession",
  },
  {
    nom: "Pret a Taux Zero (PTZ)",
    organisme: "Etat (via banques conventionnees)",
    montant_max: 195000, // plafond operation max zone Abis, foyer >= 5 personnes (decret 2025-299)
    taux: 0,
    duree_max_annees: 25,
    conditions: [
      "Primo-accedant : ne pas avoir ete proprietaire de sa RP les 2 dernieres annees",
      "Residence principale obligatoire",
      "Depuis 01/04/2025 : tout le territoire (zones A, B1, B2, C), neuf individuel et collectif",
      "Ancien avec travaux >= 25% du cout : zones B2 et C uniquement",
      "Quotite jusqu'a 50% (collectif, ressources modestes) ou 10-30% (individuel)",
      "Plafonds de ressources revises a la hausse en 2025 (+8 a +13%)",
      "Valide jusqu'au 31/12/2027 (decret 2025-299 du 29/03/2025)",
    ],
    cumulable_ptz: false, // c'est le PTZ lui-meme
    actif: true,
    validite: "2027-12-31",
    url_reference: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051393341",
  },
  {
    nom: "Pret d'Accession Sociale (PAS)",
    organisme: "Etat (via banques conventionnees)",
    montant_max: null,
    taux: null, // taux reglemente, proche taux marche, fixe par arrete
    duree_max_annees: 35,
    conditions: [
      "Plafonds de ressources (identiques au PTZ)",
      "Residence principale occupee dans l'annee suivant l'achat ou la fin des travaux",
      "Ouvre droit a l'APL accession",
      "Cumul possible avec PTZ, Action Logement, PEL",
    ],
    cumulable_ptz: true,
    actif: true,
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F22158",
  },
  {
    nom: "Pret Epargne Logement (PEL)",
    organisme: "Banque (epargne reglementee)",
    montant_max: 92000,
    taux: null, // taux = taux PEL souscrit + marge banque (variable selon generation PEL)
    duree_max_annees: 15,
    conditions: [
      "Detenir un PEL depuis au moins 4 ans",
      "Taux du pret = taux du PEL + commission banque (variable selon generation)",
      "PEL ouverts avant 2024 : prime d'Etat possible (sous conditions)",
      "PEL ouverts depuis 01/01/2024 : taux 2,25% epargne, taux pret ~ 3,45%",
    ],
    cumulable_ptz: true,
    actif: true,
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F16140",
  },
  {
    nom: "Pret Conventionne (PC)",
    organisme: "Etat (via banques conventionnees)",
    montant_max: null,
    taux: null,
    duree_max_annees: 35,
    conditions: [
      "Pas de conditions de ressources",
      "Residence principale",
      "Ouvre droit a l'APL accession",
    ],
    cumulable_ptz: true,
    actif: true,
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F10793",
  },
  {
    nom: "Bail Reel Solidaire (BRS)",
    organisme: "Organisme de Foncier Solidaire (OFS) agree par l'Etat",
    montant_max: null, // reduction de prix 30-50% vs marche libre (pas un pret)
    taux: null,
    duree_max_annees: 99, // bail de 18 a 99 ans
    conditions: [
      "Plafonds de ressources PSLA (environ 87% des foyers en France eligibles)",
      "Residence principale obligatoire",
      "Achat du bati uniquement (le terrain reste a l'OFS) : prix -30 a -50% vs marche",
      "Redevance mensuelle versee a l'OFS pour l'occupation du terrain",
      "Depuis 01/01/2025 : ne pas posseder un logement adapte ou generant des revenus suffisants",
      "Plateforme officielle : boris.beta.gouv.fr",
      "Disponible dans 50+ villes, ~10 000 logements neufs/an",
    ],
    cumulable_ptz: true,
    actif: true,
    url_reference: "https://www.boris.beta.gouv.fr/tout-savoir-sur-le-bail-reel-solidaire-brs",
  },
  {
    nom: "Pret Social Location-Accession (PSLA)",
    organisme: "Etat (via promoteurs agrees)",
    montant_max: null,
    taux: null,
    duree_max_annees: 25,
    conditions: [
      "Phase locative d'abord (minimum 1 an), puis option d'achat levable",
      "Plafonds de ressources PSLA",
      "Logement neuf uniquement (promoteur agree PSLA)",
      "TVA a 5,5% sur l'acquisition",
      "Exoneration taxe fonciere pendant 15 ans",
      "Garantie de rachat et de relogement par l'operateur",
    ],
    cumulable_ptz: true,
    actif: true,
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F16484",
  },
];
