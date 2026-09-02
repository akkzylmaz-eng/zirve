import { describe, expect, it } from "vitest";
import {
  bestPosition,
  deltaOverWindow,
  formatDelta,
  hasImproved,
  trendOf,
  volatility,
} from "@/features/keywords/lib/rank";

describe("trendOf", () => {
  it("treats a negative delta as a climb, because lower positions are better", () => {
    expect(trendOf(-3)).toBe("climbed");
    expect(hasImproved(-3)).toBe(true);
  });

  it("treats a positive delta as a drop", () => {
    expect(trendOf(4)).toBe("dropped");
    expect(hasImproved(4)).toBe(false);
  });

  it("treats zero as flat", () => {
    expect(trendOf(0)).toBe("flat");
    expect(hasImproved(0)).toBe(false);
  });
});

describe("formatDelta", () => {
  it("prints magnitude with a direction arrow, never a bare minus sign", () => {
    expect(formatDelta(-3)).toBe("▲3");
    expect(formatDelta(5)).toBe("▼5");
    expect(formatDelta(0)).toBe("0");
  });
});

describe("history helpers", () => {
  const history = [
    { date: "2026-06-01", position: 18 },
    { date: "2026-06-02", position: 14 },
    { date: "2026-06-03", position: 9 },
    { date: "2026-06-04", position: 11 },
  ];

  it("measures the change across the window", () => {
    expect(deltaOverWindow(history)).toBe(-7);
  });

  it("finds the best (lowest) position reached", () => {
    expect(bestPosition(history)).toBe(9);
  });

  it("returns null rather than Infinity for an empty history", () => {
    expect(bestPosition([])).toBeNull();
  });

  it("reports no movement for a window shorter than two points", () => {
    expect(deltaOverWindow([{ date: "2026-06-01", position: 4 }])).toBe(0);
    expect(volatility([])).toBe(0);
  });

  it("measures volatility as mean absolute day-over-day movement", () => {
    // |14-18| + |9-14| + |11-9| = 4 + 5 + 2 = 11, over 3 steps.
    expect(volatility(history)).toBeCloseTo(11 / 3, 6);
  });

  it("reports zero volatility for a flat history", () => {
    expect(
      volatility([
        { date: "a", position: 5 },
        { date: "b", position: 5 },
        { date: "c", position: 5 },
      ]),
    ).toBe(0);
  });
});
