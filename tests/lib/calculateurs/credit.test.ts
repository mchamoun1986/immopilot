import { describe, it, expect } from "vitest";
import { calculerMensualite, calculerCapaciteEmprunt } from "@/lib/calculateurs/credit";

describe("calculerMensualite", () => {
  it("200 000€ à 3.5% sur 20 ans → mensualite ~1159.92", () => {
    const result = calculerMensualite(200000, 3.5, 20);
    expect(result.mensualite).toBeCloseTo(1159.92, 0);
    expect(result.cout_total).toBeCloseTo(278381, -2);
    expect(result.cout_interets).toBeCloseTo(78381, -2);
    expect(result.capacite_emprunt).toBe(0);
  });

  it("montant 0 → tout zéro", () => {
    const result = calculerMensualite(0, 3.5, 20);
    expect(result.mensualite).toBe(0);
    expect(result.cout_total).toBe(0);
    expect(result.cout_interets).toBe(0);
  });

  it("taux 0% sur 20 ans → division simple, pas d'intérêts", () => {
    const result = calculerMensualite(120000, 0, 20);
    expect(result.mensualite).toBeCloseTo(500, 2);
    expect(result.cout_interets).toBe(0);
  });
});

describe("calculerCapaciteEmprunt", () => {
  it("revenus 3500, charges 200, taux 3.5%, 20 ans → mensualite_max ~1025, capacite entre 150k-200k", () => {
    const result = calculerCapaciteEmprunt(3500, 200, 3.5, 20);
    // mensualite_max = 3500 * 0.35 - 200 = 1225 - 200 = 1025
    expect(result.mensualite_max).toBeCloseTo(1025, 0);
    expect(result.capacite_emprunt).toBeGreaterThan(150000);
    expect(result.capacite_emprunt).toBeLessThan(200000);
  });

  it("revenus 2000, charges 800 → charges > 35%, tout zéro", () => {
    // 2000 * 0.35 = 700 < 800 → mensualiteMax = 0
    const result = calculerCapaciteEmprunt(2000, 800, 3.5, 20);
    expect(result.mensualite_max).toBe(0);
    expect(result.capacite_emprunt).toBe(0);
    expect(result.mensualite).toBe(0);
    expect(result.cout_total).toBe(0);
    expect(result.cout_interets).toBe(0);
  });
});
