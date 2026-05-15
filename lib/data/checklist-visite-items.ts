export interface ChecklistCategorie {
  titre: string;
  items: string[];
}

export const VISITE_CHECKLIST: ChecklistCategorie[] = [
  {
    titre: "Environnement",
    items: [
      "Proximité transports, commerces, écoles",
      "Nuisances sonores (route, voisins, chantier)",
      "Exposition et luminosité",
      "Stationnement disponible",
    ],
  },
  {
    titre: "Extérieur / Parties communes",
    items: [
      "État façade et toiture",
      "État cage escalier, ascenseur",
      "Boîtes aux lettres, interphone",
      "Local poubelles, local vélos",
    ],
  },
  {
    titre: "Intérieur",
    items: [
      "État murs, sols, plafonds",
      "Fenêtres (double vitrage, étanchéité)",
      "Électricité (nombre prises, tableau récent)",
      "Plomberie (pression eau, évacuation)",
      "Chauffage (type, âge, fonctionnement)",
      "Ventilation (VMC, aération)",
    ],
  },
  {
    titre: "Documents à demander",
    items: [
      "DPE et diagnostics",
      "3 derniers PV d'AG (copropriété)",
      "Montant charges copropriété",
      "Taxe foncière",
      "Règlement copropriété",
    ],
  },
];

export const ALL_CHECKLIST_ITEMS: string[] = VISITE_CHECKLIST.flatMap((c) => c.items);
