import type { Keyword } from "../types";
import { ctrAt, estimateClicks } from "./ctr-curve";

const COLUMNS = [
  "keyword",
  "position",
  "change",
  "best",
  "volume",
  "difficulty",
  "cpc_usd",
  "intent",
  "url",
  "serp_features",
  "estimated_clicks",
  "ctr",
] as const;

/**
 * RFC 4180 quoting: wrap in double quotes and double any embedded quote.
 * Keyword phrases routinely contain commas ("crm, free") and the odd quote,
 * and a naive join corrupts the file exactly where a spreadsheet stops warning
 * you about it.
 */
function escapeCell(value: string | number): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function keywordsToCsv(keywords: readonly Keyword[]): string {
  const rows = keywords.map((keyword) =>
    [
      keyword.phrase,
      keyword.position ?? "",
      keyword.delta,
      keyword.best,
      keyword.volume,
      keyword.difficulty,
      keyword.cpc.toFixed(2),
      keyword.intent,
      keyword.url,
      keyword.features.join(" "),
      Math.round(estimateClicks(keyword)),
      (ctrAt(keyword.position) * 100).toFixed(2),
    ]
      .map(escapeCell)
      .join(","),
  );
  // A leading BOM keeps Excel from mangling Turkish characters.
  return `﻿${COLUMNS.join(",")}\n${rows.join("\n")}\n`;
}

export function downloadCsv(keywords: readonly Keyword[], filename = "zirve-keywords.csv") {
  const blob = new Blob([keywordsToCsv(keywords)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
