/** Déclarations et démarches post-achat.
 * Source: impots.gouv.fr, service-public.gouv.fr — vérifié le 2026-05-09
 */

export interface DeclarationPostAchat {
  nom: string;
  delai: string;
  ou_faire: string;
  obligatoire: boolean;
  detail: string;
  url: string;
}

/** Source: impots.gouv.fr, service-public.gouv.fr — vérifié le 2026-05-09 */
export const DECLARATIONS_POST_ACHAT: DeclarationPostAchat[] = [
  {
    nom: "Changement d'adresse multi-organismes",
    delai: "Dans les 7 jours suivant le déménagement",
    ou_faire: "service-public.gouv.fr (démarche unique)",
    obligatoire: true,
    detail: "Prévient automatiquement : impôts, CPAM, CAF, France Travail, retraite, immatriculation véhicule. Un seul formulaire en ligne. Inscription électorale automatique si changement de commune.",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F14128",
  },
  {
    nom: "Déclaration revenus fonciers (si bailleur)",
    delai: "Déclaration annuelle (mai-juin)",
    ou_faire: "impots.gouv.fr",
    obligatoire: true,
    detail: "Micro-foncier (< 15 000€ brut : abattement 30%) ou régime réel. Concerne les propriétaires bailleurs.",
    url: "https://www.impots.gouv.fr/particulier/les-revenus-fonciers",
  },
  {
    nom: "Déclaration d'occupation",
    delai: "Avant le 1er juillet de chaque année (délai 2026 : avant le 1er juillet 2026)",
    ou_faire: "impots.gouv.fr — onglet Biens immobiliers (service Gérer mes biens immobiliers)",
    obligatoire: true,
    detail: "Déclarer qui occupe le logement (vous, locataire, vacant). Obligatoire depuis 2023 pour tous les propriétaires. Amende de 150€ par bien en cas d'omission, erreur ou déclaration incomplète (confirmée 2026). Nouveauté 2026 : si le bien est loué, déclarer aussi le loyer mensuel hors charges. Si le gestionnaire gère le bien, il doit transmettre les informations nécessaires au propriétaire (nouveauté loi de finances 2026). Formulaire papier 1208-OD-SD disponible si pas d'accès internet. Pas de re-déclaration nécessaire si la situation est inchangée depuis la dernière déclaration.",
    url: "https://www.impots.gouv.fr/particulier/la-declaration-doccupation",
  },
  {
    nom: "Exonération taxe foncière (neuf)",
    delai: "Dans les 90 jours de l'achèvement",
    ou_faire: "Centre des impôts (formulaire H1 ou H2)",
    obligatoire: false,
    detail: "Exonération de 2 ans pour les constructions neuves. La demande doit être proactive.",
    url: "https://www.impots.gouv.fr/particulier/taxe-fonciere",
  },
  {
    nom: "Mise à jour carte grise",
    delai: "Dans le mois suivant le déménagement",
    ou_faire: "ants.gouv.fr",
    obligatoire: true,
    detail: "Amende de 135€ si non fait. Gratuit en ligne via ANTS.",
    url: "https://ants.gouv.fr/",
  },
  {
    nom: "Déclaration loyer mensuel (si bailleur — nouveauté 2026)",
    delai: "Avant le 1er juillet 2026 (puis à chaque changement de situation)",
    ou_faire: "impots.gouv.fr — service Gérer mes biens immobiliers (GMBI)",
    obligatoire: true,
    detail: "Depuis le 1er janvier 2026 : les propriétaires bailleurs doivent déclarer le loyer mensuel hors charges dans le service GMBI. À renseigner lors de la déclaration d'occupation si le bien est loué. Inclure aussi si le loyer est encadré (zone tendue).",
    url: "https://www.impots.gouv.fr/particulier/je-declare-loccupant-de-mon-bien-immobilier",
  },
  {
    nom: "Inscription sur les listes électorales",
    delai: "Automatique si changement sur service-public.gouv.fr",
    ou_faire: "Mairie ou service-public.gouv.fr",
    obligatoire: false,
    detail: "L'inscription est normalement automatique via la démarche de changement d'adresse si changement de commune.",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1367",
  },
  {
    nom: "DPE collectif de la copropriété (si applicable)",
    delai: "Obligation du syndic selon la taille : >200 lots avant fin 2024 (déjà due), 50-200 lots avant fin 2025, <50 lots avant fin 2026",
    ou_faire: "Via le syndic de copropriété (obligation du syndic, pas du copropriétaire individuel)",
    obligatoire: true,
    detail: "Nouveauté réglementaire 2024-2026 : les copropriétés ont l'obligation de réaliser un DPE collectif selon la taille de l'immeuble. En tant que nouveau propriétaire, vérifiez que le syndic est en conformité. Ce DPE impacte les futures obligations de travaux collectifs et peut influencer la valeur de revente. À vérifier lors de l'achat avant la signature du compromis.",
    url: "https://www.ecologie.gouv.fr/",
  },
];
