"use client";

import { ExternalLink } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLanguage } from "@/components/i18n/language-provider";
import { site } from "@/config/site";
import { keywords } from "@/data/keywords";

interface SourceStatus {
  key: string;
  name: string;
  envVars: string[];
  docsUrl: string;
  replaces: { tr: string; en: string };
  connected: boolean;
}

export function SettingsView({ sources }: { sources: SourceStatus[] }) {
  const { ui, t, language } = useLanguage();

  return (
    <div className="mx-auto max-w-[820px] p-4 lg:p-6">
      <div className="flex flex-col gap-4">
        <Panel>
          <PanelHeader title={ui.workspace} />
          <dl className="ruled">
            <Row label={ui.property} value={site.trackedProperty} />
            <Row
              label={language === "tr" ? "Takip edilen kelime" : "Tracked keywords"}
              value={String(keywords.length)}
            />
            <Row label={language === "tr" ? "Ürün" : "Product"} value={site.name} />
            <Row label={language === "tr" ? "Alan adı" : "Domain"} value={site.domain} />
          </dl>
        </Panel>

        <Panel>
          <PanelHeader title={ui.dataSources} hint={ui.dataSourcesHint} />
          <ul className="ruled">
            {sources.map((source) => (
              <li key={source.key} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-medium">{source.name}</span>
                      <Badge tone={source.connected ? "up" : "neutral"}>
                        {source.connected ? ui.connected : ui.notConnected}
                      </Badge>
                    </div>
                    <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
                      {t(source.replaces)}
                    </p>
                  </div>
                  <a
                    href={source.docsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`${source.name} docs`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {source.envVars.map((variable) => (
                    <code
                      key={variable}
                      className="numeric rounded-sm bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {variable}
                    </code>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelHeader title={ui.appearance} />
          <dl className="ruled">
            <li className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px]">{ui.language}</span>
              <LanguageToggle />
            </li>
            <li className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px]">{ui.theme}</span>
              <ThemeToggle />
            </li>
          </dl>
        </Panel>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <dt className="text-[13px] text-muted-foreground">{label}</dt>
      <dd className="numeric text-[13px] font-medium">{value}</dd>
    </div>
  );
}
