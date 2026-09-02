import { describe, expect, it } from "vitest";
import {
  ctrAt,
  estimateClicks,
  MAX_CTR,
  suppressionFactor,
} from "@/features/keywords/lib/ctr-curve";

describe("ctrAt", () => {
  it("peaks at position 1", () => {
    expect(ctrAt(1)).toBe(MAX_CTR);
  });

  it("decreases monotonically through the curve", () => {
    for (let position = 2; position <= 20; position++) {
      expect(ctrAt(position)).toBeLessThan(ctrAt(position - 1));
    }
  });

  it("keeps decaying past the tabulated curve", () => {
    expect(ctrAt(25)).toBeLessThan(ctrAt(21));
    expect(ctrAt(60)).toBeLessThan(ctrAt(25));
  });

  it("earns nothing when unranked or out of range", () => {
    expect(ctrAt(null)).toBe(0);
    expect(ctrAt(0)).toBe(0);
    expect(ctrAt(-5)).toBe(0);
    expect(ctrAt(120)).toBe(0);
    expect(ctrAt(Number.NaN)).toBe(0);
  });

  it("rounds fractional positions to the nearest whole rank", () => {
    expect(ctrAt(2.4)).toBe(ctrAt(2));
    expect(ctrAt(2.6)).toBe(ctrAt(3));
  });
});

describe("suppressionFactor", () => {
  it("is neutral with no features", () => {
    expect(suppressionFactor([])).toBe(1);
  });

  it("suppresses clicks when a featured snippet sits above you", () => {
    expect(suppressionFactor(["featured"])).toBeLessThan(1);
  });

  it("does not penalise you for a snippet you own", () => {
    expect(suppressionFactor(["featured"], true)).toBe(1);
  });

  it("compounds multiple features", () => {
    const single = suppressionFactor(["featured"]);
    expect(suppressionFactor(["featured", "shopping"])).toBeLessThan(single);
  });
});

describe("estimateClicks", () => {
  it("scales with volume", () => {
    const small = estimateClicks({ position: 3, volume: 1_000 });
    const large = estimateClicks({ position: 3, volume: 10_000 });
    expect(large).toBeCloseTo(small * 10, 6);
  });

  it("returns zero for an unranked keyword no matter the volume", () => {
    expect(estimateClicks({ position: null, volume: 500_000 })).toBe(0);
  });

  it("treats position 1 as owning the featured snippet", () => {
    const withSnippet = estimateClicks({ position: 1, volume: 1_000, features: ["featured"] });
    const withoutSnippet = estimateClicks({ position: 1, volume: 1_000 });
    expect(withSnippet).toBe(withoutSnippet);
  });
});
