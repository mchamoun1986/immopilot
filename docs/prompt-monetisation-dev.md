# Prompt de Developpement — Monetisation ImmoPilot (Phase 1 : sans Supabase)

Copie-colle ce prompt dans une nouvelle session Claude Code pour implementer la monetisation.
Tout est localStorage / client-side. Supabase viendra dans une phase ulterieure.

---

## PROMPT A COLLER :

```
Tu travailles sur le projet ImmoPilot (27_IMMOPILOT/).

C'est une app Next.js 16 (React 19, Tailwind, Vercel) — guide d'achat immobilier gratuit pour primo-accedants en France. Tout est cote client (localStorage), pas de backend/Supabase pour l'instant.

Le produit est DEJA construit (10 etapes, 4 calculateurs, alertes, dossiers biens, annuaire 69 pros). Ce qui manque = la monetisation.

IMPORTANT : PAS de Supabase, PAS de backend, PAS de base de donnees dans cette session. Tout reste en localStorage. On preparera le backend plus tard.

## OBJECTIF

Implementer les 3 piliers de monetisation, dans cet ordre :

---

### PILIER 1 : AFFILIATION (priorite immediate)

**Contexte :**
- Le fichier `lib/data/annuaire-professionnels.ts` contient 69 acteurs avec un champ `partenaire_potentiel: boolean` et une interface `ActeurImmobilier`
- Le fichier `lib/data/contacts-par-etape.ts` contient des liens vers des pros par etape avec une interface `ContactEtape`
- Actuellement tous les liens sont des URLs directes sans tracking
- Les liens de l'annuaire sont affiches dans les pages des etapes (parcours/) et potentiellement dans les tabs "Contacts"

**A faire :**

1. **Ajouter un champ `affiliate_url: string | null` dans l'interface `ActeurImmobilier`** (annuaire-professionnels.ts)
   - Ajouter `affiliate_url: null` a TOUS les acteurs existants (pour ne rien casser)
   - Pour les acteurs ou `partenaire_potentiel === true`, mettre une URL placeholder au format : `https://SITE.com/?ref=immopilot&subid={sessionId}`
   - Le `{sessionId}` est un placeholder textuel — il sera remplace cote client au moment du clic
   - Laisser un commentaire `// TODO: remplacer par vrai lien affilie une fois inscrit au programme`

2. **Pareil pour `ContactEtape`** (contacts-par-etape.ts)
   - Ajouter `affiliate_url: string | null` a l'interface
   - Ajouter `affiliate_url: null` a toutes les entrees existantes
   - Pour les comparateurs/portails connus (Pretto, Empruntis, Meilleurtaux, April, Luko, SeLoger, LeBonCoin), mettre le placeholder affilié

3. **Creer un module de tracking affiliation** : `lib/affiliate-tracking.ts`
   - Constante `STORAGE_KEY = "immopilot_affiliate_clicks"`
   - Interface `AffiliateClick` : `{ id: string, url: string, source: string, etape: number | null, subId: string, timestamp: string }`
   - Fonction `trackAffiliateClick(url, source, etape?)` : genere un subId (crypto.randomUUID()), log dans localStorage, retourne le subId
   - Fonction `getAffiliateClicks()` : lit et retourne le tableau
   - Fonction `buildAffiliateUrl(templateUrl, subId)` : remplace `{sessionId}` par le subId dans l'URL template

4. **Creer un composant `AffiliateLink`** : `components/ui/affiliate-link.tsx`
   - Props : `href: string` (URL directe), `affiliateUrl: string | null`, `children: React.ReactNode`, `source: string`, `etape?: number`, `className?: string`
   - Comportement :
     - Au clic : appeler `trackAffiliateClick()`, construire l'URL finale avec le subId, ouvrir dans un nouvel onglet
     - Si `affiliateUrl` est null → ouvrir `href` normalement (pas de tracking)
     - Attributs : `rel="sponsored noopener noreferrer"` si affilié, `rel="noopener noreferrer"` sinon. Toujours `target="_blank"`
   - Visuellement : si affilie, petit badge "Partenaire" en gris clair a droite du texte du lien (discret, pas intrusif)
   - Le composant est un `<a>` standard avec un onClick handler

5. **Brancher `AffiliateLink` dans l'UI existante**
   - Identifier OU les liens de l'annuaire et des contacts sont rendus dans les pages etapes
   - Remplacer les `<a href>` ou `<Link>` par `<AffiliateLink>` UNIQUEMENT pour les liens externes vers des pros
   - Ne PAS toucher aux liens internes de navigation

6. **Mention legale affiliation**
   - Ajouter dans le footer (`components/ui/footer.tsx`) une ligne : "Certains liens sont des liens partenaires. ImmoPilot peut percevoir une commission sans surcout pour vous."
   - Dans `app/(marketing)/mentions-legales/page.tsx`, ajouter une section "Liens d'affiliation" expliquant que certains liens sont affilies, que ca ne change pas le prix pour l'utilisateur, et que ImmoPilot reste neutre dans ses recommandations

---

### PILIER 2 : LEAD GENERATION (sans backend — localStorage only)

**Contexte :**
- Le lead modal existe deja : `components/formulaires/lead-modal.tsx`
- Les types existent : `LeadCapture` dans `lib/types.ts` avec `LeadSource`
- La sauvegarde existe en localStorage : `lib/leads.ts` (saveLead, getLeads)
- Le `ProjetImmobilier` a un champ `lead_captured: boolean`
- Sources deja definies : "simulation" | "analyse_prix" | "courtier" | "analyse_ia" | "travaux" | "diagnostiqueur" | "assurance" | "demenagement" | "renovation" | "sauvegarde"

**A faire :**

1. **Enrichir `saveLead()` dans `lib/leads.ts`**
   - En plus de ce qui est deja sauvegarde, inclure un snapshot du projet : `{ budget_max, capacite_emprunt, montant_ptz, commune, code_postal, etape_courante }`
   - Ajouter un champ `sources_captured: LeadSource[]` dans le projet pour tracker quelles sources ont deja ete capturees (pour ne pas re-montrer le meme modal)

2. **Ajouter `sources_captured: LeadSource[]` au type `ProjetImmobilier`** (lib/types.ts)
   - Defaut : `[]`
   - Gerer la migration dans `lib/storage.ts` : si le champ n'existe pas, initialiser a `[]`
   - Incrementer `CURRENT_SCHEMA_VERSION` a 3

3. **Creer un hook `useLeadModal`** : `lib/hooks/use-lead-modal.ts`
   - `useLeadModal(source: LeadSource, etape: EtapeNumber)` retourne `{ shouldShow, openModal, closeModal, isOpen, onSubmit }`
   - `shouldShow` = true SEULEMENT si `source` n'est PAS dans `projet.sources_captured`
   - `onSubmit` : sauvegarde le lead, ajoute la source a `sources_captured`, sauvegarde le projet
   - Expose aussi `triggerAfterDelay(ms)` : ouvre le modal apres un delai (pour post-simulation)

4. **Activer le lead modal aux points de capture** (4 endroits) :

   a) **Apres simulation credit** (`app/(marketing)/outils/simulateur-credit-immobilier/page.tsx`)
      - Quand l'utilisateur voit le resultat de simulation, afficher un bouton "Recevoir ma simulation par email"
      - Au clic → ouvrir le lead modal avec `source="simulation"`, `showConsent={true}`
      - Titre du modal : "Recevez votre simulation detaillee"
      - Description : "On vous envoie le detail de votre capacite d'emprunt et un plan de financement personnalise."

   b) **Apres simulation PTZ** (`app/(marketing)/outils/eligibilite-ptz/page.tsx`)
      - Meme logique, bouton "Recevoir mon eligibilite PTZ par email"
      - `source="simulation"` (meme source — une seule capture suffit pour les simulations)

   c) **Apres frais de notaire** (`app/(marketing)/outils/frais-de-notaire/page.tsx`)
      - Bouton "Recevoir le detail de mes frais par email"
      - `source="simulation"`

   d) **Etape 3 — Accord bancaire** (`app/parcours/3-accord-bancaire/page.tsx`)
      - Dans la section conseils/outils, ajouter un encart : "Un courtier peut comparer les offres de 100+ banques pour vous — gratuitement."
      - Bouton "Etre mis en relation avec un courtier"
      - `source="courtier"`, `showPhone={true}`, `showConsent={true}`
      - Titre modal : "Etre rappele par un courtier"
      - Description : "Un courtier partenaire vous rappelle sous 24h pour etudier votre dossier. Service gratuit."

5. **Regles UX strictes**
   - JAMAIS de modal qui s'ouvre tout seul (toujours apres un clic utilisateur)
   - JAMAIS bloquer l'acces au contenu ou aux outils
   - Si la source est deja dans `sources_captured` → ne PAS afficher le bouton/encart
   - Le bouton declencheur doit etre visuellement secondaire (pas le CTA principal de la page)

---

### PILIER 3 : PAGE PRO (landing page statique — sans backend)

**A faire :**

1. **Creer `app/(marketing)/pro/page.tsx`** — landing page B2B
   - Objectif : convaincre les pros (courtiers, diagnostiqueurs, agents, assureurs) de s'inscrire
   - Structure de la page :

   **Hero** : "Recevez des leads qualifies dans votre zone — sans prospection"
   - Sous-titre : "ImmoPilot guide 750 000 primo-accedants/an. Quand ils cherchent un courtier, un diagnostiqueur ou un assureur, on vous les envoie."

   **Comment ca marche** (3 etapes visuelles) :
   1. "L'acheteur utilise nos outils gratuits" (calculateur, parcours, alertes)
   2. "Il accepte d'etre mis en relation" (consent explicite RGPD)
   3. "Vous recevez le lead avec son projet" (budget, zone, etape, contact)

   **Chiffres cles** (4 KPIs) :
   - 750 000 primo-accedants/an en France
   - 10 etapes couvertes (du projet a l'emmenagement)
   - 12 categories de pros (courtiers, banques, assureurs, diagnostiqueurs, demenageurs...)
   - Lead qualifie (budget, zone, etape, consentement)

   **Grille tarifaire** (3 tiers) :
   | | Starter | Business | Premium |
   |---|---|---|---|
   | Prix | 49 EUR/mois | 199 EUR/mois | 499 EUR/mois |
   | Leads/mois | 5 | 20 | Illimite |
   | Visibilite annuaire | Oui | Oui + badge | Oui + priorite |
   | Zone geographique | 1 departement | 3 departements | National |
   | Stats | Basiques | Detaillees | Temps reel |

   **Formulaire d'interet** (en bas de page) :
   - Champs : Nom, Entreprise, Email, Telephone, Type de pro (select : courtier/agent/diagnostiqueur/assureur/demenageur/autre), Departement
   - Au submit : sauvegarder dans localStorage (cle `immopilot_pro_interests`) — PAS de backend
   - Message de confirmation : "Merci ! Nous vous recontacterons sous 48h."

   **Design** : meme style que le reste du site (bleu marine, rouge francais, cards blanches). Utiliser les memes CSS variables.

2. **Ajouter un lien vers /pro dans le footer**
   - "Vous etes un professionnel ?" → lien vers /pro

3. **SEO de la page /pro**
   - Creer `app/(marketing)/pro/layout.tsx` avec metadata : title "ImmoPilot Pro — Recevez des leads immobiliers qualifies", description adaptee

---

## REGLES DE DEV

- **ZERO backend** — tout en localStorage, pas de Supabase, pas d'API routes, pas de base de donnees
- **Ne PAS casser l'existant** — les 37 tests doivent continuer a passer (`npm test`)
- **Ne PAS changer le design** sans demander — garder les memes couleurs/polices/style
- **TypeScript strict** — pas de `any`, respecter les types existants
- **Pas de packages supplementaires** — utiliser uniquement ce qui est deja installe
- **Migration storage** — incrementer `CURRENT_SCHEMA_VERSION` et gerer la migration dans `migrateProjet()`
- **Commits atomiques** : 1 commit par pilier (affiliation, lead gen, page pro)
- **Tester** : `npx tsc --noEmit` + `npm test` apres chaque pilier

## QUESTIONS AVANT DE COMMENCER

Avant de coder, explore le projet et reponds a ces questions :

1. Comment et ou sont rendus les liens de `contacts-par-etape.ts` et `annuaire-professionnels.ts` dans l'UI ? (pour savoir ou brancher AffiliateLink)
2. Comment sont structurees les pages outils (simulateur-credit, ptz, notaire) — ou exactement afficher le bouton lead capture post-resultat ?
3. Quelle est la structure du footer actuel ?
4. Le schema_version actuel est 2 — confirme que la migration v2→v3 peut ajouter `sources_captured: []` sans casser les projets existants ?

Reponds a ces 4 questions, puis commence par le Pilier 1. Un pilier a la fois, dans l'ordre.
```

---

## Notes pour toi (Marwan)

- **Pas besoin de `.env.local`** pour cette phase — tout est client-side
- **Les IDs affilies** : tu les rempliras plus tard dans `annuaire-professionnels.ts` une fois inscrit aux programmes (Awin, Kwanko, etc.)
- **Supabase** viendra en Phase 2 : on connectera les leads deja accumules en localStorage vers la DB
- **Stripe** viendra en Phase 3 : abonnements pros
- Les leads captures en localStorage ne sont PAS perdus — quand on branchera Supabase, on pourra faire un "sync" qui pousse tout
