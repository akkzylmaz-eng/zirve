/**
 * Site-level identity. Everything here is brand/deployment metadata, no UI
 * copy, no navigation, no vendor config. Those live in their own modules so a
 * rebrand never means editing a thousand-line object.
 */
import type { Localized } from "@/lib/i18n/config";

export const site = {
  name: "Zirve",
  /** Shown in the footer and the OG card. */
  legalName: "Zirve SEO",
  domain: "zirve.app",
  /** The property this workspace is currently tracking (demo value). */
  trackedProperty: "yoursite.com",
  studio: {
    name: "Vyesna",
    url: "https://github.com/akkzylmaz-eng",
  },
  tagline: {
    tr: "Sıralamanı ölç, sebebini gör, zirveye tırman.",
    en: "Measure your rank, see the cause, climb to the top.",
  } satisfies Localized,
  description: {
    tr: "Zirve, takip ettiğin her kelimenin Google pozisyonunu günlük kaydeder, görünürlüğünü tıklama eğrisiyle puanlar ve seni aşağı çeken teknik sorunları önem sırasına dizer.",
    en: "Zirve records the daily Google position of every keyword you track, scores your visibility against a click-through curve, and ranks the technical issues holding you back by impact.",
  } satisfies Localized,
} as const;

export default site;
