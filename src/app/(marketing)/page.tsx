import { keywords } from "@/data/keywords";
import { auditIssues, crawl } from "@/data/audit";
import { visibilityReport } from "@/features/keywords/lib/visibility";
import { distribution } from "@/features/keywords/lib/distribution";
import { findCannibalization } from "@/features/keywords/lib/cannibalization";
import { healthScore } from "@/features/audit/lib/health";
import { LandingPage } from "./landing";

/**
 * The landing page is fed by the same fixtures and the same pure functions the
 * product runs on, so the numbers in the marketing copy cannot be
 * aspirational; they are whatever the demo workspace actually computes.
 */
export default function Home() {
  return (
    <LandingPage
      report={visibilityReport(keywords)}
      slices={distribution(keywords)}
      clusters={findCannibalization(keywords).length}
      health={healthScore(auditIssues, crawl)}
      keywordCount={keywords.length}
    />
  );
}
