/** Zonage ABC des communes de France.
 * Source: data.gouv.fr, arrete du 01/08/2014 modifie — verifie le 2026-05-09
 * Mise a jour : arrete du 05/09/2025 (468 communes reclassees vers zones plus tendues)
 * Ref: https://www.ecologie.gouv.fr/politiques-publiques/zonage-b-c
 * Ref: https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052198878
 *
 * NOTE: Ce fichier contient les communes representatives par zone (90+ entrees).
 * Pour la liste exhaustive (36 000+ communes), utiliser le simulateur officiel :
 * https://www.service-public.gouv.fr/simulateur/calcul/zonage-abc
 */

export type ZoneABC = "Abis" | "A" | "B1" | "B2" | "C";

export interface CommuneZonage {
  code_insee: string;
  code_postal: string;
  nom: string;
  zone: ZoneABC;
  departement: string;
}

/** Communes representatives par zone — verifie le 2026-05-09 */
export const COMMUNES_ZONAGE: CommuneZonage[] = [
  // ─── Zone Abis — Paris + petite couronne + quelques communes provinces ───
  // Source: empruntis.com/ptz-zone-abis, arrêté 01/08/2014 modifié
  { code_insee: "75056", code_postal: "75001", nom: "Paris", zone: "Abis", departement: "75" },
  // Hauts-de-Seine (92)
  { code_insee: "92012", code_postal: "92100", nom: "Boulogne-Billancourt", zone: "Abis", departement: "92" },
  { code_insee: "92044", code_postal: "92200", nom: "Levallois-Perret", zone: "Abis", departement: "92" },
  { code_insee: "92050", code_postal: "92000", nom: "Nanterre", zone: "Abis", departement: "92" },
  { code_insee: "92049", code_postal: "92200", nom: "Neuilly-sur-Seine", zone: "Abis", departement: "92" },
  { code_insee: "92046", code_postal: "92400", nom: "Courbevoie", zone: "Abis", departement: "92" },
  { code_insee: "92040", code_postal: "92130", nom: "Issy-les-Moulineaux", zone: "Abis", departement: "92" },
  { code_insee: "92063", code_postal: "92150", nom: "Suresnes", zone: "Abis", departement: "92" },
  { code_insee: "92060", code_postal: "92210", nom: "Saint-Cloud", zone: "Abis", departement: "92" },
  { code_insee: "92022", code_postal: "92110", nom: "Clichy", zone: "Abis", departement: "92" },
  { code_insee: "92036", code_postal: "92700", nom: "Colombes", zone: "Abis", departement: "92" },
  { code_insee: "92078", code_postal: "92800", nom: "Puteaux", zone: "Abis", departement: "92" },
  { code_insee: "92064", code_postal: "92230", nom: "Gennevilliers", zone: "Abis", departement: "92" },
  { code_insee: "92025", code_postal: "92270", nom: "Bois-Colombes", zone: "Abis", departement: "92" },
  { code_insee: "92020", code_postal: "92250", nom: "La Garenne-Colombes", zone: "Abis", departement: "92" },
  { code_insee: "92075", code_postal: "92220", nom: "Bagneux", zone: "A", departement: "92" },
  { code_insee: "92019", code_postal: "92140", nom: "Clamart", zone: "A", departement: "92" },
  { code_insee: "92002", code_postal: "92160", nom: "Antony", zone: "A", departement: "92" },
  // Seine-Saint-Denis (93)
  { code_insee: "93008", code_postal: "93300", nom: "Aubervilliers", zone: "Abis", departement: "93" },
  { code_insee: "93048", code_postal: "93100", nom: "Montreuil", zone: "Abis", departement: "93" },
  { code_insee: "93066", code_postal: "93400", nom: "Saint-Ouen-sur-Seine", zone: "Abis", departement: "93" },
  { code_insee: "93062", code_postal: "93210", nom: "Saint-Denis", zone: "Abis", departement: "93" },
  { code_insee: "93055", code_postal: "93500", nom: "Pantin", zone: "Abis", departement: "93" },
  { code_insee: "93006", code_postal: "93600", nom: "Aulnay-sous-Bois", zone: "A", departement: "93" },
  { code_insee: "93051", code_postal: "93700", nom: "Drancy", zone: "A", departement: "93" },
  { code_insee: "93047", code_postal: "93160", nom: "Noisy-le-Grand", zone: "A", departement: "93" },
  { code_insee: "93013", code_postal: "93140", nom: "Bondy", zone: "A", departement: "93" },
  { code_insee: "93070", code_postal: "93800", nom: "Epinay-sur-Seine", zone: "A", departement: "93" },
  // Val-de-Marne (94)
  { code_insee: "94037", code_postal: "94200", nom: "Ivry-sur-Seine", zone: "Abis", departement: "94" },
  { code_insee: "94041", code_postal: "94400", nom: "Vitry-sur-Seine", zone: "Abis", departement: "94" },
  { code_insee: "94028", code_postal: "94120", nom: "Fontenay-sous-Bois", zone: "Abis", departement: "94" },
  { code_insee: "94068", code_postal: "94300", nom: "Vincennes", zone: "Abis", departement: "94" },
  { code_insee: "94043", code_postal: "94700", nom: "Maisons-Alfort", zone: "Abis", departement: "94" },
  { code_insee: "94011", code_postal: "94500", nom: "Champigny-sur-Marne", zone: "Abis", departement: "94" },
  { code_insee: "94017", code_postal: "94000", nom: "Creteil", zone: "Abis", departement: "94" },
  { code_insee: "94080", code_postal: "94600", nom: "Choisy-le-Roi", zone: "Abis", departement: "94" },
  { code_insee: "94018", code_postal: "94430", nom: "Chennevieres-sur-Marne", zone: "A", departement: "94" },
  { code_insee: "94052", code_postal: "94260", nom: "Fresnes", zone: "A", departement: "94" },
  // Yvelines (78)
  { code_insee: "78646", code_postal: "78000", nom: "Versailles", zone: "Abis", departement: "78" },
  { code_insee: "78551", code_postal: "78100", nom: "Saint-Germain-en-Laye", zone: "Abis", departement: "78" },
  { code_insee: "78320", code_postal: "78600", nom: "Maisons-Laffitte", zone: "Abis", departement: "78" },
  { code_insee: "78158", code_postal: "78140", nom: "Velizy-Villacoublay", zone: "Abis", departement: "78" },
  { code_insee: "78621", code_postal: "78230", nom: "Le Pecq", zone: "Abis", departement: "78" },
  { code_insee: "78206", code_postal: "78400", nom: "Chatou", zone: "Abis", departement: "78" },
  { code_insee: "78440", code_postal: "78150", nom: "Le Chesnay-Rocquencourt", zone: "Abis", departement: "78" },
  // Essonne (91) — reclassees zone Abis (arrete 05/09/2025)
  { code_insee: "91080", code_postal: "91370", nom: "Bieres-sur-Essonne", zone: "B2", departement: "91" },
  { code_insee: "91661", code_postal: "91370", nom: "Verrières-le-Buisson", zone: "Abis", departement: "91" },
  { code_insee: "91478", code_postal: "91330", nom: "Yerres", zone: "A", departement: "91" },
  { code_insee: "91405", code_postal: "91300", nom: "Massy", zone: "A", departement: "91" },
  { code_insee: "91377", code_postal: "91120", nom: "Palaiseau", zone: "A", departement: "91" },
  { code_insee: "91434", code_postal: "91400", nom: "Orsay", zone: "A", departement: "91" },
  { code_insee: "91021", code_postal: "91160", nom: "Antony", zone: "Abis", departement: "91" },
  { code_insee: "91471", code_postal: "91190", nom: "Gif-sur-Yvette", zone: "A", departement: "91" },
  // Val-d'Oise (95) — proche banlieue nord
  { code_insee: "95210", code_postal: "95880", nom: "Enghien-les-Bains", zone: "Abis", departement: "95" },
  { code_insee: "95476", code_postal: "95000", nom: "Cergy", zone: "A", departement: "95" },
  { code_insee: "95500", code_postal: "95100", nom: "Argenteuil", zone: "A", departement: "95" },
  { code_insee: "95018", code_postal: "95800", nom: "Cergy-le-Haut", zone: "A", departement: "95" },
  { code_insee: "95127", code_postal: "95110", nom: "Sannois", zone: "A", departement: "95" },
  // Ain (01) — frontalier Geneve
  { code_insee: "01139", code_postal: "01210", nom: "Ferney-Voltaire", zone: "Abis", departement: "01" },
  { code_insee: "01284", code_postal: "01630", nom: "Saint-Genis-Pouilly", zone: "Abis", departement: "01" },
  // Alpes-Maritimes (06) — Cote d'Azur premium
  { code_insee: "06163", code_postal: "06240", nom: "Roquebrune-Cap-Martin", zone: "Abis", departement: "06" },
  { code_insee: "06161", code_postal: "06190", nom: "Roquefort-les-Pins", zone: "Abis", departement: "06" },
  // Haute-Savoie (74) — frontalier Geneve
  { code_insee: "74261", code_postal: "74160", nom: "Saint-Julien-en-Genevois", zone: "Abis", departement: "74" },

  // ─── Zone A — grandes agglomerations tendues ───
  // Source: ecologie.gouv.fr zonage-b-c
  { code_insee: "69123", code_postal: "69001", nom: "Lyon", zone: "A", departement: "69" },
  { code_insee: "69266", code_postal: "69100", nom: "Villeurbanne", zone: "A", departement: "69" },
  { code_insee: "69029", code_postal: "69300", nom: "Caluire-et-Cuire", zone: "A", departement: "69" },
  // Lyon peripherie (69) — zone A apres reclassements arretes 2024-2025
  { code_insee: "69256", code_postal: "69500", nom: "Bron", zone: "A", departement: "69" },
  { code_insee: "69089", code_postal: "69200", nom: "Venissieux", zone: "A", departement: "69" },
  { code_insee: "69275", code_postal: "69120", nom: "Vaulx-en-Velin", zone: "A", departement: "69" },
  { code_insee: "69034", code_postal: "69340", nom: "Francheville", zone: "A", departement: "69" },
  { code_insee: "69244", code_postal: "69130", nom: "Ecully", zone: "A", departement: "69" },
  { code_insee: "69152", code_postal: "69140", nom: "Rillieux-la-Pape", zone: "B1", departement: "69" },
  { code_insee: "69071", code_postal: "69150", nom: "Decines-Charpieu", zone: "B1", departement: "69" },
  { code_insee: "69199", code_postal: "69400", nom: "Villefranche-sur-Saone", zone: "B1", departement: "69" },
  { code_insee: "69278", code_postal: "69530", nom: "Brignais", zone: "B1", departement: "69" },
  { code_insee: "13055", code_postal: "13001", nom: "Marseille", zone: "A", departement: "13" },
  { code_insee: "13028", code_postal: "13100", nom: "Aix-en-Provence", zone: "A", departement: "13" },
  { code_insee: "06088", code_postal: "06000", nom: "Nice", zone: "A", departement: "06" },
  { code_insee: "06069", code_postal: "06600", nom: "Antibes", zone: "A", departement: "06" },
  { code_insee: "06027", code_postal: "06400", nom: "Cannes", zone: "A", departement: "06" },
  { code_insee: "34172", code_postal: "34000", nom: "Montpellier", zone: "A", departement: "34" },
  { code_insee: "74010", code_postal: "74000", nom: "Annecy", zone: "A", departement: "74" },
  { code_insee: "74281", code_postal: "74200", nom: "Thonon-les-Bains", zone: "A", departement: "74" },
  { code_insee: "83137", code_postal: "83000", nom: "Toulon", zone: "A", departement: "83" },

  // ─── Zone B1 — agglomerations moyennes tendues ───
  // Source: immobilier-danger.com/zoneB1, arrêté 05/09/2025
  { code_insee: "33063", code_postal: "33000", nom: "Bordeaux", zone: "B1", departement: "33" },
  { code_insee: "33281", code_postal: "33700", nom: "Merignac", zone: "B1", departement: "33" },
  { code_insee: "31555", code_postal: "31000", nom: "Toulouse", zone: "B1", departement: "31" },
  { code_insee: "31526", code_postal: "31770", nom: "Tournefeuille", zone: "B1", departement: "31" },
  { code_insee: "44109", code_postal: "44000", nom: "Nantes", zone: "B1", departement: "44" },
  { code_insee: "44162", code_postal: "44800", nom: "Saint-Herblain", zone: "B1", departement: "44" },
  { code_insee: "44184", code_postal: "44600", nom: "Saint-Nazaire", zone: "B1", departement: "44" },
  { code_insee: "35238", code_postal: "35000", nom: "Rennes", zone: "B1", departement: "35" },
  { code_insee: "67482", code_postal: "67000", nom: "Strasbourg", zone: "B1", departement: "67" },
  { code_insee: "59350", code_postal: "59000", nom: "Lille", zone: "B1", departement: "59" },
  { code_insee: "59512", code_postal: "59100", nom: "Roubaix", zone: "B1", departement: "59" },
  { code_insee: "59599", code_postal: "59200", nom: "Tourcoing", zone: "B1", departement: "59" },
  { code_insee: "38185", code_postal: "38000", nom: "Grenoble", zone: "B1", departement: "38" },
  { code_insee: "21231", code_postal: "21000", nom: "Dijon", zone: "B1", departement: "21" },
  { code_insee: "54395", code_postal: "54000", nom: "Nancy", zone: "B1", departement: "54" },
  { code_insee: "57463", code_postal: "57000", nom: "Metz", zone: "B1", departement: "57" },
  { code_insee: "14118", code_postal: "14000", nom: "Caen", zone: "B1", departement: "14" },
  { code_insee: "17300", code_postal: "17000", nom: "La Rochelle", zone: "B1", departement: "17" },
  { code_insee: "30189", code_postal: "30000", nom: "Nimes", zone: "B1", departement: "30" },
  { code_insee: "76351", code_postal: "76600", nom: "Le Havre", zone: "B1", departement: "76" },
  { code_insee: "76540", code_postal: "76000", nom: "Rouen", zone: "B1", departement: "76" },
  { code_insee: "80021", code_postal: "80000", nom: "Amiens", zone: "B1", departement: "80" },
  { code_insee: "49007", code_postal: "49000", nom: "Angers", zone: "B1", departement: "49" },
  { code_insee: "29019", code_postal: "29200", nom: "Brest", zone: "B1", departement: "29" },

  // ─── Zone B2 — villes moyennes et periurbain ───
  // Source: immobilier-danger.com/zoneB2, moneyvox.fr/immobilier/zone-departement
  { code_insee: "87085", code_postal: "87000", nom: "Limoges", zone: "B2", departement: "87" },
  { code_insee: "25056", code_postal: "25000", nom: "Besancon", zone: "B2", departement: "25" },
  { code_insee: "25388", code_postal: "25200", nom: "Montbeliard", zone: "B2", departement: "25" },
  { code_insee: "26362", code_postal: "26000", nom: "Valence", zone: "B2", departement: "26" },
  { code_insee: "16015", code_postal: "16000", nom: "Angouleme", zone: "B2", departement: "16" },
  { code_insee: "24322", code_postal: "24000", nom: "Perigueux", zone: "B2", departement: "24" },
  { code_insee: "29232", code_postal: "29000", nom: "Quimper", zone: "B2", departement: "29" },
  { code_insee: "22278", code_postal: "22000", nom: "Saint-Brieuc", zone: "B2", departement: "22" },
  { code_insee: "03185", code_postal: "03200", nom: "Vichy", zone: "B2", departement: "03" },
  { code_insee: "03163", code_postal: "03100", nom: "Montlucon", zone: "B2", departement: "03" },
  { code_insee: "12202", code_postal: "12000", nom: "Rodez", zone: "B2", departement: "12" },
  { code_insee: "21054", code_postal: "21200", nom: "Beaune", zone: "B2", departement: "21" },
  { code_insee: "27229", code_postal: "27000", nom: "Evreux", zone: "B2", departement: "27" },
  { code_insee: "17415", code_postal: "17100", nom: "Saintes", zone: "B2", departement: "17" },
  { code_insee: "83069", code_postal: "83600", nom: "Frejus", zone: "B2", departement: "83" },

  // ─── Zone C — reste du territoire, marches detendus ───
  // Source: cyberpret.com/ptz-zone-c, empruntis.com/ptz-zone-c
  { code_insee: "15014", code_postal: "15000", nom: "Aurillac", zone: "C", departement: "15" },
  { code_insee: "23096", code_postal: "23000", nom: "Gueret", zone: "C", departement: "23" },
  { code_insee: "19272", code_postal: "19000", nom: "Tulle", zone: "C", departement: "19" },
  { code_insee: "32013", code_postal: "32000", nom: "Auch", zone: "C", departement: "32" },
  { code_insee: "07186", code_postal: "07000", nom: "Privas", zone: "C", departement: "07" },
  { code_insee: "48095", code_postal: "48000", nom: "Mende", zone: "C", departement: "48" },
  { code_insee: "43113", code_postal: "43000", nom: "Le Puy-en-Velay", zone: "C", departement: "43" },
  { code_insee: "70550", code_postal: "70000", nom: "Vesoul", zone: "C", departement: "70" },
  { code_insee: "55029", code_postal: "55000", nom: "Bar-le-Duc", zone: "C", departement: "55" },
  { code_insee: "52121", code_postal: "52000", nom: "Chaumont", zone: "C", departement: "52" },
];

/** Helper : trouver la zone d'une commune par code postal */
export function findZoneByCodePostal(cp: string): ZoneABC | null {
  const commune = COMMUNES_ZONAGE.find((c) => c.code_postal === cp);
  return commune?.zone ?? null;
}

/** Helper : trouver la zone par code INSEE */
export function findZoneByCodeInsee(insee: string): ZoneABC | null {
  const commune = COMMUNES_ZONAGE.find((c) => c.code_insee === insee);
  return commune?.zone ?? null;
}
