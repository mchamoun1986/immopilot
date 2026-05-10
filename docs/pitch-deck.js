const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "ImmoPilot";
pres.title = "ImmoPilot — Pitch Investisseurs";

// ─── PALETTE ────────────────────────────────────────────────────────────────
const C = {
  navy: "0F1F3D",
  navyLight: "1A365D",
  red: "C1272D",
  blue: "2563EB",
  blueLight: "60A5FA",
  green: "16A34A",
  greenLight: "DCFCE7",
  white: "FFFFFF",
  offWhite: "F8FAFC",
  grayLight: "E2E8F0",
  grayMid: "64748B",
  grayDark: "1E293B",
  orange: "EA580C",
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.12 });
const makeCardShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.08 });

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — COVER
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.navy };

  // Decorative accent circle
  slide.addShape(pres.shapes.OVAL, { x: -1.5, y: -1.5, w: 5, h: 5, fill: { color: C.red, transparency: 85 } });
  slide.addShape(pres.shapes.OVAL, { x: 7, y: 3, w: 6, h: 6, fill: { color: C.blue, transparency: 90 } });

  // Brand
  slide.addText("ImmoPilot", {
    x: 0.8, y: 1.2, w: 8, h: 1,
    fontSize: 52, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
  });

  // Tagline
  slide.addText("Le copilote de l'achat immobilier en France", {
    x: 0.8, y: 2.2, w: 7, h: 0.6,
    fontSize: 22, fontFace: "Calibri", color: C.blueLight, margin: 0,
  });

  // Subtitle
  slide.addText("Pitch Investisseurs — Mai 2026", {
    x: 0.8, y: 3.1, w: 5, h: 0.4,
    fontSize: 13, fontFace: "Calibri", color: C.grayMid, margin: 0,
  });

  // KPIs bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.0, w: 8.4, h: 1.2, fill: { color: C.white, transparency: 92 } });
  const kpis = [
    { val: "750 000", label: "Primo-accedants/an" },
    { val: "100% gratuit", label: "Pour l'utilisateur" },
    { val: "3 sources", label: "De revenus B2B" },
    { val: "0 conflit", label: "D'interet" },
  ];
  kpis.forEach((k, i) => {
    const xPos = 1.0 + i * 2.1;
    slide.addText(k.val, { x: xPos, y: 4.15, w: 2, h: 0.55, fontSize: 16, fontFace: "Georgia", bold: true, color: C.white, align: "center", margin: 0 });
    slide.addText(k.label, { x: xPos, y: 4.65, w: 2, h: 0.4, fontSize: 9, fontFace: "Calibri", color: C.blueLight, align: "center", margin: 0 });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — PROBLEME
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.offWhite };

  slide.addText("Le Probleme", {
    x: 0.6, y: 0.4, w: 5, h: 0.6,
    fontSize: 32, fontFace: "Georgia", bold: true, color: C.navyLight, margin: 0,
  });

  slide.addText("Acheter son premier bien immobilier en France est un parcours du combattant.", {
    x: 0.6, y: 1.0, w: 6.5, h: 0.5,
    fontSize: 14, fontFace: "Calibri", color: C.grayMid, margin: 0,
  });

  // Pain points — cards
  const pains = [
    { stat: "73%", desc: "des Francais eligibles au PTZ ne le savent pas", color: C.red },
    { stat: "35%", desc: "ne connaissent pas le plafond HCSF d'endettement", color: C.orange },
    { stat: "12 000 EUR", desc: "d'economies ratees sur l'assurance emprunteur (Loi Lemoine)", color: C.blue },
    { stat: "6-12 mois", desc: "de parcours sans guide neutre ni checklist", color: C.navyLight },
  ];

  pains.forEach((p, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const xPos = 0.6 + col * 4.6;
    const yPos = 1.7 + row * 1.7;

    slide.addShape(pres.shapes.RECTANGLE, { x: xPos, y: yPos, w: 4.3, h: 1.4, fill: { color: C.white }, shadow: makeCardShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: xPos, y: yPos, w: 0.07, h: 1.4, fill: { color: p.color } });
    slide.addText(p.stat, { x: xPos + 0.3, y: yPos + 0.15, w: 3.8, h: 0.55, fontSize: 22, fontFace: "Georgia", bold: true, color: p.color, margin: 0 });
    slide.addText(p.desc, { x: xPos + 0.3, y: yPos + 0.7, w: 3.8, h: 0.55, fontSize: 12, fontFace: "Calibri", color: C.grayMid, margin: 0 });
  });

  // Bottom insight
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 5.0, w: 9, h: 0.45, fill: { color: C.navy } });
  slide.addText("Aucun outil neutre ne guide l'acheteur de A a Z sans conflit d'interet.", {
    x: 0.8, y: 5.05, w: 8.5, h: 0.4,
    fontSize: 12, fontFace: "Calibri", bold: true, color: C.white, margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — SOLUTION
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.white };

  slide.addText("La Solution : ImmoPilot", {
    x: 0.6, y: 0.4, w: 6, h: 0.6,
    fontSize: 32, fontFace: "Georgia", bold: true, color: C.navyLight, margin: 0,
  });

  slide.addText("Le GPS de l'achat immobilier — gratuit, neutre, complet.", {
    x: 0.6, y: 1.0, w: 7, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.grayMid, margin: 0,
  });

  // 3 pillars
  const pillars = [
    { title: "Calculez", desc: "Credit, PTZ, notaire, endettement — vos vrais chiffres en 30 secondes", icon: "1" },
    { title: "Suivez", desc: "10 etapes de A a Z avec checklist, alertes et contacts utiles", icon: "2" },
    { title: "Decidez", desc: "Analyse DPE, prix m2, comparaison de biens, score qualite", icon: "3" },
  ];

  pillars.forEach((p, i) => {
    const xPos = 0.6 + i * 3.1;
    const yPos = 1.7;
    slide.addShape(pres.shapes.RECTANGLE, { x: xPos, y: yPos, w: 2.9, h: 2.6, fill: { color: C.offWhite }, shadow: makeCardShadow() });
    // Number circle
    slide.addShape(pres.shapes.OVAL, { x: xPos + 0.2, y: yPos + 0.2, w: 0.55, h: 0.55, fill: { color: C.blue } });
    slide.addText(p.icon, { x: xPos + 0.2, y: yPos + 0.2, w: 0.55, h: 0.55, fontSize: 16, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    slide.addText(p.title, { x: xPos + 0.2, y: yPos + 0.9, w: 2.5, h: 0.4, fontSize: 18, fontFace: "Georgia", bold: true, color: C.navyLight, margin: 0 });
    slide.addText(p.desc, { x: xPos + 0.2, y: yPos + 1.35, w: 2.5, h: 1.0, fontSize: 11, fontFace: "Calibri", color: C.grayMid, margin: 0 });
  });

  // Differenciateurs
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.6, w: 9, h: 0.85, fill: { color: C.greenLight } });
  slide.addText([
    { text: "100% gratuit ", options: { bold: true, color: C.green } },
    { text: " | Aucun compte requis  |  Donnees locales (pas de cloud)  |  Mis a jour 2026  |  Sources officielles (LegiFrance, ANIL)", options: { color: C.grayDark } },
  ], { x: 0.8, y: 4.7, w: 8.6, h: 0.65, fontSize: 11, fontFace: "Calibri", margin: 0 });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — MARCHE (TAM SAM SOM)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.white };

  slide.addText("Opportunite de Marche", {
    x: 0.6, y: 0.4, w: 6, h: 0.6,
    fontSize: 32, fontFace: "Georgia", bold: true, color: C.navyLight, margin: 0,
  });

  // TAM SAM SOM circles (concentric - represented as nested shapes)
  // TAM
  slide.addShape(pres.shapes.OVAL, { x: 0.7, y: 1.3, w: 4.2, h: 4.0, fill: { color: C.blue, transparency: 85 }, line: { color: C.blue, width: 2 } });
  slide.addText([
    { text: "TAM", options: { bold: true, fontSize: 10, breakLine: true } },
    { text: "1.1M transactions/an", options: { fontSize: 9 } },
  ], { x: 0.9, y: 1.5, w: 2.0, h: 0.6, color: C.blue, fontFace: "Calibri", margin: 0 });

  // SAM
  slide.addShape(pres.shapes.OVAL, { x: 1.5, y: 2.1, w: 3.0, h: 2.8, fill: { color: C.blue, transparency: 70 }, line: { color: C.blue, width: 2 } });
  slide.addText([
    { text: "SAM", options: { bold: true, fontSize: 10, breakLine: true } },
    { text: "750K primo-accedants", options: { fontSize: 9 } },
  ], { x: 1.7, y: 2.3, w: 2.0, h: 0.6, color: C.blue, fontFace: "Calibri", margin: 0 });

  // SOM
  slide.addShape(pres.shapes.OVAL, { x: 2.1, y: 3.0, w: 1.8, h: 1.7, fill: { color: C.blue, transparency: 40 } });
  slide.addText([
    { text: "SOM Y1", options: { bold: true, fontSize: 10, breakLine: true } },
    { text: "25K users", options: { fontSize: 9 } },
  ], { x: 2.2, y: 3.3, w: 1.6, h: 0.6, color: C.white, fontFace: "Calibri", margin: 0 });

  // Right side — market data
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.3, w: 4.3, h: 4.0, fill: { color: C.offWhite }, shadow: makeCardShadow() });

  const marketData = [
    { label: "Transactions immo / an (FR)", value: "1.1 million" },
    { label: "Primo-accedants", value: "750 000" },
    { label: "Budget moyen 1er achat", value: "220 000 EUR" },
    { label: "Commission courtier / dossier", value: "1 500 - 4 000 EUR" },
    { label: "Marche courtage credit FR", value: "2.5 Mds EUR" },
    { label: "Marche assurance emprunteur", value: "10 Mds EUR/an" },
    { label: "Valeur d'un lead qualifie", value: "80 - 300 EUR" },
  ];

  marketData.forEach((m, i) => {
    const yPos = 1.5 + i * 0.52;
    slide.addText(m.label, { x: 5.6, y: yPos, w: 2.8, h: 0.3, fontSize: 10, fontFace: "Calibri", color: C.grayMid, margin: 0 });
    slide.addText(m.value, { x: 8.2, y: yPos, w: 1.3, h: 0.3, fontSize: 10, fontFace: "Calibri", bold: true, color: C.navyLight, align: "right", margin: 0 });
    if (i < marketData.length - 1) {
      slide.addShape(pres.shapes.LINE, { x: 5.6, y: yPos + 0.38, w: 3.7, h: 0, line: { color: C.grayLight, width: 0.5 } });
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — PRODUIT
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.navy };

  slide.addText("Le Produit", {
    x: 0.6, y: 0.3, w: 5, h: 0.6,
    fontSize: 32, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
  });

  slide.addText("Application web Next.js — deploye sur Vercel — donnees locales + Supabase", {
    x: 0.6, y: 0.9, w: 8, h: 0.35,
    fontSize: 11, fontFace: "Calibri", color: C.blueLight, margin: 0,
  });

  // Feature grid — 2x3
  const features = [
    { title: "10 Etapes guidees", desc: "De la definition du projet a l'emmenagement" },
    { title: "4 Calculateurs", desc: "Credit, PTZ, frais notaire, endettement" },
    { title: "Alertes intelligentes", desc: "DPE, delais legaux, endettement, clauses" },
    { title: "Dossiers multi-biens", desc: "Comparer prix, DPE, copro, score" },
    { title: "Annuaire 69 pros", desc: "12 categories, couverture nationale" },
    { title: "PDF financement", desc: "Dossier complet genere pour la banque" },
  ];

  features.forEach((f, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const xPos = 0.6 + col * 3.1;
    const yPos = 1.5 + row * 1.75;

    slide.addShape(pres.shapes.RECTANGLE, { x: xPos, y: yPos, w: 2.9, h: 1.5, fill: { color: C.white, transparency: 92 } });
    slide.addText(f.title, { x: xPos + 0.2, y: yPos + 0.2, w: 2.5, h: 0.4, fontSize: 14, fontFace: "Georgia", bold: true, color: C.white, margin: 0 });
    slide.addText(f.desc, { x: xPos + 0.2, y: yPos + 0.7, w: 2.5, h: 0.6, fontSize: 11, fontFace: "Calibri", color: C.blueLight, margin: 0 });
  });

  // Tech stack bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.1, w: 10, h: 0.52, fill: { color: "0A1628" } });
  slide.addText("Next.js 16  |  React 19  |  Tailwind  |  Supabase  |  Vercel  |  TypeScript", {
    x: 0.6, y: 5.15, w: 9, h: 0.42,
    fontSize: 10, fontFace: "Calibri", color: C.grayMid, align: "center", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — BUSINESS MODEL
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.white };

  slide.addText("Business Model", {
    x: 0.6, y: 0.4, w: 6, h: 0.6,
    fontSize: 32, fontFace: "Georgia", bold: true, color: C.navyLight, margin: 0,
  });

  slide.addText("Gratuit pour l'utilisateur — monetisation 100% B2B, invisible, sans friction.", {
    x: 0.6, y: 1.0, w: 8, h: 0.35,
    fontSize: 13, fontFace: "Calibri", color: C.grayMid, margin: 0,
  });

  // 3 revenue pillars
  const models = [
    {
      num: "01", title: "Affiliation / CPA", rev: "2K-8K EUR/mois",
      desc: "Liens affilies vers courtiers (Pretto, Empruntis), assureurs (April, Luko), energie (Selectra). Commission par conversion.",
      color: C.green,
    },
    {
      num: "02", title: "Lead Generation", rev: "15K-45K EUR/mois",
      desc: "Vente de leads qualifies opt-in aux courtiers, diagnostiqueurs, demenageurs. 80-300 EUR/lead.",
      color: C.blue,
    },
    {
      num: "03", title: "SaaS B2B Pro", rev: "10K-40K EUR MRR",
      desc: "Abonnements pros (courtiers, agents, diagnostiqueurs) pour recevoir des leads + visibilite annuaire.",
      color: C.navyLight,
    },
  ];

  models.forEach((m, i) => {
    const yPos = 1.6 + i * 1.25;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: yPos, w: 8.8, h: 1.1, fill: { color: C.offWhite }, shadow: makeCardShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: yPos, w: 0.07, h: 1.1, fill: { color: m.color } });

    // Number
    slide.addText(m.num, { x: 0.9, y: yPos + 0.1, w: 0.6, h: 0.45, fontSize: 20, fontFace: "Georgia", bold: true, color: m.color, margin: 0 });
    // Title + revenue
    slide.addText(m.title, { x: 1.6, y: yPos + 0.1, w: 3, h: 0.4, fontSize: 15, fontFace: "Georgia", bold: true, color: C.grayDark, margin: 0 });
    slide.addText(m.rev, { x: 7.5, y: yPos + 0.1, w: 1.8, h: 0.4, fontSize: 13, fontFace: "Calibri", bold: true, color: m.color, align: "right", margin: 0 });
    // Desc
    slide.addText(m.desc, { x: 1.6, y: yPos + 0.55, w: 7.5, h: 0.45, fontSize: 10.5, fontFace: "Calibri", color: C.grayMid, margin: 0 });
  });

  // Key insight
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 5.0, w: 8.8, h: 0.45, fill: { color: C.navy } });
  slide.addText("Un primo-accedant peut generer jusqu'a 365 EUR de commissions cumulees sur le parcours complet.", {
    x: 0.8, y: 5.05, w: 8.5, h: 0.4,
    fontSize: 11, fontFace: "Calibri", bold: true, color: C.white, margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — AVANTAGE CONCURRENTIEL
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.offWhite };

  slide.addText("Positionnement Unique", {
    x: 0.6, y: 0.4, w: 6, h: 0.6,
    fontSize: 32, fontFace: "Georgia", bold: true, color: C.navyLight, margin: 0,
  });

  // Comparison table
  const headers = [
    { text: "", options: { fill: { color: C.navy }, color: C.navy } },
    { text: "Pretto", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11 } },
    { text: "Empruntis", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11 } },
    { text: "ANIL", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11 } },
    { text: "ImmoPilot", options: { fill: { color: C.red }, color: C.white, bold: true, fontSize: 11 } },
  ];

  const rows = [
    ["Guide complet A-Z", "Non", "Non", "Partiel", "Oui"],
    ["Calculateurs interactifs", "Credit seul", "Credit seul", "Non", "4 outils"],
    ["100% neutre (pas courtier)", "Non", "Non", "Oui", "Oui"],
    ["Alertes personnalisees", "Non", "Non", "Non", "Oui"],
    ["Suivi multi-dossiers", "Non", "Non", "Non", "Oui"],
    ["UX moderne / mobile", "Oui", "Moyenne", "Non", "Oui"],
    ["Gratuit sans compte", "Partiel", "Partiel", "Oui", "Oui"],
  ];

  const tableData = [
    headers,
    ...rows.map((row) => row.map((cell, ci) => {
      const isImmoPilot = ci === 4;
      const isPositive = cell === "Oui" || cell === "4 outils";
      return {
        text: cell,
        options: {
          fontSize: 10,
          fontFace: "Calibri",
          color: isImmoPilot ? (isPositive ? C.green : C.grayDark) : C.grayDark,
          bold: isImmoPilot,
          fill: { color: isImmoPilot ? "EFF6FF" : C.white },
        },
      };
    })),
  ];

  slide.addTable(tableData, {
    x: 0.5, y: 1.2, w: 9, h: 3.8,
    border: { type: "solid", pt: 0.5, color: C.grayLight },
    colW: [2.2, 1.5, 1.5, 1.3, 1.7],
    rowH: [0.42, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45],
  });

  // Differentiator callout
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.1, w: 9, h: 0.4, fill: { color: C.greenLight } });
  slide.addText("Seul outil 100% cote acheteur — pas de conflit d'interet, pas de bien a vendre, pas de credit a placer.", {
    x: 0.7, y: 5.12, w: 8.6, h: 0.36,
    fontSize: 11, fontFace: "Calibri", bold: true, color: C.green, margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — TRACTION & ROADMAP
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.white };

  slide.addText("Traction & Roadmap", {
    x: 0.6, y: 0.4, w: 6, h: 0.6,
    fontSize: 32, fontFace: "Georgia", bold: true, color: C.navyLight, margin: 0,
  });

  // What's built
  slide.addText("Deja construit (Mai 2026)", {
    x: 0.6, y: 1.1, w: 4, h: 0.35,
    fontSize: 14, fontFace: "Calibri", bold: true, color: C.green, margin: 0,
  });

  slide.addText([
    { text: "Produit complet deploye (Next.js, Vercel, 23 fichiers data)", options: { bullet: true, breakLine: true } },
    { text: "10 etapes, 4 calculateurs, systeme d'alertes, gestion dossiers", options: { bullet: true, breakLine: true } },
    { text: "Infrastructure monetisation codee (lead modal, consentement, tables Supabase)", options: { bullet: true, breakLine: true } },
    { text: "69 professionnels repertories dans 12 categories", options: { bullet: true, breakLine: true } },
    { text: "SEO optimise (sitemap, meta, JSON-LD, OG cards)", options: { bullet: true } },
  ], { x: 0.6, y: 1.5, w: 5, h: 2.2, fontSize: 11, fontFace: "Calibri", color: C.grayDark, margin: 0 });

  // Roadmap - right side
  slide.addText("Roadmap", {
    x: 5.5, y: 1.1, w: 4, h: 0.35,
    fontSize: 14, fontFace: "Calibri", bold: true, color: C.blue, margin: 0,
  });

  const roadmap = [
    { phase: "S1-S2", label: "Affiliation live + leads Supabase", color: C.green },
    { phase: "M1-M3", label: "Lead gen active (courtiers, CPL)", color: C.blue },
    { phase: "M3-M6", label: "SaaS Pro (Stripe, dashboard)", color: C.orange },
    { phase: "M6-M12", label: "Scale (API, premium, white-label POC)", color: C.navyLight },
  ];

  roadmap.forEach((r, i) => {
    const yPos = 1.55 + i * 0.62;
    slide.addShape(pres.shapes.OVAL, { x: 5.5, y: yPos + 0.05, w: 0.25, h: 0.25, fill: { color: r.color } });
    slide.addText(r.phase, { x: 5.9, y: yPos, w: 0.9, h: 0.3, fontSize: 9, fontFace: "Calibri", bold: true, color: r.color, margin: 0 });
    slide.addText(r.label, { x: 6.8, y: yPos, w: 2.8, h: 0.3, fontSize: 10, fontFace: "Calibri", color: C.grayDark, margin: 0 });
  });

  // Financial chart
  slide.addChart(pres.charts.BAR, [{
    name: "CA mensuel (EUR)",
    labels: ["M1", "M3", "M6", "M9", "M12"],
    values: [200, 4200, 15700, 31000, 49500],
  }], {
    x: 0.5, y: 3.7, w: 9, h: 1.8,
    barDir: "col",
    chartColors: [C.blue],
    chartArea: { fill: { color: C.offWhite } },
    catAxisLabelColor: C.grayMid,
    valAxisLabelColor: C.grayMid,
    valGridLine: { color: C.grayLight, size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelPosition: "outEnd",
    dataLabelColor: C.navyLight,
    showLegend: false,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — PROJECTIONS FINANCIERES
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.offWhite };

  slide.addText("Projections Financieres", {
    x: 0.6, y: 0.4, w: 6, h: 0.6,
    fontSize: 32, fontFace: "Georgia", bold: true, color: C.navyLight, margin: 0,
  });

  slide.addText("Scenario conservateur — croissance organique SEO uniquement", {
    x: 0.6, y: 0.95, w: 7, h: 0.3,
    fontSize: 11, fontFace: "Calibri", color: C.grayMid, margin: 0,
  });

  // Year 1 targets
  const targets = [
    { val: "49 500 EUR", label: "CA M12", color: C.green },
    { val: "594K EUR", label: "ARR cible", color: C.blue },
    { val: "25 000", label: "Users/mois M12", color: C.navyLight },
    { val: "200+", label: "Pros abonnes M18", color: C.red },
  ];

  targets.forEach((t, i) => {
    const xPos = 0.6 + i * 2.3;
    slide.addShape(pres.shapes.RECTANGLE, { x: xPos, y: 1.4, w: 2.1, h: 1.3, fill: { color: C.white }, shadow: makeCardShadow() });
    slide.addText(t.val, { x: xPos + 0.1, y: 1.55, w: 1.9, h: 0.5, fontSize: 16, fontFace: "Georgia", bold: true, color: t.color, align: "center", margin: 0 });
    slide.addText(t.label, { x: xPos + 0.1, y: 2.1, w: 1.9, h: 0.35, fontSize: 10, fontFace: "Calibri", color: C.grayMid, align: "center", margin: 0 });
  });

  // Revenue breakdown table
  const finHeaders = [
    { text: "Source", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
    { text: "M3", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
    { text: "M6", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
    { text: "M12", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
    { text: "M18 (proj.)", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
  ];

  const finRows = [
    ["Affiliation CPA", "1 200 EUR", "3 200 EUR", "7 500 EUR", "12 000 EUR"],
    ["Lead Gen (CPL)", "2 500 EUR", "8 000 EUR", "22 000 EUR", "35 000 EUR"],
    ["SaaS Pro (MRR)", "0", "3 000 EUR", "15 000 EUR", "40 000 EUR"],
    ["Sponsoring + autres", "500 EUR", "1 500 EUR", "5 000 EUR", "8 000 EUR"],
    ["TOTAL", "4 200 EUR", "15 700 EUR", "49 500 EUR", "95 000 EUR"],
  ];

  const finTableData = [
    finHeaders,
    ...finRows.map((row, ri) => row.map((cell, ci) => ({
      text: cell,
      options: {
        fontSize: 10,
        fontFace: "Calibri",
        bold: ri === finRows.length - 1,
        color: ri === finRows.length - 1 ? C.navyLight : C.grayDark,
        fill: { color: ri === finRows.length - 1 ? "EFF6FF" : C.white },
      },
    }))),
  ];

  slide.addTable(finTableData, {
    x: 0.5, y: 3.0, w: 9, h: 2.4,
    border: { type: "solid", pt: 0.5, color: C.grayLight },
    colW: [2.2, 1.5, 1.7, 1.8, 1.8],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — UNIT ECONOMICS
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.white };

  slide.addText("Unit Economics", {
    x: 0.6, y: 0.4, w: 6, h: 0.6,
    fontSize: 32, fontFace: "Georgia", bold: true, color: C.navyLight, margin: 0,
  });

  // Left — Cost structure
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.4, h: 4.0, fill: { color: C.offWhite }, shadow: makeCardShadow() });
  slide.addText("Structure de couts", { x: 0.7, y: 1.3, w: 4, h: 0.4, fontSize: 14, fontFace: "Calibri", bold: true, color: C.navyLight, margin: 0 });

  const costs = [
    { item: "Hebergement (Vercel Pro)", cost: "20 EUR/mois" },
    { item: "Supabase (Free tier)", cost: "0 EUR" },
    { item: "Domaine", cost: "12 EUR/an" },
    { item: "Affiliation (outils tracking)", cost: "0 EUR" },
    { item: "Marketing (SEO organique)", cost: "0 EUR" },
    { item: "Total fixe mensuel", cost: "~25 EUR/mois" },
  ];

  costs.forEach((c, i) => {
    const yPos = 1.85 + i * 0.48;
    const isTotal = i === costs.length - 1;
    if (isTotal) slide.addShape(pres.shapes.LINE, { x: 0.8, y: yPos - 0.05, w: 3.8, h: 0, line: { color: C.grayLight, width: 1 } });
    slide.addText(c.item, { x: 0.8, y: yPos, w: 2.8, h: 0.35, fontSize: 10.5, fontFace: "Calibri", bold: isTotal, color: C.grayDark, margin: 0 });
    slide.addText(c.cost, { x: 3.4, y: yPos, w: 1.3, h: 0.35, fontSize: 10.5, fontFace: "Calibri", bold: isTotal, color: isTotal ? C.green : C.grayDark, align: "right", margin: 0 });
  });

  // Right — margins
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.4, h: 4.0, fill: { color: C.offWhite }, shadow: makeCardShadow() });
  slide.addText("Marges par modele", { x: 5.4, y: 1.3, w: 4, h: 0.4, fontSize: 14, fontFace: "Calibri", bold: true, color: C.navyLight, margin: 0 });

  const margins = [
    { model: "Affiliation", margin: "100%", note: "(zero cout variable)" },
    { model: "Lead Gen", margin: "95%+", note: "(cout = hosting seul)" },
    { model: "SaaS Pro", margin: "90%+", note: "(Stripe 2.9% + support)" },
  ];

  margins.forEach((m, i) => {
    const yPos = 1.9 + i * 0.9;
    slide.addText(m.model, { x: 5.5, y: yPos, w: 2.5, h: 0.3, fontSize: 12, fontFace: "Calibri", bold: true, color: C.navyLight, margin: 0 });
    slide.addText(m.margin, { x: 8.2, y: yPos, w: 1.2, h: 0.3, fontSize: 16, fontFace: "Georgia", bold: true, color: C.green, align: "right", margin: 0 });
    slide.addText(m.note, { x: 5.5, y: yPos + 0.3, w: 3.8, h: 0.25, fontSize: 9, fontFace: "Calibri", color: C.grayMid, margin: 0 });
  });

  // Marge globale callout
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 4.0, w: 3.8, h: 0.9, fill: { color: C.greenLight } });
  slide.addText("Marge nette cible", { x: 5.7, y: 4.1, w: 3, h: 0.3, fontSize: 10, fontFace: "Calibri", color: C.green, margin: 0 });
  slide.addText("90%+", { x: 5.7, y: 4.35, w: 3, h: 0.45, fontSize: 28, fontFace: "Georgia", bold: true, color: C.green, margin: 0 });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — EQUIPE & AVANTAGE
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.white };

  slide.addText("Equipe & Avantages Cles", {
    x: 0.6, y: 0.4, w: 6, h: 0.6,
    fontSize: 32, fontFace: "Georgia", bold: true, color: C.navyLight, margin: 0,
  });

  // Founder
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.5, h: 2.5, fill: { color: C.offWhite }, shadow: makeCardShadow() });
  slide.addText("Fondateur", { x: 0.7, y: 1.3, w: 2, h: 0.35, fontSize: 12, fontFace: "Calibri", bold: true, color: C.blue, margin: 0 });
  slide.addText("Marwan Chamoun", { x: 0.7, y: 1.7, w: 4, h: 0.4, fontSize: 18, fontFace: "Georgia", bold: true, color: C.navyLight, margin: 0 });
  slide.addText([
    { text: "Entrepreneur multi-projets (5 societes actives)", options: { bullet: true, breakLine: true } },
    { text: "Expert technique (IA, SaaS, full-stack)", options: { bullet: true, breakLine: true } },
    { text: "Background commercial B2B (detection de gaz, HVAC)", options: { bullet: true, breakLine: true } },
    { text: "Primo-accedant lui-meme = connait le probleme", options: { bullet: true } },
  ], { x: 0.7, y: 2.2, w: 4.1, h: 1.4, fontSize: 10.5, fontFace: "Calibri", color: C.grayDark, margin: 0 });

  // Advantages
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.2, w: 4.3, h: 2.5, fill: { color: C.offWhite }, shadow: makeCardShadow() });
  slide.addText("Avantages structurels", { x: 5.5, y: 1.3, w: 3, h: 0.35, fontSize: 12, fontFace: "Calibri", bold: true, color: C.green, margin: 0 });
  slide.addText([
    { text: "Cout marginal quasi-nul (SaaS pur)", options: { bullet: true, breakLine: true } },
    { text: "SEO compound (contenu evergreen)", options: { bullet: true, breakLine: true } },
    { text: "Produit deja construit et deploye", options: { bullet: true, breakLine: true } },
    { text: "Multi-source de revenus des J1", options: { bullet: true, breakLine: true } },
    { text: "Effet reseau (plus de pros = meilleur service)", options: { bullet: true, breakLine: true } },
    { text: "Pas de stock, pas de logistique", options: { bullet: true } },
  ], { x: 5.5, y: 1.75, w: 3.9, h: 1.9, fontSize: 10.5, fontFace: "Calibri", color: C.grayDark, margin: 0 });

  // Moats
  slide.addText("Barrieres a l'entree (moats)", { x: 0.6, y: 4.0, w: 4, h: 0.35, fontSize: 14, fontFace: "Calibri", bold: true, color: C.navyLight, margin: 0 });

  const moats = [
    { title: "Data reglementaire", desc: "23 fichiers loi FR mis a jour (PTZ, DPE, HCSF, Lemoine)" },
    { title: "SEO first-mover", desc: "Contenu evergreen sur 750K requetes primo-accedants/an" },
    { title: "Network B2B", desc: "Plus de pros abonnes = plus de leads routes = plus de valeur" },
  ];

  moats.forEach((m, i) => {
    const xPos = 0.5 + i * 3.15;
    slide.addShape(pres.shapes.RECTANGLE, { x: xPos, y: 4.5, w: 3.0, h: 0.95, fill: { color: C.offWhite } });
    slide.addText(m.title, { x: xPos + 0.15, y: 4.55, w: 2.7, h: 0.3, fontSize: 11, fontFace: "Calibri", bold: true, color: C.blue, margin: 0 });
    slide.addText(m.desc, { x: xPos + 0.15, y: 4.85, w: 2.7, h: 0.55, fontSize: 9.5, fontFace: "Calibri", color: C.grayMid, margin: 0 });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — THE ASK (CLOSING)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.navy };

  // Decorative
  slide.addShape(pres.shapes.OVAL, { x: 7, y: -2, w: 6, h: 6, fill: { color: C.red, transparency: 88 } });
  slide.addShape(pres.shapes.OVAL, { x: -2, y: 3, w: 5, h: 5, fill: { color: C.blue, transparency: 90 } });

  slide.addText("Rejoignez l'aventure", {
    x: 0.8, y: 0.8, w: 8, h: 0.7,
    fontSize: 36, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
  });

  slide.addText("ImmoPilot cherche des partenaires strategiques pour accelerer sa croissance.", {
    x: 0.8, y: 1.6, w: 7, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.blueLight, margin: 0,
  });

  // What we need
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.3, w: 4, h: 2.6, fill: { color: C.white, transparency: 90 } });
  slide.addText("Ce qu'on cherche", { x: 1.0, y: 2.4, w: 3.5, h: 0.35, fontSize: 13, fontFace: "Calibri", bold: true, color: C.white, margin: 0 });
  slide.addText([
    { text: "Acceleration SEO & contenu (redacteurs, backlinks)", options: { bullet: true, breakLine: true } },
    { text: "Reseau de courtiers/pros pour tester le CPL", options: { bullet: true, breakLine: true } },
    { text: "Expertise growth / acquisition payante", options: { bullet: true, breakLine: true } },
    { text: "Financement initial pour scale (6-12 mois runway)", options: { bullet: true } },
  ], { x: 1.0, y: 2.85, w: 3.6, h: 1.8, fontSize: 11, fontFace: "Calibri", color: C.blueLight, margin: 0 });

  // What you get
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 2.3, w: 4.2, h: 2.6, fill: { color: C.white, transparency: 90 } });
  slide.addText("Ce qu'on offre", { x: 5.4, y: 2.4, w: 3.5, h: 0.35, fontSize: 13, fontFace: "Calibri", bold: true, color: C.white, margin: 0 });
  slide.addText([
    { text: "Produit deja construit et deploye (pas un MVP)", options: { bullet: true, breakLine: true } },
    { text: "Marges 90%+ (SaaS pur, pas de logistique)", options: { bullet: true, breakLine: true } },
    { text: "Marche de 750K primo-accedants/an", options: { bullet: true, breakLine: true } },
    { text: "3 sources de revenus complementaires", options: { bullet: true, breakLine: true } },
    { text: "Scalable a l'international (Belgique, Suisse)", options: { bullet: true } },
  ], { x: 5.4, y: 2.85, w: 3.8, h: 1.8, fontSize: 11, fontFace: "Calibri", color: C.blueLight, margin: 0 });

  // Contact
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 5.1, w: 8.4, h: 0.4, fill: { color: C.white, transparency: 85 } });
  slide.addText("Contact : marwan@immopilot.fr  |  immopilot.fr", {
    x: 0.8, y: 5.12, w: 8.4, h: 0.38,
    fontSize: 12, fontFace: "Calibri", bold: true, color: C.white, align: "center", margin: 0,
  });
}

// ─── GENERATE ───────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "C:/1- Marwan/Claude/27_IMMOPILOT/docs/ImmoPilot-Pitch-Investisseurs.pptx" })
  .then(() => console.log("OK: ImmoPilot-Pitch-Investisseurs.pptx generated"))
  .catch((err) => console.error("ERROR:", err));
