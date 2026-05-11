# ImmoPilot

Guide gratuit pour l'achat immobilier des primo-accédants en France. 10 étapes de A à Z, simulateurs financiers, alertes réglementaires, dossier de financement PDF.

**Stack :** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Vitest

**Statut :** Déployé sur Vercel — 26 pages statiques, 37 tests

## Démarrer

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.local.example .env.local
# Remplir les valeurs (voir section Variables d'environnement)

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Non (pas encore connecté) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase | Non |
| `OPENAI_API_KEY` | Clé API OpenAI (analyse IA dossiers) | Non |

Le projet fonctionne entièrement en localStorage sans backend.

## Architecture

```
app/
  layout.tsx                     # Layout racine (Inter, Header, Footer, JSON-LD)
  page.tsx                       # Homepage (hero, piliers, outils, FAQ)
  parcours/
    page.tsx                     # Dashboard parcours
    1-projet/ ... 10-emmenagement/  # 10 étapes du parcours
    dossier-financement/         # Générateur PDF
  (marketing)/
    outils/                      # Simulateur crédit, frais notaire, PTZ
    pro/                         # Page B2B lead gen
    mentions-legales/
  dossiers/                      # Gestion dossiers immobiliers
  mes-donnees/                   # RGPD — gestion données localStorage
components/
  parcours/step-layout.tsx       # Shell partagé des 10 étapes
  ui/                            # Composants réutilisables
  formulaires/lead-modal.tsx     # Modal capture leads
lib/
  calculateurs/                  # Crédit, PTZ, notaire, endettement
  data/                          # 22 fichiers de données métier (sources légales)
  storage.ts                     # Persistance localStorage + migration schéma
  types.ts                       # Types TypeScript centralisés
```

## Tests

```bash
npm test           # Vitest en mode watch
npx vitest run     # Run unique (CI)
```

8 fichiers de tests, 37 tests couvrant les calculateurs financiers et les sélecteurs.

## Build & Deploy

```bash
npx next build     # Build production (26 pages statiques)
```

Déployé automatiquement sur Vercel via GitHub (`github.com/mchamoun1986/immopilot`).

## Données métier

22 fichiers dans `lib/data/` avec sources légales datées :
- Barèmes PTZ (décret 2026-187), taux crédit (CAFPI mai 2026)
- Frais notaire (décret 2026-128), DPE (Loi Climat et Résilience)
- Zones communes (arrêté 05/09/2025), aides achat, copropriété
- Tips, contacts, checklist visite, règles urbanisme
