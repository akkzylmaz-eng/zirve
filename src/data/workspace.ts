/**
 * Workspace-level fixtures: the property being tracked, its visibility history
 * and its backlink profile. Competitor visibility is *not* stored here; it is
 * derived from the keyword SERPs by `competitiveVisibility`, so the numbers can
 * never drift out of sync with the keyword table.
 */
import type { Localized } from "@/lib/i18n/config";

export interface VisibilityPoint {
  /** Month label, already short. */
  label: string;
  /** Visibility score, 0–100. */
  score: number;
}

export const visibilityHistory: VisibilityPoint[] = [
  { label: "Jan", score: 31.2 },
  { label: "Feb", score: 33.8 },
  { label: "Mar", score: 32.1 },
  { label: "Apr", score: 38.0 },
  { label: "May", score: 43.4 },
  { label: "Jun", score: 47.2 },
];

export interface Backlink {
  domain: string;
  /** Domain rating, 0–100. */
  rating: number;
  anchor: string;
  followed: boolean;
  seenAt: string;
}

export const backlinkProfile = {
  total: 24_800,
  referringDomains: 1_420,
  domainRating: 71,
  newThisMonth: 312,
  lostThisMonth: 47,
  recent: [
    { domain: "techcrunch.com", rating: 93, anchor: "project software", followed: true, seenAt: "2026-06-13T10:00:00Z" },
    { domain: "producthunt.com", rating: 91, anchor: "yoursite", followed: true, seenAt: "2026-06-12T16:20:00Z" },
    { domain: "g2.com", rating: 89, anchor: "best PM tool", followed: false, seenAt: "2026-06-11T09:05:00Z" },
    { domain: "indiehackers.com", rating: 82, anchor: "read more", followed: true, seenAt: "2026-06-10T14:45:00Z" },
  ] satisfies Backlink[],
};

export interface ActivityEntry {
  id: string;
  actor: string;
  action: Localized;
  target: string;
  at: string;
  tone: "success" | "info" | "warning";
}

export const activity: ActivityEntry[] = [
  { id: "act-1", actor: "Zirve", action: { tr: "takibe aldı", en: "started tracking" }, target: "36 keywords", at: "2026-06-14T09:12:00Z", tone: "success" },
  { id: "act-2", actor: "Crawler", action: { tr: "taradı", en: "crawled" }, target: "1,840 pages", at: "2026-06-14T07:40:00Z", tone: "info" },
  { id: "act-3", actor: "Alert", action: { tr: "işaretledi", en: "flagged" }, target: "18 broken links", at: "2026-06-13T19:20:00Z", tone: "warning" },
  { id: "act-4", actor: "Zirve", action: { tr: "yakaladı", en: "detected" }, target: "2 cannibalization clusters", at: "2026-06-13T11:02:00Z", tone: "warning" },
];
