/** Declarations et demarches post-achat.
 * Source: impots.gouv.fr, service-public.gouv.fr — verifie le 2026-05-09
 */

export interface DeclarationPostAchat {
  nom: string;
  delai: string;
  ou_faire: string;
  obligatoire: boolean;
  detail: string;
  url: string;
}

/** Source: impots.gouv.fr, service-public.gouv.fr — verifie le 2026-05-09 */
export const DECLARATIONS_POST_ACHAT: DeclarationPostAchat[] = [
  {
    nom: "Changement d'adresse multi-organismes",
    delai: "Dans les 7 jours suivant le demenagement",
    ou_faire: "service-public.gouv.fr (demarche unique)",
    obligatoire: true,
    detail: "Previent automatiquement : impots, CPAM, CAF, France Travail, retraite, immatriculation vehicule. Un seul formulaire en ligne. Inscription electorale automatique si changement de commune.",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F14128",
  },
  {
    nom: "Declaration revenus fonciers (si bailleur)",
    delai: "Declaration annuelle (mai-juin)",
    ou_faire: "impots.gouv.fr",
    obligatoire: true,
    detail: "Micro-foncier (< 15 000€ brut : abattement 30%) ou regime reel. Concerne les proprietaires bailleurs.",
    url: "https://www.impots.gouv.fr/particulier/les-revenus-fonciers",
  },
  {
    nom: "Declaration d'occupation",
    delai: "Avant le 1er juillet de chaque annee (delai 2026 : avant le 1er juillet 2026)",
    ou_faire: "impots.gouv.fr — onglet Biens immobiliers (service Gerer mes biens immobiliers)",
    obligatoire: true,
    detail: "Declarer qui occupe le logement (vous, locataire, vacant). Obligatoire depuis 2023 pour tous les proprietaires. Amende de 150€ par bien en cas d'omission, erreur ou declaration incomplete (confirmee 2026). Nouveaute 2026 : si le bien est loue, declarer aussi le loyer mensuel hors charges. Si le gestionnaire gere le bien, il doit transmettre les informations necessaires au proprietaire (nouveaute loi de finances 2026). Formulaire papier 1208-OD-SD disponible si pas d'acces internet. Pas de re-declaration necessaire si la situation est inchangee depuis la derniere declaration.",
    url: "https://www.impots.gouv.fr/particulier/la-declaration-doccupation",
  },
  {
    nom: "Exoneration taxe fonciere (neuf)",
    delai: "Dans les 90 jours de l'achevement",
    ou_faire: "Centre des impots (formulaire H1 ou H2)",
    obligatoire: false,
    detail: "Exoneration de 2 ans pour les constructions neuves. La demande doit etre proactive.",
    url: "https://www.impots.gouv.fr/particulier/taxe-fonciere",
  },
  {
    nom: "Mise a jour carte grise",
    delai: "Dans le mois suivant le demenagement",
    ou_faire: "ants.gouv.fr",
    obligatoire: true,
    detail: "Amende de 135€ si non fait. Gratuit en ligne via ANTS.",
    url: "https://ants.gouv.fr/",
  },
  {
    nom: "Declaration loyer mensuel (si bailleur — nouveaute 2026)",
    delai: "Avant le 1er juillet 2026 (puis a chaque changement de situation)",
    ou_faire: "impots.gouv.fr — service Gerer mes biens immobiliers (GMBI)",
    obligatoire: true,
    detail: "Depuis le 1er janvier 2026 : les proprietaires bailleurs doivent declarer le loyer mensuel hors charges dans le service GMBI. A renseigner lors de la declaration d'occupation si le bien est loue. Inclure aussi si le loyer est encadre (zone tendue).",
    url: "https://www.impots.gouv.fr/particulier/je-declare-loccupant-de-mon-bien-immobilier",
  },
  {
    nom: "Inscription sur les listes electorales",
    delai: "Automatique si changement sur service-public.gouv.fr",
    ou_faire: "Mairie ou service-public.gouv.fr",
    obligatoire: false,
    detail: "L'inscription est normalement automatique via la demarche de changement d'adresse si changement de commune.",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1367",
  },
  {
    nom: "DPE collectif de la copropriete (si applicable)",
    delai: "Obligation du syndic selon la taille : >200 lots avant fin 2024 (deja due), 50-200 lots avant fin 2025, <50 lots avant fin 2026",
    ou_faire: "Via le syndic de copropriete (obligation du syndic, pas du copropriétaire individuel)",
    obligatoire: true,
    detail: "Nouveaute reglementaire 2024-2026 : les coproprietes ont l'obligation de realiser un DPE collectif selon la taille de l'immeuble. En tant que nouveau proprietaire, verifiez que le syndic est en conformite. Ce DPE impacte les futures obligations de travaux collectifs et peut influencer la valeur de revente. A verifier lors de l'achat avant la signature du compromis.",
    url: "https://www.ecologie.gouv.fr/",
  },
];
