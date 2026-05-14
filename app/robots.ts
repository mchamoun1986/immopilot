import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dossiers/', '/mes-donnees'],
    },
    sitemap: 'https://immopilot-rust.vercel.app/sitemap.xml',
  }
}
