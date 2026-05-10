/** Conseils de negociation immobiliere.
 * Source: ANIL, CAFPI, IAD Barometre, LPI, lesiteimmo.com — verifie le 2026-05-09
 *
 * DONNEES MARCHE 2025-2026 (sources officielles) :
 * - Marge nationale moyenne : 9% en 2025, record depuis 2012 (CAFPI) — puis 10% debut 2026 (Boursorama)
 * - Appartements : 7.5% en moyenne | Maisons : 10.2% en moyenne (CAFPI juin 2025)
 * - T1 2026 : marge moyenne nationale ~10% — jamais vu depuis une decennie (lesiteimmo, actual-immo)
 * - LPI-IAD : 5.4% selon leur barometre ; SeLoger : 3-7% selon les zones
 * - Paris T1 2026 : 5.5% (en baisse vs 6.2% au S2 2025) — prix moyen appart 9 450€/m2 (-2.8%/an)
 * - Prix moyen France : 3 142€/m2 (apparts 3 918€, maisons 2 541€) — hausse 0.7%/an en 2026
 * - Zones detendues : Bretagne maisons 13.2%, Aquitaine 13%, Auvergne 12.7%
 * - Zones tendues : <5% sur la plupart des grandes metropoles
 * - 80% des acheteurs negocient en 2026 (actual-immo avril 2026)
 * Ref: https://www.cafpi.fr/credit-immobilier/actualites/immobilier-2025-moment-ideal-negocier-achat
 * Ref: https://news.lesiteimmo.com/2026/01/14/negociation-immobiliere-2026/
 * Ref: https://www.actual-immo.fr/negociation-prix-immobilier-2026/
 * Ref: https://homeselect.paris/blog/barometre-paris-t1-2026/
 */

export interface MargeNegociation {
  type_bien: string;
  zone: "tendue" | "equilibree" | "detendue";
  marge_min_pct: number;
  marge_max_pct: number;
  commentaire: string;
}

/** Source: CAFPI, IAD Barometre, LPI — indicatif, verifie le 2026-05-09 */
export const MARGES_NEGOCIATION: MargeNegociation[] = [
  // Appartements anciens
  { type_bien: "Appartement ancien", zone: "tendue", marge_min_pct: 2, marge_max_pct: 5, commentaire: "Marge limitee en zone tendue — Paris T1 2026 : 5.5% (HomeSelect), Lyon et Nice < 5%. Jouer sur la rapidite et un dossier financement solide. 80% des acheteurs negocient en 2026 (actual-immo)." },
  { type_bien: "Appartement ancien", zone: "equilibree", marge_min_pct: 5, marge_max_pct: 10, commentaire: "Marge classique T1 2026. LPI-IAD : 5.4%, SeLoger : 3-7%, national debut 2026 : ~10% (lesiteimmo). Negocier sur DPE defavorable, travaux, bruit, vis-a-vis." },
  { type_bien: "Appartement ancien", zone: "detendue", marge_min_pct: 8, marge_max_pct: 15, commentaire: "Marge elevee si bien en vente depuis > 3 mois. Bourgogne et Centre atteignent 10-12% sur les appartements (CAFPI 2025). 80% des acheteurs negocient — vous etes en position de force." },
  // Maisons anciennes
  { type_bien: "Maison ancienne", zone: "tendue", marge_min_pct: 2, marge_max_pct: 7, commentaire: "Maisons rares en zone tendue — marge limitee mais toujours possible sur defauts (toiture, DPE, surface terrain)." },
  { type_bien: "Maison ancienne", zone: "equilibree", marge_min_pct: 5, marge_max_pct: 12, commentaire: "Negocier sur etat general, toiture, isolation, DPE. Moyenne maisons : 10.2% en 2025 (CAFPI)." },
  { type_bien: "Maison ancienne", zone: "detendue", marge_min_pct: 10, marge_max_pct: 20, commentaire: "Forte marge si atypique ou rural. Bretagne : 13.2%, Aquitaine : 13%, Auvergne : 12.7% (CAFPI 2025). Biens > 100m2 au-dessus de ces moyennes." },
  // Neuf VEFA
  { type_bien: "Neuf (VEFA)", zone: "tendue", marge_min_pct: 0, marge_max_pct: 2, commentaire: "Promoteurs negocient rarement sur le prix — negocier plutot des options, parking, cave, finitions, ou frais de notaire offerts." },
  { type_bien: "Neuf (VEFA)", zone: "equilibree", marge_min_pct: 1, marge_max_pct: 5, commentaire: "Negociable si programme en fin de commercialisation. Demander remise sur lots restants ou TVA reduite." },
  { type_bien: "Neuf (VEFA)", zone: "detendue", marge_min_pct: 3, marge_max_pct: 8, commentaire: "Promoteurs plus flexibles si stock invendu important. Possible d'obtenir 5-8% + avantages en nature." },
  // Grand logement — specificite 2025
  { type_bien: "Grand appartement/maison (>100m2)", zone: "tendue", marge_min_pct: 3, marge_max_pct: 8, commentaire: "Les grands biens concentrent les marges les plus elevees en 2025 — pool d'acheteurs plus restreint = plus de levier." },
  { type_bien: "Grand appartement/maison (>100m2)", zone: "detendue", marge_min_pct: 10, marge_max_pct: 20, commentaire: "Marges records sur grands biens en zones detendues — acheteurs rares, vendeurs sous pression si duree longue." },
];

export interface ArgumentNegociation {
  categorie: string;
  arguments: string[];
}

export const ARGUMENTS_NEGOCIATION: ArgumentNegociation[] = [
  {
    categorie: "DPE defavorable",
    arguments: [
      "Estimer le cout des travaux de renovation energetique et le deduire du prix",
      "Mentionner les interdictions de location a venir (G des 2025, F en 2028, E en 2034)",
      "Valoriser le cout reel post-travaux vs le prix affiche",
      "Chiffrer l'impact sur la valeur de revente : un bien D vaut 10-15% de plus qu'un bien F a superficie egale",
    ],
  },
  {
    categorie: "Travaux a prevoir",
    arguments: [
      "Obtenir des devis avant l'offre pour chiffrer precisement",
      "Comparer avec des biens similaires renoves dans le quartier (DVF + photos annonces)",
      "Mentionner que les travaux impactent le budget global (credit + travaux)",
      "Proposer une reduction equivalente a 70-80% du montant des travaux estimes — technique reconnue par les professionnels (lesiteimmo 2026)",
    ],
  },
  {
    categorie: "Duree de mise en vente",
    arguments: [
      "Un bien en vente depuis > 3 mois indique un prix trop eleve",
      "Consulter l'historique des baisses de prix sur les portails (SeLoger, Leboncoin, Bien'ici)",
      "Le vendeur est probablement plus flexible apres 6 mois — la duree moyenne de vente a augmente de 20-30% vs pic marche",
      "Mentionner le stock de biens disponibles dans le secteur comme levier",
    ],
  },
  {
    categorie: "Marche baissier",
    arguments: [
      "Presenter les indices Notaires montrant la tendance baissiere locale",
      "Comparer avec les transactions DVF recentes dans le quartier (app.dvf.etalab.gouv.fr)",
      "Anticiper une poursuite de la baisse dans votre offre",
    ],
  },
  {
    categorie: "Au-dela du prix (2026)",
    arguments: [
      "Negocier les conditions suspensives : delai d'obtention de pret, date de signature de l'acte",
      "Negocier le transfert de biens mobiliers inclus (cuisine equipee, electromenager, meubles)",
      "Demander qui prend en charge les travaux identifies au diagnostic — souvent equivalent a plusieurs milliers d'euros sans toucher au prix affiche",
    ],
  },
];

export const ERREURS_NEGOCIATION: string[] = [
  "Faire une offre trop basse (> 20% sous le prix) — vexe le vendeur et coupe la negociation",
  "Ne pas avoir de financement confirme — un acheteur sans attestation bancaire n'est pas credible, surtout dans les zones tendues",
  "Critiquer le bien devant le vendeur — negocier sur les faits (DPE, devis), pas sur les emotions",
  "Oublier les frais annexes — inclure frais notaire (7-8% ancien, 2-3% neuf), travaux, demenagement dans votre budget total",
  "Ne pas consulter les prix DVF du quartier — vous negociez a l'aveugle sans donnees (app.dvf.etalab.gouv.fr)",
  "Negocier uniquement sur le prix — oublier les autres leviers : meubles inclus, date de signature, travaux a la charge du vendeur, frais de notaire offerts",
  "Poser plusieurs offres simultanees sans suivi — un vendeur contacte par plusieurs agents perd confiance en votre serieux",
  "Accepter la premiere offre de pret bancaire — comparer au moins 3 banques + 1 courtier peut economiser 15 000-20 000€ sur 25 ans",
  "Negliger l'etat de la copropriete — les PV des 3 dernieres AG et le carnet d'entretien peuvent reveler des travaux votes non encore payes",
  "Se laisser emporter par l'emotion — un bien 'coup de coeur' fait souvent surpayer. Basez toujours votre offre sur les donnees DVF, pas sur le ressenti",
];

/** Pieges specifiques au premier achat — source: pretto.fr, drhouse-immo.com, anil.org */
export const PIEGES_PREMIER_ACHAT: string[] = [
  "Sous-estimer les frais caches : frais de notaire (7-8% ancien), frais de dossier banque (500-1500€), garantie (Credit Logement ou hypotheque), frais d'agence si a la charge de l'acheteur — total jusqu'a 10-15% du prix",
  "Confondre capacite d'emprunt et budget reel : budget = emprunt + apport - frais de notaire - travaux - demenagement - 3 mois d'epargne de precaution",
  "Ne pas verifier le PLU avant d'acheter : un terrain voisin constructible = future construction qui peut devaluer le bien",
  "Ignorer les diagnostics obligatoires (DDT) : DPE, amiante, plomb (avant 1949), electricite, gaz, ERP, mesurage Carrez — exiger le dossier complet avant toute offre",
  "Ne pas relire les PV d'AG : en copropriete, des travaux votes non encore factures peuvent impliquer des appels de fonds importants apres l'achat",
  "Acheter sans connaitre les prix locaux : consultez DVF Etalab pour voir les prix reels des dernieres transactions dans le quartier — pas les estimations des agences",
  "Ignorer les risques naturels : verifier georisques.gouv.fr — un bien en zone inondable ou argileuse impacte l'assurance et la valeur de revente",
  "Ne pas anticiper les charges de copropriete reelles : elles peuvent varier de 50 a 300€/mois — demander les 3 derniers releves de charges",
];
