import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/parcours/2-capacite", destination: "/parcours/2-budget", permanent: true },
      { source: "/parcours/3-recherche", destination: "/parcours/4-recherche", permanent: true },
      { source: "/parcours/4-offre", destination: "/parcours/6-offre", permanent: true },
      { source: "/parcours/5-compromis", destination: "/parcours/7-avant-contrat", permanent: true },
      { source: "/parcours/6-financement", destination: "/parcours/8-financement", permanent: true },
      { source: "/parcours/7-notaire", destination: "/parcours/9-acte", permanent: true },
      { source: "/parcours/8-post-achat", destination: "/parcours/10-emmenagement", permanent: true },
    ];
  },
};

export default nextConfig;
