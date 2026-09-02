import Link from "next/link";
import type { Metadata } from "next";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { TrendLine } from "@/components/charts/trend-line";
import { keywords } from "@/data/keywords";
import { auditIssues, crawl } from "@/data/audit";
import { visibilityHistory, activity } from "@/data/workspace";
import { OWN_DOMAIN } from "@/data/keywords";
import {
  competitiveVisibility,
  visibilityReport,
} from "@/features/keywords/lib/visibility";
import { distribution } from "@/features/keywords/lib/distribution";
import { findCannibalization } from "@/features/keywords/lib/cannibalization";
import { rankOpportunities } from "@/features/keywords/lib/opportunities";
import { healthScore, gradeOf, prioritize } from "@/features/audit/lib/health";
import { DistributionPanel } from "./distribution-panel";
import { OverviewStats } from "./overview-stats";
import { CannibalizationList } from "@/features/keywords/components/cannibalization-list";
import { OpportunityList } from "./opportunity-list";
import { CompetitorTable } from "./competitor-table";
import { ActivityFeed } from "./activity-feed";
import { AuditPreview } from "./audit-preview";

export const metadata: Metadata = { title: "Overview" };

/**
 * A server component: every number below is derived from the fixtures at
 * request time by the same pure functions the tests cover, so nothing is
 * precomputed and nothing can drift out of sync with the keyword table.
 */
export default function DashboardPage() {
  const report = visibilityReport(keywords);
  const slices = distribution(keywords);
  const clusters = findCannibalization(keywords);
  const opportunities = rankOpportunities(keywords, 5);
  const health = healthScore(auditIssues, crawl);
  const competitors = competitiveVisibility(keywords).slice(0, 6);
  const topIssues = prioritize(auditIssues).slice(0, 4);

  const trend = visibilityHistory.map((point) => ({
    label: point.label,
    value: point.score,
  }));

  return (
    <div className="mx-auto max-w-[1400px] p-4 lg:p-6">
      <OverviewStats
        report={report}
        health={health}
        grade={gradeOf(health)}
        trackedCount={keywords.length}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader
            title="Visibility"
            hint="Share of the clicks this keyword set could earn at position 1."
            action={
              <Badge tone="up">
                +{(trend.at(-1)!.value - trend[0].value).toFixed(1)}pt
              </Badge>
            }
          />
          <div className="p-4">
            <TrendLine points={trend} height={200} valueSuffix="%" />
          </div>
        </Panel>

        <DistributionPanel slices={slices} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader
            title="Cannibalization"
            hint="Your own pages competing for one intent."
            action={
              clusters.length > 0 ? (
                <Badge tone="warn">{clusters.length}</Badge>
              ) : (
                <Badge tone="up">clear</Badge>
              )
            }
          />
          <CannibalizationList clusters={clusters} />
        </Panel>

        <Panel>
          <PanelHeader
            title="Next moves"
            hint="Ranked by reachable upside, not raw volume."
          />
          <OpportunityList opportunities={opportunities} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel>
          <PanelHeader
            title="Competitors"
            hint={`Scored on your keyword set, ${OWN_DOMAIN} included.`}
          />
          <CompetitorTable rows={competitors} />
        </Panel>

        <Panel>
          <PanelHeader
            title="Top findings"
            hint="Ordered by what each issue costs the score."
            action={
              <Link
                href="/audit"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline"
              >
                Audit <Icon name="arrow-right" className="h-3 w-3" />
              </Link>
            }
          />
          <AuditPreview issues={topIssues} crawl={crawl} allIssues={auditIssues} />
        </Panel>

        <Panel>
          <PanelHeader title="Activity" hint="What ran, and when." />
          <ActivityFeed entries={activity} />
        </Panel>
      </div>
    </div>
  );
}
