@AGENTS.md

## Agents ImmoPilot

7 agents experts immobilier disponibles dans `agents/` :

| Agent | Scope | Quand l'utiliser |
|---|---|---|
| `immopilot-parcours` | Orchestrateur 10 etapes | Quand tu sais pas quel expert appeler |
| `immopilot-finance` | Credit, PTZ, aides, assurance, fiscalite | Etapes 2, 6 — tout ce qui touche au financement |
| `immopilot-juridique` | Notaire, compromis, diagnostics, copro, urbanisme | Etapes 3, 4, 5, 7 — tout le juridique |
| `immopilot-marche` | Prix m2, zonage ABC, negociation | Etapes 1, 3, 4 — analyse marche |
| `immopilot-technique` | DPE, travaux, renovation, VEFA | Etapes 3, 8 — technique et energie |
| `immopilot-pratique` | Demenagement, MRH, declarations | Etapes 7, 8 — post-achat |
| `immopilot-donnees` | Baremes, zonage, validation | Transversal — mise a jour donnees |

## Data Files

Tous les fichiers data sont dans `lib/data/*.ts` — types + constantes exportees avec commentaire source.
