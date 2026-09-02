import { describe, expect, it } from "vitest";
import {
  affectedBySeverity,
  countBySeverity,
  gradeOf,
  groupByCategory,
  healthScore,
  impactOf,
  prioritize,
} from "@/features/audit/lib/health";
import type { AuditIssue, CrawlSummary } from "@/features/audit/types";

const crawl: CrawlSummary = { pagesCrawled: 1_000, crawledAt: "2026-06-14T00:00:00Z" };

function issue(overrides: Partial<AuditIssue> = {}): AuditIssue {
  return {
    id: "iss",
    title: { tr: "t", en: "t" },
    guidance: { tr: "g", en: "g" },
    severity: "warning",
    category: "meta",
    affected: 10,
    sample: "/x",
    ...overrides,
  };
}

describe("healthScore", () => {
  it("is a perfect 100 with no issues", () => {
    expect(healthScore([], crawl)).toBe(100);
  });

  it("returns 100 rather than dividing by zero when nothing was crawled", () => {
    expect(healthScore([issue()], { ...crawl, pagesCrawled: 0 })).toBe(100);
  });

  it("weighs a critical far heavier than a notice on the same page count", () => {
    const critical = healthScore([issue({ severity: "critical", affected: 50 })], crawl);
    const notice = healthScore([issue({ severity: "notice", affected: 50 })], crawl);
    expect(critical).toBeLessThan(notice);
  });

  it("normalises by crawl size, so a bigger site is not punished for scale", () => {
    const small = healthScore([issue({ affected: 10 })], { ...crawl, pagesCrawled: 100 });
    const large = healthScore([issue({ affected: 10 })], { ...crawl, pagesCrawled: 10_000 });
    expect(large).toBeGreaterThan(small);
  });

  it("stays within 0–100 even under an absurd issue load", () => {
    const brutal = Array.from({ length: 40 }, (_, i) =>
      issue({ id: `i${i}`, severity: "critical", affected: 5_000 }),
    );
    const score = healthScore(brutal, crawl);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("never reaches zero from a single noisy rule", () => {
    expect(healthScore([issue({ severity: "notice", affected: 900 })], crawl)).toBeGreaterThan(0);
  });

  it("decreases monotonically as issues pile up", () => {
    const one = healthScore([issue({ id: "a", affected: 20 })], crawl);
    const two = healthScore(
      [issue({ id: "a", affected: 20 }), issue({ id: "b", affected: 20 })],
      crawl,
    );
    expect(two).toBeLessThan(one);
  });
});

describe("gradeOf", () => {
  it("maps scores onto grades at the documented thresholds", () => {
    expect(gradeOf(95)).toBe("excellent");
    expect(gradeOf(90)).toBe("excellent");
    expect(gradeOf(89)).toBe("good");
    expect(gradeOf(75)).toBe("good");
    expect(gradeOf(74)).toBe("fair");
    expect(gradeOf(50)).toBe("fair");
    expect(gradeOf(49)).toBe("poor");
  });
});

describe("prioritize", () => {
  it("puts a widespread warning above a rare critical", () => {
    const rareCritical = issue({ id: "a", severity: "critical", affected: 2 });
    const widespreadWarning = issue({ id: "b", severity: "warning", affected: 300 });
    const [first] = prioritize([rareCritical, widespreadWarning]);
    expect(first.id).toBe("b");
  });

  it("does not mutate its input", () => {
    const issues = [issue({ id: "a", affected: 1 }), issue({ id: "b", affected: 99 })];
    const order = issues.map((i) => i.id);
    prioritize(issues);
    expect(issues.map((i) => i.id)).toEqual(order);
  });
});

describe("counting helpers", () => {
  const issues = [
    issue({ id: "a", severity: "critical", affected: 5 }),
    issue({ id: "b", severity: "critical", affected: 7 }),
    issue({ id: "c", severity: "notice", affected: 30 }),
  ];

  it("counts issues per severity", () => {
    expect(countBySeverity(issues)).toEqual({ critical: 2, warning: 0, notice: 1 });
  });

  it("sums affected pages per severity", () => {
    expect(affectedBySeverity(issues)).toEqual({ critical: 12, warning: 0, notice: 30 });
  });

  it("groups by category, heaviest first", () => {
    const grouped = groupByCategory([
      issue({ id: "a", category: "meta", affected: 5 }),
      issue({ id: "b", category: "links", affected: 80 }),
    ]);
    expect(grouped[0].category).toBe("links");
    expect(grouped[0].affected).toBe(80);
  });
});

describe("impactOf", () => {
  it("reports the points an issue currently costs", () => {
    const issues = [
      issue({ id: "a", severity: "critical", affected: 100 }),
      issue({ id: "b", severity: "notice", affected: 5 }),
    ];
    expect(impactOf(issues[0], issues, crawl)).toBeGreaterThan(
      impactOf(issues[1], issues, crawl),
    );
  });

  it("is never negative", () => {
    const issues = [issue({ id: "a", affected: 1 })];
    expect(impactOf(issues[0], issues, crawl)).toBeGreaterThanOrEqual(0);
  });
});
