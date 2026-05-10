import { describe, it, expect } from "vitest";
import { calculerEndettement } from "@/lib/calculateurs/endettement";

describe("calculerEndettement", () => {
  it("revenus 4000, charges 500 → taux ~0.125, mensualite_max ~900, conforme=true", () => {
    // 500 / 4000 = 0.125, mensualite_max = 4000 * 0.35 - 500 = 900
    const result = calculerEndettement(4000, 500, 3.5, 20);
    expect(result.taux).toBeCloseTo(0.125, 2);
    expect(result.mensualite_max).toBeCloseTo(900, 0);
    expect(result.conforme_hcsf).toBe(true);
    expect(result.capacite_emprunt).toBeGreaterThan(0);
  });

  it("revenus 2000, charges 800 → taux ~0.4, conforme=false, mensualite_max=0", () => {
    // 800 / 2000 = 0.40 > 0.35 → non conforme
    const result = calculerEndettement(2000, 800, 3.5, 20);
    expect(result.taux).toBeCloseTo(0.4, 2);
    expect(result.conforme_hcsf).toBe(false);
    expect(result.mensualite_max).toBe(0);
    expect(result.capacite_emprunt).toBe(0);
  });

  it("revenus 3000, charges 0 → taux=0, mensualite_max ~1050, conforme=true", () => {
    // 0 / 3000 = 0, mensualite_max = 3000 * 0.35 = 1050
    const result = calculerEndettement(3000, 0, 3.5, 20);
    expect(result.taux).toBe(0);
    expect(result.mensualite_max).toBeCloseTo(1050, 0);
    expect(result.conforme_hcsf).toBe(true);
  });
});
