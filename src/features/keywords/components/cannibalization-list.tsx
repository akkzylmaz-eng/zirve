"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import { Badge } from "@/components/ui/badge";
import { compact, integer } from "@/lib/format/numbers";
import type { CannibalCluster } from "../lib/cannibalization";
import { PositionValue } from "./position-delta";

/**
 * Cannibalization findings. Presented as clusters rather than as a list of
 * keywords, because the finding *is* the grouping; every row in it looks
 * perfectly healthy on its own.
 */
export function CannibalizationList({ clusters }: { clusters: CannibalCluster[] }) {
  const { language } = useLanguage();

  if (clusters.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-[13px] text-muted-foreground">
        {language === "tr"
          ? "Aynı niyeti paylaşan çakışan sayfa bulunamadı."
          : "No pages found competing for the same intent."}
      </p>
    );
  }

  return (
    <ul className="ruled">
      {clusters.map((cluster) => (
        <li key={cluster.head} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-medium">{cluster.head}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {language === "tr"
                  ? `${cluster.urls.length} sayfa · ${compact(cluster.volume)} aylık hacim`
                  : `${cluster.urls.length} pages · ${compact(cluster.volume)} monthly volume`}
              </p>
            </div>
            {cluster.recoverableClicks > 0 ? (
              <Badge tone="warn" className="shrink-0">
                +{integer(cluster.recoverableClicks)}
                {language === "tr" ? " tıklama" : " clicks"}
              </Badge>
            ) : null}
          </div>

          <ul className="mt-2.5 flex flex-col gap-1.5">
            {cluster.members.map((member) => (
              <li key={member.id} className="flex items-center gap-2.5">
                <PositionValue position={member.position} />
                <span className="numeric min-w-0 flex-1 truncate text-[12px] text-muted-foreground">
                  {member.url}
                </span>
                <span className="truncate text-[12px]">{member.phrase}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
