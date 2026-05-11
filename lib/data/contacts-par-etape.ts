/** Contacts et liens utiles par étape.
 * Affichés dans le tab "Contacts" de chaque étape.
 */

import type { EtapeNumber } from "@/lib/types";

export interface ContactEtape {
  etape: EtapeNumber;
  categorie: "officiel" | "professionnel" | "comparateur" | "portail";
  nom: string;
  description: string;
  url: string | null;
  gratuit: boolean;
  affiliate_url: string | null;
}

// TODO: remplacer les placeholders par vrais liens affilies une fois inscrit aux programmes
export const CONTACTS_PAR_ETAPE: ContactEtape[] = [
  // Etape 1
  { etape: 1, categorie: "officiel", nom: "ADIL", description: "Conseil juridique et financier gratuit", url: "https://www.anil.org/lanil-et-les-adil/votre-adil/", gratuit: true, affiliate_url: null },
  { etape: 1, categorie: "officiel", nom: "Mairie — PLU", description: "Plan Local d'Urbanisme de votre commune", url: "https://www.geoportail-urbanisme.gouv.fr/", gratuit: true, affiliate_url: null },

  // Etape 2
  { etape: 2, categorie: "comparateur", nom: "Pretto", description: "Courtier en ligne — simulation gratuite", url: "https://www.pretto.fr/", gratuit: true, affiliate_url: "https://www.pretto.fr/?ref=immopilot&subid={sessionId}" },
  { etape: 2, categorie: "comparateur", nom: "Empruntis", description: "Comparateur de crédits immobiliers", url: "https://www.empruntis.com/", gratuit: true, affiliate_url: "https://www.empruntis.com/?ref=immopilot&subid={sessionId}" },
  { etape: 2, categorie: "comparateur", nom: "Meilleurtaux", description: "Comparateur taux + assurance", url: "https://www.meilleurtaux.com/", gratuit: true, affiliate_url: "https://www.meilleurtaux.com/?ref=immopilot&subid={sessionId}" },
  { etape: 2, categorie: "officiel", nom: "Simulateur PTZ", description: "Simulateur officiel service-public.fr", url: "https://www.service-public.fr/particuliers/vosdroits/R2974", gratuit: true, affiliate_url: null },

  // Etape 3
  { etape: 3, categorie: "professionnel", nom: "Votre banque", description: "Demandez un accord de principe écrit", url: null, gratuit: true, affiliate_url: null },
  { etape: 3, categorie: "professionnel", nom: "Courtier", description: "Compare les offres de plusieurs banques pour vous", url: null, gratuit: false, affiliate_url: null },
  { etape: 3, categorie: "professionnel", nom: "Notaire (1er contact)", description: "Prenez contact tôt — c'est gratuit et recommandé", url: "https://www.notaires.fr/fr/annuaire-notaires", gratuit: true, affiliate_url: null },

  // Etape 4
  { etape: 4, categorie: "portail", nom: "SeLoger", description: "Portail d'annonces immobilières", url: "https://www.seloger.com/", gratuit: true, affiliate_url: "https://www.seloger.com/?ref=immopilot&subid={sessionId}" },
  { etape: 4, categorie: "portail", nom: "LeBonCoin Immo", description: "Annonces entre particuliers et agences", url: "https://www.leboncoin.fr/immobilier/", gratuit: true, affiliate_url: "https://www.leboncoin.fr/immobilier/?ref=immopilot&subid={sessionId}" },
  { etape: 4, categorie: "portail", nom: "PAP", description: "Particulier a Particulier — sans frais d'agence", url: "https://www.pap.fr/", gratuit: true, affiliate_url: "https://www.pap.fr/?ref=immopilot&subid={sessionId}" },
  { etape: 4, categorie: "portail", nom: "Bien'ici", description: "Portail avec carte interactive", url: "https://www.bienici.com/", gratuit: true, affiliate_url: "https://www.bienici.com/?ref=immopilot&subid={sessionId}" },

  // Etape 5
  { etape: 5, categorie: "officiel", nom: "DVF Etalab", description: "Prix réels des transactions immobilières", url: "https://app.dvf.etalab.gouv.fr/", gratuit: true, affiliate_url: null },
  { etape: 5, categorie: "professionnel", nom: "Diagnostiqueur certifié", description: "DPE, amiante, plomb, électricité, gaz", url: null, gratuit: false, affiliate_url: null },
  { etape: 5, categorie: "officiel", nom: "Georisques", description: "Zones inondables, argile, risques naturels", url: "https://www.georisques.gouv.fr/", gratuit: true, affiliate_url: null },
  { etape: 5, categorie: "professionnel", nom: "Syndic de copropriété", description: "PV d'AG, charges, travaux votés", url: null, gratuit: true, affiliate_url: null },

  // Etape 6
  { etape: 6, categorie: "professionnel", nom: "Agent immobilier", description: "Transmettez votre offre via l'agent", url: null, gratuit: false, affiliate_url: null },
  { etape: 6, categorie: "professionnel", nom: "Notaire (conseil)", description: "Faites relire votre offre avant envoi", url: null, gratuit: true, affiliate_url: null },

  // Etape 7
  { etape: 7, categorie: "professionnel", nom: "Notaire acheteur", description: "Votre propre notaire — sans surcoût", url: "https://www.notaires.fr/fr/annuaire-notaires", gratuit: true, affiliate_url: null },
  { etape: 7, categorie: "professionnel", nom: "Notaire vendeur", description: "Notaire désigné par le vendeur", url: null, gratuit: true, affiliate_url: null },

  // Etape 8
  { etape: 8, categorie: "professionnel", nom: "Banques", description: "Déposez votre demande dans 3+ banques", url: null, gratuit: true, affiliate_url: null },
  { etape: 8, categorie: "comparateur", nom: "April", description: "Assurance emprunteur — délégation", url: "https://www.april.fr/", gratuit: false, affiliate_url: "https://www.april.fr/?ref=immopilot&subid={sessionId}" },
  { etape: 8, categorie: "comparateur", nom: "Luko", description: "Assurance habitation MRH en ligne", url: "https://www.luko.eu/", gratuit: false, affiliate_url: "https://www.luko.eu/?ref=immopilot&subid={sessionId}" },
  { etape: 8, categorie: "comparateur", nom: "MAIF", description: "Assurance habitation MRH", url: "https://www.maif.fr/", gratuit: false, affiliate_url: "https://www.maif.fr/?ref=immopilot&subid={sessionId}" },

  // Etape 9
  { etape: 9, categorie: "professionnel", nom: "Notaire", description: "Signature de l'acte authentique", url: null, gratuit: false, affiliate_url: null },
  { etape: 9, categorie: "professionnel", nom: "Banque", description: "Déblocage des fonds", url: null, gratuit: true, affiliate_url: null },

  // Etape 10
  { etape: 10, categorie: "officiel", nom: "Service-public.fr", description: "Changement d'adresse multi-organismes", url: "https://www.service-public.fr/particuliers/vosdroits/R11193", gratuit: true, affiliate_url: null },
  { etape: 10, categorie: "officiel", nom: "Impots.gouv.fr", description: "Déclaration d'occupation + taxe foncière", url: "https://www.impots.gouv.fr/", gratuit: true, affiliate_url: null },
  { etape: 10, categorie: "officiel", nom: "ANTS", description: "Mise à jour carte grise", url: "https://ants.gouv.fr/", gratuit: true, affiliate_url: null },
  { etape: 10, categorie: "professionnel", nom: "La Poste", description: "Redirection courrier 6 ou 12 mois", url: "https://www.laposte.fr/demenagement", gratuit: false, affiliate_url: "https://www.laposte.fr/demenagement?ref=immopilot&subid={sessionId}" },
];

export function getContactsForEtape(etape: EtapeNumber): ContactEtape[] {
  return CONTACTS_PAR_ETAPE.filter((c) => c.etape === etape);
}
