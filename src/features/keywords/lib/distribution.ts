import type { Localized } from "@/lib/i18n/config";
import type { Keyword } from "../types";

/**
 * Position buckets. SEO reporting lives on these bands rather than raw ranks
 * because the value of a move is wildly non-linear: 11 → 9 crosses onto page
 * one and roughly doubles clicks, while 44 → 42 changes nothing.
 */
export type Bucket = "top3" | "top10" | "top20" | "top50" | "beyond" | "unranked";

export const BUCKET_ORDER: readonly Bucket[] = [
  "top3",
  "top10",
  "top20",
  "top50",
  "beyond",
  "unranked",
];

export const BUCKET_LABEL: Record<Bucket, Localized> = {
  top3: { tr: "İlk 3", en: "Top 3" },
  top10: { tr: "4–10", en: "4–10" },
  top20: { tr: "11–20", en: "11–20" },
  top50: { tr: "21–50", en: "21–50" },
  beyond: { tr: "50+", en: "50+" },
  unranked: { tr: "Sırasız", en: "Unranked" },
};

/** CSS custom properties, defined in globals.css, one tone per band. */
export const BUCKET_TONE: Record<Bucket, string> = {
  top3: "var(--color-band-1)",
  top10: "var(--color-band-2)",
  top20: "var(--color-band-3)",
  top50: "var(--color-band-4)",
  beyond: "var(--color-band-5)",
  unranked: "var(--color-band-6)",
};

export function bucketOf(position: number | null): Bucket {
  if (position === null || !Number.isFinite(position)) return "unranked";
  if (position <= 3) return "top3";
  if (position <= 10) return "top10";
  if (position <= 20) return "top20";
  if (position <= 50) return "top50";
  return "beyond";
}

export interface BucketSlice {
  bucket: Bucket;
  count: number;
  /** Share of the whole set, 0–100. */
  share: number;
}

/** Every bucket is always present, so the stacked bar never changes shape. */
export function distribution(keywords: readonly Keyword[]): BucketSlice[] {
  const counts = new Map<Bucket, number>(BUCKET_ORDER.map((b) => [b, 0]));
  for (const keyword of keywords) {
    const bucket = bucketOf(keyword.position);
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  }
  const total = keywords.length || 1;
  return BUCKET_ORDER.map((bucket) => {
    const count = counts.get(bucket) ?? 0;
    return { bucket, count, share: (count / total) * 100 };
  });
}

/** Net movement between buckets across a period: the "who crossed a line" view. */
export function bucketMovement(keywords: readonly Keyword[]): {
  entered: Record<Bucket, number>;
  left: Record<Bucket, number>;
} {
  const entered = blank();
  const left = blank();
  for (const keyword of keywords) {
    if (keyword.position === null) continue;
    // delta = current - previous, so previous = current - delta.
    const previous = bucketOf(keyword.position - keyword.delta);
    const current = bucketOf(keyword.position);
    if (previous !== current) {
      entered[current] += 1;
      left[previous] += 1;
    }
  }
  return { entered, left };
}

function blank(): Record<Bucket, number> {
  return Object.fromEntries(BUCKET_ORDER.map((b) => [b, 0])) as Record<Bucket, number>;
}
