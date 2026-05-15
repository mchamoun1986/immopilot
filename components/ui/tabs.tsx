'use client';

import { useState, useRef } from "react";

interface Tab {
  id: string;
  label: string;
  badge?: number;
  keepMounted?: boolean;
}

interface TabsContainerProps {
  tabs: Tab[];
  defaultTab?: string;
  children: (activeTab: string) => React.ReactNode;
}

export function TabsContainer({ tabs, defaultTab, children }: TabsContainerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? "");
  // Pre-seed keepMounted tabs so they render immediately
  const mountedTabs = useRef(new Set<string>([
    defaultTab ?? tabs[0]?.id ?? "",
    ...tabs.filter((t) => t.keepMounted).map((t) => t.id),
  ]));

  const handleTabClick = (tabId: string) => {
    mountedTabs.current.add(tabId);
    setActiveTab(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let nextIdx = idx;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = tabs.length - 1;
    else return;
    e.preventDefault();
    handleTabClick(tabs[nextIdx].id);
    document.getElementById(`tab-${tabs[nextIdx].id}`)?.focus();
  };

  return (
    <div>
      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-[var(--gris-border)]" role="tablist">
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-[var(--bleu-action)] text-[var(--bleu-action)]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span className="rounded-full bg-[var(--bleu-action)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      {tabs.map((tab) => {
        const shouldRender = tab.keepMounted
          ? mountedTabs.current.has(tab.id)
          : activeTab === tab.id;
        if (!shouldRender) return null;
        return (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            className={activeTab === tab.id ? "fade-in" : ""}
          >
            {children(tab.id)}
          </div>
        );
      })}
    </div>
  );
}
