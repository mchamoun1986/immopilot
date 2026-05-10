import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://immopilot.fr'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/parcours`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/outils`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/outils/simulateur-credit-immobilier`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/outils/frais-de-notaire`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/outils/eligibilite-ptz`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/parcours/1-projet`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/parcours/2-budget`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/parcours/3-accord-bancaire`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/parcours/4-recherche`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/parcours/5-analyse`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/parcours/6-offre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/parcours/7-avant-contrat`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/parcours/8-financement`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/parcours/9-acte`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/parcours/10-emmenagement`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/parcours/dossier-financement`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/mentions-legales`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
