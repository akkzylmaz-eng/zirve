import type { AuditIssue, CrawlSummary, IssueCategory, Severity } from "../types";
import { SEVERITY_ORDER } from "../types";

/**
 * Site health, 0–100.
 *
 * A raw issue count is a bad score: a site with 400 missing alt attributes
 * would read as catastrophic while one with three broken canonical tags on its
 * money pages reads as healthy. So health is penalty-based and normalised by
 * crawl size. It answers "what share of my pages carry a problem, weighted by
 * how much that problem costs me", which is stable as the site grows.
 */

/** Penalty per affected page, by severity. */
const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 1,
  warning: 0.35,
  notice: 0.1,
};

/** How steeply penalties translate into lost points. */
const SENSITIVITY = 120;

export function healthScore(issues: readonly AuditIssue[], crawl: CrawlSummary): number {
  if (crawl.pagesCrawled <= 0) return 100;

  const penalty = issues.reduce(
    (sum, issue) => sum + issue.affected * SEVERITY_WEIGHT[issue.severity],
    0,
  );
  // Share of the crawl carrying weighted problems, then damped so a site is
  // never driven to 0 by a single noisy rule.
  const ratio = penalty / crawl.pagesCrawled;
  const score = 100 - SENSITIVITY * (ratio / (1 + ratio));
  return Math.max(0, Math.min(100, Math.round(score)));
}

export type HealthGrade = "excellent" | "good" | "fair" | "poor";

export function gradeOf(score: number): HealthGrade {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 50) return "fair";
  return "poor";
}

export const GRADE_LABEL: Record<HealthGrade, { tr: string; en: string }> = {
  excellent: { tr: "Çok iyi", en: "Excellent" },
  good: { tr: "İyi", en: "Good" },
  fair: { tr: "Orta", en: "Fair" },
  poor: { tr: "Zayıf", en: "Poor" },
};

export function countBySeverity(
  issues: readonly AuditIssue[],
): Record<Severity, number> {
  const counts = Object.fromEntries(SEVERITY_ORDER.map((s) => [s, 0])) as Record<
    Severity,
    number
  >;
  for (const issue of issues) counts[issue.severity] += 1;
  return counts;
}

export function affectedBySeverity(
  issues: readonly AuditIssue[],
): Record<Severity, number> {
  const counts = Object.fromEntries(SEVERITY_ORDER.map((s) => [s, 0])) as Record<
    Severity,
    number
  >;
  for (const issue of issues) counts[issue.severity] += issue.affected;
  return counts;
}

/**
 * Fix order. Not simply "criticals first": a critical on two pages is worth
 * less than a warning on three hundred, and this ordering says so.
 */
export function prioritize(issues: readonly AuditIssue[]): AuditIssue[] {
  return [...issues].sort(
    (a, b) =>
      b.affected * SEVERITY_WEIGHT[b.severity] - a.affected * SEVERITY_WEIGHT[a.severity],
  );
}

/** How many points each issue is currently costing the score. */
export function impactOf(
  issue: AuditIssue,
  issues: readonly AuditIssue[],
  crawl: CrawlSummary,
): number {
  const without = issues.filter((candidate) => candidate.id !== issue.id);
  return Math.max(0, healthScore(without, crawl) - healthScore(issues, crawl));
}

export function groupByCategory(
  issues: readonly AuditIssue[],
): { category: IssueCategory; issues: AuditIssue[]; affected: number }[] {
  const groups = new Map<IssueCategory, AuditIssue[]>();
  for (const issue of issues) {
    groups.set(issue.category, [...(groups.get(issue.category) ?? []), issue]);
  }
  return [...groups.entries()]
    .map(([category, list]) => ({
      category,
      issues: prioritize(list),
      affected: list.reduce((sum, issue) => sum + issue.affected, 0),
    }))
    .sort((a, b) => b.affected - a.affected);
}
