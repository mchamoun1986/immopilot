# ImmoPilot - Design Spec

> Derniere mise a jour : 2026-05-08 — Revue Codex appliquee

## Vision

Plateforme web gratuite qui accompagne les primo-accedants dans l'achat immobilier en France, etape par etape. Contenu educatif + outils interactifs + mise en relation avec des professionnels. Objectif final : acquisition par un acteur immobilier.

## Modele business

### Utilisateur = gratuit, zero friction

Pas de compte utilisateur classique. Session anonyme cote navigateur (localStorage pour l'etat leger du parcours). Documents et dossiers stockes sur Supabase Storage apres consentement email. L'email sert d'identifiant leger pour la continuite cross-device (lien de reprise par email, pas de mot de passe).

Capture lead simple (email, telephone, nom, prenom, ville) aux moments cles du parcours.

### Funnel de monetisation

Le revenu depend du taux de conversion a chaque etape du funnel, pas d'une somme brute par utilisateur.

| Etape funnel | Taux estime | Exemple pour 10 000 visiteurs/mois |
|---|---|---|
| Visiteur → email lead (simulateur, analyse) | 8-12% | 800-1200 emails |
| Email lead → lead qualifie (tel + nom + ville) | 15-25% | 120-300 leads qualifies |
| Lead qualifie → transmis a un pro | 60-80% | 72-240 leads routes |
| Lead route → accepte par le pro | 50-70% | 36-168 leads acceptes |
| Lead accepte → deal conclu | 10-30% | 4-50 conversions |

### Revenus par canal

| Canal | Mecanisme | Revenu estime/lead transmis | Revenu si conversion |
|---|---|---|---|
| Courtier credit | Lead qualifie (email+tel+ville+projet) | 20-40 EUR | 200-500 EUR (rev-share sur dossier finance) |
| Assurance emprunteur | Affiliation (delegation loi Lemoine) | 5-10 EUR | 30-50 EUR / souscription |
| Agent immobilier / mandataire | Abonnement mensuel + lead | 15-30 EUR | Variable |
| Artisans / travaux | Lead a la performance | 15-40 EUR | 20-80 EUR |
| Diagnostiqueur | Lead | 10-20 EUR | — |
| Assurance habitation | Affiliation | 5-10 EUR | 20-40 EUR / souscription |
| Demenagement | Lead | 10-20 EUR | — |
| Energie / telecom | Affiliation | 5-10 EUR | 10-20 EUR |
| Renovation energetique (DPE) | Lead qualifie | 20-50 EUR | 50-100 EUR |

Estimation conservatrice : **30-80 EUR de revenu moyen par lead qualifie** en mix, potentiel de **200+ EUR par utilisateur converti** sur les canaux premium (courtier, assurance, renovation).

### Freemium V2

Comparaison de dossiers cote a cote et analyses IA avancees = fonctionnalites payantes futures.

## Cible

**Primo-accedant en France** : premiere acquisition, ne connait pas le processus, a besoin d'etre guide de A a Z. France entiere. V1 ciblee exclusivement sur la residence principale.

Investisseur locatif prevu en V2 avec parcours dedie.

## Stack technique

| Couche | Choix |
|---|---|
| Framework | Next.js (App Router) — SSG pour SEO + client-side pour app |
| Styling | Tailwind CSS |
| DB | Supabase PostgreSQL — leads, dossiers, pros, routage |
| Storage fichiers | Supabase Storage — photos, documents uploades (apres consentement email) |
| Identite | Session anonyme (UUID localStorage) + email comme identifiant leger (lien de reprise, pas de mot de passe) |
| Deploiement | Vercel |
| IA | API Claude/OpenAI pour analyse de dossiers |
| Donnees marche | API DVF (data.gouv.fr) — prix m2 par commune/section cadastrale. Limites : donnees semestrielles, exclut Alsace-Moselle-Mayotte, granularite = section cadastrale (pas quartier). Agregats caches cote serveur. Taux moyens maintenus manuellement. |
| Stockage local | localStorage uniquement pour etat leger du parcours (etape courante, profil, preferences). Pas de fichiers/photos en local. |

## Conformite RGPD

| Obligation | Implementation |
|---|---|
| Base legale | Consentement explicite avant toute collecte (email, tel, nom) |
| Information | Bandeau + page mentions legales : quelles donnees, pourquoi, combien de temps, quels partenaires |
| Consentement partenaires | Checkbox explicite : "J'accepte d'etre mis en relation avec un courtier/agent/artisan partenaire" |
| Droit d'acces/rectification/suppression | Lien dans chaque email + page dediee /mes-donnees |
| Retention | Leads non convertis supprimes apres 12 mois. Dossiers inactifs apres 24 mois. |
| Revocation | Un clic pour retirer son consentement et supprimer ses donnees |
| Sous-traitants | Supabase (hebergement EU), Vercel, API IA — documentes dans la politique de confidentialite |

Champ `consent_partners` et `consent_date` obligatoires dans la table leads.

## Identite visuelle

| Element | Valeur |
|---|---|
| Nom | ImmoPilot |
| Couleurs primaires | Bleu marine (#1a365d) + Rouge francais (#c1272d) + Blanc (#ffffff) |
| Bleu secondaire | #2563eb (liens, elements interactifs) |
| Ambiance | Sobre, institutionnel mais moderne — service public premium |
| Typo | Sans-serif moderne (Inter ou similaire) |
| Imagerie | Architecture francaise, immeubles haussmanniens, villes francaises |
| Ton | Expert mais accessible, rassurant, jamais condescendant |

## Architecture du projet

```
27_IMMOPILOT/
├── app/
│   ├── (marketing)/              # Pages SEO publiques
│   │   ├── page.tsx              # Homepage
│   │   ├── guides/               # Articles/guides SEO
│   │   ├── outils/               # Outils gratuits standalone
│   │   └── mentions-legales/     # RGPD, politique confidentialite
│   │
│   ├── parcours/                 # Parcours guide (8 etapes)
│   │   ├── layout.tsx            # Navigation etapes + progress bar
│   │   ├── page.tsx              # Dashboard vertical timeline
│   │   ├── 1-projet/             # Definir son projet
│   │   ├── 2-capacite/           # Capacite d'emprunt
│   │   ├── 3-recherche/          # Rechercher un bien
│   │   ├── 4-offre/              # Faire une offre
│   │   ├── 5-compromis/          # Compromis de vente
│   │   ├── 6-financement/        # Obtenir le financement
│   │   ├── 7-notaire/            # Acte authentique
│   │   └── 8-post-achat/         # Post-achat
│   │
│   ├── dossiers/                 # Gestion des dossiers biens
│   │   ├── page.tsx              # Liste des dossiers
│   │   ├── [id]/                 # Detail d'un dossier
│   │   └── comparer/             # Comparaison (V2 payant)
│   │
│   ├── mes-donnees/              # Page RGPD : acces, suppression, revocation
│   │
│   ├── api/
│   │   ├── analyse/              # Analyse IA d'un dossier
│   │   ├── leads/                # Capture et routage leads
│   │   └── data/                 # Prix m2 (DVF cache), taux
│   │
│   └── layout.tsx                # Layout global (header, footer)
│
├── components/
│   ├── simulateurs/              # Simulateur credit, PTZ, frais notaire
│   ├── formulaires/              # Lead capture, profil, dossier
│   ├── ui/                       # Composants UI reutilisables
│   └── parcours/                 # Progress bar, navigation etapes
│
├── lib/
│   ├── storage.ts                # localStorage (etat leger) + sync Supabase
│   ├── analyse.ts                # Logique appel IA
│   ├── calculateurs.ts           # Moteurs de calcul (credit, notaire, PTZ)
│   ├── dvf.ts                    # Client API DVF + cache serveur
│   └── data/                     # Donnees statiques (baremes, taux, seuils)
│
├── supabase/
│   ├── migrations/               # Schema DB
│   └── seed.sql                  # Donnees de reference
│
└── public/
    └── images/
```

## Modele de donnees

Restructure en entites distinctes : le profil acheteur est separe des biens, et chaque bien porte sa propre transaction.

```typescript
// Profil acheteur + parametres du projet
interface ProjetImmobilier {
  id: string                    // UUID genere cote client

  // Profil acheteur (Etape 1)
  situation: "celibataire" | "couple" | "famille"
  age: number
  revenus_net: number           // mensuel
  revenus_conjoint: number | null
  charges_fixes: number         // credits en cours, pensions, etc.
  type_contrat: "cdi" | "cdd" | "independant" | "fonctionnaire" | "autre"
  taille_foyer: number          // nb personnes
  apport: number
  code_postal: string           // pour PTZ, DVF, routage pros
  commune: string
  type_bien: "appartement" | "maison"
  usage: "residence_principale" // V1 uniquement RP
  budget_max: number

  // Capacite calculee (Etape 2)
  capacite_emprunt: number
  taux_endettement: number
  eligible_ptz: boolean
  montant_ptz: number
  duree_souhaitee: number       // annees

  // Dossiers biens (Etape 3+)
  dossiers: DossierBien[]

  // Meta
  etape_courante: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  progression: { etape: number; pct: number }[]
  alertes: Alerte[]
  date_creation: string
  lead_captured: boolean
}

// Un bien envisage + sa transaction
interface DossierBien {
  id: string

  // Infos bien
  adresse: string
  code_postal: string
  commune: string
  prix: number
  surface: number
  pieces: number
  etage: number | null
  exposition: string | null      // "sud", "nord", etc.
  type_chauffage: string | null
  annee_construction: number
  url_annonce: string | null
  type_copro: boolean            // true = copropriete
  nb_lots_copro: number | null

  // DPE / Energie
  dpe_energie: "A" | "B" | "C" | "D" | "E" | "F" | "G"
  dpe_ges: "A" | "B" | "C" | "D" | "E" | "F" | "G" | null
  audit_energetique_present: boolean  // obligatoire si E/F/G monopropriete

  // Financier
  charges_copro: number
  taxe_fonciere: number

  // Documents uploades (refs Supabase Storage)
  documents: { nom: string; type: string; url: string }[]

  // Visite
  checklist_visite: { item: string; ok: boolean }[]
  date_visite: string | null
  notes_visite: string | null

  // Transaction (avance avec les etapes)
  offre: {
    montant: number | null
    date: string | null
    date_expiration: string | null
    statut: "brouillon" | "envoyee" | "acceptee" | "refusee" | null
  } | null

  compromis: {
    signe: boolean
    date_signature: string | null
    date_retractation: string | null    // calcule J+10
    depot_garantie: number | null
    clauses_suspensives: string[]
    date_limite_financement: string | null
    date_limite_acte: string | null
  } | null

  financement: {
    banque: string | null
    taux_obtenu: number | null
    assurance_taux: number | null
    mensualite: number | null
    duree: number | null
    type_garantie: "caution" | "hypotheque" | null
  } | null

  notaire: {
    frais_estimes: number
    date_acte: string | null
    notaire_acheteur: string | null
    notaire_vendeur: string | null
  } | null

  // Analyse IA
  analyse_ia: RapportAnalyse | null
  score: number                  // calcule

  // Statut
  statut: "en_recherche" | "offre" | "compromis" | "financement" | "acte" | "termine" | "abandonne"
}

interface Alerte {
  type: "economie" | "attention" | "danger" | "astuce" | "checklist"
  message: string
  detail: string
  etape: number
  severity: "info" | "warning" | "danger"
  source_reglementaire: string | null  // ref legale ou URL service-public.fr
  date_effet: string | null            // date d'entree en vigueur de la regle
}

interface RapportAnalyse {
  score_global: number           // 0-100
  prix_vs_marche: string         // "au-dessus +12%", "aligne", "en-dessous -5%"
  alertes: Alerte[]
  recommandations: string[]
  points_forts: string[]
  points_vigilance: string[]
  date_analyse: string
}
```

## Flux de donnees

```
Utilisateur navigue librement
  → localStorage stocke : id session, etape courante, profil acheteur
    → Chaque etape lit et enrichit le meme objet
      → Documents/photos → upload direct Supabase Storage (apres consentement)
        → Quand lead capture (email + tel + nom + ville + consentement) :
          → Sync complete vers Supabase (leads + dossiers + projet)
            → API route les leads qualifies vers les pros partenaires
              → Email de confirmation + lien de reprise au lead
```

## Homepage — Structure

```
1. HERO
   "Votre premier achat immobilier, etape par etape"
   4 boutons situation : Je reflechis | Je cherche | J'ai trouve | Je finalise
   → Route vers l'etape correspondante

2. SOCIAL PROOF
   "X utilisateurs accompagnes" + avis

3. PARCOURS VISUEL
   Les 8 etapes avec icones et progress bar
   "Tout ce qu'il faut savoir, au bon moment"

4. OUTILS GRATUITS
   3 cards cliquables : Simulateur credit | Frais de notaire | Eligibilite PTZ

5. TIPS PREVIEW
   "Ce que personne ne vous dit" — 3 tips d'expert

6. CTA FINAL
   "Commencez votre projet gratuitement"
```

## Dashboard — Layout vertical timeline

En haut : KPIs (budget, capacite, dossiers, etape courante).
En dessous : timeline verticale des 8 etapes avec etat (fait / en cours / a venir).
Alertes contextuelles en bas.
Navigation vers chaque etape au clic.

## Vue detail etape — Pattern commun

Chaque etape suit le meme pattern :

| Section | Contenu |
|---|---|
| Progress bar | Position dans le parcours |
| Guide | Contenu educatif, reglementation, ce qu'il faut savoir |
| Outils | Simulateurs et calculateurs interactifs |
| Tips expert | Conseils contextuels (economie, attention, astuce) |
| Checklist | Points a valider avant de passer a la suite |
| Pros | CTA mise en relation (= gate lead) |
| Alertes | Risques detectes selon les donnees du projet |
| Navigation | Etape precedente / suivante |

## Detail des 8 etapes

### Etape 1 — Definir son projet

- **Outils** : Quiz profil acheteur (situation, revenus, charges, contrat, taille foyer, apport, commune, type de bien)
- **Guide** : Types de biens, neuf vs ancien, budget reel = prix + 10-15% frais annexes
- **Tips** : Verifier eligibilite Pret Action Logement (30 000 EUR a 1% — salaries d'entreprises > 10 personnes, sous conditions de ressources)
- **Gate lead** : Aucune (zero friction a l'entree)

### Etape 2 — Evaluer sa capacite d'emprunt

- **Outils** : Simulateur credit (mensualites, duree, taux), calcul PTZ, taux endettement, budget total reel
- **Guide** : Regle HCSF 35% max d'endettement (incluant tous les credits en cours), reste a vivre, stabilite professionnelle
- **Tips** : Negocier taux assurance (10-15k economie), lissage prets, apport 10% minimum
- **Gate lead** : "Recevez votre simulation detaillee par email"

### Etape 3 — Rechercher un bien

- **Outils** : Checklist visite (50+ points), guide DPE, points copro, creation de dossier bien
- **Guide** : Ou chercher, comment visiter, que verifier, documents a demander selon le type de bien
- **Tips** : Demander 3 derniers PV AG, verifier PLU, visiter a differentes heures, demander quittance de charges reelle
- **Gate lead** : Aucune

### Etape 4 — Faire une offre

- **Outils** : Analyse prix m2 par commune (DVF), generateur lettre d'offre, guide negociation, estimateur travaux
- **Guide** : Offre ecrite vs orale, engagement juridique, delais, offre non-engageante juridiquement (seul le compromis engage)
- **Tips** : Offrir 5-10% en dessous si > 3 mois en vente, ne pas reveler son budget, sous-parcours travaux si besoin
- **Gate lead** : "Comparez avec les prix du marche" → email

### Etape 5 — Compromis de vente

- **Outils** : Guide clauses suspensives, checklist documents par type de bien, calendrier delais legaux
- **Guide** : Clause suspensive de pret (incluse par defaut quand achat finance par emprunt — le vendeur peut demander sa suppression, ne jamais accepter sauf achat cash), depot de garantie (5-10% chez le notaire), delai retractation 10 jours calendaires (SRU)
- **Tips** : Clause substitution SCI, depot chez le notaire pas l'agence, clause travaux < X EUR apres diagnostic
- **Gate lead** : Aucune

### Etape 6 — Obtenir le financement

- **Outils** : Comparateur assurance emprunteur, guide delegation (loi Lemoine — changement a tout moment sans frais), checklist dossier banque
- **Guide** : Comment negocier, quelles banques, garantie caution (Credit Logement) vs hypotheque
- **Tips** : Negocier IRA (suppression/plafonnement), frais dossier (souvent supprimables), 3 banques minimum, caution = moins cher + remboursement partiel
- **Gate lead** : "Etre mis en relation avec un courtier" → email + tel + nom + ville + consentement explicite

### Etape 7 — Acte authentique (notaire)

- **Outils** : Calculateur frais de notaire (ancien ~7-8%, neuf ~2-3%), checklist jour J, guide frais annexes
- **Guide** : Deroulement signature, role du notaire, servitudes, droit preemption mairie, droit de choisir son propre notaire (sans surcout — partage des honoraires)
- **Tips** : Frais negotiables sur emoluments pour biens > 150k, demander decompte detaille avant signature
- **Gate lead** : Aucune

### Etape 8 — Post-achat

- **Outils** : Checklist demenagement, guide assurance habitation, declarations fiscales, aide travaux
- **Guide** : Que faire apres les cles, delais administratifs, garanties (vices caches, decennale si < 10 ans)
- **Tips** : Exoneration taxe fonciere possible 2 ans pour le neuf (conditionnelle, sur declaration dans les 90 jours, peut etre reduite/supprimee par la commune), assurance habitation AVANT remise des cles, garder tous justificatifs travaux pour plus-value future
- **Gate lead** : "Devis assurance habitation" → email, contacts demenageurs/artisans

## Documents obligatoires par type de bien

### Appartement en copropriete

| Document | Qui le fournit | Quand |
|---|---|---|
| Reglement de copropriete | Syndic / vendeur | Avant compromis |
| Fiche synthetique copropriete | Syndic | Avant compromis |
| 3 derniers PV d'AG | Syndic | Avant compromis |
| Carnet d'entretien immeuble | Syndic | Avant compromis |
| Etat date (charges, dettes) | Syndic | Avant compromis |
| Plan Pluriannuel de Travaux (PPT) | Syndic (obligatoire progressivement 2023-2025 selon taille) | Avant compromis |
| DTG si immeuble > 10 ans | Syndic | Si disponible |
| Tous diagnostics obligatoires | Vendeur | Annexes au compromis |

### Maison individuelle

| Document | Qui le fournit | Quand |
|---|---|---|
| Titre de propriete | Vendeur / notaire | Avant compromis |
| Cadastre + plan de bornage | Geometre / cadastre.gouv.fr | Avant compromis |
| Assainissement (si non-collectif) | SPANC | Moins de 3 ans |
| Audit energetique (si DPE E/F/G) | Diagnostiqueur certifie | Obligatoire pour la vente |
| Tous diagnostics obligatoires | Vendeur | Annexes au compromis |
| Carnet d'information du logement | Vendeur (si travaux depuis 2023) | A la vente |

### VEFA (Vente en l'Etat Futur d'Achevement)

| Document | Qui le fournit | Quand |
|---|---|---|
| Contrat de reservation | Promoteur | A la reservation |
| Plans et descriptif technique | Promoteur | Avant contrat |
| Attestation garantie financiere d'achevement (GFA) | Promoteur | Avant contrat |
| Acte de vente notarie | Notaire | A la signature |
| Garanties : parfait achevement (1 an), biennale (2 ans), decennale (10 ans) | Promoteur | A la livraison |

## Sous-parcours dynamiques

Actives automatiquement selon les donnees du projet :

| Trigger | Sous-parcours | Contenu |
|---|---|---|
| DPE E/F/G | Renovation energetique | Audit energetique obligatoire (monopropriete), aides (MaPrimeRenov, CEE, eco-PTZ), artisans RGE, budget, impact sur valeur |
| Travaux declares | Chiffrage travaux | Estimateur par poste, devis, contacts artisans, impact budget global |
| Copro avec travaux votes | Travaux copropriete | Decryptage PV AG, estimation appels de fonds, calendrier, PPT |
| Bien neuf / VEFA | Achat neuf | Garanties (GFA, parfait achevement, biennale, decennale), reception, reserves, echeancier paiement |

## Systeme de dossiers

L'utilisateur peut creer un dossier pour chaque bien qu'il envisage :

- **Infos du bien** : adresse, prix, surface, pieces, etage, DPE (energie + GES), charges, taxe fonciere, type copro, annee construction
- **Upload documents** : photos, annonce, diagnostics → Supabase Storage (apres consentement email)
- **Checklist visite** : points verifies / a verifier
- **Transaction** : offre, compromis, financement, notaire — chaque etat lie au dossier, pas au projet
- **Analyse IA** : rapport automatique (alertes, recommandations, score, prix vs marche)
- **Comparaison** : cote a cote de 2-3 dossiers (V2 payant)

Stockage : etat leger en localStorage. Documents sur Supabase Storage. Sync complete apres capture email (lien de reprise par email pour continuite cross-device).

## Analyse IA des dossiers

Pas de chatbot. L'IA analyse les donnees du dossier et genere un rapport structure :

- Score global du bien (0-100)
- Prix vs marche local (au-dessus / en dessous / aligne) — base DVF commune
- Points forts identifies
- Points de vigilance (DPE, charges, anciennete, zone, copro)
- Alertes reglementaires avec references legales et dates d'effet
- Recommandations (negocier X, verifier Y, prevoir Z)

Le rapport est le gate lead principal : "Recevez votre analyse complete par email".

## Base de connaissances reglementaire

Tout contenu reglementaire porte une `date_effet` et une `source` (URL service-public.fr ou legifrance.gouv.fr).

### Diagnostics obligatoires (vente)

| Diagnostic | Condition | Source |
|---|---|---|
| DPE | Toujours obligatoire | service-public.fr/F16096 |
| Amiante | Permis de construire delivre avant le 1er juillet 1997 | service-public.fr/F10798 |
| Plomb (CREP) | Construction avant 1949 | service-public.fr/F10798 |
| Termites | Zones a arrete prefectoral | service-public.fr/F10798 |
| Gaz | Installation > 15 ans | service-public.fr/F10798 |
| Electricite | Installation > 15 ans | service-public.fr/F10798 |
| ERP (Etat des Risques et Pollutions) | Toujours obligatoire | service-public.fr/F12239 |
| Assainissement non-collectif | Si pas de tout-a-l'egout | service-public.fr/F31685 |
| Bruit | Zone d'exposition au bruit des aeroports | service-public.fr/F10798 |
| Audit energetique | Monoproprietes DPE F/G (depuis 2023), DPE E (depuis 2025) | service-public.fr/F16096 |

Note : la merule n'est PAS un diagnostic obligatoire. C'est une obligation d'information dans les zones a risque (arrete prefectoral). L'acquereur doit etre informe mais aucun diagnostic formel n'est impose au vendeur.

### Reglementation DPE (mise a jour 2026)

Le DPE classe le bien sur DEUX axes : consommation energetique ET emissions GES. La classe finale = la plus mauvaise des deux.

Depuis le 1er janvier 2026 : coefficient de conversion electricite passe de 2.3 a 1.9, ce qui peut ameliorer la classe DPE de certains logements tout-electrique.

Depuis le 1er juillet 2024 : ajustement des seuils pour les petites surfaces (≤ 40 m2) — coefficient correcteur applicable.

| Classe | Conso energie (kWh/m2/an) | Restrictions | Date d'effet |
|---|---|---|---|
| A | < 70 | Aucune | — |
| B | 70-110 | Aucune | — |
| C | 110-180 | Aucune | — |
| D | 180-250 | Travaux recommandes | — |
| E | 250-330 | Gel des loyers depuis 2022, audit energetique obligatoire a la vente (monopropriete) depuis 2025, interdiction location 2034 | 2022 / 2025 / 2034 |
| F | 330-420 | Gel des loyers, interdiction location 2028 | 2022 / 2028 |
| G | > 420 | Interdit a la location depuis 2025 | 2025 |

### Copropriete

Charges courantes (ratio > 50 EUR/m2/an = eleve), fonds travaux (loi ALUR, 5% budget previsionnel), travaux votes non appeles, procedures en cours, carnet d'entretien, DTG, Plan Pluriannuel de Travaux (PPT — obligatoire progressivement 2023-2025 selon taille copro). Fiche synthetique obligatoire.

### Urbanisme

PLU (Plan Local d'Urbanisme), cadastre, droit de preemption, zone inondable (PPRI via georisques.gouv.fr), monuments historiques (perimetre ABF), nuisances (antennes, lignes THT, ICPE).

### Aspects financiers et fiscaux

- **PTZ** : zones eligibles, plafonds, conditions de ressources (economie.gouv.fr)
- **Pret Action Logement** : 30 000 EUR max a 1% (conditions mises a jour — actionlogement.fr), salaries d'entreprises > 10 personnes
- **Frais de notaire** : ancien 7-8%, neuf 2-3% (le "neuf" inclut VEFA < 5 ans non habitee)
- **Taxe fonciere** : variable par commune, verifier montant reel
- **Plus-value** : exoneree si residence principale. Investissement : 19% + 17.2% PS, degressive apres 6 ans de detention
- **Loi Lemoine** : changement assurance emprunteur a tout moment, sans frais, sans delai
- **Garantie vices caches** : action possible dans les 2 ans a compter de la decouverte du vice (pas de la vente)
- **Garantie decennale** : 10 ans sur le gros oeuvre (neuf ou extension) — demander attestation si construction < 10 ans

## Systeme de tips

4 types de tips contextuels apparaissant selon les donnees du projet :

| Type | Style visuel | Exemple |
|---|---|---|
| Astuce | Encart bleu | "Vous pouvez changer d'assurance emprunteur a tout moment (loi Lemoine)" |
| Attention | Encart orange | "La clause suspensive de pret protege l'acquereur — ne la supprimez pas sans conseil juridique" |
| Alerte critique | Encart rouge | "DPE G : interdit a la location depuis le 1er janvier 2025" |
| Economie | Encart vert | "Negocier les IRA peut vous economiser 2-5k EUR en cas de revente anticipee" |

Chaque tip porte une `source_reglementaire` et une `date_effet` pour maintenir la credibilite.

## Ecosysteme de pros — Points de capture lead

| Moment du parcours | Pro connecte | Donnees captees |
|---|---|---|
| Simulation credit detaillee | Courtier | Email |
| Analyse prix marche (DVF) | Agent immobilier | Email |
| Mise en relation courtier | Courtier partenaire | Email + tel + nom + ville + consentement |
| Analyse IA dossier | Retention (email pour recevoir le rapport) | Email |
| Estimateur travaux | Artisans / plateformes devis | Email + ville + consentement |
| Diagnostics necessaires | Diagnostiqueur | Email + ville + consentement |
| Devis assurance habitation | Assureur | Email + consentement |
| Demenagement | Demenageur | Email + ville + consentement |
| Renovation energetique | Entreprise RGE | Email + ville + consentement |

## Points de capture lead strategiques

Les gates lead sont placees aux moments ou l'utilisateur recoit de la valeur :

1. Etape 2 : "Recevez votre simulation detaillee par email"
2. Etape 4 : "Comparez avec les prix du marche"
3. Etape 6 : "Etre mis en relation avec un courtier" (lead principal)
4. Dossier : "Recevez votre analyse IA complete par email"
5. Etape 8 : "Devis assurance habitation"
6. Sauvegarde : "Sauvegardez votre projet" → email pour lien de reprise

## Supabase — Schema DB

```sql
-- Leads captures (avec RGPD)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,             -- UUID localStorage pour deduplication
  email TEXT NOT NULL,
  telephone TEXT,
  nom TEXT,
  prenom TEXT,
  ville TEXT,
  code_postal TEXT,
  source TEXT NOT NULL,                  -- 'simulation', 'courtier', 'analyse', etc.
  etape INTEGER,
  donnees_projet JSONB,                  -- snapshot du ProjetImmobilier
  consent_partners BOOLEAN NOT NULL DEFAULT FALSE,
  consent_date TIMESTAMPTZ,
  consent_revoked_at TIMESTAMPTZ,
  qualification TEXT DEFAULT 'brut',     -- 'brut', 'qualifie', 'transmis', 'converti'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, source)                  -- deduplication par source
);

-- Dossiers biens synces
CREATE TABLE dossiers (
  id UUID PRIMARY KEY,                   -- meme UUID que cote client
  lead_id UUID REFERENCES leads(id),
  email TEXT NOT NULL,
  adresse TEXT,
  commune TEXT,
  code_postal TEXT,
  prix NUMERIC,
  surface NUMERIC,
  dpe_energie TEXT,
  dpe_ges TEXT,
  statut TEXT DEFAULT 'en_recherche',
  donnees JSONB NOT NULL,                -- DossierBien complet
  analyse_ia JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents uploades (refs vers Supabase Storage)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id UUID REFERENCES dossiers(id),
  nom TEXT NOT NULL,
  type TEXT NOT NULL,                    -- 'photo', 'diagnostic', 'annonce', 'pv_ag', etc.
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pros partenaires
CREATE TABLE pros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,                    -- 'courtier', 'agent', 'notaire', 'artisan', 'diagnostiqueur', etc.
  nom TEXT NOT NULL,
  entreprise TEXT,
  email TEXT,
  telephone TEXT,
  ville TEXT,
  departement TEXT,
  code_postal TEXT,
  abonnement_actif BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routage leads → pros (avec suivi)
CREATE TABLE lead_routage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  pro_id UUID REFERENCES pros(id),
  statut TEXT DEFAULT 'envoye',          -- 'envoye', 'vu', 'contacte', 'converti', 'refuse'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## SEO — Pages cles

### Outils standalone (trafic Google)

- `/outils/simulateur-credit-immobilier` — "simulateur credit immobilier"
- `/outils/frais-de-notaire` — "calcul frais de notaire"
- `/outils/eligibilite-ptz` — "eligibilite PTZ 2026"
- `/outils/taux-endettement` — "calcul taux endettement"

### Guides SEO (contenu long)

- `/guides/acheter-premier-appartement` — "acheter premier appartement"
- `/guides/etapes-achat-immobilier` — "etapes achat immobilier"
- `/guides/dpe-classes-energetiques` — "DPE classes energetiques 2026"
- `/guides/frais-notaire-ancien-neuf` — "frais notaire ancien neuf"
- `/guides/clause-suspensive-compromis` — "clause suspensive compromis"
- `/guides/negocier-pret-immobilier` — "negocier pret immobilier"
- `/guides/pret-taux-zero-conditions` — "PTZ conditions 2026"
- `/guides/documents-achat-copropriete` — "documents achat copropriete"
- `/guides/audit-energetique-obligatoire` — "audit energetique vente obligatoire"

### Pages par ville (V2 — programmatic SEO)

- `/acheter/lyon` — "acheter appartement Lyon"
- `/acheter/paris` — "acheter appartement Paris"
- etc.

## Objectif de lancement

Produit complet avec les 8 etapes, tous les outils, dossiers, analyse IA, contenu SEO, conformite RGPD.

## Objectif final

Acquisition de la plateforme par un acteur immobilier (reseau d'agences, portail immo, courtier national). Le produit doit etre clean, scalable, avec des metrics solides (utilisateurs, leads, conversion).
