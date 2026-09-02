import type { Metadata } from "next";
import { auditIssues, crawl } from "@/data/audit";
import {
  affectedBySeverity,
  gradeOf,
  groupByCategory,
  healthScore,
} from "@/features/audit/lib/health";
import { AuditView } from "./audit-view";

export const metadata: Metadata = { title: "Audit" };

export default function AuditPage() {
  const score = healthScore(auditIssues, crawl);

  return (
    <AuditView
      groups={groupByCategory(auditIssues)}
      allIssues={auditIssues}
      crawl={crawl}
      score={score}
      grade={gradeOf(score)}
      affected={affectedBySeverity(auditIssues)}
    />
  );
}
