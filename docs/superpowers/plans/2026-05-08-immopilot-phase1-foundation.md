# ImmoPilot Phase 1: Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the ImmoPilot Next.js project with core types, calculators, storage layer, Supabase schema, and shell layouts.

**Architecture:** Next.js App Router with Tailwind CSS. localStorage for lightweight parcours state, Supabase for leads/dossiers/pros. Pure-function calculators with full test coverage. Root layout + parcours layout with progress bar.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Supabase (PostgreSQL + Storage), Vitest for testing

**Spec:** `docs/superpowers/specs/2026-05-08-immopilot-design.md`

---

## File Map

```
27_IMMOPILOT/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example
├── .gitignore
│
├── app/
│   ├── layout.tsx                      # Root layout: header, footer, fonts
│   ├── page.tsx                        # Homepage placeholder
│   ├── globals.css                     # Tailwind imports + CSS vars (brand colors)
│   │
│   └── parcours/
│       ├── layout.tsx                  # Parcours layout: progress bar + step nav
│       └── page.tsx                    # Dashboard placeholder
│
├── components/
│   ├── ui/
│   │   ├── header.tsx                  # Site header with nav
│   │   ├── footer.tsx                  # Site footer
│   │   └── progress-bar.tsx            # 8-step progress bar
│   └── parcours/
│       └── step-nav.tsx                # Previous/next step navigation
│
├── lib/
│   ├── types.ts                        # All TypeScript interfaces
│   ├── constants.ts                    # Brand colors, step definitions, baremes
│   ├── storage.ts                      # localStorage read/write/clear
│   ├── calculateurs/
│   │   ├── credit.ts                   # Simulateur credit (mensualites, capacite)
│   │   ├── notaire.ts                  # Frais de notaire (ancien/neuf)
│   │   ├── ptz.ts                      # Eligibilite et montant PTZ
│   │   └── endettement.ts              # Taux d'endettement
│   └── data/
│       ├── ptz-baremes.ts              # Baremes PTZ par zone
│       └── notaire-baremes.ts          # Tranches frais de notaire
│
├── tests/
│   ├── lib/
│   │   ├── storage.test.ts
│   │   └── calculateurs/
│   │       ├── credit.test.ts
│   │       ├── notaire.test.ts
│   │       ├── ptz.test.ts
│   │       └── endettement.test.ts
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
│
└── public/
    └── images/
```

---

### Task 1: Initialize Next.js project

**Files:**
- Create: `27_IMMOPILOT/package.json`
- Create: `27_IMMOPILOT/next.config.ts`
- Create: `27_IMMOPILOT/tsconfig.json`
- Create: `27_IMMOPILOT/tailwind.config.ts`
- Create: `27_IMMOPILOT/.gitignore`
- Create: `27_IMMOPILOT/.env.local.example`

- [ ] **Step 1: Create the Next.js project**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack --use-npm
```

Expected: Project created with `app/`, `public/`, `package.json`, etc.

- [ ] **Step 2: Install test dependencies**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Vitest**

Create `27_IMMOPILOT/vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4: Create .env.local.example**

Create `27_IMMOPILOT/.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=sk-your-key
```

- [ ] **Step 5: Verify project runs**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add package.json package-lock.json next.config.ts tsconfig.json tailwind.config.ts vitest.config.ts .gitignore .env.local.example app/ public/
git commit -m "feat(immopilot): initialize Next.js project with Tailwind and Vitest"
```

---

### Task 2: Define TypeScript types

**Files:**
- Create: `27_IMMOPILOT/lib/types.ts`

- [ ] **Step 1: Create all type definitions**

Create `27_IMMOPILOT/lib/types.ts`:

```typescript
// === Projet Immobilier (stored in localStorage) ===

export interface ProjetImmobilier {
  id: string;

  // Profil acheteur (Etape 1)
  situation: "celibataire" | "couple" | "famille";
  age: number;
  revenus_net: number;
  revenus_conjoint: number | null;
  charges_fixes: number;
  type_contrat: "cdi" | "cdd" | "independant" | "fonctionnaire" | "autre";
  taille_foyer: number;
  apport: number;
  code_postal: string;
  commune: string;
  type_bien: "appartement" | "maison";
  usage: "residence_principale";
  budget_max: number;

  // Capacite calculee (Etape 2)
  capacite_emprunt: number;
  taux_endettement: number;
  eligible_ptz: boolean;
  montant_ptz: number;
  duree_souhaitee: number;

  // Dossiers biens (Etape 3+)
  dossiers: DossierBien[];

  // Meta
  etape_courante: EtapeNumber;
  progression: StepProgress[];
  alertes: Alerte[];
  date_creation: string;
  lead_captured: boolean;
}

export type EtapeNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StepProgress {
  etape: EtapeNumber;
  pct: number;
}

// === Dossier Bien ===

export interface DossierBien {
  id: string;

  // Infos bien
  adresse: string;
  code_postal: string;
  commune: string;
  prix: number;
  surface: number;
  pieces: number;
  etage: number | null;
  exposition: string | null;
  type_chauffage: string | null;
  annee_construction: number;
  url_annonce: string | null;
  type_copro: boolean;
  nb_lots_copro: number | null;

  // DPE
  dpe_energie: DpeClasse;
  dpe_ges: DpeClasse | null;
  audit_energetique_present: boolean;

  // Financier
  charges_copro: number;
  taxe_fonciere: number;

  // Documents (refs Supabase Storage)
  documents: DocumentRef[];

  // Visite
  checklist_visite: ChecklistItem[];
  date_visite: string | null;
  notes_visite: string | null;

  // Transaction
  offre: Offre | null;
  compromis: Compromis | null;
  financement: Financement | null;
  notaire: Notaire | null;

  // Analyse IA
  analyse_ia: RapportAnalyse | null;
  score: number;

  // Statut
  statut: DossierStatut;
}

export type DpeClasse = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export type DossierStatut =
  | "en_recherche"
  | "offre"
  | "compromis"
  | "financement"
  | "acte"
  | "termine"
  | "abandonne";

export interface DocumentRef {
  nom: string;
  type: string;
  url: string;
}

export interface ChecklistItem {
  item: string;
  ok: boolean;
}

export interface Offre {
  montant: number | null;
  date: string | null;
  date_expiration: string | null;
  statut: "brouillon" | "envoyee" | "acceptee" | "refusee" | null;
}

export interface Compromis {
  signe: boolean;
  date_signature: string | null;
  date_retractation: string | null;
  depot_garantie: number | null;
  clauses_suspensives: string[];
  date_limite_financement: string | null;
  date_limite_acte: string | null;
}

export interface Financement {
  banque: string | null;
  taux_obtenu: number | null;
  assurance_taux: number | null;
  mensualite: number | null;
  duree: number | null;
  type_garantie: "caution" | "hypotheque" | null;
}

export interface Notaire {
  frais_estimes: number;
  date_acte: string | null;
  notaire_acheteur: string | null;
  notaire_vendeur: string | null;
}

// === Alertes ===

export interface Alerte {
  type: "economie" | "attention" | "danger" | "astuce" | "checklist";
  message: string;
  detail: string;
  etape: EtapeNumber;
  severity: "info" | "warning" | "danger";
  source_reglementaire: string | null;
  date_effet: string | null;
}

// === Analyse IA ===

export interface RapportAnalyse {
  score_global: number;
  prix_vs_marche: string;
  alertes: Alerte[];
  recommandations: string[];
  points_forts: string[];
  points_vigilance: string[];
  date_analyse: string;
}

// === Lead ===

export interface LeadCapture {
  email: string;
  telephone: string | null;
  nom: string | null;
  prenom: string | null;
  ville: string | null;
  code_postal: string | null;
  source: LeadSource;
  etape: EtapeNumber;
  consent_partners: boolean;
}

export type LeadSource =
  | "simulation"
  | "analyse_prix"
  | "courtier"
  | "analyse_ia"
  | "travaux"
  | "diagnostiqueur"
  | "assurance"
  | "demenagement"
  | "renovation"
  | "sauvegarde";

// === Calculateur Results ===

export interface SimulationCredit {
  mensualite: number;
  cout_total: number;
  cout_interets: number;
  capacite_emprunt: number;
}

export interface ResultatPTZ {
  eligible: boolean;
  montant: number;
  duree_differee: number;
  duree_remboursement: number;
  raison_ineligibilite: string | null;
}

export interface FraisNotaire {
  total: number;
  droits_mutation: number;
  emoluments: number;
  debours: number;
  contribution_securite: number;
}

export interface ResultatEndettement {
  taux: number;
  mensualite_max: number;
  capacite_emprunt: number;
  conforme_hcsf: boolean;
}
```

- [ ] **Step 2: Verify types compile**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx tsc --noEmit lib/types.ts
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add lib/types.ts
git commit -m "feat(immopilot): add all TypeScript type definitions"
```

---

### Task 3: Constants and baremes

**Files:**
- Create: `27_IMMOPILOT/lib/constants.ts`
- Create: `27_IMMOPILOT/lib/data/ptz-baremes.ts`
- Create: `27_IMMOPILOT/lib/data/notaire-baremes.ts`

- [ ] **Step 1: Create constants**

Create `27_IMMOPILOT/lib/constants.ts`:

```typescript
import type { EtapeNumber } from "./types";

export const BRAND = {
  name: "ImmoPilot",
  colors: {
    bleu_marine: "#1a365d",
    rouge_francais: "#c1272d",
    blanc: "#ffffff",
    bleu_secondaire: "#2563eb",
    gris_clair: "#f8fafc",
    gris_border: "#e2e8f0",
  },
} as const;

export interface StepDefinition {
  numero: EtapeNumber;
  slug: string;
  titre: string;
  description: string;
}

export const ETAPES: StepDefinition[] = [
  { numero: 1, slug: "1-projet", titre: "Definir son projet", description: "Situation, budget, zone, type de bien" },
  { numero: 2, slug: "2-capacite", titre: "Capacite d'emprunt", description: "Simulateur credit, PTZ, endettement" },
  { numero: 3, slug: "3-recherche", titre: "Rechercher un bien", description: "Visites, checklist, DPE, copropriete" },
  { numero: 4, slug: "4-offre", titre: "Faire une offre", description: "Prix marche, lettre d'offre, negociation" },
  { numero: 5, slug: "5-compromis", titre: "Compromis de vente", description: "Clauses, documents, delais legaux" },
  { numero: 6, slug: "6-financement", titre: "Obtenir le financement", description: "Banques, assurance, courtier" },
  { numero: 7, slug: "7-notaire", titre: "Acte authentique", description: "Frais notaire, signature, cles" },
  { numero: 8, slug: "8-post-achat", titre: "Post-achat", description: "Demenagement, assurance, declarations" },
];

export const TAUX_ENDETTEMENT_MAX = 0.35; // Regle HCSF depuis 2022
export const DUREE_MAX_PRET_ANNEES = 25;
export const DELAI_RETRACTATION_JOURS = 10; // SRU
```

- [ ] **Step 2: Create PTZ baremes**

Create `27_IMMOPILOT/lib/data/ptz-baremes.ts`:

```typescript
// Source: economie.gouv.fr — PTZ conditions 2025-2026
// Le PTZ est reserve aux primo-accedants en residence principale
// Zones A/Abis/B1: logement neuf collectif
// Zones B2/C: logement ancien avec travaux >= 25% du cout total

export interface BaremePTZ {
  zone: "A" | "Abis" | "B1" | "B2" | "C";
  plafond_ressources: number[]; // par taille de foyer (1 a 8+)
  quotite_max: number; // % du cout financable par PTZ
  plafond_operation: number[]; // par taille de foyer
}

// Plafonds de ressources (revenu fiscal N-2), par taille de foyer 1 a 8+
export const PTZ_PLAFONDS_RESSOURCES: Record<string, number[]> = {
  Abis: [49000, 73000, 88000, 106000, 120000, 135000, 150000, 165000],
  A:    [49000, 73000, 88000, 106000, 120000, 135000, 150000, 165000],
  B1:   [34500, 48000, 57500, 69000, 79000, 89000, 99000, 109000],
  B2:   [31500, 43500, 52000, 62500, 72000, 81500, 90500, 100000],
  C:    [28500, 39500, 47000, 56500, 65000, 73500, 82000, 90500],
};

// Plafonds d'operation (prix + travaux), par taille de foyer 1 a 8+
export const PTZ_PLAFONDS_OPERATION: Record<string, number[]> = {
  Abis: [150000, 210000, 255000, 300000, 345000, 390000, 435000, 480000],
  A:    [150000, 210000, 255000, 300000, 345000, 390000, 435000, 480000],
  B1:   [135000, 189000, 230000, 270000, 311000, 351000, 392000, 432000],
  B2:   [110000, 154000, 187000, 220000, 253000, 286000, 319000, 352000],
  C:    [100000, 140000, 170000, 200000, 230000, 260000, 290000, 320000],
};

export const PTZ_QUOTITE = 0.40; // 40% du cout de l'operation max

// Durees de remboursement selon tranche de revenus
export interface TranchePTZ {
  plafond_revenus_ratio: number; // ratio revenu/plafond
  duree_totale: number; // annees
  duree_differee: number; // annees sans remboursement
  duree_remboursement: number; // annees de remboursement effectif
}

export const PTZ_TRANCHES: TranchePTZ[] = [
  { plafond_revenus_ratio: 0.45, duree_totale: 25, duree_differee: 15, duree_remboursement: 10 },
  { plafond_revenus_ratio: 0.65, duree_totale: 22, duree_differee: 10, duree_remboursement: 12 },
  { plafond_revenus_ratio: 0.85, duree_totale: 20, duree_differee: 5, duree_remboursement: 15 },
  { plafond_revenus_ratio: 1.0, duree_totale: 18, duree_differee: 2, duree_remboursement: 16 },
];
```

- [ ] **Step 3: Create notaire baremes**

Create `27_IMMOPILOT/lib/data/notaire-baremes.ts`:

```typescript
// Source: service-public.fr — Frais de notaire
// Les emoluments sont reglementes par tranches (arrete du 26 fevrier 2016)

export interface TrancheEmoluments {
  de: number;
  a: number;
  taux: number; // pourcentage
}

export const TRANCHES_EMOLUMENTS: TrancheEmoluments[] = [
  { de: 0, a: 6500, taux: 3.870 },
  { de: 6500, a: 17000, taux: 1.596 },
  { de: 17000, a: 60000, taux: 1.064 },
  { de: 60000, a: Infinity, taux: 0.799 },
];

// Droits de mutation (taxe departementale + communale)
export const TAUX_DROITS_MUTATION_ANCIEN = 0.05806; // 5.806% (taux plein)
export const TAUX_DROITS_MUTATION_NEUF = 0.00715; // 0.715% (TVA deja payee)

// Debours forfaitaires (approximation)
export const DEBOURS_FORFAIT = 1200;

// Contribution de securite immobiliere
export const TAUX_CONTRIBUTION_SECURITE = 0.001; // 0.1% du prix
```

- [ ] **Step 4: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add lib/constants.ts lib/data/ptz-baremes.ts lib/data/notaire-baremes.ts
git commit -m "feat(immopilot): add constants, PTZ and notaire baremes"
```

---

### Task 4: Calculateur credit

**Files:**
- Create: `27_IMMOPILOT/lib/calculateurs/credit.ts`
- Create: `27_IMMOPILOT/tests/lib/calculateurs/credit.test.ts`

- [ ] **Step 1: Write failing tests**

Create `27_IMMOPILOT/tests/lib/calculateurs/credit.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { calculerMensualite, calculerCapaciteEmprunt } from "@/lib/calculateurs/credit";

describe("calculerMensualite", () => {
  it("calculates monthly payment for a standard loan", () => {
    // 200 000 EUR sur 20 ans a 3.5%
    const result = calculerMensualite(200000, 3.5, 20);
    expect(result.mensualite).toBeCloseTo(1159.92, 0);
    expect(result.cout_total).toBeCloseTo(278381, -2);
    expect(result.cout_interets).toBeCloseTo(78381, -2);
  });

  it("returns 0 for zero principal", () => {
    const result = calculerMensualite(0, 3.5, 20);
    expect(result.mensualite).toBe(0);
    expect(result.cout_total).toBe(0);
    expect(result.cout_interets).toBe(0);
  });

  it("handles zero interest rate", () => {
    const result = calculerMensualite(120000, 0, 20);
    expect(result.mensualite).toBe(500);
    expect(result.cout_interets).toBe(0);
  });
});

describe("calculerCapaciteEmprunt", () => {
  it("calculates borrowing capacity respecting 35% rule", () => {
    // Revenus 3500/mois, charges 200, taux 3.5%, duree 20 ans
    const result = calculerCapaciteEmprunt(3500, 200, 3.5, 20);
    // Mensualite max = 3500 * 0.35 - 200 = 1025
    expect(result.mensualite_max).toBeCloseTo(1025, 0);
    expect(result.capacite_emprunt).toBeGreaterThan(150000);
    expect(result.capacite_emprunt).toBeLessThan(200000);
  });

  it("returns 0 when charges exceed 35% of income", () => {
    const result = calculerCapaciteEmprunt(2000, 800, 3.5, 20);
    // Mensualite max = 2000 * 0.35 - 800 = -100 → 0
    expect(result.mensualite_max).toBe(0);
    expect(result.capacite_emprunt).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx vitest run tests/lib/calculateurs/credit.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement credit calculator**

Create `27_IMMOPILOT/lib/calculateurs/credit.ts`:

```typescript
import type { SimulationCredit } from "@/lib/types";
import { TAUX_ENDETTEMENT_MAX } from "@/lib/constants";

/**
 * Calcule la mensualite d'un pret immobilier (formule d'annuite constante).
 * @param montant - Capital emprunte en EUR
 * @param tauxAnnuel - Taux annuel en % (ex: 3.5 pour 3.5%)
 * @param dureeAnnees - Duree en annees
 */
export function calculerMensualite(
  montant: number,
  tauxAnnuel: number,
  dureeAnnees: number
): SimulationCredit {
  if (montant <= 0) {
    return { mensualite: 0, cout_total: 0, cout_interets: 0, capacite_emprunt: 0 };
  }

  const nbMois = dureeAnnees * 12;

  if (tauxAnnuel === 0) {
    const mensualite = montant / nbMois;
    return {
      mensualite: Math.round(mensualite * 100) / 100,
      cout_total: montant,
      cout_interets: 0,
      capacite_emprunt: montant,
    };
  }

  const tauxMensuel = tauxAnnuel / 100 / 12;
  const mensualite =
    (montant * tauxMensuel * Math.pow(1 + tauxMensuel, nbMois)) /
    (Math.pow(1 + tauxMensuel, nbMois) - 1);

  const coutTotal = mensualite * nbMois;
  const coutInterets = coutTotal - montant;

  return {
    mensualite: Math.round(mensualite * 100) / 100,
    cout_total: Math.round(coutTotal * 100) / 100,
    cout_interets: Math.round(coutInterets * 100) / 100,
    capacite_emprunt: montant,
  };
}

/**
 * Calcule la capacite d'emprunt en respectant la regle HCSF des 35%.
 * @param revenusNetMensuels - Revenus nets mensuels du foyer
 * @param chargesFixes - Charges fixes mensuelles (credits en cours, pensions)
 * @param tauxAnnuel - Taux annuel en %
 * @param dureeAnnees - Duree en annees
 */
export function calculerCapaciteEmprunt(
  revenusNetMensuels: number,
  chargesFixes: number,
  tauxAnnuel: number,
  dureeAnnees: number
): SimulationCredit {
  const mensualiteMax = Math.max(
    0,
    revenusNetMensuels * TAUX_ENDETTEMENT_MAX - chargesFixes
  );

  if (mensualiteMax <= 0) {
    return { mensualite: 0, cout_total: 0, cout_interets: 0, capacite_emprunt: 0 };
  }

  const nbMois = dureeAnnees * 12;

  if (tauxAnnuel === 0) {
    const capacite = mensualiteMax * nbMois;
    return {
      mensualite: Math.round(mensualiteMax * 100) / 100,
      cout_total: Math.round(capacite * 100) / 100,
      cout_interets: 0,
      capacite_emprunt: Math.round(capacite * 100) / 100,
    };
  }

  const tauxMensuel = tauxAnnuel / 100 / 12;
  const capacite =
    (mensualiteMax * (Math.pow(1 + tauxMensuel, nbMois) - 1)) /
    (tauxMensuel * Math.pow(1 + tauxMensuel, nbMois));

  const coutTotal = mensualiteMax * nbMois;
  const coutInterets = coutTotal - capacite;

  return {
    mensualite: Math.round(mensualiteMax * 100) / 100,
    cout_total: Math.round(coutTotal * 100) / 100,
    cout_interets: Math.round(coutInterets * 100) / 100,
    capacite_emprunt: Math.round(capacite * 100) / 100,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx vitest run tests/lib/calculateurs/credit.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add lib/calculateurs/credit.ts tests/lib/calculateurs/credit.test.ts
git commit -m "feat(immopilot): add credit calculator with tests"
```

---

### Task 5: Calculateur frais de notaire

**Files:**
- Create: `27_IMMOPILOT/lib/calculateurs/notaire.ts`
- Create: `27_IMMOPILOT/tests/lib/calculateurs/notaire.test.ts`

- [ ] **Step 1: Write failing tests**

Create `27_IMMOPILOT/tests/lib/calculateurs/notaire.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { calculerFraisNotaire } from "@/lib/calculateurs/notaire";

describe("calculerFraisNotaire", () => {
  it("calculates fees for ancien property at 200k", () => {
    const result = calculerFraisNotaire(200000, "ancien");
    // Droits mutation: 200000 * 5.806% = 11612
    // Emoluments: tranches
    // Total should be around 15000-16000 (7-8% of price)
    expect(result.total).toBeGreaterThan(14000);
    expect(result.total).toBeLessThan(17000);
    expect(result.droits_mutation).toBeCloseTo(11612, -1);
  });

  it("calculates fees for neuf property at 200k", () => {
    const result = calculerFraisNotaire(200000, "neuf");
    // Droits mutation: 200000 * 0.715% = 1430
    // Total should be around 4000-6000 (2-3% of price)
    expect(result.total).toBeGreaterThan(3500);
    expect(result.total).toBeLessThan(6500);
    expect(result.droits_mutation).toBeCloseTo(1430, -1);
  });

  it("returns all fee components", () => {
    const result = calculerFraisNotaire(150000, "ancien");
    expect(result.droits_mutation).toBeGreaterThan(0);
    expect(result.emoluments).toBeGreaterThan(0);
    expect(result.debours).toBeGreaterThan(0);
    expect(result.contribution_securite).toBeGreaterThan(0);
    expect(result.total).toBe(
      result.droits_mutation + result.emoluments + result.debours + result.contribution_securite
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx vitest run tests/lib/calculateurs/notaire.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement notaire calculator**

Create `27_IMMOPILOT/lib/calculateurs/notaire.ts`:

```typescript
import type { FraisNotaire } from "@/lib/types";
import {
  TRANCHES_EMOLUMENTS,
  TAUX_DROITS_MUTATION_ANCIEN,
  TAUX_DROITS_MUTATION_NEUF,
  DEBOURS_FORFAIT,
  TAUX_CONTRIBUTION_SECURITE,
} from "@/lib/data/notaire-baremes";

/**
 * Calcule les frais de notaire pour un achat immobilier.
 * @param prix - Prix du bien en EUR
 * @param type - "ancien" ou "neuf"
 */
export function calculerFraisNotaire(
  prix: number,
  type: "ancien" | "neuf"
): FraisNotaire {
  const tauxMutation =
    type === "ancien" ? TAUX_DROITS_MUTATION_ANCIEN : TAUX_DROITS_MUTATION_NEUF;

  const droitsMutation = Math.round(prix * tauxMutation * 100) / 100;

  // Emoluments par tranches
  let emoluments = 0;
  let restant = prix;
  for (const tranche of TRANCHES_EMOLUMENTS) {
    if (restant <= 0) break;
    const assiette = Math.min(restant, tranche.a - tranche.de);
    emoluments += assiette * (tranche.taux / 100);
    restant -= assiette;
  }
  emoluments = Math.round(emoluments * 100) / 100;

  const debours = DEBOURS_FORFAIT;
  const contributionSecurite = Math.round(prix * TAUX_CONTRIBUTION_SECURITE * 100) / 100;

  const total = droitsMutation + emoluments + debours + contributionSecurite;

  return {
    total: Math.round(total * 100) / 100,
    droits_mutation: droitsMutation,
    emoluments,
    debours,
    contribution_securite: contributionSecurite,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx vitest run tests/lib/calculateurs/notaire.test.ts
```

Expected: All 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add lib/calculateurs/notaire.ts tests/lib/calculateurs/notaire.test.ts
git commit -m "feat(immopilot): add notaire fees calculator with tests"
```

---

### Task 6: Calculateur endettement

**Files:**
- Create: `27_IMMOPILOT/lib/calculateurs/endettement.ts`
- Create: `27_IMMOPILOT/tests/lib/calculateurs/endettement.test.ts`

- [ ] **Step 1: Write failing tests**

Create `27_IMMOPILOT/tests/lib/calculateurs/endettement.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { calculerEndettement } from "@/lib/calculateurs/endettement";

describe("calculerEndettement", () => {
  it("calculates debt ratio for standard income", () => {
    // Revenus 4000, charges 500, taux 3.5%, duree 20 ans
    const result = calculerEndettement(4000, 500, 3.5, 20);
    expect(result.taux).toBeCloseTo(0.125, 2); // 500/4000
    expect(result.mensualite_max).toBeCloseTo(900, 0); // 4000*0.35 - 500
    expect(result.conforme_hcsf).toBe(true);
  });

  it("flags non-conformity when charges exceed 35%", () => {
    // Revenus 2000, charges 800 = 40% already
    const result = calculerEndettement(2000, 800, 3.5, 20);
    expect(result.taux).toBeCloseTo(0.4, 2);
    expect(result.conforme_hcsf).toBe(false);
    expect(result.mensualite_max).toBe(0);
  });

  it("works with zero charges", () => {
    const result = calculerEndettement(3000, 0, 3.5, 20);
    expect(result.taux).toBe(0);
    expect(result.mensualite_max).toBeCloseTo(1050, 0); // 3000*0.35
    expect(result.conforme_hcsf).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx vitest run tests/lib/calculateurs/endettement.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement endettement calculator**

Create `27_IMMOPILOT/lib/calculateurs/endettement.ts`:

```typescript
import type { ResultatEndettement } from "@/lib/types";
import { TAUX_ENDETTEMENT_MAX } from "@/lib/constants";
import { calculerCapaciteEmprunt } from "./credit";

/**
 * Calcule le taux d'endettement et la capacite d'emprunt.
 * @param revenusNetMensuels - Revenus nets mensuels du foyer
 * @param chargesFixes - Charges fixes mensuelles actuelles (credits, pensions)
 * @param tauxAnnuel - Taux de pret annuel en %
 * @param dureeAnnees - Duree souhaitee en annees
 */
export function calculerEndettement(
  revenusNetMensuels: number,
  chargesFixes: number,
  tauxAnnuel: number,
  dureeAnnees: number
): ResultatEndettement {
  const taux = revenusNetMensuels > 0 ? chargesFixes / revenusNetMensuels : 1;
  const conformeHcsf = taux < TAUX_ENDETTEMENT_MAX;

  const mensualiteMax = Math.max(
    0,
    Math.round((revenusNetMensuels * TAUX_ENDETTEMENT_MAX - chargesFixes) * 100) / 100
  );

  const simulation = calculerCapaciteEmprunt(
    revenusNetMensuels,
    chargesFixes,
    tauxAnnuel,
    dureeAnnees
  );

  return {
    taux: Math.round(taux * 1000) / 1000,
    mensualite_max: mensualiteMax,
    capacite_emprunt: simulation.capacite_emprunt,
    conforme_hcsf: conformeHcsf,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx vitest run tests/lib/calculateurs/endettement.test.ts
```

Expected: All 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add lib/calculateurs/endettement.ts tests/lib/calculateurs/endettement.test.ts
git commit -m "feat(immopilot): add endettement calculator with tests"
```

---

### Task 7: Calculateur PTZ

**Files:**
- Create: `27_IMMOPILOT/lib/calculateurs/ptz.ts`
- Create: `27_IMMOPILOT/tests/lib/calculateurs/ptz.test.ts`

- [ ] **Step 1: Write failing tests**

Create `27_IMMOPILOT/tests/lib/calculateurs/ptz.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { calculerPTZ } from "@/lib/calculateurs/ptz";

describe("calculerPTZ", () => {
  it("returns eligible for low-income household in zone A", () => {
    const result = calculerPTZ({
      zone: "A",
      revenu_fiscal: 40000,
      taille_foyer: 2,
      cout_operation: 250000,
    });
    expect(result.eligible).toBe(true);
    expect(result.montant).toBeGreaterThan(0);
    expect(result.montant).toBeLessThanOrEqual(250000 * 0.4);
    expect(result.raison_ineligibilite).toBeNull();
  });

  it("returns ineligible when income exceeds threshold", () => {
    const result = calculerPTZ({
      zone: "A",
      revenu_fiscal: 200000,
      taille_foyer: 1,
      cout_operation: 250000,
    });
    expect(result.eligible).toBe(false);
    expect(result.montant).toBe(0);
    expect(result.raison_ineligibilite).toContain("ressources");
  });

  it("caps PTZ at plafond operation", () => {
    const result = calculerPTZ({
      zone: "C",
      revenu_fiscal: 20000,
      taille_foyer: 1,
      cout_operation: 500000, // way above plafond
    });
    expect(result.eligible).toBe(true);
    // PTZ = min(cout, plafond) * quotite
    // Plafond zone C, 1 pers = 100000, quotite = 40%
    expect(result.montant).toBe(40000);
  });

  it("returns ineligible for invalid zone", () => {
    const result = calculerPTZ({
      zone: "X" as any,
      revenu_fiscal: 30000,
      taille_foyer: 1,
      cout_operation: 200000,
    });
    expect(result.eligible).toBe(false);
  });

  it("calculates deferred and repayment periods", () => {
    const result = calculerPTZ({
      zone: "B1",
      revenu_fiscal: 25000,
      taille_foyer: 2,
      cout_operation: 200000,
    });
    expect(result.eligible).toBe(true);
    expect(result.duree_differee).toBeGreaterThan(0);
    expect(result.duree_remboursement).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx vitest run tests/lib/calculateurs/ptz.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement PTZ calculator**

Create `27_IMMOPILOT/lib/calculateurs/ptz.ts`:

```typescript
import type { ResultatPTZ } from "@/lib/types";
import {
  PTZ_PLAFONDS_RESSOURCES,
  PTZ_PLAFONDS_OPERATION,
  PTZ_QUOTITE,
  PTZ_TRANCHES,
} from "@/lib/data/ptz-baremes";

interface PTZInput {
  zone: string;
  revenu_fiscal: number;
  taille_foyer: number;
  cout_operation: number;
}

/**
 * Calcule l'eligibilite et le montant du Pret a Taux Zero.
 */
export function calculerPTZ(input: PTZInput): ResultatPTZ {
  const { zone, revenu_fiscal, taille_foyer, cout_operation } = input;
  const indexFoyer = Math.min(Math.max(taille_foyer, 1), 8) - 1;

  const plafonds = PTZ_PLAFONDS_RESSOURCES[zone];
  const plafondsOp = PTZ_PLAFONDS_OPERATION[zone];

  if (!plafonds || !plafondsOp) {
    return {
      eligible: false,
      montant: 0,
      duree_differee: 0,
      duree_remboursement: 0,
      raison_ineligibilite: "Zone non reconnue",
    };
  }

  const plafondRessources = plafonds[indexFoyer];

  if (revenu_fiscal > plafondRessources) {
    return {
      eligible: false,
      montant: 0,
      duree_differee: 0,
      duree_remboursement: 0,
      raison_ineligibilite: `Revenus (${revenu_fiscal} EUR) superieurs au plafond de ressources (${plafondRessources} EUR) pour la zone ${zone}`,
    };
  }

  const plafondOperation = plafondsOp[indexFoyer];
  const assiette = Math.min(cout_operation, plafondOperation);
  const montant = Math.round(assiette * PTZ_QUOTITE);

  // Tranche de remboursement basee sur le ratio revenu/plafond
  const ratio = revenu_fiscal / plafondRessources;
  const tranche =
    PTZ_TRANCHES.find((t) => ratio <= t.plafond_revenus_ratio) ??
    PTZ_TRANCHES[PTZ_TRANCHES.length - 1];

  return {
    eligible: true,
    montant,
    duree_differee: tranche.duree_differee,
    duree_remboursement: tranche.duree_remboursement,
    raison_ineligibilite: null,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx vitest run tests/lib/calculateurs/ptz.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add lib/calculateurs/ptz.ts tests/lib/calculateurs/ptz.test.ts
git commit -m "feat(immopilot): add PTZ calculator with tests"
```

---

### Task 8: localStorage storage layer

**Files:**
- Create: `27_IMMOPILOT/lib/storage.ts`
- Create: `27_IMMOPILOT/tests/lib/storage.test.ts`

- [ ] **Step 1: Write failing tests**

Create `27_IMMOPILOT/tests/lib/storage.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import {
  loadProjet,
  saveProjet,
  clearProjet,
  createEmptyProjet,
} from "@/lib/storage";

// Mock localStorage
const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  length: 0,
  key: () => null,
};

Object.defineProperty(globalThis, "localStorage", { value: mockLocalStorage });

describe("storage", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it("createEmptyProjet returns a valid project with UUID", () => {
    const projet = createEmptyProjet();
    expect(projet.id).toBeTruthy();
    expect(projet.etape_courante).toBe(1);
    expect(projet.dossiers).toEqual([]);
    expect(projet.lead_captured).toBe(false);
    expect(projet.usage).toBe("residence_principale");
  });

  it("saveProjet and loadProjet round-trip", () => {
    const projet = createEmptyProjet();
    projet.commune = "Lyon";
    projet.apport = 25000;
    saveProjet(projet);

    const loaded = loadProjet();
    expect(loaded).not.toBeNull();
    expect(loaded!.commune).toBe("Lyon");
    expect(loaded!.apport).toBe(25000);
    expect(loaded!.id).toBe(projet.id);
  });

  it("loadProjet returns null when nothing saved", () => {
    const loaded = loadProjet();
    expect(loaded).toBeNull();
  });

  it("clearProjet removes data", () => {
    const projet = createEmptyProjet();
    saveProjet(projet);
    clearProjet();
    expect(loadProjet()).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx vitest run tests/lib/storage.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement storage layer**

Create `27_IMMOPILOT/lib/storage.ts`:

```typescript
import type { ProjetImmobilier } from "./types";

const STORAGE_KEY = "immopilot_projet";

/**
 * Creates a new empty project with default values.
 */
export function createEmptyProjet(): ProjetImmobilier {
  return {
    id: crypto.randomUUID(),
    situation: "celibataire",
    age: 0,
    revenus_net: 0,
    revenus_conjoint: null,
    charges_fixes: 0,
    type_contrat: "cdi",
    taille_foyer: 1,
    apport: 0,
    code_postal: "",
    commune: "",
    type_bien: "appartement",
    usage: "residence_principale",
    budget_max: 0,
    capacite_emprunt: 0,
    taux_endettement: 0,
    eligible_ptz: false,
    montant_ptz: 0,
    duree_souhaitee: 20,
    dossiers: [],
    etape_courante: 1,
    progression: [],
    alertes: [],
    date_creation: new Date().toISOString(),
    lead_captured: false,
  };
}

/**
 * Saves the project to localStorage.
 */
export function saveProjet(projet: ProjetImmobilier): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projet));
}

/**
 * Loads the project from localStorage. Returns null if not found.
 */
export function loadProjet(): ProjetImmobilier | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProjetImmobilier;
  } catch {
    return null;
  }
}

/**
 * Removes the project from localStorage.
 */
export function clearProjet(): void {
  localStorage.removeItem(STORAGE_KEY);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx vitest run tests/lib/storage.test.ts
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add lib/storage.ts tests/lib/storage.test.ts
git commit -m "feat(immopilot): add localStorage storage layer with tests"
```

---

### Task 9: Supabase schema

**Files:**
- Create: `27_IMMOPILOT/supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Create the migration file**

Create `27_IMMOPILOT/supabase/migrations/001_initial_schema.sql`:

```sql
-- ImmoPilot - Initial Schema
-- Run this in Supabase SQL editor or via supabase migration

-- Leads captures (avec RGPD)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  nom TEXT,
  prenom TEXT,
  ville TEXT,
  code_postal TEXT,
  source TEXT NOT NULL,
  etape INTEGER,
  donnees_projet JSONB,
  consent_partners BOOLEAN NOT NULL DEFAULT FALSE,
  consent_date TIMESTAMPTZ,
  consent_revoked_at TIMESTAMPTZ,
  qualification TEXT DEFAULT 'brut',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, source)
);

-- Dossiers biens synces
CREATE TABLE dossiers (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  adresse TEXT,
  commune TEXT,
  code_postal TEXT,
  prix NUMERIC,
  surface NUMERIC,
  dpe_energie TEXT,
  dpe_ges TEXT,
  statut TEXT DEFAULT 'en_recherche',
  donnees JSONB NOT NULL,
  analyse_ia JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents uploades (refs Supabase Storage)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id UUID REFERENCES dossiers(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pros partenaires
CREATE TABLE pros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
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

-- Routage leads -> pros
CREATE TABLE lead_routage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  pro_id UUID REFERENCES pros(id) ON DELETE CASCADE,
  statut TEXT DEFAULT 'envoye',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requetes frequentes
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_qualification ON leads(qualification);
CREATE INDEX idx_dossiers_email ON dossiers(email);
CREATE INDEX idx_dossiers_commune ON dossiers(commune);
CREATE INDEX idx_pros_type ON pros(type);
CREATE INDEX idx_pros_departement ON pros(departement);
CREATE INDEX idx_lead_routage_statut ON lead_routage(statut);
```

- [ ] **Step 2: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add supabase/migrations/001_initial_schema.sql
git commit -m "feat(immopilot): add Supabase initial schema migration"
```

---

### Task 10: Root layout with header and footer

**Files:**
- Create: `27_IMMOPILOT/app/globals.css`
- Create: `27_IMMOPILOT/app/layout.tsx`
- Create: `27_IMMOPILOT/components/ui/header.tsx`
- Create: `27_IMMOPILOT/components/ui/footer.tsx`

- [ ] **Step 1: Create globals.css with brand CSS vars**

Replace `27_IMMOPILOT/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --bleu-marine: #1a365d;
  --rouge-francais: #c1272d;
  --bleu-secondaire: #2563eb;
  --gris-clair: #f8fafc;
  --gris-border: #e2e8f0;
}

body {
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  color: var(--bleu-marine);
  background: white;
}
```

- [ ] **Step 2: Create header component**

Create `27_IMMOPILOT/components/ui/header.tsx`:

```tsx
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[var(--gris-border)] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold text-[var(--bleu-marine)]">
          Immo<span className="text-[var(--rouge-francais)]">Pilot</span>
        </Link>
        <nav className="flex gap-6 text-sm text-[var(--bleu-marine)]">
          <Link href="/parcours" className="hover:text-[var(--bleu-secondaire)]">
            Parcours
          </Link>
          <Link href="/outils" className="hover:text-[var(--bleu-secondaire)]">
            Outils
          </Link>
          <Link href="/guides" className="hover:text-[var(--bleu-secondaire)]">
            Guides
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create footer component**

Create `27_IMMOPILOT/components/ui/footer.tsx`:

```tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--gris-border)] bg-[var(--gris-clair)] py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-4 text-sm text-gray-500 md:flex-row md:justify-between">
          <div className="font-bold text-[var(--bleu-marine)]">
            Immo<span className="text-[var(--rouge-francais)]">Pilot</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-[var(--bleu-secondaire)]">
              Mentions legales
            </Link>
            <Link href="/mes-donnees" className="hover:text-[var(--bleu-secondaire)]">
              Mes donnees
            </Link>
          </nav>
          <div>&copy; {new Date().getFullYear()} ImmoPilot. Tous droits reserves.</div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create root layout**

Replace `27_IMMOPILOT/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImmoPilot — Votre copilote pour acheter en toute confiance",
  description:
    "Accompagnement gratuit etape par etape pour votre premier achat immobilier en France. Simulateurs, conseils d'experts, mise en relation avec des professionnels.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Create homepage placeholder**

Replace `27_IMMOPILOT/app/page.tsx` with:

```tsx
export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="mb-4 text-4xl font-extrabold text-[var(--bleu-marine)]">
        Votre premier achat immobilier,{" "}
        <span className="text-[var(--rouge-francais)]">etape par etape</span>
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        ImmoPilot vous guide de A a Z. Simulateurs, conseils d&apos;experts, alertes
        reglementaires et mise en relation avec des professionnels. Gratuit.
      </p>
      <a
        href="/parcours"
        className="inline-block rounded-lg bg-[var(--rouge-francais)] px-8 py-3 text-lg font-semibold text-white hover:opacity-90"
      >
        Commencer mon projet
      </a>
    </div>
  );
}
```

- [ ] **Step 6: Verify build**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npm run build
```

Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add app/globals.css app/layout.tsx app/page.tsx components/ui/header.tsx components/ui/footer.tsx
git commit -m "feat(immopilot): add root layout with header, footer, and homepage placeholder"
```

---

### Task 11: Parcours layout with progress bar

**Files:**
- Create: `27_IMMOPILOT/components/ui/progress-bar.tsx`
- Create: `27_IMMOPILOT/components/parcours/step-nav.tsx`
- Create: `27_IMMOPILOT/app/parcours/layout.tsx`
- Create: `27_IMMOPILOT/app/parcours/page.tsx`

- [ ] **Step 1: Create progress bar component**

Create `27_IMMOPILOT/components/ui/progress-bar.tsx`:

```tsx
import { ETAPES } from "@/lib/constants";
import type { EtapeNumber } from "@/lib/types";

interface ProgressBarProps {
  etapeCourante: EtapeNumber;
  completedSteps: EtapeNumber[];
}

export function ProgressBar({ etapeCourante, completedSteps }: ProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex gap-1">
        {ETAPES.map((etape) => {
          const isCompleted = completedSteps.includes(etape.numero);
          const isCurrent = etape.numero === etapeCourante;
          return (
            <div
              key={etape.numero}
              className={`h-1.5 flex-1 rounded-full ${
                isCompleted
                  ? "bg-green-500"
                  : isCurrent
                    ? "bg-[var(--bleu-secondaire)]"
                    : "bg-gray-200"
              }`}
              title={etape.titre}
            />
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        Etape {etapeCourante} sur 8 &mdash;{" "}
        {ETAPES.find((e) => e.numero === etapeCourante)?.titre}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create step navigation component**

Create `27_IMMOPILOT/components/parcours/step-nav.tsx`:

```tsx
import Link from "next/link";
import { ETAPES } from "@/lib/constants";
import type { EtapeNumber } from "@/lib/types";

interface StepNavProps {
  etapeCourante: EtapeNumber;
}

export function StepNav({ etapeCourante }: StepNavProps) {
  const prev = ETAPES.find((e) => e.numero === ((etapeCourante - 1) as EtapeNumber));
  const next = ETAPES.find((e) => e.numero === ((etapeCourante + 1) as EtapeNumber));

  return (
    <div className="mt-8 flex justify-between">
      {prev ? (
        <Link
          href={`/parcours/${prev.slug}`}
          className="text-sm text-gray-500 hover:text-[var(--bleu-secondaire)]"
        >
          &larr; {prev.titre}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/parcours/${next.slug}`}
          className="rounded-lg bg-[var(--bleu-secondaire)] px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {next.titre} &rarr;
        </Link>
      ) : (
        <span className="rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white">
          Parcours termine
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create parcours layout**

Create `27_IMMOPILOT/app/parcours/layout.tsx`:

```tsx
export default function ParcoursLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create dashboard placeholder**

Create `27_IMMOPILOT/app/parcours/page.tsx`:

```tsx
import Link from "next/link";
import { ETAPES } from "@/lib/constants";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-[var(--bleu-marine)]">Mon projet immobilier</h1>
      <p className="mb-8 text-gray-500">Suivez votre avancement etape par etape</p>

      <div className="space-y-3">
        {ETAPES.map((etape) => (
          <Link
            key={etape.numero}
            href={`/parcours/${etape.slug}`}
            className="flex items-center gap-4 rounded-lg border border-[var(--gris-border)] bg-white p-4 hover:border-[var(--bleu-secondaire)]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-[var(--bleu-marine)]">
              {etape.numero}
            </div>
            <div>
              <div className="font-semibold text-[var(--bleu-marine)]">{etape.titre}</div>
              <div className="text-sm text-gray-500">{etape.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npm run build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add components/ui/progress-bar.tsx components/parcours/step-nav.tsx app/parcours/layout.tsx app/parcours/page.tsx
git commit -m "feat(immopilot): add parcours layout with progress bar, step nav, and dashboard"
```

---

### Task 12: Run all tests and final verification

- [ ] **Step 1: Run all tests**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npx vitest run
```

Expected: All 20 tests pass (5 credit + 3 notaire + 3 endettement + 5 PTZ + 4 storage).

- [ ] **Step 2: Run build**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Final commit if any cleanup needed**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git status
```

If clean: Phase 1 complete. If changes exist, commit them.

---

## Self-Review Checklist

| Spec Requirement | Task |
|---|---|
| Next.js + Tailwind + Supabase + Vercel | Task 1 |
| All TypeScript interfaces | Task 2 |
| Brand colors + identity | Task 3, 10 |
| Calculateur credit | Task 4 |
| Calculateur frais notaire | Task 5 |
| Calculateur endettement | Task 6 |
| Calculateur PTZ | Task 7 |
| localStorage storage | Task 8 |
| Supabase schema (leads, dossiers, docs, pros, routage) | Task 9 |
| Root layout (header, footer) | Task 10 |
| Parcours layout + progress bar + dashboard | Task 11 |
| Homepage placeholder | Task 10 |
| RGPD fields in DB (consent_partners, consent_date) | Task 9 |

**Not in Phase 1 (deferred to later phases):** Individual etapes content, dossier CRUD, AI analysis, lead capture forms, SEO guides, DVF integration, Supabase sync logic, mentions legales.
