// annuaire-professionnels.ts
// Annuaire des acteurs immobiliers nationaux en France
// Sources : homepages officielles, WebFetch + WebSearch — Mai 2026
// ~69 acteurs couvrant 12 catégories

export type CategorieActeur =
  | "courtier_credit"
  | "banque"
  | "assurance_emprunteur"
  | "assurance_mrh"
  | "portail_annonces"
  | "reseau_agences"
  | "notaire"
  | "diagnostiqueur"
  | "courtier_assurance"
  | "demenagement"
  | "renovation"
  | "estimation";

export type EtapeRelevante = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ActeurImmobilier {
  nom: string;
  categorie: CategorieActeur;
  description: string;
  site_web: string;
  logo_url: string | null;
  couverture: "nationale" | "regionale" | "locale";
  etapes_pertinentes: EtapeRelevante[];
  services_cles: string[];
  gratuit: boolean;
  partenaire_potentiel: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// COURTIERS CRÉDIT (étapes 2-3 : financement, simulation, obtention prêt)
// ─────────────────────────────────────────────────────────────────────────────

const courtiers_credit: ActeurImmobilier[] = [
  {
    // Source: pretto.fr — WebFetch 2026-05
    nom: "Pretto",
    categorie: "courtier_credit",
    description:
      "Courtier immobilier 100% en ligne, accompagne les emprunteurs pour trouver le meilleur taux parmi 125 banques partenaires avec un expert dédié.",
    site_web: "https://www.pretto.fr",
    logo_url:
      "https://res.cloudinary.com/pretto-fr/image/upload/c_limit,w_1920,f_auto,q_auto,fl_progressive/v1773332309/website/page/home/photoHomeCharlotte.jpg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Simulation de prêt en ligne",
      "Comparaison 125 banques",
      "Expert dédié",
      "Suivi dossier",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: meilleurtaux.com — WebFetch 2026-05
    nom: "Meilleurtaux",
    categorie: "courtier_credit",
    description:
      "Courtier expert en prêt immobilier, rachat de crédit et assurance emprunteur depuis 1999, avec 350+ agences physiques et 125 banques partenaires.",
    site_web: "https://www.meilleurtaux.com",
    logo_url: "https://www.meilleurtaux.com/images_html/new-logo-mtx.svg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3, 4],
    services_cles: [
      "Comparaison taux",
      "Rachat de crédit",
      "Assurance emprunteur",
      "Réseau agences",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: cafpi.fr — WebFetch 2026-05
    nom: "CAFPI",
    categorie: "courtier_credit",
    description:
      "Courtier en prêt immobilier et rachat de crédit avec un réseau de 1 060 courtiers et plus de 100 banques partenaires en France.",
    site_web: "https://www.cafpi.fr",
    logo_url: "https://www.cafpi.fr/build/website/sources/images/logo/cafpi.ae727dc4.svg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Négociation taux",
      "1 060 courtiers",
      "Rachat crédit",
      "Accompagnement personnalisé",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: empruntis.com — WebFetch 2026-05
    nom: "Empruntis",
    categorie: "courtier_credit",
    description:
      "Courtier immobilier en ligne permettant de comparer les offres de crédit parmi 100 banques pour trouver rapidement le meilleur taux.",
    site_web: "https://www.empruntis.com",
    logo_url: "https://www.empruntis.com/imgs/empruntis-25.svg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Comparaison 100 banques",
      "Simulation rapide",
      "Crédit immobilier",
      "Assurance emprunteur",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: ymanci.fr — WebFetch 2026-05
    nom: "Ymanci",
    categorie: "courtier_credit",
    description:
      "Courtier en rachat de crédits, prêt immobilier et assurance emprunteur avec 500+ experts et 135 agences en France, fort de 26 ans d'expérience.",
    site_web: "https://www.ymanci.fr",
    logo_url: "https://ymanci.fr/wp-content/uploads/2022/07/Ymanci_Logo_v2.svg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3, 4],
    services_cles: [
      "Rachat de crédits",
      "Prêt immobilier",
      "Assurance emprunteur",
      "135 agences",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: boursobank.com — WebFetch 2026-05
    nom: "BoursoBank",
    categorie: "courtier_credit",
    description:
      "Banque en ligne la moins chère depuis 18 ans, proposant un crédit immobilier 100% en ligne avec réponse de principe immédiate.",
    site_web: "https://www.boursobank.com",
    logo_url: "https://www.boursobank.com/build/img/favicons/boursobank/favicon-32x32.7ffb3afa70276c434b273e5c4d191313.png",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Crédit immobilier 100% en ligne",
      "Réponse immédiate",
      "Banque moins chère",
      "Simulation en ligne",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: vousfinancer.com — WebFetch 2026-05 — AJOUT
    nom: "Vousfinancer",
    categorie: "courtier_credit",
    description:
      "Réseau de courtiers en crédit immobilier, rachat de crédits et assurance emprunteur, élu meilleur réseau de courtage 5 ans consécutifs par Capital (2022-2026), 150 agences, 92 banques partenaires.",
    site_web: "https://www.vousfinancer.com",
    logo_url: "https://www.vousfinancer.com/assets/img/frontend/logo-colored.png",
    couverture: "nationale",
    etapes_pertinentes: [2, 3, 4],
    services_cles: [
      "Prêt immobilier",
      "Rachat de crédits",
      "Assurance emprunteur",
      "150 agences / 92 banques",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: hellopret.fr — WebFetch 2026-05 — AJOUT
    nom: "HelloPrêt",
    categorie: "courtier_credit",
    description:
      "Courtier immobilier digital fondé en 2018, noté 4,9/5 sur plus de 1 900 avis clients, accompagne les emprunteurs de la simulation jusqu'à la signature notaire.",
    site_web: "https://www.hellopret.fr",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Simulation prêt immobilier",
      "Négociation taux",
      "Assurance emprunteur",
      "Accompagnement 100% digital",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BANQUES (étapes 2-3 : financement, obtention prêt immobilier)
// ─────────────────────────────────────────────────────────────────────────────

const banques: ActeurImmobilier[] = [
  {
    // Source: credit-agricole.fr — WebFetch 2026-05
    nom: "Crédit Agricole",
    categorie: "banque",
    description:
      "Banque coopérative de référence proposant des services bancaires et d'assurance intégrés, ancrée dans les territoires français.",
    site_web: "https://www.credit-agricole.fr",
    logo_url: "https://www.credit-agricole.fr/content/dam/assetsca/master/public/commun/images/autre/images/NPC-logo_Agir_chaque_jour_CA_H_Desktop-1.svg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Prêt immobilier",
      "Simulation en ligne",
      "Assurance emprunteur",
      "Conseiller dédié",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: mabanque.bnpparibas (403) — données connues
    nom: "BNP Paribas",
    categorie: "banque",
    description:
      "Grande banque universelle française offrant des prêts immobiliers, assurances et services bancaires à travers un vaste réseau d'agences.",
    site_web: "https://mabanque.bnpparibas",
    logo_url: "https://group.bnpparibas/uploads/2020/10/logo-bnp-paribas-1.svg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Crédit immobilier",
      "Prêt relais",
      "Assurance habitation",
      "Gestion de patrimoine",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: particuliers.sg.fr — WebFetch 2026-05
    nom: "SG (Société Générale)",
    categorie: "banque",
    description:
      "Banque de détail ancrée dans 11 régions françaises, combinant expertise financière et application mobile haut de gamme pour tous les projets immobiliers.",
    site_web: "https://particuliers.sg.fr",
    logo_url:
      "https://banque.sg.fr/typo3conf/ext/bi_template/Resources/Public/Images/nvbq/nvbq_logo_main.png",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Prêt immobilier",
      "Assurance emprunteur",
      "Application mobile",
      "Conseiller régional",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: lcl.fr — WebFetch 2026-05
    nom: "LCL",
    categorie: "banque",
    description:
      "Banque et assurance pour les particuliers proposant une offre complète de crédit immobilier, d'épargne et de services bancaires.",
    site_web: "https://www.lcl.fr",
    logo_url: "https://www.lcl.fr/assets/images/logo-lcl.svg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Crédit immobilier",
      "Simulation prêt",
      "Assurance habitation",
      "Gestion en ligne",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: boursobank.com — classée aussi en banque
    nom: "Boursorama Banque",
    categorie: "banque",
    description:
      "Banque en ligne 100% digitale, la moins chère de France depuis 18 ans, avec crédit immobilier en ligne et réponse immédiate.",
    site_web: "https://www.boursobank.com",
    logo_url: "https://www.boursobank.com/build/img/favicons/boursobank/favicon-32x32.7ffb3afa70276c434b273e5c4d191313.png",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Compte bancaire gratuit",
      "Crédit immobilier en ligne",
      "Livret d'épargne",
      "Bourse",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: cic.fr — WebFetch 2026-05
    nom: "CIC",
    categorie: "banque",
    description:
      "Banque de proximité responsable avec des conseillers non commissionnés, banquier d'une PME sur trois en France.",
    site_web: "https://www.cic.fr",
    logo_url: "https://cdnii.e-i.com/INGR/sd/cic_2023/7.122.4/fr/images/css/env/logo.svg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Prêt immobilier",
      "Conseillers dédiés",
      "Développement durable",
      "Services professionnels",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: banquepopulaire.fr — WebFetch 2026-05
    nom: "Banque Populaire",
    categorie: "banque",
    description:
      "Banque coopérative régionale avec 3 300 agences en France proposant comptes, prêts immobiliers et assurances avec un fort ancrage territorial.",
    site_web: "https://www.banquepopulaire.fr",
    logo_url:
      "https://bp-prod.cloudimg.io/_images_/app/uploads/sites/5/2022/03/01155728/cc-lancement-site-national-particuliers.jpg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Prêt immobilier",
      "3 300 agences",
      "Simulateurs en ligne",
      "Épargne",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: caisse-epargne.fr — WebFetch 2026-05
    nom: "Caisse d'Épargne",
    categorie: "banque",
    description:
      "Banque mutualiste proposant des services bancaires et d'assurance adaptés aux besoins des particuliers avec une relation de confiance et de proximité.",
    site_web: "https://www.caisse-epargne.fr",
    logo_url:
      "https://ce-prod.cloudimg.io/_images_/app/uploads/sites/3/2020/12/14143618/home-particulier-960x580-1.jpg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Prêt immobilier",
      "Livret A",
      "Assurance habitation",
      "Réseau agences",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: ccf.fr — HSBC France retail banking vendu à CCF (My Money Group) au 01/01/2024
    nom: "CCF (ex-HSBC France)",
    categorie: "banque",
    description:
      "Banque née en janvier 2024 du rachat de la banque de détail HSBC France par My Money Group, proposant prêts immobiliers et services bancaires aux particuliers.",
    site_web: "https://www.ccf.fr",
    logo_url: "https://www.ccf.fr/sites/default/files/logo_ccf.svg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Prêt immobilier",
      "Compte courant",
      "Épargne",
      "Anciens clients HSBC",
    ],
    gratuit: false,
    partenaire_potentiel: false,
  },
  {
    // Source: fortuneo.fr — connu, banque en ligne avec prêt immo
    nom: "Fortuneo",
    categorie: "banque",
    description:
      "Banque en ligne filiale du Crédit Mutuel Arkéa, proposant des comptes, livrets, bourse et crédit immobilier à des tarifs compétitifs.",
    site_web: "https://www.fortuneo.fr",
    logo_url: "https://www.fortuneo.fr/img/logos/fortuneo-logo.svg",
    couverture: "nationale",
    etapes_pertinentes: [2, 3],
    services_cles: [
      "Banque en ligne",
      "Crédit immobilier",
      "Bourse",
      "Livret épargne",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ASSURANCE EMPRUNTEUR (étapes 3-4 : obtention prêt, signature)
// ─────────────────────────────────────────────────────────────────────────────

const assurance_emprunteur: ActeurImmobilier[] = [
  {
    // Source: cardif.fr — WebFetch 2026-05
    nom: "Cardif (BNP Paribas)",
    categorie: "assurance_emprunteur",
    description:
      "Filiale assurance de BNP Paribas proposant l'assurance de prêt, épargne et prévoyance, avec jusqu'à 10 000€ d'économies sur l'assurance emprunteur.",
    site_web: "https://www.cardif.fr",
    logo_url: "https://www.cardif.fr/documents/9413226/9414821/cardif-logo.svg",
    couverture: "nationale",
    etapes_pertinentes: [3, 4],
    services_cles: [
      "Assurance emprunteur",
      "Épargne",
      "Prévoyance",
      "Assurance habitation",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: april.fr — WebFetch 2026-05
    nom: "April",
    categorie: "assurance_emprunteur",
    description:
      "Assureur proposant une gamme complète incluant l'assurance emprunteur, avec un processus de souscription simplifié et digitalisé.",
    site_web: "https://www.april.fr",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [3, 4],
    services_cles: [
      "Assurance emprunteur",
      "Délégation d'assurance",
      "Souscription en ligne",
      "Prévoyance",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: generali.fr — WebFetch 2026-05
    nom: "Generali",
    categorie: "assurance_emprunteur",
    description:
      "Assureur international proposant assurance emprunteur, habitation, auto et santé avec devis express en ligne.",
    site_web: "https://www.generali.fr",
    logo_url: "https://generalifrance.generali.fr/logos/generali-logo.jpg",
    couverture: "nationale",
    etapes_pertinentes: [3, 4, 6],
    services_cles: [
      "Assurance emprunteur",
      "Assurance habitation",
      "Devis en ligne",
      "Espace client",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: cnp.fr — WebSearch + WebFetch 2026-05
    nom: "CNP Assurances",
    categorie: "assurance_emprunteur",
    description:
      "Premier assureur français de personnes servant 33+ millions d'assurés via 350 distributeurs, spécialiste de l'assurance emprunteur adossée aux banques.",
    site_web: "https://www.cnp.fr",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [3, 4],
    services_cles: [
      "Assurance emprunteur",
      "Décès / PTIA",
      "ITT / IPP",
      "Droit à l'oubli cancer",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: suravenir.fr — WebFetch 2026-05
    nom: "Suravenir",
    categorie: "assurance_emprunteur",
    description:
      "Filiale de Crédit Mutuel Arkéa, spécialiste assurance-vie, retraite et assurance emprunteur pour 3+ millions de clients en France.",
    site_web: "https://www.suravenir.fr",
    logo_url: "https://www.suravenir.fr/wp-content/uploads/2021/02/Hero_HP.jpg",
    couverture: "nationale",
    etapes_pertinentes: [3, 4],
    services_cles: [
      "Assurance emprunteur",
      "Assurance-vie",
      "Retraite",
      "Finance durable",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: axa.fr — WebFetch 2026-05
    nom: "AXA",
    categorie: "assurance_emprunteur",
    description:
      "Premier réseau d'assurance en France avec 8 300 conseillers, proposant assurance emprunteur, habitation, auto et santé.",
    site_web: "https://www.axa.fr",
    logo_url:
      "https://axa.scene7.com/is/image/axafrance/img-hero-rugby-feminin-axa?wid=2000&hei=420&fit=crop&fmt=jpg&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0",
    couverture: "nationale",
    etapes_pertinentes: [3, 4, 6],
    services_cles: [
      "Assurance emprunteur",
      "8 300 conseillers",
      "3 000 agences",
      "Assurance habitation",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ASSURANCE MRH (étape 6 : entrée dans les lieux)
// ─────────────────────────────────────────────────────────────────────────────

const assurance_mrh: ActeurImmobilier[] = [
  {
    // Source: maif.fr — WebFetch 2026-05
    nom: "MAIF",
    categorie: "assurance_mrh",
    description:
      "Société d'assurance mutuelle proposant des assurances habitation, auto et santé pour particuliers, professionnels et associations, avec un service client reconnu.",
    site_web: "https://www.maif.fr",
    logo_url: "https://www.maif.fr/content/documents/public/maif-fr/images-reseaux/logo-maif-reseaux-sociaux.png",
    couverture: "nationale",
    etapes_pertinentes: [6, 7],
    services_cles: [
      "Assurance habitation",
      "Propriétaire bailleur",
      "Loyers impayés",
      "Assurance jeunes",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: fr.luko.eu — WebFetch 2026-05
    nom: "Luko (Allianz Direct)",
    categorie: "assurance_mrh",
    description:
      "Assurance habitation 100% en ligne (Allianz Direct), souscription en 2 minutes avec des contrats clairs et flexibles dès 5,41€/mois.",
    site_web: "https://fr.luko.eu",
    logo_url: "https://www.fr.luko.eu/dam/images/component-images/main-teaser-home/homepage@M-v2.jpg",
    couverture: "nationale",
    etapes_pertinentes: [6],
    services_cles: [
      "Habitation en ligne",
      "Souscription 2 min",
      "Résiliation flexible",
      "Gestion application",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: matmut.fr — timeout, données connues
    nom: "Matmut",
    categorie: "assurance_mrh",
    description:
      "Mutuelle d'assurance proposant habitation, auto et santé avec un modèle sans intermédiaire et des prix compétitifs pour les particuliers.",
    site_web: "https://www.matmut.fr",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [6, 7],
    services_cles: [
      "Assurance habitation",
      "Devis en ligne",
      "Sans intermédiaire",
      "Assistance 24h/24",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: macif.fr — 403, données connues
    nom: "MACIF",
    categorie: "assurance_mrh",
    description:
      "Mutuelle d'assurance coopérative offrant des solutions habitation, auto et prévoyance pour les particuliers à travers toute la France.",
    site_web: "https://www.macif.fr",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [6, 7],
    services_cles: [
      "Assurance habitation",
      "Multirisque habitation",
      "Assistance dépannage",
      "Tarifs mutualistes",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: axa.fr (MRH)
    nom: "AXA Habitation",
    categorie: "assurance_mrh",
    description:
      "Offre MRH du premier réseau d'assurance français, avec devis express en ligne et 3 000 agences pour un accompagnement personnalisé.",
    site_web: "https://www.axa.fr/assurance-habitation.html",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [6],
    services_cles: [
      "Multirisque habitation",
      "Devis express",
      "Garantie dommages",
      "Responsabilité civile",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: groupama.fr — WebFetch 2026-05
    nom: "Groupama",
    categorie: "assurance_mrh",
    description:
      "Assureur coopératif proposant habitation, auto et santé pour particuliers et professionnels avec un fort maillage territorial en France.",
    site_web: "https://www.groupama.fr",
    logo_url: "https://www.groupama.fr/logo.png",
    couverture: "nationale",
    etapes_pertinentes: [6, 7],
    services_cles: [
      "Assurance habitation",
      "Couverture locataire/propriétaire",
      "Assistance",
      "Réseau agences",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PORTAILS D'ANNONCES (étapes 1-2 : recherche bien, négociation)
// ─────────────────────────────────────────────────────────────────────────────

const portails_annonces: ActeurImmobilier[] = [
  {
    // Source: seloger.com — WebSearch 2026-05 (403 direct) — CDN URL via urlscan
    nom: "SeLoger",
    categorie: "portail_annonces",
    description:
      "N°1 des portails 100% immobiliers en France, avec des milliers d'annonces de vente et location mises à jour en temps réel.",
    site_web: "https://www.seloger.com",
    logo_url: "https://static-seloger.com/z/produits/sl/homepage/assets/img/bandeau_app/sl_logo_152x152_thumb.png",
    couverture: "nationale",
    etapes_pertinentes: [1, 2],
    services_cles: [
      "Annonces vente/location",
      "Alertes email",
      "Estimation en ligne",
      "Prix au m²",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: leboncoin.fr — WebSearch 2026-05 (403 direct)
    nom: "Leboncoin Immobilier",
    categorie: "portail_annonces",
    description:
      "Premier site d'annonces généraliste en France avec une section immobilière majeure, consulté par 29,5 millions d'utilisateurs mensuels.",
    site_web: "https://www.leboncoin.fr/c/_immobilier_",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [1, 2],
    services_cles: [
      "Annonces particuliers et pros",
      "Alertes",
      "Carte interactive",
      "Vente/location",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: bienici.com — WebFetch 2026-05
    nom: "Bien'ici",
    categorie: "portail_annonces",
    description:
      "Portail immobilier proposant toutes les annonces dans le neuf et l'ancien avec une visualisation cartographique avancée.",
    site_web: "https://www.bienici.com",
    logo_url: "https://res.bienici.com/cacheForever/e683b1f37d62436185b0a66779d52725d0b1c6a5/logos/logo_bienici.svg",
    couverture: "nationale",
    etapes_pertinentes: [1, 2],
    services_cles: [
      "Neuf et ancien",
      "Carte interactive",
      "Alertes personnalisées",
      "Visites virtuelles",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: pap.fr — WebSearch 2026-05 (403 direct)
    nom: "PAP (Particulier à Particulier)",
    categorie: "portail_annonces",
    description:
      "Site immobilier exclusivement entre particuliers, refusant les annonces professionnelles, avec outils d'estimation et de gestion de transaction.",
    site_web: "https://www.pap.fr",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [1, 2],
    services_cles: [
      "Annonces particuliers uniquement",
      "Estimation en ligne",
      "Visite virtuelle",
      "Gestion autonome",
    ],
    gratuit: true,
    partenaire_potentiel: false,
  },
  {
    // Source: logic-immo.com — WebSearch 2026-05 (403 direct)
    nom: "Logic-Immo",
    categorie: "portail_annonces",
    description:
      "Portail immobilier national avec 1 million d'annonces d'agences, 8,5 millions de visiteurs mensuels et 34 éditions locales gratuites.",
    site_web: "https://www.logic-immo.com",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [1, 2],
    services_cles: [
      "Annonces agences",
      "Alertes email",
      "Magazine local gratuit",
      "Neuf/ancien",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: meilleursagents.com — WebSearch 2026-05 (403 direct)
    nom: "MeilleursAgents",
    categorie: "portail_annonces",
    description:
      "Portail immobilier et outil d'estimation de référence, filiale SeLoger, basé sur les prix réels de 12 000 agences partenaires et le DVF.",
    site_web: "https://www.meilleursagents.com",
    logo_url: "https://www.meilleursagents.com/static/img/logo-meilleursagents.svg",
    couverture: "nationale",
    etapes_pertinentes: [1, 2, 8],
    services_cles: [
      "Annonces vente/location",
      "Prix au m²",
      "Estimation gratuite",
      "Baromètre marché",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: jinka.fr — WebFetch 2026-05
    nom: "Jinka",
    categorie: "portail_annonces",
    description:
      "Application mobile agrégeant les annonces de 5 000+ sites immobiliers avec alertes en temps réel et détection de fraudes intégrée.",
    site_web: "https://www.jinka.fr",
    logo_url:
      "https://res.cloudinary.com/loueragile/image/upload/v1653311807/web/jinka/Logo-Jinka-a.svg",
    couverture: "nationale",
    etapes_pertinentes: [1],
    services_cles: [
      "Agrégation 5 000 sites",
      "Alertes temps réel",
      "Détection fraudes",
      "Application mobile",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RÉSEAUX D'AGENCES (étapes 1-2-5 : recherche, négociation, compromis)
// ─────────────────────────────────────────────────────────────────────────────

const reseaux_agences: ActeurImmobilier[] = [
  {
    // Source: century21.fr — WebFetch 2026-05
    nom: "CENTURY 21",
    categorie: "reseau_agences",
    description:
      "N°1 mondial des réseaux immobiliers avec 960 agences en France, récompensé 7 ans consécutifs pour sa relation client.",
    site_web: "https://www.century21.fr",
    logo_url: "https://century21.fr/theme/v6/images/sn-home-header/century21_logo_marque_year.png",
    couverture: "nationale",
    etapes_pertinentes: [1, 2, 5],
    services_cles: [
      "Achat/vente",
      "Location",
      "Gestion locative",
      "960 agences",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: orpi.com — WebFetch 2026-05
    nom: "Orpi",
    categorie: "reseau_agences",
    description:
      "Premier réseau coopératif immobilier en France avec 1 250 agences proposant achat, vente, location et gestion locative.",
    site_web: "https://www.orpi.com",
    logo_url:
      "https://cutjhqvjma.cloudimg.io/_prod_/orpibackend/6dc3d_Visuel+HP+%C3%A9t%C3%A9+2025.png",
    couverture: "nationale",
    etapes_pertinentes: [1, 2, 5],
    services_cles: [
      "Achat/vente/location",
      "1 250 agences coopératives",
      "Gestion locative",
      "Annonces exclusives",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: laforet.com — WebFetch 2026-05
    nom: "Laforêt",
    categorie: "reseau_agences",
    description:
      "Réseau de 720+ agences immobilières avec 34 ans d'expertise et 92% de satisfaction client, proposant achat, vente et location.",
    site_web: "https://www.laforet.com",
    logo_url: "https://www.laforet.com/images/logo-laforet.svg",
    couverture: "nationale",
    etapes_pertinentes: [1, 2, 5],
    services_cles: [
      "Achat/vente",
      "Location",
      "720 agences",
      "92% satisfaction client",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: iadfrance.fr — WebFetch 2026-05
    nom: "iad France",
    categorie: "reseau_agences",
    description:
      "Réseau de 15 000 conseillers indépendants couvrant 100% des régions françaises, noté 4,9/5 par 243 000+ clients.",
    site_web: "https://www.iadfrance.fr",
    logo_url: "https://www.iadfrance.fr/_nuxt/logo-iad-dense-fr.DgCCzZg-.svg",
    couverture: "nationale",
    etapes_pertinentes: [1, 2, 5],
    services_cles: [
      "15 000 conseillers",
      "Mandataires indépendants",
      "Estimation gratuite",
      "100% régions",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: stephaneplazaimmobilier.com — WebSearch 2026-05 (403 direct)
    nom: "Stéphane Plaza Immobilier",
    categorie: "reseau_agences",
    description:
      "Réseau de 600+ agences fondé en 2015, reconnu pour son approche centrée sur l'humain, le home staging et les visites digitales.",
    site_web: "https://www.stephaneplazaimmobilier.com",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [1, 2, 5],
    services_cles: [
      "Achat/vente/location",
      "Home staging",
      "Visites digitales",
      "600 agences",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: eraimmobilier.com — WebFetch 2026-05
    nom: "ERA Immobilier",
    categorie: "reseau_agences",
    description:
      "Réseau international d'agences immobilières présent en France avec certifications et engagements qualité pour achat, vente et location.",
    site_web: "https://www.eraimmobilier.com",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [1, 2, 5],
    services_cles: [
      "Achat/vente/location",
      "Certifications qualité",
      "Réseau international",
      "Garanties transaction",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: guy-hoquet.com — WebFetch 2026-05
    nom: "Guy Hoquet",
    categorie: "reseau_agences",
    description:
      "3e réseau franchisé immobilier en France, proposant l'immobilier garanti pour achat, vente, location, investissement et gestion.",
    site_web: "https://www.guy-hoquet.com",
    logo_url: "https://www.guy-hoquet.com/frontoffice/img/logo.svg",
    couverture: "nationale",
    etapes_pertinentes: [1, 2, 5],
    services_cles: [
      "Immobilier garanti",
      "Achat/vente/location",
      "Investissement",
      "Gestion locative",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NOTAIRES (étapes 4-5 : compromis, acte de vente)
// ─────────────────────────────────────────────────────────────────────────────

const notaires: ActeurImmobilier[] = [
  {
    // Source: notaires.fr — WebFetch 2026-05
    nom: "Notaires de France",
    categorie: "notaire",
    description:
      "Site officiel des notaires français offrant outils de recherche de notaire, calcul de frais d'acte, simulation de prêt et conseils juridiques.",
    site_web: "https://www.notaires.fr",
    logo_url: "https://www.notaires.fr/themes/custom/not/assets/img/logos/logo.svg",
    couverture: "nationale",
    etapes_pertinentes: [4, 5],
    services_cles: [
      "Annuaire notaires",
      "Calcul frais de notaire",
      "Conseils succession",
      "Vente interactive",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: immobilier.notaires.fr — WebFetch 2026-05
    nom: "Immobilier.notaires.fr",
    categorie: "notaire",
    description:
      "Portail immobilier notarial combinant annonces exclusives de notaires, simulation de prêt, expertise de prix et ventes interactives.",
    site_web: "https://www.immobilier.notaires.fr",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [1, 4, 5, 8],
    services_cles: [
      "Annonces notariales",
      "Ventes aux enchères",
      "Expertise de prix",
      "Simulation achat",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: notaviz.com — cert error, données connues
    nom: "Notaviz",
    categorie: "notaire",
    description:
      "Plateforme digitale permettant de signer des actes notariés à distance (acte authentique électronique à distance — AEAD) avec un notaire en visio.",
    site_web: "https://www.notaviz.com",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [5],
    services_cles: [
      "Signature électronique à distance",
      "Visioconférence notariale",
      "AEAD",
      "Dématérialisation",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DIAGNOSTIQUEURS (étape 3-4 : avant compromis / avant vente)
// ─────────────────────────────────────────────────────────────────────────────

const diagnostiqueurs: ActeurImmobilier[] = [
  {
    // Source: allodiagnostic.com — WebFetch 2026-05
    nom: "Allodiagnostic",
    categorie: "diagnostiqueur",
    description:
      "1ère place de marché du diagnostic immobilier en France, proposant tous les diagnostics obligatoires (DPE, amiante, plomb, gaz…) à prix compétitifs.",
    site_web: "https://www.allodiagnostic.com",
    logo_url: "https://media.allodiagnostic.com/media/img/www/home/logo_allodiagnostic.png",
    couverture: "nationale",
    etapes_pertinentes: [3, 4],
    services_cles: [
      "DPE",
      "Amiante / Plomb",
      "Électricité / Gaz",
      "Pack diagnostics vente",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: diagamter.com — WebFetch 2026-05
    nom: "Diagamter",
    categorie: "diagnostiqueur",
    description:
      "Réseau de 180+ agences certifiées avec 97,7% de satisfaction client et 100 000 clients par an pour tous diagnostics immobiliers vente et location.",
    site_web: "https://www.diagamter.com",
    logo_url: "https://www.diagamter.com/img/logo.png",
    couverture: "nationale",
    etapes_pertinentes: [3, 4],
    services_cles: [
      "DPE certifié",
      "180 agences",
      "Diagnostics vente/location",
      "Rapport rapide",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: agenda-diagnostics.fr — WebFetch 2026-05
    nom: "Agenda Diagnostics",
    categorie: "diagnostiqueur",
    description:
      "Spécialiste des diagnostics immobiliers DPE, gaz, électricité, amiante et plomb avec prise de rendez-vous en ligne.",
    site_web: "https://www.agenda-diagnostics.fr",
    logo_url:
      "https://agenda-diagnostics.fr/wp-content/uploads/2022/04/cropped-61b35f1e620000db129f27d0.png",
    couverture: "nationale",
    etapes_pertinentes: [3, 4],
    services_cles: [
      "DPE",
      "Diagnostics réglementaires",
      "RDV en ligne",
      "Rapport certifié",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: ac-environnement.com — WebFetch 2026-05
    nom: "AC Environnement",
    categorie: "diagnostiqueur",
    description:
      "Leader du diagnostic immobilier et environnemental, référence nationale pour sécuriser les biens, protéger la santé et agir durablement.",
    site_web: "https://www.ac-environnement.com",
    logo_url:
      "https://www.ac-environnement.com/wp-content/uploads/2025/05/diagnostic-immobilier-et-environnemental.webp",
    couverture: "nationale",
    etapes_pertinentes: [3, 4],
    services_cles: [
      "Diagnostic immobilier",
      "Diagnostic environnemental",
      "Audit énergétique",
      "Expertise technique",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COURTIERS EN ASSURANCE (étapes 3-4-6 : changement assurance emprunteur)
// ─────────────────────────────────────────────────────────────────────────────

const courtiers_assurance: ActeurImmobilier[] = [
  {
    // Source: magnolia.fr — WebFetch 2026-05
    nom: "Magnolia.fr",
    categorie: "courtier_assurance",
    description:
      "Comparateur indépendant d'assurance de prêt immobilier permettant d'économiser jusqu'à 15 000€ en comparant 28+ assureurs (AXA, Swiss Life, Generali…).",
    site_web: "https://www.magnolia.fr",
    logo_url: "https://magnolia.fr/images/logos/logo-magnolia.svg",
    couverture: "nationale",
    etapes_pertinentes: [3, 4],
    services_cles: [
      "Comparaison 28 assureurs",
      "Délégation d'assurance",
      "Changement assurance (loi Lemoine)",
      "Économie jusqu'à 15 000€",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: wedou.fr — WebFetch 2026-05
    nom: "Wedou",
    categorie: "courtier_assurance",
    description:
      "Courtier digital en assurance emprunteur permettant de changer d'assurance de prêt en 5 minutes avec jusqu'à 50% d'économies.",
    site_web: "https://www.wedou.fr",
    logo_url: "https://cdn.prod.website-files.com/5a8d6cbc1a5b5000018f02f4/627e3ff81d599fc3efe64353_Logo-size.svg",
    couverture: "nationale",
    etapes_pertinentes: [3, 4],
    services_cles: [
      "Changement assurance en ligne",
      "50% économies",
      "Gestion administrative",
      "5 minutes de démarches",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: assurly.com — WebSearch + WebFetch 2026-05
    nom: "Assurly",
    categorie: "courtier_assurance",
    description:
      "Insurtech française spécialisée en assurance emprunteur 100% en ligne et rapide, fondée en 2017, avec taux entre 0,1% et 0,6% du capital.",
    site_web: "https://www.assurly.com",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [3, 4],
    services_cles: [
      "Assurance emprunteur digitale",
      "Souscription 100% en ligne",
      "Taux compétitifs",
      "Loi Lemoine",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: reassurez-moi.fr — WebFetch 2026-05
    nom: "Réassurez-moi",
    categorie: "courtier_assurance",
    description:
      "N°1 du courtage d'assurance en ligne en France (15M visites/an) : comparateur sans frais ni commission pour emprunteur, santé, prévoyance.",
    site_web: "https://reassurez-moi.fr",
    logo_url: "https://reassurez-moi.fr/_next/static/media/logo-reassurez-moi.1fa69a9c.png",
    couverture: "nationale",
    etapes_pertinentes: [3, 4, 6],
    services_cles: [
      "Comparateur assurance emprunteur",
      "Sans commission",
      "Santé / Prévoyance",
      "15M visiteurs/an",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: jechange.fr — WebFetch 2026-05
    nom: "JeChange",
    categorie: "courtier_assurance",
    description:
      "Comparateur gratuit multi-services (assurance, énergie, télécom, banque) permettant jusqu'à 15 000€ d'économies par an avec un expert personnel.",
    site_web: "https://www.jechange.fr",
    logo_url: "https://www.jechange.fr/sites/jechange.fr/files/logo_jechange.svg",
    couverture: "nationale",
    etapes_pertinentes: [3, 4, 6],
    services_cles: [
      "Comparateur multi-produits",
      "Assurance emprunteur",
      "Énergie / Télécom",
      "Accompagnement expert",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DÉMÉNAGEMENT (étapes 6-7 : entrée dans les lieux, post-achat)
// ─────────────────────────────────────────────────────────────────────────────

const demenagement: ActeurImmobilier[] = [
  {
    // Source: papernest.com — WebFetch 2026-05
    nom: "Papernest",
    categorie: "demenagement",
    description:
      "Plateforme centralisant la gestion de tous les contrats et abonnements (énergie, internet, assurance…) pour simplifier l'emménagement, gratuitement.",
    site_web: "https://www.papernest.com",
    logo_url:
      "https://d11o8pt3cttu38.cloudfront.net/wp-content/uploads/sites/12/2025/11/tous-vos-contrats-et-abonnements-.png",
    couverture: "nationale",
    etapes_pertinentes: [6, 7],
    services_cles: [
      "Transfert contrats énergie/internet",
      "Résiliation abonnements",
      "Souscription assurance",
      "Gestion administrative",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: demenageurs-bretons.fr — WebFetch 2026-05
    nom: "Les Déménageurs Bretons",
    categorie: "demenagement",
    description:
      "Société de déménagement avec 50+ ans d'expérience et un réseau de 150+ agences en France pour déménagements particuliers et professionnels.",
    site_web: "https://www.demenageurs-bretons.fr",
    logo_url: "https://www.demenageurs-bretons.fr/appicons/logo.png",
    couverture: "nationale",
    etapes_pertinentes: [6],
    services_cles: [
      "Déménagement particulier",
      "Déménagement professionnel",
      "150 agences France",
      "International",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: nextories.com — WebFetch 2026-05
    nom: "Nextories",
    categorie: "demenagement",
    description:
      "Plateforme de comparaison de déménageurs professionnels offrant un service gratuit, transparent et sans frais cachés avec garantie prix.",
    site_web: "https://www.nextories.com",
    logo_url: "https://cdn.nextories.com/static/img/logo-nextories.png",
    couverture: "nationale",
    etapes_pertinentes: [6],
    services_cles: [
      "Comparaison déménageurs",
      "Devis gratuit",
      "Garantie prix",
      "Transfert de contrats",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: demeco.fr — WebFetch 2026-05
    nom: "Demeco",
    categorie: "demenagement",
    description:
      "Leader français du déménagement depuis 1965 avec 60 ans d'expérience, offrant des formules flexibles et un réseau national certifié.",
    site_web: "https://www.demeco.fr",
    logo_url: "https://www.demeco.fr/themes/custom/demeco_theme/logo.svg",
    couverture: "nationale",
    etapes_pertinentes: [6],
    services_cles: [
      "Déménagement toutes formules",
      "60 ans d'expérience",
      "Réseau national",
      "Certification qualité",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RÉNOVATION (étapes 7-8 : post-achat, travaux)
// ─────────────────────────────────────────────────────────────────────────────

const renovation: ActeurImmobilier[] = [
  {
    // Source: france-renov.gouv.fr — WebFetch 2026-05
    nom: "France Rénov'",
    categorie: "renovation",
    description:
      "Service public gratuit de rénovation de l'habitat offrant un accompagnement personnalisé et indépendant pour accéder aux aides (MaPrimeRénov').",
    site_web: "https://france-renov.gouv.fr",
    logo_url: "https://www.france-renov.gouv.fr/themes/custom/france_renov/img/logo-france-renov.svg",
    couverture: "nationale",
    etapes_pertinentes: [7, 8],
    services_cles: [
      "Conseils gratuits",
      "MaPrimeRénov'",
      "Audit énergétique",
      "Subventions travaux",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: helloartisan.com — WebFetch 2026-05
    nom: "HelloArtisan",
    categorie: "renovation",
    description:
      "Plateforme mettant en relation avec des artisans de confiance pour des devis gratuits et sans engagement sur tous types de travaux.",
    site_web: "https://www.helloartisan.com",
    logo_url: "https://helloartisan.com/img/static/logo/logo-helloartisan-square.png",
    couverture: "nationale",
    etapes_pertinentes: [7, 8],
    services_cles: [
      "Mise en relation artisans",
      "Devis gratuits",
      "Artisans vérifiés",
      "Tous corps d'état",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: quotatis.fr — WebFetch 2026-05
    nom: "Quotatis",
    categorie: "renovation",
    description:
      "Plateforme de devis travaux facilitant la mise en relation avec des professionnels qualifiés grâce à des forfaits de pose clairs.",
    site_web: "https://www.quotatis.fr",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [7, 8],
    services_cles: [
      "Devis travaux",
      "Forfaits pose",
      "Pros qualifiés",
      "Comparaison devis",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: izi-by-edf.fr — WebFetch + WebSearch 2026-05
    nom: "IZI by EDF",
    categorie: "renovation",
    description:
      "Service d'EDF pour la rénovation énergétique et l'installation de bornes de recharge, avec devis clair, artisans qualifiés et accès aux aides d'État.",
    site_web: "https://izi-by-edf.fr",
    logo_url: "https://izi-by-edf.fr/theme/website/assets/images/icon-svg/logo.svg",
    couverture: "nationale",
    etapes_pertinentes: [7, 8],
    services_cles: [
      "Isolation / Chauffage",
      "Pompe à chaleur",
      "Borne IRVE",
      "Aides financières",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
  {
    // Source: particulier.hellio.com — WebFetch 2026-05
    nom: "Hellio",
    categorie: "renovation",
    description:
      "Partenaire en maîtrise de l'énergie depuis 2008, proposant une rénovation complète avec artisans RGE et jusqu'à 90% d'aides financières.",
    site_web: "https://particulier.hellio.com",
    logo_url: "https://particulier.hellio.com/hubfs/Hellio%20Corporate%20Site%202020/Images/Logo-Hellio.svg",
    couverture: "nationale",
    etapes_pertinentes: [7, 8],
    services_cles: [
      "Isolation thermique",
      "Pompe à chaleur",
      "Panneaux solaires",
      "Aides CEE / MaPrimeRénov'",
    ],
    gratuit: false,
    partenaire_potentiel: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ESTIMATION IMMOBILIÈRE (étapes 1-2-8 : recherche, avant vente, post-achat)
// ─────────────────────────────────────────────────────────────────────────────

const estimation: ActeurImmobilier[] = [
  {
    // Source: meilleursagents.com — WebSearch 2026-05 (403 direct)
    nom: "MeilleursAgents (Estimation)",
    categorie: "estimation",
    description:
      "Outil d'estimation immobilière gratuit basé sur les prix réels de 12 000 agences partenaires, les données INSEE et le DVF depuis 2014.",
    site_web: "https://www.meilleursagents.com/estimation-immobiliere/",
    logo_url: "https://www.meilleursagents.com/static/img/logo-meilleursagents.svg",
    couverture: "nationale",
    etapes_pertinentes: [1, 2, 8],
    services_cles: [
      "Estimation gratuite",
      "Prix au m²",
      "Données DVF",
      "Historique transactions",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: efficity.com — WebFetch 2026-05
    nom: "Efficity",
    categorie: "estimation",
    description:
      "Outil d'estimation et plateforme de vente immobilière offrant une évaluation gratuite en 2 minutes basée sur des millions de données de marché.",
    site_web: "https://www.efficity.com",
    logo_url: "https://diszln7ft1ccx.cloudfront.net/img/new-logo-efficity.svg",
    couverture: "nationale",
    etapes_pertinentes: [1, 2, 8],
    services_cles: [
      "Estimation en 2 min",
      "Données marché",
      "Vente entre particuliers",
      "Suivi dossier",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: bien-estimer-safti.fr — WebFetch 2026-05
    nom: "BienEstimer by SAFTI",
    categorie: "estimation",
    description:
      "Outil d'estimation immobilière 100% gratuit du réseau SAFTI, fournissant une évaluation en moins de 2 minutes basée sur les prix du marché local.",
    site_web: "https://bien-estimer-safti.fr",
    logo_url: "https://bien-estimer-safti.fr/logo.png",
    couverture: "nationale",
    etapes_pertinentes: [1, 2, 8],
    services_cles: [
      "Estimation gratuite",
      "Résultat immédiat",
      "Données marché local",
      "Sans engagement",
    ],
    gratuit: true,
    partenaire_potentiel: true,
  },
  {
    // Source: app.dvf.etalab.gouv.fr — WebFetch 2026-05
    nom: "DVF (Données de Valeur Foncière)",
    categorie: "estimation",
    description:
      "Application publique d'Étalab donnant accès aux transactions immobilières réelles enregistrées depuis 2014 par commune et parcelle cadastrale.",
    site_web: "https://app.dvf.etalab.gouv.fr",
    logo_url: null,
    couverture: "nationale",
    etapes_pertinentes: [1, 2, 8],
    services_cles: [
      "Prix transactions réels",
      "Données officielles",
      "Historique depuis 2014",
      "Téléchargement données",
    ],
    gratuit: true,
    partenaire_potentiel: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT GLOBAL
// ─────────────────────────────────────────────────────────────────────────────

export const annuaireProfessionnels: ActeurImmobilier[] = [
  ...courtiers_credit,
  ...banques,
  ...assurance_emprunteur,
  ...assurance_mrh,
  ...portails_annonces,
  ...reseaux_agences,
  ...notaires,
  ...diagnostiqueurs,
  ...courtiers_assurance,
  ...demenagement,
  ...renovation,
  ...estimation,
];

// Helpers
export const getActeursByCategorie = (
  categorie: CategorieActeur
): ActeurImmobilier[] =>
  annuaireProfessionnels.filter((a) => a.categorie === categorie);

export const getActeursByEtape = (
  etape: EtapeRelevante
): ActeurImmobilier[] =>
  annuaireProfessionnels.filter((a) => a.etapes_pertinentes.includes(etape));

export const getPartenaires = (): ActeurImmobilier[] =>
  annuaireProfessionnels.filter((a) => a.partenaire_potentiel);
