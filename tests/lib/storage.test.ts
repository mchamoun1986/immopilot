import { describe, it, expect, beforeEach } from "vitest";
import { loadProjet, saveProjet, clearProjet, createEmptyProjet } from "@/lib/storage";

const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  length: 0,
  key: () => null,
};
Object.defineProperty(globalThis, "localStorage", { value: mockLocalStorage });

describe("storage", () => {
  beforeEach(() => { mockLocalStorage.clear(); });

  it("createEmptyProjet returns valid project with UUID", () => {
    const projet = createEmptyProjet();
    expect(projet.id).toBeTruthy();
    expect(projet.etape_courante).toBe(1);
    expect(projet.dossiers).toEqual([]);
    expect(projet.lead_captured).toBe(false);
    expect(projet.usage).toBe("residence_principale");
  });

  it("saveProjet and loadProjet round-trip", () => {
    const projet = createEmptyProjet();
    projet.commune = "Lyon";
    projet.apport = 25000;
    saveProjet(projet);
    const loaded = loadProjet();
    expect(loaded).not.toBeNull();
    expect(loaded!.commune).toBe("Lyon");
    expect(loaded!.apport).toBe(25000);
    expect(loaded!.id).toBe(projet.id);
  });

  it("loadProjet returns null when nothing saved", () => {
    expect(loadProjet()).toBeNull();
  });

  it("clearProjet removes data", () => {
    saveProjet(createEmptyProjet());
    clearProjet();
    expect(loadProjet()).toBeNull();
  });
});
