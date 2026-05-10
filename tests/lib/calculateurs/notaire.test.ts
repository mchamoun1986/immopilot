import { describe, it, expect } from "vitest";
import { calculerFraisNotaire } from "@/lib/calculateurs/notaire";

describe("calculerFraisNotaire", () => {
  it("200 000€ ancien → total entre 14k-17k, droits_mutation ~11612", () => {
    const result = calculerFraisNotaire(200000, "ancien");
    // droits_mutation = 200000 * 0.05806 = 11612
    expect(result.droits_mutation).toBeCloseTo(11612, 0);
    expect(result.total).toBeGreaterThan(14000);
    expect(result.total).toBeLessThan(17000);
  });

  it("200 000€ neuf → total entre 3.5k-6.5k, droits_mutation ~1430", () => {
    const result = calculerFraisNotaire(200000, "neuf");
    // droits_mutation = 200000 * 0.00715 = 1430
    expect(result.droits_mutation).toBeCloseTo(1430, 0);
    expect(result.total).toBeGreaterThan(3500);
    expect(result.total).toBeLessThan(6500);
  });

  it("150 000€ ancien → total = droits_mutation + emoluments + debours + contribution_securite", () => {
    const result = calculerFraisNotaire(150000, "ancien");
    const computed = result.droits_mutation + result.emoluments + result.debours + result.contribution_securite;
    expect(result.total).toBeCloseTo(computed, 2);
  });
});
