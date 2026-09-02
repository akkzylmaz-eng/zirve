import type { RankPoint } from "../types";

/**
 * The single place that knows "lower position = better". Anything in the UI
 * that needs to colour or describe a movement goes through here, so the
 * inversion is never re-derived (and never got backwards) at the call site.
 */

export type RankTrend = "climbed" | "dropped" | "flat";

/** A keyword climbed when its position NUMBER went down. */
export function trendOf(delta: number): RankTrend {
  if (delta < 0) return "climbed";
  if (delta > 0) return "dropped";
  return "flat";
}

export function hasImproved(delta: number): boolean {
  return trendOf(delta) === "climbed";
}

/**
 * Human-readable delta. We always print the magnitude with a direction arrow
 * rather than the raw signed integer, because "-3" reads as a loss to most
 * people while it is in fact a three-position gain.
 */
export function formatDelta(delta: number): string {
  if (delta === 0) return "0";
  return `${delta < 0 ? "▲" : "▼"}${Math.abs(delta)}`;
}

/** Change between the first and last point of a history window. */
export function deltaOverWindow(history: RankPoint[]): number {
  if (history.length < 2) return 0;
  return history[history.length - 1].position - history[0].position;
}

/**
 * Best (lowest) position in a history window. Returns null for an empty window
 * rather than Infinity, so callers must handle "no data" explicitly.
 */
export function bestPosition(history: RankPoint[]): number | null {
  if (history.length === 0) return null;
  return history.reduce((best, point) => Math.min(best, point.position), Infinity);
}

/**
 * Volatility = mean absolute day-over-day movement. High volatility usually
 * means the SERP itself is unstable rather than the page getting better or
 * worse, so the UI uses it to soften alerts.
 */
export function volatility(history: RankPoint[]): number {
  if (history.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < history.length; i++) {
    total += Math.abs(history[i].position - history[i - 1].position);
  }
  return total / (history.length - 1);
}
