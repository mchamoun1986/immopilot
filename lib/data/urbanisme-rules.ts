/** Regles d'urbanisme — PLU, preemption, certificats.
 * Source: service-public.gouv.fr/F1633, code de l'urbanisme art. L210-1 — verifie le 2026-05-09
 * Verification: CUa (1 mois) et CUb (2 mois) confirmes. Validite 18 mois confirmee.
 * DPU delai 2 mois confirme — silence vaut renonciation confirme.
 * MAJ 2026-05-09: LOI HUWART n°2025-1129 du 26/11/2025 (simplification droit urbanisme/logement)
 *   En vigueur progressivement, mesures PLU applicables au 27/05/2026 (6 mois apres promulgation)
 *   Source: legifrance.gouv.fr/jorf/id/JORFTEXT000052857880, AMF, ANIL — verifie le 2026-05-09
 */

export interface CertificatUrbanisme {
  type: "CUa" | "CUb";
  nom: string;
  validite_mois: number;
  description: string;
  delai_instruction_mois: number;
}

export const CERTIFICATS_URBANISME: CertificatUrbanisme[] = [
  {
    type: "CUa",
    nom: "Certificat d'urbanisme d'information",
    validite_mois: 18,
    description: "Indique les règles d'urbanisme applicables, les taxes et les servitudes d'utilité publique",
    delai_instruction_mois: 1,
  },
  {
    type: "CUb",
    nom: "Certificat d'urbanisme operationnel",
    validite_mois: 18,
    description: "Indique si le terrain peut être utilisé pour un projet précis et l'état des voiries/réseaux",
    delai_instruction_mois: 2,
  },
];

export interface DroitPreemption {
  type: string;
  beneficiaire: string;
  delai_reponse_mois: number;
  silence_vaut: string;
}

/** Source: code de l'urbanisme art. L210-1 et suivants */
export const DROIT_PREEMPTION_URBAIN: DroitPreemption = {
  type: "DPU (Droit de Preemption Urbain)",
  beneficiaire: "Commune ou EPCI",
  delai_reponse_mois: 2,
  silence_vaut: "Renonciation",
} as const;

export interface RegleUrbanisme {
  nom: string;
  description: string;
  ou_consulter: string;
}

export const REGLES_URBANISME: RegleUrbanisme[] = [
  { nom: "PLU", description: "Plan Local d'Urbanisme — zonage, règles de construction (hauteur, emprise, recul)", ou_consulter: "Mairie ou geoportail-urbanisme.gouv.fr" },
  { nom: "Servitudes", description: "Droits de passage, vue, mitoyenneté, servitudes d'utilité publique", ou_consulter: "Certificat d'urbanisme, notaire" },
  { nom: "Cadastre", description: "Découpage parcellaire, surfaces, limites de propriété", ou_consulter: "cadastre.gouv.fr" },
  { nom: "Zones protégées", description: "ABF (Architectes des Bâtiments de France), sites classés, AVAP", ou_consulter: "Mairie, DRAC" },
];

/** Loi Huwart n°2025-1129 du 26/11/2025 — simplification urbanisme
 * Mesures applicables au 27/05/2026 (6 mois apres promulgation)
 * Source: legifrance.gouv.fr/jorf/id/JORFTEXT000052857880 — verifie le 2026-05-09
 */
export const LOI_HUWART_2025 = {
  reference: "Loi n°2025-1129 du 26 novembre 2025",
  url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052857880",
  entree_en_vigueur_plu: "2026-05-27",
  mesures_cles: [
    {
      titre: "Suppression révision allégée et modification simplifiée PLU",
      detail: "Ne subsistent plus que 2 procédures : révision générale (évolutions structurantes) et modification unique (procédure de droit commun). Entrée en vigueur 27/05/2026.",
    },
    {
      titre: "Enquête publique non systématique",
      detail: "Dans la procédure de modification, l'enquête publique peut être remplacée par PPVE (participation public voie électronique) ou simple mise à disposition. Décision motivée de l'autorité.",
    },
    {
      titre: "Dérogations PLU élargies pour le logement",
      detail: "Toutes les communes (plus seulement les zones tendues) peuvent désormais déroger aux règles PLU via L.152-6 code urb. (gabarit, densité, surélévation, stationnement, recul). Nouvelles dérogations : logements en zones activité économique, logements étudiants, changement destination bâtiment agricole.",
    },
    {
      titre: "Document unique SCOT + PLUi possible",
      detail: "Les collectivités peuvent fusionner SCOT et PLUi si périmètre identique. Entrée en vigueur 27/05/2026.",
    },
    {
      titre: "Suppression caducité automatique des SCOT",
      detail: "Délai analyse résultats SCOT passe de 6 à 10 ans.",
    },
    {
      titre: "Sanctions renforcées travaux irréguliers",
      detail: "Amende mise en demeure jusqu'a 30 000€. Astreinte max: 25 000€ → 100 000€.",
    },
  ],
} as const;
