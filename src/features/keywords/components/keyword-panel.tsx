"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { TrendLine } from "@/components/charts/trend-line";
import { Badge } from "@/components/ui/badge";
import { compact, integer, money } from "@/lib/format/numbers";
import { shortDate } from "@/lib/format/dates";
import { cn } from "@/lib/cn";
import { OWN_DOMAIN } from "@/data/keywords";
import { INTENT_LABEL, SERP_FEATURE_LABEL, type Keyword } from "../types";
import { estimateClicks, ctrAt } from "../lib/ctr-curve";
import { bestPosition, volatility } from "../lib/rank";
import { PositionDelta, PositionValue } from "./position-delta";

/**
 * Detail drawer for one keyword. Opens over the table rather than navigating,
 * because the whole point is comparing a row against its neighbours; a route
 * change would lose the scroll position and the filter you got here with.
 */
export function KeywordPanel({
  keyword,
  onClose,
}: {
  keyword: Keyword | null;
  onClose: () => void;
}) {
  const { t, ui } = useLanguage();

  // Escape closes the drawer. Bound on the document so it works no matter
  // where focus currently sits.
  useEffect(() => {
    if (!keyword) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [keyword, onClose]);

  if (!keyword) return null;

  const history = keyword.history.map((point) => ({
    label: shortDate(point.date),
    value: point.position,
  }));

  const best = bestPosition(keyword.history) ?? keyword.best;
  const swing = volatility(keyword.history);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={keyword.phrase}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col border-l border-border bg-card shadow-raised"
      >
        <header className="flex items-start gap-3 border-b border-border px-4 py-3.5">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[17px] font-semibold leading-tight">
              {keyword.phrase}
            </h2>
            <p className="numeric mt-1 truncate text-[12px] text-muted-foreground">
              {OWN_DOMAIN}
              {keyword.url}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={ui.close}
            className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
            <Stat label={ui.position}>
              <PositionValue position={keyword.position} />
            </Stat>
            <Stat label={ui.change}>
              <PositionDelta delta={keyword.delta} />
            </Stat>
            <Stat label={ui.best}>
              <span className="numeric text-[13px] font-semibold">{best}</span>
            </Stat>
            <Stat label={ui.volume}>
              <span className="numeric text-[13px] font-semibold">
                {compact(keyword.volume)}
              </span>
            </Stat>
          </div>

          <section className="border-b border-border p-4">
            <p className="eyebrow mb-2">14d</p>
            <TrendLine points={history} invert height={150} />
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
              {swing < 1
                ? "Stable SERP. Movement here is your page, not the results."
                : `Volatile SERP: ${swing.toFixed(1)} positions of average daily swing.`}
            </p>
          </section>

          <section className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-border p-4">
            <Detail label={ui.difficulty} value={String(keyword.difficulty)} />
            <Detail label="CPC" value={money(keyword.cpc)} />
            <Detail label={ui.intent} value={t(INTENT_LABEL[keyword.intent])} />
            <Detail
              label={ui.clicks}
              value={`${integer(estimateClicks(keyword))} / mo`}
            />
            <Detail
              label="CTR"
              value={`${(ctrAt(keyword.position) * 100).toFixed(1)}%`}
            />
            <Detail label="Group" value={keyword.group} />
          </section>

          {keyword.features.length > 0 ? (
            <section className="border-b border-border p-4">
              <p className="eyebrow mb-2">SERP features</p>
              <div className="flex flex-wrap gap-1.5">
                {keyword.features.map((feature) => (
                  <Badge key={feature} tone="neutral">
                    {t(SERP_FEATURE_LABEL[feature])}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}

          <section className="p-4">
            <p className="eyebrow mb-2">Live SERP</p>
            <ol className="ruled">
              {keyword.serp.map((result) => {
                const isYou = result.domain === OWN_DOMAIN;
                return (
                  <li
                    key={`${result.domain}${result.url}`}
                    className={cn(
                      "flex items-center gap-2.5 py-2",
                      isYou && "font-medium",
                    )}
                  >
                    <span className="numeric w-5 shrink-0 text-right text-[12px] text-muted-foreground">
                      {result.position}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px]">
                      <span className={cn(isYou && "text-primary")}>{result.domain}</span>
                      <span className="numeric text-muted-foreground">{result.url}</span>
                    </span>
                    {isYou ? <Badge tone="primary">you</Badge> : null}
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </aside>
    </>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-3 py-3">
      <p className="eyebrow mb-1.5">{label}</p>
      {children}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow mb-0.5">{label}</p>
      <p className="numeric text-[13px]">{value}</p>
    </div>
  );
}
