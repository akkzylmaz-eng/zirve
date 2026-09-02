"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import { Badge } from "@/components/ui/badge";
import { integer } from "@/lib/format/numbers";
import { impactOf } from "@/features/audit/lib/health";
import type { AuditIssue, CrawlSummary, Severity } from "@/features/audit/types";

const SEVERITY_TONE: Record<Severity, "critical" | "warn" | "notice"> = {
  critical: "critical",
  warning: "warn",
  notice: "notice",
};

export function AuditPreview({
  issues,
  allIssues,
  crawl,
}: {
  issues: AuditIssue[];
  allIssues: AuditIssue[];
  crawl: CrawlSummary;
}) {
  const { t, language } = useLanguage();

  return (
    <ul className="ruled">
      {issues.map((issue) => {
        const impact = impactOf(issue, allIssues, crawl);
        return (
          <li key={issue.id} className="px-4 py-2.5">
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 flex-1 text-[12.5px] font-medium leading-snug">
                {t(issue.title)}
              </p>
              <Badge tone={SEVERITY_TONE[issue.severity]} className="shrink-0">
                {integer(issue.affected)}
              </Badge>
            </div>
            {impact > 0 ? (
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                {language === "tr"
                  ? `Sağlık puanından ${impact} puan götürüyor`
                  : `Costing ${impact} points of health`}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
