import type { Keyword } from "@/features/keywords/types";

/** Minimal keyword factory so each test states only what it cares about. */
export function makeKeyword(overrides: Partial<Keyword> = {}): Keyword {
  return {
    id: "kw-test",
    phrase: "test phrase",
    position: 10,
    delta: 0,
    best: 10,
    volume: 1000,
    difficulty: 50,
    cpc: 1,
    intent: "commercial",
    url: "/test",
    group: "product",
    features: [],
    history: [],
    serp: [],
    ...overrides,
  };
}
