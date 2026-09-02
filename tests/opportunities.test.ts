import { describe, expect, it } from "vitest";
import { rankOpportunities } from "@/features/keywords/lib/opportunities";
import { makeKeyword } from "./helpers";

describe("rankOpportunities", () => {
  it("excludes keywords already in the top 3", () => {
    const result = rankOpportunities([
      makeKeyword({ id: "a", position: 2, volume: 100_000 }),
      makeKeyword({ id: "b", position: 8, volume: 10_000 }),
    ]);
    expect(result.map((o) => o.keyword.id)).toEqual(["b"]);
  });

  it("prefers a reachable page-one keyword over an unreachable head term", () => {
    const result = rankOpportunities([
      makeKeyword({ id: "reachable", position: 6, volume: 20_000, difficulty: 35 }),
      makeKeyword({ id: "brutal", position: 70, volume: 60_000, difficulty: 95 }),
    ]);
    expect(result[0].keyword.id).toBe("reachable");
  });

  it("labels why each keyword surfaced", () => {
    const result = rankOpportunities([
      makeKeyword({ id: "a", position: 7, delta: 0 }),
      makeKeyword({ id: "b", position: 15, delta: 0 }),
      makeKeyword({ id: "c", position: 40, delta: 0 }),
      makeKeyword({ id: "d", position: 6, delta: 5 }),
    ]);
    const reasons = Object.fromEntries(result.map((o) => [o.keyword.id, o.reason]));
    expect(reasons.a).toBe("striking-distance");
    expect(reasons.b).toBe("page-two");
    expect(reasons.c).toBe("untapped");
    expect(reasons.d).toBe("slipping");
  });

  it("respects the limit", () => {
    const many = Array.from({ length: 30 }, (_, i) =>
      makeKeyword({ id: `k${i}`, position: 10 + i, volume: 5_000 }),
    );
    expect(rankOpportunities(many, 5)).toHaveLength(5);
  });

  it("returns nothing for an empty set", () => {
    expect(rankOpportunities([])).toEqual([]);
  });
});
