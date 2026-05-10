# ImmoPilot — Restructuration 10 etapes

> Spec validee le 2026-05-09 — Revue Claude + Codex (2 passes)

## Objectif

Passer de 8 a 10 etapes pour mieux couvrir le parcours d'achat immobilier en France. Chaque etape = un jalon clair + une decision a prendre. Ajout d'un bandeau intro, d'un tab Contacts, et de jalons/delivrables par etape.

## Scope

- Restructurer `lib/constants.ts` (ETAPES) de 8 a 10
- Creer 2 nouvelles pages (etapes 3 et 5)
- Renommer/reordonner les pages existantes
- Ajouter le bandeau intro a `step-layout.tsx`
- Ajouter le tab "Contacts" a `step-layout.tsx`
- Mettre a jour les data files (`tips-par-etape.ts`, alertes, etc.)
- Mettre a jour le stepper, dashboard, dossier-financement

## Parcours cible : ancien (residence principale)

Note : le parcours standard vise l'achat dans l'ancien en residence principale. Les variantes (neuf, VEFA, BRS, investissement locatif) seront mentionnees en etape 1 mais pas detaillees dans cette version.

## 1. Structure — 4 phases, 10 etapes

### Phase : Preparer

| # | Slug | Titre | Description | Jalon |
|---|---|---|---|---|
| 1 | `1-projet` | Definir son projet | Situation, budget, zone, type de bien, cadre d'achat | "Je sais ce que je cherche" |
| 2 | `2-budget` | Definir son budget | Capacite d'emprunt, PTZ, aides, frais notaire, budget total reel | "Je connais mon budget reel" |
| 3 | `3-accord-bancaire` | Obtenir son premier feu vert bancaire | Dossier leger, accord de principe, attestation financement | "Je peux prouver mon financement" |

### Phase : Trouver

| # | Slug | Titre | Description | Jalon |
|---|---|---|---|---|
| 4 | `4-recherche` | Rechercher et visiter | Portails, agents, visites multiples, checklist visite | "J'ai une short-list de biens" |
| 5 | `5-analyse` | Verifier et comparer le bien | DPE, diagnostics, copro, prix m2, servitudes, urbanisme | "J'ai valide un bien a cibler" |

### Phase : Acheter

| # | Slug | Titre | Description | Jalon |
|---|---|---|---|---|
| 6 | `6-offre` | Faire une offre | Prix, conditions, negociation, attestation financement jointe | "Mon offre est acceptee" |
| 7 | `7-avant-contrat` | Signer l'avant-contrat | Compromis ou promesse, clauses suspensives, retractation 10j, depot garantie | "Mon achat est encadre juridiquement" |
| 8 | `8-financement` | Obtenir le pret et les assurances | Offre de pret + assurance emprunteur + MRH + PNO si investissement | "Mon financement est securise" |

### Phase : Finaliser & s'installer

| # | Slug | Titre | Description | Jalon |
|---|---|---|---|---|
| 9 | `9-acte` | Signer chez le notaire | Verification acte, frais notaire, remise des cles | "J'ai les cles" |
| 10 | `10-emmenagement` | Emmenager | Demenagement, changement adresse, compteurs, declarations impots | "Je suis chez moi" |

## 2. Phases visuelles

Le stepper affiche les 4 macro-phases au-dessus des 10 etapes :

```
Preparer          Trouver        Acheter         Finaliser
[1]─[2]─[3]      [4]─[5]       [6]─[7]─[8]     [9]─[10]
```

Sur mobile : les phases sont masquees, seuls les cercles numerotes sont visibles.

## 3. Bandeau intro par etape

En haut de chaque etape, sous le titre, un bandeau clair :

```
┌─────────────────────────────────────────────┐
│ Dans cette etape, vous allez [objectif].    │
│ Entree : [ce qu'il faut avant]              │
│ Sortie : [ce qu'on obtient apres]           │
└─────────────────────────────────────────────┘
```

### Contenu par etape

| # | Objectif | Entree | Sortie |
|---|---|---|---|
| 1 | definir votre projet d'achat | votre situation personnelle | une fiche projet claire (type, zone, budget) |
| 2 | connaitre votre budget reel | revenus, charges, apport | capacite d'emprunt + budget total (notaire inclus) |
| 3 | obtenir un premier feu vert de votre banque | vos justificatifs de revenus | une attestation de financement |
| 4 | trouver des biens qui correspondent a votre projet | votre budget et vos criteres | une short-list de biens a analyser |
| 5 | verifier en detail le bien que vous visez | un bien identifie | une decision : je fonce ou je passe |
| 6 | faire une offre d'achat au bon prix | votre analyse du bien + attestation bancaire | une offre acceptee par le vendeur |
| 7 | signer le contrat qui reserve le bien | offre acceptee | compromis signe + delai retractation 10j |
| 8 | obtenir votre pret et souscrire vos assurances | compromis signe | offre de pret + attestation MRH |
| 9 | signer l'acte final chez le notaire | offre de pret acceptee + MRH | cles + titre de propriete |
| 10 | vous installer dans votre nouveau chez-vous | les cles | demarches faites, vous etes chez vous |

## 4. Tab Contacts

Ajouter un 5eme tab "Contacts" dans `TabsContainer` de `step-layout.tsx`.

### Contacts par etape

| # | Contacts |
|---|---|
| 1 | ADIL (conseil gratuit), Mairie (PLU/urbanisme) |
| 2 | Banques (CA, BNP, SG, BP), courtiers (Pretto, Empruntis, CAFPI, Meilleurtaux) |
| 3 | Banque principale, courtier, notaire (1er contact recommande) |
| 4 | Portails (SeLoger, LeBonCoin, PAP, BienIci), agents immobiliers |
| 5 | Diagnostiqueur certifie, DVF Etalab, geometre, syndic copro, notaire |
| 6 | Agent immobilier, notaire (conseil avant offre) |
| 7 | Notaire acheteur, notaire vendeur |
| 8 | Banques, assureurs emprunteur (April, Cardif, Suravenir), comparateurs MRH (Luko, MAIF, Lovys) |
| 9 | Notaire, banque (deblocage fonds) |
| 10 | Demenageurs, La Poste (redirection), EDF/Engie, service-public.fr (changement adresse), centre des impots |

### Structure donnees contacts

```typescript
interface ContactEtape {
  etape: EtapeNumber;
  categorie: "officiel" | "professionnel" | "comparateur" | "portail";
  nom: string;
  description: string;
  url: string | null;
  gratuit: boolean;
}
```

Fichier : `lib/data/contacts-par-etape.ts`

## 5. Jalons / Delivrables

Certaines etapes ont un delivrable concret a generer :

| # | Delivrable | Action |
|---|---|---|
| 2 | Simulation detaillee | Lien vers simulateur credit + PTZ |
| 3 | Dossier de financement PDF | Lien vers `/parcours/dossier-financement` |
| 6 | Modele d'offre d'achat | Generateur existant dans etape offre |
| 8 | Recap financement + assurances | Section resume dans l'etape |

Affiche en bas de l'etape dans un bandeau gradient (card-hero) avec bouton d'action.

## 6. Etape 8 — Sous-sections

L'etape 8 est la plus dense. Organisation en 4 sous-sections dans le tab Outils :

```
8.1 — L'offre de pret
  - Comparateur banques (existant)
  - Delai de reflexion legal : 10 jours
  - Points de negociation (frais dossier, IRA, modularite)

8.2 — Assurance emprunteur
  - Loi Lemoine : delegation a tout moment
  - Economie estimee : 12 000 EUR en moyenne
  - Comparateurs : April, Cardif, Suravenir

8.3 — Assurance habitation (MRH)
  - Obligatoire avant signature notaire
  - Alerte : "Souscrivez au moins 2 semaines avant"
  - Comparateurs : Luko, MAIF, Lovys, Matmut

8.4 — [Conditionnel : investissement] Assurance PNO
  - Obligatoire si bien loue ou vacant
  - A souscrire en meme temps que la MRH
```

## 7. Migration des pages existantes

| Ancienne page | Nouvelle page | Action |
|---|---|---|
| `1-projet/` | `1-projet/` | Renommer, ajouter variantes neuf/VEFA |
| `2-capacite/` | `2-budget/` | Renommer slug, ajouter frais notaire dans budget total |
| — | `3-accord-bancaire/` | **CREER** — nouvelle etape |
| `3-recherche/` | `4-recherche/` | Renumeroter |
| — | `5-analyse/` | **CREER** — extraire analyse de l'ancienne etape 3 |
| `4-offre/` | `6-offre/` | Renumeroter |
| `5-compromis/` | `7-avant-contrat/` | Renommer slug + titre |
| `6-financement/` | `8-financement/` | Renommer, ajouter MRH + PNO |
| `7-notaire/` | `9-acte/` | Renommer slug |
| `8-post-achat/` | `10-emmenagement/` | Renommer slug |

## 8. Fichiers a modifier

### Nouveaux fichiers

| Fichier | Description |
|---|---|
| `lib/data/contacts-par-etape.ts` | Contacts par etape (10 etapes) |
| `lib/data/bandeaux-intro.ts` | Texte intro par etape (objectif, entree, sortie) |
| `app/parcours/3-accord-bancaire/page.tsx` | Nouvelle etape 3 |
| `app/parcours/3-accord-bancaire/layout.tsx` | Metadata etape 3 |
| `app/parcours/5-analyse/page.tsx` | Nouvelle etape 5 |
| `app/parcours/5-analyse/layout.tsx` | Metadata etape 5 |

### Fichiers a modifier

| Fichier | Modification |
|---|---|
| `lib/constants.ts` | ETAPES: 8 → 10 items, nouveaux slugs |
| `lib/types.ts` | EtapeNumber: ajouter 9, 10 |
| `lib/selectors.ts` | getCompletedSteps: REDEFINER toutes les regles 1-10 |
| `lib/data/tips-par-etape.ts` | Ajouter tips etapes 3, 5, renuméroter |
| `components/parcours/step-layout.tsx` | Ajouter bandeau intro + tab Contacts |
| `components/ui/stepper.tsx` | Supporter 10 etapes + phases visuelles |
| `app/parcours/page.tsx` | Dashboard: 10 etapes |
| `app/parcours/dossier-financement/page.tsx` | Adapter aux 10 etapes |
| Toutes les pages etapes existantes | Renumeroter, renommer slugs |
| `components/ui/progress-bar.tsx` | Supporter 10 etapes (plus hardcode "8") |
| `app/sitemap.ts` | Mettre a jour avec les 10 nouveaux slugs |
| `app/robots.ts` | Verifier coherence |
| `next.config.ts` | Ajouter redirections 301 |
| `lib/alertes.ts` | Mettre a jour les numeros d'etape dans les alertes |
| `lib/storage.ts` | Ajouter migration localStorage 8→10 |
| `tests/lib/selectors.test.ts` | Reecrire pour les 10 etapes |

## 9. Migration localStorage (8 → 10 etapes)

Les anciens projets en localStorage ont des donnees indexees sur 8 etapes. Il faut une migration transparente.

### Strategie

Ajouter un champ `schema_version` au projet :

```typescript
// Dans ProjetImmobilier
schema_version: number; // 1 = 8 etapes, 2 = 10 etapes
```

Dans `loadProjet()`, detecter la version et migrer :

```typescript
function migrateProjet(p: ProjetImmobilier): ProjetImmobilier {
  if ((p.schema_version ?? 1) >= 2) return p;

  // Mapper les anciennes etapes vers les nouvelles
  // Ancien 1 → Nouveau 1, Ancien 2 → Nouveau 2
  // Ancien 3 → Nouveau 4 (recherche)
  // Ancien 4 → Nouveau 6 (offre)
  // Ancien 5 → Nouveau 7 (avant-contrat)
  // Ancien 6 → Nouveau 8 (financement)
  // Ancien 7 → Nouveau 9 (acte)
  // Ancien 8 → Nouveau 10 (emmenagement)

  const ETAPE_MAP: Record<number, number> = {
    1: 1, 2: 2, 3: 4, 4: 6, 5: 7, 6: 8, 7: 9, 8: 10,
  };

  // Migrer etape_courante
  p.etape_courante = ETAPE_MAP[p.etape_courante] ?? 1;

  // Migrer checklists
  const newChecklists: Record<number, boolean[]> = {};
  for (const [key, val] of Object.entries(p.checklists ?? {})) {
    const newKey = ETAPE_MAP[Number(key)];
    if (newKey) newChecklists[newKey] = val;
  }
  p.checklists = newChecklists;

  p.schema_version = 2;
  return p;
}
```

### Cles localStorage annexes

Les cles suivantes doivent etre conservees telles quelles (pas indexees par numero d'etape) :
- `immopilot_checklist_visite`
- `immopilot_clauses_checked`
- `immopilot_docs_compromis_checked`
- `immopilot_comparateur_banques`
- `immopilot_jour_j_checked`
- `immopilot_post_achat_checked`

## 10. Redirections 301

Ajouter dans `next.config.ts` :

```typescript
async redirects() {
  return [
    { source: "/parcours/2-capacite", destination: "/parcours/2-budget", permanent: true },
    { source: "/parcours/3-recherche", destination: "/parcours/4-recherche", permanent: true },
    { source: "/parcours/4-offre", destination: "/parcours/6-offre", permanent: true },
    { source: "/parcours/5-compromis", destination: "/parcours/7-avant-contrat", permanent: true },
    { source: "/parcours/6-financement", destination: "/parcours/8-financement", permanent: true },
    { source: "/parcours/7-notaire", destination: "/parcours/9-acte", permanent: true },
    { source: "/parcours/8-post-achat", destination: "/parcours/10-emmenagement", permanent: true },
  ];
}
```

## 11. Regles de completion (10 etapes)

| Etape | Complete quand |
|---|---|
| 1 | revenus_net > 0 ET commune non vide ET budget_max > 0 |
| 2 | capacite_emprunt > 0 ET eligible_ptz est calcule |
| 3 | capacite_emprunt > 0 (accord de principe = capacite validee) |
| 4 | au moins 1 dossier cree |
| 5 | au moins 1 dossier avec surface > 0 ET prix > 0 |
| 6 | au moins 1 dossier avec offre non null |
| 7 | au moins 1 dossier avec compromis signe |
| 8 | au moins 1 dossier avec financement taux_obtenu |
| 9 | au moins 1 dossier avec notaire date_acte |
| 10 | checklist post-achat >= 50% completee |

## 12. Hors scope

- Parcours neuf/VEFA/BRS detaille (juste mentionne en etape 1)
- Investissement locatif detaille (juste PNO conditionnel en etape 8)
- Connexion Supabase
- API IA
