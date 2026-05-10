/** Regles DPE (Diagnostic de Performance Energetique).
 * Source: ADEME, loi Climat & Resilience — verifie le 2026-05-09
 *
 * REFORME 2026 (en vigueur depuis 01/01/2026) :
 *   Le coefficient de conversion de l'electricite passe de 2,3 a 1,9 (energie primaire).
 *   Consequence : ~7 millions de logements chauffes a l'electricite gagnent 1 classe sans travaux.
 *   850 000 logements sortent du statut de passoire thermique (F ou G).
 *   LES SEUILS kWh/m2 et GES NE CHANGENT PAS — seul le calcul d'energie primaire change.
 *   Source: economie.gouv.fr, ADEME — verifie le 2026-05-09
 */

import type { DpeClasse } from "@/lib/types";

export interface SeuilDPE {
  classe: DpeClasse;
  energie_max_kwh: number;
  ges_max_kg: number;
  qualificatif: string;
}

/** Source: ADEME — seuils DPE en vigueur depuis 01/07/2021 (inchanges en 2026)
 * Note: la classe finale = la moins bonne des deux etiquettes (energie primaire ET GES).
 * Coefficient electricite : 2,3 jusqu'au 31/12/2025, puis 1,9 depuis le 01/01/2026.
 * verifie le 2026-05-09 */
export const SEUILS_DPE: SeuilDPE[] = [
  { classe: "A", energie_max_kwh: 70, ges_max_kg: 6, qualificatif: "Economie" },
  { classe: "B", energie_max_kwh: 110, ges_max_kg: 11, qualificatif: "Basse consommation" },
  { classe: "C", energie_max_kwh: 180, ges_max_kg: 30, qualificatif: "Moyenne basse" },
  { classe: "D", energie_max_kwh: 250, ges_max_kg: 50, qualificatif: "Moyenne" },
  { classe: "E", energie_max_kwh: 330, ges_max_kg: 70, qualificatif: "Moyenne haute" },
  { classe: "F", energie_max_kwh: 420, ges_max_kg: 100, qualificatif: "Passoire thermique" },
  { classe: "G", energie_max_kwh: Infinity, ges_max_kg: Infinity, qualificatif: "Passoire thermique extreme" },
];

/** Coefficient de conversion electricite en energie primaire */
export const COEFFICIENT_ELECTRICITE = {
  avant_2026: 2.3,
  depuis_2026: 1.9,
  date_application: "2026-01-01",
};

export interface InterdictionLocation {
  classe: DpeClasse;
  date_interdiction: string;
  description: string;
}

/** Source: Loi Climat & Resilience du 22/08/2021, art. 160 — verifie le 2026-05-09
 * IMPORTANT : s'applique aux contrats signes, renouveles ou reconduits tacitement a compter de la date.
 * Les contrats en cours avant la date restent valides jusqu'a leur renouvellement.
 * DOM-TOM : calendrier decale (+3 ans) — G interdit en 2028, F en 2031.
 *
 * ATTENTION — PROJET DE LOI "RELANCE LOGEMENT" (annonce 23/04/2026, pas encore adopte) :
 *   Le Premier ministre Lecornu et le ministre Jeanbrun ont presente le 23/04/2026 le projet de loi
 *   "Relance logement" qui permettrait de louer les passoires F et G sous conditions :
 *     - Engagement de travaux signe (3 ans pour maisons individuelles, 5 ans pour coproprietes)
 *     - Si le DPE n'evolue pas dans les delais : interdiction de louer + loyers considers indument percus
 *   Objectif : remettre 650 000 a 700 000 logements dans le circuit locatif d'ici 2028.
 *   Calendrier : premiere lecture parlementaire prevue avant ete 2026, vote vise fin 2026.
 *   STATUT : PROJET DE LOI — pas encore adopte, gouvernement sans majorite absolue.
 *   Source: vie-publique.fr, franceinfo.fr, actu-environnement.com — verifie le 2026-05-09
 */
export const CALENDRIER_PASSOIRES: InterdictionLocation[] = [
  { classe: "G", date_interdiction: "2025-01-01", description: "Interdiction de mise en location des logements classe G (> 420 kWh/m2/an) — nouveaux contrats, renouvellements, reconductions tacites. ATTENTION : reforme DPE 01/01/2026 (coeff elec 1,9) = ~850 000 passoires F/G reclassees E ou mieux sans travaux." },
  { classe: "F", date_interdiction: "2028-01-01", description: "Interdiction de mise en location des logements classe F (> 330 kWh/m2/an). Projet de loi Relance Logement (annonce 23/04/2026) pourrait permettre la location sous engagement de travaux — pas encore adopte." },
  { classe: "E", date_interdiction: "2034-01-01", description: "Interdiction de mise en location des logements classe E (> 250 kWh/m2/an)" },
];

export interface AuditEnergetique {
  classes_concernees: DpeClasse[];
  date_obligation: string;
  description: string;
}

/** Source: decret n° 2022-780 du 04/05/2022, art. L. 173-1-1 CCH — verifie le 2026-05-09
 * S'applique uniquement aux logements en monopropriete (pas les coproprietes).
 * Concerne les promesses de vente (compromis) et actes authentiques.
 * Exception : compromis signe avant la date d'obligation = audit non requis meme si acte authentique apres.
 * Source confirmee : cridon-ne.org, service-public.fr/particuliers/vosdroits/F37110
 */
export const AUDIT_ENERGETIQUE: AuditEnergetique[] = [
  { classes_concernees: ["F", "G"], date_obligation: "2023-04-01", description: "Audit energetique obligatoire pour vente de logements F ou G (monopropriete) — decret n°2022-780" },
  { classes_concernees: ["E"], date_obligation: "2025-01-01", description: "Audit energetique etendu aux logements classe E (confirme, en vigueur depuis 01/01/2025)" },
  { classes_concernees: ["D"], date_obligation: "2034-01-01", description: "Audit energetique etendu aux logements classe D" },
];

export const DPE_OPPOSABLE_DEPUIS = "2021-07-01";
export const DPE_VALIDITE_ANNEES = 10;

/** Impacts chiffres de la reforme DPE 2026 (coefficient electricite 2,3 -> 1,9)
 * Source: journaldelagence.com, batiweb.com, pap.fr — verifie le 2026-05-09
 */
export const BILAN_REFORME_DPE_2026 = {
  logements_reclasses_total: 2_260_000,       // ~47% des 4,8M logements chauffes a l'electricite gagnent >= 1 classe
  passoires_sortant_statut: 850_000,           // logements F ou G passant E ou mieux
  studios_moins_40m2_reclasses_pct: 41,        // 41% des studios gagnent 1 classe
  aucun_logement_degrade: true,                // aucun logement ne perd de classe
  reforme_en_vigueur: "2026-01-01",
  note: "DPE emis avant 01/01/2026 restent valides 10 ans mais calcules avec coeff 2,3. Pour beneficier du nouveau coeff 1,9, il faut faire etablir un nouveau DPE.",
} as const;

/** Reforme RE2020 / RE2025 — paliers successifs pour constructions neuves
 * RE2025 = premier renforcement de la RE2020, en vigueur depuis 01/01/2025 pour permis de construire.
 * Source: developpement-durable.gouv.fr, actu-environnement.com — verifie le 2026-05-09
 */
export const PALIERS_RE2020 = [
  {
    nom: "RE2020",
    en_vigueur: "2022-01-01",
    ic_construction_maison_kg_co2_m2: 640,
    ic_construction_collectif_kg_co2_m2: 740,
    description: "Reglements environnemental 2020 — remplace la RT2012",
  },
  {
    nom: "RE2025",
    en_vigueur: "2025-01-01",
    ic_construction_maison_kg_co2_m2: 530,
    ic_construction_collectif_kg_co2_m2: 650,
    description: "Premier palier de renforcement RE2020 — seuils carbone abaisses, materiaux biosources favorises, confort thermique ete renforce",
  },
  {
    nom: "RE2028",
    en_vigueur: "2028-01-01",
    ic_construction_maison_kg_co2_m2: 475,
    ic_construction_collectif_kg_co2_m2: null,
    description: "Deuxieme palier prevu — objectif provisoire",
  },
  {
    nom: "RE2031",
    en_vigueur: "2031-01-01",
    ic_construction_maison_kg_co2_m2: 415,
    ic_construction_collectif_kg_co2_m2: null,
    description: "Troisieme palier prevu — reduction ~35% vs 2020",
  },
] as const;
