"use client";

import Link from "next/link";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { DistributionBar } from "@/features/keywords/components/distribution-bar";
import { useLanguage } from "@/components/i18n/language-provider";
import type { BucketSlice } from "@/features/keywords/lib/distribution";

export function DistributionPanel({ slices }: { slices: BucketSlice[] }) {
  const { language } = useLanguage();

  return (
    <Panel>
      <PanelHeader
        title={language === "tr" ? "Pozisyon dağılımı" : "Position distribution"}
        hint={
          language === "tr"
            ? "Ortalama değil bantlar. Sayfa bire geçişi ancak burada görürsün."
            : "Bands, not an average. Crossing onto page one is only visible here."
        }
      />
      <div className="p-4">
        <DistributionBar slices={slices} />
        <Link
          href="/keywords"
          className="mt-4 inline-block text-[12px] font-medium text-primary hover:underline"
        >
          {language === "tr" ? "Kelimeleri incele →" : "Inspect keywords →"}
        </Link>
      </div>
    </Panel>
  );
}
