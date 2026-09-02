import type { Localized } from "@/lib/i18n/config";

/**
 * Rank semantics used across Zirve:
 * a LOWER position number is better. Position 1 is the top of page one.
 * A `delta` is the change in position, so a NEGATIVE delta means the keyword
 * climbed. Every chart and badge in the app encodes that inversion.
 */

export type SerpFeature =
  | "featured"
  | "image"
  | "video"
  | "people"
  | "sitelinks"
  | "shopping"
  | "local";

export type SearchIntent =
  | "informational"
  | "commercial"
  | "transactional"
  | "navigational";

export interface RankPoint {
  /** ISO day, e.g. "2026-06-14". */
  date: string;
  /** Google position recorded that day. Lower is better. */
  position: number;
}

export interface SerpResult {
  domain: string;
  url: string;
  position: number;
}

export interface Keyword {
  id: string;
  phrase: string;
  /** Current position. Lower is better. `null` means outside the tracked window. */
  position: number | null;
  /** Change since the previous check. Negative = climbed. */
  delta: number;
  /** Best position ever recorded for this phrase. */
  best: number;
  /** Estimated monthly search volume. */
  volume: number;
  /** Keyword difficulty, 0–100. */
  difficulty: number;
  /** Estimated cost per click in USD. */
  cpc: number;
  intent: SearchIntent;
  /** The URL on the tracked property that currently ranks. */
  url: string;
  features: SerpFeature[];
  /** Free-form grouping, e.g. "core" / "blog". */
  group: string;
  history: RankPoint[];
  serp: SerpResult[];
}

export interface KeywordGroup {
  key: string;
  label: Localized;
}

export const SERP_FEATURE_LABEL: Record<SerpFeature, Localized> = {
  featured: { tr: "Öne çıkan snippet", en: "Featured snippet" },
  image: { tr: "Görsel paketi", en: "Image pack" },
  video: { tr: "Video", en: "Video" },
  people: { tr: "İnsanlar şunu da sordu", en: "People also ask" },
  sitelinks: { tr: "Site bağlantıları", en: "Sitelinks" },
  shopping: { tr: "Alışveriş", en: "Shopping" },
  local: { tr: "Yerel paket", en: "Local pack" },
};

export const INTENT_LABEL: Record<SearchIntent, Localized> = {
  informational: { tr: "Bilgi", en: "Informational" },
  commercial: { tr: "Ticari", en: "Commercial" },
  transactional: { tr: "İşlem", en: "Transactional" },
  navigational: { tr: "Yön bulma", en: "Navigational" },
};
