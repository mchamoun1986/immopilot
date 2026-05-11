# ImmoPilot Critical Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 25 critical issues from the 2026-05-11 audit plus top warnings, bringing the project from 0/10 PASS toward production-ready.

**Architecture:** Six independent task groups targeting different file sets — can be parallelized. No task depends on another.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Vitest

---

## File Structure

No new files created. All changes are edits to existing files:

| Task | Files Modified |
|------|---------------|
| T1 — border-l fix | `components/ui/alert-card.tsx`, `components/parcours/step-layout.tsx`, `app/parcours/3-accord-bancaire/page.tsx` |
| T2 — stale-state race | `app/parcours/2-budget/page.tsx` |
| T3 — data integrity | `lib/data/zones-communes.ts`, `lib/data/annuaire-professionnels.ts` |
| T4 — SEO quick fixes | `app/sitemap.ts`, `app/(marketing)/outils/frais-de-notaire/page.tsx`, `app/(marketing)/outils/eligibilite-ptz/page.tsx`, `app/parcours/2-budget/page.tsx` |
| T5 — accent restoration | `lib/constants.ts`, `app/layout.tsx`, `app/page.tsx`, `lib/data/tips-par-etape.ts`, `lib/data/bandeaux-intro.ts`, `lib/data/contacts-par-etape.ts`, `components/parcours/step-layout.tsx`, `components/formulaires/lead-modal.tsx`, `lib/alertes.ts`, all `app/parcours/*/page.tsx`, all `app/(marketing)/*/page.tsx`, `app/dossiers/**`, `app/mes-donnees/page.tsx`, `lib/data/checklist-visite.ts`, `lib/data/urbanisme-rules.ts`, `lib/data/dpe-rules.ts` |
| T6 — logic warnings | `app/(marketing)/outils/frais-de-notaire/page.tsx`, `app/(marketing)/outils/eligibilite-ptz/page.tsx`, `app/parcours/2-budget/page.tsx`, `lib/storage.ts` |

---

### Task 1: Fix border-l-3 (invalid Tailwind class)

`border-l-3` does not exist in Tailwind CSS v4. All alert/tip left borders are invisible.

**Files:**
- Modify: `components/ui/alert-card.tsx:19`
- Modify: `components/parcours/step-layout.tsx:159`
- Modify: `app/parcours/3-accord-bancaire/page.tsx:80`

- [ ] **Step 1: Fix alert-card.tsx**

In `components/ui/alert-card.tsx:19`, replace `border-l-3` with `border-l-4`:
```tsx
// Before
<div className={`border-l-3 rounded-r-xl p-3 ${s.border} ${s.bg}`}>
// After
<div className={`border-l-4 rounded-r-xl p-3 ${s.border} ${s.bg}`}>
```

- [ ] **Step 2: Fix step-layout.tsx**

In `components/parcours/step-layout.tsx:159`, replace `border-l-3` with `border-l-4`:
```tsx
// Before
<div key={i} className={`border-l-3 rounded-r-xl p-3 ${s.border} ${s.bg}`}>
// After
<div key={i} className={`border-l-4 rounded-r-xl p-3 ${s.border} ${s.bg}`}>
```

- [ ] **Step 3: Fix 3-accord-bancaire**

In `app/parcours/3-accord-bancaire/page.tsx:80`, replace `border-l-3` with `border-l-4`:
```tsx
// Before
<div className="rounded-xl border-l-3 border-l-blue-500 bg-blue-50 p-4">
// After
<div className="rounded-xl border-l-4 border-l-blue-500 bg-blue-50 p-4">
```

- [ ] **Step 4: Verify no other border-l-3**

Run: `grep -r "border-l-3" 27_IMMOPILOT/`
Expected: no matches

---

### Task 2: Fix stale-state race in budget page

Three sub-components (`SimulateurCredit`, `TauxEndettement`, `EligibilitePTZ`) each spread `{...projet}` in useEffect, so the last one to fire overwrites changes from the other two. Fix: each child sends only its own fields, parent merges via functional setState.

**Files:**
- Modify: `app/parcours/2-budget/page.tsx:34-46,127-143,251-271,572-578`

- [ ] **Step 1: Refactor handleUpdate to accept partial fields**

In `app/parcours/2-budget/page.tsx`, change `handleUpdate` (lines 572-578) from:
```tsx
const handleUpdate = useCallback(
  (updated: ProjetImmobilier) => {
    setProjet(updated);
    saveProjet(updated);
  },
  []
);
```
To:
```tsx
const handleFieldUpdate = useCallback(
  (fields: Partial<ProjetImmobilier>) => {
    setProjet((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...fields };
      saveProjet(next);
      return next;
    });
  },
  []
);
```

- [ ] **Step 2: Update SimulateurCredit**

Change the component signature and useEffect (lines 34-46):
```tsx
// Signature: change onUpdate type
function SimulateurCredit({ projet, onUpdate }: { projet: ProjetImmobilier; onUpdate: (fields: Partial<ProjetImmobilier>) => void }) {
```
```tsx
// useEffect: send only owned fields
useEffect(() => {
  onUpdate({ capacite_emprunt: montant, duree_souhaitee: duree });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [montant, duree]);
```

- [ ] **Step 3: Update TauxEndettement**

Change the component signature and useEffect (lines 127-143):
```tsx
function TauxEndettement({ projet, onUpdate }: { projet: ProjetImmobilier; onUpdate: (fields: Partial<ProjetImmobilier>) => void }) {
```
```tsx
useEffect(() => {
  onUpdate({ taux_endettement: result.taux, charges_fixes: charges });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [charges, taux, duree]);
```

- [ ] **Step 4: Update EligibilitePTZ**

Change the component signature and useEffect (lines 251-271):
```tsx
function EligibilitePTZ({ projet, onUpdate }: { projet: ProjetImmobilier; onUpdate: (fields: Partial<ProjetImmobilier>) => void }) {
```
```tsx
useEffect(() => {
  onUpdate({
    eligible_ptz: result.eligible,
    montant_ptz: result.eligible ? result.montant : 0,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [zone, revenuFiscal, taille_foyer, cout_op]);
```

- [ ] **Step 5: Update JSX to pass handleFieldUpdate**

Change lines 590-592:
```tsx
// Before
<SimulateurCredit projet={projet} onUpdate={handleUpdate} />
<TauxEndettement projet={projet} onUpdate={handleUpdate} />
<EligibilitePTZ projet={projet} onUpdate={handleUpdate} />
// After
<SimulateurCredit projet={projet} onUpdate={handleFieldUpdate} />
<TauxEndettement projet={projet} onUpdate={handleFieldUpdate} />
<EligibilitePTZ projet={projet} onUpdate={handleFieldUpdate} />
```

- [ ] **Step 6: Run tests**

Run: `cd 27_IMMOPILOT && npx vitest run`
Expected: 37 tests pass

---

### Task 3: Fix data integrity

**Files:**
- Modify: `lib/data/zones-communes.ts:82`
- Modify: `lib/data/annuaire-professionnels.ts:225`

- [ ] **Step 1: Remove phantom Antony entry**

In `lib/data/zones-communes.ts:82`, delete the line:
```ts
{ code_insee: "91021", code_postal: "91160", nom: "Antony", zone: "Abis", departement: "91" },
```
Real Antony is already at line 44 (92002, 92160, dept 92).

- [ ] **Step 2: Fix BNP URL**

In `lib/data/annuaire-professionnels.ts:225`, change:
```ts
// Before
site_web: "https://mabanque.bnpparibas",
// After
site_web: "https://mabanque.bnpparibas.com",
```

---

### Task 4: SEO quick fixes

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/(marketing)/outils/frais-de-notaire/page.tsx:27`

- [ ] **Step 1: Add /pro to sitemap**

In `app/sitemap.ts`, add after the mentions-legales entry (line 23):
```ts
{ url: `${base}/pro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
```

- [ ] **Step 2: Fix notaire remise 20% to 10%**

In `app/(marketing)/outils/frais-de-notaire/page.tsx`, find the FAQ text that says "remise maximale de 20%" and change to "remise maximale de 10%" to match `notaire-baremes.ts` data (`remise_max_pct: 10`).

---

### Task 5: Accent restoration (systematic)

All user-visible French strings must have proper accents. This is the largest task — ~187 instances across ~30 files.

**Strategy:** Process file by file using search-and-replace. Priority order:
1. Meta/SEO strings (layout.tsx, page.tsx headings)
2. Constants (lib/constants.ts)
3. Data files (tips, bandeaux, contacts, checklist, alertes, rules)
4. Page components (all parcours, marketing, dossiers pages)
5. Shared components (step-layout, lead-modal)

**Common patterns to fix:**

| Find (in string literals) | Replace |
|---|---|
| etape | etape (keep) or etape → etape (context: always "etape" → "etape") |
| `Definir` | `Definir` → `Definir` |

Actually — the substitution table for the agent:

| Pattern | Replacement | Notes |
|---|---|---|
| `etape` (noun) | `etape` | ALL user-facing instances |
| `Etape` | `Etape` | Start of sentence |
| `credit` (noun) | `credit` | NOT in code identifiers |
| `pret` (noun) | `pret` | NOT the adjective "near" |
| `eligib` | `eligib` | Prefix covers eligibilite, eligible |
| `Eligib` | `Eligib` | |
| `capacite` | `capacite` | |
| `donnees` | `donnees` | |
| `Creez`/`creer`/`Creer` | `Creez`/`creer`/`Creer` | |
| `interets` | `interets` | |
| `Prenom`/`prenom` | `Prenom`/`prenom` | |
| `securite` | `securite` | |
| `negoci` | `negoci` | |
| `Emmenager` | `Emmenager` | |
| ` a ` (preposition) | ` a ` | CONTEXT-SENSITIVE — only where "a" = preposition "a" |

NOTE: The actual accent characters are: e, e, e, a, u, i, o, c. The plan doc can't show them properly in all contexts so the executing agent MUST read each file and apply correct French accents (e with acute = e, e with grave = e, e with circumflex = e, etc.).

**Files to process (in order):**

- [ ] **Step 1: lib/constants.ts** — Fix all 10 ETAPES entries + PHASES labels
- [ ] **Step 2: app/layout.tsx** — Fix meta title, description, OG, Twitter text
- [ ] **Step 3: app/page.tsx** — Fix CHIFFRES_CLES, QUESTIONS_FREQUENTES, PILIERS, OUTILS, all section headings
- [ ] **Step 4: lib/alertes.ts** — Fix alert strings
- [ ] **Step 5: lib/data/tips-par-etape.ts** — Fix ALL tip titles and details (~80 instances)
- [ ] **Step 6: lib/data/bandeaux-intro.ts** — Fix all bandeau strings
- [ ] **Step 7: lib/data/contacts-par-etape.ts** — Fix contact descriptions
- [ ] **Step 8: lib/data/checklist-visite.ts** — Fix all items + fix "demenibrement" and "possiblite"
- [ ] **Step 9: lib/data/urbanisme-rules.ts** — Fix "desormais derroger" → "desormais deroger"
- [ ] **Step 10: lib/data/dpe-rules.ts** — Fix "Reglements environnemental" → "Reglement environnemental"
- [ ] **Step 11: components/parcours/step-layout.tsx** — Fix "Dans cette etape", "Entree :", "Demarquer"
- [ ] **Step 12: components/formulaires/lead-modal.tsx** — Fix "prenom", "confidentialite", "demenageurs", "donnees stockees"
- [ ] **Step 13: app/parcours/page.tsx** — Fix "etape", "Capacite", "Creez", "Generez"
- [ ] **Step 14: app/parcours/1-projet/page.tsx** — Fix "Independant", "apres impots", "souhaitee", "Definissez", "eligibilite"
- [ ] **Step 15: app/parcours/2-budget/page.tsx** — Fix checklist strings, section headings, labels, GateLead text. Also fix "baremes 2024" → "baremes 2026"
- [ ] **Step 16: app/parcours/3-accord-bancaire/page.tsx** — Fix "rassemble", "releve", "ecrit", "independant", "preparer", "enormement", "credibilite", "Etre rappele"
- [ ] **Step 17: app/(marketing)/outils/eligibilite-ptz/page.tsx** — Fix H1 "Eligibilite", "Verifiez", Cyrillic char, "baremes 2024" → "baremes 2026"
- [ ] **Step 18: app/(marketing)/outils/simulateur-credit-immobilier/page.tsx** — Fix H1 "credit", "parametres", "emprunte", "Duree", "Mensualite", "Cout"
- [ ] **Step 19: app/(marketing)/outils/frais-de-notaire/page.tsx** — Fix "parametres", "Emoluments", "Debours", "securite immobiliere"
- [ ] **Step 20: app/(marketing)/pro/page.tsx** — Fix H2 "Comment ca marche", "qualifies", "details"
- [ ] **Step 21: app/mes-donnees/page.tsx** — Fix H1 "Mes donnees", all strings
- [ ] **Step 22: app/dossiers/page.tsx + app/dossiers/[id]/page.tsx** — Fix "Creer", "complete", "financiere", "estimee", "Depasse", "Financable", "renovation", "Completez", "calcule", "marche"
- [ ] **Step 23: app/parcours/dossier-financement/page.tsx** — Fix "immobiliere", "Prenom", "Celibataire", "recherche", "renseignee", "Reste a vivre"
- [ ] **Step 24: Run build to verify no broken strings**

Run: `cd 27_IMMOPILOT && npx next build`
Expected: Build succeeds with 0 errors

- [ ] **Step 25: Run tests**

Run: `cd 27_IMMOPILOT && npx vitest run`
Expected: 37 tests pass (some test assertions may need accent updates if they match UI strings)

---

### Task 6: Logic warning fixes

**Files:**
- Modify: `app/(marketing)/outils/eligibilite-ptz/page.tsx`
- Modify: `app/parcours/2-budget/page.tsx`

- [ ] **Step 1: Fix PTZ "baremes 2024" → "baremes 2026"**

Already covered in Task 5, steps 15 and 17. Skip if already done.

- [ ] **Step 2: Use saveProjetDebounced in budget page**

In `app/parcours/2-budget/page.tsx`, update the import and handleFieldUpdate:

Import change:
```tsx
// Before
import { loadProjet, saveProjet, createEmptyProjet } from "@/lib/storage";
// After
import { loadProjet, saveProjet, saveProjetDebounced, createEmptyProjet } from "@/lib/storage";
```

In handleFieldUpdate (from Task 2), use debounced save:
```tsx
const handleFieldUpdate = useCallback(
  (fields: Partial<ProjetImmobilier>) => {
    setProjet((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...fields };
      saveProjetDebounced(next);
      return next;
    });
  },
  []
);
```

Note: Keep `saveProjet` (synchronous) for StepLayout checklist saves — only the calculator sub-components use debounced.

---

## Verification

After all tasks complete:

- [ ] `cd 27_IMMOPILOT && npx next build` — must succeed with 0 errors
- [ ] `cd 27_IMMOPILOT && npx vitest run` — 37 tests must pass
- [ ] `grep -r "border-l-3" 27_IMMOPILOT/app 27_IMMOPILOT/components` — 0 matches
- [ ] Visual check: alert cards and tips show left border accent
