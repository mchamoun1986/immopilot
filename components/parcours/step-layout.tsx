'use client';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { loadProjet, saveProjet, createEmptyProjet } from "@/lib/storage";
import { getProjectSummary, getCompletedSteps } from "@/lib/selectors";
import { StepperHorizontal } from "@/components/ui/stepper";
import { StepNav } from "@/components/parcours/step-nav";
import { ProjectSidebar } from "@/components/parcours/project-sidebar";
import { TabsContainer } from "@/components/ui/tabs";
import type { ProjetImmobilier, EtapeNumber } from "@/lib/types";
import { ETAPES } from "@/lib/constants";
import { AffiliateLink } from "@/components/ui/affiliate-link";
import { getBandeauForEtape } from "@/lib/data/bandeaux-intro";
import { getContactsForEtape } from "@/lib/data/contacts-par-etape";

export interface TipData {
  type: "economie" | "attention" | "danger" | "astuce";
  titre: string;
  detail: string;
}

export interface StepLayoutProps {
  etape: EtapeNumber;
  guide: React.ReactNode;
  outils?: React.ReactNode;
  tips?: TipData[];
  checklist?: string[];
  children?: React.ReactNode;
}

const TIP_STYLES: Record<TipData["type"], { border: string; bg: string; icon: string }> = {
  economie: { border: "border-l-green-500", bg: "bg-green-50", icon: "💰" },
  attention: { border: "border-l-orange-500", bg: "bg-orange-50", icon: "⚠️" },
  danger: { border: "border-l-red-500", bg: "bg-red-50", icon: "🚨" },
  astuce: { border: "border-l-blue-500", bg: "bg-blue-50", icon: "💡" },
};

export function StepLayout({ etape, guide, outils, tips, checklist, children }: StepLayoutProps) {
  const router = useRouter();
  const [projet, setProjet] = useState<ProjetImmobilier | null>(null);
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    const p = loadProjet() ?? createEmptyProjet();
    setProjet(p);
    if (checklist) {
      const saved = p.checklists?.[etape];
      setChecked(saved && saved.length === checklist.length ? saved : new Array(checklist.length).fill(false));
    }
  }, [etape, checklist]);

  const toggleCheck = (idx: number) => {
    const next = checked.map((v, i) => (i === idx ? !v : v));
    setChecked(next);
    // Reload fresh project to avoid overwriting concurrent edits
    const fresh = loadProjet();
    if (fresh) {
      const updated = { ...fresh, checklists: { ...fresh.checklists, [etape]: next } };
      setProjet(updated);
      saveProjet(updated);
    }
  };

  const completedSteps = useMemo(() => projet ? getCompletedSteps(projet) : [], [projet]);
  const summary = useMemo(() => projet ? getProjectSummary(projet) : null, [projet]);
  const checkedCount = useMemo(() => checked.filter(Boolean).length, [checked]);
  const etapeDef = useMemo(() => ETAPES.find((e) => e.numero === etape), [etape]);
  const bandeau = useMemo(() => getBandeauForEtape(etape), [etape]);
  const contacts = useMemo(() => getContactsForEtape(etape), [etape]);
  const checklistPct = checklist && checklist.length > 0 ? (checkedCount / checklist.length) * 100 : 0;

  const tabs = useMemo(() => [
    { id: "outils", label: "Outils", keepMounted: true },
    { id: "guide", label: "Guide", keepMounted: true },
    { id: "conseils", label: "Conseils", keepMounted: false },
    ...(checklist ? [{ id: "checklist", label: "Checklist", badge: checkedCount, keepMounted: false }] : []),
    ...(contacts.length > 0 ? [{ id: "contacts", label: "Contacts", keepMounted: false }] : []),
  ], [checklist, checkedCount, contacts.length]);

  if (!projet) {
    return (
      <div role="status" aria-label="Chargement en cours" className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--bleu-action)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <StepperHorizontal
        completedSteps={completedSteps}
        currentStep={etape}
        onStepClick={(n) => {
          const e = ETAPES.find((e) => e.numero === n);
          if (e) router.push(`/parcours/${e.slug}`);
        }}
      />

      <h1 className="mb-1 text-2xl font-bold text-[var(--bleu-marine)]">
        {etapeDef?.titre}
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        {etapeDef?.description}
      </p>

      {/* Bandeau intro */}
      {bandeau && (
        <div className="mb-6 rounded-xl bg-[var(--gris-fond)] px-5 py-4">
          <p className="text-sm text-gray-700">
            Dans cette étape, vous allez <strong className="text-[var(--bleu-marine)]">{bandeau.objectif}</strong>.
          </p>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>Entrée : {bandeau.entree}</span>
            <span className="text-gray-300">&rarr;</span>
            <span>Sortie : <strong className="text-[var(--bleu-marine)]">{bandeau.sortie}</strong></span>
          </div>
        </div>
      )}

      {/* Mobile: summary bandeau above tabs */}
      <div className="mb-4 lg:hidden">
        {summary && <ProjectSidebar summary={summary} />}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <TabsContainer tabs={tabs} defaultTab="outils">
            {(activeTab) => (
              <>
                {activeTab === "outils" && (
                  <div className="space-y-6">
                    {outils}
                    {children}
                  </div>
                )}

                {activeTab === "guide" && (
                  <div className="card-flat border-blue-200 bg-blue-50">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-blue-600">ℹ️</span>
                      <div className="text-sm text-blue-900">{guide}</div>
                    </div>
                  </div>
                )}

                {activeTab === "conseils" && tips && tips.length > 0 && (
                  <div className="space-y-3">
                    {tips.map((tip, i) => {
                      const s = TIP_STYLES[tip.type];
                      return (
                        <div key={i} className={`border-l-4 rounded-r-xl p-3 ${s.border} ${s.bg}`}>
                          <div className="flex items-start gap-2">
                            <span aria-hidden="true">{s.icon}</span>
                            <div>
                              <p className="text-sm font-semibold">{tip.titre}</p>
                              <p className="mt-0.5 text-sm text-gray-700">{tip.detail}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "checklist" && checklist && (
                  <div className="space-y-2">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-[var(--vert-succes)] transition-all duration-300"
                          style={{ width: `${checklistPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-500">{checkedCount}/{checklist.length}</span>
                    </div>
                    {checklist.map((item, i) => (
                      <div key={item} className="flex cursor-pointer items-center gap-3">
                        <button
                          onClick={() => toggleCheck(i)}
                          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                            checked[i]
                              ? "border-[var(--vert-succes)] bg-[var(--vert-succes)] text-white"
                              : "border-gray-300 bg-white"
                          }`}
                          aria-label={checked[i] ? "Démarquer" : "Marquer comme fait"}
                        >
                          {checked[i] && (
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                            </svg>
                          )}
                        </button>
                        <span className={`text-sm ${checked[i] ? "text-gray-400 line-through" : "text-gray-700"}`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "contacts" && contacts.length > 0 && (
                  <div className="space-y-3">
                    {(["officiel", "professionnel", "comparateur", "portail"] as const).map((cat) => {
                      const items = contacts.filter((c) => c.categorie === cat);
                      if (items.length === 0) return null;
                      const catLabels = { officiel: "Sources officielles", professionnel: "Professionnels", comparateur: "Comparateurs", portail: "Portails" };
                      return (
                        <div key={cat}>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{catLabels[cat]}</p>
                          <div className="space-y-2">
                            {items.map((c) => (
                              <div key={c.nom} className="flex items-start justify-between rounded-lg bg-[var(--gris-fond)] px-4 py-3">
                                <div>
                                  <p className="text-sm font-semibold text-[var(--bleu-marine)]">{c.nom}</p>
                                  <p className="text-xs text-gray-500">{c.description}</p>
                                </div>
                                <div className="flex flex-shrink-0 items-center gap-2">
                                  {c.gratuit && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">Gratuit</span>}
                                  {c.url && (
                                    <AffiliateLink
                                      href={c.url}
                                      affiliateUrl={c.affiliate_url}
                                      source={c.nom}
                                      etape={etape}
                                      className="text-xs font-semibold text-[var(--bleu-action)] hover:underline"
                                      aria-label={`Ouvrir ${c.nom}`}
                                    >
                                      Ouvrir &rarr;
                                    </AffiliateLink>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </TabsContainer>

          {checklist && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-[var(--gris-fond)] px-4 py-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[var(--vert-succes)]"
                  style={{ width: `${checklistPct}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-500">{checkedCount}/{checklist.length}</span>
            </div>
          )}

          <StepNav etapeCourante={etape} />
        </div>

        {/* Desktop sidebar only — mobile bandeau is above tabs */}
        <aside className="hidden w-72 flex-shrink-0 lg:block">
          {summary && <ProjectSidebar summary={summary} desktopOnly />}
        </aside>
      </div>
    </div>
  );
}
