"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import { timeAgo } from "@/lib/format/dates";
import type { ActivityEntry } from "@/data/workspace";
import { cn } from "@/lib/cn";

const TONE = {
  success: "bg-up",
  info: "bg-primary",
  warning: "bg-warn",
} as const;

export function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  const { t } = useLanguage();
  // Anchored to the fixture's own "now" so the relative times stay sensible.
  const now = new Date("2026-06-14T10:00:00Z");

  return (
    <ul className="ruled">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-start gap-2.5 px-4 py-2.5">
          <span
            className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", TONE[entry.tone])}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] leading-snug">
              <span className="font-medium">{entry.actor}</span>{" "}
              <span className="text-muted-foreground">{t(entry.action)}</span>{" "}
              <span className="numeric">{entry.target}</span>
            </p>
            <p className="numeric mt-0.5 text-[11px] text-muted-foreground">
              {timeAgo(entry.at, now)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
