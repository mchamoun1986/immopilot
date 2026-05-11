/** Conseils experts par étape du parcours d'achat.
 * Source: ANIL, service-public.fr, notaires.fr, loi Lemoine, loi Climat — vérifié le 2026-05-09
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

/** Source: ANIL.org, service-public.fr — vérifié le 2026-05-08 */
export const TIPS_PAR_ETAPE: TipExpert[] = [
  // Étape 1 — Projet
  { etape: 1, type: "astuce", titre: "Définissez vos critères non-négociables", detail: "Listez 3 critères absolus (ex: 2 chambres min, < 30min transport, budget max). Tout le reste est négociable. Ça évite de visiter 50 biens pour rien.", source: null },
  { etape: 1, type: "attention", titre: "Budget ≠ capacité d'emprunt", detail: "Votre budget réel = capacité d'emprunt + apport - frais de notaire (7-8% ancien, 2-3% neuf) - travaux - déménagement - 3 mois épargne de précaution. Sous-estimer les frais cachés est l'erreur n°1 des primo-accédants.", source: null },
  { etape: 1, type: "danger", titre: "Frais cachés : jusqu'à 15% du prix", detail: "En plus du prix d'achat, prévoyez : frais de notaire (7-8%), frais de dossier banque (500-1500€), garantie Crédit Logement (~1% du prêt), frais d'agence si à votre charge. Sur un bien à 300 000€, ça peut faire 30 000 à 45 000€ de frais en plus.", source: "ANIL — anil.org" },
  { etape: 1, type: "astuce", titre: "Vérifiez votre zone ABC avant de planifier", detail: "La zone ABC de votre commune détermine vos droits au PTZ et aux aides. Un bien en zone B1 ouvre des aides qui n'existent pas en zone C. Vérifiez sur le simulateur officiel avant de fixer votre budget.", source: "service-public.gouv.fr/simulateur/calcul/zonage-abc" },
  { etape: 1, type: "economie", titre: "Consultez l'ADIL gratuitement", detail: "L'Agence Départementale d'Information sur le Logement (ADIL) offre des conseils juridiques et financiers gratuits et neutres. Avant toute décision, une consultation ADIL peut vous économiser des milliers d'euros en erreurs évitées.", source: "ANIL — anil.org" },

  // Étape 2 — Capacité
  { etape: 2, type: "economie", titre: "Négociez les IRA", detail: "Les indemnités de remboursement anticipé (IRA) sont négociables avant la signature. En les supprimant, vous gardez la flexibilité de rembourser sans pénalité.", source: "Code de la consommation art. R313-25" },
  { etape: 2, type: "astuce", titre: "Faites jouer la concurrence entre banques", detail: "Consultez au moins 3 banques + 1 courtier. L'écart entre la meilleure et la pire offre peut représenter 20 000€ sur 25 ans.", source: null },
  { etape: 2, type: "attention", titre: "Le taux n'est pas tout", detail: "Comparez le TAEG (Taux Annuel Effectif Global), pas le taux nominal. Le TAEG inclut assurance, frais de dossier, garantie.", source: null },
  { etape: 2, type: "astuce", titre: "Demandez l'accord de principe par écrit", detail: "Avant de visiter des biens, demandez à votre banque un accord de principe écrit. Cela renforce votre crédibilité lors d'une offre et évite les mauvaises surprises si votre situation change.", source: "ANIL — anil.org" },
  { etape: 2, type: "economie", titre: "Vérifiez votre éligibilité au PTZ", detail: "Le PTZ 2026 peut financer jusqu'à 50% du bien en zone A/Abis. Conditions : primo-accès, plafonds de revenus, zone ABC. L'ADIL peut faire le calcul gratuitement.", source: "ANIL — diagnostic de financement" },

  // Étape 3 — Accord bancaire
  { etape: 3, type: "astuce", titre: "Contactez votre banque ET un courtier", detail: "Un courtier compare 30+ banques en une démarche. Couplez avec votre banque principale pour avoir un point de comparaison. L'accord de principe prend 48h à 2 semaines.", source: null },
  { etape: 3, type: "attention", titre: "Ne mentez jamais sur votre dossier", detail: "La banque vérifie tout : relevés, impôts, crédits en cours. Un mensonge = refus immédiat et fichage. Soyez transparent, même sur les découvertes.", source: null },
  { etape: 3, type: "economie", titre: "Faites jouer la concurrence dès maintenant", detail: "L'accord de principe n'engage à rien. Obtenez-en 2-3 de banques différentes. Ça vous donne un levier de négociation quand vous présenterez votre offre définitive.", source: null },

  // Étape 4 — Recherche
  { etape: 4, type: "astuce", titre: "Visitez à différentes heures", detail: "Un appartement calme le mardi matin peut être bruyant le samedi soir. Revenez au moins 2 fois à des horaires différents.", source: null },
  { etape: 4, type: "danger", titre: "Ne vous laissez pas emporter par l'émotion", detail: "Un bien 'coup de cœur' fait souvent surpayer. Consultez systématiquement les prix DVF du quartier (app.dvf.etalab.gouv.fr) avant de formuler une offre. 80% des acheteurs négocient en 2026 — soyez l'un d'eux.", source: "actual-immo.fr avril 2026" },
  { etape: 4, type: "danger", titre: "DPE F ou G = passoire thermique", detail: "Un bien classé F ou G sera interdit à la location (G dès 2025, F en 2028). Même en résidence principale, les travaux de rénovation sont incontournables et coûteux.", source: "Loi Climat & Résilience" },
  { etape: 4, type: "attention", titre: "Vérifiez les PV d'AG en copropriété", detail: "Les PV des 3 dernières AG révèlent les travaux votés, les impayés, et les conflits. C'est la radiographie de l'immeuble.", source: null },
  { etape: 4, type: "astuce", titre: "Consultez le plan local d'urbanisme (PLU)", detail: "Avant toute offre, vérifiez le PLU de la commune sur geoportail-urbanisme.gouv.fr. Un terrain voisin classifié en zone constructible peut signifier une future construction qui dépréciait la vue ou l'ensoleillement.", source: "geoportail-urbanisme.gouv.fr" },
  { etape: 4, type: "attention", titre: "Vérifiez les diagnostics obligatoires", detail: "Le dossier de diagnostics techniques (DDT) doit inclure : DPE, amiante, plomb (si avant 1949), électricité, gaz, risques naturels (ERP), mesurage Carrez. Exigez-le avant toute offre.", source: "CCH art. L271-4" },
  { etape: 4, type: "danger", titre: "Zonage à risques (PPRI, retrait argile)", detail: "Consultez le site georisques.gouv.fr pour vérifier si le bien est en zone inondable (PPRI) ou sur sol argileux (retrait-gonflement). Ces facteurs impactent l'assurance et la valeur de revente.", source: "georisques.gouv.fr" },

  // Étape 5 — Analyse du bien
  { etape: 5, type: "astuce", titre: "Comparez le prix au m² sur DVF", detail: "Le site DVF Etalab (app.dvf.etalab.gouv.fr) montre les prix réels des transactions dans le quartier. Comparez le prix demandé avec les ventes récentes — c'est votre meilleur argument de négociation.", source: "DVF Etalab — données publiques" },
  { etape: 5, type: "danger", titre: "Exigez TOUS les diagnostics avant de décider", detail: "DPE, amiante, plomb, électricité, gaz, ERP — le vendeur doit les fournir. Si un diagnostic manque, ne signez rien. Un DPE F/G implique des travaux obligatoires.", source: "CCH art. L271-4" },
  { etape: 5, type: "attention", titre: "En copro : les PV d'AG révèlent tout", detail: "Les 3 derniers PV d'assemblée générale montrent les travaux votés, les impayés, les conflits. Demandez aussi le DTG (Diagnostic Technique Global) et le fonds de travaux.", source: "Loi Alur" },

  // Étape 6 — Offre
  { etape: 6, type: "astuce", titre: "Consultez les prix DVF avant d'offrir", detail: "Le site DVF Etalab (app.dvf.etalab.gouv.fr) montre les prix réels des transactions dans le quartier. C'est votre meilleur outil de négociation. En 2026 : prix moyen France 3 142€/m² (apparts 3 918€, maisons 2 541€), Paris 9 450€/m² (-2.8%/an).", source: "DVF Etalab — Meilleurs Agents mai 2026" },
  { etape: 6, type: "economie", titre: "Une offre écrite avec financement = crédibilité", detail: "Joignez une attestation de financement à votre offre. Ça rassure le vendeur et vous place devant les acheteurs sans dossier.", source: null },
  { etape: 6, type: "astuce", titre: "Négociez au-delà du prix : les conditions", detail: "Une offre peut porter sur : date de signature différée (utile si vous avez un bien à vendre), meubles inclus, travaux à la charge du vendeur, frais de notaire offerts. Ces éléments valent parfois autant qu'une réduction de prix.", source: "lesiteimmo.com 2026" },
  { etape: 6, type: "attention", titre: "L'offre d'achat vous engage", detail: "Une offre d'achat acceptée par le vendeur constitue un accord de vente. Même avant le compromis, refuser de signer peut exposer à des poursuites. Ne faites pas d'offre si vous n'êtes pas certain.", source: "notaires.fr" },

  // Étape 7 — Compromis
  { etape: 7, type: "danger", titre: "Ne supprimez JAMAIS la clause suspensive de prêt", detail: "Sans cette clause, si votre prêt est refusé, vous perdez le dépôt de garantie (5-10% du prix). C'est votre filet de sécurité.", source: "CCH art. L271-1" },
  { etape: 7, type: "astuce", titre: "Lisez chaque clause avant de signer", detail: "Vous avez 10 jours de rétractation APRÈS la signature. Mais relisez tout avec attention — une clause ambiguë peut devenir un piège.", source: null },
  { etape: 7, type: "attention", titre: "Vérifiez les dates limites", detail: "Le compromis fixe des dates butoir : obtention du prêt, levée des conditions suspensives, signature de l'acte. Notez-les dans votre calendrier.", source: null },
  { etape: 7, type: "astuce", titre: "Négociez le délai de prêt à 60 jours minimum", detail: "La loi accorde 30 jours pour obtenir un prêt, mais vous pouvez négocier 60 à 75 jours avec l'accord du vendeur. Avec accord du vendeur, ce délai étendu est inscrit dans le compromis — indispensable si votre dossier est complexe.", source: "notaires.fr — fourez.notaires.fr" },
  { etape: 7, type: "economie", titre: "Compris vs promesse : préférez le compromis", detail: "La promesse unilatérale engage uniquement l'acheteur. Le compromis de vente engage les deux parties — si le vendeur se retire, il peut être contraint à vendre. Préférez le compromis pour une meilleure protection.", source: "efficience.notaires.fr" },

  // Étape 8 — Financement
  { etape: 8, type: "economie", titre: "Déléguez l'assurance emprunteur", detail: "La loi Lemoine vous permet de choisir une assurance externe, souvent 2 à 3 fois moins chère que celle de la banque. Économie : 5 000 à 15 000€.", source: "Loi Lemoine n° 2022-270" },
  { etape: 8, type: "astuce", titre: "Négociez les frais de dossier", detail: "Les frais de dossier (500 à 1500€) sont négociables. Certaines banques les offrent si vous domiciliez vos revenus.", source: null },
  { etape: 8, type: "attention", titre: "Ne changez rien à votre situation financière", detail: "Entre la signature du compromis et la signature de l'acte, évitez : changer d'employeur, contracter un nouveau crédit, vider votre épargne. La banque peut faire une vérification finale juste avant le déblocage.", source: null },
  { etape: 8, type: "economie", titre: "Résiliez votre assurance emprunteur chaque année", detail: "Depuis la loi Lemoine (2022), vous pouvez résilier et changer d'assurance emprunteur à tout moment, sans frais. Même après signature, re-faites le marché chaque année si les taux baissent.", source: "Loi Lemoine n° 2022-270 — en vigueur depuis juin 2022" },

  // Étape 9 — Notaire
  { etape: 9, type: "astuce", titre: "Votre propre notaire — c'est gratuit", detail: "Vous pouvez imposer votre propre notaire. Les honoraires sont partagés entre les deux études, sans surcoût pour vous.", source: null },
  { etape: 9, type: "attention", titre: "Vérifiez l'acte avant le jour J", detail: "Demandez le projet d'acte au moins 1 semaine avant la signature. Vérifiez : prix, surface, servitudes, conditions particulières.", source: null },
  { etape: 9, type: "economie", titre: "Frais de notaire : neuf vs ancien", detail: "Les frais de notaire sont de 2-3% dans le neuf contre 7-8% dans l'ancien. Sur un bien à 300 000€, c'est 15 000€ d'écart. Vérifiez si le bien est éligible aux frais réduits (moins de 5 ans, jamais habité).", source: "ANIL — frais d'acquisition" },
  { etape: 9, type: "astuce", titre: "Signalez les meubles dans l'acte pour réduire les frais", detail: "Si vous achetez du mobilier avec le bien (cuisine, électroménager, cave à vin...), faites-le valoriser et déduire du prix immobilier. Les frais de notaire ne s'appliquent pas sur les meubles — économie réelle sur le calcul.", source: "notaires.fr" },

  // Étape 10 — Post-achat
  { etape: 10, type: "astuce", titre: "Exonération taxe foncière pour le neuf", detail: "Si vous achetez un bien neuf, vous êtes exonéré de taxe foncière pendant 2 ans. La demande doit être faite dans les 90 jours suivant l'achèvement.", source: "CGI art. 1383" },
  { etape: 10, type: "attention", titre: "Assurez-vous AVANT la remise des clés", detail: "Votre assurance habitation (MRH) doit être active le jour de la signature de l'acte. Sans attestation, le notaire peut refuser de signer.", source: null },
  { etape: 10, type: "economie", titre: "Déclarez les travaux pour réduire votre impôt", detail: "Si vous réalisez des travaux énergétiques (isolation, pompe à chaleur, fenêtres), vous pouvez bénéficier de MaPrimeRénov' et de l'éco-PTZ. Faites les demandes AVANT de démarrer les travaux — pas de rétroactivité.", source: "anah.gouv.fr — MaPrimeRénov' 2026" },
  { etape: 10, type: "astuce", titre: "Enregistrez votre bien auprès des impôts", detail: "Dans les 90 jours après la signature de l'acte, déclarez votre nouveau logement aux impôts (formulaire 2044 pour les locations, ou mise à jour de la taxe d'habitation). Le non-respect entraîne des pénalités.", source: "impots.gouv.fr" },
  { etape: 10, type: "attention", titre: "Vérifiez les charges de copropriété réellement dues", detail: "Après la signature, demandez le relevé de charges des 3 derniers exercices. Les charges peuvent varier de 50 à 300€/mois selon l'immeuble et incluent des postes très différents (gardien, ascenseur, travaux). Ne vous fiez pas aux estimations du vendeur.", source: null },
];

/** Get tips for a specific step, converted to TipData format for StepLayout */
export function getTipsForEtape(etape: EtapeNumber): TipData[] {
  return TIPS_PAR_ETAPE
    .filter((t) => t.etape === etape)
    .map((t) => ({ type: t.type, titre: t.titre, detail: t.detail }));
}
