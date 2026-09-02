import { describe, expect, it } from "vitest";
import {
  BUCKET_ORDER,
  bucketMovement,
  bucketOf,
  distribution,
} from "@/features/keywords/lib/distribution";
import { makeKeyword } from "./helpers";

describe("bucketOf", () => {
  it("places positions in the right band", () => {
    expect(bucketOf(1)).toBe("top3");
    expect(bucketOf(3)).toBe("top3");
    expect(bucketOf(4)).toBe("top10");
    expect(bucketOf(10)).toBe("top10");
    expect(bucketOf(11)).toBe("top20");
    expect(bucketOf(20)).toBe("top20");
    expect(bucketOf(21)).toBe("top50");
    expect(bucketOf(50)).toBe("top50");
    expect(bucketOf(51)).toBe("beyond");
  });

  it("treats a missing position as unranked", () => {
    expect(bucketOf(null)).toBe("unranked");
    expect(bucketOf(Number.NaN)).toBe("unranked");
  });
});

describe("distribution", () => {
  it("always returns every bucket so the chart keeps its shape", () => {
    const slices = distribution([makeKeyword({ position: 1 })]);
    expect(slices.map((slice) => slice.bucket)).toEqual([...BUCKET_ORDER]);
  });

  it("counts keywords into their bands", () => {
    const slices = distribution([
      makeKeyword({ id: "a", position: 2 }),
      makeKeyword({ id: "b", position: 3 }),
      makeKeyword({ id: "c", position: 15 }),
      makeKeyword({ id: "d", position: null }),
    ]);
    const byBucket = Object.fromEntries(slices.map((s) => [s.bucket, s.count]));
    expect(byBucket.top3).toBe(2);
    expect(byBucket.top20).toBe(1);
    expect(byBucket.unranked).toBe(1);
  });

  it("produces shares that sum to 100", () => {
    const slices = distribution([
      makeKeyword({ id: "a", position: 1 }),
      makeKeyword({ id: "b", position: 12 }),
      makeKeyword({ id: "c", position: 80 }),
    ]);
    const total = slices.reduce((sum, slice) => sum + slice.share, 0);
    expect(total).toBeCloseTo(100, 6);
  });

  it("does not divide by zero on an empty set", () => {
    const slices = distribution([]);
    expect(slices.every((slice) => slice.count === 0 && slice.share === 0)).toBe(true);
  });
});

describe("bucketMovement", () => {
  it("records a keyword crossing onto page one", () => {
    // Was 11 (top20), now 9 (top10): delta = 9 - 11 = -2.
    const { entered, left } = bucketMovement([makeKeyword({ position: 9, delta: -2 })]);
    expect(entered.top10).toBe(1);
    expect(left.top20).toBe(1);
  });

  it("ignores movement inside a single band", () => {
    const { entered } = bucketMovement([makeKeyword({ position: 5, delta: -2 })]);
    expect(Object.values(entered).every((count) => count === 0)).toBe(true);
  });

  it("skips unranked keywords", () => {
    const { entered, left } = bucketMovement([makeKeyword({ position: null, delta: 0 })]);
    expect(Object.values(entered).every((c) => c === 0)).toBe(true);
    expect(Object.values(left).every((c) => c === 0)).toBe(true);
  });
});
