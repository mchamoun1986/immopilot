/**
 * Format a number as French locale string (rounded to integer).
 */
export function fmt(n: number): string {
  return Math.round(n).toLocaleString("fr-FR");
}

/**
 * Format a ratio (0-1) as a percentage string with 1 decimal.
 * Example: 0.125 -> "12.5"
 */
export function fmtPct(ratio: number): string {
  return (ratio * 100).toFixed(1);
}

/**
 * Format a Date as dd/mm/yyyy (French locale).
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 * Format a Date as "09 mai 2026" (French long month).
 */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

/**
 * Format a number as "250 000 EUR".
 */
export function fmtEur(n: number): string {
  return fmt(n) + " EUR";
}
