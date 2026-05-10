/** Conseils experts par etape du parcours d'achat.
 * Source: ANIL, service-public.fr, notaires.fr, loi Lemoine, loi Climat — verifie le 2026-05-09
 */

import type { EtapeNumber } from "@/lib/types";
import type { TipData } from "@/components/parcours/step-layout";

export interface TipExpert {
  etape: EtapeNumber;
  type: "economie" | "attention" | "danger" | "astuce";
  titre: string;
  detail: string;
  source: string | null;
}

/** Source: ANIL.org, service-public.fr — verifie le 2026-05-08 */
export const TIPS_PAR_ETAPE: TipExpert[] = [
  // Etape 1 — Projet
  { etape: 1, type: "astuce", titre: "Definissez vos criteres non-negociables", detail: "Listez 3 criteres absolus (ex: 2 chambres min, < 30min transport, budget max). Tout le reste est negociable. Ca evite de visiter 50 biens pour rien.", source: null },
  { etape: 1, type: "attention", titre: "Budget ≠ capacite d'emprunt", detail: "Votre budget reel = capacite d'emprunt + apport - frais de notaire (7-8% ancien, 2-3% neuf) - travaux - demenagement - 3 mois epargne de precaution. Sous-estimer les frais caches est l'erreur n°1 des primo-accedants.", source: null },
  { etape: 1, type: "danger", titre: "Frais caches : jusqu'a 15% du prix", detail: "En plus du prix d'achat, prevoyez : frais de notaire (7-8%), frais de dossier banque (500-1500€), garantie Credit Logement (~1% du pret), frais d'agence si a votre charge. Sur un bien a 300 000€, ca peut faire 30 000 a 45 000€ de frais en plus.", source: "ANIL — anil.org" },
  { etape: 1, type: "astuce", titre: "Verifiez votre zone ABC avant de planifier", detail: "La zone ABC de votre commune determine vos droits au PTZ et aux aides. Un bien en zone B1 ouvre des aides qui n'existent pas en zone C. Verifiez sur le simulateur officiel avant de fixer votre budget.", source: "service-public.gouv.fr/simulateur/calcul/zonage-abc" },
  { etape: 1, type: "economie", titre: "Consultez l'ADIL gratuitement", detail: "L'Agence Departementale d'Information sur le Logement (ADIL) offre des conseils juridiques et financiers gratuits et neutres. Avant toute decision, une consultation ADIL peut vous economiser des milliers d'euros en erreurs evitees.", source: "ANIL — anil.org" },

  // Etape 2 — Capacite
  { etape: 2, type: "economie", titre: "Negociez les IRA", detail: "Les indemnites de remboursement anticipe (IRA) sont negociables avant la signature. En les supprimant, vous gardez la flexibilite de rembourser sans penalite.", source: "Code de la consommation art. R313-25" },
  { etape: 2, type: "astuce", titre: "Faites jouer la concurrence entre banques", detail: "Consultez au moins 3 banques + 1 courtier. L'ecart entre la meilleure et la pire offre peut representer 20 000€ sur 25 ans.", source: null },
  { etape: 2, type: "attention", titre: "Le taux n'est pas tout", detail: "Comparez le TAEG (Taux Annuel Effectif Global), pas le taux nominal. Le TAEG inclut assurance, frais de dossier, garantie.", source: null },
  { etape: 2, type: "astuce", titre: "Demandez l'accord de principe par ecrit", detail: "Avant de visiter des biens, demandez a votre banque un accord de principe ecrit. Cela renforce votre credibilite lors d'une offre et evite les mauvaises surprises si votre situation change.", source: "ANIL — anil.org" },
  { etape: 2, type: "economie", titre: "Verifiez votre eligibilite au PTZ", detail: "Le PTZ 2026 peut financer jusqu'a 50% du bien en zone A/Abis. Conditions : primo-acces, plafonds de revenus, zone ABC. L'ADIL peut faire le calcul gratuitement.", source: "ANIL — diagnostic de financement" },

  // Etape 3 — Accord bancaire
  { etape: 3, type: "astuce", titre: "Contactez votre banque ET un courtier", detail: "Un courtier compare 30+ banques en une demarche. Couplez avec votre banque principale pour avoir un point de comparaison. L'accord de principe prend 48h a 2 semaines.", source: null },
  { etape: 3, type: "attention", titre: "Ne mentez jamais sur votre dossier", detail: "La banque verifie tout : releves, impots, credits en cours. Un mensonge = refus immediat et fichage. Soyez transparent, meme sur les decouvertes.", source: null },
  { etape: 3, type: "economie", titre: "Faites jouer la concurrence des maintenant", detail: "L'accord de principe n'engage a rien. Obtenez-en 2-3 de banques differentes. Ca vous donne un levier de negociation quand vous presenterez votre offre definitive.", source: null },

  // Etape 4 — Recherche
  { etape: 4, type: "astuce", titre: "Visitez a differentes heures", detail: "Un appartement calme le mardi matin peut etre bruyant le samedi soir. Revenez au moins 2 fois a des horaires differents.", source: null },
  { etape: 4, type: "danger", titre: "Ne vous laissez pas emporter par l'emotion", detail: "Un bien 'coup de coeur' fait souvent surpayer. Consultez systematiquement les prix DVF du quartier (app.dvf.etalab.gouv.fr) avant de formuler une offre. 80% des acheteurs negocient en 2026 — soyez l'un d'eux.", source: "actual-immo.fr avril 2026" },
  { etape: 4, type: "danger", titre: "DPE F ou G = passoire thermique", detail: "Un bien classe F ou G sera interdit a la location (G des 2025, F en 2028). Meme en residence principale, les travaux de renovation sont incontournables et couteux.", source: "Loi Climat & Resilience" },
  { etape: 4, type: "attention", titre: "Verifiez les PV d'AG en copropriete", detail: "Les PV des 3 dernieres AG revelent les travaux votes, les impayes, et les conflits. C'est la radiographie de l'immeuble.", source: null },
  { etape: 4, type: "astuce", titre: "Consultez le plan local d'urbanisme (PLU)", detail: "Avant toute offre, verifiez le PLU de la commune sur geoportail-urbanisme.gouv.fr. Un terrain voisin classifie en zone constructible peut signifier une future construction qui depreciait la vue ou l'ensoleillement.", source: "geoportail-urbanisme.gouv.fr" },
  { etape: 4, type: "attention", titre: "Verifiez les diagnostics obligatoires", detail: "Le dossier de diagnostics techniques (DDT) doit inclure : DPE, amiante, plomb (si avant 1949), electricite, gaz, risques naturels (ERP), mesurage Carrez. Exigez-le avant toute offre.", source: "CCH art. L271-4" },
  { etape: 4, type: "danger", titre: "Zonage a risques (PPRI, retrait argile)", detail: "Consultez le site georisques.gouv.fr pour verifier si le bien est en zone inondable (PPRI) ou sur sol argileux (retrait-gonflement). Ces facteurs impactent l'assurance et la valeur de revente.", source: "georisques.gouv.fr" },

  // Etape 5 — Analyse du bien
  { etape: 5, type: "astuce", titre: "Comparez le prix au m2 sur DVF", detail: "Le site DVF Etalab (app.dvf.etalab.gouv.fr) montre les prix reels des transactions dans le quartier. Comparez le prix demande avec les ventes recentes — c'est votre meilleur argument de negociation.", source: "DVF Etalab — donnees publiques" },
  { etape: 5, type: "danger", titre: "Exigez TOUS les diagnostics avant de decider", detail: "DPE, amiante, plomb, electricite, gaz, ERP — le vendeur doit les fournir. Si un diagnostic manque, ne signez rien. Un DPE F/G implique des travaux obligatoires.", source: "CCH art. L271-4" },
  { etape: 5, type: "attention", titre: "En copro : les PV d'AG revelent tout", detail: "Les 3 derniers PV d'assemblee generale montrent les travaux votes, les impayes, les conflits. Demandez aussi le DTG (Diagnostic Technique Global) et le fonds de travaux.", source: "Loi Alur" },

  // Etape 6 — Offre
  { etape: 6, type: "astuce", titre: "Consultez les prix DVF avant d'offrir", detail: "Le site DVF Etalab (app.dvf.etalab.gouv.fr) montre les prix reels des transactions dans le quartier. C'est votre meilleur outil de negociation. En 2026 : prix moyen France 3 142€/m2 (apparts 3 918€, maisons 2 541€), Paris 9 450€/m2 (-2.8%/an).", source: "DVF Etalab — Meilleurs Agents mai 2026" },
  { etape: 6, type: "economie", titre: "Une offre ecrite avec financement = credibilite", detail: "Joignez une attestation de financement a votre offre. Ca rassure le vendeur et vous place devant les acheteurs sans dossier.", source: null },
  { etape: 6, type: "astuce", titre: "Negociez au-dela du prix : les conditions", detail: "Une offre peut porter sur : date de signature differee (utile si vous avez un bien a vendre), meubles inclus, travaux a la charge du vendeur, frais de notaire offerts. Ces elements valent parfois autant qu'une reduction de prix.", source: "lesiteimmo.com 2026" },
  { etape: 6, type: "attention", titre: "L'offre d'achat vous engage", detail: "Une offre d'achat acceptee par le vendeur constitue un accord de vente. Meme avant le compromis, refuser de signer peut exposer a des poursuites. Ne faites pas d'offre si vous n'etes pas certain.", source: "notaires.fr" },

  // Etape 7 — Compromis
  { etape: 7, type: "danger", titre: "Ne supprimez JAMAIS la clause suspensive de pret", detail: "Sans cette clause, si votre pret est refuse, vous perdez le depot de garantie (5-10% du prix). C'est votre filet de securite.", source: "CCH art. L271-1" },
  { etape: 7, type: "astuce", titre: "Lisez chaque clause avant de signer", detail: "Vous avez 10 jours de retractation APRES la signature. Mais relisez tout avec attention — une clause ambigue peut devenir un piege.", source: null },
  { etape: 7, type: "attention", titre: "Verifiez les dates limites", detail: "Le compromis fixe des dates butoir : obtention du pret, levee des conditions suspensives, signature de l'acte. Notez-les dans votre calendrier.", source: null },
  { etape: 7, type: "astuce", titre: "Negociez le delai de pret a 60 jours minimum", detail: "La loi accorde 30 jours pour obtenir un pret, mais vous pouvez negocier 60 a 75 jours avec l'accord du vendeur. Avec accord du vendeur, ce delai etendu est inscrit dans le compromis — indispensable si votre dossier est complexe.", source: "notaires.fr — fourez.notaires.fr" },
  { etape: 7, type: "economie", titre: "Compris vs promesse : preferez le compromis", detail: "La promesse unilaterale engage uniquement l'acheteur. Le compromis de vente engage les deux parties — si le vendeur se retire, il peut etre contraint a vendre. Preferez le compromis pour une meilleure protection.", source: "efficience.notaires.fr" },

  // Etape 8 — Financement
  { etape: 8, type: "economie", titre: "Delegez l'assurance emprunteur", detail: "La loi Lemoine vous permet de choisir une assurance externe, souvent 2 a 3 fois moins chere que celle de la banque. Economie : 5 000 a 15 000€.", source: "Loi Lemoine n° 2022-270" },
  { etape: 8, type: "astuce", titre: "Negociez les frais de dossier", detail: "Les frais de dossier (500 a 1500€) sont negociables. Certaines banques les offrent si vous domiciliez vos revenus.", source: null },
  { etape: 8, type: "attention", titre: "Ne changez rien a votre situation financiere", detail: "Entre la signature du compromis et la signature de l'acte, evitez : changer d'employeur, contracter un nouveau credit, vider votre epargne. La banque peut faire une verification finale juste avant le deblocage.", source: null },
  { etape: 8, type: "economie", titre: "Resiliez votre assurance emprunteur chaque annee", detail: "Depuis la loi Lemoine (2022), vous pouvez resilier et changer d'assurance emprunteur a tout moment, sans frais. Meme apres signature, re-faites le marche chaque annee si les taux baissent.", source: "Loi Lemoine n° 2022-270 — en vigueur depuis juin 2022" },

  // Etape 9 — Notaire
  { etape: 9, type: "astuce", titre: "Votre propre notaire — c'est gratuit", detail: "Vous pouvez imposer votre propre notaire. Les honoraires sont partages entre les deux etudes, sans surcout pour vous.", source: null },
  { etape: 9, type: "attention", titre: "Verifiez l'acte avant le jour J", detail: "Demandez le projet d'acte au moins 1 semaine avant la signature. Verifiez : prix, surface, servitudes, conditions particulieres.", source: null },
  { etape: 9, type: "economie", titre: "Frais de notaire : neuf vs ancien", detail: "Les frais de notaire sont de 2-3% dans le neuf contre 7-8% dans l'ancien. Sur un bien a 300 000€, c'est 15 000€ d'ecart. Verifiez si le bien est eligible aux frais reduits (moins de 5 ans, jamais habite).", source: "ANIL — frais d'acquisition" },
  { etape: 9, type: "astuce", titre: "Signalez les meubles dans l'acte pour reduire les frais", detail: "Si vous achetez du mobilier avec le bien (cuisine, electromenager, cave a vin...), faites-le valoriser et deduire du prix immobilier. Les frais de notaire ne s'appliquent pas sur les meubles — economie reelle sur le calcul.", source: "notaires.fr" },

  // Etape 10 — Post-achat
  { etape: 10, type: "astuce", titre: "Exoneration taxe fonciere pour le neuf", detail: "Si vous achetez un bien neuf, vous etes exonere de taxe fonciere pendant 2 ans. La demande doit etre faite dans les 90 jours suivant l'achevement.", source: "CGI art. 1383" },
  { etape: 10, type: "attention", titre: "Assurez-vous AVANT la remise des cles", detail: "Votre assurance habitation (MRH) doit etre active le jour de la signature de l'acte. Sans attestation, le notaire peut refuser de signer.", source: null },
  { etape: 10, type: "economie", titre: "Declarez les travaux pour reduire votre impot", detail: "Si vous realisez des travaux energetiques (isolation, pompe a chaleur, fenetres), vous pouvez beneficier de MaPrimeRenov' et de l'eco-PTZ. Faites les demandes AVANT de demarrer les travaux — pas de retroactivite.", source: "anah.gouv.fr — MaPrimeRenov' 2026" },
  { etape: 10, type: "astuce", titre: "Enregistrez votre bien aupres des impots", detail: "Dans les 90 jours apres la signature de l'acte, declarez votre nouveau logement aux impots (formulaire 2044 pour les locations, ou mise a jour de la taxe d'habitation). Le non-respect entraine des penalites.", source: "impots.gouv.fr" },
  { etape: 10, type: "attention", titre: "Verifiez les charges de copropriete reellement dues", detail: "Apres la signature, demandez le releve de charges des 3 derniers exercices. Les charges peuvent varier de 50 a 300€/mois selon l'immeuble et incluent des postes tres differents (gardien, ascenseur, travaux). Ne vous fiez pas aux estimations du vendeur.", source: null },
];

/** Get tips for a specific step, converted to TipData format for StepLayout */
export function getTipsForEtape(etape: EtapeNumber): TipData[] {
  return TIPS_PAR_ETAPE
    .filter((t) => t.etape === etape)
    .map((t) => ({ type: t.type, titre: t.titre, detail: t.detail }));
}
