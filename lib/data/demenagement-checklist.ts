/** Checklist déménagement — timeline J-60 à J+30.
 * Source: service-public.gouv.fr, laposte.fr, ants.gouv.fr — vérifié le 2026-05-09
 */

export interface ActionDemenagement {
  delai: string;
  action: string;
  detail: string;
  priorite: "obligatoire" | "recommande" | "optionnel";
  lien: string | null;
}

/** Source: service-public.gouv.fr, laposte.fr, ants.gouv.fr, ANIL — vérifié le 2026-05-09 */
export const CHECKLIST_DEMENAGEMENT: ActionDemenagement[] = [
  // J-60
  { delai: "J-60", action: "Demander des devis déménageurs", detail: "Comparer au moins 3 devis. Vérifier l'assurance transport et la date de disponibilité.", priorite: "recommande", lien: null },
  { delai: "J-60", action: "Souscrire assurance MRH nouveau logement", detail: "Obligatoire en copropriété (loi Alur). L'attestation sera demandée par le notaire le jour de la signature. Prime moyenne 2026 : 216€/an (appart) ou 372€/an (maison) — hausse 5.8% vs 2025.", priorite: "obligatoire", lien: null },
  { delai: "J-60", action: "Anticiper le changement d'adresse en ligne (JCC)", detail: "Le service 'Je change de coordonnées' sur service-public.gouv.fr peut être activé jusqu'à 3 mois avant le déménagement. Il prévient en une fois : impôts, CPAM, CAF, France Travail, retraite. Environ 500 000 utilisations en 2024, 5 organismes en moyenne par déclaration.", priorite: "recommande", lien: "https://www.service-public.gouv.fr/particuliers/vosdroits/R11193" },
  // J-30
  { delai: "J-30", action: "Résilier ou transférer internet", detail: "Délai de 1 à 3 semaines selon l'opérateur. EDF/Engie : ouverture contrat possible 42 jours avant emménagement. Anticipez pour ne pas être sans connexion ni chauffage.", priorite: "recommande", lien: null },
  { delai: "J-30", action: "Transfert de courrier La Poste", detail: "Réexpédition définitive nationale : 6 mois (55€) ou 12 mois (87€). Tarifs 2026 après hausse de 7,4% au 1er jan 2026. Activable en ligne sur laposte.fr.", priorite: "recommande", lien: "https://www.laposte.fr/demenagement" },
  { delai: "J-30", action: "Prévenir employeur du changement d'adresse", detail: "Bulletin de salaire, mutuelle, prévoyance.", priorite: "obligatoire", lien: null },
  // J-15
  { delai: "J-15", action: "Relever les compteurs (eau, élec, gaz) de l'ancien logement", detail: "Notez les index pour la résiliation/transfert.", priorite: "obligatoire", lien: null },
  { delai: "J-15", action: "Ouvrir les compteurs du nouveau logement", detail: "EDF/Engie en ligne ou par téléphone. Délai mise en service : 2 à 5 jours ouvrables.", priorite: "obligatoire", lien: null },
  { delai: "J-15", action: "Commander les cartons et le matériel", detail: "Estimer 10-15 cartons par pièce. Ne pas oublier : scotch, papier bulle, marqueur.", priorite: "recommande", lien: null },
  // J-Day
  { delai: "J", action: "Signature acte authentique chez le notaire", detail: "Apportez : pièce d'identité, attestation MRH, RIB. Le notaire vous remet les clés.", priorite: "obligatoire", lien: null },
  { delai: "J", action: "Relever les compteurs du nouveau logement", detail: "Notez les index à votre arrivée pour éviter de payer la consommation du vendeur.", priorite: "obligatoire", lien: null },
  // J+7
  { delai: "J+7", action: "Changement d'adresse multi-organismes (JCC)", detail: "Utilisez service-public.gouv.fr (service 'Je change de coordonnées') pour prévenir en une fois : impôts, CPAM, CAF, France Travail, retraite. Inscription électorale automatique si changement de commune. Vous pouvez aussi signaler changement d'email et téléphone. Démarche faisable jusqu'à J+3 mois.", priorite: "obligatoire", lien: "https://www.service-public.gouv.fr/particuliers/vosdroits/F14128" },
  { delai: "J+7", action: "Prévenir le syndic de copropriété", detail: "Si vous achetez en copropriété : transmettez vos coordonnées au syndic pour les appels de charges et convocations AG.", priorite: "obligatoire", lien: null },
  { delai: "J+7", action: "Résilier l'assurance de l'ancien logement", detail: "Si propriétaire de l'ancien : résilier MRH. Si locataire : le bailleur peut exiger le maintien jusqu'à l'état des lieux de sortie.", priorite: "obligatoire", lien: null },
  // J+30
  { delai: "J+30", action: "Mettre à jour la carte grise du véhicule", detail: "Obligatoire dans le mois suivant le déménagement. En ligne sur ants.gouv.fr.", priorite: "obligatoire", lien: "https://ants.gouv.fr/" },
  { delai: "J+30", action: "Mettre à jour les listes électorales", detail: "Inscription automatique si vous avez fait le changement sur service-public.gouv.fr. Sinon, démarche en mairie.", priorite: "optionnel", lien: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1367" },
  { delai: "J+30", action: "Mettre à jour l'identification de l'animal de compagnie", detail: "Si vous avez un animal pucé ou tatoué : mettre à jour l'adresse dans le fichier national d'identification (i-CAD). Obligatoire.", priorite: "recommande", lien: null },
  { delai: "J+30", action: "Demander l'aide au déménagement CAF (si éligible)", detail: "La CAF verse une aide au déménagement sous conditions de ressources et composition familiale. Montant 2026 : 1 147,60€ pour 3 enfants, +95,63€ par enfant supplémentaire. À demander auprès de votre CAF dans les 6 mois suivant l'emménagement.", priorite: "recommande", lien: "https://www.caf.fr" },
  { delai: "J+90 (si neuf)", action: "Demander l'exonération de taxe foncière", detail: "Formulaire H1 (maison) ou H2 (appartement) au centre des impôts dans les 90 jours de l'achèvement.", priorite: "obligatoire", lien: "https://www.impots.gouv.fr/" },
];
