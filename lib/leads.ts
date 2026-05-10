import type { LeadCapture } from "./types";
import { loadProjet, saveProjet } from "./storage";

const LEADS_KEY = "immopilot_leads";

export function saveLead(lead: LeadCapture): void {
  // Save to localStorage (leads array)
  // In production, this would POST to /api/leads
  const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || "[]") as Array<LeadCapture & { created_at: string }>;
  leads.push({ ...lead, created_at: new Date().toISOString() });
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));

  // Mark projet as lead captured
  const projet = loadProjet();
  if (projet) {
    projet.lead_captured = true;
    saveProjet(projet);
  }
}

export function getLeads(): Array<LeadCapture & { created_at: string }> {
  const raw = localStorage.getItem(LEADS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Array<LeadCapture & { created_at: string }>;
  } catch {
    return [];
  }
}
