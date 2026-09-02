/**
 * Organic click-through rate by Google position.
 *
 * Zirve does not treat "average position" as a success metric, because averaging
 * ranks weights a #1 for a 50-volume phrase the same as a #40 for a 90k one.
 * Instead every headline number is built on this curve, so a position is only
 * ever worth the clicks it can actually earn.
 *
 * The shape is the widely reproduced desktop organic curve: a steep drop from
 * #1 to #3, a long shallow tail through page one, and near-zero past position
 * 20. Swap these numbers for your own Search Console data when you have it;
 * `estimateClicks` and `visibilityScore` pick the change up automatically.
 */

/** Positions 1–20, as click share of total searches. */
const CURVE: readonly number[] = [
  0.276, 0.158, 0.110, 0.084, 0.063, 0.049, 0.039, 0.033, 0.028, 0.024,
  0.0190, 0.0164, 0.0142, 0.0125, 0.0112, 0.0101, 0.0092, 0.0085, 0.0079, 0.0074,
];

/** Positions past the curve still earn a trickle; it decays toward zero. */
const TAIL_AT_21 = 0.0069;
const TAIL_DECAY = 0.94;

/** The best CTR any keyword can reach: the denominator of visibility. */
export const MAX_CTR = CURVE[0];

/**
 * How much of a SERP's clicks a given position earns.
 * `null` (unranked) and positions past ~100 earn nothing.
 */
export function ctrAt(position: number | null): number {
  if (position === null || !Number.isFinite(position) || position < 1) return 0;
  const rank = Math.round(position);
  if (rank <= CURVE.length) return CURVE[rank - 1];
  if (rank > 100) return 0;
  return TAIL_AT_21 * Math.pow(TAIL_DECAY, rank - 21);
}

/**
 * SERP features push the organic block down the page. A featured snippet or a
 * shopping carousel above the fold measurably suppresses clicks on the classic
 * blue links, unless *you* own the snippet, which the caller signals by
 * passing `ownsFeatured`.
 */
const FEATURE_SUPPRESSION: Record<string, number> = {
  featured: 0.82,
  shopping: 0.88,
  video: 0.93,
  local: 0.85,
  people: 0.96,
  image: 0.95,
  sitelinks: 1,
};

export function suppressionFactor(
  features: readonly string[],
  ownsFeatured = false,
): number {
  return features.reduce((factor, feature) => {
    if (feature === "featured" && ownsFeatured) return factor;
    return factor * (FEATURE_SUPPRESSION[feature] ?? 1);
  }, 1);
}

/** Expected monthly organic clicks for one keyword at its current position. */
export function estimateClicks(input: {
  position: number | null;
  volume: number;
  features?: readonly string[];
}): number {
  const base = ctrAt(input.position) * input.volume;
  const ownsFeatured = input.position === 1;
  return base * suppressionFactor(input.features ?? [], ownsFeatured);
}
