/** Couts de travaux et aides renovation.
 * Source: france-renov.gouv.fr, ANAH, effy.fr — verifie le 2026-05-09
 */

export interface CoutTravaux {
  type: string;
  cout_m2_min: number;
  cout_m2_max: number;
  unite: "€/m2" | "€/unite";
  commentaire: string;
}

/** Source: estimations marche 2026 — effy.fr, hellowatt.fr, travaux.com, helloartisan.com — indicatif */
export const COUTS_TRAVAUX: CoutTravaux[] = [
  { type: "Peinture (murs + plafonds)", cout_m2_min: 20, cout_m2_max: 45, unite: "€/m2", commentaire: "Preparation + 2 couches" },
  { type: "Sols (parquet flottant)", cout_m2_min: 30, cout_m2_max: 80, unite: "€/m2", commentaire: "Fourniture + pose" },
  { type: "Sols (carrelage)", cout_m2_min: 40, cout_m2_max: 100, unite: "€/m2", commentaire: "Fourniture + pose + ragrage" },
  { type: "Cuisine equipee", cout_m2_min: 3000, cout_m2_max: 15000, unite: "€/unite", commentaire: "Entree a haut de gamme, hors electromenager" },
  { type: "Salle de bain complete", cout_m2_min: 4000, cout_m2_max: 12000, unite: "€/unite", commentaire: "Demontage + plomberie + faience + equipements" },
  { type: "Electricite (remise aux normes)", cout_m2_min: 80, cout_m2_max: 150, unite: "€/m2", commentaire: "Mise en conformite NFC 15-100" },
  { type: "Plomberie (remplacement)", cout_m2_min: 60, cout_m2_max: 120, unite: "€/m2", commentaire: "Remplacement colonnes et distribution" },
  { type: "Isolation murs par interieur (ITI)", cout_m2_min: 50, cout_m2_max: 90, unite: "€/m2", commentaire: "Laine minerale ou polystyrene + BA13. ATTENTION : ITI non eligible MaPrimeRenov par geste depuis 01/01/2026 — eligible parcours accompagne seulement." },
  { type: "Isolation murs par exterieur (ITE)", cout_m2_min: 130, cout_m2_max: 270, unite: "€/m2", commentaire: "Enduit + isolant + finitions. Plus efficace energetiquement que l'ITI. Non eligible MaPrimeRenov par geste depuis 2026, eligible parcours accompagne." },
  { type: "Isolation combles", cout_m2_min: 20, cout_m2_max: 50, unite: "€/m2", commentaire: "Soufflage ou rouleaux — travaux les plus rentables energetiquement" },
  { type: "Fenetres double vitrage", cout_m2_min: 300, cout_m2_max: 800, unite: "€/unite", commentaire: "Par fenetre, fourniture + pose" },
  { type: "Chaudiere gaz a condensation", cout_m2_min: 4000, cout_m2_max: 7000, unite: "€/unite", commentaire: "Remplacement fourniture + pose. Non eligible MaPrimeRenov depuis 2025." },
  { type: "Pompe a chaleur air/eau", cout_m2_min: 8000, cout_m2_max: 18000, unite: "€/unite", commentaire: "Fourniture + pose artisan RGE. Aides cumulees CEE+MaPrimeRenov jusqu'a 10 800€ pour menages tres modestes (ETAS >= 140%)." },
  { type: "Chaudiere a granules biomasse", cout_m2_min: 6500, cout_m2_max: 17000, unite: "€/unite", commentaire: "Eligibilite MaPrimeRenov uniquement en parcours accompagne depuis 01/01/2026 (exclu du par geste)." },
  { type: "VMC double flux", cout_m2_min: 3000, cout_m2_max: 8000, unite: "€/unite", commentaire: "Fourniture + pose — necessite intervention RGE pour aides" },
  { type: "Renovation globale legere", cout_m2_min: 200, cout_m2_max: 500, unite: "€/m2", commentaire: "Peinture + sols + electricite partielle" },
  { type: "Renovation globale intermediaire", cout_m2_min: 700, cout_m2_max: 900, unite: "€/m2", commentaire: "Moyenne marche 2026 : isolation + chauffage + finitions. Source: hellowatt.fr/effy.fr" },
  { type: "Renovation globale lourde", cout_m2_min: 1000, cout_m2_max: 1500, unite: "€/m2", commentaire: "Tout refaire : structure, elec, plomb, isolation. Peut depasser 3 500€/m2 en cas de restructuration." },
];

export interface AideRenovation {
  nom: string;
  montant_max: number | null;
  conditions: string[];
  cumulable: string[];
  url_reference: string;
}

/** Source: france-renov.gouv.fr, ANAH, hellio.com, effy.fr — verifie le 2026-05-09
 *
 * CHANGEMENTS MAJEURS DEPUIS 01/01/2026 :
 *   - Guichet rouvre le 23/02/2026 apres adoption de la loi de finances.
 *   - DPE OBLIGATOIRE pour deposer un dossier MaPrimeRenov (tous parcours).
 *   - RDV conseiller France Renov' obligatoire avant depot dossier (parcours accompagne).
 *   - Isolation murs (ITE + ITI) et chaudieres biomasse exclus du parcours par geste.
 *   - Parcours par geste reserve aux profils Bleu, Jaune, Violet (Rose exclu).
 *   - Parcours accompagne : montants reduits vs 2024-2025 (env. -50% menages modestes, -80% Rose).
 *   - Plafonds depenses renovation ampleur abaisses : 30 000€ HT (2 classes), 40 000€ HT (3 classes+).
 *   - Plafonds de revenus revises a la hausse d'environ 1% par rapport a 2025.
 *   - Renovation d'ampleur desormais reservee aux logements E, F, G (passoires thermiques).
 *
 * PLAFONDS DE REVENUS 2026 (1 personne, revenus fiscaux reference) :
 *   Hors Ile-de-France : Bleu ≤ 17 363€ | Jaune ≤ 22 259€ | Violet ≤ 31 185€ | Rose > 31 185€
 *   Ile-de-France :      Bleu ≤ 24 031€ | Jaune ≤ 29 253€ | Violet ≤ 40 851€ | Rose > 40 851€
 *
 * TAUX AIDE RENOVATION D'AMPLEUR 2026 par profil et gain de classes :
 *   Bleu  (tres modeste) : 80% HT (2 classes) / 80% HT (3 classes+)
 *   Jaune (modeste)      : 60% HT (2 classes) / 60% HT (3 classes+)
 *   Violet (intermediaire): 45% HT (2 classes) / 45% HT (3 classes+)
 *   Rose  (superieur)    : 10% HT (tous gains)
 */
export const AIDES_RENOVATION: AideRenovation[] = [
  {
    nom: "MaPrimeRenov (par geste)",
    montant_max: 20000,
    conditions: [
      "Proprietaire occupant ou bailleur",
      "Logement > 15 ans",
      "Artisan RGE obligatoire",
      "Profils Bleu, Jaune, Violet uniquement (Rose exclu depuis 2026)",
      "DPE obligatoire pour depot du dossier depuis 2026",
      "Plafond cumule 20 000€ sur 5 ans glissants",
      "EXCLUSIONS depuis 01/01/2026 : isolation murs (ITE+ITI) et chaudieres biomasse non eligibles en monogeste",
    ],
    cumulable: ["CEE", "Eco-PTZ", "TVA 5.5%"],
    url_reference: "https://www.france-renov.gouv.fr/aides/maprimerenov",
  },
  {
    nom: "MaPrimeRenov Parcours Accompagne (renovation d'ampleur)",
    montant_max: 32000,
    conditions: [
      "Logement classe E, F ou G uniquement (passoires thermiques — depuis 2026)",
      "Gain minimum 2 classes DPE obligatoire",
      "Accompagnateur Renov (Mon Accompagnateur Renov) obligatoire — RDV sur site avant depot",
      "DPE obligatoire avant depot du dossier",
      "Plafond depenses 30 000€ HT pour gain 2 classes, 40 000€ HT pour gain 3 classes et +",
      "Taux aide : Bleu 80% | Jaune 60% | Violet 45% | Rose 10% — du montant HT des travaux",
      "Montant max : Bleu + 3 classes = 40 000 x 80% = 32 000€ | Jaune + 3 classes = 40 000 x 60% = 24 000€",
      "Montant max : Bleu + 2 classes = 30 000 x 80% = 24 000€ | Jaune + 2 classes = 30 000 x 60% = 18 000€",
      "BAISSE NOTABLE vs 2024-2025 : env. -50% pour menages modestes, -80% pour revenus superieurs",
    ],
    cumulable: ["Eco-PTZ", "CEE"],
    url_reference: "https://www.france-renov.gouv.fr/aides/maprimerenov-parcours-accompagne",
  },
  {
    nom: "CEE — 6eme periode (2026-2030)",
    montant_max: null,
    conditions: [
      "6e periode CEE demarre 01/01/2026, se termine 31/12/2030",
      "Obligation annuelle globale : 1 050 TWhc (+35% vs P5)",
      "Montant variable selon travaux, zone climatique (H1/H2/H3) et surface chauffee",
      "Pas de conditions de revenus",
      "Artisan RGE recommande (obligatoire pour certaines operations)",
      "NOUVEAUTES P6 : calcul simplifie PAC (base ETAS, non usage), forfaits multiplies x3 a x4 pour PAC collectives",
      "PAC air/eau (ETAS >= 140%) : CEE jusqu'a 5 800€ cumulable MaPrimeRenov (max 10 800€ menages tres modestes)",
      "Isolation legere (combles/planchers seuls) non eligible sauf renovation globale controlee",
    ],
    cumulable: ["MaPrimeRenov", "Eco-PTZ", "TVA 5.5%"],
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F35584",
  },
  {
    nom: "Eco-PTZ",
    montant_max: 50000,
    conditions: [
      "Pas de conditions de ressources",
      "Logement > 2 ans",
      "50 000€ max pour performance globale (3 actions ou plus, ou renovation d'ampleur) — duree 20 ans",
      "30 000€ max pour 2 actions — duree 15 ans",
      "7 000€ min pour 1 action — duree 15 ans",
      "Montant confirme inchange en 2026",
    ],
    cumulable: ["MaPrimeRenov", "CEE", "TVA 5.5%"],
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F19905",
  },
  {
    nom: "TVA reduite 5.5%",
    montant_max: null,
    conditions: ["Travaux amelioration energetique ou renovation thermique", "Logement > 2 ans", "Appliquee directement par l'artisan sur la facture"],
    cumulable: ["MaPrimeRenov", "CEE", "Eco-PTZ"],
    url_reference: "https://www.service-public.fr/professionnels-entreprises/vosdroits/F23568",
  },
];

/** Budget renovation pour passer d'une classe DPE a une autre — estimations 2026
 * Source: ANAH, koutravo.fr, energies-nouvelles.net, praximo.fr — verifie le 2026-05-09
 * Ces fourchettes sont indicatives — varient selon la surface, l'etat initial et la zone geographique.
 */
export interface CoutUpgradeDPE {
  de_classe: string;
  vers_classe: string;
  gain_classes: number;
  cout_m2_min: number;
  cout_m2_max: number;
  budget_100m2_min: number;
  budget_100m2_max: number;
  travaux_typiques: string;
}

export const COUTS_UPGRADE_DPE: CoutUpgradeDPE[] = [
  {
    de_classe: "G",
    vers_classe: "E",
    gain_classes: 2,
    cout_m2_min: 150,
    cout_m2_max: 250,
    budget_100m2_min: 15000,
    budget_100m2_max: 25000,
    travaux_typiques: "Isolation combles + fenetres double vitrage + regulation chauffage",
  },
  {
    de_classe: "F",
    vers_classe: "D",
    gain_classes: 2,
    cout_m2_min: 150,
    cout_m2_max: 300,
    budget_100m2_min: 15000,
    budget_100m2_max: 30000,
    travaux_typiques: "Isolation combles + ITI ou ITE + remplacement chaudiere/PAC",
  },
  {
    de_classe: "G",
    vers_classe: "D",
    gain_classes: 3,
    cout_m2_min: 250,
    cout_m2_max: 500,
    budget_100m2_min: 25000,
    budget_100m2_max: 50000,
    travaux_typiques: "Renovation energetique globale : isolation complete + PAC + VMC double flux",
  },
  {
    de_classe: "E",
    vers_classe: "C",
    gain_classes: 2,
    cout_m2_min: 100,
    cout_m2_max: 200,
    budget_100m2_min: 10000,
    budget_100m2_max: 20000,
    travaux_typiques: "Isolation combles + fenetres + optimisation chauffage existant",
  },
];
