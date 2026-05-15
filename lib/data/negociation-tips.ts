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
  { type_bien: "Appartement ancien", zone: "tendue", marge_min_pct: 2, marge_max_pct: 5, commentaire: "Marge limitée en zone tendue — Paris T1 2026 : 5.5% (HomeSelect), Lyon et Nice < 5%. Jouer sur la rapidité et un dossier financement solide. 80% des acheteurs négocient en 2026 (actual-immo)." },
  { type_bien: "Appartement ancien", zone: "equilibree", marge_min_pct: 5, marge_max_pct: 10, commentaire: "Marge classique T1 2026. LPI-IAD : 5.4%, SeLoger : 3-7%, national début 2026 : ~10% (lesiteimmo). Négocier sur DPE défavorable, travaux, bruit, vis-à-vis." },
  { type_bien: "Appartement ancien", zone: "detendue", marge_min_pct: 8, marge_max_pct: 15, commentaire: "Marge élevée si bien en vente depuis > 3 mois. Bourgogne et Centre atteignent 10-12% sur les appartements (CAFPI 2025). 80% des acheteurs négocient — vous êtes en position de force." },
  // Maisons anciennes
  { type_bien: "Maison ancienne", zone: "tendue", marge_min_pct: 2, marge_max_pct: 7, commentaire: "Maisons rares en zone tendue — marge limitée mais toujours possible sur défauts (toiture, DPE, surface terrain)." },
  { type_bien: "Maison ancienne", zone: "equilibree", marge_min_pct: 5, marge_max_pct: 12, commentaire: "Négocier sur état général, toiture, isolation, DPE. Moyenne maisons : 10.2% en 2025 (CAFPI)." },
  { type_bien: "Maison ancienne", zone: "detendue", marge_min_pct: 10, marge_max_pct: 20, commentaire: "Forte marge si atypique ou rural. Bretagne : 13.2%, Aquitaine : 13%, Auvergne : 12.7% (CAFPI 2025). Biens > 100m2 au-dessus de ces moyennes." },
  // Neuf VEFA
  { type_bien: "Neuf (VEFA)", zone: "tendue", marge_min_pct: 0, marge_max_pct: 2, commentaire: "Promoteurs négocient rarement sur le prix — négocier plutôt des options, parking, cave, finitions, ou frais de notaire offerts." },
  { type_bien: "Neuf (VEFA)", zone: "equilibree", marge_min_pct: 1, marge_max_pct: 5, commentaire: "Négociable si programme en fin de commercialisation. Demander remise sur lots restants ou TVA réduite." },
  { type_bien: "Neuf (VEFA)", zone: "detendue", marge_min_pct: 3, marge_max_pct: 8, commentaire: "Promoteurs plus flexibles si stock invendu important. Possible d'obtenir 5-8% + avantages en nature." },
  // Grand logement — spécificité 2025
  { type_bien: "Grand appartement/maison (>100m2)", zone: "tendue", marge_min_pct: 3, marge_max_pct: 8, commentaire: "Les grands biens concentrent les marges les plus élevées en 2025 — pool d'acheteurs plus restreint = plus de levier." },
  { type_bien: "Grand appartement/maison (>100m2)", zone: "detendue", marge_min_pct: 10, marge_max_pct: 20, commentaire: "Marges records sur grands biens en zones détendues — acheteurs rares, vendeurs sous pression si durée longue." },
];

export interface ArgumentNegociation {
  categorie: string;
  arguments: string[];
}

export const ARGUMENTS_NEGOCIATION: ArgumentNegociation[] = [
  {
    categorie: "DPE défavorable",
    arguments: [
      "Estimer le coût des travaux de rénovation énergétique et le déduire du prix",
      "Mentionner les interdictions de location à venir (G dès 2025, F en 2028, E en 2034)",
      "Valoriser le coût réel post-travaux vs le prix affiché",
      "Chiffrer l'impact sur la valeur de revente : un bien D vaut 10-15% de plus qu'un bien F à superficie égale",
    ],
  },
  {
    categorie: "Travaux à prévoir",
    arguments: [
      "Obtenir des devis avant l'offre pour chiffrer précisément",
      "Comparer avec des biens similaires rénovés dans le quartier (DVF + photos annonces)",
      "Mentionner que les travaux impactent le budget global (crédit + travaux)",
      "Proposer une réduction équivalente à 70-80% du montant des travaux estimés — technique reconnue par les professionnels (lesiteimmo 2026)",
    ],
  },
  {
    categorie: "Durée de mise en vente",
    arguments: [
      "Un bien en vente depuis > 3 mois indique un prix trop élevé",
      "Consulter l'historique des baisses de prix sur les portails (SeLoger, Leboncoin, Bien'ici)",
      "Le vendeur est probablement plus flexible après 6 mois — la durée moyenne de vente a augmenté de 20-30% vs pic marché",
      "Mentionner le stock de biens disponibles dans le secteur comme levier",
    ],
  },
  {
    categorie: "Marché baissier",
    arguments: [
      "Présenter les indices Notaires montrant la tendance baissière locale",
      "Comparer avec les transactions DVF récentes dans le quartier (app.dvf.etalab.gouv.fr)",
      "Anticiper une poursuite de la baisse dans votre offre",
    ],
  },
  {
    categorie: "Au-delà du prix (2026)",
    arguments: [
      "Négocier les conditions suspensives : délai d'obtention de prêt, date de signature de l'acte",
      "Négocier le transfert de biens mobiliers inclus (cuisine équipée, électroménager, meubles)",
      "Demander qui prend en charge les travaux identifiés au diagnostic — souvent équivalent à plusieurs milliers d'euros sans toucher au prix affiché",
    ],
  },
];

export const ERREURS_NEGOCIATION: string[] = [
  "Faire une offre trop basse (> 20% sous le prix) — vexe le vendeur et coupe la négociation",
  "Ne pas avoir de financement confirmé — un acheteur sans attestation bancaire n'est pas crédible, surtout dans les zones tendues",
  "Critiquer le bien devant le vendeur — négocier sur les faits (DPE, devis), pas sur les émotions",
  "Oublier les frais annexes — inclure frais notaire (7-8% ancien, 2-3% neuf), travaux, déménagement dans votre budget total",
  "Ne pas consulter les prix DVF du quartier — vous négociez à l'aveugle sans données (app.dvf.etalab.gouv.fr)",
  "Négocier uniquement sur le prix — oublier les autres leviers : meubles inclus, date de signature, travaux à la charge du vendeur, frais de notaire offerts",
  "Poser plusieurs offres simultanées sans suivi — un vendeur contacté par plusieurs agents perd confiance en votre sérieux",
  "Accepter la première offre de prêt bancaire — comparer au moins 3 banques + 1 courtier peut économiser 15 000-20 000€ sur 25 ans",
  "Négliger l'état de la copropriété — les PV des 3 dernières AG et le carnet d'entretien peuvent révéler des travaux votés non encore payés",
  "Se laisser emporter par l'émotion — un bien 'coup de coeur' fait souvent surpayer. Basez toujours votre offre sur les données DVF, pas sur le ressenti",
];

/** Pièges spécifiques au premier achat — source: pretto.fr, drhouse-immo.com, anil.org */
export const PIEGES_PREMIER_ACHAT: string[] = [
  "Sous-estimer les frais cachés : frais de notaire (7-8% ancien), frais de dossier banque (500-1500€), garantie (Crédit Logement ou hypothèque), frais d'agence si à la charge de l'acheteur — total jusqu'à 10-15% du prix",
  "Confondre capacité d'emprunt et budget réel : budget = emprunt + apport - frais de notaire - travaux - déménagement - 3 mois d'épargne de précaution",
  "Ne pas vérifier le PLU avant d'acheter : un terrain voisin constructible = future construction qui peut dévaluer le bien",
  "Ignorer les diagnostics obligatoires (DDT) : DPE, amiante, plomb (avant 1949), électricité, gaz, ERP, mesurage Carrez — exiger le dossier complet avant toute offre",
  "Ne pas relire les PV d'AG : en copropriété, des travaux votés non encore facturés peuvent impliquer des appels de fonds importants après l'achat",
  "Acheter sans connaître les prix locaux : consultez DVF Etalab pour voir les prix réels des dernières transactions dans le quartier — pas les estimations des agences",
  "Ignorer les risques naturels : vérifier georisques.gouv.fr — un bien en zone inondable ou argileuse impacte l'assurance et la valeur de revente",
  "Ne pas anticiper les charges de copropriété réelles : elles peuvent varier de 50 à 300€/mois — demander les 3 derniers relevés de charges",
];
