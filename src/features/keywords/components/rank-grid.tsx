"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import { MicroTrend } from "@/components/charts/micro-trend";
import { compact, integer } from "@/lib/format/numbers";
import { cn } from "@/lib/cn";
import { INTENT_LABEL, type Keyword } from "../types";
import { estimateClicks } from "../lib/ctr-curve";
import { trendOf } from "../lib/rank";
import type { SortDirection, SortKey } from "../lib/filters";
import { PositionDelta, PositionValue } from "./position-delta";

interface Column {
  key: SortKey | "trend" | "features";
  labelKey: keyof ReturnType<typeof useLanguage>["ui"];
  align: "left" | "right" | "center";
  sortable: boolean;
  /** Hidden below this breakpoint to keep the row readable on a phone. */
  hideBelow?: "sm" | "md" | "lg" | "xl";
}

const COLUMNS: Column[] = [
  { key: "phrase", labelKey: "keyword", align: "left", sortable: true },
  { key: "position", labelKey: "position", align: "right", sortable: true },
  { key: "delta", labelKey: "change", align: "right", sortable: true },
  { key: "trend", labelKey: "trend", align: "center", sortable: false, hideBelow: "lg" },
  { key: "volume", labelKey: "volume", align: "right", sortable: true, hideBelow: "sm" },
  { key: "difficulty", labelKey: "difficulty", align: "right", sortable: true, hideBelow: "md" },
  { key: "opportunity", labelKey: "clicks", align: "right", sortable: true, hideBelow: "xl" },
  { key: "features", labelKey: "url", align: "left", sortable: false, hideBelow: "xl" },
];

const HIDE_CLASS = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
} as const;

/**
 * The dense rank table. It is a real <table> rather than a grid of divs so the
 * column headers stay associated with their cells for screen readers and so a
 * user can select and copy a block of it straight into a spreadsheet.
 */
export function RankGrid({
  keywords,
  sort,
  direction,
  onSort,
  onSelect,
  selectedId,
}: {
  keywords: Keyword[];
  sort: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
  onSelect: (keyword: Keyword) => void;
  selectedId?: string;
}) {
  const { ui, t } = useLanguage();

  if (keywords.length === 0) {
    return (
      <div className="px-4 py-14 text-center text-[13px] text-muted-foreground">
        {ui.noResults}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-border">
            {COLUMNS.map((column) => {
              const isSorted = column.sortable && sort === column.key;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    isSorted
                      ? direction === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  className={cn(
                    "whitespace-nowrap px-3 py-2 font-medium",
                    column.align === "right" && "text-right",
                    column.align === "center" && "text-center",
                    column.align === "left" && "text-left",
                    column.hideBelow && HIDE_CLASS[column.hideBelow],
                  )}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort(column.key as SortKey)}
                      className={cn(
                        "eyebrow cursor-pointer transition-colors hover:text-foreground",
                        isSorted && "text-foreground",
                      )}
                    >
                      {ui[column.labelKey]}
                      {isSorted ? (
                        <span aria-hidden className="ml-1">
                          {direction === "asc" ? "↑" : "↓"}
                        </span>
                      ) : null}
                    </button>
                  ) : (
                    <span className="eyebrow">{ui[column.labelKey]}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {keywords.map((keyword) => {
            const history = keyword.history.map((point) => point.position);
            const trend = trendOf(keyword.delta);

            return (
              <tr
                key={keyword.id}
                onClick={() => onSelect(keyword)}
                className={cn(
                  "row-hover cursor-pointer border-b border-border last:border-0",
                  selectedId === keyword.id && "bg-primary-soft",
                )}
              >
                <td className="max-w-[280px] px-3 py-2">
                  <p className="truncate font-medium">{keyword.phrase}</p>
                  <p className="numeric truncate text-[11.5px] text-muted-foreground">
                    {keyword.url}
                  </p>
                </td>

                <td className="px-3 py-2 text-right">
                  <PositionValue position={keyword.position} />
                </td>

                <td className="px-3 py-2 text-right">
                  <PositionDelta delta={keyword.delta} />
                </td>

                <td className={cn("px-3 py-2 text-center", HIDE_CLASS.lg)}>
                  <MicroTrend
                    values={history}
                    invert
                    tone={
                      trend === "climbed"
                        ? "var(--color-up)"
                        : trend === "dropped"
                          ? "var(--color-down)"
                          : "var(--color-flat)"
                    }
                    className="inline-block align-middle"
                  />
                </td>

                <td className={cn("numeric px-3 py-2 text-right", HIDE_CLASS.sm)}>
                  {compact(keyword.volume)}
                </td>

                <td className={cn("px-3 py-2 text-right", HIDE_CLASS.md)}>
                  <DifficultyMeter value={keyword.difficulty} />
                </td>

                <td className={cn("numeric px-3 py-2 text-right", HIDE_CLASS.xl)}>
                  {integer(estimateClicks(keyword))}
                </td>

                <td className={cn("px-3 py-2", HIDE_CLASS.xl)}>
                  <span className="text-[11.5px] text-muted-foreground">
                    {t(INTENT_LABEL[keyword.intent])}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Difficulty as a number plus a bar; the bar is what gets read at a glance. */
function DifficultyMeter({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center justify-end gap-1.5">
      <span className="numeric text-[12.5px]">{value}</span>
      <span className="h-1 w-8 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full rounded-full"
          style={{
            width: `${value}%`,
            background:
              value >= 70
                ? "var(--color-critical)"
                : value >= 45
                  ? "var(--color-warn)"
                  : "var(--color-up)",
          }}
        />
      </span>
    </span>
  );
}
