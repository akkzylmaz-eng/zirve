"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/i18n/language-provider";
import { integer } from "@/lib/format/numbers";
import { timeAgo } from "@/lib/format/dates";
import { cn } from "@/lib/cn";
import {
  CATEGORY_LABEL,
  SEVERITY_LABEL,
  SEVERITY_ORDER,
  type AuditIssue,
  type CrawlSummary,
  type IssueCategory,
  type Severity,
} from "@/features/audit/types";
import { GRADE_LABEL, impactOf, type HealthGrade } from "@/features/audit/lib/health";

const SEVERITY_TONE: Record<Severity, "critical" | "warn" | "notice"> = {
  critical: "critical",
  warning: "warn",
  notice: "notice",
};

const GRADE_COLOR: Record<HealthGrade, string> = {
  excellent: "var(--color-up)",
  good: "var(--color-primary)",
  fair: "var(--color-warn)",
  poor: "var(--color-critical)",
};

export function AuditView({
  groups,
  allIssues,
  crawl,
  score,
  grade,
  affected,
}: {
  groups: { category: IssueCategory; issues: AuditIssue[]; affected: number }[];
  allIssues: AuditIssue[];
  crawl: CrawlSummary;
  score: number;
  grade: HealthGrade;
  affected: Record<Severity, number>;
}) {
  const { t, language } = useLanguage();
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const now = new Date("2026-06-14T10:00:00Z");

  const filtered = groups
    .map((group) => ({
      ...group,
      issues:
        severityFilter === "all"
          ? group.issues
          : group.issues.filter((issue) => issue.severity === severityFilter),
    }))
    .filter((group) => group.issues.length > 0);

  return (
    <div className="mx-auto max-w-[1100px] p-4 lg:p-6">
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Panel className="h-fit">
          <div className="flex flex-col items-center border-b border-border px-4 py-6">
            <HealthDial score={score} color={GRADE_COLOR[grade]} />
            <p className="mt-3 text-[13px] font-medium">
              {language === "tr" ? GRADE_LABEL[grade].tr : GRADE_LABEL[grade].en}
            </p>
            <p className="numeric mt-1 text-[11.5px] text-muted-foreground">
              {integer(crawl.pagesCrawled)}{" "}
              {language === "tr" ? "sayfa · " : "pages · "}
              {timeAgo(crawl.crawledAt, now)}
            </p>
          </div>

          <ul className="ruled">
            <FilterRow
              active={severityFilter === "all"}
              onClick={() => setSeverityFilter("all")}
              label={language === "tr" ? "Tümü" : "All"}
              count={Object.values(affected).reduce((a, b) => a + b, 0)}
            />
            {SEVERITY_ORDER.map((severity) => (
              <FilterRow
                key={severity}
                active={severityFilter === severity}
                onClick={() =>
                  setSeverityFilter(severityFilter === severity ? "all" : severity)
                }
                label={t(SEVERITY_LABEL[severity])}
                count={affected[severity]}
                tone={SEVERITY_TONE[severity]}
              />
            ))}
          </ul>

          <p className="border-t border-border px-4 py-3 text-[11.5px] leading-relaxed text-muted-foreground">
            {language === "tr"
              ? "Sağlık puanı, tarama boyutuna göre normalize edilmiş ağırlıklı bir cezadır; ham bulgu sayısı değil."
              : "Health is a weighted penalty normalised by crawl size, not a raw issue count."}
          </p>
        </Panel>

        <div className="flex flex-col gap-4">
          {filtered.map((group) => (
            <Panel key={group.category}>
              <PanelHeader
                title={t(CATEGORY_LABEL[group.category])}
                hint={`${integer(group.affected)} ${
                  language === "tr" ? "etkilenen sayfa" : "affected pages"
                }`}
              />
              <ul className="ruled">
                {group.issues.map((issue) => (
                  <IssueRow
                    key={issue.id}
                    issue={issue}
                    impact={impactOf(issue, allIssues, crawl)}
                  />
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterRow({
  active,
  onClick,
  label,
  count,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  tone?: "critical" | "warn" | "notice";
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-[13px] transition-colors",
          active ? "bg-primary-soft font-medium text-primary" : "hover:bg-muted",
        )}
      >
        <span className="flex items-center gap-2">
          {tone ? (
            <span
              className="h-2 w-2 rounded-[2px]"
              style={{ background: `var(--color-${tone === "warn" ? "warn" : tone})` }}
            />
          ) : null}
          {label}
        </span>
        <span className="numeric text-[12.5px]">{integer(count)}</span>
      </button>
    </li>
  );
}

/** Expandable so the fix guidance is one click away but never in the way. */
function IssueRow({ issue, impact }: { issue: AuditIssue; impact: number }) {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        className="row-hover flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
      >
        <Badge tone={SEVERITY_TONE[issue.severity]} className="shrink-0">
          {t(SEVERITY_LABEL[issue.severity])}
        </Badge>
        <span className="min-w-0 flex-1 text-[13px] font-medium">{t(issue.title)}</span>
        <span className="numeric shrink-0 text-[12.5px] text-muted-foreground">
          {integer(issue.affected)}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="border-t border-border bg-muted/40 px-4 py-3">
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">
            {t(issue.guidance)}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <span className="numeric text-[11.5px] text-muted-foreground">
              {language === "tr" ? "Örnek: " : "Example: "}
              <span className="text-foreground">{issue.sample}</span>
            </span>
            {impact > 0 ? (
              <span className="text-[11.5px] text-muted-foreground">
                {language === "tr"
                  ? `Sağlık puanından ${impact} puan`
                  : `${impact} points of health`}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </li>
  );
}

/** A ring rather than a bar: the score is a single value, not a comparison. */
function HealthDial({ score, color }: { score: number; color: string }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox="0 0 104 104" className="h-28 w-28" role="img" aria-label={`Health ${score}`}>
      <circle
        cx="52"
        cy="52"
        r={radius}
        fill="none"
        stroke="var(--color-muted)"
        strokeWidth="8"
      />
      <circle
        cx="52"
        cy="52"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - score / 100)}
        transform="rotate(-90 52 52)"
      />
      <text
        x="52"
        y="59"
        textAnchor="middle"
        className="numeric"
        fontSize="26"
        fontWeight="600"
        fill="var(--color-foreground)"
      >
        {score}
      </text>
    </svg>
  );
}
