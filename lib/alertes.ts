import type { ProjetImmobilier, Alerte, EtapeNumber } from "./types";

export function buildProjectAlerts(projet: ProjetImmobilier): Alerte[] {
  const alertes: Alerte[] = [];

  if (projet.taux_endettement > 0.30) {
    alertes.push({
      type: "danger",
      message: `Taux d'endettement élevé : ${(projet.taux_endettement * 100).toFixed(1)}%`,
      detail: "Le plafond HCSF est de 35%. Au-delà, les banques refuseront le prêt.",
      etape: 2 as EtapeNumber,
      severity: projet.taux_endettement > 0.35 ? "danger" : "warning",
      source_reglementaire: "HCSF",
      date_effet: null,
    });
  }

  for (const dossier of projet.dossiers) {
    const label = dossier.adresse || dossier.commune || "Dossier";

    if (dossier.dpe_energie === "G") {
      alertes.push({
        type: "danger",
        message: `DPE G détecté sur ${label}`,
        detail: "Passoire thermique — location interdite depuis 2025 (classe G).",
        etape: 5 as EtapeNumber,
        severity: "danger",
        source_reglementaire: "Loi Climat et Résilience",
        date_effet: "2025-01-01",
      });
    } else if (dossier.dpe_energie === "F") {
      alertes.push({
        type: "danger",
        message: `DPE F détecté sur ${label}`,
        detail: "Interdiction de location à partir de 2028 (classe F).",
        etape: 5 as EtapeNumber,
        severity: "danger",
        source_reglementaire: "Loi Climat et Résilience",
        date_effet: "2028-01-01",
      });
    } else if (dossier.dpe_energie === "E") {
      alertes.push({
        type: "attention",
        message: `DPE E sur ${label} — gel des loyers`,
        detail: "Interdiction de location prévue en 2034.",
        etape: 5 as EtapeNumber,
        severity: "warning",
        source_reglementaire: "Loi Climat et Résilience",
        date_effet: "2034-01-01",
      });
    }

    if (dossier.type_copro && dossier.surface > 0 && dossier.charges_copro > 0) {
      const ratio = dossier.charges_copro / dossier.surface;
      if (ratio > 50) {
        alertes.push({
          type: "attention",
          message: `Charges copro élevées sur ${label}`,
          detail: `${Math.round(dossier.charges_copro)} EUR/mois pour ${dossier.surface} m2.`,
          etape: 5 as EtapeNumber,
          severity: "warning",
          source_reglementaire: null,
          date_effet: null,
        });
      }
    }

    if (dossier.annee_construction > 0 && dossier.annee_construction < 1949) {
      alertes.push({
        type: "attention",
        message: `Bien ancien (avant 1949) — ${label}`,
        detail: "Vérifiez les diagnostics plomb et amiante obligatoires.",
        etape: 5 as EtapeNumber,
        severity: "warning",
        source_reglementaire: null,
        date_effet: null,
      });
    }
  }

  return alertes;
}
