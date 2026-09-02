import type { Keyword } from "../types";
import { estimateClicks } from "./ctr-curve";

export interface Opportunity {
  keyword: Keyword;
  /** Extra monthly clicks if this phrase reached position 3. */
  upside: number;
  /** 0–100. Upside weighted by how reachable the target is. */
  score: number;
  reason: OpportunityReason;
}

export type OpportunityReason =
  | "striking-distance"
  | "page-two"
  | "slipping"
  | "untapped";

/** Target we score against: top 3 is where the CTR curve stops being brutal. */
const TARGET_POSITION = 3;

/**
 * Which keyword deserves the next hour of work?
 *
 * Raw volume answers that badly; it always points at the impossible head
 * term. This ranks by *reachable* upside instead: the clicks a realistic move
 * to the top 3 would add, discounted by difficulty and by how far the phrase
 * has to travel. Positions 4–20 dominate the result on purpose; that band is
 * where a single content refresh actually moves the number.
 */
export function rankOpportunities(
  keywords: readonly Keyword[],
  limit = 8,
): Opportunity[] {
  return keywords
    .filter((keyword) => keyword.position !== null && keyword.position > TARGET_POSITION)
    .map(scoreKeyword)
    .filter((opportunity) => opportunity.upside > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function scoreKeyword(keyword: Keyword): Opportunity {
  const current = estimateClicks(keyword);
  const potential = estimateClicks({
    position: TARGET_POSITION,
    volume: keyword.volume,
    features: keyword.features,
  });
  const upside = Math.max(0, Math.round(potential - current));

  const score = upside * reachability(keyword);

  return { keyword, upside, score: Math.round(score), reason: reasonFor(keyword) };
}

/**
 * Rough odds of actually reaching the top 3, in 0–1.
 *
 * This is the part that has to be steep. A logarithmic distance penalty is far
 * too gentle: it lets a position-70 head term with huge raw upside outrank a
 * position-6 phrase you could win this quarter, which is exactly the advice
 * that wastes a content team's year. The quadratic falloff means everything
 * past page two is discounted almost to nothing.
 */
function reachability(keyword: Keyword): number {
  const position = keyword.position ?? 100;
  const distance = Math.max(0, position - TARGET_POSITION);
  // Half-weight at ~6 positions out, near-zero past page two.
  const distanceFactor = 1 / (1 + (distance / 6) ** 2);
  // Difficulty 0 → 1.0, difficulty 100 → 0.29.
  const difficultyFactor = Math.max(0.1, 1 - keyword.difficulty / 140);
  return distanceFactor * difficultyFactor;
}

function reasonFor(keyword: Keyword): OpportunityReason {
  const position = keyword.position ?? 100;
  if (keyword.delta > 2) return "slipping";
  if (position <= 10) return "striking-distance";
  if (position <= 20) return "page-two";
  return "untapped";
}

export const REASON_LABEL: Record<OpportunityReason, { tr: string; en: string }> = {
  "striking-distance": { tr: "Bir adım kaldı", en: "Striking distance" },
  "page-two": { tr: "İkinci sayfa", en: "Page two" },
  slipping: { tr: "Düşüşte", en: "Slipping" },
  untapped: { tr: "Değerlendirilmemiş", en: "Untapped" },
};
