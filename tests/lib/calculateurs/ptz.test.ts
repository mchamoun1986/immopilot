import { describe, it, expect } from "vitest";
import { calculerPTZ } from "@/lib/calculateurs/ptz";

describe("calculerPTZ", () => {
  it("Zone A, revenu 40000, foyer 2, cout 250000 → eligible, montant > 0 et <= 100000", () => {
    const result = calculerPTZ({ zone: "A", revenu_fiscal: 40000, taille_foyer: 2, cout_operation: 250000 });
    expect(result.eligible).toBe(true);
    expect(result.montant).toBeGreaterThan(0);
    expect(result.montant).toBeLessThanOrEqual(100000);
    expect(result.raison_ineligibilite).toBeNull();
  });

  it("Zone A, revenu 200000, foyer 1 → ineligible, raison contient 'ressources'", () => {
    const result = calculerPTZ({ zone: "A", revenu_fiscal: 200000, taille_foyer: 1, cout_operation: 250000 });
    expect(result.eligible).toBe(false);
    expect(result.montant).toBe(0);
    expect(result.raison_ineligibilite).not.toBeNull();
    expect(result.raison_ineligibilite!.toLowerCase()).toContain("ressources");
  });

  it("Zone C, revenu 20000, foyer 1, cout 500000 → eligible, montant=40000", () => {
    // plafond operation Zone C foyer 1 = 100000, montant = 100000 * 0.4 = 40000
    const result = calculerPTZ({ zone: "C", revenu_fiscal: 20000, taille_foyer: 1, cout_operation: 500000 });
    expect(result.eligible).toBe(true);
    expect(result.montant).toBe(40000);
  });

  it("Zone X (invalide) → ineligible", () => {
    const result = calculerPTZ({ zone: "X", revenu_fiscal: 30000, taille_foyer: 2, cout_operation: 200000 });
    expect(result.eligible).toBe(false);
    expect(result.montant).toBe(0);
    expect(result.raison_ineligibilite).not.toBeNull();
  });

  it("Zone B1, revenu 25000, foyer 2, cout 200000 → eligible avec duree_differee > 0", () => {
    const result = calculerPTZ({ zone: "B1", revenu_fiscal: 25000, taille_foyer: 2, cout_operation: 200000 });
    expect(result.eligible).toBe(true);
    expect(result.duree_differee).toBeGreaterThan(0);
    expect(result.montant).toBeGreaterThan(0);
  });
});
