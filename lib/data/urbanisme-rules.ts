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
    description: "Indique les regles d'urbanisme applicables, les taxes et les servitudes d'utilite publique",
    delai_instruction_mois: 1,
  },
  {
    type: "CUb",
    nom: "Certificat d'urbanisme operationnel",
    validite_mois: 18,
    description: "Indique si le terrain peut etre utilise pour un projet precis et l'etat des voiries/reseaux",
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
  { nom: "PLU", description: "Plan Local d'Urbanisme — zonage, regles de construction (hauteur, emprise, recul)", ou_consulter: "Mairie ou geoportail-urbanisme.gouv.fr" },
  { nom: "Servitudes", description: "Droits de passage, vue, mitoyennete, servitudes d'utilite publique", ou_consulter: "Certificat d'urbanisme, notaire" },
  { nom: "Cadastre", description: "Decoupage parcellaire, surfaces, limites de propriete", ou_consulter: "cadastre.gouv.fr" },
  { nom: "Zones protegees", description: "ABF (Architectes des Batiments de France), sites classes, AVAP", ou_consulter: "Mairie, DRAC" },
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
      titre: "Suppression revision allegee et modification simplifiee PLU",
      detail: "Ne subsistent plus que 2 procedures : revision generale (evolutions structurantes) et modification unique (procedure de droit commun). Entree en vigueur 27/05/2026.",
    },
    {
      titre: "Enquete publique non systematique",
      detail: "Dans la procedure de modification, l'enquete publique peut etre remplacee par PPVE (participation public voie electronique) ou simple mise a disposition. Decision motivee de l'autorite.",
    },
    {
      titre: "Derogations PLU elargies pour le logement",
      detail: "Toutes les communes (plus seulement les zones tendues) peuvent desormais derroger aux regles PLU via L.152-6 code urb. (gabarit, densite, surelevation, stationnement, recul). Nouvelles derogations : logements en zones activite economique, logements etudiants, changement destination batiment agricole.",
    },
    {
      titre: "Document unique SCOT + PLUi possible",
      detail: "Les collectivites peuvent fusionner SCOT et PLUi si perimetre identique. Entree en vigueur 27/05/2026.",
    },
    {
      titre: "Suppression caducite automatique des SCOT",
      detail: "Delai analyse resultats SCOT passe de 6 a 10 ans.",
    },
    {
      titre: "Sanctions renforcees travaux irreguliers",
      detail: "Amende mise en demeure jusqu'a 30 000€. Astreinte max: 25 000€ → 100 000€.",
    },
  ],
} as const;
