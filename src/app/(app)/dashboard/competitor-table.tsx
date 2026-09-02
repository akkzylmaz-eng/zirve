"use client";

import { OWN_DOMAIN } from "@/data/keywords";
import { cn } from "@/lib/cn";

/**
 * Competitor visibility, derived from the same SERPs the keyword table shows.
 * Nothing here is stored: if a keyword's SERP changes, this changes with it.
 */
export function CompetitorTable({
  rows,
}: {
  rows: { domain: string; score: number; keywords: number }[];
}) {
  const leader = rows[0]?.score || 1;

  return (
    <ul className="ruled">
      {rows.map((row) => {
        const isYou = row.domain === OWN_DOMAIN;
        return (
          <li
            key={row.domain}
            className={cn("px-4 py-2.5", isYou && "bg-primary-soft")}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span
                className={cn(
                  "truncate text-[13px]",
                  isYou ? "font-semibold text-primary" : "font-medium",
                )}
              >
                {row.domain}
              </span>
              <span className="numeric shrink-0 text-[13px] font-semibold">
                {row.score}%
              </span>
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(row.score / leader) * 100}%`,
                  background: isYou ? "var(--color-primary)" : "var(--color-band-4)",
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
