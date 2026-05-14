/**
 * Module de tracking des clics affilies.
 * Stocke en localStorage — sera synchronise avec un backend plus tard.
 */

const STORAGE_KEY = "immopilot_affiliate_clicks";

export interface AffiliateClick {
  id: string;
  url: string;
  source: string;
  etape: number | null;
  subId: string;
  timestamp: string;
}

/**
 * Enregistre un clic affilie et retourne le subId genere.
 */
export function trackAffiliateClick(url: string, source: string, etape?: number): string {
  const subId = crypto.randomUUID();
  const click: AffiliateClick = {
    id: crypto.randomUUID(),
    url,
    source,
    etape: etape ?? null,
    subId,
    timestamp: new Date().toISOString(),
  };

  try {
    const clicks = getAffiliateClicks();
    clicks.push(click);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clicks));
  } catch {
    // storage unavailable — click still navigates
  }

  return subId;
}

/**
 * Retourne tous les clics affilies enregistres.
 */
export function getAffiliateClicks(): AffiliateClick[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AffiliateClick[];
  } catch {
    return [];
  }
}

/**
 * Remplace {sessionId} dans l'URL template par le subId.
 */
export function buildAffiliateUrl(templateUrl: string, subId: string): string {
  return templateUrl.replace("{sessionId}", subId);
}
