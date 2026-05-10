import Link from "next/link";
import { ETAPES } from "@/lib/constants";
import { FranceMap } from "@/components/ui/france-map";

// ─── Data ────────────────────────────────────────────────────────────────────

const CHIFFRES_CLES = [
  { valeur: "35%", label: "Taux d'endettement max", detail: "Regle HCSF depuis 2022" },
  { valeur: "7-8%", label: "Frais de notaire (ancien)", detail: "2-3% dans le neuf" },
  { valeur: "180 000 EUR", label: "PTZ max en 2026", detail: "73% des Francais eligibles" },
  { valeur: "12 000 EUR", label: "Economie assurance", detail: "Loi Lemoine — delegation" },
] as const;

const QUESTIONS_FREQUENTES = [
  "Combien puis-je emprunter avec mon salaire ?",
  "Suis-je eligible au PTZ 2026 ?",
  "Combien coutent les frais de notaire ?",
  "Comment negocier le prix d'un appartement ?",
  "Quels diagnostics sont obligatoires ?",
  "Peut-on acheter sans apport ?",
] as const;

const PILIERS = [
  {
    icone: "📐",
    titre: "Calculez vos chiffres",
    detail: "Credit, endettement, PTZ, frais de notaire — vos vrais chiffres en 30 secondes.",
    href: "/outils",
  },
  {
    icone: "🗺️",
    titre: "Suivez le parcours",
    detail: "10 etapes de A a Z : du budget a la remise des cles. Rien n'est oublie.",
    href: "/parcours",
  },
  {
    icone: "⚠️",
    titre: "Evitez les pieges",
    detail: "Alertes DPE, clauses suspectes, delais legaux — on vous previent quand ca compte.",
    href: "/parcours/4-recherche",
  },
] as const;

const OUTILS = [
  { titre: "Simulateur de credit", sousTitre: "Mensualites, cout total, interets", href: "/outils/simulateur-credit-immobilier", cta: "Simuler mon credit" },
  { titre: "Frais de notaire", sousTitre: "Ancien ou neuf — detail complet", href: "/outils/frais-de-notaire", cta: "Calculer mes frais" },
  { titre: "Eligibilite PTZ", sousTitre: "Zone, revenus, montant", href: "/outils/eligibilite-ptz", cta: "Verifier mon PTZ" },
] as const;

const SOURCES = [
  { nom: "ANIL", role: "Agence Nationale d'Information sur le Logement" },
  { nom: "service-public.fr", role: "Portail officiel de l'administration" },
  { nom: "notaires.fr", role: "Conseil superieur du notariat" },
  { nom: "LegiFrance", role: "Textes de loi en vigueur" },
] as const;

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#1a365d] py-20 md:py-28">
        {/* Decorative blobs */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#c1272d] opacity-[0.04] blur-[100px]" />
        <div className="absolute -bottom-20 right-1/4 h-[400px] w-[400px] rounded-full bg-[#2563eb] opacity-[0.06] blur-[80px]" />

        {/* France map */}
        <div className="absolute right-[2%] top-[50%] -translate-y-1/2 pointer-events-none hidden lg:block">
          <FranceMap className="h-[520px] w-[520px]" variant="dark" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-12">
            {/* Left — Copy */}
            <div className="max-w-xl flex-shrink-0">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[var(--vert-succes)] animate-pulse" />
                <span className="text-xs font-semibold text-white/70">Guide gratuit &middot; Mis a jour 2026</span>
              </div>

              <h1 className="mb-5 text-4xl font-extrabold leading-[1.1] text-white md:text-[3.2rem]">
                Votre premier achat<br />
                immobilier en France,<br />
                <span className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] bg-clip-text text-transparent">sans rien louper.</span>
              </h1>
              <p className="mb-8 max-w-lg text-base leading-relaxed text-blue-200/70">
                73% des Francais sont eligibles au PTZ sans le savoir. Calculez votre
                capacite, verifiez vos aides, suivez les 10 etapes — de la simulation
                a la remise des cles.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/parcours"
                  className="group rounded-xl bg-[var(--rouge-fr)] px-9 py-4 text-base font-bold text-white shadow-lg shadow-red-900/30 hover:shadow-xl hover:shadow-red-900/50 hover:brightness-110 transition-all"
                >
                  Simuler mon projet <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link>
                <Link
                  href="/outils/simulateur-credit-immobilier"
                  className="rounded-xl border-2 border-white/25 px-7 py-3.5 text-sm font-semibold text-white/90 hover:bg-white hover:text-[var(--bleu-marine)] transition-all"
                >
                  Calculer ma capacite
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-5 text-xs text-blue-300/50">
                <span>&#10003; Aucun compte requis</span>
                <span>&#10003; Donnees locales</span>
                <span>&#10003; 100% gratuit</span>
              </div>
            </div>

            {/* Right — Floating product preview (hidden on mobile/tablet) */}
            <div className="hidden xl:block flex-1">
              <div className="relative ml-8">
                {/* Mini dashboard card */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur-md shadow-2xl">
                  <p className="mb-4 text-sm font-bold text-white/80">Votre tableau de bord</p>

                  {/* Mini KPIs */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-[10px] text-blue-300/60">Budget</p>
                      <p className="text-lg font-extrabold text-white">250 000 &euro;</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-[10px] text-blue-300/60">Capacite</p>
                      <p className="text-lg font-extrabold text-[#60a5fa]">230 000 &euro;</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-[10px] text-blue-300/60">PTZ</p>
                      <p className="text-lg font-extrabold text-[var(--vert-succes)]">67 500 &euro;</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-[10px] text-blue-300/60">Mensualite</p>
                      <p className="text-lg font-extrabold text-white">1 160 &euro;</p>
                    </div>
                  </div>

                  {/* Mini stepper */}
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5,6,7,8].map((n) => (
                      <div key={n} className="flex flex-1 items-center">
                        <div className={`h-5 w-5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                          n <= 2 ? "bg-[var(--vert-succes)] text-white" : n === 3 ? "bg-[#60a5fa] text-white" : "bg-white/10 text-white/40"
                        }`}>{n <= 2 ? "\u2713" : n}</div>
                        {n < 8 && <div className={`mx-0.5 h-0.5 flex-1 ${n <= 2 ? "bg-[var(--vert-succes)]/50" : "bg-white/10"}`} />}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] text-blue-300/50">Etape 3 sur 10 — Premier feu vert bancaire</p>

                  {/* Verdict badge */}
                  <div className="mt-3 rounded-lg bg-[var(--vert-succes)]/15 border border-[var(--vert-succes)]/20 px-3 py-2">
                    <p className="text-xs font-semibold text-[var(--vert-succes)]">&#10003; Projet financable — excedent de 47 500 &euro;</p>
                  </div>
                </div>

                {/* Floating alert card */}
                <div className="absolute -bottom-6 -left-8 rounded-xl border border-white/10 bg-[#1e293b] px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">&#9888;&#65039;</span>
                    <div>
                      <p className="text-xs font-semibold text-orange-300">DPE F detecte</p>
                      <p className="text-[10px] text-white/40">Rue Garibaldi — travaux a prevoir</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chiffres cles — floating cards ──────────────────────────────── */}
      <section className="-mt-8 relative z-10 pb-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {CHIFFRES_CLES.map((c) => (
              <div key={c.label} className="rounded-2xl border border-[var(--gris-border)] bg-white p-5 text-center shadow-md">
                <p className="text-2xl font-extrabold text-[var(--bleu-marine)] md:text-3xl">{c.valeur}</p>
                <p className="mt-1 text-sm font-semibold text-gray-700">{c.label}</p>
                <p className="text-[11px] text-gray-400">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Questions qu'on se pose ────────────────────────────────────── */}
      <section className="bg-[var(--gris-fond)] py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-center text-2xl font-extrabold text-[var(--bleu-marine)]">
            Vous vous posez ces questions ?
          </h2>
          <p className="mb-8 text-center text-sm text-gray-500">Nous aussi, on se les est posees. Et on y repond.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {QUESTIONS_FREQUENTES.map((q) => (
              <span
                key={q}
                className="rounded-full border border-[var(--gris-border)] bg-white px-5 py-2.5 text-sm text-gray-700 shadow-sm"
              >
                {q}
              </span>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/parcours" className="text-sm font-semibold text-[var(--bleu-action)] hover:underline">
              Trouvez les reponses dans le parcours &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* ── 3 Piliers ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-2xl font-extrabold text-[var(--bleu-marine)]">
            Comment ImmoPilot vous aide
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PILIERS.map((p) => (
              <Link
                key={p.titre}
                href={p.href}
                className="group card-elevated bg-white hover-lift"
              >
                <div className="mb-3 text-3xl">{p.icone}</div>
                <h3 className="mb-2 text-lg font-bold text-[var(--bleu-marine)] group-hover:text-[var(--bleu-action)]">
                  {p.titre}
                </h3>
                <p className="text-sm text-gray-600">{p.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Les 10 etapes ───────────────────────────────────────────────── */}
      <section className="bg-[var(--gris-fond)] py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold text-[var(--bleu-marine)]">
              Du projet aux cles : 10 etapes
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Chaque etape contient des outils, des conseils, des alertes et une checklist.
            </p>
          </div>

          {/* Timeline vertical on mobile, grid on desktop */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPES.map((etape) => (
              <Link
                key={etape.slug}
                href={`/parcours/${etape.slug}`}
                className="group flex items-start gap-3 rounded-xl border border-[var(--gris-border)] bg-white p-4 shadow-sm transition hover:border-[var(--bleu-action)] hover:shadow-md"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--bleu-marine)] text-sm font-bold text-white group-hover:bg-[var(--bleu-action)] transition-colors">
                  {etape.numero}
                </span>
                <div>
                  <p className="text-sm font-bold text-[var(--bleu-marine)] group-hover:text-[var(--bleu-action)]">
                    {etape.titre}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{etape.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outils gratuits ────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-center text-2xl font-extrabold text-[var(--bleu-marine)]">
            Vos calculs en 30 secondes
          </h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            Pas besoin de rendez-vous. Simulez, comparez, decidez.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {OUTILS.map((o) => (
              <Link
                key={o.href}
                href={o.href}
                className="group flex flex-col rounded-xl border border-[var(--gris-border)] bg-[var(--gris-fond)] p-5 transition hover:border-[var(--rouge-fr)] hover:shadow-md"
              >
                <h3 className="font-bold text-[var(--bleu-marine)]">{o.titre}</h3>
                <p className="mt-1 flex-1 text-sm text-gray-600">{o.sousTitre}</p>
                <span className="mt-4 text-sm font-semibold text-[var(--rouge-fr)] group-hover:underline">
                  {o.cta} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sources officielles ─────────────────────────────────────────── */}
      <section className="border-y border-[var(--gris-border)] bg-[var(--gris-fond)] py-10">
        <div className="mx-auto max-w-4xl px-4">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
            Nos conseils sont bases sur des sources officielles
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SOURCES.map((s) => (
              <div key={s.nom} className="text-center">
                <p className="text-sm font-bold text-[var(--bleu-marine)]">{s.nom}</p>
                <p className="text-[11px] text-gray-400">{s.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pour qui ───────────────────────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-[var(--bleu-marine)]">
            ImmoPilot, c&apos;est pour vous si...
          </h2>
          <div className="space-y-3">
            {[
              "Vous achetez pour la premiere fois en France",
              "Vous voulez comprendre votre capacite d'emprunt avant de visiter",
              "Vous cherchez un outil neutre — pas un courtier qui veut vous vendre",
              "Vous voulez etre sur de ne rien oublier (diagnostics, clauses, delais legaux)",
              "Vous avez trouve un bien et vous voulez savoir si le prix est correct",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl bg-[var(--gris-fond)] px-5 py-3.5">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--vert-succes)] text-xs text-white">&#10003;</span>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ──────────────────────────────────────────────────── */}
      <section className="px-4 pb-12">
        <div className="card-hero mx-auto max-w-4xl">
          <div className="py-12 text-center">
            <h2 className="mb-3 text-2xl font-extrabold text-white md:text-3xl">
              Pret a acheter en toute confiance ?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-base text-blue-200">
              Rejoignez les primo-accedants qui font leur projet sans stress.
              Gratuit, sans compte, vos donnees restent chez vous.
            </p>
            <Link
              href="/parcours"
              className="inline-block rounded-xl bg-white px-10 py-4 text-lg font-bold text-[var(--bleu-marine)] shadow-lg hover:shadow-xl hover:opacity-95 transition-all"
            >
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
