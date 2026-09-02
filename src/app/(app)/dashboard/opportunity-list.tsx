"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import { Badge } from "@/components/ui/badge";
import { compact, integer } from "@/lib/format/numbers";
import { REASON_LABEL, type Opportunity } from "@/features/keywords/lib/opportunities";
import { PositionValue } from "@/features/keywords/components/position-delta";

const REASON_TONE = {
  "striking-distance": "up",
  "page-two": "primary",
  slipping: "down",
  untapped: "neutral",
} as const;

export function OpportunityList({ opportunities }: { opportunities: Opportunity[] }) {
  const { language, t } = useLanguage();

  if (opportunities.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-[13px] text-muted-foreground">
        {language === "tr" ? "Fırsat bulunamadı." : "No opportunities found."}
      </p>
    );
  }

  return (
    <ul className="ruled">
      {opportunities.map(({ keyword, upside, reason }) => (
        <li key={keyword.id} className="flex items-center gap-3 px-4 py-2.5">
          <PositionValue position={keyword.position} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{keyword.phrase}</p>
            <p className="text-[11.5px] text-muted-foreground">
              {compact(keyword.volume)} · KD {keyword.difficulty}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="numeric text-[13px] font-semibold text-primary">
              +{integer(upside)}
            </p>
            <Badge tone={REASON_TONE[reason]} className="mt-0.5">
              {t(REASON_LABEL[reason])}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
