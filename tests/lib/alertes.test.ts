import { describe, it, expect } from "vitest";
import { buildProjectAlerts } from "@/lib/alertes";
import { createEmptyProjet } from "@/lib/storage";
import { createEmptyDossier } from "@/lib/dossiers";
import type { ProjetImmobilier, DpeClasse } from "@/lib/types";

function makeProjet(overrides: Partial<ProjetImmobilier> = {}): ProjetImmobilier {
  return { ...createEmptyProjet(), ...overrides };
}

describe("buildProjectAlerts", () => {
  it("returns empty for project with no dossiers", () => {
    expect(buildProjectAlerts(makeProjet())).toEqual([]);
  });

  it("flags DPE G as danger", () => {
    const dossier = { ...createEmptyDossier(), dpe_energie: "G" as DpeClasse, adresse: "Rue Test" };
    const alerts = buildProjectAlerts(makeProjet({ dossiers: [dossier] }));
    expect(alerts.some((a) => a.severity === "danger" && a.message.includes("G"))).toBe(true);
  });

  it("flags DPE F as danger", () => {
    const dossier = { ...createEmptyDossier(), dpe_energie: "F" as DpeClasse, adresse: "Rue Test" };
    const alerts = buildProjectAlerts(makeProjet({ dossiers: [dossier] }));
    expect(alerts.some((a) => a.severity === "danger")).toBe(true);
  });

  it("flags high endettement", () => {
    const alerts = buildProjectAlerts(makeProjet({ taux_endettement: 0.40 }));
    expect(alerts.some((a) => a.message.includes("endettement"))).toBe(true);
  });

  it("flags old building < 1949", () => {
    const dossier = { ...createEmptyDossier(), annee_construction: 1920, adresse: "Vieux" };
    const alerts = buildProjectAlerts(makeProjet({ dossiers: [dossier] }));
    expect(alerts.some((a) => a.message.includes("1949"))).toBe(true);
  });
});
