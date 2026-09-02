"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import {
  BUCKET_LABEL,
  BUCKET_TONE,
  type BucketSlice,
} from "../lib/distribution";
import { cn } from "@/lib/cn";

/**
 * A single stacked bar of the whole keyword set by position band.
 *
 * This replaces "average position" as the headline shape of the account. An
 * average hides the only thing that matters, whether keywords are crossing
 * onto page one, while the bar shows the whole distribution moving left.
 */
export function DistributionBar({
  slices,
  onSelect,
  selected,
  className,
}: {
  slices: BucketSlice[];
  onSelect?: (bucket: BucketSlice["bucket"] | "all") => void;
  selected?: string;
  className?: string;
}) {
  const { t } = useLanguage();
  const visible = slices.filter((slice) => slice.count > 0);

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div className="flex h-2.5 w-full overflow-hidden rounded-sm bg-muted">
        {visible.map((slice) => (
          <button
            key={slice.bucket}
            type="button"
            onClick={() => onSelect?.(selected === slice.bucket ? "all" : slice.bucket)}
            style={{ width: `${slice.share}%`, background: BUCKET_TONE[slice.bucket] }}
            className={cn(
              "h-full transition-opacity",
              onSelect && "cursor-pointer",
              selected && selected !== "all" && selected !== slice.bucket
                ? "opacity-30"
                : "opacity-100",
            )}
            title={`${t(BUCKET_LABEL[slice.bucket])}: ${slice.count}`}
            aria-label={`${t(BUCKET_LABEL[slice.bucket])}: ${slice.count}`}
          />
        ))}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {slices.map((slice) => (
          <li key={slice.bucket} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{ background: BUCKET_TONE[slice.bucket] }}
            />
            <span className="text-[12px] text-muted-foreground">
              {t(BUCKET_LABEL[slice.bucket])}
            </span>
            <span className="numeric text-[12px] font-semibold">{slice.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
