import type { Localized } from "@/lib/i18n/config";

export type Severity = "critical" | "warning" | "notice";

export type IssueCategory =
  | "links"
  | "meta"
  | "speed"
  | "indexing"
  | "content"
  | "accessibility";

export interface AuditIssue {
  id: string;
  title: Localized;
  /** Why it matters and what to do, shown when a row is expanded. */
  guidance: Localized;
  severity: Severity;
  category: IssueCategory;
  /** How many crawled URLs are affected. */
  affected: number;
  /** One example URL, so the fix has somewhere to start. */
  sample: string;
}

export interface CrawlSummary {
  pagesCrawled: number;
  crawledAt: string;
}

export const SEVERITY_ORDER: readonly Severity[] = ["critical", "warning", "notice"];

export const SEVERITY_LABEL: Record<Severity, Localized> = {
  critical: { tr: "Kritik", en: "Critical" },
  warning: { tr: "Uyarı", en: "Warning" },
  notice: { tr: "Bilgi", en: "Notice" },
};

export const CATEGORY_LABEL: Record<IssueCategory, Localized> = {
  links: { tr: "Bağlantılar", en: "Links" },
  meta: { tr: "Meta", en: "Meta" },
  speed: { tr: "Hız", en: "Speed" },
  indexing: { tr: "İndeksleme", en: "Indexing" },
  content: { tr: "İçerik", en: "Content" },
  accessibility: { tr: "Erişilebilirlik", en: "Accessibility" },
};
