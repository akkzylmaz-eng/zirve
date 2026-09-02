import type { Keyword } from "../types";
import { estimateClicks } from "./ctr-curve";

/**
 * Keyword cannibalization detector.
 *
 * Cannibalization is when several of your own pages compete for the same
 * intent. Google then has to choose between them, usually picks the weaker
 * one, and splits the links and relevance signals that should have gone to a
 * single page. It is one of the highest-value findings in an SEO audit and
 * almost never visible from a rank table alone, because each row looks fine on
 * its own; you only see it by grouping the set by intent.
 *
 * Zirve clusters phrases by their significant-token overlap (Jaccard over
 * stopword-stripped tokens) and flags a cluster when its members resolve to
 * more than one URL on the tracked property.
 */

const STOPWORDS = new Set([
  // English
  "a", "an", "the", "for", "of", "to", "in", "on", "and", "or", "with", "best",
  "top", "free", "how", "what", "is", "are", "your", "my", "vs",
  // Turkish
  "ve", "ile", "için", "en", "bir", "bu", "nasıl", "nedir", "ne",
]);

export function tokenize(phrase: string): string[] {
  return phrase
    .toLowerCase()
    // NFC, not NFKD: decomposing "ö" into o + combining diaeresis lets the
    // punctuation strip below eat the mark and split the word into "yo netimi".
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

/** Overlap of two token sets: |A ∩ B| / |A ∪ B|. */
export function similarity(a: string, b: string): number {
  const left = new Set(tokenize(a));
  const right = new Set(tokenize(b));
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  const union = left.size + right.size - shared;
  return union === 0 ? 0 : shared / union;
}

export interface CannibalCluster {
  /** The highest-volume phrase in the cluster, used as its display name. */
  head: string;
  members: Keyword[];
  /** Distinct URLs on the tracked property competing for this intent. */
  urls: string[];
  /** Combined monthly volume at stake. */
  volume: number;
  /**
   * Clicks recoverable by consolidating: what the strongest member would earn
   * with the whole cluster's volume behind it, minus what the split earns now.
   */
  recoverableClicks: number;
}

const DEFAULT_THRESHOLD = 0.5;

/**
 * Single-link agglomerative clustering: a phrase joins a cluster if it is
 * similar enough to any member. That is deliberate: "crm software" and
 * "software for startups" should end up together when "crm software for
 * startups" bridges them.
 */
export function findCannibalization(
  keywords: readonly Keyword[],
  threshold: number = DEFAULT_THRESHOLD,
): CannibalCluster[] {
  const clusters: Keyword[][] = [];

  for (const keyword of keywords) {
    const match = clusters.find((cluster) =>
      cluster.some((member) => similarity(member.phrase, keyword.phrase) >= threshold),
    );
    if (match) match.push(keyword);
    else clusters.push([keyword]);
  }

  return clusters
    .map(toCluster)
    .filter((cluster) => cluster.urls.length > 1)
    .sort((a, b) => b.recoverableClicks - a.recoverableClicks);
}

function toCluster(members: Keyword[]): CannibalCluster {
  const urls = [...new Set(members.map((member) => member.url))];
  const volume = members.reduce((sum, member) => sum + member.volume, 0);
  const head = [...members].sort((a, b) => b.volume - a.volume)[0];

  const currentClicks = members.reduce((sum, member) => sum + estimateClicks(member), 0);
  const strongest = members.reduce((best, member) =>
    rankValue(member.position) < rankValue(best.position) ? member : best,
  );
  const consolidatedClicks = estimateClicks({
    position: strongest.position,
    volume,
    features: strongest.features,
  });

  return {
    head: head.phrase,
    members,
    urls,
    volume,
    recoverableClicks: Math.max(0, Math.round(consolidatedClicks - currentClicks)),
  };
}

function rankValue(position: number | null): number {
  return position === null ? Number.POSITIVE_INFINITY : position;
}
