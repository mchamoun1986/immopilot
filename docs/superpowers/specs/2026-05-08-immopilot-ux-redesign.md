# ImmoPilot 2.0 — UX Redesign Spec

> Derniere mise a jour : 2026-05-08 — Revue Codex appliquee

## Objectif

Refonte UX globale d'ImmoPilot pour passer d'un MVP fonctionnel a une app SaaS moderne, engageante et intuitive. Style reference : Pretto, Alan, Qonto.

## Scope

Redesign des composants existants + ajout d'une couche de normalisation state. Pas de nouvelles fonctionnalites metier, pas de connexion Supabase, pas d'API IA.

## 0. Prerequis — Normalisation du state

Avant tout travail UI, consolider le state fragmenté actuel.

### Probleme actuel

- 9+ cles localStorage eparses (immopilot_checklist_1..8, immopilot_travaux_estim, immopilot_comparateur_banques, etc.)
- `progression[]` et `alertes[]` dans ProjetImmobilier jamais mis a jour
- `etape_courante` pas fiable
- Les outils dans les etapes gardent leur state local sans remonter au projet

### Solution

**Ajouter `prenom` au modele :**
```typescript
// Dans ProjetImmobilier (lib/types.ts)
prenom: string;  // optionnel, utilise pour personnalisation dashboard
```

**Creer `lib/selectors.ts` :**
```typescript
// Derive les KPIs et le resume du projet depuis ProjetImmobilier
export function getProjectSummary(projet: ProjetImmobilier): ProjectSummary
// Retourne : budget, capacite, ptz, nb_dossiers, endettement, verdict (financable/depassement)

export function getCompletedSteps(projet: ProjetImmobilier): EtapeNumber[]
// Regles de completion par etape (voir ci-dessous)

export function getCurrentStepInfo(projet: ProjetImmobilier): StepInfo
// Retourne : etape courante, titre, description, slug
```

**Creer `lib/alertes.ts` :**
```typescript
// Genere les alertes depuis les dossiers et le projet
export function buildProjectAlerts(projet: ProjetImmobilier): Alerte[]
// DPE E/F/G, charges copro elevees, endettement > 30%, bien ancien < 1949, etc.
```

**Consolider les cles localStorage :**
- Migrer les checklists d'etape dans `projet.checklists: Record<EtapeNumber, boolean[]>`
- Migrer les donnees d'outils (comparateur banques, travaux) dans les dossiers ou le projet
- Objectif : une seule cle `immopilot_projet` contient tout le state persistant

### Regles de completion des etapes

| Etape | Complete quand |
|---|---|
| 1 | revenus_net > 0 ET commune non vide ET budget_max > 0 |
| 2 | capacite_emprunt > 0 ET eligible_ptz est calcule |
| 3 | au moins 1 dossier cree |
| 4 | au moins 1 dossier a une offre non null |
| 5 | au moins 1 dossier a un compromis signe |
| 6 | au moins 1 dossier a un financement avec taux_obtenu |
| 7 | au moins 1 dossier a une date_acte |
| 8 | checklist post-achat >= 50% completee |

## 1. Design System

### Couleurs (inchangees, formalisees)

| Token | Hex | Usage |
|---|---|---|
| bleu-marine | #1a365d | Titres, texte principal |
| bleu-action | #2563eb | Liens, boutons, elements interactifs |
| rouge-fr | #c1272d | CTA principal, alertes danger |
| vert-succes | #22c55e | Validations, etapes completees, badges OK |
| orange-warn | #f59e0b | Alertes attention |
| gris-fond | #f8fafc | Background sections alternees |
| gris-border | #e2e8f0 | Bordures cards |

### Coins et ombres

- Tous les composants : `rounded-xl` (12px)
- Cards elevated : `shadow-sm` (0 1px 3px rgba(0,0,0,0.1))
- Pas de shadow lourde nulle part

### Typographie

- Charger Inter via `next/font/google` dans layout.tsx
- Titres : font-bold ou font-extrabold
- Corps : font-normal
- Chiffres hero : text-2xl font-extrabold

### Cards — 3 niveaux

- **Flat** : `border border-gris-border rounded-xl p-4` — listes, formulaires
- **Elevated** : `rounded-xl shadow-sm p-5` — KPIs, resultats, outils
- **Hero** : `bg-gradient-to-br from-bleu-marine to-bleu-action text-white rounded-xl p-5` — resultat principal, CTA

### Inputs

- Champs texte/number : `rounded-xl border border-gris-border px-4 py-2.5 text-sm focus:border-bleu-action focus:outline-none`
- Sliders pour montants et durees (range input stylise + valeur affichee)
- Suffixes (EUR, %, ans) affiches a droite de l'input
- Sliders DOIVENT utiliser `saveProjetDebounced()` (jamais saveProjet direct)

### Badges

- Pill : `rounded-full px-3 py-1 text-xs font-semibold`
- Couleur par semantique : vert=succes, rouge=danger, orange=warning, bleu=info, marine=neutre

### Alertes/Tips

- `border-l-3 rounded-r-xl p-3` + icone + titre bold + detail
- Vert=economie, orange=attention, rouge=danger, bleu=astuce

### Animations

- Hover cards : `hover:scale-[1.02] transition-transform duration-200`
- Fade-in sections au chargement
- Transitions entre tabs : `transition-opacity duration-200`
- Toast sauvegarde : slide-in depuis le haut, auto-dismiss 2s
- **Respecter `prefers-reduced-motion`** : desactiver toutes les animations si l'utilisateur a cette preference

## 2. Dashboard intelligent

Remplace la page `/parcours` (actuellement une liste plate de 8 liens).

### Structure

```
┌─────────────────────────────────────────────┐
│ Bonjour [prenom] !                          │
│ Votre projet avance bien — etape X sur 8    │
├─────────────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │250k│ │230k│ │ 40k│ │  2 │              │
│  │Budg│ │Capa│ │PTZ │ │Dos │              │
│  └────┘ └────┘ └────┘ └────┘              │
├─────────────────────────────────────────────┤
│ Stepper horizontal (8 etapes)               │
│ [✓]──[✓]──[3]──[4]──[5]──[6]──[7]──[8]    │
│                                             │
│ Card etape courante : titre + desc + CTA    │
│ [Continuer →]                               │
├─────────────────────────────────────────────┤
│ Alertes (si dossiers avec problemes)        │
│ ⚠ DPE F detecte sur Rue Garibaldi          │
├─────────────────────────────────────────────┤
│ Mes dossiers (mini cards 2 colonnes)        │
│ ┌──────────┐ ┌──────────┐                  │
│ │Garibaldi │ │Berthelot │                  │
│ │235k · F  │ │248k · C  │                  │
│ └──────────┘ └──────────┘                  │
└─────────────────────────────────────────────┘
```

### Donnees

- Prenom : depuis `projet.prenom` (champ explicite)
- KPIs : via `getProjectSummary(projet)` de lib/selectors.ts
- Stepper : via `getCompletedSteps(projet)` de lib/selectors.ts
- Alertes : via `buildProjectAlerts(projet)` de lib/alertes.ts
- Dossiers : `projet.dossiers` slice 4 premiers

### KPI cards

4 cards elevated en grid 2x2 (mobile) ou 4 colonnes (desktop). Chaque card :
- Label en petit gris
- Valeur en gros bold (bleu-marine, ou bleu-action pour capacite, vert pour PTZ, rouge pour dossiers)
- Clic → navigue vers la section correspondante

### Stepper horizontal

- 8 cercles relies par des lignes
- Vert + check = complete, bleu = en cours, gris = a venir
- Labels sous chaque cercle (caches sur mobile, visibles sur lg+)
- Card bleue sous le stepper montrant l'etape courante avec bouton "Continuer"

### Section alertes

- Visible uniquement si des alertes existent (via buildProjectAlerts)
- Max 3 alertes affichees, "Voir toutes" si plus
- Style : card avec border-left rouge/orange

### Mini dossiers

- Grid 2 colonnes
- Chaque card : adresse, prix, surface, badge DPE colore, score si analyse faite
- Bouton "Voir tous mes dossiers" en bas
- Si aucun dossier : EmptyState + "Creez votre premier dossier"

## 3. Redesign des etapes

### Layout etape (step-layout v2)

Remplace le scroll infini par un layout structure avec tabs.

```
┌─────────────────────────────────────────────┐
│ Stepper horizontal (8 etapes)               │
├─────────────────────────────────────────────┤
│ Titre etape + description                   │
├──────────────────────────┬──────────────────┤
│                          │ Sidebar resume   │
│ Tabs : [Outils] [Guide] │ Budget : 250k    │
│        [Conseils] [✓]   │ Capacite : 230k  │
│                          │ Revenus : 3500   │
│ Contenu du tab actif     │ Charges : 200    │
│ (outils avec sliders,   │ ──────────       │
│  guide, tips, checklist) │ Endettement: 12% │
│                          │ PTZ : Eligible   │
│                          │ ✅ Financable    │
├──────────────────────────┴──────────────────┤
│ Mini checklist progress bar     2/4         │
├─────────────────────────────────────────────┤
│ ← Etape precedente    Etape suivante →      │
└─────────────────────────────────────────────┘
```

### Tabs

4 tabs par etape :
- **Outils** (defaut) : simulateurs, calculateurs, formulaires interactifs
- **Guide** : contenu educatif, reglementation
- **Conseils** : tips d'expert contextualises
- **Checklist** (avec badge compteur) : points a valider

Sur mobile : tabs scrollables horizontalement.

**Politique de montage :** Les tabs Outils et Guide restent montes (`keepMounted`) pour preserver le state des formulaires et sliders. Les tabs Conseils et Checklist sont lazy-montes au premier clic.

### Sidebar resume (lg+ seulement)

- Position fixe a droite (sticky top-24)
- Affiche les donnees via `getProjectSummary(projet)`
- Se met a jour en temps reel quand l'utilisateur modifie un parametre
- Verdict en bas : badge vert "Financable" ou rouge "Depassement"
- Sur mobile (<lg) : bandeau collapsible en haut avec les KPIs cles
- Largeur sidebar : w-72 (288px)

### Outils avec sliders

- Remplacer les inputs number par des sliders pour : montant emprunte, duree, surface, prix
- Slider = range input stylise avec gradient bleu
- Valeur affichee a cote du label
- Input number en fallback pour saisie precise (clic sur la valeur = mode edition)
- **Debounce obligatoire** : les sliders utilisent saveProjetDebounced (400ms)

### Resultats hero

- Le resultat principal (mensualite, frais notaire, montant PTZ) en card hero gradient
- Resultats secondaires en cards elevated
- Micro-animation quand la valeur change (scale pulse) — respecter prefers-reduced-motion

### Tips contextuels

- Apparaissent sous l'outil concerne dans le tab Outils (pas en vrac en bas)
- Icone + titre bold + detail
- Un seul tip visible a la fois par outil (le plus pertinent)
- Section "Conseils" dans les tabs pour tous les tips de l'etape

### Mini checklist

- Barre de progression en bas de la page (pas une section dediee)
- Clic → ouvre le tab Checklist
- Compteur "2/4" affiche

## 4. Personnalisation

### Prenom

- Champ `prenom` (optionnel) dans le formulaire etape 1
- Utilise dans le dashboard : "Bonjour [prenom] !"
- Si pas de prenom : "Bonjour !" tout court

### Chiffres contextuels

- Chaque etape affiche les chiffres pertinents dans la sidebar via getProjectSummary
- Les valeurs se mettent a jour en temps reel (pas besoin de recharger)

### Verdicts clairs

- Chaque outil donne un verdict : badge + phrase
- "Financable" / "Eligible PTZ" / "Endettement conforme" / "DPE correct"
- Ou inversement : "Depassement de 15 000 EUR" / "Non eligible" / "Endettement > 35%"

## 5. Redesign pages dossiers

Les pages dossiers (liste + detail) doivent suivre le meme design system pour eviter une rupture visuelle quand l'utilisateur navigue depuis le dashboard.

### Liste dossiers (app/dossiers/page.tsx)

- Utiliser les DossierMiniCard du dashboard (meme composant)
- Ajouter EmptyState illustre si aucun dossier
- Max-width aligne sur le parcours (max-w-4xl)

### Detail dossier (app/dossiers/[id]/page.tsx)

- Tabs : Infos | Visite | Finance | Alertes
- Cards elevated pour chaque section
- DpeBadge composant reutilisable
- Formulaire avec le meme inputCls standardise
- Max-width max-w-4xl (pas max-w-3xl)

## 6. Composants a creer/modifier

### Nouveaux composants — UI

| Composant | Fichier | Description |
|---|---|---|
| StepperHorizontal | components/ui/stepper.tsx | 8 etapes avec cercles, lignes, labels |
| KpiCard | components/ui/kpi-card.tsx | Card elevated avec label + valeur |
| SliderInput | components/ui/slider-input.tsx | Range slider + valeur + input fallback, debounce integre |
| TabsContainer | components/ui/tabs.tsx | Tabs avec keepMounted/lazyMount configurable |
| AlertCard | components/ui/alert-card.tsx | Alerte avec border-left + icone |
| BadgePill | components/ui/badge.tsx | Badge rounded-full semantique |
| DpeBadge | components/ui/dpe-badge.tsx | Badge DPE colore (A-G) reutilisable — remplace les 3 copies actuelles |
| Toast | components/ui/toast.tsx | Notification auto-dismiss slide-in |
| EmptyState | components/ui/empty-state.tsx | Illustration + message + CTA pour etats vides |
| FormField | components/ui/form-field.tsx | Label + input + erreur + suffixe standardise |
| VerdictBanner | components/ui/verdict-banner.tsx | Badge vert/rouge + phrase de verdict |

### Nouveaux composants — Parcours/Dossiers

| Composant | Fichier | Description |
|---|---|---|
| ProjectSidebar | components/parcours/project-sidebar.tsx | Sidebar sticky resume projet (lg+) / bandeau mobile (<lg) |
| DossierMiniCard | components/dossiers/mini-card.tsx | Card compacte pour dashboard + liste dossiers |

### Nouveaux fichiers — Logique

| Fichier | Description |
|---|---|
| lib/selectors.ts | getProjectSummary, getCompletedSteps, getCurrentStepInfo |
| lib/alertes.ts | buildProjectAlerts (genere alertes depuis dossiers) |
| lib/utils/format.ts | fmt(n), fmtPct(n) — remplace les 6 copies actuelles |

### Composants a modifier

| Composant | Modification |
|---|---|
| lib/types.ts | Ajouter prenom, checklists Record, consolider |
| lib/storage.ts | Migration localStorage: fusionner les cles eparses |
| app/layout.tsx | Charger Inter via next/font |
| app/parcours/page.tsx | Remplacer la liste par le dashboard intelligent |
| components/parcours/step-layout.tsx | Tabs, sidebar, nouveau stepper, keepMounted |
| components/ui/progress-bar.tsx | Remplacer par StepperHorizontal |
| app/dossiers/page.tsx | Redesign avec DossierMiniCard + EmptyState |
| app/dossiers/[id]/page.tsx | Tabs, cards elevated, max-w-4xl, DpeBadge |
| Toutes les pages etapes (1-8) | Reorganiser le contenu en tabs, ajouter sliders |

## 7. Responsive

| Breakpoint | Comportement |
|---|---|
| Mobile (<lg) | Sidebar → bandeau collapsible, stepper compact (cercles sans labels), grid 2 cols KPIs, tabs scrollables horizontalement, CTA sticky en bas |
| Desktop (lg+) | Sidebar sticky visible a droite (w-72), stepper avec labels, grid 4 cols KPIs, tabs standard |

### Details mobile

- Stepper : cercles uniquement, etape courante visible, label en dessous du stepper
- Sidebar : bandeau horizontal collapsible montrant budget + capacite + verdict
- Tabs : overflow-x-auto, scroll snap, indicateur actif
- Navigation etapes : boutons sticky en bas de l'ecran
- KPIs : 2x2 grid au lieu de 4 colonnes

## 8. Performance

| Regle | Implementation |
|---|---|
| Debounce sliders | saveProjetDebounced (400ms) pour tous les sliders |
| Memoize alertes | useMemo sur buildProjectAlerts, recalcul uniquement si dossiers changent |
| Tabs lazy | Conseils et Checklist lazy-mount au premier clic |
| Tabs keepMounted | Outils et Guide restent montes pour preserver le state |
| prefers-reduced-motion | Desactiver toutes les animations CSS via media query |
| Inter font | next/font/google auto-optimise (self-hosted, pas de requete externe) |

## 9. Hors scope

- Pas de nouvelles fonctionnalites metier
- Pas de connexion Supabase
- Pas d'API IA
- Pas de nouvelles pages (sauf composants UI)
- Pas de contenu additionnel dans les etapes
