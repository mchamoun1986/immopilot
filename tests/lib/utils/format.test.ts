import { describe, it, expect } from "vitest";
import { fmt, fmtPct } from "@/lib/utils/format";

describe("fmt", () => {
  it("formats number with French locale", () => {
    expect(fmt(250000)).toMatch(/250/);
    expect(fmt(0)).toBe("0");
  });

  it("rounds to integer", () => {
    expect(fmt(1234.56)).toMatch(/235/);
  });
});

describe("fmtPct", () => {
  it("formats ratio as percentage", () => {
    expect(fmtPct(0.125)).toBe("12.5");
    expect(fmtPct(0.35)).toBe("35.0");
  });

  it("handles zero", () => {
    expect(fmtPct(0)).toBe("0.0");
  });
});
