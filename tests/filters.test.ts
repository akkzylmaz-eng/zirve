import { describe, expect, it } from "vitest";
import {
  applyQuery,
  DEFAULT_QUERY,
  parseQuery,
  serializeQuery,
  sortKeywords,
} from "@/features/keywords/lib/filters";
import { makeKeyword } from "./helpers";

const keywords = [
  makeKeyword({ id: "a", phrase: "crm software", position: 3, delta: -2, volume: 9_000, group: "product", intent: "commercial", url: "/features/crm" }),
  makeKeyword({ id: "b", phrase: "gantt chart", position: 14, delta: 3, volume: 22_000, group: "tools", intent: "transactional", url: "/tools/gantt" }),
  makeKeyword({ id: "c", phrase: "agile guide", position: null, delta: 0, volume: 1_000, group: "blog", intent: "informational", url: "/blog/agile" }),
];

describe("applyQuery", () => {
  it("returns everything under the default query", () => {
    expect(applyQuery(keywords, DEFAULT_QUERY)).toHaveLength(3);
  });

  it("searches the phrase and the URL", () => {
    expect(applyQuery(keywords, { ...DEFAULT_QUERY, search: "gantt" })).toHaveLength(1);
    expect(applyQuery(keywords, { ...DEFAULT_QUERY, search: "/blog" })).toHaveLength(1);
  });

  it("ignores case and surrounding whitespace in the search", () => {
    expect(applyQuery(keywords, { ...DEFAULT_QUERY, search: "  CRM " })).toHaveLength(1);
  });

  it("filters by group, intent and bucket", () => {
    expect(applyQuery(keywords, { ...DEFAULT_QUERY, group: "tools" })).toHaveLength(1);
    expect(applyQuery(keywords, { ...DEFAULT_QUERY, intent: "informational" })).toHaveLength(1);
    expect(applyQuery(keywords, { ...DEFAULT_QUERY, bucket: "top3" })).toHaveLength(1);
    expect(applyQuery(keywords, { ...DEFAULT_QUERY, bucket: "unranked" })).toHaveLength(1);
  });

  it("filters by trend using rank semantics", () => {
    expect(applyQuery(keywords, { ...DEFAULT_QUERY, trend: "climbed" })).toHaveLength(1);
    expect(applyQuery(keywords, { ...DEFAULT_QUERY, trend: "dropped" })).toHaveLength(1);
    expect(applyQuery(keywords, { ...DEFAULT_QUERY, trend: "flat" })).toHaveLength(1);
  });

  it("combines filters conjunctively", () => {
    const result = applyQuery(keywords, { ...DEFAULT_QUERY, group: "tools", trend: "climbed" });
    expect(result).toEqual([]);
  });

  it("does not mutate the source array", () => {
    const order = keywords.map((k) => k.id);
    applyQuery(keywords, { ...DEFAULT_QUERY, sort: "volume" });
    expect(keywords.map((k) => k.id)).toEqual(order);
  });
});

describe("sortKeywords", () => {
  it("sorts unranked keywords last regardless of direction", () => {
    const asc = sortKeywords(keywords, "position", "asc");
    const desc = sortKeywords(keywords, "position", "desc");
    expect(asc.at(-1)!.id).toBe("c");
    expect(desc.at(0)!.id).toBe("c");
  });

  it("sorts by volume", () => {
    expect(sortKeywords(keywords, "volume", "desc")[0].id).toBe("b");
  });

  it("sorts phrases alphabetically", () => {
    expect(sortKeywords(keywords, "phrase", "asc").map((k) => k.phrase)).toEqual([
      "agile guide",
      "crm software",
      "gantt chart",
    ]);
  });
});

describe("query serialization", () => {
  it("omits defaults so a clean view gets a clean URL", () => {
    expect(serializeQuery(DEFAULT_QUERY)).toBe("");
  });

  it("round-trips a non-default query", () => {
    const query = {
      ...DEFAULT_QUERY,
      search: "crm",
      group: "product",
      bucket: "top10" as const,
      trend: "climbed" as const,
      sort: "volume" as const,
      direction: "desc" as const,
    };
    const restored = parseQuery(new URLSearchParams(serializeQuery(query)));
    expect(restored).toEqual(query);
  });

  it("falls back to defaults for an empty URL", () => {
    expect(parseQuery(new URLSearchParams(""))).toEqual(DEFAULT_QUERY);
  });
});
