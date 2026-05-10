/** Diagnostics immobiliers obligatoires pour la vente.
 * Source: service-public.fr, ANIL — verifie le 2026-05-09
 * AJOUT 2026-05-09: Audit Energetique obligatoire pour vente de logements classes E, F ou G
 *   depuis le 01/01/2025 (classes F/G depuis 01/04/2023). Validite 5 ans.
 *   Base legale: decret 2022-780, art. L126-28-1 CCH.
 * DPE: au 01/01/2026, le coefficient de conversion electricite passe de 2.3 a 1.9 —
 *   les DPE etablis avant cette date restent valides jusqu'a leur expiration.
 *   => ~850 000 logements remontent d'une ou plusieurs classes (E→D, F→E, etc.).
 *   DPE realises entre 2018 et juin 2021 : AUTOMATIQUEMENT EXPIRES depuis le 01/01/2026.
 * AJOUT 2026-05-09: DPE COLLECTIF obligatoire depuis 01/01/2026 pour toutes les coproprietes
 *   (y compris <= 50 lots). Responsabilite du syndicat/syndic, pas du vendeur individuel.
 *   Mais le vendeur doit annexer le DPE collectif a la promesse de vente si disponible.
 *   Validite 10 ans. Source: service-public.gouv.fr/F37504.
 * AJOUT 2026-05-09: DIAGNOSTIC STRUCTUREL — loi Habitat Degrade n°2024-322 du 09/04/2024,
 *   decret n°2025-814 du 12/08/2025 (entree en vigueur 15/08/2025).
 *   Concerne les batiments collectifs > 15 ans dans secteurs delimites par la commune.
 *   Delai : 18 mois a compter de la notification par la commune.
 *   N'est PAS systematiquement exige a la vente — obligation portee par le syndicat copro.
 */

export interface DiagnosticObligatoire {
  nom: string;
  code: string;
  validite: string;
  obligatoire_si: string;
  cout_moyen_euros: { min: number; max: number };
  description: string;
  url_reference: string;
}

/** Source: service-public.fr/particuliers/vosdroits/F10798, ANIL — verifie le 2026-05-09 */
export const DIAGNOSTICS_OBLIGATOIRES: DiagnosticObligatoire[] = [
  {
    nom: "Diagnostic de Performance Energetique",
    code: "DPE",
    validite: "10 ans",
    obligatoire_si: "Toute vente (sauf exceptions : monuments historiques, etc.)",
    cout_moyen_euros: { min: 100, max: 250 },
    description: "Classe energetique A-G, estimation consommation et emissions GES",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F16096",
  },
  {
    nom: "Amiante (Etat d'amiante)",
    code: "AMIANTE",
    validite: "Illimitee si negatif, 3 ans si positif",
    obligatoire_si: "Bien dont le permis de construire est anterieur au 01/07/1997",
    cout_moyen_euros: { min: 80, max: 200 },
    description: "Reperage des materiaux contenant de l'amiante",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F12239",
  },
  {
    nom: "Plomb (CREP)",
    code: "PLOMB",
    validite: "1 an si positif, illimitee si negatif",
    obligatoire_si: "Bien construit avant le 01/01/1949",
    cout_moyen_euros: { min: 100, max: 250 },
    description: "Constat de risque d'exposition au plomb dans les peintures",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F1141",
  },
  {
    nom: "Termites",
    code: "TERMITES",
    validite: "6 mois",
    obligatoire_si: "Zones declarees par arrete prefectoral",
    cout_moyen_euros: { min: 80, max: 200 },
    description: "Presence de termites ou insectes xylophages",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F288",
  },
  {
    nom: "Electricite",
    code: "ELEC",
    validite: "3 ans",
    obligatoire_si: "Installation electrique de plus de 15 ans",
    cout_moyen_euros: { min: 80, max: 180 },
    description: "Etat de l'installation interieure d'electricite",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F18692",
  },
  {
    nom: "Gaz",
    code: "GAZ",
    validite: "3 ans",
    obligatoire_si: "Installation gaz de plus de 15 ans",
    cout_moyen_euros: { min: 80, max: 180 },
    description: "Etat de l'installation interieure de gaz",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F17337",
  },
  {
    nom: "Etat des Risques et Pollutions",
    code: "ERP",
    validite: "6 mois",
    obligatoire_si: "Toute vente (commune a risques identifies)",
    cout_moyen_euros: { min: 0, max: 50 },
    description: "Risques naturels, miniers, technologiques, sismiques, radon",
    url_reference: "https://www.georisques.gouv.fr/",
  },
  {
    nom: "Mesurage Carrez",
    code: "CARREZ",
    validite: "Illimitee (sauf travaux modifiant la surface)",
    obligatoire_si: "Lot de copropriete (pas les maisons individuelles hors copro)",
    cout_moyen_euros: { min: 50, max: 150 },
    description: "Surface privative du lot de copropriete (>= 1.80m de hauteur)",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F12241",
  },
  {
    nom: "Assainissement",
    code: "ASSAINISSEMENT",
    validite: "3 ans",
    obligatoire_si: "Bien en assainissement non collectif (fosse septique)",
    cout_moyen_euros: { min: 100, max: 200 },
    description: "Conformite de l'installation d'assainissement individuel",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F2906",
  },
  {
    /** AJOUTE 2026-05-09 — Base legale: art. L126-28-1 CCH, decret 2022-780
     * Classes F/G : obligatoire depuis 01/04/2023
     * Classe E : obligatoire depuis 01/01/2025
     * Classe D : obligatoire a partir du 01/01/2034
     * Source: service-public.gouv.fr/particuliers/vosdroits/F37110, ANIL
     */
    nom: "Audit Energetique",
    code: "AUDIT_ENERGETIQUE",
    validite: "5 ans",
    obligatoire_si: "Vente d'un logement (maison individuelle ou immeuble mono-proprietaire) classe E, F ou G au DPE — hors appartements en copropriete",
    cout_moyen_euros: { min: 500, max: 1500 },
    description: "Etat des lieux energetique complet avec 2 propositions de travaux chiffrees. Obligatoire avant signature de la promesse de vente.",
    url_reference: "https://www.service-public.gouv.fr/particuliers/vosdroits/F37110",
  },
  {
    /** AJOUTE 2026-05-09 — Obligatoire depuis 01/01/2026 pour toutes les coproprietes.
     * Responsabilite du syndicat. Le vendeur d'un lot doit annexer le DPE collectif
     * a la promesse de vente si le syndicat l'a etabli.
     * Ne remplace pas le DPE individuel du lot.
     * Source: service-public.gouv.fr/F37504, loi Climat 2021 — verifie le 2026-05-09
     */
    nom: "DPE Collectif (copropriete)",
    code: "DPE_COLLECTIF",
    validite: "10 ans",
    obligatoire_si: "Copropriete d'au moins 2 lots — obligation portee par le syndicat depuis 01/01/2026 (toutes tailles). A annexer a la promesse de vente si disponible.",
    cout_moyen_euros: { min: 1000, max: 5000 },
    description: "DPE a l'echelle de l'immeuble entier, realise par le syndicat. Evalue la performance energetique des parties communes et des systemes collectifs.",
    url_reference: "https://www.service-public.gouv.fr/particuliers/vosdroits/F37504",
  },
  {
    /** AJOUTE 2026-05-09 — Loi Habitat Degrade n°2024-322 du 09/04/2024
     * Decret n°2025-814 du 12/08/2025 (JO 14/08/2025, vigueur 15/08/2025)
     * NON systematique a la vente : c'est la commune qui delimite les secteurs
     * et notifie les syndicats. Delai 18 mois apres notification.
     * Inspection visuelle exterieure + interieure, rapport numerique obligatoire.
     * Professionnel qualifie avec RC Pro >= 1M€/sinistre et 1.5M€/an.
     * Source: legifrance.gouv.fr/jorf/id/JORFTEXT000052097247 — verifie le 2026-05-09
     */
    nom: "Diagnostic Structurel",
    code: "DIAGNOSTIC_STRUCTUREL",
    validite: "Non definie (rapport transmis a la commune dans les 18 mois de notification)",
    obligatoire_si: "Batiment d'habitation collectif > 15 ans situe dans un secteur delimite par arrete communal — obligation portee par le syndicat copro, pas le vendeur individuel",
    cout_moyen_euros: { min: 500, max: 3000 },
    description: "Inspection visuelle structurelle (facades, structure porteuse, toiture, sous-sol). Rapport remis a la commune. Peut declencher travaux obligatoires si desordres detectes.",
    url_reference: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052097247",
  },
];

/** Cout total estimatif d'un pack diagnostics complet (hors audit energetique) */
export const COUT_PACK_DIAGNOSTICS = {
  appartement: { min: 300, max: 700 },
  maison: { min: 400, max: 900 },
  /** Maison classee E, F ou G : ajouter l'audit energetique (500-1500€) */
  maison_avec_audit_energetique: { min: 900, max: 2400 },
} as const;

/** DPE : rappel des expirations automatiques au 01/01/2026
 * - DPE realises entre le 01/01/2018 et le 30/06/2021 : EXPIRES au 01/01/2026
 * - DPE realises entre le 01/07/2021 et le 31/12/2024 : valides 10 ans
 * - DPE realises depuis 01/01/2026 : coefficient electricite 1.9 (ex: 2.3) applique
 */
export const DPE_EXPIRATIONS = {
  expires_avant_2026: { de: "2018-01-01", a: "2021-06-30", note: "Automatiquement expires au 01/01/2026 — refaire obligatoirement" },
  valides_10ans: { de: "2021-07-01", note: "Validite 10 ans depuis date de realisation" },
  coefficient_electricite_depuis_2026: 1.9, // etait 2.3 avant 01/01/2026
} as const;
