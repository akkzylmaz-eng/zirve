import type { Keyword, SearchIntent } from "../types";
import { bucketOf, type Bucket } from "./distribution";
import { trendOf } from "./rank";

export type SortKey =
  | "position"
  | "delta"
  | "volume"
  | "difficulty"
  | "phrase"
  | "opportunity";

export type SortDirection = "asc" | "desc";

export interface KeywordQuery {
  search: string;
  group: string;
  bucket: Bucket | "all";
  intent: SearchIntent | "all";
  trend: "all" | "climbed" | "dropped" | "flat";
  sort: SortKey;
  direction: SortDirection;
}

export const DEFAULT_QUERY: KeywordQuery = {
  search: "",
  group: "all",
  bucket: "all",
  intent: "all",
  trend: "all",
  sort: "position",
  direction: "asc",
};

/**
 * The keyword view is fully described by this query object, and the query is
 * mirrored into the URL, so any filtered view is a link somebody can paste
 * into Slack and land on exactly what you were looking at.
 */
export function parseQuery(params: URLSearchParams): KeywordQuery {
  return {
    search: params.get("q") ?? DEFAULT_QUERY.search,
    group: params.get("group") ?? DEFAULT_QUERY.group,
    bucket: (params.get("bucket") as Bucket | "all") ?? DEFAULT_QUERY.bucket,
    intent: (params.get("intent") as SearchIntent | "all") ?? DEFAULT_QUERY.intent,
    trend: (params.get("trend") as KeywordQuery["trend"]) ?? DEFAULT_QUERY.trend,
    sort: (params.get("sort") as SortKey) ?? DEFAULT_QUERY.sort,
    direction: (params.get("dir") as SortDirection) ?? DEFAULT_QUERY.direction,
  };
}

/** Only non-default values are serialized, so clean views get clean URLs. */
export function serializeQuery(query: KeywordQuery): string {
  const params = new URLSearchParams();
  const put = (key: string, value: string, fallback: string) => {
    if (value && value !== fallback) params.set(key, value);
  };
  put("q", query.search, DEFAULT_QUERY.search);
  put("group", query.group, DEFAULT_QUERY.group);
  put("bucket", query.bucket, DEFAULT_QUERY.bucket);
  put("intent", query.intent, DEFAULT_QUERY.intent);
  put("trend", query.trend, DEFAULT_QUERY.trend);
  put("sort", query.sort, DEFAULT_QUERY.sort);
  put("dir", query.direction, DEFAULT_QUERY.direction);
  return params.toString();
}

export function applyQuery(
  keywords: readonly Keyword[],
  query: KeywordQuery,
): Keyword[] {
  const needle = query.search.trim().toLowerCase();

  const filtered = keywords.filter((keyword) => {
    if (needle && !matches(keyword, needle)) return false;
    if (query.group !== "all" && keyword.group !== query.group) return false;
    if (query.bucket !== "all" && bucketOf(keyword.position) !== query.bucket) return false;
    if (query.intent !== "all" && keyword.intent !== query.intent) return false;
    if (query.trend !== "all" && trendOf(keyword.delta) !== query.trend) return false;
    return true;
  });

  return sortKeywords(filtered, query.sort, query.direction);
}

function matches(keyword: Keyword, needle: string): boolean {
  return (
    keyword.phrase.toLowerCase().includes(needle) ||
    keyword.url.toLowerCase().includes(needle)
  );
}

export function sortKeywords(
  keywords: readonly Keyword[],
  sort: SortKey,
  direction: SortDirection,
): Keyword[] {
  const factor = direction === "asc" ? 1 : -1;
  return [...keywords].sort((a, b) => factor * compare(a, b, sort));
}

function compare(a: Keyword, b: Keyword, sort: SortKey): number {
  switch (sort) {
    case "phrase":
      return a.phrase.localeCompare(b.phrase);
    case "delta":
      return a.delta - b.delta;
    case "volume":
      return a.volume - b.volume;
    case "difficulty":
      return a.difficulty - b.difficulty;
    case "opportunity":
      // Highest volume sitting at the worst position first.
      return b.volume * rankWeight(b.position) - a.volume * rankWeight(a.position);
    case "position":
    default:
      // Unranked always sorts last regardless of direction intent.
      return rankValue(a.position) - rankValue(b.position);
  }
}

function rankValue(position: number | null): number {
  return position === null ? Number.MAX_SAFE_INTEGER : position;
}

function rankWeight(position: number | null): number {
  return position === null ? 1 : Math.min(1, position / 20);
}
