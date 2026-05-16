'use client';

import { useState } from "react";
import type { ProjectSummary } from "@/lib/selectors";
import { fmt, fmtPct } from "@/lib/utils/format";
import { VerdictBanner } from "@/components/ui/verdict-banner";

interface ProjectSidebarProps {
  summary: ProjectSummary;
  desktopOnly?: boolean;
}

export function ProjectSidebar({ summary, desktopOnly }: ProjectSidebarProps) {
  const [collapsed, setCollapsed] = useState(true);

  const verdictLabel = summary.verdict === "financable"
    ? "Finançable"
    : summary.verdict === "depassement"
      ? "Dépassement"
      : "Incomplet";

  const items = [
    { label: "Budget", value: `${fmt(summary.budget)} EUR` },
    { label: "Capacité", value: `${fmt(summary.capacite)} EUR` },
    { label: "PTZ", value: summary.ptz > 0 ? `${fmt(summary.ptz)} EUR` : "\u2014" },
    { label: "Endettement", value: summary.endettement > 0 ? `${fmtPct(summary.endettement)}%` : "\u2014" },
    { label: "Dossiers", value: String(summary.nb_dossiers) },
  ];

  // Desktop-only mode: render just the sticky content (wrapper is outside)
  if (desktopOnly) {
    return (
      <div className="sticky top-24 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Résumé projet</h3>
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
    );
  }

  // Mobile: collapsible summary card
  return (
    <div className="rounded-xl border border-[var(--gris-border)] bg-white shadow-sm">
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        className="flex w-full items-center justify-between px-4 py-3 text-sm"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Résumé</span>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
            <span className="font-bold text-[var(--bleu-marine)]">{fmt(summary.budget)} EUR</span>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-gray-600">{fmtPct(summary.endettement)}%</span>
            {summary.ptz > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <span className="font-semibold text-green-600">PTZ {fmt(summary.ptz)}</span>
              </>
            )}
          </div>
        </div>
        <span className="ml-2 flex-shrink-0 text-gray-400 text-xs">{collapsed ? "\u25BC" : "\u25B2"}</span>
      </button>
      {!collapsed && (
        <div className="space-y-2 border-t border-[var(--gris-border)] px-4 py-3">
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
  );
}
