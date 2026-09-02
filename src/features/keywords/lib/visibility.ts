import { ctrAt, estimateClicks, MAX_CTR } from "./ctr-curve";
import type { Keyword } from "../types";

export interface VisibilityReport {
  /** 0–100. Share of the clicks this keyword set could earn at position 1. */
  score: number;
  /** Expected monthly organic clicks at current positions. */
  estimatedClicks: number;
  /** Clicks still on the table if every phrase reached position 1. */
  headroom: number;
  /** Keywords contributing zero clicks: unranked or buried. */
  invisible: number;
}

/**
 * Visibility as a share of *achievable* clicks, not an average of ranks.
 *
 * score = Σ(volume × ctr(position)) / Σ(volume × ctr(1))
 *
 * Because the denominator is fixed by the keyword set rather than by how you
 * happen to rank today, the number is comparable week over week and across
 * competitors tracking the same phrases. Adding a huge new keyword you rank
 * nowhere for correctly *drops* the score, and that is the point.
 */
export function visibilityScore(keywords: readonly Keyword[]): number {
  const ceiling = keywords.reduce((sum, kw) => sum + kw.volume * MAX_CTR, 0);
  if (ceiling === 0) return 0;
  const earned = keywords.reduce((sum, kw) => sum + estimateClicks(kw), 0);
  return round(Math.min(100, (earned / ceiling) * 100));
}

export function visibilityReport(keywords: readonly Keyword[]): VisibilityReport {
  const ceiling = keywords.reduce((sum, kw) => sum + kw.volume * MAX_CTR, 0);
  const earned = keywords.reduce((sum, kw) => sum + estimateClicks(kw), 0);
  return {
    score: ceiling === 0 ? 0 : round(Math.min(100, (earned / ceiling) * 100)),
    estimatedClicks: Math.round(earned),
    headroom: Math.round(Math.max(0, ceiling - earned)),
    invisible: keywords.filter((kw) => ctrAt(kw.position) === 0).length,
  };
}

/**
 * Visibility share per domain across the same keyword set. This is what makes
 * competitor comparison fair. Each domain is scored against the identical
 * ceiling, using wherever that domain appears in each keyword's SERP.
 */
export function competitiveVisibility(
  keywords: readonly Keyword[],
): { domain: string; score: number; keywords: number }[] {
  const ceiling = keywords.reduce((sum, kw) => sum + kw.volume * MAX_CTR, 0);
  if (ceiling === 0) return [];

  const earnedByDomain = new Map<string, { clicks: number; count: number }>();
  for (const keyword of keywords) {
    for (const result of keyword.serp) {
      const entry = earnedByDomain.get(result.domain) ?? { clicks: 0, count: 0 };
      entry.clicks += ctrAt(result.position) * keyword.volume;
      entry.count += 1;
      earnedByDomain.set(result.domain, entry);
    }
  }

  return [...earnedByDomain.entries()]
    .map(([domain, entry]) => ({
      domain,
      score: round((entry.clicks / ceiling) * 100),
      keywords: entry.count,
    }))
    .sort((a, b) => b.score - a.score);
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
