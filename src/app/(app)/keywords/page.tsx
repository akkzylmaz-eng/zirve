import { Suspense } from "react";
import type { Metadata } from "next";
import { keywords, keywordGroups } from "@/data/keywords";
import { KeywordsView } from "./keywords-view";

export const metadata: Metadata = { title: "Keywords" };

export default function KeywordsPage() {
  // useSearchParams suspends during prerender, so the view has to sit behind a
  // boundary or the whole route opts out of static rendering.
  return (
    <Suspense fallback={<div className="p-6 text-[13px] text-muted-foreground">…</div>}>
      <KeywordsView keywords={keywords} groups={keywordGroups} />
    </Suspense>
  );
}
