import { describe, expect, it } from "vitest";
import {
  findCannibalization,
  similarity,
  tokenize,
} from "@/features/keywords/lib/cannibalization";
import { makeKeyword } from "./helpers";

describe("tokenize", () => {
  it("strips stopwords and punctuation", () => {
    expect(tokenize("The best CRM for startups!")).toEqual(["crm", "startups"]);
  });

  it("handles Turkish stopwords and characters", () => {
    expect(tokenize("en iyi proje yönetimi")).toEqual(["iyi", "proje", "yönetimi"]);
  });

  it("drops single characters and empty input", () => {
    expect(tokenize("a b crm")).toEqual(["crm"]);
    expect(tokenize("   ")).toEqual([]);
  });
});

describe("similarity", () => {
  it("is 1 for identical significant tokens", () => {
    expect(similarity("crm software", "the crm software")).toBe(1);
  });

  it("is 0 for unrelated phrases", () => {
    expect(similarity("gantt chart", "email marketing")).toBe(0);
  });

  it("is 0 when a phrase is all stopwords", () => {
    expect(similarity("the best", "crm software")).toBe(0);
  });

  it("sits between 0 and 1 for partial overlap", () => {
    const score = similarity("crm software", "crm pricing");
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });

  it("is symmetric", () => {
    expect(similarity("a crm tool", "crm tool pricing")).toBe(
      similarity("crm tool pricing", "a crm tool"),
    );
  });
});

describe("findCannibalization", () => {
  it("flags one intent served by two different URLs", () => {
    const clusters = findCannibalization([
      makeKeyword({ id: "a", phrase: "crm software", url: "/features/crm", position: 4, volume: 10_000 }),
      makeKeyword({ id: "b", phrase: "crm software guide", url: "/blog/crm-guide", position: 14, volume: 2_000 }),
    ]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0].urls).toHaveLength(2);
    expect(clusters[0].volume).toBe(12_000);
  });

  it("stays quiet when one URL owns the whole cluster", () => {
    const clusters = findCannibalization([
      makeKeyword({ id: "a", phrase: "crm software", url: "/features/crm" }),
      makeKeyword({ id: "b", phrase: "crm software guide", url: "/features/crm" }),
    ]);
    expect(clusters).toEqual([]);
  });

  it("does not group unrelated phrases that happen to share a URL", () => {
    const clusters = findCannibalization([
      makeKeyword({ id: "a", phrase: "gantt chart maker", url: "/x" }),
      makeKeyword({ id: "b", phrase: "email marketing platform", url: "/y" }),
    ]);
    expect(clusters).toEqual([]);
  });

  it("names a cluster after its highest-volume phrase", () => {
    const clusters = findCannibalization([
      makeKeyword({ id: "a", phrase: "crm software guide", url: "/blog", volume: 500 }),
      makeKeyword({ id: "b", phrase: "crm software", url: "/features", volume: 90_000 }),
    ]);
    expect(clusters[0].head).toBe("crm software");
  });

  it("estimates recoverable clicks from consolidating the cluster", () => {
    const clusters = findCannibalization([
      makeKeyword({ id: "a", phrase: "crm software", url: "/features/crm", position: 3, volume: 10_000 }),
      makeKeyword({ id: "b", phrase: "crm software pricing", url: "/pricing", position: 30, volume: 10_000 }),
    ]);
    // The buried page's volume, moved behind the #3 page, is worth real clicks.
    expect(clusters[0].recoverableClicks).toBeGreaterThan(0);
  });

  it("orders clusters by what consolidating them is worth", () => {
    const clusters = findCannibalization([
      makeKeyword({ id: "a", phrase: "crm software", url: "/a", position: 2, volume: 90_000 }),
      makeKeyword({ id: "b", phrase: "crm software review", url: "/b", position: 40, volume: 60_000 }),
      makeKeyword({ id: "c", phrase: "gantt chart", url: "/c", position: 5, volume: 900 }),
      makeKeyword({ id: "d", phrase: "gantt chart template", url: "/d", position: 30, volume: 600 }),
    ]);
    expect(clusters).toHaveLength(2);
    expect(clusters[0].recoverableClicks).toBeGreaterThanOrEqual(
      clusters[1].recoverableClicks,
    );
  });

  it("respects a stricter threshold", () => {
    const loose = findCannibalization(
      [
        makeKeyword({ id: "a", phrase: "crm software", url: "/a" }),
        makeKeyword({ id: "b", phrase: "crm pricing", url: "/b" }),
      ],
      0.3,
    );
    const strict = findCannibalization(
      [
        makeKeyword({ id: "a", phrase: "crm software", url: "/a" }),
        makeKeyword({ id: "b", phrase: "crm pricing", url: "/b" }),
      ],
      0.9,
    );
    expect(loose).toHaveLength(1);
    expect(strict).toHaveLength(0);
  });

  it("handles an empty set", () => {
    expect(findCannibalization([])).toEqual([]);
  });
});
