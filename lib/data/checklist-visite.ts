/** Checklist de visite immobilière.
 * Source: ANIL, ADEME, service-public.fr, qualitel.org — vérifié le 2026-05-09
 */

export interface ChecklistCategory {
  categorie: string;
  items: ChecklistItemDef[];
}

export interface ChecklistItemDef {
  item: string;
  importance: "critique" | "important" | "utile";
  detail: string;
}

export const CHECKLIST_VISITE: ChecklistCategory[] = [
  {
    categorie: "Extérieur & environnement",
    items: [
      { item: "État de la façade et de la toiture", importance: "critique", detail: "Fissures, infiltrations, mousse sur le toit = travaux coûteux. Repérage d'une gouttière ? État des joints de façade ?" },
      { item: "Bruit (circulation, voisins, bars)", importance: "important", detail: "Revenir à différentes heures pour évaluer le bruit réel. Vérifier classement sonore de la rue (disponible en mairie)." },
      { item: "Proximité transports, commerces, écoles", importance: "utile", detail: "Vérifier sur Google Maps les temps de trajet réels" },
      { item: "Stationnement", importance: "important", detail: "Place incluse ? Parking à proximité ? Coût mensuel ?" },
      { item: "Vis-à-vis", importance: "utile", detail: "Observer depuis les fenêtres — vis-à-vis direct ?" },
      { item: "Risques naturels et technologiques (PPRI, PPRN)", importance: "critique", detail: "Vérifier sur georisques.gouv.fr : zone inondable, retrait-gonflement argiles, sismicité. Le vendeur doit fournir l'État des Risques et Pollutions (ERP)." },
      { item: "Orientation et luminosité", importance: "important", detail: "Exposition sud ou est = luminosité optimale. Tester à différentes heures si possible." },
    ],
  },
  {
    categorie: "Intérieur — structure",
    items: [
      { item: "Traces d'humidité (murs, plafonds)", importance: "critique", detail: "Taches, moisissures, peinture cloquée = problème structurel potentiel. Vérifier aussi les angles bas des murs (remontées capillaires)." },
      { item: "Fissures dans les murs", importance: "critique", detail: "Fissures > 2mm ou en escalier = risque structurel, demander un expert bâtiment. Distinguer fissures actives (s'ouvrent) de fissures stabilisées." },
      { item: "État des fenêtres (double vitrage ?)", importance: "important", detail: "Simple vitrage = déperdition énergétique importante, coût remplacement 300-800€/fenêtre. Vérifier l'étanchéité des joints." },
      { item: "État des sols", importance: "utile", detail: "Grincements, affaissements, carrelage fissuré ou décollé" },
      { item: "Hauteur sous plafond", importance: "utile", detail: "< 2,20m = non habitable légalement. 2,50m+ = confort optimal. Mesurer si doute." },
      { item: "Cave, sous-sol ou vide sanitaire", importance: "important", detail: "Humidité, infiltrations, odeur de moisi = signal d'alarme. Vérifier si la surface est incluse dans le Carrez." },
      { item: "Ventilation (VMC ou aération naturelle)", importance: "important", detail: "Absence de VMC dans cuisine et salles de bain = condensation, moisissures. Vérifier si la VMC fonctionne (mettre la main devant la bouche d'extraction)." },
    ],
  },
  {
    categorie: "Installations techniques",
    items: [
      { item: "Tableau électrique (disjoncteur différentiel)", importance: "critique", detail: "Pas de différentiel 30mA = installation non conforme, 5 000-10 000€ de mise aux normes. Installer. électrique > 15 ans = diagnostic obligatoire en vente." },
      { item: "Type de chauffage et état", importance: "important", detail: "Âge de la chaudière ? (> 15 ans = remplacement à prévoir). Radiateurs électriques grille-pain = facture énergétique élevée. Pompe à chaleur = valorisation." },
      { item: "Eau chaude (type, capacité)", importance: "important", detail: "Ballon électrique, chaudière, solaire ? Capacité suffisante pour le foyer ? Ballon > 10 ans = à prévoir." },
      { item: "Plomberie (pression, évacuation)", importance: "important", detail: "Ouvrir les robinets, vérifier la pression et l'évacuation. Traces de rouille sous l'évier ? Tuyaux en plomb (immeuble > 1948) = remplacement obligatoire." },
      { item: "Gaz (installation, date diagnostic)", importance: "critique", detail: "Installations gaz > 15 ans = diagnostic obligatoire en vente. Vérifier l'état du compteur et des tuyaux. Odeur de gaz = signaler immédiatement." },
      { item: "Fibre optique / couverture réseau", importance: "utile", detail: "Zone fibre disponible ? (vérifier degrouptest.fr). Couverture mobile 4G/5G dans le logement ?" },
    ],
  },
  {
    categorie: "DPE & énergie",
    items: [
      { item: "Classe DPE affichée", importance: "critique", detail: "F ou G = passoire thermique (interdiction location depuis 2025). Vérifier que le DPE est récent (< 10 ans, méthode 3CL post-2021). ATTENTION réforme 2026 : les DPE établis AVANT 01/01/2026 sur logements chauffés à l'électricité sous-estiment la classe actuelle (coeff 2,3 vs 1,9 depuis jan 2026). Demander la date du DPE et si le logement est électrique — un nouveau DPE post-2026 peut faire gagner 1 classe sans travaux. ~850 000 logements concernés en France." },
      { item: "Audit énergétique (si F, G ou E)", importance: "critique", detail: "Obligatoire en vente pour logements F/G depuis 04/2023 et E depuis 01/01/2025 (monopropriété). Le vendeur doit le fournir. L'audit contient un plan de travaux chiffré = base de négociation." },
      { item: "Montant des charges énergétiques", importance: "important", detail: "Demander les 2 dernières factures EDF/gaz. Comparer avec la moyenne estimée dans le DPE. Écart > 20% = DPE peu fiable ou consommation anormale." },
      { item: "Isolation (murs, combles, fenêtres)", importance: "important", detail: "Demander si des travaux d'isolation ont été faits et si oui, par qui (artisan RGE = label qualité, aides mobilisées). Demander les factures." },
      { item: "Impact DPE sur prix de vente", importance: "important", detail: "Une passoire thermique (F/G) peut subir une décote de 15 à 25% par rapport à un logement de même surface classé C ou D dans la même zone. Opportunité : un logement classé F/G électrique peut gagner 1 classe avec un simple nouveau DPE post-janv 2026 (coeff 1,9) = décote injustifiée à négocier." },
    ],
  },
  {
    categorie: "Copropriété (si applicable)",
    items: [
      { item: "Montant des charges mensuelles", importance: "critique", detail: "Charges > 300€/mois = à investiguer. Demander le détail (chauffage collectif, gardien, ascenseur)." },
      { item: "Travaux votés ou prévus", importance: "critique", detail: "Consulter les PV d'AG. Des travaux votés non payés = appel de fonds à prévoir." },
      { item: "État des parties communes", importance: "important", detail: "Cage d'escalier, hall, ascenseur, parking — reflètent la gestion du syndic." },
      { item: "Fonds de travaux Alur", importance: "utile", detail: "Montant en réserve ? Minimum légal = 5% du budget prévisionnel." },
    ],
  },
  {
    categorie: "Documents à demander",
    items: [
      { item: "Taxe foncière (dernier avis)", importance: "important", detail: "Montant réel, pas l'estimation. Varie fortement selon les communes. À vérifier aussi : exonérations en cours (VEFA, logement neuf) et leur durée." },
      { item: "Factures énergétiques (2 ans)", importance: "important", detail: "Valider le DPE avec la consommation réelle. Écart important = DPE contestable." },
      { item: "PV des AG (3 ans)", importance: "critique", detail: "Obligatoire en copropriété (loi ALUR). Révèle l'état réel de l'immeuble, les conflits, les travaux votés. Demander aussi le carnet d'entretien de l'immeuble." },
      { item: "Règlement de copropriété", importance: "important", detail: "Restrictions d'usage ? Animaux ? Activité professionnelle ? Location Airbnb autorisée ? Tantièmes ? Vérifier si le lot comprend des parties communes à usage privatif." },
      { item: "Dossier de Diagnostics Techniques (DDT)", importance: "critique", detail: "Obligatoire en vente. Contient : DPE, amiante (si avant 1997), plomb/CREP (si avant 1949), électricité et gaz (si > 15 ans), ERP (risques), mesurage Carrez (copropriété), termites (zones concernées), radon (zones 3)." },
      { item: "État hypothécaire et situation juridique", importance: "critique", detail: "Le notaire vérifie les hypothèques, servitudes, procédures. Demander si le bien est en indivision ou fait l'objet d'une procédure judiciaire." },
    ],
  },
  {
    categorie: "Sécurité et risques spécifiques",
    items: [
      { item: "Présence d'amiante", importance: "critique", detail: "Logements construits avant le 01/07/1997 = diagnostic amiante obligatoire. Amiante friable = travaux de démembrement coûteux (5 000-20 000€+). Amiante non friable = surveillance suffisante." },
      { item: "Présence de plomb (CREP)", importance: "critique", detail: "Logements construits avant 1949 = Constat de Risque d'Exposition au Plomb obligatoire. Peintures au plomb = risque saturnisme (enfants). Travaux de recouvrement ou dépose obligatoires si taux > seuil." },
      { item: "Termites et parasites", importance: "important", detail: "Zones à risque termites = diagnostic obligatoire. Vérifier aussi mérule (champignon) dans les zones humides. Traitement : 1 000-5 000€ selon ampleur." },
      { item: "Radon (zones à risque)", importance: "utile", detail: "Gaz radioactif naturel, risque en zones granitiques (Bretagne, Massif Central, Vosges, Corse). Zone 3 = mesure obligatoire dans certains ERP. Aérateur suffisant pour logements." },
    ],
  },
  {
    categorie: "VEFA — logement neuf sur plan",
    items: [
      { item: "Attestation GFA (Garantie Financière d'Achèvement)", importance: "critique", detail: "Obligatoire depuis 2015. Doit figurer en annexe de l'acte authentique. Vérifier : garant identifié (banque ou assureur), montant couvre = prix total du logement, programme concerné. Sans GFA valide = refuser de signer." },
      { item: "Échéancier des appels de fonds", importance: "critique", detail: "Plafonds réglementaires cumulatifs (art. R261-14 CCH) : 35% fondations, 70% hors d'eau, 80% hors d'air, 95% achèvement, 100% livraison. Tout appel au-delà de ces plafonds = refuser le paiement." },
      { item: "Dépôt de garantie (contrat de réservation)", importance: "important", detail: "5% max si délai < 1 an avant acte authentique, 2% si 1-2 ans, 0% si > 2 ans. Versé sur compte séquestre — exiger justificatif. Ce montant est défalqué des appels de fonds futurs." },
      { item: "Norme RE2025 et DPE prévisionnel du neuf", importance: "important", detail: "Tout permis de construire déposé depuis 01/01/2025 est soumis à la RE2025 (seuils IC Construction 530 kg CO2/m² maison, 650 kg CO2/m² collectif). Demander le DPE prévisionnel du logement — un neuf doit être classé A ou B." },
      { item: "Réserves à la livraison", importance: "critique", detail: "Inspecter minutieusement à la livraison. Consigner jusqu'à 5% du prix en cas de réserves (chez notaire ou Caisse des Dépôts). Promoteur dispose de 1 an (GPA) pour corriger. Réserves non signalées à la livraison = présomption d'acceptation." },
      { item: "Garanties constructeur", importance: "important", detail: "Garantie parfait achèvement (1 an), biennale (2 ans — équipements dissociables), décennale (10 ans — structure, toiture, étanchéité). Conserver tous les PV de livraison et courriers de réserves." },
      { item: "Délai de livraison et pénalités", importance: "important", detail: "Vérifier la date prévisionnelle de livraison dans l'acte. Le contrat VEFA doit prévoir des pénalités en cas de retard (min 1/3000 du prix par jour selon CCH). Retards > 30 jours = possibilité de résiliation à partir de certains seuils." },
    ],
  },
];
