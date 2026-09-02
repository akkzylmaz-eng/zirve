/**
 * Bundled keyword fixtures: what Zirve renders when no data source is wired
 * up. The set is deliberately not tidy: it contains unranked phrases, two
 * genuine cannibalization clusters (project-management and CRM pages competing
 * with themselves) and a spread across every position bucket, so the audit,
 * distribution and opportunity views all have something real to say.
 *
 * Replace this module with your DataForSEO / Search Console reader and the
 * rest of the app is unchanged; everything downstream consumes `Keyword[]`.
 */
import type { Keyword, KeywordGroup, RankPoint } from "@/features/keywords/types";

const HISTORY_DAYS = 14;
const HISTORY_END = new Date("2026-06-14T00:00:00Z");

/**
 * Deterministic pseudo-random noise. Fixtures must be byte-identical between
 * server and client render or React screams about hydration mismatches, so
 * nothing here may call Math.random().
 */
function noise(seed: number, index: number): number {
  const value = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

/** Walks a keyword backwards from its current position to where it started. */
function history(seed: number, current: number, startedAt: number): RankPoint[] {
  const points: RankPoint[] = [];
  for (let day = HISTORY_DAYS - 1; day >= 0; day--) {
    const date = new Date(HISTORY_END);
    date.setUTCDate(date.getUTCDate() - day);
    const progress = 1 - day / (HISTORY_DAYS - 1);
    const trend = startedAt + (current - startedAt) * progress;
    const jitter = (noise(seed, day) - 0.5) * 2.4;
    points.push({
      date: date.toISOString().slice(0, 10),
      position: day === 0 ? current : Math.max(1, Math.round(trend + jitter)),
    });
  }
  return points;
}

export const OWN_DOMAIN = "yoursite.com";

export const keywordGroups: KeywordGroup[] = [
  { key: "all", label: { tr: "Tümü", en: "All" } },
  { key: "product", label: { tr: "Ürün", en: "Product" } },
  { key: "blog", label: { tr: "Blog", en: "Blog" } },
  { key: "tools", label: { tr: "Araçlar", en: "Tools" } },
  { key: "compare", label: { tr: "Karşılaştırma", en: "Comparison" } },
];

export const keywords: Keyword[] = [
  {
    id: "kw-01",
    phrase: "project management software",
    position: 4, delta: -3, best: 3, volume: 74000, difficulty: 78, cpc: 14.2,
    intent: "commercial", url: "/features/project-management", group: "product",
    features: ["featured", "people", "sitelinks"],
    history: history(1, 4, 9),
    serp: [
      { domain: "asana.com", url: "/project-management", position: 1 },
      { domain: "monday.com", url: "/pm", position: 2 },
      { domain: "clickup.com", url: "/teams/project-management", position: 3 },
      { domain: OWN_DOMAIN, url: "/features/project-management", position: 4 },
      { domain: "wrike.com", url: "/project-management-software", position: 5 },
    ],
  },
  {
    // Cannibalization: a blog post competing with the feature page above.
    id: "kw-02",
    phrase: "project management software guide",
    position: 12, delta: 1, best: 8, volume: 5400, difficulty: 54, cpc: 6.1,
    intent: "informational", url: "/blog/project-management-guide", group: "blog",
    features: ["people"],
    history: history(2, 12, 11),
    serp: [
      { domain: "atlassian.com", url: "/agile/project-management", position: 1 },
      { domain: "asana.com", url: "/resources/project-management", position: 4 },
      { domain: OWN_DOMAIN, url: "/blog/project-management-guide", position: 12 },
    ],
  },
  {
    id: "kw-03",
    phrase: "project management tools for teams",
    position: 9, delta: -2, best: 9, volume: 9900, difficulty: 66, cpc: 10.4,
    intent: "commercial", url: "/features/project-management", group: "product",
    features: ["people", "video"],
    history: history(3, 9, 13),
    serp: [
      { domain: "monday.com", url: "/teams", position: 1 },
      { domain: "clickup.com", url: "/teams", position: 3 },
      { domain: OWN_DOMAIN, url: "/features/project-management", position: 9 },
    ],
  },
  {
    id: "kw-04",
    phrase: "best crm for startups",
    position: 2, delta: -1, best: 2, volume: 18100, difficulty: 64, cpc: 11.8,
    intent: "commercial", url: "/solutions/startups", group: "product",
    features: ["people", "video"],
    history: history(4, 2, 6),
    serp: [
      { domain: "hubspot.com", url: "/crm/startups", position: 1 },
      { domain: OWN_DOMAIN, url: "/solutions/startups", position: 2 },
      { domain: "pipedrive.com", url: "/startup-crm", position: 3 },
      { domain: "zoho.com", url: "/crm/startups", position: 4 },
    ],
  },
  {
    // Cannibalization: second URL chasing the same CRM intent.
    id: "kw-05",
    phrase: "crm for startups pricing",
    position: 17, delta: 4, best: 11, volume: 2900, difficulty: 47, cpc: 9.2,
    intent: "transactional", url: "/pricing/startups", group: "product",
    features: [],
    history: history(5, 17, 12),
    serp: [
      { domain: "hubspot.com", url: "/pricing/crm", position: 1 },
      { domain: OWN_DOMAIN, url: "/pricing/startups", position: 17 },
    ],
  },
  {
    id: "kw-06",
    phrase: "team collaboration tools",
    position: 7, delta: 2, best: 5, volume: 33100, difficulty: 71, cpc: 9.4,
    intent: "informational", url: "/blog/collaboration-tools", group: "blog",
    features: ["featured", "image"],
    history: history(6, 7, 5),
    serp: [
      { domain: "slack.com", url: "/collaboration", position: 1 },
      { domain: "atlassian.com", url: "/software/confluence", position: 2 },
      { domain: "notion.so", url: "/teams", position: 5 },
      { domain: OWN_DOMAIN, url: "/blog/collaboration-tools", position: 7 },
    ],
  },
  {
    id: "kw-07",
    phrase: "free gantt chart maker",
    position: 1, delta: 0, best: 1, volume: 12100, difficulty: 49, cpc: 6.7,
    intent: "transactional", url: "/tools/gantt-chart", group: "tools",
    features: ["sitelinks", "image"],
    history: history(7, 1, 2),
    serp: [
      { domain: OWN_DOMAIN, url: "/tools/gantt-chart", position: 1 },
      { domain: "canva.com", url: "/graphs/gantt-charts", position: 2 },
      { domain: "teamgantt.com", url: "/free-gantt-chart", position: 3 },
    ],
  },
  {
    id: "kw-08",
    phrase: "kanban board app",
    position: 9, delta: -5, best: 9, volume: 27100, difficulty: 68, cpc: 8.1,
    intent: "commercial", url: "/features/kanban", group: "product",
    features: ["people", "shopping"],
    history: history(8, 9, 17),
    serp: [
      { domain: "trello.com", url: "/", position: 1 },
      { domain: "jira.atlassian.com", url: "/boards", position: 2 },
      { domain: OWN_DOMAIN, url: "/features/kanban", position: 9 },
    ],
  },
  {
    id: "kw-09",
    phrase: "okr software",
    position: 14, delta: 3, best: 8, volume: 8900, difficulty: 59, cpc: 13.5,
    intent: "commercial", url: "/features/okr", group: "product",
    features: ["video"],
    history: history(9, 14, 10),
    serp: [
      { domain: "lattice.com", url: "/okrs", position: 1 },
      { domain: "15five.com", url: "/okr", position: 2 },
      { domain: OWN_DOMAIN, url: "/features/okr", position: 14 },
    ],
  },
  {
    id: "kw-10",
    phrase: "time tracking for teams",
    position: 6, delta: -2, best: 4, volume: 14800, difficulty: 56, cpc: 10.2,
    intent: "commercial", url: "/features/time-tracking", group: "product",
    features: ["featured", "people"],
    history: history(10, 6, 9),
    serp: [
      { domain: "toggl.com", url: "/track/teams", position: 1 },
      { domain: "harvest.com", url: "/", position: 2 },
      { domain: OWN_DOMAIN, url: "/features/time-tracking", position: 6 },
    ],
  },
  {
    id: "kw-11",
    phrase: "agile project planning",
    position: 11, delta: 1, best: 9, volume: 6600, difficulty: 52, cpc: 7.9,
    intent: "informational", url: "/blog/agile-planning", group: "blog",
    features: ["image"],
    history: history(11, 11, 10),
    serp: [
      { domain: "scrum.org", url: "/resources", position: 1 },
      { domain: OWN_DOMAIN, url: "/blog/agile-planning", position: 11 },
    ],
  },
  {
    id: "kw-12",
    phrase: "workflow automation platform",
    position: 3, delta: -4, best: 3, volume: 22200, difficulty: 73, cpc: 16.4,
    intent: "commercial", url: "/features/automation", group: "product",
    features: ["featured", "sitelinks", "people"],
    history: history(12, 3, 9),
    serp: [
      { domain: "zapier.com", url: "/", position: 1 },
      { domain: "make.com", url: "/en", position: 2 },
      { domain: OWN_DOMAIN, url: "/features/automation", position: 3 },
    ],
  },
  {
    id: "kw-13",
    phrase: "resource management software",
    position: 19, delta: 6, best: 12, volume: 9900, difficulty: 61, cpc: 12.1,
    intent: "commercial", url: "/features/resourcing", group: "product",
    features: [],
    history: history(13, 19, 12),
    serp: [
      { domain: "float.com", url: "/", position: 1 },
      { domain: "runn.io", url: "/", position: 2 },
      { domain: OWN_DOMAIN, url: "/features/resourcing", position: 19 },
    ],
  },
  {
    id: "kw-14",
    phrase: "sprint planning template",
    position: 5, delta: -1, best: 5, volume: 5400, difficulty: 41, cpc: 4.3,
    intent: "transactional", url: "/templates/sprint-planning", group: "tools",
    features: ["image", "sitelinks"],
    history: history(14, 5, 7),
    serp: [
      { domain: "miro.com", url: "/templates/sprint-planning", position: 1 },
      { domain: OWN_DOMAIN, url: "/templates/sprint-planning", position: 5 },
    ],
  },
  {
    id: "kw-15",
    phrase: "remote team management",
    position: 8, delta: 0, best: 6, volume: 11200, difficulty: 58, cpc: 9.0,
    intent: "informational", url: "/blog/remote-teams", group: "blog",
    features: ["people", "video"],
    history: history(15, 8, 8),
    serp: [
      { domain: "gitlab.com", url: "/company/culture/all-remote", position: 1 },
      { domain: OWN_DOMAIN, url: "/blog/remote-teams", position: 8 },
    ],
  },
  {
    id: "kw-16",
    phrase: "project dashboard examples",
    position: 13, delta: -8, best: 13, volume: 4100, difficulty: 38, cpc: 3.6,
    intent: "informational", url: "/blog/dashboard-examples", group: "blog",
    features: ["image"],
    history: history(16, 13, 24),
    serp: [
      { domain: "geckoboard.com", url: "/dashboard-examples", position: 1 },
      { domain: OWN_DOMAIN, url: "/blog/dashboard-examples", position: 13 },
    ],
  },
  {
    id: "kw-17",
    phrase: "task management app",
    position: 22, delta: 4, best: 15, volume: 40500, difficulty: 70, cpc: 7.4,
    intent: "commercial", url: "/features/tasks", group: "product",
    features: ["people", "shopping"],
    history: history(17, 22, 17),
    serp: [
      { domain: "todoist.com", url: "/", position: 1 },
      { domain: "things.app", url: "/", position: 2 },
      { domain: OWN_DOMAIN, url: "/features/tasks", position: 22 },
    ],
  },
  {
    id: "kw-18",
    phrase: "saas onboarding checklist",
    position: 1, delta: -2, best: 1, volume: 3300, difficulty: 33, cpc: 5.2,
    intent: "informational", url: "/blog/saas-onboarding", group: "blog",
    features: ["featured", "sitelinks"],
    history: history(18, 1, 4),
    serp: [
      { domain: OWN_DOMAIN, url: "/blog/saas-onboarding", position: 1 },
      { domain: "userpilot.com", url: "/blog/onboarding-checklist", position: 2 },
    ],
  },
  {
    id: "kw-19",
    phrase: "asana alternative",
    position: 6, delta: -9, best: 6, volume: 14800, difficulty: 62, cpc: 12.9,
    intent: "commercial", url: "/compare/asana-alternative", group: "compare",
    features: ["people", "sitelinks"],
    history: history(19, 6, 18),
    serp: [
      { domain: "clickup.com", url: "/compare/asana", position: 1 },
      { domain: "monday.com", url: "/asana-alternative", position: 3 },
      { domain: OWN_DOMAIN, url: "/compare/asana-alternative", position: 6 },
    ],
  },
  {
    id: "kw-20",
    phrase: "monday com alternative",
    position: 11, delta: -3, best: 11, volume: 9100, difficulty: 60, cpc: 13.4,
    intent: "commercial", url: "/compare/monday-alternative", group: "compare",
    features: ["people"],
    history: history(20, 11, 15),
    serp: [
      { domain: "clickup.com", url: "/compare/monday", position: 1 },
      { domain: OWN_DOMAIN, url: "/compare/monday-alternative", position: 11 },
    ],
  },
  {
    id: "kw-21",
    phrase: "gantt chart template excel",
    position: 28, delta: -6, best: 28, volume: 22200, difficulty: 44, cpc: 2.8,
    intent: "transactional", url: "/tools/gantt-chart", group: "tools",
    features: ["image", "video"],
    history: history(21, 28, 36),
    serp: [
      { domain: "microsoft.com", url: "/templates/gantt", position: 1 },
      { domain: "smartsheet.com", url: "/gantt-chart-excel", position: 2 },
      { domain: OWN_DOMAIN, url: "/tools/gantt-chart", position: 28 },
    ],
  },
  {
    id: "kw-22",
    phrase: "capacity planning software",
    position: 41, delta: -4, best: 41, volume: 6600, difficulty: 57, cpc: 15.1,
    intent: "commercial", url: "/features/resourcing", group: "product",
    features: [],
    history: history(22, 41, 47),
    serp: [
      { domain: "float.com", url: "/capacity-planning", position: 1 },
      { domain: OWN_DOMAIN, url: "/features/resourcing", position: 41 },
    ],
  },
  {
    id: "kw-23",
    phrase: "project portfolio management",
    position: null, delta: 0, best: 62, volume: 12100, difficulty: 74, cpc: 18.6,
    intent: "commercial", url: "/features/portfolio", group: "product",
    features: ["people"],
    history: history(23, 78, 84),
    serp: [
      { domain: "planview.com", url: "/ppm", position: 1 },
      { domain: "servicenow.com", url: "/spm", position: 2 },
    ],
  },
  {
    id: "kw-24",
    phrase: "work breakdown structure template",
    position: null, delta: 0, best: 71, volume: 8100, difficulty: 39, cpc: 3.1,
    intent: "transactional", url: "/templates/wbs", group: "tools",
    features: ["image"],
    history: history(24, 88, 92),
    serp: [
      { domain: "smartsheet.com", url: "/work-breakdown-structure", position: 1 },
      { domain: "projectmanager.com", url: "/wbs", position: 2 },
    ],
  },
];

export default keywords;
