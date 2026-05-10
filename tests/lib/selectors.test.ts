import { describe, it, expect } from "vitest";
import { getProjectSummary, getCompletedSteps, getCurrentStepInfo } from "@/lib/selectors";
import { createEmptyProjet } from "@/lib/storage";
import type { ProjetImmobilier } from "@/lib/types";

function makeProjet(overrides: Partial<ProjetImmobilier> = {}): ProjetImmobilier {
  return { ...createEmptyProjet(), ...overrides };
}

describe("getProjectSummary", () => {
  it("returns zeros for empty project", () => {
    const s = getProjectSummary(makeProjet());
    expect(s.budget).toBe(0);
    expect(s.capacite).toBe(0);
    expect(s.ptz).toBe(0);
    expect(s.nb_dossiers).toBe(0);
    expect(s.endettement).toBe(0);
    expect(s.verdict).toBe("incomplet");
  });

  it("returns financable when capacite covers budget", () => {
    const s = getProjectSummary(makeProjet({
      budget_max: 200000,
      capacite_emprunt: 180000,
      apport: 30000,
    }));
    expect(s.verdict).toBe("financable");
  });

  it("returns depassement when budget exceeds financing", () => {
    const s = getProjectSummary(makeProjet({
      budget_max: 300000,
      capacite_emprunt: 150000,
      apport: 10000,
    }));
    expect(s.verdict).toBe("depassement");
  });
});

describe("getCompletedSteps", () => {
  it("returns empty for fresh project", () => {
    expect(getCompletedSteps(makeProjet())).toEqual([]);
  });

  it("marks step 1 complete when revenus + commune + budget set", () => {
    const steps = getCompletedSteps(makeProjet({
      revenus_net: 3500,
      commune: "Lyon",
      budget_max: 250000,
    }));
    expect(steps).toContain(1);
  });

  it("marks step 2 complete when capacite calculated", () => {
    const steps = getCompletedSteps(makeProjet({
      capacite_emprunt: 180000,
      eligible_ptz: true,
    }));
    expect(steps).toContain(2);
  });
});

describe("getCurrentStepInfo", () => {
  it("returns step 1 for fresh project", () => {
    const info = getCurrentStepInfo(makeProjet());
    expect(info.numero).toBe(1);
    expect(info.slug).toBe("1-projet");
  });

  it("returns first incomplete step", () => {
    const info = getCurrentStepInfo(makeProjet({
      revenus_net: 3500,
      commune: "Lyon",
      budget_max: 250000,
    }));
    expect(info.numero).toBe(2);
  });
});
