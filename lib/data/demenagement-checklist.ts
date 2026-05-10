/** Checklist demenagement — timeline J-60 a J+30.
 * Source: service-public.gouv.fr, laposte.fr, ants.gouv.fr — verifie le 2026-05-09
 */

export interface ActionDemenagement {
  delai: string;
  action: string;
  detail: string;
  priorite: "obligatoire" | "recommande" | "optionnel";
  lien: string | null;
}

/** Source: service-public.gouv.fr, laposte.fr, ants.gouv.fr, ANIL — verifie le 2026-05-09 */
export const CHECKLIST_DEMENAGEMENT: ActionDemenagement[] = [
  // J-60
  { delai: "J-60", action: "Demander des devis demenageurs", detail: "Comparer au moins 3 devis. Verifier l'assurance transport et la date de disponibilite.", priorite: "recommande", lien: null },
  { delai: "J-60", action: "Souscrire assurance MRH nouveau logement", detail: "Obligatoire en copropriete (loi Alur). L'attestation sera demandee par le notaire le jour de la signature. Prime moyenne 2026 : 216€/an (appart) ou 372€/an (maison) — hausse 5.8% vs 2025.", priorite: "obligatoire", lien: null },
  { delai: "J-60", action: "Anticiper le changement d'adresse en ligne (JCC)", detail: "Le service 'Je change de coordonnees' sur service-public.gouv.fr peut etre active jusqu'a 3 mois avant le demenagement. Il previent en une fois : impots, CPAM, CAF, France Travail, retraite. Environ 500 000 utilisations en 2024, 5 organismes en moyenne par declaration.", priorite: "recommande", lien: "https://www.service-public.gouv.fr/particuliers/vosdroits/R11193" },
  // J-30
  { delai: "J-30", action: "Resilier ou transferer internet", detail: "Delai de 1 a 3 semaines selon l'operateur. EDF/Engie : ouverture contrat possible 42 jours avant emmenagement. Anticipez pour ne pas etre sans connexion ni chauffage.", priorite: "recommande", lien: null },
  { delai: "J-30", action: "Transfert de courrier La Poste", detail: "Reexpedition definitive nationale : 6 mois (55€) ou 12 mois (87€). Tarifs 2026 apres hausse de 7,4% au 1er jan 2026. Activable en ligne sur laposte.fr.", priorite: "recommande", lien: "https://www.laposte.fr/demenagement" },
  { delai: "J-30", action: "Prevenir employeur du changement d'adresse", detail: "Bulletin de salaire, mutuelle, prevoyance.", priorite: "obligatoire", lien: null },
  // J-15
  { delai: "J-15", action: "Relever les compteurs (eau, elec, gaz) de l'ancien logement", detail: "Notez les index pour la resiliation/transfert.", priorite: "obligatoire", lien: null },
  { delai: "J-15", action: "Ouvrir les compteurs du nouveau logement", detail: "EDF/Engie en ligne ou par telephone. Delai mise en service : 2 a 5 jours ouvrables.", priorite: "obligatoire", lien: null },
  { delai: "J-15", action: "Commander les cartons et le materiel", detail: "Estimer 10-15 cartons par piece. Ne pas oublier : scotch, papier bulle, marqueur.", priorite: "recommande", lien: null },
  // J-Day
  { delai: "J", action: "Signature acte authentique chez le notaire", detail: "Apportez : piece d'identite, attestation MRH, RIB. Le notaire vous remet les cles.", priorite: "obligatoire", lien: null },
  { delai: "J", action: "Relever les compteurs du nouveau logement", detail: "Notez les index a votre arrivee pour eviter de payer la consommation du vendeur.", priorite: "obligatoire", lien: null },
  // J+7
  { delai: "J+7", action: "Changement d'adresse multi-organismes (JCC)", detail: "Utilisez service-public.gouv.fr (service 'Je change de coordonnees') pour prevenir en une fois : impots, CPAM, CAF, France Travail, retraite. Inscription electorale automatique si changement de commune. Vous pouvez aussi signaler changement d'email et telephone. Demarche faisable jusqu'a J+3 mois.", priorite: "obligatoire", lien: "https://www.service-public.gouv.fr/particuliers/vosdroits/F14128" },
  { delai: "J+7", action: "Prevenir le syndic de copropriete", detail: "Si vous achetez en copropriete : transmettez vos coordonnees au syndic pour les appels de charges et convocations AG.", priorite: "obligatoire", lien: null },
  { delai: "J+7", action: "Resilier l'assurance de l'ancien logement", detail: "Si proprietaire de l'ancien : resilier MRH. Si locataire : le bailleur peut exiger le maintien jusqu'a l'etat des lieux de sortie.", priorite: "obligatoire", lien: null },
  // J+30
  { delai: "J+30", action: "Mettre a jour la carte grise du vehicule", detail: "Obligatoire dans le mois suivant le demenagement. En ligne sur ants.gouv.fr.", priorite: "obligatoire", lien: "https://ants.gouv.fr/" },
  { delai: "J+30", action: "Mettre a jour les listes electorales", detail: "Inscription automatique si vous avez fait le changement sur service-public.gouv.fr. Sinon, demarche en mairie.", priorite: "optionnel", lien: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1367" },
  { delai: "J+30", action: "Mettre a jour l'identification de l'animal de compagnie", detail: "Si vous avez un animal puce ou tatoue : mettre a jour l'adresse dans le fichier national d'identification (i-CAD). Obligatoire.", priorite: "recommande", lien: null },
  { delai: "J+30", action: "Demander l'aide au demenagement CAF (si eligible)", detail: "La CAF verse une aide au demenagement sous conditions de ressources et composition familiale. Montant 2026 : 1 147,60€ pour 3 enfants, +95,63€ par enfant supplementaire. A demander aupres de votre CAF dans les 6 mois suivant l'emmenagement.", priorite: "recommande", lien: "https://www.caf.fr" },
  { delai: "J+90 (si neuf)", action: "Demander l'exoneration de taxe fonciere", detail: "Formulaire H1 (maison) ou H2 (appartement) au centre des impots dans les 90 jours de l'achevement.", priorite: "obligatoire", lien: "https://www.impots.gouv.fr/" },
];
