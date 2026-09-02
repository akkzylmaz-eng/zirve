import type { Localized } from "@/lib/i18n/config";

export interface NavItem {
  label: Localized;
  href: string;
  icon: string;
  /** Rendered as a small count badge in the command bar. */
  badge?: "auditIssues";
}

export const appNav: NavItem[] = [
  { label: { tr: "Genel bakış", en: "Overview" }, href: "/dashboard", icon: "layout-dashboard" },
  { label: { tr: "Kelimeler", en: "Keywords" }, href: "/keywords", icon: "target" },
  { label: { tr: "Denetim", en: "Audit" }, href: "/audit", icon: "scan-search", badge: "auditIssues" },
  { label: { tr: "Ayarlar", en: "Settings" }, href: "/settings", icon: "settings" },
];

export const marketingNav: NavItem[] = [
  { label: { tr: "Özellikler", en: "Features" }, href: "#features", icon: "sparkles" },
  { label: { tr: "Nasıl çalışır", en: "How it works" }, href: "#how", icon: "workflow" },
  { label: { tr: "Fiyatlar", en: "Pricing" }, href: "#pricing", icon: "tag" },
  { label: { tr: "SSS", en: "FAQ" }, href: "#faq", icon: "help-circle" },
];
