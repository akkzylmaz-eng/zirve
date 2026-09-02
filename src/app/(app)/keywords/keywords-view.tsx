"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, Search, X } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { TextField, SelectField } from "@/components/ui/field";
import { useLanguage } from "@/components/i18n/language-provider";
import { RankGrid } from "@/features/keywords/components/rank-grid";
import { KeywordPanel } from "@/features/keywords/components/keyword-panel";
import { DistributionBar } from "@/features/keywords/components/distribution-bar";
import {
  applyQuery,
  DEFAULT_QUERY,
  parseQuery,
  serializeQuery,
  type KeywordQuery,
  type SortKey,
} from "@/features/keywords/lib/filters";
import { distribution, BUCKET_LABEL, BUCKET_ORDER } from "@/features/keywords/lib/distribution";
import { downloadCsv } from "@/features/keywords/lib/export-csv";
import { visibilityReport } from "@/features/keywords/lib/visibility";
import { integer } from "@/lib/format/numbers";
import { INTENT_LABEL, type Keyword, type KeywordGroup } from "@/features/keywords/types";

/**
 * The keyword workspace. All view state (search, filters, sort) lives in the
 * URL rather than in component state, so the view you are looking at is always
 * a link you can send someone. The trade-off is a router round-trip per
 * keystroke, which `replace` (not `push`) keeps out of the back-button history.
 */
export function KeywordsView({
  keywords,
  groups,
}: {
  keywords: Keyword[];
  groups: KeywordGroup[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ui, t, language } = useLanguage();

  const [selected, setSelected] = useState<Keyword | null>(null);

  const query = useMemo(
    () => parseQuery(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const update = useCallback(
    (patch: Partial<KeywordQuery>) => {
      const next = serializeQuery({ ...query, ...patch });
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    },
    [pathname, query, router],
  );

  const visible = useMemo(() => applyQuery(keywords, query), [keywords, query]);
  const slices = useMemo(() => distribution(visible), [visible]);
  const report = useMemo(() => visibilityReport(visible), [visible]);

  const onSort = useCallback(
    (key: SortKey) => {
      // Clicking the active column flips direction; a new column starts in the
      // direction that reads as "best first" for that kind of value.
      if (query.sort === key) {
        update({ direction: query.direction === "asc" ? "desc" : "asc" });
      } else {
        update({ sort: key, direction: key === "position" || key === "phrase" ? "asc" : "desc" });
      }
    },
    [query.direction, query.sort, update],
  );

  const isFiltered = serializeQuery(query) !== "";

  return (
    <div className="mx-auto max-w-[1400px] p-4 lg:p-6">
      <Panel className="mb-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <TextField
              value={query.search}
              onChange={(event) => update({ search: event.target.value })}
              placeholder={ui.searchKeywords}
              className="pl-8"
              aria-label={ui.searchKeywords}
            />
          </div>

          <SelectField
            value={query.group}
            onChange={(event) => update({ group: event.target.value })}
            aria-label="Group"
          >
            {groups.map((group) => (
              <option key={group.key} value={group.key}>
                {t(group.label)}
              </option>
            ))}
          </SelectField>

          <SelectField
            value={query.bucket}
            onChange={(event) =>
              update({ bucket: event.target.value as KeywordQuery["bucket"] })
            }
            aria-label={ui.position}
          >
            <option value="all">{language === "tr" ? "Tüm bantlar" : "All bands"}</option>
            {BUCKET_ORDER.map((bucket) => (
              <option key={bucket} value={bucket}>
                {t(BUCKET_LABEL[bucket])}
              </option>
            ))}
          </SelectField>

          <SelectField
            value={query.intent}
            onChange={(event) =>
              update({ intent: event.target.value as KeywordQuery["intent"] })
            }
            aria-label={ui.intent}
          >
            <option value="all">{language === "tr" ? "Tüm niyetler" : "All intents"}</option>
            {(Object.keys(INTENT_LABEL) as (keyof typeof INTENT_LABEL)[]).map((intent) => (
              <option key={intent} value={intent}>
                {t(INTENT_LABEL[intent])}
              </option>
            ))}
          </SelectField>

          <SelectField
            value={query.trend}
            onChange={(event) =>
              update({ trend: event.target.value as KeywordQuery["trend"] })
            }
            aria-label={ui.change}
          >
            <option value="all">{language === "tr" ? "Tüm hareketler" : "All movement"}</option>
            <option value="climbed">{language === "tr" ? "Tırmandı" : "Climbed"}</option>
            <option value="dropped">{language === "tr" ? "Düştü" : "Dropped"}</option>
            <option value="flat">{language === "tr" ? "Sabit" : "Flat"}</option>
          </SelectField>

          {isFiltered ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => update(DEFAULT_QUERY)}
              className="gap-1"
            >
              <X className="h-3.5 w-3.5" />
              {ui.reset}
            </Button>
          ) : null}

          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadCsv(visible)}
            className="ml-auto gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            {ui.export}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 p-4">
          <div className="min-w-[240px] flex-1">
            <DistributionBar
              slices={slices}
              selected={query.bucket}
              onSelect={(bucket) => update({ bucket })}
            />
          </div>
          <dl className="flex gap-6">
            <Summary label={language === "tr" ? "Eşleşen" : "Matching"} value={String(visible.length)} />
            <Summary label={language === "tr" ? "Görünürlük" : "Visibility"} value={`${report.score}%`} />
            <Summary label={ui.clicks} value={integer(report.estimatedClicks)} />
          </dl>
        </div>
      </Panel>

      <Panel>
        <RankGrid
          keywords={visible}
          sort={query.sort}
          direction={query.direction}
          onSort={onSort}
          onSelect={setSelected}
          selectedId={selected?.id}
        />
      </Panel>

      <KeywordPanel keyword={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="numeric mt-1 text-[17px] font-semibold">{value}</dd>
    </div>
  );
}
