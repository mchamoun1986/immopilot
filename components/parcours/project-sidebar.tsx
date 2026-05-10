'use client';

import { useState } from "react";
import type { ProjectSummary } from "@/lib/selectors";
import { fmt, fmtPct } from "@/lib/utils/format";
import { VerdictBanner } from "@/components/ui/verdict-banner";

interface ProjectSidebarProps {
  summary: ProjectSummary;
}

export function ProjectSidebar({ summary }: ProjectSidebarProps) {
  const [collapsed, setCollapsed] = useState(true);

  const verdictLabel = summary.verdict === "financable"
    ? "Financable"
    : summary.verdict === "depassement"
      ? "Depassement"
      : "Incomplet";

  const items = [
    { label: "Budget", value: `${fmt(summary.budget)} EUR` },
    { label: "Capacite", value: `${fmt(summary.capacite)} EUR` },
    { label: "PTZ", value: summary.ptz > 0 ? `${fmt(summary.ptz)} EUR` : "\u2014" },
    { label: "Endettement", value: summary.endettement > 0 ? `${fmtPct(summary.endettement)}%` : "\u2014" },
    { label: "Dossiers", value: String(summary.nb_dossiers) },
  ];

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden w-72 flex-shrink-0 lg:block">
        <div className="sticky top-24 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Resume projet</h3>
          {items.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-semibold text-[var(--bleu-marine)]">{item.value}</span>
            </div>
          ))}
          {summary.verdict !== "incomplet" && (
            <VerdictBanner positive={summary.verdict === "financable"} label={verdictLabel} />
          )}
        </div>
      </aside>

      {/* Mobile: collapsible bandeau */}
      <div className="lg:hidden">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-between rounded-xl bg-[var(--gris-fond)] px-4 py-3 text-sm"
        >
          <div className="flex gap-4">
            <span><strong>{fmt(summary.budget)}</strong> budget</span>
            <span><strong>{fmt(summary.capacite)}</strong> capacite</span>
          </div>
          <span className="text-gray-400">{collapsed ? "\u25BC" : "\u25B2"}</span>
        </button>
        {!collapsed && (
          <div className="mt-2 space-y-2 rounded-xl bg-[var(--gris-fond)] px-4 py-3">
            {items.map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
            {summary.verdict !== "incomplet" && (
              <VerdictBanner positive={summary.verdict === "financable"} label={verdictLabel} />
            )}
          </div>
        )}
      </div>
    </>
  );
}
