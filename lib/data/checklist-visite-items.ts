export interface ChecklistCategorie {
  titre: string;
  items: string[];
}

export const VISITE_CHECKLIST: ChecklistCategorie[] = [
  {
    titre: "Environnement",
    items: [
      "Proximite transports, commerces, ecoles",
      "Nuisances sonores (route, voisins, chantier)",
      "Exposition et luminosite",
      "Stationnement disponible",
    ],
  },
  {
    titre: "Exterieur / Parties communes",
    items: [
      "Etat facade et toiture",
      "Etat cage escalier, ascenseur",
      "Boites aux lettres, interphone",
      "Local poubelles, local velos",
    ],
  },
  {
    titre: "Interieur",
    items: [
      "Etat murs, sols, plafonds",
      "Fenetres (double vitrage, etancheite)",
      "Electricite (nombre prises, tableau recent)",
      "Plomberie (pression eau, evacuation)",
      "Chauffage (type, age, fonctionnement)",
      "Ventilation (VMC, aeration)",
    ],
  },
  {
    titre: "Documents a demander",
    items: [
      "DPE et diagnostics",
      "3 derniers PV d'AG (copropriete)",
      "Montant charges copropriete",
      "Taxe fonciere",
      "Reglement copropriete",
    ],
  },
];

export const ALL_CHECKLIST_ITEMS: string[] = VISITE_CHECKLIST.flatMap((c) => c.items);
