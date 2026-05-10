# ImmoPilot UX Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform ImmoPilot from a functional MVP into a modern SaaS app with design system, intelligent dashboard, tabbed step layout, and project sidebar.

**Architecture:** Refactor existing Next.js 16 app. Add lib/selectors.ts + lib/alertes.ts + lib/utils/format.ts for derived state. Create 11 new UI components. Replace /parcours page with dashboard. Replace step-layout with tabbed version + sidebar. Redesign dossier pages.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest

**Spec:** `docs/superpowers/specs/2026-05-08-immopilot-ux-redesign.md`

---

## File Map

```
27_IMMOPILOT/
├── lib/
│   ├── types.ts                          # MODIFY: add prenom, checklists Record
│   ├── storage.ts                        # MODIFY: migration localStorage
│   ├── selectors.ts                      # CREATE: getProjectSummary, getCompletedSteps, getCurrentStepInfo
│   ├── alertes.ts                        # CREATE: buildProjectAlerts
│   └── utils/
│       └── format.ts                     # CREATE: fmt(), fmtPct()
│
├── app/
│   ├── layout.tsx                        # MODIFY: load Inter via next/font
│   ├── globals.css                       # MODIFY: add design tokens, animations, reduced-motion
│   ├── parcours/
│   │   └── page.tsx                      # REWRITE: intelligent dashboard
│   └── dossiers/
│       ├── page.tsx                      # MODIFY: use DossierMiniCard + EmptyState
│       └── [id]/page.tsx                 # MODIFY: tabs, max-w-4xl, DpeBadge
│
├── components/
│   ├── ui/
│   │   ├── stepper.tsx                   # CREATE: StepperHorizontal
│   │   ├── kpi-card.tsx                  # CREATE: KpiCard
│   │   ├── slider-input.tsx              # CREATE: SliderInput with debounce
│   │   ├── tabs.tsx                      # CREATE: TabsContainer (keepMounted/lazy)
│   │   ├── alert-card.tsx                # CREATE: AlertCard
│   │   ├── badge.tsx                     # CREATE: BadgePill
│   │   ├── dpe-badge.tsx                 # CREATE: DpeBadge (replaces 3 copies)
│   │   ├── toast.tsx                     # CREATE: Toast auto-dismiss
│   │   ├── empty-state.tsx              # CREATE: EmptyState
│   │   ├── form-field.tsx               # CREATE: FormField (label+input+suffix)
│   │   └── verdict-banner.tsx           # CREATE: VerdictBanner
│   ├── parcours/
│   │   ├── step-layout.tsx              # REWRITE: tabs, sidebar, stepper v2
│   │   └── project-sidebar.tsx          # CREATE: sticky sidebar / mobile bandeau
│   └── dossiers/
│       └── mini-card.tsx                # CREATE: DossierMiniCard
│
└── tests/
    └── lib/
        ├── selectors.test.ts            # CREATE
        ├── alertes.test.ts              # CREATE
        └── utils/
            └── format.test.ts           # CREATE
```

---

### Task 1: Format utilities

**Files:**
- Create: `lib/utils/format.ts`
- Create: `tests/lib/utils/format.test.ts`

- [ ] **Step 1: Write failing tests**

Create `27_IMMOPILOT/tests/lib/utils/format.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { fmt, fmtPct } from "@/lib/utils/format";

describe("fmt", () => {
  it("formats number with French locale", () => {
    expect(fmt(250000)).toMatch(/250/);
    expect(fmt(0)).toBe("0");
  });

  it("rounds to integer", () => {
    expect(fmt(1234.56)).toMatch(/235/);
  });
});

describe("fmtPct", () => {
  it("formats ratio as percentage", () => {
    expect(fmtPct(0.125)).toBe("12.5");
    expect(fmtPct(0.35)).toBe("35.0");
  });

  it("handles zero", () => {
    expect(fmtPct(0)).toBe("0.0");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx vitest run tests/lib/utils/format.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement format utilities**

Create `27_IMMOPILOT/lib/utils/format.ts`:

```typescript
/**
 * Format a number as French locale string (rounded to integer).
 * Replaces the 6+ copies of fmt() scattered across pages.
 */
export function fmt(n: number): string {
  return Math.round(n).toLocaleString("fr-FR");
}

/**
 * Format a ratio (0-1) as a percentage string with 1 decimal.
 * Example: 0.125 -> "12.5"
 */
export function fmtPct(ratio: number): string {
  return (ratio * 100).toFixed(1);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx vitest run tests/lib/utils/format.test.ts
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add lib/utils/format.ts tests/lib/utils/format.test.ts
git commit -m "feat(immopilot): add fmt/fmtPct format utilities"
```

---

### Task 2: Update types — add prenom and checklists

**Files:**
- Modify: `lib/types.ts`
- Modify: `lib/storage.ts`

- [ ] **Step 1: Add prenom and checklists to ProjetImmobilier**

In `lib/types.ts`, add these fields to the `ProjetImmobilier` interface (after `lead_captured`):

```typescript
  prenom: string;
  checklists: Record<number, boolean[]>;
```

- [ ] **Step 2: Update createEmptyProjet in storage.ts**

In `lib/storage.ts`, add the new fields to createEmptyProjet's return:

```typescript
    prenom: "",
    checklists: {},
```

- [ ] **Step 3: Run existing tests**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx vitest run
```

Expected: All 20 existing tests still pass.

- [ ] **Step 4: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add lib/types.ts lib/storage.ts
git commit -m "feat(immopilot): add prenom and checklists to ProjetImmobilier"
```

---

### Task 3: Selectors — derived state

**Files:**
- Create: `lib/selectors.ts`
- Create: `tests/lib/selectors.test.ts`

- [ ] **Step 1: Write failing tests**

Create `27_IMMOPILOT/tests/lib/selectors.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { getProjectSummary, getCompletedSteps, getCurrentStepInfo } from "@/lib/selectors";
import { createEmptyProjet } from "@/lib/storage";
import type { ProjetImmobilier, EtapeNumber } from "@/lib/types";

function makeProjet(overrides: Partial<ProjetImmobilier> = {}): ProjetImmobilier {
  return { ...createEmptyProjet(), ...overrides };
}

describe("getProjectSummary", () => {
  it("returns zeros for empty project", () => {
    const s = getProjectSummary(makeProjet());
    expect(s.budget).toBe(0);
    expect(s.capacite).toBe(0);
    expect(s.ptz).toBe(0);
    expect(s.nb_dossiers).toBe(0);
    expect(s.endettement).toBe(0);
    expect(s.verdict).toBe("incomplet");
  });

  it("returns financable when capacite covers budget", () => {
    const s = getProjectSummary(makeProjet({
      budget_max: 200000,
      capacite_emprunt: 180000,
      apport: 30000,
      montant_ptz: 0,
    }));
    expect(s.verdict).toBe("financable");
  });

  it("returns depassement when budget exceeds financing", () => {
    const s = getProjectSummary(makeProjet({
      budget_max: 300000,
      capacite_emprunt: 150000,
      apport: 10000,
      montant_ptz: 0,
    }));
    expect(s.verdict).toBe("depassement");
  });
});

describe("getCompletedSteps", () => {
  it("returns empty for fresh project", () => {
    expect(getCompletedSteps(makeProjet())).toEqual([]);
  });

  it("marks step 1 complete when revenus + commune + budget set", () => {
    const steps = getCompletedSteps(makeProjet({
      revenus_net: 3500,
      commune: "Lyon",
      budget_max: 250000,
    }));
    expect(steps).toContain(1);
  });

  it("marks step 2 complete when capacite calculated", () => {
    const steps = getCompletedSteps(makeProjet({
      revenus_net: 3500,
      commune: "Lyon",
      budget_max: 250000,
      capacite_emprunt: 180000,
      eligible_ptz: true,
    }));
    expect(steps).toContain(2);
  });
});

describe("getCurrentStepInfo", () => {
  it("returns step 1 for fresh project", () => {
    const info = getCurrentStepInfo(makeProjet());
    expect(info.numero).toBe(1);
    expect(info.slug).toBe("1-projet");
  });

  it("returns first incomplete step", () => {
    const info = getCurrentStepInfo(makeProjet({
      revenus_net: 3500,
      commune: "Lyon",
      budget_max: 250000,
    }));
    expect(info.numero).toBe(2);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx vitest run tests/lib/selectors.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement selectors**

Create `27_IMMOPILOT/lib/selectors.ts`:

```typescript
import type { ProjetImmobilier, EtapeNumber } from "./types";
import { ETAPES } from "./constants";

export interface ProjectSummary {
  budget: number;
  capacite: number;
  ptz: number;
  nb_dossiers: number;
  endettement: number;
  verdict: "financable" | "depassement" | "incomplet";
}

export interface StepInfo {
  numero: EtapeNumber;
  titre: string;
  description: string;
  slug: string;
}

export function getProjectSummary(projet: ProjetImmobilier): ProjectSummary {
  const budget = projet.budget_max;
  const capacite = projet.capacite_emprunt;
  const ptz = projet.montant_ptz;
  const nb_dossiers = projet.dossiers.length;
  const endettement = projet.taux_endettement;

  let verdict: ProjectSummary["verdict"] = "incomplet";
  if (budget > 0 && capacite > 0) {
    const financement = capacite + projet.apport + ptz;
    verdict = financement >= budget ? "financable" : "depassement";
  }

  return { budget, capacite, ptz, nb_dossiers, endettement, verdict };
}

export function getCompletedSteps(projet: ProjetImmobilier): EtapeNumber[] {
  const completed: EtapeNumber[] = [];

  // Step 1: revenus + commune + budget
  if (projet.revenus_net > 0 && projet.commune !== "" && projet.budget_max > 0) {
    completed.push(1);
  }

  // Step 2: capacite calculated + PTZ checked
  if (projet.capacite_emprunt > 0 && typeof projet.eligible_ptz === "boolean") {
    completed.push(2);
  }

  // Step 3: at least 1 dossier
  if (projet.dossiers.length > 0) {
    completed.push(3);
  }

  // Step 4: at least 1 dossier with an offre
  if (projet.dossiers.some((d) => d.offre !== null)) {
    completed.push(4);
  }

  // Step 5: at least 1 dossier with compromis signe
  if (projet.dossiers.some((d) => d.compromis?.signe)) {
    completed.push(5);
  }

  // Step 6: at least 1 dossier with taux_obtenu
  if (projet.dossiers.some((d) => d.financement?.taux_obtenu != null)) {
    completed.push(6);
  }

  // Step 7: at least 1 dossier with date_acte
  if (projet.dossiers.some((d) => d.notaire?.date_acte != null)) {
    completed.push(7);
  }

  // Step 8: checklist post-achat >= 50%
  const checklist8 = projet.checklists[8];
  if (checklist8 && checklist8.length > 0) {
    const pct = checklist8.filter(Boolean).length / checklist8.length;
    if (pct >= 0.5) completed.push(8);
  }

  return completed;
}

export function getCurrentStepInfo(projet: ProjetImmobilier): StepInfo {
  const completed = getCompletedSteps(projet);
  const firstIncomplete = ([1, 2, 3, 4, 5, 6, 7, 8] as EtapeNumber[]).find(
    (n) => !completed.includes(n)
  ) ?? 1;

  const def = ETAPES.find((e) => e.numero === firstIncomplete) ?? ETAPES[0];
  return {
    numero: def.numero,
    titre: def.titre,
    description: def.description,
    slug: def.slug,
  };
}
```

- [ ] **Step 4: Run tests**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx vitest run tests/lib/selectors.test.ts
```

Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add lib/selectors.ts tests/lib/selectors.test.ts
git commit -m "feat(immopilot): add project selectors (summary, steps, current)"
```

---

### Task 4: Alertes — derived alerts from dossiers

**Files:**
- Create: `lib/alertes.ts`
- Create: `tests/lib/alertes.test.ts`

- [ ] **Step 1: Write failing tests**

Create `27_IMMOPILOT/tests/lib/alertes.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { buildProjectAlerts } from "@/lib/alertes";
import { createEmptyProjet } from "@/lib/storage";
import { createEmptyDossier } from "@/lib/dossiers";
import type { ProjetImmobilier, DpeClasse } from "@/lib/types";

function makeProjet(overrides: Partial<ProjetImmobilier> = {}): ProjetImmobilier {
  return { ...createEmptyProjet(), ...overrides };
}

describe("buildProjectAlerts", () => {
  it("returns empty for project with no dossiers", () => {
    expect(buildProjectAlerts(makeProjet())).toEqual([]);
  });

  it("flags DPE G as danger", () => {
    const dossier = { ...createEmptyDossier(), dpe_energie: "G" as DpeClasse, adresse: "Rue Test" };
    const alerts = buildProjectAlerts(makeProjet({ dossiers: [dossier] }));
    expect(alerts.some((a) => a.severity === "danger" && a.message.includes("G"))).toBe(true);
  });

  it("flags DPE F as danger", () => {
    const dossier = { ...createEmptyDossier(), dpe_energie: "F" as DpeClasse, adresse: "Rue Test" };
    const alerts = buildProjectAlerts(makeProjet({ dossiers: [dossier] }));
    expect(alerts.some((a) => a.severity === "danger")).toBe(true);
  });

  it("flags high endettement", () => {
    const alerts = buildProjectAlerts(makeProjet({ taux_endettement: 0.40 }));
    expect(alerts.some((a) => a.message.includes("endettement"))).toBe(true);
  });

  it("flags old building < 1949", () => {
    const dossier = { ...createEmptyDossier(), annee_construction: 1920, adresse: "Vieux" };
    const alerts = buildProjectAlerts(makeProjet({ dossiers: [dossier] }));
    expect(alerts.some((a) => a.message.includes("1949"))).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx vitest run tests/lib/alertes.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement alertes**

Create `27_IMMOPILOT/lib/alertes.ts`:

```typescript
import type { ProjetImmobilier, Alerte, EtapeNumber } from "./types";

export function buildProjectAlerts(projet: ProjetImmobilier): Alerte[] {
  const alertes: Alerte[] = [];

  // High endettement
  if (projet.taux_endettement > 0.30) {
    alertes.push({
      type: "danger",
      message: `Taux d'endettement eleve : ${(projet.taux_endettement * 100).toFixed(1)}%`,
      detail: "Le plafond HCSF est de 35%. Au-dela, les banques refuseront le pret.",
      etape: 2 as EtapeNumber,
      severity: projet.taux_endettement > 0.35 ? "danger" : "warning",
      source_reglementaire: "HCSF",
      date_effet: null,
    });
  }

  // Dossier-level alerts
  for (const dossier of projet.dossiers) {
    const label = dossier.adresse || dossier.commune || "Dossier";

    if (dossier.dpe_energie === "G") {
      alertes.push({
        type: "danger",
        message: `DPE G detecte sur ${label}`,
        detail: "Passoire thermique — location interdite depuis 2025 (classe G).",
        etape: 3 as EtapeNumber,
        severity: "danger",
        source_reglementaire: "Loi Climat et Resilience",
        date_effet: "2025-01-01",
      });
    } else if (dossier.dpe_energie === "F") {
      alertes.push({
        type: "danger",
        message: `DPE F detecte sur ${label}`,
        detail: "Interdiction de location a partir de 2028 (classe F).",
        etape: 3 as EtapeNumber,
        severity: "danger",
        source_reglementaire: "Loi Climat et Resilience",
        date_effet: "2028-01-01",
      });
    } else if (dossier.dpe_energie === "E") {
      alertes.push({
        type: "attention",
        message: `DPE E sur ${label} — gel des loyers`,
        detail: "Interdiction de location prevue en 2034.",
        etape: 3 as EtapeNumber,
        severity: "warning",
        source_reglementaire: "Loi Climat et Resilience",
        date_effet: "2034-01-01",
      });
    }

    if (dossier.type_copro && dossier.surface > 0 && dossier.charges_copro > 0) {
      const ratio = dossier.charges_copro / dossier.surface;
      if (ratio > 50) {
        alertes.push({
          type: "attention",
          message: `Charges copro elevees sur ${label}`,
          detail: `${Math.round(dossier.charges_copro)} EUR/mois pour ${dossier.surface} m2.`,
          etape: 3 as EtapeNumber,
          severity: "warning",
          source_reglementaire: null,
          date_effet: null,
        });
      }
    }

    if (dossier.annee_construction > 0 && dossier.annee_construction < 1949) {
      alertes.push({
        type: "attention",
        message: `Bien ancien (avant 1949) — ${label}`,
        detail: "Verifiez les diagnostics plomb et amiante obligatoires.",
        etape: 3 as EtapeNumber,
        severity: "warning",
        source_reglementaire: null,
        date_effet: null,
      });
    }
  }

  return alertes;
}
```

- [ ] **Step 4: Run tests**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx vitest run tests/lib/alertes.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add lib/alertes.ts tests/lib/alertes.test.ts
git commit -m "feat(immopilot): add buildProjectAlerts for derived alerts"
```

---

### Task 5: Design system — CSS tokens, Inter font, globals

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update globals.css with full design tokens**

Replace `27_IMMOPILOT/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --bleu-marine: #1a365d;
  --bleu-action: #2563eb;
  --rouge-fr: #c1272d;
  --vert-succes: #22c55e;
  --orange-warn: #f59e0b;
  --gris-fond: #f8fafc;
  --gris-border: #e2e8f0;

  /* Legacy aliases for existing code */
  --rouge-francais: var(--rouge-fr);
  --bleu-secondaire: var(--bleu-action);
  --gris-clair: var(--gris-fond);
}

body {
  color: var(--bleu-marine);
  background: white;
}

/* Card levels */
.card-flat {
  border: 1px solid var(--gris-border);
  border-radius: 0.75rem;
  padding: 1rem;
}

.card-elevated {
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.25rem;
}

.card-hero {
  background: linear-gradient(to bottom right, var(--bleu-marine), var(--bleu-action));
  color: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
}

/* Animations — respect reduced motion */
@media (prefers-reduced-motion: no-preference) {
  .hover-lift {
    transition: transform 200ms;
  }
  .hover-lift:hover {
    transform: scale(1.02);
  }
  .fade-in {
    animation: fadeIn 300ms ease-in;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .toast-slide {
    animation: slideDown 300ms ease-out;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-100%); }
    to { opacity: 1; transform: translateY(0); }
  }
}

/* Standard input class */
.input-standard {
  border-radius: 0.75rem;
  border: 1px solid var(--gris-border);
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
}
.input-standard:focus {
  border-color: var(--bleu-action);
  outline: none;
}
```

- [ ] **Step 2: Update layout.tsx to load Inter font**

Replace `27_IMMOPILOT/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://immopilot.fr"),
  title: "ImmoPilot — Votre copilote pour acheter en toute confiance",
  description: "Accompagnement gratuit etape par etape pour votre premier achat immobilier en France. Simulateurs, conseils d'experts, mise en relation avec des professionnels.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.className}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Build check**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add app/globals.css app/layout.tsx
git commit -m "feat(immopilot): add design system tokens, Inter font, card classes"
```

---

### Task 6: UI components batch 1 — DpeBadge, BadgePill, AlertCard, EmptyState, VerdictBanner

**Files:**
- Create: `components/ui/dpe-badge.tsx`
- Create: `components/ui/badge.tsx`
- Create: `components/ui/alert-card.tsx`
- Create: `components/ui/empty-state.tsx`
- Create: `components/ui/verdict-banner.tsx`

- [ ] **Step 1: Create DpeBadge**

Create `27_IMMOPILOT/components/ui/dpe-badge.tsx`:

```tsx
import type { DpeClasse } from "@/lib/types";

const DPE_COLORS: Record<DpeClasse, string> = {
  A: "#009900", B: "#52a800", C: "#99cc00", D: "#ffcc00",
  E: "#ff9900", F: "#ff6600", G: "#cc0000",
};

interface DpeBadgeProps {
  classe: DpeClasse;
  size?: "sm" | "md";
}

export function DpeBadge({ classe, size = "sm" }: DpeBadgeProps) {
  const sizeClasses = size === "sm" ? "h-6 w-6 text-xs" : "h-9 w-9 text-base";
  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded font-bold text-white ${sizeClasses}`}
      style={{ backgroundColor: DPE_COLORS[classe] }}
      title={`DPE ${classe}`}
    >
      {classe}
    </div>
  );
}
```

- [ ] **Step 2: Create BadgePill**

Create `27_IMMOPILOT/components/ui/badge.tsx`:

```tsx
type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-800",
  danger: "bg-red-100 text-red-800",
  warning: "bg-orange-100 text-orange-800",
  info: "bg-blue-100 text-blue-800",
  neutral: "bg-gray-100 text-gray-700",
};

interface BadgePillProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

export function BadgePill({ variant, children }: BadgePillProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${VARIANT_CLASSES[variant]}`}>
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create AlertCard**

Create `27_IMMOPILOT/components/ui/alert-card.tsx`:

```tsx
type AlertSeverity = "success" | "warning" | "danger" | "info";

const SEVERITY_STYLES: Record<AlertSeverity, { border: string; bg: string; icon: string }> = {
  success: { border: "border-l-green-500", bg: "bg-green-50", icon: "💰" },
  warning: { border: "border-l-orange-500", bg: "bg-orange-50", icon: "⚠️" },
  danger: { border: "border-l-red-500", bg: "bg-red-50", icon: "🚨" },
  info: { border: "border-l-blue-500", bg: "bg-blue-50", icon: "💡" },
};

interface AlertCardProps {
  severity: AlertSeverity;
  title: string;
  detail?: string;
}

export function AlertCard({ severity, title, detail }: AlertCardProps) {
  const s = SEVERITY_STYLES[severity];
  return (
    <div className={`border-l-3 rounded-r-xl p-3 ${s.border} ${s.bg}`}>
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0">{s.icon}</span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          {detail && <p className="mt-0.5 text-sm text-gray-700">{detail}</p>}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create EmptyState**

Create `27_IMMOPILOT/components/ui/empty-state.tsx`:

```tsx
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-xl border-2 border-dashed border-[var(--gris-border)] bg-[var(--gris-fond)] p-12 text-center">
      <div className="mb-4 text-5xl">{icon}</div>
      <p className="mb-2 text-base font-semibold text-gray-700">{title}</p>
      <p className="mb-6 text-sm text-gray-500">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-[var(--bleu-action)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create VerdictBanner**

Create `27_IMMOPILOT/components/ui/verdict-banner.tsx`:

```tsx
interface VerdictBannerProps {
  positive: boolean;
  label: string;
  detail?: string;
}

export function VerdictBanner({ positive, label, detail }: VerdictBannerProps) {
  return (
    <div
      className={`rounded-xl border p-3 text-sm font-semibold ${
        positive
          ? "border-green-300 bg-green-50 text-green-800"
          : "border-red-300 bg-red-50 text-red-800"
      }`}
    >
      {label}
      {detail && <span className="ml-1 font-normal">{detail}</span>}
    </div>
  );
}
```

- [ ] **Step 6: Build check**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add components/ui/dpe-badge.tsx components/ui/badge.tsx components/ui/alert-card.tsx components/ui/empty-state.tsx components/ui/verdict-banner.tsx
git commit -m "feat(immopilot): add DpeBadge, BadgePill, AlertCard, EmptyState, VerdictBanner"
```

---

### Task 7: UI components batch 2 — KpiCard, Toast, FormField

**Files:**
- Create: `components/ui/kpi-card.tsx`
- Create: `components/ui/toast.tsx`
- Create: `components/ui/form-field.tsx`

- [ ] **Step 1: Create KpiCard**

Create `27_IMMOPILOT/components/ui/kpi-card.tsx`:

```tsx
import Link from "next/link";

interface KpiCardProps {
  label: string;
  value: string;
  color?: string;
  href?: string;
}

export function KpiCard({ label, value, color, href }: KpiCardProps) {
  const content = (
    <div className="card-elevated hover-lift cursor-pointer bg-white">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
```

- [ ] **Step 2: Create Toast**

Create `27_IMMOPILOT/components/ui/toast.tsx`:

```tsx
'use client';

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onDismiss: () => void;
}

export function Toast({ message, visible, duration = 2000, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 toast-slide">
      <div className="rounded-xl bg-[var(--bleu-marine)] px-4 py-2 text-sm font-medium text-white shadow-lg">
        {message}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create FormField**

Create `27_IMMOPILOT/components/ui/form-field.tsx`:

```tsx
interface FormFieldProps {
  label: string;
  htmlFor?: string;
  suffix?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, suffix, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={htmlFor}>
        {label}
      </label>
      <div className="relative">
        {children}
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 4: Build check**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add components/ui/kpi-card.tsx components/ui/toast.tsx components/ui/form-field.tsx
git commit -m "feat(immopilot): add KpiCard, Toast, FormField components"
```

---

### Task 8: UI components batch 3 — StepperHorizontal, TabsContainer, SliderInput

**Files:**
- Create: `components/ui/stepper.tsx`
- Create: `components/ui/tabs.tsx`
- Create: `components/ui/slider-input.tsx`

- [ ] **Step 1: Create StepperHorizontal**

Create `27_IMMOPILOT/components/ui/stepper.tsx`:

```tsx
import type { EtapeNumber } from "@/lib/types";
import { ETAPES } from "@/lib/constants";

interface StepperProps {
  completedSteps: EtapeNumber[];
  currentStep: EtapeNumber;
  onStepClick?: (step: EtapeNumber) => void;
}

export function StepperHorizontal({ completedSteps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {ETAPES.map((etape, i) => {
          const isCompleted = completedSteps.includes(etape.numero);
          const isCurrent = etape.numero === currentStep;

          return (
            <div key={etape.numero} className="flex flex-1 items-center">
              {/* Circle */}
              <button
                onClick={() => onStepClick?.(etape.numero)}
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-[var(--vert-succes)] text-white"
                    : isCurrent
                      ? "bg-[var(--bleu-action)] text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
                aria-label={`Etape ${etape.numero}: ${etape.titre}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4 4 6-6" />
                  </svg>
                ) : (
                  etape.numero
                )}
              </button>

              {/* Line */}
              {i < ETAPES.length - 1 && (
                <div
                  className={`mx-1 h-0.5 flex-1 ${
                    completedSteps.includes(etape.numero) ? "bg-[var(--vert-succes)]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Labels — hidden on mobile */}
      <div className="mt-2 hidden items-center justify-between lg:flex">
        {ETAPES.map((etape) => (
          <span key={etape.numero} className="flex-1 text-center text-[10px] text-gray-500">
            {etape.titre}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create TabsContainer**

Create `27_IMMOPILOT/components/ui/tabs.tsx`:

```tsx
'use client';

import { useState, useRef } from "react";

interface Tab {
  id: string;
  label: string;
  badge?: number;
  keepMounted?: boolean;
}

interface TabsContainerProps {
  tabs: Tab[];
  defaultTab?: string;
  children: (activeTab: string) => React.ReactNode;
}

export function TabsContainer({ tabs, defaultTab, children }: TabsContainerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? "");
  const mountedTabs = useRef(new Set<string>([activeTab]));

  const handleTabClick = (tabId: string) => {
    mountedTabs.current.add(tabId);
    setActiveTab(tabId);
  };

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-[var(--gris-border)]" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-[var(--bleu-action)] text-[var(--bleu-action)]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span className="rounded-full bg-[var(--bleu-action)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tabs.map((tab) => {
        const shouldRender = tab.keepMounted
          ? mountedTabs.current.has(tab.id)
          : activeTab === tab.id;

        if (!shouldRender) return null;

        return (
          <div
            key={tab.id}
            role="tabpanel"
            hidden={activeTab !== tab.id}
            className={activeTab === tab.id ? "fade-in" : ""}
          >
            {children(tab.id)}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create SliderInput**

Create `27_IMMOPILOT/components/ui/slider-input.tsx`:

```tsx
'use client';

import { useState, useCallback, useRef, useEffect } from "react";

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
  debounceMs?: number;
}

export function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
  debounceMs = 400,
}: SliderInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [editing, setEditing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes
  useEffect(() => {
    if (!editing) setLocalValue(value);
  }, [value, editing]);

  const debouncedChange = useCallback(
    (v: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(v), debounceMs);
    },
    [onChange, debounceMs]
  );

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setLocalValue(v);
    debouncedChange(v);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value) || 0;
    setLocalValue(v);
    debouncedChange(v);
  };

  const pct = max > min ? ((localValue - min) / (max - min)) * 100 : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {editing ? (
          <input
            type="number"
            value={localValue}
            min={min}
            max={max}
            step={step}
            onChange={handleInput}
            onBlur={() => setEditing(false)}
            autoFocus
            className="w-28 rounded-lg border border-[var(--bleu-action)] px-2 py-1 text-right text-sm font-bold text-[var(--bleu-marine)] focus:outline-none"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-bold text-[var(--bleu-marine)] hover:text-[var(--bleu-action)]"
          >
            {Math.round(localValue).toLocaleString("fr-FR")}{suffix ? ` ${suffix}` : ""}
          </button>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={handleSlider}
        className="w-full cursor-pointer accent-[var(--bleu-action)]"
        style={{
          background: `linear-gradient(to right, var(--bleu-action) ${pct}%, #e2e8f0 ${pct}%)`,
        }}
      />
      <div className="mt-0.5 flex justify-between text-[10px] text-gray-400">
        <span>{min.toLocaleString("fr-FR")}{suffix ? ` ${suffix}` : ""}</span>
        <span>{max.toLocaleString("fr-FR")}{suffix ? ` ${suffix}` : ""}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Build check**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add components/ui/stepper.tsx components/ui/tabs.tsx components/ui/slider-input.tsx
git commit -m "feat(immopilot): add StepperHorizontal, TabsContainer, SliderInput"
```

---

### Task 9: DossierMiniCard + ProjectSidebar

**Files:**
- Create: `components/dossiers/mini-card.tsx`
- Create: `components/parcours/project-sidebar.tsx`

- [ ] **Step 1: Create DossierMiniCard**

Create `27_IMMOPILOT/components/dossiers/mini-card.tsx`:

```tsx
import type { DossierBien } from "@/lib/types";
import { DpeBadge } from "@/components/ui/dpe-badge";
import { fmt } from "@/lib/utils/format";

interface DossierMiniCardProps {
  dossier: DossierBien;
  onClick: () => void;
}

export function DossierMiniCard({ dossier, onClick }: DossierMiniCardProps) {
  const label = dossier.adresse || dossier.commune || "Nouveau dossier";

  return (
    <button
      onClick={onClick}
      className="card-elevated hover-lift w-full bg-white text-left"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-sm font-semibold text-[var(--bleu-marine)]">{label}</p>
        <DpeBadge classe={dossier.dpe_energie} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        {dossier.prix > 0 && <span className="font-semibold text-gray-800">{fmt(dossier.prix)} EUR</span>}
        {dossier.surface > 0 && <span>{dossier.surface} m2</span>}
        {dossier.score > 0 && (
          <span className="ml-auto rounded-full bg-[var(--gris-fond)] px-2 py-0.5 font-semibold text-gray-700">
            {dossier.score}/100
          </span>
        )}
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Create ProjectSidebar**

Create `27_IMMOPILOT/components/parcours/project-sidebar.tsx`:

```tsx
'use client';

import { useState } from "react";
import type { ProjectSummary } from "@/lib/selectors";
import { fmt, fmtPct } from "@/lib/utils/format";
import { VerdictBanner } from "@/components/ui/verdict-banner";

interface ProjectSidebarProps {
  summary: ProjectSummary;
}

export function ProjectSidebar({ summary }: ProjectSidebarProps) {
  const [collapsed, setCollapsed] = useState(true);

  const verdictLabel = summary.verdict === "financable"
    ? "Financable"
    : summary.verdict === "depassement"
      ? "Depassement"
      : "Incomplet";

  const items = [
    { label: "Budget", value: `${fmt(summary.budget)} EUR` },
    { label: "Capacite", value: `${fmt(summary.capacite)} EUR` },
    { label: "PTZ", value: summary.ptz > 0 ? `${fmt(summary.ptz)} EUR` : "—" },
    { label: "Endettement", value: summary.endettement > 0 ? `${fmtPct(summary.endettement)}%` : "—" },
    { label: "Dossiers", value: String(summary.nb_dossiers) },
  ];

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden w-72 flex-shrink-0 lg:block">
        <div className="sticky top-24 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Resume projet</h3>
          {items.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-semibold text-[var(--bleu-marine)]">{item.value}</span>
            </div>
          ))}
          {summary.verdict !== "incomplet" && (
            <VerdictBanner
              positive={summary.verdict === "financable"}
              label={verdictLabel}
            />
          )}
        </div>
      </aside>

      {/* Mobile: collapsible bandeau */}
      <div className="lg:hidden">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-between rounded-xl bg-[var(--gris-fond)] px-4 py-3 text-sm"
        >
          <div className="flex gap-4">
            <span><strong>{fmt(summary.budget)}</strong> budget</span>
            <span><strong>{fmt(summary.capacite)}</strong> capacite</span>
          </div>
          <span className="text-gray-400">{collapsed ? "▼" : "▲"}</span>
        </button>
        {!collapsed && (
          <div className="mt-2 space-y-2 rounded-xl bg-[var(--gris-fond)] px-4 py-3">
            {items.map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
            {summary.verdict !== "incomplet" && (
              <VerdictBanner
                positive={summary.verdict === "financable"}
                label={verdictLabel}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Build check**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add components/dossiers/mini-card.tsx components/parcours/project-sidebar.tsx
git commit -m "feat(immopilot): add DossierMiniCard and ProjectSidebar"
```

---

### Task 10: Intelligent Dashboard — replace /parcours page

**Files:**
- Rewrite: `app/parcours/page.tsx`

- [ ] **Step 1: Rewrite the dashboard page**

Replace `27_IMMOPILOT/app/parcours/page.tsx` with:

```tsx
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadProjet, createEmptyProjet } from "@/lib/storage";
import { getProjectSummary, getCompletedSteps, getCurrentStepInfo } from "@/lib/selectors";
import { buildProjectAlerts } from "@/lib/alertes";
import { ETAPES } from "@/lib/constants";
import type { ProjetImmobilier, EtapeNumber } from "@/lib/types";
import { KpiCard } from "@/components/ui/kpi-card";
import { StepperHorizontal } from "@/components/ui/stepper";
import { AlertCard } from "@/components/ui/alert-card";
import { DossierMiniCard } from "@/components/dossiers/mini-card";
import { EmptyState } from "@/components/ui/empty-state";
import { fmt } from "@/lib/utils/format";

export default function DashboardPage() {
  const router = useRouter();
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);

  useEffect(() => {
    setProjet(loadProjet() ?? createEmptyProjet());
  }, []);

  if (!projet) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-action)] border-t-transparent" />
      </div>
    );
  }

  const summary = getProjectSummary(projet);
  const completedSteps = getCompletedSteps(projet);
  const currentStep = getCurrentStepInfo(projet);
  const alertes = buildProjectAlerts(projet);
  const dossiers = projet.dossiers.slice(0, 4);

  const greeting = projet.prenom ? `Bonjour ${projet.prenom} !` : "Bonjour !";

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--bleu-marine)]">{greeting}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Votre projet avance bien — etape {currentStep.numero} sur 8
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Budget" value={summary.budget > 0 ? `${fmt(summary.budget)} EUR` : "—"} href="/parcours/1-projet" />
        <KpiCard label="Capacite" value={summary.capacite > 0 ? `${fmt(summary.capacite)} EUR` : "—"} color="var(--bleu-action)" href="/parcours/2-capacite" />
        <KpiCard label="PTZ" value={summary.ptz > 0 ? `${fmt(summary.ptz)} EUR` : "—"} color="var(--vert-succes)" href="/parcours/2-capacite" />
        <KpiCard label="Dossiers" value={String(summary.nb_dossiers)} color="var(--rouge-fr)" href="/dossiers" />
      </div>

      {/* Stepper */}
      <div>
        <StepperHorizontal
          completedSteps={completedSteps}
          currentStep={currentStep.numero}
          onStepClick={(n) => {
            const etape = ETAPES.find((e) => e.numero === n);
            if (etape) router.push(`/parcours/${etape.slug}`);
          }}
        />

        {/* Current step card */}
        <div className="card-hero mt-2">
          <p className="text-sm font-semibold opacity-80">Etape {currentStep.numero}</p>
          <p className="mt-1 text-lg font-bold">{currentStep.titre}</p>
          <p className="mt-1 text-sm opacity-80">{currentStep.description}</p>
          <button
            onClick={() => router.push(`/parcours/${currentStep.slug}`)}
            className="mt-3 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-[var(--bleu-marine)] hover:opacity-90"
          >
            Continuer →
          </button>
        </div>
      </div>

      {/* Alertes */}
      {alertes.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Alertes</h2>
          {alertes.slice(0, 3).map((a, i) => (
            <AlertCard
              key={i}
              severity={a.severity === "danger" ? "danger" : a.severity === "warning" ? "warning" : "info"}
              title={a.message}
              detail={a.detail}
            />
          ))}
          {alertes.length > 3 && (
            <button className="text-sm text-[var(--bleu-action)] hover:underline">
              Voir toutes les alertes ({alertes.length})
            </button>
          )}
        </div>
      )}

      {/* Dossiers */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Mes dossiers</h2>
        {dossiers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {dossiers.map((d) => (
                <DossierMiniCard
                  key={d.id}
                  dossier={d}
                  onClick={() => router.push(`/dossiers/${d.id}`)}
                />
              ))}
            </div>
            {projet.dossiers.length > 4 && (
              <button
                onClick={() => router.push("/dossiers")}
                className="mt-3 text-sm text-[var(--bleu-action)] hover:underline"
              >
                Voir tous mes dossiers ({projet.dossiers.length})
              </button>
            )}
          </>
        ) : (
          <EmptyState
            icon="🏠"
            title="Aucun dossier pour l'instant"
            description="Creez votre premier dossier pour suivre un bien."
            actionLabel="Creer un dossier"
            onAction={() => router.push("/dossiers")}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build check**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npm run build 2>&1 | tail -10
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add app/parcours/page.tsx
git commit -m "feat(immopilot): replace flat step list with intelligent dashboard"
```

---

### Task 11: Step Layout v2 — tabs, sidebar, new stepper

**Files:**
- Rewrite: `components/parcours/step-layout.tsx`

- [ ] **Step 1: Rewrite step-layout with tabs and sidebar**

Replace `27_IMMOPILOT/components/parcours/step-layout.tsx` with:

```tsx
'use client';

import { useEffect, useState, useMemo } from "react";
import { loadProjet, saveProjet, createEmptyProjet } from "@/lib/storage";
import { getProjectSummary, getCompletedSteps } from "@/lib/selectors";
import { StepperHorizontal } from "@/components/ui/stepper";
import { StepNav } from "@/components/parcours/step-nav";
import { ProjectSidebar } from "@/components/parcours/project-sidebar";
import { TabsContainer } from "@/components/ui/tabs";
import type { ProjetImmobilier, EtapeNumber } from "@/lib/types";
import { ETAPES } from "@/lib/constants";
import { useRouter } from "next/navigation";

export interface TipData {
  type: "economie" | "attention" | "danger" | "astuce";
  titre: string;
  detail: string;
}

export interface StepLayoutProps {
  etape: EtapeNumber;
  guide: React.ReactNode;
  outils?: React.ReactNode;
  tips?: TipData[];
  checklist?: string[];
  proCTA?: { titre: string; description: string; buttonText: string };
  children?: React.ReactNode;
}

const TIP_STYLES: Record<TipData["type"], { border: string; bg: string; icon: string }> = {
  economie: { border: "border-l-green-500", bg: "bg-green-50", icon: "💰" },
  attention: { border: "border-l-orange-500", bg: "bg-orange-50", icon: "⚠️" },
  danger: { border: "border-l-red-500", bg: "bg-red-50", icon: "🚨" },
  astuce: { border: "border-l-blue-500", bg: "bg-blue-50", icon: "💡" },
};

export function StepLayout({ etape, guide, outils, tips, checklist, proCTA, children }: StepLayoutProps) {
  const router = useRouter();
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    const p = loadProjet() ?? createEmptyProjet();
    setProjet(p);
    // Load checklist from projet.checklists
    if (checklist) {
      const saved = p.checklists[etape];
      setChecked(saved && saved.length === checklist.length ? saved : new Array(checklist.length).fill(false));
    }
  }, [etape, checklist]);

  const toggleCheck = (idx: number) => {
    const next = checked.map((v, i) => (i === idx ? !v : v));
    setChecked(next);
    // Persist to projet.checklists
    if (projet) {
      const updated = { ...projet, checklists: { ...projet.checklists, [etape]: next } };
      setProjet(updated);
      saveProjet(updated);
    }
  };

  const completedSteps = useMemo(() => projet ? getCompletedSteps(projet) : [], [projet]);
  const summary = useMemo(() => projet ? getProjectSummary(projet) : null, [projet]);

  const checkedCount = checked.filter(Boolean).length;

  const tabs = [
    { id: "outils", label: "Outils", keepMounted: true },
    { id: "guide", label: "Guide", keepMounted: true },
    { id: "conseils", label: "Conseils", keepMounted: false },
    ...(checklist ? [{ id: "checklist", label: "Checklist", badge: checkedCount, keepMounted: false }] : []),
  ];

  if (!projet) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-action)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Stepper */}
      <StepperHorizontal
        completedSteps={completedSteps}
        currentStep={etape}
        onStepClick={(n) => {
          const e = ETAPES.find((e) => e.numero === n);
          if (e) router.push(`/parcours/${e.slug}`);
        }}
      />

      {/* Title */}
      <h1 className="mb-1 text-2xl font-bold text-[var(--bleu-marine)]">
        {ETAPES.find((e) => e.numero === etape)?.titre}
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        {ETAPES.find((e) => e.numero === etape)?.description}
      </p>

      {/* Mobile sidebar bandeau */}
      {summary && <ProjectSidebar summary={summary} />}

      {/* Main content + Desktop sidebar */}
      <div className="mt-4 flex gap-6">
        <div className="min-w-0 flex-1">
          <TabsContainer tabs={tabs} defaultTab="outils">
            {(activeTab) => (
              <>
                {activeTab === "outils" && (
                  <div className="space-y-6">
                    {outils}
                    {children}
                    {proCTA && (
                      <div className="card-flat border-[var(--bleu-action)]">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-[var(--bleu-marine)]">{proCTA.titre}</p>
                            <p className="mt-1 text-sm text-gray-600">{proCTA.description}</p>
                          </div>
                          <button className="flex-shrink-0 rounded-xl bg-[var(--bleu-action)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                            {proCTA.buttonText}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "guide" && (
                  <div className="card-flat border-blue-200 bg-blue-50">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-blue-600">ℹ️</span>
                      <div className="text-sm text-blue-900">{guide}</div>
                    </div>
                  </div>
                )}

                {activeTab === "conseils" && tips && tips.length > 0 && (
                  <div className="space-y-3">
                    {tips.map((tip, i) => {
                      const s = TIP_STYLES[tip.type];
                      return (
                        <div key={i} className={`border-l-3 rounded-r-xl p-3 ${s.border} ${s.bg}`}>
                          <div className="flex items-start gap-2">
                            <span>{s.icon}</span>
                            <div>
                              <p className="text-sm font-semibold">{tip.titre}</p>
                              <p className="mt-0.5 text-sm text-gray-700">{tip.detail}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "checklist" && checklist && (
                  <div className="space-y-2">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-[var(--vert-succes)] transition-all duration-300"
                          style={{ width: `${checklist.length > 0 ? (checkedCount / checklist.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-500">
                        {checkedCount}/{checklist.length}
                      </span>
                    </div>
                    {checklist.map((item, i) => (
                      <label key={i} className="flex cursor-pointer items-center gap-3">
                        <button
                          onClick={() => toggleCheck(i)}
                          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                            checked[i]
                              ? "border-[var(--vert-succes)] bg-[var(--vert-succes)] text-white"
                              : "border-gray-300 bg-white"
                          }`}
                          aria-label={checked[i] ? "Demarquer" : "Marquer comme fait"}
                        >
                          {checked[i] && (
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                            </svg>
                          )}
                        </button>
                        <span className={`text-sm ${checked[i] ? "text-gray-400 line-through" : "text-gray-700"}`}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContainer>

          {/* Mini checklist bar + Step nav */}
          {checklist && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-[var(--gris-fond)] px-4 py-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[var(--vert-succes)]"
                  style={{ width: `${checklist.length > 0 ? (checkedCount / checklist.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-500">{checkedCount}/{checklist.length}</span>
            </div>
          )}

          <StepNav etapeCourante={etape} />
        </div>

        {/* Desktop sidebar — only rendered by ProjectSidebar's lg:block */}
        {summary && (
          <div className="hidden lg:block">
            <ProjectSidebar summary={summary} />
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build check**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npm run build 2>&1 | tail -10
```

Expected: Build succeeds.

- [ ] **Step 3: Run all tests**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx vitest run
```

Expected: All tests pass (existing 20 + new 15 = 35).

- [ ] **Step 4: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add components/parcours/step-layout.tsx
git commit -m "feat(immopilot): rewrite step-layout with tabs, sidebar, stepper v2"
```

---

### Task 12: Dossier pages redesign

**Files:**
- Modify: `app/dossiers/page.tsx`
- Modify: `app/dossiers/[id]/page.tsx`

- [ ] **Step 1: Update dossiers list page to use DossierMiniCard + EmptyState**

In `27_IMMOPILOT/app/dossiers/page.tsx`, replace the DossierCard component and its usage with:

1. Replace imports at top:
```tsx
import { DossierMiniCard } from "@/components/dossiers/mini-card";
import { EmptyState } from "@/components/ui/empty-state";
```

2. Remove the local `DossierCard`, `DPE_COLORS`, `STATUT_LABELS`, `STATUT_COLORS`, and `fmt` definitions.

3. Replace the empty state JSX with `<EmptyState icon="🏠" title="Vous n'avez pas encore de dossier" description="Creez-en un pour chaque bien qui vous interesse." actionLabel="Creer mon premier dossier" onAction={handleCreate} />`

4. Replace the grid to use `DossierMiniCard` instead of `DossierCard`.

5. Change `max-w-4xl` (already correct).

- [ ] **Step 2: Update dossier detail page — use DpeBadge, max-w-4xl**

In `27_IMMOPILOT/app/dossiers/[id]/page.tsx`:

1. Add import: `import { DpeBadge } from "@/components/ui/dpe-badge";`
2. Replace the inline DPE badge div in the header with: `<DpeBadge classe={dossier.dpe_energie} size="md" />`
3. Remove the local `DPE_COLORS` constant.
4. Change `max-w-3xl` to `max-w-4xl` in the container div.

- [ ] **Step 3: Build check**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npm run build 2>&1 | tail -10
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add app/dossiers/page.tsx app/dossiers/[id]/page.tsx
git commit -m "feat(immopilot): redesign dossier pages with DossierMiniCard, DpeBadge, EmptyState"
```

---

### Task 13: Add prenom field to etape 1

**Files:**
- Modify: `app/parcours/1-projet/page.tsx`

- [ ] **Step 1: Add prenom field to the form**

In `27_IMMOPILOT/app/parcours/1-projet/page.tsx`, add a prenom input at the very start of the "Votre situation" section (after the h2, before "Situation familiale"):

```tsx
{/* Prenom */}
<div>
  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="prenom">
    Votre prenom <span className="text-gray-400">(optionnel)</span>
  </label>
  <input
    id="prenom"
    type="text"
    value={projet.prenom ?? ""}
    onChange={(e) => update("prenom", e.target.value)}
    placeholder="Ex. Thomas"
    className="w-full max-w-xs rounded-xl border border-[var(--gris-border)] px-4 py-2.5 text-sm focus:border-[var(--bleu-action)] focus:outline-none"
  />
</div>
```

- [ ] **Step 2: Build check**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT"
git add app/parcours/1-projet/page.tsx
git commit -m "feat(immopilot): add prenom field to etape 1"
```

---

### Task 14: Final verification

- [ ] **Step 1: Run all tests**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npx vitest run
```

Expected: All tests pass.

- [ ] **Step 2: Build**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Check git status**

```bash
cd "C:/1- Marwan/Claude/27_IMMOPILOT" && git status
```

Expected: Clean working tree.

---

## Self-Review Checklist

| Spec Requirement | Task |
|---|---|
| lib/selectors.ts (getProjectSummary, getCompletedSteps, getCurrentStepInfo) | Task 3 |
| lib/alertes.ts (buildProjectAlerts) | Task 4 |
| lib/utils/format.ts (fmt, fmtPct) | Task 1 |
| prenom field in types + storage + etape 1 | Tasks 2, 13 |
| checklists Record in types + step-layout | Tasks 2, 11 |
| Design system CSS tokens + Inter font | Task 5 |
| StepperHorizontal | Task 8 |
| KpiCard | Task 7 |
| SliderInput with debounce | Task 8 |
| TabsContainer (keepMounted/lazy) | Task 8 |
| AlertCard | Task 6 |
| BadgePill | Task 6 |
| DpeBadge (replaces 3 copies) | Tasks 6, 12 |
| Toast | Task 7 |
| EmptyState | Tasks 6, 12 |
| FormField | Task 7 |
| VerdictBanner | Task 6 |
| ProjectSidebar (sticky + mobile bandeau) | Task 9 |
| DossierMiniCard | Tasks 9, 12 |
| Dashboard intelligent | Task 10 |
| Step Layout v2 (tabs, sidebar, stepper) | Task 11 |
| Dossier pages redesign | Task 12 |
| prefers-reduced-motion | Task 5 |
| Responsive (mobile/desktop) | Tasks 8-11 |

**Not in this plan (deferred):** Migration of individual etape pages to use SliderInput (etapes 2-8 tool sections keep working as-is with the new step-layout wrapping them in tabs). Can be done incrementally per-etape in a follow-up.
