import Link from "next/link";
import { ETAPES } from "@/lib/constants";
import type { EtapeNumber } from "@/lib/types";

interface StepNavProps {
  etapeCourante: EtapeNumber;
}

export function StepNav({ etapeCourante }: StepNavProps) {
  const prev = ETAPES.find((e) => e.numero === ((etapeCourante - 1) as EtapeNumber));
  const next = ETAPES.find((e) => e.numero === ((etapeCourante + 1) as EtapeNumber));
  return (
    <div className="mt-8 flex justify-between">
      {prev ? (
        <Link href={`/parcours/${prev.slug}`} className="text-sm text-gray-500 hover:text-[var(--bleu-secondaire)]">&larr; {prev.titre}</Link>
      ) : <span />}
      {next ? (
        <Link href={`/parcours/${next.slug}`} className="rounded-lg bg-[var(--bleu-secondaire)] px-6 py-2 text-sm font-semibold text-white hover:opacity-90">{next.titre} &rarr;</Link>
      ) : (
        <span className="rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white">Parcours termine</span>
      )}
    </div>
  );
}
