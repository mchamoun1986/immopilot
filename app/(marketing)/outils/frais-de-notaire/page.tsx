"use client";

import { useState } from "react";
import Link from "next/link";
import { calculerFraisNotaire } from "@/lib/calculateurs/notaire";
import { fmt } from "@/lib/utils/format";

function fmtPctDetailed(n: number): string {
  return (n * 100).toFixed(2) + " %";
}

const FAQ = [
  {
    question: "Combien coutent les frais de notaire en 2026 ?",
    answer:
      "Pour un bien ancien, les frais de notaire representent environ 7 a 8% du prix de vente. Pour un bien neuf, ils sont reduits : entre 2 et 3%. Ces frais comprennent les droits de mutation, les emoluments du notaire, les debours et la contribution de securite immobiliere.",
  },
  {
    question: "Quelle est la difference entre frais ancien et frais neuf ?",
    answer:
      "Dans l\u2019ancien, les droits de mutation (aussi appeles droits d\u2019enregistrement) s\u2019elevent a environ 5,8% du prix. Dans le neuf, ils sont reduits a 0,715%, ce qui explique des frais globaux bien inferieurs. En contrepartie, la TVA (20%) est incluse dans le prix de vente dans le neuf.",
  },
  {
    question: "Les frais de notaire sont-ils negotiables ?",
    answer:
      "Les emoluments du notaire sont reglementes par l\u2019Etat et fixes par decret. Ils ne sont donc pas negotiables. En revanche, pour les transactions superieures a 150 000 EUR, une remise maximale de 20% sur les emoluments peut etre consentie. Les droits de mutation, eux, sont des taxes fiscales non negotiables.",
  },
  {
    question: "Peut-on financer les frais de notaire avec le credit ?",
    answer:
      "Certaines banques acceptent de financer les frais de notaire dans le credit (on parle de \u00abpret a 110%\u00bb). Cela necessite generalement un dossier solide et evite d\u2019avoir a mobiliser de l\u2019apport personnel uniquement pour ces frais. Renseignez-vous aupres de votre conseiller ou courtier.",
  },
] as const;

export default function FraisNotairePage() {
  const [prix, setPrix] = useState(250000);
  const [type, setType] = useState<"ancien" | "neuf">("ancien");

  const result = calculerFraisNotaire(prix, type);
  const hasResult = prix > 0;
  const tauxTotal = prix > 0 ? result.total / prix : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--rouge-francais)]">
          Outil gratuit
        </p>
        <h1 className="mb-3 text-3xl font-extrabold text-[var(--bleu-marine)] md:text-4xl">
          Calculateur frais de notaire
        </h1>
        <p className="text-gray-600">
          Estimez les frais de notaire pour un bien ancien ou neuf avec le detail complet.
        </p>
      </div>

      {/* Calculator card */}
      <div className="rounded-xl border border-[var(--gris-border)] bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-semibold text-[var(--bleu-marine)]">Vos parametres</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Prix */}
          <div>
            <label
              htmlFor="fn-prix"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Prix du bien (EUR)
            </label>
            <input
              id="fn-prix"
              type="number"
              min={0}
              step={1000}
              value={prix}
              onChange={(e) => setPrix(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label
              htmlFor="fn-type"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Type de bien
            </label>
            <select
              id="fn-type"
              value={type}
              onChange={(e) => setType(e.target.value as "ancien" | "neuf")}
              className="w-full rounded-lg border border-[var(--gris-border)] px-3 py-2 text-sm focus:border-[var(--bleu-secondaire)] focus:outline-none"
            >
              <option value="ancien">Bien ancien (7 a 8% de frais)</option>
              <option value="neuf">Bien neuf / VEFA (2 a 3% de frais)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {hasResult && (
          <>
            {/* Total highlight */}
            <div className="mt-6 rounded-lg bg-[var(--bleu-marine)] p-5 text-center text-white">
              <p className="text-sm opacity-80">Frais de notaire estimes</p>
              <p className="mt-1 text-4xl font-extrabold">{fmt(result.total)} EUR</p>
              <p className="mt-1 text-sm opacity-70">soit {fmtPctDetailed(tauxTotal)} du prix de vente</p>
            </div>

            {/* Detail */}
            <div className="mt-5 space-y-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Detail
              </p>
              <div className="flex justify-between rounded-lg bg-[var(--gris-clair)] px-4 py-3 text-sm">
                <span className="text-gray-600">
                  Droits de mutation{" "}
                  <span className="text-xs text-gray-400">
                    ({type === "ancien" ? "~5,8%" : "~0,715%"})
                  </span>
                </span>
                <span className="font-semibold">{fmt(result.droits_mutation)} EUR</span>
              </div>
              <div className="flex justify-between rounded-lg bg-[var(--gris-clair)] px-4 py-3 text-sm">
                <span className="text-gray-600">Emoluments du notaire</span>
                <span className="font-semibold">{fmt(result.emoluments)} EUR</span>
              </div>
              <div className="flex justify-between rounded-lg bg-[var(--gris-clair)] px-4 py-3 text-sm">
                <span className="text-gray-600">Debours forfaitaires</span>
                <span className="font-semibold">{fmt(result.debours)} EUR</span>
              </div>
              <div className="flex justify-between rounded-lg bg-[var(--gris-clair)] px-4 py-3 text-sm">
                <span className="text-gray-600">Contribution de securite immobiliere</span>
                <span className="font-semibold">{fmt(result.contribution_securite)} EUR</span>
              </div>
              <div className="flex justify-between rounded-lg border border-[var(--bleu-marine)] bg-[var(--bleu-marine)] px-4 py-3 text-sm font-bold text-white">
                <span>TOTAL</span>
                <span>{fmt(result.total)} EUR</span>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-gray-400">
              Estimation indicative. Les montants exacts peuvent varier selon la commune et les
              specificites du dossier.
            </p>
          </>
        )}
      </div>

      {/* CTA parcours */}
      <div className="mt-8 rounded-xl border border-[var(--bleu-secondaire)] bg-white p-6 text-center">
        <p className="mb-1 font-semibold text-[var(--bleu-marine)]">
          Vous souhaitez aller plus loin ?
        </p>
        <p className="mb-4 text-sm text-gray-600">
          Notre parcours complet integre les frais de notaire dans le calcul de votre budget total
          et vous guide jusqu&apos;a la signature.
        </p>
        <Link
          href="/parcours"
          className="inline-block rounded-lg bg-[var(--rouge-francais)] px-7 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Demarrer mon parcours
        </Link>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-extrabold text-[var(--bleu-marine)]">
          Questions frequentes
        </h2>
        <div className="space-y-5">
          {FAQ.map((item) => (
            <div
              key={item.question}
              className="rounded-lg border border-[var(--gris-border)] bg-white p-5"
            >
              <h3 className="mb-2 font-semibold text-[var(--bleu-marine)]">{item.question}</h3>
              <p className="text-sm text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
