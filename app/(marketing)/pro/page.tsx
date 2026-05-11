'use client';

import { useState } from "react";

const PRO_STORAGE_KEY = "immopilot_pro_interests";

const TYPES_PRO = [
  "Courtier en credit",
  "Agent immobilier",
  "Diagnostiqueur",
  "Assureur (emprunteur/MRH)",
  "Notaire",
  "Déménageur",
  "Autre",
] as const;

const ETAPES_COMMENT_CA_MARCHE = [
  { numero: "1", titre: "L'acheteur utilise nos outils gratuits", detail: "Calculateur crédit, PTZ, frais de notaire, parcours en 10 étapes, alertes DPE..." },
  { numero: "2", titre: "Il accepte d'être mis en relation", detail: "Consentement explicite RGPD — l'acheteur choisit de partager ses coordonnées." },
  { numero: "3", titre: "Vous recevez le lead avec son projet", detail: "Budget, zone, étape du parcours, contact — un lead qualifié, prêt à être rappelé." },
] as const;

const KPIS = [
  { valeur: "750 000", label: "Primo-accedants / an en France" },
  { valeur: "10 étapes", label: "Parcours complet couvert" },
  { valeur: "12 catégories", label: "De professionnels concernés" },
  { valeur: "Lead qualifié", label: "Budget + zone + étape + consent" },
] as const;

const TIERS = [
  { nom: "Starter", prix: "49", leads: "5", visibilite: "Annuaire", zone: "1 département", stats: "Basiques", popular: false },
  { nom: "Business", prix: "199", leads: "20", visibilite: "Annuaire + badge", zone: "3 départements", stats: "Détaillées", popular: true },
  { nom: "Premium", prix: "499", leads: "Illimité", visibilite: "Priorité + badge", zone: "National", stats: "Temps réel", popular: false },
] as const;

export default function ProPage() {
  const [form, setForm] = useState({
    nom: "", entreprise: "", email: "", telephone: "", type_pro: "", departement: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.type_pro) return;

    const existing = JSON.parse(localStorage.getItem(PRO_STORAGE_KEY) || "[]");
    existing.push({ ...form, date: new Date().toISOString() });
    localStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(existing));
    setSubmitted(true);
  };

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const inputCls = "w-full rounded-xl border border-[var(--gris-border)] px-4 py-2.5 text-sm focus:border-[var(--bleu-action)] focus:outline-none";

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#1a365d] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mb-4 inline-block rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-semibold text-white/70">
            Espace Professionnels
          </p>
          <h1 className="mb-5 text-3xl font-extrabold text-white md:text-4xl">
            Recevez des leads qualifiés<br />
            <span className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] bg-clip-text text-transparent">dans votre zone</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-blue-200/70">
            ImmoPilot guide les primo-accédants de A à Z. Quand ils cherchent un courtier,
            un diagnostiqueur ou un assureur — on vous les envoie.
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section className="-mt-8 relative z-10 pb-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {KPIS.map((k) => (
              <div key={k.label} className="rounded-2xl border border-[var(--gris-border)] bg-white p-5 text-center shadow-md">
                <p className="text-xl font-extrabold text-[var(--bleu-marine)]">{k.valeur}</p>
                <p className="mt-1 text-xs text-gray-500">{k.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ca marche */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-[var(--bleu-marine)]">Comment ça marche</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {ETAPES_COMMENT_CA_MARCHE.map((e) => (
              <div key={e.numero} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bleu-action)] text-lg font-bold text-white">
                  {e.numero}
                </div>
                <h3 className="mb-2 font-bold text-[var(--bleu-marine)]">{e.titre}</h3>
                <p className="text-sm text-gray-600">{e.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grille tarifaire */}
      <section className="bg-[var(--gris-fond)] py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-[var(--bleu-marine)]">Tarifs</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.nom}
                className={`relative rounded-2xl border bg-white p-6 shadow-sm ${
                  t.popular ? "border-[var(--bleu-action)] ring-2 ring-[var(--bleu-action)]/20" : "border-[var(--gris-border)]"
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--bleu-action)] px-4 py-1 text-xs font-bold text-white">
                    Populaire
                  </span>
                )}
                <h3 className="text-lg font-bold text-[var(--bleu-marine)]">{t.nom}</h3>
                <p className="mt-2">
                  <span className="text-3xl font-extrabold text-[var(--bleu-marine)]">{t.prix}</span>
                  <span className="text-sm text-gray-500"> EUR/mois</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><span className="text-[var(--vert-succes)]">&#10003;</span> {t.leads} leads/mois</li>
                  <li className="flex items-center gap-2"><span className="text-[var(--vert-succes)]">&#10003;</span> {t.visibilite}</li>
                  <li className="flex items-center gap-2"><span className="text-[var(--vert-succes)]">&#10003;</span> {t.zone}</li>
                  <li className="flex items-center gap-2"><span className="text-[var(--vert-succes)]">&#10003;</span> Stats {t.stats.toLowerCase()}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire d'interet */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="mb-2 text-center text-2xl font-extrabold text-[var(--bleu-marine)]">Intéressé ?</h2>
          <p className="mb-8 text-center text-sm text-gray-500">Laissez vos coordonnées — on vous recontacte sous 48h.</p>

          {submitted ? (
            <div className="rounded-2xl border border-green-300 bg-green-50 p-8 text-center">
              <p className="text-lg font-bold text-green-800">Merci !</p>
              <p className="mt-2 text-sm text-green-700">Nous vous recontacterons sous 48h.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nom *</label>
                  <input className={inputCls} value={form.nom} onChange={(e) => updateField("nom", e.target.value)} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Entreprise</label>
                  <input className={inputCls} value={form.entreprise} onChange={(e) => updateField("entreprise", e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                  <input type="email" className={inputCls} value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Téléphone</label>
                  <input type="tel" className={inputCls} value={form.telephone} onChange={(e) => updateField("telephone", e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Type de professionnel *</label>
                  <select className={inputCls} value={form.type_pro} onChange={(e) => updateField("type_pro", e.target.value)} required>
                    <option value="">Sélectionnez...</option>
                    {TYPES_PRO.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Département</label>
                  <input className={inputCls} value={form.departement} onChange={(e) => updateField("departement", e.target.value)} placeholder="Ex. 69, 75, 13" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--rouge-fr)] px-6 py-3 text-base font-bold text-white shadow hover:opacity-90 transition"
              >
                Recevoir les détails
              </button>
              <p className="text-center text-[10px] text-gray-400">
                Vos données sont stockées localement et ne sont pas partagées sans votre accord.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
