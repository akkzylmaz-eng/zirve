import { describe, expect, it } from "vitest";
import {
  competitiveVisibility,
  visibilityReport,
  visibilityScore,
} from "@/features/keywords/lib/visibility";
import { makeKeyword } from "./helpers";

describe("visibilityScore", () => {
  it("is 100 when every keyword sits at position 1", () => {
    const keywords = [
      makeKeyword({ id: "a", position: 1, volume: 1_000 }),
      makeKeyword({ id: "b", position: 1, volume: 9_000 }),
    ];
    expect(visibilityScore(keywords)).toBe(100);
  });

  it("is 0 when nothing ranks", () => {
    const keywords = [makeKeyword({ position: null, volume: 50_000 })];
    expect(visibilityScore(keywords)).toBe(0);
  });

  it("is 0 for an empty set rather than dividing by zero", () => {
    expect(visibilityScore([])).toBe(0);
  });

  it("weights by volume, not by keyword count", () => {
    // One huge phrase at #1 must outweigh one tiny phrase at #1 plus a miss.
    const heavyWin = visibilityScore([
      makeKeyword({ id: "a", position: 1, volume: 100_000 }),
      makeKeyword({ id: "b", position: null, volume: 1_000 }),
    ]);
    const lightWin = visibilityScore([
      makeKeyword({ id: "a", position: null, volume: 100_000 }),
      makeKeyword({ id: "b", position: 1, volume: 1_000 }),
    ]);
    expect(heavyWin).toBeGreaterThan(lightWin);
  });

  it("drops when an unranked keyword joins the set", () => {
    const before = visibilityScore([makeKeyword({ position: 1, volume: 1_000 })]);
    const after = visibilityScore([
      makeKeyword({ id: "a", position: 1, volume: 1_000 }),
      makeKeyword({ id: "b", position: null, volume: 1_000 }),
    ]);
    expect(after).toBeLessThan(before);
  });

  it("improves as a keyword climbs", () => {
    const climb = [20, 10, 5, 1].map((position) =>
      visibilityScore([makeKeyword({ position, volume: 5_000 })]),
    );
    for (let i = 1; i < climb.length; i++) {
      expect(climb[i]).toBeGreaterThan(climb[i - 1]);
    }
  });

  it("never exceeds 100", () => {
    const keywords = Array.from({ length: 50 }, (_, i) =>
      makeKeyword({ id: `k${i}`, position: 1, volume: 10_000 }),
    );
    expect(visibilityScore(keywords)).toBeLessThanOrEqual(100);
  });
});

describe("visibilityReport", () => {
  it("counts keywords that earn no clicks as invisible", () => {
    const report = visibilityReport([
      makeKeyword({ id: "a", position: 1 }),
      makeKeyword({ id: "b", position: null }),
      makeKeyword({ id: "c", position: 200 }),
    ]);
    expect(report.invisible).toBe(2);
  });

  it("reports zero headroom when everything is already first", () => {
    const report = visibilityReport([makeKeyword({ position: 1, volume: 1_000 })]);
    expect(report.headroom).toBe(0);
  });

  it("reports headroom worth chasing when buried", () => {
    const report = visibilityReport([makeKeyword({ position: 40, volume: 10_000 })]);
    expect(report.headroom).toBeGreaterThan(0);
    expect(report.estimatedClicks).toBeLessThan(report.headroom);
  });
});

describe("competitiveVisibility", () => {
  const keywords = [
    makeKeyword({
      id: "a",
      volume: 10_000,
      position: 3,
      serp: [
        { domain: "rival.com", url: "/x", position: 1 },
        { domain: "yoursite.com", url: "/a", position: 3 },
      ],
    }),
    makeKeyword({
      id: "b",
      volume: 10_000,
      position: 2,
      serp: [
        { domain: "rival.com", url: "/y", position: 4 },
        { domain: "yoursite.com", url: "/b", position: 2 },
      ],
    }),
  ];

  it("scores every domain against the same ceiling", () => {
    const result = competitiveVisibility(keywords);
    const rival = result.find((row) => row.domain === "rival.com");
    const you = result.find((row) => row.domain === "yoursite.com");
    expect(rival).toBeDefined();
    expect(you).toBeDefined();
    // rival: #1 + #4, you: #3 + #2. Rival's single #1 wins on this curve.
    expect(rival!.score).toBeGreaterThan(you!.score);
  });

  it("returns domains ordered by score", () => {
    const result = competitiveVisibility(keywords);
    const scores = result.map((row) => row.score);
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
  });

  it("handles an empty keyword set", () => {
    expect(competitiveVisibility([])).toEqual([]);
  });
});
