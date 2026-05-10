# ImmoPilot — Agents Experts Immobilier

**Date :** 2026-05-08
**Statut :** Draft
**Projet :** 27_IMMOPILOT

## Objectif

Creer 7 agents Claude Code specialises dans l'immobilier en France qui :
1. Vont sur internet chercher les donnees reelles (baremes, lois, taux, prix)
2. Aident a developper et ameliorer ImmoPilot avec une expertise metier precise
3. Produisent des fichiers TypeScript structures dans `lib/data/` pour alimenter l'app

## Architecture

```
Agent Parcours (Orchestrateur)
         |
    ┌────┼────┬────┬────┬────┐
    v    v    v    v    v    v
Finance Juridique Marche Technique Pratique Donnees
    |    |    |    |    |    |
    └────┴────┴────┴────┴────┘
              v
         lib/data/*.ts
```

- **1 orchestrateur** : sait quelle etape l'utilisateur traverse, dispatch vers les bons experts
- **6 experts** : chacun maitrisse un perimetre metier et connait les sources web de reference
- **Couche data** : fichiers TS types, importables directement dans Next.js

## Agents

### 1. Agent Parcours (Orchestrateur)

- **Fichier :** `agents/immopilot-parcours.md`
- **Role :** Comprend le parcours achat immobilier de A a Z (8 etapes), sait quand mobiliser quel expert
- **Sources web :** ANIL.org, service-public.fr (guide primo-accedant)
- **Mapping etapes → experts :**
  - Etape 1 (Projet) → Marche
  - Etape 2 (Capacite) → Finance + Donnees
  - Etape 3 (Recherche) → Marche + Juridique + Technique
  - Etape 4 (Offre) → Marche + Juridique
  - Etape 5 (Compromis) → Juridique
  - Etape 6 (Financement) → Finance
  - Etape 7 (Notaire) → Juridique + Pratique
  - Etape 8 (Post-achat) → Pratique + Technique
- **Ameliore :** Pages parcours (`app/parcours/*`), tips, UX du tunnel, alertes contextuelles

### 2. Agent Finance

- **Fichier :** `agents/immopilot-finance.md`
- **Role :** Expert credit immobilier, PTZ, aides a l'achat, assurance emprunteur, fiscalite
- **Domaines (5) :**
  1. Credit immobilier — taux fixes/variables, HCSF 35%, durees max 25 ans, lissage, modularite, IRA, courtage
  2. PTZ — zones Abis→C, baremes, plafonds ressources/operation, quotites, differe
  3. Aides a l'achat — Action Logement (pret accession), PAS, pret patronal, PEL/CEL, prets regionaux
  4. Assurance emprunteur — loi Lemoine (resiliation a tout moment), delegation, equivalence garanties, TAEA
  5. Fiscalite immobiliere — taxe fonciere, plus-values, dispositifs (Pinel, Denormandie, LMNP), IFI
- **Sources web :**
  - Banque de France (taux d'usure trimestriels)
  - ANIL.org (baremes PTZ, aides, guide financement)
  - HCSF / Banque de France (regles endettement)
  - LegiFrance (loi Lemoine, code de la consommation)
  - Pretto.fr, meilleurtaux.com (taux actuels du marche)
  - service-public.fr (aides a l'accession, PAS, Action Logement)
  - impots.gouv.fr (fiscalite, plus-values, dispositifs)
- **Fichiers data produits :**
  - `lib/data/credit-rules.ts` — regles HCSF, taux usure, durees, IRA
  - `lib/data/ptz-baremes.ts` — (existe, a enrichir/verifier)
  - `lib/data/aides-achat.ts` — Action Logement, PAS, PEL/CEL, prets regionaux
  - `lib/data/assurance-emprunteur.ts` — loi Lemoine, equivalences, TAEA
  - `lib/data/fiscalite-immo.ts` — TF moyennes, PV, dispositifs
- **Etapes couvertes :** 2 (Capacite), 6 (Financement)

### 3. Agent Juridique

- **Fichier :** `agents/immopilot-juridique.md`
- **Role :** Expert compromis, notaire, diagnostics, copropriete, urbanisme
- **Domaines (5) :**
  1. Notaire & frais — baremes emoluments (4 tranches), droits mutation ancien/neuf, debours, CSI
  2. Compromis & SRU — delai retractation 10 jours, conditions suspensives (pret, urbanisme, servitudes), depot de garantie 5-10%, DIA
  3. Diagnostics obligatoires — DPE, amiante, plomb (CREP), termites, electricite, gaz, ERP (Etat des Risques), mesurage Carrez/Boutin, assainissement
  4. Copropriete — loi Alur (fiche synthetique, fonds travaux 5%), charges courantes/exceptionnelles, AG, syndic, carnet d'entretien
  5. Urbanisme — PLU, droit de preemption (DPU), servitudes, cadastre, certificat d'urbanisme
- **Sources web :**
  - notaires.fr (baremes officiels, simulateur)
  - LegiFrance (loi SRU, loi Alur, loi Carrez, code urbanisme)
  - ANIL.org (droits acheteur, compromis, diagnostics)
  - service-public.fr (diagnostics obligatoires, copropriete)
  - georisques.gouv.fr (ERP, zones inondables, argiles)
  - cadastre.gouv.fr (parcelles, surfaces)
- **Fichiers data produits :**
  - `lib/data/notaire-baremes.ts` — (existe, a verifier)
  - `lib/data/compromis-rules.ts` — delais SRU, CS types, depot garantie
  - `lib/data/diagnostics-obligatoires.ts` — 9 diagnostics, validite, couts moyens, quand obligatoire
  - `lib/data/copropriete-rules.ts` — Alur obligations, fonds travaux, documents obligatoires
  - `lib/data/urbanisme-rules.ts` — PLU, preemption, certificat urbanisme
- **Etapes couvertes :** 3 (Recherche), 4 (Offre), 5 (Compromis), 7 (Notaire)

### 4. Agent Marche

- **Fichier :** `agents/immopilot-marche.md`
- **Role :** Expert prix, zonage geographique, negociation
- **Domaines (3) :**
  1. Prix m2 & donnees marche — DVF Etalab (transactions reelles), indices Notaires, prix moyens par commune/departement, tendances
  2. Zonage & geographie — zones ABC (PTZ, Pinel), tension locative, equipements (transports, ecoles, commerces), projets urbains
  3. Negociation — marges moyennes par type de bien (ancien/neuf), par zone (tendu/detendu), argumentaires, prix affiche vs prix signe
- **Sources web :**
  - app.dvf.etalab.gouv.fr (transactions reelles, open data)
  - meilleursagents.com (estimations, prix m2)
  - notaires.fr/prix-immobilier (indices officiels)
  - INSEE (population, revenus medians, donnees socio-eco)
  - data.gouv.fr (zonage ABC officiel, base communes)
  - geoportail.gouv.fr (cadastre, equipements)
- **Fichiers data produits :**
  - `lib/data/zones-communes.ts` — zonage ABC de toutes les communes de France
  - `lib/data/negociation-tips.ts` — marges par type/zone, argumentaires, erreurs a eviter
  - `lib/data/tips-par-etape.ts` — conseils experts contextualises par etape
- **Etapes couvertes :** 1 (Projet), 3 (Recherche), 4 (Offre)

### 5. Agent Technique

- **Fichier :** `agents/immopilot-technique.md`
- **Role :** Expert DPE, travaux, renovation, VEFA, energie
- **Domaines (4) :**
  1. VEFA / Neuf — garanties (decennale, biennale, parfait achevement), reserves a la livraison, echeancier appels de fonds, contrat de reservation
  2. Travaux & renovation — estimation couts au m2 par type (cuisine, sdb, peinture, electricite, plomberie), trouver artisans RGE
  3. Energie & DPE — classes A→G, seuils kWh/m2, passoires thermiques (F/G), interdiction location (2025 G, 2028 F, 2034 E), audit energetique obligatoire
  4. Aides renovation — MaPrimeRenov (baremes par revenus et travaux), CEE (Certificats Economie Energie), eco-PTZ (30k€ max), TVA reduite 5.5%
- **Sources web :**
  - ademe.fr (DPE, classes, seuils)
  - france-renov.gouv.fr (MaPrimeRenov baremes, simulateur)
  - faire.gouv.fr (conseillers renovation)
  - ANAH (aides renovation, plafonds)
  - service-public.fr (VEFA, garanties construction)
  - LegiFrance (loi Climat & Resilience, calendrier passoires)
- **Fichiers data produits :**
  - `lib/data/dpe-rules.ts` — classes, seuils, interdictions, calendrier
  - `lib/data/vefa-rules.ts` — garanties, echeancier appels fonds, reserves
  - `lib/data/travaux-renovation.ts` — couts m2 par type, aides MaPrimeRenov, CEE, eco-PTZ
- **Etapes couvertes :** 3 (Recherche), 8 (Post-achat)

### 6. Agent Pratique

- **Fichier :** `agents/immopilot-pratique.md`
- **Role :** Expert post-achat, demenagement, assurances, declarations
- **Domaines (4) :**
  1. Demenagement & logistique — timeline, checklist, prestataires, cartons, transfert courrier
  2. Assurance MRH / PNO — obligation MRH (copropriete), garanties, comparaison, resiliation ancien contrat
  3. Changement adresse & compteurs — service-public.fr (demarche unique), EDF/Engie/eau, internet, impots
  4. Declarations fiscales — declaration revenus (residence principale), taxe fonciere, taxe habitation (si applicable)
- **Sources web :**
  - service-public.fr (changement adresse, demarches post-achat)
  - impots.gouv.fr (declarations, exonerations TF neuf)
  - papernest.com, jechange.fr (comparateurs, transferts)
  - ANIL.org (droits nouveau proprietaire)
- **Fichiers data produits :**
  - `lib/data/demenagement-checklist.ts` — timeline J-60 a J+30, actions, contacts
  - `lib/data/post-achat-declarations.ts` — declarations obligatoires, delais, ou les faire
- **Etapes couvertes :** 7 (Notaire), 8 (Post-achat)

### 7. Agent Donnees

- **Fichier :** `agents/immopilot-donnees.md`
- **Role :** Maintient les baremes a jour, valide la coherence des donnees, gere le zonage communes
- **Domaines (4) :**
  1. Baremes & taux officiels — taux usure (trimestriel), baremes PTZ, plafonds Action Logement, seuils fiscaux
  2. Zonage communes — base officielle des communes de France avec zone ABC, code postal, code INSEE
  3. Plafonds & seuils — plafonds revenus PTZ, plafonds Pinel, seuils HCSF, franchise droits mutation
  4. Validation coherence — verifie que les donnees dans lib/data/ sont coherentes entre elles et a jour
- **Sources web :**
  - data.gouv.fr (base communes, zonage ABC, DVF)
  - LegiFrance (Journal Officiel, decrets baremes)
  - Banque de France (taux usure publie chaque trimestre)
  - INSEE (indices, seuils)
  - ANIL.org (mise a jour baremes annuelle)
- **Fichiers data produits :**
  - `lib/data/zones-communes.ts` — (partage avec Agent Marche)
  - Mise a jour de TOUS les fichiers `lib/data/*.ts` existants
- **Etapes couvertes :** Transversal (toutes)

## Specifications techniques des agents

### Format agent (.md)

Chaque agent est un fichier Markdown dans `27_IMMOPILOT/agents/` avec :
- **Frontmatter** : nom, description, outils autorises
- **System prompt** : expertise metier, sources de reference, regles de production
- **Instructions** : comment rechercher, valider, et produire les donnees

### Outils autorises

Tous les agents ont acces a :
- `Read`, `Grep`, `Glob` — explorer le codebase ImmoPilot
- `Bash` — executer des scripts, manipuler des donnees
- `WebSearch` — chercher sur internet (Google)
- `WebFetch` — lire le contenu d'une page web

### Pattern de travail d'un agent

1. **Recherche** : WebSearch + WebFetch sur les sources officielles
2. **Analyse** : extraire les donnees pertinentes, les structurer
3. **Verification** : croiser au moins 2 sources pour chaque donnee critique
4. **Production** : ecrire/mettre a jour les fichiers `lib/data/*.ts`
5. **Rapport** : resumer ce qui a ete fait, ce qui a change, ce qui reste a verifier

### Convention fichiers data TS

```typescript
// Chaque fichier data suit ce pattern :
// 1. Types/interfaces en haut
// 2. Constantes exportees
// 3. Commentaire source avec URL et date de derniere verification

/** Source : service-public.fr — verifie le 2026-05-08 */
export const REGLE_EXEMPLE = { ... } as const;
```

## Mapping complet Etapes → Agents → Fichiers

| Etape | Agents | Fichiers TS |
|---|---|---|
| 1. Projet | Marche | zones-communes.ts, tips-par-etape.ts |
| 2. Capacite | Finance, Donnees | credit-rules.ts, ptz-baremes.ts, aides-achat.ts |
| 3. Recherche | Marche, Juridique, Technique | diagnostics-obligatoires.ts, checklist-visite.ts, dpe-rules.ts |
| 4. Offre | Marche, Juridique | negociation-tips.ts, compromis-rules.ts |
| 5. Compromis | Juridique | compromis-rules.ts, clauses-suspensives.ts |
| 6. Financement | Finance | assurance-emprunteur.ts, garanties-pret.ts |
| 7. Notaire | Juridique, Pratique | notaire-baremes.ts, post-achat-declarations.ts |
| 8. Post-achat | Pratique, Technique | demenagement-checklist.ts, travaux-renovation.ts |

## Fichiers a creer

### Agents (7 fichiers)
1. `agents/immopilot-parcours.md`
2. `agents/immopilot-finance.md`
3. `agents/immopilot-juridique.md`
4. `agents/immopilot-marche.md`
5. `agents/immopilot-technique.md`
6. `agents/immopilot-pratique.md`
7. `agents/immopilot-donnees.md`

### Donnees (17 fichiers TS nouveaux + 2 existants a enrichir)
1. `lib/data/credit-rules.ts`
2. `lib/data/aides-achat.ts`
3. `lib/data/assurance-emprunteur.ts`
4. `lib/data/fiscalite-immo.ts`
5. `lib/data/compromis-rules.ts`
6. `lib/data/diagnostics-obligatoires.ts`
7. `lib/data/copropriete-rules.ts`
8. `lib/data/urbanisme-rules.ts`
9. `lib/data/zones-communes.ts`
10. `lib/data/negociation-tips.ts`
11. `lib/data/tips-par-etape.ts`
12. `lib/data/checklist-visite.ts`
13. `lib/data/dpe-rules.ts`
14. `lib/data/vefa-rules.ts`
15. `lib/data/travaux-renovation.ts`
16. `lib/data/demenagement-checklist.ts`
17. `lib/data/post-achat-declarations.ts`
18. `lib/data/ptz-baremes.ts` (enrichir)
19. `lib/data/notaire-baremes.ts` (enrichir)
