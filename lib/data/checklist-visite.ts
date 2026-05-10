/** Checklist de visite immobiliere.
 * Source: ANIL, ADEME, service-public.fr, qualitel.org — verifie le 2026-05-09
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
    categorie: "Exterieur & environnement",
    items: [
      { item: "Etat de la facade et de la toiture", importance: "critique", detail: "Fissures, infiltrations, mousse sur le toit = travaux couteux. Reperage d'une gouttiere ? Etat des joints de facade ?" },
      { item: "Bruit (circulation, voisins, bars)", importance: "important", detail: "Revenir a differentes heures pour evaluer le bruit reel. Verifier classement sonore de la rue (disponible en mairie)." },
      { item: "Proximite transports, commerces, ecoles", importance: "utile", detail: "Verifier sur Google Maps les temps de trajet reels" },
      { item: "Stationnement", importance: "important", detail: "Place incluse ? Parking a proximite ? Cout mensuel ?" },
      { item: "Vis-a-vis", importance: "utile", detail: "Observer depuis les fenetres — vis-a-vis direct ?" },
      { item: "Risques naturels et technologiques (PPRI, PPRN)", importance: "critique", detail: "Verifier sur georisques.gouv.fr : zone inondable, retrait-gonflement argiles, sismicite. Le vendeur doit fournir l'Etat des Risques et Pollutions (ERP)." },
      { item: "Orientation et luminosite", importance: "important", detail: "Exposition sud ou est = luminosite optimale. Tester a differentes heures si possible." },
    ],
  },
  {
    categorie: "Interieur — structure",
    items: [
      { item: "Traces d'humidite (murs, plafonds)", importance: "critique", detail: "Taches, moisissures, peinture cloquee = probleme structurel potentiel. Verifier aussi les angles bas des murs (remontees capillaires)." },
      { item: "Fissures dans les murs", importance: "critique", detail: "Fissures > 2mm ou en escalier = risque structurel, demander un expert batiment. Distinguer fissures actives (s'ouvrent) de fissures stabilisees." },
      { item: "Etat des fenetres (double vitrage ?)", importance: "important", detail: "Simple vitrage = deperdition energetique importante, cout remplacement 300-800€/fenetre. Verifier l'etancheite des joints." },
      { item: "Etat des sols", importance: "utile", detail: "Grincements, affaissements, carrelage fissure ou decole" },
      { item: "Hauteur sous plafond", importance: "utile", detail: "< 2,20m = non habitable legalement. 2,50m+ = confort optimal. Mesurer si doute." },
      { item: "Cave, sous-sol ou vide sanitaire", importance: "important", detail: "Humidite, infiltrations, odeur de moisi = signal d'alarme. Verifier si la surface est incluse dans le Carrez." },
      { item: "Ventilation (VMC ou aeration naturelle)", importance: "important", detail: "Absence de VMC dans cuisine et salles de bain = condensation, moisissures. Verifier si la VMC fonctionne (mettre la main devant la bouche d'extraction)." },
    ],
  },
  {
    categorie: "Installations techniques",
    items: [
      { item: "Tableau electrique (disjoncteur differentiel)", importance: "critique", detail: "Pas de differentiel 30mA = installation non conforme, 5 000-10 000€ de mise aux normes. Installer. electrique > 15 ans = diagnostic obligatoire en vente." },
      { item: "Type de chauffage et etat", importance: "important", detail: "Age de la chaudiere ? (> 15 ans = remplacement a prevoir). Radiateurs electriques grille-pain = facture energetique elevee. Pompe a chaleur = valorisation." },
      { item: "Eau chaude (type, capacite)", importance: "important", detail: "Ballon electrique, chaudiere, solaire ? Capacite suffisante pour le foyer ? Ballon > 10 ans = a prevoir." },
      { item: "Plomberie (pression, evacuation)", importance: "important", detail: "Ouvrir les robinets, verifier la pression et l'evacuation. Traces de rouille sous l'evier ? Tuyaux en plomb (immeuble > 1948) = remplacement obligatoire." },
      { item: "Gaz (installation, date diagnostic)", importance: "critique", detail: "Installations gaz > 15 ans = diagnostic obligatoire en vente. Verifier l'etat du compteur et des tuyaux. Odeur de gaz = signaler immediatement." },
      { item: "Fibre optique / couverture reseau", importance: "utile", detail: "Zone fibre disponible ? (verifier degrouptest.fr). Couverture mobile 4G/5G dans le logement ?" },
    ],
  },
  {
    categorie: "DPE & energie",
    items: [
      { item: "Classe DPE affichee", importance: "critique", detail: "F ou G = passoire thermique (interdiction location depuis 2025). Verifier que le DPE est recent (< 10 ans, methode 3CL post-2021). ATTENTION reforme 2026 : les DPE etablis AVANT 01/01/2026 sur logements chauffes a l'electricite sous-estiment la classe actuelle (coeff 2,3 vs 1,9 depuis jan 2026). Demander la date du DPE et si le logement est electrique — un nouveau DPE post-2026 peut faire gagner 1 classe sans travaux. ~850 000 logements concernes en France." },
      { item: "Audit energetique (si F, G ou E)", importance: "critique", detail: "Obligatoire en vente pour logements F/G depuis 04/2023 et E depuis 01/01/2025 (monopropriete). Le vendeur doit le fournir. L'audit contient un plan de travaux chiffre = base de negociation." },
      { item: "Montant des charges energetiques", importance: "important", detail: "Demander les 2 dernieres factures EDF/gaz. Comparer avec la moyenne estimee dans le DPE. Ecart > 20% = DPE peu fiable ou consommation anormale." },
      { item: "Isolation (murs, combles, fenetres)", importance: "important", detail: "Demander si des travaux d'isolation ont ete faits et si oui, par qui (artisan RGE = label qualite, aides mobilisees). Demander les factures." },
      { item: "Impact DPE sur prix de vente", importance: "important", detail: "Une passoire thermique (F/G) peut subir une decote de 15 a 25% par rapport a un logement de meme surface classe C ou D dans la meme zone. Opportunite : un logement classe F/G electrique peut gagner 1 classe avec un simple nouveau DPE post-janv 2026 (coeff 1,9) = decote injustifiee a negocier." },
    ],
  },
  {
    categorie: "Copropriete (si applicable)",
    items: [
      { item: "Montant des charges mensuelles", importance: "critique", detail: "Charges > 300€/mois = a investiguer. Demander le detail (chauffage collectif, gardien, ascenseur)." },
      { item: "Travaux votes ou prevus", importance: "critique", detail: "Consulter les PV d'AG. Des travaux votes non payes = appel de fonds a prevoir." },
      { item: "Etat des parties communes", importance: "important", detail: "Cage d'escalier, hall, ascenseur, parking — refletent la gestion du syndic." },
      { item: "Fonds de travaux Alur", importance: "utile", detail: "Montant en reserve ? Minimum legal = 5% du budget previsionnel." },
    ],
  },
  {
    categorie: "Documents a demander",
    items: [
      { item: "Taxe fonciere (dernier avis)", importance: "important", detail: "Montant reel, pas l'estimation. Varie fortement selon les communes. A verifier aussi : exonerations en cours (VEFA, logement neuf) et leur duree." },
      { item: "Factures energetiques (2 ans)", importance: "important", detail: "Valider le DPE avec la consommation reelle. Ecart important = DPE contestable." },
      { item: "PV des AG (3 ans)", importance: "critique", detail: "Obligatoire en copropriete (loi ALUR). Revele l'etat reel de l'immeuble, les conflits, les travaux votes. Demander aussi le carnet d'entretien de l'immeuble." },
      { item: "Reglement de copropriete", importance: "important", detail: "Restrictions d'usage ? Animaux ? Activite professionnelle ? Location Airbnb autorisee ? Tantièmes ? Verifier si le lot comprend des parties communes a usage privatif." },
      { item: "Dossier de Diagnostics Techniques (DDT)", importance: "critique", detail: "Obligatoire en vente. Contient : DPE, amiante (si avant 1997), plomb/CREP (si avant 1949), electricite et gaz (si > 15 ans), ERP (risques), mesurage Carrez (copropriete), termites (zones concernees), radon (zones 3)." },
      { item: "Etat hypothecaire et situation juridique", importance: "critique", detail: "Le notaire verifie les hypotheques, servitudes, procedures. Demander si le bien est en indivision ou fait l'objet d'une procedure judiciaire." },
    ],
  },
  {
    categorie: "Securite et risques specifiques",
    items: [
      { item: "Presence d'amiante", importance: "critique", detail: "Logements construits avant le 01/07/1997 = diagnostic amiante obligatoire. Amiante friable = travaux de demenibrement couteux (5 000-20 000€+). Amiante non friable = surveillance suffisante." },
      { item: "Presence de plomb (CREP)", importance: "critique", detail: "Logements construits avant 1949 = Constat de Risque d'Exposition au Plomb obligatoire. Peintures au plomb = risque saturnisme (enfants). Travaux de recouvrement ou depose obligatoires si taux > seuil." },
      { item: "Termites et parasites", importance: "important", detail: "Zones a risque termites = diagnostic obligatoire. Verifier aussi merule (champignon) dans les zones humides. Traitement : 1 000-5 000€ selon ampleur." },
      { item: "Radon (zones a risque)", importance: "utile", detail: "Gaz radioactif naturel, risque en zones granitiques (Bretagne, Massif Central, Vosges, Corse). Zone 3 = mesure obligatoire dans certains ERP. Aerateur suffisant pour logements." },
    ],
  },
  {
    categorie: "VEFA — logement neuf sur plan",
    items: [
      { item: "Attestation GFA (Garantie Financiere d'Achevement)", importance: "critique", detail: "Obligatoire depuis 2015. Doit figurer en annexe de l'acte authentique. Verifier : garant identifie (banque ou assureur), montant couvre = prix total du logement, programme concerne. Sans GFA valide = refuser de signer." },
      { item: "Echeancier des appels de fonds", importance: "critique", detail: "Plafonds reglementaires cumulatifs (art. R261-14 CCH) : 35% fondations, 70% hors d'eau, 80% hors d'air, 95% achevement, 100% livraison. Tout appel au-dela de ces plafonds = refuser le paiement." },
      { item: "Depot de garantie (contrat de reservation)", importance: "important", detail: "5% max si delai < 1 an avant acte authentique, 2% si 1-2 ans, 0% si > 2 ans. Verse sur compte sequestre — exiger justificatif. Ce montant est defalque des appels de fonds futurs." },
      { item: "Norme RE2025 et DPE previsionneldu neuf", importance: "important", detail: "Tout permis de construire depose depuis 01/01/2025 est soumis a la RE2025 (seuils IC Construction 530 kg CO2/m2 maison, 650 kg CO2/m2 collectif). Demander le DPE previsionnel du logement — un neuf doit etre classe A ou B." },
      { item: "Reserves a la livraison", importance: "critique", detail: "Inspecter minutieusement a la livraison. Consigner jusqu'a 5% du prix en cas de reserves (chez notaire ou Caisse des Depots). Promoteur dispose de 1 an (GPA) pour corriger. Reserves non signalees a la livraison = presomption d'acceptation." },
      { item: "Garanties constructeur", importance: "important", detail: "Garantie parfait achevement (1 an), biennale (2 ans — equipements dissociables), decennale (10 ans — structure, toiture, etancheite). Conserver tous les PV de livraison et courriers de reserves." },
      { item: "Delai de livraison et penalites", importance: "important", detail: "Verifier la date previsionnelle de livraison dans l'acte. Le contrat VEFA doit prevoir des penalites en cas de retard (min 1/3000 du prix par jour selon CCH). Retards > 30 jours = possiblite de resiliation a partir de certains seuils." },
    ],
  },
];
