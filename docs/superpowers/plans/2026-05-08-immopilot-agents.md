# ImmoPilot Agents — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 7 Claude Code agents experts en immobilier France + 17 fichiers data TypeScript pour alimenter ImmoPilot.

**Architecture:** 1 agent orchestrateur (Parcours) dispatch vers 6 agents experts (Finance, Juridique, Marche, Technique, Pratique, Donnees). Chaque agent utilise WebSearch/WebFetch pour chercher les donnees reelles sur les sites officiels et produit des fichiers `lib/data/*.ts` types.

**Tech Stack:** Claude Code agents (.md), TypeScript data files, Next.js (existing app)

---

## File Structure

### Agents (7 files — `27_IMMOPILOT/agents/`)
| File | Responsibility |
|---|---|
| `immopilot-parcours.md` | Orchestrateur — connait les 8 etapes, dispatch vers les experts |
| `immopilot-finance.md` | Credit, PTZ, aides, assurance emprunteur, fiscalite |
| `immopilot-juridique.md` | Notaire, compromis, diagnostics, copropriete, urbanisme |
| `immopilot-marche.md` | Prix m2, zonage ABC, negociation |
| `immopilot-technique.md` | DPE, travaux, renovation, VEFA |
| `immopilot-pratique.md` | Demenagement, assurance MRH, declarations post-achat |
| `immopilot-donnees.md` | Baremes officiels, zonage communes, validation coherence |

### Data files (17 new + 2 existing — `27_IMMOPILOT/lib/data/`)
| File | Produced by | Content |
|---|---|---|
| `credit-rules.ts` | Finance | HCSF 35%, taux usure, durees, IRA |
| `aides-achat.ts` | Finance | Action Logement, PAS, PEL/CEL |
| `assurance-emprunteur.ts` | Finance | Lemoine, delegation, TAEA |
| `fiscalite-immo.ts` | Finance | TF, PV, Pinel, LMNP, IFI |
| `compromis-rules.ts` | Juridique | SRU, retractation, CS, depot garantie |
| `diagnostics-obligatoires.ts` | Juridique | 9 diagnostics, validite, couts |
| `copropriete-rules.ts` | Juridique | Alur, fonds travaux, AG |
| `urbanisme-rules.ts` | Juridique | PLU, preemption, certificat urbanisme |
| `zones-communes.ts` | Marche+Donnees | Zonage ABC France (structure + exemples) |
| `negociation-tips.ts` | Marche | Marges, argumentaires par type/zone |
| `tips-par-etape.ts` | Marche | Conseils experts par etape 1-8 |
| `checklist-visite.ts` | Juridique+Technique | Points controle visite bien |
| `dpe-rules.ts` | Technique | Classes A-G, seuils, passoires, calendrier |
| `vefa-rules.ts` | Technique | Garanties neuf, appels fonds, reserves |
| `travaux-renovation.ts` | Technique | Couts m2, MaPrimeRenov, CEE, eco-PTZ |
| `demenagement-checklist.ts` | Pratique | Timeline J-60 a J+30, actions |
| `post-achat-declarations.ts` | Pratique | Declarations obligatoires, delais |
| `ptz-baremes.ts` | Donnees | (existe — enrichir) |
| `notaire-baremes.ts` | Donnees | (existe — enrichir) |

---

### Task 1: Agent Parcours (Orchestrateur)

**Files:**
- Create: `27_IMMOPILOT/agents/immopilot-parcours.md`

- [ ] **Step 1: Create agents directory**

Run: `mkdir -p "C:/1- Marwan/Claude/27_IMMOPILOT/agents"`

- [ ] **Step 2: Write agent file**

```markdown
---
name: immopilot-parcours
description: >
  Use this agent when working on ImmoPilot and you need to understand which expert to mobilize for a given step of the home-buying journey. This orchestrator knows the full 8-step process (projet, capacite, recherche, offre, compromis, financement, notaire, post-achat) and dispatches to the right specialist agent. Also use when improving the parcours pages, tips, alerts, or overall user experience of the buyer tunnel.
model: inherit
color: blue
tools: ["Read", "Grep", "Glob", "Bash", "WebSearch", "WebFetch"]
---

You are ImmoPilot Parcours, the orchestrator agent for ImmoPilot — a French first-time home buyer guidance platform built with Next.js.

## YOUR ROLE

You understand the complete home-buying journey in France and know which expert agent to recommend for each step. You help the developer improve the 8-step parcours, tips, alerts, and overall UX.

## THE 8 STEPS

| Step | Name | Key Topics | Expert Agents |
|---|---|---|---|
| 1 | Definir son projet | Situation, budget, zone, type de bien | **immopilot-marche** |
| 2 | Capacite d'emprunt | Simulateur credit, PTZ, endettement | **immopilot-finance** + **immopilot-donnees** |
| 3 | Rechercher un bien | Visites, checklist, DPE, copropriete | **immopilot-marche** + **immopilot-juridique** + **immopilot-technique** |
| 4 | Faire une offre | Prix marche, lettre d'offre, negociation | **immopilot-marche** + **immopilot-juridique** |
| 5 | Compromis de vente | Clauses, documents, delais legaux | **immopilot-juridique** |
| 6 | Obtenir le financement | Banques, assurance, courtier | **immopilot-finance** |
| 7 | Acte authentique | Frais notaire, signature, cles | **immopilot-juridique** + **immopilot-pratique** |
| 8 | Post-achat | Demenagement, assurance, declarations | **immopilot-pratique** + **immopilot-technique** |

## CODEBASE STRUCTURE

- App pages: `app/parcours/1-projet/` through `app/parcours/8-post-achat/`
- Tools: `app/(marketing)/outils/` (simulateur-credit, frais-de-notaire, eligibilite-ptz)
- Data files: `lib/data/*.ts` (baremes, rules, tips)
- Calculators: `lib/calculateurs/` (credit.ts, ptz.ts, notaire.ts, endettement.ts)
- Types: `lib/types.ts` (ProjetImmobilier, DossierBien, etc.)
- Constants: `lib/constants.ts` (ETAPES, BRAND, taux)

## REFERENCE SOURCES

- **ANIL.org** — Guide primo-accedant, droits acheteurs, aides
- **service-public.fr** — Demarches officielles, parcours achat
- **notaires.fr** — Processus notarial, frais, delais

## INSTRUCTIONS

1. When asked to improve a specific step, identify which expert agents are relevant and recommend invoking them
2. When asked about the overall parcours, review `lib/constants.ts` ETAPES and `app/parcours/` pages
3. For tips and alerts, check `lib/data/tips-par-etape.ts` and suggest improvements based on ANIL/service-public.fr
4. Always cross-reference at least 2 official sources before recommending changes
5. Produce actionable code changes, not just advice
```

- [ ] **Step 3: Verify file created**

Run: `cat "C:/1- Marwan/Claude/27_IMMOPILOT/agents/immopilot-parcours.md" | head -5`
Expected: frontmatter with `name: immopilot-parcours`

- [ ] **Step 4: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add agents/immopilot-parcours.md
git commit -m "feat(agents): add immopilot-parcours orchestrator agent"
```

---

### Task 2: Agent Finance + Data Files

**Files:**
- Create: `27_IMMOPILOT/agents/immopilot-finance.md`
- Create: `27_IMMOPILOT/lib/data/credit-rules.ts`
- Create: `27_IMMOPILOT/lib/data/aides-achat.ts`
- Create: `27_IMMOPILOT/lib/data/assurance-emprunteur.ts`
- Create: `27_IMMOPILOT/lib/data/fiscalite-immo.ts`

- [ ] **Step 1: Write agent file**

```markdown
---
name: immopilot-finance
description: >
  Use this agent when working on ImmoPilot's financial features — credit simulator, PTZ calculator, debt ratio, financing step, or any financial rules. Expert in French mortgage credit (HCSF 35% rule, usury rates), PTZ (zones, income thresholds, quotas), buyer aids (Action Logement, PAS, PEL/CEL), borrower insurance (Lemoine law), and real estate taxation (property tax, capital gains, Pinel, LMNP, IFI). Goes online to fetch current rates and official baremes.
model: inherit
color: cyan
tools: ["Read", "Grep", "Glob", "Bash", "WebSearch", "WebFetch"]
---

You are ImmoPilot Finance, an expert in French real estate financing. You help the developer build and improve all financial features of ImmoPilot with precise, current, legally accurate data.

## EXPERTISE (5 domains)

### 1. Credit immobilier
- Taux fixes vs variables, taux mixtes
- Regle HCSF : endettement max 35% des revenus nets (decision HCSF du 29/09/2021, norme juridiquement contraignante depuis 01/01/2022)
- Duree max 25 ans (27 ans si VEFA ou travaux > 25% du cout)
- Taux d'usure : publie trimestriellement par la Banque de France
- IRA (Indemnites de Remboursement Anticipe) : max 6 mois d'interets ou 3% du CRD
- Lissage de prets, modularite des echeances
- Courtage : honoraires, role, reglementation ORIAS

### 2. PTZ (Pret a Taux Zero)
- Zones Abis, A, B1, B2, C
- Plafonds de ressources par zone et taille foyer (N-2)
- Plafonds d'operation, quotite 40%
- 4 tranches de remboursement avec differe
- Conditions : primo-accedant, residence principale, neuf ou ancien avec travaux (zones B2/C)

### 3. Aides a l'achat
- Action Logement : pret accession 40 000€ max a 1%, conditions employeur
- PAS (Pret d'Accession Sociale) : plafonds revenus, APL possible
- Pret patronal / pret employeur
- PEL/CEL : droits a pret, taux, plafonds epargne
- Prets regionaux et locaux (variables selon collectivites)

### 4. Assurance emprunteur
- Loi Lemoine (01/06/2022) : resiliation a tout moment sans frais
- Delegation d'assurance : droit de choisir son assureur (loi Lagarde)
- Equivalence de garantees : grille de la banque, 11 criteres CCSF
- TAEA (Taux Annuel Effectif Assurance) : obligatoire dans l'offre de pret
- Garanties : deces, PTIA, ITT, IPT, IPP

### 5. Fiscalite immobiliere
- Taxe fonciere : base cadastrale, abattements, exoneration 2 ans neuf
- Plus-values : abattement pour duree detention (22 ans IR, 30 ans PS), exoneration RP
- Pinel : reduction IR, plafonds loyer/ressources, zones A/B1, engagement 6/9/12 ans
- Denormandie : ancien avec travaux, memes mecanismes que Pinel
- LMNP : amortissement, micro-BIC 50% ou reel
- IFI : seuil 1,3M€, biens immobiliers nets

## REFERENCE SOURCES (always verify online)

| Source | URL | Data |
|---|---|---|
| Banque de France | banque-france.fr | Taux usure trimestriel |
| ANIL | anil.org | Baremes PTZ, aides, guide financement |
| HCSF | economie.gouv.fr/hcsf | Regles endettement |
| LegiFrance | legifrance.gouv.fr | Loi Lemoine, Code consommation |
| Pretto | pretto.fr | Taux actuels marche |
| Meilleurtaux | meilleurtaux.com | Taux actuels marche |
| Service-public | service-public.fr | Aides accession, PAS, Action Logement |
| Impots.gouv | impots.gouv.fr | Fiscalite, PV, dispositifs |

## CODEBASE FILES

- Calculator: `lib/calculateurs/credit.ts` (mensualite, capacite emprunt)
- Calculator: `lib/calculateurs/ptz.ts` (eligibilite, montant PTZ)
- Calculator: `lib/calculateurs/endettement.ts` (taux endettement)
- Data: `lib/data/ptz-baremes.ts` (plafonds, quotite, tranches)
- Data: `lib/data/credit-rules.ts` (HCSF, taux usure, IRA)
- Data: `lib/data/aides-achat.ts` (Action Logement, PAS, PEL)
- Data: `lib/data/assurance-emprunteur.ts` (Lemoine, TAEA)
- Data: `lib/data/fiscalite-immo.ts` (TF, PV, Pinel, LMNP)
- Types: `lib/types.ts`
- Constants: `lib/constants.ts` (TAUX_ENDETTEMENT_MAX, DUREE_MAX_PRET_ANNEES)

## INSTRUCTIONS

1. **Research first**: Before writing/updating any data file, WebSearch the official source to get current values
2. **Cross-verify**: Every number must come from at least 2 sources (official + secondary)
3. **Source comments**: Every exported constant must have a `/** Source: URL — verifie le YYYY-MM-DD */` comment
4. **TypeScript**: All data files must compile with `tsc --noEmit`. Use `as const` for literal types.
5. **Report**: After producing data, summarize what changed and flag anything that needs manual verification
```

- [ ] **Step 2: Write credit-rules.ts**

```typescript
/** Regles du credit immobilier en France.
 * Source: Banque de France, HCSF — verifie le 2026-05-08
 */

export interface RegleHCSF {
  taux_endettement_max: number;
  duree_max_annees: number;
  duree_max_vefa_annees: number;
  date_entree_vigueur: string;
  base_legale: string;
}

export const REGLE_HCSF: RegleHCSF = {
  taux_endettement_max: 0.35,
  duree_max_annees: 25,
  duree_max_vefa_annees: 27,
  date_entree_vigueur: "2022-01-01",
  base_legale: "Decision HCSF du 29/09/2021 — norme juridiquement contraignante",
} as const;

export interface TauxUsure {
  categorie: string;
  taux: number;
  periode: string;
}

/** Source: Banque de France — A METTRE A JOUR chaque trimestre via immopilot-donnees */
export const TAUX_USURE: TauxUsure[] = [
  { categorie: "Pret fixe < 10 ans", taux: 4.60, periode: "T2 2026" },
  { categorie: "Pret fixe 10-20 ans", taux: 5.74, periode: "T2 2026" },
  { categorie: "Pret fixe >= 20 ans", taux: 5.97, periode: "T2 2026" },
  { categorie: "Pret variable", taux: 5.54, periode: "T2 2026" },
  { categorie: "Pret-relais", taux: 6.33, periode: "T2 2026" },
];

export interface RegleIRA {
  description: string;
  plafond_pourcentage_crd: number;
  plafond_mois_interets: number;
  exoneration_vente_mutation: boolean;
}

/** Source: Code de la consommation Art. R313-25 */
export const REGLE_IRA: RegleIRA = {
  description: "Indemnites de Remboursement Anticipe",
  plafond_pourcentage_crd: 3,
  plafond_mois_interets: 6,
  exoneration_vente_mutation: false,
} as const;

export interface TauxMarcheIndicatif {
  duree: number;
  taux_moyen: number;
  taux_bon: number;
  taux_excellent: number;
  date_maj: string;
}

/** Source: pretto.fr, meilleurtaux.com — A METTRE A JOUR via immopilot-finance */
export const TAUX_MARCHE: TauxMarcheIndicatif[] = [
  { duree: 10, taux_moyen: 3.10, taux_bon: 2.90, taux_excellent: 2.75, date_maj: "2026-05-08" },
  { duree: 15, taux_moyen: 3.25, taux_bon: 3.05, taux_excellent: 2.90, date_maj: "2026-05-08" },
  { duree: 20, taux_moyen: 3.40, taux_bon: 3.20, taux_excellent: 3.05, date_maj: "2026-05-08" },
  { duree: 25, taux_moyen: 3.55, taux_bon: 3.35, taux_excellent: 3.20, date_maj: "2026-05-08" },
];
```

- [ ] **Step 3: Write aides-achat.ts**

```typescript
/** Aides a l'achat immobilier en France.
 * Source: service-public.fr, ANIL, Action Logement — verifie le 2026-05-08
 */

export interface AideAchat {
  nom: string;
  organisme: string;
  montant_max: number | null;
  taux: number | null;
  duree_max_annees: number | null;
  conditions: string[];
  cumulable_ptz: boolean;
  url_reference: string;
}

/** Source: service-public.fr, actionlogement.fr — verifie le 2026-05-08 */
export const AIDES_ACHAT: AideAchat[] = [
  {
    nom: "Pret Action Logement",
    organisme: "Action Logement",
    montant_max: 40000,
    taux: 1.0,
    duree_max_annees: 25,
    conditions: [
      "Salarie du secteur prive (entreprise > 10 salaries)",
      "Primo-accedant ou mutation professionnelle",
      "Residence principale",
      "Respecter les plafonds de ressources PAS",
    ],
    cumulable_ptz: true,
    url_reference: "https://www.actionlogement.fr/pret-accession",
  },
  {
    nom: "Pret d'Accession Sociale (PAS)",
    organisme: "Etat (via banques conventionnees)",
    montant_max: null,
    taux: null,
    duree_max_annees: 35,
    conditions: [
      "Plafonds de ressources (identiques au PTZ)",
      "Residence principale occupee dans l'annee",
      "Ouvre droit a l'APL accession",
    ],
    cumulable_ptz: true,
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F22158",
  },
  {
    nom: "Pret Epargne Logement (PEL)",
    organisme: "Banque (epargne reglementee)",
    montant_max: 92000,
    taux: null,
    duree_max_annees: 15,
    conditions: [
      "Detenir un PEL depuis au moins 4 ans",
      "Taux du pret = taux du PEL + commission banque",
      "PEL ouverts avant 2024 : prime d'Etat possible",
    ],
    cumulable_ptz: true,
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F16140",
  },
  {
    nom: "Pret Conventione (PC)",
    organisme: "Etat (via banques conventionnees)",
    montant_max: null,
    taux: null,
    duree_max_annees: 35,
    conditions: [
      "Pas de conditions de ressources",
      "Residence principale",
      "Ouvre droit a l'APL accession",
    ],
    cumulable_ptz: true,
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F10793",
  },
];
```

- [ ] **Step 4: Write assurance-emprunteur.ts**

```typescript
/** Assurance emprunteur — regles et lois en vigueur.
 * Source: LegiFrance, service-public.fr — verifie le 2026-05-08
 */

export interface LoiAssurance {
  nom: string;
  date_entree_vigueur: string;
  droit_principal: string;
  conditions: string[];
  reference_legale: string;
}

/** Source: LegiFrance — loi n° 2022-270 du 28/02/2022 */
export const LOI_LEMOINE: LoiAssurance = {
  nom: "Loi Lemoine",
  date_entree_vigueur: "2022-06-01",
  droit_principal: "Resiliation a tout moment sans frais ni penalite",
  conditions: [
    "Applicable a tous les contrats (neufs et en cours)",
    "Garanties equivalentes requises (grille banque)",
    "Banque a 10 jours pour accepter ou motiver un refus",
    "Suppression du questionnaire medical si pret < 200 000€ et echeance avant 60 ans",
  ],
  reference_legale: "Loi n° 2022-270 du 28/02/2022",
} as const;

export interface GarantieAssurance {
  code: string;
  nom: string;
  description: string;
  obligatoire_pret_immo: boolean;
}

export const GARANTIES_ASSURANCE: GarantieAssurance[] = [
  { code: "DC", nom: "Deces", description: "Remboursement du capital restant du en cas de deces", obligatoire_pret_immo: true },
  { code: "PTIA", nom: "Perte Totale et Irreversible d'Autonomie", description: "Invalidite 3e categorie, besoin assistance pour actes quotidiens", obligatoire_pret_immo: true },
  { code: "ITT", nom: "Incapacite Temporaire Totale de Travail", description: "Arret de travail > franchise (90 jours general)", obligatoire_pret_immo: true },
  { code: "IPT", nom: "Invalidite Permanente Totale", description: "Taux invalidite >= 66%", obligatoire_pret_immo: true },
  { code: "IPP", nom: "Invalidite Permanente Partielle", description: "Taux invalidite 33-66%", obligatoire_pret_immo: false },
  { code: "PE", nom: "Perte d'Emploi", description: "Chomage involontaire, carences et franchises importantes", obligatoire_pret_immo: false },
];

export interface TauxAssuranceIndicatif {
  tranche_age: string;
  taux_banque: string;
  taux_delegation: string;
}

/** Source: meilleurtaux.com — indicatif, a mettre a jour */
export const TAUX_ASSURANCE_INDICATIFS: TauxAssuranceIndicatif[] = [
  { tranche_age: "< 30 ans", taux_banque: "0.30 - 0.40%", taux_delegation: "0.07 - 0.15%" },
  { tranche_age: "30 - 40 ans", taux_banque: "0.35 - 0.50%", taux_delegation: "0.10 - 0.25%" },
  { tranche_age: "40 - 50 ans", taux_banque: "0.45 - 0.70%", taux_delegation: "0.20 - 0.40%" },
  { tranche_age: "50 - 60 ans", taux_banque: "0.60 - 1.00%", taux_delegation: "0.35 - 0.65%" },
];
```

- [ ] **Step 5: Write fiscalite-immo.ts**

```typescript
/** Fiscalite immobiliere — regles principales.
 * Source: impots.gouv.fr, service-public.fr — verifie le 2026-05-08
 */

export interface AbattementPlusValue {
  type: "ir" | "prelevements_sociaux";
  tranches: { de_annee: number; a_annee: number; taux_par_an: number }[];
  exoneration_totale_annee: number;
}

/** Source: impots.gouv.fr — abattements plus-values immobilieres */
export const ABATTEMENTS_PLUS_VALUES: AbattementPlusValue[] = [
  {
    type: "ir",
    tranches: [
      { de_annee: 0, a_annee: 5, taux_par_an: 0 },
      { de_annee: 6, a_annee: 21, taux_par_an: 6 },
      { de_annee: 22, a_annee: 22, taux_par_an: 4 },
    ],
    exoneration_totale_annee: 22,
  },
  {
    type: "prelevements_sociaux",
    tranches: [
      { de_annee: 0, a_annee: 5, taux_par_an: 0 },
      { de_annee: 6, a_annee: 21, taux_par_an: 1.65 },
      { de_annee: 22, a_annee: 22, taux_par_an: 1.6 },
      { de_annee: 23, a_annee: 30, taux_par_an: 9 },
    ],
    exoneration_totale_annee: 30,
  },
];

export interface DispositifFiscal {
  nom: string;
  type: "reduction_ir" | "amortissement" | "exoneration";
  actif: boolean;
  description: string;
  zones_eligibles: string[] | null;
  engagement_min_annees: number;
  url_reference: string;
}

/** Source: impots.gouv.fr — verifie le 2026-05-08 */
export const DISPOSITIFS_FISCAUX: DispositifFiscal[] = [
  {
    nom: "Pinel / Pinel+",
    type: "reduction_ir",
    actif: true,
    description: "Reduction IR pour investissement locatif neuf : 9% (6 ans), 12% (9 ans), 14% (12 ans) — taux Pinel+ superieurs si criteres DPE/localisation",
    zones_eligibles: ["Abis", "A", "B1"],
    engagement_min_annees: 6,
    url_reference: "https://www.impots.gouv.fr/particulier/investissements-locatifs",
  },
  {
    nom: "Denormandie",
    type: "reduction_ir",
    actif: true,
    description: "Pinel dans l'ancien avec travaux >= 25% du cout total — communes ORT/coeur de ville",
    zones_eligibles: null,
    engagement_min_annees: 6,
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F35011",
  },
  {
    nom: "LMNP",
    type: "amortissement",
    actif: true,
    description: "Loueur Meuble Non Professionnel — micro-BIC (50% abattement) ou reel (amortissement du bien)",
    zones_eligibles: null,
    engagement_min_annees: 0,
    url_reference: "https://www.impots.gouv.fr/particulier/les-locations-meublees",
  },
];

export const TAXE_FONCIERE_INFO = {
  exoneration_neuf_annees: 2,
  base: "Valeur locative cadastrale x taux communal",
  url_reference: "https://www.impots.gouv.fr/particulier/taxe-fonciere",
} as const;

export const IFI_SEUIL = 1_300_000;
```

- [ ] **Step 6: Verify TypeScript compilation**

Run: `cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx tsc --noEmit lib/data/credit-rules.ts lib/data/aides-achat.ts lib/data/assurance-emprunteur.ts lib/data/fiscalite-immo.ts 2>&1 | head -20`
Expected: No errors (or only unrelated existing errors)

- [ ] **Step 7: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add agents/immopilot-finance.md lib/data/credit-rules.ts lib/data/aides-achat.ts lib/data/assurance-emprunteur.ts lib/data/fiscalite-immo.ts
git commit -m "feat(agents): add immopilot-finance agent + 4 data files (credit, aides, assurance, fiscalite)"
```

---

### Task 3: Agent Juridique + Data Files

**Files:**
- Create: `27_IMMOPILOT/agents/immopilot-juridique.md`
- Create: `27_IMMOPILOT/lib/data/compromis-rules.ts`
- Create: `27_IMMOPILOT/lib/data/diagnostics-obligatoires.ts`
- Create: `27_IMMOPILOT/lib/data/copropriete-rules.ts`
- Create: `27_IMMOPILOT/lib/data/urbanisme-rules.ts`

- [ ] **Step 1: Write agent file**

```markdown
---
name: immopilot-juridique
description: >
  Use this agent when working on ImmoPilot's legal and regulatory features — notary fees calculator, compromis/SRU rules, mandatory diagnostics, co-ownership (copropriete), or urban planning rules. Expert in French real estate law: SRU retraction period (10 days), suspensive conditions, notary fee schedules, 9 mandatory diagnostics (DPE, asbestos, lead, termites, electricity, gas, ERP, Carrez, sewage), Alur law for co-ownership, and PLU/urban planning rules. Goes online to verify current legal requirements.
model: inherit
color: red
tools: ["Read", "Grep", "Glob", "Bash", "WebSearch", "WebFetch"]
---

You are ImmoPilot Juridique, an expert in French real estate law. You help the developer build legally accurate features with current regulations.

## EXPERTISE (5 domains)

### 1. Notaire & frais
- Bareme emoluments proportionnels (4 tranches, dernier arrete en vigueur)
- Droits de mutation : 5.806% ancien, 0.715% neuf (taxes departementales + communales)
- Debours forfaitaires (~1200€)
- Contribution securite immobiliere (0.10%)
- Partage honoraires si 2 notaires (sans surcout pour l'acheteur)

### 2. Compromis & SRU
- Delai de retractation : 10 jours calendaires (loi SRU art. L271-1 CCH)
- Conditions suspensives : obtention de pret (obligatoire sauf renonciation expresse), urbanisme, servitudes, droit de preemption
- Depot de garantie : 5 a 10% du prix, sequestre chez le notaire
- DIA (Declaration d'Intention d'Aliener) : delai mairie 2 mois

### 3. Diagnostics obligatoires
- DPE (Diagnostic de Performance Energetique) — validite 10 ans
- Amiante — validite illimitee si negatif
- Plomb (CREP) — validite 1 an si positif, illimitee si negatif
- Termites — validite 6 mois
- Electricite — validite 3 ans (si installation > 15 ans)
- Gaz — validite 3 ans (si installation > 15 ans)
- ERP (Etat des Risques et Pollutions) — validite 6 mois
- Mesurage Carrez — validite illimitee (sauf travaux)
- Assainissement — validite 3 ans

### 4. Copropriete (loi Alur)
- Fiche synthetique obligatoire
- Fonds de travaux : 5% du budget previsionnel minimum
- Documents obligatoires a fournir a l'acheteur (reglement, PV AG 3 ans, carnet entretien)
- Charges courantes vs exceptionnelles
- Droit de preference du coproprietaire (si prevu au reglement)

### 5. Urbanisme
- PLU (Plan Local d'Urbanisme) : regles constructibilite, hauteur, emprise
- Droit de preemption urbain (DPU) : delai 2 mois, communes concernees
- Servitudes : passage, vue, mitoyennete
- Cadastre : parcelles, surfaces
- Certificat d'urbanisme : informatif (CUa) ou operationnel (CUb), validite 18 mois

## REFERENCE SOURCES

| Source | URL | Data |
|---|---|---|
| Notaires.fr | notaires.fr | Baremes, simulateur frais |
| LegiFrance | legifrance.gouv.fr | SRU, Alur, Carrez, code urbanisme |
| ANIL | anil.org | Droits acheteur, compromis |
| Service-public | service-public.fr | Diagnostics, copropriete |
| Georisques | georisques.gouv.fr | ERP, zones risques |
| Cadastre | cadastre.gouv.fr | Parcelles |

## CODEBASE FILES

- Calculator: `lib/calculateurs/notaire.ts`
- Data: `lib/data/notaire-baremes.ts`
- Data: `lib/data/compromis-rules.ts`
- Data: `lib/data/diagnostics-obligatoires.ts`
- Data: `lib/data/copropriete-rules.ts`
- Data: `lib/data/urbanisme-rules.ts`
- Types: `lib/types.ts` (Compromis, Notaire, DpeClasse)

## INSTRUCTIONS

1. All legal rules must cite the specific law article or decree
2. Cross-verify with LegiFrance AND at least one secondary source (ANIL, service-public.fr)
3. Flag any rule that has changed in the last 12 months
4. Data files must include validity durations where applicable
5. Produce actionable TypeScript, not legal opinions
```

- [ ] **Step 2: Write compromis-rules.ts**

```typescript
/** Regles du compromis de vente en France.
 * Source: LegiFrance (loi SRU art. L271-1 CCH), ANIL — verifie le 2026-05-08
 */

export interface RegleCompromis {
  delai_retractation_jours: number;
  base_legale: string;
  depot_garantie_min_pct: number;
  depot_garantie_max_pct: number;
  sequestre: string;
}

/** Source: Code de la construction et de l'habitation, art. L271-1 */
export const REGLE_COMPROMIS: RegleCompromis = {
  delai_retractation_jours: 10,
  base_legale: "Loi SRU — CCH art. L271-1",
  depot_garantie_min_pct: 5,
  depot_garantie_max_pct: 10,
  sequestre: "Notaire ou agent immobilier (compte sequestre)",
} as const;

export interface ConditionSuspensive {
  nom: string;
  obligatoire: boolean;
  description: string;
  delai_usuel_jours: number | null;
  conseil_acheteur: string;
}

/** Source: ANIL, service-public.fr — verifie le 2026-05-08 */
export const CONDITIONS_SUSPENSIVES: ConditionSuspensive[] = [
  {
    nom: "Obtention de pret",
    obligatoire: true,
    description: "Le compromis est annule si l'acheteur n'obtient pas son pret dans le delai prevu",
    delai_usuel_jours: 60,
    conseil_acheteur: "NE JAMAIS renoncer a cette clause. Sans elle, vous perdez le depot de garantie si le pret est refuse.",
  },
  {
    nom: "Absence de servitude grave",
    obligatoire: false,
    description: "Annulation si une servitude non declaree greve significativement le bien",
    delai_usuel_jours: null,
    conseil_acheteur: "Demander un certificat d'urbanisme avant de signer.",
  },
  {
    nom: "Absence de preemption",
    obligatoire: false,
    description: "La mairie a 2 mois pour exercer son droit de preemption (DIA)",
    delai_usuel_jours: 60,
    conseil_acheteur: "Verifier si la commune a un DPU (Droit de Preemption Urbain).",
  },
  {
    nom: "Obtention du permis de construire",
    obligatoire: false,
    description: "Si l'achat est conditionne a un projet de construction/extension",
    delai_usuel_jours: 90,
    conseil_acheteur: "Utile si vous achetez un terrain ou prevoyez une extension importante.",
  },
  {
    nom: "Vente d'un bien existant",
    obligatoire: false,
    description: "L'achat est conditionne a la vente prealable de votre bien actuel",
    delai_usuel_jours: 90,
    conseil_acheteur: "Limite le risque mais affaiblit votre offre face aux autres acheteurs.",
  },
];

export interface DelaiCompromis {
  etape: string;
  delai: string;
  description: string;
}

export const DELAIS_COMPROMIS: DelaiCompromis[] = [
  { etape: "Signature compromis", delai: "J", description: "Debut de la periode" },
  { etape: "Fin retractation", delai: "J+10", description: "10 jours calendaires, droit inconditionnel" },
  { etape: "Depot DIA mairie", delai: "J+15", description: "Le notaire depose la DIA" },
  { etape: "Reponse mairie preemption", delai: "J+75", description: "2 mois apres DIA = silence vaut renonciation" },
  { etape: "Limite obtention pret", delai: "J+60", description: "Delai usuel (negociable)" },
  { etape: "Acte authentique", delai: "J+90 a J+120", description: "3 a 4 mois apres compromis en general" },
];
```

- [ ] **Step 3: Write diagnostics-obligatoires.ts**

```typescript
/** Diagnostics immobiliers obligatoires pour la vente.
 * Source: service-public.fr, ANIL — verifie le 2026-05-08
 */

export interface DiagnosticObligatoire {
  nom: string;
  code: string;
  validite: string;
  obligatoire_si: string;
  cout_moyen_euros: { min: number; max: number };
  description: string;
  url_reference: string;
}

/** Source: service-public.fr/particuliers/vosdroits/F10798 — verifie le 2026-05-08 */
export const DIAGNOSTICS_OBLIGATOIRES: DiagnosticObligatoire[] = [
  {
    nom: "Diagnostic de Performance Energetique",
    code: "DPE",
    validite: "10 ans",
    obligatoire_si: "Toute vente (sauf exceptions : monuments historiques, etc.)",
    cout_moyen_euros: { min: 100, max: 250 },
    description: "Classe energetique A-G, estimation consommation et emissions GES",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F16096",
  },
  {
    nom: "Amiante (Etat d'amiante)",
    code: "AMIANTE",
    validite: "Illimitee si negatif, 3 ans si positif",
    obligatoire_si: "Bien dont le permis de construire est anterieur au 01/07/1997",
    cout_moyen_euros: { min: 80, max: 200 },
    description: "Reperage des materiaux contenant de l'amiante",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F12239",
  },
  {
    nom: "Plomb (CREP)",
    code: "PLOMB",
    validite: "1 an si positif, illimitee si negatif",
    obligatoire_si: "Bien construit avant le 01/01/1949",
    cout_moyen_euros: { min: 100, max: 250 },
    description: "Constat de risque d'exposition au plomb dans les peintures",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F1141",
  },
  {
    nom: "Termites",
    code: "TERMITES",
    validite: "6 mois",
    obligatoire_si: "Zones declarees par arrete prefectoral",
    cout_moyen_euros: { min: 80, max: 200 },
    description: "Presence de termites ou insectes xylophages",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F288",
  },
  {
    nom: "Electricite",
    code: "ELEC",
    validite: "3 ans",
    obligatoire_si: "Installation electrique de plus de 15 ans",
    cout_moyen_euros: { min: 80, max: 180 },
    description: "Etat de l'installation interieure d'electricite",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F18692",
  },
  {
    nom: "Gaz",
    code: "GAZ",
    validite: "3 ans",
    obligatoire_si: "Installation gaz de plus de 15 ans",
    cout_moyen_euros: { min: 80, max: 180 },
    description: "Etat de l'installation interieure de gaz",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F17337",
  },
  {
    nom: "Etat des Risques et Pollutions",
    code: "ERP",
    validite: "6 mois",
    obligatoire_si: "Toute vente (commune a risques identifies)",
    cout_moyen_euros: { min: 0, max: 50 },
    description: "Risques naturels, miniers, technologiques, sismiques, radon",
    url_reference: "https://www.georisques.gouv.fr/",
  },
  {
    nom: "Mesurage Carrez",
    code: "CARREZ",
    validite: "Illimitee (sauf travaux modifiant la surface)",
    obligatoire_si: "Lot de copropriete (pas les maisons individuelles hors copro)",
    cout_moyen_euros: { min: 50, max: 150 },
    description: "Surface privative du lot de copropriete (>= 1.80m de hauteur)",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F12241",
  },
  {
    nom: "Assainissement",
    code: "ASSAINISSEMENT",
    validite: "3 ans",
    obligatoire_si: "Bien en assainissement non collectif (fosse septique)",
    cout_moyen_euros: { min: 100, max: 200 },
    description: "Conformite de l'installation d'assainissement individuel",
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F2906",
  },
];

/** Cout total estimatif d'un pack diagnostics complet */
export const COUT_PACK_DIAGNOSTICS = {
  appartement: { min: 300, max: 700 },
  maison: { min: 400, max: 900 },
} as const;
```

- [ ] **Step 4: Write copropriete-rules.ts**

```typescript
/** Regles de copropriete — loi Alur et obligations.
 * Source: LegiFrance (loi Alur 2014), service-public.fr — verifie le 2026-05-08
 */

export interface DocumentCoproObligatoire {
  nom: string;
  description: string;
  qui_fournit: string;
}

/** Source: service-public.fr — documents obligatoires vente en copropriete */
export const DOCUMENTS_COPRO_VENTE: DocumentCoproObligatoire[] = [
  { nom: "Reglement de copropriete", description: "Regles de fonctionnement de l'immeuble", qui_fournit: "Syndic" },
  { nom: "Etat descriptif de division", description: "Repartition des lots et tantiemes", qui_fournit: "Syndic" },
  { nom: "PV des AG des 3 dernieres annees", description: "Decisions votees, travaux prevus", qui_fournit: "Syndic" },
  { nom: "Fiche synthetique", description: "Donnees cles : nb lots, budget, dette, fonds travaux", qui_fournit: "Syndic" },
  { nom: "Carnet d'entretien", description: "Historique des travaux realises sur les parties communes", qui_fournit: "Syndic" },
  { nom: "Pre-etat date", description: "Situation comptable du vendeur (charges dues, avances)", qui_fournit: "Syndic" },
  { nom: "Diagnostic Technique Global (DTG)", description: "Etat technique de l'immeuble (si vote en AG)", qui_fournit: "Syndic" },
];

export const FONDS_TRAVAUX_ALUR = {
  taux_minimum_budget_previsionnel: 5,
  obligatoire_depuis: "2017-01-01",
  dispense_si: "Immeuble neuf < 5 ans ou < 10 lots (vote unanime AG)",
  base_legale: "Loi Alur art. 14-2 loi du 10/07/1965",
} as const;

export interface AlerteCopro {
  condition: string;
  niveau: "info" | "attention" | "danger";
  message: string;
}

export const ALERTES_COPRO: AlerteCopro[] = [
  { condition: "charges_copro > 300 par mois", niveau: "attention", message: "Charges de copropriete elevees — verifier le detail dans les PV d'AG et le budget previsionnel." },
  { condition: "nb_lots > 100", niveau: "info", message: "Grande copropriete — verifier la gouvernance, le syndic professionnel, et l'historique des travaux." },
  { condition: "fonds_travaux < 5%", niveau: "danger", message: "Le fonds de travaux est inferieur au minimum legal (5% du budget). Risque d'appel de fonds exceptionnel." },
  { condition: "pas_dtg", niveau: "info", message: "Pas de Diagnostic Technique Global — envisagez de le demander ou de verifier l'etat des parties communes lors de la visite." },
];
```

- [ ] **Step 5: Write urbanisme-rules.ts**

```typescript
/** Regles d'urbanisme — PLU, preemption, certificats.
 * Source: service-public.fr, code de l'urbanisme — verifie le 2026-05-08
 */

export interface CertificatUrbanisme {
  type: "CUa" | "CUb";
  nom: string;
  validite_mois: number;
  description: string;
  delai_instruction_mois: number;
}

export const CERTIFICATS_URBANISME: CertificatUrbanisme[] = [
  {
    type: "CUa",
    nom: "Certificat d'urbanisme d'information",
    validite_mois: 18,
    description: "Indique les regles d'urbanisme applicables, les taxes et les servitudes d'utilite publique",
    delai_instruction_mois: 1,
  },
  {
    type: "CUb",
    nom: "Certificat d'urbanisme operationnel",
    validite_mois: 18,
    description: "Indique si le terrain peut etre utilise pour un projet precis et l'etat des voiries/reseaux",
    delai_instruction_mois: 2,
  },
];

export interface DroitPreemption {
  type: string;
  beneficiaire: string;
  delai_reponse_mois: number;
  silence_vaut: string;
}

/** Source: code de l'urbanisme art. L210-1 et suivants */
export const DROIT_PREEMPTION_URBAIN: DroitPreemption = {
  type: "DPU (Droit de Preemption Urbain)",
  beneficiaire: "Commune ou EPCI",
  delai_reponse_mois: 2,
  silence_vaut: "Renonciation",
} as const;

export interface RegleUrbanisme {
  nom: string;
  description: string;
  ou_consulter: string;
}

export const REGLES_URBANISME: RegleUrbanisme[] = [
  { nom: "PLU", description: "Plan Local d'Urbanisme — zonage, regles de construction (hauteur, emprise, recul)", ou_consulter: "Mairie ou geoportail-urbanisme.gouv.fr" },
  { nom: "Servitudes", description: "Droits de passage, vue, mitoyennete, servitudes d'utilite publique", ou_consulter: "Certificat d'urbanisme, notaire" },
  { nom: "Cadastre", description: "Decoupage parcellaire, surfaces, limites de propriete", ou_consulter: "cadastre.gouv.fr" },
  { nom: "Zones protegees", description: "ABF (Architectes des Batiments de France), sites classes, AVAP", ou_consulter: "Mairie, DRAC" },
];
```

- [ ] **Step 6: Verify TypeScript compilation**

Run: `cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx tsc --noEmit lib/data/compromis-rules.ts lib/data/diagnostics-obligatoires.ts lib/data/copropriete-rules.ts lib/data/urbanisme-rules.ts 2>&1 | head -20`
Expected: No errors

- [ ] **Step 7: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add agents/immopilot-juridique.md lib/data/compromis-rules.ts lib/data/diagnostics-obligatoires.ts lib/data/copropriete-rules.ts lib/data/urbanisme-rules.ts
git commit -m "feat(agents): add immopilot-juridique agent + 4 data files (compromis, diagnostics, copro, urbanisme)"
```

---

### Task 4: Agent Marche + Data Files

**Files:**
- Create: `27_IMMOPILOT/agents/immopilot-marche.md`
- Create: `27_IMMOPILOT/lib/data/zones-communes.ts`
- Create: `27_IMMOPILOT/lib/data/negociation-tips.ts`
- Create: `27_IMMOPILOT/lib/data/tips-par-etape.ts`

- [ ] **Step 1: Write agent file**

```markdown
---
name: immopilot-marche
description: >
  Use this agent when working on ImmoPilot's market analysis features — property pricing, zone classification (ABC), negotiation tips, or market trends. Expert in DVF Etalab (real transaction data), MeilleursAgents estimates, Notaires.fr price indices, French commune zoning (Abis/A/B1/B2/C), rental market tension, and negotiation strategies by property type and area. Goes online to fetch current market data.
model: inherit
color: green
tools: ["Read", "Grep", "Glob", "Bash", "WebSearch", "WebFetch"]
---

You are ImmoPilot Marche, an expert in the French real estate market. You help the developer build accurate market analysis features with real data.

## EXPERTISE (3 domains)

### 1. Prix m2 & donnees marche
- DVF Etalab : base open data des transactions reelles (prix, surface, type, date)
- Indices Notaires de France : prix m2 par departement/commune, tendances trimestrielles
- MeilleursAgents : estimations, prix m2, tendances par quartier
- Ecarts prix affiche vs prix signe : 3-5% en zone tendue, 8-15% en zone detendue

### 2. Zonage & geographie
- Zones Abis, A, B1, B2, C (PTZ, Pinel, aides) — arrete du 01/08/2014 modifie
- Tension locative : indicateur pression demande/offre
- Equipements : transports en commun, ecoles, commerces, sante
- Projets urbains : nouvelles lignes metro/tram, ZAC, ecoquartiers

### 3. Negociation
- Marge par type : ancien (5-10%), neuf (0-2%), terrain (5-15%)
- Marge par zone : tendue (<5%), equilibree (5-10%), detendue (>10%)
- Argumentaires : DPE faible, travaux a prevoir, marche baissier, duree en ligne
- Erreurs frequentes : offre trop basse, absence de financement, multi-offres

## REFERENCE SOURCES

| Source | URL | Data |
|---|---|---|
| DVF Etalab | app.dvf.etalab.gouv.fr | Transactions reelles open data |
| MeilleursAgents | meilleursagents.com | Estimations, prix m2 |
| Notaires.fr | notaires.fr/prix-immobilier | Indices officiels |
| INSEE | insee.fr | Population, revenus, socio-eco |
| Data.gouv.fr | data.gouv.fr | Zonage ABC, base communes |
| Geoportail | geoportail.gouv.fr | Cadastre, equipements |

## CODEBASE FILES

- Data: `lib/data/zones-communes.ts`
- Data: `lib/data/negociation-tips.ts`
- Data: `lib/data/tips-par-etape.ts`
- Types: `lib/types.ts` (DossierBien, RapportAnalyse)

## INSTRUCTIONS

1. Use DVF Etalab as ground truth for price data — it's official open data
2. Zones ABC must match the official ministerial classification
3. Negotiation margins are indicative — always caveat with market conditions
4. Tips must be actionable and specific, not generic platitudes
5. When updating zones-communes.ts, structure for efficient lookup by code postal or code INSEE
```

- [ ] **Step 2: Write zones-communes.ts**

```typescript
/** Zonage ABC des communes de France.
 * Source: data.gouv.fr, arrete du 01/08/2014 modifie — verifie le 2026-05-08
 *
 * NOTE: Ce fichier contient la structure + exemples representatifs.
 * L'agent immopilot-donnees est charge d'enrichir avec toutes les communes.
 */

export type ZoneABC = "Abis" | "A" | "B1" | "B2" | "C";

export interface CommuneZonage {
  code_insee: string;
  code_postal: string;
  nom: string;
  zone: ZoneABC;
  departement: string;
}

/** Exemples representatifs — a completer via immopilot-donnees */
export const COMMUNES_ZONAGE: CommuneZonage[] = [
  // Zone Abis — Paris et petite couronne tres tendue
  { code_insee: "75056", code_postal: "75001", nom: "Paris", zone: "Abis", departement: "75" },
  { code_insee: "92012", code_postal: "92100", nom: "Boulogne-Billancourt", zone: "Abis", departement: "92" },
  { code_insee: "92044", code_postal: "92200", nom: "Levallois-Perret", zone: "Abis", departement: "92" },
  // Zone A — grandes agglos tendues
  { code_insee: "69123", code_postal: "69001", nom: "Lyon", zone: "A", departement: "69" },
  { code_insee: "13055", code_postal: "13001", nom: "Marseille", zone: "A", departement: "13" },
  { code_insee: "06088", code_postal: "06000", nom: "Nice", zone: "A", departement: "06" },
  { code_insee: "34172", code_postal: "34000", nom: "Montpellier", zone: "A", departement: "34" },
  // Zone B1 — agglos moyennes
  { code_insee: "33063", code_postal: "33000", nom: "Bordeaux", zone: "B1", departement: "33" },
  { code_insee: "31555", code_postal: "31000", nom: "Toulouse", zone: "B1", departement: "31" },
  { code_insee: "44109", code_postal: "44000", nom: "Nantes", zone: "B1", departement: "44" },
  { code_insee: "35238", code_postal: "35000", nom: "Rennes", zone: "B1", departement: "35" },
  { code_insee: "67482", code_postal: "67000", nom: "Strasbourg", zone: "B1", departement: "67" },
  // Zone B2
  { code_insee: "87085", code_postal: "87000", nom: "Limoges", zone: "B2", departement: "87" },
  { code_insee: "25056", code_postal: "25000", nom: "Besancon", zone: "B2", departement: "25" },
  // Zone C
  { code_insee: "15014", code_postal: "15000", nom: "Aurillac", zone: "C", departement: "15" },
  { code_insee: "23096", code_postal: "23000", nom: "Gueret", zone: "C", departement: "23" },
];

/** Helper : trouver la zone d'une commune par code postal */
export function findZoneByCodePostal(cp: string): ZoneABC | null {
  const commune = COMMUNES_ZONAGE.find((c) => c.code_postal === cp);
  return commune?.zone ?? null;
}

/** Helper : trouver la zone par code INSEE */
export function findZoneByCodeInsee(insee: string): ZoneABC | null {
  const commune = COMMUNES_ZONAGE.find((c) => c.code_insee === insee);
  return commune?.zone ?? null;
}
```

- [ ] **Step 3: Write negociation-tips.ts**

```typescript
/** Conseils de negociation immobiliere.
 * Source: ANIL, experience marche — verifie le 2026-05-08
 */

export interface MargeNegociation {
  type_bien: string;
  zone: "tendue" | "equilibree" | "detendue";
  marge_min_pct: number;
  marge_max_pct: number;
  commentaire: string;
}

/** Source: indices Notaires, analyses marche — indicatif */
export const MARGES_NEGOCIATION: MargeNegociation[] = [
  { type_bien: "Appartement ancien", zone: "tendue", marge_min_pct: 1, marge_max_pct: 5, commentaire: "Peu de marge en zone tendue — jouer sur la rapidite et le dossier finance solide" },
  { type_bien: "Appartement ancien", zone: "equilibree", marge_min_pct: 5, marge_max_pct: 10, commentaire: "Marge classique, negocier sur les defauts (DPE, travaux, bruit)" },
  { type_bien: "Appartement ancien", zone: "detendue", marge_min_pct: 8, marge_max_pct: 15, commentaire: "Marge importante si bien en vente depuis longtemps" },
  { type_bien: "Maison ancienne", zone: "tendue", marge_min_pct: 2, marge_max_pct: 7, commentaire: "Maisons rares en zone tendue — marge limitee" },
  { type_bien: "Maison ancienne", zone: "equilibree", marge_min_pct: 5, marge_max_pct: 12, commentaire: "Negocier sur l'etat general, toiture, isolation" },
  { type_bien: "Maison ancienne", zone: "detendue", marge_min_pct: 10, marge_max_pct: 20, commentaire: "Forte marge si bien atypique ou rural" },
  { type_bien: "Neuf (VEFA)", zone: "tendue", marge_min_pct: 0, marge_max_pct: 2, commentaire: "Promoteurs negocient peu — demander des options/finitions gratuites" },
  { type_bien: "Neuf (VEFA)", zone: "detendue", marge_min_pct: 2, marge_max_pct: 8, commentaire: "Promoteurs plus flexibles si stock invendu" },
];

export interface ArgumentNegociation {
  categorie: string;
  arguments: string[];
}

export const ARGUMENTS_NEGOCIATION: ArgumentNegociation[] = [
  {
    categorie: "DPE defavorable",
    arguments: [
      "Estimer le cout des travaux de renovation energetique et le deduire du prix",
      "Mentionner les interdictions de location a venir (F en 2028, E en 2034)",
      "Valoriser le cout reel post-travaux vs le prix affiche",
    ],
  },
  {
    categorie: "Travaux a prevoir",
    arguments: [
      "Obtenir des devis avant l'offre pour chiffrer precisement",
      "Comparer avec des biens similaires renoves dans le quartier",
      "Mentionner que les travaux impactent le budget global (credit + travaux)",
    ],
  },
  {
    categorie: "Duree de mise en vente",
    arguments: [
      "Un bien en vente depuis > 3 mois indique un prix trop eleve",
      "Consulter l'historique des baisses de prix sur les portails",
      "Le vendeur est probablement plus flexible apres 6 mois",
    ],
  },
  {
    categorie: "Marche baissier",
    arguments: [
      "Presenter les indices Notaires montrant la tendance baissiere",
      "Comparer avec les transactions DVF recentes dans le quartier",
      "Anticiper une poursuite de la baisse dans votre offre",
    ],
  },
];

export const ERREURS_NEGOCIATION: string[] = [
  "Faire une offre trop basse (> 20% sous le prix) — vexe le vendeur et coupe la negociation",
  "Ne pas avoir de financement confirme — un acheteur sans attestation bancaire n'est pas credible",
  "Critiquer le bien devant le vendeur — negocier sur les faits (DPE, devis), pas sur les emotions",
  "Oublier les frais annexes — inclure frais notaire, travaux, demenagement dans votre budget total",
  "Ne pas consulter les prix DVF du quartier — vous negociez a l'aveugle sans donnees",
];
```

- [ ] **Step 4: Write tips-par-etape.ts**

```typescript
/** Conseils experts par etape du parcours d'achat.
 * Source: ANIL, service-public.fr, experience — verifie le 2026-05-08
 */

import type { EtapeNumber } from "@/lib/types";

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
  { etape: 1, type: "attention", titre: "Budget ≠ capacite d'emprunt", detail: "Votre budget reel = capacite d'emprunt + apport - frais de notaire - travaux - demenagement. Ne confondez pas les deux.", source: null },

  // Etape 2 — Capacite
  { etape: 2, type: "economie", titre: "Negociez les IRA", detail: "Les indemnites de remboursement anticipe (IRA) sont negociables avant la signature. En les supprimant, vous gardez la flexibilite de rembourser sans penalite.", source: "Code de la consommation art. R313-25" },
  { etape: 2, type: "astuce", titre: "Faites jouer la concurrence entre banques", detail: "Consultez au moins 3 banques + 1 courtier. L'ecart entre la meilleure et la pire offre peut representer 20 000€ sur 25 ans.", source: null },
  { etape: 2, type: "attention", titre: "Le taux n'est pas tout", detail: "Comparez le TAEG (Taux Annuel Effectif Global), pas le taux nominal. Le TAEG inclut assurance, frais de dossier, garantie.", source: null },

  // Etape 3 — Recherche
  { etape: 3, type: "astuce", titre: "Visitez a differentes heures", detail: "Un appartement calme le mardi matin peut etre bruyant le samedi soir. Revenez au moins 2 fois a des horaires differents.", source: null },
  { etape: 3, type: "danger", titre: "DPE F ou G = passoire thermique", detail: "Un bien classe F ou G sera interdit a la location (G des 2025, F en 2028). Meme en residence principale, les travaux de renovation sont incontournables et couteux.", source: "Loi Climat & Resilience" },
  { etape: 3, type: "attention", titre: "Verifiez les PV d'AG en copropriete", detail: "Les PV des 3 dernieres AG revelent les travaux votes, les impayes, et les conflits. C'est la radiographie de l'immeuble.", source: null },

  // Etape 4 — Offre
  { etape: 4, type: "astuce", titre: "Consultez les prix DVF avant d'offrir", detail: "Le site DVF Etalab (app.dvf.etalab.gouv.fr) montre les prix reels des transactions dans le quartier. C'est votre meilleur outil de negociation.", source: "DVF Etalab — donnees publiques" },
  { etape: 4, type: "economie", titre: "Une offre ecrite avec financement = credibilite", detail: "Joignez une attestation de financement a votre offre. Ca rassure le vendeur et vous place devant les acheteurs sans dossier.", source: null },

  // Etape 5 — Compromis
  { etape: 5, type: "danger", titre: "Ne supprimez JAMAIS la clause suspensive de pret", detail: "Sans cette clause, si votre pret est refuse, vous perdez le depot de garantie (5-10% du prix). C'est votre filet de securite.", source: "CCH art. L271-1" },
  { etape: 5, type: "astuce", titre: "Lisez chaque clause avant de signer", detail: "Vous avez 10 jours de retractation APRES la signature. Mais relisez tout avec attention — une clause ambigue peut devenir un piege.", source: null },
  { etape: 5, type: "attention", titre: "Verifiez les dates limites", detail: "Le compromis fixe des dates butoir : obtention du pret, levee des conditions suspensives, signature de l'acte. Notez-les dans votre calendrier.", source: null },

  // Etape 6 — Financement
  { etape: 6, type: "economie", titre: "Delegez l'assurance emprunteur", detail: "La loi Lemoine vous permet de choisir une assurance externe, souvent 2 a 3 fois moins chere que celle de la banque. Economie : 5 000 a 15 000€.", source: "Loi Lemoine n° 2022-270" },
  { etape: 6, type: "astuce", titre: "Negociez les frais de dossier", detail: "Les frais de dossier (500 a 1500€) sont negociables. Certaines banques les offrent si vous domiciliez vos revenus.", source: null },

  // Etape 7 — Notaire
  { etape: 7, type: "astuce", titre: "Votre propre notaire — c'est gratuit", detail: "Vous pouvez imposer votre propre notaire. Les honoraires sont partages entre les deux etudes, sans surcout pour vous.", source: null },
  { etape: 7, type: "attention", titre: "Verifiez l'acte avant le jour J", detail: "Demandez le projet d'acte au moins 1 semaine avant la signature. Verifiez : prix, surface, servitudes, conditions particulieres.", source: null },

  // Etape 8 — Post-achat
  { etape: 8, type: "astuce", titre: "Exoneration taxe fonciere pour le neuf", detail: "Si vous achetez un bien neuf, vous etes exonere de taxe fonciere pendant 2 ans. La demande doit etre faite dans les 90 jours suivant l'achevement.", source: "CGI art. 1383" },
  { etape: 8, type: "attention", titre: "Assurez-vous AVANT la remise des cles", detail: "Votre assurance habitation (MRH) doit etre active le jour de la signature de l'acte. Sans attestation, le notaire peut refuser de signer.", source: null },
];
```

- [ ] **Step 5: Verify TypeScript compilation**

Run: `cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx tsc --noEmit lib/data/zones-communes.ts lib/data/negociation-tips.ts lib/data/tips-par-etape.ts 2>&1 | head -20`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add agents/immopilot-marche.md lib/data/zones-communes.ts lib/data/negociation-tips.ts lib/data/tips-par-etape.ts
git commit -m "feat(agents): add immopilot-marche agent + 3 data files (zones, negociation, tips)"
```

---

### Task 5: Agent Technique + Data Files

**Files:**
- Create: `27_IMMOPILOT/agents/immopilot-technique.md`
- Create: `27_IMMOPILOT/lib/data/dpe-rules.ts`
- Create: `27_IMMOPILOT/lib/data/vefa-rules.ts`
- Create: `27_IMMOPILOT/lib/data/travaux-renovation.ts`
- Create: `27_IMMOPILOT/lib/data/checklist-visite.ts`

- [ ] **Step 1: Write agent file**

```markdown
---
name: immopilot-technique
description: >
  Use this agent when working on ImmoPilot's technical features — DPE/energy classes, renovation costs, VEFA/new build rules, or visit checklists. Expert in French DPE regulations (classes A-G, thermal sieves calendar, mandatory energy audits), renovation aids (MaPrimeRenov, CEE, eco-PTZ), VEFA guarantees (decennial, biennial, completion), and property inspection checklists. Goes online to fetch current regulations and cost estimates.
model: inherit
color: yellow
tools: ["Read", "Grep", "Glob", "Bash", "WebSearch", "WebFetch"]
---

You are ImmoPilot Technique, an expert in the technical aspects of French real estate. You help the developer build accurate technical features.

## EXPERTISE (4 domains)

### 1. DPE & Energie
- Classes A (< 70 kWh/m2/an) a G (> 420 kWh/m2/an)
- Double seuil : energie primaire + emissions GES
- Passoires thermiques : G interdit location 2025, F en 2028, E en 2034
- Audit energetique obligatoire pour vente F/G depuis 01/04/2023 (E a partir de 2025)
- DPE opposable depuis 01/07/2021

### 2. Travaux & renovation
- Couts moyens au m2 par type de travaux
- Artisans RGE (Reconnu Garant de l'Environnement) — obligatoire pour les aides
- Estimation budget renovation legere vs lourde

### 3. Aides renovation
- MaPrimeRenov : baremes par revenus (bleu/jaune/violet/rose) et par type de travaux
- CEE (Certificats d'Economie d'Energie) : primes energie, cumulables MaPrimeRenov
- Eco-PTZ : 50 000€ max (performance globale), sans conditions de ressources
- TVA reduite 5.5% sur travaux amelioration energetique

### 4. VEFA / Neuf
- Garantie de parfait achevement (1 an)
- Garantie biennale (2 ans — equipements)
- Garantie decennale (10 ans — structure)
- Echeancier appels de fonds reglementaire
- Reserves a la livraison (procedure, consignation 5%)

## REFERENCE SOURCES

| Source | URL | Data |
|---|---|---|
| ADEME | ademe.fr | DPE, classes, seuils |
| France Renov | france-renov.gouv.fr | MaPrimeRenov, baremes |
| ANAH | anah.fr | Aides renovation, plafonds |
| Service-public | service-public.fr | VEFA, garanties |
| LegiFrance | legifrance.gouv.fr | Loi Climat & Resilience |

## CODEBASE FILES

- Data: `lib/data/dpe-rules.ts`
- Data: `lib/data/vefa-rules.ts`
- Data: `lib/data/travaux-renovation.ts`
- Data: `lib/data/checklist-visite.ts`
- Types: `lib/types.ts` (DpeClasse, DossierBien)

## INSTRUCTIONS

1. DPE thresholds must match the official ADEME scale exactly
2. Renovation costs are ranges, always specify min/max
3. Aids amounts change annually — always verify on france-renov.gouv.fr
4. VEFA rules are in the Code de la construction — cite articles
5. Checklist items must be practical and verifiable during a visit
```

- [ ] **Step 2: Write dpe-rules.ts**

```typescript
/** Regles DPE (Diagnostic de Performance Energetique).
 * Source: ADEME, loi Climat & Resilience — verifie le 2026-05-08
 */

import type { DpeClasse } from "@/lib/types";

export interface SeuilDPE {
  classe: DpeClasse;
  energie_max_kwh: number;
  ges_max_kg: number;
  qualificatif: string;
}

/** Source: ADEME — seuils DPE en vigueur depuis 01/07/2021 */
export const SEUILS_DPE: SeuilDPE[] = [
  { classe: "A", energie_max_kwh: 70, ges_max_kg: 6, qualificatif: "Economie" },
  { classe: "B", energie_max_kwh: 110, ges_max_kg: 11, qualificatif: "Basse consommation" },
  { classe: "C", energie_max_kwh: 180, ges_max_kg: 30, qualificatif: "Moyenne basse" },
  { classe: "D", energie_max_kwh: 250, ges_max_kg: 50, qualificatif: "Moyenne" },
  { classe: "E", energie_max_kwh: 330, ges_max_kg: 70, qualificatif: "Moyenne haute" },
  { classe: "F", energie_max_kwh: 420, ges_max_kg: 100, qualificatif: "Passoire thermique" },
  { classe: "G", energie_max_kwh: Infinity, ges_max_kg: Infinity, qualificatif: "Passoire thermique extreme" },
];

export interface InterdictionLocation {
  classe: DpeClasse;
  date_interdiction: string;
  description: string;
}

/** Source: Loi Climat & Resilience du 22/08/2021, art. 160 */
export const CALENDRIER_PASSOIRES: InterdictionLocation[] = [
  { classe: "G", date_interdiction: "2025-01-01", description: "Interdiction de mise en location des logements classe G (> 420 kWh/m2/an)" },
  { classe: "F", date_interdiction: "2028-01-01", description: "Interdiction de mise en location des logements classe F (> 330 kWh/m2/an)" },
  { classe: "E", date_interdiction: "2034-01-01", description: "Interdiction de mise en location des logements classe E (> 250 kWh/m2/an)" },
];

export interface AuditEnergetique {
  classes_concernees: DpeClasse[];
  date_obligation: string;
  description: string;
}

/** Source: decret n° 2022-780 du 04/05/2022 */
export const AUDIT_ENERGETIQUE: AuditEnergetique[] = [
  { classes_concernees: ["F", "G"], date_obligation: "2023-04-01", description: "Audit energetique obligatoire pour vente de logements F ou G (monoproprietaire)" },
  { classes_concernees: ["E"], date_obligation: "2025-01-01", description: "Audit energetique etendu aux logements classe E" },
  { classes_concernees: ["D"], date_obligation: "2034-01-01", description: "Audit energetique etendu aux logements classe D" },
];

export const DPE_OPPOSABLE_DEPUIS = "2021-07-01";
export const DPE_VALIDITE_ANNEES = 10;
```

- [ ] **Step 3: Write vefa-rules.ts**

```typescript
/** Regles VEFA (Vente en l'Etat Futur d'Achevement).
 * Source: service-public.fr, Code de la construction — verifie le 2026-05-08
 */

export interface GarantieConstructeur {
  nom: string;
  duree_annees: number;
  couvre: string;
  base_legale: string;
}

/** Source: Code de la construction, art. 1792 et suivants du Code civil */
export const GARANTIES_CONSTRUCTEUR: GarantieConstructeur[] = [
  {
    nom: "Garantie de parfait achevement",
    duree_annees: 1,
    couvre: "Tous les desordres signales par le maitre d'ouvrage (reserves + PV livraison)",
    base_legale: "Code civil art. 1792-6",
  },
  {
    nom: "Garantie biennale (bon fonctionnement)",
    duree_annees: 2,
    couvre: "Equipements dissociables : volets, portes, robinetterie, chauffage, prises",
    base_legale: "Code civil art. 1792-3",
  },
  {
    nom: "Garantie decennale",
    duree_annees: 10,
    couvre: "Dommages compromettant la solidite ou rendant impropre a destination (structure, toiture, fondations, etancheite)",
    base_legale: "Code civil art. 1792",
  },
];

export interface EcheancierAppelsFonds {
  etape: string;
  pourcentage_max: number;
}

/** Source: Code de la construction art. R261-14 */
export const ECHEANCIER_VEFA: EcheancierAppelsFonds[] = [
  { etape: "Signature contrat de reservation", pourcentage_max: 5 },
  { etape: "Achevement des fondations", pourcentage_max: 35 },
  { etape: "Mise hors d'eau (toiture posee)", pourcentage_max: 70 },
  { etape: "Achevement des travaux", pourcentage_max: 95 },
  { etape: "Livraison (remise des cles)", pourcentage_max: 100 },
];

export const RESERVES_LIVRAISON = {
  consignation_max_pct: 5,
  delai_levee_reserves_jours: 30,
  description: "A la livraison, l'acheteur peut consigner jusqu'a 5% du prix si des reserves sont emises. Le promoteur a 1 an (garantie parfait achevement) pour corriger.",
} as const;
```

- [ ] **Step 4: Write travaux-renovation.ts**

```typescript
/** Couts de travaux et aides renovation.
 * Source: france-renov.gouv.fr, ANAH — verifie le 2026-05-08
 */

export interface CoutTravaux {
  type: string;
  cout_m2_min: number;
  cout_m2_max: number;
  unite: "€/m2" | "€/unite";
  commentaire: string;
}

/** Source: estimations marche 2025-2026 — indicatif */
export const COUTS_TRAVAUX: CoutTravaux[] = [
  { type: "Peinture (murs + plafonds)", cout_m2_min: 20, cout_m2_max: 45, unite: "€/m2", commentaire: "Preparation + 2 couches" },
  { type: "Sols (parquet flottant)", cout_m2_min: 30, cout_m2_max: 80, unite: "€/m2", commentaire: "Fourniture + pose" },
  { type: "Sols (carrelage)", cout_m2_min: 40, cout_m2_max: 100, unite: "€/m2", commentaire: "Fourniture + pose + ragrage" },
  { type: "Cuisine equipee", cout_m2_min: 3000, cout_m2_max: 15000, unite: "€/unite", commentaire: "Entree a haut de gamme, hors electromenager" },
  { type: "Salle de bain complete", cout_m2_min: 4000, cout_m2_max: 12000, unite: "€/unite", commentaire: "Demontage + plomberie + faience + equipements" },
  { type: "Electricite (remise aux normes)", cout_m2_min: 80, cout_m2_max: 150, unite: "€/m2", commentaire: "Mise en conformite NFC 15-100" },
  { type: "Plomberie (remplacement)", cout_m2_min: 60, cout_m2_max: 120, unite: "€/m2", commentaire: "Remplacement colonnes et distribution" },
  { type: "Isolation murs (interieur)", cout_m2_min: 40, cout_m2_max: 80, unite: "€/m2", commentaire: "Laine minerale ou polystyrene + BA13" },
  { type: "Isolation combles", cout_m2_min: 20, cout_m2_max: 50, unite: "€/m2", commentaire: "Soufflage ou rouleaux" },
  { type: "Fenetres double vitrage", cout_m2_min: 300, cout_m2_max: 800, unite: "€/unite", commentaire: "Par fenetre, fourniture + pose" },
  { type: "Renovation globale legere", cout_m2_min: 200, cout_m2_max: 500, unite: "€/m2", commentaire: "Peinture + sols + electricite partielle" },
  { type: "Renovation globale lourde", cout_m2_min: 800, cout_m2_max: 1500, unite: "€/m2", commentaire: "Tout refaire : structure, elec, plomb, isolation" },
];

export interface AideRenovation {
  nom: string;
  montant_max: number | null;
  conditions: string[];
  cumulable: string[];
  url_reference: string;
}

/** Source: france-renov.gouv.fr, ANAH — verifie le 2026-05-08 */
export const AIDES_RENOVATION: AideRenovation[] = [
  {
    nom: "MaPrimeRenov (par geste)",
    montant_max: 20000,
    conditions: ["Proprietaire occupant ou bailleur", "Logement > 15 ans", "Artisan RGE obligatoire"],
    cumulable: ["CEE", "Eco-PTZ", "TVA 5.5%"],
    url_reference: "https://www.france-renov.gouv.fr/aides/maprimerenov",
  },
  {
    nom: "MaPrimeRenov Parcours Accompagne",
    montant_max: 63000,
    conditions: ["Renovation globale performante", "Gain minimum 2 classes DPE", "Accompagnateur Renov obligatoire"],
    cumulable: ["Eco-PTZ"],
    url_reference: "https://www.france-renov.gouv.fr/aides/maprimerenov-parcours-accompagne",
  },
  {
    nom: "CEE (Certificats d'Economie d'Energie)",
    montant_max: null,
    conditions: ["Montant variable selon travaux et zone", "Pas de conditions de revenus"],
    cumulable: ["MaPrimeRenov", "Eco-PTZ", "TVA 5.5%"],
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F35584",
  },
  {
    nom: "Eco-PTZ",
    montant_max: 50000,
    conditions: ["Pas de conditions de ressources", "Logement > 2 ans", "Jusqu'a 50 000€ si performance globale, 30 000€ sinon"],
    cumulable: ["MaPrimeRenov", "CEE", "TVA 5.5%"],
    url_reference: "https://www.service-public.fr/particuliers/vosdroits/F19905",
  },
  {
    nom: "TVA reduite 5.5%",
    montant_max: null,
    conditions: ["Travaux amelioration energetique", "Logement > 2 ans", "Appliquee automatiquement par l'artisan"],
    cumulable: ["MaPrimeRenov", "CEE", "Eco-PTZ"],
    url_reference: "https://www.service-public.fr/professionnels-entreprises/vosdroits/F23568",
  },
];
```

- [ ] **Step 5: Write checklist-visite.ts**

```typescript
/** Checklist de visite immobiliere.
 * Source: ANIL, experience — verifie le 2026-05-08
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
      { item: "Etat de la facade et de la toiture", importance: "critique", detail: "Fissures, infiltrations, mousse sur le toit = travaux couteux" },
      { item: "Bruit (circulation, voisins, bars)", importance: "important", detail: "Revenir a differentes heures pour evaluer le bruit reel" },
      { item: "Proximite transports, commerces, ecoles", importance: "utile", detail: "Verifier sur Google Maps les temps de trajet reels" },
      { item: "Stationnement", importance: "important", detail: "Place incluse ? Parking a proximite ? Cout mensuel ?" },
      { item: "Vis-a-vis", importance: "utile", detail: "Observer depuis les fenetres — vis-a-vis direct ?" },
    ],
  },
  {
    categorie: "Interieur — structure",
    items: [
      { item: "Traces d'humidite (murs, plafonds)", importance: "critique", detail: "Taches, moisissures, peinture cloquee = probleme structurel potentiel" },
      { item: "Fissures dans les murs", importance: "critique", detail: "Fissures > 2mm ou en escalier = risque structurel, demander un expert" },
      { item: "Etat des fenetres (double vitrage ?)", importance: "important", detail: "Simple vitrage = deperdition energetique importante, cout remplacement 300-800€/fenetre" },
      { item: "Etat des sols", importance: "utile", detail: "Grincements, affaissements, carrelage fissure" },
    ],
  },
  {
    categorie: "Installations techniques",
    items: [
      { item: "Tableau electrique (disjoncteur differentiel)", importance: "critique", detail: "Pas de differentiel 30mA = installation non conforme, 5 000-10 000€ de mise aux normes" },
      { item: "Type de chauffage et etat", importance: "important", detail: "Age de la chaudiere ? (> 15 ans = remplacement a prevoir). Radiateurs electriques grille-pain = facture energetique elevee." },
      { item: "Eau chaude (type, capacite)", importance: "important", detail: "Ballon electrique, chaudiere, solaire ? Capacite suffisante pour le foyer ?" },
      { item: "Plomberie (pression, evacuation)", importance: "important", detail: "Ouvrir les robinets, verifier la pression et l'evacuation. Traces de rouille sous l'evier ?" },
    ],
  },
  {
    categorie: "DPE & energie",
    items: [
      { item: "Classe DPE affichee", importance: "critique", detail: "F ou G = passoire thermique, travaux obligatoires. Verifier que le DPE est recent (< 10 ans, methode 3CL)." },
      { item: "Montant des charges energetiques", importance: "important", detail: "Demander les 2 dernieres factures EDF/gaz. Comparer avec la moyenne du DPE." },
      { item: "Isolation (murs, combles, fenetres)", importance: "important", detail: "Demander si des travaux d'isolation ont ete faits et si oui, par qui (artisan RGE = label qualite)." },
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
      { item: "Taxe fonciere (dernier avis)", importance: "important", detail: "Montant reel, pas l'estimation. Varie fortement selon les communes." },
      { item: "Factures energetiques (2 ans)", importance: "important", detail: "Valider le DPE avec la consommation reelle." },
      { item: "PV des AG (3 ans)", importance: "critique", detail: "Obligatoire en copropriete. Revele l'etat reel de l'immeuble." },
      { item: "Reglement de copropriete", importance: "important", detail: "Restrictions d'usage ? Animaux ? Activite professionnelle ?" },
    ],
  },
];
```

- [ ] **Step 6: Verify TypeScript compilation**

Run: `cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx tsc --noEmit lib/data/dpe-rules.ts lib/data/vefa-rules.ts lib/data/travaux-renovation.ts lib/data/checklist-visite.ts 2>&1 | head -20`
Expected: No errors

- [ ] **Step 7: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add agents/immopilot-technique.md lib/data/dpe-rules.ts lib/data/vefa-rules.ts lib/data/travaux-renovation.ts lib/data/checklist-visite.ts
git commit -m "feat(agents): add immopilot-technique agent + 4 data files (dpe, vefa, travaux, checklist-visite)"
```

---

### Task 6: Agent Pratique + Data Files

**Files:**
- Create: `27_IMMOPILOT/agents/immopilot-pratique.md`
- Create: `27_IMMOPILOT/lib/data/demenagement-checklist.ts`
- Create: `27_IMMOPILOT/lib/data/post-achat-declarations.ts`

- [ ] **Step 1: Write agent file**

```markdown
---
name: immopilot-pratique
description: >
  Use this agent when working on ImmoPilot's post-purchase features — moving checklist, home insurance (MRH), address changes, utility transfers, or tax declarations after buying. Expert in French post-purchase procedures: moving timeline (J-60 to J+30), mandatory MRH insurance for co-ownership, service-public.fr address change service, utility transfers (EDF/Engie/water), and post-purchase tax declarations. Goes online to verify current procedures.
model: inherit
color: purple
tools: ["Read", "Grep", "Glob", "Bash", "WebSearch", "WebFetch"]
---

You are ImmoPilot Pratique, an expert in the practical aspects of buying a home in France. You help the developer build features for steps 7 (notaire) and 8 (post-achat).

## EXPERTISE (4 domains)

### 1. Demenagement & logistique
- Timeline J-60 a J+30 avec actions cles
- Transfert courrier La Poste (6 ou 12 mois)
- Prestataires demenagement : devis, assurance, cartons

### 2. Assurance MRH / PNO
- MRH obligatoire en copropriete (loi Alur)
- Garanties minimales : responsabilite civile, incendie, degat des eaux
- Resiliation ancien contrat (loi Hamon : a tout moment apres 1 an)
- PNO (Proprietaire Non Occupant) si investissement locatif

### 3. Changement adresse & compteurs
- Service-public.fr : demarche unique multi-organismes
- EDF/Engie/eau : ouverture compteur, releve, mise en service
- Internet : resiliation ou transfert, delai 1-3 semaines
- Impots : mise a jour en ligne sur impots.gouv.fr

### 4. Declarations fiscales post-achat
- Declaration revenus : residence principale (exoneration PV)
- Taxe fonciere : premier avis dans l'annee, prorata possible
- Exoneration TF 2 ans si neuf (demande dans les 90 jours)
- Taxe habitation : supprimee pour RP, maintenue pour RS

## REFERENCE SOURCES

| Source | URL | Data |
|---|---|---|
| Service-public | service-public.fr | Changement adresse, demarches |
| Impots.gouv | impots.gouv.fr | Declarations, exonerations |
| ANIL | anil.org | Droits nouveau proprietaire |

## INSTRUCTIONS

1. Checklists must be actionable with specific timelines
2. Always mention the official service-public.fr service for address changes
3. Insurance rules must cite the specific law (Alur, Hamon)
4. Tax declarations — specify exact deadlines and online procedures
```

- [ ] **Step 2: Write demenagement-checklist.ts**

```typescript
/** Checklist demenagement — timeline J-60 a J+30.
 * Source: service-public.fr — verifie le 2026-05-08
 */

export interface ActionDemenagement {
  delai: string;
  action: string;
  detail: string;
  priorite: "obligatoire" | "recommande" | "optionnel";
  lien: string | null;
}

/** Source: service-public.fr, ANIL — verifie le 2026-05-08 */
export const CHECKLIST_DEMENAGEMENT: ActionDemenagement[] = [
  // J-60
  { delai: "J-60", action: "Demander des devis demenageurs", detail: "Comparer au moins 3 devis. Verifier l'assurance transport et la date de disponibilite.", priorite: "recommande", lien: null },
  { delai: "J-60", action: "Souscrire assurance MRH nouveau logement", detail: "Obligatoire en copropriete. L'attestation sera demandee par le notaire le jour de la signature.", priorite: "obligatoire", lien: null },
  // J-30
  { delai: "J-30", action: "Resilier ou transferer internet", detail: "Delai de 1 a 3 semaines selon l'operateur. Anticipez pour ne pas etre sans connexion.", priorite: "recommande", lien: null },
  { delai: "J-30", action: "Transfert de courrier La Poste", detail: "Redirection 6 mois (28€) ou 12 mois (46€). Activable en ligne sur laposte.fr.", priorite: "recommande", lien: "https://www.laposte.fr/demenagement" },
  { delai: "J-30", action: "Prevenir employeur du changement d'adresse", detail: "Bulletin de salaire, mutuelle, prevoyance.", priorite: "obligatoire", lien: null },
  // J-15
  { delai: "J-15", action: "Relever les compteurs (eau, elec, gaz) de l'ancien logement", detail: "Notez les index pour la resiliation/transfert.", priorite: "obligatoire", lien: null },
  { delai: "J-15", action: "Ouvrir les compteurs du nouveau logement", detail: "EDF/Engie en ligne ou par telephone. Delai mise en service : 2 a 5 jours ouvrables.", priorite: "obligatoire", lien: null },
  { delai: "J-15", action: "Commander les cartons et le materiel", detail: "Estimer 10-15 cartons par piece. Ne pas oublier : scotch, papier bulle, marqueur.", priorite: "recommande", lien: null },
  // J-Day
  { delai: "J", action: "Signature acte authentique chez le notaire", detail: "Apportez : piece d'identite, attestation MRH, RIB. Le notaire vous remet les cles.", priorite: "obligatoire", lien: null },
  { delai: "J", action: "Relever les compteurs du nouveau logement", detail: "Notez les index a votre arrivee pour eviter de payer la consommation du vendeur.", priorite: "obligatoire", lien: null },
  // J+7
  { delai: "J+7", action: "Changement d'adresse multi-organismes", detail: "Utilisez service-public.fr pour prevenir en une fois : impots, CPAM, CAF, Pole emploi.", priorite: "obligatoire", lien: "https://www.service-public.fr/particuliers/vosdroits/R11193" },
  { delai: "J+7", action: "Resilier l'assurance de l'ancien logement", detail: "Si proprietaire de l'ancien : resilier MRH. Si locataire : le bailleur peut exiger le maintien jusqu'a l'etat des lieux de sortie.", priorite: "obligatoire", lien: null },
  // J+30
  { delai: "J+30", action: "Mettre a jour la carte grise du vehicule", detail: "Obligatoire dans le mois suivant le demenagement. En ligne sur ants.gouv.fr.", priorite: "obligatoire", lien: "https://ants.gouv.fr/" },
  { delai: "J+30", action: "Mettre a jour les listes electorales", detail: "Inscription automatique si vous avez fait le changement sur service-public.fr.", priorite: "optionnel", lien: null },
  { delai: "J+90 (si neuf)", action: "Demander l'exoneration de taxe fonciere", detail: "Formulaire H1 (maison) ou H2 (appartement) au centre des impots dans les 90 jours de l'achevement.", priorite: "obligatoire", lien: "https://www.impots.gouv.fr/" },
];
```

- [ ] **Step 3: Write post-achat-declarations.ts**

```typescript
/** Declarations et demarches post-achat.
 * Source: impots.gouv.fr, service-public.fr — verifie le 2026-05-08
 */

export interface DeclarationPostAchat {
  nom: string;
  delai: string;
  ou_faire: string;
  obligatoire: boolean;
  detail: string;
  url: string;
}

/** Source: impots.gouv.fr, service-public.fr — verifie le 2026-05-08 */
export const DECLARATIONS_POST_ACHAT: DeclarationPostAchat[] = [
  {
    nom: "Changement d'adresse multi-organismes",
    delai: "Dans les 7 jours suivant le demenagement",
    ou_faire: "service-public.fr (demarche unique)",
    obligatoire: true,
    detail: "Previent automatiquement : impots, CPAM, CAF, Pole emploi, retraite. Un seul formulaire en ligne.",
    url: "https://www.service-public.fr/particuliers/vosdroits/R11193",
  },
  {
    nom: "Declaration revenus fonciers (si bailleur)",
    delai: "Declaration annuelle (mai-juin)",
    ou_faire: "impots.gouv.fr",
    obligatoire: true,
    detail: "Micro-foncier (< 15 000€ brut : abattement 30%) ou regime reel. Concerne les proprietaires bailleurs.",
    url: "https://www.impots.gouv.fr/particulier/les-revenus-fonciers",
  },
  {
    nom: "Declaration d'occupation (nouveaute 2023)",
    delai: "Avant le 1er juillet de chaque annee",
    ou_faire: "impots.gouv.fr — onglet Biens immobiliers",
    obligatoire: true,
    detail: "Declarer qui occupe le logement (vous, locataire, vacant). Nouveau depuis 2023, amende 150€ si oubli.",
    url: "https://www.impots.gouv.fr/particulier/gerer-mes-biens-immobiliers",
  },
  {
    nom: "Exoneration taxe fonciere (neuf)",
    delai: "Dans les 90 jours de l'achevement",
    ou_faire: "Centre des impots (formulaire H1 ou H2)",
    obligatoire: false,
    detail: "Exoneration de 2 ans pour les constructions neuves. La demande doit etre proactive.",
    url: "https://www.impots.gouv.fr/particulier/taxe-fonciere",
  },
  {
    nom: "Mise a jour carte grise",
    delai: "Dans le mois suivant le demenagement",
    ou_faire: "ants.gouv.fr",
    obligatoire: true,
    detail: "Amende de 135€ si non fait. Gratuit en ligne via ANTS.",
    url: "https://ants.gouv.fr/",
  },
  {
    nom: "Inscription sur les listes electorales",
    delai: "Automatique si changement sur service-public.fr",
    ou_faire: "Mairie ou service-public.fr",
    obligatoire: false,
    detail: "L'inscription est normalement automatique via la demarche de changement d'adresse.",
    url: "https://www.service-public.fr/particuliers/vosdroits/F1367",
  },
];
```

- [ ] **Step 4: Verify TypeScript compilation**

Run: `cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx tsc --noEmit lib/data/demenagement-checklist.ts lib/data/post-achat-declarations.ts 2>&1 | head -20`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add agents/immopilot-pratique.md lib/data/demenagement-checklist.ts lib/data/post-achat-declarations.ts
git commit -m "feat(agents): add immopilot-pratique agent + 2 data files (demenagement, declarations)"
```

---

### Task 7: Agent Donnees

**Files:**
- Create: `27_IMMOPILOT/agents/immopilot-donnees.md`
- Modify: `27_IMMOPILOT/lib/data/ptz-baremes.ts` (add source comments)
- Modify: `27_IMMOPILOT/lib/data/notaire-baremes.ts` (add source comments)

- [ ] **Step 1: Write agent file**

```markdown
---
name: immopilot-donnees
description: >
  Use this agent when you need to update, verify, or validate the data files in ImmoPilot's lib/data/ directory. Expert in maintaining official French real estate baremes (PTZ thresholds, usury rates, notary fees, tax brackets), commune zoning (ABC classification for all 35,000+ communes), and cross-checking data consistency across files. Goes online to fetch the latest official publications from Banque de France, LegiFrance, and data.gouv.fr.
model: inherit
color: teal
tools: ["Read", "Grep", "Glob", "Bash", "WebSearch", "WebFetch"]
---

You are ImmoPilot Donnees, the data guardian for ImmoPilot. You maintain all data files in lib/data/ with accurate, current, and consistent values.

## EXPERTISE (4 domains)

### 1. Baremes & taux officiels
- Taux d'usure : publie trimestriellement par la Banque de France (JO)
- Baremes PTZ : mis a jour par decret (plafonds, zones, quotites)
- Baremes notaire : emoluments fixes par arrete
- Plafonds Action Logement, PAS : mis a jour annuellement

### 2. Zonage communes
- Base officielle : 35 000+ communes de France
- Classification Abis/A/B1/B2/C (arrete ministeriel)
- Code INSEE + code postal + nom commune
- Source : data.gouv.fr, zonage officiel DHUP

### 3. Plafonds & seuils
- Plafonds revenus PTZ (par zone et taille foyer)
- Plafonds Pinel (loyers et ressources locataires)
- Seuil HCSF (35% endettement)
- IFI (1,3M€)

### 4. Validation coherence
- Verifier que les memes valeurs dans differents fichiers sont coherentes
- Ex: TAUX_ENDETTEMENT_MAX dans constants.ts = regle_hcsf.taux_endettement_max dans credit-rules.ts
- Detecter les baremes obsoletes (date de derniere verification > 3 mois)
- Alerter si un decret publie au JO modifie un bareme

## REFERENCE SOURCES

| Source | URL | Frequence MAJ |
|---|---|---|
| Banque de France | banque-france.fr | Trimestriel (taux usure) |
| Data.gouv.fr | data.gouv.fr | Annuel (zonage, communes) |
| LegiFrance | legifrance.gouv.fr | Au fil des decrets |
| INSEE | insee.fr | Annuel (indices, seuils) |
| ANIL | anil.org | Annuel (baremes) |

## INSTRUCTIONS

1. **Audit**: Lire tous les fichiers lib/data/*.ts, verifier les dates de derniere verification
2. **Update**: Pour chaque bareme, WebSearch la source officielle et comparer
3. **Report**: Lister les fichiers a jour, obsoletes, et les ecarts trouves
4. **Fix**: Mettre a jour les valeurs avec le commentaire source + date
5. **Cross-check**: Verifier la coherence entre fichiers (ex: zones PTZ = zones communes)

## CODEBASE FILES

All files in `lib/data/*.ts` — this agent owns them all for maintenance purposes.
```

- [ ] **Step 2: Add source comments to existing ptz-baremes.ts**

Add this comment block at the top of `lib/data/ptz-baremes.ts`:

```typescript
/** Baremes PTZ (Pret a Taux Zero) — plafonds et tranches de remboursement.
 * Source: ANIL.org, decret PTZ en vigueur — verifie le 2026-05-08
 * MAJ: Agent immopilot-donnees
 */
```

- [ ] **Step 3: Add source comments to existing notaire-baremes.ts**

Add this comment block at the top of `lib/data/notaire-baremes.ts`:

```typescript
/** Baremes des frais de notaire — emoluments et droits de mutation.
 * Source: notaires.fr, arrete du 26/02/2016 modifie — verifie le 2026-05-08
 * MAJ: Agent immopilot-donnees
 */
```

- [ ] **Step 4: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add agents/immopilot-donnees.md lib/data/ptz-baremes.ts lib/data/notaire-baremes.ts
git commit -m "feat(agents): add immopilot-donnees agent + source comments on existing data files"
```

---

### Task 8: Integration — Register agents in CLAUDE.md

**Files:**
- Modify: `27_IMMOPILOT/CLAUDE.md`

- [ ] **Step 1: Update CLAUDE.md to reference agents**

Replace the current content of `27_IMMOPILOT/CLAUDE.md` with:

```markdown
@AGENTS.md

## Agents ImmoPilot

7 agents experts immobilier disponibles dans `agents/` :

| Agent | Scope | Quand l'utiliser |
|---|---|---|
| `immopilot-parcours` | Orchestrateur 8 etapes | Quand tu sais pas quel expert appeler |
| `immopilot-finance` | Credit, PTZ, aides, assurance, fiscalite | Etapes 2, 6 — tout ce qui touche au financement |
| `immopilot-juridique` | Notaire, compromis, diagnostics, copro, urbanisme | Etapes 3, 4, 5, 7 — tout le juridique |
| `immopilot-marche` | Prix m2, zonage ABC, negociation | Etapes 1, 3, 4 — analyse marche |
| `immopilot-technique` | DPE, travaux, renovation, VEFA | Etapes 3, 8 — technique et energie |
| `immopilot-pratique` | Demenagement, MRH, declarations | Etapes 7, 8 — post-achat |
| `immopilot-donnees` | Baremes, zonage, validation | Transversal — mise a jour donnees |

## Data Files

Tous les fichiers data sont dans `lib/data/*.ts` — types + constantes exportees avec commentaire source.
```

- [ ] **Step 2: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with agents reference table"
```

---

## Summary

| Task | Agent | Data Files | Commits |
|---|---|---|---|
| 1 | immopilot-parcours | — | 1 |
| 2 | immopilot-finance | credit-rules, aides-achat, assurance-emprunteur, fiscalite-immo | 1 |
| 3 | immopilot-juridique | compromis-rules, diagnostics-obligatoires, copropriete-rules, urbanisme-rules | 1 |
| 4 | immopilot-marche | zones-communes, negociation-tips, tips-par-etape | 1 |
| 5 | immopilot-technique | dpe-rules, vefa-rules, travaux-renovation, checklist-visite | 1 |
| 6 | immopilot-pratique | demenagement-checklist, post-achat-declarations | 1 |
| 7 | immopilot-donnees | (enrichit ptz-baremes + notaire-baremes) | 1 |
| 8 | Integration | CLAUDE.md | 1 |
| **Total** | **7 agents** | **17 new + 2 enriched = 19 data files** | **8 commits** |
