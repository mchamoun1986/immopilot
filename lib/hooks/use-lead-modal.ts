import { useState, useEffect, useCallback } from "react";
import { loadProjet, saveProjet } from "@/lib/storage";
import { saveLead } from "@/lib/leads";
import type { LeadCapture, LeadSource, EtapeNumber } from "@/lib/types";

interface UseLeadModalReturn {
  shouldShow: boolean;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  onSubmit: (lead: LeadCapture) => void;
}

/**
 * Hook pour gerer le lead modal de maniere intelligente.
 * Ne montre le bouton que si la source n'a pas encore ete capturee.
 */
export function useLeadModal(source: LeadSource, etape: EtapeNumber): UseLeadModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [alreadyCaptured, setAlreadyCaptured] = useState(true); // default true to hide button during SSR

  useEffect(() => {
    const projet = loadProjet();
    setAlreadyCaptured(projet?.sources_captured?.includes(source) ?? false);
  }, [source]);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const onSubmit = useCallback((lead: LeadCapture) => {
    const enrichedLead = { ...lead, source, etape };
    saveLead(enrichedLead);

    // Mark source as captured on project if available
    const p = loadProjet();
    if (p) {
      if (!p.sources_captured) p.sources_captured = [];
      if (!p.sources_captured.includes(source)) {
        p.sources_captured.push(source);
      }
      p.lead_captured = true;
      saveProjet(p);
    }
  }, [source, etape]);

  return {
    shouldShow: !alreadyCaptured,
    isOpen,
    openModal,
    closeModal,
    onSubmit,
  };
}
