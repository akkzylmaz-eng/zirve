"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import { integer } from "@/lib/format/numbers";
import { GRADE_LABEL, type HealthGrade } from "@/features/audit/lib/health";
import type { VisibilityReport } from "@/features/keywords/lib/visibility";
import { cn } from "@/lib/cn";

/**
 * Four numbers, no sparklines, no percentage-change chips. Each one is a
 * quantity somebody could act on today; "average position" is deliberately not
 * among them.
 */
export function OverviewStats({
  report,
  health,
  grade,
  trackedCount,
}: {
  report: VisibilityReport;
  health: number;
  grade: HealthGrade;
  trackedCount: number;
}) {
  const { language } = useLanguage();
  const tr = language === "tr";

  const stats = [
    {
      label: tr ? "Görünürlük" : "Visibility",
      value: `${report.score}%`,
      hint: tr
        ? `${trackedCount} kelime takip ediliyor`
        : `${trackedCount} keywords tracked`,
    },
    {
      label: tr ? "Aylık tıklama" : "Monthly clicks",
      value: integer(report.estimatedClicks),
      hint: tr ? "mevcut pozisyonlarda" : "at current positions",
    },
    {
      label: tr ? "Kaçan tıklama" : "Clicks on the table",
      value: integer(report.headroom),
      hint: tr ? "hepsi 1. sırada olsaydı" : "if every phrase ranked first",
      emphasis: true,
    },
    {
      label: tr ? "Site sağlığı" : "Site health",
      value: String(health),
      hint: tr ? GRADE_LABEL[grade].tr : GRADE_LABEL[grade].en,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card px-4 py-3.5">
          <p className="eyebrow">{stat.label}</p>
          <p
            className={cn(
              "numeric mt-1.5 text-[26px] font-semibold leading-none",
              stat.emphasis && "text-primary",
            )}
          >
            {stat.value}
          </p>
          <p className="mt-1.5 text-[11.5px] text-muted-foreground">{stat.hint}</p>
        </div>
      ))}
    </div>
  );
}
